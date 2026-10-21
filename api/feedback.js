// POST /api/feedback: the app saves what people tell it, in their own words, as they work through a plan.
// One row per plan + kind + ref, updated in place, so changing an answer just overwrites it.
// Table: plan_feedback (docs/supabase/plan_feedback.sql). This is what next week's plan is built from.
//
// Body: { plan: plan id, kind, ref, data }. Kinds and their data are listed in the SQL file.
// Environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY.
// Once the plans table exists, also check that the plan id is real before saving.
const { reply } = require('../lib/resend');

const KINDS = {
  step: { feel: ['easy', 'okay', 'hard'], note: 'text' },
  skip: { action: ['skip', 'change'], note: 'text' },
  checkin: { day: ['full', 'half', 'rough'], note: 'text' },
  receipt: { text: 'text' },
  note: { text: 'text' },
  lookback: { did: 'text', changed: 'text', keep: 'text' },
  next: { asks: 'asks', pace: ['light', 'right', 'much'], want: 'text' },
  app: { ease: ['yes', 'kind_of', 'not_really'], text: 'text' }
};
const NEXT = ['keep', 'change', 'done', 'pause'];
// their words, kept as written: control characters out, length capped
const words = (x, n = 2000) => String(x == null ? '' : x).replace(/[\u0000-\u0008\u000b-\u001f\u007f]+/g, ' ').trim().slice(0, n);

function clean(kind, data) {
  const shape = KINDS[kind], out = {};
  Object.keys(shape).forEach((k) => {
    const rule = shape[k], v = data[k];
    if (v == null || v === '') return;
    if (rule === 'text') out[k] = words(v);
    else if (rule === 'asks') out[k] = (Array.isArray(v) ? v : []).slice(0, 20).map((a) => ({ choice: NEXT.includes(a && a.choice) ? a.choice : null, note: words(a && a.note, 600) }));
    else if (Array.isArray(rule) && rule.includes(v)) out[k] = v;
  });
  return out;
}

module.exports = async function feedback(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(res, 405, { ok: false, error: 'method_not_allowed' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const plan = String(body.plan || '');
  const kind = String(body.kind || '');
  const ref = String(body.ref || '');
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(plan)) return reply(res, 400, { ok: false, error: 'invalid_plan' });
  if (!KINDS[kind]) return reply(res, 400, { ok: false, error: 'invalid_kind' });
  if (!/^[A-Za-z0-9._-]{1,40}$/.test(ref)) return reply(res, 400, { ok: false, error: 'invalid_ref' });
  if (!body.data || typeof body.data !== 'object') return reply(res, 400, { ok: false, error: 'invalid_data' });

  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) { console.error('feedback: Supabase not configured'); return reply(res, 503, { ok: false, error: 'not_configured' }); }

  const row = { plan_id: plan, kind, ref, data: clean(kind, body.data), updated_at: new Date().toISOString() };
  const r = await fetch(url.replace(/\/+$/, '') + '/rest/v1/plan_feedback?on_conflict=plan_id,kind,ref', {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(row)
  });
  if (!r.ok) { console.error('feedback: not saved', r.status, await r.text().catch(() => '')); return reply(res, 502, { ok: false, error: 'not_saved' }); }
  return reply(res, 200, { ok: true });
};
