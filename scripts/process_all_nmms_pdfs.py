import os
import sys
import io
import base64
import http.server
import socketserver
import threading
import subprocess
import fitz
from PIL import Image

ROOT_DIR = r"d:\Work\E-Learning"
TARGET_DIR = r"C:\Users\Orange\Downloads\New folder"
LOGO_PATH = os.path.join(ROOT_DIR, "public", "logo-circle-transparent.png")
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# 1. Prepare Watermark & Small Header Logo Bytes
print("Preparing branding assets...")
im_logo = Image.open(LOGO_PATH).convert("RGBA")

# Center watermark (10% opacity)
r, g, b, a = im_logo.split()
a_wm = a.point(lambda p: int(p * 0.10))
im_wm = Image.merge("RGBA", (r, g, b, a_wm))
buf_wm = io.BytesIO()
im_wm.save(buf_wm, format="PNG")
WATERMARK_BYTES = buf_wm.getvalue()

# Small header logo (size 64x64)
buf_small = io.BytesIO()
im_logo.resize((64, 64), Image.Resampling.LANCZOS).save(buf_small, format="PNG")
SMALL_LOGO_BYTES = buf_small.getvalue()

# Base64 logo for HTML cover
with open(LOGO_PATH, "rb") as f:
    LOGO_B64 = base64.b64encode(f.read()).decode("utf-8")

