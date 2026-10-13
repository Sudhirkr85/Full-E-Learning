import json
import os
import sys
import io
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"C:\Users\Orange\Downloads\New folder"
with open('d:/Work/E-Learning/pdf_analysis_cache.json', 'r', encoding='utf-8') as f:
    cache = json.load(f)

# Specific manual overrides and high-precision mapping
meta_map = {
    # Personal & Land Records
    "New Document(260).pdf": ("Personal_Land_Sale_Deed_Kewala_Saharsa_1976.pdf", "Personal Legal", "No", "Private registered land sale deed (केवाला 60 Rs stamp). Not study material."),
    "New Document(274).pdf": ("Personal_Bihar_Land_Revenue_Online_Form_XIV.pdf", "Personal Legal", "No", "Bihar Govt online land mutation / Jamabandi Form XIV."),
    "New Document(286).pdf": ("Personal_Land_Record_Khesra_Bhagwanpur.pdf", "Personal Legal", "No", "Private handwritten land record details (खाता-खेसरा विवरण)."),
    "New Document(287).pdf": ("Personal_Land_Sale_Stamp_Deed_5Rs.pdf", "Personal Legal", "No", "Handwritten 5-Rupee stamp paper land sale deed."),
    "New Document(289).pdf": ("Personal_ID_Ramnarayan_Mehta_Aadhaar.pdf", "Personal ID", "No", "Personal Aadhaar card of Ramnarayan Mehta."),
    "New Document(290).pdf": ("Personal_ID_Shrvan_Kumar_Sagar_Aadhaar.pdf", "Personal ID", "No", "Personal Aadhaar card of Shrvan Kumar Sagar (Founder)."),
    "New Document(347).pdf": ("Personal_Land_Revenue_Tax_Receipt_Malguzari.pdf", "Personal Legal", "No", "Handwritten land tax receipt (मालगुजारी रसीद)."),
    "New Document(356).pdf": ("Personal_ID_Shrvan_Kumar_Sagar_Aadhaar_Front.pdf", "Personal ID", "No", "Aadhaar Card Front of Shrvan Kumar Sagar."),
    "New Document(357).pdf": ("Personal_ID_Shrvan_Kumar_Sagar_Aadhaar_Back.pdf", "Personal ID", "No", "Aadhaar Card Back of Shrvan Kumar Sagar."),
    
    # Internal Coaching Paper
    "New Document(327).pdf": ("Sagar_Coaching_Centre_Pratiyogita_Pariksha_2024_Class_3_4_5_GK.pdf", "Coaching Internal Exam", "Useful (Junior Batches Only)", "Handwritten GK competition test of Sagar Coaching Centre for Classes 3, 4, 5. Too basic for NMMS Class 8."),
    
    # Other Board/Govt Notifications & Clippings
    "New Document(179).pdf": ("NMMS_News_Bihar_Class8_Scholarship_12000_Notice.pdf", "NMMS Notification", "Useful (Awareness & Info)", "Dainik news clip: NMMS Class 8 online form opening and Rs 12,000 scholarship scheme details."),
    "New Document(261).pdf": ("NMMS_Bihar_SCERT_Official_Press_Release_Notice.pdf", "NMMS Notification", "Highly Useful (Official Notice)", "SCERT Bihar Patna official press release regarding scholarship exams."),
    "New Document(268).pdf": ("India_Post_Dhai_Akhar_Letter_Writing_Competition_2024_25.pdf", "Govt Competition", "Low / General", "Department of Posts annual national letter-writing competition."),
    "New Document(269).pdf": ("India_Post_Deen_Dayal_SPARSH_Scholarship_2024_25.pdf", "Philately Scholarship", "Useful (Alternative Scholarship)", "Department of Posts SPARSH scholarship for Class 6-9 students."),
    "New Document(277).pdf": ("Bihar_BCST_Ramanujan_and_CV_Raman_Talent_Search_Notice_2024_25.pdf", "State Talent Exam", "Useful (Science/Math Talent)", "Notice for Ramanujan & CV Raman Talent Search Test for Classes 6-12 in Bihar."),
    "New Document(279).pdf": ("Bihar_Govt_Education_Official_Notice.pdf", "Govt Notification", "Reference Only", "Official notice from Bihar Govt Education Dept."),
    "New Document(283).pdf": ("PM_Internship_Yojana_News_Clipping.pdf", "Govt Scheme News", "No", "News clip regarding Central PM Internship Scheme for youth."),
    "New Document(285).pdf": ("NMMS_Bihar_Yearwise_Statistics_2008_to_2017.pdf", "NMMS Statistics", "Useful (Historical/Analysis)", "Official SCERT data showing applicants and qualified students from 2008 to 2017."),
    "New Document(288).pdf": ("NMMS_News_Exam_on_OMR_Sheet_Prayagraj.pdf", "NMMS News", "Useful (Exam Rules)", "News report clarifying NMMS exam conducted on OMR sheets instead of ICR."),
    "New Document(296).pdf": ("NMMS_Exam_Complete_FAQ_and_Eligibility_Guide.pdf", "NMMS Guide", "Highly Useful (Student Guidance)", "Leaflet explaining NMMS eligibility, exam dates, syllabus, and passing marks."),
    "New Document(312).pdf": ("NMMS_2024_25_Bihar_SCERT_Official_Exam_Schedule_Order.pdf", "NMMS Notification", "Essential (Official Schedule)", "Official SCERT Bihar notification with 19 Jan 2025 exam date, MAT/SAT timings, and admit card dates."),
    "New Document(313).pdf": ("BSEB_Matric_Class_10_Annual_Exam_Schedule_2025.pdf", "Board Exam Schedule", "No (Class 10 Matric)", "Bihar Board 10th matric exam routine. Not for Class 8 NMMS."),
    "New Document(320).pdf": ("National_Mathematics_Day_Newsletter_Launch_News.pdf", "News Clipping", "Reference Only", "Science & Tech dept event on National Mathematics Day."),
    "New Document(81).pdf": ("Bihar_Board_Class_8_Hindi_Kislay_Part_3_Index.pdf", "Textbook Syllabus", "Reference Only (Class 8 Hindi)", "Table of contents of Bihar SCERT Class 8 Hindi (Kislay-3). NMMS focuses on SAT Science, SST, Math."),
    "New Document(86).pdf": ("NMMS_Exam_Results_Announcement_News_Clipping.pdf", "NMMS News", "Useful (Results & Cutoff)", "News clip showing 14,413 students selected in NMMS scholarship."),
    
    # Entrance exams (SAV, Sainik, Navodaya)
    "New Document(1).pdf": ("SAV_2023_Simultala_Awasiya_Vidyalaya_Prarambhik_Solved_Paper.pdf", "SAV Entrance Paper", "Useful (Overlap Practice)", "Simultala Class 6 Prelims solved paper; covers Class 6-7 Social Science and Science MCQs."),
    "New Document(278).pdf": ("JNVST_2025_Jawahar_Navodaya_Vidyalaya_Class_6_Entrance_Paper.pdf", "Navodaya Entrance", "Useful for Navodaya (Coaching Category)", "JNVST 2025 Class 6 entrance exam paper; valuable for Navodaya wing on website."),
    "New Document(282).pdf": ("Residential_School_Class_9_Entrance_Exam_2024_25_Paper.pdf", "Class 9 Entrance", "Low for NMMS (Class 9 Level)", "Class 9 entrance paper; useful for Netarhat/Simultala/Shrestha NETS."),
    "New Document(328).pdf": ("SAV_2025_Simultala_Mains_Entrance_Exam_Paper_Set_A.pdf", "SAV Entrance Paper", "Useful (Overlap Practice)", "Simultala Mains 2025 entrance exam booklet."),
    "New Document(329).pdf": ("SAV_2025_Simultala_Mains_Entrance_Exam_Paper_Set_B.pdf", "SAV Entrance Paper", "Useful (Overlap Practice)", "Simultala Mains 2025 entrance exam booklet."),
    "New Document(334).pdf": ("Sainik_School_2024_25_Class_6_Entrance_Exam_Hindi_Section.pdf", "Sainik School Entrance", "Useful for Sainik School Wing", "AISSEE Class 6 Hindi question section."),
    "New Document(326).pdf": ("Uttarakhand_Dr_Shivanand_Nautiyal_Class_8_Scholarship_2024_25.pdf", "Class 8 State Scholarship", "Highly Useful (NMMS Pattern)", "Full 25-page booklet matching NMMS Class 8 pattern."),
    
    # TSMS (Mathematical Sciences)
    "New Document(102).pdf": ("TSMS_2023_Talent_Search_Mathematics_Class_7.pdf", "TSMS Math", "Highly Useful (NMMS Math)", "Class 7 Talent Search Mathematics; excellent higher-order MCQs for NMMS SAT Math."),
    "New Document(103).pdf": ("TSMS_2023_Talent_Search_Mathematics_Class_6.pdf", "TSMS Math", "Useful (Basic Math Practice)", "Class 6 Talent Search Mathematics; strong arithmetic practice for NMMS aspirants."),
    "New Document(106).pdf": ("TSMS_2023_Talent_Search_Mathematics_Class_8.pdf", "TSMS Math", "Highly Useful (NMMS Math)", "Class 8 Talent Search Mathematics; exactly targets Class 8 syllabus for NMMS SAT Math."),
    "New Document(109).pdf": ("TSMS_2023_Talent_Search_Mathematics_Class_10.pdf", "TSMS Math", "No (Class 10 Level)", "Class 10 Advanced Math; out of syllabus for Class 8 NMMS."),
    "New Document(138).pdf": ("TSMS_2023_Talent_Search_Mathematics_Class_9.pdf", "TSMS Math", "No (Class 9 Level)", "Class 9 Math; exceeds Class 8 NMMS scope."),
}

