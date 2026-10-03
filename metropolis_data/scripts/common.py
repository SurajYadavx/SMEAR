import os
import time
import json
import logging
import requests
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET
from urllib.parse import urlparse, unquote

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_PACKAGES_DIR = os.path.join(BASE_DIR, 'raw', 'packages')
RAW_TESTS_DIR = os.path.join(BASE_DIR, 'raw', 'tests')
RAW_PROFILES_DIR = os.path.join(BASE_DIR, 'raw', 'profiles')
OUTPUT_DIR = os.path.join(BASE_DIR, 'output')
LOGS_DIR = os.path.join(BASE_DIR, 'logs')
INVENTORY_FILE = os.path.join(OUTPUT_DIR, 'inventory.json')

# Create directories
for d in [RAW_PACKAGES_DIR, RAW_TESTS_DIR, RAW_PROFILES_DIR, OUTPUT_DIR, LOGS_DIR]:
    os.makedirs(d, exist_ok=True)

# Logger setup
logging.basicConfig(
    filename=os.path.join(LOGS_DIR, 'extraction.log'),
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
console = logging.StreamHandler()
console.setLevel(logging.INFO)
logging.getLogger('').addHandler(console)

_GLOBAL_SESSION = None

def get_session():
    global _GLOBAL_SESSION
    if _GLOBAL_SESSION:
        return _GLOBAL_SESSION
        
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
    })
    
    # 1. GET Homepage
    logging.info("Initializing Pune Session...")
    try:
        r = session.get("https://www.metropolisindia.com/")
        r.raise_for_status()
        soup = BeautifulSoup(r.text, 'html.parser')
        csrf_meta = soup.find('meta', {'name': 'csrf-token'})
        if not csrf_meta:
            raise Exception("CSRF token not found on homepage.")
        csrf = csrf_meta['content']
        
        # 2. POST to /change-city
        post_data = {'city': 'Pune', '_token': csrf}
        r2 = session.post("https://www.metropolisindia.com/change-city", data=post_data)
        r2.raise_for_status()
        
        # 3. Verify
        data = r2.json()
        if data.get('status') != 'success' or data.get('data', {}).get('id') != 29 or data.get('data', {}).get('organization_name') != 'Pune':
            raise Exception(f"Failed to establish Pune location. Response: {data}")
            
        if 'metropolis-healthcare-session' not in session.cookies:
            raise Exception("Session cookie was not set after POST.")
            
        logging.info("Successfully established Pune location session.")
        _GLOBAL_SESSION = session
        return session
        
    except Exception as e:
        logging.error(f"Critical error establishing Pune session: {e}")
        raise SystemExit(f"CRITICAL: Cannot run extraction without Pune session. Error: {e}")

def fetch_sitemap_urls(sitemap_url, session):
    try:
        logging.info(f"Fetching sitemap: {sitemap_url}")
        response = session.get(sitemap_url, timeout=30)
        response.raise_for_status()
        root = ET.fromstring(response.content)
        # Handle namespaces
        namespace = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = []
        for loc in root.findall('.//sitemap:loc', namespace):
            if loc.text:
                urls.append(unquote(loc.text.strip()))
        return list(set(urls))
    except Exception as e:
        logging.error(f"Error fetching sitemap {sitemap_url}: {e}")
        return []

def load_inventory():
    if os.path.exists(INVENTORY_FILE):
        with open(INVENTORY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {'packages': [], 'tests': [], 'profiles': [], 'processed_packages': [], 'processed_tests': [], 'processed_profiles': []}

def save_inventory(inventory):
    with open(INVENTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(inventory, f, indent=2)

def build_inventory():
    inventory = load_inventory()
    session = get_session()
    
    if not inventory.get('packages'):
        logging.info("Discovering package URLs...")
        inventory['packages'] = fetch_sitemap_urls('https://www.metropolisindia.com/health-checkup-primary.xml', session)
    
    if not inventory.get('tests'):
        logging.info("Discovering test URLs...")
        inventory['tests'] = fetch_sitemap_urls('https://www.metropolisindia.com/parameter-primary.xml', session)
        
    save_inventory(inventory)
    
    print(f"PACKAGE URLS DISCOVERED: {len(inventory['packages'])}")
    if inventory['packages']:
        print("Sample Package URLs:")
        for u in inventory['packages'][:3]:
            print(f" - {u}")
            
    print(f"BLOOD TEST URLS DISCOVERED: {len(inventory['tests'])}")
    if inventory['tests']:
        print("Sample Test URLs:")
        for u in inventory['tests'][:3]:
            print(f" - {u}")

def save_raw_html(slug, content, folder):
    filepath = os.path.join(folder, f"{slug}.html")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def load_raw_html(slug, folder):
    filepath = os.path.join(folder, f"{slug}.html")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    return None

def respectful_delay():
    # robots.txt says Crawl-delay: 10
    time.sleep(10)

if __name__ == '__main__':
    build_inventory()
