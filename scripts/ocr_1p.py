import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
import easyocr
from PIL import Image

reader = easyocr.Reader(['hi', 'en'], gpu=False, verbose=False)
check_1p = [
    'New Document(237).pdf', 'New Document(245).pdf', 'New Document(359).pdf',
    'New Document(361).pdf', 'New Document(371).pdf', 'New Document(380).pdf',
    'New Document(383).pdf', 'New Document(384).pdf', 'New Document(385).pdf',
    'New Document(387).pdf', 'New Document(404).pdf'
]

for f in check_1p:
    path = f'd:/Work/E-Learning/unresolved_b2/{f}.png'
    im = Image.open(path)
    w, h = im.size
    im_r = im.resize((700, int(h * 700 / w)))
    im_r.save(path)
    res = reader.readtext(path)
    texts = [r[1] for r in res if r[2] > 0.35]
    print(f"{f}: {' | '.join(texts[:8])}")
    sys.stdout.flush()
