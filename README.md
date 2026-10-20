# The Jarred Effect — website

Static HTML, CSS and JavaScript with no build step, plus two small Vercel functions that handle email sign-ups through Resend.

## What's in here

| Path | What it is |
|---|---|
| `index.html` | Homepage |
| `about.html` | About page |
| `opt-in.html` | Get the guide page |
| `compare.html` | Manifestation methods compared: what each approach gets right and leaves out |
| `guide/index.html` | Makes the `/guide` short link work on any server, including a plain local one: it forwards to `opt-in.html` |
| `privacy.html` | Privacy policy, a **starter draft** to review before launch |
| `unsubscribed.html` | Where the unsubscribe link in emails lands |
| `404.html` | Page-not-found screen (Vercel serves it for any missing URL) |
| `styles.css` | Styles every page shares: colours, type, buttons, forms, floating bar, guide cover, footer |
| `assets/css/*.css` | Each page's own styles, loaded after `styles.css` |
| `script.js` | The small runtime every page uses (explained below) |
| `assets/js/*.js` | Each page's behaviour: forms, the floating bar, the homepage picker, the About chapter list |
| `assets/img`, `assets/video` | Images, icons, the share image and the compressed homepage video |
| `api/subscribe.js` | Receives every sign-up: saves the contact in Resend and emails the guide |
| `api/unsubscribe.js` | Handles the unsubscribe link in emails, including Gmail and Yahoo one-click unsubscribe |
| `lib/` | Code shared by the two functions: the layout every email is built from (`lib/email-layout.js`), the guide email (`lib/guide-email.js`) and the app's sign-in emails (`lib/auth-emails.js`) |
| `api/send-previews.js` | Emails a tester a "[Preview]" copy of every email (see `docs/email-design.md`) |
| `docs/email-design.md` | The email design rules, and how to update the app's sign-in emails in Supabase |
| `scripts/`, `emails/supabase/` | Builds the app's branded sign-in emails for Supabase (not part of the live site) |
| `vercel.json` | Redirects `/guide` to `opt-in.html` on the live site, plus security headers |
| `sitemap.xml`, `robots.txt`, `llms.txt` | Search and AI-assistant discovery (see "Search and AI visibility" below) |

## How the pages work

Every page is real HTML, so you can edit text and links directly in the `.html` files.

The interactive parts are driven by the page's script in `assets/js/`. It keeps a little state (which pains are picked, whether the form was sent, and so on). `script.js` applies that state to the markup through a few attributes:

- `data-text="key"` and `data-tpl="Sent to {{ email }}"` fill in text.
- `<x-if data-if="key">` shows or hides a block.
- `data-class="key"` adds classes.
- `data-attr="aria-pressed:p1"` sets attributes.
- `data-on-click="key"` (also `-submit`, `-input` and `-focusout`) connects handlers.

If you rename or remove an element that has one of these attributes, check the page's script for the same key.

## Site zoom (so the homepage hero fits the window)

All sizes in the CSS are in `rem`, and `1rem` is the browser's base size (16px by default) multiplied by `--z`. The rules sit at the top of `styles.css`, under "site zoom".

- On desktop windows at least 1180px wide that are shorter than the homepage hero (1010px tall at full size), `--z` steps down so the whole hero fits on screen. It works like browser zoom-out, but automatically. For example, a 1512×850 laptop window renders at 84%, and 1440×800 renders at 79%.
- It never goes below 75%, so small text stays readable. On windows shorter than about 760px, the bottom of the hero may need a short scroll.
- The About and guide heroes use the same height on desktop (`63.125rem`, set in `assets/css/about.css` and `assets/css/guide.css`), so they fill the window the same way. If the homepage hero's height changes, update that number in both files.
- Phones and tablets (under 1180px wide) always render at 100%. There the hero stacks and scrolls as designed.
- To change it, edit the `@media … {:root{--z:…}}` lines. Each line sets the zoom for windows up to that height.
- When you add CSS, use `rem` (px ÷ 16) so new sizes scale with the rest. Hairlines of 1–2px can stay in `px`.

## Search and AI visibility

