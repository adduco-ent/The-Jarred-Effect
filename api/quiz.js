// POST /api/quiz: the quiz's result page posts here when someone asks for their results by email.
// 1. scores their answers again on the server (the type can't be faked from the browser)
// 2. saves the result and their Ask in Supabase (table quiz_results; docs/supabase/quiz_results.sql)
// 3. adds them to Resend Contacts and emails their results, with a one-click unsubscribe link
//
// Body: { email, r: 12-letter answer code (a / o / b), asks?: up to 3 things they want (or ask: one), source?, company?: honeypot }
// Environment variables: the same as /api/subscribe, plus SUPABASE_URL and SUPABASE_SECRET_KEY.
// If Supabase isn't set up yet, the email still goes out and the missing save is logged.
const crypto = require('crypto');
const { resend, reply, unsubscribeUrl, isTester, saveContact } = require('../lib/resend');
const quizEmail = require('../lib/quiz-email');
const content = require('../app/content');
const { score, decode } = require('../app/score');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REQUIRED = ['RESEND_API_KEY', 'RESEND_FROM', 'SITE_URL', 'UNSUBSCRIBE_SECRET'];

async function saveResult(row) {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) { console.error('quiz: Supabase not configured, result not saved'); return false; }
  const res = await fetch(url.replace(/\/+$/, '') + '/rest/v1/quiz_results', {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(row)
  });
  if (!res.ok) console.error('quiz: result not saved', res.status, await res.text().catch(() => ''));
  return res.ok;
}

module.exports = async function quiz(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(res, 405, { ok: false, error: 'method_not_allowed' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  if (body.company) return reply(res, 200, { ok: true });

  const email = String(body.email || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return reply(res, 400, { ok: false, error: 'invalid_email' });
  const code = String(body.r || '').toLowerCase();
  const answers = decode(code, content.questions.length);
  if (!answers) return reply(res, 400, { ok: false, error: 'invalid_answers' });
  // their Asks: up to 3, each one line with no control characters, capped
  const tidy = (x) => String(x || '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
  const asks = (Array.isArray(body.asks) ? body.asks : [body.ask]).map(tidy).filter(Boolean).slice(0, 3);
  const source = String(body.source || 'quiz').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);

  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('quiz: missing environment variables:', missing.join(', '));
    return reply(res, 503, { ok: false, error: 'not_configured' });
  }

  const result = score(content, answers);
  const site = process.env.SITE_URL.replace(/\/+$/, '');

  // 1 + 2: save the result and the contact (a failed save never blocks their email)
  const [saved] = await Promise.all([
    saveResult({ email, type: result.type, answers: code, pairs: result.pairs, swing: result.swing, insight: result.insight, ask: asks.length ? asks.join('\n') : null, source }),
    saveContact(email)
  ]);

  // 3: their results by email; one per address per day for the same answers, unlimited for testers
  const unsub = unsubscribeUrl(site, email);
  const msg = quizEmail({ content, result, asks, resultsUrl: site + '/app/?r=' + code + '#result', siteUrl: site, unsubscribeUrl: unsub });
  const day = new Date().toISOString().slice(0, 10);
  const key = isTester(email) ? undefined : 'quiz-' + crypto.createHash('sha256').update(email + '|' + code + '|' + day).digest('hex').slice(0, 40);
  const sent = await resend('/emails', 'POST', {
    from: process.env.RESEND_FROM,
    to: [email],
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
    reply_to: process.env.RESEND_REPLY_TO || undefined,
    headers: { 'List-Unsubscribe': '<' + unsub + '>', 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
    tags: [{ name: 'type', value: 'quiz' }, { name: 'result', value: result.type }, { name: 'source', value: source }]
  }, key);
  if (!sent.ok && sent.status === 409) return reply(res, 200, { ok: true, type: result.type, saved });
  if (!sent.ok) {
    console.error('quiz: send failed', sent.status, sent.data);
    return reply(res, 502, { ok: false, error: 'failed' });
  }
  return reply(res, 200, { ok: true, type: result.type, saved });
};
