import os
import re
from bs4 import BeautifulSoup
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def investigate():
    path = r"C:\Users\offls\.gemini\antigravity-ide\brain\03dd7455-71df-4a82-823d-4a09edfcdfe2\scratch\package.html"
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')
    
    scripts = soup.find_all('script')
    print(f"Total scripts: {len(scripts)}")
    
    for i, s in enumerate(scripts):
        if not s.string:
            if s.get('src'):
                # print external scripts
                src = s.get('src')
                if 'metropolis' in src.lower() or 'app' in src.lower() or 'custom' in src.lower():
                    print(f"External script: {src}")
            continue
            
        text = s.string
        
        if 'select_city' in text:
            print(f"\n--- JS matching 'select_city' in Script {i} ---")
            lines = [l for l in text.split('\n') if 'select_city' in l or 'ajax' in l or 'url:' in l or 'cookie' in l]
            print("\n".join(lines[:15]))
            
        if 'api' in text.lower():
            matches = re.findall(r'/api/[^\s\'"]+', text)
            if matches:
                print(f"\n--- Found API endpoints in Script {i} ---")
                print(list(set(matches)))

        if 'cookie' in text.lower():
            matches = re.findall(r'document\.cookie[^;]+;', text)
            if matches:
                print(f"\n--- Found cookie setting in Script {i} ---")
                print(list(set(matches))[:3])

if __name__ == "__main__":
    investigate()
