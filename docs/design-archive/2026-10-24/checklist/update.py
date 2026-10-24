import re, sys
src, out = sys.argv[1], sys.argv[2]
h = open(src, encoding='utf-8').read()
# strip the publish skeleton: page content starts at <title>, ends before </body></html>
h = h[h.index('<title>'):]
h = h[:h.rindex('</body></html>')].rstrip() + '\n'

def once(old, new):
    global h
    n = h.count(old)
    assert n == 1, (n, old[:80])
    h = h.replace(old, new)

def cut(start, end_marker):
    """replace from start through the first end_marker after it"""
    global h
    i = h.index(start); j = h.index(end_marker, i) + len(end_marker)
    return i, j

copy = lambda t: '<button type="button" data-copy="%s">Copy</button>' % t

# A. Where we are
i = h.index('<div class="nextup">'); j = h.index('<section class="stage" data-stage>')
h = h[:i] + '''<div class="nextup">
    <h2>Where we are <span class="it">· October 22</span></h2>
    <p><b>Done so far:</b> every account and the domain (stage 1); the guide, the quiz questions and Playbook version 1 (stage 2); sign-ups working for real (stage 3); and the quiz, live and unlisted at <code>thejarredeffect.com/app</code>, with results by email, share cards and a saved Ask (stage 4).</p>
    <p><b>Built since October 20, waiting on the <code>app</code> branch:</b> the daily app itself, with the welcome screen, Today and its check-in, changing or skipping a step with a reason, the seven-day strip and its icons, the evening sign-off and the week-one paywall; install steps for iPhone, Android and computers; the daily nudge; feedback that comes to you; four life questions in the quiz; and the privacy page updated for the app. None of it is live until you say so.</p>
    <p><b>Approved October 22:</b> the plan engine. It now has its own stage, 5 below, in the order you approved.</p>
    <p>Next, in order:</p>
    <ol>
      <li><b>Run the waiting database updates and add the nudge keys</b> (stage 4, about 15 min).</li>
      <li><b>Plan engine, part 1</b>: the playbook becomes knowledge, money and body first (stage 5). I start here.</li>
      <li><b>Stripe checkout</b>, when you’re back for it (stage 7).</li>
      <li><b>Privacy policy and terms</b>: your contact email and a publish date for the privacy page, then the terms (stage 2).</li>
      <li><b>The quick ones</b>: paste the branded sign-in emails (stage 1, 5 min) and Google Search Console (stage 3).</li>
      <li><b>Your story for the About page</b> (stage 2): the interview.</li>
    </ol>
  </div>
</div>

''' + h[j:]

# env table: nudge keys
once('''<td>Another long random string</td><td>App</td></tr>''', '''<td>Another long random string</td><td>App</td></tr>
            <tr><td><code>VAPID_PRIVATE_KEY</code></td><td><b>Secret</b></td><td>From the nudge keys command (stage 4)</td><td>App</td></tr>''')
once('''<td>Supabase publishable key (designed to be public)</td><td>App</td></tr>''', '''<td>Supabase publishable key (designed to be public)</td><td>App</td></tr>
            <tr><td><code>VAPID_PUBLIC_KEY</code></td><td>Config</td><td>From the same command (designed to be public)</td><td>App</td></tr>
            <tr><td><code>VAPID_SUBJECT</code></td><td>Config</td><td><code>mailto:jarred@thejarredeffect.com</code></td><td>App</td></tr>''')

# privacy step: what's left
once('''Have a lawyer read both before you charge money. This isn’t legal advice.</p>''', '''Have a lawyer read both before you charge money. This isn’t legal advice.</p>
        <p>The privacy page is updated for the app on the <code>app</code> branch. It still needs your contact email and a publish date.</p>''')

