/* The 7-day plan page. Renders one plan (lib/plan.js shape) the same way every time: the plan card, how the week
   works, then the seven days. "Done" ticks are kept in this browser for now. */
(function () {
  'use strict';
  var root = document.getElementById('plan');
  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  var source = id ? '/api/plan?id=' + encodeURIComponent(id) : '/app/plan-sample.json';
  var KEY = 'oh.plan.' + (id || 'sample');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* private window: ticks just won't stick */ } }
  var done = load();

  var check = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5.5 10.5l3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function dayCard(d) {
    var isDone = !!done[d.day];
    var head = '<div class="pl-day-h"><p class="pl-day-k">Day ' + d.day + (d.minutes ? '<span>' + d.minutes + ' min</span>' : '') + '</p>' +
      '<button class="pl-done" type="button" data-day="' + d.day + '" aria-pressed="' + isDone + '">' + check + '<span>' + (isDone ? 'Done' : 'Mark done') + '</span></button></div>';
    var body;
    if (d.kind === 'question') {
      body = '<h3 class="pl-day-t">' + esc(d.title) + '</h3>' +
        '<p class="pl-q">' + esc(d.ask) + '</p>' +
        '<p class="pl-q-by">— ' + esc(d.name) + '</p>' +
        (d.hint ? '<p class="pl-text">' + esc(d.hint) + ' Answer it honestly, not nicely.</p>' : '') +
        (d.followUps && d.followUps.length ? '<div class="pl-sub"><span>If you want to go deeper</span>' + d.followUps.map(function (f) { return '<p>' + esc(f) + '</p>'; }).join('') + '</div>' : '');
    } else if (d.kind === 'lookback') {
      body = '<h3 class="pl-day-t">' + esc(d.title) + '</h3>' +
        '<p class="pl-text">Five minutes to see your week clearly, before the next one.</p>' +
        '<ol class="pl-prompts">' + d.prompts.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>';
    } else {
      body = '<h3 class="pl-day-t">' + esc(d.title) + '</h3>' +
        '<p class="pl-text">' + esc(d.what) + '</p>' +
        '<div class="pl-sub"><span>For example</span><p>' + esc(d.example) + '</p></div>' +
        '<p class="pl-rough"><b>Rough day?</b> ' + esc(d.rough) + '</p>';
    }
    return '<li class="pl-day pl-day--' + d.kind + (isDone ? ' is-done' : '') + '" data-card="' + d.day + '">' + head + body + '</li>';
  }

  function render(p) {
    var n = Object.keys(done).filter(function (k) { return done[k]; }).length;
    var dots = p.days.map(function (d) { return '<i class="' + (done[d.day] ? 'on' : '') + '"></i>'; }).join('');
    root.innerHTML =
      '<section class="pl-card">' +
        '<p class="pl-card-k"><span class="oh-dot" aria-hidden="true"></span>Your 7-day plan</p>' +
        '<p class="pl-ask">“' + esc(p.ask.replace(/[.”"]+$/, '')) + '.”</p>' +
        '<p class="pl-meta">' + esc(p.typeName) + (p.otherHalf ? ' · Building your other half: <b>' + esc(p.otherHalf.toLowerCase()) + '</b>' : '') + '</p>' +
        '<div class="pl-progress"><div class="pl-dots" aria-hidden="true">' + dots + '</div><span>' + n + ' of 7 done</span></div>' +
      '</section>' +
      '<section class="pl-sec"><p class="pl-k">This week</p><p class="pl-read">' + esc(p.read) + '</p>' +
        (p.focus ? '<p class="pl-focus">From the playbook: <b>' + esc(p.focus) + '</b></p>' : '') + '</section>' +
      '<section class="pl-sec"><p class="pl-k">How this week works</p><ul class="pl-how">' + p.how.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="pl-sec pl-week"><p class="pl-k">Your week</p><ol class="pl-days">' + p.days.map(dayCard).join('') + '</ol></section>' +
      '<section class="pl-end"><p>One week at a time. Next week’s plan builds on what you tell me this week.</p>' +
        '<img src="/assets/img/signature-jarred.png" width="104" height="50" alt="Jarred"></section>';
  }

  var plan = null;
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-day]');
    if (!b || !plan) return;
    var d = b.getAttribute('data-day');
    done[d] = !done[d]; save(done); render(plan);
    var card = root.querySelector('[data-card="' + d + '"] .pl-done'); if (card) card.focus({ preventScroll: true });
  });

  fetch(source, { headers: { Accept: 'application/json' } })
    .then(function (r) { if (!r.ok) throw new Error('not found'); return r.json(); })
    .then(function (p) { plan = p.plan || p; render(plan); })
    .catch(function () {
      root.innerHTML = '<section class="pl-sec"><p class="pl-k">Your plan</p><p class="pl-read">We couldn’t open this plan. Check the link in your email, or open it again in a minute.</p></section>';
    });
})();
