// POST /api/send-previews  {"email": "<a TEST_EMAILS address>"}
// Emails that tester one copy of every email the brand sends, with sample details filled in, so new designs
// can be checked in a real inbox (and in dark mode) before real people see them. Subjects start with [Preview].
// Only addresses in TEST_EMAILS can receive previews; anything else gets a plain 404.
const { resend, reply, unsubscribeUrl, isTester } = require('../lib/resend');
const guideEmail = require('../lib/guide-email');
const { AUTH_EMAILS, buildAuthEmail } = require('../lib/auth-emails');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = async function sendPreviews(req, res) {
  if (req.method !== 'POST') return reply(res, 404, { ok: false });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const email = String((body || {}).email || '').trim().toLowerCase();
  if (!email || !isTester(email) || !process.env.RESEND_API_KEY || !process.env.SITE_URL) return reply(res, 404, { ok: false });

  const site = process.env.SITE_URL.replace(/\/+$/, '');
  const unsub = unsubscribeUrl(site, email);
  const g = guideEmail({ firstName: '', guideUrl: process.env.GUIDE_URL || site, siteUrl: site, unsubscribeUrl: unsub });
  const sample = { '{{ .ConfirmationURL }}': site + '/app', '{{ .Token }}': '482913', '{{ .Email }}': email, '{{ .NewEmail }}': 'new-address@example.com' };
  const fill = (s) => Object.entries(sample).reduce((t, [k, v]) => t.split(k).join(v), s);

  const all = [{ name: 'guide', subject: g.subject, html: g.html, text: g.text }]
    .concat(Object.keys(AUTH_EMAILS).map((name) => { const e = buildAuthEmail(name); return { name, subject: e.subject, html: fill(e.html) }; }));

  // one batch per address per 10 minutes, so a repeated click doesn't stack copies
  const slot = Math.floor(Date.now() / 600000);
  const sent = [];
  for (const m of all) {
    const r = await resend('/emails', 'POST', {
      from: process.env.RESEND_FROM, to: [email], subject: '[Preview] ' + m.subject, html: m.html, text: m.text,
      tags: [{ name: 'type', value: 'preview' }]
    }, 'preview-' + m.name + '-' + email + '-' + slot);
    sent.push({ email: m.name, ok: r.ok || r.status === 409 });
    if (!r.ok && r.status !== 409) console.error('send-previews:', m.name, r.status, r.data);
    await wait(600); // Resend allows a couple of sends a second
  }
  return reply(res, 200, { ok: sent.every((s) => s.ok), sent });
};
