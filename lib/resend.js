// Small helpers shared by the /api functions: Resend calls, JSON replies, signed unsubscribe links.
const crypto = require('crypto');

// RESEND_API_BASE exists only so tests can point at a fake server; leave it unset in Vercel.
const API = (process.env.RESEND_API_BASE || 'https://api.resend.com').replace(/\/+$/, '');

async function resend(path, method, body, idempotencyKey) {
  const headers = {
    Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
    'Content-Type': 'application/json'
  };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
  const res = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  let data = null;
  try { data = await res.json(); } catch (e) { /* empty body */ }
  return { ok: res.ok, status: res.status, data };
}

function reply(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function sign(email) {
  return crypto.createHmac('sha256', process.env.UNSUBSCRIBE_SECRET).update(email).digest('base64url').slice(0, 32);
}

// The address travels base64url-encoded (not plain text in the URL); the signature proves we issued the link.
function unsubscribeUrl(siteUrl, email) {
  const e = Buffer.from(email, 'utf8').toString('base64url');
  return siteUrl + '/api/unsubscribe?e=' + e + '&t=' + sign(email);
}

function readUnsubscribe(e, t) {
  let email = '';
  try { email = Buffer.from(String(e || ''), 'base64url').toString('utf8'); } catch (err) { return ''; }
  if (!email || !t || !process.env.UNSUBSCRIBE_SECRET) return '';
  const expected = Buffer.from(sign(email));
  const given = Buffer.from(String(t));
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return '';
  return email;
}

// TEST_EMAILS: addresses that skip the once-a-day guide limit and can ask for email previews.
// Gmail-style "+tags" count as the same address (you+anything@gmail.com).
function isTester(email) {
  const list = String(process.env.TEST_EMAILS || '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
  if (!list.length) return false;
  const bare = email.replace(/\+[^@]*@/, '@');
  return list.includes(email) || list.includes(bare);
}

module.exports = { resend, reply, unsubscribeUrl, readUnsubscribe, isTester };
