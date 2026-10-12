import subprocess
import re

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [EDGE, "--headless=new", "--dump-dom", "https://2026.mscenmms.in/"]
res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
html = res.stdout
links = [l for l in re.findall(r'href=[\'"]([^\'"]+)[\'"]', html) if ".pdf" in l.lower()]
print("All PDF Links:")
for l in links:
    print(" -", l)
