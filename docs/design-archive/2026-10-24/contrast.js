(() => {
  // Estimates each text's contrast against what's behind it: composites ancestor backgrounds (colors, and the average of
  // gradient stops) over the page sky, and applies inherited opacity to the text color. Approximate, but good for finding weak spots.
  const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const hexes = (s) => (s.match(/#[0-9a-f]{6}\b/gi) || []).map(h => ({ r: parseInt(h.slice(1,3),16), g: parseInt(h.slice(3,5),16), b: parseInt(h.slice(5,7),16), a: 1 }));
  const stops = (img) => { const out = []; (img.match(/rgba?\([^)]+\)/g) || []).forEach(c => out.push(parse(c))); return out.concat(hexes(img)); };
  const avg = (arr) => { const n = arr.length; return arr.reduce((t, c) => ({ r: t.r + c.r / n, g: t.g + c.g / n, b: t.b + c.b / n, a: t.a + c.a / n }), { r: 0, g: 0, b: 0, a: 0 }); };
  const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const lum = (c) => { const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const page = { r: 238, g: 242, b: 251, a: 1 };
  const bgOf = (el) => {
    const chain = []; for (let e = el; e && e !== document.documentElement; e = e.parentElement) chain.push(e);
    let bg = page;
    for (let i = chain.length - 1; i >= 0; i--) {
      const cs = getComputedStyle(chain[i]);
      const img = cs.backgroundImage; let layer = null;
      if (img && img !== 'none' && /gradient/.test(img)) { const st = stops(img); if (st.length) layer = avg(st); }
      const col = parse(cs.backgroundColor);
      if (col && col.a > 0) bg = over(col, bg);
      if (layer && layer.a > 0) bg = over(layer, bg);
    }
    return bg;
  };
  const opacityOf = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
  const res = [];
  document.querySelectorAll('#plan *, .tb *').forEach((el) => {
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) return;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') return;
    let fg = parse(cs.color); if (!fg) return; fg.a *= opacityOf(el);
    const bg = bgOf(el), fgc = over(fg, bg), cr = ratio(fgc, bg);
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 600, large = size >= 24 || (bold && size >= 18.66);
    const need = large ? 3 : 4.5;
    if (cr < need) res.push({ cr: +cr.toFixed(2), need, size, text: [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').slice(0, 50), cls: (el.className && el.className.baseVal === undefined ? el.className : '') || el.tagName, color: cs.color });
  });
  const seen = new Set();
  return res.filter(x => { const k = x.cls + '|' + x.color + '|' + x.cr; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => a.cr - b.cr).slice(0, 40);
})()
