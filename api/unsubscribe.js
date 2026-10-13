// /api/unsubscribe — the link at the bottom of every email.
//   GET  (someone clicks the link)            → marks the contact unsubscribed, then shows /unsubscribed.html
//   POST (Gmail/Yahoo one-click unsubscribe)  → same, answers 200
// Links are signed with UNSUBSCRIBE_SECRET, so nobody can unsubscribe someone else.
const { resend, readUnsubscribe } = require('../lib/resend');

module.exports = async function unsubscribe(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const email = readUnsubscribe(url.searchParams.get('e'), url.searchParams.get('t'));
  const oneClick = req.method === 'POST';

  if (!email) {
    if (oneClick) { res.statusCode = 400; return res.end('Invalid link'); }
    res.statusCode = 303;
    res.setHeader('Location', '/unsubscribed.html?link=invalid');
    return res.end();
  }

  let done = false;
  if (process.env.RESEND_API_KEY) {
    const r = await resend('/contacts/' + encodeURIComponent(email), 'PATCH', { unsubscribed: true });
    done = r.ok;
    if (!r.ok) console.error('unsubscribe: update failed', r.status, r.data);
  }

  res.setHeader('Cache-Control', 'no-store');
  if (oneClick) { res.statusCode = done ? 200 : 500; return res.end(done ? 'Unsubscribed' : 'Try again'); }
  res.statusCode = 303;
  res.setHeader('Location', done ? '/unsubscribed.html' : '/unsubscribed.html?link=retry');
  return res.end();
};
