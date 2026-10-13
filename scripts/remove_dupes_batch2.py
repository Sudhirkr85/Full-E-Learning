import os, fitz, hashlib

folder = r"C:\Users\Orange\Downloads\New folder"
files = sorted([f for f in os.listdir(folder) if f.startswith("New Document") and f.lower().endswith(".pdf")])

groups = {}
for f in files:
    path = os.path.join(folder, f)
    doc = fitz.open(path)
    h = hashlib.md5()
    h.update(str(len(doc)).encode())
    for p in doc:
        h.update(p.get_pixmap(dpi=50).tobytes())
    fp = h.hexdigest()
    groups.setdefault(fp, []).append(f)

removed_count = 0
for fp, flist in groups.items():
    # Sort so that names without (1), (2) come first
    flist_sorted = sorted(flist, key=lambda x: (len(x), x))
    canonical = flist_sorted[0]
    for dupe in flist_sorted[1:]:
        p = os.path.join(folder, dupe)
        if os.path.exists(p):
            os.remove(p)
            removed_count += 1

print(f"Removed {removed_count} redundant duplicate copies.")
remaining = [f for f in os.listdir(folder) if f.startswith("New Document") and f.lower().endswith(".pdf")]
print(f"Clean unique new documents remaining: {len(remaining)}")
