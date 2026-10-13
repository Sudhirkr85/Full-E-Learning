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
LOGO_PATH = os.path.join(ROOT_DIR, "public", "logo-circle-transparent.png")
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
PYQ_DIR = r"C:\Users\Orange\Downloads\New folder\01_NMMS_Previous_Year_Question_Papers"
OUT_DIR = os.path.join(PYQ_DIR, "Sagar_Sir_Branded_PYQs")
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

def generate_cover_pdf(title_main, exam_badge, sub_title, output_pdf_path, temp_html_name="scratch_cover.html"):
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
    .exam-badge {{ display: inline-block; font-size: 26px; font-weight: 800; color: #c2410c; letter-spacing: 1px; margin: 4px 0 6px 0; }}
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
      <div class="exam-state">{title_main}</div>
      <div class="exam-badge">{exam_badge}</div>
      <div class="exam-subtext">ORIGINAL QUESTION PAPER & OFFICIAL ANSWER KEY</div>
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

pdf_files = sorted([f for f in os.listdir(PYQ_DIR) if f.lower().endswith('.pdf')])
print(f"Total PYQ papers to brand: {len(pdf_files)}")

set_idx = 1
for idx, fname in enumerate(pdf_files):
    in_path = os.path.join(PYQ_DIR, fname)
    
    # Determine titles
    m_year = re.search(r'(20\d\d)', fname)
    year = m_year.group(1) if m_year else None

    state_str = "BIHAR NMMS"
    state_prefix = "BIHAR"
    if "UP" in fname or "Uttar Pradesh" in fname:
        state_str = "UP NMMS"
        state_prefix = "UP"
        
    m_p = re.search(r'(\d+)p', fname)
    p_str = f"{m_p.group(1)}p" if m_p else ""
    
    if "MAT" in fname:
        sub_title = "(MAT: मानसिक योग्यता परीक्षा — Mental Ability Test 90 Marks)"
        subj = "MAT"
    elif "SAT" in fname:
        sub_title = "(SAT: शैक्षिक योग्यता परीक्षा — Science, SST & Math 90 Marks)"
        subj = "SAT"
    else:
        sub_title = "(MAT + SAT: मानसिक योग्यता एवं शैक्षिक योग्यता परीक्षा सम्पूर्ण)"
        subj = "Full_Paper"
        
    if year:
        exam_badge = f"{state_str} — {year}"
        out_name = f"{state_prefix}_NMMS_{year}_{subj}_{p_str}_SagarSir.pdf" if p_str else f"{state_prefix}_NMMS_{year}_{subj}_SagarSir.pdf"
    else:
        exam_badge = f"{state_str} — Official Paper Set {set_idx}"
        out_name = f"{state_prefix}_NMMS_Set_{set_idx:02d}_{subj}_{p_str}_SagarSir.pdf" if p_str else f"{state_prefix}_NMMS_Set_{set_idx:02d}_{subj}_SagarSir.pdf"
        set_idx += 1
        
    title_main = "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा"
    out_path = os.path.join(OUT_DIR, out_name)
    
    try:
        # Generate cover
        temp_cover_path = os.path.join(ROOT_DIR, f"temp_cover_{idx}.pdf")
        generate_cover_pdf(title_main, exam_badge, sub_title, temp_cover_path, f"cover_{idx}.html")
        
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
        print(f"[{idx+1}/{len(pdf_files)}] Successfully branded: {out_name} ({total_p + 1} pages)")
        sys.stdout.flush()
        
    except Exception as e:
        print(f"[{idx+1}/{len(pdf_files)}] Error branding {fname}: {e}")
        sys.stdout.flush()

print("\nAll NMMS PYQ papers have been branded with Sagar Coaching Centre design successfully!")
