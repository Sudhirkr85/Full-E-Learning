import os
import sys
import io
import re
import base64
import subprocess
import fitz
from PIL import Image

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ROOT_DIR = r"d:\Work\E-Learning"
BASE_DIR = r"C:\Users\Orange\Downloads\New folder"
LOGO_PATH = os.path.join(ROOT_DIR, "public", "logo-circle-transparent.png")
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# 1. Prepare branding assets
im_logo = Image.open(LOGO_PATH).convert("RGBA")
r, g, b, a = im_logo.split()
a_wm = a.point(lambda p: int(p * 0.10))
im_wm = Image.merge("RGBA", (r, g, b, a_wm))
buf_wm = io.BytesIO()
im_wm.save(buf_wm, format="PNG")
WATERMARK_BYTES = buf_wm.getvalue()

buf_small = io.BytesIO()
im_logo.resize((64, 64), Image.Resampling.LANCZOS).save(buf_small, format="PNG")
SMALL_LOGO_BYTES = buf_small.getvalue()

with open(LOGO_PATH, "rb") as f:
    LOGO_B64 = base64.b64encode(f.read()).decode("utf-8")

CATEGORIES = {
    "MAT": {
        "title_main": "NMMS MAT — मानसिक योग्यता परीक्षा",
        "badge": "मानसिक योग्यता परीक्षा (Mental Ability Test — 90 Marks)",
        "sub": "रीजनिंग, कोडिंग-डिकोडिंग, पासा, श्रृंखला एवं वेन आरेख अभ्यास"
    },
    "SCIENCE": {
        "title_main": "NMMS SAT — सामान्य विज्ञान (General Science)",
        "badge": "भौतिकी, रसायन एवं जीव विज्ञान (NCERT Class 7 & 8)",
        "sub": "एनसीईआरटी आधारित महत्वपूर्ण वस्तुनिष्ठ प्रश्न एवं व्याख्या"
    },
    "MATH": {
        "title_main": "NMMS SAT — गणित (Mathematics)",
        "badge": "गणित अध्यायवार अभ्यास एवं विगत वर्षों के हल प्रश्न",
        "sub": "Class 7 & 8 NCERT गणित फॉर्मूला, ट्रिक्स एवं अभ्यास प्रश्न"
    },
    "SST": {
        "title_main": "NMMS SAT — सामाजिक विज्ञान (Social Science)",
        "badge": "इतिहास, भूगोल एवं नागरिक शास्त्र (NCERT Class 7 & 8)",
        "sub": "35 अंक पक्के करने हेतु महत्वपूर्ण अध्यायवार नोट्स एवं प्रश्नोत्तरी"
    },
    "PRACTICE": {
        "title_main": "NMMS महा-अभ्यास मॉडल प्रश्न पत्र",
        "badge": "MAT + SAT सम्पूर्ण अभ्यास प्रश्नोत्तरी (180 Marks)",
        "sub": "परीक्षा पैटर्न पर आधारित संपूर्ण मॉडल सेट एवं हल सहित अभ्यास"
    },
    "SAV": {
        "title_main": "सिमुलतला आवासीय विद्यालय (SAV) प्रवेश परीक्षा",
        "badge": "SAV Entrance Exam Solved Papers & Practice Sets",
        "sub": "प्रारंभिक एवं मुख्य परीक्षा हेतु सागर कोचिंग सेंटर स्पेशल नोट्स"
    },
    "NAVODAYA": {
        "title_main": "नवोदय एवं सैनिक स्कूल प्रवेश परीक्षा",
        "badge": "JNVST & Sainik School Entrance Examination Guide",
        "sub": "मानसिक योग्यता, गणित एवं भाषा ज्ञान विशेष अध्ययन सामग्री"
    },
    "RAMANUJAN": {
        "title_main": "रामानुजन टैलेंट सर्च टेस्ट इन मैथमेटिक्स (TSMS)",
        "badge": "बिहार विज्ञान एवं प्रौद्योगिकी परिषद (BCST) स्पेशल",
        "sub": "कक्षा 6 से 10 तक के मेधावी छात्रों हेतु गणित प्रतियोगिता प्रश्न पत्र"
    },
    "OTHER": {
        "title_main": "प्रतियोगिता एवं बोर्ड परीक्षा विशेष अध्ययन सामग्री",
        "badge": "Scholarship & Board Examination Preparation Material",
        "sub": "कक्षा 8, 9 एवं 10 हेतु सागर कोचिंग सेंटर विशेष प्रश्न बैंक"
    },
    "NOTICE": {
        "title_main": "राष्ट्रीय आय-सह-मेधा छात्रवृत्ति (NMMS) विवरण",
        "badge": "Official Notification, Prescribed Syllabus & Answer Key",
        "sub": "परीक्षा दिशा-निर्देश, पात्रता एवं संपूर्ण पाठ्यक्रम विवरण"
    }
}

