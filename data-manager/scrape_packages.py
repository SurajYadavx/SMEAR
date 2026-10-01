import json
import time
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup


# ============================================================
# ONLY CHANGE THESE 2 VALUES FOR A NEW CATEGORY
# ============================================================

CATEGORY_URL = "https://bookmytest.co.in/category/vitamin-profile-packages"

OUTPUT_FILE = "VITAMIN PROFILE PACKAGES.json"


# ============================================================
# SETTINGS
# ============================================================

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,"
        "application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

TIMEOUT = 30
DELAY = 1


# ============================================================
# SESSION
# ============================================================

session = requests.Session()
session.headers.update(HEADERS)


# ============================================================
# TEXT CLEANER
# ============================================================

def clean_text(text):
    if not text:
        return ""

    text = text.replace("\xa0", " ")

    lines = []

    for line in text.splitlines():

        line = re.sub(r"[ \t]+", " ", line)
        line = line.strip()

        if line:
            lines.append(line)

    return "\n".join(lines)


# ============================================================
# NORMALIZE URL
# ============================================================

def normalize_url(url):
    """
    Converts relative URL into exact absolute URL.

    Example:

    /health-checkup-packages/vitamin-d-profile

    becomes:

    https://bookmytest.co.in/health-checkup-packages/vitamin-d-profile
    """

    if not url:
        return None

    url = url.strip()

    full_url = urljoin(CATEGORY_URL, url)

    parsed = urlparse(full_url)

    # Keep only scheme + domain + path.
    # This removes #fragments and unwanted query parameters.
    exact_url = (
        f"{parsed.scheme}://"
        f"{parsed.netloc}"
        f"{parsed.path}"
    )

    return exact_url.rstrip("/")


# ============================================================
# GET PAGE
# ============================================================

def get_page(url):

    try:

        response = session.get(
            url,
            timeout=TIMEOUT
        )

        response.raise_for_status()

        return (
            BeautifulSoup(
                response.text,
                "lxml"
            ),
            response
        )

    except Exception as e:

        print()
        print("ERROR:")
        print(url)
        print(str(e))

        return None, None


# ============================================================
# CHECK PACKAGE URL
# ============================================================

def is_package_url(url):

    if not url:
        return False

    parsed = urlparse(url)

    if parsed.netloc not in [
        "bookmytest.co.in",
        "www.bookmytest.co.in"
    ]:
        return False

    return "/health-checkup-packages/" in parsed.path


# ============================================================
# FIND THE ACTUAL PRODUCT CARDS
# ============================================================

def find_product_cards(soup):

    """
    IMPORTANT:

    We do NOT search the entire page for every
    /health-checkup-packages/ link.

    That was causing unrelated footer/navigation
    packages to be collected.

    The actual product titles on the category page
    are inside:

        h6 -> a[href="/health-checkup-packages/..."]

    So we specifically locate those.
    """

    cards = []

    seen_urls = set()

    # --------------------------------------------------------
    # Find package title links inside H6
    # --------------------------------------------------------

    title_links = soup.select(
        'h6 a[href*="/health-checkup-packages/"]'
    )

    print()
    print(
        "Package title links found:",
        len(title_links)
    )

    for title_link in title_links:

        href = title_link.get("href")

        package_url = normalize_url(href)

        if not is_package_url(package_url):
            continue

        if package_url in seen_urls:
            continue

        seen_urls.add(package_url)

        # ----------------------------------------------------
        # Package name
        # ----------------------------------------------------

        package_name = clean_text(
            title_link.get_text(
                separator=" ",
                strip=True
            )
        )

        # ----------------------------------------------------
        # Find the complete card container.
        #
        # We go upward until we find a container containing
        # package-specific information such as:
        #
        # Tests
        # Booked This Week
        # Thyrocare
        # Home Sample Pickup
        # ----------------------------------------------------

        card = find_card_container(title_link)

        # ----------------------------------------------------
        # Extract complete preview/card text
        # ----------------------------------------------------

        preview_content = ""

        if card:

            preview_content = clean_text(
                card.get_text(
                    separator="\n",
                    strip=True
                )
            )

        # ----------------------------------------------------
        # Extract package image
        # ----------------------------------------------------

        image_url = None

        if card:

            image = card.find("img")

            if image:

                image_src = (
                    image.get("src")
                    or image.get("data-src")
                    or image.get("data-lazy-src")
                )

                if image_src:
                    image_url = urljoin(
                        CATEGORY_URL,
                        image_src
                    )

        cards.append({
            "package_name": package_name,
            "package_url": package_url,
            "preview_content": preview_content,
            "preview_image_url": image_url
        })

    return cards


# ============================================================
# FIND CARD CONTAINER
# ============================================================

def find_card_container(title_link):

    current = title_link

    # Go upward through DOM
    for level in range(1, 9):

        current = current.parent

        if current is None:
            break

        if not getattr(current, "get_text", None):
            continue

        text = clean_text(
            current.get_text(
                separator="\n",
                strip=True
            )
        )

        lower_text = text.lower()

        # ----------------------------------------------------
        # These are strong indicators that this is the actual
        # product card.
        # ----------------------------------------------------

        indicators = [
            "booked this week",
            "tests)",
            "processed at thyrocare",
            "unique barcode tracking",
            "free home sample pickup"
        ]

        matches = sum(
            1
            for indicator in indicators
            if indicator in lower_text
        )

        if matches >= 2:

            return current

    return None


