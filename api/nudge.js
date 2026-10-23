// /api/nudge: the daily nudge. Keyed by the plan id, like feedback, so it works before sign-in exists.
//   GET                                   → { ok, publicKey } when push is set up, else 503 not_configured
//   GET ?ics=1&time=19:00&from=YYYY-MM-DD&days=7[&plan=id]
//                                         → a daily calendar reminder (.ics), for phones where push isn't possible
//   POST { plan, action: 'on', sub, time, tz, start, tier }  → saves this device's nudge
//   POST { plan, action: 'time', time, tz }                 → moves the nudge on every device for this plan
//   POST { plan, action: 'done', date }                     → today's step is done, so today's nudge is skipped
//   POST { plan, action: 'off', endpoint }                  → removes this device
// Table: plan_nudges (docs/supabase/plan_nudges.sql). Sending: api/nudge-send.js.
// Environment variables: SUPABASE_URL, SUPABASE_SECRET_KEY, VAPID_PUBLIC_KEY.
const { reply } = require('../lib/resend');

const SITE = 'https://thejarredeffect.com';
const okPlan = (p) => /^[A-Za-z0-9_-]{8,64}$/.test(String(p || ''));
const okTime = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(t || ''));
const okDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(String(d || ''));
function okTz(z) {
  if (!/^[A-Za-z0-9_+\-/]{1,64}$/.test(String(z || ''))) return false;
  try { new Intl.DateTimeFormat('en-US', { timeZone: z }); return true; } catch (e) { return false; }
}

// ---- the calendar version: one event a day at their time, in whatever time zone they're in that day
function icsText(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
function calendar(q) {
  const time = okTime(q.time) ? q.time : '19:00';
  const from = okDate(q.from) ? q.from : new Date().toISOString().slice(0, 10);
  const days = Math.max(0, Math.min(366, parseInt(q.days, 10) || 0));
  const url = SITE + '/app/plan.html' + (okPlan(q.plan) ? '?id=' + q.plan : '') + '#today';
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//The Jarred Effect//The Other Half//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:other-half-nudge-' + (okPlan(q.plan) ? q.plan : 'plan') + '-' + time.replace(':', '') + '@thejarredeffect.com',
    'DTSTAMP:' + stamp,
    // floating time (no zone): 7 p.m. wherever they are that day
    'DTSTART:' + from.replace(/-/g, '') + 'T' + time.replace(':', '') + '00',
    'DURATION:PT10M',
    'RRULE:FREQ=DAILY' + (days ? ';COUNT=' + days : ''),
    'SUMMARY:' + icsText('The Other Half: today’s step'),
    'DESCRIPTION:' + icsText('A few minutes is enough. Open your plan: ' + url),
    'URL:' + url,
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsText('The Other Half: today’s step'), 'TRIGGER:PT0M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'
  ];
  return lines.join('\r\n') + '\r\n';
}

async function db(path, opts) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return { configured: false };
  const r = await fetch(url.replace(/\/+$/, '') + '/rest/v1/' + path, {
    method: opts.method,
    headers: Object.assign({ apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, opts.headers || {}),
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (!r.ok) console.error('nudge: database', r.status, await r.text().catch(() => ''));
  return { configured: true, ok: r.ok };
}

module.exports = async function nudge(req, res) {
  if (req.method === 'GET') {
    const q = req.query || {};
    if (q.ics) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      res.setHeader('Content-Disposition', 'inline; filename="other-half-nudge.ics"');
      res.setHeader('Cache-Control', 'no-store');
      return res.end(calendar(q));
    }
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    if (!publicKey || !process.env.SUPABASE_URL) return reply(res, 503, { ok: false, error: 'not_configured' });
    return reply(res, 200, { ok: true, publicKey });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return reply(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const plan = String(body.plan || '');
  if (!okPlan(plan)) return reply(res, 400, { ok: false, error: 'invalid_plan' });
  const now = new Date().toISOString();
  let r;

  if (body.action === 'on') {
    const sub = body.sub || {}, keys = sub.keys || {};
    if (!/^https:\/\/[^\s]{10,900}$/.test(String(sub.endpoint || '')) || !/^[A-Za-z0-9_-]{20,200}$/.test(String(keys.p256dh || '')) || !/^[A-Za-z0-9_-]{8,100}$/.test(String(keys.auth || ''))) {
      return reply(res, 400, { ok: false, error: 'invalid_subscription' });
    }
    if (!okTime(body.time) || !okTz(body.tz)) return reply(res, 400, { ok: false, error: 'invalid_time' });
    r = await db('plan_nudges?on_conflict=endpoint', {
      method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: { endpoint: sub.endpoint, plan_id: plan, p256dh: keys.p256dh, auth: keys.auth, time: body.time, tz: body.tz,
        start_date: okDate(body.start) ? body.start : null, tier: body.tier === 'paid' ? 'paid' : 'free', active: true, updated_at: now }
    });
  } else if (body.action === 'time') {
    if (!okTime(body.time) || !okTz(body.tz)) return reply(res, 400, { ok: false, error: 'invalid_time' });
    r = await db('plan_nudges?plan_id=eq.' + plan, { method: 'PATCH', body: { time: body.time, tz: body.tz, updated_at: now } });
  } else if (body.action === 'done') {
    if (!okDate(body.date)) return reply(res, 400, { ok: false, error: 'invalid_date' });
    r = await db('plan_nudges?plan_id=eq.' + plan, { method: 'PATCH', body: { last_done: body.date, updated_at: now } });
  } else if (body.action === 'off') {
    const endpoint = String(body.endpoint || '');
    if (!/^https:\/\//.test(endpoint)) return reply(res, 400, { ok: false, error: 'invalid_subscription' });
    r = await db('plan_nudges?plan_id=eq.' + plan + '&endpoint=eq.' + encodeURIComponent(endpoint), { method: 'DELETE' });
  } else {
    return reply(res, 400, { ok: false, error: 'invalid_action' });
  }

  if (!r.configured) return reply(res, 503, { ok: false, error: 'not_configured' });
  if (!r.ok) return reply(res, 502, { ok: false, error: 'not_saved' });
  return reply(res, 200, { ok: true });
};
