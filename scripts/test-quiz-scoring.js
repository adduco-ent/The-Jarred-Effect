// Tests the quiz scoring on made-up people whose type we know, and compares it with the old scoring.
// Each person gets a personality near their type's profile (with real noise, because people are messy), answers all
// 18 questions the way that personality would, sometimes saying "both". We check how often the quiz names the right type.
// Usage: node scripts/test-quiz-scoring.js [people per type, default 400]
const C = require('../app/content');
const { score, DIMS } = require('../app/score');
const N = +process.argv[2] || 400;

// a seeded random, so runs are repeatable
let seed = 42;
function rand() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
function gauss() { let u = 0, v = 0; while (!u) u = rand(); while (!v) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const clip = (x) => Math.max(-2, Math.min(2, x));

function person(type, noise) {
  const at = C.profiles[type].at, me = {};
  DIMS.forEach((d) => { me[d] = clip(at[d] + gauss() * noise); });
  return C.questions.map((q) => {
    const v = me[q.on], pBoth = 0.12 + 0.18 * (1 - Math.abs(v) / 2);
    if (rand() < pBoth) return 0;
    return rand() < (v + 2) / 4 ? 2 : -2;
  });
}

// the scoring before 2026-10-22: first match wins, 12 questions, ambition never counted
function oldType(answers) {
  const by = {};
  C.questions.slice(0, 12).forEach((q, i) => { (by[q.on] = by[q.on] || []).push(answers[i] || 0); });
  const a = (l) => (l && l.length ? l.reduce((x, y) => x + y, 0) / l.length : 0);
  const p = { dd: a(by.dd), ff: a(by.ff), ct: a(by.ct) }, swing = a(by.swing), insight = a(by.insight);
  const dreamer = -(p.dd + p.ff) / 2, achiever = (p.dd - p.ct) / 2;
  if (swing >= 1) return 'pendulum';
  if (insight >= 1) return 'excavator';
  if (dreamer >= 1) return 'dreamer';
  if (achiever >= 1) return 'achiever';
  const leans = { dreamer, achiever, pendulum: swing, excavator: insight };
  const top = Object.keys(leans).sort((x, y) => leans[y] - leans[x])[0];
  return leans[top] > 0.5 ? top : 'calibrated';
}

// three words a person might use for themselves: often from their own type's list, sometimes not
const NEUTRAL = ['kind', 'loyal', 'funny', 'honest', 'friendly', 'quiet', 'stubborn', 'caring'];
function threeWords(type) {
  const out = [];
  for (let k = 0; k < 3; k++) {
    const r = rand();
    if (r < 0.45) { const l = C.selfWords[type]; out.push(l[Math.floor(rand() * l.length)]); }
    else if (r < 0.65) { const others = Object.keys(C.selfWords).filter((t) => t !== type), o = C.selfWords[others[Math.floor(rand() * others.length)]]; out.push(o[Math.floor(rand() * o.length)]); }
    else out.push(NEUTRAL[Math.floor(rand() * NEUTRAL.length)]);
  }
  return out.join(', ');
}

const types = Object.keys(C.profiles);
for (const noise of [0.5, 0.8]) {
  let withWords = 0, confirmed = 0;
  for (const t of types) for (let i = 0; i < N; i++) {
    const ans = person(t, noise), r = score(C, ans, threeWords(t));
    if (r.type === t) withWords++;
    // "Does this sound like you?": if it's off, they can pick the next-closest type
    if (r.type === t || r.second === t) confirmed++;
  }
  console.log('\nPeople ' + (noise === 0.5 ? 'fairly typical of their type' : 'messier, more mixed') + ' (noise ' + noise + '), ' + N + ' per type');
  console.log('type        old quiz   new quiz   new: right type in top two   new: what it picked instead');
  let oldAll = 0, newAll = 0, top2All = 0;
  for (const t of types) {
    let o = 0, n = 0, t2 = 0; const wrong = {};
    for (let i = 0; i < N; i++) {
      const ans = person(t, noise), r = score(C, ans);
      if (oldType(ans) === t) o++;
      if (r.type === t) n++; else wrong[r.type] = (wrong[r.type] || 0) + 1;
      if (r.type === t || r.second === t) t2++;
    }
    oldAll += o; newAll += n; top2All += t2;
    const w = Object.keys(wrong).sort((a, b) => wrong[b] - wrong[a]).map((k) => k + ' ' + Math.round(wrong[k] / N * 100) + '%').join(', ');
    console.log(t.padEnd(12) + (Math.round(o / N * 100) + '%').padEnd(11) + (Math.round(n / N * 100) + '%').padEnd(11) + (Math.round(t2 / N * 100) + '%').padEnd(29) + w);
  }
  const all = N * types.length;
  console.log('all'.padEnd(12) + (Math.round(oldAll / all * 100) + '%').padEnd(11) + (Math.round(newAll / all * 100) + '%').padEnd(11) + Math.round(top2All / all * 100) + '%');
  console.log('with their three words: ' + Math.round(withWords / all * 100) + '% right first time; after "Does this sound like you?": ' + Math.round(confirmed / all * 100) + '%');
}
