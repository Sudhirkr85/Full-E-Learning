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
files = sorted([f for f in os.listdir(folder) if f.lower().endswith(".pdf")])

cache_file = "d:/Work/E-Learning/pdf_analysis_cache.json"
cache = {}
if os.path.exists(cache_file):
    try:
        with open(cache_file, "r", encoding="utf-8") as f:
            cache = json.load(f)
    except Exception:
        cache = {}

crop_dir = "d:/Work/E-Learning/scratch_crops"
os.makedirs(crop_dir, exist_ok=True)

reader = easyocr.Reader(['hi', 'en'], gpu=False, verbose=False)

print(f"Total PDFs: {len(files)}, already cached: {len(cache)}")

for idx, fname in enumerate(files):
    if fname in cache and cache[fname].get("texts"):
        continue

    path = os.path.join(folder, fname)
    try:
        doc = fitz.open(path)
        page_count = len(doc)
        
        extracted_texts = []
        # Check first 2 pages if needed
        pages_to_check = [0]
        if page_count > 1:
            pages_to_check.append(1)
            
        for pno in pages_to_check:
            page = doc[pno]
            pix = page.get_pixmap(dpi=100) # 100 dpi is faster and sufficient
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            w, h = img.size
            
            # Crop top 25%
            crop = img.crop((10, 10, w - 10, int(h * 0.25)))
            crop_path = os.path.join(crop_dir, f"{fname}_p{pno}.png")
            crop.save(crop_path)
            
            res = reader.readtext(crop_path)
            page_texts = [r[1] for r in res if r[2] > 0.35]
            extracted_texts.extend(page_texts)
            
            # If we found strong identifying text on page 0, no need to check page 1
            if len(page_texts) >= 5 and pno == 0:
                break
                
        cache[fname] = {
            "page_count": page_count,
            "texts": extracted_texts[:25]
        }
        
        # Save cache every 5 items
        if idx % 5 == 0 or idx == len(files) - 1:
            with open(cache_file, "w", encoding="utf-8") as f:
                json.dump(cache, f, ensure_ascii=False, indent=2)
                
        preview = " | ".join(extracted_texts[:6])
        print(f"[{idx+1}/{len(files)}] {fname} ({page_count} p): {preview[:100]}")
        sys.stdout.flush()
        
    except Exception as e:
        print(f"[{idx+1}/{len(files)}] {fname}: ERROR {e}")
        sys.stdout.flush()

with open(cache_file, "w", encoding="utf-8") as f:
    json.dump(cache, f, ensure_ascii=False, indent=2)
print("Finished OCR processing all PDFs.")
