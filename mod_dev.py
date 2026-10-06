import glob
import re

for f in glob.glob('*.html'):
    if 'metropolis' in f or 'scratch' in f: continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We look for: <a [any space/newlines] href="https://www.instagram.com/srjj.png/?hl=en" ... >Suraj Yadav</a>
    pattern = re.compile(r'(<a[^>]*href="https://www.instagram.com/srjj.png/\?hl=en"[^>]*>)\s*(?:<span class="developer-name-highlight">)?Suraj Yadav(?:</span>)?\s*(</a>)', re.DOTALL | re.IGNORECASE)
    
    if pattern.search(content):
        new_content = pattern.sub(r'\1<span class="developer-name-highlight">Suraj Yadav</span>\2', content)
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
                print(f"Updated {f}")
