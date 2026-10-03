import os
import re
from bs4 import BeautifulSoup
import json
from common import (
    RAW_PROFILES_DIR
)

def parse_profile(html, url):
    soup = BeautifulSoup(html, 'html.parser')
    slug = url.rstrip('/').split('/')[-1]
    
    h1 = soup.find('h1')
    page_title = soup.title.text.strip() if soup.title else None
    profile_name = h1.text.strip() if h1 else page_title

    profile = {
        "profile_name": profile_name,
        "profile_url": url,
        "profile_slug": slug,
        "canonical_url": url,
        "total_parameters": None,
        "parameter_names": [],
        "description": None,
        "preparation": None,
        "report_time": None,
        "specimen": None,
        "faqs": [],
        "images": []
    }
    
    # 1. Specimen in H1
    if h1 and ',' in profile_name:
        parts = profile_name.split(',')
        profile['specimen'] = parts[-1].strip()

    # 2. Chips (Report Time)
    chips = soup.find_all(class_='th-chip-body')
    for c in chips:
        label_elem = c.find(class_='th-chip-label')
        val_elem = c.find(class_='th-chip-val')
        if label_elem and val_elem:
            label = label_elem.text.strip().lower()
            val = val_elem.text.strip()
            if 'report' in label:
                profile['report_time'] = val

    # 3. BRDs (Preparation, Fasting, Purpose/Description)
    brds = soup.find_all(class_='brd-label')
    for b in brds:
        val_elem = b.find_next_sibling(class_='brd-value')
        if val_elem:
            label = b.text.strip().lower()
            val = val_elem.text.strip()
            if 'preparation' in label or 'fasting' in label:
                if not profile['preparation']: profile['preparation'] = val
            elif 'specimen' in label:
                profile['specimen'] = val
            elif 'purpose' in label or 'overview' in label:
                profile['description'] = val

    # 4. Parameters (Look for "8 Parameters" text in the description or chips)
    # The individual parameters are generally not listed on Metropolis profile pages.
    
    # 5. FAQs
    schemas = soup.find_all('script', type='application/ld+json')
    for sc in schemas:
        try:
            data = json.loads(sc.text)
            if isinstance(data, dict): data = [data]
            for item in data:
                if item.get('@type') == 'FAQPage':
                    entities = item.get('mainEntity', [])
                    for q in entities:
                        profile['faqs'].append({
                            "question": q.get('name', '').strip(),
                            "answer": BeautifulSoup(q.get('acceptedAnswer', {}).get('text', ''), 'html.parser').text.strip()
                        })
        except:
            pass
            
    # Images
    imgs = soup.find_all('img')
    for img in imgs:
        src = img.get('src')
        if src and src.startswith('http'):
            profile['images'].append(src)
    profile['images'] = list(set(profile['images']))
    
    return profile
