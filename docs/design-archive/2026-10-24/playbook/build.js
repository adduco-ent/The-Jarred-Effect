const P = require(process.argv[2]);
const out = process.argv[3];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sideOrder = ['discipline', 'desire', 'faith', 'friction', 'ambition', 'acceptance', 'control', 'trust'];
const sideName = (s) => s[0].toUpperCase() + s.slice(1);
const pairOf = { desire: 'Desire ↔ Discipline', discipline: 'Desire ↔ Discipline', faith: 'Faith ↔ Friction', friction: 'Faith ↔ Friction', ambition: 'Ambition ↔ Acceptance', acceptance: 'Ambition ↔ Acceptance', control: 'Control ↔ Trust', trust: 'Control ↔ Trust' };
const whoNeeds = { discipline: 'People who run on wanting (often Dreamers)', desire: 'People who run on effort (often Achievers)', faith: 'People who get stuck in what’s wrong', friction: 'People who push fear aside fast (often Dreamers)', ambition: 'People at peace who risk settling', acceptance: 'People always reaching for next', control: 'People who hand everything off', trust: 'People who carry it all themselves (often Achievers)' };

const decide = (id) => `<div class="dec" data-id="${id}" role="group" aria-label="Your decision">
  <button type="button" data-c="approve">Approve</button><button type="button" data-c="change">Change</button><button type="button" data-c="hold">Hold</button>
</div>
<div class="note" data-note="${id}" hidden><label for="n-${id}">What should change?</label><textarea id="n-${id}" rows="2" placeholder="Say it how you’d say it. I’ll rewrite from your note."></textarea><button type="button" class="save" data-save="${id}">Save note</button></div>`;

const listItem = (id, kicker, title, lines) => `<article class="item" data-item="${id}">
  <header><p class="k">${esc(kicker)}</p><h3>${esc(title)}</h3></header>
  <ol class="lines">${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ol>
  ${decide(id)}
</article>`;

const rep = (r) => `<article class="item rep" data-item="${r.id}">
  <header><h3>${esc(r.title)}</h3><span class="min">${r.minutes} min</span></header>
  <p class="what">${esc(r.what)}</p>
  <p class="eg"><span>For example</span>${esc(r.example)}</p>
  <p class="rough"><span>Rough day?</span>${esc(r.rough)}</p>
  ${decide(r.id)}
</article>`;

const groups = sideOrder.map((s) => `<section class="side" id="side-${s}">
  <div class="side-h"><p class="k">${esc(pairOf[s])}</p><h2>${sideName(s)}</h2><p class="side-d">${esc(P.sides[s])}</p><p class="side-who">Built for: ${esc(whoNeeds[s])}</p></div>
  <div class="grid">${P.reps.filter((r) => r.side === s).map(rep).join('')}</div>
</section>`).join('');

const sq = P.shadowQuestions.map((q) => `<article class="item" data-item="sq-${q.id}">
  <header><p class="k">${esc(q.name)}</p><h3 class="q">${esc(q.ask)}</h3></header>
  <p class="eg"><span>If they want to go deeper</span>${q.followUps.map(esc).join(' ')}</p>
  ${decide('sq-' + q.id)}
</article>`).join('') + `<article class="item" data-item="going-deep"><header><p class="k">Shown with every shadow question</p><h3>Going deep</h3></header><p class="what">${esc(P.goingDeep)}</p>${decide('going-deep')}</article>`;

const ids = ['shape', 'voice', 'hard'].concat(P.reps.map((r) => r.id), P.shadowQuestions.map((q) => 'sq-' + q.id), ['going-deep']);

