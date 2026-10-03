import os
import sys
from bs4 import BeautifulSoup
from common import get_session

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def poc_pune():
    session = get_session()
    r = session.get("https://www.metropolisindia.com/")
    soup = BeautifulSoup(r.text, 'html.parser')
    csrf = soup.find('meta', {'name': 'csrf-token'})['content']
    
    post_data = {'city': 'Pune', '_token': csrf}
    r2 = session.post("https://www.metropolisindia.com/change-city", data=post_data)
    
    r3 = session.get("https://www.metropolisindia.com/parameter/diabetes-hba1c-or-glycated-haemoglobin-test")
    soup3 = BeautifulSoup(r3.text, 'html.parser')
    price_elem = soup3.find(class_=lambda c: c and 'th-amount' in c.split())
    price = price_elem.text.strip().split('\n')[0] if price_elem else "None"
    print(f"Test Price in Pune: {price}")
    
    # Let's check the price via API if there is one. We saw /labs/get-city-by-state, maybe there's a price API?

if __name__ == "__main__":
    poc_pune()
