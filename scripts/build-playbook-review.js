// Builds the playbook review page (an HTML file to publish as the claude.ai artifact) from lib/playbook.js.
// Run: node scripts/build-playbook-review.js lib/playbook.js <output.html>
// Jarred's decisions live in the artifact's database (collection "decisions", one document per item id).
const P = require(require('path').resolve(process.argv[2]));
const out = process.argv[3];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sideOrder = ['discipline', 'desire', 'faith', 'friction', 'ambition', 'acceptance', 'control', 'trust'];
const sideName = (s) => s[0].toUpperCase() + s.slice(1);
const pairOf = { desire: 'Desire ↔ Discipline', discipline: 'Desire ↔ Discipline', faith: 'Faith ↔ Friction', friction: 'Faith ↔ Friction', ambition: 'Ambition ↔ Acceptance', acceptance: 'Ambition ↔ Acceptance', control: 'Control ↔ Trust', trust: 'Control ↔ Trust' };
const whoNeeds = { discipline: 'People who run on wanting (often Dreamers)', desire: 'People who run on effort (often Achievers)', faith: 'People who get stuck in what’s wrong', friction: 'People who push fear aside fast (often Dreamers)', ambition: 'People at peace who risk settling', acceptance: 'People always reaching for next', control: 'People who hand everything off', trust: 'People who carry it all themselves (often Achievers)' };

// Change makes the card's own text editable in place: Jarred types over the exact words, nothing else appears.
// Every editable piece carries data-f (its field) and its original text lives in ORIG.
const ORIG = {};
const ed = (id, key, value, tag = 'span', cls = '') => { ORIG[id + '.' + key] = String(value); return `<${tag} class="ed ${cls}" data-f="${key}" data-of="${id}">${esc(value)}</${tag}>`; };
const decide = (id) => `<p class="hint" data-hint="${id}" hidden>Tap any text above to rewrite it. It saves when you tap away.</p>
<div class="dec" data-id="${id}" role="group" aria-label="Your decision">
  <button type="button" data-c="approve">Approve</button><button type="button" data-c="change">Change</button><button type="button" data-c="hold">Hold</button>
</div>
<div class="more" data-more="${id}" hidden>
  <button type="button" class="link" data-addnote="${id}">Add a note</button><button type="button" class="link" data-reset="${id}" hidden>Undo my edits</button><span class="saved" data-saved="${id}" aria-live="polite"></span>
  <textarea id="n-${id}" data-note="${id}" rows="2" placeholder="A note for me, if the wording isn’t the whole story." hidden></textarea>
</div>`;

const listItem = (id, kicker, title, lines) => `<article class="item" data-item="${id}">
  <header><p class="k">${esc(kicker)}</p><h3>${esc(title)}</h3></header>
  <ol class="lines">${lines.map((l, i) => ed(id, 'line' + (i + 1), l, 'li')).join('')}</ol>
  ${decide(id)}
</article>`;

const rep = (r) => `<article class="item rep" data-item="${r.id}">
  <header>${ed(r.id, 'title', r.title, 'h3')}<span class="min">${ed(r.id, 'minutes', r.minutes)} min</span></header>
  ${ed(r.id, 'what', r.what, 'p', 'what')}
  <p class="eg"><span class="lab">For example</span>${ed(r.id, 'example', r.example)}</p>
  <p class="rough"><span class="lab">Rough day?</span>${ed(r.id, 'rough', r.rough)}</p>
  ${decide(r.id)}
</article>`;

const groups = sideOrder.map((s) => `<section class="side" id="side-${s}">
  <div class="side-h"><p class="k">${esc(pairOf[s])}</p><h2>${sideName(s)}</h2><p class="side-d">${esc(P.sides[s])}</p><p class="side-who">Built for: ${esc(whoNeeds[s])}</p></div>
  <div class="grid">${P.reps.filter((r) => r.side === s).map(rep).join('')}</div>
</section>`).join('');

