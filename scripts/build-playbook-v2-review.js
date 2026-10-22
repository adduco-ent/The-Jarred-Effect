// Builds the Playbook v2 review page: every step's deeper help (why, walkthrough, if you get stuck, in real life).
// Everything on it is already live in the app. Jarred can edit any text in place or remove an entry, any time.
// His changes live in the artifact's database (collection "v2", one document per step id:
// { edit: { why, how0..how3, stuck, story }, removed, at }). Claude applies them to lib/playbook-v2.js when asked.
// Usage: node scripts/build-playbook-v2-review.js <out.html>
const P = require('../lib/playbook');
const V = require('../lib/playbook-v2');
const out = process.argv[2];
if (!out) throw new Error('usage: build-playbook-v2-review.js <out.html>');
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const GROUPS = [
  ['discipline', 'Discipline'], ['desire', 'Desire'], ['faith', 'Faith'], ['friction', 'Friction'], ['ambition', 'Ambition'],
  ['acceptance', 'Acceptance'], ['control', 'Control'], ['trust', 'Trust'], ['habits', 'Habits'], ['field', 'Your field'],
  ['loose', 'Living lightly'], ['people', 'People and doors'], ['agency', 'Agency'], ['worth', 'Voice and worth'],
  ['thoughts', 'Error thoughts'], ['circle', 'Your five'], ['agreements', 'Four ways to stay clear'], ['foundations', 'Foundations'],
  ['signal', 'Your signal'], ['power', 'Your power'], ['room', 'Making room'], ['tools', 'Tools']
];

const ORIG = {};
const field = (id, key, text, tag = 'p', cls = '') => { ORIG[id + '.' + key] = text; return `<${tag} class="ed ${cls}" data-of="${id}" data-f="${key}">${esc(text)}</${tag}>`; };

function card(r) {
  const h = V.help[r.id];
  if (!h) return `<article class="item is-none" data-item="${r.id}"><header><h3>${esc(r.title)}</h3><span class="min">${r.minutes} min</span></header><p class="what">${esc(r.what)}</p><p class="none">No extra help for this step.</p></article>`;
  return `<article class="item" data-item="${r.id}" data-search="${esc((r.title + ' ' + r.what + ' ' + h.why + ' ' + h.how.join(' ') + ' ' + h.stuck + ' ' + h.story).toLowerCase())}">
  <header><h3>${esc(r.title)}</h3><span class="min">${r.minutes} min</span></header>
  <p class="what">${esc(r.what)}</p>
  <div class="f"><p class="lab">Why it helps</p>${field(r.id, 'why', h.why)}</div>
  <div class="f"><p class="lab">Walk me through it</p><ol class="walk">${h.how.map((x, i) => field(r.id, 'how' + i, x, 'li')).join('')}</ol></div>
  <div class="f"><p class="lab">If you get stuck</p>${field(r.id, 'stuck', h.stuck)}</div>
  <div class="f story"><p class="lab">In real life <span>made-up example</span></p>${field(r.id, 'story', h.story, 'p', 'st')}</div>
  <div class="ctl" data-id="${r.id}"><button type="button" data-act="edit" aria-pressed="false">Edit</button><button type="button" data-act="remove" aria-pressed="false">Remove</button><button type="button" class="link" data-act="undo" hidden>Undo my edits</button><span class="saved" data-saved="${r.id}" aria-live="polite"></span></div>
</article>`;
}

const groups = GROUPS.map(([side, name]) => {
  const reps = P.reps.filter((r) => r.side === side);
  if (!reps.length) return '';
  return `<section class="side" id="g-${side}"><div class="side-h"><h2>${esc(name)}</h2><p class="k">${reps.length} steps</p></div><div class="grid">${reps.map(card).join('')}</div></section>`;
}).join('');
const ids = P.reps.filter((r) => V.help[r.id]).map((r) => r.id);

