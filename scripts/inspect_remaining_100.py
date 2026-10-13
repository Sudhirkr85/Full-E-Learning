import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"C:\Users\Orange\Downloads\New folder"
remaining_files = sorted([f for f in os.listdir(folder) if f.startswith("New Document") and f.lower().endswith(".pdf")])

with open("d:/Work/E-Learning/pdf_analysis_cache_batch2.json", "r", encoding="utf-8") as f:
    cache = json.load(f)

print(f"Total remaining new unique files: {len(remaining_files)}")

for idx, fname in enumerate(remaining_files):
    data = cache.get(fname, {})
    pgs = data.get("page_count", 0)
    texts = " ".join(data.get("texts", []))
    print(f"[{idx+1:03d}] {fname:<25} ({pgs:>2}p): {texts[:120]}")
