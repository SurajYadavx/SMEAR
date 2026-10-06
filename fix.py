import os

files = ['src/config.js', 'src/main.js', 'src/blood-tests.js', 'src/package-detail.js', 'index.html', 'packages.html', 'blood-tests.html', 'terms.html', 'privacy.html', 'README.md', 'home-collection.html', 'cart.html']
for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        content = content.replace('{{REAL_BUSINESS_PHONE}}', '7410745222')
        content = content.replace('{{REAL_BUSINESS_PHONE_DISPLAY}}', '+91 74107 45222')
        # Also fix LAB_HOURS
        content = content.replace("var LAB_HOURS      = '24/7 Services Available';", "var LAB_HOURS      = 'Call or WhatsApp to confirm today\\'s hours';")
        # Also fix 24/7 text elsewhere
        content = content.replace("24/7 Full Services", "We\\'re Open")
        # in packages.html
        content = content.replace('<div class="pkg-page-hero__stat-num">24/7</div>', '<div class="pkg-page-hero__stat-num">Open</div>')
        # Canonical URL fix
        content = content.replace('<link rel="canonical" href="https://smearpathology.in', '<!-- TODO: Update canonical when domain is live --><link rel="canonical" href="https://surajyadavx.github.io/SMEAR')
        content = content.replace('"url": "https://smearpathology.in', '"url": "https://surajyadavx.github.io/SMEAR')
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
