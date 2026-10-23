// Checks the plan writer's knowledge (lib/knowledge.js): every move points at a real play with the right side, stays
// within 20 minutes, has a small version, and keeps to the voice rules' words. Run: node scripts/test-knowledge.js
const k = require('../lib/knowledge');

const problems = k.check();
let moves = 0;
const sides = {};
Object.entries(k.guides).forEach(([area, g]) => {
  Object.values(g.paths).forEach((p) => p.stages.forEach((st) => (st.moves || []).filter(Boolean).forEach((m) => {
    moves++;
    sides[area] = sides[area] || new Set();
    sides[area].add(m.side);
  })));
});
console.log('Knowledge v' + k.version + ': ' + Object.keys(k.guides).length + ' area guides, ' + moves + ' moves.');
Object.entries(sides).forEach(([area, s]) => console.log('  ' + area + ' moves build ' + s.size + ' sides: ' + [...s].sort().join(', ')));
if (problems.length) {
  console.log('\n' + problems.length + ' problem(s):');
  problems.forEach((p) => console.log('  - ' + p));
  process.exit(1);
}
console.log('All checks pass.');
