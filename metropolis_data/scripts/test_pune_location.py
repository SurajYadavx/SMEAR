import asyncio
import json
from playwright.async_api import async_playwright

async def main():
    print("Starting Playwright...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        requests_made = []
        def log_req(route, request):
            requests_made.append({
                "url": request.url, 
                "method": request.method,
                "post": request.post_data
            })
            asyncio.create_task(route.continue_())
            
        await page.route("**/*", log_req)
        
        print("Navigating...")
        await page.goto('https://www.metropolisindia.com/health-checkup-packages/truhealth-active-male-tru-diet', wait_until='domcontentloaded')
        await page.wait_for_timeout(2000)
        
        print("Clicking Pune (id 29)...")
        requests_made.clear()
        
        # Click the link using JS
        await page.evaluate("""
            let el = document.getElementById('29');
            if(el) { el.click(); }
            else { console.log('Element 29 not found'); }
        """)
        
        await page.wait_for_timeout(3000)
        
        print(f"Captured {len(requests_made)} requests after click.")
        for r in requests_made:
            if 'api' in r['url'].lower() or 'ajax' in r['url'].lower() or r['method'] == 'POST' or 'city' in r['url'].lower():
                print(f"{r['method']} {r['url']}")
                if r['post']:
                    print(f"POST DATA: {r['post']}")
                    
        cookies = await page.context.cookies()
        for c in cookies:
            print(f"Cookie: {c['name']} = {c['value']}")
            
        # Get price to see if it changed
        price = await page.evaluate("document.querySelector('.th-amount') ? document.querySelector('.th-amount').innerText : 'None'")
        print(f"Price on page: {price}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
