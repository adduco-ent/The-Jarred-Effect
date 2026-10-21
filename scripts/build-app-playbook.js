// Builds app/playbook.json: the full playbook library the app shows (Playbook tab), from lib/playbook.js.
// The coaching layers are written about the person ("They keep restarting"); here they're turned to speak to
// the person ("You keep restarting"), so the library reads in second person like the rest of the app.
// Note: this file is public once deployed. Before the full app charges, serve it from an API behind sign-in.
// Usage: node scripts/build-app-playbook.js
const fs = require('fs');
const path = require('path');
const P = require('../lib/playbook');

function you(s) {
  return String(s)
    .replace(/\bthey’re\b/g, 'you’re').replace(/\bThey’re\b/g, 'You’re')
    .replace(/\bthey’ve\b/g, 'you’ve').replace(/\bThey’ve\b/g, 'You’ve')
    .replace(/\bthemselves\b/g, 'yourself')
    .replace(/\bthey\b/g, 'you').replace(/\bThey\b/g, 'You')
    .replace(/\btheir\b/g, 'your').replace(/\bTheir\b/g, 'Your')
    .replace(/\btheirs\b/g, 'yours')
    .replace(/\bthem\b/g, 'you')
    // verbs that change with "you": "you is" never appears, but "you has/does/was" might
    .replace(/\byou has\b/g, 'you have').replace(/\bYou has\b/g, 'You have')
    .replace(/\byou does\b/g, 'you do').replace(/\bYou does\b/g, 'You do')
    .replace(/\byou was\b/g, 'you were').replace(/\bYou was\b/g, 'You were');
}
// a few lines where "them" or "they" means the thing, not the person
const FIX = [
  ['quietly dropping you', 'quietly dropping them'],
  ['Tests still come; you just don’t knock you back', 'Tests still come; they just don’t knock you back']
];
const you2 = (s) => FIX.reduce((t, f) => t.split(f[0]).join(f[1]), you(s));
const list = (a) => (a || []).map(you2);

const protocols = P.protocols.map((x) => {
  const l = P.layers[x.id] || {};
  return {
    id: x.id, name: x.name, when: you2(x.when), steps: x.steps, safety: x.safety || null, lens: x.lens || null,
    signals: list(l.signals), start: you2(l.start || ''), deeper: you2(l.deeper || ''), working: list(l.working), done: you2(l.done || ''),
    next: l.next || []
  };
});
const pathways = P.pathways.map((w) => ({ id: w.id, name: w.name, for: w.for, path: w.path }));
const out = { version: P.version, protocols, pathways };
fs.writeFileSync(path.join(__dirname, '..', 'app', 'playbook.json'), JSON.stringify(out));
console.log('app/playbook.json:', protocols.length, 'protocols,', pathways.length, 'paths');
