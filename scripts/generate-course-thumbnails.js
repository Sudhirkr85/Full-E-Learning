const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. UP NMMS Thumbnail (1200x675 - 16:9)
const upSvg = `
<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#090d16"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ef4444"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#818cf8"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bgGrad)"/>

  <!-- Glow orbs -->
  <circle cx="1050" cy="150" r="220" fill="#4f46e5" opacity="0.25"/>
  <circle cx="150" cy="520" r="200" fill="#0284c7" opacity="0.2"/>
  <circle cx="950" cy="550" r="180" fill="#d97706" opacity="0.15"/>

  <!-- Grid lines -->
  <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
    <line x1="0" y1="135" x2="1200" y2="135"/>
    <line x1="0" y1="270" x2="1200" y2="270"/>
    <line x1="0" y1="405" x2="1200" y2="405"/>
    <line x1="0" y1="540" x2="1200" y2="540"/>
    <line x1="240" y1="0" x2="240" y2="675"/>
    <line x1="480" y1="0" x2="480" y2="675"/>
    <line x1="720" y1="0" x2="720" y2="675"/>
    <line x1="960" y1="0" x2="960" y2="675"/>
  </g>

  <!-- Top Brand Tag -->
  <rect x="80" y="60" width="330" height="42" rx="21" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.5)" stroke-width="1.5"/>
  <text x="105" y="87" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#a5b4fc" letter-spacing="2">SAGAR COACHING CENTRE</text>

  <!-- Free Badge -->
  <rect x="940" y="60" width="180" height="42" rx="21" fill="#10b981"/>
  <text x="968" y="87" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#ffffff" letter-spacing="1">100% FREE TEST</text>

  <!-- State Tag -->
  <rect x="80" y="135" width="220" height="38" rx="8" fill="url(#accentGrad)"/>
  <text x="100" y="160" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" letter-spacing="1">UP STATE EXAM</text>

  <!-- Main Headline -->
  <text x="80" y="245" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="900" fill="#ffffff">UP NMMS 2025-26</text>
  <text x="80" y="315" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800" fill="url(#cyanGrad)">राष्ट्रीय आय एवं योग्यता छात्रवृत्ति</text>
  <text x="80" y="375" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#e2e8f0">फुल-लेंथ ऑल-स्टेट मॉक टेस्ट सीरीज</text>

  <!-- Feature Pills Grid -->
  <g transform="translate(80, 430)">
    <!-- Pill 1 -->
    <rect x="0" y="0" width="240" height="68" rx="16" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="24" y="30" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#94a3b8" letter-spacing="1">PART - A</text>
    <text x="24" y="53" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="bold" fill="#38bdf8">MAT (90 प्रश्न)</text>

    <!-- Pill 2 -->
    <rect x="260" y="0" width="240" height="68" rx="16" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="284" y="30" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#94a3b8" letter-spacing="1">PART - B</text>
    <text x="284" y="53" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="bold" fill="#f59e0b">SAT (90 प्रश्न)</text>

    <!-- Pill 3 -->
    <rect x="520" y="0" width="260" height="68" rx="16" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="544" y="30" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#94a3b8" letter-spacing="1">RANKING</text>
    <text x="544" y="53" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="bold" fill="#10b981">लाइव स्टेट रैंक व हल</text>
  </g>

  <!-- Bottom Strip -->
  <rect x="80" y="545" width="1040" height="65" rx="14" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <circle cx="115" cy="577" r="14" fill="#6366f1"/>
  <text x="110" y="582" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">✓</text>
  <text x="140" y="583" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">कक्षा 8वीं के छात्रों हेतु विशेष ऑनलाइन परीक्षा पोर्टल • टाइमर व OMR आधारित</text>
</svg>
`;

