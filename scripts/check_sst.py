import io
import sys
import glob
import fitz
import easyocr

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
reader = easyocr.Reader(['hi', 'en'], gpu=False, verbose=False)

def check_pdf(pdf_path, name):
    doc = fitz.open(pdf_path)
    print(f"=== {name} ({len(doc)} pages) ===")
    for p in range(min(2, len(doc))):
        pix = doc[p].get_pixmap(dpi=90)
        img_bytes = pix.tobytes("png")
        res = reader.readtext(img_bytes)
        txts = [r[1] for r in res if r[2] > 0.3]
        print(f"  P{p+1}: {' // '.join(txts[:8])}")
    print()

up_pdf = r"C:\Users\Orange\Downloads\New folder\01_NMMS_Previous_Year_Question_Papers\NMMS_2025_UP_Official_Question_Paper_12p.pdf"
check_pdf(up_pdf, "UP 2025 Official")

sst_files = glob.glob(r"C:\Users\Orange\Downloads\New folder\02_NMMS_Subjectwise_Study_Material\*Social_Science*.pdf")
for sf in sst_files:
    fname = sf.split("\\")[-1]
    check_pdf(sf, fname)
