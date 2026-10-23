// Tests lib/store.js, api/feedback.js and api/plan.js against a pretend Supabase (no network, no real data).
// The SQL itself is tested against a real Postgres separately. Run: node scripts/test-store.js
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SECRET_KEY = 'test-secret';
const store = require('../lib/store');
const feedback = require('../api/feedback');
const planApi = require('../api/plan');

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL:', m); } };
let calls = [], answer = () => ({ status: 201, body: '' });
global.fetch = async (url, opts = {}) => {
  const call = { url, method: opts.method || 'GET', headers: opts.headers || {}, body: opts.body ? JSON.parse(opts.body) : undefined };
  calls.push(call);
  const a = answer(call);
  return { ok: a.status < 400, status: a.status, text: async () => a.body || '', json: async () => JSON.parse(a.body || 'null') };
};
// a stand-in for the response object, shaped like what lib/resend.js reply() writes to
function res() {
  const r = { statusCode: 0, body: null, headers: {} };
  r.setHeader = (k, v) => { r.headers[k] = v; };
  r.end = (s) => { r.body = s ? JSON.parse(s) : null; return r; };
  return r;
}

(async () => {
  // cost: Opus 5.5 at $4 in / $20 out per million, cache reads $0.20, batch half price
  ok(store.cost('claude-opus-5-5', { input_tokens: 1e6, output_tokens: 1e6 }) === 24, 'cost of a million in and out');
  ok(store.cost('claude-opus-5-5', { input_tokens: 1e6, output_tokens: 1e6 }, true) === 12, 'batch is half price');
  ok(store.cost('claude-opus-5-5', { cache_read_input_tokens: 1e6 }) === 0.2, 'cache reads are cheap');
  ok(store.cost('some-other-model', { input_tokens: 1e6 }) === 0, 'unknown models cost 0 rather than guessing');

  // events: validated, appended, never overwritten
  calls = []; answer = () => ({ status: 201 });
  await store.addEvent({ link: 'abcd1234', kind: 'done', ref: '3.1', data: { done: true } });
  ok(calls[0].url === 'https://example.supabase.co/rest/v1/events' && calls[0].method === 'POST', 'an event is a plain insert into events');
  ok(calls[0].headers.apikey === 'test-secret' && calls[0].headers.Prefer === 'return=minimal', 'sent with the secret key, nothing sent back');
  ok(calls[0].body[0].kind === 'done' && calls[0].body[0].link === 'abcd1234' && calls[0].body[0].ref === '3.1', 'the event row carries kind, link and ref');
  let threw = false; try { store.addEvent({ link: 'abcd1234', kind: 'Bad Kind' }); } catch (e) { threw = true; }
  ok(threw, 'a badly named kind is refused before it leaves the server');
  threw = false; try { store.addEvent({ kind: 'done' }); } catch (e) { threw = true; }
  ok(threw, 'an event needs a person or a link');

  // reading: filters are encoded into the address
  calls = []; answer = () => ({ status: 200, body: '[]' });
  await store.events('11111111-2222-3333-4444-555555555555', { since: '2026-10-01', kinds: ['done', 'skip'], limit: 50 });
  ok(/events\?person_id=eq\.11111111-2222-3333-4444-555555555555&order=at\.desc&limit=50&at=gte\.2026-10-01T00%3A00%3A00\.000Z&kind=in\.\(done,skip\)/.test(calls[0].url), 'events query: ' + calls[0].url);
  ok(await store.person('not a link!') === null && calls.length === 1, 'a bad link never reaches the database');

  // saving a plan: plan first, then its steps; if steps fail the plan is removed
  calls = []; answer = (c) => (c.url.endsWith('/plans') ? { status: 201, body: '[{"id":"plan-1"}]' } : c.url.endsWith('/plan_steps') ? { status: 400, body: 'bad' } : { status: 204 });
  threw = false;
  try { await store.savePlan({ personId: 'person-1', week: 1, plan: { days: [] }, steps: [{ day: 1, pos: 1, play: 'dis-1' }] }); } catch (e) { threw = true; }
  ok(threw && calls.some((c) => c.method === 'DELETE' && c.url.includes('plans?id=eq.plan-1')), 'a plan whose steps fail to save is cleaned up');
  calls = []; answer = (c) => (c.url.endsWith('/plans') ? { status: 201, body: '[{"id":"plan-2"}]' } : { status: 201 });
  const id = await store.savePlan({ personId: 'person-1', week: 2, plan: { days: [] }, steps: [{ day: 1, pos: 1, play: 'dis-1' }] });
  ok(id === 'plan-2' && calls[1].body[0].plan_id === 'plan-2' && calls[1].body[0].person_id === 'person-1', 'steps are saved with their plan and person');

  // the cost log
  calls = []; answer = () => ({ status: 201 });
  await store.logRun({ personId: 'person-1', job: 'plan', model: 'claude-opus-5-5', usage: { input_tokens: 20000, output_tokens: 3000, cache_read_input_tokens: 40000 }, batch: true });
  ok(calls[0].body[0].cost_usd === 0.074 && calls[0].body[0].batch === true, 'a run logs its tokens and cost: ' + calls[0].body[0].cost_usd);

  // delete my data
  calls = []; answer = (c) => (c.url.includes('people?link') ? { status: 200, body: '[{"id":"person-9"}]' } : { status: 204 });
  await store.forget({ link: 'abcd1234' });
  ok(calls[1].url.endsWith('rpc/delete_person') && calls[1].body.p === 'person-9', 'forgetting a link with a person deletes the person everywhere');
  calls = []; answer = (c) => (c.url.includes('people?link') ? { status: 200, body: '[]' } : { status: 204 });
  await store.forget({ link: 'abcd1234', email: 'sam@example.com' });
  ok(calls[1].url.endsWith('rpc/delete_contact') && calls[1].body.p_email === 'sam@example.com', 'without a person row, it deletes by link and email');

  // /api/feedback: the new "done" kind, saved as the latest answer and appended to the log
  calls = []; answer = () => ({ status: 201 });
  let r = res();
  await feedback({ method: 'POST', body: { plan: 'abcd1234', kind: 'done', ref: '3.1', data: { done: true, mine: false, extra: 'x' } } }, r);
  const latest = calls.find((c) => c.url.includes('plan_feedback')), logged = calls.find((c) => c.url.endsWith('/events'));
  ok(r.statusCode === 200, 'feedback answers 200: ' + r.statusCode);
  ok(latest && latest.body.data.done === true && latest.body.data.mine === false && !('extra' in latest.body.data), 'done is saved as the latest answer, extra fields dropped');
  ok(logged && logged.body[0].kind === 'done' && logged.body[0].data.done === true, 'and appended to the events log');
  calls = []; answer = (c) => (c.url.endsWith('/events') ? { status: 404, body: 'relation "events" does not exist' } : { status: 201 });
  r = res();
  await feedback({ method: 'POST', body: { plan: 'abcd1234', kind: 'step', ref: '3.1', data: { feel: 'easy' } } }, r);
  ok(r.statusCode === 200, 'before engine.sql runs, feedback still saves');
  calls = []; answer = () => ({ status: 500 });
  r = res();
  await feedback({ method: 'POST', body: { plan: 'abcd1234', kind: 'step', ref: '3.1', data: { feel: 'easy' } } }, r);
  ok(r.statusCode === 502, 'when nothing saves, the app is told');

  // /api/plan
  calls = []; answer = (c) => (c.url.includes('people?link') ? { status: 200, body: '[{"id":"person-1","tier":"paid"}]' } : { status: 200, body: '[{"id":"p","week":2,"starts_on":"2026-10-26","plan":{"days":[1,2,3,4,5,6,7],"tier":"free"}}]' });
  r = res();
  await planApi({ method: 'GET', query: { id: 'abcd1234' } }, r);
  ok(r.statusCode === 200 && r.body.week === 2 && r.body.tier === 'paid' && r.body.days.length === 7, 'the app gets their latest live week, with their current tier');
  ok(r.headers['Cache-Control'] === 'no-store', 'plans are never cached');
  calls = []; answer = () => ({ status: 200, body: '[]' });
  r = res();
  await planApi({ method: 'GET', query: { id: 'abcd1234' } }, r);
  ok(r.statusCode === 404, 'no plan yet is a 404');
  r = res();
  await planApi({ method: 'GET', query: { id: 'bad!' } }, r);
  ok(r.statusCode === 400, 'a bad id is refused');

  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
