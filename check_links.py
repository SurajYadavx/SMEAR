import glob
from bs4 import BeautifulSoup

for f in glob.glob('*.html'):
    if 'metropolis' in f or 'scratch' in f: continue
    with open(f, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
        print(f"--- {f} ---")
        
        # Check header nav links
        nav = soup.select('.header-nav a')
        for a in nav:
            href = a.get('href')
            if href and not href.startswith('#') and href not in ['index.html', 'packages.html', 'blood-tests.html', 'home-collection.html', 'cart.html', 'index.html#about']:
                print(f"Suspicious header link: {href}")
                
        # Check mobile nav links
        mob = soup.select('.mobile-nav a')
        for a in mob:
            href = a.get('href')
            if href and not href.startswith('#') and href not in ['index.html', 'packages.html', 'blood-tests.html', 'home-collection.html', 'cart.html', 'index.html#about']:
                print(f"Suspicious mobile link: {href}")

        # Check footer links
        foot = soup.select('.footer-nav a, .footer-legal a, .footer-logo-link')
        for a in foot:
            href = a.get('href')
            if href and not href.startswith('#') and not href.startswith('http') and href not in ['index.html', 'packages.html', 'blood-tests.html', 'home-collection.html', 'cart.html', 'terms.html', 'privacy.html', 'index.html#about']:
                print(f"Suspicious footer link: {href}")
