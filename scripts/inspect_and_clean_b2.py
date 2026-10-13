import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"C:\Users\Orange\Downloads\New folder"

personal_files = [
    "New Document(246).pdf", "New Document(352).pdf", "New Document(358).pdf",
    "New Document(375).pdf", "New Document(376).pdf", "New Document(394).pdf",
    "New Document(400).pdf", "New Document(359).pdf", "New Document(361).pdf",
    "New Document(245).pdf", "New Document(380).pdf", "New Document(387).pdf"
]

print("Deleting personal files...")
for pf in personal_files:
    p = os.path.join(folder, pf)
    if os.path.exists(p):
        os.remove(p)
        print("Deleted personal file:", pf)

remaining = sorted([f for f in os.listdir(folder) if f.startswith("New Document") and f.lower().endswith(".pdf")])
print(f"\nRemaining educational files: {len(remaining)}")

with open("d:/Work/E-Learning/pdf_analysis_cache_batch2.json", "r", encoding="utf-8") as f:
    cache = json.load(f)

for idx, f in enumerate(remaining):
    d = cache.get(f, {})
    pgs = d.get('page_count', 0)
    txt = " ".join(d.get('texts', []))[:100]
    print(f"[{idx+1:02d}] {f:<22} ({pgs:>2}p) : {txt}")