# B. stage 4: database step first
once('''<p>Me, about 2–3 focused days of building, on its own branch. This is a working version of the whole loop for you and a few testers, not yet ready for paying strangers.</p></div>
    <ol class="steps">''', '''<p>Me, about 2–3 focused days of building, on its own branch. This is a working version of the whole loop for you and a few testers, not yet ready for paying strangers.</p></div>
    <ol class="steps">
      <li class="step"><input type="checkbox" id="s-db" aria-labelledby="t-db"><div class="s-main">
        <div class="s-head"><label class="s-title" id="t-db" for="s-db">Run the waiting database updates and add the nudge keys</label><span class="chip you">You</span><span class="chip">15 min</span><button type="button" class="more" data-more>Show details</button></div>
        <p>The app saves feedback, nudges and the new life answers in Supabase, and those tables and columns don’t exist yet. The files are in the website folder, in <code>docs/supabase/</code>.</p>
        <ol><li>In Supabase: <b>SQL Editor → New query</b>. Paste all of <code>plan_feedback.sql</code> and click <b>Run</b>. Do the same, in a new query, for <code>plan_nudges.sql</code>.</li><li>For the quiz’s life questions, run these two lines in one more new query:</li></ol>
        <div class="cmd"><span>alter table public.quiz_results add column if not exists life jsonb;</span>''' + copy('alter table public.quiz_results add column if not exists life jsonb;') + '''</div>
        <div class="cmd"><span>alter table public.quiz_results add column if not exists words text;</span>''' + copy('alter table public.quiz_results add column if not exists words text;') + '''</div>
        <ol start="3"><li>Make the nudge keys: run this in Terminal. It prints a public key and a private key.</li></ol>
        <div class="cmd"><span>npx web-push generate-vapid-keys</span>''' + copy('npx web-push generate-vapid-keys') + '''</div>
        <ol start="4"><li>In Vercel, add <code>VAPID_PRIVATE_KEY</code> as <b>Secret</b>, and <code>VAPID_PUBLIC_KEY</code> and <code>VAPID_SUBJECT</code> as <b>Config</b> (the table in stage 1 has the values).</li><li>Make one new long random string with <code>openssl rand -hex 32</code>. Vercel hides the old <code>CRON_SECRET</code> for good, so edit it in Vercel and paste this new value.</li><li>In GitHub, open the repository’s <b>Settings → Secrets and variables → Actions → New repository secret</b>. Name it <code>NUDGE_CRON_SECRET</code> and paste the same value. That switches on the nudge schedule, which checks every 15 minutes.</li><li>Redeploy in Vercel. Nudges start reaching phones once the app branch goes live.</li></ol>
        <p class="send">“Database and nudges done”. I’ll check every table from here, and send a test nudge to your phone once the app is live.</p>
      </div></li>''')

# old plan generator step is now stage 5
i, j = cut('<li class="step"><input type="checkbox" id="s-a3"', '</div></li>')
h = h[:i] + h[j:].lstrip('\n').lstrip()
h = h.replace('</div></li>\n      <li class="step"><input type="checkbox" id="s-a4"', '</div></li>\n      <li class="step"><input type="checkbox" id="s-a4"')

# daily use: what's built
i, j = cut('<label class="s-title" id="t-a4" for="s-a4">Daily use</label>', '</ul>')
h = h[:i] + '''<label class="s-title" id="t-a4" for="s-a4">Daily use</label><span class="chip both">Today built</span><span class="chip me">Me</span><button type="button" class="more" data-more>Show details</button></div>
        <ul><li><b>Built:</b> the Today screen, the morning check-in (good, okay or hard), changing or skipping a step with a reason, the journal, the seven-day strip and the evening sign-off</li><li><b>Still to build:</b> Tries and data debriefs, the Price check, comfort check and your field, and the effort log</li><li>The week that adapts to what they did is in the plan engine, stage 5</li></ul>''' + h[j:]

once('''<p class="done-when">you can run the whole loop on your own phone, from quiz to a second, adapted week.</p>''',
     '''<p class="done-when">you can run the whole loop on your own phone, from the quiz to a full week of check-ins and steps, saved to your account.</p>''')

# C. new stage 5, then renumber the stages after it
li = lambda id_, title, chips, body: '''      <li class="step"><input type="checkbox" id="s-%s" aria-labelledby="t-%s"><div class="s-main">
        <div class="s-head"><label class="s-title" id="t-%s" for="s-%s">%s</label>%s<button type="button" class="more" data-more>Show details</button></div>
        %s
      </div></li>
''' % (id_, id_, id_, id_, title, ''.join('<span class="chip %s">%s</span>' % c for c in chips), body)

