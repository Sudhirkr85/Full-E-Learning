import os
import shutil
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

base_folder = r"C:\Users\Orange\Downloads\New folder"

categories_dirs = {
    "01_NMMS_Previous_Year_Question_Papers": [],
    "02_NMMS_Subjectwise_Study_Material": [],
    "03_NMMS_Official_Notifications_and_Syllabus": [],
    "04_Simultala_Awasiya_Vidyalaya_SAV": [],
    "05_Navodaya_and_Sainik_School": [],
    "06_Talent_Search_TSMS_Ramanujan_Math": [],
    "07_Other_Exams_and_Scholarships": []
}

for d in categories_dirs.keys():
    os.makedirs(os.path.join(base_folder, d), exist_ok=True)

files = [f for f in os.listdir(base_folder) if os.path.isfile(os.path.join(base_folder, f)) and f.lower().endswith('.pdf')]
print(f"Total files to organize: {len(files)}")

for f in files:
    # 4. Simultala
    if f.startswith("SAV_") or "Simultala" in f:
        dest_folder = "04_Simultala_Awasiya_Vidyalaya_SAV"
        
    # 5. Navodaya & Sainik School
    elif f.startswith("JNVST_") or f.startswith("Sainik_School_") or "Navodaya" in f:
        dest_folder = "05_Navodaya_and_Sainik_School"
        
    # 6. TSMS
    elif f.startswith("TSMS_") or "Talent_Search" in f:
        dest_folder = "06_Talent_Search_TSMS_Ramanujan_Math"
        
    # 7. Other exams
    elif any(k in f for k in ["SHRESHTA", "Uttarakhand", "Kanya_Awasiya", "BSEB_", "Bihar_Board_Class_9", "India_Post", "Sagar_Coaching_Centre_Pratiyogita", "School_Olympiad", "Kislay"]):
        dest_folder = "07_Other_Exams_and_Scholarships"
        
    # 3. NMMS Notifications, Syllabus, Posters, News
    elif any(k in f for k in ["Notification", "Syllabus", "Answer_Key", "Notice", "Circular", "News", "Poster", "Statistics", "Schedule"]):
        dest_folder = "03_NMMS_Official_Notifications_and_Syllabus"
        
    # 1. NMMS Full PYQs
    elif any(k in f for k in ["2009", "2010", "2011", "2012", "2017", "2023", "2024", "2025"]) and any(p in f for p in ["_MAT_", "_SAT_"]):
        dest_folder = "01_NMMS_Previous_Year_Question_Papers"
    elif any(k in f for k in ["Full_Question_Booklet", "Test_Complete", "90Marks", "90Q", "Test_Series", "Official_Question_Paper", "Model_Practice_Set"]):
        dest_folder = "01_NMMS_Previous_Year_Question_Papers"
    elif ("_MAT_Mental_Ability_Test_" in f or "_SAT_Scholastic_Aptitude_Paper_" in f) and "Practice" not in f and "Notes" not in f:
        dest_folder = "01_NMMS_Previous_Year_Question_Papers"
        
    # 2. NMMS Subjectwise Study Material
    else:
        dest_folder = "02_NMMS_Subjectwise_Study_Material"

    categories_dirs[dest_folder].append(f)
    src_path = os.path.join(base_folder, f)
    dst_path = os.path.join(base_folder, dest_folder, f)
    shutil.move(src_path, dst_path)

print("\n--- ORGANIZATION SUMMARY ---")
for cat, flist in categories_dirs.items():
    print(f"📁 {cat:<45}: {len(flist)} files")
