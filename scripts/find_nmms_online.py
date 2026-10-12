import subprocess
import re
import os
import json

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

def fetch_page_dom(url):
    cmd = [EDGE, "--headless=new", "--dump-dom", url]
    res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    return res.stdout

def extract_pdf_and_paper_links(html):
    # Regex to find all hrefs
    all_links = re.findall(r'href=[\'"](https?://[^\'"]+)[\'"]', html)
    relevant = []
    for l in all_links:
        l_lower = l.lower()
        if any(k in l_lower for k in [".pdf", "question-paper", "paper-20", "answer-key", "docs.aglasem"]):
            relevant.append(l)
    return list(dict.fromkeys(relevant))

if __name__ == "__main__":
    urls = [
        "https://schools.aglasem.com/rajasthan-nmms-question-papers/",
        "https://schools.aglasem.com/uttar-pradesh-nmms-question-papers/",
        "https://schools.aglasem.com/bihar-nmms-question-papers/",
    ]
    
    for u in urls:
        print(f"\nFetching: {u}")
        try:
            html = fetch_page_dom(u)
            print(f"  Length: {len(html)}")
            links = extract_pdf_and_paper_links(html)
            print(f"  Found {len(links)} links:")
            for l in links[:8]:
                print(f"    - {l}")
        except Exception as e:
            print("  Error:", e)
