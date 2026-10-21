// A 7-day plan: the one shape every plan takes, for the web page (app/plan.html) and the email (lib/plan-email.js).
// A plan holds 1 to 3 Asks. Each step day has one small step per Ask, and a day's steps add up to 20 minutes or
// less. Day 4 is one shadow question and day 7 is the look back, both covering every Ask.
// The method's words come from the approved playbook, word for word: each step's title, minutes, what to do and
// rough-day version, and the shadow question. The plan generator only writes what's tailored to the person:
// a short read of their week and one example per step. That's the playbook's hard rule: tailor the examples,
// never the method.
const playbook = require('./playbook');

const MAX_ASKS = 3;
const MAX_DAY_MINUTES = 20;

// The same in every plan, so every week reads the same way (from Ebb and flow).
const HOW = [
  'Any moment today counts. There’s no set time.',
  'Each day, check in: full, half or rough. Do the version that fits. All three count.',
  'Missed a day? No catch-up. Just pick up today’s step.',
  'Your gut has the final say. Skip or change any step, and note why.'
];
const HOW_MANY = 'On a half or rough day, pick one Ask and do its step. That counts as the day.';
const LOOKBACK = ['What did I actually do this week?', 'What changed, even a little?', 'What do I keep for next week, and what do I change?'];

const SIDE_NAMES = { desire: 'Desire', discipline: 'Discipline', faith: 'Faith', friction: 'Friction', ambition: 'Ambition', acceptance: 'Acceptance', control: 'Control', trust: 'Trust' };
// keep their words as written; just trim and drop wrapping quotes
const clean = (s) => String(s || '').trim().replace(/^[“"]+|[”"]+$/g, '').trim();

/**
 * assemble({ type, typeName, asks, read, days })
 * asks: 1 to 3 of { text, otherHalf, protocol }.
 * days: 7 entries in order. A step day is { steps: [{ ask: 0, id, example }, ...] } with at most one step per Ask;
 * day 4 is { question: 'price' | 'payoff' | 'fear', hint }; day 7 is { lookback: true }.
 * Throws on anything off-template: an unknown step, too many Asks, or a day over 20 minutes.
 */
function assemble(input) {
  const asks = (input.asks || []).map((a) => {
    const protocol = playbook.protocols.find((x) => x.id === a.protocol);
    return { text: clean(a.text), otherHalf: a.otherHalf ? SIDE_NAMES[a.otherHalf] || a.otherHalf : null, focus: protocol ? protocol.name : null };
  }).filter((a) => a.text);
  if (!asks.length || asks.length > MAX_ASKS) throw new Error('a plan has 1 to ' + MAX_ASKS + ' Asks');
  if (!Array.isArray(input.days) || input.days.length !== 7) throw new Error('a plan has exactly 7 days');

  const days = input.days.map((d, i) => {
    const day = i + 1;
    if (d.lookback) return { day, kind: 'lookback', title: 'Look back', minutes: 5, prompts: LOOKBACK };
    if (d.question) {
      const q = playbook.shadowQuestions.find((x) => x.id === d.question);
      if (!q) throw new Error('unknown shadow question: ' + d.question);
      return { day, kind: 'question', title: 'A question to sit with', name: q.name, ask: q.ask, hint: String(d.hint || ''), followUps: q.followUps, forMany: asks.length > 1 };
    }
    const seen = new Set();
    const steps = (d.steps || []).map((s) => {
      const r = playbook.reps.find((x) => x.id === s.id);
      if (!r) throw new Error('unknown step: ' + s.id);
      if (!(s.ask >= 0 && s.ask < asks.length)) throw new Error('day ' + day + ': step for a missing Ask');
      if (seen.has(s.ask)) throw new Error('day ' + day + ': more than one step for Ask ' + (s.ask + 1));
      seen.add(s.ask);
      return { ask: s.ask, id: r.id, title: r.title, minutes: r.minutes, what: r.what, example: String(s.example || r.example), rough: r.rough };
    }).sort((a, b) => a.ask - b.ask);
    if (!steps.length) throw new Error('day ' + day + ' has no steps');
    const minutes = steps.reduce((t, s) => t + s.minutes, 0);
    if (minutes > MAX_DAY_MINUTES) throw new Error('day ' + day + ' is ' + minutes + ' minutes; the cap is ' + MAX_DAY_MINUTES);
    return { day, kind: 'step', minutes, steps };
  });

  return {
    playbook: playbook.version,
    type: input.type,
    typeName: input.typeName,
    asks,
    read: String(input.read || ''),
    how: asks.length > 1 ? HOW.slice(0, 3).concat([HOW_MANY, HOW[3]]) : HOW,
    days
  };
}

module.exports = { assemble, HOW, HOW_MANY, LOOKBACK, MAX_ASKS, MAX_DAY_MINUTES };
