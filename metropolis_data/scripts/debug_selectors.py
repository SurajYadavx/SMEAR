import os
import re
from bs4 import BeautifulSoup
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def debug_package():
    print("=== DEBUG PACKAGE ===")
    path = r"C:\Users\offls\.gemini\antigravity-ide\brain\03dd7455-71df-4a82-823d-4a09edfcdfe2\scratch\package.html"
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')
    
    # Overview icons
    icons = soup.find_all('i', class_=re.compile(r'fa-'))
    for i, icon in enumerate(icons[:15]):
        text = icon.parent.text.strip().replace('\n', ' ')
        text = re.sub(r'\s+', ' ', text)
        print(f"Icon {i} text: {text}")
        
    # Parameter counts
    param_text = soup.find(string=re.compile(r'Parameters included', re.I))
    if param_text:
        print(f"Param text: {param_text.parent.parent.text.strip().replace(chr(10), ' ')}")

    # Profiles
    headers = soup.find_all(class_=re.compile(r'profile|category', re.I))
    for h in headers[:10]:
        print(f"Header: {h.name} class={h.get('class')} text={h.text.strip()}")
        
    accordions = soup.find_all('div', class_='accordion-item')
    print(f"Found {len(accordions)} accordions")
    for acc in accordions[:2]:
        btn = acc.find('button')
        if btn: print(f"Accordion header: {btn.text.strip()}")
        lis = acc.find_all('li')
        print(f"Accordion contains {len(lis)} lis")
        if lis: print(f" - {lis[0].text.strip()}")

def debug_test():
    print("\n=== DEBUG TEST ===")
    path = r"C:\Users\offls\.gemini\antigravity-ide\brain\03dd7455-71df-4a82-823d-4a09edfcdfe2\scratch\test.html"
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')
    
    info_elems = soup.find_all('h6')
    for h in info_elems[:10]:
        print(f"h6: {h.text.strip()} -> Next sibling: {h.find_next_sibling().text.strip() if h.find_next_sibling() else 'None'}")
        
    divs = soup.find_all('div', class_=re.compile(r'col-md-3|info', re.I))
    for d in divs[:10]:
        print(f"div {d.get('class')}: {d.text.strip().replace(chr(10), ' ')}")

if __name__ == "__main__":
    debug_package()
    debug_test()
