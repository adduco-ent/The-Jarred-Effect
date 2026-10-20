// The Other Half playbook, version 1 (draft for Jarred's review).
// The AI plan generator only applies what's in here; it never invents its own method. Jarred approves every
// change, and each version is kept, so any plan can be traced back to the playbook that made it.
// Everything comes from the guide (held not high, the minimum rep, receipts, the 2:47 check, the Tuesday test,
// the three shadow questions) and Jarred's principles. Steps are written so anyone gets them in seconds.

module.exports = {
  version: 1,

  // How a 7-day plan is put together. The generator follows these in order.
  planShape: [
    'Every plan is built around the person’s Ask: the one thing they want. Examples are tailored to it; titles stay as written.',
    'Most days build their other half: the side they use least. One or two days build the second-weakest side.',
    'Day 1 is the easiest step in the plan. Start small so the first day is a win.',
    'One stretch step per week, a little past comfortable. For people who lean on wanting, that’s an action; for people who lean on effort, it’s rest or a hand-off.',
    'Day 4 is the shadow question for their type, in place of a step.',
    'Day 7 is a 5-minute look back: what you did, what changed, what to keep for next week.',
    'Every day has a rough-day version. A rough-day version done counts as a day done.',
    'No step takes more than 20 minutes. Most take 10 or less.'
  ],

  // The tone every plan is written in (Jarred's own words: genuine, blunt, empathetic, warm, plain).
  voice: [
    'Plain words. Short sentences. Every line understood in seconds.',
    'Name the real issue first, but say how it feels before saying what to do. Never blame.',
    'Warm and blunt. Celebrate small wins; praise only what they actually did.',
    'No hype, no fake urgency, no "abundance", "vibration" or "universe" filler.',
    'No diminishing words like "grind" or "hustle". If their own words use them, quote them.',
    'Never say "failed". A step not done is information, not a verdict.',
    'Offer, don’t command. They know their life better than any method. If their gut says no, they can skip a step and note why.',
    'Never invent stories about Jarred. Use only stories he has supplied.'
  ],

  // Rules the generator can never break.
  hardRules: [
    'Coaching and reflection, not therapy or medical advice. Never diagnose.',
    'If anything they write suggests crisis, self-harm or danger, stop the plan and show crisis resources instead.',
    'Never promise outcomes. No "you will manifest", no guarantees about money, love or health.',
    'Never push past safety: no fasting, extreme exercise, quitting medication, or big money moves as steps.',
    'Only use steps and questions from this playbook. Tailor the examples, never the method.',
    'Keep it belief-neutral: it can be read as energetic, psychological, or just how people change.'
  ],

  // What building each side means, in one line.
  sides: {
    desire: 'Knowing what you really want, and letting yourself want it.',
    discipline: 'Small steps you keep, even on a bad day.',
    faith: 'Believing it can happen, enough to act before every doubt is solved.',
    friction: 'Staying with the hard part, and hearing what fear is telling you.',
    ambition: 'Reaching for the next level, a little past comfortable.',
    acceptance: 'Being at peace with now, and enjoying what you’ve built.',
    control: 'Owning the parts only you can do.',
    trust: 'Letting other people carry part of the load.'
  },

  // The steps. `side` is the side it builds. `minutes` is the most it takes.
  reps: [
    // Discipline: follow-through that survives a bad day
    { id: 'dis-1', side: 'discipline', title: 'One tiny step', minutes: 10, what: 'Do the smallest daily step toward your Ask, at the same time as yesterday.', example: 'One page before your phone. Shoes on, ten minutes, done.', rough: 'Two minutes. Open it, start it, stop.' },
    { id: 'dis-2', side: 'discipline', title: 'Same time, same place', minutes: 5, what: 'Pick a fixed time and place for your daily step, and put it in your calendar.', example: '7:30 a.m., kitchen table, right after coffee.', rough: 'Write the time on a sticky note.' },
    { id: 'dis-3', side: 'discipline', title: 'Your bad-day backup', minutes: 5, what: 'Write the version of your step you’ll do when the day goes sideways.', example: 'If I’m wiped, I walk for five minutes instead of running.', rough: 'Say it out loud once.' },
    { id: 'dis-4', side: 'discipline', title: 'Keep one promise', minutes: 10, what: 'Make one small promise to yourself this morning, and keep it by tonight.', example: 'I’ll send the email before lunch.', rough: 'Make the promise smaller. Then keep it.' },
    { id: 'dis-5', side: 'discipline', title: 'The receipt', minutes: 3, what: 'Tonight, write one line about what you actually did toward your Ask today.', example: 'Wrote 200 words. Didn’t want to. Did it anyway.', rough: 'One word: done, or not yet.' },
    { id: 'dis-6', side: 'discipline', title: 'Start before you feel like it', minutes: 5, what: 'Start today’s step before you feel ready. Give it five minutes, then decide whether to keep going.', example: 'Open the laptop and write one sentence.', rough: 'Two minutes, then you can stop.' },

    // Desire: reconnecting with the want
    { id: 'des-1', side: 'desire', title: 'Why, three times', minutes: 5, what: 'Write why you want your Ask. Then ask “why?” about your answer, twice more.', example: 'More money → more freedom → more time with my kids.', rough: 'Just the first why.' },
    { id: 'des-2', side: 'desire', title: 'The want list', minutes: 5, what: 'Write five things you want that have nothing to do with work.', example: 'A slow Sunday. A trip with no laptop. Learning to cook.', rough: 'Write one.' },
    { id: 'des-3', side: 'desire', title: 'Picture a normal day after', minutes: 3, what: 'Close your eyes and picture an ordinary day once your Ask is real. Notice where you are and how your body feels.', example: 'Morning, coffee, no dread about the inbox.', rough: 'One minute is enough.' },
    { id: 'des-4', side: 'desire', title: 'One thing just because', minutes: 15, what: 'Do one thing today only because you enjoy it.', example: 'Play music loud while you cook. Take the long way home.', rough: 'Five minutes of it.' },
    { id: 'des-5', side: 'desire', title: 'Drop one should', minutes: 5, what: 'Cross off one task that’s a “should”, not a “want”, and don’t replace it.', example: 'Skip the extra report nobody asked for.', rough: 'Move it to next week.' },
    { id: 'des-6', side: 'desire', title: 'Finish the sentence', minutes: 2, what: 'Finish this sentence in writing: “When this is real, I’ll finally feel ___.”', example: 'When this is real, I’ll finally feel like I’m not behind.', rough: 'Finish it in your head.' },

    // Faith: believing enough to act
    { id: 'fai-1', side: 'faith', title: 'One proof it’s possible', minutes: 5, what: 'Find one person who already did something like your Ask, and note how they started.', example: 'Read how someone opened their studio at 40.', rough: 'Remember one hard thing you’ve already done.' },
    { id: 'fai-2', side: 'faith', title: 'Act with the doubt still there', minutes: 10, what: 'Take one step today while one doubt is still open.', example: 'Post the first draft, even though it isn’t perfect.', rough: 'Do the smallest step, doubt and all.' },
    { id: 'fai-3', side: 'faith', title: 'The evidence list', minutes: 5, what: 'Write three times something worked out that you once doubted.', example: 'The move. The job I thought I wouldn’t get. Running the first mile.', rough: 'Write one.' },
    { id: 'fai-4', side: 'faith', title: 'Ask for a yes', minutes: 10, what: 'Ask someone for something you want, and let them answer.', example: 'Ask for the meeting, the intro or the better rate.', rough: 'Write the ask today. Send it tomorrow.' },
    { id: 'fai-5', side: 'faith', title: 'A window for worry', minutes: 10, what: 'Give your doubts ten minutes on paper. Then close the notebook and do your next thing.', example: 'Write every “what if” you’ve got. Close it at minute ten.', rough: 'Two minutes.' },
    { id: 'fai-6', side: 'faith', title: 'What if it works?', minutes: 3, what: 'Write what happens if your Ask goes right.', example: 'I’d have a business that pays the bills, and I’d stop dreading Mondays.', rough: 'One sentence.' },

    // Friction: staying with what's hard
    { id: 'fri-1', side: 'friction', title: 'The 2:47 check', minutes: 1, what: 'Set an alarm for mid-afternoon. When it goes off, ask: What am I feeling in my gut right now? Is it what I’d tell someone? Can I feel it and still do my next task?', example: 'Gut says anxious. I’d say “fine”. Yes, I can still send the proposal.', rough: 'Just the last question. Yes means you’re holding steady.' },
    { id: 'fri-2', side: 'friction', title: 'Name the hard part', minutes: 5, what: 'Write the one part of your Ask you’ve been avoiding.', example: 'Talking about money. Asking for help. Hearing no.', rough: 'Say it out loud once.' },
    { id: 'fri-3', side: 'friction', title: 'Two minutes with it', minutes: 2, what: 'When fear shows up today, don’t fix it. Feel it for two minutes, then do the next thing.', example: 'Fear before the call. Sit with it. Dial anyway.', rough: 'Three slow breaths.' },
    { id: 'fri-4', side: 'friction', title: 'The price check', minutes: 5, what: 'Answer in writing: What will this really cost me, and will I still pay it on a bad day?', example: 'Earlier mornings. Less TV. Yes, if the step stays small.', rough: 'Answer just the first half.' },
    { id: 'fri-5', side: 'friction', title: 'Five more minutes', minutes: 5, what: 'When you want to quit today’s step, stay five more minutes.', example: 'Want to stop writing at minute ten. Write until fifteen.', rough: 'One more minute.' },
    { id: 'fri-6', side: 'friction', title: 'What did I miss?', minutes: 5, what: 'Pick one thing that didn’t go your way this week and write what it showed you.', example: 'The pitch flopped. I never asked what they actually needed.', rough: 'One line.' },

    // Ambition: reaching a little further
    { id: 'amb-1', side: 'ambition', title: 'The next level', minutes: 5, what: 'Write what the next level of your Ask looks like, one step past where you are now.', example: 'From running 2 miles to running 3 without stopping.', rough: 'One line.' },
    { id: 'amb-2', side: 'ambition', title: 'One stretch', minutes: 15, what: 'Do one thing a little bigger than comfortable.', example: 'Pitch the client you think is out of reach.', rough: 'Draft it today. Send it tomorrow.' },
    { id: 'amb-3', side: 'ambition', title: 'Resting or settling?', minutes: 3, what: 'Ask yourself: am I resting, or am I settling? Comfort is a place to rest, not a place to live.', example: 'Resting: I chose it, it’s short, I feel recharged. Settling: I’m drifting and avoiding.', rough: 'Just ask the question.' },
    { id: 'amb-4', side: 'ambition', title: 'Raise one standard', minutes: 10, what: 'Pick one small thing and do it a notch better than usual.', example: 'Proofread the email twice. Add one more set.', rough: 'Do one tiny part better.' },
    { id: 'amb-5', side: 'ambition', title: 'Say it out loud', minutes: 5, what: 'Tell one person what you want next.', example: '“I want to launch this by spring.”', rough: 'Write it where you’ll see it.' },
    { id: 'amb-6', side: 'ambition', title: 'Try one new thing', minutes: 15, what: 'Try something you’ve never done that connects to your Ask. There’s no failing a try, only finding out.', example: 'One beginner class. One cold email. One new route.', rough: 'Look it up and save it for later this week.' },

    // Acceptance: enjoying now
    { id: 'acc-1', side: 'acceptance', title: 'Count what’s done', minutes: 5, what: 'Write five things you’ve already built or finished.', example: 'Paid off the card. Kept the job. Learned to say no.', rough: 'Write one.' },
    { id: 'acc-2', side: 'acceptance', title: 'Decide what’s enough', minutes: 2, what: 'Before you start today, decide what “enough” looks like. Stop there.', example: 'Three emails sent, then done for the day.', rough: 'Pick one thing that counts as enough.' },
    { id: 'acc-3', side: 'acceptance', title: 'Mark a win', minutes: 5, what: 'Mark one win from this week on purpose. Tell someone, or treat yourself.', example: 'Text a friend: “I finished the draft.”', rough: 'Say it to yourself.' },
    { id: 'acc-4', side: 'acceptance', title: 'One slow thing', minutes: 15, what: 'Do one thing slowly today, with no goal attached.', example: 'Eat lunch without your phone.', rough: 'Five minutes of it.' },
    { id: 'acc-5', side: 'acceptance', title: 'Rest on purpose', minutes: 20, what: 'Schedule real rest and keep it like a meeting.', example: 'Twenty minutes outside, no podcast.', rough: 'Ten minutes.' },
    { id: 'acc-6', side: 'acceptance', title: 'Grateful, with proof', minutes: 3, what: 'Name one thing you’re grateful for, and one thing you did to get it.', example: 'Grateful for my health. I walked every day this month.', rough: 'Just the first half.' },

    // Control: owning your part
    { id: 'con-1', side: 'control', title: 'Own one piece', minutes: 10, what: 'Pick the one part of your Ask only you can do, and do it today.', example: 'Write the pitch. Nobody else can say it your way.', rough: 'Five minutes on it.' },
    { id: 'con-2', side: 'control', title: 'Decide, don’t drift', minutes: 5, what: 'Make one decision you’ve been leaving to others or to later.', example: 'Pick the date. Choose the gym. Name the price.', rough: 'Write the decision down.' },
    { id: 'con-3', side: 'control', title: 'Tomorrow’s three', minutes: 5, what: 'Before bed, write tomorrow’s three steps toward your Ask.', example: 'Call the bank. Draft the post. Walk at lunch.', rough: 'Write one.' },
    { id: 'con-4', side: 'control', title: 'Check one number', minutes: 5, what: 'Look at one real number about your Ask.', example: 'Savings balance. Minutes trained. Pages written.', rough: 'One glance.' },
    { id: 'con-5', side: 'control', title: 'Guard one hour', minutes: 5, what: 'Block one hour this week for your Ask, and protect it.', example: 'Thursday, 6 to 7 p.m., phone in another room.', rough: 'Block 15 minutes.' },
    { id: 'con-6', side: 'control', title: 'Say no once', minutes: 3, what: 'Say no to one thing that takes time from your Ask.', example: 'Skip the optional meeting.', rough: 'Push it to next week.' },

    // Trust: sharing the load
    { id: 'tru-1', side: 'trust', title: 'The hand-off', minutes: 10, what: 'Give one task to someone else, and don’t redo it.', example: 'Let your partner plan dinner. Let the intern draft the deck.', rough: 'Ask for one small thing.' },
    { id: 'tru-2', side: 'trust', title: 'Ask for advice', minutes: 5, what: 'Ask one person for advice on your Ask.', example: '“You’ve done this. What would you do first?”', rough: 'Write who you’d ask.' },
    { id: 'tru-3', side: 'trust', title: 'Let it be their way', minutes: 2, what: 'When someone helps today, accept their way once, without correcting it.', example: 'The dishes are stacked wrong. Leave them.', rough: 'Notice the urge to fix it. That’s enough.' },
    { id: 'tru-4', side: 'trust', title: 'Map your load', minutes: 10, what: 'List what you carry for your Ask, and mark each: me, someone else, or no one yet.', example: 'Bookkeeping: me. Design: no one yet. Childcare: someone.', rough: 'Three items.' },
    { id: 'tru-5', side: 'trust', title: 'Leave a gap', minutes: 5, what: 'Leave one small thing undone on purpose today, and see what happens.', example: 'Don’t reply to the non-urgent email until tomorrow.', rough: 'Something tiny.' },
    { id: 'tru-6', side: 'trust', title: 'Name your circle', minutes: 5, what: 'Write who could help with your Ask: a mentor, a partner, a helper, a peer, a professional.', example: 'Mentor: Dana. Peer: my running group.', rough: 'One name.' }
  ],

  // The three shadow questions from the guide, with gentle follow-ups for going one layer deeper.
  shadowQuestions: [
    { id: 'price', name: 'The Price', ask: 'What will this really cost me, and will I still pay it on a bad day?', followUps: ['What would I have to give up, even for a while?', 'Which part of the price am I pretending isn’t there?'] },
    { id: 'payoff', name: 'The Payoff', ask: 'What am I getting out of not having it yet?', followUps: ['What does staying here protect me from?', 'Who would I have to become to let that go?'] },
    { id: 'fear', name: 'The Fear on the far side', ask: 'If I got it tomorrow, what would I be afraid of?', followUps: ['What would people expect of me then?', 'What would I lose that I’m used to?'] }
  ],
  // the guide's "going deep" note, shown with any shadow question
  goingDeep: 'If a question brings up more than you can sit with alone, talk it through with someone you trust, or a professional. That’s not weakness. It’s the method.'
};
