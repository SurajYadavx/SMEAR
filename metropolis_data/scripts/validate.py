import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scrape_packages import parse_package
from scrape_tests import parse_test
from common import get_session

def validate():
    session = get_session()
    
    # 1. Package
    pkg_url = "https://www.metropolisindia.com/health-checkup-packages/truhealth-active-male-tru-diet"
    print("=== FETCHING PACKAGE ===")
    r = session.get(pkg_url)
    pkg_html = r.text
    pkg_json = parse_package(pkg_html, pkg_url)
    
    print("\nPACKAGE JSON RESULT:")
    print(json.dumps(pkg_json, indent=2))
    
    # 2. Test
    test_url = "https://www.metropolisindia.com/parameter/diabetes-hba1c-or-glycated-haemoglobin-test"
    print("\n=== FETCHING TEST ===")
    r = session.get(test_url)
    test_html = r.text
    test_json = parse_test(test_html, test_url)
    
    print("\nTEST JSON RESULT:")
    print(json.dumps(test_json, indent=2))

if __name__ == "__main__":
    validate()
