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
OUT_DIR = r"C:\Users\Orange\Downloads\New folder\01_NMMS_Previous_Year_Question_Papers\Sagar_Sir_Branded_PYQs"
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

def generate_cover_pdf(title_main, exam_badge, sub_title, output_pdf_path):
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
    temp_html = os.path.join(ROOT_DIR, "scratch_temp_cover.html")
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

# Test on 2025 UP Paper
sample_in = r"C:\Users\Orange\Downloads\New folder\01_NMMS_Previous_Year_Question_Papers\NMMS_2025_UP_Official_Question_Paper_12p.pdf"
sample_out = os.path.join(OUT_DIR, "UP_NMMS_2025_Official_Question_Paper_SagarSir.pdf")

print("Generating cover...")
temp_cover = os.path.join(ROOT_DIR, "temp_c.pdf")
generate_cover_pdf("राष्ट्रीय आय एवं योग्यता आधारित छात्रवृत्ति परीक्षा", "UP NMMS — 2025", "(MAT: मानसिक योग्यता  |  SAT: शैक्षिक योग्यता परीक्षा)", temp_cover)

src_doc = fitz.open(sample_in)
cover_doc = fitz.open(temp_cover)

new_doc = fitz.open()
new_doc.insert_pdf(cover_doc)
cover_doc.close()
if os.path.exists(temp_cover):
    os.remove(temp_cover)

total_p = len(src_doc)
print(f"Branding {total_p} content pages...")
for i in range(total_p):
    p = src_doc[i]
    new_page = new_doc.new_page(width=p.rect.width, height=p.rect.height)
    new_page.show_pdf_page(new_page.rect, src_doc, i)
    brand_page(new_page, i + 1, total_p)

new_doc.save(sample_out, deflate=True)
new_doc.close()
src_doc.close()
print("Saved branded sample:", sample_out)
