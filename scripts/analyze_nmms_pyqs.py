import json
import os
import sys
import io
import fitz

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"C:\Users\Orange\Downloads\New folder"

cache1 = json.load(open("d:/Work/E-Learning/pdf_analysis_cache.json", "r", encoding="utf-8"))
cache2 = json.load(open("d:/Work/E-Learning/pdf_analysis_cache_batch2.json", "r", encoding="utf-8"))

import csv
orig_map = {}
with open(os.path.join(folder, "RENAME_MAPPING_LOG.csv"), "r", encoding="utf-8-sig") as fp:
    reader = csv.reader(fp)
    header = next(reader)
    for row in reader:
        if len(row) >= 2:
            orig_map[row[1]] = row[0]

files = [f for f in os.listdir(folder) if f.lower().endswith('.pdf')]

pyq_list = []

for f in sorted(files):
    # Check if full paper / test booklet
    is_paper = any(k in f for k in ['_MAT_', '_SAT_', 'Question_Paper', 'Question_Booklet', 'Full_Question_Booklet']) and not any(skip in f for skip in ['Class_9', 'Class_10', 'SAV_', 'JNVST_', 'Sainik_', 'Kanya_', 'TSMS_', 'Uttarakhand', 'Syllabus', 'Poster', 'Key'])
    if not is_paper:
        continue
        
    orig = orig_map.get(f, f)
    txt_list = cache1.get(orig, {}).get("texts", []) or cache2.get(orig, {}).get("texts", [])
    txt = " ".join(txt_list)
    
    # Let's inspect page 0 text in fitz if empty
    doc = fitz.open(os.path.join(folder, f))
    p0_text = doc[0].get_text()
    p1_text = doc[1].get_text() if len(doc) > 1 else ""
    full_sample = txt + " " + p0_text + " " + p1_text
    
    # State detection
    state = "All India / National"
    if any(k in full_sample for k in ["बिहार", "Bihar", "BR,", "(BR", "BR)", "पटना", "Patna", "SCERT PATNA", "जमुई", "सुपौल", "3113677"]):
        state = "Bihar (बिहार)"
    elif any(k in full_sample for k in ["उत्तर प्रदेश", "Uttar Pradesh", "UP,", "(UP", "UP)", "प्रयागराज", "Prayagraj", "लखनऊ", "मनोविज्ञानशाला"]):
        state = "Uttar Pradesh (उत्तर प्रदेश)"
    elif any(k in full_sample for k in ["मध्य प्रदेश", "Madhya Pradesh", "MP,", "(MP", "MP)"]):
        state = "Madhya Pradesh (मध्य प्रदेश)"
    elif any(k in full_sample for k in ["राजस्थान", "Rajasthan"]):
        state = "Rajasthan (राजस्थान)"
    elif any(k in full_sample for k in ["हरियाणा", "Haryana"]):
        state = "Haryana (हरियाणा)"
    elif any(k in full_sample for k in ["उत्तराखंड", "Uttarakhand"]):
        state = "Uttarakhand (उत्तराखंड)"
        
    # Year detection
    year = "Multi-Year / Unspecified"
    for y in ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008"]:
        if y in f or y in full_sample:
            year = y
            break
            
    # Paper Type
    ptype = "MAT & SAT Combined"
    if "MAT" in f:
        ptype = "MAT (मानसिक योग्यता - Reasoning)"
    elif "SAT" in f:
        ptype = "SAT (शैक्षिक योग्यता - Science/Math/SST)"
        
    pyq_list.append({
        'file': f,
        'pages': len(doc),
        'year': year,
        'state': state,
        'type': ptype,
        'sample': full_sample[:100]
    })

print(f"Total Full NMMS PYQ papers analyzed: {len(pyq_list)}")
with open("d:/Work/E-Learning/nmms_pyq_details.json", "w", encoding="utf-8") as fp:
    json.dump(pyq_list, fp, ensure_ascii=False, indent=2)

for p in pyq_list[:35]:
    print(f"{p['file']:<48} | {p['year']:<5} | {p['state']:<25} | {p['type']}")
