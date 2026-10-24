import json, sys
CH = []  # (id, where, file, old, new)
def c(i, where, f, old, new): CH.append((i, where, f, old, new))

# ---- the three questions (playbook + quiz types)
c('q-price', 'Day 4 / quiz: The Price', 'lib/playbook.js',
  "{ id: 'price', name: 'The Price', ask: 'What will this really cost me, and will I still pay it on a bad day?', followUps: ['What would I have to give up, even for a while?', 'Which part of the price am I pretending isn’t there?'] },",
  "{ id: 'price', name: 'The Price', ask: 'What will this actually cost you, and would you still pay it on a hard day?', help: 'Think time, money, sleep, comfort, the things you’d have to say no to. Wanting it is free. Knowing the price is what gets you ready to pay it.', followUps: ['What would you have to give up, even for a little while?', 'Which part of the price are you hoping you can skip?'] },")
c('q-payoff', 'Day 4 / quiz: The Payoff', 'lib/playbook.js',
  "{ id: 'payoff', name: 'The Payoff', ask: 'What am I getting out of not having it yet?', followUps: ['What does staying here protect me from?', 'Who would I have to become to let that go?'] },",
  "{ id: 'payoff', name: 'The Payoff', ask: 'Is there a hidden upside to not having it yet?', help: 'Be honest. Maybe it’s easier, or safer, or nobody can judge you for trying. Most of us have one, and naming yours loosens its grip.', followUps: ['What would you have to face if you really went for it?', 'What would you do with that time and energy if the excuse were gone?'] },")
c('q-fear', 'Day 4 / quiz: The Fear on the far side', 'lib/playbook.js',
  "{ id: 'fear', name: 'The Fear on the far side', ask: 'If I got it tomorrow, what would I be afraid of?', followUps: ['What would people expect of me then?', 'What would I lose that I’m used to?'] }",
  "{ id: 'fear', name: 'The Fear on the far side', ask: 'If you got it tomorrow, what would scare you a little?', help: 'Getting what you want changes things. People expect more, an old excuse disappears, life looks different. Notice the part that makes you flinch.', followUps: ['What would people expect from you then?', 'What would you miss about how things are now?'] }")
for t, q, hint_old, hint_new in [
  ('dreamer', 'price', "Wanting is free. Knowing the price is what makes you ready to pay it.", "Think time, money, sleep, comfort. Wanting it is free. Knowing the price is what gets you ready to pay it."),
  ('achiever', 'payoff', "Sometimes staying busy feels safer than getting there.", "Be honest. Staying busy can feel safer than actually getting there. Most of us have a hidden upside, and naming yours loosens its grip."),
  ('excavator', 'fear', "Sometimes the thinking is a way to stay safe.", "Getting what you want changes things. Sometimes all the thinking is a way of not finding out."),
  ('pendulum', 'price', "Your good weeks can pay it. Plan for the bad ones.", "Your great weeks can pay it easily. The real question is whether your hard weeks can too."),
  ('calibrated', 'fear', "Balanced people still flinch at the finish line. Notice where you would.", "Even really balanced people flinch right before the finish line. Notice where you would.")]:
  ask_old = {'price': 'What will this really cost me, and will I still pay it on a bad day?', 'payoff': 'What am I getting out of not having it yet?', 'fear': 'If I got it tomorrow, what would I be afraid of?'}[q]
  ask_new = {'price': 'What will this actually cost you, and would you still pay it on a hard day?', 'payoff': 'Is there a hidden upside to not having it yet?', 'fear': 'If you got it tomorrow, what would scare you a little?'}[q]
  c('quiz-q-' + t, 'Quiz result, ' + t + ': the question', 'app/content.js', "ask: '" + ask_old + "', hint: '" + hint_old + "' }", "ask: '" + ask_new + "', hint: '" + hint_new + "' }")
