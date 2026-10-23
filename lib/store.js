// The plan engine's storage: the one place the server reads and writes the data foundation
// (docs/supabase/engine.sql) through Supabase's REST API. Server only; needs SUPABASE_URL and SUPABASE_SECRET_KEY.
//
// Everything people do is appended to `events` and never changed. Plans, steps, daily summaries and memories are
// built from it. A new kind of signal is just a new event kind, so the engine can keep learning without new tables.

// US dollars per million tokens, from Anthropic's pricing (checked 2026-10-22). Batch requests cost half.
const PRICES = {
  'claude-opus-5-5': { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 }  // cacheWrite: 5-minute cache
};
const KIND = /^[a-z][a-z0-9_]{1,39}$/;
const LINK = /^[A-Za-z0-9_-]{8,64}$/;

// What one AI call cost, from the usage the API returns.
function cost(model, usage, batch) {
  const p = PRICES[model];
  if (!p || !usage) return 0;
  const usd = ((usage.input_tokens || 0) * p.input + (usage.output_tokens || 0) * p.output +
    (usage.cache_read_input_tokens || 0) * p.cacheRead + (usage.cache_creation_input_tokens || 0) * p.cacheWrite) / 1e6;
  return Math.round((batch ? usd / 2 : usd) * 1e5) / 1e5;
}