stage5 = '''<section class="stage" data-stage>
  <div class="wrap">
    <div class="stage-h"><span class="stage-n">5</span><h2>The plan engine</h2><span class="stage-c" data-count></span><p>Me, approved October 22. Every plan is written fresh for the person, in your voice as “I”, from your method and their own words, and it gets a little smarter every day. Each piece works on its own, so they ship one at a time, in this order.</p></div>
    <ol class="steps">
''' + li('pe1', 'The playbook becomes knowledge', [('me','Me'),('','Money and body first')],
 '''<ul><li>Each play becomes its principle, the move, why it works and where it’s unsafe, so the AI writes every step fresh instead of giving everyone the same words</li><li>Goal areas: money, body and health, work and business, relationships, a habit to stop, creative and learning, mindset and confidence</li><li>A path for each area, so a week moves forward. Money: see it, find the leak, automate it, add a speed bump, make it who you are, look back</li><li>Your voice as “I”: you, talking to them, encouraging and elegant with your humor, never inventing a story you haven’t told me</li><li>Every step still carries its play and side, so nothing drifts from your method</li></ul>
        <p class="done-when">money and body steps read like you wrote them for that one person, and you’ve approved the other areas too.</p>''') \
 + li('pe2', 'The plan writer and its second read', [('me','Me')],
 '''<ul><li>Claude Opus 5.5 writes each week as structured data, overnight before the new week opens</li><li>A second read checks every plan against your rules and your voice, and rewrites anything that slips</li><li>Rules that never bend: no fasting, extreme exercise, medication changes or big money moves, no investment advice, and no promised outcomes about money, love or health</li><li>Twenty sample people, with different types, goals and lives, to test quality before anyone else sees a plan</li><li>A review screen where you approve tester plans before they send</li></ul>
        <p class="done-when">you’d sign your name to all twenty sample plans.</p>''') \
 + li('pe3', 'A memory of each person', [('me','Me')],
 '''<ul><li>Every check-in, step, skip reason, “how did it feel” and note is recorded</li><li>Updated daily, so a step that felt hard today makes tomorrow gentler, and rounded up each week</li><li>“What I’ve learned about you” in You, theirs to correct or delete anytime</li><li>The journal stays on their phone unless they choose to share an entry</li></ul>''') \
 + li('pe4', 'Daily adapting and any number of steps', [('me','Me')],
 '''<ul><li>One time question at the end of the quiz: 10, 20, 30 or 45 minutes most days</li><li>The check-in sizes the day: good gets the full set, okay about half, and hard one small step</li><li>As many goals as they want, and anything past their pace is a bonus, so doing less never feels like falling behind</li><li>Never the same day twice: easy steps go up a level, hard ones get smaller, and a skip reason changes the approach</li><li>The day tracker labels up to three steps and becomes a compact “Steps 2 of 6” beyond that</li></ul>
        <p class="done-when">your second week adapts to what you did in the first.</p>''') \
 + li('pe5', 'Learning across everyone', [('me','Me'),('both','You approve weekly')],
 '''<ul><li>Patterns from everyone, with no names attached: which moves work for which area, type and life</li><li>Plans lean on what’s proven and try something new now and then, so the app keeps getting better</li><li>Each week I draft what the app learned, and you approve it before it shapes anyone’s plan</li><li>Built now, and it gets meaningful once a few hundred people use the app</li></ul>''') \
 + li('pe6', 'The honesty line', [('me','Me'),('','15 min')],
 '''<p>One quiet line in You and on the privacy page: “Your plan is written with help from AI, from my method and my rules.”</p>''') \
 + li('pe7', 'Keep Opus 5.5 affordable', [('me','Me'),('','Ongoing')],
 '''<ul><li>Claude Opus 5.5 for every plan and line, with no cheaper model swapped in</li><li>Your method, voice and playbook are cached, so each plan only pays for what’s new about that person</li><li>Overnight plans go through Anthropic’s batch service, which costs half</li><li>The estimate is about 30 cents per active person a week, around $1.30 a month against a $9–15 membership, and I measure the real number once it runs</li></ul>''') \
 + '''    </ol>
  </div>
</section>

'''
for a, b in (('7','8'), ('6','7'), ('5','6')):
    once('<span class="stage-n">%s</span>' % a, '<span class="stage-n">%s</span>' % b)
once('<section class="stage" data-stage>\n  <div class="wrap">\n    <div class="stage-h"><span class="stage-n">6</span><h2>Test with real people</h2>',
     stage5 + '<section class="stage" data-stage>\n  <div class="wrap">\n    <div class="stage-h"><span class="stage-n">6</span><h2>Test with real people</h2>')

# D. ready to charge: paywall built
once('''<label class="s-title" id="t-pay" for="s-pay">Membership and payments</label><span class="chip me">Me</span>''',
     '''<label class="s-title" id="t-pay" for="s-pay">Membership and payments</label><span class="chip both">Paywall built</span><span class="chip me">Me</span>''')
once('''<ul><li>Checkout, a billing page, and free-versus-member access</li>''',
     '''<ul><li>Built: the week-one paywall in Today, with their real numbers and one Unlock the full app button</li><li>Checkout, a billing page, and free-versus-member access</li>''')

# after launch: nudge built, shared loop moved to stage 5
once('''<label class="s-title" id="t-push" for="s-push">Phone notifications</label><span class="chip me">Me</span><button type="button" class="more" data-more>Show details</button></div><p>For people who install the app to their home screen.</p>''',
     '''<label class="s-title" id="t-push" for="s-push">Smarter phone notifications</label><span class="chip both">Daily nudge built</span><span class="chip me">Me</span><button type="button" class="more" data-more>Show details</button></div><p>The daily nudge at the time each person picks is built and switches on with stage 4’s database step. Next, nudges that follow their progress, for people who install the app to their home screen.</p>''')
i, j = cut('<li class="step"><input type="checkbox" id="s-loop"', '</div></li>')
h = h[:i] + h[j:].lstrip()
h = h.replace('</div></li>\n      <li class="step"><input type="checkbox" id="s-levels"', '</div></li>\n      <li class="step"><input type="checkbox" id="s-levels"')

open(out, 'w', encoding='utf-8').write(h)
print('ok', len(h))
