import re, glob
for f in glob.glob('*.html'):
    try:
        content = open(f, encoding='utf-8').read()
        matches = re.findall(r'<a[^>]*href="#"[^>]*>', content)
        for m in matches:
            if 'id="' not in m and 'class="footer-logo-link"' not in m and 'class="v8-journey__btn"' not in m and 'class="v8-journey__secondary"' not in m:
                print(f, m)
    except Exception as e:
        print(f"Error in {f}: {e}")
