
(function () {
  var ITEMS = [
    { id: 'kept', where: 'Progress · Today', title: 'Days “kept”', now: '2 of 7 days kept', rec: '2 of 7 days done', why: '“Kept” is our word for it. “Done” is the word people already use, so the number reads instantly.' },
    { id: 'receipt', where: 'Today', title: 'Your receipt', now: 'Your receipt · and in the day guide: ① Check in ② Do a step ③ Your receipt', rec: 'One line on today · day guide: ① Check in ② Do a step ③ Write a line', why: 'A receipt makes people think of money. The idea is one honest line about what they did, so name that.' },
    { id: 'ask', where: 'Everywhere', title: 'Ask', now: 'Your Ask · Add an Ask', rec: 'Keep “Ask”, and add one line to the welcome: “Your Ask is the thing you want most right now.”', why: 'It’s your brand word and worth keeping. It just needs saying once, the first time people see it.' },
    { id: 'otherhalf', where: 'You · plan card', title: 'Your other half', now: 'Your other half: desire and trust', rec: 'What you’re building: desire and trust', why: '“Other half” is the app’s name and the big idea, but next to a type it can read like a partner. Saying what it does is clearer.' },
    { id: 'protocol', where: 'Playbook', title: 'Protocols', now: 'All 28 protocols · Protocol · In your plan', rec: 'All 28 plays · Play · In your plan', why: '“Protocol” sounds clinical. It’s a playbook, so its pages are plays. Short, plain, and on brand.' },
    { id: 'deeper', where: 'Step cards', title: 'Go deeper', now: 'Go deeper: Building a new habit', rec: 'The play behind this step: Building a new habit', why: '“Go deeper” doesn’t say what you’ll find. This says it’s the method the step comes from.' },
    { id: 'paths', where: 'Playbook', title: 'Paths', now: 'Paths · Protocols that work best in order, for a kind of stuck.', rec: 'Start here · Plays that work best in order, by what you’re stuck on.', why: '“Paths” is vague. “Start here” tells a new member exactly what the section is for.' },
    { id: 'guts', where: 'Progress', title: 'Gut calls', now: 'Gut calls (tile) · Gut call (week row)', rec: 'Skipped or changed (tile) · Gut call (row, unchanged)', why: 'The tile needs to read instantly. “Gut call” stays where there’s room for it to make sense.' },
    { id: 'minutes', where: 'Progress', title: 'Minutes in', now: 'minutes in', rec: 'minutes spent', why: '“Minutes in” reads like time elapsed. “Spent” says it’s their time on their steps.' },
    { id: 'reached', where: 'Day 7 · Shape next week', title: 'Done with it', now: 'Keep going · Change it · Done with it · Pause it', rec: 'Keep going · Change it · Reached it · Pause it', why: '“Done with it” could mean “I’m sick of it”. “Reached it” can only mean they got there.' },
    { id: 'donepill', where: 'Step cards', title: 'The Done pill', now: 'Done (tap it again to undo)', rec: 'Done · Undo', why: 'Nobody knows the pill undoes. Saying it once saves a confused tap.' },
    { id: 'whyhelp', where: 'Step cards', title: 'Why it helps, and if you get stuck', now: 'Why it helps, and if you get stuck', rec: 'Why it works', why: 'Shorter, and still clear. “If you get stuck” stays as the second part inside.' },
    { id: 'payoff', where: 'Day 4', title: 'The question’s name', now: 'What am I getting out of not having it yet? — The Payoff', rec: 'Drop “— The Payoff” and show just the question', why: 'The name is ours, from the guide. Under the question it reads like a quote from someone.' },
    { id: 'gutday', where: 'Today · week strip', title: 'The gut-call mark on a day', now: 'A curved arrow on a day you skipped on purpose', rec: 'Keep the arrow, and add a tiny legend under the strip in week one: ✓ done · ↷ gut call', why: 'The arrow is clean, but people can’t guess it. A one-week legend teaches it, then gets out of the way.' },
    { id: 'small', where: 'Step cards', title: 'Running low?', now: 'Running low? Just the first why.', rec: 'Low on steam? Just the first why.', why: 'Matches the check-in exactly (Plenty · Some · Low), so the two connect without thinking.' }
  ];
  var list = document.getElementById('list'), statusEl = document.getElementById('status');
  var state = {}, db = null, timers = {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  list.innerHTML = ITEMS.map(function (it, i) {
    return '<article class="item" data-item="' + it.id + '">' +
      '<div class="top"><span class="n">' + (i + 1) + '</span><span class="where">' + esc(it.where) + '</span><h2>' + esc(it.title) + '</h2></div>' +
      '<div class="cmp"><div><p class="lab">Now</p><p>' + esc(it.now) + '</p></div><div class="rec"><p class="lab">Recommended</p><p>' + esc(it.rec) + '</p></div></div>' +
      '<p class="why">' + esc(it.why) + '</p>' +
      '<div class="dec" role="group" aria-label="Your choice for ' + esc(it.title) + '" data-id="' + it.id + '">' +
        '<button type="button" data-c="approve" aria-pressed="false">Approve</button><button type="button" data-c="keep" aria-pressed="false">Keep as is</button><button type="button" data-c="change" aria-pressed="false">Change</button></div>' +
      '<div class="edit" hidden><label for="e-' + it.id + '">Your words</label><textarea id="e-' + it.id + '" data-edit="' + it.id + '" placeholder="Write it the way you’d say it"></textarea></div>' +
      '<p class="saved" data-saved="' + it.id + '" aria-live="polite"></p></article>';
  }).join('');
  function paint() {
    var n = { approve: 0, keep: 0, change: 0 };
    ITEMS.forEach(function (it) {
      var d = state[it.id] || {}, el = document.querySelector('[data-item="' + it.id + '"]');
      if (d.choice) { el.setAttribute('data-choice', d.choice); n[d.choice]++; } else el.removeAttribute('data-choice');
      el.querySelectorAll('.dec button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-c') === d.choice)); });
      el.querySelector('.edit').hidden = d.choice !== 'change';
      var ta = el.querySelector('textarea');
      if (document.activeElement !== ta) ta.value = d.edit || '';
    });
    var done = n.approve + n.keep + n.change;
    document.getElementById('tally').innerHTML = '<b>' + done + '</b> of ' + ITEMS.length + ' decided · ' + n.approve + ' approved · ' + n.keep + ' kept · ' + n.change + ' changed';
  }
  function flash(id) { var s = document.querySelector('[data-saved="' + id + '"]'); if (s) { s.textContent = 'Saved'; clearTimeout(s._t); s._t = setTimeout(function () { s.textContent = ''; }, 1600); } }
  function write(id) {
    if (!db) return;
    var d = state[id] || {};
    db.collection('wording').doc(id).set({ choice: d.choice || null, edit: d.edit || '', at: new Date().toISOString() })
      .then(function () { flash(id); statusEl.className = 'status'; statusEl.textContent = 'Saved. Claude can read your choices.'; })
      .catch(function () { statusEl.className = 'status warn'; statusEl.textContent = 'That didn’t save. Try again in a moment.'; });
  }
  list.addEventListener('click', function (e) {
    var b = e.target.closest('.dec button'); if (!b) return;
    var id = b.parentNode.getAttribute('data-id'), c = b.getAttribute('data-c');
    var d = state[id] = Object.assign({}, state[id]);
    d.choice = d.choice === c ? null : c;
    paint(); write(id);
    if (d.choice === 'change') document.getElementById('e-' + id).focus();
  });
  list.addEventListener('input', function (e) {
    var t = e.target.closest('[data-edit]'); if (!t) return;
    var id = t.getAttribute('data-edit');
    state[id] = Object.assign({}, state[id], { edit: t.value });
    clearTimeout(timers[id]); timers[id] = setTimeout(function () { write(id); }, 800);
  });
  paint();
  if (!window.claude || !window.claude.use) { statusEl.className = 'status warn'; statusEl.textContent = 'Open this page on claude.ai to save your choices.'; return; }
  window.claude.use('db').then(function (d) {
    db = d;
    if (!db) { statusEl.className = 'status warn'; statusEl.textContent = 'Sign in on claude.ai to save your choices. You can still read everything.'; return; }
    statusEl.textContent = 'Your choices save as you make them.';
    db.collection('wording').onSnapshot(function (snap) {
      snap.docs.forEach(function (doc) { var v = doc.data(); if (v) state[doc.id] = { choice: v.choice || null, edit: v.edit || '' }; });
      paint();
    }, function () { statusEl.className = 'status warn'; statusEl.textContent = 'Lost the connection. Reload to keep saving.'; });
  });
})();
