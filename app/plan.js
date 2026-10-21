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
  var said = null; // the day just marked done, and the line that answers it

  // Jarred's encouragement from the playbook (plan.cheer). It answers real moments: the day, a tap on Done,
  // coming back after a missed day, and the week finished. Never hype, only what they actually did.
  function cheer(p) { return p.cheer || {}; }
  function doneLine(p, day) {
    var c = cheer(p);
    // marked a day while an earlier one is still open: that's a comeback, so say so, with no guilt
    for (var k = 1; k < day; k++) if (!done[k]) { if (c.missed) return c.missed; break; }
    var list = c.done || [];
    return list.length ? list[(day - 1) % list.length] : '';
  }

  var check = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5.5 10.5l3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // "Need more help with this step?": closed by default, for people who want the why and the how
  function more(h) {
    if (!h) return '';
    return '<details class="pl-more"><summary><span>Need more help with this step?</span><i aria-hidden="true"></i></summary><div class="pl-more-b">' +
      '<div><p class="pl-more-k">Why it helps</p><p>' + esc(h.why) + '</p></div>' +
      '<div><p class="pl-more-k">How to do it</p><ol>' + h.how.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></div>' +
      '<div><p class="pl-more-k">If you get stuck</p><p>' + esc(h.stuck) + '</p></div></div></details>';
  }
  function dayCard(d) {
    var isDone = !!done[d.day];
    var head = '<div class="pl-day-h"><p class="pl-day-k">Day ' + d.day + (d.minutes ? '<span>' + d.minutes + ' min' + (d.steps && d.steps.length > 1 ? ' total' : '') + '</span>' : '') + '</p>' +
      '<button class="pl-done" type="button" data-day="' + d.day + '" aria-pressed="' + isDone + '">' + check + '<span>' + (isDone ? 'Done' : 'Mark done') + '</span></button></div>';
    var c = cheer(plan);
    var note = c.days && c.days[d.day] ? '<p class="pl-note">' + esc(c.days[d.day]) + '</p>' : '';
    var reply = said && said.day === d.day && isDone && said.line ? '<p class="pl-said" role="status">' + esc(said.line) + '</p>' : '';
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
      var many = plan.asks.length > 1;
      body = d.steps.map(function (s) {
        return '<div class="pl-step">' +
          (many ? '<p class="pl-step-ask"><i>' + (s.ask + 1) + '</i>' + esc(plan.asks[s.ask].text) + '<span>' + s.minutes + ' min</span></p>' : '') +
          '<h3 class="pl-day-t">' + esc(s.title) + '</h3>' +
          '<p class="pl-text">' + esc(s.what) + '</p>' +
          '<div class="pl-sub"><span>For example</span><p>' + esc(s.example) + '</p></div>' +
          '<p class="pl-rough"><b>Rough day?</b> ' + esc(s.rough) + '</p>' + more(s.help) + '</div>';
      }).join('');
    }
    return '<li class="pl-day pl-day--' + d.kind + (isDone ? ' is-done' : '') + '" data-card="' + d.day + '">' + head + reply + note + body + '</li>';
  }

  // end a sentence with a period only if it doesn't already end in punctuation (so "p.m." stays "p.m.")
  function end(t) { t = String(t || '').trim(); return /[.!?]$/.test(t) ? t : t + '.'; }
  function uniq(list) { return list.filter(function (x, i) { return x && list.indexOf(x) === i; }); }
  function others(p) { return uniq(p.asks.map(function (a) { return a.otherHalf && a.otherHalf.toLowerCase(); })).join(' and '); }
  function focuses(p) { return uniq(p.asks.map(function (a) { return a.focus; })).join(' · '); }
  function render(p) {
    var n = Object.keys(done).filter(function (k) { return done[k]; }).length;
    var dots = p.days.map(function (d) { return '<i class="' + (done[d.day] ? 'on' : '') + '"></i>'; }).join('');
    var c = cheer(p);
    var lift = c.progress && c.progress[n] ? '<p class="pl-cheer">' + esc(c.progress[n]) + '</p>' : '';
    root.innerHTML =
      '<section class="pl-card">' +
        '<p class="pl-card-k"><span class="oh-dot" aria-hidden="true"></span>Your 7-day plan</p>' +
        (p.asks.length === 1
          ? '<p class="pl-ask">“' + esc(end(p.asks[0].text)) + '”</p>'
          : '<ol class="pl-asks">' + p.asks.map(function (a, i) { return '<li><i>' + (i + 1) + '</i><span>' + esc(end(a.text)) + '</span></li>'; }).join('') + '</ol>') +
        '<p class="pl-meta">' + esc(p.typeName) + (others(p) ? ' · Building your other half: <b>' + esc(others(p)) + '</b>' : '') + '</p>' +
        '<div class="pl-progress"><div class="pl-dots" aria-hidden="true">' + dots + '</div><span>' + n + ' of 7 done</span></div>' + lift +
      '</section>' +
      '<section class="pl-sec"><p class="pl-k">This week</p><p class="pl-read">' + esc(p.read) + '</p>' +
        (focuses(p) ? '<p class="pl-focus">From the playbook: <b>' + esc(focuses(p)) + '</b></p>' : '') + '</section>' +
      '<section class="pl-sec"><p class="pl-k">How this week works</p><ul class="pl-how">' + p.how.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="pl-sec pl-week"><p class="pl-k">Your week</p>' + (c.planStart ? '<p class="pl-start">' + esc(c.planStart) + '</p>' : '') + '<ol class="pl-days">' + p.days.map(dayCard).join('') + '</ol></section>' +
      '<section class="pl-end' + (n === 7 ? ' is-all' : '') + '"><p>' + esc(n === 7 && c.allDone ? c.allDone : 'One week at a time. Next week’s plan builds on what you tell me this week.') + '</p>' +
        '<img src="/assets/img/signature-jarred.png" width="104" height="50" alt="Jarred"></section>';
  }

  var plan = null;
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-day]');
    if (!b || !plan) return;
    var d = b.getAttribute('data-day');
    done[d] = !done[d]; save(done);
    said = done[d] ? { day: +d, line: doneLine(plan, +d) } : null;
    render(plan);
    var card = root.querySelector('[data-card="' + d + '"] .pl-done'); if (card) card.focus({ preventScroll: true });
  });

  fetch(source, { headers: { Accept: 'application/json' } })
    .then(function (r) { if (!r.ok) throw new Error('not found'); return r.json(); })
    .then(function (p) { plan = p.plan || p; render(plan); })
    .catch(function () {
      root.innerHTML = '<section class="pl-sec"><p class="pl-k">Your plan</p><p class="pl-read">We couldn’t open this plan. Check the link in your email, or open it again in a minute.</p></section>';
    });
})();
