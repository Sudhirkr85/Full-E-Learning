import json
import os
import sys
import io
import csv
import re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"C:\Users\Orange\Downloads\New folder"

with open("d:/Work/E-Learning/pdf_analysis_cache_batch2.json", "r", encoding="utf-8") as f:
    cache = json.load(f)

# Specific precise overrides
specific_b2_map = {
    "New Document(389).pdf": ("NMMS_2026_27_Official_Notification_Vigyapti_1p.pdf", "NMMS Notification", "Essential (Upcoming Exam)", "Official notification/advertisement for NMMS 2026-27 scholarship exam."),
    "New Document(396).pdf": ("NMMS_2026_Official_Prescribed_Syllabus_3p.pdf", "NMMS Syllabus", "Essential (Official Syllabus)", "Official SCERT prescribed syllabus for NMMS exam (Science, SST, Math, MAT)."),
    "New Document(397).pdf": ("NMMS_Ministry_of_Education_Govt_India_Schedule_Notice_1p.pdf", "NMMS Notification", "Highly Useful", "Ministry of Education Govt of India NMMS exam schedule announcement."),
    "New Document(395).pdf": ("NMMS_Result_and_Rank_List_12000_Scholarship_News_3p.pdf", "NMMS News", "Useful (Results & Rank)", "Block-wise rank list and scholarship announcement news."),
    "New Document(384).pdf": ("Sagar_Coaching_Centre_NMMS_2026_27_Safalta_Batch_Poster.pdf", "Coaching Promotion", "Official Site Asset", "Official promotional poster for Sagar Coaching Centre NMMS Safalta Batch (Rs 365)."),
    "New Document(404).pdf": ("NMMS_2026_Official_Provisional_Answer_Key_1p.pdf", "NMMS Answer Key", "Essential (Answer Key)", "Official provisional answer key for NMMS scholarship exam."),
    "New Document(408).pdf": ("NMMS_MAT_Mental_Ability_Test_Complete_90Q_Paper_25p.pdf", "NMMS MAT Paper", "Essential (100% Core NMMS)", "Full 25-page official NMMS Mental Ability Test (Questions 1 to 90 complete)."),
    "New Document(405).pdf": ("NMMS_SAT_Scholastic_Aptitude_Test_Complete_Paper_28p.pdf", "NMMS SAT Paper", "Essential (100% Core NMMS)", "Full 28-page official NMMS Scholastic Aptitude Test (Science, SST, Math)."),
    "New Document(322).pdf": ("NMMS_Board_Exam_Full_Question_Booklet_36p.pdf", "NMMS Full Paper", "Essential (100% Core NMMS)", "Complete 36-page official NMMS bilingual question booklet."),
    "New Document(41).pdf":  ("NMMS_Class_8_Official_Question_Paper_17p.pdf", "NMMS Full Paper", "Essential (100% Core NMMS)", "Official NMMS Class 8 Question booklet (17 pages)."),
    "New Document(63).pdf":  ("NMMS_MAT_Mental_Ability_Test_Series_Paper_17p.pdf", "NMMS MAT Paper", "Essential (100% Core NMMS)", "Official NMMS Mental Ability Test reasoning paper."),
    "New Document(305).pdf": ("NMMS_SAT_Scholastic_Aptitude_Physics_Science_19p.pdf", "NMMS SAT Science", "Essential (100% Core NMMS)", "Official NMMS SAT Science section (Physics & General Science 90 marks)."),
    "New Document(298).pdf": ("NMMS_MAT_Mental_Ability_Test_90Marks_Paper_6p.pdf", "NMMS MAT Paper", "Essential (100% Core NMMS)", "Official NMMS MAT 90 marks question paper."),
    "New Document(280).pdf": ("NMMS_Scholarship_Exam_Question_Booklet_Code_4290_13p.pdf", "NMMS Question Paper", "Essential (100% Core NMMS)", "State scholarship test booklet (Code 4290)."),
    "New Document(407).pdf": ("NMMS_Scholarship_Exam_Question_Booklet_Code_4290_7p.pdf", "NMMS Question Paper", "Essential (100% Core NMMS)", "State scholarship test booklet (Code 4290 part 2)."),
    "New Document(388).pdf": ("JNVST_2024_25_Navodaya_Class_6_Mental_Ability_Exam_6p.pdf", "Navodaya Entrance", "Useful for Navodaya Wing", "Navodaya Class 6 entrance exam mental ability paper 2024-25."),
    "New Document(239).pdf": ("SHRESHTA_NETS_2023_Entrance_Exam_Math_Solution_5p.pdf", "Shrestha NETS Exam", "Useful for Shrestha Course", "SHRESHTA NETS 2023 entrance examination math solution paper."),
    "New Document(366).pdf": ("Kanya_Awasiya_Vidyalaya_Class_9_Entrance_Paper_Set1_7p.pdf", "Residential School Exam", "Class 9 Entrance", "Bihar Backward Class Girls Residential +2 School Class 9 entrance exam."),
    "New Document(367).pdf": ("Kanya_Awasiya_Vidyalaya_Class_9_Entrance_Paper_Set2_7p.pdf", "Residential School Exam", "Class 9 Entrance", "Bihar Backward Class Girls Residential +2 School Class 9 entrance exam set 2."),
    "New Document(363).pdf": ("Bihar_Board_Class_9_Annual_Exam_2023_Science_24p.pdf", "Class 9 Board Exam", "No (Class 9)", "Bihar Board Class 9 Annual Exam 2023 Science question paper."),
    "New Document(369).pdf": ("Bihar_Board_Class_9_Annual_Exam_2023_Math_22p.pdf", "Class 9 Board Exam", "No (Class 9)", "Bihar Board Class 9 Annual Exam 2023 Mathematics question paper."),
    "New Document(71).pdf":  ("BSEB_Class_10_Matric_Annual_Board_Exam_2025_16p.pdf", "Matric Board Exam", "No (Class 10)", "Bihar Board Matric Class 10 annual board examination paper 2025."),
    "New Document(391).pdf": ("NMMS_Science_Syllabus_Unit_2_Heat_and_Fossil_Fuels_1p.pdf", "NMMS SAT Science", "Essential (Study Notes)", "NMMS Unit 2 Science syllabus notes: Heat, Coal & Petroleum, Flame."),
    "New Document(392).pdf": ("NMMS_Math_Syllabus_Unit_4_Compound_Interest_2p.pdf", "NMMS SAT Math", "Essential (Study Notes)", "NMMS Unit 4 Math notes: Compound Interest (चक्रवृद्धि ब्याज)."),
    "New Document(393).pdf": ("NMMS_SST_Syllabus_Unit_3_History_Delhi_Sultanate_2p.pdf", "NMMS SAT SST", "Essential (Study Notes)", "NMMS Unit 3 History notes: Delhi Sultanate & Vijayanagar."),
    "New Document(401).pdf": ("NMMS_SAT_Biology_Class_7_Nutrition_in_Plants_21p.pdf", "NMMS SAT Science", "Essential (NCERT Science)", "NCERT Science chapter: Photosynthesis & Nutrition in Plants."),
    "New Document(402).pdf": ("NMMS_SAT_Geography_Class_7_Our_Environment_11p.pdf", "NMMS SAT SST", "Essential (NCERT SST)", "NCERT Geography chapter: Our Environment (प्राकृतिक व मानवीय पर्यावरण)."),
    "New Document(409).pdf": ("NMMS_SAT_Biology_Cell_Structure_and_Mitochondria_14p.pdf", "NMMS SAT Science", "Essential (NCERT Science)", "NCERT Class 8 Biology: Cell Structure, Powerhouse & Functions."),
    "New Document(412).pdf": ("NMMS_SAT_Science_PYQ_2018_2021_Plant_Reproduction_5p.pdf", "NMMS SAT Science", "Essential (NMMS PYQ)", "NMMS 2018 & 2021 Previous questions on Vegetative Reproduction in Plants."),
    "New Document(413).pdf": ("NMMS_MAT_Reasoning_Venn_Diagram_Chapter_8p.pdf", "NMMS MAT Topic", "Essential (Core MAT Topic)", "NMMS MAT Reasoning topic: Venn Diagram (वेन आरेख)."),
    "New Document(411).pdf": ("NMMS_MAT_Reasoning_Analogy_Measuring_Instruments_5p.pdf", "NMMS MAT Topic", "Essential (Core MAT Topic)", "NMMS MAT Reasoning: Analogy (उपकरण और मापन - Barometer, Odometer, etc.)."),
    "New Document(360).pdf": ("NMMS_MAT_Reasoning_Cube_and_Dice_Chapter_5p.pdf", "NMMS MAT Topic", "Essential (Core MAT Topic)", "NMMS MAT Reasoning topic: Cubes and Dice (घन और पासा)."),
    "New Document(381).pdf": ("NMMS_MAT_Reasoning_Missing_Term_Chapter_14p.pdf", "NMMS MAT Topic", "Essential (Core MAT Topic)", "NMMS MAT Reasoning topic: Missing Term (लुप्त पद)."),
    "New Document(378).pdf": ("NMMS_MAT_Reasoning_PYQ_BR_2017_Coding_Decoding_6p.pdf", "NMMS MAT Topic", "Essential (NMMS PYQ)", "NMMS Bihar 2017 Previous Exam Questions: Coding-Decoding."),
    "New Document(373).pdf": ("NMMS_MAT_Reasoning_PYQ_UP_2018_Letter_Series_4p.pdf", "NMMS MAT Topic", "Essential (NMMS PYQ)", "NMMS UP 2018 Previous Exam Questions: Alphabet Letter Series."),
    "New Document(385).pdf": ("NMMS_SAT_Math_PYQ_UP_2023_Solved_Page_1p.pdf", "NMMS SAT Math", "Essential (NMMS PYQ)", "NMMS UP 2023 Previous Year Solved question page."),
    "New Document(415).pdf": ("NMMS_SAT_Civics_Supreme_Court_Judiciary_Notes_1p.pdf", "NMMS SAT SST", "Essential (NCERT Civics)", "Class 8 Civics notes: Supreme Court & Judiciary in India."),
    "New Document(416).pdf": ("NMMS_SAT_Biology_Class_8_Conservation_of_Plants_Animals_3p.pdf", "NMMS SAT Science", "Essential (NCERT Science)", "NCERT Class 8 Science Unit 8: Conservation of Plants and Animals."),
    "New Document(417).pdf": ("NMMS_SAT_Physics_Class_7_Motion_and_Time_2p.pdf", "NMMS SAT Science", "Essential (NCERT Science)", "NCERT Class 7 Science Unit 9: Motion, Speed & Time (गति एवं समय)."),
    "New Document(31).pdf":   ("NMMS_SAT_Math_Class_8_Square_and_Square_Root_3p.pdf", "NMMS SAT Math", "Essential (NCERT Math)", "NCERT Class 8 Mathematics: Squares and Square Roots (वर्ग और वर्गमूल)."),
    "New Document(3).pdf":    ("Azim_Premji_Foundation_Scholarship_Information_1p.pdf", "Scholarship Info", "Useful (Scholarship Info)", "Azim Premji Foundation scholarship scheme details."),
    "New Document(316).pdf":  ("SCERT_Bihar_Official_Order_Circular_1p.pdf", "SCERT Notice", "Highly Useful", "SCERT Patna official education circular."),
    "New Document(325).pdf":  ("Bihar_State_Education_Board_Official_Notice_1p.pdf", "Govt Notice", "Useful", "Bihar State Board official communication."),
    "New Document(368).pdf":  ("NMMS_Scholarship_1000_Monthly_News_Clipping_1p.pdf", "NMMS News", "Useful (Awareness)", "News clip: Rs 1000 monthly scholarship for NMMS qualified students in 9th-12th."),
    "New Document(414).pdf":  ("School_Olympiad_Announcement_News_Clipping_1p.pdf", "Olympiad News", "Reference Only", "News clipping regarding School Olympiad conduct.")
}

