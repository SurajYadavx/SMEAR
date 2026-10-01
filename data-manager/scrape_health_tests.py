import requests
# pyrefly: ignore [missing-import]
from bs4 import BeautifulSoup
import json
import re
from pathlib import Path

# ============================================================
# CONFIGURATION
# ============================================================

URL = "https://bookmytest.co.in/health-test"

OUTPUT_FILE = Path(__file__).parent / "health_tests.json"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/142.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


# ============================================================
# HELPERS
# ============================================================

def clean_text(text):
    if not text:
        return ""

    text = text.replace("\xa0", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_price(text):
    """
    Extract:
    Rs. 940
    Rs. 5,195
    ₹ 940
    """

    match = re.search(
        r"(?:Rs\.?|₹)\s*[\d,]+(?:\.\d+)?",
        text,
        re.IGNORECASE
    )

    if match:
        return clean_text(match.group(0))

    return ""


def extract_lab(text):
    """
    Extract:
    Lab: Thyrocare
    """

    match = re.search(
        r"Lab\s*:\s*(.*?)(?=\s*(?:\||Rs\.?|₹|$))",
        text,
        re.IGNORECASE
    )

    if match:
        return clean_text(match.group(1))

    return ""


def extract_test_name(text):
    """
    Everything before 'Lab:' is treated as the test name.
    """

    match = re.search(
        r"^(.*?)\s+Lab\s*:",
        text,
        re.IGNORECASE
    )

    if match:
        return clean_text(match.group(1))

    return ""


# ============================================================
# LOAD PAGE
# ============================================================

print("=" * 80)
print("BOOKMYTEST HEALTH TEST SCRAPER")
print("=" * 80)

print("Loading:")
print(URL)

session = requests.Session()

try:
    response = session.get(
        URL,
        headers=HEADERS,
        timeout=30
    )

    print(f"Status: {response.status_code}")

    response.raise_for_status()

except Exception as e:
    print("\nERROR loading page:")
    print(e)
    raise SystemExit(1)


# ============================================================
# PARSE HTML
# ============================================================

soup = BeautifulSoup(response.text, "lxml")

print("\nSearching for individual tests...")


# ============================================================
# FIND TEST ROWS
# ============================================================

tests = []
seen = set()

# The page has a "Book Now" element for every test.
# We use that as the anchor and walk upward to its test container.

book_now_elements = soup.find_all(
    string=re.compile(r"^\s*Book Now\s*$", re.IGNORECASE)
)

print(f"Book Now elements found: {len(book_now_elements)}")


for book_now_text in book_now_elements:

    book_now = book_now_text.parent

    # Walk up the DOM looking for the complete test row
    current = book_now

    for level in range(1, 10):

        if current is None:
            break

        current = current.parent

        if current is None:
            break

        container_text = clean_text(current.get_text(" ", strip=True))

        # Must contain Lab and price
        if not re.search(r"\bLab\s*:", container_text, re.IGNORECASE):
            continue

        price = extract_price(container_text)

        if not price:
            continue

        test_name = extract_test_name(container_text)

        if not test_name:
            continue

        lab = extract_lab(container_text)

        if not lab:
            continue

        # Avoid grabbing a huge page-level container
        # containing multiple tests.
        price_matches = re.findall(
            r"(?:Rs\.?|₹)\s*[\d,]+(?:\.\d+)?",
            container_text,
            re.IGNORECASE
        )

        if len(price_matches) != 1:
            continue

        # Remove unwanted whitespace
        test_name = clean_text(test_name)
        lab = clean_text(lab)
        price = clean_text(price)

        # Unique key
        key = (
            test_name.lower(),
            lab.lower(),
            price.lower()
        )

        if key in seen:
            break

        seen.add(key)

        tests.append({
            "test_name": test_name,
            "lab": lab,
            "price": price
        })

        break


# ============================================================
# SAVE JSON
# ============================================================

print(f"\nUnique tests extracted: {len(tests)}")

# Sort alphabetically by test name
tests.sort(
    key=lambda x: x["test_name"].lower()
)

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        tests,
        f,
        indent=2,
        ensure_ascii=False
    )


# ============================================================
# PREVIEW
# ============================================================

print("\n" + "=" * 80)
print("SCRAPING COMPLETE")
print("=" * 80)

print(f"\nTotal tests extracted: {len(tests)}")

print("\nFirst 10 tests:")

for i, test in enumerate(tests[:10], start=1):

    print(
        f"{i}. {test['test_name']} | "
        f"{test['lab']} | "
        f"{test['price']}"
    )

print("\nJSON saved at:")
print(OUTPUT_FILE)

print("\n" + "=" * 80)