import json
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('d:/Work/E-Learning/pdf_analysis_cache.json', 'r', encoding='utf-8') as f:
    cache = json.load(f)

print(f"Total files in cache: {len(cache)}")

categorized = []

for fname, data in sorted(cache.items()):
    p_count = data.get('page_count', 1)
    texts = " ".join(data.get('texts', []))
    
    # We will analyze each file based on its texts, page count, and contents
    categorized.append({
        'fname': fname,
        'pages': p_count,
        'raw_text': texts[:150]
    })

# Print overview
for c in categorized[:30]:
    print(f"{c['fname']:<24} | {c['pages']:>2} pgs | {c['raw_text']}")
