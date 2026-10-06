import glob
import os

files = ['src/config.js', 'src/main.js'] + glob.glob('*.html')
for f in files:
    if os.path.exists(f):
        try:
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
            content = content.replace('content="https://smearpathology.in', 'content="https://surajyadavx.github.io/SMEAR')
            content = content.replace("'https://smearpathology.in'", "'https://surajyadavx.github.io/SMEAR/'")
            content = content.replace("'url':'https://smearpathology.in/'", "'url':'https://surajyadavx.github.io/SMEAR/'")
            content = content.replace("'logo':'https://smearpathology.in/public", "'logo':'https://surajyadavx.github.io/SMEAR/public")
            content = content.replace("var SITE_URL        = 'https://smearpathology.in';", "var SITE_URL        = 'https://surajyadavx.github.io/SMEAR'; // TODO: Update canonical when domain is live")
            content = content.replace('smearpathology.in', 'surajyadavx.github.io/SMEAR')
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
        except:
            pass
