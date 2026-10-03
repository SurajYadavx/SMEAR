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
    
    # Let's look for how parameters are listed
    # Usually in a table, or accordions, or list
    print("Finding tests/parameters in profile page:")
    
    # 1. Search for "parameters included" or "tests"
    params = soup.find_all(class_=lambda c: c and 'parameter' in c.lower())
    print(f"Found {len(params)} elements with class parameter")
    for p in params[:5]:
        print(p.text.strip()[:100])
        
    # 2. Look for links to other tests
    links = soup.find_all('a', href=lambda h: h and '/parameter/' in h)
    test_links = [l.text.strip() for l in links if l.text.strip()]
    print(f"Found {len(test_links)} links to other parameters")
    print(list(set(test_links))[:10])
    
    # 3. Print brds
    brds = soup.find_all(class_='brd-label')
    for b in brds:
        print(f"BRD: {b.text.strip()}")

if __name__ == "__main__":
    check_profile()
