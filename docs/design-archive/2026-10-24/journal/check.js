
(function () {
  var PARTS = [
    { id: 'where', t: 'Where it lives', sum: 'A fifth tab, Journal, next to Today, Progress, Playbook and You. And a way in from every place you already write, so it’s never more than one tap away.',
      li: ['<b>The tab:</b> Today · Progress · Playbook · <b>Journal</b> · You. Five fits a phone’s bottom bar.',
           '<b>“Write more”</b> under One line on today, for when one line isn’t enough.',
           '<b>After a hard day check-in:</b> a quiet “Want to write it out?” under the reply.',
           '<b>Day 4 and day 7:</b> the question and the look back open in the journal, with room to keep going.'] },
    { id: 'ways', t: 'Ways to write', sum: 'A blank page is hard for most people. So the journal always offers a starting point, and never forces one.',
      li: ['<b>Free write:</b> a calm blank page. Autosaves as you type.',
           '<b>Today’s prompt:</b> one question picked for your day, your Ask and the play you’re on. Tap “another one” for a different prompt.',
           '<b>Quick line:</b> a sentence and how the day felt (good, okay, hard). Ten seconds.',
           '<b>Letters you won’t send:</b> to future you, to past you, to someone you’re carrying.',
           '<b>Playbook exercises that are journaling by nature:</b> Why, three times · Your proof list · The error log · The data debrief · The flow log · What am I still carrying? · What’s moving.',
           '<b>Or just talk:</b> every one of these can be spoken instead of typed. See the next part.'],
      ex: ['Today’s prompt, on a hard day while on Unlearning an old habit', '“What did the old habit give you today that you still need? Where else could you get it?”'] },
    { id: 'voice', t: 'Talk instead of type', sum: 'A microphone button on every journal page. Tap it, talk, and your words appear as you speak. For hard days, long thoughts, and people who think out loud.',
      li: ['<b>One clear mic button</b> on the writing screen, on Quick line and on every prompt. Tap to start, tap to stop. Your words appear as you talk, and you can edit them after.',
           '<b>Works on phones and computers.</b> It uses the phone’s or browser’s own speech-to-text where it’s available, so it’s fast and free. Where it isn’t, the app records and turns it into text on our side.',
           '<b>Long talks are fine.</b> Pause, then pick up where you left off. Punctuation is added for you.',
           '<b>Talk to a prompt:</b> answer today’s prompt, a letter or the look back out loud.',
           '<b>Your voice stays private.</b> The recording is used only to make the text, then deleted. Keeping the audio is a choice, and it’s off unless you turn it on.',
           'Everything spoken becomes a normal entry: searchable, part of your pages, and used to make the app yours like anything you type.'],
      ex: ['Example: a hard day', 'Under the hard-day reply: “Want to write it out?” Tap it, tap the mic, and talk for two minutes on the walk home. It’s saved as an entry before you reach the door.'] },
    { id: 'act', t: 'From writing to doing', sum: 'Any entry can become action in one tap. Writing about something is half of it. This is the other half.',
      li: ['<b>On every entry, side by side:</b> <b>Act on this →</b> · <b>Keep it personal</b>',
           '<b>Keep it personal:</b> “Just for you. It won’t shape your plans, steps or suggestions.” The entry gets a small lock tag, and you can switch it back any time.',
           '<b>It asks:</b> “What should we do with this?” Three choices:',
           '<b>Add a step this week:</b> a small step from what you wrote, added to your next open day.',
           '<b>Build it into next week:</b> next week’s plan is shaped around this.',
           '<b>Make it a new Ask:</b> start a plan for it. (More Asks are part of the full app, with the “fewer at once works better” note.)',
           '<b>You see it before it’s added:</b> the step is drafted from your playbook only, in plain words. Tap <b>Add it</b> or <b>Try another</b>. Then: “Added to Thursday.”',
           '<b>It can offer itself.</b> When an entry sounds like something you want (“I really want to…”, “I need to stop…”), a quiet line appears at the bottom: “Sounds like something you want. Act on this? · Keep it personal”. Choosing Keep it personal means the app won’t ask about that entry again.'],
      ex: ['Example', 'Entry: “I keep saying I’ll call my dad more and I never do.” → Act on this → Add a step this week → “Call your dad for ten minutes on your drive home Thursday.” → Add it → “Added to Thursday.”'] },
    { id: 'collect', t: 'Everything you’ve written, in one place', sum: 'People already write across the app. The journal gathers all of it automatically, so nothing they’ve said gets lost.',
      li: ['What it gathers: check-in notes, how steps felt, gut calls, one line on today, the day 4 question, the look back, and Shape next week.',
           'Each entry shows where it came from (“From your day 3 check-in”) and stays editable.',
           'Nothing is copied twice: editing it in the journal edits it everywhere.'] },
    { id: 'docs', t: 'Pages that build themselves', sum: 'The heart of the memory side. Living mini documents that collect related entries on their own, so people can pull back “all my whys” or “every win” in one tap.',
      li: ['<b>Your whys:</b> every answer to “why do you want this?”',
           '<b>Your proof:</b> wins, kept promises and proof lines. The page to open on a hard day.',
           '<b>Error thoughts, flipped:</b> each harsh thought next to the truer version.',
           '<b>Gut calls:</b> each call, and how it played out two weeks later.',
           '<b>Letters</b>, <b>What you’ve let go</b> and <b>Your look backs</b>.',
           '<b>Your own pages:</b> make one (“Notes on my dad”, “Business ideas”) and add any entry to it.',
           'Every page reads like a clean document, can be pinned, and later downloaded.'],
      ex: ['Your proof · 14 entries', '“Ran 2 miles without stopping.” · “Said no to the Saturday shift and didn’t take it back.” · “Wrote 200 words when I didn’t want to.”'] },
    { id: 'find', t: 'Finding it again', sum: 'A journal is only useful if you can get back to what you wrote.',
      li: ['A timeline by week, newest first.',
           'Search across everything you’ve written.',
           'Filters: by Ask, by play, by kind of day, and by your own tags.',
           'Pin anything to the top.',
           '<b>On this day</b> (optional): “A month ago you wrote…”, shown gently on Today.'] },
    { id: 'share', t: 'Send it, share it, keep it', sum: 'Two jobs: keep things for yourself, and bring someone in. Having a partner, coach or friend see your progress is one of the strongest reasons people stick with change. Nothing ever goes to another person automatically: you pick what, see a preview, and tap Send.',
      li: ['<b>Any entry or page</b> (Your proof, Your whys, Letters…): <b>Email it to me · Send to someone · Download</b>.',
           '<b>Progress → Share my progress:</b> a week snapshot with days done, each Ask’s progress and one highlight you pick. Your journal is never included unless you add it.',
           '<b>A win</b> (all seven days, an Ask reached): <b>Share this win</b>, a branded image card for texts or social, like the quiz share card.',
           '<b>Day 7 → Send my week to me:</b> your look back and Shape next week answers, in your inbox.',
           '<b>Your month in your words</b> and a <b>weekly recap</b> by email, both only if you turn them on.',
           '<b>You → Download everything:</b> all your data, any time.',
           'Every email follows your email design. Emails to someone else come from “Jarred at The Jarred Effect, sent by [your name]”, and replies go to you.',
           'People you send to are never added to the mailing list or marketed to. A few sends a day at most, so it can’t be misused.'],
      ex: ['Example: Send to someone', 'To: my sister · “Week one, 5 of 7 days done. Run a 5K: 4 of 5 steps. Highlight: ran 2 miles without stopping.” · Preview · Send'] },
    { id: 'month', t: 'Your month, in your words', sum: 'At the end of each month, the app writes one short page from what you wrote: the themes, the wins, what helped, and a few of your own best lines quoted back.',
      li: ['Written by the AI from your entries only, in your playbook’s voice. No hype, no diagnosis.',
           'You can edit it, keep it, or delete it.',
           'It becomes a page you can come back to: a record of who you were becoming.'] },
    { id: 'personal', t: 'How it makes the app yours', sum: 'This is the dynamic layer on top of the plan. The app learns from what people write and what they tell it, and uses that to shape their experience. Always in service of their Ask, never to sell to them.',
      li: ['<b>What it learns:</b> your words for things, the themes you keep coming back to, what sets you off, what helps, when you show up, your wins and proof, the harsh thoughts you catch, and what you value.',
           '<b>Next week’s plan:</b> picks the plays and pace that fit what you’ve been writing. Grief shows up, so Making room comes in. The same harsh thought keeps coming back, so Catching error thoughts.',
           '<b>Your own words, mirrored:</b> examples and encouragement use your phrases (the playbook’s mirror rule). If you call it “my Sunday dread”, so does the app.',
           '<b>On a hard day:</b> one of your own proof lines appears under the check-in.',
           '<b>Prompts</b> that fit today: after a gut call, the gut debrief prompt.',
           '<b>Patterns</b> adds themes over time: “You mention feeling behind most Mondays.”'],
      ex: ['Example: a step example, personalized', '“After the 6 p.m. stand-up, close the laptop and leave it in the hall closet.” (Built from: “the 6 p.m. stand-up is where my evenings go.”)'] },
    { id: 'knows', t: 'What the app knows about you', sum: 'A plain page in You that lists what the app has learned, so the personalization is never a black box.',
      li: ['Written in plain sentences: “You do your best work in the morning.” “Your word for a hard day is ‘heavy’.”',
           'Each line shows what it came from, and can be edited or removed (“forget this”).',
           'One switch turns personalization off completely.'] },
    { id: 'trust', t: 'Privacy and trust', sum: 'A journal only works if people feel safe writing in it. These are the promises.',
      li: ['<b>Private by default.</b> Only the person sees their journal. No one at The Jarred Effect reads individual entries.',
           '<b>Keep it personal:</b> any entry, one tap. It stays only in your journal and never shapes your plans, steps or suggestions.',
           '<b>Delete</b> one entry or everything, and <b>download</b> it all, any time.',
           'Stored per person in the database, locked so only they can reach it.',
           'Writing is sent to the AI only to build their own pages and plans. The AI provider doesn’t train on it. The privacy policy says this plainly.',
           '<b>Voice:</b> recordings are turned into text and then deleted, unless the person chooses to keep them. The microphone only listens while the mic button is on.',
           '<b>Safety:</b> if an entry suggests crisis or danger, the app gently shows crisis resources, the same check plans use. It’s coaching and reflection, never therapy, never a diagnosis.'] },
    { id: 'free', t: 'Free and full app', sum: 'Free users get a taste of how much the app remembers. Writing more is part of the full app.',
      li: ['<b>Free:</b> the Journal tab shows “Your words so far”, everything they’ve written in the plan, read-only.',
           '<b>Full app:</b> writing, prompts, letters, the pages that build themselves, search, your month in your words, and personalization.'] },
    { id: 'order', t: 'What it needs first, and the build order', sum: 'A journal can’t live only in one browser. It needs accounts, so it’s there on every device and never lost.',
      li: ['<b>Needs first:</b> sign-in and the database (already on the checklist).',
           '<b>Phase 1:</b> the Journal tab, free write, prompts, quick line, letters, <b>talk instead of type</b>, auto-gathered entries, timeline, search, pins, privacy controls, the safety check.',
           '<b>Phase 2:</b> pages that build themselves, your own pages, On this day, Email it to me and Download.',
           '<b>Phase 3:</b> Act on this, Send to someone, Share my progress, Share this win, the weekly recap, personalization in weekly plans, mirrored words, hard-day proof lines, and What the app knows about you.',
           '<b>Phase 4:</b> your month in your words, downloads, and keeping your voice recordings if you choose to.'] }
  ];
  var QS = [
    { id: 'q-act', t: 'What should the button on an entry say?', opts: [['act', 'Act on this →', 'Short, clear and active. Says exactly what happens. (Recommended)'], ['real', 'Make this real →', 'More emotional and on brand, a little less specific.'], ['step', 'Turn this into a step →', 'The most literal. Longest of the three.']] },
    { id: 'q-recap', t: 'A weekly recap email?', opts: [['optin', 'Yes, if they turn it on', 'Offered on day 7 and in You. Respects inboxes. (Recommended)'], ['on', 'Yes, on by default', 'More people see their progress weekly, with one-click off.'], ['none', 'No weekly email', 'Keep email to the plan and sends people choose.']] },
    { id: 'q-name', t: 'What should the tab be called?', opts: [['journal', 'Journal', 'Plain and instantly understood. (Recommended)'], ['words', 'Your words', 'Warmer, matches “In your words”.'], ['notebook', 'Notebook', 'Lighter, less pressure to write a lot.']] },
    { id: 'q-human', t: 'Can anyone on your side read journals?', opts: [['none', 'No one', 'Only the person. You see anonymous trends at most, and only if they opt in. (Recommended)'], ['support', 'Only with permission', 'For support, when the person asks you to look.']] },
    { id: 'q-personal', t: 'Is personalization on by default?', opts: [['on', 'On, with a switch', 'On from the start, explained once, with “Keep it personal” on any entry and a switch to turn it off. (Recommended)'], ['off', 'Off until turned on', 'People choose to switch it on.']] },
    { id: 'q-onthisday', t: 'On this day: how should it work?', opts: [['optin', 'Off until turned on', 'Old entries can be painful, so people choose it. (Recommended)'], ['on', 'On by default', 'More people see it, with a way to turn it off.']] },
    { id: 'q-free', t: 'What do free users see in the Journal tab?', opts: [['read', 'Their words so far, read-only', 'Shows how much the app remembers. A strong reason to upgrade. (Recommended)'], ['locked', 'A locked preview only', 'Simpler, but they don’t see their own words collected.']] }
  ];
  var list = document.getElementById('list'), statusEl = document.getElementById('status');
  var state = {}, db = null, timers = {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function note(id) { return '<div class="note"><label for="n-' + id + '">A note for Claude (optional)</label><textarea id="n-' + id + '" data-note="' + id + '" placeholder="Anything to add, change or ask"></textarea></div><p class="saved" data-saved="' + id + '" aria-live="polite"></p>'; }
  list.innerHTML = PARTS.map(function (p, i) {
    return '<article class="part" data-item="' + p.id + '"><div class="top"><span class="n">' + (i + 1) + '</span><h2>' + esc(p.t) + '</h2></div>' +
      '<p class="sum">' + esc(p.sum) + '</p><ul>' + p.li.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>' +
      (p.ex ? '<div class="ex"><p class="lab">' + esc(p.ex[0]) + '</p><p>' + esc(p.ex[1]) + '</p></div>' : '') +
      '<div class="dec" role="group" aria-label="Your decision on ' + esc(p.t) + '" data-id="' + p.id + '"><button type="button" data-c="approve" aria-pressed="false">Approve</button><button type="button" data-c="change" aria-pressed="false">Change</button><button type="button" data-c="hold" aria-pressed="false">Hold</button></div>' +
      note(p.id) + '</article>';
  }).join('') +
  '<div class="sec-h"><p class="k">Your calls</p><h2>Seven open questions</h2><p>Pick one for each. The recommended option is first.</p></div>' +
  QS.map(function (q) {
    return '<article class="part" data-item="' + q.id + '"><h2>' + esc(q.t) + '</h2><div class="opts" role="radiogroup" aria-label="' + esc(q.t) + '" data-q="' + q.id + '">' +
      q.opts.map(function (o) { return '<button type="button" role="radio" aria-checked="false" data-o="' + o[0] + '"><i aria-hidden="true"></i><span><b>' + esc(o[1]) + '</b><br>' + esc(o[2]) + '</span></button>'; }).join('') + '</div>' + note(q.id) + '</article>';
  }).join('');
  function paint() {
    var n = { approve: 0, change: 0, hold: 0 }, answered = 0;
    PARTS.forEach(function (p) {
      var d = state[p.id] || {}, el = list.querySelector('[data-item="' + p.id + '"]');
      if (d.choice) { el.setAttribute('data-choice', d.choice); n[d.choice]++; } else el.removeAttribute('data-choice');
      el.querySelectorAll('.dec button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-c') === d.choice)); });
    });
    QS.forEach(function (q) {
      var d = state[q.id] || {}; if (d.option) answered++;
      list.querySelectorAll('[data-q="' + q.id + '"] button').forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-o') === d.option)); });
    });
    list.querySelectorAll('[data-note]').forEach(function (t) { var d = state[t.getAttribute('data-note')] || {}; if (document.activeElement !== t) t.value = d.note || ''; });
    document.getElementById('tally').innerHTML = '<b>' + (n.approve + n.change + n.hold) + '</b> of ' + PARTS.length + ' parts decided · ' + n.approve + ' approved · ' + n.change + ' to change · ' + n.hold + ' held · <b>' + answered + '</b> of ' + QS.length + ' questions answered';
  }
  function flash(id) { var s = list.querySelector('[data-saved="' + id + '"]'); if (s) { s.textContent = 'Saved'; clearTimeout(s._t); s._t = setTimeout(function () { s.textContent = ''; }, 1600); } }
  function write(id) {
    if (!db) return;
    var d = state[id] || {};
    db.collection('journal-plan').doc(id).set({ choice: d.choice || null, option: d.option || null, note: d.note || '', at: new Date().toISOString() })
      .then(function () { flash(id); statusEl.className = 'status'; statusEl.textContent = 'Saved. Claude can read your choices.'; })
      .catch(function () { statusEl.className = 'status warn'; statusEl.textContent = 'That didn’t save. Try again in a moment.'; });
  }
  list.addEventListener('click', function (e) {
    var b = e.target.closest('.dec button');
    if (b) { var id = b.parentNode.getAttribute('data-id'), c = b.getAttribute('data-c'); var d = state[id] = Object.assign({}, state[id]); d.choice = d.choice === c ? null : c; paint(); write(id); if (d.choice === 'change') document.getElementById('n-' + id).focus(); return; }
    var o = e.target.closest('.opts button');
    if (o) { var q = o.parentNode.getAttribute('data-q'); state[q] = Object.assign({}, state[q], { option: o.getAttribute('data-o') }); paint(); write(q); }
  });
  list.addEventListener('input', function (e) {
    var t = e.target.closest('[data-note]'); if (!t) return;
    var id = t.getAttribute('data-note'); state[id] = Object.assign({}, state[id], { note: t.value });
    clearTimeout(timers[id]); timers[id] = setTimeout(function () { write(id); }, 800);
  });
  paint();
  if (!window.claude || !window.claude.use) { statusEl.className = 'status warn'; statusEl.textContent = 'Open this page on claude.ai to save your choices.'; return; }
  window.claude.use('db').then(function (d) {
    db = d;
    if (!db) { statusEl.className = 'status warn'; statusEl.textContent = 'Sign in on claude.ai to save your choices. You can still read everything.'; return; }
    statusEl.textContent = 'Your choices save as you make them.';
    db.collection('journal-plan').onSnapshot(function (snap) {
      snap.docs.forEach(function (doc) { var v = doc.data(); if (v) state[doc.id] = { choice: v.choice || null, option: v.option || null, note: v.note || '' }; });
      paint();
    }, function () { statusEl.className = 'status warn'; statusEl.textContent = 'Lost the connection. Reload to keep saving.'; });
  });
})();
