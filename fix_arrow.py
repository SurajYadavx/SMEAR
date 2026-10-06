import glob

files = glob.glob('*.html') + glob.glob('src/*.js')

replacements = {
    'â†’': '→',
    'â€¦': '…',
    'â€”': '—',
    'â€“': '–',
    'â€™': '’',
    'â€¢': '•',
    'â€œ': '“',
    'â€': '”',
}

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        new_content = content
        for k, v in replacements.items():
            new_content = new_content.replace(k, v)
            
        if new_content != content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Fixed mojibake in {f}")
    except Exception as e:
        pass