const sq = P.shadowQuestions.map((q) => { const id = 'sq-' + q.id; return `<article class="item" data-item="${id}">
  <header><p class="k">${esc(q.name)}</p>${ed(id, 'ask', q.ask, 'h3', 'q')}</header>
  <div class="eg"><span class="lab">If they want to go deeper</span>${ed(id, 'followUp1', q.followUps[0], 'p')}${ed(id, 'followUp2', q.followUps[1], 'p')}</div>
  ${decide(id)}
</article>`; }).join('') + `<article class="item" data-item="going-deep"><header><p class="k">Shown with every shadow question</p><h3>Going deep</h3></header>${ed('going-deep', 'text', P.goingDeep, 'p', 'what')}${decide('going-deep')}</article>`;

const proto = (pr) => { const id = 'pr-' + pr.id; return `<article class="item proto" data-item="${id}">
  <header><p class="k">Protocol</p><h3>${esc(pr.name)}</h3></header>
  <p class="eg"><span class="lab">Use it</span>${ed(id, 'when', pr.when)}</p>
  <ol class="lines">${pr.steps.map((l, i) => ed(id, 'step' + (i + 1), l, 'li')).join('')}</ol>
  ${pr.safety ? `<p class="safety"><span class="lab">Safety</span>${ed(id, 'safety', pr.safety)}</p>` : ''}
  ${decide(id)}
</article>`; };
const protocols = P.protocols.map(proto).join('');
const habits = `<section class="side" id="side-habits">
  <div class="side-h"><p class="k">Habits and flow</p><h2>Habit steps</h2><p class="side-d">The tools the two protocols use, and that any plan can lean on when energy, time or ideas run low.</p></div>
  <div class="grid">${P.reps.filter((r) => r.side === 'habits').map(rep).join('')}</div>
</section>`;
const field = `<section class="side" id="side-field">
  <div class="side-h"><p class="k">Your field</p><h2>Field steps</h2><p class="side-d">Clearing what you let into your life, the healthy way: one thing at a time, boundaries before goodbyes, and something good in the space you make.</p></div>
  <div class="grid">${P.reps.filter((r) => r.side === 'field').map(rep).join('')}</div>
</section>`;
const group = (side, id, kicker, title, desc) => `<section class="side" id="${id}">
  <div class="side-h"><p class="k">${esc(kicker)}</p><h2>${esc(title)}</h2><p class="side-d">${esc(desc)}</p></div>
  <div class="grid">${P.reps.filter((r) => r.side === side).map(rep).join('')}</div>
</section>`;
const loose = group('loose', 'side-loose', 'Let loose', 'Living lightly', 'Laugh in the hard moments instead of leaning into anger and pressure. Hold your Ask with a light grip, and enjoy the life you’re building.');
const people = group('people', 'side-people', 'Connection, quiet and new doors', 'People and doors', 'Reaching out when you feel alone, finding quiet when it’s too much, and opening doors to new people and opportunities of every kind.');
const agency = group('agency', 'side-agency', 'Your yes and your no', 'Agency', 'Pausing before a yes you’ll regret, filling your own cup first, and staying yourself around people who take advantage.');
const worth = group('worth', 'side-worth', 'Held, not hyped', 'Voice and worth', 'Saying no, speaking up, and building worth on proof and kept promises instead of pep talks.');
const thoughts = group('thoughts', 'side-thoughts', 'Unlearning what you tell yourself', 'Error thoughts', 'Catch the harsh thought, name it “error thought”, flip it to words you can believe, and back it up with one small action.');
const circle = group('circle', 'side-circle', 'The family you’re building', 'Your five', 'The people closest to you shape your habits, moods and chances. Rebalance toward the ones who amplify you, and be the friend you want to have.');
const agreements = group('agreements', 'side-agreements', 'How you carry yourself', 'Four ways to stay clear', 'Mean what you say, their world not your worth, ask don’t guess, and your best for the day you have, as small daily steps.');
const foundations = group('foundations', 'side-foundations', 'Foundations and big seasons', 'Foundations', 'Coming back after a gap, body basics, getting through big life changes, and checking that your Ask is truly yours.');
const TYPES = { dreamer: 'Dreamer', achiever: 'Achiever', excavator: 'Excavator', pendulum: 'Pendulum', calibrated: 'Calibrated' };
const pname = (pid) => (P.protocols.find((x) => x.id === pid) || {}).name || pid;
const layerItem = (pr) => { const L = P.layers[pr.id]; if (!L) return ''; const id = 'ly-' + pr.id; return `<article class="item layer" data-item="${id}">
  <header><p class="k">Layers</p><h3>${esc(pr.name)}</h3></header>
  <div class="lyr"><span class="lab">Bring it up when</span><ul class="lines">${L.signals.map((x, i) => ed(id, 'signal' + (i + 1), x, 'li')).join('')}</ul></div>
  <div class="lyr"><span class="lab">Start here</span>${ed(id, 'start', L.start, 'p')}</div>
  <div class="lyr"><span class="lab">Go deeper</span>${ed(id, 'deeper', L.deeper, 'p')}</div>
  <div class="lyr"><span class="lab">Signs it’s working</span><ul class="lines">${L.working.map((x, i) => ed(id, 'working' + (i + 1), x, 'li')).join('')}</ul></div>
  <div class="lyr"><span class="lab">When it’s done</span>${ed(id, 'done', L.done, 'p')}</div>
  ${Object.keys(L.byType || {}).length ? `<div class="lyr"><span class="lab">By type</span><ul class="lines">${Object.keys(L.byType).map((t) => `<li><b>${TYPES[t]}:</b> ${ed(id, 'type-' + t, L.byType[t], 'span', 'inl')}</li>`).join('')}</ul></div>` : ''}
  ${L.next && L.next.length ? `<p class="lyr-next"><span class="lab">Leads to</span>${L.next.map((n) => esc(pname(n))).join(' · ')}</p>` : ''}
  ${decide(id)}
</article>`; };
const layers = `<section class="side" id="layers">
  <div class="sec-h"><p class="k">Drill-down layers</p><h2>Layers</h2><p>For each protocol: when to bring it up, where to start, how to go deeper, how to tell it’s working, when it’s done, how it shifts by type, and what comes next. The plan generator uses these to choose and pace protocols.</p></div>
  <div class="grid">${P.protocols.map(layerItem).join('')}</div>
</section>`;
const areaItem = (a) => { const id = 'area-' + a.id; return `<article class="item" data-item="${id}">
  <header><p class="k">Life area</p><h3>${esc(a.name)}</h3></header>
  <p class="eg"><span class="lab">An Ask</span>${ed(id, 'ask', a.ask)}</p>
  <p class="eg"><span class="lab">A tiny step</span>${ed(id, 'step', a.step)}</p>
  <p class="eg"><span class="lab">A boundary</span>${ed(id, 'boundary', a.boundary)}</p>
  <p class="eg"><span class="lab">An error thought, flipped</span>${ed(id, 'flip', a.flip)}</p>
  <p class="eg"><span class="lab">A Try</span>${ed(id, 'tryIt', a.tryIt)}</p>
  ${decide(id)}
</article>`; };
const areas = `<section class="side" id="areas">
  <div class="sec-h"><p class="k">Tailoring</p><h2>Life areas</h2><p>Examples for each area of life, so a plan about money doesn’t show a running example.</p></div>
  <div class="grid">${P.areas.map(areaItem).join('')}</div>
</section>`;
const pathItem = (w) => { const id = 'path-' + w.id; return `<article class="item" data-item="${id}">
  <header><p class="k">Pathway</p><h3>${esc(w.name)}</h3></header>
  <p class="eg"><span class="lab">For</span>${ed(id, 'for', w.for)}</p>
  <ol class="path">${w.path.map((n) => `<li>${esc(pname(n))}</li>`).join('')}</ol>
  ${decide(id)}
</article>`; };
const pathways = `<section class="side" id="pathways">
  <div class="sec-h"><p class="k">Arcs over several weeks</p><h2>Pathways</h2><p>Protocols that lead into each other, so a plan can carry someone through real change, one protocol at a time.</p></div>
  <div class="grid">${P.pathways.map(pathItem).join('')}</div>
</section>`;
const tools = group('tools', 'side-tools', 'From the guide, and for each stage', 'Tools', 'Your guide’s own exercises, and the steps the Price, Receive, Hold, Tries, gut call and word check protocols use.');

