// The email that delivers the guide, built on the shared layout (lib/email-layout.js; rules in docs/email-design.md).
// The guide's cover sits on the navy pole as one image, the same way the site shows it. Copy is a starting point;
// edit freely (keep the unsubscribe line).
const { layout, link } = require('./email-layout');

module.exports = function guideEmail({ firstName, guideUrl, siteUrl, unsubscribeUrl }) {
  const site = siteUrl.replace(/\/+$/, '');
  const hello = firstName ? `Hey ${firstName},` : 'Hey friend,';
  const host = site.replace(/^https?:\/\//, '');
  const subject = 'Your free guide: What All Gurus Are Failing To Disclose About Manifestation';
  const preheader = 'The half of the equation that doesn’t sell as well on a vision board. A 10-minute read.';
  const title = 'What All Gurus Are Failing To Disclose About Manifestation';
  const note = 'It’s a 10-minute read. Read it, use it, see what shifts — then hit reply and tell me what landed.';
  // the same file, sent as a download (vercel.json: /download/guide) so people keep the real PDF
  const downloadUrl = site + '/download/guide';

  const html = layout({
    siteUrl: site,
    subject,
    preheader,
    hello,
    headline: 'Here’s the guide',
    headlineItalic: 'you asked for.',
    // one image, because Gmail's dark mode flips colors set in code (navy turned lavender) but leaves images alone
    hero: { src: 'assets/img/email-guide-panel.png', width: 500, height: 380, alt: title + ': free, a 10-minute read', href: guideUrl },
    button: { label: 'Read the guide', url: guideUrl },
    buttonNote: 'or ' + link(downloadUrl, 'download the PDF') + ' to print and write in',
    body: [note],
    signature: true,
    footer: `You’re getting this because you asked for the guide at ${link(site, host, { strong: false, color: '#6b6254' })}.<br>
        ${link(unsubscribeUrl, 'Unsubscribe in one click', { strong: false, color: '#6b6254' })}`
  });

  const text = [
    hello,
    '',
    'Here’s the guide you asked for: ' + title + '.',
    '',
    'Read it here: ' + guideUrl,
    'Or download the PDF to print and write in: ' + downloadUrl,
    '',
    note,
    '',
    '— Jarred',
    '',
    'Manifestation has two sides.',
    '',
    '—',
    `You’re getting this because you asked for the guide at ${host}.`,
    'Unsubscribe in one click: ' + unsubscribeUrl
  ].join('\n');

  return { subject, html, text };
};
