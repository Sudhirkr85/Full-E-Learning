import json
import os
import sys
import io
import csv

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

base = r"C:\Users\Orange\Downloads\New folder"
pyq_dir = os.path.join(base, "01_NMMS_Previous_Year_Question_Papers")

cache1 = json.load(open("d:/Work/E-Learning/pdf_analysis_cache.json", "r", encoding="utf-8"))
cache2 = json.load(open("d:/Work/E-Learning/pdf_analysis_cache_batch2.json", "r", encoding="utf-8"))

# Load mapping
orig_map = {}
with open(os.path.join(base, "RENAME_MAPPING_LOG.csv"), "r", encoding="utf-8-sig") as fp:
    reader = csv.reader(fp)
    header = next(reader)
    for row in reader:
        if len(row) >= 2:
            orig_map[row[1]] = row[0]

files = sorted(os.listdir(pyq_dir))

official_original_pyq = []
practice_mock_test = []

for f in files:
    orig = orig_map.get(f, f)
    txt_list = cache1.get(orig, {}).get("texts", []) or cache2.get(orig, {}).get("texts", [])
    txt = " ".join(txt_list)
    
    # Check if this is an official exam paper or a practice set
    is_practice = any(k in txt for k in ["प्रैक्टिस सेट", "प्रैक्टिस", "Practice Set", "मॉडल"]) or "Practice_Set" in f
    
    # Check if it has a confirmed official year (like 2009, 2010, 2011, 2012, 2017, 2023, 2024, 2025)
    confirmed_year = None
    for y in ["2025", "2024", "2023", "2022", "2017", "2012", "2011", "2010", "2009"]:
        if y in f or y in txt:
            confirmed_year = y
            break
            
    if is_practice:
        practice_mock_test.append((f, txt[:80]))
    else:
        official_original_pyq.append((f, confirmed_year, txt[:80]))

print(f"=== 1. असली बोर्ड परीक्षा पेपर्स (OFFICIAL BOARD PYQS) ({len(official_original_pyq)}) ===")
for item in official_original_pyq:
    print(f"• Year: {str(item[1]):<6} | File: {item[0]}")
    print(f"  Header text: {item[2]}")

print(f"\n=== 2. मॉडल टेस्ट पेपर्स / प्रैक्टिस सेट्स (MODEL PRACTICE SETS) ({len(practice_mock_test)}) ===")
for item in practice_mock_test:
    print(f"• File: {item[0]}")
    print(f"  Header text: {item[1]}")
