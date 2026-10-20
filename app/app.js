/* The Other Half app — screens and state.
   Test build: progress is kept in this browser (localStorage) until the Supabase connection lands. */
(function () {
  'use strict';
  var C = window.OH_CONTENT;
  var KEY = 'oh.v1';
  // review mode: the "See all 12 questions" list is for Jarred, not visitors. It shows on this Mac's preview,
  // or on the live site with ?review in the address (e.g. /app/?review).
  var REVIEW = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || /[?&]review\b/.test(location.search);
  var root = document.getElementById('app');

  var state = load();
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { answers: [] }; } catch (e) { return { answers: [] }; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private window: the quiz still works, it just won't remember */ }
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function avg(list) { return list.length ? list.reduce(function (a, b) { return a + b; }, 0) / list.length : 0; }

  // ---------------------------------------------------------------- scoring
  // Each answer is -2 (strongly A) .. +2 (strongly B). Pairs: negative leans to the A pole.
  function score(answers) {
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

  // ---------------------------------------------------------------- screens
  var screens = {
    // the start: what this is, a preview of the experience, and the question they'll want answered
    welcome: function () {
      var names = Object.keys(C.types).map(function (k) { return esc(C.types[k].name.replace(/^The /, '')); }).join('<i aria-hidden="true">·</i>');
      return '<section class="oh-screen oh-welcome">' +
        '<p class="oh-kick"><span class="oh-dot" aria-hidden="true"></span>The Polarity Profile</p>' +
        '<h1 class="oh-h1">Find your <span class="oh-it">other half.</span></h1>' +
        '<p class="oh-lead">Twelve quick choices. You’ll see your balance, your type, and the half you’ve been missing.</p>' +
        // a preview: a question card fanned behind the card they'll get at the end
        '<div class="oh-peek" aria-hidden="true">' +
          '<div class="oh-peek-q"><b>A</b><span>When I want something…</span></div>' +
          '<div class="oh-peek-t"><p class="oh-peek-k"><span class="oh-dot"></span>Your type</p><p class="oh-peek-name">Which one are you?</p><p class="oh-peek-list">' + names + '</p></div>' +
        '</div>' +
        '<button class="oh-cta" type="button" data-go="quiz">Start the quiz' + arrow() + '</button>' +
        '<p class="oh-facts"><span>12 questions</span><span>2 minutes</span><span>No sign-up</span></p>' +
        (REVIEW ? allQuestions() : '') +
        '</section>';
    },
    // the quiz shell (header, progress, counter) stays put; only the stage inside it changes between questions
    quiz: function () {
      var i = Math.min(state.step || 0, C.questions.length - 1);
      return '<section class="oh-screen oh-quiz">' +
        '<div class="oh-qbar"><button class="oh-back oh-back--icon" type="button" data-back aria-label="Back">' + backArrow() + '</button>' +
          '<div class="oh-seg" aria-hidden="true">' + C.questions.map(function () { return '<i></i>'; }).join('') + '</div>' +
          '<span class="oh-count"></span></div>' +
        '<div class="oh-stage">' + stage(i) + '</div>' +
        '</section>';
    },
    // the reveal: the type as a card worth keeping, the balance map, the read, and their other half
    result: function () {
      var r = score(state.answers);
      var t = C.types[r.type];
      var lc = function (s) { return esc(String(s).toLowerCase()); };
      var map = C.pairs.map(function (p, k) {
        var v = r.pairs[p.id];
        var at = Math.round((v + 2) / 4 * 100);
        var side = v <= -0.5 ? 'a' : v >= 0.5 ? 'b' : 'mid';
        return '<li class="oh-bal" data-side="' + side + '" style="--at:' + at + '%;--k:' + k + '">' +
          '<span class="oh-pole oh-pole--a">' + esc(p.a) + '</span>' +
          '<span class="oh-track" aria-hidden="true"><i></i></span>' +
          '<span class="oh-pole oh-pole--b">' + esc(p.b) + '</span></li>';
      }).join('');
      // what's missing, said in a way that never contradicts the type: a Calibrated result never "leans hard"
      var half;
      if (r.type !== 'calibrated' && r.missing) {
        half = 'You lean on <i>' + lc(r.leaning) + '</i>. Your other half is <i>' + lc(r.missing) + '</i>.';
      } else if (r.missing) {
        half = 'No single side runs the show. If one slips first, it’ll be <i>' + lc(r.missing) + '</i>.';
      } else {
        half = 'No single side runs the show. Your work is keeping it that way when life gets loud.';
      }
      return '<section class="oh-screen oh-result">' +
        '<div class="oh-type">' +
          '<p class="oh-type-k"><span class="oh-dot" aria-hidden="true"></span>Your Polarity Profile</p>' +
          '<h1 class="oh-type-name">' + esc(t.name) + '</h1>' +
          '<p class="oh-type-line">' + esc(t.line) + '</p>' +
        '</div>' +
        '<div class="oh-sec">' +
          '<p class="oh-sec-k">Your balance</p>' +
          '<ul class="oh-map" aria-label="Your balance map">' + map + '</ul>' +
          '<p class="oh-fine oh-map-note">The center line is balance. The dot is where you lean.</p>' +
        '</div>' +
        '<div class="oh-sec">' +
          '<p class="oh-sec-k">The read</p>' +
          '<p class="oh-read">' + esc(t.read) + '</p>' +
          '<p class="oh-sub">You might recognize this</p>' +
          '<ol class="oh-signs">' + t.signs.map(function (s, k) { return '<li><span aria-hidden="true">' + pad(k + 1) + '</span><p>' + esc(s) + '</p></li>'; }).join('') + '</ol>' +
        '</div>' +
        '<div class="oh-sec">' +
          '<p class="oh-sec-k">What your answers say</p>' +
          '<div class="oh-says">' + says(r) + '</div>' +
        '</div>' +
        '<div class="oh-sec oh-two">' +
          '<div><p class="oh-sec-k">Your strength</p><p class="oh-body">' + esc(t.strength) + '</p></div>' +
          '<div><p class="oh-sec-k">What it’s costing you</p><p class="oh-body">' + esc(t.cost) + '</p></div>' +
        '</div>' +
        '<div class="oh-sec">' +
          '<p class="oh-sec-k">Your other half</p>' +
          '<p class="oh-half">' + half + '</p>' +
          '<p class="oh-fine">' + (r.type !== 'calibrated' && r.missing ? 'It’s the side you use least, and the one your plan builds first.' : 'Your plan keeps both sides strong.') + '</p>' +
        '</div>' +
        '<div class="oh-sec">' +
          '<p class="oh-sec-k">Try this for 7 days</p>' +
          '<div class="oh-rep"><p class="oh-rep-t">' + esc(t.rep.title) + '</p><p class="oh-rep-w">' + esc(t.rep.what) + '</p>' +
            '<p class="oh-rep-r"><b>Rough day?</b> ' + esc(t.rep.rough) + '</p></div>' +
        '</div>' +
        '<div class="oh-sec oh-sec--q">' +
          '<p class="oh-sec-k">A question to sit with</p>' +
          '<p class="oh-shadow">' + esc(t.question.ask) + '</p>' +
          '<p class="oh-shadow-by">— ' + esc(t.question.name) + '</p>' +
          '<p class="oh-fine">' + esc(t.question.hint) + ' Answer it honestly, not nicely.</p>' +
        '</div>' +
        '<div class="oh-next" aria-disabled="true">' +
          '<p class="oh-next-k">Your next step <span>Coming soon</span></p>' +
          '<p class="oh-next-t">Turn this into a plan.</p>' +
          '<p class="oh-next-d">Name the one thing you want. You’ll get a 7-day plan built for your type, one small step a day, starting with your other half.</p>' +
        '</div>' +
        '<p class="oh-fine oh-retake"><button class="oh-link" type="button" data-retake>Retake the quiz</button></p>' +
        '</section>';
    }
  };

  // every question at a glance, grouped by what it measures; a native <details> so it opens and closes with no script
  function allQuestions() {
    var groups = C.pairs.map(function (p) { return { id: p.id, name: p.a + ' ↔ ' + p.b }; })
      .concat(Object.keys(C.patterns).map(function (id) { return { id: id, name: C.patterns[id] }; }));
    var n = 0;
    var body = groups.map(function (g) {
      var rows = C.questions.filter(function (q) { return q.on === g.id; }).map(function (q) {
        n = C.questions.indexOf(q) + 1;
        return '<li><span class="oh-all-n">' + n + '</span><div><p class="oh-all-ask">' + esc(q.ask) + '</p><p><b>A</b>' + esc(q.a) + '</p><p><b>B</b>' + esc(q.b) + '</p></div></li>';
      }).join('');
      return '<div class="oh-all-g"><p class="oh-mini">' + esc(g.name) + '</p><ol>' + rows + '</ol></div>';
    }).join('');
    return '<details class="oh-all"><summary><span>See all ' + C.questions.length + ' questions</span><i aria-hidden="true"></i></summary>' +
      '<p class="oh-fine">For each one, tap the ending that’s more like you, or Both.</p>' + body + '</details>';
  }

  function stage(i) {
    var q = C.questions[i];
    var picked = state.answers[i];
    var choice = function (v, cls, inner, label) {
      return '<button class="' + cls + '" type="button" role="radio" aria-checked="' + (picked === v) + '" aria-label="' + esc(label) + '" data-answer="' + v + '">' + inner + '</button>';
    };
    var check = '<i class="oh-check" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M5.5 10.5l3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></i>';
    return '<p class="oh-moment">' + esc((C.moments || {})[i + 1] || '') + '</p>' +
      '<h2 class="oh-q">' + esc(q.ask) + '</h2>' +
      '<div class="oh-choose" role="radiogroup" aria-label="Which is more like you?">' +
        choice(-2, 'oh-end oh-end--a', '<b aria-hidden="true">A</b>' + check + '<span>' + esc(q.a) + '</span>', q.ask + ' ' + q.a) +
        choice(0, 'oh-both', '<span>or both</span>', 'Both are me') +
        choice(2, 'oh-end oh-end--b', '<b aria-hidden="true">B</b>' + check + '<span>' + esc(q.b) + '</span>', q.ask + ' ' + q.b) +
      '</div>';
  }
  // header bits that change per question, updated in place so the progress line glides instead of jumping
  function chrome(i) {
    var count = root.querySelector('.oh-count'), bar = root.querySelector('.oh-bar i');
    if (count) { count.innerHTML = '<b>' + pad(Math.min(i + 1, C.questions.length)) + '</b> / ' + pad(C.questions.length); count.setAttribute('aria-label', 'Question ' + (i + 1) + ' of ' + C.questions.length); }
    if (bar) bar.style.width = Math.round(i / C.questions.length * 100) + '%';
    [].forEach.call(root.querySelectorAll('.oh-seg i'), function (s, k) { s.className = k < i ? 'is-done' : (k === i ? 'is-now' : ''); });
  }
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var busy = false;
  // one question hands over to the next: the old stage drifts up and out of focus, the new one comes into focus
  function turn(to, dir) {
    var st = root.querySelector('.oh-stage');
    if (!st) { render(); return; }
    busy = true;
    st.classList.add(dir < 0 ? 'is-leaving-back' : 'is-leaving');
    chrome(to);
    setTimeout(function () {
      st.className = 'oh-stage' + (dir < 0 ? ' is-entering-back' : '');
      st.innerHTML = stage(to);
      var h = st.querySelector('.oh-q'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      busy = false;
    }, still ? 0 : 340);
  }
  function says(r) {
    var rows = C.pairs.map(function (p) { return { p: p, v: r.pairs[p.id] }; })
      .sort(function (x, y) { return Math.abs(y.v) - Math.abs(x.v); })
      .map(function (x) {
        var side = x.v <= -0.5 ? 'a' : x.v >= 0.5 ? 'b' : 'mid';
        var tag = side === 'mid' ? 'In balance' : (Math.abs(x.v) >= 1.5 ? 'Strong lean · ' : 'Leaning · ') + (side === 'a' ? x.p.a : x.p.b);
        return '<div class="oh-say" data-side="' + side + '"><p class="oh-say-k"><b>' + esc(x.p.a) + ' <i>/</i> ' + esc(x.p.b) + '</b><span>' + esc(tag) + '</span></p>' +
          '<p class="oh-body">' + esc(C.pairReads[x.p.id][side]) + '</p></div>';
      });
    if (r.swing >= 0.5) rows.push('<div class="oh-say"><p class="oh-say-k"><b>Your weeks</b><span>A swing</span></p><p class="oh-body">' + esc(C.patternReads.swing) + '</p></div>');
    if (r.insight >= 0.5) rows.push('<div class="oh-say"><p class="oh-say-k"><b>Thinking and doing</b><span>Thinking first</span></p><p class="oh-body">' + esc(C.patternReads.insight) + '</p></div>');
    return rows.join('');
  }
  // after the last answer: a quiet beat, then the reveal
  function reading() {
    var st = root.querySelector('.oh-stage');
    if (!st || still) { go('result'); return; }
    busy = true;
    chrome(C.questions.length);
    st.classList.add('is-leaving');
    setTimeout(function () {
      st.className = 'oh-stage';
      st.innerHTML = '<div class="oh-reading" role="status"><span class="oh-reading-mark" aria-hidden="true"></span><p>Reading your answers…</p></div>';
    }, 340);
    setTimeout(function () { busy = false; go('result'); }, 1700);
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function arrow() { return '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function backArrow() { return '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H5M9 5l-5 5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }

  // ---------------------------------------------------------------- routing
  function current() {
    var h = (location.hash || '').replace('#', '');
    return screens[h] ? h : (state.done ? 'result' : 'welcome');
  }
  function render() {
    var name = current();
    root.innerHTML = screens[name]();
    root.setAttribute('data-screen', name);
    document.body.setAttribute('data-screen', name);
    if (name === 'quiz') chrome(Math.min(state.step || 0, C.questions.length - 1));
    var focus = root.querySelector('h1, .oh-q');
    if (focus) { focus.setAttribute('tabindex', '-1'); focus.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
  }
  function go(name) { if (location.hash === '#' + name) render(); else location.hash = name; }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (!t || t.disabled) return;
    if (t.hasAttribute('data-go')) {
      if (t.getAttribute('data-go') === 'quiz') { state.step = 0; state.answers = []; state.done = false; save(); }
      go(t.getAttribute('data-go'));
    } else if (t.hasAttribute('data-answer')) {
      if (busy) return;
      var i = state.step || 0;
      state.answers[i] = Number(t.getAttribute('data-answer'));
      save();
      [].forEach.call(root.querySelectorAll('[data-answer]'), function (b) { b.setAttribute('aria-checked', String(b === t)); });
      // only in the moment of choosing do the other options fade; coming back to a question shows them all again
      t.closest('.oh-choose').classList.add('is-choosing');
      busy = true;
      // a beat to see the choice land, then hand over to the next question
      setTimeout(function () {
        busy = false;
        if (i + 1 < C.questions.length) { state.step = i + 1; save(); turn(i + 1, 1); }
        else { state.done = true; save(); reading(); }
      }, still ? 120 : 420);
    } else if (t.hasAttribute('data-back')) {
      if (busy) return;
      if ((state.step || 0) > 0) { state.step -= 1; save(); turn(state.step, -1); } else go('welcome');
    } else if (t.hasAttribute('data-retake')) {
      state = { answers: [], step: 0 }; save(); go('quiz');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey || root.getAttribute('data-screen') !== 'quiz') return;
    var k = (e.key || '').toLowerCase();
    var sel = k === 'a' ? '.oh-end--a' : k === 'b' ? '.oh-end--b' : null;
    var btn = sel && root.querySelector(sel);
    if (btn) { e.preventDefault(); btn.click(); }
  });
  window.addEventListener('hashchange', render);
  render();
})();
