// Builds the app's sign-in emails (sent by Supabase) from the shared email layout, so they match every other email.
// Run:   node scripts/build-auth-emails.js
// Then paste each file in emails/supabase/ into Supabase → Authentication → Emails → Templates (docs/email-design.md
// has the click-by-click steps and each subject line). Supabase fills in the {{ .ConfirmationURL }} style parts itself.
const fs = require('fs');
const path = require('path');
const { layout, C, SERIF } = require('../lib/email-layout');

const SITE = 'https://thejarredeffect.com';
const footer = 'You’re getting this because this address was used to sign in at thejarredeffect.com.<br>If that wasn’t you, ignore this email and nothing changes.';

// subject lines go in Supabase's Subject field, next to each template
const emails = {
  'magic-link': {
    subject: 'Your sign-in link',
    preheader: 'One tap and you’re back in. The link works once.',
    headline: 'Here’s your way',
    headlineItalic: 'back in.',
    button: { label: 'Sign in', url: '{{ .ConfirmationURL }}' },
    body: ['Open it on the device you want to sign in on. The link works once and expires soon.']
  },
  'confirm-signup': {
    subject: 'Confirm your email',
    preheader: 'One tap confirms this address is yours.',
    headline: 'One tap and',
    headlineItalic: 'you’re in.',
    button: { label: 'Confirm my email', url: '{{ .ConfirmationURL }}' },
    body: ['Confirming tells us this address is really yours, so your plan and check-ins reach you.']
  },
  invite: {
    subject: 'You’re invited to The Jarred Effect',
    preheader: 'Your spot is ready. One tap sets up your account.',
    headline: 'You’re invited.',
    headlineItalic: 'Your spot is ready.',
    button: { label: 'Accept the invite', url: '{{ .ConfirmationURL }}' },
    body: ['Tap the button to set up your account. It takes less than a minute.']
  },
  'change-email': {
    subject: 'Confirm your new email',
    preheader: 'One tap moves your account to this address.',
    headline: 'Confirm your',
    headlineItalic: 'new email.',
    button: { label: 'Confirm the change', url: '{{ .ConfirmationURL }}' },
    body: ['You asked to move your account from {{ .Email }} to {{ .NewEmail }}. Tap the button to confirm it.']
  },
  'reset-password': {
    subject: 'Choose a new password',
    preheader: 'One tap and you can set a new password.',
    headline: 'Let’s get you',
    headlineItalic: 'back in.',
    button: { label: 'Choose a new password', url: '{{ .ConfirmationURL }}' },
    body: ['Tap the button to choose a new password. The link works once and expires soon.']
  },
  reauthentication: {
    subject: 'Your confirmation code',
    preheader: 'Enter this code to confirm it’s you.',
    headline: 'Your confirmation',
    headlineItalic: 'code.',
    body: ['Enter this code in the app to confirm it’s you.'],
    bodyHtml: `<p style="margin:22px 0 0;font-family:${SERIF};font-size:40px;letter-spacing:10px;color:${C.ink};">{{ .Token }}</p>`
  }
};

const dir = path.join(__dirname, '..', 'emails', 'supabase');
fs.mkdirSync(dir, { recursive: true });
for (const [name, e] of Object.entries(emails)) {
  // sign-in emails are system emails: no "Hey friend" (Supabase doesn't know the name) and no signature
  const html = layout({ siteUrl: SITE, signature: false, footer, ...e });
  fs.writeFileSync(path.join(dir, name + '.html'), html);
  console.log(name.padEnd(18), '→', e.subject);
}
