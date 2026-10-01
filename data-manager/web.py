import time
import json
import requests
# pyrefly: ignore [missing-import]
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_CATEGORY_URL = "https://bookmytest.co.in/category/full-body-checkup"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def get_package_details(package_url):
    """Fetches details from individual package page."""
    try:
        res = requests.get(package_url, headers=HEADERS, timeout=10)
        if res.status_code != 200:
            return "Failed to load detail page"
        
        soup = BeautifulSoup(res.content, "html.parser")
        
        # Adjust selector based on actual main text container on the detail page
        main_content = soup.find("main") or soup.find("div", class_="container") or soup.body
        return main_content.get_text(separator="\n", strip=True) if main_content else ""
    except Exception as e:
        return f"Error fetching details: {str(e)}"

def scrape_bookmytest_packages():
    response = requests.get(BASE_CATEGORY_URL, headers=HEADERS)
    if response.status_code != 200:
        print("Failed to access category page.")
        return

    soup = BeautifulSoup(response.content, "html.parser")
    
    # Locate all package cards (adjust selector if class name differs)
    # Generic fallback: look for links or card containers containing package URLs
    cards = soup.find_all("div", class_="product-card") or soup.find_all("div", class_="package-card")
    
    # Alternative: find all links under category that go to package details
    package_links = soup.select('a[href*="/health-checkup-packages/"]')
    
    results = []
    seen_urls = set()

    for link in package_links:
        pkg_url = urljoin(BASE_CATEGORY_URL, link.get("href"))
        if pkg_url in seen_urls:
            continue
        seen_urls.add(pkg_url)

        # Get parent container for summary preview content
        card_container = link.find_parent("div")
        preview_text = card_container.get_text(separator=" ", strip=True) if card_container else ""
        
        print(f"Extracting details for: {pkg_url} ...")
        detailed_text = get_package_details(pkg_url)
        
        results.append({
            "url": pkg_url,
            "preview_content": preview_text,
            "detailed_content": detailed_text
        })
        time.sleep(1)  # Polite crawl delay

    # Save output to JSON file
    with open("bookmytest_packages.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4, ensure_ascii=False)

    print(f"\nSuccessfully extracted {len(results)} packages into 'bookmytest_packages.json'.")

if __name__ == "__main__":
    scrape_bookmytest_packages()