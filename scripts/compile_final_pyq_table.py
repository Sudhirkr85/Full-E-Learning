import os
import sys
import io
import json
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

pyq_data = []

for f in sorted(os.listdir(pyq_dir)):
    p = os.path.join(pyq_dir, f)
    if not os.path.isfile(p):
        continue
        
    orig = orig_map.get(f, f)
    txt_list = cache1.get(orig, {}).get("texts", []) or cache2.get(orig, {}).get("texts", [])
    txt = " ".join(txt_list)
    
    # State detection
    state = "Bihar (बिहार)"
    if "State code 32" in txt or "State Code 3 2" in txt or "3113677" in txt or "UP" in f or "उत्तर प्रदेश" in txt or "UP, 20" in txt or "Prayagraj" in txt:
        state = "Uttar Pradesh (उत्तर प्रदेश)"
    elif "MP" in f or "मध्य प्रदेश" in txt:
        state = "Madhya Pradesh (मध्य प्रदेश)"
    elif "Rajasthan" in f or "राजस्थान" in txt:
        state = "Rajasthan (राजस्थान)"
    elif "Haryana" in f or "हरियाणा" in txt:
        state = "Haryana (हरियाणा)"
    elif "राज्य स्तरीय" in txt or "SCERT" in txt or "बिहार" in txt or "BR" in txt or "BR," in txt:
        state = "Bihar (बिहार)"
    else:
        state = "Bihar / All-India (बिहार / राष्ट्रीय)"
        
    # Year detection
    year = "2024-25 (नवीनतम)"
    for y in ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2012", "2011", "2010", "2009"]:
        if y in f or y in txt:
            year = y
            break
            
    # Paper Type
    ptype = "MAT (मानसिक योग्यता)"
    if "SAT" in f or "शैक्षिक" in txt or "SCHOLASTIC" in txt:
        ptype = "SAT (शैक्षिक योग्यता: विज्ञान, सामाजिक विज्ञान, गणित)"
    elif "Full" in f or "Booklet" in f or "Combined" in f:
        ptype = "MAT + SAT (दोनों पेपर सम्पूर्ण)"
        
    pyq_data.append({
        'filename': f,
        'year': year,
        'state': state,
        'type': ptype
    })

print(f"Total PYQs in folder 01: {len(pyq_data)}")
for idx, d in enumerate(pyq_data):
    print(f"{idx+1:02d}. {d['year']:<10} | {d['state']:<25} | {d['type']:<45} | {d['filename']}")
