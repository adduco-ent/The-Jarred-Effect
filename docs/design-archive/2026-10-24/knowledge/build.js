// Builds the review page for lib/knowledge.js (plan engine, part 1). Run: node build.js <repo path>
const fs = require('fs');
const path = require('path');
const repo = process.argv[2];
const k = require(path.join(repo, 'lib/knowledge'));
const playbook = require(path.join(repo, 'lib/playbook'));
const reps = new Map(playbook.reps.map((r) => [r.id, r]));

const SIDE = { desire: 'Desire', discipline: 'Discipline', faith: 'Faith', friction: 'Friction', ambition: 'Ambition', acceptance: 'Acceptance', control: 'Control', trust: 'Trust', habits: 'Habits', field: 'Your field', loose: 'Let loose', tools: 'Tools', people: 'People', agency: 'Agency', worth: 'Worth', thoughts: 'Thoughts', circle: 'Your circle', agreements: 'Agreements', foundations: 'Foundations', signal: 'Your signal', power: 'Your power', room: 'Making room' };
const LIFE = { kids: { home: 'Kids at home', coming: 'A little one on the way' }, work: { corporate: 'A corporate career', hourly: 'Hourly or shift work', business: 'Their own business', freelance: 'Freelance or contract', side: 'Building something on the side', school: 'In school', none: 'Not working right now' }, care: { yes: 'Caring for someone', sometimes: 'Sometimes caring for someone' } };
const CHOICE = { fasting: 'fasting', calories: 'calorie tracking', scale: 'the scale' };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// sections: blocks (one decision, Yes or Change) and stages (a decision on every move: Keep, Change or Remove)
const S = [];
S.push({ kind: 'head', id: 'h-voice', t: 'How I sound', p: 'What the app is for, the voice every plan is written in, and the rules that keep each fresh step true to your method.' });
S.push({ kind: 'block', id: 'discovery', t: 'A self-discovery app first', sum: k.discovery.why, li: k.discovery.rules });
S.push({ kind: 'block', id: 'voice', t: 'I speak as you', sum: k.voice.who, li: k.voice.rules,
  pairs: k.voice.ear.filter((e) => !e.kind).map((e) => [e.flat, e.mine]) });
// who I am and how I guide (2026-10-23), its own block so it gets its own decision
const KIND = { question: 'Asking, then following up', hunch: 'A hunch they can prove wrong', sword: 'The sword, when it’s needed', optimism: 'Finding what’s working first' };
S.push({ kind: 'block', id: 'voice-me', t: 'Who I am, so it sounds like me', sum: 'In your words from today. The AI reads this before it writes a single line: who you are, the one story of yours it may tell, and how you help people see it for themselves.',
  liHtml: k.voice.me.map((t) => esc(t))
    .concat(k.voice.stories.map((st) => '<b>The one story it may tell:</b> ' + esc(st.story) + ' <i>When:</i> ' + esc(st.when)))
    .concat(k.voice.guide.map((t) => '<b>How I guide:</b> ' + esc(t))),
  pairs: k.voice.ear.filter((e) => e.kind).map((e) => [KIND[e.kind] + ': ' + e.flat, e.mine]) });
S.push({ kind: 'block', id: 'writing', t: 'How every step gets written', sum: 'Fresh for each person, and always traced back to one of your plays.', li: k.writing,
  step: { kick: 'Money · Automate it · ' + SIDE[k.step.side] + ' · ' + k.step.minutes + ' min', title: k.step.title, what: k.step.what, small: k.step.small, why: k.step.why, notice: k.step.notice, from: reps.get(k.step.play).title } });
const lifeLi = [];
Object.entries(k.life).forEach(([q, v]) => {
  if (typeof v === 'string') lifeLi.push('<b>Relationship:</b> ' + esc(v));
  else Object.entries(v).forEach(([a, line]) => lifeLi.push('<b>' + esc(LIFE[q][a]) + ':</b> ' + esc(line)));
});
S.push({ kind: 'block', id: 'life', t: 'Their life shapes the step, never the method', sum: 'The four life questions from the quiz decide when a step fits and how big it is.', liHtml: lifeLi });
S.push({ kind: 'block', id: 'areas', t: 'Seven areas, so every goal is sorted', sum: 'Money and body have full guides now. The other five are named so any goal can be sorted today, and their guides come next in the same shape.',
  liHtml: k.areas.map((a) => '<b>' + esc(a.name) + '</b> <span class="tag' + (a.status === 'ready' ? ' tag--on' : '') + '">' + (a.status === 'ready' ? 'Ready' : 'Next') + '</span> ' + esc(a.covers))
    .concat(k.sorting.map((s) => esc(s))) });

