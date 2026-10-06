import json
import urllib.parse
import xml.etree.ElementTree as ET
from xml.dom import minidom
from datetime import datetime, timezone

packages_path = 'd:\\FF\\Smear\\public\\data\\smear-packages.json'

with open(packages_path, 'r', encoding='utf-8') as f:
    packages = json.load(f)

# Static URLs with priority and changefreq
static_urls = [
    ('https://smearpathology.in/', '1.0', 'daily'),
    ('https://smearpathology.in/packages.html', '0.9', 'daily'),
    ('https://smearpathology.in/blood-tests.html', '0.9', 'daily'),
    ('https://smearpathology.in/home-collection.html', '0.8', 'weekly'),
    ('https://smearpathology.in/privacy.html', '0.5', 'monthly'),
    ('https://smearpathology.in/terms.html', '0.5', 'monthly'),
]

urls_data = list(static_urls)

for p in packages:
    pkg_id = p.get('slug') or p.get('id')
    url = f'https://smearpathology.in/package-detail.html?id={urllib.parse.quote(pkg_id)}'
    urls_data.append((url, '0.8', 'weekly'))

# Remove duplicates maintaining order
unique_urls = []
seen = set()
for data in urls_data:
    if data[0] not in seen:
        unique_urls.append(data)
        seen.add(data[0])

# Create XML
urlset = ET.Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')

current_time = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S+00:00')

for url, priority, changefreq in unique_urls:
    url_el = ET.SubElement(urlset, 'url')
    
    loc = ET.SubElement(url_el, 'loc')
    loc.text = url
    
    lastmod = ET.SubElement(url_el, 'lastmod')
    lastmod.text = current_time
    
    changefreq_el = ET.SubElement(url_el, 'changefreq')
    changefreq_el.text = changefreq
    
    priority_el = ET.SubElement(url_el, 'priority')
    priority_el.text = priority

xmlstr = minidom.parseString(ET.tostring(urlset)).toprettyxml(indent='  ', encoding='UTF-8')

with open('d:\\FF\\Smear\\sitemap.xml', 'wb') as f:
    f.write(xmlstr)

print('Rich Sitemap generated with', len(unique_urls), 'URLs')
