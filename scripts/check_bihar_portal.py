import urllib.request
import re

url = "https://nmmssbihar.co.in/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

try:
    with urllib.request.urlopen(req) as resp:
        print("Status:", resp.status)
        html = resp.read().decode("utf-8", errors="ignore")
        print("HTML len:", len(html))
        links = re.findall(r'href=[\'"]([^\'"]+)[\'"]', html)
        print("Total links:", len(links))
        pdf_links = [l for l in links if ".pdf" in l.lower()]
        print("PDF links:", len(pdf_links))
        for l in pdf_links:
            print(" -", l)
except Exception as e:
    print("Error:", e)
