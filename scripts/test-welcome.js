// Checks every line the welcome screen can show against its character limit (lib/playbook.js encouragement.welcome.limits),
// so dynamic copy never breaks the screen's balance. Fills use the worst case: the longest number words and step counts,
// and a ten-letter name on the question. Run: node scripts/test-welcome.js
const W = require('../lib/playbook').encouragement.welcome;
const L = W.limits;
const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));
const worst = { n: 'seven', x: 12, y: 14 };
const NAME = ', Alexandra';
const checks = [];
const add = (spot, text, limit) => checks.push({ spot, text, len: text.length, limit });

W.days.concat(W.later).forEach((t) => add('line', t, L.line));
Object.entries(W.patterns).forEach(([k, t]) => add('line (' + k + ')', fill(t, worst), L.line));
const asks = [W.ask, W.askAfterHard].concat(W.askAgain.map((t) => t.replace('{n}', 'Seven')), W.askBack);
asks.forEach((t) => add('question', t, L.ask));
// with a name: the app drops a name that would wrap the question to three lines, so this is information, not a failure
const dropsName = asks.filter((t) => t.replace(/\?$/, NAME + '?').length > L.ask);
Object.values(W.today).concat(Object.values(W.replies)).forEach((t) => add('reply', t, L.reply));
W.quotes.forEach((q) => { add('quote', q.q, L.quote); add('author', q.by, L.by); });
['Morning.', 'Hey there.', 'Evening.', 'Hey, night owl.'].forEach((t) => add('greeting', t, L.hello));
// the day's sign-off on Today, with the longest time-of-day phrase and run of days
const SO = require('../lib/playbook').encouragement.signoff;
Object.values(SO.titles).forEach((t) => add('sign-off title', t, SO.limits.title));
Object.entries(SO.lines).forEach(([k, t]) => add('sign-off (' + k + ')', fill(t, { rest: 'the rest of your day', n: 'seven' }), SO.limits.line));

const over = checks.filter((c) => c.len > c.limit);
const tightest = checks.slice().sort((a, b) => b.len / b.limit - a.len / a.limit).slice(0, 3);
console.log(checks.length + ' welcome lines checked against limits ' + JSON.stringify(L));
console.log('Closest to the limit: ' + tightest.map((c) => c.spot + ' ' + c.len + '/' + c.limit).join(', '));
if (over.length) {
  console.log('\n' + over.length + ' line(s) too long:');
  over.forEach((c) => console.log('  - ' + c.spot + ' (' + c.len + '/' + c.limit + '): ' + c.text));
  process.exit(1);
}
console.log('All fit.' + (dropsName.length ? ' With a ten-letter name, ' + dropsName.length + ' of ' + asks.length + ' questions show without the name, so they stay on two lines.' : ''));
