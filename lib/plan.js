// A 7-day plan: the one shape every plan takes, for the web page (app/plan.html) and the email (lib/plan-email.js).
// The method's words come from the approved playbook, word for word: each step's title, minutes, what to do and
// rough-day version, and the shadow question. The plan generator only writes what's tailored to the person:
// a short read of their week and one example per step. That's the playbook's hard rule: tailor the examples,
// never the method.
const playbook = require('./playbook');

// The same in every plan, so every week reads the same way (from Ebb and flow).
const HOW = [
  'Any moment today counts. There’s no set time.',
  'Each day, check in: full, half or rough. Do the version that fits. All three count.',
  'Missed a day? No catch-up. Just pick up today’s step.',
  'Your gut has the final say. Skip or change any step, and note why.'
];
const LOOKBACK = ['What did I actually do this week?', 'What changed, even a little?', 'What do I keep for next week, and what do I change?'];

const SIDE_NAMES = { desire: 'Desire', discipline: 'Discipline', faith: 'Faith', friction: 'Friction', ambition: 'Ambition', acceptance: 'Acceptance', control: 'Control', trust: 'Trust' };

/**
 * assemble({ type, typeName, ask, otherHalf, protocol, read, days })
 * days: 7 entries in order. A step is { id, example }; day 4 is { question: 'price' | 'payoff' | 'fear', hint };
 * day 7 is { lookback: true }. Throws if a step id isn't in the playbook, so nothing off-method can ship.
 */
function assemble(input) {
  if (!Array.isArray(input.days) || input.days.length !== 7) throw new Error('a plan has exactly 7 days');
  const days = input.days.map((d, i) => {
    const day = i + 1;
    if (d.lookback) return { day, kind: 'lookback', title: 'Look back', minutes: 5, prompts: LOOKBACK };
    if (d.question) {
      const q = playbook.shadowQuestions.find((x) => x.id === d.question);
      if (!q) throw new Error('unknown shadow question: ' + d.question);
      return { day, kind: 'question', title: 'A question to sit with', name: q.name, ask: q.ask, hint: String(d.hint || ''), followUps: q.followUps };
    }
    const r = playbook.reps.find((x) => x.id === d.id);
    if (!r) throw new Error('unknown step: ' + d.id);
    return { day, kind: 'step', id: r.id, title: r.title, minutes: r.minutes, what: r.what, example: String(d.example || r.example), rough: r.rough };
  });
  const protocol = playbook.protocols.find((x) => x.id === input.protocol);
  return {
    playbook: playbook.version,
    type: input.type,
    typeName: input.typeName,
    ask: String(input.ask || '').trim(),
    otherHalf: input.otherHalf ? SIDE_NAMES[input.otherHalf] || input.otherHalf : null,
    focus: protocol ? protocol.name : null,
    read: String(input.read || ''),
    how: HOW,
    days
  };
}

module.exports = { assemble, HOW, LOOKBACK };
