import os
import sys
import io
import fitz
import shutil

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

base = r"C:\Users\Orange\Downloads\New folder"
study_mat_dir = os.path.join(base, "02_NMMS_Subjectwise_Study_Material")
pyq_dir = os.path.join(base, "01_NMMS_Previous_Year_Question_Papers")

for f in os.listdir(study_mat_dir):
    p = os.path.join(study_mat_dir, f)
    if not os.path.isfile(p):
        continue
    doc = fitz.open(p)
    txt = doc[0].get_text() + " " + (doc[1].get_text() if len(doc) > 1 else "")
    
    # If it is a full official question paper
    if "राष्ट्रीय आय" in txt or "National Means" in txt or "SCHOLASTIC APTITUDE TEST" in txt or "MENTAL ABILITY TEST" in txt:
        if len(doc) >= 6: # Multi-page full papers
            print("Found full paper in study material:", f, f"({len(doc)} pages)")
            # Move to pyq_dir
            dst = os.path.join(pyq_dir, f)
            shutil.move(p, dst)
