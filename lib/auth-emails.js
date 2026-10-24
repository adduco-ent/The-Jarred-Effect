// The app's sign-in emails (sent by Supabase), built from the shared layout so they match every other email.
// scripts/build-auth-emails.js writes them to emails/supabase/ for pasting into Supabase; api/send-previews.js
// emails sample copies to testers. Supabase fills in the {{ .ConfirmationURL }} style parts itself.
const { layout, C, SERIF } = require('./email-layout');

const SITE = 'https://thejarredeffect.com';
// sign-in is for the app, so these say the Other Half; each footer says why that email came, and who makes the app
const footer = (why, after = 'If that wasn’t you, ignore this email and nothing changes.') => 'You’re getting this because ' + why + '<br>' + after + '<br><br>The Other Half is made by The Jarred Effect.';

// subject lines go in Supabase's Subject field, next to each template
const AUTH_EMAILS = {
  'magic-link': {
    subject: 'Your sign-in link',
    preheader: 'One tap and you’re back in. The link works once.',
    headline: 'Here’s your way',
    headlineItalic: 'back in.',
    button: { label: 'Sign in', url: '{{ .ConfirmationURL }}' },
    body: ['Open it on the device you want to sign in on. The link works once and expires soon.'],
    footer: footer('someone asked to sign in to the Other Half with this address.')
  },
  'confirm-signup': {
    subject: 'Confirm your email',
    preheader: 'One tap confirms this address is yours.',
    headline: 'One tap and',
    headlineItalic: 'you’re in.',
    button: { label: 'Confirm my email', url: '{{ .ConfirmationURL }}' },
    body: ['Confirming tells us this address is really yours, so your plan and check-ins reach you.'],
    footer: footer('this address was used to sign up for the Other Half.')
  },
  invite: {
    subject: 'You’re invited to the Other Half',
    preheader: 'Your spot is ready. One tap sets up your account.',
    headline: 'You’re invited.',
    headlineItalic: 'Your spot is ready.',
    button: { label: 'Accept the invite', url: '{{ .ConfirmationURL }}' },
    body: ['Tap the button to set up your account. It takes less than a minute.'],
    footer: footer('Jarred invited this address to the Other Half.', 'If you weren’t expecting it, ignore this email and nothing changes.')
  },
  'change-email': {
    subject: 'Confirm your new email',
    preheader: 'One tap moves your account to this address.',
    headline: 'Confirm your',
    headlineItalic: 'new email.',
    button: { label: 'Confirm the change', url: '{{ .ConfirmationURL }}' },
    body: ['You asked to move your account from {{ .Email }} to {{ .NewEmail }}. Tap the button to confirm it.'],
    footer: footer('someone asked to change the email on an account with the Other Half.')
  },
  'reset-password': {
    subject: 'Choose a new password',
    preheader: 'One tap and you can set a new password.',
    headline: 'Let’s get you',
    headlineItalic: 'back in.',
    button: { label: 'Choose a new password', url: '{{ .ConfirmationURL }}' },
    body: ['Tap the button to choose a new password. The link works once and expires soon.'],
    footer: footer('someone asked for a new password for this address on the Other Half.')
  },
  reauthentication: {
    subject: 'Your confirmation code',
    preheader: 'Enter this code to confirm it’s you.',
    headline: 'Your confirmation',
    headlineItalic: 'code.',
    body: ['Enter this code in the app to confirm it’s you.'],
    bodyHtml: `<p style="margin:22px 0 0;font-family:${SERIF};font-size:40px;letter-spacing:10px;color:${C.ink};">{{ .Token }}</p>`,
    footer: footer('someone asked to confirm it’s you in the Other Half.')
  }
};

// sign-in emails are system emails: no "Hey friend" (Supabase doesn't know the name) and no signature
function buildAuthEmail(name) {
  const e = AUTH_EMAILS[name];
  return { subject: e.subject, html: layout({ siteUrl: SITE, wordmark: 'The Other Half', wordmarkUrl: SITE + '/app', signature: false, ...e }) };
}

module.exports = { AUTH_EMAILS, buildAuthEmail };
