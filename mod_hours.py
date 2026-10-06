with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('24/7 Full Services', 'Operating Hours')
content = content.replace('<p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 0.8rem;">Open round the clock</p>', '<p id="hero-hours-sub" style="color: rgba(255,255,255,0.7); margin: 0; font-size: 0.8rem;">Open round the clock</p>')

with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
