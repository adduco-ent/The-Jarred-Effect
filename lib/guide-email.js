// The email that delivers the guide. Plain HTML tables and inline styles so it holds up in every inbox.
// Copy is a starting point; edit freely (keep the unsubscribe line).

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = function guideEmail({ firstName, guideUrl, siteUrl, unsubscribeUrl }) {
  const hello = firstName ? `Hey ${firstName},` : 'Hey,';
  const host = siteUrl.replace(/^https?:\/\//, '');
  const subject = 'Your free guide: What All Gurus Are Failing To Disclose About Manifestation';
  const preheader = 'The half of the equation that doesn’t sell as well on a vision board. A 10-minute read.';

  const text = [
    hello,
    '',
    'Here’s the guide you asked for: What All Gurus Are Failing To Disclose About Manifestation.',
    '',
    'Read it here: ' + guideUrl,
    '',
    'It’s a 10-minute read. Read it, use it, see what shifts — then hit reply and tell me what landed.',
    '',
    '— Jarred',
    '',
    '—',
    `You’re getting this because you asked for the guide at ${host}.`,
    'Unsubscribe in one click: ' + unsubscribeUrl
  ].join('\n');

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#efe7da;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efe7da;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fdfdfc;border-radius:24px;">
      <tr><td style="padding:32px 36px 8px;">
        <img src="${esc(siteUrl)}/assets/img/logo-lockup.png" width="112" height="70" alt="The Jarred Effect" style="display:block;border:0;">
      </td></tr>
      <tr><td style="padding:16px 36px 0;font-family:Helvetica,Arial,sans-serif;font-size:17px;line-height:1.6;color:#1c1812;">
        <p style="margin:0 0 14px;">${esc(hello)}</p>
        <p style="margin:0 0 22px;">Here’s the guide you asked for.</p>
        <p style="margin:0 0 6px;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#a8471c;">A free guide</p>
        <p style="margin:0 0 26px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.15;color:#1c1812;">What All Gurus Are Failing To Disclose About <i style="color:#a8471c;">Manifestation</i></p>
      </td></tr>
      <tr><td style="padding:0 36px 28px;">
        <a href="${esc(guideUrl)}" style="display:inline-block;padding:16px 28px;border-radius:999px;background:#e8743a;color:#241904;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;">Read the guide &rarr;</a>
      </td></tr>
      <tr><td style="padding:0 36px 32px;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#574f43;">
        <p style="margin:0 0 18px;">It’s a 10-minute read. Read it, use it, see what shifts — then hit reply and tell me what landed.</p>
        <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:20px;color:#a8471c;">— Jarred</p>
      </td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td style="padding:18px 36px 0;font-family:Helvetica,Arial,sans-serif;font-size:12.5px;line-height:1.6;color:#6b6254;text-align:center;">
        You’re getting this because you asked for the guide at ${esc(host)}.<br>
        <a href="${esc(unsubscribeUrl)}" style="color:#6b6254;">Unsubscribe in one click</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return { subject, html, text };
};
