import os
import sys
from bs4 import BeautifulSoup
from common import get_session

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_profile():
    url = "https://www.metropolisindia.com/parameter/lipid-profile-mini"
    session = get_session()
    html = session.get(url).text
    soup = BeautifulSoup(html, 'html.parser')
    
    param_header = soup.find(string=lambda t: t and 'Parameters included' in t)
    if param_header:
        print(f"Header: {param_header}")
        parent = param_header.parent
        for _ in range(3): parent = parent.parent
        print(f"Context:\n{parent.prettify()[:1000]}")
    else:
        # Check accordion
        accordions = soup.find_all(class_='accordion-item')
        for acc in accordions:
            btn = acc.find('button')
            if btn: print(f"Accordion: {btn.text.strip()}")
            lis = acc.find_all('li')
            if lis: print(f" - Contains {len(lis)} lis. First: {lis[0].text.strip()}")

if __name__ == "__main__":
    check_profile()
