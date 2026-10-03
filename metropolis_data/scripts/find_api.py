import re

def find():
    path = r"C:\Users\offls\.gemini\antigravity-ide\brain\03dd7455-71df-4a82-823d-4a09edfcdfe2\.system_generated\steps\181\content.md"
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    print("Finding URLs in JS bundle...")
    # Find anything looking like an endpoint string
    endpoints = set(re.findall(r'[\'"](/api/[^\'"]+)[\'"]', content))
    endpoints.update(re.findall(r'[\'"](/[a-z_-]*city[a-z_-]*)[\'"]', content))
    
    for e in endpoints:
        print(f"Endpoint: {e}")
        
    # Find any AJAX related to city
    print("\nFinding city related ajax...")
    # Extract 200 chars around 'select_city' or 'ajax' + 'city'
    for match in re.finditer(r'.{0,100}city.{0,100}', content):
        text = match.group(0)
        if 'ajax' in text.lower() or 'post' in text.lower():
            print(f"Match: {text}")
            
if __name__ == "__main__":
    find()