const html = `<title>Playbook v2</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;1,400&display=swap">
<style>
/* A reading desk for the deeper help on every step. It's all live already, so each card has just Edit and Remove. */
:root{
  --bg:#f6f7f9;--card:#fdfdfc;--fg:#1c1812;--dim:#574f43;--faint:#7a7062;--line:rgba(28,24,18,.1);--ink:#1c1812;
  --accent:#3e6cab;--accent-ink:#2f5a94;--soft:rgba(62,108,171,.08);--rust:#a8471c;--chip:#efe9df;
  --display:"Libre Caslon Display","Libre Caslon Text",Georgia,serif;--serif:"Libre Caslon Text",Georgia,serif;--sans:"Instrument Sans","Helvetica Neue",Arial,sans-serif;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0b1320;--card:#121c2c;--fg:#efe7da;--dim:#c4bcaf;--faint:#9b9386;--line:rgba(239,231,218,.12);--ink:#efe7da;--accent:#8fb0de;--accent-ink:#a9c3e6;--soft:rgba(143,176,222,.12);--rust:#f3a378;--chip:#1b2738;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0b1320;--card:#121c2c;--fg:#efe7da;--dim:#c4bcaf;--faint:#9b9386;--line:rgba(239,231,218,.12);--ink:#efe7da;--accent:#8fb0de;--accent-ink:#a9c3e6;--soft:rgba(143,176,222,.12);--rust:#f3a378;--chip:#1b2738;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased}
.wrap{max-width:64rem;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
h1,h2,h3{font-family:var(--display);font-weight:400;margin:0;text-wrap:balance}
p{margin:0}
.k{font-size:.6875rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
.hero{padding-block:3.5rem 2rem;display:grid;gap:1rem}
.hero .k{color:var(--accent-ink)}
.hero h1{font-size:clamp(2.25rem,6vw,3.5rem);line-height:1.04;letter-spacing:-.01em}
.hero h1 i{font-family:var(--serif);color:var(--accent-ink)}
.lead{max-width:42rem;font-size:1.0625rem;color:var(--dim)}
.how{display:flex;flex-wrap:wrap;gap:.5rem 1.25rem;font-size:.9375rem;color:var(--dim)}
.how b{color:var(--fg);font-weight:600}
.bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);border-bottom:1px solid var(--line)}
.bar .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:.625rem 1rem;padding-block:.75rem}
.bar input{flex:1;min-width:12rem;font:inherit;font-size:.9375rem;padding:.55rem .85rem;border-radius:99px;border:1px solid var(--line);background:var(--card);color:var(--fg)}
.bar input:focus{outline:2px solid var(--accent);outline-offset:1px}
.filters{display:flex;gap:.375rem}
.filters button{font:inherit;font-size:.8125rem;padding:.35rem .8rem;border-radius:99px;border:1px solid var(--line);background:var(--card);color:var(--dim);cursor:pointer}
.filters button[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.tally{font-size:.8125rem;color:var(--dim);font-variant-numeric:tabular-nums}
.status{width:100%;font-size:.8125rem;color:var(--faint)}
.status.warn{color:var(--rust)}
.toc{display:flex;flex-wrap:wrap;gap:.375rem}
.toc a{font-size:.8125rem;color:var(--dim);text-decoration:none;padding:.25rem .7rem;border-radius:99px;border:1px solid var(--line);background:var(--card)}
.toc a:hover{color:var(--fg);border-color:var(--faint)}
.side{padding-top:2.5rem}
.side-h{display:flex;align-items:baseline;gap:1rem;margin-bottom:1rem}
.side-h h2{font-size:clamp(1.625rem,4vw,2rem);line-height:1.1}
.grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(min(100%,22rem),1fr))}
.item{display:flex;flex-direction:column;gap:.875rem;padding:1.25rem;border-radius:1.25rem;background:var(--card);border:1px solid var(--line);min-width:0;transition:border-color .2s ease,opacity .2s ease}
.item header{display:flex;align-items:baseline;justify-content:space-between;gap:.75rem}
.item h3{font-size:1.375rem;line-height:1.2}
.min{flex:none;font-size:.75rem;font-weight:600;padding:.15rem .55rem;border-radius:99px;background:var(--chip);color:var(--dim)}
.what{font-size:.9375rem;color:var(--dim);padding-bottom:.875rem;border-bottom:1px solid var(--line)}
.f{display:grid;gap:.25rem}
.lab{font-size:.6875rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}
.lab span{margin-left:.375rem;letter-spacing:.04em;text-transform:none;font-weight:500}
.f p.ed,.walk{font-size:.9375rem;color:var(--fg)}
.walk{margin:0;padding-left:1.25rem;display:grid;gap:.25rem}
.story .st{font-family:var(--serif);font-size:1rem;line-height:1.55;padding:.75rem .875rem;border-radius:.75rem;background:var(--soft)}
.ctl{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;margin-top:auto;padding-top:.375rem}
.ctl button:not(.link){font:inherit;font-size:.875rem;font-weight:600;min-height:2.5rem;padding:0 1rem;border-radius:.75rem;border:1px solid var(--line);background:transparent;color:var(--dim);cursor:pointer}
.ctl button:not(.link):hover{border-color:var(--faint);color:var(--fg)}
.ctl button[data-act="edit"][aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#fff}
.ctl button[data-act="remove"][aria-pressed="true"]{background:var(--rust);border-color:var(--rust);color:#fff}
.ctl button:focus-visible,.filters button:focus-visible,.toc a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.link{font:inherit;font-size:.8125rem;padding:0;border:0;background:none;color:var(--dim);text-decoration:underline;text-underline-offset:.2em;cursor:pointer}
.saved{font-size:.8125rem;color:var(--accent-ink)}
.ed{border-radius:.375rem;transition:background .2s ease,box-shadow .2s ease}
.item.is-editing .ed{cursor:text;background:var(--chip);box-shadow:0 0 0 .25rem var(--chip);outline:none}
.item.is-editing .ed:focus{background:var(--card);box-shadow:0 0 0 .25rem var(--card),0 0 0 calc(.25rem + 1.5px) var(--accent)}
.walk .ed{display:list-item}
.ed.is-edited,.item.is-editing .ed.is-edited{background:var(--soft);box-shadow:0 0 0 .25rem var(--soft)}
.item.is-editing{border-color:var(--accent)}
.item.is-edited{border-color:var(--accent)}
.item.is-removed{opacity:.5;border-style:dashed}
.item.is-removed .ctl{opacity:1}
.none{font-size:.875rem;color:var(--faint);font-style:italic}
.hide{display:none!important}
footer{padding-block:3rem;font-size:.875rem;color:var(--faint)}
@media (prefers-reduced-motion:reduce){.item,.ed{transition:none}}
</style>

<div class="wrap"><div class="hero">
  <p class="k">The Other Half · Playbook v2 · live in the app</p>
  <h1>More help, <i>for every step.</i></h1>
  <p class="lead">For people who need more before they move. Every step has the reason it works, a walkthrough of mini-steps they can tick off, what to do if they get stuck, and a short made-up example of someone doing it. It follows your voice and hard rules, and it’s already live. Change anything that doesn’t sound like you, or remove it.</p>
  <p class="how"><span><b>Edit</b> tap the text and rewrite it in place</span><span><b>Remove</b> take this help off the step</span><span>Your changes save here. Tell Claude “apply my v2 changes” to put them in the app.</span></p>
  <nav class="toc" aria-label="Jump to">${GROUPS.map(([s, n]) => `<a href="#g-${s}">${esc(n)}</a>`).join('')}</nav>
</div></div>

<div class="bar"><div class="wrap">
  <input type="search" id="q" placeholder="Search steps and stories" aria-label="Search">
  <div class="filters" role="group" aria-label="Show"><button type="button" data-filter="all" aria-pressed="true">All</button><button type="button" data-filter="edited" aria-pressed="false">Edited</button><button type="button" data-filter="removed" aria-pressed="false">Removed</button></div>
  <p class="tally" id="tally"></p>
  <p class="status" id="status" role="status">Connecting, so your changes save…</p>
</div></div>

<main class="wrap">${groups}</main>
<footer><div class="wrap">The Jarred Effect · Playbook v${V.version} help · ${ids.length} steps · live since ${V.live}</div></footer>

<script>
(function () {
  var IDS = ${JSON.stringify(ids)};
  var ORIG = ${JSON.stringify(ORIG)};
  var state = {}; // id -> { edit: {}, removed: bool }
  var editing = {};
  var db = null, filter = 'all';
  var statusEl = document.getElementById('status');
  var EDITABLE = (function () { var d = document.createElement('div'); d.contentEditable = 'plaintext-only'; return d.contentEditable === 'plaintext-only' ? 'plaintext-only' : 'true'; })();
  function fields(id) { return document.querySelectorAll('[data-of="' + id + '"]'); }
  function paint() {
    var nE = 0, nR = 0;
    IDS.forEach(function (id) {
      var d = state[id] || {}, item = document.querySelector('[data-item="' + id + '"]'), edit = d.edit || {}, edited = false;
      [].forEach.call(fields(id), function (el) {
        var key = el.getAttribute('data-f'), orig = ORIG[id + '.' + key];
        var text = edit[key] != null ? edit[key] : orig;
        if (document.activeElement !== el && el.textContent !== text) el.textContent = text;
        el.contentEditable = editing[id] ? EDITABLE : 'false';
        if (editing[id]) { el.setAttribute('role', 'textbox'); el.setAttribute('aria-label', 'Edit ' + key); } else { el.removeAttribute('role'); el.removeAttribute('aria-label'); }
        var isEd = el.textContent.trim() !== orig;
        el.classList.toggle('is-edited', isEd);
        if (isEd) edited = true;
      });
      item.classList.toggle('is-editing', !!editing[id]);
      item.classList.toggle('is-edited', edited);
      item.classList.toggle('is-removed', !!d.removed);
      item.querySelector('[data-act="edit"]').setAttribute('aria-pressed', String(!!editing[id]));
      item.querySelector('[data-act="edit"]').textContent = editing[id] ? 'Done editing' : 'Edit';
      item.querySelector('[data-act="remove"]').setAttribute('aria-pressed', String(!!d.removed));
      item.querySelector('[data-act="remove"]').textContent = d.removed ? 'Removed · undo' : 'Remove';
      item.querySelector('[data-act="undo"]').hidden = !edited;
      if (edited) nE++; if (d.removed) nR++;
    });
    document.getElementById('tally').textContent = IDS.length + ' steps · ' + nE + ' edited · ' + nR + ' removed';
    applyFilter();
  }
  function applyFilter() {
    var q = document.getElementById('q').value.trim().toLowerCase();
    [].forEach.call(document.querySelectorAll('.item'), function (item) {
      var id = item.getAttribute('data-item'), d = state[id] || {};
      var ok = (!q || (item.getAttribute('data-search') || '').indexOf(q) >= 0 || item.textContent.toLowerCase().indexOf(q) >= 0) &&
        (filter === 'all' || (filter === 'edited' && item.classList.contains('is-edited')) || (filter === 'removed' && d.removed));
      item.classList.toggle('hide', !ok);
    });
    [].forEach.call(document.querySelectorAll('.side'), function (s) { s.classList.toggle('hide', !s.querySelector('.item:not(.hide)')); });
  }
  function flash(id) { var s = document.querySelector('[data-saved="' + id + '"]'); if (s) { s.textContent = 'Saved'; clearTimeout(s._t); s._t = setTimeout(function () { s.textContent = ''; }, 1600); } }
  function write(id) {
    var d = state[id] || {};
    if (!db) return;
    db.collection('v2').doc(id).set({ edit: d.edit || {}, removed: !!d.removed, at: new Date().toISOString() })
      .then(function () { flash(id); statusEl.className = 'status'; statusEl.textContent = 'Saved. Tell Claude “apply my v2 changes” when you’re ready.'; })
      .catch(function () { statusEl.className = 'status warn'; statusEl.textContent = 'That didn’t save. Try it again in a moment.'; });
  }
  function collect(id) {
    var edit = {};
    [].forEach.call(fields(id), function (el) {
      var key = el.getAttribute('data-f'), v = el.textContent.replace(/\\s+/g, ' ').trim();
      if (v && v !== ORIG[id + '.' + key]) edit[key] = v;
    });
    return edit;
  }
  function saveEdits(id) {
    var edit = collect(id);
    if (JSON.stringify(edit) === JSON.stringify((state[id] || {}).edit || {})) return;
    state[id] = Object.assign({}, state[id], { edit: edit }); write(id); paint();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.ctl button');
    if (b) {
      var id = b.parentNode.getAttribute('data-id'), act = b.getAttribute('data-act');
      if (act === 'edit') {
        if (editing[id]) saveEdits(id);
        editing[id] = !editing[id]; paint();
        if (editing[id]) { var first = document.querySelector('[data-of="' + id + '"]'); if (first) first.focus(); }
      } else if (act === 'remove') {
        state[id] = Object.assign({}, state[id], { removed: !(state[id] || {}).removed }); paint(); write(id);
      } else if (act === 'undo') {
        state[id] = Object.assign({}, state[id], { edit: {} });
        [].forEach.call(fields(id), function (el) { el.textContent = ORIG[id + '.' + el.getAttribute('data-f')]; });
        paint(); write(id);
      }
      return;
    }
    var f = e.target.closest('[data-filter]');
    if (f) { filter = f.getAttribute('data-filter'); [].forEach.call(document.querySelectorAll('[data-filter]'), function (x) { x.setAttribute('aria-pressed', String(x === f)); }); applyFilter(); }
  });
  document.getElementById('q').addEventListener('input', applyFilter);
  var timers = {};
  document.addEventListener('input', function (e) {
    var el = e.target.closest('[data-of]');
    if (!el) return;
    var id = el.getAttribute('data-of');
    el.classList.toggle('is-edited', el.textContent.trim() !== ORIG[id + '.' + el.getAttribute('data-f')]);
    clearTimeout(timers[id]); timers[id] = setTimeout(function () { saveEdits(id); }, 900);
  });
  document.addEventListener('focusout', function (e) {
    var el = e.target.closest('[data-of]');
    if (!el || !el.isContentEditable) return;
    var id = el.getAttribute('data-of');
    if (!el.textContent.trim()) el.textContent = ORIG[id + '.' + el.getAttribute('data-f')];
    saveEdits(id);
  });
  document.addEventListener('keydown', function (e) { var el = e.target.closest('[data-of]'); if (el && el.isContentEditable && e.key === 'Enter') { e.preventDefault(); el.blur(); } });
  paint();
  if (!window.claude || !window.claude.use) { statusEl.className = 'status warn'; statusEl.textContent = 'Open this page on claude.ai to save your changes.'; return; }
  window.claude.use('db').then(function (d) {
    db = d;
    if (!db) { statusEl.className = 'status warn'; statusEl.textContent = 'Sign in on claude.ai to save your changes. You can still read everything.'; return; }
    statusEl.textContent = 'Your changes save as you make them.';
    db.collection('v2').onSnapshot(function (snap) {
      snap.docs.forEach(function (doc) { var v = doc.data(); if (v) state[doc.id] = { edit: v.edit || {}, removed: !!v.removed }; });
      paint();
    }, function () { statusEl.className = 'status warn'; statusEl.textContent = 'Lost the connection. Reload the page to keep saving.'; });
  });
})();
</script>
`;
require('fs').writeFileSync(out, html);
console.log('steps', ids.length, 'bytes', html.length);