const html = `<title>Other Half Playbook</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;1,400&display=swap">
<style>
/* Layout: a review desk. A sticky tally on top; the plan rules first, then the 48 steps grouped by the side they build, then the shadow questions. Every item carries the same Approve / Change / Hold control in the same place. */
:root{
  --bg:#f6f7f9; --card:#fdfdfc; --fg:#1c1812; --dim:#574f43; --faint:#857b6d; --line:rgba(28,24,18,.1);
  --ink:#1c1812; --navy:#0e1a2c; --orange:#e8743a; --rust:#a8471c; --ok:#2f6b47; --hold:#6b6254; --chip:#efe9df;
  --display:"Libre Caslon Display","Libre Caslon Text",Georgia,serif; --serif:"Libre Caslon Text",Georgia,serif; --sans:"Instrument Sans","Helvetica Neue",Arial,sans-serif;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0b1320;--card:#121c2c;--fg:#efe7da;--dim:#c4bcaf;--faint:#9b9386;--line:rgba(239,231,218,.12);--ink:#efe7da;--navy:#1e3352;--rust:#f3a378;--ok:#7cc49a;--hold:#b8afa1;--chip:#1b2738;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0b1320;--card:#121c2c;--fg:#efe7da;--dim:#c4bcaf;--faint:#9b9386;--line:rgba(239,231,218,.12);--ink:#efe7da;--navy:#1e3352;--rust:#f3a378;--ok:#7cc49a;--hold:#b8afa1;--chip:#1b2738;color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased}
.wrap{max-width:62rem;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
h1,h2,h3{font-family:var(--display);font-weight:400;margin:0;text-wrap:balance}
p{margin:0}
.hero{padding-block:3.5rem 2rem;display:grid;gap:1rem}
.hero .k{color:var(--rust)}
.hero h1{font-size:clamp(2.4rem,6vw,3.75rem);line-height:1.02;letter-spacing:-.01em}
.hero h1 i{font-family:var(--serif);color:var(--rust)}
.lead{max-width:40rem;font-size:1.0625rem;color:var(--dim)}
.how{display:flex;flex-wrap:wrap;gap:.5rem 1.25rem;font-size:.9375rem;color:var(--dim)}
.how b{color:var(--fg);font-weight:600}
.k{font-size:.6875rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
.bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);border-bottom:1px solid var(--line)}
.bar .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem 1.25rem;padding-block:.75rem}
.meter{flex:1;min-width:8rem;height:6px;border-radius:6px;background:var(--line);overflow:hidden;display:flex}
.meter i{display:block;height:100%;transition:width .4s ease}
.meter .a{background:var(--ok)}.meter .c{background:var(--orange)}.meter .h{background:var(--hold)}
.tally{font-size:.875rem;color:var(--dim);font-variant-numeric:tabular-nums}
.tally b{color:var(--fg)}
.filters{display:flex;gap:.375rem}
.filters button{font:inherit;font-size:.8125rem;padding:.3rem .75rem;border-radius:99px;border:1px solid var(--line);background:var(--card);color:var(--dim);cursor:pointer}
.filters button[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.status{width:100%;font-size:.8125rem;color:var(--faint)}
.status.warn{color:var(--rust)}
section{padding-block:2.5rem 0}
.sec-h{display:grid;gap:.5rem;margin-bottom:1.25rem;max-width:42rem}
.sec-h h2,.side-h h2{font-size:clamp(1.75rem,4vw,2.25rem);line-height:1.1}
.sec-h p:not(.k){color:var(--dim)}
.side{border-top:1px solid var(--line);margin-top:2.5rem}
.side-h{display:grid;gap:.375rem;margin-bottom:1.25rem;max-width:42rem}
.side-d{font-family:var(--serif);font-style:italic;font-size:1.125rem;color:var(--fg)}
.side-who{font-size:.875rem;color:var(--faint)}
.grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(min(100%,18.5rem),1fr))}
.item{display:flex;flex-direction:column;gap:.75rem;padding:1.25rem;border-radius:1.25rem;background:var(--card);border:1px solid var(--line);min-width:0;transition:border-color .25s ease,opacity .25s ease}
.item header{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.25rem .75rem}
.item header .k{width:100%}
.item h3{font-size:1.375rem;line-height:1.2}
.item h3.q{font-family:var(--serif);font-style:italic;font-size:1.3125rem}
.min{font-size:.75rem;font-weight:600;padding:.15rem .55rem;border-radius:99px;background:var(--chip);color:var(--dim);font-variant-numeric:tabular-nums;white-space:nowrap}
.what{color:var(--fg)}
.eg,.rough{font-size:.9375rem;color:var(--dim)}
.eg span,.rough span{display:block;font-size:.6875rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-bottom:.125rem}
.rough span{color:var(--rust)}
.lines{margin:0;padding-left:1.25rem;display:grid;gap:.4rem;color:var(--fg);font-size:.9375rem}
.wide{max-width:46rem}
.dec{display:grid;grid-template-columns:repeat(3,1fr);gap:.375rem;margin-top:auto;padding-top:.5rem}
.dec button{font:inherit;font-size:.875rem;font-weight:600;min-height:2.5rem;border-radius:.75rem;border:1px solid var(--line);background:transparent;color:var(--dim);cursor:pointer;transition:background .2s ease,color .2s ease,border-color .2s ease}
.dec button:hover{border-color:var(--faint);color:var(--fg)}
.dec button:focus-visible,.filters button:focus-visible,.save:focus-visible,textarea:focus-visible{outline:2px solid var(--rust);outline-offset:2px}
.item[data-choice="approve"]{border-color:var(--ok)}
.item[data-choice="change"]{border-color:var(--orange)}
.item[data-choice="hold"]{border-style:dashed;border-color:var(--hold)}
.dec button[aria-pressed="true"][data-c="approve"]{background:var(--ok);border-color:var(--ok);color:var(--card)}
.dec button[aria-pressed="true"][data-c="change"]{background:var(--orange);border-color:var(--orange);color:#241904}
.dec button[aria-pressed="true"][data-c="hold"]{background:var(--hold);border-color:var(--hold);color:var(--card)}
.note{display:grid;gap:.375rem}
.note label{font-size:.8125rem;font-weight:600}
.note textarea{font:inherit;font-size:.9375rem;width:100%;padding:.625rem .75rem;border-radius:.75rem;border:1px solid var(--line);background:var(--bg);color:var(--fg);resize:vertical}
.save{justify-self:start;font:inherit;font-size:.8125rem;font-weight:600;padding:.4rem .9rem;border-radius:99px;border:0;background:var(--ink);color:var(--bg);cursor:pointer}
.saved{font-size:.8125rem;color:var(--ok)}
.toc{display:flex;flex-wrap:wrap;gap:.375rem;margin-top:.5rem}
.toc a{font-size:.8125rem;color:var(--dim);text-decoration:none;padding:.25rem .7rem;border-radius:99px;border:1px solid var(--line);background:var(--card)}
.toc a:hover{color:var(--fg);border-color:var(--faint)}
body.f-open .item[data-choice]{display:none}
body.f-change .item:not([data-choice="change"]){display:none}
footer{padding-block:3rem;font-size:.875rem;color:var(--faint)}
@media (prefers-reduced-motion:reduce){.meter i,.item,.dec button{transition:none}}
</style>

<div class="wrap"><div class="hero">
  <p class="k">The Other Half · Playbook version ${P.version}</p>
  <h1>The method, <i>step by step.</i></h1>
  <p class="lead">Every 7-day plan is built only from what’s on this page. The AI tailors the examples to each person’s Ask; it never invents its own method. Approve what sounds like you, mark what needs changing with a note in your own words, and hold anything you’re unsure about.</p>
  <p class="how"><span><b>Approve</b> it ships as written</span><span><b>Change</b> I rewrite it from your note</span><span><b>Hold</b> leave it out of version 1 for now</span></p>
  <nav class="toc" aria-label="Jump to">${['How a plan is built','Voice','Hard rules'].map((t,i)=>`<a href="#${['shape','voice','hard'][i]}">${t}</a>`).join('')}${sideOrder.map((s) => `<a href="#side-${s}">${sideName(s)}</a>`).join('')}<a href="#shadow">Shadow questions</a></nav>
</div></div>

<div class="bar"><div class="wrap">
  <div class="meter" aria-hidden="true"><i class="a"></i><i class="c"></i><i class="h"></i></div>
  <p class="tally" id="tally"><b>0</b> of ${ids.length} decided</p>
  <div class="filters" role="group" aria-label="Show"><button type="button" data-f="all" aria-pressed="true">All</button><button type="button" data-f="open" aria-pressed="false">Undecided</button><button type="button" data-f="change" aria-pressed="false">To change</button></div>
  <p class="status" id="status" role="status">Connecting, so your choices save…</p>
</div></div>

<main class="wrap">
  <section id="rules">
    <div class="sec-h"><p class="k">The rules every plan follows</p><h2>How a plan is built</h2><p>Three sets of rules sit above every step: the shape of a week, how it sounds, and the lines it never crosses.</p></div>
    <div class="grid" style="grid-template-columns:1fr">
      <div class="wide" id="shape">${listItem('shape', 'The shape of a week', 'How a 7-day plan is put together', P.planShape)}</div>
      <div class="wide" id="voice">${listItem('voice', 'Your voice', 'How every plan sounds', P.voice)}</div>
      <div class="wide" id="hard">${listItem('hard', 'Never', 'The hard rules', P.hardRules)}</div>
    </div>
  </section>
  ${groups}
  <section class="side" id="shadow">
    <div class="sec-h"><p class="k">From the guide</p><h2>Shadow questions</h2><p>Day 4 of every plan is one of these, chosen by type, with gentle follow-ups for anyone who wants to go further.</p></div>
    <div class="grid">${sq}</div>
  </section>
</main>
<footer><div class="wrap">The Jarred Effect · Playbook version ${P.version} · ${P.reps.length} steps, ${P.shadowQuestions.length} shadow questions</div></footer>

<script>
(function () {
  var IDS = ${JSON.stringify(ids)};
  var state = {}; // id -> {choice, note}
  var db = null;
  var statusEl = document.getElementById('status');
  function paint() {
    var n = { approve: 0, change: 0, hold: 0 };
    IDS.forEach(function (id) {
      var d = state[id] || {}, item = document.querySelector('[data-item="' + id + '"]');
      if (!item) return;
      if (d.choice) { item.setAttribute('data-choice', d.choice); n[d.choice]++; } else item.removeAttribute('data-choice');
      [].forEach.call(item.querySelectorAll('.dec button'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-c') === d.choice)); });
      var note = item.querySelector('[data-note]'), ta = note && note.querySelector('textarea');
      if (note) { note.hidden = d.choice !== 'change'; if (ta && document.activeElement !== ta && d.note != null) ta.value = d.note; }
    });
    var done = n.approve + n.change + n.hold, t = IDS.length;
    document.getElementById('tally').innerHTML = '<b>' + done + '</b> of ' + t + ' decided · ' + n.approve + ' approved · ' + n.change + ' to change · ' + n.hold + ' held';
    var m = document.querySelector('.meter');
    m.querySelector('.a').style.width = (n.approve / t * 100) + '%';
    m.querySelector('.c').style.width = (n.change / t * 100) + '%';
    m.querySelector('.h').style.width = (n.hold / t * 100) + '%';
  }
  function write(id) {
    var d = state[id];
    if (!db) return;
    db.collection('decisions').doc(id).set({ choice: d.choice || null, note: d.note || '', at: new Date().toISOString() })
      .then(function () { statusEl.className = 'status'; statusEl.textContent = 'Saved. Claude can read your choices.'; })
      .catch(function () { statusEl.className = 'status warn'; statusEl.textContent = 'That choice didn’t save. Try it again in a moment.'; });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.dec button');
    if (b) {
      var id = b.parentNode.getAttribute('data-id'), c = b.getAttribute('data-c');
      var d = state[id] = Object.assign({}, state[id]);
      d.choice = d.choice === c ? null : c;
      paint(); write(id);
      if (d.choice === 'change') { var ta = document.getElementById('n-' + id); if (ta) ta.focus(); }
      return;
    }
    var s = e.target.closest('[data-save]');
    if (s) {
      var sid = s.getAttribute('data-save');
      state[sid] = Object.assign({}, state[sid], { note: document.getElementById('n-' + sid).value.trim() });
      write(sid); s.textContent = 'Note saved'; setTimeout(function () { s.textContent = 'Save note'; }, 1500);
      return;
    }
    var f = e.target.closest('[data-f]');
    if (f) {
      document.body.classList.remove('f-open', 'f-change');
      if (f.getAttribute('data-f') !== 'all') document.body.classList.add('f-' + f.getAttribute('data-f'));
      [].forEach.call(document.querySelectorAll('[data-f]'), function (x) { x.setAttribute('aria-pressed', String(x === f)); });
    }
  });
  paint();
  if (!window.claude || !window.claude.use) { statusEl.className = 'status warn'; statusEl.textContent = 'Open this page on claude.ai to save your choices.'; return; }
  window.claude.use('db').then(function (d) {
    db = d;
    if (!db) { statusEl.className = 'status warn'; statusEl.textContent = 'Sign in on claude.ai to save your choices. You can still read everything.'; return; }
    statusEl.textContent = 'Your choices save as you make them.';
    db.collection('decisions').onSnapshot(function (snap) {
      snap.docs.forEach(function (doc) { var v = doc.data(); if (v) state[doc.id] = { choice: v.choice || null, note: v.note || '' }; });
      paint();
    }, function () { statusEl.className = 'status warn'; statusEl.textContent = 'Lost the connection. Reload the page to keep saving.'; });
  });
})();
</script>
`;
require('fs').writeFileSync(out, html);
console.log('items', ids.length, 'bytes', html.length);