const ids = ['shape', 'voice', 'hard', 'flow', 'loose', 'mirror'].concat(P.protocols.map((x) => 'pr-' + x.id), P.protocols.filter((x) => P.layers[x.id]).map((x) => 'ly-' + x.id), P.areas.map((a) => 'area-' + a.id), P.pathways.map((w) => 'path-' + w.id), P.reps.map((r) => r.id), P.shadowQuestions.map((q) => 'sq-' + q.id), ['going-deep']);

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
.eg .lab,.rough .lab{display:block;font-size:.6875rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-bottom:.125rem}
.rough .lab{color:var(--rust)}
.lyr{display:grid;gap:.25rem}
.lyr .lab,.lyr-next .lab{font-size:.6875rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}
.lyr p{margin:0;font-size:.9375rem}
.lyr .lines{font-size:.9375rem}
.lyr-next{font-size:.875rem;color:var(--dim);display:grid;gap:.25rem}
.path{margin:0;padding-left:1.25rem;display:grid;gap:.3rem;font-size:.9375rem;font-weight:600}
.safety{font-size:.9375rem;color:var(--dim);padding:.75rem .9rem;border-radius:.75rem;background:var(--chip)}
.safety .lab{display:block;font-size:.6875rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--rust);margin-bottom:.125rem}
.lines{margin:0;padding-left:1.25rem;display:grid;gap:.4rem;color:var(--fg);font-size:.9375rem}
.wide{max-width:46rem}
.dec{display:grid;grid-template-columns:repeat(3,1fr);gap:.375rem;margin-top:auto;padding-top:.5rem}
.dec button{font:inherit;font-size:.875rem;font-weight:600;min-height:2.5rem;border-radius:.75rem;border:1px solid var(--line);background:transparent;color:var(--dim);cursor:pointer;transition:background .2s ease,color .2s ease,border-color .2s ease}
.dec button:hover{border-color:var(--faint);color:var(--fg)}
.dec button:focus-visible,.filters button:focus-visible,.link:focus-visible,textarea:focus-visible{outline:2px solid var(--rust);outline-offset:2px}
.item[data-choice="approve"]{border-color:var(--ok)}
.item[data-choice="change"]{border-color:var(--orange)}
.item[data-choice="hold"]{border-style:dashed;border-color:var(--hold)}
.dec button[aria-pressed="true"][data-c="approve"]{background:var(--ok);border-color:var(--ok);color:var(--card)}
.dec button[aria-pressed="true"][data-c="change"]{background:var(--orange);border-color:var(--orange);color:#241904}
.dec button[aria-pressed="true"][data-c="hold"]{background:var(--hold);border-color:var(--hold);color:var(--card)}
.hint{font-size:.8125rem;color:var(--rust)}
.ed{border-radius:.375rem;transition:background .2s ease,box-shadow .2s ease}
.item[data-choice="change"] .ed{cursor:text;background:var(--chip);box-shadow:0 0 0 .25rem var(--chip);outline:none}
.item[data-choice="change"] .ed:hover{box-shadow:0 0 0 .25rem var(--chip),0 0 0 calc(.25rem + 1px) var(--faint)}
.item[data-choice="change"] .ed:focus{background:var(--card);box-shadow:0 0 0 .25rem var(--card),0 0 0 calc(.25rem + 1.5px) var(--orange)}
.ed.is-edited,.item[data-choice="change"] .ed.is-edited{background:rgba(232,116,58,.16);box-shadow:0 0 0 .25rem rgba(232,116,58,.16)}
.lines .ed{display:list-item}
.lines .ed.inl{display:inline}
.eg p{margin:0}.eg p+p{margin-top:.25rem}
.more{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem}
.more textarea{width:100%;font:inherit;font-size:.9375rem;padding:.55rem .7rem;border-radius:.65rem;border:1px solid var(--line);background:var(--bg);color:var(--fg);resize:vertical}
.link{font:inherit;font-size:.8125rem;padding:0;border:0;background:none;color:var(--dim);text-decoration:underline;text-underline-offset:.2em;cursor:pointer}
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
  <p class="lead">Every 7-day plan is built only from what’s on this page, and it moves with real life: no fixed times, a full, half or rough version every day, and no catch-up debt. The AI tailors the examples to each person’s Ask; it never invents its own method. Approve what sounds like you, mark what needs changing with a note in your own words, and hold anything you’re unsure about.</p>
  <p class="how"><span><b>Approve</b> it ships as written</span><span><b>Change</b> tap the text and rewrite it in place</span><span><b>Hold</b> leave it out of version 1 for now</span></p>
  <nav class="toc" aria-label="Jump to">${['How a plan is built','Voice','Hard rules','Ebb and flow','Let loose','Their own words','Protocols','Layers','Pathways','Life areas'].map((t,i)=>`<a href="#${['shape','voice','hard','flow','loose','mirror','protocols','layers','pathways','areas'][i]}">${t}</a>`).join('')}${sideOrder.map((s) => `<a href="#side-${s}">${sideName(s)}</a>`).join('')}<a href="#side-habits">Habits</a><a href="#side-field">Your field</a><a href="#side-loose">Living lightly</a><a href="#side-people">People and doors</a><a href="#side-agency">Agency</a><a href="#side-worth">Voice and worth</a><a href="#side-thoughts">Error thoughts</a><a href="#side-circle">Your five</a><a href="#side-agreements">Stay clear</a><a href="#side-foundations">Foundations</a><a href="#side-tools">Tools</a><a href="#shadow">Shadow questions</a></nav>
</div></div>

<div class="bar"><div class="wrap">
  <div class="meter" aria-hidden="true"><i class="a"></i><i class="c"></i><i class="h"></i></div>
  <p class="tally" id="tally"><b>0</b> of ${ids.length} decided</p>
  <div class="filters" role="group" aria-label="Show"><button type="button" data-filterbtn="all" aria-pressed="true">All</button><button type="button" data-filterbtn="open" aria-pressed="false">Undecided</button><button type="button" data-filterbtn="change" aria-pressed="false">To change</button></div>
  <p class="status" id="status" role="status">Connecting, so your choices save…</p>
</div></div>

<main class="wrap">
  <section id="rules">
    <div class="sec-h"><p class="k">The rules every plan follows</p><h2>How a plan is built</h2><p>Three sets of rules sit above every step: the shape of a week, how it sounds, and the lines it never crosses.</p></div>
    <div class="grid" style="grid-template-columns:1fr">
      <div class="wide" id="shape">${listItem('shape', 'The shape of a week', 'How a 7-day plan is put together', P.planShape)}</div>
      <div class="wide" id="voice">${listItem('voice', 'Your voice', 'How every plan sounds', P.voice)}</div>
      <div class="wide" id="hard">${listItem('hard', 'Never', 'The hard rules', P.hardRules)}</div>
      <div class="wide" id="flow">${listItem('flow', 'Ebb and flow', 'How plans move with real life', P.flow)}</div>
      <div class="wide" id="loose">${listItem('loose', 'Let loose, be precise', 'Living lightly', P.loose)}</div>
      <div class="wide" id="mirror">${listItem('mirror', 'Their own words', 'Mirror their word for the big stuff', P.mirror)}</div>
    </div>
  </section>
  <section class="side" id="protocols">
    <div class="sec-h"><p class="k">For each kind of Ask, and each stage</p><h2>Protocols</h2><p>Step-by-step programs a plan follows: building or breaking a habit, clearing your field, and each stage of an Ask (the Price when it gets hard, Receiving it, Holding the new level), plus Tries, gut calls, the word check, feeling alone, feeling it’s too much, opening doors to new people and opportunities, reading flow and resistance, the pause before yes, your own agency, saying no, speaking up, your worth held, catching error thoughts, your five: the family you’re building, four ways to stay clear, the comeback, body basics, big life changes, and what you actually value.</p></div>
    <div class="grid" style="grid-template-columns:1fr">${protocols.split('</article>').filter(Boolean).map((a) => '<div class="wide">' + a + '</article></div>').join('')}</div>
  </section>
  ${layers}
  ${pathways}
  ${areas}
  ${groups}
  ${habits}
  ${field}
  ${loose}
  ${people}
  ${agency}
  ${worth}
  ${thoughts}
  ${circle}
  ${agreements}
  ${foundations}
  ${tools}
  <section class="side" id="shadow">
    <div class="sec-h"><p class="k">From the guide</p><h2>Shadow questions</h2><p>Day 4 of every plan is one of these, chosen by type, with gentle follow-ups for anyone who wants to go further.</p></div>
    <div class="grid">${sq}</div>
  </section>
</main>
<footer><div class="wrap">The Jarred Effect · Playbook version ${P.version} · ${P.reps.length} steps, ${P.shadowQuestions.length} shadow questions</div></footer>

<script>
(function () {
  var IDS = ${JSON.stringify(ids)};
  var ORIG = ${JSON.stringify(ORIG)};
  var state = {}; // id -> {choice, note, edit}
  var db = null;
  var statusEl = document.getElementById('status');
  var EDITABLE = (function () { var d = document.createElement('div'); d.contentEditable = 'plaintext-only'; return d.contentEditable === 'plaintext-only' ? 'plaintext-only' : 'true'; })();
  function paint() {
    var n = { approve: 0, change: 0, hold: 0 };
    IDS.forEach(function (id) {
      var d = state[id] || {}, item = document.querySelector('[data-item="' + id + '"]');
      if (!item) return;
      var changing = d.choice === 'change', edit = d.edit || {}, edited = false;
      if (d.choice) { item.setAttribute('data-choice', d.choice); n[d.choice]++; } else item.removeAttribute('data-choice');
      [].forEach.call(item.querySelectorAll('.dec button'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-c') === d.choice)); });
      [].forEach.call(item.querySelectorAll('[data-of="' + id + '"]'), function (el) {
        var key = el.getAttribute('data-f'), orig = ORIG[id + '.' + key];
        var text = changing && edit[key] != null ? edit[key] : orig;
        if (document.activeElement !== el && el.textContent !== text) el.textContent = text;
        el.contentEditable = changing ? EDITABLE : 'false';
        if (changing) { el.setAttribute('role', 'textbox'); el.setAttribute('aria-label', 'Edit ' + key); } else { el.removeAttribute('role'); el.removeAttribute('aria-label'); }
        var isEd = changing && el.textContent.trim() !== orig;
        el.classList.toggle('is-edited', isEd);
        if (isEd) edited = true;
      });
      item.querySelector('[data-hint]').hidden = !changing;
      item.querySelector('[data-more]').hidden = !changing;
      item.querySelector('[data-reset]').hidden = !edited;
      var ta = item.querySelector('[data-note]');
      if (d.note && ta.hidden) { ta.hidden = false; item.querySelector('[data-addnote]').hidden = true; }
      if (document.activeElement !== ta && d.note != null) ta.value = d.note;
    });
    var done = n.approve + n.change + n.hold, t = IDS.length;
    document.getElementById('tally').innerHTML = '<b>' + done + '</b> of ' + t + ' decided · ' + n.approve + ' approved · ' + n.change + ' to change · ' + n.hold + ' held';
    var m = document.querySelector('.meter');
    m.querySelector('.a').style.width = (n.approve / t * 100) + '%';
    m.querySelector('.c').style.width = (n.change / t * 100) + '%';
    m.querySelector('.h').style.width = (n.hold / t * 100) + '%';
  }
  function flash(id) { var s = document.querySelector('[data-saved="' + id + '"]'); if (s) { s.textContent = 'Saved'; clearTimeout(s._t); s._t = setTimeout(function () { s.textContent = ''; }, 1600); } }
  function write(id) {
    var d = state[id] || {};
    if (!db) return;
    db.collection('decisions').doc(id).set({ choice: d.choice || null, note: d.note || '', edit: d.edit || {}, at: new Date().toISOString() })
      .then(function () { flash(id); statusEl.className = 'status'; statusEl.textContent = 'Saved. Claude can read your choices.'; })
      .catch(function () { statusEl.className = 'status warn'; statusEl.textContent = 'That didn’t save. Try it again in a moment.'; });
  }
  // keep only the words he actually changed
  function collect(id) {
    var edit = {};
    [].forEach.call(document.querySelectorAll('[data-of="' + id + '"]'), function (el) {
      var key = el.getAttribute('data-f'), v = el.textContent.replace(/\\s+/g, ' ').trim();
      if (v && v !== ORIG[id + '.' + key]) edit[key] = v;
    });
    return edit;
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.dec button');
    if (b) {
      var id = b.parentNode.getAttribute('data-id'), c = b.getAttribute('data-c');
      var d = state[id] = Object.assign({}, state[id]);
      d.choice = d.choice === c ? null : c;
      paint(); write(id);
      if (d.choice === 'change') { var first = document.querySelector('[data-of="' + id + '"]'); if (first) first.focus(); }
      return;
    }
    var an = e.target.closest('[data-addnote]');
    if (an) { var nid = an.getAttribute('data-addnote'), ta = document.getElementById('n-' + nid); an.hidden = true; ta.hidden = false; ta.focus(); return; }
    var rs = e.target.closest('[data-reset]');
    if (rs) { var rid = rs.getAttribute('data-reset'); state[rid] = Object.assign({}, state[rid], { edit: {} }); [].forEach.call(document.querySelectorAll('[data-of="' + rid + '"]'), function (el) { el.textContent = ORIG[rid + '.' + el.getAttribute('data-f')]; }); paint(); write(rid); return; }
    var fl = e.target.closest('[data-filterbtn]');
    if (fl) {
      document.body.classList.remove('f-open', 'f-change');
      if (fl.getAttribute('data-filterbtn') !== 'all') document.body.classList.add('f-' + fl.getAttribute('data-filterbtn'));
      [].forEach.call(document.querySelectorAll('[data-filterbtn]'), function (x) { x.setAttribute('aria-pressed', String(x === fl)); });
    }
  });
  // edits save when he taps away; a note saves the same way
  document.addEventListener('focusout', function (e) {
    var el = e.target.closest('[data-of]');
    if (el && el.isContentEditable) {
      var id = el.getAttribute('data-of'), edit = collect(id), prev = JSON.stringify((state[id] || {}).edit || {});
      if (!el.textContent.trim()) el.textContent = ORIG[id + '.' + el.getAttribute('data-f')];
      if (JSON.stringify(edit) !== prev) { state[id] = Object.assign({}, state[id], { edit: edit }); paint(); write(id); }
      return;
    }
    var ta = e.target.closest('[data-note]');
    if (ta) { var nid = ta.getAttribute('data-note'), v = ta.value.trim(); if (v !== ((state[nid] || {}).note || '')) { state[nid] = Object.assign({}, state[nid], { note: v }); write(nid); } }
  });
  // also save a moment after he stops typing, so closing the page mid-edit loses nothing
  var timers = {};
  function saveEdits(id) {
    var edit = collect(id);
    if (JSON.stringify(edit) === JSON.stringify((state[id] || {}).edit || {})) return;
    state[id] = Object.assign({}, state[id], { edit: edit }); write(id);
    var reset = document.querySelector('[data-reset="' + id + '"]'); if (reset) reset.hidden = !Object.keys(edit).length;
  }
  document.addEventListener('input', function (e) {
    var el = e.target.closest('[data-of]');
    if (el) {
      var id = el.getAttribute('data-of');
      el.classList.toggle('is-edited', el.textContent.trim() !== ORIG[id + '.' + el.getAttribute('data-f')]);
      clearTimeout(timers[id]); timers[id] = setTimeout(function () { saveEdits(id); }, 900);
      return;
    }
    var ta = e.target.closest('[data-note]');
    if (ta) { var nid = ta.getAttribute('data-note'); clearTimeout(timers['n' + nid]); timers['n' + nid] = setTimeout(function () { state[nid] = Object.assign({}, state[nid], { note: ta.value.trim() }); write(nid); }, 900); }
  });
  // Enter finishes an edit instead of adding a line
  document.addEventListener('keydown', function (e) { var el = e.target.closest('[data-of]'); if (el && el.isContentEditable && e.key === 'Enter') { e.preventDefault(); el.blur(); } });
  paint();
  if (!window.claude || !window.claude.use) { statusEl.className = 'status warn'; statusEl.textContent = 'Open this page on claude.ai to save your choices.'; return; }
  window.claude.use('db').then(function (d) {
    db = d;
    if (!db) { statusEl.className = 'status warn'; statusEl.textContent = 'Sign in on claude.ai to save your choices. You can still read everything.'; return; }
    statusEl.textContent = 'Your choices save as you make them.';
    db.collection('decisions').onSnapshot(function (snap) {
      snap.docs.forEach(function (doc) { var v = doc.data(); if (v) state[doc.id] = { choice: v.choice || null, note: v.note || '', edit: v.edit || {} }; });
      paint();
    }, function () { statusEl.className = 'status warn'; statusEl.textContent = 'Lost the connection. Reload the page to keep saving.'; });
  });
})();
</script>
`;
require('fs').writeFileSync(out, html);
console.log('items', ids.length, 'bytes', html.length);
