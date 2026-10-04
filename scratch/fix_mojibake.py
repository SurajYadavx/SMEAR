import os
import glob
import re

html_files = glob.glob('*.html')

replacements = {
    'ðŸ“±': '📱',
    'Ã°Å¸â€œÂ±': '📱',
    'â”€': '─',
    'â•': '═',
    'Â©': '©',
    'Â₹': '₹',
    'â‚¹': '₹',
    'â€”': '—',
    'â€™': '’',
    'â€¢': '•',
    'Ã—': '×',
    'âœ“': '✓'
}

for filepath in html_files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        modified = content
        for bad, good in replacements.items():
            modified = modified.replace(bad, good)
            
        if modified != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(modified)
            print(f"Fixed {filepath}")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

