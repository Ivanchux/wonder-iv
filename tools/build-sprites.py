#!/usr/bin/env python3
"""Convierte las hojas de operarios (4x2 fotogramas sobre verde #00FF00) en tiras PNG con transparencia.

Uso: python3 tools/build-sprites.py CARPETA_CON_HOJAS
La carpeta debe tener <clave>.png por cada hoja (a_walk.png, a_carry_piedra.png...).
Escribe img/obreros/<clave>.png (8 fotogramas en horizontal) y js/sprites.js con las medidas.
"""
import json, sys, pathlib
import numpy as np
from PIL import Image

COLS, ROWS, SCALE = 4, 2, 0.5
root = pathlib.Path(__file__).resolve().parent.parent
src = pathlib.Path(sys.argv[1])
out = root / 'img' / 'obreros'
out.mkdir(parents=True, exist_ok=True)

def key(img):
    im = img.convert('RGBA')
    a = np.asarray(im).astype(np.float32)
    # lo ya transparente se pone sobre verde para tratar todas las hojas igual
    al = a[..., 3:4] / 255
    rgb = a[..., :3] * al + np.array([0, 255, 0], np.float32) * (1 - al)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    spill = g - np.maximum(r, b)
    alpha = np.clip(1 - (spill - 40) / 90, 0, 1)
    alpha[spill < 40] = 1
    # quita el verde que se cuela en los bordes
    g2 = np.where(spill > 0, np.maximum(r, b) + np.minimum(spill, 0), g)
    g2 = np.where(spill > 0, np.minimum(g, np.maximum(r, b) + 6), g)
    res = np.dstack([r, g2, b, alpha * 255]).clip(0, 255).astype(np.uint8)
    return Image.fromarray(res, 'RGBA')

meta = {}
for f in sorted(src.glob('*.png')):
    k = f.stem
    sheet = key(Image.open(f))
    W, H = sheet.size
    cw, ch = W // COLS, H // ROWS
    cells = [sheet.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch)) for r in range(ROWS) for c in range(COLS)]
    boxes = [np.asarray(c)[..., 3] > 40 for c in cells]
    x0 = min(np.where(b.any(0))[0][0] for b in boxes); x1 = max(np.where(b.any(0))[0][-1] for b in boxes)
    y0 = min(np.where(b.any(1))[0][0] for b in boxes); y1 = max(np.where(b.any(1))[0][-1] for b in boxes)
    x0, y0, x1, y1 = max(0, x0 - 3), max(0, y0 - 3), min(cw, x1 + 4), min(ch, y1 + 4)
    fw, fh = int((x1 - x0) * SCALE), int((y1 - y0) * SCALE)
    strip = Image.new('RGBA', (fw * len(cells), fh))
    for i, c in enumerate(cells):
        strip.paste(c.crop((x0, y0, x1, y1)).resize((fw, fh), Image.LANCZOS), (i * fw, 0))
    strip.save(out / f'{k}.png', optimize=True)
    meta[k] = {'n': len(cells), 'w': fw, 'h': fh}
    print(k, fw, fh)

(root / 'js' / 'sprites.js').write_text(
    '// Generado por tools/build-sprites.py: medidas de cada tira de operarios (fotogramas, ancho y alto de un fotograma, al doble de tamaño)\n'
    'const SPRITES=' + json.dumps(meta, separators=(',', ':')) + ';\n', encoding='utf-8')
