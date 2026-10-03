import os
import sys
from bs4 import BeautifulSoup
from common import get_session

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_test():
    url = "https://www.metropolisindia.com/parameter/diabetes-hba1c-or-glycated-haemoglobin-test"
    session = get_session()
    html = session.get(url).text
    soup = BeautifulSoup(html, 'html.parser')
    
    # Find all divs containing 'Fasting'
    elems = soup.find_all(string=lambda t: t and 'Fasting' in t)
    for e in elems:
        print(f"Parent tag: {e.parent.name}, classes: {e.parent.get('class')}")
        print(f"Grandparent tag: {e.parent.parent.name}, classes: {e.parent.parent.get('class')}")
        print(f"HTML chunk:\n{e.parent.parent.prettify()[:200]}")

if __name__ == "__main__":
    check_test()