# ============================================================
# EXTRACT DETAIL PAGE
# ============================================================

def extract_detail_page(package_url):

    soup, response = get_page(package_url)

    if soup is None:

        return {
            "status": "failed",
            "page_title": "",
            "detailed_content": ""
        }

    # --------------------------------------------------------
    # Page title
    # --------------------------------------------------------

    page_title = ""

    if soup.title:

        page_title = clean_text(
            soup.title.get_text(
                separator=" ",
                strip=True
            )
        )

    # --------------------------------------------------------
    # Make a copy so that we can remove scripts/styles
    # without worrying about irrelevant HTML.
    # --------------------------------------------------------

    for tag in soup.find_all([
        "script",
        "style",
        "noscript",
        "svg"
    ]):

        tag.decompose()

    # --------------------------------------------------------
    # Extract ALL visible text.
    #
    # We intentionally don't use only <main> or a particular
    # class because your requirement is to preserve everything.
    # --------------------------------------------------------

    detailed_content = clean_text(
        soup.get_text(
            separator="\n",
            strip=True
        )
    )

    return {
        "status": "success",
        "page_title": page_title,
        "detailed_content": detailed_content
    }


# ============================================================
# MAIN
# ============================================================

def scrape_category():

    print()
    print("=" * 80)
    print("BOOKMYTEST CATEGORY SCRAPER")
    print("=" * 80)

    print()
    print("CATEGORY:")
    print(CATEGORY_URL)

    print()
    print("OUTPUT:")
    print(OUTPUT_FILE)

    # --------------------------------------------------------
    # Output location
    # --------------------------------------------------------

    script_directory = Path(__file__).resolve().parent

    output_path = script_directory / OUTPUT_FILE

    # --------------------------------------------------------
    # Load category page
    # --------------------------------------------------------

    print()
    print("Loading category page...")

    category_soup, response = get_page(
        CATEGORY_URL
    )

    if category_soup is None:

        print()
        print("FAILED TO LOAD CATEGORY PAGE.")

        return

    print("Category page loaded.")

    # --------------------------------------------------------
    # Find ONLY actual product cards
    # --------------------------------------------------------

    print()
    print("Finding actual package cards...")

    products = find_product_cards(
        category_soup
    )

    # --------------------------------------------------------
    # IMPORTANT DEBUG OUTPUT
    # --------------------------------------------------------

    print()
    print("=" * 80)
    print("PACKAGES FOUND")
    print("=" * 80)

    for index, product in enumerate(
        products,
        start=1
    ):

        print()
        print(
            f"{index}. {product['package_name']}"
        )

        print(
            product["package_url"]
        )

    print()
    print("=" * 80)

    if not products:

        print("NO PACKAGE CARDS FOUND.")
        return

    # --------------------------------------------------------
    # Final data
    # --------------------------------------------------------

    results = []

    total = len(products)

    # --------------------------------------------------------
    # Visit every package
    # --------------------------------------------------------

    for index, product in enumerate(
        products,
        start=1
    ):

        package_name = product["package_name"]
        package_url = product["package_url"]

        print()
        print(
            f"[{index}/{total}] "
            f"{package_name}"
        )

        print(
            "URL:",
            package_url
        )

        # ----------------------------------------------------
        # Get complete package detail page
        # ----------------------------------------------------

        detail = extract_detail_page(
            package_url
        )

        # ----------------------------------------------------
        # Combine category-page data and detail-page data
        # ----------------------------------------------------

        package_data = {

            "package_name": package_name,

            "package_url": package_url,

            "preview_content": product[
                "preview_content"
            ],

            "preview_image_url": product[
                "preview_image_url"
            ],

            "detail_page_title": detail[
                "page_title"
            ],

            "detailed_content": detail[
                "detailed_content"
            ],

            "status": detail[
                "status"
            ]
        }

        results.append(
            package_data
        )

        # ----------------------------------------------------
        # SAVE AFTER EVERY PACKAGE
        # ----------------------------------------------------

        with open(
            output_path,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                results,
                file,
                ensure_ascii=False,
                indent=4
            )

        print(
            "Saved."
        )

        # ----------------------------------------------------
        # Polite delay
        # ----------------------------------------------------

        if index < total:

            time.sleep(
                DELAY
            )

    # --------------------------------------------------------
    # FINAL SUMMARY
    # --------------------------------------------------------

    successful = sum(
        1
        for item in results
        if item["status"] == "success"
    )

    failed = sum(
        1
        for item in results
        if item["status"] == "failed"
    )

    print()
    print("=" * 80)
    print("SCRAPING FINISHED")
    print("=" * 80)

    print()
    print("Category URL:")
    print(CATEGORY_URL)

    print()
    print("Packages found:")
    print(total)

    print()
    print("Successfully scraped:")
    print(successful)

    print()
    print("Failed:")
    print(failed)

    print()
    print("JSON FILE:")
    print(output_path)

    print()
    print("=" * 80)


# ============================================================
# START
# ============================================================

if __name__ == "__main__":
    scrape_category()