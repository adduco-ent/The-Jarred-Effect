// POST /api/subscribe — every sign-up form on the site posts here.
// 1. adds (or re-subscribes) the reader in Resend Contacts
// 2. emails them the guide, with a one-click unsubscribe link
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY      required  a Resend API key with full access (sending + contacts)
//   RESEND_FROM         required  e.g.  Jarred <jarred@yourdomain.com>  (that domain must be verified in Resend)
//   GUIDE_URL           required  where the guide lives: a PDF link or a page
//   SITE_URL            required  the live site, e.g. https://www.yourdomain.com (logo + unsubscribe links)
//   UNSUBSCRIBE_SECRET  required  any long random string; signs the unsubscribe links
//   RESEND_SEGMENT_ID   optional  add every new contact to this Resend segment
//   RESEND_REPLY_TO     optional  where replies go (defaults to the from address)
const crypto = require('crypto');
const { resend, reply, unsubscribeUrl } = require('../lib/resend');
const guideEmail = require('../lib/guide-email');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REQUIRED = ['RESEND_API_KEY', 'RESEND_FROM', 'GUIDE_URL', 'SITE_URL', 'UNSUBSCRIBE_SECRET'];

module.exports = async function subscribe(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  // honeypot: a field people never see. Bots fill it in; pretend it worked and do nothing.
  if (body.company) return reply(res, 200, { ok: true });

  const email = String(body.email || '').trim().toLowerCase();
  const name = String(body.name || '').trim().replace(/\s+/g, ' ').slice(0, 40);
  const first = name.split(' ')[0] || '';
  const firstName = first ? first.charAt(0).toUpperCase() + first.slice(1) : '';
  const source = String(body.source || 'site').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  if (email.length > 254 || !EMAIL_RE.test(email)) return reply(res, 400, { ok: false, error: 'invalid_email' });

  const missing = REQUIRED.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('subscribe: missing environment variables:', missing.join(', '));
    return reply(res, 503, { ok: false, error: 'not_configured' });
  }

  // 1. the contact. Asking again counts as opting back in.
  const contact = { email, unsubscribed: false };
  if (firstName) contact.first_name = firstName;
  if (process.env.RESEND_SEGMENT_ID) contact.segments = [{ id: process.env.RESEND_SEGMENT_ID }];
  const created = await resend('/contacts', 'POST', contact);
  if (!created.ok) {
    const patch = { unsubscribed: false };
    if (firstName) patch.first_name = firstName;
    const updated = await resend('/contacts/' + encodeURIComponent(email), 'PATCH', patch);
    if (!updated.ok) console.error('subscribe: contact not saved', created.status, created.data, updated.status, updated.data);
  }

  // 2. the guide. One send per address per day, so double clicks and repeat bots don't stack emails.
  const site = process.env.SITE_URL.replace(/\/+$/, '');
  const unsub = unsubscribeUrl(site, email);
  const msg = guideEmail({ firstName, guideUrl: process.env.GUIDE_URL, siteUrl: site, unsubscribeUrl: unsub });
  const day = new Date().toISOString().slice(0, 10);
  const key = 'guide-' + crypto.createHash('sha256').update(email + '|' + day).digest('hex').slice(0, 40);
  const sent = await resend('/emails', 'POST', {
    from: process.env.RESEND_FROM,
    to: [email],
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
    reply_to: process.env.RESEND_REPLY_TO || undefined,
    headers: {
      'List-Unsubscribe': '<' + unsub + '>',
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
    },
    tags: [{ name: 'type', value: 'guide' }, { name: 'source', value: source }]
  }, key);

  if (!sent.ok) {
    console.error('subscribe: send failed', sent.status, sent.data);
    return reply(res, 502, { ok: false, error: 'failed' });
  }
  return reply(res, 200, { ok: true });
};
