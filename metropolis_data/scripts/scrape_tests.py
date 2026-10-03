import os
import json
import logging
import re
from bs4 import BeautifulSoup
from common import (
    get_session, load_inventory, save_inventory, save_raw_html, 
    load_raw_html, respectful_delay, RAW_TESTS_DIR, OUTPUT_DIR
)

def parse_test(html, url):
    soup = BeautifulSoup(html, 'html.parser')
    slug = url.rstrip('/').split('/')[-1]
    
    h1 = soup.find('h1')
    page_title = soup.title.text.strip() if soup.title else None
    test_name = h1.text.strip() if h1 else page_title

    test = {
        "id": f"metro-test-{slug}",
        "test_name": test_name,
        "slug": slug,
        "source_url": url,
        "canonical_url": url,
        "page_title": page_title,
        "pricing": {},
        "specimen": None,
        "fasting": None,
        "report_time": None,
        "gender": None,
        "preparation": None,
        "methodology": None,
        "clinical_information": None,
        "faqs": [],
        "images": []
    }
    
    # 1. Look for Specimen in the H1 (e.g. "..., EDTA Blood")
    if h1 and ',' in test_name:
        parts = test_name.split(',')
        test['specimen'] = parts[-1].strip()
        
    # 2. Chips data (Fasting, Report Time, Gender)
    chips = soup.find_all(class_='th-chip-body')
    for c in chips:
        label_elem = c.find(class_='th-chip-label')
        val_elem = c.find(class_='th-chip-val')
        if label_elem and val_elem:
            label = label_elem.text.strip().lower()
            val = val_elem.text.strip()
            if 'fasting' in label:
                test['fasting'] = val
            elif 'report' in label:
                test['report_time'] = val
            elif 'recommended' in label:
                test['gender'] = val

    # 3. Preparation / Methodology (brd-label)
    brds = soup.find_all(class_='brd-label')
    for b in brds:
        val_elem = b.find_next_sibling(class_='brd-value')
        if val_elem:
            label = b.text.strip().lower()
            val = val_elem.text.strip()
            if 'preparation' in label or 'fasting' in label:
                if not test['preparation']: test['preparation'] = val
            elif 'method' in label:
                test['methodology'] = val
            elif 'specimen' in label:
                test['specimen'] = val
            elif 'clinical' in label or 'overview' in label:
                test['clinical_information'] = val

    # 4. Pricing
    def clean_price(text):
        if not text: return None
        cleaned = re.sub(r'[^\d.]', '', text.strip().split('\n')[0])
        try: return float(cleaned) if '.' in cleaned else int(cleaned)
        except: return None

    selling_elem = soup.find('div', class_=lambda c: c and 'th-amount' in c.split())
    if selling_elem:
        test['pricing']['selling_price'] = clean_price(selling_elem.text)
        
    mrp_elem = soup.find('span', class_=lambda c: c and 'th-original-price' in c.split())
    if mrp_elem:
        test['pricing']['mrp'] = clean_price(mrp_elem.text)
        
    # 5. FAQs from Schema
    schemas = soup.find_all('script', type='application/ld+json')
    for sc in schemas:
        try:
            data = json.loads(sc.text)
            if isinstance(data, dict):
                data = [data]
            for item in data:
                if item.get('@type') == 'FAQPage':
                    entities = item.get('mainEntity', [])
                    for q in entities:
                        test['faqs'].append({
                            "question": q.get('name', '').strip(),
                            "answer": BeautifulSoup(q.get('acceptedAnswer', {}).get('text', ''), 'html.parser').text.strip()
                        })
        except:
            pass

    return test
