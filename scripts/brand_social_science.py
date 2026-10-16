import os
import sys
import io
import base64
import subprocess
import fitz
from PIL import Image

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

ROOT_DIR = r"d:\Work\E-Learning"
LOGO_PATH = os.path.join(ROOT_DIR, "public", "logo-circle-transparent.png")
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
STUDY_DIR = r"C:\Users\Orange\Downloads\New folder\02_NMMS_Subjectwise_Study_Material"
OUT_DIR = os.path.join(STUDY_DIR, "Sagar_Sir_Branded_SST")
os.makedirs(OUT_DIR, exist_ok=True)

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

def generate_cover_pdf(title_main, exam_badge, sub_title, output_pdf_path, temp_html_name="scratch_cover_sst.html"):
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
    .exam-badge {{ display: inline-block; font-size: 25px; font-weight: 800; color: #c2410c; letter-spacing: 0.5px; margin: 4px 0 6px 0; }}
    .exam-subtext {{ font-size: 13px; font-weight: 700; color: #1f2937; letter-spacing: 0.5px; }}
    .exam-parts {{ font-size: 13.5px; font-weight: 600; color: #4f46e5; margin-top: 4px; }}
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
      <div class="exam-state">{title_main}</div>
      <div class="exam-badge">{exam_badge}</div>
      <div class="exam-subtext">NMMS EXAM TOP-SCORING STUDY MATERIAL & PRACTICE SET</div>
      <div class="exam-parts">{sub_title}</div>
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
    temp_html = os.path.join(ROOT_DIR, temp_html_name)
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

sst_files = [
    {
        "filename": "NMMS_SAT_Social_Science_History_Civics_Geo_23p.pdf",
        "title_main": "NMMS SAT — सामाजिक विज्ञान (इतिहास स्पेशल)",
        "badge": "इतिहास (History) — मध्यकालीन एवं आधुनिक भारत",
        "sub": "अरब आक्रमण, दिल्ली सल्तनत, मुग़ल काल, प्रमुख पुस्तकें एवं लेखक (23 Pages)",
        "out_name": "NMMS_Social_Science_01_History_Medieval_Modern_23p_SagarSir.pdf"
    },
    {
        "filename": "NMMS_SAT_Social_Science_History_Civics_Geo_19p.pdf",
        "title_main": "NMMS SAT — सामाजिक विज्ञान (आधुनिक भारत व समाज सुधार)",
        "badge": "सामाजिक सुधार आंदोलन व किसान सत्याग्रह",
        "sub": "आर्य समाज, वेदों की ओर लौटो, रैयतवाड़ी व्यवस्था, 1857 क्रांति (19 Pages)",
        "out_name": "NMMS_Social_Science_02_Modern_History_Reforms_19p_SagarSir.pdf"
    },
    {
        "filename": "NMMS_SAT_Social_Science_History_Civics_Geo_14p_Doc338.pdf",
        "title_main": "NMMS SAT — सामाजिक विज्ञान (नागरिक शास्त्र / संविधान)",
        "badge": "भारतीय संविधान एवं शासन व्यवस्था (Civics)",
        "sub": "संविधान सभा, संघात्मक शासन, मौलिक अधिकार, न्यायपालिका व संसद (14 Pages)",
        "out_name": "NMMS_Social_Science_03_Civics_Constitution_14p_SagarSir.pdf"
    },
    {
        "filename": "NMMS_SAT_Social_Science_History_Civics_Geo_12p.pdf",
        "title_main": "NMMS SAT — सामाजिक विज्ञान (भूगोल / Geography)",
        "badge": "भूगोल — संसाधन, ऊर्जा, खनिज एवं पर्यावरण",
        "sub": "काला सोना, नवीकरणीय संसाधन, खनिज, मिट्टी व जलवायु (12 Pages)",
        "out_name": "NMMS_Social_Science_04_Geography_Resources_12p_SagarSir.pdf"
    },
    {
        "filename": "NMMS_SAT_Social_Science_History_Civics_Geo_8p.pdf",
        "title_main": "NMMS SAT — सामाजिक विज्ञान (राष्ट्रीय आंदोलन स्पेशल)",
        "badge": "भारतीय राष्ट्रीय कांग्रेस व स्वतंत्रता संग्राम",
        "sub": "1885 कांग्रेस अधिवेशन, प्रमुख समाज व नेता, खोज एवं क्रांतियां (8 Pages)",
        "out_name": "NMMS_Social_Science_05_National_Movement_8p_SagarSir.pdf"
    },
    {
        "filename": "NMMS_SAT_Social_Science_History_Civics_Geo_14p.pdf",
        "title_main": "NMMS SAT — सामाजिक विज्ञान (प्रमुख संगठन व सुधारक)",
        "badge": "प्रमुख सामाजिक-धार्मिक संगठन एवं कालक्रम",
        "sub": "ब्रह्म समाज, प्रार्थना समाज, सत्यशोधक समाज, महत्वपूर्ण वर्ष (14 Pages)",
        "out_name": "NMMS_Social_Science_06_Organizations_Timeline_14p_SagarSir.pdf"
    },
    {
        "filename": "NMMS_SAT_Civics_Supreme_Court_Judiciary_Notes_1p.pdf",
        "title_main": "NMMS SAT — नागरिक शास्त्र (न्यायपालिका स्पेशल)",
        "badge": "सर्वोच्च न्यायालय (Supreme Court) एवं न्यायिक प्रणाली",
        "sub": "मुख्य न्यायाधीश, न्यायालय की शक्तियां एवं कार्य (1 Page Quick Notes)",
        "out_name": "NMMS_Social_Science_07_Supreme_Court_Judiciary_1p_SagarSir.pdf"
    },
    {
        "filename": "NMMS_SAT_Geography_Class_7_Our_Environment_11p.pdf",
        "title_main": "NMMS SAT — भूगोल (हमारा पर्यावरण)",
        "badge": "NCERT Class 7 भूगोल — हमारा पर्यावरण",
        "sub": "वायुमंडल, जलमंडल, स्थलमंडल व जैवमंडल महत्वपूर्ण प्रश्न (11 Pages)",
        "out_name": "NMMS_Social_Science_08_NCERT_Environment_Geo_11p_SagarSir.pdf"
    }
]

for idx, item in enumerate(sst_files):
    in_path = os.path.join(STUDY_DIR, item["filename"])
    if not os.path.exists(in_path):
        print(f"Skipping {item['filename']} (not found)")
        continue
    
    out_path = os.path.join(OUT_DIR, item["out_name"])
    print(f"Processing [{idx+1}/{len(sst_files)}] {item['out_name']}...")
    
    temp_cover_path = os.path.join(ROOT_DIR, f"temp_sst_cover_{idx}.pdf")
    generate_cover_pdf(item["title_main"], item["badge"], item["sub"], temp_cover_path, f"cover_sst_{idx}.html")
    
    src_doc = fitz.open(in_path)
    cover_doc = fitz.open(temp_cover_path)
    
    new_doc = fitz.open()
    new_doc.insert_pdf(cover_doc)
    cover_doc.close()
    if os.path.exists(temp_cover_path):
        os.remove(temp_cover_path)
        
    total_p = len(src_doc)
    for pno in range(total_p):
        p = src_doc[pno]
        new_page = new_doc.new_page(width=p.rect.width, height=p.rect.height)
        new_page.show_pdf_page(new_page.rect, src_doc, pno)
        brand_page(new_page, pno + 1, total_p)
        
    new_doc.save(out_path, deflate=True)
    new_doc.close()
    src_doc.close()
    print(f"  --> Saved: {out_path} ({total_p + 1} pages)")

print("\nSUCCESS! All Social Science PDFs branded with Sagar Coaching Centre design.")