c('pb-133', 'Playbook step: the Price again', 'lib/playbook.js', "'Answer the Price question again: what will this really cost me, and will I still pay it on a bad day?',", "'Ask yourself the Price question again: what will this actually cost you, and would you still pay it on a hard day?',")
c('pb-261', 'Playbook step: a yes and its price', 'lib/playbook.js', "'Ask the price: what will this yes really cost me, and what will I have to say no to because of it?',", "'Ask the price: what will this yes actually cost you, and what will you have to say no to because of it?',")
c('pb-422', 'Playbook step: the question that fits', 'lib/playbook.js', "'Ask the shadow question that fits: the Price, the Payoff, or the Fear on the far side.',", "'Ask yourself the question that fits: what it’ll really cost you, whether there’s a hidden upside to not having it yet, or what would scare you about getting it.',")
c('pb-fri4', 'Playbook step: The price check', 'lib/playbook.js', "what: 'Answer in writing: What will this really cost me, and will I still pay it on a bad day?'", "what: 'Answer in writing: what will this actually cost you, and would you still pay it on a hard day?'")
# labels
c('lbl-plan', 'Day 4 card title', 'lib/plan.js', "title: 'A question to sit with'", "title: 'One honest question'")
c('lbl-quiz', 'Quiz result: question label', 'app/app.js', "'<p class=\"oh-sec-k\">A question to sit with</p>' +", "'<p class=\"oh-sec-k\">One honest question</p>' +")
c('lbl-quiz-name', 'Quiz result: drop the tool name under the question', 'app/app.js', "          '<p class=\"oh-shadow-by\">— ' + esc(t.question.name) + '</p>' +\n", "")
c('lbl-fold', 'Folded day 4 bar', 'app/plan.js', "'A question to sit with', '', '')", "'One honest question', '', '')")
c('lbl-email', 'Results email: question label', 'lib/quiz-email.js', "kick('A question to sit with')", "kick('One honest question')")
c('lbl-email-txt', 'Results email (plain text): question label', 'lib/quiz-email.js', "    'A question to sit with',", "    'One honest question',")

# ---- quiz type copy, said like a friend
c('dreamer-read', 'Quiz: the Dreamer, the read', 'app/content.js', "read: 'You’ve got the wanting part down: the vision, the belief, the feeling of it. What’s missing is the doing part. Small daily steps that still happen on a bad day.',",
  "read: 'Honestly? You’ve already got the part most people never get: you can see it, believe it and feel it. What slips is the everyday doing, the small steps that still happen on a day you don’t feel like it. That’s the half we’re going to build.',")
c('dreamer-strength', 'Quiz: the Dreamer, strength', 'app/content.js', "strength: 'You can feel a future before it exists. That’s real fuel, and most people don’t have it.',", "strength: 'You can feel a future before it exists. That’s real fuel, and most people never get it. Don’t lose that.',")
c('dreamer-cost', 'Quiz: the Dreamer, cost', 'app/content.js', "cost: 'Feeling it isn’t the same as living it. Without small daily actions, your gut never gets proof, so the good feeling fades instead of sticking.',", "cost: 'Here’s the catch: feeling it isn’t living it. Without small daily actions, your gut never gets proof, so the good feeling fades instead of sticking around.',")
c('achiever-read', 'Quiz: the Achiever, the read', 'app/content.js', "read: 'You can outwork almost anyone. What’s missing is the reason underneath the work, and letting someone else carry part of it.',", "read: 'You can outwork almost anyone, and people know they can count on you. What’s missing is the why underneath all that work, and letting someone else carry some of it for once.',")
c('achiever-cost', 'Quiz: the Achiever, cost', 'app/content.js', "cost: 'Effort without a reason wears you down. The want behind the work goes quiet, and no one else gets to help carry it.',", "cost: 'But effort without a reason wears you down. The want behind the work goes quiet, and you end up carrying it all alone.',")
c('excavator-read', 'Quiz: the Excavator, the read', 'app/content.js', "read: 'You understand your patterns better than most people ever will. What’s missing is action: one small step that proves the insight changed something.',", "read: 'You understand yourself better than most people ever will. What’s missing is the next step: one small action that proves all that insight actually changed something.',")
c('excavator-cost', 'Quiz: the Excavator, cost', 'app/content.js', "cost: 'Understanding a pattern doesn’t change it. Your gut believes what you do, not what you know.',", "cost: 'The tricky part: understanding a pattern doesn’t change it. Your gut believes what you do, not what you know.',")
c('pendulum-read', 'Quiz: the Pendulum, the read', 'app/content.js', "read: 'Your good weeks are really good, and then the crash comes. What’s missing is a plan for the crash, so it stops costing you the next good week.',", "read: 'When you’re on, you’re really on. Then the crash comes, and you spend a week climbing back out. What’s missing isn’t more fire. It’s a plan for the crash, so it stops stealing your next good week.',")
c('pendulum-cost', 'Quiz: the Pendulum, cost', 'app/content.js', "cost: 'A high doesn’t last on its own. Every big week borrows energy from the next one, so the crash isn’t random. It’s the other half of the pattern.',", "cost: 'A high doesn’t last on its own. Every big week borrows energy from the next one, so the crash isn’t bad luck. It’s the other half of the same pattern.',")
c('calibrated-read', 'Quiz: the Calibrated, the read', 'app/content.js', "read: 'You balance both sides better than most people. Your work now is keeping that balance when life gets harder.',", "read: 'You hold both sides better than most people, and that’s worth saying out loud. Your work now is keeping that balance when life gets loud.',")
c('quiz-lead', 'Quiz start: the lead', 'app/app.js', "Eighteen quick choices. You’ll see your balance, your type, and the half you’ve been missing.", "Eighteen quick choices, about two minutes. You’ll see your balance, your type, and the half you’ve been missing.")

