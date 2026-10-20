// The email that delivers the guide. Plain HTML tables and inline styles so it holds up in every inbox.
// Brand: the site's pearl and navy, Libre Caslon for headings and Instrument Sans for text (Apple Mail and
// iPhone load them; Gmail and Outlook fall back to Georgia and Helvetica), and the guide's real cover on the
// navy pole, the same way the site shows it. Copy is a starting point; edit freely (keep the unsubscribe line).

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const SERIF = "'Libre Caslon Display','Libre Caslon Text',Georgia,'Times New Roman',serif";
const SERIF_IT = "'Libre Caslon Text',Georgia,'Times New Roman',serif";
const SANS = "'Instrument Sans','Helvetica Neue',Helvetica,Arial,sans-serif";

module.exports = function guideEmail({ firstName, guideUrl, siteUrl, unsubscribeUrl }) {
  const hello = firstName ? `Hey ${firstName},` : 'Hey friend,';
  const host = siteUrl.replace(/^https?:\/\//, '');
  const subject = 'Your free guide: What All Gurus Are Failing To Disclose About Manifestation';
  const preheader = 'The half of the equation that doesn’t sell as well on a vision board. A 10-minute read.';
  const title = 'What All Gurus Are Failing To Disclose About Manifestation';
  // the same file, sent as a download (vercel.json: /download/guide) so people keep the real PDF
  const downloadUrl = siteUrl.replace(/\/+$/, '') + '/download/guide';

  const text = [
    hello,
    '',
    'Here’s the guide you asked for: ' + title + '.',
    '',
    'Read it here: ' + guideUrl,
    'Or download the PDF to print and write in: ' + downloadUrl,
    '',
    'It’s a 10-minute read. Read it, use it, see what shifts — then hit reply and tell me what landed.',
    '',
    '— Jarred',
    '',
    'Manifestation has two sides.',
    '',
    '—',
    `You’re getting this because you asked for the guide at ${host}.`,
    'Unsubscribe in one click: ' + unsubscribeUrl
  ].join('\n');

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600&family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital@1&display=swap" rel="stylesheet">
<style>
  @media (max-width:520px){ .px{padding-left:24px!important;padding-right:24px!important} .pxl{padding-left:14px!important;padding-right:24px!important} .h1{font-size:30px!important} }
  a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}
</style>
</head>
<body style="margin:0;padding:0;background:#efe7da;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#efe7da;">
  <tr><td align="center" style="padding:32px 12px 24px;">

    <!-- the card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background:#fdfdfc;border-radius:28px;">
      <!-- the logo sits on a badge the card's color: invisible in light mode, keeps the navy readable when an inbox goes dark -->
      <tr><td class="pxl" style="padding:22px 40px 0 30px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td><a href="${esc(siteUrl)}" style="text-decoration:none;"><img src="${esc(siteUrl)}/assets/img/email-logo.png" width="124" height="81" alt="The Jarred Effect" style="display:block;border:0;"></a></td>
          <td align="right" style="font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#3e6cab;">A free guide</td>
        </tr></table>
      </td></tr>

      <tr><td class="px" style="padding:28px 40px 0;font-family:${SANS};font-size:17px;line-height:1.6;color:#1c1812;">
        <p style="margin:0 0 10px;">${esc(hello)}</p>
        <p class="h1" style="margin:0;font-family:${SERIF};font-weight:400;font-size:34px;line-height:1.08;letter-spacing:-0.3px;color:#1c1812;">Here’s the guide <i style="font-family:${SERIF_IT};font-size:30px;color:#a8471c;">you asked for.</i></p>
      </td></tr>

      <!-- the guide on the navy pole, like the site. One image, because Gmail's dark mode flips colors set in code
           (navy turned lavender) but leaves images alone. -->
      <tr><td class="px" style="padding:26px 40px 0;">
        <a href="${esc(guideUrl)}" style="text-decoration:none;"><img src="${esc(siteUrl)}/assets/img/email-guide-panel.png" width="500" height="380" alt="${esc(title)}: free, a 10-minute read" style="display:block;border:0;width:100%;max-width:500px;height:auto;"></a>
      </td></tr>

      <tr><td class="px" align="center" style="padding:26px 40px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td align="center" style="border-radius:999px;background:#e8743a;">
            <a href="${esc(guideUrl)}" style="display:inline-block;padding:17px 34px;border-radius:999px;font-family:${SANS};font-size:16px;font-weight:600;color:#241904;text-decoration:none;">Read the guide&nbsp;&nbsp;&rarr;</a>
          </td>
        </tr></table>
        <p style="margin:14px 0 0;font-family:${SANS};font-size:14px;color:#574f43;">or <a href="${esc(downloadUrl)}" style="color:#a8471c;font-weight:600;text-underline-offset:3px;">download the PDF</a> to print and write in</p>
      </td></tr>

      <tr><td class="px" style="padding:28px 40px 30px;font-family:${SANS};font-size:16px;line-height:1.65;color:#574f43;">
        <p style="margin:0 0 20px;">It’s a 10-minute read. Read it, use it, see what shifts — then hit reply and tell me what landed.</p>
        <!-- the signature from the site: photo, handwritten name (an image, so it looks the same in every inbox), title -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td valign="middle" style="padding-right:14px;"><img src="${esc(siteUrl)}/assets/img/jarred-face.jpg" width="52" height="52" alt="Jarred" style="display:block;border:0;width:52px;height:52px;border-radius:50%;"></td>
          <td valign="middle">
            <img src="${esc(siteUrl)}/assets/img/signature-jarred.png" width="104" height="50" alt="Jarred" style="display:block;border:0;width:104px;height:50px;margin:0 0 0 -6px;">
            <p style="margin:2px 0 0;font-family:${SANS};font-size:11.5px;letter-spacing:1.5px;text-transform:uppercase;color:#857b6d;">Founder, The Jarred Effect</p>
          </td>
        </tr></table>
      </td></tr>

      <!-- the two poles, as a small mark -->
      <tr><td align="center" style="padding:0 40px 30px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="44" style="width:44px;height:4px;line-height:4px;font-size:0;background:#e8743a;border-radius:4px 0 0 4px;">&nbsp;</td>
          <td width="44" style="width:44px;height:4px;line-height:4px;font-size:0;background:#0e1a2c;border-radius:0 4px 4px 0;">&nbsp;</td>
        </tr></table>
      </td></tr>
    </table>

    <!-- footer -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">
      <tr><td align="center" style="padding:22px 32px 0;font-family:${SERIF_IT};font-style:italic;font-size:17px;color:#574f43;">Manifestation has two sides.</td></tr>
      <tr><td align="center" style="padding:10px 32px 8px;font-family:${SANS};font-size:12.5px;line-height:1.6;color:#6b6254;">
        You’re getting this because you asked for the guide at <a href="${esc(siteUrl)}" style="color:#6b6254;">${esc(host)}</a>.<br>
        <a href="${esc(unsubscribeUrl)}" style="color:#6b6254;">Unsubscribe in one click</a>
      </td></tr>
    </table>

  </td></tr>
</table>
</body>
</html>`;

  return { subject, html, text };
};
