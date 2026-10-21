/* The Other Half app, free layer. Everyone who takes the quiz and asks for a plan gets in.
   Today: one day at a time. A daily check-in (full, half or rough), that day's steps, and a strip of the seven days.
     Days open by the calendar from the day the plan is first opened: day 2 opens tomorrow, and so on. A missed day
     isn't caught up (How this week works). Future days show only a preview, so the focus stays on today.
   Progress: days kept, steps done, minutes in, check-ins, each Ask's progress, the week at a glance, their notes.
   Playbook, patterns over time and Week 2 are shown but locked until they join.
   State is kept in this browser for now (start date, Done ticks per step, check-ins, notes). */
(function () {
  'use strict';
  var root = document.getElementById('plan');
  var nav = document.getElementById('tabs');
  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  var source = id ? '/api/plan?id=' + encodeURIComponent(id) : '/app/plan-sample.json';
  var KEY = 'oh.app.' + (id || 'sample');
  // review mode (local, or ?review): every day opens, and ?day=N pretends today is day N
  // (?review=0 turns it off, to see what people see)
  var REVIEW = params.get('review') !== '0' && (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || params.has('review'));
  // ?day only counts in review mode
  var TABS = ['today', 'progress', 'playbook', 'you'];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ymd(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function fromYmd(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* ignore */ }
    s = s && typeof s === 'object' ? s : {};
    s.done = s.done || {}; s.checkin = s.checkin || {}; s.notes = s.notes || {}; s.walk = s.walk || {};
    // s.guide: how much guidance they like. 'step' = just the step, 'walk' = walkthrough and story open by default
    if (!s.start) {
      // ticks from the earlier plan page carry over
      try { var old = JSON.parse(localStorage.getItem('oh.plan.' + (id || 'sample'))); if (old && typeof old === 'object') s.done = old; } catch (e) { /* ignore */ }
      s.start = ymd(new Date());
    }
    return s;
  }
  var st = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* private window: nothing sticks */ } }
  save();
  var done = st.done;

  var plan = null, tab = 'today', T = 1, sel = 1, said = null, keepLayers = true;

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
  function full(d) { return d.kind === 'step' ? stepsDone(d) === d.steps.length : !!done[key(d)]; }
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

  function doneBtn(k, label) {
    var isDone = !!done[k];
    return '<button class="pl-done" type="button" data-done="' + k + '" aria-pressed="' + isDone + '"' + (label ? ' aria-label="' + esc((isDone ? 'Done: ' : 'Mark done: ') + label) + '"' : '') + '>' + check + '<span>' + (isDone ? 'Done' : 'Mark done') + '</span></button>';
  }
  function reply(k) { return said && said.key === k && done[k] && said.line ? '<p class="pl-said" role="status">' + esc(said.line) + '</p>' : ''; }
  // ---- the layers under each step, for people who want more before they move. Each opens on a tap, or by
  // default when they chose "Walk me through it". Every layer ends back at the step.
  function layers(d, s) {
    var h = s.help || {}, k = key(d, s), open = st.guide === 'walk';
    var a = plan.asks[s.ask] || {};
    function det(id, label, body, isOpen) {
      return '<details class="pl-more" data-l="' + k + ':' + id + '"' + (isOpen ? ' open' : '') + '><summary><span>' + label + '</span><i aria-hidden="true"></i></summary><div class="pl-more-b">' + body + '</div></details>';
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
    if (h.story) {
      out += det('story', 'See it in real life', '<p class="pl-story">' + esc(h.story) + '</p><p class="pl-story-k">A made-up example, but it’s how this usually goes.</p>', open);
    }
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

  // ---- the day card. On a rough check-in, the rough-day version leads and the full step steps back.
  function stepHtml(d, s, many, rough) {
    var k = key(d, s);
    return '<div class="pl-step' + (many && done[k] ? ' is-done' : '') + '">' +
      (many ? '<div class="pl-step-h"><p class="pl-step-ask"><i>' + (s.ask + 1) + '</i><span>' + esc(plan.asks[s.ask].text) + '</span></p>' + doneBtn(k, plan.asks[s.ask].text) + '</div>' + reply(k) : '') +
      '<h3 class="pl-day-t">' + esc(s.title) + (many ? ' <span class="pl-t-min">' + s.minutes + ' min</span>' : '') + '</h3>' +
      (rough
        ? '<div class="pl-v"><span>Your rough-day version</span><p>' + esc(s.rough) + '</p></div><p class="pl-full"><b>The full step, for another day:</b> ' + esc(s.what) + '</p>'
        : '<p class="pl-text">' + esc(s.what) + '</p><div class="pl-sub"><span>For example</span><p>' + esc(s.example) + '</p></div><p class="pl-rough"><b>Rough day?</b> ' + esc(s.rough) + '</p>') +
      layers(d, s) + '</div>';
  }
  function noteBox(d, hint) {
    return '<div class="nt"><label for="nt-' + d.day + '">Write it down <span>Only you can see this.</span></label>' +
      '<textarea id="nt-' + d.day + '" data-note="' + d.day + '" rows="4" placeholder="' + esc(hint) + '">' + esc(st.notes[d.day] || '') + '</textarea></div>';
  }
  function dayCard(d) {
    var many = d.kind === 'step' && d.steps.length > 1;
    var rough = st.checkin[d.day] === 'rough';
    var single = d.kind === 'step' ? key(d, d.steps[0]) : key(d);
    var label = d.kind === 'step' ? d.minutes + ' min' + (many ? ' total' : '') : d.kind === 'lookback' ? '5 min' : 'A few minutes';
    var right = many
      ? '<span class="pl-count' + (full(d) ? ' is-full' : '') + '">' + (full(d) ? check : '') + stepsDone(d) + ' of ' + d.steps.length + ' done</span>'
      : doneBtn(single);
    var body;
    if (d.kind === 'question') {
      body = '<h3 class="pl-day-t">' + esc(d.title) + '</h3>' +
        '<p class="pl-q">' + esc(d.ask) + '</p><p class="pl-q-by">— ' + esc(d.name) + '</p>' +
        (d.hint ? '<p class="pl-text">' + esc(d.hint) + ' Answer it honestly, not nicely.</p>' : '') +
        (d.forMany ? '<p class="pl-text">Use it on the Ask that feels heaviest right now.</p>' : '') +
        (d.followUps && d.followUps.length ? '<div class="pl-sub"><span>If you want to go deeper</span>' + d.followUps.map(function (f) { return '<p>' + esc(f) + '</p>'; }).join('') + '</div>' : '') +
        noteBox(d, 'Whatever comes up. No one else reads this.');
    } else if (d.kind === 'lookback') {
      body = '<h3 class="pl-day-t">' + esc(d.title) + '</h3>' +
        '<p class="pl-text">Five minutes to see your week clearly, before the next one.</p>' +
        '<ol class="pl-prompts">' + d.prompts.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>' +
        noteBox(d, 'What I did, what changed, what I keep…');
    } else {
      body = d.steps.map(function (s) { return stepHtml(d, s, many, rough); }).join('');
    }
    return '<article class="pl-day pl-day--' + d.kind + (full(d) ? ' is-done' : '') + '">' +
      '<div class="pl-day-h"><p class="pl-day-k"><span class="pl-min">' + label + '</span></p>' + right + '</div>' +
      (many ? '' : reply(single)) + body + '</article>';
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
  var week2 = function () { return lockedCard('Week 2', 'Your next week, built from this one', 'What worked stays. What didn’t gets changed. Your second week is shaped by how this one actually went.', '', 'week 2'); };

  // ---- Today
  function todayView(p) {
    var c = cheer();
    var d = p.days[sel - 1];
    var s = dayState(d);
    var many = d.kind === 'step' && d.steps.length > 1;
    var html = '';
    if (T > 7) {
      html += '<section class="td-over"><p class="pl-k">Week one</p><h1 class="td-h">Your week is done.</h1>' +
        '<p class="td-x">' + esc(c.allDone || '') + '</p><a class="yu-link" href="#progress">See your progress<span aria-hidden="true">→</span></a></section>';
    }
    html += planCard(p);
    html += '<header class="td-head"><p class="pl-k">Day ' + sel + ' of 7' + (sel === T ? ' · ' + esc(weekday(sel)) : '') + '</p>' +
      '<h1 class="td-h">' + (sel === T ? 'Today' : esc(weekday(sel))) + '</h1>' +
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
        '<div class="ci-o">' + ['full', 'half', 'rough'].map(function (o) { return '<button type="button" data-checkin="' + o + '" aria-pressed="' + (ci === o) + '">' + cap(o) + '</button>'; }).join('') + '</div>' +
        (ciLine ? '<p class="ci-a">' + esc(ciLine) + '</p>' : '') + '</section>';
    }
    html += dayCard(d);

    if (kept(d) && sel === T && T < 7) {
      var nx = p.days[T];
      html += '<section class="tm"><p class="pl-note">' + esc(c.tomorrow || '') + '</p>' +
        '<p class="tm-k">Tomorrow · ' + esc(weekday(T + 1)) + '</p><ul class="fut-l">' + titles(nx).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></section>';
    }
    if (sel === 7 && kept(d)) {
      html += '<section class="pl-end is-all"><p>' + esc(c.allDone || '') + '</p><img src="/assets/img/signature-jarred.png" width="104" height="50" alt="Jarred"></section>';
    }
    if (T > 7) html += week2();
    return html;
  }

  // ---- Progress
  function progressView(p) {
    var c = cheer();
    var n = keptCount(p);
    var steps = 0, mins = 0;
    p.days.forEach(function (d) {
      if (d.kind === 'step') d.steps.forEach(function (s) { if (done[key(d, s)]) { steps++; mins += s.minutes; } });
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
    var notes = p.days.filter(function (d) { return st.notes[d.day] && st.notes[d.day].trim(); }).map(function (d) {
      return '<li><p class="pg-nk">Day ' + d.day + ' · ' + esc(d.title) + '</p><p class="pg-nt">' + esc(st.notes[d.day]) + '</p></li>';
    }).join('');
    var peek = '<div class="lk-bars"><i style="height:40%"></i><i style="height:65%"></i><i style="height:30%"></i><i style="height:80%"></i><i style="height:55%"></i><i style="height:70%"></i><i style="height:90%"></i></div>';
    return '<section class="pg-hero"><p class="pl-k">This week</p><p class="pg-n"><b>' + n + '</b> of 7 days kept</p>' +
        '<div class="pg-bar" aria-hidden="true">' + bar + '</div>' + (c.progress && c.progress[n] ? '<p class="pl-note">' + esc(c.progress[n]) + '</p>' : '') + '</section>' +
      '<section class="pg-stats"><div><b>' + steps + '</b><span>steps done</span></div><div><b>' + mins + '</b><span>minutes in</span></div><div><b>' + cis + '</b><span>check-ins</span></div></section>' +
      '<section class="pl-sec"><p class="pl-k">' + (p.asks.length > 1 ? 'Your Asks' : 'Your Ask') + '</p><ul class="pg-asks">' + asks + '</ul></section>' +
      '<section class="pl-sec"><p class="pl-k">The week at a glance</p><ol class="pg-week">' + rows + '</ol></section>' +
      (notes ? '<section class="pl-sec"><p class="pl-k">Your notes</p><ul class="pg-notes">' + notes + '</ul></section>' : '') +
      lockedCard('Patterns', 'See what works for you, week over week', 'Your check-ins and steps over time: which days go best, which steps stick, and how your other half is growing.', peek, 'patterns') +
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
    return '<section class="yu"><p class="pl-k">Your type</p><p class="yu-type">' + esc(p.typeName) + '</p>' +
        (others(p) ? '<p class="pl-text">Your other half: <b>' + esc(others(p)) + '</b>. That’s what this week is building.</p>' : '') +
        '<a class="yu-link" href="' + link + '">Read your full result<span aria-hidden="true">→</span></a></section>' +
      '<section class="pl-sec"><p class="pl-k">This week</p><p class="pl-read">' + esc(p.read) + '</p>' +
        (focuses(p) ? '<p class="pl-focus">From the playbook: <b>' + esc(focuses(p)) + '</b></p>' : '') + '</section>' +
      '<section class="pl-sec"><p class="pl-k">How this week works</p><ul class="pl-how">' + p.how.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="pl-sec"><p class="pl-k">Your steps</p><p class="pl-text">How much guidance do you like?</p>' +
        '<div class="ci-o ci-o--2"><button type="button" data-guide="step" aria-pressed="' + (st.guide !== 'walk') + '">Just the step</button>' +
        '<button type="button" data-guide="walk" aria-pressed="' + (st.guide === 'walk') + '">Walk me through it</button></div></section>' +
      '<section class="pl-sec"><p class="pl-k">Your access</p><p class="pl-text">Free: your 7-day plan, your progress and your type. The full playbook, your patterns over time and a new plan every week come with the full app.</p>' + unlock('the full app') + '</section>';
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
    said = null;
    render();
    if (scroll) window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', function () { go(location.hash.slice(1), true); });

  root.addEventListener('click', function (e) {
    var u = e.target.closest('[data-unlock]');
    if (u) { var note = u.parentNode.querySelector('.lk-soon'); if (note) note.hidden = false; return; }
    var v = e.target.closest('[data-view-day]');
    if (v) {
      sel = parseInt(v.getAttribute('data-view-day'), 10); said = null;
      if (tab !== 'today') { location.hash = 'today'; } else { render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      return;
    }
    var g = e.target.closest('[data-guide]');
    // a new guidance choice resets every layer to its default (open for "Walk me through it")
    if (g) { st.guide = g.getAttribute('data-guide'); save(); keepLayers = false; render(); return; }
    var ci = e.target.closest('[data-checkin]');
    if (ci) {
      var o = ci.getAttribute('data-checkin');
      if (st.checkin[sel] === o) delete st.checkin[sel]; else st.checkin[sel] = o;
      save(); said = null; render();
      var again1 = root.querySelector('[data-checkin="' + o + '"]'); if (again1) again1.focus({ preventScroll: true });
      return;
    }
    var b = e.target.closest('[data-done]');
    if (!b || !plan) return;
    var k = b.getAttribute('data-done');
    var day = parseInt(k, 10);
    var wasKept = kept(plan.days[day - 1]);
    done[k] = !done[k]; save();
    var list = cheer().done || [];
    // the day's first step gets the day's line; another Ask's step on the same day gets a different one
    said = done[k] ? { key: k, line: wasKept ? list[(day + 2) % (list.length || 1)] || '' : doneLine(day) } : null;
    render();
    var again = root.querySelector('[data-done="' + k + '"]'); if (again) again.focus({ preventScroll: true });
  });
  root.addEventListener('change', function (e) {
    var w = e.target.closest('[data-walk]');
    if (!w) return;
    var k = w.getAttribute('data-walk'), i = +w.getAttribute('data-i');
    var list = st.walk[k] = st.walk[k] || [];
    list[i] = w.checked; save();
    var boxes = root.querySelectorAll('[data-walk="' + k + '"]');
    var n = [].filter.call(boxes, function (b) { return b.checked; }).length;
    var em = root.querySelector('[data-walk-n="' + k + '"]'); if (em) em.textContent = n ? n + ' of ' + boxes.length : '';
  });
  root.addEventListener('input', function (e) {
    var t = e.target.closest('[data-note]');
    if (!t) return;
    st.notes[t.getAttribute('data-note')] = t.value; save();
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
