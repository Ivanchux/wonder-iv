#!/usr/bin/env python3
"""Procesa las imágenes sueltas sobre verde #00FF00 (piezas, bloques, marco, columna) a PNG con transparencia.

Uso: python3 tools/build-art.py CARPETA   (con las claves como nombre: gema_sol.png, bloque_piedra.png, marco.png, columna.png, edif_pozo_1.png, maravilla_faro.png, mapa_asentamiento.png...)
Escribe img/piezas, img/bloques, img/edificios, img/marco.png, img/columna.png y, si hay marco, js/arte.js (medidas del hueco).
"""
import json, sys, pathlib
import numpy as np
from PIL import Image

root = pathlib.Path(__file__).resolve().parent.parent
src = pathlib.Path(sys.argv[1])
SIZES = {'gema': 192, 'bloque': 176, 'marco': 800, 'columna': 760, 'edif': 460, 'maravilla': 440}   # lado mayor en px (al doble de lo que se ve)

def key(img):
    a = np.asarray(img.convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    spill = g - np.maximum(r, b)
    alpha = np.clip(1 - (spill - 40) / 90, 0, 1)
    alpha[spill < 40] = 1
    g2 = np.where(spill > 0, np.minimum(g, np.maximum(r, b) + 6), g)
    return Image.fromarray(np.dstack([r, g2, b, alpha * 255]).clip(0, 255).astype(np.uint8), 'RGBA')

def crop_resize(im, side):
    bb = im.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox()
    im = im.crop(bb)
    s = side / max(im.size)
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS), bb

meta = {}
for f in sorted(src.glob('*.png')):
    k = f.stem
    kind = k.split('_')[0]
    if kind == 'mapa':   # paisaje sin fondo verde: solo se reduce y se guarda como JPG
        im = Image.open(f).convert('RGB'); im = im.resize((1600, round(1600 * im.height / im.width)), Image.LANCZOS)
        im.save(root / 'img' / (k + '.jpg'), quality=84, optimize=True, progressive=True); print(k, im.size); continue
    im = key(Image.open(f))
    out, bb = crop_resize(im, SIZES[kind])
    if kind == 'gema': d = root / 'img' / 'piezas'
    elif kind == 'bloque': d = root / 'img' / 'bloques'
    elif kind == 'edif': d = root / 'img' / 'edificios'
    elif kind == 'maravilla': d = root / 'img' / 'maravillas'
    else: d = root / 'img'
    d.mkdir(parents=True, exist_ok=True)
    out.save(d / f'{k}.png', optimize=True)
    if k == 'marco':
        # hueco liso del interior: el rectángulo más grande de teal oscuro (#1c3a44)
        o = np.asarray(out).astype(int)
        m = (o[..., 3] > 200) & (abs(o[..., 0] - 28) < 22) & (abs(o[..., 1] - 58) < 26) & (abs(o[..., 2] - 68) < 26)
        cols = np.where(m.sum(0) > 0.5 * m.sum(0).max())[0]; rows = np.where(m.sum(1) > 0.5 * m.sum(1).max())[0]
        x0, x1, y0, y1 = cols[0], cols[-1] + 1, rows[0], rows[-1] + 1
        meta['marco'] = {'w': out.width, 'h': out.height, 'x': round(x0 / out.width, 4), 'y': round(y0 / out.height, 4),
                         'iw': round((x1 - x0) / out.width, 4), 'ih': round((y1 - y0) / out.height, 4)}
    print(k, out.size)

if meta:
    (root / 'js' / 'arte.js').write_text('// Generado por tools/build-art.py: posición del hueco liso dentro de img/marco.png (fracciones del tamaño)\nconst ARTE=' + json.dumps(meta, separators=(',', ':')) + ';\n', encoding='utf-8')
