import os
import sys
from bs4 import BeautifulSoup
from common import get_session

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_pkg():
    url = "https://www.metropolisindia.com/health-checkup-packages/truhealth-active-male-tru-diet"
    session = get_session()
    html = session.get(url).text
    soup = BeautifulSoup(html, 'html.parser')
    
    # Check for chips
    chips = soup.find_all(class_='th-chip-body')
    print(f"Found {len(chips)} th-chip-body on package page")
    for c in chips:
        label = c.find(class_='th-chip-label')
        val = c.find(class_='th-chip-val')
        if label and val:
            print(f"CHIP: {label.text.strip()} = {val.text.strip()}")
            
    # Check for brd-label
    brds = soup.find_all(class_='brd-label')
    print(f"\nFound {len(brds)} brd-labels on package page")
    for b in brds:
        val = b.find_next_sibling(class_='brd-value')
        if val:
            print(f"BRD: {b.text.strip()} = {val.text.strip()}")

    # Check for short description
    desc = soup.find('h1').find_next_sibling('p')
    if desc:
        print(f"\nDESC: {desc.text.strip()}")

if __name__ == "__main__":
    check_pkg()
