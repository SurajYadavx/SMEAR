import os
import glob
import codecs

files_to_check = glob.glob('**/*.html', recursive=True) + glob.glob('**/*.js', recursive=True) + glob.glob('**/*.md', recursive=True)
exclude_dirs = ['node_modules', 'migration_backup', '.git']

for filepath in files_to_check:
    if any(ex in filepath for ex in exclude_dirs):
        continue

    # Read content preserving utf-8
    try:
        with codecs.open(filepath, 'r', 'utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        # If it fails to read as utf-8, maybe it is windows-1252? Let's read it and decode, then write back as utf-8.
        with codecs.open(filepath, 'r', 'windows-1252') as f:
            content = f.read()

    original = content

    # Replace phone numbers
    content = content.replace('+91 74107 45222', '{{REAL_BUSINESS_PHONE_DISPLAY}}')
    content = content.replace('7410745222', '{{REAL_BUSINESS_PHONE}}')

    # If HTML, ensure <meta charset="UTF-8" /> is first tag in head
    if filepath.endswith('.html'):
        if '<head>' in content:
            head_split = content.split('<head>', 1)
            head_content = head_split[1]
            # Remove any existing charset meta
            # A bit tricky with regex, let's just make sure it has one.
            import re
            head_content = re.sub(r'<meta[^>]*charset=["\']UTF-8["\'][^>]*>\s*', '', head_content, flags=re.IGNORECASE)
            
            new_head_content = '\n  <meta charset="UTF-8">\n' + head_content.lstrip()
            content = head_split[0] + '<head>' + new_head_content

    if content != original or 'windows-1252' in str(locals()):
        with codecs.open(filepath, 'w', 'utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

# Create .nojekyll
with open('.nojekyll', 'w') as f:
    pass
print("Created .nojekyll")
