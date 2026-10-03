import os
import json
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, 'output')

def generate():
    try:
        with open(os.path.join(OUTPUT_DIR, 'metropolis_packages.json'), 'r', encoding='utf-8') as f:
            packages = json.load(f)
    except:
        packages = []
        
    try:
        with open(os.path.join(OUTPUT_DIR, 'metropolis_profiles.json'), 'r', encoding='utf-8') as f:
            profiles = json.load(f)
    except:
        profiles = []
        
    try:
        with open(os.path.join(OUTPUT_DIR, 'metropolis_tests.json'), 'r', encoding='utf-8') as f:
            tests = json.load(f)
    except:
        tests = []
        
    with open(os.path.join(OUTPUT_DIR, 'inventory.json'), 'r', encoding='utf-8') as f:
        inventory = json.load(f)
        
    print("==================================================")
    print("FINAL EXTRACTION REPORT")
    print("==================================================")
    
    print(f"1. Total package URLs discovered: {len(inventory.get('packages', []))}")
    print(f"2. Packages successfully extracted: {len([p for p in packages if p.get('availability_status') == 'available'])}")
    print(f"3. Packages unavailable in Pune: {len([p for p in packages if p.get('availability_status') == 'not_available_in_pune'])}")
    
    print(f"4. Total unique profiles discovered: {len(inventory.get('profiles', []))}")
    print(f"5. Profiles successfully extracted: {len([p for p in profiles if p.get('availability_status') == 'available'])}")
    print(f"6. Profiles unavailable in Pune (or 404): {len(inventory.get('profiles', [])) - len([p for p in profiles if p.get('availability_status') == 'available'])}")
    
    print(f"7. Total test URLs discovered: {len(inventory.get('tests', []))}")
    print(f"8. Tests successfully extracted: {len([t for t in tests if t.get('availability_status') == 'available'])}")
    print(f"9. Tests unavailable in Pune (or 404): {len(inventory.get('tests', [])) - len([t for t in tests if t.get('availability_status') == 'available'])}")

    print(f"10. Raw packages cached: {len(os.listdir(os.path.join(BASE_DIR, 'raw', 'packages'))) if os.path.exists(os.path.join(BASE_DIR, 'raw', 'packages')) else 0}")
    print(f"11. Raw profiles cached: {len(os.listdir(os.path.join(BASE_DIR, 'raw', 'profiles'))) if os.path.exists(os.path.join(BASE_DIR, 'raw', 'profiles')) else 0}")
    print(f"12. Raw tests cached: {len(os.listdir(os.path.join(BASE_DIR, 'raw', 'tests'))) if os.path.exists(os.path.join(BASE_DIR, 'raw', 'tests')) else 0}")

if __name__ == "__main__":
    generate()