remaining_files = sorted([f for f in os.listdir(folder) if f.startswith("New Document") and f.lower().endswith(".pdf")])
print(f"Total remaining to rename: {len(remaining_files)}")

renamed_log = []

for fname in remaining_files:
    d = cache.get(fname, {})
    pgs = d.get('page_count', 1)
    txt = " ".join(d.get('texts', []))
    
    if fname in specific_b2_map:
        new_name, category, is_useful, reason = specific_b2_map[fname]
    else:
        # Fallback rules
        t_l = txt.lower()
        if "मानसिक" in txt or "mat" in t_l:
            new_name = f"NMMS_MAT_Mental_Ability_Practice_Doc{fname[13:-4]}_{pgs}p.pdf"
            category = "NMMS MAT Reasoning"
            is_useful = "Essential (100% Core NMMS)"
            reason = "NMMS Mental Ability Test reasoning questions."
        elif "गणित" in txt or "math" in t_l or "gaurd" in t_l:
            new_name = f"NMMS_SAT_Math_Practice_Doc{fname[13:-4]}_{pgs}p.pdf"
            category = "NMMS SAT Mathematics"
            is_useful = "Essential (100% Core NMMS)"
            reason = "Class 7/8 NCERT Mathematics practice questions."
        elif "विज्ञान" in txt or "science" in t_l or "chlorophyll" in t_l:
            new_name = f"NMMS_SAT_Science_Notes_Doc{fname[13:-4]}_{pgs}p.pdf"
            category = "NMMS SAT Science"
            is_useful = "Essential (100% Core NMMS)"
            reason = "Class 7/8 NCERT General Science notes and MCQs."
        elif "इतिहास" in txt or "भूगोल" in txt or "सामाजिक" in txt:
            new_name = f"NMMS_SAT_Social_Science_Doc{fname[13:-4]}_{pgs}p.pdf"
            category = "NMMS SAT Social Science"
            is_useful = "Essential (100% Core NMMS)"
            reason = "Class 7/8 NCERT Social Science study material."
        else:
            new_name = f"NMMS_Class_8_Study_Material_Doc{fname[13:-4]}_{pgs}p.pdf"
            category = "NMMS Study Material"
            is_useful = "Useful"
            reason = "Class 8 scholarship study material & question bank."
            
    renamed_log.append({
        'orig': fname,
        'new_name': new_name,
        'pages': pgs,
        'category': category,
        'is_useful': is_useful,
        'reason': reason
    })

# Rename on disk
success = 0
for item in renamed_log:
    old_p = os.path.join(folder, item['orig'])
    new_p = os.path.join(folder, item['new_name'])
    if os.path.exists(old_p):
        if os.path.exists(new_p):
            base, ext = os.path.splitext(new_p)
            new_p = f"{base}_b2{ext}"
            item['new_name'] = os.path.basename(new_p)
        os.rename(old_p, new_p)
        success += 1

print(f"Successfully renamed {success} files on disk.")

# Append to CSV
log_csv_path = os.path.join(folder, "RENAME_MAPPING_LOG.csv")
with open(log_csv_path, "a", newline="", encoding="utf-8-sig") as fp:
    writer = csv.writer(fp)
    for item in renamed_log:
        writer.writerow([item['orig'], item['new_name'], item['pages'], item['category'], item['is_useful'], item['reason']])

print("Updated RENAME_MAPPING_LOG.csv successfully.")
