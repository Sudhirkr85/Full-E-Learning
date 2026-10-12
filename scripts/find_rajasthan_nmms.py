import urllib.request
import urllib.parse
import re

base_url = "https://rajshaladarpan.rajasthan.gov.in/SD1/Home/Public2/Scholarship/ScholarshipHome.aspx"
target_url = urllib.parse.urljoin(base_url, "../../NMMS/Home.aspx")
print("Target URL:", target_url)

req = urllib.request.Request(target_url, headers={"User-Agent": "Mozilla/5.0"})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode("utf-8", errors="ignore")
        print("Status:", resp.status, "HTML len:", len(html))
        
        # find all links
        links = re.findall(r'href=[\'"]([^\'"]+)[\'"]', html)
        print("All links found:", len(links))
        pdf_or_nmms = [l for l in links if any(k in l.lower() for k in [".pdf", "question", "paper", "answer", "download", "model"])]
        print("Relevant links:", len(pdf_or_nmms))
        for l in pdf_or_nmms:
            full = urllib.parse.urljoin(target_url, l)
            print(" -", full)
except Exception as e:
    print("Error:", e)