def generate_cover_pdf(cat_key, output_pdf_path):
    cat = CATEGORIES[cat_key]
    html_content = f"""<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <style>
    @page {{ size: A4; margin: 0; }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      width: 210mm;
      height: 297mm;
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #ffffff;
      padding: 12mm;
      color: #1e293b;
    }}
    .frame {{
      width: 100%;
      height: 100%;
      border: 3.5px solid #1e3a8a;
      outline: 2px solid #d97706;
      outline-offset: -7px;
      border-radius: 8px;
      padding: 10mm 12mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 40%, #f8fafc 100%);
    }}
    .top-header {{ text-align: center; }}
    .logo-img {{ width: 110px; height: 110px; margin: 0 auto 10px auto; display: block; }}
    .brand-name {{ font-size: 26px; font-weight: 800; letter-spacing: 1.5px; color: #1e3a8a; text-transform: uppercase; }}
    .brand-sub {{ font-size: 13px; font-weight: 600; color: #475569; letter-spacing: 1px; }}
    .tagline {{ margin-top: 6px; font-size: 14px; color: #b45309; font-style: italic; font-weight: 600; }}
    .divider {{ height: 2px; background: linear-gradient(90deg, transparent, #cbd5e1 20%, #d97706 50%, #cbd5e1 80%, transparent); margin: 12px 0 16px 0; }}
    .exam-card {{
      background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
      border: 1.5px solid #6366f1;
      border-radius: 12px;
      padding: 16px 20px;
      text-align: center;
    }}
    .exam-state {{ font-size: 18px; font-weight: 700; color: #1e3a8a; margin-bottom: 4px; }}
    .exam-badge {{ display: inline-block; font-size: 24px; font-weight: 800; color: #c2410c; letter-spacing: 0.5px; margin: 4px 0 6px 0; }}
    .exam-subtext {{ font-size: 13px; font-weight: 700; color: #1f2937; letter-spacing: 0.5px; }}
    .exam-parts {{ font-size: 13px; font-weight: 600; color: #4f46e5; margin-top: 4px; }}
    .mentor-card {{
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 1.5px solid #f59e0b;
      border-radius: 10px;
      padding: 12px 18px;
      text-align: center;
      margin: 14px 0;
    }}
    .mentor-title {{ font-size: 17px; font-weight: 700; color: #92400e; }}
    .mentor-desc {{ font-size: 12px; font-weight: 600; color: #78350f; margin-top: 2px; }}
    .connect-card {{
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 18px;
    }}
    .connect-heading {{
      font-size: 15px; font-weight: 700; color: #0f172a; text-align: center; margin-bottom: 12px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 6px;
    }}
    .channels-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11.5px; }}
    .channel-item {{ display: flex; flex-direction: column; gap: 2px; }}
    .channel-label {{ font-weight: 700; color: #1e3a8a; font-size: 11px; }}
    .channel-val {{ color: #334155; font-weight: 500; }}
    .full-width {{ grid-column: span 2; }}
    .footer-note {{ text-align: center; font-size: 10.5px; color: #94a3b8; margin-top: 10px; }}
  </style>
</head>
<body>
  <div class="frame">
    <div class="top-header">
      <img src="data:image/png;base64,{LOGO_B64}" class="logo-img" alt="Logo">
      <div class="brand-name">Sagar Coaching Centre</div>
      <div class="brand-sub">BHAGWANPUR, SUPAUL (BIHAR)</div>
      <div class="tagline">"माना कि अंधेरा घना है, पर दीया जलाना कहां मना है"</div>
    </div>
    <div class="divider"></div>
    <div class="exam-card">
      <div class="exam-state">{cat['title_main']}</div>
      <div class="exam-badge">{cat['badge']}</div>
      <div class="exam-subtext">NMMS & COMPETITIVE EXAM TOP-SCORING STUDY MATERIAL</div>
      <div class="exam-parts">{cat['sub']}</div>
    </div>
    <div class="mentor-card">
      <div class="mentor-title">मार्गदर्शक: श्रवण कुमार 'सागर' (Sagar Sir)</div>
      <div class="mentor-desc">Published Author & Founder, Sagar Coaching Centre | 7+ Years NMMS Specialist</div>
    </div>
    <div class="connect-card">
      <div class="connect-heading">ऑनलाइन तैयारी व संपूर्ण सहायता के लिए जुड़ें</div>
      <div class="channels-grid">
        <div class="channel-item">
          <span class="channel-label">YouTube Channels:</span>
          <span class="channel-val">Sagar Coaching Centre Bhagwanpur<br>NMMS King Sagar Sir</span>
        </div>
        <div class="channel-item">
          <span class="channel-label">Android Mobile App:</span>
          <span class="channel-val">Sagar Coaching Centre<br>(Google Play Store)</span>
        </div>
        <div class="channel-item">
          <span class="channel-label">Official Website:</span>
          <span class="channel-val">https://sagarcoaching.tech</span>
        </div>
        <div class="channel-item">
          <span class="channel-label">WhatsApp / Helpline:</span>
          <span class="channel-val">+91 91101 13671<br>(Direct Student Support)</span>
        </div>
        <div class="channel-item full-width">
          <span class="channel-label">VIP Telegram Alert:</span>
          <span class="channel-val">NMMS 2026-27 Alert & Study Material (@ShrvanKumarSagar)</span>
        </div>
        <div class="channel-item full-width">
          <span class="channel-label">Coaching Address:</span>
          <span class="channel-val">NH 106, Bhagwanpur, Supaul, Bihar — 854338</span>
        </div>
      </div>
    </div>
    <div class="footer-note">
      © Sagar Coaching Centre Bhagwanpur | All Rights Reserved | Founder: Shrvan Kumar Sagar
    </div>
  </div>
</body>
</html>"""
    temp_html = os.path.join(ROOT_DIR, f"temp_{cat_key}.html")
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        f"--print-to-pdf={output_pdf_path}",
        "--no-pdf-header-footer",
        temp_html
    ]
    subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(temp_html):
        os.remove(temp_html)

