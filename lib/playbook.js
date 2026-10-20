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

  // Ebb and flow (Jarred's principle): life doesn't run on a fixed schedule, so plans don't either.
  // Every plan follows these alongside the plan shape.
  flow: [
    'Flow, not force. A plan is a direction, not a timetable.',
    'There’s no set time. Any moment today counts. If your usual moment falls through, find another one before bed.',
    'Each day starts with a check-in: full, half or rough. Do the version of the step that matches.',
    'Low motivation, a foggy head, a hard day, no creativity: those are real. Shrink the step, don’t skip it.',
    'Missed a day? Don’t make it up. No catch-up debt. Pick up today’s step, and try not to miss twice in a row.',
    'If a certain day or time keeps not working, move the step. Your plan learns your rhythm.',
    'Ebb isn’t quitting. On the low days, still do one thing that moves your situation, even if it takes two minutes.',
    'Creativity dried up? Change the shape, the place or the time. Keep the goal.',
    'Match the task to your steam. Forcing creative or important work on an empty tank often means doing it twice. On low days, do the prep work instead: plan, gather, tidy, rest.',
    'Save the deep work for when you’re in flow, and learn when that tends to be. But don’t wait forever: if the right moment hasn’t come in two days, do the smallest version anyway.'
  ],

  // Protocols: step-by-step programs a plan can follow when someone's Ask is about forming a habit or breaking one.
  // Each step points to habit steps (`reps` with side 'habits') or the guide's tools.
  protocols: [
    {
      id: 'new-habit', name: 'Building a new habit', when: 'When their Ask is something they want to do regularly: move, write, save, wake earlier.',
      steps: [
        'Name it as who you’re becoming, plus one tiny action: “I’m someone who moves every day. Shoes on, ten minutes.”',
        'Shrink it until it survives a Tuesday. If it feels too small, it’s probably the right size.',
        'Anchor it to something you already do, not to a clock: after coffee, after the school run, before your phone.',
        'Write three versions: full, half and rough-day. All three count.',
        'Do it most days, at whatever moment works that day.',
        'Keep a receipt: one line a day about what you did.',
        'Missed a day? No catch-up. Come back the next day, and try not to miss twice in a row.',
        'Every 7 days, look back: keep it, shrink it or change its shape. Grow it one notch only when it feels easy most days.'
      ]
    },
    {
      id: 'unlearn', name: 'Unlearning an old habit', when: 'When their Ask is about stopping something that’s costing them: scrolling, snacking, procrastinating, overworking.',
      steps: [
        'Notice without judging. For three days, write down when it happens: what set it off, how you felt, what you got from it.',
        'Find the payoff. Ask: what am I getting out of this? Relief, comfort, a break, a sense of control.',
        'Make the old way a little harder. Move it, log out, put it in another room, add a step between you and it.',
        'Choose a swap that gives you the same payoff in a better way: a walk for the break, a text to a friend for the comfort.',
        'When the urge shows up, pause for two minutes and feel it before you choose. Urges rise, and they pass.',
        'A slip is information. Write what set it off and what would help next time, then carry on.',
        'Tell one person in your circle what you’re changing, and ask them to check in.',
        'Count the days you chose differently, not the days you didn’t.'
      ],
      safety: 'If the habit involves alcohol, drugs, gambling, food, self-harm or anything that puts you in danger, this doesn’t replace real help. Talk to a doctor or counselor. If you’re in crisis, call your local emergency number or a crisis line now.'
    },
    {
      id: 'field', name: 'Clearing your field', when: 'When something in their life keeps pulling against their Ask: a person, a habit, a food, a feed, a place, a commitment. Let loose, but be precise about what you let in.',
      steps: [
        'Take stock of what you let in: people, places, habits, food, feeds, commitments. Mark each one: gives energy, drains it, or neither.',
        'For each drain, ask: does this help my Ask or cost it? Be honest, not harsh.',
        'Choose the gentlest change that works: less of it, a boundary around it, or letting it go. Most things need a boundary, not a slammed door.',
        'With people, start with a kind, clear boundary: “I can’t talk after 9.” Distance comes before goodbye. With anyone close, think it through first, and never cut someone off in the heat of the moment.',
        'With habits and food, swap, don’t starve. Change one thing at a time and replace it with something that gives you what it gave you. No crash diets, no extreme cuts.',
        'Clear one small space at a time: one drawer, one app, one feed. Unfollow, mute, delete.',
        'Fill the space you made with something that feeds your Ask. Empty space fills back up with the old thing.',
        'Letting go has a price too. Grief or guilt can show up, even for the right change. After 7 days, check in: lighter, or lonelier? Adjust from there.'
      ],
      safety: 'If someone in your life is unsafe or harming you, get support from someone you trust or a professional before you act, and if you’re in danger, call your local emergency number or a domestic violence hotline. Before big changes to food, alcohol, medication or other substances, talk to a doctor.'
    }
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

  // The steps. `side` is the side it builds ('habits' = the habit and ebb-and-flow tools, 'field' = clearing your field). `minutes` is the most it takes.
  reps: [
    // Discipline: follow-through that survives a bad day
    { id: 'dis-1', side: 'discipline', title: 'One tiny step', minutes: 10, what: 'Do the smallest daily step toward your Ask, whenever today allows.', example: 'One page before your phone. Shoes on, ten minutes, done.', rough: 'Two minutes. Open it, start it, stop.' },
    { id: 'dis-2', side: 'discipline', title: 'Find today’s window', minutes: 3, what: 'Look at today and pick the moment most likely to work for your step. Tomorrow it can be a different one.', example: 'Today it’s after lunch. Tomorrow, maybe before the kids wake up.', rough: 'Any moment before bed counts.' },
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
    { id: 'fri-3', side: 'friction', title: 'Two minutes with it', minutes: 2, what: 'When fear shows up today, don’t fix it. Feel it for two minutes, then do the next thing.', example: 'Fear before the call. Sit with it. Dial anyway.', rough: 'Three slow breaths or quick 5 minute walk.' },
    { id: 'fri-4', side: 'friction', title: 'The price check', minutes: 5, what: 'Answer in writing: What will this really cost me, and will I still pay it on a bad day?', example: 'Earlier mornings. Less TV. Yes, if the step stays small.', rough: 'Answer just the first half.' },
    { id: 'fri-5', side: 'friction', title: 'Five more minutes', minutes: 5, what: 'When you want to quit today’s step, stay five more minutes.', example: 'Want to stop writing at minute ten. Write until fifteen.', rough: 'One more minute.' },
    { id: 'fri-6', side: 'friction', title: 'What did I miss?', minutes: 5, what: 'Pick one thing that didn’t go your way this week and write what it showed you.', example: 'The pitch flopped. I never asked what they actually needed.', rough: 'One line.' },

    // Ambition: reaching a little further
    { id: 'amb-1', side: 'ambition', title: 'The next level', minutes: 5, what: 'Write what the next level of your Ask looks like, one step past where you are now.', example: 'From running 2 miles to running 3 without stopping.', rough: 'One line.' },
    { id: 'amb-2', side: 'ambition', title: 'One stretch', minutes: 15, what: 'Do one thing a little bigger than comfortable.', example: 'Pitch the client you think is out of reach.', rough: 'Draft it today. Send it tomorrow.' },
    { id: 'amb-3', side: 'ambition', title: 'Resting or settling?', minutes: 3, what: 'Ask yourself: am I resting, or am I settling? Comfort is a place to rest, not a place to live.', example: 'Resting: I chose it, it’s short, I feel recharged. Settling: I’m drifting and avoiding.', rough: 'Just ask the question.' },
    { id: 'amb-4', side: 'ambition', title: 'Raise one standard', minutes: 10, what: 'Pick one small thing and do it a notch better than usual.', example: 'Proofread the email twice. Add one more set.', rough: 'Do one tiny part better.' },
    { id: 'amb-5', side: 'ambition', title: 'Say it out loud', minutes: 5, what: 'Tell one person what you want next.', example: '“I want to launch this by spring.”', rough: 'Write it where you’ll see it.' },
    { id: 'amb-6', side: 'ambition', title: 'Try one new thing', minutes: 15, what: 'Try something you’ve never done that connects to your Ask. Every try teaches you something, however it goes.', example: 'One beginner class. One cold email. One new route.', rough: 'Look it up and save it for later this week.' },

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
    { id: 'tru-6', side: 'trust', title: 'Name your circle', minutes: 5, what: 'Write who could help with your Ask: a mentor, a partner, a helper, a peer, a professional.', example: 'Mentor: Dana. Peer: my running group.', rough: 'One name.' },

    // Habits: the steps the two protocols use, and the ebb-and-flow tools any plan can lean on
    { id: 'hab-1', side: 'habits', title: 'Full, half or rough?', minutes: 1, what: 'Before today’s step, check in: is today a full, half or rough day? Do the version that matches.', example: 'Slept badly, big meeting: half day. Five minutes instead of ten.', rough: 'Pick the rough-day version. It counts.' },
    { id: 'hab-2', side: 'habits', title: 'Anchor it', minutes: 3, what: 'Attach your step to something you already do every day, instead of a set time.', example: 'After I pour my coffee, I write one page.', rough: 'Pick any anchor for today. Try a better one tomorrow.' },
    { id: 'hab-3', side: 'habits', title: 'Never twice', minutes: 5, what: 'If you missed yesterday, do the smallest version today. No catch-up.', example: 'Missed Monday’s walk. Tuesday: five minutes around the block.', rough: 'Two minutes. You’re back.' },
    { id: 'hab-4', side: 'habits', title: 'Track the trigger', minutes: 5, what: 'Each time the old habit shows up today, note what set it off and how you felt.', example: '3 p.m., bored and tired, reached for my phone.', rough: 'Tally marks only.' },
    { id: 'hab-5', side: 'habits', title: 'Make the old way harder', minutes: 10, what: 'Add one step between you and the old habit.', example: 'Log out of the app. Put the snacks on the top shelf.', rough: 'Move it out of sight.' },
    { id: 'hab-6', side: 'habits', title: 'The swap', minutes: 5, what: 'Pick something that gives you the same payoff in a better way, and use it the next time the urge shows up.', example: 'Stressed at night: a shower instead of a scroll.', rough: 'Name the swap. Use it tomorrow.' },
    { id: 'hab-7', side: 'habits', title: 'The slip debrief', minutes: 5, what: 'If the old habit won today, write what set it off and what would help next time. Then let it go.', example: 'Skipped the gym after a late meeting. Next time: pack the bag the night before.', rough: 'One line.' },
    { id: 'hab-9', side: 'habits', title: 'Match the task to your steam', minutes: 3, what: 'Before you start, rate your steam: high, medium or low. High: create, decide, have the hard talk. Medium: build, edit, practice. Low: plan, gather, tidy, rest.', example: 'Low steam today, so I outline the pitch instead of writing it, and write it tomorrow morning.', rough: 'Low steam is allowed. Do one prep task.' },
    { id: 'hab-10', side: 'habits', title: 'Find your flow hours', minutes: 2, what: 'For a week, note when your best work happened: the time, the place, and what came right before it.', example: 'Tuesday 9 a.m., kitchen table, after a walk. Thursday 9 p.m., couch, kids asleep.', rough: 'Just note today’s best moment.' },
    { id: 'hab-8', side: 'habits', title: 'Change the shape', minutes: 10, what: 'If motivation or ideas have dried up, keep the goal and change how: a new place, time, format or partner.', example: 'Write at a café instead of your desk. Walk with a friend instead of alone.', rough: 'Do today’s step somewhere different.' },
    // Your field: what you let into your life, cleared the healthy way
    { id: 'fld-1', side: 'field', title: 'The field check', minutes: 10, what: 'List what you let in this week: people, places, habits, food, feeds, commitments. Mark each one: gives, drains, or neither.', example: 'Morning walk: gives. Late-night scrolling: drains. Sunday call with my brother: gives.', rough: 'Name one thing that gives and one that drains.' },
    { id: 'fld-2', side: 'field', title: 'One kind boundary', minutes: 5, what: 'Pick one drain and set a clear, kind boundary around it. Say it once, simply.', example: '“I’m not taking work calls after 7 anymore.”', rough: 'Write the boundary down. Say it this week.' },
    { id: 'fld-3', side: 'field', title: 'Clear one feed', minutes: 10, what: 'Unfollow, mute or delete the accounts and apps that leave you feeling worse.', example: 'Muted three accounts that make me compare. Moved the shopping app off my home screen.', rough: 'Mute one.' },
    { id: 'fld-4', side: 'field', title: 'Clear one space', minutes: 15, what: 'Clear one small physical space that’s in the way of your Ask.', example: 'Cleared the desk so I can write. Moved the snacks out of the pantry’s front row.', rough: 'Clear one drawer or one shelf.' },
    { id: 'fld-5', side: 'field', title: 'Fill the gap', minutes: 10, what: 'Take the time or space you freed up and put something there that feeds your Ask.', example: 'Fewer late calls means a 20-minute walk after dinner.', rough: 'Name what goes in the gap. Do it tomorrow.' },
    { id: 'fld-6', side: 'field', title: 'Distance before goodbye', minutes: 5, what: 'With a person who drains you, try a little distance before deciding anything bigger.', example: 'Fewer plans with them this month, and noticing how I feel.', rough: 'Skip one thing with them. Notice the difference.' }
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
