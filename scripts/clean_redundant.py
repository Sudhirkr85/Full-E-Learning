import os
import hashlib

folder = r"C:\Users\Orange\Downloads\New folder"
files = [f for f in os.listdir(folder) if f.lower().endswith(".pdf")]

# 1. Hashes of already renamed files
already_renamed = [f for f in files if not f.startswith("New Document") and " - Copy" not in f]
renamed_hashes = {}
for f in already_renamed:
    with open(os.path.join(folder, f), "rb") as fp:
        renamed_hashes[hashlib.sha256(fp.read()).hexdigest()] = f

# 2. Personal files hashes
personal_names = [
    "New Document(260).pdf", "New Document(274).pdf", "New Document(286).pdf",
    "New Document(287).pdf", "New Document(289).pdf", "New Document(290).pdf",
    "New Document(347).pdf", "New Document(356).pdf", "New Document(357).pdf"
]
personal_hashes = set()
for f in personal_names:
    p = os.path.join(folder, f)
    if os.path.exists(p):
        with open(p, "rb") as fp:
            personal_hashes.add(hashlib.sha256(fp.read()).hexdigest())

removed_copies = 0
removed_repasted = 0
removed_personal = 0

for f in files:
    path = os.path.join(folder, f)
    if not os.path.exists(path):
        continue
    
    if " - Copy" in f:
        os.remove(path)
        removed_copies += 1
        continue
        
    if f in already_renamed:
        continue
        
    with open(path, "rb") as fp:
        h = hashlib.sha256(fp.read()).hexdigest()
        
    if h in personal_hashes:
        os.remove(path)
        removed_personal += 1
    elif h in renamed_hashes:
        os.remove(path)
        removed_repasted += 1

print(f"Removed copy duplicates: {removed_copies}")
print(f"Removed re-pasted already renamed: {removed_repasted}")
print(f"Removed personal documents: {removed_personal}")

remaining_pdfs = [f for f in os.listdir(folder) if f.lower().endswith(".pdf")]
print(f"Total PDFs remaining in folder: {len(remaining_pdfs)}")
print(f"Of which, previously renamed: {len(already_renamed)}")
print(f"New to process: {len(remaining_pdfs) - len(already_renamed)}")
