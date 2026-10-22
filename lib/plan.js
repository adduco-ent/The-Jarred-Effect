// A 7-day plan: the one shape every plan takes, for the web page (app/plan.html) and the email (lib/plan-email.js).
// A plan holds 1 to 3 Asks. Each step day has one small step per Ask, and a day's steps add up to 20 minutes or
// less. Day 4 is one shadow question and day 7 is the look back, both covering every Ask.
// The method's words come from the approved playbook, word for word: each step's title, minutes, what to do and
// rough-day version, and the shadow question. The plan generator only writes what's tailored to the person:
// a short read of their week and one example per step. That's the playbook's hard rule: tailor the examples,
// never the method.
const playbook = require('./playbook');

// Free plans (from the quiz) hold 1 to 3 Asks. Paid plans hold as many as they want; with more than three, the
// Asks take turns, so a day still has at most three steps and stays within 20 minutes.
const MAX_ASKS = 3;
const MAX_ASKS_PAID = 20; // a sanity ceiling, not a limit anyone should reach
const MAX_STEPS_PER_DAY = 3;
const MAX_DAY_MINUTES = 20;
// shown wherever people add Asks: focus is the advice, never a rule
const FOCUS = 'Add as many Asks as you want. Fewer at once works better, though: with one to three, you’ll see the progress you’re after sooner.';

// The same in every plan, so every week reads the same way (from Ebb and flow).
const HOW = [
  'Any moment today counts. There’s no set time.',
  'Each day, check in on what kind of day it is: good, okay or hard. Do the version that fits. All three count.',
  'Missed a day? No catch-up. Just pick up today’s step.',
  'Your gut has the final say. Skip or change any step, and note why.'
];
const HOW_MANY = 'On an okay or hard day, pick one Ask and do its step. That counts as the day.';
const LOOKBACK = ['What did I actually do this week?', 'What changed, even a little?', 'What do I keep for next week, and what do I change?'];

const SIDE_NAMES = { desire: 'Desire', discipline: 'Discipline', faith: 'Faith', friction: 'Friction', ambition: 'Ambition', acceptance: 'Acceptance', control: 'Control', trust: 'Trust' };
// keep their words as written; just trim and drop wrapping quotes
const clean = (s) => String(s || '').trim().replace(/^[“"]+|[”"]+$/g, '').trim();

/**
 * assemble({ type, typeName, asks, read, days })
 * asks: 1 to 3 of { text, otherHalf, protocol } (any number up to MAX_ASKS_PAID when tier is "paid").
 * days: 7 entries in order. A step day is { steps: [{ ask: 0, id, example }, ...] } with at most one step per Ask;
 * day 4 is { question: 'price' | 'payoff' | 'fear', hint }; day 7 is { lookback: true }.
 * Throws on anything off-template: an unknown step, too many Asks, or a day over 20 minutes.
 */
function assemble(input) {
  const asks = (input.asks || []).map((a) => {
    const protocol = playbook.protocols.find((x) => x.id === a.protocol);
    // deeper: the full protocol behind this Ask, word for word, for "Go deeper" on each step
    return { protocol: protocol ? protocol.id : null, text: clean(a.text), otherHalf: a.otherHalf ? SIDE_NAMES[a.otherHalf] || a.otherHalf : null, focus: protocol ? protocol.name : null,
      deeper: protocol ? { name: protocol.name, when: protocol.when, steps: protocol.steps, safety: protocol.safety || null } : null };
  }).filter((a) => a.text);
  const tier = input.tier === 'paid' ? 'paid' : 'free';
  const cap = tier === 'paid' ? MAX_ASKS_PAID : MAX_ASKS;
  if (!asks.length || asks.length > cap) throw new Error('a ' + tier + ' plan has 1 to ' + cap + ' Asks');
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
      return { ask: s.ask, id: r.id, title: r.title, minutes: r.minutes, what: r.what, example: String(s.example || r.example), rough: r.rough, help: r.help || null };
    }).sort((a, b) => a.ask - b.ask);
    if (!steps.length) throw new Error('day ' + day + ' has no steps');
    if (steps.length > MAX_STEPS_PER_DAY) throw new Error('day ' + day + ' has ' + steps.length + ' steps; the cap is ' + MAX_STEPS_PER_DAY);
    const minutes = steps.reduce((t, s) => t + s.minutes, 0);
    if (minutes > MAX_DAY_MINUTES) throw new Error('day ' + day + ' is ' + minutes + ' minutes; the cap is ' + MAX_DAY_MINUTES);
    return { day, kind: 'step', minutes, steps };
  });

  return {
    playbook: playbook.version,
    tier,
    type: input.type,
    typeName: input.typeName,
    asks,
    read: String(input.read || ''),
    how: asks.length > 1 ? HOW.slice(0, 3).concat([HOW_MANY, HOW[3]]) : HOW,
    // the playbook's encouragement, carried with the plan so every plan cheers people on in the same words
    cheer: playbook.encouragement,
    focus: FOCUS,
    // the journal's prompts for this person: the general set, the kinds of day, the plays they're on, and letters
    journal: {
      general: playbook.journal.general,
      day: playbook.journal.day,
      plays: asks.map((x) => x.protocol && playbook.journal.byPlay[x.protocol]).filter(Boolean),
      letters: playbook.journal.letters,
      safety: playbook.journal.safety
    },
    // their quiz result link code, and the playbook's protocol names for the app's locked library preview
    r: input.r || null,
    library: playbook.protocols.map((x) => x.name),
    days
  };
}

module.exports = { assemble, HOW, HOW_MANY, LOOKBACK, FOCUS, MAX_ASKS, MAX_ASKS_PAID, MAX_STEPS_PER_DAY, MAX_DAY_MINUTES };
