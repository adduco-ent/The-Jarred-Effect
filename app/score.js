/* The Other Half app: scoring, shared by the browser (app.js) and the server (api/quiz.js), so a type can't be
   faked from the browser. Also turns a set of answers into a short code for result links (?r=...). */
(function (root) {
  'use strict';
  function avg(list) { return list.length ? list.reduce(function (a, b) { return a + b; }, 0) / list.length : 0; }

  // Each answer is -2 (A), 0 (both) or +2 (B). Pairs: negative leans to the first pole.
  function score(C, answers) {
    var by = {};
    C.questions.forEach(function (q, i) { (by[q.on] = by[q.on] || []).push(answers[i] || 0); });
    var pairs = {};
    C.pairs.forEach(function (p) { pairs[p.id] = avg(by[p.id] || []); });
    var swing = avg(by.swing || []);
    var insight = avg(by.insight || []);
    var dreamer = -(pairs.dd + pairs.ff) / 2;      // leans desire + faith
    var achiever = (pairs.dd - pairs.ct) / 2;      // leans discipline + control
    var type;
    if (swing >= 1) type = 'pendulum';
    else if (insight >= 1) type = 'excavator';
    else if (dreamer >= 1) type = 'dreamer';
    else if (achiever >= 1) type = 'achiever';
    else {
      var leans = { dreamer: dreamer, achiever: achiever, pendulum: swing, excavator: insight };
      var top = Object.keys(leans).sort(function (a, b) { return leans[b] - leans[a]; })[0];
      type = leans[top] > 0.5 ? top : 'calibrated';
    }
    // the missing half: the far pole of the pair they lean hardest on
    var far = C.pairs.slice().sort(function (a, b) { return Math.abs(pairs[b.id]) - Math.abs(pairs[a.id]); })[0];
    var missing = Math.abs(pairs[far.id]) < 0.5 ? null : (pairs[far.id] < 0 ? far.b : far.a);
    var leaning = missing ? (pairs[far.id] < 0 ? far.a : far.b) : null;
    return { pairs: pairs, swing: swing, insight: insight, type: type, missing: missing, leaning: leaning };
  }

  // answers <-> a 12-letter code: a (A), o (or both), b (B)
  var TO = { '-2': 'a', '0': 'o', '2': 'b' }, FROM = { a: -2, o: 0, b: 2 };
  function encode(answers) { return answers.map(function (v) { return TO[String(v)] || 'o'; }).join(''); }
  function decode(code, n) {
    code = String(code || '').toLowerCase();
    if (code.length !== n || /[^aob]/.test(code)) return null;
    return code.split('').map(function (ch) { return FROM[ch]; });
  }

  var api = { score: score, encode: encode, decode: decode };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.OH_SCORE = api;
})(this);
