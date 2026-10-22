// Builds the journal prompts review page: every prompt the journal offers, plus the letters and the safety words.
// Everything on it is already live in the app. Jarred can edit any text in place or remove a prompt, any time.
// His changes live in the artifact's database (collection "journal", one document per item id:
// { edit: { text | to, prompt | title, text, link, note }, removed, at }). Claude applies them to playbook.journal in lib/playbook.js when asked.
// Usage: node scripts/build-journal-prompts-review.js <out.html>
const P = require('../lib/playbook');
const J = P.journal;
const out = process.argv[2];
if (!out) throw new Error('usage: build-journal-prompts-review.js <out.html>');
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const ORIG = {};
const IDS = [];
const field = (id, key, text, lab, big) => { ORIG[id + '.' + key] = text; return `<div class="f">${lab ? `<p class="lab">${esc(lab)}</p>` : ''}<p class="ed${big ? ' big' : ''}" data-of="${id}" data-f="${key}">${esc(text)}</p></div>`; };
function card(id, title, ctx, fieldsHtml, removable = true) {
  IDS.push(id);
  return `<article class="item" data-item="${id}">
  <header><h3>${esc(title)}</h3></header>${ctx ? `<p class="ctx">${esc(ctx)}</p>` : ''}
  ${fieldsHtml}
  <div class="ctl" data-id="${id}"><button type="button" data-act="edit" aria-pressed="false">Edit</button><button type="button" data-act="remove" aria-pressed="false"${removable ? '' : ' hidden'}>Remove</button><button type="button" class="link" data-act="undo" hidden>Undo my edits</button><span class="saved" data-saved="${id}" aria-live="polite"></span></div>
</article>`;
}
const DAY = { full: 'Good day', half: 'Okay day', rough: 'Hard day' };
const playName = (id) => (P.protocols.find((x) => x.id === id) || {}).name || id;
const GROUPS = [
  ['plays', 'By play', 'Shown first when someone is on this play. One per play.',
    Object.keys(J.byPlay).map((id) => card('play.' + id, playName(id), '', field('play.' + id, 'text', J.byPlay[id], '', true)))],
  ['days', 'By kind of day', 'Shown first after the day’s check-in.',
    Object.keys(J.day).flatMap((k) => J.day[k].map((t, i) => card('day.' + k + '.' + i, DAY[k], '', field('day.' + k + '.' + i, 'text', t, '', true))))],
  ['general', 'Any day', 'Shown after the play and day prompts, and when there’s no check-in yet.',
    J.general.map((t, i) => card('general.' + i, 'Prompt ' + (i + 1), '', field('general.' + i, 'text', t, '', true)))],
  ['letters', 'Letters you won’t send', 'Who the letter is to, and the line under it.',
    J.letters.map((l, i) => card('letter.' + i, 'Letter ' + (i + 1), '', field('letter.' + i, 'to', l.to, 'To') + field('letter.' + i, 'prompt', l.prompt, 'The line under it', true)))],
  ['safety', 'When an entry suggests crisis', 'Shown under an entry that mentions self-harm or danger. Coaching, never therapy, never a diagnosis.',
    [card('safety', 'Take care', '', field('safety', 'title', J.safety.title, 'Title') + field('safety', 'text', J.safety.text, 'What it says') + field('safety', 'link', J.safety.link, 'Link to findahelpline.com') + field('safety', 'note', J.safety.note, 'Under the link'), false)]]
];
const groups = GROUPS.map(([g, name, sub, cards]) => `<section class="side" id="g-${g}"><div class="side-h"><h2>${esc(name)}</h2><p class="k">${cards.length === 1 ? '1 card' : cards.length + ' prompts'}</p></div><p class="lead" style="margin:-.5rem 0 1rem;font-size:.9375rem">${esc(sub)}</p><div class="grid">${cards.join('')}</div></section>`).join('');

const html = `<title>Journal Prompts</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;1,400&display=swap">
<style>
/* Every journal prompt, live in the app. Each card has just Edit and Remove. */
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
.ctx{font-size:.875rem;color:var(--dim)}
.f p.ed.big{font-family:var(--serif);font-size:1.0625rem;line-height:1.5}
.ctl button[data-act="remove"][hidden]{display:none}
</style>

<div class="wrap"><div class="hero">
  <p class="k">The Other Half · Journal · live in the app</p>
  <h1>Something to start with, <i>never a test.</i></h1>
  <p class="lead">Today’s prompt is picked for each person: the play they’re on first, then the kind of day they checked in with, then the general set. “Another one” moves down the list. It follows your voice and it’s already live. Change anything that doesn’t sound like you, or remove it.</p>
  <p class="how"><span><b>Edit</b> tap the text and rewrite it in place</span><span><b>Remove</b> take this prompt out</span><span>Your changes save here. Tell Claude “apply my journal prompt changes” to put them in the app.</span></p>
  <nav class="toc" aria-label="Jump to">${GROUPS.map(([g, n]) => `<a href="#g-${g}">${esc(n)}</a>`).join('')}</nav>
</div></div>

<div class="bar"><div class="wrap">
  <input type="search" id="q" placeholder="Search prompts" aria-label="Search">
  <div class="filters" role="group" aria-label="Show"><button type="button" data-filter="all" aria-pressed="true">All</button><button type="button" data-filter="edited" aria-pressed="false">Edited</button><button type="button" data-filter="removed" aria-pressed="false">Removed</button></div>
  <p class="tally" id="tally"></p>
  <p class="status" id="status" role="status">Connecting, so your changes save…</p>
</div></div>

<main class="wrap">${groups}</main>
<footer><div class="wrap">The Jarred Effect · Journal prompts · ${IDS.length} cards · live since 2026-10-21</div></footer>

<script>
(function () {
  var IDS = ${JSON.stringify(IDS)};
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
    document.getElementById('tally').textContent = IDS.length + ' prompts · ' + nE + ' edited · ' + nR + ' removed';
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
    db.collection('journal').doc(id).set({ edit: d.edit || {}, removed: !!d.removed, at: new Date().toISOString() })
      .then(function () { flash(id); statusEl.className = 'status'; statusEl.textContent = 'Saved. Tell Claude “apply my journal prompt changes” when you’re ready.'; })
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
    db.collection('journal').onSnapshot(function (snap) {
      snap.docs.forEach(function (doc) { var v = doc.data(); if (v) state[doc.id] = { edit: v.edit || {}, removed: !!v.removed }; });
      paint();
    }, function () { statusEl.className = 'status warn'; statusEl.textContent = 'Lost the connection. Reload the page to keep saving.'; });
  });
})();
</script>
`;
require('fs').writeFileSync(out, html);
console.log('cards', IDS.length, 'bytes', html.length);
