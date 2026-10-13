import os
import sys
import io
import json
import shutil
import csv

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

base = r"C:\Users\Orange\Downloads\New folder"
study_mat_dir = os.path.join(base, "02_NMMS_Subjectwise_Study_Material")
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

moved_count = 0
for f in os.listdir(study_mat_dir):
    p = os.path.join(study_mat_dir, f)
    if not os.path.isfile(p):
        continue
    orig = orig_map.get(f, f)
    txt_list = cache1.get(orig, {}).get("texts", []) or cache2.get(orig, {}).get("texts", [])
    txt = " ".join(txt_list)
    
    # Check if this is an official paper
    if any(k in txt for k in ["National Means", "छात्रवृत्ति परीक्षा 20", "राष्ट्रीय आय एवं योग्यता आधारित छात्रवृत्ति", "राज्यस्तरीय राष्ट्रीय आय-सह-मेधा", "SCHOLASTIC APTITUDE TEST", "शेकषिक क्षमता परीक्षण", "PART - ] MENTAL ABILITY TEST", "PART -I : MENTAL ABILITY TEST"]):
        print("Moving to PYQs folder:", f)
        dst = os.path.join(pyq_dir, f)
        shutil.move(p, dst)
        moved_count += 1

print(f"Total moved to PYQs folder: {moved_count}")
