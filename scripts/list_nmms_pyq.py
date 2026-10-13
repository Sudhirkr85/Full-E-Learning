import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"C:\Users\Orange\Downloads\New folder"

with open('d:/Work/E-Learning/pdf_analysis_cache.json', 'r', encoding='utf-8') as f:
    cache = json.load(f)

with open('d:/Work/E-Learning/pdf_final_master_mapping.json', 'r', encoding='utf-8') as f:
    master = json.load(f)

official_full_pyqs = []
chapterwise_pyqs = []
practice_sets = []

for item in master:
    new_name = item['new_name']
    orig = item['original']
    data = cache.get(orig, {})
    txt = " ".join(data.get('texts', []))
    pgs = item['pages']
    
    # 1. Full Official Annual Question Papers
    if any(y in new_name for y in ['2009', '2010', '2011', '2012', '2017', '2023', '2024', '2025']) and any(p in new_name for p in ['MAT', 'SAT']) and 'Schedule' not in new_name:
        official_full_pyqs.append((new_name, pgs, txt))
    elif any(p in new_name for p in ['MAT_Mental_Ability', 'SAT_Scholastic']) and 'Practice' not in new_name:
        official_full_pyqs.append((new_name, pgs, txt))
    elif 'Practice_Set' in new_name or 'Practice' in new_name or 'प्रैक्टिस' in txt:
        practice_sets.append((new_name, pgs, txt))
    elif any(tag in txt for tag in ['BR, 20', 'UP, 20', 'BR, 2017', 'UP, 2018', 'BR, 2019', 'BR, 2022', 'BR 20']):
        chapterwise_pyqs.append((new_name, pgs, txt))

print(f"=== 1. FULL OFFICIAL NMMS PREVIOUS YEAR PAPERS ({len(official_full_pyqs)}) ===")
for name, pgs, txt in sorted(official_full_pyqs):
    print(f"• {name} ({pgs} pages)")

print(f"\n=== 2. CHAPTERWISE NMMS PREVIOUS YEAR QUESTION (PYQ) PAPERS ({len(chapterwise_pyqs)}) ===")
for name, pgs, txt in sorted(chapterwise_pyqs):
    print(f"• {name} ({pgs} pages)")

print(f"\n=== 3. NMMS MODEL PRACTICE TEST PAPERS ({len(practice_sets)}) ===")
for name, pgs, txt in sorted(practice_sets):
    print(f"• {name} ({pgs} pages)")
