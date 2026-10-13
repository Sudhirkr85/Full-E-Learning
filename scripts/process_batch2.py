import os
import sys
import io
import json
import warnings
warnings.filterwarnings('ignore')

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import fitz
from PIL import Image
import easyocr

folder = r"C:\Users\Orange\Downloads\New folder"
new_files = sorted([f for f in os.listdir(folder) if f.startswith("New Document") and f.lower().endswith(".pdf")])

cache_file = "d:/Work/E-Learning/pdf_analysis_cache_batch2.json"
cache = {}
if os.path.exists(cache_file):
    try:
        with open(cache_file, "r", encoding="utf-8") as f:
            cache = json.load(f)
    except Exception:
        cache = {}

crop_dir = "d:/Work/E-Learning/scratch_crops_batch2"
os.makedirs(crop_dir, exist_ok=True)

reader = easyocr.Reader(['hi', 'en'], gpu=False, verbose=False)

print(f"Total new PDFs to process: {len(new_files)}, already cached: {len(cache)}")

for idx, fname in enumerate(new_files):
    if fname in cache and len(cache[fname].get("texts", [])) > 0:
        continue

    path = os.path.join(folder, fname)
    try:
        doc = fitz.open(path)
        page_count = len(doc)
        
        # 1. Quick check for digital text
        digital_text = ""
        for p in doc[:2]:
            digital_text += p.get_text() + " "
        digital_lines = [l.strip() for l in digital_text.split("\n") if len(l.strip()) > 3]
        
        if len(digital_lines) >= 3:
            extracted_texts = digital_lines[:15]
            method = "digital"
        else:
            # 2. Scanned OCR on top banner
            extracted_texts = []
            pages_to_check = [0]
            if page_count > 1:
                pages_to_check.append(1)
                
            for pno in pages_to_check:
                page = doc[pno]
                # 90 DPI is plenty for large exam headers and runs very fast
                pix = page.get_pixmap(dpi=90)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                w, h = img.size
                
                # Crop top 25%
                crop = img.crop((10, int(h * 0.02), w - 10, int(h * 0.25)))
                crop_path = os.path.join(crop_dir, f"{fname}_p{pno}.png")
                crop.save(crop_path)
                
                res = reader.readtext(crop_path)
                page_texts = [r[1] for r in res if r[2] > 0.35]
                extracted_texts.extend(page_texts)
                
                if len(page_texts) >= 4 and pno == 0:
                    break
            method = "ocr"
            
        cache[fname] = {
            "page_count": page_count,
            "method": method,
            "texts": extracted_texts[:25]
        }
        
        if idx % 10 == 0 or idx == len(new_files) - 1:
            with open(cache_file, "w", encoding="utf-8") as f:
                json.dump(cache, f, ensure_ascii=False, indent=2)
                
        preview = " | ".join(extracted_texts[:5])
        print(f"[{idx+1}/{len(new_files)}] {fname} ({page_count}p): {preview[:90]}")
        sys.stdout.flush()
        
    except Exception as e:
        print(f"[{idx+1}/{len(new_files)}] {fname}: ERROR {e}")
        sys.stdout.flush()

with open(cache_file, "w", encoding="utf-8") as f:
    json.dump(cache, f, ensure_ascii=False, indent=2)
print("Finished OCR processing batch 2.")
