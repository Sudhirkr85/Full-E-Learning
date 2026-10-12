import urllib.request
import urllib.parse
import re

url = "https://rajshaladarpan.rajasthan.gov.in/SD1/Home/NMMS/ShalaDarpanDownloadFormats.aspx"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
        print("Status:", resp.status, "HTML len:", len(html))
        
        # Extract rows or links
        links = re.findall(r'href=[\'"]([^\'"]+)[\'"]', html)
        for l in links:
            if any(k in l.lower() for k in [".pdf", "download", "doc"]):
                print(" -", urllib.parse.urljoin(url, l))
                
        # Also print table text snippet
        matches = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
        print("Table rows:", len(matches))
        for m in matches[:15]:
            clean_text = re.sub(r'<[^>]+>', ' ', m).strip()
            if any(k in clean_text.lower() for k in ["nmms", "paper", "प्रश्न", "उत्तर", "key", "20"]):
                print("Row:", re.sub(r'\s+', ' ', clean_text))
except Exception as e:
    print("Error:", e)
