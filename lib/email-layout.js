// The one layout every Jarred Effect email is built from. The rules behind it live in docs/email-design.md;
// read that before adding an email. In short: one center line from top to bottom, a quiet wordmark in real
// text, one headline with an orange italic line, at most one brand image, one orange button, lots of space.
//
// Dark mode: Gmail's phone app flips every color set in code but leaves images alone. So text (wordmark,
// headline, body) stays real text, which flips cleanly, and anything that must keep its brand colors (the navy
// guide panel) is an image. Never put the logo image on the email itself: its navy disappears on dark.

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Libre Caslon and Instrument Sans load in Apple Mail and iPhone; Gmail and Outlook fall back to Georgia and Helvetica
const SERIF = "'Libre Caslon Display','Libre Caslon Text',Georgia,'Times New Roman',serif";
const SERIF_IT = "'Libre Caslon Text',Georgia,'Times New Roman',serif";
const SANS = "'Instrument Sans','Helvetica Neue',Helvetica,Arial,sans-serif";

const C = {
  page: '#efe7da',    // behind the card
  card: '#fdfdfc',    // the card (the site's pearl)
  ink: '#1c1812',     // headlines, wordmark
  body: '#574f43',    // body text
  muted: '#857b6d',   // small caps under the signature
  foot: '#6b6254',    // footer
  rule: '#d6cdbf',    // the hairline under the wordmark
  orange: '#e8743a',  // the button, the warm pole
  rust: '#a8471c',    // italic headline line, links
  navy: '#0e1a2c'     // the cool pole
};

/**
 * layout({
 *   siteUrl,          'https://thejarredeffect.com' (no trailing slash); images load from here
 *   subject,          the <title>
 *   preheader,        the grey line inboxes show after the subject
 *   hello,            optional, e.g. 'Hey friend,'
 *   headline,         first headline line, e.g. 'Here’s the guide'
 *   headlineItalic,   optional orange italic second line, e.g. 'you asked for.'
 *   hero,             optional brand image { src, width, height, alt, href }, src relative to siteUrl
 *   button,           optional { label, url }; one per email
 *   buttonNote,       optional trusted HTML under the button (build it with link())
 *   body,             paragraphs of plain text; keep it to two or three short ones so centered text reads well
 *   bodyAlign,        'left' for a long email: the body reads left-aligned under the centered header (docs/email-design.md)
 *   bodyHtml,         optional trusted HTML placed after body (e.g. a sign-in code)
 *   signature,        true for emails from Jarred (photo + handwritten name); false for system emails (sign-in links)
 *   footer            trusted HTML lines for the footer: why they got it, and the unsubscribe link for anything that isn't a sign-in email
 * })
 */
