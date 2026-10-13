import os
import sys
import io
import json
import fitz
from PIL import Image
import easyocr

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

reader = easyocr.Reader(['hi', 'en'], gpu=False, verbose=False)
folder = r"C:\Users\Orange\Downloads\New folder"

unresolved = [
    'New Document(179).pdf', 'New Document(261).pdf', 'New Document(277).pdf',
    'New Document(279).pdf', 'New Document(283).pdf', 'New Document(285).pdf',
    'New Document(286).pdf', 'New Document(287).pdf', 'New Document(288).pdf',
    'New Document(289).pdf', 'New Document(290).pdf', 'New Document(296).pdf',
    'New Document(306).pdf', 'New Document(309).pdf', 'New Document(312).pdf',
    'New Document(320).pdf', 'New Document(356).pdf', 'New Document(357).pdf',
    'New Document(86).pdf'
]

os.makedirs('d:/Work/E-Learning/unresolved_crops', exist_ok=True)

with open('d:/Work/E-Learning/pdf_analysis_cache.json', 'r', encoding='utf-8') as f:
    cache = json.load(f)

for fname in unresolved:
    path = os.path.join(folder, fname)
    doc = fitz.open(path)
    # Check page 0, and if doc > 1 page, also page 1
    texts_all = []
    for pno in range(min(2, len(doc))):
        page = doc[pno]
        pix = page.get_pixmap(dpi=100)
        img_path = f"d:/Work/E-Learning/unresolved_crops/{fname}_p{pno}.png"
        pix.save(img_path)
        
        im = Image.open(img_path)
        w, h = im.size
        new_w = 700
        new_h = int(h * (700 / w))
        im_resized = im.resize((new_w, new_h))
        im_resized.save(img_path)
        
        res = reader.readtext(img_path)
        t = [r[1] for r in res if r[2] > 0.35]
        texts_all.extend(t)
        
    cache[fname] = {
        "page_count": len(doc),
        "texts": texts_all[:30]
    }
    preview = " | ".join(texts_all[:8])
    print(f"{fname} ({len(doc)} p): {preview}")
    sys.stdout.flush()

with open('d:/Work/E-Learning/pdf_analysis_cache.json', 'w', encoding='utf-8') as f:
    json.dump(cache, f, ensure_ascii=False, indent=2)
print("Finished unresolved.")
