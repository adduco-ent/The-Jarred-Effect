// The email that delivers a 7-day plan. Built from the same plan object as the web page (lib/plan.js), on the
// shared email layout (lib/email-layout.js; rules in docs/email-design.md). The week is long, so the body reads
// left-aligned under the centered header, and the button opens the full plan page, where days can be ticked off.
const { layout, link, esc, C: K, SANS, SERIF, SERIF_IT } = require('./email-layout');

const kick = (t, top = 28) => `<p style="margin:${top}px 0 8px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${K.muted};">${esc(t)}</p>`;
const p = (t, size = 15, color = K.body, extra = '') => `<p style="margin:6px 0 0;font-family:${SANS};font-size:${size}px;line-height:1.6;color:${color};${extra}">${t}</p>`;
const rule = `<div style="height:1px;line-height:1px;font-size:0;background:rgba(28,24,18,.1);margin:22px 0 0;">&nbsp;</div>`;

// end a sentence with a period only if it doesn't already end in punctuation (so "p.m." stays "p.m.")
const end = (t) => { t = String(t || '').trim(); return /[.!?]$/.test(t) ? t : t + '.'; };

function dayHtml(d, plan) {
  const many = plan.asks.length > 1;
  const total = d.steps && d.steps.length > 1 ? ' total' : '';
  const head = `<p style="margin:22px 0 4px;font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${K.muted};">Day ${d.day}${d.minutes ? ` &nbsp;·&nbsp; ${d.minutes} min${total}` : ''}</p>`;
  const title = `<p style="margin:0;font-family:${SERIF};font-size:20px;line-height:1.25;color:${K.ink};">${esc(d.title || '')}</p>`;
  if (d.kind === 'question') {
    return head + title +
      `<p style="margin:8px 0 0;font-family:${SERIF_IT};font-style:italic;font-size:19px;line-height:1.35;color:${K.ink};">${esc(d.ask)}</p>` +
      p('— ' + esc(d.name) + (d.hint ? '. ' + esc(d.hint) + ' Answer it honestly, not nicely.' : '') + (d.forMany ? ' Use it on the Ask that feels heaviest right now.' : ''), 14, K.muted);
  }
  if (d.kind === 'lookback') {
    return head + title + p(d.prompts.map((q, i) => (i + 1) + '. ' + esc(q)).join('<br>'), 15, K.ink, `font-family:${SERIF};`);
  }
  return head + d.steps.map((s, i) =>
    (many ? `<p style="margin:${i ? 16 : 2}px 0 4px;font-family:${SANS};font-size:13px;font-weight:600;color:${K.body};">${s.ask + 1}. ${esc(end(plan.asks[s.ask].text))} <span style="font-weight:400;color:${K.muted};">· ${s.minutes} min</span></p>` : '') +
    `<p style="margin:0;font-family:${SERIF};font-size:20px;line-height:1.25;color:${K.ink};">${esc(s.title)}</p>` +
    p(esc(s.what)) +
    p('<span style="color:' + K.muted + ';">For example:</span> ' + esc(s.example), 15, K.ink, `font-family:${SERIF};`) +
    p('<b style="color:' + K.ink + ';">Rough day?</b> ' + esc(s.rough), 14)
  ).join('');
}

module.exports = function planEmail({ plan, planUrl, siteUrl, unsubscribeUrl }) {
  const site = siteUrl.replace(/\/+$/, '');
  const host = site.replace(/^https?:\/\//, '');
  const asks = plan.asks.map((a) => end(a.text));
  const subject = asks.length === 1 ? 'Your 7-day plan: ' + asks[0].replace(/\.$/, '') : 'Your 7-day plan is ready';
  const halves = plan.asks.map((a) => a.otherHalf && a.otherHalf.toLowerCase()).filter((x, i, l) => x && l.indexOf(x) === i).join(' and ');
  const preheader = 'Seven small steps, built around your Ask. Any moment counts, and every rough-day version counts too.';

  const body = [
    kick(asks.length === 1 ? 'Your Ask' : 'Your Asks', 0) +
      (asks.length === 1
        ? `<p style="margin:0;font-family:${SERIF};font-size:22px;line-height:1.3;color:${K.ink};">“${esc(asks[0])}”</p>`
        : asks.map((a, i) => `<p style="margin:${i ? 6 : 0}px 0 0;font-family:${SERIF};font-size:20px;line-height:1.3;color:${K.ink};">${i + 1}. ${esc(a)}</p>`).join('')) +
      (halves ? p(esc(plan.typeName) + ' · Building your other half: <b style="color:' + K.ink + ';">' + esc(halves) + '</b>', 14, K.muted) : ''),
    kick('This week') + `<p style="margin:0;font-family:${SERIF};font-size:18px;line-height:1.5;color:${K.ink};">${esc(plan.read)}</p>`,
    kick('How this week works') + p(plan.how.map((h) => '· ' + esc(h)).join('<br>'), 14),
    rule,
    kick('Your week', 22) +
      (plan.cheer && plan.cheer.planStart ? `<p style="margin:0 0 4px;font-family:${SERIF_IT};font-style:italic;font-size:17px;line-height:1.5;color:${K.ink};">${esc(plan.cheer.planStart)}</p>` : '') +
      plan.days.map((d) => dayHtml(d, plan)).join(''),
    rule,
    p('Need more on any step? In the app, every step has a walkthrough, a real-life example, why it helps and what to do if you get stuck. Tick each day off there as you go. Next week’s plan builds on how this one goes.', 14, K.body, 'margin-top:20px;')
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
    (asks.length === 1 ? 'Your Ask: “' + asks[0] + '”' : 'Your Asks:\n' + asks.map((a, i) => (i + 1) + '. ' + a).join('\n')),
    halves ? plan.typeName + ' · Building your other half: ' + halves : '', '',
    'This week', plan.read, '',
    'How this week works', plan.how.map((h) => '- ' + h).join('\n'), '',
    'Your week', plan.cheer && plan.cheer.planStart ? plan.cheer.planStart + '\n' : '',
    plan.days.map((d) => {
      const h = 'Day ' + d.day + (d.minutes ? ' · ' + d.minutes + ' min' : '') + (d.title ? ': ' + d.title : '');
      if (d.kind === 'question') return h + '\n' + d.ask + ' (' + d.name + ')' + (d.hint ? '\n' + d.hint : '');
      if (d.kind === 'lookback') return h + '\n' + d.prompts.map((q, i) => (i + 1) + '. ' + q).join('\n');
      return h + '\n' + d.steps.map((s) => (plan.asks.length > 1 ? (s.ask + 1) + '. ' + end(plan.asks[s.ask].text) + ' · ' + s.minutes + ' min\n' : '') + s.title + '\n' + s.what + '\nFor example: ' + s.example + '\nRough day? ' + s.rough).join('\n\n');
    }).join('\n\n'), '',
    '— Jarred', '', '—',
    `You’re getting this because you asked for a plan at ${host}.`,
    'Unsubscribe in one click: ' + unsubscribeUrl
  ].join('\n');

  return { subject, html, text };
};
