import json
import os
import sys
import io
import csv

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

folder = r"C:\Users\Orange\Downloads\New folder"

with open('d:/Work/E-Learning/pdf_final_master_mapping.json', 'r', encoding='utf-8') as f:
    mappings = json.load(f)

log_csv_path = os.path.join(folder, "RENAME_MAPPING_LOG.csv")
log_json_path = os.path.join(folder, "RENAME_MAPPING_LOG.json")

renamed_count = 0
failed_count = 0

with open(log_csv_path, "w", newline="", encoding="utf-8-sig") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["Original Name", "New Name", "Pages", "Category", "NMMS Usefulness", "Why Useful / Reason"])
    
    for item in mappings:
        orig = item['original']
        new_name = item['new_name']
        pages = item['pages']
        category = item['category']
        useful = item['is_useful']
        reason = item['reason']
        
        writer.writerow([orig, new_name, pages, category, useful, reason])
        
        orig_path = os.path.join(folder, orig)
        target_path = os.path.join(folder, new_name)
        
        if os.path.exists(orig_path):
            try:
                # If target already exists and isn't same, avoid clash
                if os.path.exists(target_path) and orig_path.lower() != target_path.lower():
                    base, ext = os.path.splitext(target_path)
                    target_path = f"{base}_alt{ext}"
                os.rename(orig_path, target_path)
                renamed_count += 1
            except Exception as e:
                print(f"Error renaming {orig} -> {new_name}: {e}")
                failed_count += 1

with open(log_json_path, "w", encoding="utf-8") as f:
    json.dump(mappings, f, ensure_ascii=False, indent=2)

print(f"Successfully renamed {renamed_count} files. Errors: {failed_count}.")
print(f"Audit log saved to: {log_csv_path}")