- Every main page has a title, description, canonical URL, social-share tags and structured data (JSON-LD) in its `<head>`. The homepage and `compare.html` also mark up their FAQs, which is what Google and AI assistants quote.
- All of these use **`https://thejarredeffect.com`**. If the site goes live on a different domain, find and replace that address across the `.html` files, `sitemap.xml`, `robots.txt` and `llms.txt`.
- When you add a page, add it to `sitemap.xml`. When you change the homepage FAQ, update the FAQ block in the homepage's structured data to match.
- After launch, add the site to Google Search Console and Bing Webmaster Tools and submit `sitemap.xml`.

## Deploy (GitHub + Vercel)

1. Put this folder in a GitHub repository, either as the repo itself or as a `redesign/` folder inside a bigger repo.
2. In Vercel, choose **Add New → Project** and import the repo.
   - Framework preset: **Other**. Build command: none. Output directory: leave as is.
   - If the site sits in a `redesign/` folder inside the repo, set **Root Directory** to `redesign`.
3. Deploy. The pages work right away. The forms show "Sign-ups aren't switched on yet" until the Resend steps below are done.
4. Add your domain under **Settings → Domains**.

## Turn on sign-ups (Resend)

1. In [Resend](https://resend.com), add and verify your sending domain (it gives you DNS records to add).
2. Create an API key with full access, which is needed for contacts.
3. Optional: create a segment for guide readers and copy its ID.
4. Host the guide itself somewhere public. One option is to drop the PDF in `assets/guide/` and use `https://yourdomain.com/assets/guide/<file>.pdf`.
5. In Vercel, go to **Settings → Environment Variables**, add these, then redeploy:

| Variable | Required | Example |
|---|---|---|
| `RESEND_API_KEY` | yes | `re_…` |
| `RESEND_FROM` | yes | `Jarred <jarred@yourdomain.com>` (that domain must be verified in Resend) |
| `GUIDE_URL` | yes | the link the email's button opens |
| `SITE_URL` | yes | `https://www.yourdomain.com` (used for email images and unsubscribe links) |
| `UNSUBSCRIBE_SECRET` | yes | any long random string; it signs unsubscribe links |
| `RESEND_SEGMENT_ID` | no | adds every new contact to that segment |
| `TEST_EMAILS` | no | comma-separated addresses that skip the once-a-day guide email limit, for testing (Gmail `+` versions count) |
| `RESEND_REPLY_TO` | no | where replies go (defaults to the from address) |

What happens on submit:

- The form posts to `/api/subscribe`.
- The contact is created in Resend. If they were already on the list, they're re-subscribed.
- The guide email goes out with List-Unsubscribe headers. Each address gets at most one guide email per day, so double clicks don't stack.
- The page only shows "It's on its way" after Resend accepts the email. Failures show a friendly retry message.

A hidden field catches simple bots. If spam shows up anyway, the next step is rate limiting (Vercel Firewall rules, or a KV-backed counter in `api/subscribe.js`).

## Before launch

- [ ] **Privacy** (`privacy.html`): fill in the highlighted placeholders (contact email, date), review every line, and delete the "Starter draft" note. This isn't legal advice.
- [ ] **About story** (`about.html`): the five "Your words go here" boxes and the photo slot need your real story and photo.
- [ ] **Proof slots** (`index.html` hero, `opt-in.html`): add a real reader count or quote, or delete the slot. Never use a made-up one.
- [ ] **Share image:** `og:image` is `/assets/img/og-image.jpg`. Some platforms need a full URL, so once your domain is live, change it on each page to `https://yourdomain.com/assets/img/og-image.jpg`.
- [ ] **Guide email copy** (`lib/guide-email.js`): read it and make it sound like you.
- [ ] **Test sign-up:** after setting the variables, sign up with your own address from each page, then click the unsubscribe link.
- [ ] **Sitemap:** optional. Add `sitemap.xml` once the domain is final.

## Local preview

- **Just looking:** open the `.html` files in a browser, or run `python3 -m http.server 4321` in this folder and go to `http://localhost:4321`. Every page and link works, including `/guide`. The forms can't send, though, because a plain file server doesn't run the `api/` functions. They say "this local preview can't send them" instead.
- **Full site with sign-ups:** `npx vercel dev`, with the variables above in a local `.env` file. `.env` is git-ignored, so never commit it.
- `.claude/` (local Claude Code settings, such as the preview server config) is git-ignored too.
