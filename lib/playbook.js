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

  // Let loose (Jarred's principle): live lightly. Above all, be able to laugh in the really hard moments instead of
  // leaning into anger and pressure build-up. Life is for enjoying, not an overload of pressure.
  // Its other half is "be precise": exact about the few things that matter (words, the Ask, your field).
  loose: [
    'Let loose. When things get really hard, find the laugh before the anger. Lightness is a choice you can make right in the middle of the mess.',
    'Laughing doesn’t mean it isn’t hard. Feel it first, then loosen your grip on it.',
    'Anger and pressure build when you hold on tight. A laugh lets some of it out before it piles up.',
    'Hold your Ask with a light grip. You’re here to enjoy your life, not just to improve it.',
    'Pressure isn’t proof you care. Effort can be light and still count. If every day feels like “grinding”, something needs to get lighter.',
    'Not everything is serious. Ask: will this matter in a year? If not, let it be small.',
    'Play is part of the plan. Laughing, moving, making something for fun: that’s fuel, not a break from the work.',
    'Be precise about the few things that matter: your words, your Ask, and what you let into your field. Let the rest be loose.'
  ],

  // Their own words for the big stuff. Sits beside the voice rules (which ban filler like "universe").
  mirror: [
    'The app never brings in words like “universe”, “God”, “vibration” or “manifest” on its own.',
    'People choose their own word for where tests and help come from: life, God, the universe, or just “things that happen”.',
    'Once they’ve chosen, mirror their word back to them, the way they say it.'
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
    },
    {
      id: 'price-check', name: 'The Price check: when it gets hard', when: 'When they’ve stalled, pushed back or missed several days, or they say the Ask feels wrong. The Price stage of their Ask.',
      steps: [
        'Pause before deciding. Feel what’s there first: tired, scared, bored, or something deeper.',
        'Remember that resistance doesn’t automatically mean it’s wrong. Friction is part of how results happen.',
        'Ask: is this friction or a signal? Friction sounds like “this is hard, and I still want it.” A signal sounds like “this costs me more than it gives,” every time.',
        'Answer the Price question again: what will this really cost me, and will I still pay it on a bad day?',
        'If it’s friction, keep going, and shrink the step until it fits.',
        'If it’s a signal, choose one: change the shape (same goal, different way), not now (pick a date to look again), or let it go with acceptance.',
        'Whatever you choose, write one line on why. That’s data, not a verdict.',
        'Letting go with acceptance isn’t giving up. It makes room for the next Ask.'
      ]
    },
    {
      id: 'tries', name: 'Tries and the data debrief', when: 'When they don’t know yet what they want, or want to test something before committing: a career, a hobby, a business idea, a new kind of relationship. Try more things sooner.',
      steps: [
        'Decide whether your Ask is a Build (you know you want it) or a Try (you want to find out).',
        'Give a Try a set length: 2 to 4 weeks. Long enough to learn, short enough to start now.',
        'Pick what you’ll notice along the way: what you enjoy, what comes naturally, what drains you.',
        'Do it for real, with small daily steps like any Ask.',
        'At the end, do the data debrief. Feel it first, then find the data.',
        'Decide: turn it into a Build, run another Try, or close it and move on.',
        'Add what you learned to your “What I’m learning about me” list.',
        'Count every Try as a win. Each one moves you closer to what’s yours.'
      ]
    },
    {
      id: 'gut', name: 'Gut calls', when: 'When a step, or the whole plan, feels wrong in their gut.',
      steps: [
        'You know your life better than any method, this one included. If your gut says no, you can skip or change a step.',
        'Make it a gut call on purpose: write what you’re skipping or changing, and what your gut is saying.',
        'Then follow your gut fully. No half-measures.',
        'In two weeks, look back: how did it play out?',
        'Ask: was that my intuition, or fear in disguise? Intuition tends to feel calm and clear. Fear tends to feel urgent and tight.',
        'Keep a gut record. Over time you’ll see when your gut is right, and when it’s protecting you from growing.',
        'No shame either way. A gut call that went sideways is still data.'
      ]
    },
    {
      id: 'receive', name: 'Receiving it', when: 'When they reach their Ask, or a big part of it. The Receive stage of their Ask.',
      steps: [
        'Stop and mark it. Say out loud what you did to get here.',
        'On the day: write what changed in your life, your days, your body, your money and your relationships.',
        'Notice what it drains and what it amplifies. More energy or less? More peace or more pressure?',
        'Ask how it lands on the people around you: does it help them, cost them, or both?',
        'Name what it costs to keep it. Every new level has upkeep.',
        'At 30 days and again at 90 days, answer the same questions and compare.',
        'Decide what to keep, adjust or let go. Then choose your next Ask when you’re ready, not before.'
      ]
    },
    {
      id: 'hold', name: 'Holding the new level', when: 'After they reach an Ask, while life tests whether the change will stick. The Hold stage of their Ask.',
      steps: [
        'Expect tests. A new level gets tested, often by the same thing in a new form.',
        'Pick your own word for where tests come from: life, God, the universe, or just “things that happen”. The app will use yours.',
        'When a test shows up, log it in one line: what happened.',
        'Then ask: did I meet it with my old reaction, or a new response?',
        'Old reaction? No shame. Notice what set it off, and what the new response would have been.',
        'New response? Mark it. That’s the new level holding.',
        'Watch for the same test coming back in a new form. Spotting it is half of handling it.',
        'Each level asks something new of you: more time, more boundaries, more help. Update your load map and your circle.'
      ]
    },
    {
      id: 'precise', name: 'Be precise: the word check', when: 'Whenever they write their Ask or a check-in. The other half of “let loose”: live lightly, but be exact about the words you use for what matters.',
      steps: [
        'Read your Ask out loud. Does every word say exactly what you mean?',
        'Watch for loose words: “try to”, “maybe”, “I hope”, “someday”, “I never”, “I always”, “I can’t”.',
        'Rewrite it to be exact and true. Not fake-positive, just precise. “I’ll try to run more” becomes “I run 10 minutes, 4 days a week.”',
        'Name the thing, the amount and the when, if you can.',
        'Say what you want, not only what you don’t. “Stop being broke” becomes “Have $2,000 saved by June.”',
        'Swap “I never” and “I always” for what’s actually true: “I haven’t yet” or “I often”.',
        'If the precise version feels scary to say, keep it anyway. Precise is a kind of honesty.'
      ]
    },
    {
      id: 'alone', name: 'When you feel alone', when: 'When they feel lonely, disconnected, or like no one gets them, even with people around. The other side of “When it’s too much”.',
      steps: [
        'Name it without shame. Loneliness is a signal, like hunger: it means you need connection, not that something is wrong with you.',
        'Notice which kind it is: missing closeness with someone, missing a group, or feeling unseen even around people.',
        'Start small: one message to one person. “Thought of you today.”',
        'Be around people with no pressure: a café, a class, a gym, a walk where others are.',
        'Show up somewhere on a regular basis. Closeness grows from seeing the same faces again.',
        'Let one person in a little more: share something real, and ask them something real back.',
        'Check: solitude or isolation? Solitude is chosen and recharges you. Isolation drifts in and drains you.'
      ],
      safety: 'If loneliness turns into hopelessness, or thoughts of not wanting to be here, reach out now: to someone you trust, a doctor, or a crisis line. You don’t have to carry that alone.'
    },
    {
      id: 'too-much', name: 'When it’s too much', when: 'When people, noise, screens, plans or other people’s needs leave them overloaded, wired or snappy. The other side of “When you feel alone”.',
      steps: [
        'Notice the signs: snappy, foggy, wired but tired, wanting everyone to stop talking.',
        'Take a quiet reset: ten minutes with no input. No phone, no talk, no noise.',
        'Cut one input today: notifications off, one plan moved, one group chat muted.',
        'Say a kind no to one ask: “I can’t this week, but thank you for thinking of me.”',
        'Protect your recharge: put alone time on your calendar like a meeting.',
        'Use your senses to come down: a walk outside, a shower, dim lights, slow music.',
        'Find your mix. Everyone needs a different amount of people and quiet. Notice yours, and plan your week around it.',
        'Too much can tip into too little. If quiet turns into hiding, use “When you feel alone”.'
      ]
    },
    {
      id: 'doors', name: 'Opening doors: new people, new opportunities', when: 'When their Ask needs people or chances they don’t have yet: work, clients, love, friends, mentors, ideas, money. Opportunities come in every form.',
      steps: [
        'Decide which doors you want opened: work, love, friendship, mentors, ideas, money.',
        'Tell people your Ask. Opportunities find people who say out loud what they’re looking for.',
        'Walk into one new room a month: an event, a class, a group, a community online or in person, where people care about what you care about.',
        'Give first. Share a lead, make an introduction, help with something small. Giving opens more doors than asking.',
        'Reach out to one new or old contact a week. Keep it simple and real.',
        'Follow up. Most doors open on the second or third conversation, not the first.',
        'Say yes to an invite you’d usually skip, unless your gut says no.',
        'Ask for one introduction: “Who do you know who…?”',
        'Keep your field clear while it grows. New people are welcome, and your boundaries still count.'
      ]
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

  // The steps. `side` is the side it builds ('habits' = habit and ebb-and-flow tools, 'field' = clearing your field, 'loose' = living lightly, 'tools' = the guide's exercises and the stage protocols' steps, 'people' = connection, quiet and new doors). `minutes` is the most it takes.
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
    { id: 'fld-6', side: 'field', title: 'Distance before goodbye', minutes: 5, what: 'With a person who drains you, try a little distance before deciding anything bigger.', example: 'Fewer plans with them this month, and noticing how I feel.', rough: 'Skip one thing with them. Notice the difference.' },

    // Living lightly: the "let loose" half
    { id: 'lse-5', side: 'loose', title: 'Find the funny', minutes: 2, what: 'When something goes wrong today, feel it first. Then, before you react, look for what’s funny or absurd about it.', example: 'Spilled coffee on my shirt right before the big meeting. Of course I did. Laughed, changed shirts, walked in lighter.', rough: 'Exhale, and let one corner of your mouth go up.' },
    { id: 'lse-6', side: 'loose', title: 'Catch the build-up', minutes: 3, what: 'Notice when anger or pressure starts building in your body. Name it, take three slow breaths, and let something loosen before you act.', example: 'Jaw tight in traffic. Named it: pressure. Breathed, put on a song I love.', rough: 'Drop your shoulders and unclench your jaw.' },
    { id: 'lse-1', side: 'loose', title: 'Will it matter in a year?', minutes: 1, what: 'When something feels heavy today, ask: will this matter in a year? If not, let it be small.', example: 'A typo in the email to a client. In a year? No. Fix it, move on.', rough: 'Just ask the question.' },
    { id: 'lse-2', side: 'loose', title: 'Ten minutes of play', minutes: 10, what: 'Do something just for fun, with no goal and no score.', example: 'Shoot hoops. Dance in the kitchen. Doodle.', rough: 'Two minutes of something silly.' },
    { id: 'lse-3', side: 'loose', title: 'Lighten the load', minutes: 5, what: 'Look at today’s list and cut or shrink one thing that’s only there because of pressure.', example: 'Dropped the third workout. Two is plenty this week.', rough: 'Move one thing to tomorrow.' },
    { id: 'lse-4', side: 'loose', title: 'Enjoy one step', minutes: 2, what: 'Pick one moment in today’s step and actually enjoy it.', example: 'The first sip of coffee before writing. The music on the walk.', rough: 'Notice one good thing in it.' },

    // Tools: the guide's own exercises, and the steps the stage protocols use
    { id: 'tool-1', side: 'tools', title: 'The Tuesday test', minutes: 5, what: 'For five evenings, write down: your low point, your high point, how long it took to recover, whether you let yourself feel it, and whether you did your step.', example: 'Low: snapped at work. High: the walk. Back in 20 minutes. Felt it: yes. Step: done.', rough: 'Low, high, step done or not.' },
    { id: 'tool-2', side: 'tools', title: 'The receipts audit', minutes: 10, what: 'List three things that really changed in your life in recent years. For each, mark where it came from: mostly the wanting, or mostly small steps repeated.', example: 'Paid off my car: mostly steps. Fixed things with my sister: both.', rough: 'One change, one mark.' },
    { id: 'tool-3', side: 'tools', title: 'The data debrief', minutes: 10, what: 'After a Try, answer in this order: How do I feel about it? What actually happened? What did I learn about what I like and what I’m good at? What would I do differently? What good came out of it, even if it went sideways?', example: 'Felt flat. Taught three classes. I like teaching, not the admin. I’d co-teach next time. Found out I’m good on a stage.', rough: 'Just the first and last questions.' },
    { id: 'tool-4', side: 'tools', title: 'Make a gut call', minutes: 3, what: 'If a step feels wrong in your gut, skip or change it on purpose. Write what you changed and what your gut said.', example: 'Skipped the cold pitch. My gut said: wrong client, not wrong timing.', rough: 'One line: what, and why.' },
    { id: 'tool-5', side: 'tools', title: 'The gut check-back', minutes: 5, what: 'Two weeks after a gut call, look back: how did it play out? Was it intuition, or fear in disguise?', example: 'Skipping that client was right. Skipping the gym was fear.', rough: 'Just: right call, or not?' },
    { id: 'tool-6', side: 'tools', title: 'The word check', minutes: 5, what: 'Rewrite your Ask or today’s check-in so every word is exact and true.', example: '“I’ll try to save more” becomes “I move $50 to savings every Friday.”', rough: 'Fix one loose word.' },
    { id: 'tool-7', side: 'tools', title: 'Log a test', minutes: 2, what: 'When something tests your new level, write one line: what happened, and whether you met it with your old reaction or a new response.', example: 'My old boss called with an offer. New response: I said no, kindly.', rough: 'Old or new? One word.' },
    { id: 'ppl-1', side: 'people', title: 'One small reach-out', minutes: 3, what: 'Send one message to someone you haven’t talked to in a while. No agenda.', example: '“Saw this and thought of you. How are you, really?”', rough: 'React to something they posted, with one real line.' },
    { id: 'ppl-2', side: 'people', title: 'Around people, no pressure', minutes: 20, what: 'Spend some time where other people are, without needing to talk to anyone.', example: 'Worked from a café instead of the kitchen.', rough: 'A short walk somewhere busy.' },
    { id: 'ppl-3', side: 'people', title: 'Solitude or isolation?', minutes: 2, what: 'Ask yourself: is my alone time chosen and recharging, or drifting and draining?', example: 'Sunday alone with a book: solitude. Third weekend skipping plans: isolation.', rough: 'Just ask the question.' },
    { id: 'ppl-4', side: 'people', title: 'The quiet reset', minutes: 10, what: 'Take ten minutes with no input: no phone, no talk, no noise.', example: 'Sat in the car before going inside. Phone in the glovebox.', rough: 'Two minutes with your eyes closed.' },
    { id: 'ppl-5', side: 'people', title: 'Cut one input', minutes: 5, what: 'Turn off, mute or move one thing that’s been overloading you.', example: 'Muted the group chat until Friday. Turned off email alerts after 6.', rough: 'Silence your phone for one hour.' },
    { id: 'ppl-6', side: 'people', title: 'Protect your recharge', minutes: 5, what: 'Put alone time on your calendar this week, and keep it like a meeting.', example: 'Saturday morning, 9 to 11: mine.', rough: 'Block 30 minutes.' },
    { id: 'ppl-7', side: 'people', title: 'One new room', minutes: 20, what: 'Find one place, event or group where people care about what you care about, and plan to go.', example: 'Signed up for a Thursday run club. Joined a founders’ group online.', rough: 'Save one event to look at later this week.' },
    { id: 'ppl-8', side: 'people', title: 'Give first', minutes: 10, what: 'Help someone with no ask attached: share a lead, make an introduction, offer a skill.', example: 'Introduced two friends who both want to start podcasts.', rough: 'Send one useful link to someone it fits.' },
    { id: 'ppl-9', side: 'people', title: 'Ask for one introduction', minutes: 5, what: 'Ask someone you trust: “Who do you know who…?”, tied to your Ask.', example: '“Who do you know who’s opened a studio? I’d love to buy them a coffee.”', rough: 'Write the ask. Send it tomorrow.' },
    { id: 'ppl-10', side: 'people', title: 'Follow up', minutes: 5, what: 'Reconnect with someone you met recently, and keep the door open.', example: '“Great talking last week. Want to grab lunch this month?”', rough: 'A one-line hello.' },
    { id: 'tool-8', side: 'tools', title: 'The arrival review', minutes: 15, what: 'When you reach your Ask, write what changed, what it drains and amplifies, how it lands on the people around you, and what it costs to keep.', example: 'More money, less sleep. My partner loves it, my kids miss me on Saturdays. Keeping it means one weekend off a month.', rough: 'What changed, in one line.' }
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
