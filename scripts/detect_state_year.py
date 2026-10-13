import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"C:\Users\Orange\Downloads\New folder"
files = [f for f in os.listdir(folder) if f.lower().endswith('.pdf')]

cache1 = json.load(open("d:/Work/E-Learning/pdf_analysis_cache.json", "r", encoding="utf-8"))
cache2 = json.load(open("d:/Work/E-Learning/pdf_analysis_cache_batch2.json", "r", encoding="utf-8"))

# Load RENAME_MAPPING_LOG.csv or build a map
import csv
orig_map = {}
with open(os.path.join(folder, "RENAME_MAPPING_LOG.csv"), "r", encoding="utf-8-sig") as fp:
    reader = csv.reader(fp)
    header = next(reader)
    for row in reader:
        if len(row) >= 2:
            orig_map[row[1]] = row[0]

print(f"Total current files: {len(files)}")

for f in sorted(files):
    orig = orig_map.get(f, f)
    txt_list = cache1.get(orig, {}).get("texts", []) or cache2.get(orig, {}).get("texts", [])
    txt = " ".join(txt_list)
    
    # State detection
    state = "Unknown / National"
    if any(k in txt for k in ["बिहार", "Bihar", "BR,", "BR ,", "BR.", "(BR", "BR)", "पटना", "Patna", "SCERT PATNA", "जमुई", "सुपौल"]):
        state = "Bihar"
    elif any(k in txt for k in ["उत्तर प्रदेश", "Uttar Pradesh", "UP,", "UP ,", "UP.", "(UP", "UP)", "प्रयागराज", "Prayagraj", "लखनऊ"]):
        state = "Uttar Pradesh (UP)"
    elif any(k in txt for k in ["उत्तराखंड", "Uttarakhand", "नौटियाल"]):
        state = "Uttarakhand"
    elif any(k in txt for k in ["मध्य प्रदेश", "Madhya Pradesh", "MP,", "(MP"]):
        state = "Madhya Pradesh (MP)"
    elif any(k in txt for k in ["राजस्थान", "Rajasthan"]):
        state = "Rajasthan"
        
    # Year detection
    year = "Undated / Multiple Years"
    for y in ["2026-27", "2025-26", "2024-25", "2023-24", "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008"]:
        if y in f or y in txt:
            year = y
            break
            
    print(f"{f:<55} | State: {state:<18} | Year: {year}")
