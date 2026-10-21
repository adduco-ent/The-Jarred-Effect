// The email someone gets after the quiz: their type, a link back to their full results, their Ask, and the
// parts of the result worth keeping. Built on the shared layout (lib/email-layout.js, docs/email-design.md).
// It's long, so the body reads left-aligned under the centered header. The copy comes from app/content.js,
// so the email always matches the result page.
const { layout, link, esc, C: K, SANS, SERIF, SERIF_IT } = require('./email-layout');

const kick = (t) => `<p style="margin:30px 0 8px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${K.muted};">${esc(t)}</p>`;
const serif = (t, size = 19) => `<p style="margin:0;font-family:${SERIF};font-size:${size}px;line-height:1.4;color:${K.ink};">${t}</p>`;
const plain = (t) => `<p style="margin:8px 0 0;font-family:${SANS};font-size:15px;line-height:1.6;color:${K.body};">${t}</p>`;

module.exports = function quizEmail({ content, result, asks, ask, resultsUrl, siteUrl, unsubscribeUrl }) {
  const site = siteUrl.replace(/\/+$/, '');
  const host = site.replace(/^https?:\/\//, '');
  const type = content.types[result.type];
  const lc = (s) => esc(String(s).toLowerCase());

  // their other half, said the same way as on the result page
  let half;
  if (result.type !== 'calibrated' && result.missing) half = `You lean on <i style="font-family:${SERIF_IT};">${lc(result.leaning)}</i>. Your other half is <i style="font-family:${SERIF_IT};">${lc(result.missing)}</i>.`;
  else if (result.missing) half = `No single side runs the show. If one slips first, it’ll be <i style="font-family:${SERIF_IT};">${lc(result.missing)}</i>.`;
  else half = 'No single side runs the show. Your work is keeping it that way when life gets loud.';

  const subject = 'Your result: ' + type.name;
  const preheader = type.line + ' Your full profile is inside.';
  const list = (asks && asks.length ? asks : [ask]).map((a) => String(a || '').trim()).filter(Boolean);

  const sections = [
    list.length === 1 ? kick('Your Ask') + serif('“' + esc(list[0]) + '”') + plain('Your 7-day plan will be built around this.') : '',
    list.length > 1 ? kick('Your Asks') + list.map((a, i) => serif((i + 1) + '. ' + esc(a))).join('') + plain('Your 7-day plan will be built around these.') : '',
    kick('The read') + serif(esc(type.read), 18),
    kick('Your other half') + serif(half, 22),
    kick('Try this for 7 days') + serif(esc(type.rep.title), 20) + plain(esc(type.rep.what)) + plain('<b style="color:' + K.ink + ';">Low on steam?</b> ' + esc(type.rep.rough)),
    kick('A question to sit with') + `<p style="margin:0;font-family:${SERIF_IT};font-style:italic;font-size:21px;line-height:1.35;color:${K.ink};">${esc(type.question.ask)}</p>` +
      plain('— ' + esc(type.question.name) + '. ' + esc(type.question.hint)),
    plain('<br>When your 7-day plan is ready, you’ll be the first to get it. Until then, reply and tell me what landed.')
  ].join('');

  const html = layout({
    siteUrl: site,
    subject,
    preheader,
    hello: 'Hey friend,',
    headline: 'Your result:',
    headlineItalic: type.name + '.',
    hero: { src: 'app/share/' + result.type + '.jpg', width: 360, height: 450, alt: type.name + ': ' + type.line, href: resultsUrl },
    button: { label: 'See your full results', url: resultsUrl },
    bodyAlign: 'left',
    bodyHtml: sections,
    signature: true,
    footer: `You’re getting this because you took the Polarity Profile at ${link(site, host, { strong: false, color: '#6b6254' })}.<br>
        ${link(unsubscribeUrl, 'Unsubscribe in one click', { strong: false, color: '#6b6254' })}`
  });

  const text = [
    'Hey friend,',
    '',
    'Your result: ' + type.name + '. ' + type.line,
    'See your full results: ' + resultsUrl,
    '',
    list.length === 1 ? 'Your Ask: “' + list[0] + '”\nYour 7-day plan will be built around this.\n' : '',
    list.length > 1 ? 'Your Asks:\n' + list.map((a, i) => (i + 1) + '. ' + a).join('\n') + '\nYour 7-day plan will be built around these.\n' : '',
    'The read',
    type.read,
    '',
    'Your other half',
    half.replace(/<[^>]+>/g, ''),
    '',
    'Try this for 7 days: ' + type.rep.title,
    type.rep.what,
    'Low on steam? ' + type.rep.rough,
    '',
    'A question to sit with',
    type.question.ask + ' (' + type.question.name + ')',
    type.question.hint,
    '',
    'When your 7-day plan is ready, you’ll be the first to get it. Until then, reply and tell me what landed.',
    '',
    '— Jarred',
    '',
    '—',
    `You’re getting this because you took the Polarity Profile at ${host}.`,
    'Unsubscribe in one click: ' + unsubscribeUrl
  ].join('\n');

  return { subject, html, text };
};
