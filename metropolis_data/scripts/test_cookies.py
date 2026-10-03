import requests

def test_headers():
    r = requests.get('https://www.metropolisindia.com/', allow_redirects=False)
    print("Cookies from root:")
    for k, v in r.cookies.items():
        print(f"{k} = {v}")
        
    r2 = requests.get('https://www.metropolisindia.com/health-checkup-packages/truhealth-active-male-tru-diet', allow_redirects=False)
    print("\nCookies from package page:")
    for k, v in r2.cookies.items():
        print(f"{k} = {v}")

if __name__ == "__main__":
    test_headers()
