import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('d:/Work/E-Learning/pdf_analysis_cache.json', 'r', encoding='utf-8') as f:
    cache = json.load(f)

print(f"Total items in cache: {len(cache)}")

items = sorted(cache.items())

results = []
for fname, data in items:
    pgs = data.get('page_count', 1)
    texts_list = data.get('texts', [])
    full_text = " ".join(texts_list)
    
    # Classify based on text analysis
    new_name = ""
    category = ""
    is_useful = ""
    relevance_reason = ""
    
    t_lower = full_text.lower()
    
    # 1. Personal / Family Documents
    if "shrvan kumar sagar" in t_lower or "श्रवन कुमार सागर" in full_text or "रामनारायण मेहता" in full_text or "राम नारायन" in full_text:
        if "356" in fname or "290" in fname:
            new_name = "Shrvan_Kumar_Sagar_Aadhaar_Card_Front.pdf"
            category = "Personal / Founder ID"
            is_useful = "No (Personal Document)"
            relevance_reason = "Founder (Shrvan Kumar Sagar) Aadhaar Identity document; not for students/coaching material."
        elif "357" in fname:
            new_name = "Shrvan_Kumar_Sagar_Aadhaar_Card_Back.pdf"
            category = "Personal / Founder ID"
            is_useful = "No (Personal Document)"
            relevance_reason = "Founder Aadhaar back side address details."
        elif "289" in fname:
            new_name = "Ramnarayan_Mehta_Aadhaar_Card.pdf"
            category = "Personal / Family ID"
            is_useful = "No (Personal Document)"
            relevance_reason = "Personal Aadhaar card of family member."
            
    elif "मौजा भगवानपुर" in full_text or "खाता" in full_text and "खेसरा" in full_text and "ज़मीन" in full_text:
        new_name = "Land_Record_Bhagwanpur_Khesra_Deed.pdf"
        category = "Personal / Legal Document"
        is_useful = "No (Personal Document)"
        relevance_reason = "Private handwritten land record / Khata-Khesra paper."
        
    elif "five rupees" in t_lower or "रुपये भारत" in full_text and "विक्रय" in full_text:
        new_name = "Land_Sale_Agreement_Stamp_Paper.pdf"
        category = "Personal / Legal Document"
        is_useful = "No (Personal Document)"
        relevance_reason = "Private stamp paper land sale agreement."
        
    # 2. Simultala Awasiya Vidyalaya (SAV)
    elif "सिमुलतला" in full_text or "simultala" in t_lower:
        if "2023" in full_text:
            new_name = "Simultala_Awasiya_Vidyalaya_2023_Prarambhik_Solved_Paper.pdf"
        elif "2025" in full_text and "मुख्य" in full_text:
            if "328" in fname:
                new_name = "Simultala_2025_Mains_Entrance_Question_Paper_Set_A.pdf"
            elif "329" in fname:
                new_name = "Simultala_2025_Mains_Entrance_Question_Paper_Set_B.pdf"
            else:
                new_name = f"Simultala_2025_Mains_Entrance_Paper_{fname}.pdf"
        else:
            new_name = f"Simultala_Awasiya_Vidyalaya_Question_Paper_{pgs}p.pdf"
        category = "SAV Entrance Exam"
        is_useful = "Partially / Reference"
        relevance_reason = "Targeted for Simultala entrance (Class 6), but excellent for NMMS foundation practice (Math & Science questions share similar Class 6-8 NCERT base)."

    # 3. Sainik School
    elif "सैनिक स्कूल" in full_text or "sainik school" in t_lower:
        new_name = "Sainik_School_Class_6_Entrance_2024_25_Hindi_Section.pdf"
        category = "Sainik School Entrance"
        is_useful = "Partially / Reference"
        relevance_reason = "Sainik School Class 6 Hindi paper; valuable for Sagar Coaching Centre's Sainik School wing, but not in NMMS syllabus."

    # 4. TSMS (Talent Search Test in Mathematical Sciences - Ramanujan / CV Raman)
    elif "टैलेंट सर्च" in full_text or "talent search" in t_lower or "mathematical sciences" in t_lower:
        cls_detected = ""
        for c in ["VI", "VII", "VIII", "IX", "X"]:
            if f"class - {c.lower()}" in t_lower or f"class ~ {c.lower()}" in t_lower or f"class {c.lower()}" in t_lower or f"कक्षा {c}" in full_text or f"कक्षा - {c}" in full_text:
                cls_detected = c
                break
        year = "2023" if "2023" in full_text else "2024"
        if not cls_detected:
            if "102" in fname: cls_detected = "VII"
            elif "103" in fname: cls_detected = "VI"
            elif "106" in fname: cls_detected = "VIII"
            elif "109" in fname: cls_detected = "X"
            elif "138" in fname: cls_detected = "IX"
            else: cls_detected = "Math"
            
        new_name = f"TSMS_{year}_Talent_Search_Mathematics_Class_{cls_detected}.pdf"
        category = "Mathematical Talent Search (TSMS)"
        if cls_detected in ["VII", "VIII"]:
            is_useful = "Highly Useful (NMMS Mathematics)"
            relevance_reason = f"Class {cls_detected} TSMS tests higher-order thinking in Mathematics directly aligned with NMMS SAT Math syllabus."
        elif cls_detected in ["VI"]:
            is_useful = "Useful (Basic Math Practice)"
            relevance_reason = "Basic arithmetic and geometry foundations for Class 8 NMMS students."
        else:
            is_useful = "Low / Not Relevant for NMMS"
            relevance_reason = f"Class {cls_detected} level exceeds NMMS Class 8 syllabus."

    # 5. Official NMMS Question Papers (MAT & SAT)
    elif "राष्ट्रीय आय" in full_text or "nmms" in t_lower or "national means" in t_lower or "शैक्षिक अभिरुचि" in full_text or "मानसिक योग्यता" in full_text or "mat" in t_lower:
        # Check year
        year = ""
        for y in ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009"]:
            if y in full_text:
                year = y
                break
                
        # Check MAT or SAT or Practice
        ptype = ""
        if "मानसिक योग्यता" in full_text or "mental ability" in t_lower or "gmad" in t_lower or "part - i" in t_lower or "part -i" in t_lower:
            ptype = "MAT_Mental_Ability"
        elif "शैक्षिक" in full_text or "sat" in t_lower or "खण्ड-ii" in t_lower or "खण्ड-11" in t_lower or "खण्ड-il" in t_lower:
            ptype = "SAT_Scholastic_Aptitude"
        else:
            ptype = "Complete_Paper"
            
        if "प्रैक्टिस" in full_text or "practice" in t_lower:
            ptype += "_Practice_Set"
            
        if year:
            new_name = f"NMMS_{year}_{ptype}.pdf"
        else:
            new_name = f"NMMS_{ptype}_{fname.replace('.pdf', '')}.pdf"
            
        category = "NMMS Official / Practice Paper"
        is_useful = "Essential / 100% Useful"
        relevance_reason = "Direct NMMS examination paper/practice set covering MAT (Reasoning) & SAT (Science/Social Science/Maths)."

    # 6. Specific NMMS Subject Study Material / Topics
    elif "घन और पासा" in full_text or "cube and dice" in t_lower:
        new_name = "NMMS_MAT_Reasoning_Cube_and_Dice_Chapter.pdf"
        category = "NMMS MAT Topic Notes"
        is_useful = "Essential / 100% Useful"
        relevance_reason = "Core topic in NMMS MAT (Mental Ability Test) Non-Verbal / 3D spatial reasoning."

    elif "लुप्त पद" in full_text or "missing term" in t_lower:
        new_name = "NMMS_MAT_Reasoning_Missing_Term_Chapter.pdf"
        category = "NMMS MAT Topic Notes"
        is_useful = "Essential / 100% Useful"
        relevance_reason = "High-weightage topic in NMMS MAT section (Number/Letter missing terms)."

    elif "कोडिंग" in full_text or "coding" in t_lower or "डिक्शनरी" in full_text:
        new_name = "NMMS_MAT_Reasoning_Coding_Decoding_Dictionary.pdf"
        category = "NMMS MAT Topic Notes"
        is_useful = "Essential / 100% Useful"
        relevance_reason = "Standard NMMS Mental Ability Reasoning topic."

    elif "विटामिन" in full_text or "भौतिकी" in full_text or "विज्ञान" in full_text:
        new_name = f"NMMS_SAT_Science_Objective_Questions_{fname.replace('.pdf', '')}.pdf"
        category = "NMMS SAT Science Notes"
        is_useful = "Essential / 100% Useful"
        relevance_reason = "Directly covers Class 7/8 NCERT General Science for NMMS SAT section (35 marks)."

    elif "संविधान" in full_text or "इतिहास" in full_text or "भूगोल" in full_text or "ब्रहमो समाज" in full_text or "चम्पारण" in full_text:
        new_name = f"NMMS_SAT_Social_Science_{fname.replace('.pdf', '')}.pdf"
        category = "NMMS SAT Social Science Notes"
        is_useful = "Essential / 100% Useful"
        relevance_reason = "Directly covers Class 7/8 NCERT History, Civics & Geography for NMMS SAT section (35 marks)."

    elif "गणित" in full_text or "math" in t_lower:
        new_name = f"NMMS_SAT_Mathematics_Practice_{fname.replace('.pdf', '')}.pdf"
        category = "NMMS SAT Math Notes"
        is_useful = "Essential / 100% Useful"
        relevance_reason = "Class 7/8 NCERT Mathematics practice questions for NMMS SAT Math (20 marks)."

    elif "शिवानन्द नौटियाल" in full_text:
        new_name = "Uttarakhand_Dr_Shivanand_Nautiyal_Scholarship_2024_25_Class_8.pdf"
        category = "State Scholarship Exam (Class 8)"
        is_useful = "Highly Useful (Equivalent Exam)"
        relevance_reason = "Uttarakhand State Class 8 Merit Scholarship; syllabus and exam pattern match NMMS Class 8 exactly."

    elif "प्रेस विज्ञप्ति" in full_text or "scert" in t_lower or "सूचना" in full_text or "आवेदन" in full_text:
        new_name = f"NMMS_Bihar_SCERT_Official_Notice_{fname.replace('.pdf', '')}.pdf"
        category = "Official Notification / Circular"
        is_useful = "Highly Useful (Official Updates)"
        relevance_reason = "Official Bihar SCERT schedule, dates, and application eligibility details for NMMS."

    elif "परिणाम घोषित" in full_text or "14,413" in full_text or "छात्रवृत्ति" in full_text:
        new_name = f"NMMS_Exam_News_and_Result_Clipping_{fname.replace('.pdf', '')}.pdf"
        category = "Newspaper / News Clip"
        is_useful = "Informative / Reference"
        relevance_reason = "Publicity, results announcement and awareness news clipping for NMMS students and parents."

    else:
        new_name = f"Document_{fname.replace('.pdf', '')}_{pgs}p.pdf"
        category = "General Educational Document"
        is_useful = "Check Content"
        relevance_reason = "Educational material / practice questions."

    results.append({
        'original': fname,
        'pages': pgs,
        'new_name': new_name,
        'category': category,
        'is_useful': is_useful,
        'relevance_reason': relevance_reason,
        'sample': full_text[:80]
    })

with open('d:/Work/E-Learning/pdf_classification_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Processed {len(results)} items successfully.")
