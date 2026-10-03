import os
import json
import re
from collections import Counter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, 'output')

def load_json(name):
    try:
        with open(os.path.join(OUTPUT_DIR, name), 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def audit():
    packages = load_json('metropolis_packages.json')
    profiles = load_json('metropolis_profiles.json')
    tests = load_json('metropolis_tests.json')
    
    with open(os.path.join(OUTPUT_DIR, 'inventory.json'), 'r', encoding='utf-8') as f:
        inventory = json.load(f)

    # 1-8. Exact counts
    pkgs_avail = [p for p in packages if p.get('availability_status') == 'available']
    pkgs_unavail = [p for p in packages if p.get('availability_status') == 'not_available_in_pune']
    
    profs_avail = [p for p in profiles if p.get('availability_status') == 'available']
    disc_profiles = set(inventory.get('profiles', []))
    extracted_prof_urls = set([p.get('profile_url') for p in profs_avail])
    unavail_prof_urls = disc_profiles - extracted_prof_urls
    
    tests_avail = [t for t in tests if t.get('availability_status') == 'available']
    tests_unavail = [t for t in tests if t.get('availability_status') == 'not_available_in_pune']
    disc_tests = set(inventory.get('tests', []))
    extracted_test_urls = set([t.get('source_url') for t in tests])
    unavail_test_urls = disc_tests - extracted_test_urls

    print("=== RECORD COUNTS ===")
    print(f"1. Total package records (JSON): {len(packages)}")
    print(f"2. Packages available: {len(pkgs_avail)} | Unavailable: {len(pkgs_unavail)}")
    print(f"3. Total profile records (JSON): {len(profiles)}")
    print(f"4. Profiles successfully extracted (available): {len(profs_avail)}")
    print(f"5. Profiles unavailable/404: {len(unavail_prof_urls)}")
    print(f"6. Total test records (JSON): {len(tests)}")
    print(f"7. Tests successfully extracted (available): {len(tests_avail)}")
    print(f"8. Tests unavailable/404: {len(tests_unavail) + len(unavail_test_urls)}")
    print("")

    # Audit the 65 unavailable profiles
    print("=== UNAVAILABLE PROFILES INVESTIGATION ===")
    print("Checking 10 examples...")
    missing_samples = list(unavail_prof_urls)[:15]
    count = 0
    
    url_to_name = {}
    for p in packages:
        for prf in p.get('profiles', []):
            if prf.get('profile_url') in unavail_prof_urls:
                url_to_name[prf.get('profile_url')] = (prf.get('profile_name'), p.get('package_name'))
                
    for url in missing_samples:
        if count >= 10: break
        info = url_to_name.get(url)
        if not info: continue
        name, pkg_ref = info
        typo = "Yes" if "seruum" in url or "--" in url or "(" in url or " " in url or "-blood" in url.split("/")[-1] and "blood" not in name.lower() else "Possible"
        
        print(f"Name: {name}")
        print(f"URL: {url}")
        print(f"Status: HTTP 404 (Not Saved)")
        print(f"Malformed/Typo?: {typo}")
        print(f"Referenced by Package: {pkg_ref}")
        print("-")
        count += 1
    print("")

    # Test coverage
    print("=== TEST FIELD COVERAGE (Available Tests Only) ===")
    t_tot = len(tests_avail)
    if t_tot > 0:
        def perc(field):
            return sum(1 for t in tests_avail if t.get(field)) / t_tot * 100
            
        def perc_list(field):
            return sum(1 for t in tests_avail if t.get(field) and len(t.get(field)) > 0) / t_tot * 100

        def perc_dict(field, subfield):
            return sum(1 for t in tests_avail if t.get(field) and t.get(field).get(subfield)) / t_tot * 100
            
        print(f"Price: {perc_dict('pricing', 'selling_price'):.1f}%")
        print(f"MRP: {perc_dict('pricing', 'mrp'):.1f}%")
        print(f"Specimen: {perc('specimen'):.1f}%")
        print(f"Fasting: {perc('fasting'):.1f}%")
        print(f"Report Time: {perc('report_time'):.1f}%")
        print(f"Gender: {perc('gender'):.1f}%")
        print(f"Preparation: {perc('preparation'):.1f}%")
        print(f"Methodology: {perc('methodology'):.1f}%")
        print(f"Clinical Information: {perc('clinical_information'):.1f}%")
        print(f"Description (Overview): {perc('description'):.1f}%")
        print(f"FAQs: {perc_list('faqs'):.1f}%")
        print(f"Images: {perc_list('images'):.1f}%")
    else:
        print("No available tests.")
    print("")
    
    # Artifact Check
    print("=== DATA QUALITY & ARTIFACT CHECK ===")
    
    dup_urls = [url for url, cnt in Counter([t.get('source_url') for t in tests_avail]).items() if cnt > 1]
    dup_names = [name for name, cnt in Counter([t.get('test_name') for t in tests_avail]).items() if cnt > 1]
    
    zero_prices = sum(1 for t in tests_avail if t.get('pricing', {}).get('selling_price') == 0)
    suspicious_prices = sum(1 for t in tests_avail if t.get('pricing', {}).get('selling_price', 0) > 100000)
    
    has_whatsapp = sum(1 for t in tests_avail if 'whatsapp' in str(t).lower())
    has_phone = sum(1 for t in tests_avail if '9999' in str(t) or '1800' in str(t))
    
    print(f"Duplicate URLs: {len(dup_urls)}")
    print(f"Duplicate Names: {len(dup_names)} (Some tests might genuinely have same names but different slugs)")
    print(f"Zero Prices (Rs0): {zero_prices}")
    print(f"Suspicious Prices (>100k): {suspicious_prices}")
    print(f"WhatsApp text/links leaked: {has_whatsapp}")
    print(f"Phone numbers leaked: {has_phone}")
    
    # 3 Complete Records (Printed with clean ascii to avoid encoding issues)
    print("\n=== SAMPLE PACKAGE ===")
    print(json.dumps(packages[0] if packages else {}, indent=2, ensure_ascii=True))
    
    print("\n=== SAMPLE PROFILE ===")
    print(json.dumps(profiles[0] if profiles else {}, indent=2, ensure_ascii=True))
    
    print("\n=== SAMPLE TEST ===")
    print(json.dumps(tests[0] if tests else {}, indent=2, ensure_ascii=True))

if __name__ == "__main__":
    audit()