def generate_cover_pdf(year_str, output_pdf_path):
    """Generate high quality cover page PDF using headless Edge"""
    html_content = f"""<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&family=Poppins:wght@400;600;700;800&family=Yantramanav:wght@500;700;900&display=swap');
    
    @page {{
      size: A4;
      margin: 0;
    }}
    
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    
    body {{
      width: 210mm;
      height: 297mm;
      font-family: 'Poppins', 'Yantramanav', sans-serif;
      background: #ffffff;
      padding: 12mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #1e293b;
    }}
    
    .frame {{
      width: 100%;
      height: 100%;
      border: 3.5px solid #1e3a8a;
      outline: 1.5px solid #d97706;
      outline-offset: -7px;
      border-radius: 8px;
      padding: 10mm 12mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: linear-gradient(180deg, rgba(248,250,252,0.6) 0%, rgba(255,255,255,1) 40%, rgba(248,250,252,0.8) 100%);
    }}

    .top-header {{
      text-align: center;
    }}

    .logo-img {{
      width: 110px;
      height: 110px;
      margin: 0 auto 10px auto;
      display: block;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.12));
    }}

    .brand-name {{
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #1e3a8a;
      text-transform: uppercase;
      margin-bottom: 2px;
    }}

    .brand-sub {{
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      letter-spacing: 1px;
    }}

    .tagline {{
      margin-top: 6px;
      font-family: 'Tiro Devanagari Hindi', serif;
      font-size: 14px;
      color: #b45309;
      font-style: italic;
    }}

    .divider {{
      height: 2px;
      background: linear-gradient(90deg, transparent, #cbd5e1 20%, #d97706 50%, #cbd5e1 80%, transparent);
      margin: 12px 0 16px 0;
    }}

    .exam-card {{
      background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%);
      border: 1.5px solid #6366f1;
      border-radius: 12px;
      padding: 16px 20px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
    }}

    .exam-state {{
      font-family: 'Yantramanav', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #1e3a8a;
      margin-bottom: 4px;
    }}

    .exam-badge {{
      display: inline-block;
      font-size: 26px;
      font-weight: 800;
      color: #c2410c;
      letter-spacing: 1px;
      margin: 4px 0 6px 0;
    }}

    .exam-subtext {{
      font-size: 13px;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: 0.5px;
    }}

    .exam-parts {{
      font-family: 'Yantramanav', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #4f46e5;
      margin-top: 4px;
    }}

    .mentor-card {{
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 1.5px solid #f59e0b;
      border-radius: 10px;
      padding: 12px 18px;
      text-align: center;
      margin: 14px 0;
    }}

    .mentor-title {{
      font-family: 'Yantramanav', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: #92400e;
    }}

    .mentor-desc {{
      font-size: 12px;
      font-weight: 600;
      color: #78350f;
      margin-top: 2px;
    }}

    .connect-card {{
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 18px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }}

    .connect-heading {{
      font-family: 'Yantramanav', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      text-align: center;
      margin-bottom: 12px;
      border-bottom: 1px dashed #cbd5e1;
      padding-bottom: 6px;
    }}

    .channels-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      font-size: 11.5px;
    }}

    .channel-item {{
      display: flex;
      flex-direction: column;
      gap: 2px;
    }}

    .channel-label {{
      font-weight: 700;
      color: #1e3a8a;
      font-size: 11px;
    }}

    .channel-val {{
      color: #334155;
      font-weight: 500;
    }}

    .full-width {{
      grid-column: span 2;
    }}

    .footer-note {{
      text-align: center;
      font-size: 10.5px;
      color: #94a3b8;
      margin-top: 10px;
    }}
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
      <div class="exam-state">राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा</div>
      <div class="exam-badge">BIHAR NMMS — {year_str}</div>
      <div class="exam-subtext">ORIGINAL QUESTION PAPER & OFFICIAL ANSWER KEY</div>
      <div class="exam-parts">(MAT: मानसिक योग्यता परीक्षा &nbsp;|&nbsp; SAT: शैक्षिक योग्यता परीक्षा)</div>
    </div>

    <div class="mentor-card">
      <div class="mentor-title">मार्गदर्शक: श्रवण कुमार 'सागर' (Sagar Sir)</div>
      <div class="mentor-desc">Published Author & Founder, Sagar Coaching Centre | 7+ Years Experience</div>
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
    
    temp_html = os.path.join(ROOT_DIR, f"scratch_cover_{year_str}.html")
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    PORT = 8790 + (int(year_str) % 10)
    
    class SilentHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            pass

    httpd = socketserver.TCPServer(("127.0.0.1", PORT), SilentHandler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()

    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        f"--print-to-pdf={output_pdf_path}",
        "--no-pdf-header-footer",
        f"http://127.0.0.1:{PORT}/scratch_cover_{year_str}.html"
    ]
    subprocess.run(cmd, capture_output=True, text=True)
    httpd.shutdown()
    
    if os.path.exists(temp_html):
        os.remove(temp_html)


def brand_page(page, page_num, total_pages):
    """Applies Sagar Coaching Centre watermark, header, and footer to a page."""
    rect = page.rect
    
    # 1. Centered Watermark (Logo with 10% opacity)
    wm_size = min(rect.width, rect.height) * 0.55
    wm_rect = fitz.Rect(
        (rect.width - wm_size) / 2,
        (rect.height - wm_size) / 2,
        (rect.width + wm_size) / 2,
        (rect.height + wm_size) / 2
    )
    page.insert_image(wm_rect, stream=WATERMARK_BYTES, overlay=True)

    # 2. Header
    logo_rect = fitz.Rect(18, 7, 38, 27)
    page.insert_image(logo_rect, stream=SMALL_LOGO_BYTES, overlay=True)
    page.insert_text(
        fitz.Point(42, 19),
        "Sagar Coaching Centre Bhagwanpur | YouTube: NMMS King Sagar Sir",
        fontsize=8.5,
        color=(0.12, 0.23, 0.54) # Deep Indigo
    )

    # 3. Footer
    page.insert_text(
        fitz.Point(18, rect.height - 11),
        "WhatsApp / Helpline: +91 91101 13671 | sagarcoaching.tech",
        fontsize=7.8,
        color=(0.35, 0.35, 0.35)
    )
    page_text = f"Page {page_num} of {total_pages}"
    page.insert_text(
        fitz.Point(rect.width - 75, rect.height - 11),
        page_text,
        fontsize=7.8,
        color=(0.35, 0.35, 0.35)
    )


def process_scanned_pdf(src_path, output_path, year_str):
    """Processes 2023 / 2024 PDFs: strips aglasem overlay, extracts raw scanned images, adds cover and branding."""
    print(f"\n--- Processing Bihar NMMS {year_str} ---")
    print(f"Reading from: {src_path}")
    src_doc = fitz.open(src_path)
    
    # Generate cover page
    temp_cover_pdf = os.path.join(ROOT_DIR, f"temp_cover_{year_str}.pdf")
    generate_cover_pdf(year_str, temp_cover_pdf)
    cover_doc = fitz.open(temp_cover_pdf)

    new_doc = fitz.open()
    # Add cover page
    new_doc.insert_pdf(cover_doc)
    cover_doc.close()
    if os.path.exists(temp_cover_pdf):
        os.remove(temp_cover_pdf)

    total_content_pages = len(src_doc) - 1 # page 0 is aglasem cover
    print(f"Extracting and branding {total_content_pages} clean pages...")

    for i in range(1, len(src_doc)):
        p = src_doc[i]
        # Extract the scanned page image
        imgs = p.get_images()
        if not imgs:
            continue
        base_img = src_doc.extract_image(imgs[0][0])
        
        # New clean page with original dimensions
        new_page = new_doc.new_page(width=p.rect.width, height=p.rect.height)
        new_page.insert_image(new_page.rect, stream=base_img["image"])
        
        # Add branding
        brand_page(new_page, i, total_content_pages)
        if i % 10 == 0 or i == total_content_pages:
            print(f"  Processed page {i}/{total_content_pages}")

    new_doc.save(output_path, deflate=True)
    new_doc.close()
    src_doc.close()
    print(f"Saved: {output_path} ({os.path.getsize(output_path) / 1024 / 1024:.2f} MB)")


def process_vector_pdf(src_path, output_path, year_str):
    """Processes 2019 PDF: adds cover page, adds branding directly to vector pages."""
    print(f"\n--- Processing Bihar NMMS {year_str} ---")
    print(f"Reading from: {src_path}")
    src_doc = fitz.open(src_path)

    # Generate cover page
    temp_cover_pdf = os.path.join(ROOT_DIR, f"temp_cover_{year_str}.pdf")
    generate_cover_pdf(year_str, temp_cover_pdf)
    cover_doc = fitz.open(temp_cover_pdf)

    new_doc = fitz.open()
    # Add cover page
    new_doc.insert_pdf(cover_doc)
    cover_doc.close()
    if os.path.exists(temp_cover_pdf):
        os.remove(temp_cover_pdf)

    total_content_pages = len(src_doc)
    print(f"Branding {total_content_pages} pages...")

    for i in range(total_content_pages):
        p = src_doc[i]
        new_page = new_doc.new_page(width=p.rect.width, height=p.rect.height)
        new_page.show_pdf_page(new_page.rect, src_doc, i)
        brand_page(new_page, i + 1, total_content_pages)
        if (i + 1) % 10 == 0 or (i + 1) == total_content_pages:
            print(f"  Processed page {i + 1}/{total_content_pages}")

    new_doc.save(output_path, deflate=True)
    new_doc.close()
    src_doc.close()
    print(f"Saved: {output_path} ({os.path.getsize(output_path) / 1024 / 1024:.2f} MB)")


def main():
    f_2023 = os.path.join(TARGET_DIR, "985915f8-9a22-11f1-8a93-0aa932765c8b.pdf")
    f_2024 = os.path.join(TARGET_DIR, "9a48113e-9a22-11f1-b1a0-0aa932765c8b.pdf")
    f_2024_dup = os.path.join(TARGET_DIR, "9a48113e-9a22-11f1-b1a0-0aa932765c8b (1).pdf")
    f_2019 = os.path.join(TARGET_DIR, "2019  dce11114-3ddd-11eb-9838-02f21f5619c4.pdf")

    out_2024 = os.path.join(TARGET_DIR, "Bihar NMMS 2024 Question Paper with Answer Key.pdf")
    out_2023 = os.path.join(TARGET_DIR, "Bihar NMMS 2023 Question Paper with Answer Key.pdf")
    out_2019 = os.path.join(TARGET_DIR, "Bihar NMMS 2019 Question Paper with Answer Key.pdf")

    # 1. Process 2024
    if os.path.exists(f_2024):
        process_scanned_pdf(f_2024, out_2024, "2024")
    elif os.path.exists(f_2024_dup):
        process_scanned_pdf(f_2024_dup, out_2024, "2024")

    # 2. Process 2023
    if os.path.exists(f_2023):
        process_scanned_pdf(f_2023, out_2023, "2023")

    # 3. Process 2019
    if os.path.exists(f_2019):
        process_vector_pdf(f_2019, out_2019, "2019")

    print("\nVerifying all newly generated files...")
    new_files = [out_2019, out_2023, out_2024]
    all_ok = True
    for f in new_files:
        if os.path.exists(f) and os.path.getsize(f) > 100000:
            doc = fitz.open(f)
            print(f"Verified: {os.path.basename(f)} (Pages: {len(doc)}, Size: {os.path.getsize(f)/1024/1024:.2f} MB)")
            doc.close()
        else:
            print(f"ERROR: {f} missing or too small!")
            all_ok = False

    if all_ok:
        print("\nDeleting old unbranded / aglasem files as requested...")
        old_files = [f_2019, f_2023, f_2024, f_2024_dup]
        for f in old_files:
            if os.path.exists(f):
                try:
                    os.remove(f)
                    print(f"Deleted old file: {os.path.basename(f)}")
                except Exception as e:
                    print(f"Could not delete {f}: {e}")
        print("\nAll tasks completed successfully!")
    else:
        print("Aborting old file deletion due to verification failure.")

if __name__ == "__main__":
    main()
