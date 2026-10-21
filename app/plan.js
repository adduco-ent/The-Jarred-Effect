/* The Other Half app, free layer. Everyone who takes the quiz and asks for a plan gets in.
   Today: one day at a time. A daily check-in (full, half or rough), then one card per Ask's step, and a strip of
     the seven days. Days open by the calendar from the day the plan is first opened; future days show a preview.
   Progress: days kept, steps, minutes, check-ins, each Ask's progress, the week at a glance, and their own words.
   Playbook, patterns over time, week 2 and adding more Asks are shown but locked until they join.

   Feedback, in their own words, is asked for at the moment it's true, never as a form:
     check-in half or rough → what's going on · step done → how it felt · step doesn't fit → skip or change, and why
     day kept → one-line receipt · day 3 → is the app easy · day 7 → look back, then shape next week · You → make it better
   Everything is kept in this browser, and sent to /api/feedback (table plan_feedback) when the plan has an id.
   That's what next week's plan is built from. */
(function () {
  'use strict';
  var root = document.getElementById('plan');
  var nav = document.getElementById('tabs');
  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  var source = id ? '/api/plan?id=' + encodeURIComponent(id) : '/app/plan-sample.json';
  var KEY = 'oh.app.' + (id || 'sample');
  // review mode (local, or ?review): every day opens, and ?day=N pretends today is day N. ?review=0 turns it off.
  var REVIEW = params.get('review') !== '0' && (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || params.has('review'));
  var TABS = ['today', 'progress', 'playbook', 'you'];
  var FB_KINDS = ['step', 'skip', 'checkin', 'receipt', 'note', 'lookback', 'next', 'app'];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ymd(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function fromYmd(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* ignore */ }
    s = s && typeof s === 'object' ? s : {};
    s.done = s.done || {}; s.checkin = s.checkin || {}; s.walk = s.walk || {}; s.fb = s.fb || {};
    FB_KINDS.forEach(function (k) { s.fb[k] = s.fb[k] || {}; });
    // notes from the earlier version move into feedback
    if (s.notes) { Object.keys(s.notes).forEach(function (d) { if (s.notes[d]) s.fb.note[d] = { text: s.notes[d] }; }); delete s.notes; }
    if (!s.start) {
      try { var old = JSON.parse(localStorage.getItem('oh.plan.' + (id || 'sample'))); if (old && typeof old === 'object') s.done = old; } catch (e) { /* ignore */ }
      s.start = ymd(new Date());
    }
    return s;
  }
  var st = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* private window: nothing sticks */ } }
  save();
  var done = st.done, fb = st.fb;

  // ---- sending feedback: debounced per answer, flushed if they leave the page
  var pending = {};
  function payload(kind, ref) {
    var d = fb[kind][ref] || {};
    if (kind === 'checkin') return { day: st.checkin[ref] || null, note: d.note || '' };
    return d;
  }
  function send(kind, ref) {
    delete pending[kind + ':' + ref];
    if (!id) return;
    try {
      fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
        body: JSON.stringify({ plan: id, kind: kind, ref: String(ref), data: payload(kind, ref) }) }).catch(function () { /* kept locally */ });
    } catch (e) { /* kept locally */ }
  }
  function sync(kind, ref, now) {
    save();
    var k = kind + ':' + ref;
    if (pending[k]) clearTimeout(pending[k].t);
    if (now) return send(kind, ref);
    pending[k] = { kind: kind, ref: ref, t: setTimeout(function () { send(kind, ref); }, 900) };
  }
  window.addEventListener('pagehide', function () { Object.keys(pending).forEach(function (k) { clearTimeout(pending[k].t); send(pending[k].kind, pending[k].ref); }); });

  var plan = null, tab = 'today', T = 1, sel = 1, said = null, keepLayers = true;
  var skipOpen = {}, appThanks = false, addOpen = false;

  var check = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5.5 10.5l3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var lock = '<svg class="lk-i" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3.25" y="7" width="9.5" height="6.75" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 7V5.25a2.5 2.5 0 015 0V7" stroke="currentColor" stroke-width="1.4"/></svg>';

  // ---- days and dates
  function dayDate(n) { var d = fromYmd(st.start); d.setDate(d.getDate() + n - 1); return d; }
  function weekday(n, short) { return dayDate(n).toLocaleDateString('en-US', { weekday: short ? 'short' : 'long' }); }
  function todayNum() {
    var forced = REVIEW ? parseInt(params.get('day'), 10) : 0;
    if (forced >= 1 && forced <= 8) return forced;
    var diff = Math.round((fromYmd(ymd(new Date())) - fromYmd(st.start)) / 86400000);
    return Math.max(1, Math.min(8, diff + 1)); // 8 = the week is over
  }

  // ---- done state: a key per step ("3.1" = day 3, Ask 2), a key per day for the question and look back days
  function key(d, s) { return s ? d.day + '.' + s.ask : String(d.day); }
  function stepsDone(d) { return d.steps.filter(function (s) { return done[key(d, s)]; }).length; }
  // a day counts once any step is done: on a half or rough day, one Ask's step is the day
  function kept(d) { return d.kind === 'step' ? stepsDone(d) > 0 : !!done[key(d)]; }
  function keptCount(p) { return p.days.filter(kept).length; }
  function dayState(d) { return kept(d) ? 'kept' : d.day < T ? 'missed' : d.day === T ? 'today' : 'future'; }
  function titles(d) { return d.kind === 'step' ? d.steps.map(function (s) { return s.title; }) : [d.title]; }

  // ---- Jarred's encouragement (plan.cheer, from the playbook): answers real moments, never hype
  function cheer() { return (plan && plan.cheer) || {}; }
  function doneLine(day) {
    var c = cheer();
    if (day > 1 && !kept(plan.days[day - 2]) && c.missed) return c.missed; // back after a missed day, no guilt
    var list = c.done || [];
    return list.length ? list[(day - 1) % list.length] : '';
  }

  function end(t) { t = String(t || '').trim(); return /[.!?]$/.test(t) ? t : t + '.'; }
  function uniq(list) { return list.filter(function (x, i) { return x && list.indexOf(x) === i; }); }
  function others(p) { return uniq(p.asks.map(function (a) { return a.otherHalf && a.otherHalf.toLowerCase(); })).join(' and '); }
  function focuses(p) { return uniq(p.asks.map(function (a) { return a.focus; })).join(' · '); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // a small, obviously tappable row of choices
  function chips(attr, ref, options, current, cls) {
    return '<div class="ci-o' + (cls ? ' ' + cls : '') + '">' + options.map(function (o) {
      return '<button type="button" ' + attr + '="' + o[0] + '" data-ref="' + ref + '" aria-pressed="' + (current === o[0]) + '">' + esc(o[1]) + '</button>';
    }).join('') + '</div>';
  }
  // their words: a quiet box that saves as they type
  function askNote(ref, field) { var n = fb.next[ref]; var i = +field.split('.')[1]; return n && n.asks && n.asks[i] ? n.asks[i].note || '' : ''; }
  function words(kind, ref, field, placeholder, rows, label) {
    var v = field.indexOf('ask.') === 0 ? askNote(ref, field) : (fb[kind][ref] || {})[field] || '';
    var idAttr = 'w-' + kind + '-' + String(ref).replace(/\./g, '_') + '-' + field.replace(/\./g, '_');
    return (label ? '<label class="fb-l" for="' + idAttr + '">' + esc(label) + '</label>' : '') +
      '<textarea class="fb-t" id="' + idAttr + '" data-fb="' + kind + '" data-ref="' + ref + '" data-field="' + field + '" rows="' + (rows || 2) + '"' +
      (label ? '' : ' aria-label="' + esc(placeholder) + '"') + ' placeholder="' + esc(placeholder) + '">' + esc(v) + '</textarea>';
  }

  function doneBtn(k, label) {
    var isDone = !!done[k];
    return '<button class="pl-done" type="button" data-done="' + k + '" aria-pressed="' + isDone + '"' + (label ? ' aria-label="' + esc((isDone ? 'Done: ' : 'Mark done: ') + label) + '"' : '') + '>' + check + '<span>' + (isDone ? 'Done' : 'Mark done') + '</span></button>';
  }
  function reply(k) { return said && said.key === k && done[k] && said.line ? '<p class="pl-said" role="status">' + esc(said.line) + '</p>' : ''; }

  // ---- the layers under each step, for people who want more before they move
  function layers(d, s) {
    var h = s.help || {}, k = key(d, s), open = st.guide === 'walk';
    var a = plan.asks[s.ask] || {};
    function det(name, label, body, isOpen) {
      return '<details class="pl-more" data-l="' + k + ':' + name + '"' + (isOpen ? ' open' : '') + '><summary><span>' + label + '</span><i aria-hidden="true"></i></summary><div class="pl-more-b">' + body + '</div></details>';
    }
    var out = '';
    if (h.how && h.how.length) {
      var ticks = st.walk[k] || [];
      var n = h.how.filter(function (x, i) { return ticks[i]; }).length;
      out += det('walk', 'Walk me through it <em data-walk-n="' + k + '">' + (n ? n + ' of ' + h.how.length : '') + '</em>',
        '<ol class="wk">' + h.how.map(function (x, i) {
          return '<li><label><input type="checkbox" data-walk="' + k + '" data-i="' + i + '"' + (ticks[i] ? ' checked' : '') + '><span>' + esc(x) + '</span></label></li>';
        }).join('') + '</ol>', open);
    }
    if (h.story) out += det('story', 'See it in real life', '<p class="pl-story">' + esc(h.story) + '</p><p class="pl-story-k">A made-up example, but it’s how this usually goes.</p>', open);
    if (h.why || h.stuck) {
      out += det('why', 'Why it helps, and if you get stuck',
        (h.why ? '<div><p class="pl-more-k">Why it helps</p><p>' + esc(h.why) + '</p></div>' : '') +
        (h.stuck ? '<div><p class="pl-more-k">If you get stuck</p><p>' + esc(h.stuck) + '</p></div>' : ''), false);
    }
    if (a.deeper) {
      out += det('deep', 'Go deeper: ' + esc(a.deeper.name),
        '<p>' + esc(a.deeper.when) + '</p><ol>' + a.deeper.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
        (a.deeper.safety ? '<p class="pl-safe">' + esc(a.deeper.safety) + '</p>' : '') +
        '<a class="yu-link" href="#playbook">The whole playbook<span aria-hidden="true">→</span></a>', false);
    }
    return out ? '<div class="pl-layers">' + out + '</div>' : '';
  }

  // ---- after a step: how it felt (done), or a gut call (not done)
  var FEEL = [['easy', 'Easy'], ['okay', 'Okay'], ['hard', 'Hard']];
  function afterStep(k, isDone) {
    if (isDone) {
      var f = fb.step[k] || {};
      return '<div class="fb"><p class="fb-q">How did it feel?</p>' + chips('data-feel', k, FEEL, f.feel) +
        (f.feel ? words('step', k, 'note', f.feel === 'hard' ? 'What made it hard? In your words, if you want.' : 'Anything to add? In your words, if you want.') : '') + '</div>';
    }
    var sk = fb.skip[k];
    if (sk && sk.action) {
      return '<div class="fb fb--gut"><p class="fb-q">' + (sk.action === 'skip' ? 'You skipped this one. That’s a gut call, and it counts as information.' : 'You changed this one to fit. Mark it done when you’ve done your version.') + '</p>' +
        words('skip', k, 'note', 'What did your gut say?') +
        '<button type="button" class="lnk" data-unskip="' + k + '">Undo</button></div>';
    }
    if (skipOpen[k]) {
      return '<div class="fb fb--gut"><p class="fb-q">Your gut has the final say. What fits today?</p>' +
        chips('data-skip', k, [['change', 'Change it'], ['skip', 'Skip it today']], null) +
        '<button type="button" class="lnk" data-skipopen="' + k + '">Never mind</button></div>';
    }
    return '<button type="button" class="lnk lnk--gut" data-skipopen="' + k + '">This step doesn’t fit today</button>';
  }

  // ---- one card per Ask's step
  function stepCard(d, s, many) {
    var k = key(d, s), isDone = !!done[k], rough = st.checkin[d.day] === 'rough';
    var sk = fb.skip[k], skipped = !isDone && sk && sk.action === 'skip';
    var head = many
      ? '<p class="pl-step-ask"><i>' + (s.ask + 1) + '</i><span>' + esc(plan.asks[s.ask].text) + '</span></p>'
      : '<p class="pl-day-k"><span class="pl-min">' + s.minutes + ' min</span></p>';
    return '<article class="pl-day pl-step-card' + (isDone ? ' is-done' : '') + (skipped ? ' is-skipped' : '') + '">' +
      '<div class="pl-day-h">' + head + doneBtn(k, many ? plan.asks[s.ask].text : '') + '</div>' + reply(k) +
      '<h3 class="pl-day-t">' + esc(s.title) + (many ? ' <span class="pl-t-min">' + s.minutes + ' min</span>' : '') + '</h3>' +
      (rough
        ? '<div class="pl-v"><span>Your rough-day version</span><p>' + esc(s.rough) + '</p></div><p class="pl-full"><b>The full step, for another day:</b> ' + esc(s.what) + '</p>'
        : '<p class="pl-text">' + esc(s.what) + '</p><div class="pl-sub"><span>For example</span><p>' + esc(s.example) + '</p></div><p class="pl-rough"><b>Rough day?</b> ' + esc(s.rough) + '</p>') +
      afterStep(k, isDone) + layers(d, s) + '</article>';
  }

  // ---- the question day and the look back
  function wholeDayCard(d) {
    var k = key(d), body;
    if (d.kind === 'question') {
      body = '<h3 class="pl-day-t">' + esc(d.title) + '</h3>' +
        '<p class="pl-q">' + esc(d.ask) + '</p><p class="pl-q-by">— ' + esc(d.name) + '</p>' +
        (d.hint ? '<p class="pl-text">' + esc(d.hint) + ' Answer it honestly, not nicely.</p>' : '') +
        (d.forMany ? '<p class="pl-text">Use it on the Ask that feels heaviest right now.</p>' : '') +
        (d.followUps && d.followUps.length ? '<div class="pl-sub"><span>If you want to go deeper</span>' + d.followUps.map(function (f) { return '<p>' + esc(f) + '</p>'; }).join('') + '</div>' : '') +
        '<div class="nt">' + words('note', d.day, 'text', 'Whatever comes up. Only you and your next plan see this.', 4, 'Write it down') + '</div>';
    } else {
      body = '<h3 class="pl-day-t">' + esc(d.title) + '</h3>' +
        '<p class="pl-text">Five minutes to see your week clearly, before the next one.</p>' +
        '<div class="lb">' + ['did', 'changed', 'keep'].map(function (f, i) { return '<div class="nt">' + words('lookback', '1', f, 'In your words', 3, (i + 1) + '. ' + d.prompts[i]) + '</div>'; }).join('') + '</div>';
    }
    return '<article class="pl-day pl-day--' + d.kind + (done[k] ? ' is-done' : '') + '">' +
      '<div class="pl-day-h"><p class="pl-day-k"><span class="pl-min">' + (d.kind === 'lookback' ? '5 min' : 'A few minutes') + '</span></p>' + doneBtn(k) + '</div>' +
      reply(k) + body + '</article>';
  }

  // ---- day 7: shape next week. Their answers are the input for week 2.
  var NEXT = [['keep', 'Keep going'], ['change', 'Change it'], ['done', 'Done with it'], ['pause', 'Pause it']];
  var NEXT_HINT = { keep: 'Anything to add?', change: 'What would make it fit better?', done: 'What did it take? Say it proudly.', pause: 'What needs to happen first?' };
  function nextWeek(p) {
    var n = fb.next['1'] || {}, asks = n.asks || [];
    return '<section class="nx" id="next-week"><p class="pl-k">Shape next week</p><h2 class="lk-t">Tell me how to build week 2</h2>' +
      '<p class="pl-text">Your answers decide what stays, what changes and how much you take on.</p>' +
      p.asks.map(function (a, i) {
        var c = (asks[i] || {}).choice;
        return '<div class="nx-a"><p class="pg-ask"><i>' + (i + 1) + '</i>' + esc(end(a.text)) + '</p>' + chips('data-next', i, NEXT, c, 'ci-o--4') +
          (c ? words('next', '1', 'ask.' + i, NEXT_HINT[c]) : '') + '</div>';
      }).join('') +
      '<div class="nx-a"><p class="fb-q">How was the pace this week?</p>' + chips('data-pace', '1', [['light', 'Too light'], ['right', 'About right'], ['much', 'Too much']], n.pace) + '</div>' +
      '<div class="nx-a">' + words('next', '1', 'want', 'A new Ask, a different time of day, more or less help…', 3, 'Anything you want next week to have?') + '</div>' +
      (n.sent
        ? '<p class="nx-ok" role="status">' + check + (plan.tier === 'paid' ? 'Got it. Week 2 is built from exactly this.' : 'Saved. Week 2 comes with the full app, and it’s built from exactly this.') + '</p>'
        : '<button type="button" class="lk-btn nx-send" data-nx-send>Send it</button>') +
      '</section>';
  }

  // ---- the plan card: their Ask(s) and the seven days, on navy
  function strip() {
    var LABEL = { kept: 'kept', missed: 'not marked', today: 'today', future: 'coming up' };
    return '<div class="ds" role="group" aria-label="Your seven days">' + plan.days.map(function (d) {
      var s = dayState(d);
      return '<button type="button" class="ds-d is-' + s + (d.day === sel ? ' is-sel' : '') + '" data-view-day="' + d.day + '"' +
        ' aria-label="Day ' + d.day + ', ' + weekday(d.day) + ', ' + LABEL[s] + '"' + (d.day === sel ? ' aria-current="true"' : '') + '>' +
        '<small>' + weekday(d.day, true) + '</small><b>' + (s === 'kept' ? check : d.day) + '</b></button>';
    }).join('') + '</div>';
  }
  function planCard(p) {
    return '<section class="pl-card pl-card--app">' +
      '<p class="pl-card-k"><span class="oh-dot" aria-hidden="true"></span>' + (p.asks.length > 1 ? 'Your Asks' : 'Your Ask') + '</p>' +
      (p.asks.length === 1
        ? '<p class="pl-ask">“' + esc(end(p.asks[0].text)) + '”</p>'
        : '<ol class="pl-asks">' + p.asks.map(function (a, i) { return '<li><i>' + (i + 1) + '</i><span>' + esc(end(a.text)) + '</span></li>'; }).join('') + '</ol>') +
      strip() + '</section>';
  }

  // ---- what joining opens, said plainly. Membership isn't open yet, so the button says what happens.
  function unlock(what) {
    return '<div class="lk-cta"><button class="lk-btn" type="button" data-unlock>' + lock + '<span>Unlock ' + esc(what) + '</span></button>' +
      '<p class="lk-soon" hidden>The full app opens soon. Founding members get in first, at the best price it will ever be. You’ll hear from me first, at the email your plan went to.</p></div>';
  }
  function lockedCard(kicker, title, text, preview, what) {
    return '<section class="lk"><p class="lk-k">' + lock + esc(kicker) + '</p><h2 class="lk-t">' + esc(title) + '</h2><p class="lk-x">' + esc(text) + '</p>' +
      (preview ? '<div class="lk-peek" aria-hidden="true">' + preview + '</div>' : '') + unlock(what) + '</section>';
  }
  function week2() { return lockedCard('Week 2', 'Your next week, built from this one', 'What worked stays. What didn’t gets changed. Your second week is shaped by how this one actually went, in your own words.', '', 'week 2'); }

  // ---- Today
  function todayView(p) {
    var c = cheer();
    var d = p.days[sel - 1];
    var s = dayState(d);
    var many = d.kind === 'step' && d.steps.length > 1;
    var html = '';
    if (T > 7) {
      html += '<section class="td-over"><p class="pl-k">Week one</p><h1 class="td-h">Your week is done.</h1>' +
        '<p class="td-x">' + esc(c.allDone || '') + '</p>' +
        (fb.next['1'] && fb.next['1'].sent ? '<a class="yu-link" href="#progress">See your progress<span aria-hidden="true">→</span></a>' : '<button type="button" class="lnk" data-view-day="7">Shape next week →</button>') + '</section>';
    }
    html += planCard(p);
    html += '<header class="td-head"><p class="pl-k">Day ' + sel + ' of 7' + (sel === T ? ' · ' + esc(weekday(sel)) : '') + '</p>' +
      '<h1 class="td-h">' + (sel === T ? 'Today' : esc(weekday(sel))) + '</h1>' +
      (many ? '<p class="pl-sum">' + d.steps.length + ' steps, one for each Ask · ' + d.minutes + ' min in all</p>' : '') +
      (s === 'future' && !REVIEW ? '' : (s === 'missed' && c.missedDay ? '<p class="pl-note">' + esc(c.missedDay) + '</p>' : c.days && c.days[sel] ? '<p class="pl-note">' + esc(c.days[sel]) + '</p>' : '')) +
      '</header>';

    if (s === 'future' && !REVIEW) {
      return html + '<section class="fut"><p class="fut-k">' + lock + 'Opens ' + esc(weekday(sel)) + '</p>' +
        '<ul class="fut-l">' + titles(d).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '<p class="pl-note">' + esc(c.future || '') + '</p>' +
        (T <= 7 ? '<button class="fut-b" type="button" data-view-day="' + T + '">Back to today</button>' : '') + '</section>';
    }

    if (!st.guide && d.kind === 'step') {
      html += '<section class="gd"><p class="ci-q">How do you like your steps?</p>' +
        '<div class="gd-o"><button type="button" data-guide="step"><b>Just the step</b><span>Short and simple. More help is a tap away.</span></button>' +
        '<button type="button" data-guide="walk"><b>Walk me through it</b><span>Mini-steps and a real-life example, open from the start.</span></button></div>' +
        '<p class="gd-k">You can change this any time in You.</p></section>';
    }
    if (d.kind === 'step') {
      var ci = st.checkin[sel];
      var ciLine = ci && c.checkin ? c.checkin[ci === 'half' && many ? 'halfMany' : ci] : '';
      html += '<section class="ci"><p class="ci-q">' + (sel === T ? 'How’s today?' : 'How was that day?') + '</p>' +
        chips('data-checkin', sel, [['full', 'Full'], ['half', 'Half'], ['rough', 'Rough']], ci) +
        (ciLine ? '<p class="ci-a">' + esc(ciLine) + '</p>' : '') +
        (ci === 'half' || ci === 'rough' ? words('checkin', sel, 'note', 'What’s going on today? Optional, and it helps shape your next week.') : '') + '</section>';
      html += d.steps.map(function (x) { return stepCard(d, x, many); }).join('');
    } else {
      html += wholeDayCard(d);
    }

    // the day kept: their receipt, in one line
    if (kept(d) && d.kind === 'step') {
      html += '<section class="rc"><p class="fb-q">Your receipt</p>' + words('receipt', d.day, 'text', 'One line on what you actually did today.', 2) + '</section>';
    }
    // once, on day 3: is the app easy to use?
    if (sel === 3 && kept(d)) {
      var ap = fb.app.day3 || {};
      html += '<section class="rc"><p class="fb-q">Quick one: is the app easy to use so far?</p>' +
        chips('data-ease', 'day3', [['yes', 'Yes'], ['kind_of', 'Kind of'], ['not_really', 'Not really']], ap.ease) +
        (ap.ease ? words('app', 'day3', 'text', ap.ease === 'yes' ? 'Anything you love, or anything missing?' : 'What’s getting in the way? Tell me plainly.') : '') + '</section>';
    }
    if (d.kind === 'lookback') html += nextWeek(p);

    if (kept(d) && sel === T && T < 7) {
      var nx = p.days[T];
      html += '<section class="tm"><p class="pl-note">' + esc(c.tomorrow || '') + '</p>' +
        '<p class="tm-k">Tomorrow · ' + esc(weekday(T + 1)) + '</p><ul class="fut-l">' + titles(nx).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></section>';
    }
    if (sel === 7 && kept(d)) html += '<section class="pl-end is-all"><p>' + esc(c.allDone || '') + '</p><img src="/assets/img/signature-jarred.png" width="104" height="50" alt="Jarred"></section>';
    if (T > 7) html += week2();
    return html;
  }

  // ---- Progress
  function progressView(p) {
    var c = cheer();
    var n = keptCount(p);
    var steps = 0, mins = 0, feel = { easy: 0, okay: 0, hard: 0 }, guts = 0;
    p.days.forEach(function (d) {
      if (d.kind === 'step') d.steps.forEach(function (s) {
        var k = key(d, s);
        if (done[k]) { steps++; mins += s.minutes; }
        var f = (fb.step[k] || {}).feel; if (f) feel[f]++;
        if ((fb.skip[k] || {}).action) guts++;
      });
      else if (done[key(d)]) mins += d.minutes || 0;
    });
    var cis = Object.keys(st.checkin).length;
    var bar = p.days.map(function (d) { return '<i class="' + (kept(d) ? 'on' : '') + '"></i>'; }).join('');
    var asks = p.asks.map(function (a, i) {
      var total = 0, got = 0;
      p.days.forEach(function (d) { if (d.kind === 'step') d.steps.forEach(function (s) { if (s.ask === i) { total++; if (done[key(d, s)]) got++; } }); });
      return '<li><p class="pg-ask"><i>' + (i + 1) + '</i>' + esc(end(a.text)) + '</p>' +
        '<div class="pg-meter" role="img" aria-label="' + got + ' of ' + total + ' steps"><i style="width:' + (total ? Math.round(got / total * 100) : 0) + '%"></i></div>' +
        '<p class="pg-sub">' + got + ' of ' + total + ' steps' + (a.otherHalf ? ' · Building ' + esc(a.otherHalf.toLowerCase()) : '') + '</p></li>';
    }).join('');
    var rows = p.days.map(function (d) {
      var s = dayState(d), ci = st.checkin[d.day];
      return '<li><button type="button" class="pg-row is-' + s + '" data-view-day="' + d.day + '">' +
        '<span class="pg-dot">' + (s === 'kept' ? check : d.day) + '</span>' +
        '<span class="pg-t"><small>Day ' + d.day + ' · ' + esc(weekday(d.day)) + '</small>' + esc(titles(d).join(' · ')) + '</span>' +
        (ci ? '<span class="pg-ci">' + cap(ci) + '</span>' : '<span></span>') + '</button></li>';
    }).join('');
    // their own words, day by day
    var theirs = p.days.map(function (d) {
      var bits = [];
      var r = (fb.receipt[d.day] || {}).text; if (r && r.trim()) bits.push(r);
      var nt = (fb.note[d.day] || {}).text; if (nt && nt.trim()) bits.push(nt);
      if (d.kind === 'lookback') { var lb = fb.lookback['1'] || {}; ['did', 'changed', 'keep'].forEach(function (f) { if (lb[f] && lb[f].trim()) bits.push(lb[f]); }); }
      return bits.length ? '<li><p class="pg-nk">Day ' + d.day + ' · ' + esc(weekday(d.day)) + '</p>' + bits.map(function (b) { return '<p class="pg-nt">' + esc(b) + '</p>'; }).join('') + '</li>' : '';
    }).join('');
    var felt = feel.easy + feel.okay + feel.hard;
    var peek = '<div class="lk-bars"><i style="height:40%"></i><i style="height:65%"></i><i style="height:30%"></i><i style="height:80%"></i><i style="height:55%"></i><i style="height:70%"></i><i style="height:90%"></i></div>';
    return '<section class="pg-hero"><p class="pl-k">This week</p><p class="pg-n"><b>' + n + '</b> of 7 days kept</p>' +
        '<div class="pg-bar" aria-hidden="true">' + bar + '</div>' + (c.progress && c.progress[n] ? '<p class="pl-note">' + esc(c.progress[n]) + '</p>' : '') + '</section>' +
      '<section class="pg-stats"><div><b>' + steps + '</b><span>steps done</span></div><div><b>' + mins + '</b><span>minutes in</span></div><div><b>' + cis + '</b><span>check-ins</span></div></section>' +
      (felt || guts ? '<p class="pg-felt">How steps felt: ' + feel.easy + ' easy · ' + feel.okay + ' okay · ' + feel.hard + ' hard' + (guts ? ' · ' + guts + ' gut call' + (guts > 1 ? 's' : '') : '') + '</p>' : '') +
      '<section class="pl-sec"><p class="pl-k">' + (p.asks.length > 1 ? 'Your Asks' : 'Your Ask') + '</p><ul class="pg-asks">' + asks + '</ul></section>' +
      '<section class="pl-sec"><p class="pl-k">The week at a glance</p><ol class="pg-week">' + rows + '</ol></section>' +
      (theirs ? '<section class="pl-sec"><p class="pl-k">In your words</p><ul class="pg-notes">' + theirs + '</ul></section>' : '') +
      lockedCard('Patterns', 'See what works for you, week over week', 'Your check-ins, your words and your steps over time: which days go best, which steps stick, and how your other half is growing, with a look back every month.', peek, 'patterns') +
      week2();
  }

  function playbookView(p) {
    var lib = p.library || [];
    var peek = '<ol class="lk-list">' + lib.slice(0, 6).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
      (lib.length > 6 ? '<p class="lk-more">and ' + (lib.length - 6) + ' more</p>' : '');
    return lockedCard('The playbook', 'The whole method, ' + (lib.length || 'all') + ' protocols', 'Everything behind your plan, from building a habit to keeping your power. Read any of it, any time, and pull steps into your week.', peek, 'the playbook');
  }

  function youView(p) {
    var link = p.r ? '/app/?r=' + encodeURIComponent(p.r) + '#result' : '/app/';
    var paid = p.tier === 'paid';
    return '<section class="yu"><p class="pl-k">Your type</p><p class="yu-type">' + esc(p.typeName) + '</p>' +
        (others(p) ? '<p class="pl-text">Your other half: <b>' + esc(others(p)) + '</b>. That’s what this week is building.</p>' : '') +
        '<a class="yu-link" href="' + link + '">Read your full result<span aria-hidden="true">→</span></a></section>' +
      '<section class="pl-sec"><p class="pl-k">' + (p.asks.length > 1 ? 'Your Asks' : 'Your Ask') + '</p>' +
        '<ol class="yu-asks">' + p.asks.map(function (a) { return '<li>' + esc(end(a.text)) + '</li>'; }).join('') + '</ol>' +
        '<button type="button" class="fut-b yu-add" data-add-ask aria-expanded="' + addOpen + '">' + (paid ? '' : lock) + '<span>Add an Ask</span></button>' +
        (addOpen ? '<div class="yu-addb"><p class="pl-text">' + esc(p.focus || '') + '</p>' + (paid ? '' : unlock('more Asks')) + '</div>' : '') + '</section>' +
      '<section class="pl-sec"><p class="pl-k">This week</p><p class="pl-read">' + esc(p.read) + '</p>' +
        (focuses(p) ? '<p class="pl-focus">From the playbook: <b>' + esc(focuses(p)) + '</b></p>' : '') + '</section>' +
      '<section class="pl-sec"><p class="pl-k">How this week works</p><ul class="pl-how">' + p.how.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="pl-sec"><p class="pl-k">Your steps</p><p class="pl-text">How much guidance do you like?</p>' +
        chips('data-guide', 'you', [['step', 'Just the step'], ['walk', 'Walk me through it']], st.guide === 'walk' ? 'walk' : 'step', 'ci-o--2') + '</section>' +
      '<section class="pl-sec"><p class="pl-k">Help me make this better</p><p class="pl-text">Something confusing, missing or great? Say it plainly.</p>' +
        '<div class="nt"><textarea class="fb-t" id="app-note" rows="3" aria-label="Your feedback on the app" placeholder="In your words"></textarea></div>' +
        '<button type="button" class="fut-b" data-app-send>Send</button>' + (appThanks ? '<p class="nx-ok" role="status">' + check + 'Thank you. This helps make the app better.</p>' : '') + '</section>' +
      '<section class="pl-sec"><p class="pl-k">Your access</p><p class="pl-text">' + (paid ? 'Full app.' : 'Free: your 7-day plan, your progress and your type. The full playbook, your patterns over time, more Asks and a new plan every week come with the full app.') + '</p>' + (paid ? '' : unlock('the full app')) + '</section>';
  }

  function render() {
    if (!plan) return;
    var views = { today: todayView, progress: progressView, playbook: playbookView, you: youView };
    var was = {};
    root.querySelectorAll('details[data-l]').forEach(function (x) { was[x.getAttribute('data-l')] = x.open; });
    root.innerHTML = views[tab](plan);
    if (keepLayers) root.querySelectorAll('details[data-l]').forEach(function (x) { var v = was[x.getAttribute('data-l')]; if (v !== undefined) x.open = v; });
    keepLayers = true;
    nav.querySelectorAll('[data-tab]').forEach(function (b) {
      if (b.getAttribute('data-tab') === tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
  }
  function go(t, scroll) {
    if (t === 'week') t = 'today';
    tab = TABS.indexOf(t) >= 0 ? t : 'today';
    said = null; appThanks = false;
    render();
    if (scroll) window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', function () { go(location.hash.slice(1), true); });
  function refocus(q) { var el = root.querySelector(q); if (el) el.focus({ preventScroll: true }); }
  function setNext(fn) { var n = fb.next['1'] = fb.next['1'] || { asks: [] }; n.asks = n.asks || []; fn(n); sync('next', '1'); }

  root.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-unlock]'))) { var note = el.parentNode.querySelector('.lk-soon'); if (note) note.hidden = false; return; }
    if ((el = t.closest('[data-add-ask]'))) { addOpen = !addOpen; render(); refocus('[data-add-ask]'); return; }
    if ((el = t.closest('[data-view-day]'))) {
      sel = parseInt(el.getAttribute('data-view-day'), 10); said = null;
      if (tab !== 'today') { location.hash = 'today'; } else { render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      return;
    }
    if ((el = t.closest('[data-guide]'))) { st.guide = el.getAttribute('data-guide'); save(); keepLayers = false; render(); return; }
    if ((el = t.closest('[data-checkin]'))) {
      var o = el.getAttribute('data-checkin');
      if (st.checkin[sel] === o) delete st.checkin[sel]; else st.checkin[sel] = o;
      sync('checkin', sel, true); said = null; render(); refocus('[data-checkin="' + o + '"]');
      return;
    }
    if ((el = t.closest('[data-feel]'))) {
      var fk = el.getAttribute('data-ref'), fv = el.getAttribute('data-feel');
      fb.step[fk] = Object.assign({}, fb.step[fk], { feel: fv }); sync('step', fk, true); render(); refocus('[data-feel="' + fv + '"][data-ref="' + fk + '"]');
      return;
    }
    if ((el = t.closest('[data-skipopen]'))) { var so = el.getAttribute('data-skipopen'); skipOpen[so] = !skipOpen[so]; render(); return; }
    if ((el = t.closest('[data-skip]'))) {
      var sk = el.getAttribute('data-ref');
      fb.skip[sk] = Object.assign({}, fb.skip[sk], { action: el.getAttribute('data-skip') }); skipOpen[sk] = false; sync('skip', sk, true); render();
      refocus('[data-fb="skip"][data-ref="' + sk + '"]');
      return;
    }
    if ((el = t.closest('[data-unskip]'))) { var us = el.getAttribute('data-unskip'); fb.skip[us] = { note: (fb.skip[us] || {}).note || '' }; sync('skip', us, true); render(); return; }
    if ((el = t.closest('[data-next]'))) {
      var ni = +el.getAttribute('data-ref'), nv = el.getAttribute('data-next');
      setNext(function (n) { n.asks[ni] = Object.assign({}, n.asks[ni], { choice: nv }); }); render(); refocus('[data-next="' + nv + '"][data-ref="' + ni + '"]');
      return;
    }
    if ((el = t.closest('[data-pace]'))) { var pv = el.getAttribute('data-pace'); setNext(function (n) { n.pace = pv; }); render(); refocus('[data-pace="' + pv + '"]'); return; }
    if ((el = t.closest('[data-nx-send]'))) { setNext(function (n) { n.sent = new Date().toISOString(); }); sync('next', '1', true); render(); return; }
    if ((el = t.closest('[data-ease]'))) { var ev = el.getAttribute('data-ease'); fb.app.day3 = Object.assign({}, fb.app.day3, { ease: ev }); sync('app', 'day3', true); render(); refocus('[data-ease="' + ev + '"]'); return; }
    if ((el = t.closest('[data-app-send]'))) {
      var ta = root.querySelector('#app-note'), v = ta && ta.value.trim();
      if (!v) { if (ta) ta.focus(); return; }
      var ref = 'n' + Date.now();
      fb.app[ref] = { text: v }; sync('app', ref, true); appThanks = true; render();
      return;
    }
    var b = t.closest('[data-done]');
    if (!b || !plan) return;
    var k = b.getAttribute('data-done');
    var day = parseInt(k, 10);
    var wasKept = kept(plan.days[day - 1]);
    done[k] = !done[k]; save();
    var list = cheer().done || [];
    // the day's first step gets the day's line; another Ask's step on the same day gets a different one
    said = done[k] ? { key: k, line: wasKept ? list[(day + 2) % (list.length || 1)] || '' : doneLine(day) } : null;
    render();
    refocus('[data-done="' + k + '"]');
  });
  root.addEventListener('change', function (e) {
    var w = e.target.closest('[data-walk]');
    if (!w) return;
    var k = w.getAttribute('data-walk'), i = +w.getAttribute('data-i');
    var list = st.walk[k] = st.walk[k] || [];
    list[i] = w.checked; save();
    var boxes = root.querySelectorAll('[data-walk="' + k + '"]');
    var n = [].filter.call(boxes, function (x) { return x.checked; }).length;
    var em = root.querySelector('[data-walk-n="' + k + '"]'); if (em) em.textContent = n ? n + ' of ' + boxes.length : '';
  });
  // their words save as they type, without re-rendering (so the cursor stays put)
  root.addEventListener('input', function (e) {
    var t = e.target.closest('[data-fb]');
    if (!t) return;
    var kind = t.getAttribute('data-fb'), ref = t.getAttribute('data-ref'), field = t.getAttribute('data-field');
    if (kind === 'next' && field.indexOf('ask.') === 0) {
      var i = +field.split('.')[1];
      setNext(function (n) { n.asks[i] = Object.assign({}, n.asks[i], { note: t.value }); });
      return;
    }
    var o = fb[kind][ref] = Object.assign({}, fb[kind][ref]);
    o[field] = t.value;
    sync(kind, ref);
  });

  fetch(source, { headers: { Accept: 'application/json' } })
    .then(function (r) { if (!r.ok) throw new Error('not found'); return r.json(); })
    .then(function (p) {
      plan = p.plan || p;
      // ticks saved before Done went per-step (a step day keyed by the day alone) carry over as every step done
      plan.days.forEach(function (d) { if (d.kind === 'step' && done[d.day]) { d.steps.forEach(function (s) { done[key(d, s)] = true; }); delete done[d.day]; } });
      save();
      T = todayNum();
      sel = Math.min(T, 7);
      nav.hidden = false;
      go(location.hash.slice(1), false);
    })
    .catch(function () {
      root.innerHTML = '<section class="pl-sec"><p class="pl-k">Your plan</p><p class="pl-read">We couldn’t open this plan. Check the link in your email, or open it again in a minute.</p></section>';
    });
})();
