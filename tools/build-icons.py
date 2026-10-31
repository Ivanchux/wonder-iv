#!/usr/bin/env python3
"""Genera el icono de la página y los favicons a partir de una pieza sobre fondo verde #00FF00.

Uso: python3 tools/build-icons.py PIEZA.png
Escribe icon-512.png, apple-touch-icon.png, favicon-32.png, favicon-16.png y favicon.ico en la raíz.
"""
import sys, pathlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

root = pathlib.Path(__file__).resolve().parent.parent

def key(path):
    a = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    spill = g - np.maximum(r, b)
    alpha = np.clip(1 - (spill - 40) / 90, 0, 1); alpha[spill < 40] = 1
    g2 = np.where(spill > 0, np.minimum(g, np.maximum(r, b) + 6), g)
    im = Image.fromarray(np.dstack([r, g2, b, alpha * 255]).clip(0, 255).astype(np.uint8), 'RGBA')
    return im.crop(im.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox())

gem = key(sys.argv[1])

def lapis(size, rounded, border):
    top, bot = np.array([0x3a, 0x6a, 0xd8]), np.array([0x10, 0x20, 0x5c])
    t = np.linspace(0, 1, size)[:, None, None]
    img = Image.fromarray(np.broadcast_to((top * (1 - t) + bot * t), (size, size, 3)).astype(np.uint8), 'RGB').convert('RGBA')
    # resplandor detrás de la pieza
    glow = Image.new('RGBA', (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(glow)
    d.ellipse([size * .12, size * .12, size * .88, size * .88], fill=(255, 220, 120, 70))
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(size * .06)))
    if border:
        d = ImageDraw.Draw(img); w = max(2, size // 40); m = size // 24
        d.rounded_rectangle([m, m, size - m - 1, size - m - 1], radius=size // 6, outline=(242, 210, 122, 255), width=w)
    if rounded:
        mask = Image.new('L', (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * .2), fill=255)
        img.putalpha(mask)
    return img

def icon(size, fill, rounded=True, border=True):
    img = lapis(size, rounded, border)
    s = size * fill / max(gem.size)
    g = gem.resize((round(gem.width * s), round(gem.height * s)), Image.LANCZOS)
    shadow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    shadow.paste((0, 0, 0, 110), ((size - g.width) // 2 + size // 60, (size - g.height) // 2 + size // 50), g.getchannel('A'))
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(size / 90)))
    img.alpha_composite(g, ((size - g.width) // 2, (size - g.height) // 2))
    return img

icon(512, .66).save(root / 'icon-512.png', optimize=True)
icon(180, .66, rounded=False).convert('RGB').save(root / 'apple-touch-icon.png', optimize=True)
icon(32, .86, border=False).save(root / 'favicon-32.png', optimize=True)
icon(16, .9, border=False).save(root / 'favicon-16.png', optimize=True)
icon(64, .86, border=False).save(root / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print('iconos listos')
