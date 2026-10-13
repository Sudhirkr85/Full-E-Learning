import os
import sys
import io
import fitz
from PIL import Image
import easyocr

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"C:\Users\Orange\Downloads\New folder"
files = sorted([f for f in os.listdir(folder) if f.lower().endswith(".pdf")])

reader = easyocr.Reader(['hi', 'en'], gpu=False, verbose=False)

os.makedirs("d:/Work/E-Learning/scratch_crops", exist_ok=True)

print(f"Total PDFs to inspect: {len(files)}")
for idx, fname in enumerate(files[:15]):
    path = os.path.join(folder, fname)
    doc = fitz.open(path)
    page = doc[0]
    pix = page.get_pixmap(dpi=120)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    w, h = img.size
    
    # Crop top 25%
    crop = img.crop((10, 10, w - 10, int(h * 0.25)))
    crop_path = f"d:/Work/E-Learning/scratch_crops/{fname}.png"
    crop.save(crop_path)
    
    res = reader.readtext(crop_path)
    texts = [r[1] for r in res if r[2] > 0.3]
    print(f"[{idx+1}/{len(files)}] {fname} ({len(doc)} pgs): {' | '.join(texts)}")
