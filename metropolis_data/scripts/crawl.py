import sys
import os
import time
import json
import logging
from common import (
    get_session, load_inventory, save_inventory, save_raw_html, 
    load_raw_html, OUTPUT_DIR, RAW_PACKAGES_DIR, RAW_TESTS_DIR, RAW_PROFILES_DIR
)
from scrape_packages import parse_package
from scrape_tests import parse_test
from scrape_profiles import parse_profile

sys.stdout.reconfigure(encoding='utf-8')

# Configuration
INITIAL_DELAY = 3
MIN_DELAY = 3
MAX_DELAY = 30
MAX_RETRIES = 3

current_delay = INITIAL_DELAY
stats = {
    'requests_completed': 0,    # 200 OK responses
    'packages_processed': 0,
    'profiles_processed': 0,
    'tests_processed': 0,
    'http_errors': 0,           # General/other HTTP errors
    'http_404': 0,              # HTTP 404 Not Found
    'http_429': 0,              # HTTP 429 Too Many Requests
    'http_403': 0,              # HTTP 403 Forbidden
    'timeouts_connections': 0,  # Connection exceptions/timeouts
    'retries_performed': 0      # Total retry attempts made
}

def _get_slug(url):
    return url.rstrip('/').split('/')[-1]

def log_progress(total_remaining):
    if (stats['requests_completed'] + stats['http_404']) > 0 and (stats['requests_completed'] + stats['http_404']) % 25 == 0:
        logging.info(
            f"--- PROGRESS REPORT --- "
            f"Reqs(200): {stats['requests_completed']} | "
            f"404s: {stats['http_404']} | "
            f"Packages: {stats['packages_processed']} | "
            f"Profiles: {stats['profiles_processed']} | "
            f"Tests: {stats['tests_processed']} | "
            f"429s: {stats['http_429']} | "
            f"Retries: {stats['retries_performed']} | "
            f"Errors: {stats['http_errors']} | "
            f"Delay: {current_delay}s | "
            f"Remaining: {total_remaining}"
        )

def fetch_with_pacing(session, url, total_remaining):
    global current_delay
    retries = 0
    while retries <= MAX_RETRIES:
        try:
            start_time = time.time()
            r = session.get(url, timeout=30)
            elapsed = time.time() - start_time
            
            logging.info(f"Requested {url} | Status: {r.status_code} | Elapsed: {elapsed:.2f}s | Delay: {current_delay}s")
            
            if r.status_code == 403:
                stats['http_403'] += 1
                logging.error(f"HTTP 403 Forbidden on {url}. Stopping safely to preserve progress.")
                sys.exit(1)
                
            if r.status_code == 404:
                stats['http_404'] += 1
                logging.warning(f"HTTP 404 Not Found on {url}. Skipping permanently.")
                log_progress(total_remaining)
                time.sleep(current_delay)
                return r
                
            if r.status_code == 429:
                stats['http_429'] += 1
                stats['retries_performed'] += 1
                current_delay = min(current_delay * 2, MAX_DELAY)
                logging.warning(f"HTTP 429 Too Many Requests on {url}. Increasing delay to {current_delay}s.")
                retries += 1
                time.sleep(current_delay)
                continue
                
            if r.status_code == 200:
                stats['requests_completed'] += 1
                log_progress(total_remaining)
                time.sleep(current_delay)
                return r
                
            # Other HTTP errors
            stats['http_errors'] += 1
            stats['retries_performed'] += 1
            logging.error(f"HTTP {r.status_code} on {url}.")
            retries += 1
            time.sleep(current_delay)
            
        except Exception as e:
            stats['timeouts_connections'] += 1
            stats['retries_performed'] += 1
            logging.error(f"Connection error on {url}: {e}")
            retries += 1
            current_delay = min(current_delay * 1.5, MAX_DELAY)
            logging.info(f"Increasing delay to {current_delay}s due to connection error.")
            time.sleep(current_delay)
            
    logging.error(f"Max retries ({MAX_RETRIES}) reached for {url}.")
    return None

