import json
import os

def check():
    base = r"D:\FF\Smear\public\data"
    with open(os.path.join(base, "smear-packages.json"), "r", encoding="utf-8") as f:
        packages = json.load(f)
    with open(os.path.join(base, "smear-tests.json"), "r", encoding="utf-8") as f:
        tests = json.load(f)
    with open(os.path.join(base, "smear-categories.json"), "r", encoding="utf-8") as f:
        categories = json.load(f)

    print(f"Loaded packages: {len(packages)}")
    print(f"Loaded tests: {len(tests)}")
    print(f"Loaded categories: {len(categories)}")

    cat_ids = {c["categoryId"] for c in categories}
    
    issues = []
    
    # Packages
    pkg_ids = set()
    pkg_slugs = set()
    for p in packages:
        if p["id"] in pkg_ids:
            issues.append(f"Duplicate package ID: {p['id']}")
        pkg_ids.add(p["id"])
        
        if p.get("slug"):
            if p["slug"] in pkg_slugs:
                issues.append(f"Duplicate package slug: {p['slug']}")
            pkg_slugs.add(p["slug"])
            
        if not p.get("name"):
            issues.append(f"Missing name for package: {p['id']}")
            
        if p.get("categoryId") not in cat_ids and p.get("categoryId") is not None:
            issues.append(f"Invalid category reference in package: {p['id']} -> {p['categoryId']}")
            
        if p.get("price") is not None:
            issues.append(f"Non-null price in package: {p['id']}")
            
        # check contamination
        s = json.dumps(p).lower()
        if "metropolis" in s or "bookmytest" in s:
            issues.append(f"Source contamination in package: {p['id']}")
            
        if "http://" in s or "https://" in s:
            issues.append(f"Source URL in package: {p['id']}")

    # Tests
    test_ids = set()
    for t in tests:
        if t["id"] in test_ids:
            issues.append(f"Duplicate test ID: {t['id']}")
        test_ids.add(t["id"])
        
        if not t.get("name"):
            issues.append(f"Missing name for test: {t['id']}")
            
        if t.get("price") is not None:
            issues.append(f"Non-null price in test: {t['id']}")
            
        s = json.dumps(t).lower()
        if "metropolis" in s or "bookmytest" in s:
            issues.append(f"Source contamination in test: {t['id']}")
            
        if "http://" in s or "https://" in s:
            issues.append(f"Source URL in test: {t['id']}")

    print("Issues:")
    for i in issues:
        print(i)
        
check()
