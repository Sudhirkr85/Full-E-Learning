import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"C:\Users\Orange\Downloads\New folder"
files = [f for f in os.listdir(folder) if f.lower().endswith('.pdf')]

full_pyqs = []
chapterwise_pyqs = []
notifications_syllabus = []

for f in sorted(files):
    # Full official papers
    if any(k in f for k in ['_MAT_', '_SAT_', 'Question_Paper', 'Question_Booklet', 'Model_Practice_Set']) and not any(skip in f for skip in ['Class_9', 'Class_10', 'SAV_', 'JNVST_', 'Sainik_', 'Kanya_', 'TSMS_']):
        full_pyqs.append(f)
    elif 'PYQ_' in f:
        chapterwise_pyqs.append(f)
    elif 'Notification' in f or 'Syllabus' in f or 'Schedule' in f or 'Vigyapti' in f or 'Answer_Key' in f:
        notifications_syllabus.append(f)

print(f"Total files in folder: {len(files)}")
print(f"Full NMMS Question Papers / Booklets: {len(full_pyqs)}")
print(f"Chapter-wise PYQ Sets: {len(chapterwise_pyqs)}")
print(f"Official Notifications / Syllabus / Answer Keys: {len(notifications_syllabus)}")

print("\n--- SAMPLE FULL PAPERS ---")
for p in full_pyqs[:25]:
    print(" ", p)
