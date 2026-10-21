// The email that delivers a 7-day plan. Built from the same plan object as the web page (lib/plan.js), on the
// shared email layout (lib/email-layout.js; rules in docs/email-design.md). The week is long, so the body reads
// left-aligned under the centered header, and the button opens the full plan page, where days can be ticked off.
const { layout, link, esc, C: K, SANS, SERIF, SERIF_IT } = require('./email-layout');

const kick = (t, top = 28) => `<p style="margin:${top}px 0 8px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${K.muted};">${esc(t)}</p>`;
const p = (t, size = 15, color = K.body, extra = '') => `<p style="margin:6px 0 0;font-family:${SANS};font-size:${size}px;line-height:1.6;color:${color};${extra}">${t}</p>`;
const rule = `<div style="height:1px;line-height:1px;font-size:0;background:rgba(28,24,18,.1);margin:22px 0 0;">&nbsp;</div>`;

function dayHtml(d) {
  const head = `<p style="margin:22px 0 4px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${K.muted};">Day ${d.day}${d.minutes ? ` &nbsp;·&nbsp; ${d.minutes} min` : ''}</p>`;
  const title = `<p style="margin:0;font-family:${SERIF};font-size:20px;line-height:1.25;color:${K.ink};">${esc(d.title)}</p>`;
  if (d.kind === 'question') {
    return head + title +
      `<p style="margin:8px 0 0;font-family:${SERIF_IT};font-style:italic;font-size:19px;line-height:1.35;color:${K.ink};">${esc(d.ask)}</p>` +
      p('— ' + esc(d.name) + (d.hint ? '. ' + esc(d.hint) + ' Answer it honestly, not nicely.' : ''), 14, K.muted);
  }
  if (d.kind === 'lookback') {
    return head + title + p(d.prompts.map((q, i) => (i + 1) + '. ' + esc(q)).join('<br>'), 15, K.ink, `font-family:${SERIF};`);
  }
  return head + title + p(esc(d.what)) +
    p('<span style="color:' + K.muted + ';">For example:</span> ' + esc(d.example), 15, K.ink, `font-family:${SERIF};`) +
    p('<b style="color:' + K.ink + ';">Rough day?</b> ' + esc(d.rough), 14);
}

module.exports = function planEmail({ plan, planUrl, siteUrl, unsubscribeUrl }) {
  const site = siteUrl.replace(/\/+$/, '');
  const host = site.replace(/^https?:\/\//, '');
  const ask = plan.ask.replace(/[.”"]+$/, '');
  const subject = 'Your 7-day plan: ' + ask;
  const preheader = 'Seven small steps, built around your Ask. Any moment counts, and every rough-day version counts too.';

  const body = [
    kick('Your Ask', 0) + `<p style="margin:0;font-family:${SERIF};font-size:22px;line-height:1.3;color:${K.ink};">“${esc(ask)}.”</p>` +
      (plan.otherHalf ? p(esc(plan.typeName) + ' · Building your other half: <b style="color:' + K.ink + ';">' + esc(plan.otherHalf.toLowerCase()) + '</b>', 14, K.muted) : ''),
    kick('This week') + `<p style="margin:0;font-family:${SERIF};font-size:18px;line-height:1.5;color:${K.ink};">${esc(plan.read)}</p>`,
    kick('How this week works') + p(plan.how.map((h) => '· ' + esc(h)).join('<br>'), 14),
    rule,
    kick('Your week', 22) + plan.days.map(dayHtml).join(''),
    rule,
    p('Tick each day off on your plan page as you go. Next week’s plan builds on how this one goes.', 14, K.body, 'margin-top:20px;')
  ].join('');

  const html = layout({
    siteUrl: site,
    subject,
    preheader,
    hello: 'Hey friend,',
    headline: 'Your plan',
    headlineItalic: 'is ready.',
    button: { label: 'Open your plan', url: planUrl },
    bodyAlign: 'left',
    bodyHtml: body,
    signature: true,
    footer: `You’re getting this because you asked for a plan at ${link(site, host, { strong: false, color: '#6b6254' })}.<br>
        ${link(unsubscribeUrl, 'Unsubscribe in one click', { strong: false, color: '#6b6254' })}`
  });

  const text = [
    'Hey friend,', '', 'Your plan is ready: ' + planUrl, '',
    'Your Ask: “' + ask + '.”', plan.otherHalf ? plan.typeName + ' · Building your other half: ' + plan.otherHalf.toLowerCase() : '', '',
    'This week', plan.read, '',
    'How this week works', plan.how.map((h) => '- ' + h).join('\n'), '',
    'Your week',
    plan.days.map((d) => {
      const h = 'Day ' + d.day + (d.minutes ? ' · ' + d.minutes + ' min' : '') + ': ' + d.title;
      if (d.kind === 'question') return h + '\n' + d.ask + ' (' + d.name + ')' + (d.hint ? '\n' + d.hint : '');
      if (d.kind === 'lookback') return h + '\n' + d.prompts.map((q, i) => (i + 1) + '. ' + q).join('\n');
      return h + '\n' + d.what + '\nFor example: ' + d.example + '\nRough day? ' + d.rough;
    }).join('\n\n'), '',
    '— Jarred', '', '—',
    `You’re getting this because you asked for a plan at ${host}.`,
    'Unsubscribe in one click: ' + unsubscribeUrl
  ].join('\n');

  return { subject, html, text };
};