const AREA = { money: 'Money', body: 'Body and health' };
Object.entries(k.guides).forEach(([areaId, g]) => {
  S.push({ kind: 'head', id: 'h-' + areaId, t: AREA[areaId], p: 'Kinds of goal: ' + Object.values(g.kinds).join(', ').toLowerCase() + '. ' + g.notice });
  S.push({ kind: 'block', id: areaId + '-safety', t: AREA[areaId] + ': rules that never bend', sum: 'Every ' + AREA[areaId].toLowerCase() + ' step is checked against these before anyone sees it.', li: g.safety });
  if (g.disclaimers) {
    const LAB = { general: 'Any body plan', fasting: 'Fasting', calories: 'Calorie tracking', scale: 'The scale' };
    S.push({ kind: 'block', id: areaId + '-notes', t: 'The safety notes they’ll see', sum: 'Shown with the first step built on one of these choices, and the general note once at the start of any body plan. After that, “Safety note” keeps each one a tap away.',
      liHtml: Object.entries(g.disclaimers).map(([key, line]) => '<b>' + esc(LAB[key] || key) + ':</b> ' + esc(line)) });
  }
  Object.entries(g.paths).forEach(([pathId, p]) => {
    const many = Object.keys(g.paths).length > 1;
    p.stages.forEach((st, si) => {
      const stageId = areaId + '-' + pathId + '-' + st.id;
      if (st.prompts) {
        S.push({ kind: 'block', id: stageId, t: (many ? p.name + ' · ' : '') + (si + 1) + '. ' + st.name, sum: st.aim, finds: st.finds, li: st.prompts, after: st.next });
        return;
      }
      S.push({ kind: 'stage', id: stageId, t: (many ? p.name + ' · ' : '') + (si + 1) + '. ' + st.name, aim: st.aim, finds: st.finds,
        moves: st.moves.map((m, i) => ({
          id: stageId + '-' + (i + 1) + '-' + m.play,
          kick: AREA[areaId].split(' ')[0] + ' · ' + st.name + ' · ' + SIDE[m.side] + ' · ' + m.min + ' min',
          tags: (m.for ? m.for.map((x) => g.kinds[x]) : []).concat(m.choice ? ['Only if they choose ' + CHOICE[m.choice]] : []).concat(m.life ? Object.entries(m.life).flatMap(([q, vals]) => vals.map((v) => 'Only for: ' + LIFE[q][v].toLowerCase())) : []),
          step: m.step, small: m.small, up: m.up || null, why: m.why || null, from: reps.get(m.play).title
        })) });
    });
  });
});
const nx = k.next;
S.push({ kind: 'head', id: 'h-next', t: 'After every step', p: 'How the next step changes from what they tell the app.' });
S.push({ kind: 'block', id: 'next', t: 'What happens next', sum: nx.level,
  liHtml: Object.entries(nx.feel).map(([f, v]) => '<b>Felt ' + f + ':</b> ' + esc(v))
    .concat(Object.entries(nx.skip).map(([r, v]) => '<b>Skipped, “' + esc(r) + '”:</b> ' + esc(v)))
    .concat(Object.entries(nx.change).map(([r, v]) => '<b>Changed, “' + esc(r) + '”:</b> ' + esc(v)))
    .concat(nx.bandwidth ? ['<b>Their room to grow:</b> ' + esc(nx.bandwidth)] : [])
    .concat(['<b>What I learn goes back to them:</b> ' + esc(nx.mirror)]) });

const moves = S.filter((s) => s.kind === 'stage').reduce((t, s) => t + s.moves.length, 0);
const tpl = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
const out = tpl.replace('/*DATA*/', 'var S = ' + JSON.stringify(S).replace(/</g, '\\u003c') + ';').replace(/\{\{MOVES\}\}/g, String(moves));
fs.writeFileSync(path.join(__dirname, 'knowledge.html'), out);
console.log('knowledge.html:', S.length, 'sections,', moves, 'moves,', Math.round(out.length / 1024) + 'KB');