function layout(o) {
  const site = o.siteUrl.replace(/\/+$/, '');
  const img = (p) => site + '/' + String(p).replace(/^\/+/, '');
  const rows = [];

  // the wordmark: real text, so it stays crisp in light and dark mode
  rows.push(`
      <tr><td class="px" align="center" style="padding:40px 40px 0;">
        <a href="${esc(site)}" style="font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:4.5px;text-transform:uppercase;color:${C.ink};text-decoration:none;">The&nbsp;Jarred&nbsp;Effect</a>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:18px auto 0;"><tr><td width="28" style="width:28px;height:1px;line-height:1px;font-size:0;background:${C.rule};">&nbsp;</td></tr></table>
      </td></tr>`);

  // the headline
  rows.push(`
      <tr><td class="px" align="center" style="padding:34px 40px 0;font-family:${SANS};">
        ${o.hello ? `<p style="margin:0 0 14px;font-size:16px;color:${C.body};">${esc(o.hello)}</p>` : ''}
        <p class="h1" style="margin:0;font-family:${SERIF};font-weight:400;font-size:38px;line-height:1.1;letter-spacing:-0.4px;color:${C.ink};">${esc(o.headline)}${o.headlineItalic ? `<br><i style="font-family:${SERIF_IT};font-size:34px;color:${C.rust};">${esc(o.headlineItalic)}</i>` : ''}</p>
      </td></tr>`);

  // one brand image, e.g. the guide on the navy pole
  if (o.hero) {
    const h = o.hero, tag = `<img src="${esc(img(h.src))}" width="${h.width}" height="${h.height}" alt="${esc(h.alt)}" style="display:block;border:0;width:100%;max-width:${h.width}px;height:auto;">`;
    rows.push(`
      <tr><td class="px" align="center" style="padding:34px 40px 0;">
        ${h.href ? `<a href="${esc(h.href)}" style="text-decoration:none;">${tag}</a>` : tag}
      </td></tr>`);
  }

  // one button
  if (o.button) {
    rows.push(`
      <tr><td class="px" align="center" style="padding:${o.hero ? 26 : 32}px 40px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td align="center" style="border-radius:999px;background:${C.orange};">
            <a href="${esc(o.button.url)}" style="display:inline-block;padding:17px 34px;border-radius:999px;font-family:${SANS};font-size:16px;font-weight:600;color:#241904;text-decoration:none;">${esc(o.button.label)}&nbsp;&nbsp;&rarr;</a>
          </td>
        </tr></table>
        ${o.buttonNote ? `<p style="margin:14px 0 0;font-family:${SANS};font-size:14px;color:${C.body};">${o.buttonNote}</p>` : ''}
      </td></tr>`);
  }

  // the note, then the signature as a centered stack, like the close of a letter.
  // Long emails pass bodyAlign: 'left' so paragraphs stay easy to read; the header and signature stay centered.
  const left = o.bodyAlign === 'left';
  const paras = (o.body || []).map((t, i, a) => `<p style="margin:0 0 ${i === a.length - 1 ? 0 : 16}px;">${esc(t)}</p>`).join('\n        ');
  if (left) {
    rows.push(`
      <tr><td class="px" align="left" style="padding:32px 40px 0;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.body};text-align:left;">
        ${paras}${o.bodyHtml ? '\n        ' + o.bodyHtml : ''}
      </td></tr>`);
  }
  rows.push(`
      <tr><td class="px" align="center" style="padding:${left ? '8px 52px 34px' : '30px 52px 34px'};font-family:${SANS};font-size:16px;line-height:1.65;color:${C.body};">
        ${left ? '' : paras + (o.bodyHtml ? '\n        ' + o.bodyHtml : '')}${o.signature ? `
        <img src="${esc(img('assets/img/jarred-face.jpg'))}" width="56" height="56" alt="Jarred" style="display:block;margin:30px auto 0;border:0;width:56px;height:56px;border-radius:50%;">
        <img src="${esc(img('assets/img/signature-jarred.png'))}" width="104" height="50" alt="Jarred" style="display:block;margin:6px auto 0;border:0;width:104px;height:50px;">
        <p style="margin:2px 0 0;font-family:${SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Founder, The Jarred Effect</p>` : ''}
      </td></tr>`);

  // the two poles, as a small mark
  rows.push(`
      <tr><td align="center" style="padding:0 40px 30px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="44" style="width:44px;height:4px;line-height:4px;font-size:0;background:${C.orange};border-radius:4px 0 0 4px;">&nbsp;</td>
          <td width="44" style="width:44px;height:4px;line-height:4px;font-size:0;background:${C.navy};border-radius:0 4px 4px 0;">&nbsp;</td>
        </tr></table>
      </td></tr>`);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(o.subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;600&family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital@1&display=swap" rel="stylesheet">
<style>
  @media (max-width:520px){ .px{padding-left:24px!important;padding-right:24px!important} .h1{font-size:32px!important} }
  a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important}
</style>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-font-smoothing:antialiased;">
${o.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(o.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
  <tr><td align="center" style="padding:32px 12px 24px;">

    <!-- the card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background:${C.card};border-radius:28px;">${rows.join('\n')}
    </table>

    <!-- footer -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;">
      <tr><td align="center" style="padding:22px 32px 8px;font-family:${SANS};font-size:12.5px;line-height:1.6;color:${C.foot};">
        ${o.footer || ''}
      </td></tr>
    </table>

  </td></tr>
</table>
</body>
</html>`;
}

// a link in the brand's style, for buttonNote and footer lines
function link(href, label, { strong = true, color = C.rust } = {}) {
  return `<a href="${esc(href)}" style="color:${color};${strong ? 'font-weight:600;' : ''}text-underline-offset:3px;">${esc(label)}</a>`;
}

module.exports = { layout, link, esc, C, SANS, SERIF, SERIF_IT };
