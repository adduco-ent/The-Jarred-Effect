/* The Other Half app: scoring, shared by the browser (app.js) and the server (api/quiz.js), so a type can't be
   faked from the browser. Also turns a set of answers into a short code for result links (?r=...).

   How a type is chosen (2026-10-22): each type has a profile, how that type tends to answer on all six traits and how
   much each trait matters to it (content.js `profiles`). A person's answers are measured against every profile, and
   the closest fit wins. Nothing depends on which type is checked first. The fit for every type becomes their mix
   ("mostly Achiever, with a Pendulum streak"), and a few words they choose to describe themselves can break a near-tie. */
(function (root) {
  'use strict';
  var DIMS = ['dd', 'ff', 'aa', 'ct', 'swing', 'insight'];
  function avg(list) { return list.length ? list.reduce(function (a, b) { return a + b; }, 0) / list.length : 0; }
  function isNum(v) { return typeof v === 'number' && !isNaN(v); }

  // self-described words that match a type's list nudge that type a little (a tiebreaker, never the decider)
  function wordHits(C, words) {
    var hits = {};
    var list = String(words || '').toLowerCase().split(/[^a-zÀ-ɏ-]+/).filter(Boolean);
    Object.keys(C.selfWords || {}).forEach(function (t) {
      hits[t] = list.filter(function (w) { return C.selfWords[t].indexOf(w) >= 0; });
    });
    return hits;
  }

  // how someone whose true lean on a trait is v (-2 to 2) tends to answer: "both" more often near the middle,
  // and A or B in proportion to where they sit
  function answerChance(ans, v) {
    var both = 0.12 + 0.18 * (1 - Math.abs(v) / 2);
    return ans === 0 ? both : (1 - both) * (ans > 0 ? (v + 2) / 4 : (2 - v) / 4);
  }
  // the chance of one trait's answers for a type whose lean is around `at`, give or take `spread`
  var GRID = []; for (var g = -2; g <= 2.0001; g += 0.25) GRID.push(g);
  function traitLikelihood(list, at, spread) {
    var num = 0, den = 0;
    GRID.forEach(function (v) {
      var w = Math.exp(-Math.pow(v - at, 2) / (2 * spread * spread)), p = w;
      list.forEach(function (ans) { p *= Math.max(1e-6, answerChance(ans, v)); });
      num += p; den += w;
    });
    return num / den;
  }

  // Each answer is -2 (A), 0 (both) or +2 (B); a missing answer (an old 12-question link) is left out.
  function score(C, answers, words) {
    var by = {};
    C.questions.forEach(function (q, i) { var v = answers[i]; if (isNum(v)) (by[q.on] = by[q.on] || []).push(v); });
    var dims = {};
    DIMS.forEach(function (d) { dims[d] = avg(by[d] || []); });
    var pairs = {};
    C.pairs.forEach(function (p) { pairs[p.id] = dims[p.id]; });

    // fit to each profile: how likely these exact answers are from someone of that type. Each type's lean on a trait
    // is a range, not a point (tighter where the trait defines the type), and people sometimes say "both" or answer
    // against their lean, so every answer is weighed with that in mind.
    var hits = wordHits(C, words), logL = {};
    Object.keys(C.profiles).forEach(function (t) {
      var pr = C.profiles[t], ll = 0;
      DIMS.forEach(function (d) { if (by[d] && by[d].length) ll += Math.log(traitLikelihood(by[d], pr.at[d], 1.1 / Math.sqrt(pr.weight[d]))); });
      logL[t] = ll + Math.log(1 + 0.25 * Math.min(3, (hits[t] || []).length));
    });
    // the mix: softened, so a close second still shows as a streak instead of vanishing
    var top = Math.max.apply(null, Object.keys(logL).map(function (t) { return logL[t]; })), total = 0, fit = {};
    Object.keys(logL).forEach(function (t) { fit[t] = Math.exp((logL[t] - top) * 0.6); total += fit[t]; });
    var mix = {};
    Object.keys(fit).forEach(function (t) { mix[t] = fit[t] / total; });
    var order = Object.keys(mix).sort(function (a, b) { return mix[b] - mix[a]; });
    var type = order[0], second = order[1];
    // a streak only when the runner-up is genuinely close
    var streak = mix[second] >= 0.22 && mix[second] >= mix[type] * 0.6 ? second : null;

    // the missing half: the far pole of the pair they lean hardest on
    var far = C.pairs.slice().sort(function (a, b) { return Math.abs(pairs[b.id]) - Math.abs(pairs[a.id]); })[0];
    var missing = Math.abs(pairs[far.id]) < 0.5 ? null : (pairs[far.id] < 0 ? far.b : far.a);
    var leaning = missing ? (pairs[far.id] < 0 ? far.a : far.b) : null;
    return { pairs: pairs, dims: dims, swing: dims.swing, insight: dims.insight, type: type, second: second, streak: streak,
      mix: mix, order: order, words: hits, missing: missing, leaning: leaning };
  }

  // answers <-> a short code: a (A), o (both), b (B), one letter per question. Old 12-letter codes still read.
  var TO = { '-2': 'a', '0': 'o', '2': 'b' }, FROM = { a: -2, o: 0, b: 2 };
  function encode(answers) { return answers.map(function (v) { return TO[String(v)] || 'o'; }).join(''); }
  function decode(code, n) {
    code = String(code || '').toLowerCase();
    if ((code.length !== n && code.length !== 12) || /[^aob]/.test(code)) return null;
    var out = code.split('').map(function (ch) { return FROM[ch]; });
    while (out.length < n) out.push(null);
    return out;
  }

  var api = { score: score, encode: encode, decode: decode, DIMS: DIMS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.OH_SCORE = api;
})(this);
