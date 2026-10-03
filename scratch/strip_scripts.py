import os
import glob

html_files = glob.glob(r"D:\FF\Smear\*.html")
targets = [
    '<script src="./src/shop.js"></script>',
    '<script src="./src/content/packages.js"></script>'
]

for file in html_files:
    if "migration_backup" in file or "metropolis_data" in file:
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for t in targets:
        if t in content:
            content = content.replace(t, '')
            modified = True
            
    if modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
