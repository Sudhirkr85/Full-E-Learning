import os
import io
import fitz
from PIL import Image, ImageDraw, ImageFont

ROOT_DIR = r"d:\Work\E-Learning"
LOGO_PATH = os.path.join(ROOT_DIR, "public", "logo-circle-transparent.png")
OUTPUT_FOLDER = r"C:\Users\Orange\Downloads\New folder\Sagar_Coaching_Branded_PDFs"
SOURCE_FOLDER = r"C:\Users\Orange\Downloads\New folder"

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def create_cover_image(year_str):
    width, height = 1240, 1754 # A4 proportions at ~150 DPI
    img = Image.new('RGB', (width, height), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Borders
    draw.rectangle([20, 20, width-20, height-20], outline=(30, 58, 138), width=5)
    draw.rectangle([28, 28, width-28, height-28], outline=(217, 119, 6), width=2)

    # Fonts
    font_lg = ImageFont.truetype(r'C:\Windows\Fonts\Nirmala.ttc', 38)
    font_md = ImageFont.truetype(r'C:\Windows\Fonts\Nirmala.ttc', 26)
    font_sm = ImageFont.truetype(r'C:\Windows\Fonts\Nirmala.ttc', 21)
    font_arial_bold = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 44)
    font_arial_sub = ImageFont.truetype(r'C:\Windows\Fonts\arialbd.ttf', 24)

    # Logo
    if os.path.exists(LOGO_PATH):
        logo = Image.open(LOGO_PATH).convert('RGBA')
        logo_size = 210
        logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        img.paste(logo_resized, ((width - logo_size) // 2, 60), logo_resized)

    def draw_centered(y, text, font, fill):
        bbox = draw.textbbox((0, 0), text, font=font)
        w = bbox[2] - bbox[0]
        draw.text(((width - w) // 2, y), text, font=font, fill=fill)

    # Academy branding
    draw_centered(290, "SAGAR COACHING CENTRE", font_arial_bold, (30, 58, 138))
    draw_centered(350, "BHAGWANPUR, SUPAUL (BIHAR)", font_arial_sub, (75, 85, 99))
    draw_centered(390, "माना कि अंधेरा घना है, पर दीया जलाना कहां मना है", font_sm, (180, 83, 9))

    # Divider
    draw.line([(80, 440), (width - 80, 440)], fill=(209, 213, 219), width=2)
    draw.line([(width//2 - 70, 439), (width//2 + 70, 439)], fill=(217, 119, 6), width=4)

    # Main Exam Box
    draw.rounded_rectangle([70, 470, width-70, 740], radius=16, fill=(238, 242, 255), outline=(99, 102, 241), width=2)
    draw_centered(495, "राज्य स्तरीय राष्ट्रीय आय-सह-मेधा छात्रवृत्ति परीक्षा", font_lg, (30, 58, 138))
    draw_centered(555, f"BIHAR NMMS — {year_str}", font_arial_bold, (194, 65, 12))
    draw_centered(620, "ORIGINAL QUESTION PAPER & OFFICIAL ANSWER KEY", font_arial_sub, (31, 41, 55))
    draw_centered(665, "(MAT: मानसिक योग्यता परीक्षा  +  SAT: शैक्षिक योग्यता परीक्षा)", font_md, (79, 70, 229))

    # Mentorship Card
    draw.rounded_rectangle([70, 770, width-70, 930], radius=16, fill=(254, 243, 199), outline=(245, 158, 11), width=2)
    draw_centered(795, "मार्गदर्शक: श्रवण कुमार 'सागर' (Sagar Sir)", font_lg, (146, 64, 14))
    draw_centered(850, "Published Author & Founder, Sagar Coaching Centre", font_arial_sub, (120, 53, 15))
    draw_centered(888, "India's Trusted Online Scholarship Exam Coaching", font_sm, (146, 64, 14))

    # Platform links box
    draw.rounded_rectangle([70, 960, width-70, 1590], radius=16, fill=(249, 250, 251), outline=(229, 231, 235), width=2)
    draw_centered(990, "ऑनलाइन तैयारी व संपूर्ण सहायता के लिए जुड़ें:", font_lg, (17, 24, 39))

    items = [
        ("YouTube Channels:", "Sagar Coaching Centre Bhagwanpur | NMMS King Sagar Sir"),
        ("Android Mobile App:", "Sagar Coaching Centre (Available on Google Play Store)"),
        ("Official Website:", "https://sagarcoaching.tech"),
        ("VIP Telegram Channel:", "NMMS 2026-27 Alert & Study Material (@ShrvanKumarSagar)"),
        ("WhatsApp / Helpline:", "+91 91101 13671 (Direct Student Support)"),
        ("Coaching Address:", "NH 106, Bhagwanpur, Supaul, Bihar — 854338"),
    ]

    cur_y = 1050
    for label, val in items:
        draw.text((105, cur_y), label, font=font_arial_sub, fill=(30, 58, 138))
        draw.text((105, cur_y + 35), val, font=font_sm, fill=(55, 65, 81))
        cur_y += 85

    # Footer
    draw_centered(1630, "© Sagar Coaching Centre Bhagwanpur | All Rights Reserved", font_sm, (156, 163, 175))

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=95)
    return buf.getvalue()

if __name__ == "__main__":
    b = create_cover_image("2024")
    with open("scratch_cover_2024.jpg", "wb") as f:
        f.write(b)
    print("Cover generated and saved as scratch_cover_2024.jpg")