final_list = []

for fname, data in sorted(cache.items()):
    pgs = data.get('page_count', 1)
    texts = " ".join(data.get('texts', []))
    t_lower = texts.lower()
    
    if fname in meta_map:
        new_name, category, is_useful, reason = meta_map[fname]
    else:
        # Check standard NMMS patterns
        if "खण्ड-ii" in t_lower or "खण्ड-il" in t_lower or "खण्ड-11" in t_lower or "शैक्षिक अभिरुचि" in texts or "शैक्षिक योग्यता" in texts or "scholastic aptitude" in t_lower:
            # SAT
            year = ""
            for y in ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"]:
                if y in texts:
                    year = f"_{y}"
                    break
            new_name = f"NMMS{year}_SAT_Scholastic_Aptitude_Paper_{pgs}p.pdf"
            category = "NMMS SAT Question Paper"
            is_useful = "Essential (100% Core NMMS)"
            reason = "Official / Solved NMMS Scholastic Aptitude Test (SAT) paper covering Science, Social Science & Math."
            
        elif "मानसिक योग्यता" in texts or "mental ability" in t_lower or "gmad" in t_lower or "खण्ड ]" in texts or "खण्ड 1" in texts or "part - i" in t_lower or "part -i" in t_lower:
            # MAT
            year = ""
            for y in ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009"]:
                if y in texts:
                    year = f"_{y}"
                    break
            new_name = f"NMMS{year}_MAT_Mental_Ability_Test_{pgs}p.pdf"
            category = "NMMS MAT Question Paper"
            is_useful = "Essential (100% Core NMMS)"
            reason = "Official NMMS Mental Ability Test (MAT) reasoning section paper."
            
        elif "घन और पासा" in texts or "cube and dice" in t_lower:
            new_name = f"NMMS_MAT_Reasoning_Cube_and_Dice_Chapter_{pgs}p.pdf"
            category = "NMMS MAT Topic Notes"
            is_useful = "Essential (Core MAT Topic)"
            reason = "NMMS MAT reasoning chapter notes on Cubes and Dice."
            
        elif "लुप्त पद" in texts or "missing term" in t_lower:
            new_name = f"NMMS_MAT_Reasoning_Missing_Term_Chapter_{pgs}p.pdf"
            category = "NMMS MAT Topic Notes"
            is_useful = "Essential (Core MAT Topic)"
            reason = "NMMS MAT reasoning chapter on Missing Numbers and Letters."
            
        elif "डिक्शनरी" in texts or "coding" in t_lower or "कूट भाषा" in texts:
            new_name = f"NMMS_MAT_Reasoning_Coding_Decoding_Dictionary_{pgs}p.pdf"
            category = "NMMS MAT Topic Notes"
            is_useful = "Essential (Core MAT Topic)"
            reason = "NMMS MAT reasoning topic on Coding-Decoding and Dictionary Arrangement."
            
        elif "तर्कशक्ति" in texts or "सादृश्यता" in texts or "सही युग्म" in texts:
            new_name = f"NMMS_MAT_Reasoning_Analogy_Practice_{pgs}p.pdf"
            category = "NMMS MAT Practice"
            is_useful = "Essential (Core MAT Topic)"
            reason = "NMMS MAT Verbal Analogy & Classification practice questions."
            
        elif "प्रैक्टिस सेट" in texts or "practice set" in t_lower:
            new_name = f"NMMS_Class_8_Model_Practice_Set_{pgs}p.pdf"
            category = "NMMS Practice Paper"
            is_useful = "Highly Useful (Practice)"
            reason = "Complete model practice question paper for NMMS Class 8 exam preparation."
            
        elif "जीव विज्ञान" in texts or "कोशिकांग" in texts or "आत्महत्या की थैली" in texts or "निषेचन" in texts:
            new_name = f"NMMS_SAT_Biology_Cell_and_Reproduction_MCQs_{pgs}p.pdf"
            category = "NMMS SAT Science"
            is_useful = "Essential (Core SAT Science)"
            reason = "Class 8 NCERT Biology MCQs (Cell Structure & Reproduction) directly in NMMS SAT Science."
            
        elif "विटामिन" in texts or "प्रकाश की चाल" in texts or "मात्रक" in texts or "तापीय प्रभाव" in texts or "जंग लगना" in texts or "विज्ञान" in texts or "boiling water" in t_lower:
            new_name = f"NMMS_SAT_Science_Objective_MCQs_Notes_{pgs}p.pdf"
            category = "NMMS SAT Science"
            is_useful = "Essential (Core SAT Science)"
            reason = "Class 7/8 NCERT Physics & Chemistry questions (Heat, Light, Electricity, Rusting, Units) for NMMS SAT."
            
        elif "कांग्रेस" in texts or "वेदों की ओर" in texts or "चम्पारण" in texts or "ब्रहमो समाज" in texts or "संविधान" in texts or "संघात्मक शासन" in texts or "भूगोल" in texts or "काला सोना" in texts or "अरब आक्रमणकारी" in texts:
            new_name = f"NMMS_SAT_Social_Science_History_Civics_Geo_{pgs}p.pdf"
            category = "NMMS SAT Social Science"
            is_useful = "Essential (Core SAT SST)"
            reason = "Class 7/8 NCERT Social Science (Modern Indian History, Constitution, Natural Resources) for NMMS SAT (35 Marks)."
            
        elif "समीकरण" in texts or "सम्पूरक कोण" in texts or "वर्गमूल" in texts or "अभाज्य संख्या" in texts or "त्रिभुज" in texts or "गणित" in texts or "math" in t_lower:
            new_name = f"NMMS_SAT_Mathematics_Chapter_Practice_{pgs}p.pdf"
            category = "NMMS SAT Mathematics"
            is_useful = "Essential (Core SAT Math)"
            reason = "Class 7/8 NCERT Mathematics (Linear Equations, Geometry, Number Systems) for NMMS SAT Math (20 Marks)."
            
        elif "red planet" in t_lower or "सौर मंडल" in texts or "लाल ग्रह" in texts or "सामान्य ज्ञान" in texts:
            new_name = f"NMMS_SAT_General_Science_Solar_System_MCQs_{pgs}p.pdf"
            category = "NMMS SAT Science / GK"
            is_useful = "Highly Useful (SAT Science)"
            reason = "Solar System, Astronomy, and General Science quiz questions for NMMS SAT."
            
        else:
            new_name = f"NMMS_Class_8_Study_Material_{fname.replace('.pdf', '')}_{pgs}p.pdf"
            category = "NMMS Study Material"
            is_useful = "Useful"
            reason = "Class 8 scholarship study material & question bank."
            
    final_list.append({
        'original': fname,
        'pages': pgs,
        'new_name': new_name,
        'category': category,
        'is_useful': is_useful,
        'reason': reason
    })

# Ensure all new_names are distinct
counts = {}
for item in final_list:
    base = item['new_name']
    if base in counts:
        counts[base] += 1
        name_part, ext = os.path.splitext(base)
        # extract original doc number
        doc_num = re.search(r'\d+', item['original'])
        doc_id = doc_num.group(0) if doc_num else str(counts[base])
        item['new_name'] = f"{name_part}_Doc{doc_id}{ext}"
    else:
        counts[base] = 1

with open('d:/Work/E-Learning/pdf_final_master_mapping.json', 'w', encoding='utf-8') as f:
    json.dump(final_list, f, ensure_ascii=False, indent=2)

print(f"Master mapping created with {len(final_list)} entries.")
