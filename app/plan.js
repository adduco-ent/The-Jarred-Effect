/* The Other Half app, free layer. Everyone who takes the quiz and asks for a plan gets in: their 7-day plan lives
   here (the Week tab) and their type (You). Check-ins, the full playbook and next week's plan are shown but locked
   until they join. Renders one plan (lib/plan.js shape) the same way every time. "Done" ticks are kept in this
   browser for now: one per step, so a plan with several Asks gets a Done button for each Ask's step. */
(function () {
  'use strict';
  var root = document.getElementById('plan');
  var nav = document.getElementById('tabs');
  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  var source = id ? '/api/plan?id=' + encodeURIComponent(id) : '/app/plan-sample.json';
  var KEY = 'oh.plan.' + (id || 'sample');
  var TABS = ['week', 'checkin', 'playbook', 'you'];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* private window: ticks just won't stick */ } }
  var done = load();
  var said = null; // the step or day just marked done, and the line that answers it
  var plan = null;

  var check = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5.5 10.5l3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var lock = '<svg class="lk-i" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3.25" y="7" width="9.5" height="6.75" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 7V5.25a2.5 2.5 0 015 0V7" stroke="currentColor" stroke-width="1.4"/></svg>';

  // ---- done state: a key per step ("3.1" = day 3, Ask 2), a key per day for the question and look back days
  function key(d, s) { return s ? d.day + '.' + s.ask : String(d.day); }
  function stepsDone(d) { return d.steps.filter(function (s) { return done[key(d, s)]; }).length; }
  // a day counts once any step is done: on a half or rough day, one Ask's step is the day (from How this week works)
  function kept(d) { return d.kind === 'step' ? stepsDone(d) > 0 : !!done[key(d)]; }
  function full(d) { return d.kind === 'step' ? stepsDone(d) === d.steps.length : !!done[key(d)]; }
  function keptCount(p) { return p.days.filter(kept).length; }
  function nextDay(p) { for (var i = 0; i < p.days.length; i++) if (!kept(p.days[i])) return p.days[i].day; return 0; }

  // ---- Jarred's encouragement (plan.cheer, from the playbook): answers real moments, never hype
  function cheer() { return (plan && plan.cheer) || {}; }
  function doneLine(day) {
    var c = cheer();
    // marked while an earlier day is still open: a comeback, said with no guilt
    for (var k = 0; k < day - 1; k++) if (!kept(plan.days[k])) { if (c.missed) return c.missed; break; }
    var list = c.done || [];
    return list.length ? list[(day - 1) % list.length] : '';
  }

  function doneBtn(k, label) {
    var isDone = !!done[k];
    return '<button class="pl-done" type="button" data-done="' + k + '" aria-pressed="' + isDone + '"' + (label ? ' aria-label="' + esc((isDone ? 'Done: ' : 'Mark done: ') + label) + '"' : '') + '>' + check + '<span>' + (isDone ? 'Done' : 'Mark done') + '</span></button>';
  }
  function reply(k) { return said && said.key === k && done[k] && said.line ? '<p class="pl-said" role="status">' + esc(said.line) + '</p>' : ''; }

  // "Need more help with this step?": closed by default, for people who want the why and the how
  function more(h) {
    if (!h) return '';
    return '<details class="pl-more"><summary><span>Need more help with this step?</span><i aria-hidden="true"></i></summary><div class="pl-more-b">' +
      '<div><p class="pl-more-k">Why it helps</p><p>' + esc(h.why) + '</p></div>' +
      '<div><p class="pl-more-k">How to do it</p><ol>' + h.how.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></div>' +
      '<div><p class="pl-more-k">If you get stuck</p><p>' + esc(h.stuck) + '</p></div></div></details>';
  }

  function dayCard(d, next) {
    var many = d.kind === 'step' && d.steps.length > 1;
    var c = cheer();
    var isNext = d.day === next;
    var mins = d.minutes ? '<span class="pl-min">' + d.minutes + ' min' + (many ? ' total' : '') + '</span>' : '';
    var tag = isNext ? '<span class="pl-next">Up next</span>' : '';
    // one step, or a whole-day card: the Done button sits in the header. Several Asks: each step gets its own,
    // and the header counts them.
    var single = d.kind === 'step' ? key(d, d.steps[0]) : key(d);
    var right = many
      ? '<span class="pl-count' + (full(d) ? ' is-full' : '') + '">' + (full(d) ? check : '') + stepsDone(d) + ' of ' + d.steps.length + ' done</span>'
      : doneBtn(single);
    var head = '<div class="pl-day-h"><p class="pl-day-k"><b>Day ' + d.day + '</b>' + mins + tag + '</p>' + right + '</div>';
    var top = (many ? '' : reply(single)) + (c.days && c.days[d.day] ? '<p class="pl-note">' + esc(c.days[d.day]) + '</p>' : '');
    var body;
    if (d.kind === 'question') {
      body = '<h3 class="pl-day-t">' + esc(d.title) + '</h3>' +
        '<p class="pl-q">' + esc(d.ask) + '</p>' +
        '<p class="pl-q-by">— ' + esc(d.name) + '</p>' +
        (d.hint ? '<p class="pl-text">' + esc(d.hint) + ' Answer it honestly, not nicely.</p>' : '') +
        (d.forMany ? '<p class="pl-text">Use it on the Ask that feels heaviest right now.</p>' : '') +
        (d.followUps && d.followUps.length ? '<div class="pl-sub"><span>If you want to go deeper</span>' + d.followUps.map(function (f) { return '<p>' + esc(f) + '</p>'; }).join('') + '</div>' : '');
    } else if (d.kind === 'lookback') {
      body = '<h3 class="pl-day-t">' + esc(d.title) + '</h3>' +
        '<p class="pl-text">Five minutes to see your week clearly, before the next one.</p>' +
        '<ol class="pl-prompts">' + d.prompts.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>';
    } else {
      body = d.steps.map(function (s) {
        var k = key(d, s);
        return '<div class="pl-step' + (many && done[k] ? ' is-done' : '') + '">' +
          (many ? '<div class="pl-step-h"><p class="pl-step-ask"><i>' + (s.ask + 1) + '</i><span>' + esc(plan.asks[s.ask].text) + '</span></p>' + doneBtn(k, plan.asks[s.ask].text) + '</div>' + reply(k) : '') +
          '<h3 class="pl-day-t">' + esc(s.title) + (many ? ' <span class="pl-t-min">' + s.minutes + ' min</span>' : '') + '</h3>' +
          '<p class="pl-text">' + esc(s.what) + '</p>' +
          '<div class="pl-sub"><span>For example</span><p>' + esc(s.example) + '</p></div>' +
          '<p class="pl-rough"><b>Rough day?</b> ' + esc(s.rough) + '</p>' + more(s.help) + '</div>';
      }).join('');
    }
    return '<li class="pl-day pl-day--' + d.kind + (full(d) ? ' is-done' : '') + (isNext ? ' is-next' : '') + '" data-card="' + d.day + '">' + head + top + body + '</li>';
  }

  // end a sentence with a period only if it doesn't already end in punctuation (so "p.m." stays "p.m.")
  function end(t) { t = String(t || '').trim(); return /[.!?]$/.test(t) ? t : t + '.'; }
  function uniq(list) { return list.filter(function (x, i) { return x && list.indexOf(x) === i; }); }
  function others(p) { return uniq(p.asks.map(function (a) { return a.otherHalf && a.otherHalf.toLowerCase(); })).join(' and '); }
  function focuses(p) { return uniq(p.asks.map(function (a) { return a.focus; })).join(' · '); }

  function card(p, n) {
    var c = cheer();
    var dots = p.days.map(function (d) { return '<i class="' + (kept(d) ? 'on' : '') + '"></i>'; }).join('');
    return '<section class="pl-card">' +
      '<p class="pl-card-k"><span class="oh-dot" aria-hidden="true"></span>Your 7-day plan</p>' +
      (p.asks.length === 1
        ? '<p class="pl-ask">“' + esc(end(p.asks[0].text)) + '”</p>'
        : '<ol class="pl-asks">' + p.asks.map(function (a, i) { return '<li><i>' + (i + 1) + '</i><span>' + esc(end(a.text)) + '</span></li>'; }).join('') + '</ol>') +
      '<p class="pl-meta">' + esc(p.typeName) + (others(p) ? ' · Building your other half: <b>' + esc(others(p)) + '</b>' : '') + '</p>' +
      '<div class="pl-progress"><div class="pl-dots" aria-hidden="true">' + dots + '</div><span>' + n + ' of 7 days</span></div>' +
      (c.progress && c.progress[n] ? '<p class="pl-cheer">' + esc(c.progress[n]) + '</p>' : '') +
      '</section>';
  }

  // what joining opens, said plainly. Membership isn't open yet, so the button says what happens instead of selling.
  function unlock(what) {
    return '<div class="lk-cta"><button class="lk-btn" type="button" data-unlock>' + lock + '<span>Unlock ' + esc(what) + '</span></button>' +
      '<p class="lk-soon" hidden>The full app opens soon. Founding members get in first, at the best price it will ever be. You’ll hear from me first, at the email your plan went to.</p></div>';
  }
  function lockedCard(kicker, title, text, preview, what) {
    return '<section class="lk">' +
      '<p class="lk-k">' + lock + esc(kicker) + '</p>' +
      '<h2 class="lk-t">' + esc(title) + '</h2>' +
      '<p class="lk-x">' + esc(text) + '</p>' +
      (preview ? '<div class="lk-peek" aria-hidden="true">' + preview + '</div>' : '') +
      unlock(what) + '</section>';
  }

  function weekView(p) {
    var n = keptCount(p);
    var next = nextDay(p);
    var c = cheer();
    return card(p, n) +
      '<section class="pl-sec"><p class="pl-k">This week</p><p class="pl-read">' + esc(p.read) + '</p>' +
        (focuses(p) ? '<p class="pl-focus">From the playbook: <b>' + esc(focuses(p)) + '</b></p>' : '') + '</section>' +
      '<section class="pl-sec"><p class="pl-k">How this week works</p><ul class="pl-how">' + p.how.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="pl-sec pl-week"><p class="pl-k">Your week</p>' + (c.planStart ? '<p class="pl-start">' + esc(c.planStart) + '</p>' : '') +
        '<ol class="pl-days">' + p.days.map(function (d) { return dayCard(d, next); }).join('') + '</ol></section>' +
      '<section class="pl-end' + (n === 7 ? ' is-all' : '') + '"><p>' + esc(n === 7 && c.allDone ? c.allDone : 'One week at a time. Keep going, and enjoy it where you can.') + '</p>' +
        '<img src="/assets/img/signature-jarred.png" width="104" height="50" alt="Jarred"></section>' +
      lockedCard('Week 2', 'Your next week, built from this one', 'What worked stays. What didn’t gets changed. Your second week is shaped by how this one actually went.', '', 'week 2');
  }

  function checkinView() {
    var peek = '<p class="lk-peek-q">How’s today?</p><div class="lk-chips"><span>Full</span><span>Half</span><span>Rough</span></div>';
    return lockedCard('Daily check-in', 'Thirty seconds a day', 'Tell me if today is full, half or rough. Your plan bends to the day you’re actually having, and you start to see your patterns week over week.', peek, 'check-ins');
  }

  function playbookView(p) {
    var lib = p.library || [];
    var peek = '<ol class="lk-list">' + lib.slice(0, 6).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
      (lib.length > 6 ? '<p class="lk-more">and ' + (lib.length - 6) + ' more</p>' : '');
    return lockedCard('The playbook', 'The whole method, ' + (lib.length || 'all') + ' protocols', 'Everything behind your plan, from building a habit to keeping your power. Read any of it, any time, and pull steps into your week.', peek, 'the playbook');
  }

  function youView(p) {
    var link = p.r ? '/app/?r=' + encodeURIComponent(p.r) + '#result' : '/app/';
    return '<section class="pl-sec yu"><p class="pl-k">Your type</p>' +
        '<p class="yu-type">' + esc(p.typeName) + '</p>' +
        (others(p) ? '<p class="pl-text">Your other half: <b>' + esc(others(p)) + '</b>. That’s what this week is building.</p>' : '') +
        '<a class="yu-link" href="' + link + '">Read your full result<span aria-hidden="true">→</span></a></section>' +
      '<section class="pl-sec"><p class="pl-k">' + (p.asks.length > 1 ? 'Your Asks' : 'Your Ask') + '</p>' +
        '<ol class="yu-asks">' + p.asks.map(function (a) { return '<li>' + esc(end(a.text)) + '</li>'; }).join('') + '</ol></section>' +
      '<section class="pl-sec"><p class="pl-k">Your access</p><p class="pl-text">Free: your 7-day plan and your type. Daily check-ins, the full playbook and a new plan every week come with the full app.</p>' + unlock('the full app') + '</section>';
  }

  var tab = 'week';
  function render() {
    if (!plan) return;
    var views = { week: weekView, checkin: checkinView, playbook: playbookView, you: youView };
    root.innerHTML = views[tab](plan);
    nav.querySelectorAll('[data-tab]').forEach(function (b) {
      if (b.getAttribute('data-tab') === tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
  }
  function go(t, scroll) {
    tab = TABS.indexOf(t) >= 0 ? t : 'week';
    said = null;
    render();
    if (scroll) window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', function () { go(location.hash.slice(1), true); });

  root.addEventListener('click', function (e) {
    var u = e.target.closest('[data-unlock]');
    if (u) { var note = u.parentNode.querySelector('.lk-soon'); if (note) note.hidden = false; return; }
    var b = e.target.closest('[data-done]');
    if (!b || !plan) return;
    var k = b.getAttribute('data-done');
    var day = parseInt(k, 10);
    var wasKept = kept(plan.days[day - 1]);
    done[k] = !done[k]; save(done);
    // the day's first step gets the day's line; another Ask's step on the same day gets a quieter one
    var list = cheer().done || [];
    said = done[k] ? { key: k, line: wasKept ? list[(day + 2) % (list.length || 1)] || '' : doneLine(day) } : null;
    render();
    var again = root.querySelector('[data-done="' + k + '"]'); if (again) again.focus({ preventScroll: true });
  });

  fetch(source, { headers: { Accept: 'application/json' } })
    .then(function (r) { if (!r.ok) throw new Error('not found'); return r.json(); })
    .then(function (p) {
      plan = p.plan || p;
      // ticks saved before Done went per-step (a step day keyed by the day alone) carry over as every step done
      plan.days.forEach(function (d) { if (d.kind === 'step' && done[d.day]) { d.steps.forEach(function (s) { done[key(d, s)] = true; }); delete done[d.day]; } });
      nav.hidden = false;
      go(location.hash.slice(1), false);
    })
    .catch(function () {
      root.innerHTML = '<section class="pl-sec"><p class="pl-k">Your plan</p><p class="pl-read">We couldn’t open this plan. Check the link in your email, or open it again in a minute.</p></section>';
    });
})();
