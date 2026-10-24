const path = require('path'), https = require('https'), fs = require('fs'), crypto = require('crypto');
const root = process.argv[2];
const webpush = require(path.join(root, 'node_modules/web-push'));
const vapid = webpush.generateVAPIDKeys();
process.env.CRON_SECRET = 'test-secret'; process.env.SUPABASE_URL = 'https://db.test'; process.env.SUPABASE_SECRET_KEY = 'k';
process.env.VAPID_PUBLIC_KEY = vapid.publicKey; process.env.VAPID_PRIVATE_KEY = vapid.privateKey; process.env.VAPID_SUBJECT = 'mailto:test@example.com';
// a fake phone: a push endpoint on localhost that records what arrives
const ecdh = crypto.createECDH('prime256v1'); ecdh.generateKeys();
const p256dh = ecdh.getPublicKey().toString('base64url'), auth = crypto.randomBytes(16).toString('base64url');
const got = [];
const srv = https.createServer({ key: fs.readFileSync(__dirname + '/test-key.pem'), cert: fs.readFileSync(__dirname + '/test-cert.pem') }, (req, res) => { let b = []; req.on('data', (c) => b.push(c)); req.on('end', () => { got.push({ url: req.url, headers: req.headers, len: Buffer.concat(b).length }); res.statusCode = req.url.includes('gone') ? 410 : 201; res.end(); }); });
srv.listen(0, async () => {
  const port = srv.address().port;
  // their local time now in Chicago, and a time 30 minutes ago / 5 hours ago
  const tz = 'Asia/Tokyo';
  const p = {}; new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).forEach((x) => p[x.type] = x.value);
  const today = p.year + '-' + p.month + '-' + p.day, mins = +p.hour * 60 + +p.minute;
  const hm = (m) => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  const start = new Date(Date.parse(today) - 2 * 864e5).toISOString().slice(0, 10); // so today is day 3
  const ep = (n) => 'https://127.0.0.1:' + port + '/' + n;
  const rows = [
    { endpoint: ep('due'), plan_id: 'planAAAA1', p256dh, auth, time: hm(mins - 30), tz, start_date: start, tier: 'free' },
    { endpoint: ep('done-today'), plan_id: 'planBBBB1', p256dh, auth, time: hm(mins - 30), tz, start_date: start, tier: 'free', last_done: today },
    { endpoint: ep('already-sent'), plan_id: 'planCCCC1', p256dh, auth, time: hm(mins - 30), tz, start_date: start, tier: 'free', last_sent: today },
    { endpoint: ep('too-late'), plan_id: 'planDDDD1', p256dh, auth, time: hm(mins - 300), tz, start_date: start, tier: 'free' },
    { endpoint: ep('not-yet'), plan_id: 'planEEEE1', p256dh, auth, time: hm(mins + 60), tz, start_date: start, tier: 'free' },
    { endpoint: ep('week-over-free'), plan_id: 'planFFFF1', p256dh, auth, time: hm(mins - 30), tz, start_date: new Date(Date.parse(today) - 9 * 864e5).toISOString().slice(0, 10), tier: 'free' },
    { endpoint: ep('week-over-paid'), plan_id: 'planGGGG1', p256dh, auth, time: hm(mins - 30), tz, start_date: new Date(Date.parse(today) - 9 * 864e5).toISOString().slice(0, 10), tier: 'paid' },
    { endpoint: ep('gone'), plan_id: 'planHHHH1', p256dh, auth, time: hm(mins - 30), tz, start_date: start, tier: 'free' }
  ];
  const calls = [];
  const realFetch = global.fetch;
  global.fetch = async (u, o = {}) => {
    if (String(u).startsWith('https://db.test')) { calls.push((o.method || 'GET') + ' ' + decodeURIComponent(String(u).replace('https://db.test/rest/v1/', '')).slice(0, 70) + (o.body ? ' ' + o.body : '')); return { ok: true, json: async () => rows, text: async () => '' }; }
    return realFetch(u, o);
  };
  const send = require(path.join(root, 'api/nudge-send.js'));
  const out = {}; const res = { statusCode: 0, setHeader() {}, end(b) { out.body = b; } };
  await send({ headers: { authorization: 'Bearer test-secret' } }, res);
  console.log('result', res.statusCode, out.body);
  console.log('pushed to', got.map((g) => g.url + ' (' + g.headers['content-encoding'] + ', ' + g.len + ' bytes, vapid ' + /^vapid t=/.test(g.headers.authorization || '') + ')').join(' | '));
  console.log('db calls:\n  ' + calls.join('\n  '));
  // wrong secret
  const res2 = { statusCode: 0, setHeader() {}, end(b) { res2.b = b; } };
  await send({ headers: { authorization: 'Bearer nope' } }, res2); console.log('wrong secret', res2.statusCode);
  // the calendar file
  const nudge = require(path.join(root, 'api/nudge.js'));
  const r3 = { statusCode: 0, h: {}, setHeader(k, v) { this.h[k] = v; }, end(b) { this.b = b; } };
  await nudge({ method: 'GET', query: { ics: '1', time: '19:30', from: '2026-10-22', days: '6', plan: 'planAAAA1' } }, r3);
  console.log('ics', r3.statusCode, r3.h['Content-Type'], '\n' + r3.b);
  srv.close();
});
