import json
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('d:/Work/E-Learning/pdf_analysis_cache.json', 'r', encoding='utf-8') as f:
    cache = json.load(f)

items = sorted(cache.items())
print(f"--- ITEMS 30 to 70 ---")
for fname, data in items[30:70]:
    txts = " ".join(data.get('texts', []))[:140]
    print(f"{fname:<24} | {data.get('page_count', 1):>2} p | {txts}")

print(f"\n--- ITEMS 70 to 110 ---")
for fname, data in items[70:]:
    txts = " ".join(data.get('texts', []))[:140]
    print(f"{fname:<24} | {data.get('page_count', 1):>2} p | {txts}")
