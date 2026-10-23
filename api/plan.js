// GET /api/plan?id=<their app link>: the plan their app should show now (their latest live week).
// The plan page (app/plan.html?id=…) already asks for this. Plans are saved by the plan writer (lib/store.js).
// Environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY.
const { reply } = require('../lib/resend');
const store = require('../lib/store');

module.exports = async function plan(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return reply(res, 405, { ok: false, error: 'method_not_allowed' });
  }
  const id = String((req.query && req.query.id) || '');
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(id)) return reply(res, 400, { ok: false, error: 'invalid_id' });
  res.setHeader('Cache-Control', 'no-store');
  try {
    const found = await store.currentPlan(id);
    if (!found) return reply(res, 404, { ok: false, error: 'not_found' });
    return reply(res, 200, Object.assign({}, found.plan, { week: found.week, startsOn: found.starts_on, tier: found.person.tier || 'free' }));
  } catch (e) {
    if (e.code === 'not_configured') return reply(res, 503, { ok: false, error: 'not_configured' });
    console.error('plan: not loaded', e.status || '', e.message);
    return reply(res, 502, { ok: false, error: 'not_loaded' });
  }
};
