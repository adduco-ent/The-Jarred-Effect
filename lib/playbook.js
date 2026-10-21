// The Other Half playbook, version 1. Approved by Jarred on 2026-10-20 (all items). Changes go into version 2.
// The AI plan generator only applies what's in here; it never invents its own method. Jarred approves every
// change, and each version is kept, so any plan can be traced back to the playbook that made it.
// Everything comes from the guide (held not high, the minimum rep, receipts, the 2:47 check, the Tuesday test,
// the three shadow questions) and Jarred's principles. Steps are written so anyone gets them in seconds.

module.exports = {
  version: 1,
  approved: '2026-10-20',

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
        'Look back over the last 2 to 4 weeks: have doors been opening, or closing again and again? (See “Reading flow and resistance”.)',
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
    },
    {
      id: 'flow-read', name: 'Reading flow and resistance', when: 'When they’re unsure whether an Ask, a path or a person is meant for them, or everything feels like pushing uphill.',
      steps: [
        'Hard and wrong aren’t the same thing. Effort you choose can still feel like flow. What you’re watching is the direction, not the difficulty.',
        'Look for the signs of flow: doors open, people say yes, things line up, you lose track of time, and your energy comes back even after hard days.',
        'Look for the signs of resistance: every step is a fight, doors keep closing, the same block keeps showing up, and it drains you more than it gives.',
        'Give it a fair run before you read it. One bad week isn’t a pattern. Look back over 2 to 4 weeks.',
        'Read people the same way. The people meant for you tend to feel easy to be around, even in hard conversations. Constant friction with someone is information.',
        'If it’s mostly flow, lean in. Put more of your time and energy where things open up.',
        'If it’s non-stop resistance, ask what it’s telling you: not this, not now, or not this way. Then use the Price check to choose.',
        'Follow the open door. Sometimes what’s meant for you is the thing that keeps showing up while you’re pushing on something else.'
      ]
    },
    {
      id: 'yes', name: 'The pause before yes', when: 'When they say yes too fast to keep someone happy, before they realize what it will cost them, especially when their own cup is already empty.',
      steps: [
        'Notice the urge to say yes on the spot. A fast yes to keep the peace is a habit, not a decision.',
        'Buy time: “Let me check and get back to you.” A real yes can wait an hour.',
        'Check your cup: is your time, energy or money full, half or empty right now?',
        'Ask the price: what will this yes really cost me, and what will I have to say no to because of it?',
        'Choose on purpose: yes, a smaller yes, a later, or a kind no.',
        'If it’s a no, keep it short and kind. You don’t owe a long explanation.',
        'It’s okay to change a yes you gave too fast. Go back early and offer what you can actually do.',
        'Filling your own cup first isn’t selfish. It’s how you keep having something to give.'
      ]
    },
    {
      id: 'agency', name: 'Your own agency', when: 'When they keep pleasing people who take advantage of them, or act differently than they normally would when a certain person or thing is around.',
      steps: [
        'Notice where you shrink: with whom, or around what, do you stop doing what you’d normally do or say?',
        'Name what you would do if they weren’t there. That’s your own agency talking.',
        'Check whether it flows both ways. Do they give as well as take? Is your no respected, or argued with until it turns into a yes?',
        'Watch for the signs of being taken advantage of: guilt used to move you, help that only goes one way, and plans that always run on their terms.',
        'Take one small act of agency in their presence: order what you want, say what you think, leave when you’re ready.',
        'Set one clear boundary, and decide what you’ll do if it isn’t respected.',
        'Let them be disappointed. Someone else’s disappointment isn’t your emergency.',
        'Tell someone in your circle what you’re changing. Agency is easier with backup.'
      ],
      safety: 'If you feel unsafe saying no to someone, or they control your money, where you go or who you see, that isn’t a boundary to solve alone. Reach out to someone you trust, a counselor, or a domestic violence hotline. If you’re in danger, call your local emergency number.'
    },
    {
      id: 'no', name: 'Learning to say no', when: 'When saying no feels hard, scary or rude, so they say yes to things they don’t want, can’t afford, or don’t have room for.',
      steps: [
        'No is a full sentence, and a kind no is still a no.',
        'Start small. Write a “no ladder” from easiest to hardest, and practice on the easy ones first: a waiter, a sales call, one extra task.',
        'Say no to the thing, not the person: “I can’t take this on, and I appreciate you asking.”',
        'Keep it short. The more you explain, the more there is to argue with.',
        'If they push, say it again, calmly, with the same words.',
        'Expect a guilt wave afterward. Feel it, and don’t take the no back.',
        'Notice what your no made room for: time, rest, your Ask.',
        'Say no to yourself too: to the old habit, the extra scroll, the late night that costs you tomorrow.'
      ]
    },
    {
      id: 'speak', name: 'Speaking up for yourself', when: 'When they swallow what they think or need, go along to avoid conflict, or hint instead of asking.',
      steps: [
        'Notice the moment you swallow it: the thought you didn’t say, the need you didn’t mention.',
        'Start where it’s easy. Speak up in low-stakes moments first: a wrong order, the seat you want, your take on a movie.',
        'Use “I” statements: “I see it differently.” “I need a day to think.” “I’d prefer…”',
        'Say it early, while it’s small. Swallowed things grow.',
        'Keep your voice calm and your words simple. You don’t have to be loud to be clear.',
        'Ask for what you need directly instead of hinting.',
        'If it comes out wobbly, it still counts. You can circle back: “I want to say that more clearly.”',
        'Not everyone will like it. The people meant for you will respect it.'
      ]
    },
    {
      id: 'worth', name: 'Your worth, held', when: 'When they doubt themselves, feel they have to earn their place, or don’t believe they deserve what they’re asking for.',
      steps: [
        'Worth is held, not hyped. Telling yourself “I’m worthy” a hundred times moves less than keeping one small promise to yourself for twenty days.',
        'Keep small promises to yourself. Every kept one is a receipt your gut can read.',
        'Write your proof list: things you’ve done, handled, or made it through. Add to it every week.',
        'Notice your inner critic. Write down what it says, then what you’d say to a friend who said that about themselves.',
        'Drop the words that shrink you: “just”, “only”, “sorry”, “I’m no expert”.',
        'Stop earning your worth by overgiving. Your value isn’t measured by what you do for others.',
        'Take up space on purpose: let a compliment land, name your price, sit where you want to sit.',
        'Measure yourself against who you were last month, not against someone else’s highlight reel.'
      ],
      safety: 'If your sense of worth is very low, or it comes with hopelessness, talk to a counselor or doctor. Worth can be rebuilt, and you don’t have to do it alone. If you’re in crisis, call your local emergency number or a crisis line now.'
    },
    {
      id: 'error', name: 'Catching error thoughts', when: 'When harsh thoughts or statements about themselves keep showing up, including ones they picked up from other people. Unlearning what they tell themselves.',
      steps: [
        'Watch for the moments. Old thoughts show up when you’re stuck, tired, comparing yourself, or something goes wrong.',
        'Catch it as it happens. Notice the exact words: “I’m stupid.” “I always mess this up.” “People like me don’t get that.”',
        'Name it, out loud or in your head: “Error thought.” Naming it puts space between you and it.',
        'Ask whose voice it is. Many of these started as something someone else said to you. You don’t have to keep carrying it.',
        'Flip it to the inverse, in words you can believe. “I’m stupid” becomes “This is tough, but I’ll figure it out.”',
        'Make the flip true, not fake. If the full opposite feels like a lie, use a bridge: “I’m learning this.” “I’m getting better at this.”',
        'Back it up with one small action. Your gut believes what you do, so the action is what makes the new thought stick.',
        'Catch what you say out loud too. “I’m terrible with money” in a conversation is an error statement. Correct it mid-sentence.',
        'Keep an error log. Within a few weeks you’ll see the same few error thoughts repeat, and you’ll catch them faster.'
      ]
    },
    {
      id: 'circle', name: 'Your five: the family you’re building', when: 'When they want to grow, and the people closest to them shape what feels normal. The few people you spend the most time with shape your habits, moods and chances. Research on social networks shows habits like exercise, eating, smoking and even happiness spread between people who are close, and we naturally mirror the people around us most.',
      steps: [
        'Map your five: the people you spend the most time and contact with, in person, on the phone and online.',
        'For each one, notice what you pick up from them: habits, moods, and how you both talk about money, work, your body and your future. We mirror the people closest to us, the good and the bad.',
        'Ask of each: does time with them pull me toward my Ask, or away from it? Do I leave amplified, drained, or neutral?',
        'Name the people you want more of: people already living part of what you want, who make you better just by being around them.',
        'Grow your circle on purpose. Spend more time where those people are: groups, classes, communities, work. (See “Opening doors”.)',
        'Rebalance, don’t purge. A little less time with the people who drain you, a little more with the people who amplify you. Distance comes before goodbye.',
        'Be the friend you want to have. Bring the habits, encouragement and honesty you’re looking for. Like attracts like.',
        'Build your chosen family: the few people who show up, tell you the truth, and want you to win. Invest in them on purpose.',
        'Check your five every few months. As you change, your circle will change too, and that’s part of growing.'
      ]
    },
    {
      id: 'agreements', name: 'Four ways to stay clear', when: 'For everyday life, especially in hard moments with other people: mean what you say, their world not your worth, ask don’t guess, and your best for the day you have.',
      steps: [
        'Mean what you say. Your word is a receipt: say what you mean, keep your promises, and don’t use words against yourself or anyone else. (See “Be precise” and “Catching error thoughts”.)',
        'Their world, not your worth. What people say and do mostly comes from what they’re carrying, not from your value.',
        'When something stings, pause before you react and ask: is this about me, or about their world?',
        'Ask, don’t guess. Instead of filling in the blanks, ask: “What did you mean by that?”',
        'Say what you want clearly, so other people don’t have to guess either.',
        'Your best, for the day you have. Your best changes day to day, and a rough-day best still counts. No guilt, no burnout.',
        'At night, check in: Did I mean what I said? Did I let someone else’s words or mood decide how I felt about myself? Did I guess instead of asking? Did I give my best for the day I had?'
      ]
    },
    {
      id: 'comeback', name: 'The comeback', when: 'When they’ve fallen off completely: a lost week, a lost month, or longer.',
      steps: [
        'Welcome back. No shame and no catch-up debt. Starting again is the skill.',
        'Don’t audit the gap. Skip the guilt review; all you need is the next step.',
        'Restart with the rough-day version of your step for three days.',
        'Ask one question about the gap: what pulled me away? Write one line, then move on.',
        'Remove one thing that made falling off easy.',
        'Tell one person you’re back, if that helps you stay.',
        'Count from today. How fast you come back matters more than any streak.'
      ]
    },
    {
      id: 'body', name: 'Body basics: fuel your steam', when: 'When low energy, poor sleep or skipped meals keep shrinking their steam.',
      steps: [
        'Your steam starts in your body. Sleep, movement, food and water come before willpower.',
        'Sleep: pick one thing that helps you rest, like a set wind-down time or the phone out of the bedroom.',
        'Move a little every day, any way you enjoy. A ten-minute walk counts.',
        'Eat something real before you run on empty. Regular meals beat perfect ones.',
        'Drink water before coffee.',
        'Get outside and see daylight early in the day.',
        'Change one basic at a time, and notice what it does for your steam.'
      ],
      safety: 'This is everyday care, not medical advice. For ongoing exhaustion, sleep problems, pain, or big changes to food or exercise, talk to a doctor.'
    },
    {
      id: 'change', name: 'Big life changes', when: 'During a move, a breakup, a job loss, a new baby, an illness or a loss, when life itself has become the big Ask.',
      steps: [
        'Big changes take energy, even the good ones. Lower the bar on purpose.',
        'Switch your plan to gentle mode: rough-day steps, fewer of them, more rest.',
        'Keep one small anchor that’s the same every day: a walk, a meal, a call.',
        'Let yourself feel it. Grief, fear and relief can all show up at once.',
        'Lean on your circle, and ask for specific help: a meal, a ride, a call.',
        'Put big decisions on hold where you can, until the ground feels steadier.',
        'When you’re ready, ask what this change makes room for. That can become your next Ask.'
      ],
      safety: 'Grief and big changes can weigh a lot. If you’re struggling to get through the day, or feel hopeless, talk to a counselor or doctor. In a crisis, call your local emergency number or a crisis line.'
    },
    {
      id: 'values', name: 'What you actually value', when: 'When they’re not sure their Ask is truly theirs, or it feels like someone else’s dream.',
      steps: [
        'Ask: whose Ask is this? Mine, my family’s, my friends’, or my feed’s?',
        'List the moments you felt most like yourself. What was true in each one?',
        'Pull your values out of those moments: freedom, family, craft, adventure, peace, whatever shows up.',
        'Pick your top three.',
        'Check your Ask against them. Does it serve at least one? Does it cost one you care about?',
        'Adjust the Ask, or keep it with clearer reasons why.',
        'Revisit your values once or twice a year. They change as you do.'
      ]
    },
    {
      id: 'signal', name: 'Your signal: feel it, hold it, live it', when: 'At the heart of every Ask. What you hold in your gut most of the day is your signal. Words and wishes don’t change it; feelings faced and actions taken do.',
      lens: {
        energy: 'For people who see it as energy: everything is energy, like attracts like, and you are a broadcaster and receiver of what you feel. Your signal is your frequency, and the steps tune it.',
        mind: 'For people who see it as psychology: what you feel shapes what you notice, what you choose and how others respond to you. Your signal is your baseline, and the steps shift it.'
      },
      steps: [
        'Your signal is what you hold, not what you say. Repeating words over a feeling you don’t have hides the feeling instead of changing it.',
        'Feel the future fully. Picture an ordinary day once your Ask is real, in first person, as if it’s already true. Notice how it feels in your body.',
        'Notice the gap. What shows up right after? Doubt, fear, “that’s not for me”. That’s the other half. Don’t cover it; feel it.',
        'Ask the shadow question that fits: the Price, the Payoff, or the Fear on the far side.',
        'Choose one feeling from that future to hold today: calm, steady, enough. Held, not high. A spike fades; a baseline changes things.',
        'Live it in one small way. Make one choice today that the version of you who already has it would make. Action teaches your body the future is normal.',
        'Check your signal at 2:47. Are you holding it, or did old feelings take over? No shame. Come back to it.',
        'Notice what’s moving: doors opening, people showing up, small signs. Be grateful for what’s already on its way.',
        'Let go of the how and the when. Hold the feeling, take the step, and loosen your grip on the rest.'
      ]
    },
    {
      id: 'emotions', name: 'Navigating your emotions', when: 'When a big feeling hits, or the same heavy feeling keeps coming back and pulls them away from their Ask.',
      steps: [
        'Name it, as exactly as you can: not “bad”, but “disappointed”, “embarrassed”, “scared I’m too late”. Naming a feeling takes some of its power.',
        'Find it in your body: the tight chest, the knot in your stomach, the heat in your face.',
        'Feel it fully for a minute or two, without fixing it. Feelings move through faster when you let them.',
        'Ask what it’s telling you. Fear often points at something that matters. Anger often points at a boundary.',
        'Move one step up, not ten. From hopeless to frustrated, from frustrated to hopeful. Pick the next feeling you can actually believe.',
        'Act from the new feeling, in one small way.',
        'If it’s an old heavy feeling that keeps coming back, notice what sets it off, and use “Catching error thoughts” on the thought that rides with it.',
        'Don’t bottle it and don’t fake it. Felt and moved through beats pushed down and covered up.'
      ],
      safety: 'If a feeling is too big to move through, or it stays for weeks, talk to someone you trust or a counselor. If you feel unsafe or hopeless, call your local emergency number or a crisis line now.'
    },
    {
      id: 'power', name: 'Keeping your power', when: 'When they believe someone else holds all the keys, or that they have to do it exactly the way someone else did. Also when they’re taking advice from mentors, coaches, books or courses.',
      steps: [
        'Notice where you hand your power over: “I can’t until they…”, “If I just find the right coach, course or person…”, “I have to do it exactly like they did.”',
        'No one holds all the keys. People can open doors and share what worked for them, but your path won’t look like theirs.',
        'There’s no single right way. Everyone is different: a different life, timing, set of strengths and starting point.',
        'Learn from people who’ve done it, and keep your hands on the wheel. Advice is input, not orders.',
        'Run advice through your gut. What resonates? Keep it. What feels off? Leave it, without needing to argue about it.',
        'Test a piece of advice as a Try, not a rule. See whether it works for you before you make it yours.',
        'Be careful with anyone who says theirs is the only way, or makes you feel you can’t do it without them.',
        'Take credit for your own progress. When something works, notice what you did.',
        'That includes this app. Take what fits, change what doesn’t, and trust yourself.'
      ],
      safety: 'If a coach, group or person pressures you to keep paying more, to cut off the people close to you, or to hand over control of your choices to keep your progress, step back and talk it through with someone you trust.'
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

  // The steps. Each may carry `help` (why it helps, how to do it in three tiny steps, if you get stuck), shown under
  // "Need more help with this step?" on the plan page. `side` is the side it builds ('habits' = habit and ebb-and-flow tools, 'field' = clearing your field, 'loose' = living lightly, 'tools' = the guide's exercises and the stage protocols' steps, 'people' = connection, quiet and new doors, 'agency' = your yes and your no, 'worth' = voice and worth, 'thoughts' = catching error thoughts, 'circle' = your five and your chosen family, 'agreements' = four ways to stay clear, 'foundations' = the comeback, body basics, big life changes and values, 'signal' = your signal and navigating emotions, 'power' = keeping your power). `minutes` is the most it takes.
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
    { id: 'tool-9', side: 'tools', title: 'The flow log', minutes: 3, what: 'Each evening, write one thing that came easily today and one thing that fought you. After two weeks, read it back and look for the pattern.', example: 'Easy: the client call, ideas kept coming. Fought me: the spreadsheet, third night in a row.', rough: 'Just the easy one.' },
    { id: 'tool-10', side: 'tools', title: 'Ease or force?', minutes: 5, what: 'Pick one Ask, path or person. Over the last 2 to 4 weeks, have doors mostly opened or mostly closed? Has it given you energy or taken it?', example: 'The podcast: guests keep saying yes, I look forward to recording. Flow. The second job: every week a new block. Resistance.', rough: 'One word: ease or force.' },
    { id: 'tool-11', side: 'tools', title: 'Follow the open door', minutes: 10, what: 'Notice something that keeps opening up for you, even when you’re not pushing. Take one small step toward it.', example: 'People keep asking me to teach what I do. Booked one free workshop.', rough: 'Write down the door you keep seeing.' },
    { id: 'agc-1', side: 'agency', title: '“Let me get back to you”', minutes: 1, what: 'The next time someone asks for something, buy time instead of answering on the spot.', example: '“Let me check my week and get back to you tonight.”', rough: 'Just don’t say yes in the moment.' },
    { id: 'agc-2', side: 'agency', title: 'Check your cup', minutes: 2, what: 'Before you say yes to anything today, rate your cup: full, half or empty.', example: 'Empty after a long week, so I skipped helping with the move and sent pizza instead.', rough: 'Ask once today: what’s in my cup?' },
    { id: 'agc-3', side: 'agency', title: 'A smaller yes', minutes: 3, what: 'Offer a version of yes that fits what you actually have.', example: '“I can’t do all Saturday, but I can help for an hour in the morning.”', rough: 'Write the smaller yes you’ll offer next time.' },
    { id: 'agc-4', side: 'agency', title: 'Change one yes', minutes: 5, what: 'Go back to one commitment you made too fast, and change it to what you can really give.', example: '“I said I’d run the fundraiser. I can’t lead it, but I can handle the sign-ups.”', rough: 'Name the yes you want to change.' },
    { id: 'agc-5', side: 'agency', title: 'Where do I shrink?', minutes: 5, what: 'List the people or places where you stop doing what you’d normally do or say.', example: 'At my in-laws’ I never say what I think. At work I agree to every deadline.', rough: 'One name or place.' },
    { id: 'agc-6', side: 'agency', title: 'One act of agency', minutes: 5, what: 'Around someone you usually shrink for, do one small thing you’d normally do.', example: 'Ordered what I actually wanted. Said “I see it differently.” Left the party when I was ready.', rough: 'Notice one moment you would have, and next time do it.' },
    { id: 'agc-7', side: 'agency', title: 'A no without the essay', minutes: 3, what: 'Say one no today in one or two sentences, without over-explaining or apologizing.', example: '“I can’t make it this time. Have a great night.”', rough: 'Write the short no. Send it when you’re ready.' },
    { id: 'agc-8', side: 'agency', title: 'Two-way check', minutes: 5, what: 'For one relationship, write what you give and what you get back. Does it flow both ways?', example: 'I give: rides, favors, listening. I get: rarely a call back. Time for a boundary.', rough: 'One line: mostly giving, mostly getting, or even?' },
    { id: 'wrt-1', side: 'worth', title: 'The no ladder', minutes: 5, what: 'Write five nos you’ve been avoiding, from easiest to hardest. Say the easiest one this week.', example: '1. The upsell. 2. The extra shift. 3. My cousin’s loan request…', rough: 'Write just the easiest one.' },
    { id: 'wrt-2', side: 'worth', title: 'Say it again', minutes: 2, what: 'When someone pushes back on your no, repeat it calmly, with the same words.', example: '“I can’t this time.” “But—” “I can’t this time.”', rough: 'Decide your words now, so they’re ready.' },
    { id: 'wrt-3', side: 'worth', title: 'One true sentence', minutes: 2, what: 'In one conversation today, say one thing you actually think.', example: '“Honestly, I’d rather do Thursday.”', rough: 'Say it in a text instead.' },
    { id: 'wrt-4', side: 'worth', title: 'Drop the shrink words', minutes: 3, what: 'Before you send one message today, delete the words that shrink you: “just”, “sorry”, “only”, “I’m no expert, but”.', example: '“Sorry to bother you, I just wanted to…” became “I wanted to…”', rough: 'Delete one “just”.' },
    { id: 'wrt-5', side: 'worth', title: 'Your proof list', minutes: 10, what: 'Write ten things you’ve done, handled or made it through. Read it before something hard.', example: 'Moved cities alone. Got through the layoff. Taught myself to code.', rough: 'Write three.' },
    { id: 'wrt-6', side: 'worth', title: 'Let it land', minutes: 1, what: 'When someone compliments you today, say “thank you” and stop. No deflecting.', example: '“Great job on the talk.” “Thank you.” (No “oh, it was nothing.”)', rough: 'Notice the urge to deflect. That counts.' },
    { id: 'wrt-7', side: 'worth', title: 'Name your price', minutes: 10, what: 'Write what your time or work is really worth, and say that number out loud once.', example: 'Raised my rate for new clients from $60 to $85 an hour.', rough: 'Write the number. Say it tomorrow.' },
    { id: 'wrt-8', side: 'worth', title: 'Answer the critic', minutes: 5, what: 'When your inner critic speaks, write what it said, then what you’d tell a friend who said it about themselves.', example: 'Critic: “You always mess this up.” Friend: “You’ve done harder things than this. Try again tomorrow.”', rough: 'Just write what the critic said.' },
    { id: 'wrt-9', side: 'worth', title: 'Ride the guilt wave', minutes: 3, what: 'After you say no, guilt may show up. Feel it for a few minutes, and don’t take the no back.', example: 'Felt awful for an hour after declining the trip. By evening, relief.', rough: 'Three slow breaths. The no stands.' },
    { id: 'err-1', side: 'thoughts', title: 'Catch the error thought', minutes: 1, what: 'When a harsh thought about yourself shows up today, say “error thought” and write down the exact words.', example: 'Stuck on the budget. Thought: “I’m so bad at this.” Error thought.', rough: 'Just say “error thought” when it happens.' },
    { id: 'err-2', side: 'thoughts', title: 'Flip it', minutes: 2, what: 'Rewrite the error thought as its inverse, in words you can believe.', example: '“I’m so bad at this” became “This is tough, but I’ll figure it out.”', rough: 'Use a bridge: “I’m learning this.”' },
    { id: 'err-3', side: 'thoughts', title: 'Whose voice is it?', minutes: 3, what: 'For one error thought that keeps coming back, write where you first heard it.', example: '“You’re not a math person”: my fifth-grade teacher. Not mine to keep.', rough: 'Just ask the question.' },
    { id: 'err-4', side: 'thoughts', title: 'Back it up', minutes: 10, what: 'After you flip a thought, do one small thing that proves the new version.', example: 'Flipped “I can’t do money” to “I’m learning money.” Then read one page about budgeting.', rough: 'Two minutes of proof.' },
    { id: 'err-5', side: 'thoughts', title: 'Catch it out loud', minutes: 1, what: 'Listen for what you say about yourself in conversation today. Correct one error statement mid-sentence.', example: '“I’m terrible at— actually, I’m getting better at speaking up.”', rough: 'Notice one. Correct it next time.' },
    { id: 'err-6', side: 'thoughts', title: 'The error log', minutes: 3, what: 'Each evening, write the error thoughts you caught today and the flip you used for each.', example: '“I’m behind” → “I’m on my own timeline.” “No one cares” → “Two people checked on me today.”', rough: 'Tally marks: how many did you catch?' },
    { id: 'cir-1', side: 'circle', title: 'Map your five', minutes: 10, what: 'List the five people you spent the most time with this month. Mark each one: amplified, drained, or neutral.', example: 'Sam: amplified. My coworker Dee: drained. My sister: amplified. Group chat: neutral.', rough: 'Name just the top three.' },
    { id: 'cir-2', side: 'circle', title: 'What am I picking up?', minutes: 5, what: 'For one person in your five, write one habit, mood or phrase you’ve picked up from them, good or bad.', example: 'From Sam: I started running. From Dee: I complain about work more than I used to.', rough: 'Name one thing you’ve picked up.' },
    { id: 'cir-3', side: 'circle', title: 'More of this person', minutes: 5, what: 'Name one person who amplifies you, and make a plan to spend time with them this week.', example: 'Texted Jordan to grab breakfast Saturday. She always leaves me fired up.', rough: 'Send them one message.' },
    { id: 'cir-4', side: 'circle', title: 'Be in the room', minutes: 20, what: 'Spend time around people who are already a step further along in what you want.', example: 'Joined the early run group. Sat in on a local founders’ meetup.', rough: 'Find one room to try next week.' },
    { id: 'cir-5', side: 'circle', title: 'Be the friend', minutes: 10, what: 'Do for one friend what you wish someone would do for you: encourage them, invite them, check in.', example: 'Sent my friend a voice note cheering on her job interview.', rough: 'One line of encouragement.' },
    { id: 'cir-6', side: 'circle', title: 'Chosen family check-in', minutes: 10, what: 'Reach out to one person in your chosen family this week, just to connect. No agenda.', example: 'Called my old roommate on the drive home.', rough: 'A one-line hello.' },
    { id: 'cir-7', side: 'circle', title: 'Rebalance one hour', minutes: 5, what: 'Move one hour this week from time that drains you to time with someone who amplifies you.', example: 'Skipped the Thursday complaint-fest. Took a walk with my brother instead.', rough: 'Move 20 minutes.' },
    { id: 'agr-1', side: 'agreements', title: 'Keep your word', minutes: 5, what: 'Make one promise today, to yourself or someone else, and keep it. If you can’t, say so early.', example: 'Told my son I’d be at the game by 5. Left work at 4:30.', rough: 'Make a smaller promise, and keep that one.' },
    { id: 'agr-2', side: 'agreements', title: 'Their world, not my worth', minutes: 3, what: 'When something stings today, write what they did, then what might be going on for them.', example: 'Boss snapped at me. She’s been covering two jobs since March.', rough: 'Just ask: is this about me?' },
    { id: 'agr-3', side: 'agreements', title: 'Ask, don’t guess', minutes: 2, what: 'Catch one guess you’re making about someone today, and ask a clear question instead.', example: 'Guessed my friend was mad because she didn’t reply. Asked. Her phone was broken.', rough: 'Notice one guess. Ask tomorrow.' },
    { id: 'agr-4', side: 'agreements', title: 'Your best, today', minutes: 1, what: 'At the start of the day, decide what your best looks like today: a full, half or rough-day best.', example: 'Slept four hours. My best today is the half version, and that’s enough.', rough: 'Just say it: today my best is ___.' },
    { id: 'agr-5', side: 'agreements', title: 'Words that build', minutes: 3, what: 'Notice one time today you used words against yourself or someone else, and say it again in a way that builds.', example: '“You never help” became “I’d love help with the dishes tonight.”', rough: 'Notice one. Rephrase it next time.' },
    { id: 'agr-6', side: 'agreements', title: 'The evening check', minutes: 3, what: 'Before bed, go through the four: Did I mean what I said? Did I let someone else’s words or mood decide how I felt about myself? Did I guess instead of asking? Did I give my best for the day I had?', example: 'Meant it: yes. Let the email get to me: a little. Guessed: no. Best: yes, the half version.', rough: 'Pick one of the four.' },
    { id: 'fnd-1', side: 'foundations', title: 'Day one again', minutes: 5, what: 'After a gap, do the rough-day version of your step for three days in a row. Nothing more.', example: 'Off for a month. Back with two-minute walks Monday to Wednesday.', rough: 'One minute counts.' },
    { id: 'fnd-2', side: 'foundations', title: 'One line on the gap', minutes: 2, what: 'Write one line on what pulled you away. Then close it and move on.', example: 'The new job ate my evenings.', rough: 'One word.' },
    { id: 'fnd-3', side: 'foundations', title: 'Remove one easy exit', minutes: 5, what: 'Change one thing that made falling off easy.', example: 'Laid out gym clothes the night before.', rough: 'Name the easy exit.' },
    { id: 'fnd-4', side: 'foundations', title: 'Wind down', minutes: 15, what: 'Pick a time to start winding down tonight, and keep screens out of the last part of it.', example: '10 p.m.: phone on the charger in the kitchen, book in bed.', rough: 'Phone out of reach for the last ten minutes.' },
    { id: 'fnd-5', side: 'foundations', title: 'The ten-minute walk', minutes: 10, what: 'Take a ten-minute walk today, at any pace, anywhere.', example: 'Walked the block after lunch.', rough: 'Two minutes outside.' },
    { id: 'fnd-6', side: 'foundations', title: 'Water first', minutes: 1, what: 'Drink a glass of water before your first coffee.', example: 'Glass by the coffee maker, every morning.', rough: 'A few sips.' },
    { id: 'fnd-7', side: 'foundations', title: 'Morning light', minutes: 10, what: 'Get outside and see daylight within the first hour or two of your day.', example: 'Coffee on the porch instead of the couch.', rough: 'Open the blinds and stand by the window.' },
    { id: 'fnd-8', side: 'foundations', title: 'Gentle mode', minutes: 5, what: 'During a big change, cut your plan to rough-day steps only, and drop anything that can wait.', example: 'After the move: two minutes of writing, nothing else for two weeks.', rough: 'Just your one anchor today.' },
    { id: 'fnd-9', side: 'foundations', title: 'One anchor', minutes: 10, what: 'Pick one small thing you’ll do every day while life is upside down.', example: 'A morning walk with the dog, no matter what.', rough: 'One minute of it.' },
    { id: 'fnd-10', side: 'foundations', title: 'Ask for specific help', minutes: 3, what: 'Ask one person for one specific thing.', example: '“Could you bring dinner Thursday?”', rough: 'Write the ask. Send it tomorrow.' },
    { id: 'fnd-11', side: 'foundations', title: 'Whose Ask is it?', minutes: 5, what: 'Write your Ask, then ask honestly: is this mine, or someone else’s?', example: '“Become a lawyer”: my dad’s. “Teach”: mine.', rough: 'Just ask the question.' },
    { id: 'fnd-12', side: 'foundations', title: 'Most like me', minutes: 10, what: 'List three moments you felt most like yourself, and what was true in each.', example: 'Building the treehouse with my kids: making something real, together.', rough: 'One moment.' },
    { id: 'fnd-13', side: 'foundations', title: 'Your top three', minutes: 10, what: 'From those moments, pick your top three values.', example: 'Freedom, family, craft.', rough: 'Pick one.' },
    { id: 'fnd-14', side: 'foundations', title: 'Values check', minutes: 5, what: 'Check your Ask against your top three: does it serve them, or cost them?', example: 'The promotion serves craft, costs family. Asking for a four-day week.', rough: 'One value, one check.' },
    { id: 'sig-1', side: 'signal', title: 'Live it for two minutes', minutes: 2, what: 'Close your eyes and picture an ordinary moment after your Ask is real, in first person. Notice how it feels in your body.', example: 'Walking into my own studio on a Tuesday morning. Shoulders loose, chest open.', rough: 'Thirty seconds is enough.' },
    { id: 'sig-2', side: 'signal', title: 'Name the gap', minutes: 3, what: 'Right after picturing it, write the feeling that shows up next. Feel it instead of covering it.', example: 'Picturing it felt amazing, then: “Who am I to run a studio?”', rough: 'One word for the feeling.' },
    { id: 'sig-3', side: 'signal', title: 'Hold one feeling', minutes: 1, what: 'Choose one feeling from your future to hold today, steady rather than high: calm, enough, sure.', example: 'Today I’m holding “enough”. Checked in with it at lunch and at 2:47.', rough: 'Just name the feeling once.' },
    { id: 'sig-4', side: 'signal', title: 'Live it once', minutes: 10, what: 'Make one choice today that the version of you who already has your Ask would make.', example: 'The person with a full client list doesn’t discount. Quoted my real rate.', rough: 'Name the choice. Make it tomorrow.' },
    { id: 'sig-5', side: 'signal', title: 'Signal check', minutes: 1, what: 'Stop for a moment and ask: what am I holding right now? Is it what I want to be putting out?', example: 'Holding: rushed and behind. Took three breaths, back to steady.', rough: 'Just ask the question.' },
    { id: 'sig-6', side: 'signal', title: 'What’s moving', minutes: 3, what: 'Tonight, write the signs that something is moving: a door, a person, a coincidence. Thank it.', example: 'An old client emailed out of nowhere. Saw a studio for rent on my walk.', rough: 'One sign.' },
    { id: 'sig-7', side: 'signal', title: 'Release the how', minutes: 2, what: 'Write your Ask, then write: “The how and the when are open.” Notice your grip loosen.', example: '“Own a studio by next fall. The how and the when are open.”', rough: 'Say it once.' },
    { id: 'sig-8', side: 'signal', title: 'Ninety seconds with it', minutes: 2, what: 'When a big feeling hits, set a timer for ninety seconds and let it move through without fixing it.', example: 'Anger after the call. Timer on, breathing, let it crest. Calmer by the end.', rough: 'Three slow breaths with it.' },
    { id: 'sig-9', side: 'signal', title: 'One step up', minutes: 2, what: 'From the feeling you’re in, pick the next one up that you can actually believe.', example: 'Hopeless → frustrated → “maybe there’s another way”.', rough: 'Name the next feeling up.' },
    { id: 'pwr-1', side: 'power', title: 'Where did I hand it over?', minutes: 3, what: 'Finish this sentence honestly: “I can’t move forward until ___.” Is that really true?', example: '“I can’t launch until a big account takes a chance on me.” Not true. I can launch to ten people.', rough: 'Just finish the sentence.' },
    { id: 'pwr-2', side: 'power', title: 'Take what resonates', minutes: 5, what: 'After advice from anyone (a mentor, a coach, a book, a video), write two lists: what to keep, and what to leave.', example: 'Keep: post every week. Leave: “wake up at 4 a.m.” That’s not me.', rough: 'One keep, one leave.' },
    { id: 'pwr-3', side: 'power', title: 'Advice as a Try', minutes: 5, what: 'Pick one piece of advice and test it for a week, as a Try, before deciding whether it’s yours.', example: 'Tried batch-writing on Sundays for a week. Worked for emails, not for ideas.', rough: 'Test it once.' },
    { id: 'pwr-4', side: 'power', title: 'My way', minutes: 10, what: 'Write how you’d go after your Ask if no one had ever told you how.', example: 'I’d skip the funnel and just call the ten people I’d most love to work with.', rough: 'One line.' },
    { id: 'pwr-5', side: 'power', title: 'Credit check', minutes: 2, what: 'When something works this week, write what you did to make it happen.', example: 'Got the meeting because I followed up twice, not because of the template.', rough: 'Name one thing you did.' },
    { id: 'pwr-6', side: 'power', title: 'Take back one key', minutes: 10, what: 'Pick one thing you’ve been waiting on someone else for, and take one step on it without them.', example: 'Stopped waiting for my business partner to start the site. Bought the domain myself.', rough: 'Name the key you want back.' },
    { id: 'tool-8', side: 'tools', title: 'The arrival review', minutes: 15, what: 'When you reach your Ask, write what changed, what it drains and amplifies, how it lands on the people around you, and what it costs to keep.', example: 'More money, less sleep. My partner loves it, my kids miss me on Saturdays. Keeping it means one weekend off a month.', rough: 'What changed, in one line.' }
  ],

  // Encouragement: Jarred's voice cheering people on through the app. Two voice rules shape every line:
  // praise only what they actually did, and no hype. Lines respond to real moments and real actions.
  encouragement: {
    planStart: 'This week is yours. Seven small steps, and every one counts, including the rough-day versions.',
    days: {
      1: 'Day one. Start small and let it be easy. Showing up is the whole win today.',
      2: 'Day two is where most people quietly stop. You’re here. That already matters.',
      3: 'Three days in, you’re building proof, and your gut is starting to notice.',
      4: 'Halfway. Today is for honesty, not effort. Sit with the question, even if it’s uncomfortable.',
      5: 'You’re past the middle. Whatever this week has looked like so far, today counts.',
      6: 'One more step before the look back. Keep it light, and enjoy it if you can.',
      7: 'Last day. Look at what you actually did. It’s probably more than you think.'
    },
    done: [
      'Done. That’s a receipt your gut can read.',
      'Kept. Small promises like that are how you start trusting yourself.',
      'That counts. Quietly, it all adds up.',
      'Marked. Notice how it feels to follow through.',
      'Another one. You’re becoming someone who does this.',
      'Rough-day version? It counts just the same.'
    ],
    missed: 'Back at it. No catch-up needed. Today’s step is the only one that matters.',
    progress: {
      0: 'Day one is waiting. Start with the smallest version.',
      1: 'One down. That’s how every change starts.',
      2: 'Two days. You’re building something.',
      3: 'Three days of proof. Keep it small and keep going.',
      4: 'Four days. More than half the week, done.',
      5: 'Five days. Your gut has real evidence now.',
      6: 'Six days. One look back to go.',
      7: 'All seven. Take that in. You did this.'
    },
    // the daily check-in: what Jarred says back to full, half or rough
    checkin: {
      full: 'Plenty of steam. Do the whole step, and enjoy it.',
      half: 'Some steam. Do a shorter version. It still counts.',
      halfMany: 'Some steam. Pick one Ask and do its step. That counts as the day.',
      rough: 'Low steam. Just the small version today. It counts the same.'
    },
    tomorrow: 'That’s today, done. Rest easy.',
    future: 'Today’s step is the only one that matters.',
    missedDay: 'This one slipped by. That’s okay. No catch-up, just today.',
    // the week ended without all seven kept: honest, no guilt. {n} is how many days were kept.
    weekDone: 'Seven days, {n} done. That’s real information, not a verdict. Take your look back, then shape next week.',
    allDone: 'All seven days. Not perfect, just real, and that’s exactly how this works. Take your look back, then we’ll build next week.'
  },

  // Drill-down layers for each protocol: when to bring it up (signals from check-ins), where to start, how to go
  // deeper, how to tell it's working, when it's done, how it shifts by type (only where it differs), and what
  // naturally comes next. The plan generator uses these to pick and pace protocols.
  layers: {
    'new-habit': { signals: ['Their Ask is something to do regularly: move, write, save, wake earlier.', 'They keep restarting the same habit.'], start: 'Week 1: name it and shrink it, plus the tiny daily version. Nothing else.', deeper: 'Week 3 on: add the anchor, the three versions and the weekly look back. Grow it one notch only when it feels easy most days.', working: ['They do some version most days without being reminded.', 'Misses are single days, not runs of days.'], done: 'When it happens most days without much effort for about four weeks. Then it becomes background, and a new Ask can start.', byType: { dreamer: 'Keep the step tiny and concrete. Their risk is planning instead of doing.', achiever: 'Cap it. Their risk is turning a habit into a punishing schedule.', pendulum: 'Lean on the rough-day version so the habit survives the crash weeks.' }, next: ['unlearn', 'error'] },
    'unlearn': { signals: ['Their Ask is about stopping something: scrolling, snacking, procrastinating, overworking.', 'They mention the same habit winning again and again.'], start: 'Week 1: notice and track the trigger only. No changes yet.', deeper: 'Week 2 on: make the old way harder, add the swap, and use the slip debrief after any slip.', working: ['They can name their triggers and the payoff.', 'The time between slips gets longer.'], done: 'When the old habit is rare and the swap feels normal. Keep the slip debrief for the odd hard day.', byType: { excavator: 'They’ll understand the trigger fast. Push on to the swap and the action.', dreamer: 'They may want to quit cold. Slow it down: one change at a time.' }, next: ['new-habit', 'field'] },
    'field': { signals: ['They describe a person, feed, food or commitment that keeps pulling against their Ask.', 'They feel drained without knowing why.'], start: 'Week 1: the field check only. See what’s there before changing anything.', deeper: 'Week 2 on: one boundary or one cleared space at a time, then fill the gap.', working: ['More energy, or less dread, in the parts of the week they changed.', 'Their boundaries hold without a fight.'], done: 'Ongoing and light: a field check once a month.', byType: { achiever: 'They keep draining commitments out of duty. Start with one commitment.', calibrated: 'Use it as maintenance, not a big clear-out.' }, next: ['circle', 'agency'] },
    'price-check': { signals: ['They’ve missed several days in a row, or say the Ask feels wrong.', 'Their check-ins sound stuck, heavy or resentful.'], start: 'The pause, and the question: friction or signal?', deeper: 'Look back 2 to 4 weeks and choose: keep going, change the shape, not now, or let go.', working: ['They make a clear choice instead of drifting.', 'If they keep going, the step fits again.'], done: 'Once a choice is made and written down. Revisit only on the date they set.', byType: { dreamer: 'Check whether it’s fear of the work, not the Ask itself.', pendulum: 'Check whether it’s just the low half of the swing before deciding anything.' }, next: ['flow-read', 'tries'] },
    'tries': { signals: ['They don’t know yet what they want.', 'They’re weighing a big change: a career, a business, a move.'], start: 'Call it a Try, set the length, and pick what to notice.', deeper: 'Run it for real, then the full data debrief, and add to their “What I’m learning about me” list.', working: ['They finish Tries instead of quietly dropping them.', 'Their “learning about me” list keeps growing.'], done: 'At the end of each Try, with a clear decision: Build, another Try, or close it.', byType: { excavator: 'Keep the Try short, so thinking doesn’t replace trying.', achiever: 'Remind them a Try is allowed to be fun and imperfect.' }, next: ['receive', 'price-check'] },
    'gut': { signals: ['They skip a step and say it felt wrong.', 'They say something like “something’s telling me…”.'], start: 'Make one gut call on purpose, and write it down.', deeper: 'Check back at two weeks, and keep a gut record over the months.', working: ['They can tell more often whether it was intuition or fear.', 'They trust themselves faster.'], done: 'Always available. The gut record keeps growing.', byType: { dreamer: 'Watch for “gut” used to dodge the hard part. The check-back matters most.', achiever: 'Encourage it. They tend to override their gut with effort.' }, next: ['flow-read'] },
    'receive': { signals: ['They say they reached their Ask, or a big milestone.'], start: 'Mark it, and write what changed.', deeper: 'The 30-day and 90-day reviews, then decide what to keep, adjust or let go.', working: ['They can name what it costs to keep, not only what it gave.'], done: 'After the 90-day review. Then the next Ask, when they’re ready.', byType: { achiever: 'Make them stop and mark it before jumping to the next goal.', dreamer: 'Help them see it was their steps, not luck.' }, next: ['hold'] },
    'hold': { signals: ['After an Ask is reached.', 'They describe an old situation showing up again.'], start: 'Pick their word for tests, and log the first test.', deeper: 'Spot the same test in new forms, and update their load and their circle.', working: ['More new responses than old reactions.', 'They spot repeat tests early.'], done: 'When the new level feels normal. Tests still come; they just don’t knock them back.', byType: { pendulum: 'Tests often land in the crash weeks. Prepare them for that.' }, next: ['circle', 'field'] },
    'precise': { signals: ['Their Ask is vague: “be happier”, “get healthy”, “make more money”.', 'Their check-ins use “try to”, “never”, “always”.'], start: 'Rewrite the Ask once, exact and true.', deeper: 'A weekly word check on their check-ins.', working: ['Their Ask names the thing, the amount and the when.'], done: 'When precise is their default. Then it’s a quick check at each new Ask.', byType: { dreamer: 'Their Asks tend to be beautiful and vague. Make them specific.', excavator: 'They may over-polish the words. Precise, then move.' }, next: ['error'] },
    'alone': { signals: ['They mention feeling lonely, unseen, or having no one to tell.', 'Several check-ins in a row with no mention of other people.'], start: 'Name it without shame, and send one small message.', deeper: 'Show up somewhere regularly, and let one person in a little more.', working: ['They have at least one regular face, and one person they can be real with.'], done: 'When they feel connected most weeks. Check solitude or isolation once a month.', byType: { achiever: 'They often isolate by working. Put connection on the calendar.' }, next: ['circle', 'doors'] },
    'too-much': { signals: ['They describe being snappy, foggy, or wired but tired.', 'Several full days in a row with no rest.'], start: 'The quiet reset, and cut one input.', deeper: 'Protect recharge time every week, and find their own mix of people and quiet.', working: ['They notice overload earlier.', 'Their recharge time actually happens.'], done: 'When their week has a rhythm with real quiet in it.', byType: { pendulum: 'Overload often comes right before the crash. Catch it in the good weeks.', achiever: 'Rest feels like falling behind. Frame it as part of the plan.' }, next: ['yes', 'alone'] },
    'doors': { signals: ['Their Ask needs people or chances they don’t have yet.', 'They feel stuck in the same circle.'], start: 'Decide which doors, and tell three people their Ask.', deeper: 'One new room a month, give first, and follow up.', working: ['New conversations, invites or offers start showing up.'], done: 'Ongoing. Check it at each new Ask.', byType: { excavator: 'They’ll research rooms forever. Book one.', dreamer: 'They share the dream but skip the follow-up. Make the follow-up the step.' }, next: ['circle'] },
    'flow-read': { signals: ['They’re unsure whether an Ask, path or person is right.', 'Every step feels like pushing uphill.'], start: 'Start the flow log.', deeper: 'After 2 to 4 weeks, read the pattern, then lean in, or choose with the Price check.', working: ['They can say where things flow and where they’re forcing.'], done: 'After a clear read. Then whenever a path or person feels off.', byType: { achiever: 'They read resistance as a reason to push harder. Slow the read down.', dreamer: 'They may read normal effort as resistance. Look at the 2 to 4 week pattern.' }, next: ['price-check', 'gut'] },
    'yes': { signals: ['They’re overcommitted, or mention saying yes to things they didn’t want.', 'Their cup is empty most days.'], start: '“Let me get back to you”, and check your cup.', deeper: 'A smaller yes, and changing one yes they gave too fast.', working: ['Fewer regretted yeses.', 'More of their time goes to their Ask.'], done: 'When pausing before yes is automatic.', byType: { achiever: 'Their worth is often tied to helping. Pair this with “Your worth, held”.' }, next: ['no', 'agency'] },
    'agency': { signals: ['They describe someone taking advantage, or acting differently around a person.', 'Their no keeps turning into a yes.'], start: 'Where do I shrink?, and the two-way check.', deeper: 'One act of agency in their presence, and one boundary with a clear consequence.', working: ['They do what they’d normally do, even with that person around.'], done: 'When they can stay themselves around that person, or have chosen distance.', byType: {}, next: ['no', 'speak', 'worth'] },
    'no': { signals: ['They say saying no feels rude, mean or scary.'], start: 'Write the no ladder, and say the easiest no.', deeper: 'Climb the ladder, repeat calmly under pushback, and ride the guilt wave.', working: ['Their nos get shorter, and the guilt passes faster.'], done: 'When a no doesn’t need a speech.', byType: {}, next: ['speak'] },
    'speak': { signals: ['They swallow their opinions, or hint instead of asking.'], start: 'One true sentence in a low-stakes moment.', deeper: '“I” statements in harder moments, and asking directly.', working: ['They say what they think more days than not.'], done: 'When speaking up feels normal, not brave.', byType: {}, next: ['worth'] },
    'worth': { signals: ['They talk themselves down, or feel they have to earn their place.', 'Error thoughts about not being good enough.'], start: 'Keep one small promise a day, and start a proof list.', deeper: 'Answer the critic, drop the shrink words, and name your price.', working: ['The proof list keeps growing.', 'They let compliments land.'], done: 'Ongoing, quietly. Worth grows with every kept promise.', byType: { achiever: 'Their worth rides on output. Practice it on rest days too.', dreamer: 'Worth needs proof, not only vision. Kept promises first.' }, next: ['error', 'circle'] },
    'error': { signals: ['They write harsh things about themselves in check-ins: “I’m stupid”, “I always mess up”.'], start: 'Catch it and say “error thought”. Flipping can come later.', deeper: 'Flip it, ask whose voice it is, back it up with action, and keep the log.', working: ['They catch error thoughts faster, and the same ones show up less.'], done: 'When catching and flipping happens on its own most of the time.', byType: { excavator: 'They’ll want to analyze the thought. Catch it, flip it, act.' }, next: ['worth'] },
    'circle': { signals: ['They describe the people around them pulling them back.', 'Their Ask needs a different crowd.'], start: 'Map your five.', deeper: 'Rebalance one hour a week, be in the room, and invest in chosen family.', working: ['They spend more time with people who amplify them.'], done: 'Check every few months.', byType: {}, next: ['doors'] },
    'agreements': { signals: ['Conflict, hurt feelings or misunderstandings in their check-ins.'], start: 'The evening check, once a day.', deeper: 'Practice one of the four on purpose each week.', working: ['Fewer arguments from guesses, and less taking things to heart.'], done: 'Always on, as a nightly habit.', byType: {}, next: ['speak'] },
    'comeback': { signals: ['No check-ins for a week or more, and then they return.'], start: 'The rough-day version for three days.', deeper: 'Remove one easy exit, and tell someone they’re back.', working: ['They come back faster after each gap.'], done: 'After a week of steps. Then back to the normal plan.', byType: { pendulum: 'Coming back is their core skill. Celebrate fast returns.' }, next: ['new-habit'] },
    'body': { signals: ['They mention poor sleep, exhaustion or skipped meals.', 'Low steam most days for a week.'], start: 'One basic, usually sleep or a daily walk.', deeper: 'Add one basic at a time, and notice the effect on their steam.', working: ['More full or half days, fewer rough ones.'], done: 'When the basics run in the background. Check once a month.', byType: { achiever: 'They often trade sleep for output. Start with sleep.' }, next: ['too-much'] },
    'change': { signals: ['They mention a move, a breakup, a job loss, an illness, a new baby or a death.'], start: 'Gentle mode, and one anchor.', deeper: 'Ask for specific help. When they’re ready, what this change makes room for.', working: ['They get through the days with some steadiness.'], done: 'When the ground feels steadier. Then ease back into the normal plan.', byType: {}, next: ['values', 'alone'] },
    'signal': { signals: ['Every Ask, from the start.', 'Their check-ins show them wanting it but feeling far from it, or trying to think their way there with words alone.'], start: 'Live it for two minutes, and name the gap.', deeper: 'Hold one feeling each day, live it once a day, check your signal at 2:47, and release the how.', working: ['Their 2:47 checks show the feeling holding more often.', 'They notice doors and signs, and act on them.'], done: 'Never done. It’s the background of every Ask; it just gets steadier.', byType: { dreamer: 'They feel the future easily. Their work is the gap and the action: name it, then live it once.', achiever: 'They act easily but skip the feeling. Their work is to picture it and let themselves want it.', excavator: 'They’ll analyze the gap. Feel it, then live it once.' }, next: ['emotions', 'flow-read'] },
    'emotions': { signals: ['They describe a big feeling, or the same heavy feeling for days.', 'Their check-ins swing from very high to very low.'], start: 'Name it exactly, and find it in your body.', deeper: 'Feel it fully, hear what it’s telling you, move one step up, and act from there.', working: ['They name feelings more exactly.', 'Big feelings pass faster, without being bottled up.'], done: 'When moving through a feeling is something they know how to do.', byType: { pendulum: 'Their highs and lows are big. Steadier steps up, not leaps.', calibrated: 'Use it for the occasional big hit.' }, next: ['signal', 'error'] },
    'power': { signals: ['They say they can’t move until someone else does something.', 'They’re following someone’s method to the letter and it isn’t working for them.', 'They mention a coach, course or mentor as the answer.'], start: 'Where did I hand it over? and Take what resonates.', deeper: 'Advice as a Try, write their own way, and take back one key.', working: ['They talk about advice as input, not rules.', 'They take credit for what works.'], done: 'When they trust their own read first and use advice to sharpen it.', byType: { dreamer: 'They may wait for the perfect mentor or course. Take back one key now.', achiever: 'They may follow a system to the letter. Keep the parts that fit them.', excavator: 'They may collect advice instead of testing it. Run one piece as a Try.' }, next: ['gut', 'tries'] },
    'values': { signals: ['They say their Ask doesn’t feel like theirs.', 'Strong resistance with no clear reason.'], start: 'Whose Ask is it?', deeper: 'Find their top three values, and check the Ask against them.', working: ['They can say why their Ask matters to them, in their own words.'], done: 'Once the Ask is checked. Revisit once or twice a year.', byType: {}, next: ['precise', 'tries'] }
  },

  // Life areas: so each plan's examples fit what the person is working on, not a generic example.
  areas: [
    { id: 'money', name: 'Money', ask: '“Have $2,000 saved by June.”', step: 'Move $10 to savings today.', boundary: '“I can’t lend money right now.”', flip: '“I’m terrible with money” becomes “I’m learning money, one habit at a time.”', tryIt: 'Two weeks of writing down every purchase.' },
    { id: 'health', name: 'Health and body', ask: '“Walk 20 minutes, five days a week.”', step: 'Shoes on, ten-minute walk.', boundary: '“I’m not drinking this weekend.”', flip: '“I have no willpower” becomes “I’m building it with small wins.”', tryIt: 'Three weeks of a beginner class.' },
    { id: 'love', name: 'Love and relationships', ask: '“One honest talk with my partner every week.”', step: 'Send one real message.', boundary: '“I need Friday nights to myself.”', flip: '“No one will want me” becomes “The right person will want the real me.”', tryIt: 'A month of saying yes to meeting new people.' },
    { id: 'work', name: 'Work and purpose', ask: '“Land three new clients by March.”', step: 'Send one pitch.', boundary: '“I’m off email after 7.”', flip: '“I’m not qualified” becomes “I’m qualified to start, and I’ll learn the rest.”', tryIt: 'A two-week side project.' },
    { id: 'creative', name: 'Creativity', ask: '“Finish one song a month.”', step: 'Ten minutes with the instrument.', boundary: '“Sunday mornings are for making.”', flip: '“I’m not creative” becomes “I make things, and I’m getting better.”', tryIt: 'Two weeks of one sketch a day.' },
    { id: 'home', name: 'Home and family', ask: '“Dinner together three nights a week.”', step: 'Plan tonight’s meal.', boundary: '“Phones go in the basket at dinner.”', flip: '“I’m a bad parent” becomes “I’m showing up, and learning as I go.”', tryIt: 'A month of a Sunday family walk.' }
  ],

  // Pathways: arcs through the protocols, so a plan can carry someone through real change over several weeks.
  pathways: [
    { id: 'voice', name: 'Finding your voice', for: 'People who please, shrink, or can’t say no.', path: ['yes', 'agency', 'no', 'speak', 'worth'] },
    { id: 'yours', name: 'Finding what’s yours', for: 'People who aren’t sure what they want.', path: ['values', 'tries', 'flow-read', 'price-check'] },
    { id: 'power', name: 'Owning your path', for: 'People waiting on someone else, or copying someone else’s way.', path: ['power', 'gut', 'tries', 'worth'] },
    { id: 'world', name: 'Clearing and rebuilding your world', for: 'People held back by what and who is around them.', path: ['field', 'circle', 'doors'] },
    { id: 'pattern', name: 'Breaking an old pattern', for: 'People stuck in a habit or a way of thinking.', path: ['error', 'unlearn', 'new-habit'] },
    { id: 'steady', name: 'Getting steady', for: 'People who are overloaded, depleted or swinging.', path: ['body', 'too-much', 'alone'] },
    { id: 'arrive', name: 'Arriving and holding', for: 'People reaching their Ask.', path: ['receive', 'hold', 'circle'] },
    { id: 'calling', name: 'Calling it in', for: 'Every Ask: getting clear, feeling it, holding it, and receiving it.', path: ['precise', 'signal', 'emotions', 'flow-read', 'receive'] },
    { id: 'back', name: 'Coming back', for: 'People returning after a gap or a hard season.', path: ['change', 'comeback', 'new-habit'] }
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

// Playbook v2 (lib/playbook-v2.js): deeper help for every step. Why it helps, a walkthrough, if you get stuck,
// and a made-up "in real life" story. Live by default; an entry set to null there means no extra help for that step.
const v2 = require('./playbook-v2');
module.exports.reps.forEach((r) => { if (v2.help[r.id]) r.help = v2.help[r.id]; });
module.exports.helpVersion = v2.version;