function client() {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) { const e = new Error('Supabase is not configured'); e.code = 'not_configured'; throw e; }
  const base = url.replace(/\/+$/, '') + '/rest/v1/';
  async function call(method, path, body, prefer) {
    const headers = { apikey: key, Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (prefer) headers.Prefer = prefer;
    const r = await fetch(base + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    if (!r.ok) {
      const e = new Error('Supabase ' + method + ' ' + path.split('?')[0] + ' failed: ' + r.status);
      e.status = r.status; e.detail = await r.text().catch(() => '');
      throw e;
    }
    if (r.status === 204) return null;
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  }
  return {
    get: (path) => call('GET', path),
    add: (table, rows, back) => call('POST', table, rows, back ? 'return=representation' : 'return=minimal'),
    upsert: (table, rows, onConflict, back) => call('POST', table + '?on_conflict=' + onConflict, rows,
      'resolution=merge-duplicates,' + (back ? 'return=representation' : 'return=minimal')),
    patch: (path, values) => call('PATCH', path, values, 'return=minimal'),
    remove: (path) => call('DELETE', path, undefined, 'return=minimal'),
    rpc: (fn, args) => call('POST', 'rpc/' + fn, args || {})
  };
}
const q = encodeURIComponent;

// ---- people
async function person(link) {
  if (!LINK.test(String(link || ''))) return null;
  const rows = await client().get('people?link=eq.' + q(link) + '&select=*&limit=1');
  return rows && rows[0] ? rows[0] : null;
}
// Creates or updates someone by their app link. Their earlier events are claimed automatically.
async function savePerson(p) {
  if (!LINK.test(String(p.link || ''))) throw new Error('savePerson: a valid link is required');
  const rows = await client().upsert('people', [p], 'link', true);
  return rows && rows[0];
}

// ---- events: append only
function event(e) {
  const kind = String(e.kind || '');
  if (!KIND.test(kind)) throw new Error('event: kind must be a short lowercase name, got ' + JSON.stringify(kind));
  const data = e.data && typeof e.data === 'object' ? e.data : {};
  if (JSON.stringify(data).length > 12000) throw new Error('event: data is too large');
  const row = { kind, data };
  if (e.person) row.person_id = e.person;
  if (e.link) row.link = String(e.link);
  if (e.step) row.step_id = e.step;
  if (e.ref != null) row.ref = String(e.ref).slice(0, 40);
  if (e.at) row.at = new Date(e.at).toISOString();
  if (!row.person_id && !row.link) throw new Error('event: a person or a link is required');
  return row;
}
const addEvent = (e) => client().add('events', [event(e)]);
const addEvents = (list) => (list.length ? client().add('events', list.map(event)) : Promise.resolve(null));
// Their events, newest first. opts: { since, kinds: [..], limit }
function events(personId, opts = {}) {
  let path = 'events?person_id=eq.' + q(personId) + '&order=at.desc&limit=' + Math.min(opts.limit || 500, 5000);
  if (opts.since) path += '&at=gte.' + q(new Date(opts.since).toISOString());
  if (opts.kinds && opts.kinds.length) path += '&kind=in.(' + opts.kinds.map(q).join(',') + ')';
  return client().get(path);
}

// ---- plans and steps
// Saves a written week and its steps. steps: [{ day, pos, area, path, stage, play, side, choice, level, minutes,
// title, what, small, why, notice, goal_id, source }]. If the steps can't be saved, the plan isn't left behind.
async function savePlan({ personId, week, startsOn, status, knowledge, playbook, model, plan, steps }) {
  const db = client();
  const saved = await db.add('plans', [{ person_id: personId, week, starts_on: startsOn || null, status: status || 'live',
    knowledge: knowledge || null, playbook: playbook || null, model: model || null, plan }], true);
  const planId = saved[0].id;
  try {
    if (steps && steps.length) await db.add('plan_steps', steps.map((s) => Object.assign({}, s, { plan_id: planId, person_id: personId })));
  } catch (e) {
    await db.remove('plans?id=eq.' + q(planId)).catch(() => {});
    throw e;
  }
  return planId;
}
// The plan someone's app should show now: their latest live week.
async function currentPlan(link) {
  const p = await person(link);
  if (!p) return null;
  const rows = await client().get('plans?person_id=eq.' + q(p.id) + '&status=eq.live&order=week.desc&limit=1&select=id,week,starts_on,plan');
  return rows && rows[0] ? Object.assign({ person: p }, rows[0]) : null;
}
const steps = (planId) => client().get('plan_steps?plan_id=eq.' + q(planId) + '&order=day,pos');

// ---- daily summaries, built each night from events
const saveDay = (personId, day, s) => client().upsert('day_summaries', [Object.assign({}, s, { person_id: personId, day })], 'person_id,day');
const days = (personId, since) => client().get('day_summaries?person_id=eq.' + q(personId) + (since ? '&day=gte.' + q(since) : '') + '&order=day.desc');

// ---- memories: always shown back to them as a question; their answer is what's kept
const memories = (personId) => client().get('memories?person_id=eq.' + q(personId) + '&status=neq.dismissed&order=updated_at.desc');
const addMemory = (personId, m) => client().add('memories', [{ person_id: personId, fact: m.fact, evidence: m.evidence || null, area: m.area || null }], true).then((r) => r && r[0]);
function answerMemory(id, status, words) {
  if (!['asked', 'confirmed', 'corrected', 'dismissed'].includes(status)) throw new Error('answerMemory: unknown status ' + status);
  return client().patch('memories?id=eq.' + q(id), { status, their_words: words || null, answered_at: status === 'asked' ? null : new Date().toISOString() });
}

// ---- the AI cost log
function logRun({ personId, job, model, usage, batch, knowledge, ok, error }) {
  const u = usage || {};
  return client().add('ai_runs', [{ person_id: personId || null, job, model, batch: !!batch,
    input_tokens: u.input_tokens || 0, output_tokens: u.output_tokens || 0,
    cache_read_tokens: u.cache_read_input_tokens || 0, cache_write_tokens: u.cache_creation_input_tokens || 0,
    cost_usd: cost(model, u, batch), knowledge: knowledge || null, ok: ok !== false, error: error ? String(error).slice(0, 500) : null }]);
}

// ---- delete my data: everything, everywhere
async function forget({ personId, link, email }) {
  const db = client();
  if (personId) return db.rpc('delete_person', { p: personId });
  const p = link ? await person(link) : null;
  if (p) return db.rpc('delete_person', { p: p.id });
  return db.rpc('delete_contact', { p_link: link || null, p_email: email || null });
}

module.exports = { PRICES, cost, client, person, savePerson, addEvent, addEvents, events, savePlan, currentPlan, steps,
  saveDay, days, memories, addMemory, answerMemory, logRun, forget };