def brand_page(page, page_num, total_pages):
    rect = page.rect
    wm_size = min(rect.width, rect.height) * 0.55
    wm_rect = fitz.Rect(
        (rect.width - wm_size) / 2,
        (rect.height - wm_size) / 2,
        (rect.width + wm_size) / 2,
        (rect.height + wm_size) / 2
    )
    page.insert_image(wm_rect, stream=WATERMARK_BYTES, overlay=True)

    # Header
    logo_rect = fitz.Rect(18, 7, 38, 27)
    page.insert_image(logo_rect, stream=SMALL_LOGO_BYTES, overlay=True)
    page.insert_text(
        fitz.Point(42, 19),
        "Sagar Coaching Centre Bhagwanpur | YouTube: NMMS King Sagar Sir",
        fontsize=8.5,
        color=(0.12, 0.23, 0.54)
    )

    # Footer
    page.insert_text(
        fitz.Point(18, rect.height - 11),
        "WhatsApp / Helpline: +91 91101 13671 | sagarcoaching.tech",
        fontsize=7.8,
        color=(0.35, 0.35, 0.35)
    )
    page.insert_text(
        fitz.Point(rect.width - 75, rect.height - 11),
        f"Page {page_num} of {total_pages}",
        fontsize=7.8,
        color=(0.35, 0.35, 0.35)
    )

