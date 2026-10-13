import os
import sys
import io
import fitz

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

pyq_dir = r"C:\Users\Orange\Downloads\New folder\01_NMMS_Previous_Year_Question_Papers"
files = sorted(os.listdir(pyq_dir))

report = []
for f in files:
    doc = fitz.open(os.path.join(pyq_dir, f))
    p0 = doc[0].get_text()
    p1 = doc[1].get_text() if len(doc) > 1 else ""
    text = (p0 + " " + p1).replace('\n', ' ')
    
    # State
    state = "Bihar (बिहार)" # Default for state level
    if "उत्तर प्रदेश" in text or "UP" in text or "प्रयागराज" in text or "State code 32" in text or "State code 3 2" in text:
        state = "Uttar Pradesh (उत्तर प्रदेश)"
    elif "मध्य प्रदेश" in text or "MP" in text or "State code 33" in text:
        state = "Madhya Pradesh (मध्य प्रदेश)"
    elif "राजस्थान" in text:
        state = "Rajasthan (राजस्थान)"
    elif "हरियाणा" in text:
        state = "Haryana (हरियाणा)"
    elif "उत्तराखंड" in text or "नौटियाल" in text:
        state = "Uttarakhand (उत्तराखंड)"
    elif "राज्य स्तरीय" in text or "SCERT" in text or "बिहार" in text or "पटना" in text or "BR" in text or "3113677" in text:
        state = "Bihar (बिहार)"
    else:
        # Check if All India / Bihar board standard
        state = "Bihar / National (बिहार / अखिल भारतीय)"

    # Year
    year = "2024 / 2025 (नवीनतम)"
    for y in ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009"]:
        if y in f or y in text:
            year = y
            break
            
    # Paper Type
    ptype = "MAT (मानसिक योग्यता)"
    if "SAT" in f or "शैक्षिक" in text:
        ptype = "SAT (शैक्षिक अभिरुचि - विज्ञान, सामाजिक विज्ञान, गणित)"
    elif "Booklet" in f or "Combined" in f or len(doc) > 25:
        ptype = "MAT + SAT (सम्पूर्ण प्रश्न पुस्तिका - दोनों पेपर)"

    report.append((f, year, state, ptype, len(doc)))

for r in report:
    print(f"| {r[1]:<6} | {r[2]:<30} | {r[3]:<38} | `{r[0]}` ({r[4]} पेज़) |")