// 2. BIHAR NMMS Thumbnail (1200x675 - 16:9)
const biharSvg = `
<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradB" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022c22"/>
      <stop offset="50%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#021c11"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="cardGradB" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bgGradB)"/>

  <!-- Glow orbs -->
  <circle cx="1050" cy="150" r="230" fill="#059669" opacity="0.3"/>
  <circle cx="150" cy="520" r="200" fill="#d97706" opacity="0.25"/>
  <circle cx="950" cy="550" r="180" fill="#10b981" opacity="0.2"/>

  <!-- Grid lines -->
  <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
    <line x1="0" y1="135" x2="1200" y2="135"/>
    <line x1="0" y1="270" x2="1200" y2="270"/>
    <line x1="0" y1="405" x2="1200" y2="405"/>
    <line x1="0" y1="540" x2="1200" y2="540"/>
    <line x1="240" y1="0" x2="240" y2="675"/>
    <line x1="480" y1="0" x2="480" y2="675"/>
    <line x1="720" y1="0" x2="720" y2="675"/>
    <line x1="960" y1="0" x2="960" y2="675"/>
  </g>

  <!-- Brand Tag -->
  <rect x="80" y="60" width="330" height="42" rx="21" fill="rgba(16,185,129,0.2)" stroke="rgba(16,185,129,0.5)" stroke-width="1.5"/>
  <text x="105" y="87" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#a7f3d0" letter-spacing="2">SAGAR COACHING CENTRE</text>

  <!-- PYQ Series Badge -->
  <rect x="910" y="60" width="210" height="42" rx="21" fill="url(#goldGrad)"/>
  <text x="935" y="87" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#78350f" letter-spacing="1">विगत वर्ष पेपर्स</text>

  <!-- State Tag -->
  <rect x="80" y="135" width="240" height="38" rx="8" fill="#f59e0b"/>
  <text x="98" y="160" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="bold" fill="#78350f" letter-spacing="1">BIHAR STATE NMMSE</text>

  <!-- Main Headline -->
  <text x="80" y="245" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="900" fill="#ffffff">बिहार NMMS टेस्ट सीरीज</text>
  <text x="80" y="315" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800" fill="url(#goldGrad)">राष्ट्रीय आय-सह-मेधा छात्रवृत्ति</text>
  <text x="80" y="375" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#d1fae5">2024, 2023 व 2019 असली प्रश्न पत्र ऑनलाइन</text>

  <!-- Features Grid -->
  <g transform="translate(80, 430)">
    <!-- Pill 1 -->
    <rect x="0" y="0" width="240" height="68" rx="16" fill="url(#cardGradB)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="24" y="30" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#94a3b8" letter-spacing="1">SECTION 1</text>
    <text x="24" y="53" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="bold" fill="#34d399">MAT रीजनिंग (90 Q)</text>

    <!-- Pill 2 -->
    <rect x="260" y="0" width="240" height="68" rx="16" fill="url(#cardGradB)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="284" y="30" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#94a3b8" letter-spacing="1">SECTION 2</text>
    <text x="284" y="53" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="bold" fill="#fbbf24">SAT विषय (90 Q)</text>

    <!-- Pill 3 -->
    <rect x="520" y="0" width="260" height="68" rx="16" fill="url(#cardGradB)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="544" y="30" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#94a3b8" letter-spacing="1">SCHOLARSHIP</text>
    <text x="544" y="53" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="bold" fill="#6ee7b7">₹48,000 छात्रवृत्ति लक्ष्य</text>
  </g>

  <!-- Bottom Strip -->
  <rect x="80" y="545" width="1040" height="65" rx="14" fill="rgba(2,44,34,0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <circle cx="115" cy="577" r="14" fill="#10b981"/>
  <text x="110" y="582" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">✓</text>
  <text x="140" y="583" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">असली परीक्षा हॉल जैसा कंप्यूटर/मोबाइल टेस्ट अनुभव • तुरंत रिजल्ट व रैंक</text>
</svg>
`;

async function main() {
  const coursesDir = path.join(process.cwd(), 'public', 'images', 'courses');
  if (!fs.existsSync(coursesDir)) {
    fs.mkdirSync(coursesDir, { recursive: true });
  }

  await sharp(Buffer.from(upSvg))
    .webp({ quality: 90 })
    .toFile(path.join(coursesDir, 'up-nmms-mock-test-series.webp'));
  console.log('UP thumbnail generated successfully!');

  await sharp(Buffer.from(biharSvg))
    .webp({ quality: 90 })
    .toFile(path.join(coursesDir, 'bihar-nmms-mock-test-series.webp'));
  console.log('Bihar thumbnail generated successfully!');
}

main().catch(console.error);