def classify_pdf(folder_name, filename):
    fn = filename.lower()
    if folder_name == "04_Simultala_Awasiya_Vidyalaya_SAV":
        return "SAV"
    if folder_name == "05_Navodaya_and_Sainik_School":
        return "NAVODAYA"
    if folder_name == "06_Talent_Search_TSMS_Ramanujan_Math":
        return "RAMANUJAN"
    if folder_name == "03_NMMS_Official_Notifications_and_Syllabus":
        return "NOTICE"
    if folder_name == "07_Other_Exams_and_Scholarships":
        return "OTHER"
    
    # In 02_NMMS_Subjectwise_Study_Material:
    if "mat" in fn or "reasoning" in fn or "analogy" in fn or "coding" in fn or "cube" in fn or "missing" in fn or "venn" in fn:
        return "MAT"
    if "biology" in fn or "physics" in fn or "science" in fn or "solar" in fn or "nutrition" in fn:
        return "SCIENCE"
    if "math" in fn or "square" in fn:
        return "MATH"
    if "social" in fn or "civics" in fn or "geography" in fn or "history" in fn:
        return "SST"
    if "booklet" in fn or "model" in fn or "residential" in fn or "exam" in fn:
        return "PRACTICE"
    return "SCIENCE" # default fallback for Class 8 study material docs

# Step 1: Pre-generate all 10 cover templates
cover_cache = {}
print("Generating 10 Cover Templates...")
temp_cover_dir = os.path.join(ROOT_DIR, "prebuilt_covers")
os.makedirs(temp_cover_dir, exist_ok=True)

for cat_key in CATEGORIES.keys():
    c_path = os.path.join(temp_cover_dir, f"cover_{cat_key}.pdf")
    if not os.path.exists(c_path):
        print(f"  Rendering cover for: {cat_key}...")
        generate_cover_pdf(cat_key, c_path)
    cover_cache[cat_key] = fitz.open(c_path)

print("Cover templates ready!\n")

# Folders to process
TARGET_FOLDERS = [
    "02_NMMS_Subjectwise_Study_Material",
    "03_NMMS_Official_Notifications_and_Syllabus",
    "04_Simultala_Awasiya_Vidyalaya_SAV",
    "05_Navodaya_and_Sainik_School",
    "06_Talent_Search_TSMS_Ramanujan_Math",
    "07_Other_Exams_and_Scholarships"
]

total_processed = 0
total_skipped = 0

for folder in TARGET_FOLDERS:
    src_folder = os.path.join(BASE_DIR, folder)
    out_folder = os.path.join(src_folder, "Sagar_Sir_Branded")
    os.makedirs(out_folder, exist_ok=True)
    
    pdf_files = sorted([f for f in os.listdir(src_folder) if f.lower().endswith(".pdf") and not f.startswith("Sagar_Sir")])
    print(f"\n==========================================")
    print(f"Processing Folder: {folder} ({len(pdf_files)} PDFs)")
    print(f"Output: {out_folder}")
    print(f"==========================================")
    
    for idx, fname in enumerate(pdf_files):
        in_path = os.path.join(src_folder, fname)
        
        # Determine out name
        base_no_ext = os.path.splitext(fname)[0]
        if not base_no_ext.endswith("_SagarSir"):
            out_name = f"{base_no_ext}_SagarSir.pdf"
        else:
            out_name = f"{base_no_ext}.pdf"
            
        out_path = os.path.join(out_folder, out_name)
        if os.path.exists(out_path):
            total_skipped += 1
            continue
            
        cat_key = classify_pdf(folder, fname)
        cover_doc = cover_cache[cat_key]
        
        try:
            src_doc = fitz.open(in_path)
            new_doc = fitz.open()
            
            # Don't add cover if it's already a Sagar poster or a 1-page circular where cover is unnecessary
            if "poster" not in fname.lower():
                new_doc.insert_pdf(cover_doc)
                
            total_p = len(src_doc)
            for pno in range(total_p):
                p = src_doc[pno]
                new_page = new_doc.new_page(width=p.rect.width, height=p.rect.height)
                new_page.show_pdf_page(new_page.rect, src_doc, pno)
                brand_page(new_page, pno + 1, total_p)
                
            new_doc.save(out_path, deflate=True)
            new_doc.close()
            src_doc.close()
            total_processed += 1
            print(f"[{idx+1}/{len(pdf_files)}] Branded: {out_name} ({total_p} pgs, Cat: {cat_key})")
            sys.stdout.flush()
            
        except Exception as e:
            print(f"[{idx+1}/{len(pdf_files)}] ERROR on {fname}: {e}")
            sys.stdout.flush()

for doc in cover_cache.values():
    doc.close()

print(f"\n==========================================")
print(f"COMPLETE! Processed {total_processed} PDFs (Skipped already done: {total_skipped})")
print(f"All study material PDFs are now branded with Sagar Coaching Centre design!")
print(f"==========================================")