# ---- the app's everyday lines
c('ci-full', 'App: good day reply', 'lib/playbook.js', "full: 'Good day. Do the whole step, and enjoy it.',", "full: 'Love that. Go for the whole step, and enjoy it.',")
c('ci-half', 'App: okay day reply', 'lib/playbook.js', "half: 'Okay day. Do a shorter version. It still counts.',", "half: 'Okay day? That’s real life. Do a shorter version, it still counts.',")
c('ci-halfmany', 'App: okay day reply, several goals', 'lib/playbook.js', "halfMany: 'Okay day. Pick one goal and do its step. That counts as the day.',", "halfMany: 'Okay day? Pick one goal and do its step. That’s the whole day, done.',")
c('ci-rough', 'App: hard day reply', 'lib/playbook.js', "rough: 'Hard day. Just the small version today. It counts the same.'\n    },\n    tomorrow:", "rough: 'Hard day? Be easy on yourself. Just the small version today. It counts the same.'\n    },\n    tomorrow:")
c('tomorrow', 'App: after the day is done', 'lib/playbook.js', "tomorrow: 'That’s today, done. Rest easy.',", "tomorrow: 'That’s today, done. Go enjoy the rest of it.',")
c('future', 'App: a future day', 'lib/playbook.js', "future: 'Today’s step is the only one that matters.',", "future: 'No need to look ahead. Today’s step is the only one that matters.',")
c('missed', 'App: a missed day', 'lib/playbook.js', "missedDay: 'This one slipped by. That’s okay. No catch-up, just today.',", "missedDay: 'This one slipped by, and that’s okay. No catch-up. Just today.',")
c('ci-sub', 'App: check-in line', 'app/plan.js', "<p class=\"ci-s\">Your steps adjust to fit.</p>", "<p class=\"ci-s\">Be honest. Your steps adjust to fit.</p>")
c('ci-note', 'App: check-in note', 'app/plan.js', "'What’s going on today? Optional, and it helps shape your next week.'", "'Want to tell me what’s going on? It helps shape next week.'")
c('lookback', 'App: the look back', 'app/plan.js', "Five minutes to see your week clearly, before the next one.", "Grab five minutes. Let’s look at your week clearly before the next one.")

mode = sys.argv[1]
if mode == 'apply':
  for i, where, f, old, new in CH:
    s = open(f).read()
    if s.count(old) != 1: print('MISS', i, f, s.count(old)); continue
    open(f, 'w').write(s.replace(old, new))
  print('applied', len(CH))
else:
  json.dump([{'id': i, 'where': w, 'before': o.strip().strip(','), 'after': n.strip().strip(',')} for i, w, f, o, n in CH], open(sys.argv[2], 'w'), ensure_ascii=False, indent=1)
