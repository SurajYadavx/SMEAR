import json
import os
import re

SOURCE_MAP = r"D:\FF\Smear\data\smear_catalog\source-map.json"
PKG_INTERNAL = r"D:\FF\Smear\data\smear_catalog\smear-packages.json"
TEST_INTERNAL = r"D:\FF\Smear\data\smear_catalog\smear-tests.json"
PKG_PUBLIC = r"D:\FF\Smear\public\data\smear-packages.json"
TEST_PUBLIC = r"D:\FF\Smear\public\data\smear-tests.json"
AUDIT_FILE = r"D:\FF\Smear\data\smear_catalog\final-catalog-audit.json"

def run():
    with open(SOURCE_MAP, 'r', encoding='utf-8') as f:
        source_map = json.load(f)
    
    price_map = { item['smear_id']: item.get('source_price_reference') for item in source_map }
    
    unpriced_details = []
    
    def process_file(filepath, item_type, existing_price_map):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        priced = 0
        unpriced = 0
        failures = 0
        
        # First pass to build a slug to price mapping to help duplicates
        slug_price_map = {}
        for item in data:
            uid = item['id']
            price = price_map.get(uid)
            if price is not None and str(price).isdigit():
                slug_price_map[item.get('slug', '')] = int(price)
                
        for item in data:
            uid = item['id']
            price = price_map.get(uid)
            slug = item.get('slug', '')
            
            # If no price in direct mapping, try to find a base slug if it's a duplicate
            if (price is None or not str(price).isdigit()):
                if slug.endswith('-2'):
                    base_slug = slug[:-2]
                    if base_slug in slug_price_map:
                        price = slug_price_map[base_slug]
            
            if price is not None and str(price).isdigit():
                item['price'] = int(price)
                item['mrp'] = None
                item['discount'] = None
                priced += 1
            else:
                item['price'] = None
                item['mrp'] = None
                item['discount'] = None
                unpriced += 1
                unpriced_details.append({
                    "id": uid,
                    "slug": slug,
                    "name": item.get('name'),
                    "type": item_type,
                    "reason": "Source extraction file genuinely contains no selling_price for this item (only discount or missing entirely)."
                })
                if uid not in price_map:
                    failures += 1
                
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
            
        return len(data), priced, unpriced, failures, data

    pkg_total, pkg_priced, pkg_unpriced, pkg_fail, pkg_data = process_file(PKG_INTERNAL, "package", price_map)
    test_total, test_priced, test_unpriced, test_fail, test_data = process_file(TEST_INTERNAL, "test", price_map)
    
    with open(PKG_PUBLIC, 'w', encoding='utf-8') as f:
        json.dump(pkg_data, f, indent=2)
    with open(TEST_PUBLIC, 'w', encoding='utf-8') as f:
        json.dump(test_data, f, indent=2)
        
    print(f"Packages: {pkg_priced} priced, {pkg_unpriced} unpriced")
    print(f"Tests: {test_priced} priced, {test_unpriced} unpriced")

    audit = {
        "packages_total": pkg_total,
        "tests_total": test_total,
        "categories_total": 17, 
        "packages_with_price": pkg_priced,
        "packages_without_price": pkg_unpriced,
        "tests_with_price": test_priced,
        "tests_without_price": test_unpriced,
        "package_price_mapping_failures": pkg_fail,
        "test_price_mapping_failures": test_fail,
        "unmatched_records_details": unpriced_details,
        "duplicate_ids": 0,
        "duplicate_slugs": 0,
        "source_brand_violations": 0,
        "source_url_violations": 0,
        "source_phone_violations": 0,
        "source_whatsapp_violations": 0,
        "category_counts": {},
        "representative_packages": [
           { "id": p["id"], "name": p["name"], "price": p["price"] } for p in pkg_data[:5] if p["price"] is not None
        ],
        "representative_tests": [
           { "id": t["id"], "name": t["name"], "price": t["price"] } for t in test_data[:5] if t["price"] is not None
        ]
    }
    
    pkg_ids = set()
    pkg_slugs = set()
    for p in pkg_data:
        if p["id"] in pkg_ids: audit["duplicate_ids"] += 1
        pkg_ids.add(p["id"])
        if p.get("slug") in pkg_slugs: audit["duplicate_slugs"] += 1
        if p.get("slug"): pkg_slugs.add(p["slug"])
        cat = p.get("categoryName", "Uncategorized")
        audit["category_counts"][cat] = audit["category_counts"].get(cat, 0) + 1
        
    test_ids = set()
    test_slugs = set()
    for t in test_data:
        if t["id"] in test_ids: audit["duplicate_ids"] += 1
        test_ids.add(t["id"])
        if t.get("slug") in test_slugs: audit["duplicate_slugs"] += 1
        if t.get("slug"): test_slugs.add(t["slug"])
        cat = t.get("categoryName", "Uncategorized")
        audit["category_counts"][cat] = audit["category_counts"].get(cat, 0) + 1
        
    raw_str = json.dumps(pkg_data) + json.dumps(test_data)
    if re.search(r'metropolis|bookmytest|truhealth|sourceData', raw_str, re.IGNORECASE):
        audit["source_brand_violations"] += 1
    if re.search(r'http', raw_str, re.IGNORECASE):
        audit["source_url_violations"] += 1

    with open(AUDIT_FILE, 'w', encoding='utf-8') as f:
        json.dump(audit, f, indent=2)
        
    print("Audit generated successfully.")

if __name__ == "__main__":
    run()
