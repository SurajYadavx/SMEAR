import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(BASE_DIR, 'output', 'inventory.json'), 'r', encoding='utf-8') as f:
    inv = json.load(f)

pkgs = set(inv.get('packages', []))
processed_pkgs = set(inv.get('processed_packages', []))
rem_pkgs = len(pkgs) - len(processed_pkgs)

profs = set(inv.get('profiles', []))
processed_profs = set(inv.get('processed_profiles', []))
rem_profs = len(profs) - len(processed_profs)

tests = set(inv.get('tests', []))
processed_tests = set(inv.get('processed_tests', []))
rem_tests = len(tests) - len(processed_tests)

print(f"Total Packages: {len(pkgs)}, Processed: {len(processed_pkgs)}, Remaining: {rem_pkgs}")
print(f"Total Profiles Discovered So Far: {len(profs)}, Processed: {len(processed_profs)}, Remaining: {rem_profs}")
print(f"Total Tests: {len(tests)}, Processed: {len(processed_tests)}, Remaining: {rem_tests}")
print(f"Total Remaining Requests: {rem_pkgs + rem_profs + rem_tests + 1} (including 1 for session)")
