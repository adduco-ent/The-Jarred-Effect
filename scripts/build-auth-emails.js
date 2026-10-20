// Builds the app's sign-in emails (sent by Supabase) from the shared email layout, so they match every other email.
// Run:   node scripts/build-auth-emails.js
// Then paste each file in emails/supabase/ into Supabase → Authentication → Emails → Templates (docs/email-design.md
// has the click-by-click steps and each subject line). The wording lives in lib/auth-emails.js.
const fs = require('fs');
const path = require('path');
const { AUTH_EMAILS, buildAuthEmail } = require('../lib/auth-emails');

const dir = path.join(__dirname, '..', 'emails', 'supabase');
fs.mkdirSync(dir, { recursive: true });
for (const name of Object.keys(AUTH_EMAILS)) {
  const e = buildAuthEmail(name);
  fs.writeFileSync(path.join(dir, name + '.html'), e.html);
  console.log(name.padEnd(18), '→', e.subject);
}
