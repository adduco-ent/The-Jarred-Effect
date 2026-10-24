# Builds the Other Half app icons: the brand bird in cream on the navy of the plan card.
import sys
from PIL import Image, ImageFilter, ImageDraw, ImageChops
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('L')
mask = Image.eval(im, lambda v: 255 - v)                 # bird = white
bbox = mask.point(lambda v: 255 if v > 40 else 0).getbbox()
bird = mask.crop(bbox)
# redraw the edges smoothly: upscale a lot, soften, cut crisp, then scale down with anti-aliasing
big = bird.resize((bird.width * 10, bird.height * 10), Image.LANCZOS).filter(ImageFilter.GaussianBlur(6))
big = big.point(lambda v: 255 if v > 118 else 0)

def bg(size):
    w = h = size
    base = Image.new('RGB', (w, h))
    top, bot = (21, 36, 62), (11, 22, 38)                 # navy, like the plan card
    d = ImageDraw.Draw(base)
    for y in range(h):
        t = y / (h - 1)
        d.line([(0, y), (w, y)], fill=tuple(round(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    def glow(cx, cy, r, color, strength):
        g = Image.new('L', (w, h), 0)
        ImageDraw.Draw(g).ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
        g = g.filter(ImageFilter.GaussianBlur(r * 0.45)).point(lambda v: int(v * strength))
        return Image.composite(Image.new('RGB', (w, h), color), base, g)
    base = glow(w * 1.0, h * 1.0, w * 0.62, (86, 132, 204), 0.55)   # sky-blue light, bottom right
    base = glow(0, h * 1.1, w * 0.5, (150, 128, 212), 0.3)          # lavender haze, bottom left
    return base

def icon(size, bird_frac, name):
    base = bg(size)
    bw = round(size * bird_frac)
    bh = round(big.height * bw / big.width)
    m = big.resize((bw, bh), Image.LANCZOS)
    layer = Image.new('RGB', (bw, bh), (239, 231, 218))          # cream
    x, y = (size - bw) // 2, (size - bh) // 2 - round(size * 0.01)
    base.paste(layer, (x, y), m)
    base.save(out + '/' + name, optimize=True)

icon(512, 0.66, 'icon-512.png')
icon(192, 0.66, 'icon-192.png')
icon(180, 0.66, 'apple-touch-icon.png')
icon(512, 0.52, 'icon-maskable-512.png')   # maskable: bird inside the safe circle
icon(96, 0.7, 'badge-96.png')
print('ok', bird.size)
