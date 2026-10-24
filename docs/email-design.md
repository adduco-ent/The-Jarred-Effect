# Email design rules

Every email The Jarred Effect sends is built from one layout, `lib/email-layout.js`. Don't hand-write email HTML. Build new emails with `layout()`, so they all look like one brand and hold up in dark mode.

## The look

- **One center line, top to bottom.** The wordmark, headline, image, button, note and signature all sit centered. The eye moves straight down and never jumps sides.
- **A quiet wordmark at the top.** "THE JARRED EFFECT" in small, widely spaced capitals with a short hairline under it. It's real text, not the logo image. The app's sign-in emails say "THE OTHER HALF" instead (the `wordmark` option), since sign-in is for the app, and their footer says the Other Half is made by The Jarred Effect.
- **One headline, two lines.** A plain serif line, then an orange italic line: "Here's the guide / *you asked for.*"
- **At most one brand image.** For example the guide cover on the navy panel. No banners and no stacked color blocks.
- **One orange button.** Any second option is a quiet text link under it ("or download the PDF…").
- **A short note.** Two or three short paragraphs at most. Centered text gets hard to read past that. A long email (a newsletter, a story) goes left-aligned below the headline instead.
- **The signature depends on who it's from.**
  - Emails from Jarred (the guide, check-ins, letters) end with his photo, handwritten "Jarred" and "FOUNDER, THE JARRED EFFECT", stacked and centered.
  - System emails (sign-in links, codes) skip the signature.
- **The two-pole mark** (orange then navy) closes the card.
- **The footer** says why they got the email. Every email except sign-in emails also has a one-click unsubscribe link.
- **Lots of space.** When something feels crowded, take something out rather than shrinking it.

## Dark mode

Gmail's phone app flips every color set in code but never touches images. So:

- **Text stays text.** Gmail flips the wordmark, headline and body cleanly.
- **Anything that must keep its brand colors is an image.** The navy guide panel is `assets/img/email-guide-panel.png`. Build new brand blocks the same way, at 2x size, with transparent rounded corners.
- **Never put the logo image in an email.** Its navy disappears on a dark background, and a white box or outline behind it looks cheap. The guide cover in the panel already carries the logo.
- **Check every new email in dark mode before sending it.** In the local preview, run this in the browser console:
  `document.head.append(Object.assign(document.createElement('style'),{textContent:'html,img{filter:invert(1) hue-rotate(180deg)}'}))`

## Voice

Write in the brand voice: warm, blunt, plain words, no hype. Sign-in emails get one short, calm line. Emails from Jarred can carry more story.

## Where each email lives

| Email | Sent by | File |
|---|---|---|
| The free guide | `api/subscribe.js` through Resend | `lib/guide-email.js` |
| Your quiz results (the Polarity Profile) | `api/quiz.js` through Resend | `lib/quiz-email.js` (copy comes from `app/content.js`) |
| App sign-in emails (sign-in link, confirm email, invite, change email, reset password, code) | Supabase | wording in `lib/auth-emails.js`; `scripts/build-auth-emails.js` writes them into `emails/supabase/` |

## Updating the Supabase sign-in emails

Supabase sends these itself, so the designs have to be pasted in:

1. Run `node scripts/build-auth-emails.js` (only needed after changing the layout or the wording).
2. Open Supabase → your project → **Authentication** → **Emails** → **Templates**.
3. For each template, set the **Subject**, then select everything in the **Body** box, delete it, and paste the whole file:

| Supabase template | Subject | Paste this file |
|---|---|---|
| Confirm signup | Confirm your email | `emails/supabase/confirm-signup.html` |
| Invite user | You're invited to the Other Half | `emails/supabase/invite.html` |
| Magic link | Your sign-in link | `emails/supabase/magic-link.html` |
| Change email address | Confirm your new email | `emails/supabase/change-email.html` |
| Reset password | Choose a new password | `emails/supabase/reset-password.html` |
| Reauthentication | Your confirmation code | `emails/supabase/reauthentication.html` |

4. Click **Save** under each one.

Leave the `{{ .ConfirmationURL }}`, `{{ .Token }}`, `{{ .Email }}` and `{{ .NewEmail }}` parts exactly as they are. Supabase fills them in.

## Testing

Addresses in the `TEST_EMAILS` setting in Vercel skip the once-a-day limit on the guide email. Gmail "+" versions count too (`you+test1@gmail.com`). Sign up on the live site with one of them to see the real thing.

To get a copy of every email (the guide, the quiz results and all six sign-in emails, with sample details filled in) in your inbox, run this in Terminal with your tester address:

```bash
curl -s -X POST https://thejarredeffect.com/api/send-previews -H 'content-type: application/json' -d '{"email":"letofsky11@gmail.com"}'
```

Their subjects start with "[Preview]". It works only for addresses in `TEST_EMAILS`, and sends at most one batch every 10 minutes.
