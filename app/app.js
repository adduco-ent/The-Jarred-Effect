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
  (function () {
    var m = /[?&]r=([a-z]+)/i.exec(location.search);
    var answers = m && window.OH_SCORE.decode(m[1], C.questions.length);
    if (answers) { state = { answers: answers, step: C.questions.length - 1, done: true }; save(); if (location.hash !== '#result') location.hash = 'result'; }
  })();
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { answers: [] }; } catch (e) { return { answers: [] }; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* private window: the quiz still works, it just won't remember */ }
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // scoring lives in score.js, shared with the server
  function score(answers) { return window.OH_SCORE.score(C, answers, state.words); }
  // their type: the closest fit, or the runner-up if they said the first didn't sound like them
  function final(r) { return state.pick && (state.pick === r.type || state.pick === r.second) ? state.pick : r.type; }
  function short(t) { return C.types[t].name.replace(/^The /, ''); }
  function mid(t) { return C.types[t].name.replace(/^The /, 'the '); } // the name mid-sentence: "over the Achiever"

  // ---------------------------------------------------------------- screens
  var screens = {
    // the start: what this is, a preview of the experience, and the question they'll want answered
    welcome: function () {
      var names = Object.keys(C.types).map(function (k) { return esc(C.types[k].name.replace(/^The /, '')); }).join('<i aria-hidden="true">·</i>');
      return '<section class="oh-screen oh-welcome">' +
        '<p class="oh-kick"><span class="oh-dot" aria-hidden="true"></span>The Polarity Profile</p>' +
        '<h1 class="oh-h1">Find your <span class="oh-it">other half.</span></h1>' +
        '<p class="oh-lead">Eighteen quick choices and a few about your life, about three minutes. You’ll see your balance, your type, and the half you’ve been missing.</p>' +
        // a preview: a question card fanned behind the card they'll get at the end
        '<div class="oh-peek" aria-hidden="true">' +
          '<div class="oh-peek-q"><b>A</b><span>When I want something…</span></div>' +
          '<div class="oh-peek-t"><p class="oh-peek-k"><span class="oh-dot"></span>Your type</p><p class="oh-peek-name">Which one are you?</p><p class="oh-peek-list">' + names + '</p></div>' +
        '</div>' +
        '<button class="oh-cta" type="button" data-go="quiz">Start the quiz' + arrow() + '</button>' +
        '<p class="oh-facts"><span>22 questions</span><span>3 minutes</span><span>No sign-up</span></p>' +
        (REVIEW ? allQuestions() : '') +
        '</section>';
    },
    // the quiz shell (header, progress, counter) stays put; only the stage inside it changes between questions
    quiz: function () {
      var i = Math.min(state.step || 0, C.questions.length + LIFE.length);
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
      var type = final(r), t = C.types[type];
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
      if (type !== 'calibrated' && r.missing) {
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
          (r.streak && type === r.type ? '<p class="oh-type-blend">Mostly ' + esc(short(type)) + ', with a ' + esc(short(r.streak)) + ' streak.</p>' : '') +
        '</div>' +
        '<div class="oh-share-row"><button class="oh-share" type="button" data-share>' + shareIcon() + '<span>Share your type</span></button><span class="oh-share-note" role="status"></span></div>' +
        why(r, type) + mix(r, type) + confirm(r, type) +
        '<div class="oh-sec">' +
          '<p class="oh-sec-k">Your balance</p>' +
          '<ul class="oh-map" aria-label="Your balance map">' + map + '</ul>' +
          '<p class="oh-fine oh-map-note">The center line is balance. The dot is where you lean.</p>' +
        '</div>' +
        '<div class="oh-sec oh-sec--open oh-sec--read">' +
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
        '<div class="oh-sec oh-sec--half">' +
          '<p class="oh-sec-k">Your other half</p>' +
          '<p class="oh-half">' + half + '</p>' +
          '<p class="oh-fine">' + (type !== 'calibrated' && r.missing ? 'It’s the side you use least, and the one your plan builds first.' : 'Your plan keeps both sides strong.') + '</p>' +
        '</div>' +
        '<div class="oh-sec">' +
          '<p class="oh-sec-k">Try this for 7 days</p>' +
          '<div class="oh-rep"><p class="oh-rep-t">' + esc(t.rep.title) + '</p><p class="oh-rep-w">' + esc(t.rep.what) + '</p>' +
            '<p class="oh-rep-r"><b>Hard day?</b> ' + esc(t.rep.rough) + '</p></div>' +
        '</div>' +
        '<div class="oh-sec oh-sec--open oh-sec--q">' +
          '<p class="oh-sec-k">One honest question</p>' +
          '<p class="oh-shadow">' + esc(t.question.ask) + '</p>' +
          '<p class="oh-fine">' + esc(t.question.hint) + ' Answer it honestly, not nicely.</p>' +
        '</div>' +
        '<form class="oh-next" data-results novalidate>' +
          '<p class="oh-next-k">Your next step</p>' +
          '<p class="oh-next-t">Turn this into a plan.</p>' +
          '<p class="oh-next-d">Name up to three things you want, and get your full results by email. Your 7-day plan follows as soon as it’s ready.</p>' +
          '<div class="oh-field oh-asks"><span id="asks-l">What you want <i>up to 3, optional</i></span>' +
            '<input name="ask" type="text" maxlength="200" autocomplete="off" aria-labelledby="asks-l" placeholder="e.g. run a 5K by spring">' +
            '<button class="oh-add" type="button" data-addask>+ Add another goal</button></div>' +
          '<label class="oh-field"><span>Your email</span><input name="email" type="email" required autocomplete="email" inputmode="email" placeholder="you@example.com"></label>' +
          '<input class="oh-hp" name="company" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<button class="oh-cta" type="submit">Email me my results' + arrow() + '</button>' +
          '<p class="oh-form-note" role="status">One email with your results now, and your plan when it’s ready. Unsubscribe anytime.</p>' +
        '</form>' +
        '<p class="oh-fine oh-retake"><button class="oh-link" type="button" data-retake>Retake the quiz</button></p>' +
        '</section>';
    }
  };

  // ---------------------------------------------------------------- the personal read
  // insights that only show for their particular mix of answers: the two strongest matches
  function combos(r) {
    var lean = function (d, dir) { var v = r.dims[d]; return dir === 'a' ? (v <= -0.67 ? -v : 0) : (v >= 0.67 ? v : 0); };
    var hits = (C.combos || []).map(function (c) {
      var keys = Object.keys(c.need), sum = 0, ok = true;
      keys.forEach(function (d) { var x = lean(d, c.need[d]); if (!x) ok = false; sum += x; });
      return ok ? { c: c, keys: keys, s: sum / keys.length + keys.length * 0.2 } : null;
    }).filter(Boolean).sort(function (a, b) { return b.s - a.s; });
    var out = [];
    hits.forEach(function (h) {
      // skip one that's a smaller version of an insight already chosen
      var dup = out.some(function (o) { return h.keys.every(function (k) { return o.keys.indexOf(k) >= 0 && o.c.need[k] === h.c.need[k]; }); });
      if (!dup && out.length < 2) out.push(h);
    });
    return out.map(function (h) { return h.c.text; });
  }
  // three of their own answers that most show their type, one per trait
  function evidence(r, type) {
    var pr = C.profiles[type], seen = {};
    if (type === 'calibrated') {
      var both = state.answers.filter(function (v) { return v === 0; }).length;
      var out = both >= 3 ? ['You said “both” to ' + both + ' of ' + C.questions.length + ' questions. You can see both sides, which is rarer than you’d think.'] : [];
      C.questions.forEach(function (q, i) { if (q.on === 'swing' && state.answers[i] === -2 && out.length < 3 && !seen.swing) { seen.swing = 1; out.push(C.evidence[i][0]); } });
      return out;
    }
    return C.questions.map(function (q, i) {
      var a = state.answers[i]; if (a !== 2 && a !== -2) return null;
      var agree = (a > 0 ? 1 : -1) * pr.at[q.on];
      return agree > 0.25 ? { d: q.on, s: agree * pr.weight[q.on], line: C.evidence[i][a > 0 ? 1 : 0] } : null;
    }).filter(Boolean).sort(function (x, y) { return y.s - x.s; })
      .filter(function (x) { if (seen[x.d]) return false; seen[x.d] = 1; return true; }).slice(0, 3).map(function (x) { return x.line; });
  }
  function why(r, type) {
    var ins = combos(r), ev = evidence(r, type), words = String(state.words || '').trim(), mirror = '';
    if (words) {
      var match = (r.words[type] || [])[0] || (r.streak && (r.words[r.streak] || [])[0]), whose = (r.words[type] || [])[0] ? type : r.streak;
      mirror = '<p class="oh-words">You called yourself <b>“' + esc(words.replace(/\s+/g, ' ')) + '.”</b>' +
        (match ? ' “' + esc(match.charAt(0).toUpperCase() + match.slice(1)) + '” is the ' + esc(short(whose)) + ' in you.' : '') + '</p>';
    }
    mirror += lifeLine();
    if (!ins.length && !ev.length && !mirror) return '';
    return '<div class="oh-sec oh-why"><p class="oh-sec-k">Why we think so</p>' +
      ins.map(function (x) { return '<p class="oh-read">' + esc(x) + '</p>'; }).join('') +
      (ev.length ? '<p class="oh-sub">In your own answers</p><ul class="oh-ev">' + ev.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      mirror + '</div>';
  }
  // the mix: how close they are to every type, so it never feels like a box
  function mix(r, type) {
    return '<div class="oh-sec"><p class="oh-sec-k">Your mix</p><ul class="oh-mix">' + r.order.map(function (k) {
      var pct = Math.max(1, Math.round(r.mix[k] * 100));
      return '<li' + (k === type ? ' class="is-you"' : '') + '><span class="oh-mix-n">' + esc(short(k)) + '</span><span class="oh-mix-b" aria-hidden="true"><i style="width:' + pct + '%"></i></span><span class="oh-mix-p">' + pct + '%</span></li>';
    }).join('') + '</ul><p class="oh-fine">Everyone carries some of each. These are yours.</p></div>';
  }
  // does this sound like you? If not, the next-closest type is one tap away
  function confirm(r, type) {
    var other = type === r.type ? r.second : r.type, ot = C.types[other];
    if (state.pick && state.pick !== r.type) {
      return '<div class="oh-sec oh-confirm"><p class="oh-body">You chose this one over ' + esc(mid(r.type)) + '. Your plan is built from it.</p>' +
        '<button class="oh-link" type="button" data-pick="' + r.type + '">Switch back to ' + esc(mid(r.type)) + '</button></div>';
    }
    if (state.confirmed) return '<div class="oh-sec oh-confirm"><p class="oh-body oh-confirm-ok">Good. Your plan is built from this.</p></div>';
    return '<div class="oh-sec oh-confirm"><p class="oh-sec-k">Does this sound like you?</p>' +
      (state.notQuite
        ? '<p class="oh-body">The closest after it is <b>' + esc(ot.name) + '</b>: ' + esc(ot.line) + '</p>' +
          '<div class="oh-confirm-r"><button class="oh-share" type="button" data-pick="' + other + '">That’s more me</button><button class="oh-link" type="button" data-keep>Keep ' + esc(mid(type)) + '</button></div>'
        : '<div class="oh-confirm-r"><button class="oh-share" type="button" data-yes>Yes, that’s me</button><button class="oh-share oh-share--quiet" type="button" data-notquite>Not quite</button></div>') + '</div>';
  }

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

  // about your life: one question per screen, one tap to answer (work takes several), always skippable
  var LIFE = C.life || [];
  function lifeStage(k) {
    var q = LIFE[k], life = state.life || {}, v = life[q.id];
    var on = function (o) { return q.many ? (v || []).indexOf(o) >= 0 : v === o; };
    var mark = '<i class="oh-opt-m" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M5.5 10.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></i>';
    return '<p class="oh-moment">' + esc(k === 0 ? C.lifeIntro : k === LIFE.length - 1 ? 'Last one about your life.' : '') + '</p>' +
      '<h2 class="oh-q oh-q--life">' + esc(q.ask) + '</h2>' + (q.hint ? '<p class="oh-fine oh-life-hint">' + esc(q.hint) + '</p>' : '') +
      '<div class="oh-opts' + (q.many ? ' oh-opts--many' : '') + '" role="' + (q.many ? 'group' : 'radiogroup') + '" aria-label="' + esc(q.ask) + '">' + q.options.map(function (o) {
        return '<button class="oh-opt" type="button" ' + (q.many ? 'aria-pressed' : 'role="radio" aria-checked') + '="' + on(o[0]) + '" data-life="' + q.id + '" data-v="' + o[0] + '"><span>' + esc(o[1]) + '</span>' + mark + '</button>';
      }).join('') + '</div>' +
      (q.many ? '<button class="oh-cta oh-life-go" type="button" data-life-next>Continue' + arrow() + '</button>' : '') +
      '<p class="oh-fine oh-words-skip"><button class="oh-link" type="button" data-life-skip="' + q.id + '">Rather not say</button></p>';
  }
  // their life, read back in one line: only what fills their days
  function lifeLine() {
    var life = state.life || {}, P = C.lifePhrases || {}, out = [];
    (life.work || []).forEach(function (w) { if (P.work && P.work[w]) out.push(P.work[w]); });
    if (P.kids && P.kids[life.kids]) out.push(P.kids[life.kids]);
    if (P.care && P.care[life.care]) out.push(P.care[life.care]);
    if (!out.length) return '';
    var list = out.length === 1 ? out[0] : out.slice(0, -1).join(', ') + ' and ' + out[out.length - 1];
    return '<p class="oh-words oh-life-read">' + (out.length === 1
      ? 'With ' + esc(list) + ', your time is already spoken for, so your plan fits around it, one small step at a time.'
      : 'Between ' + esc(list) + ', your days are already full, so your plan is built to fit around all of it, one small step at a time.') + '</p>';
  }
  function stage(i) {
    if (i >= C.questions.length && i < C.questions.length + LIFE.length) return lifeStage(i - C.questions.length);
    if (i >= C.questions.length) {
      return '<p class="oh-moment">Last thing. It’s optional.</p>' +
        '<h2 class="oh-q">In three words, how would you describe yourself?</h2>' +
        '<label class="oh-field oh-words-in"><span class="oh-sr">Three words</span><input name="words" type="text" maxlength="80" autocomplete="off" placeholder="e.g. driven, restless, loyal" value="' + esc(state.words || '') + '"></label>' +
        '<p class="oh-fine">We’ll use them to read you better, and quote them back. That’s all.</p>' +
        '<button class="oh-cta oh-words-go" type="button" data-words>Show me my type' + arrow() + '</button>' +
        '<p class="oh-fine oh-words-skip"><button class="oh-link" type="button" data-words-skip>Skip</button></p>';
    }
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
    if (count) {
      if (i >= C.questions.length + LIFE.length) { count.innerHTML = 'Last step'; count.setAttribute('aria-label', 'Last step'); }
      else if (i >= C.questions.length) { count.innerHTML = 'About you'; count.setAttribute('aria-label', 'About your life, ' + (i - C.questions.length + 1) + ' of ' + LIFE.length); }
      else { count.innerHTML = '<b>' + pad(i + 1) + '</b> / ' + pad(C.questions.length); count.setAttribute('aria-label', 'Question ' + (i + 1) + ' of ' + C.questions.length); }
    }
    if (bar) bar.style.width = Math.min(100, Math.round(i / C.questions.length * 100)) + '%';
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
    chrome(C.questions.length + LIFE.length);
    st.classList.add('is-leaving');
    setTimeout(function () {
      st.className = 'oh-stage';
      st.innerHTML = '<div class="oh-reading" role="status"><span class="oh-reading-mark" aria-hidden="true"></span><p>Reading your answers…</p></div>';
    }, 340);
    setTimeout(function () { busy = false; go('result'); }, 1700);
  }
  function shareIcon() { return '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 13V3M6 7l4-4 4 4M4 11v5h12v-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  function quizUrl() { return location.origin + '/app/'; }
  // share: the type card image plus a link to take the quiz; falls back to copying the link
  function share(btn) {
    var r = score(state.answers), type = final(r), t = C.types[type];
    var note = root.querySelector('.oh-share-note');
    var text = 'I’m ' + t.name + '. ' + t.line + ' Which one are you?';
    var url = quizUrl();
    var img = '/app/share/' + type + '.jpg';
    var save = ' <a href="' + img + '" download="the-jarred-effect-' + type + '.jpg">Save the image</a>';
    var say = function (html) { if (note) note.innerHTML = html; };
    // no share sheet (most computers): copy the link and offer the card image to post
    var copy = function () {
      var done = function () { say('Link copied.' + save); };
      var fail = function () { say('<a href="' + url + '">' + esc(url.replace(/^https?:\/\//, '')) + '</a> ·' + save); };
      try { navigator.clipboard.writeText(text + ' ' + url).then(done, fail); } catch (e) { fail(); }
    };
    if (!navigator.share) { copy(); return; }
    fetch('/app/share/' + type + '.jpg').then(function (res) { return res.blob(); }).then(function (blob) {
      var file = new File([blob], 'the-jarred-effect-' + type + '.jpg', { type: 'image/jpeg' });
      var data = navigator.canShare && navigator.canShare({ files: [file] }) ? { files: [file], text: text, url: url } : { text: text, url: url };
      return navigator.share(data);
    }).catch(function (err) { if (!err || err.name !== 'AbortError') copy(); });
  }
  // the next step: save their goal and email their results
  function sendResults(form) {
    var email = form.email.value.trim(), note = form.querySelector('.oh-form-note'), btn = form.querySelector('button[type=submit]');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { note.textContent = 'That email doesn’t look right. Check it and try again.'; form.email.focus(); return; }
    btn.disabled = true; form.classList.add('is-sending'); note.textContent = 'Sending…';
    fetch('/api/quiz', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, asks: [].map.call(form.querySelectorAll('input[name=ask]'), function (i) { return i.value.trim(); }).filter(Boolean), r: window.OH_SCORE.encode(state.answers), words: state.words || '', life: state.life || {}, pick: state.pick || '', source: 'quiz', company: form.company.value }) })
      .then(function (res) { return res.json().catch(function () { return {}; }).then(function (d) { if (!res.ok || !d.ok) throw new Error('failed'); }); })
      .then(function () {
        state.sentTo = email; save();
        form.classList.remove('is-sending'); form.classList.add('is-sent');
        form.innerHTML = '<p class="oh-next-k">Your next step</p><p class="oh-next-t">It’s on its way.</p>' +
          '<p class="oh-next-d">Your results are headed to <b>' + esc(email) + '</b>. If it’s not there in a few minutes, check your spam folder.</p>' +
          '<p class="oh-next-d">While you wait: who do you know who’d want to see their type?</p>' +
          '<button class="oh-share oh-share--dark" type="button" data-share>' + shareIcon() + '<span>Share your type</span></button>';
      })
      .catch(function () {
        btn.disabled = false; form.classList.remove('is-sending');
        note.textContent = 'That didn’t go through. Give it another try in a moment.';
      });
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
    if (name === 'quiz') chrome(Math.min(state.step || 0, C.questions.length + LIFE.length));
    var focus = root.querySelector('h1, .oh-q');
    if (focus) { focus.setAttribute('tabindex', '-1'); focus.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
  }
  function go(name) { if (location.hash === '#' + name) render(); else location.hash = name; }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('button');
    if (!t || t.disabled) return;
    if (t.hasAttribute('data-go')) {
      if (t.getAttribute('data-go') === 'quiz') { state.step = 0; state.answers = []; state.life = {}; state.done = false; save(); }
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
        // after the last question: the optional three words, then the reveal
        state.step = i + 1; save(); turn(i + 1, 1);
      }, still ? 120 : 420);
    } else if (t.hasAttribute('data-life')) {
      if (busy) return;
      var lq = LIFE.filter(function (x) { return x.id === t.getAttribute('data-life'); })[0], lv = t.getAttribute('data-v');
      state.life = state.life || {};
      if (lq.many) {
        // several can fit; "Not working right now" stands alone
        var arr = (state.life[lq.id] || []).slice(), at = arr.indexOf(lv);
        if (at >= 0) arr.splice(at, 1); else if (lv === 'none') arr = ['none']; else arr = arr.filter(function (x) { return x !== 'none'; }).concat(lv);
        state.life[lq.id] = arr; save();
        [].forEach.call(root.querySelectorAll('[data-life="' + lq.id + '"]'), function (b) { b.setAttribute('aria-pressed', String(arr.indexOf(b.getAttribute('data-v')) >= 0)); });
      } else {
        state.life[lq.id] = lv; save();
        [].forEach.call(root.querySelectorAll('[data-life="' + lq.id + '"]'), function (b) { b.setAttribute('aria-checked', String(b === t)); });
        t.closest('.oh-opts').classList.add('is-choosing');
        busy = true;
        var li = state.step || 0;
        setTimeout(function () { busy = false; state.step = li + 1; save(); turn(li + 1, 1); }, still ? 120 : 420);
      }
    } else if (t.hasAttribute('data-life-next') || t.hasAttribute('data-life-skip')) {
      if (busy) return;
      if (t.hasAttribute('data-life-skip') && state.life) delete state.life[t.getAttribute('data-life-skip')];
      var ln = (state.step || 0) + 1; state.step = ln; save(); turn(ln, 1);
    } else if (t.hasAttribute('data-back')) {
      if (busy) return;
      if ((state.step || 0) > 0) { state.step -= 1; save(); turn(state.step, -1); } else go('welcome');
    } else if (t.hasAttribute('data-words') || t.hasAttribute('data-words-skip')) {
      var wi = root.querySelector('input[name=words]');
      state.words = t.hasAttribute('data-words') && wi ? wi.value.replace(/\s+/g, ' ').trim().slice(0, 80) : '';
      state.pick = null; state.confirmed = false; state.notQuite = false; state.done = true; save(); reading();
    } else if (t.hasAttribute('data-yes')) {
      state.confirmed = true; save(); render(); var cy = root.querySelector('.oh-confirm'); if (cy) cy.scrollIntoView({ block: 'center' });
    } else if (t.hasAttribute('data-notquite')) {
      state.notQuite = true; save(); render(); var cn = root.querySelector('.oh-confirm'); if (cn) cn.scrollIntoView({ block: 'center' });
    } else if (t.hasAttribute('data-keep')) {
      state.confirmed = true; state.notQuite = false; save(); render(); var ck = root.querySelector('.oh-confirm'); if (ck) ck.scrollIntoView({ block: 'center' });
    } else if (t.hasAttribute('data-pick')) {
      var r0 = score(state.answers), pk = t.getAttribute('data-pick');
      state.pick = pk === r0.type ? null : pk; state.notQuite = false; state.confirmed = pk === r0.type; save(); render();
    } else if (t.hasAttribute('data-addask')) {
      var box = t.closest('.oh-asks'), n = box.querySelectorAll('input[name=ask]').length;
      if (n < 3) {
        var inp = document.createElement('input');
        inp.name = 'ask'; inp.type = 'text'; inp.maxLength = 200; inp.autocomplete = 'off';
        inp.setAttribute('aria-label', 'Goal ' + (n + 1));
        inp.placeholder = n === 1 ? 'e.g. stop working past 7 p.m.' : 'e.g. save $2,000 by June';
        box.insertBefore(inp, t); inp.focus();
      }
      if (n + 1 >= 3) t.hidden = true;
    } else if (t.hasAttribute('data-share')) {
      share(t);
    } else if (t.hasAttribute('data-retake')) {
      state = { answers: [], step: 0 }; save(); go('quiz');
    }
  });
  root.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-results]');
    if (f) { e.preventDefault(); sendResults(f); }
  });
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.name === 'words') { e.preventDefault(); var b = root.querySelector('[data-words]'); if (b) b.click(); }
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
