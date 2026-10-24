// The best any scorer can do on this simulation: score with the exact model that made the answers (spread 0.5 everywhere).
const path = require('path'), root = process.argv[2];
const C = require(path.join(root, 'app/content'));
const S = require(path.join(root, 'app/score'));
let seed = 42; const rand = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
const gauss = () => { let u = 0, v = 0; while (!u) u = rand(); while (!v) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const clip = (x) => Math.max(-2, Math.min(2, x));
const chance = (a, v) => { const b = 0.12 + 0.18 * (1 - Math.abs(v) / 2); return a === 0 ? b : (1 - b) * (a > 0 ? (v + 2) / 4 : (2 - v) / 4); };
for (const qcount of [3, 5, 8]) {
  let right = 0, all = 0;
  for (const t of Object.keys(C.profiles)) for (let i = 0; i < 400; i++) {
    const me = {}; S.DIMS.forEach((d) => me[d] = clip(C.profiles[t].at[d] + gauss() * 0.5));
    const ans = {}; S.DIMS.forEach((d) => { ans[d] = []; for (let k = 0; k < qcount; k++) { const v = me[d], b = 0.12 + 0.18 * (1 - Math.abs(v) / 2); ans[d].push(rand() < b ? 0 : rand() < (v + 2) / 4 ? 2 : -2); } });
    let best = null, bestL = -Infinity;
    for (const u of Object.keys(C.profiles)) {
      let ll = 0;
      for (const d of S.DIMS) { let num = 0, den = 0; for (let v = -2; v <= 2.0001; v += 0.1) { const w = Math.exp(-Math.pow(v - C.profiles[u].at[d], 2) / 0.5); let p = w; ans[d].forEach((a) => p *= chance(a, v)); num += p; den += w; } ll += Math.log(num / den); }
      if (ll > bestL) { bestL = ll; best = u; }
    }
    if (best === t) right++; all++;
  }
  console.log(qcount + ' questions per trait (' + qcount * 6 + ' in all): best possible ' + Math.round(right / all * 100) + '%');
}
