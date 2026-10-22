// /api/nudge-send: sends the daily nudges that are due. Called every 15 minutes by GitHub Actions
// (.github/workflows/nudge.yml), because Vercel's free plan only allows a once-a-day schedule.
// Each person gets at most one nudge a day, within two hours after the time they picked, in their own time zone,
// and never on a day they've already done their step. Free plans are nudged only during their week (days 1 to 7).
// Protected by CRON_SECRET. Also needs SUPABASE_URL, SUPABASE_SECRET_KEY, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
// and VAPID_SUBJECT (a mailto: address people can reach).
const webpush = require('web-push');
const { reply } = require('../lib/resend');
const { encouragement } = require('../lib/playbook');

const SITE = 'https://thejarredeffect.com';
const WINDOW = 120; // minutes after their time that a nudge can still go out (the schedule can run a few minutes late)

// their own date and time of day, in their time zone
function localNow(tz) {
  const p = {};
  new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).forEach((x) => { p[x.type] = x.value; });
  return { date: p.year + '-' + p.month + '-' + p.day, mins: +p.hour * 60 + +p.minute };
}
const toMins = (t) => +t.slice(0, 2) * 60 + +t.slice(3, 5);
const dayOf = (start, date) => Math.round((Date.parse(date) - Date.parse(start)) / 864e5) + 1;

function line(day) {
  const list = encouragement.nudge || [];
  if (day === 7 && encouragement.nudgeLast) return encouragement.nudgeLast;
  // past week one there's no day count in the line
  const pool = day >= 1 && day <= 7 ? list : list.filter((x) => x.indexOf('{day}') < 0);
  return (pool[(Math.max(day, 1) - 1) % pool.length] || 'Today’s step is ready.').replace('{day}', day);
}

module.exports = async function nudgeSend(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== 'Bearer ' + secret) return reply(res, 401, { ok: false, error: 'unauthorized' });
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
  const pub = process.env.VAPID_PUBLIC_KEY, priv = process.env.VAPID_PRIVATE_KEY, subject = process.env.VAPID_SUBJECT;
  if (!url || !key || !pub || !priv || !subject) return reply(res, 503, { ok: false, error: 'not_configured' });
  webpush.setVapidDetails(subject, pub, priv);

  const base = url.replace(/\/+$/, '') + '/rest/v1/plan_nudges';
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  const r = await fetch(base + '?active=eq.true&select=endpoint,plan_id,p256dh,auth,time,tz,start_date,tier,last_done,last_sent', { headers });
  if (!r.ok) { console.error('nudge-send: read failed', r.status); return reply(res, 502, { ok: false, error: 'read_failed' }); }
  const rows = await r.json();

  let sent = 0, skipped = 0, gone = 0;
  await Promise.all(rows.map(async (row) => {
    let now;
    try { now = localNow(row.tz); } catch (e) { skipped++; return; }
    const late = now.mins - toMins(row.time);
    const day = row.start_date ? dayOf(row.start_date, now.date) : 0;
    if (late < 0 || late >= WINDOW || row.last_sent === now.date || row.last_done === now.date) { skipped++; return; }
    if (row.tier !== 'paid' && row.start_date && (day < 1 || day > 7)) { skipped++; return; }
    const payload = JSON.stringify({ title: 'Other Half', body: line(day), url: SITE + '/app/plan.html?id=' + encodeURIComponent(row.plan_id) + '#today' });
    const where = base + '?endpoint=eq.' + encodeURIComponent(row.endpoint);
    try {
      await webpush.sendNotification({ endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } }, payload, { TTL: 4 * 3600, urgency: 'normal' });
      sent++;
      await fetch(where, { method: 'PATCH', headers: Object.assign({ Prefer: 'return=minimal' }, headers), body: JSON.stringify({ last_sent: now.date }) });
    } catch (e) {
      // the phone unsubscribed or the app was removed: forget this device
      if (e && (e.statusCode === 404 || e.statusCode === 410)) { gone++; await fetch(where, { method: 'DELETE', headers }); }
      else console.error('nudge-send: not sent', e && e.statusCode, e && e.body);
    }
  }));
  return reply(res, 200, { ok: true, sent, skipped, gone });
};
