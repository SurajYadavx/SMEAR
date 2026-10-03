import os
import json
import logging
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from common import (
    get_session, load_inventory, save_inventory, save_raw_html, 
    load_raw_html, respectful_delay, RAW_PACKAGES_DIR, OUTPUT_DIR
)

def parse_package(html, url):
    soup = BeautifulSoup(html, 'html.parser')
    slug = url.rstrip('/').split('/')[-1]
    
    # 1. Identity
    h1 = soup.find('h1')
    page_title = soup.title.text.strip() if soup.title else None
    package_name = h1.text.strip() if h1 else page_title
    
    # 2. Short description
    short_desc = None
    if h1:
        nxt = h1.find_next_sibling('p')
        if nxt:
            short_desc = nxt.text.strip()

    package = {
        "id": f"metro-pkg-{slug}",
        "package_name": package_name,
        "slug": slug,
        "source_url": url,
        "canonical_url": url,
        "page_title": page_title,
        "short_description": short_desc,
        "pricing": {},
        "fasting": None,
        "report_time": None,
        "gender": None,
        "sample_type": None,
        "total_parameters": None,
        "total_profiles": None,
        "profiles": [],
        "images": [],
        "faqs": []
    }

    # 3. Pricing
    def clean_price(text):
        if not text: return None
        cleaned = re.sub(r'[^\d.]', '', text.strip().split('\n')[0])
        try: return float(cleaned) if '.' in cleaned else int(cleaned)
        except: return None

    selling_elem = soup.find('div', class_=lambda c: c and 'th-amount' in c.split())
    if selling_elem:
        package['pricing']['selling_price'] = clean_price(selling_elem.text)
        
    mrp_elem = soup.find('span', class_=lambda c: c and 'th-original-price' in c.split())
    if mrp_elem:
        package['pricing']['mrp'] = clean_price(mrp_elem.text)
        
    # Check for discount text
    discount_elem = soup.find(string=re.compile(r'% off', re.I))
    if discount_elem:
        m = re.search(r'(\d+)%\s*off', discount_elem, re.I)
        if m: package['pricing']['discount_percentage'] = int(m.group(1))

    # 4. Chips data (Fasting, Report Time, Gender)
    chips = soup.find_all(class_='th-chip-body')
    for c in chips:
        label_elem = c.find(class_='th-chip-label')
        val_elem = c.find(class_='th-chip-val')
        if label_elem and val_elem:
            label = label_elem.text.strip().lower()
            val = val_elem.text.strip()
            if 'fasting' in label:
                package['fasting'] = val
            elif 'report' in label:
                package['report_time'] = val
            elif 'recommended' in label:
                package['gender'] = val

    # 5. Parameter Counts
    param_text = soup.find(string=re.compile(r'Parameters included', re.I))
    if param_text:
        pt = param_text.parent.parent.text if param_text.parent and param_text.parent.parent else param_text
        m1 = re.search(r'(\d+)\s*Parameters', pt, re.I)
        if m1: package['total_parameters'] = int(m1.group(1))
        m2 = re.search(r'(\d+)\s*Profile', pt, re.I)
        if m2: package['total_profiles'] = int(m2.group(1))

    # 6. Profiles
    # Find all <a class="pathology-link"> that point to /parameter/
    # Or specifically within the accordion that has profiles.
    # Actually, we found them in prf-test-name.
    # The structure is: <a href="..."><span class="prf-test-name">...
    seen_profiles = set()
    prf_names = soup.find_all(class_='prf-test-name')
    for pn in prf_names:
        name = pn.text.strip()
        
        # Get URL
        a_tag = pn.find_parent('a') or pn.find('a')
        if not a_tag:
            # Check siblings or deeper parents
            parent = pn.parent
            for _ in range(3):
                if parent and parent.name == 'a':
                    a_tag = parent
                    break
                if parent:
                    parent = parent.parent
        
        prof_url = None
        if a_tag and a_tag.get('href') and a_tag.get('href') != '#':
            prof_url = urljoin("https://www.metropolisindia.com/", a_tag['href'])
            
        # Fallback if no explicit anchor URL: we know it should be /parameter/{slug}
        if not prof_url:
            prof_url = f"https://www.metropolisindia.com/parameter/{name.lower().replace(' ', '-').replace(',', '')}"
        # Get count
        count_elem = pn.find_next(class_='prf-test-param')
        count = None
        if count_elem:
            m = re.search(r'\d+', count_elem.text)
            if m: count = int(m.group(0))
            
        if name and name not in seen_profiles:
            package['profiles'].append({
                "profile_name": name,
                "profile_url": prof_url,
                "parameter_count": count,
                "parameters": [] # To be filled by profile scraper
            })
            seen_profiles.add(name)

    # Images
    imgs = soup.find_all('img')
    for img in imgs:
        src = img.get('src')
        if src and src.startswith('http'):
            package['images'].append(src)
    package['images'] = list(set(package['images']))

    return package