def run_crawl():
    logging.info("Starting Full Metropolis Crawl (Pune Session, Adaptive Pacing)...")
    
    session = get_session()
    inventory = load_inventory()
    
    packages_urls = inventory.get('packages', [])
    tests_urls = inventory.get('tests', [])
    
    if not packages_urls or not tests_urls:
        logging.error("Inventory is empty! Run common.py to build inventory first.")
        sys.exit(1)
        
    results = {
        "packages": [],
        "tests": [],
        "profiles": []
    }
    
    def save_results():
        with open(os.path.join(OUTPUT_DIR, 'metropolis_packages.json'), 'w', encoding='utf-8') as f:
            json.dump(results['packages'], f, indent=2)
        with open(os.path.join(OUTPUT_DIR, 'metropolis_tests.json'), 'w', encoding='utf-8') as f:
            json.dump(results['tests'], f, indent=2)
        with open(os.path.join(OUTPUT_DIR, 'metropolis_profiles.json'), 'w', encoding='utf-8') as f:
            json.dump(results['profiles'], f, indent=2)

    def calc_remaining():
        processed_pkg = len(set(inventory.get('processed_packages', [])))
        processed_prof = len(set(inventory.get('processed_profiles', [])))
        processed_test = len(set(inventory.get('processed_tests', [])))
        return (len(packages_urls) - processed_pkg) + (len(set(inventory.get('profiles', []))) - processed_prof) + (len(tests_urls) - processed_test)
    
    # 1. Packages
    logging.info("--- CRAWLING PACKAGES ---")
    processed_pkg = set(inventory.get('processed_packages', []))
    new_profiles = set(inventory.get('profiles', []))
    
    for url in packages_urls:
        slug = _get_slug(url)
        if slug in processed_pkg:
            filepath = os.path.join(OUTPUT_DIR, f"pkg_{slug}.json")
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    pkg_data = json.load(f)
                    results['packages'].append(pkg_data)
                    for p in pkg_data.get('profiles', []):
                        if p.get('profile_url'): new_profiles.add(p['profile_url'])
            stats['packages_processed'] += 1
            continue
            
        r = fetch_with_pacing(session, url, calc_remaining())
        if r and r.status_code in (200, 404):
            if r.status_code == 200:
                html = r.text
                save_raw_html(slug, html, RAW_PACKAGES_DIR)
                pkg = parse_package(html, url)
                
                if "Package is not available in your location" in html:
                    pkg['availability_status'] = "not_available_in_pune"
                else:
                    pkg['availability_status'] = "available"
                    
                results['packages'].append(pkg)
                
                with open(os.path.join(OUTPUT_DIR, f"pkg_{slug}.json"), 'w', encoding='utf-8') as f:
                    json.dump(pkg, f, indent=2)
                    
                for prof in pkg.get('profiles', []):
                    if prof.get('profile_url'):
                        new_profiles.add(prof['profile_url'])
            
            # Record processed regardless of 200 or 404
            processed_pkg.add(slug)
            inventory['processed_packages'] = list(processed_pkg)
            inventory['profiles'] = list(new_profiles)
            save_inventory(inventory)
            save_results()
        
        stats['packages_processed'] += 1
        
    # 2. Profiles
    logging.info("--- CRAWLING PROFILES ---")
    processed_prof = set(inventory.get('processed_profiles', []))
    
    for url in list(new_profiles):
        slug = _get_slug(url)
        if slug in processed_prof:
            filepath = os.path.join(OUTPUT_DIR, f"prof_{slug}.json")
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    results['profiles'].append(json.load(f))
            stats['profiles_processed'] += 1
            continue
            
        r = fetch_with_pacing(session, url, calc_remaining())
        if r and r.status_code in (200, 404):
            if r.status_code == 200:
                html = r.text
                save_raw_html(slug, html, RAW_PROFILES_DIR)
                prof = parse_profile(html, url)
                
                if "not available in your location" in html.lower():
                    prof['availability_status'] = "not_available_in_pune"
                else:
                    prof['availability_status'] = "available"
                
                results['profiles'].append(prof)
                
                with open(os.path.join(OUTPUT_DIR, f"prof_{slug}.json"), 'w', encoding='utf-8') as f:
                    json.dump(prof, f, indent=2)
            
            # Record processed regardless of 200 or 404
            processed_prof.add(slug)
            inventory['processed_profiles'] = list(processed_prof)
            save_inventory(inventory)
            save_results()
            
        stats['profiles_processed'] += 1

    # 3. Tests
    logging.info("--- CRAWLING TESTS ---")
    processed_test = set(inventory.get('processed_tests', []))
    
    for url in tests_urls:
        slug = _get_slug(url)
        if slug in processed_test:
            filepath = os.path.join(OUTPUT_DIR, f"test_{slug}.json")
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    results['tests'].append(json.load(f))
            stats['tests_processed'] += 1
            continue
            
        r = fetch_with_pacing(session, url, calc_remaining())
        if r and r.status_code in (200, 404):
            if r.status_code == 200:
                html = r.text
                save_raw_html(slug, html, RAW_TESTS_DIR)
                t = parse_test(html, url)
                
                if "not available in your location" in html.lower():
                    t['availability_status'] = "not_available_in_pune"
                else:
                    t['availability_status'] = "available"
                    
                results['tests'].append(t)
                
                with open(os.path.join(OUTPUT_DIR, f"test_{slug}.json"), 'w', encoding='utf-8') as f:
                    json.dump(t, f, indent=2)
            
            # Record processed regardless of 200 or 404
            processed_test.add(slug)
            inventory['processed_tests'] = list(processed_test)
            save_inventory(inventory)
            save_results()
            
        stats['tests_processed'] += 1

    logging.info("FULL CRAWL COMPLETE!")

if __name__ == "__main__":
    run_crawl()
