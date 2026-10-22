/* The Other Half app — words the app shows. Edit copy here; app.js only reads it.
   Quiz answers score -2 (A), 0 (both) or +2 (B). */
var OH_CONTENT = {
  pairs: [
    { id: 'dd', a: 'Desire', b: 'Discipline' },
    { id: 'ff', a: 'Faith', b: 'Friction' },
    { id: 'aa', a: 'Ambition', b: 'Acceptance' },
    { id: 'ct', a: 'Control', b: 'Trust' }
  ],
  // names for the two patterns that aren't pole pairs (used in the "See all 12 questions" list)
  patterns: { swing: 'The swing', insight: 'Insight vs. action' },
  // short lines that appear above a few questions, so the quiz feels like it's building toward something
  moments: { 1: 'Go with your first instinct.', 6: 'Your balance is starting to show.', 12: 'Six left. Your type is taking shape.', 18: 'Last one.' },
  // `on` is the pair or pattern a question measures: a pair id, or 'swing' / 'insight'.
  // `ask` is the setup, read once; `a` and `b` are short endings. Rule: anyone gets each question in under 5 seconds.
  questions: [
    { on: 'dd', ask: 'When I want something…', a: 'I picture it and feel it.', b: 'I make a plan and get to work.' },
    { on: 'dd', ask: 'When I’m not feeling motivated…', a: 'I wait for the feeling to come back.', b: 'I put the effort in anyway.' },
    { on: 'ff', ask: 'When something goes wrong…', a: 'I trust it happened for a reason.', b: 'I look at what I missed.' },
    { on: 'ff', ask: 'When fear or doubt shows up…', a: 'I push it aside and stay positive.', b: 'I sit with it and ask what it’s telling me.' },
    { on: 'aa', ask: 'Right now, I’m…', a: 'Pushing hard for what’s next.', b: 'Happy with where I am.' },
    { on: 'aa', ask: 'When I hit a goal…', a: 'I set a bigger one right away.', b: 'I enjoy it for a while.' },
    { on: 'ct', ask: 'When something really matters…', a: 'I do it myself so it’s done right.', b: 'I let others help carry it.' },
    { on: 'ct', ask: 'Asking for help…', a: 'Feels hard for me.', b: 'Comes easy for me.' },
    { on: 'swing', ask: 'Most of my weeks are…', a: 'Pretty steady.', b: 'Amazing or awful.' },
    { on: 'swing', ask: 'After a really good stretch…', a: 'I keep the same pace.', b: 'I crash, then scramble to catch up.' },
    { on: 'insight', ask: 'When I notice a pattern in myself…', a: 'I change something that week.', b: 'I think it over for a while first.' },
    { on: 'insight', ask: 'I’m better at…', a: 'Taking action.', b: 'Figuring out why.' },
    // added 2026-10-22: a third question for each trait, so one answer can't flip a type (kept at the end so old result links still read)
    { on: 'dd', ask: 'On a busy week, the thing I want most…', a: 'Waits until I have time.', b: 'Still gets a small slot.' },
    { on: 'ff', ask: 'When a plan stalls…', a: 'I trust it’ll come together.', b: 'I look for what to change.' },
    { on: 'aa', ask: 'When I look at my life right now…', a: 'I mostly see what’s missing.', b: 'I mostly see what’s working.' },
    { on: 'ct', ask: 'When plans change last minute…', a: 'I take over and fix it.', b: 'I go with it and adjust.' },
    { on: 'swing', ask: 'My motivation is…', a: 'About the same most days.', b: 'All in, or nothing.' },
    { on: 'insight', ask: 'When I learn something about myself…', a: 'I try something new right away.', b: 'I want to understand it fully first.' }
  ],
  // what each answer tells us, said back to them ("why we think so"), one line per ending, in question order
  evidence: [
    ['When you want something, you see it and feel it before you plan it.', 'When you want something, you make a plan and get moving.'],
    ['When motivation fades, you wait for the feeling to come back.', 'When motivation fades, you put the effort in anyway.'],
    ['When something goes wrong, you trust it happened for a reason.', 'When something goes wrong, you look for what you missed.'],
    ['When fear shows up, you push it aside and stay positive.', 'When fear shows up, you sit with it and ask what it’s telling you.'],
    ['Right now, you’re pushing hard for what’s next.', 'Right now, you’re mostly happy with where you are.'],
    ['When you hit a goal, you set a bigger one right away.', 'When you hit a goal, you let yourself enjoy it.'],
    ['When something really matters, you do it yourself.', 'When something really matters, you let others help carry it.'],
    ['Asking for help is hard for you.', 'Asking for help comes easily to you.'],
    ['Most of your weeks are pretty steady.', 'Your weeks tend to be amazing or awful.'],
    ['After a good stretch, you keep the same pace.', 'After a good stretch, you crash, then scramble to catch up.'],
    ['When you spot a pattern in yourself, you change something that week.', 'When you spot a pattern in yourself, you think it over first.'],
    ['You’re better at taking action than figuring out why.', 'You’re better at figuring out why than taking action.'],
    ['On busy weeks, what you want most waits until there’s time.', 'Even on busy weeks, what you want most still gets a small slot.'],
    ['When a plan stalls, you trust it’ll come together.', 'When a plan stalls, you look for what to change.'],
    ['When you look at your life, you mostly see what’s missing.', 'When you look at your life, you mostly see what’s working.'],
    ['When plans change last minute, you take over and fix it.', 'When plans change last minute, you go with it and adjust.'],
    ['Your motivation is about the same most days.', 'Your motivation runs all in, or nothing.'],
    ['When you learn something about yourself, you act on it right away.', 'When you learn something about yourself, you want to understand it fully first.']
  ],
  // how each type tends to answer, trait by trait (-2 to 2, same direction as the answers), and how much each trait
  // matters to that type. A person's type is the profile their answers sit closest to; nothing depends on order.
  profiles: {
    dreamer:    { at: { dd: -1.8, ff: -1.5, aa: -0.5, ct: 0, swing: 0.3, insight: 0.3 }, weight: { dd: 3, ff: 2.5, aa: 0.5, ct: 0.3, swing: 0.5, insight: 0.5 } },
    achiever:   { at: { dd: 1.8, ff: 0.5, aa: -1.5, ct: -1.5, swing: -0.5, insight: -1 }, weight: { dd: 2.5, ff: 0.7, aa: 2.5, ct: 2, swing: 0.7, insight: 1 } },
    excavator:  { at: { dd: -0.3, ff: 1, aa: 0, ct: 0, swing: 0, insight: 1.8 }, weight: { dd: 0.6, ff: 1.2, aa: 0.3, ct: 0.3, swing: 0.5, insight: 3 } },
    pendulum:   { at: { dd: 0, ff: -0.3, aa: -0.6, ct: 0, swing: 1.8, insight: 0 }, weight: { dd: 0.4, ff: 0.4, aa: 0.6, ct: 0.3, swing: 3, insight: 0.3 } },
    calibrated: { at: { dd: 0, ff: 0, aa: 0, ct: 0, swing: -0.8, insight: 0 }, weight: { dd: 1, ff: 1, aa: 1, ct: 1, swing: 1.2, insight: 1 } }
  },
  // the optional last step: a few words they'd use for themselves. Never decides a type alone; it breaks near-ties
  // and gets quoted back. Each type lists words people often use when they're that type.
  selfWords: {
    dreamer: ['dreamer', 'visionary', 'creative', 'hopeful', 'optimistic', 'idealistic', 'spiritual', 'imaginative', 'intuitive', 'positive'],
    achiever: ['driven', 'hardworking', 'hard-working', 'ambitious', 'busy', 'determined', 'workaholic', 'perfectionist', 'tired', 'exhausted', 'focused', 'disciplined', 'reliable', 'responsible', 'independent'],
    excavator: ['thoughtful', 'overthinker', 'overthinking', 'analytical', 'introspective', 'curious', 'deep', 'careful', 'reflective', 'cautious', 'logical', 'thinker'],
    pendulum: ['inconsistent', 'passionate', 'intense', 'restless', 'spontaneous', 'moody', 'impulsive', 'scattered', 'all-or-nothing', 'burnt', 'burned', 'chaotic'],
    calibrated: ['balanced', 'steady', 'calm', 'grounded', 'patient', 'content', 'stable', 'consistent', 'peaceful', 'centered']
  },
  // insights that only show for a particular mix of answers. `need` lists traits and which way they lean (a = the
  // first pole or low, b = the second pole or high). The two strongest matches are shown.
  combos: [
    { need: { dd: 'a', ff: 'a' }, text: 'You can see what you want before anyone else can, and you trust it’s coming. Believing was never the hard part. The hard part is the ordinary Tuesday when the feeling is gone and the step still needs doing.' },
    { need: { dd: 'b', aa: 'a', ct: 'a' }, text: 'You carry most things yourself, and you rarely stop at a finish line before setting the next one. That’s how you got this far. It’s also why you’re tired.' },
    { need: { dd: 'b', aa: 'a' }, text: 'You turn wanting into work fast. What gets skipped is the part where you enjoy what the work got you.' },
    { need: { ct: 'a' }, text: 'You’d rather do it yourself than explain it to someone else. People probably see you as the reliable one. Few of them know how heavy that gets.' },
    { need: { swing: 'b', dd: 'a' }, text: 'When you’re inspired, you’re unstoppable. When the feeling leaves, the momentum leaves with it, and you wait for it to come back.' },
    { need: { swing: 'b', dd: 'b' }, text: 'You can push hard, just not evenly. You go all in, burn bright, then need days to recover.' },
    { need: { swing: 'b', aa: 'a' }, text: 'You chase big, crash, then chase again. The next big push always feels like the fix. Steadier would carry you further.' },
    { need: { insight: 'b', ff: 'b' }, text: 'You see your own patterns clearly, maybe more clearly than anyone around you. Knowing has never been your problem. Moving before you’re sure is.' },
    { need: { insight: 'b', dd: 'a' }, text: 'You understand what you want and why you want it. What’s missing is a small, ordinary step that turns the understanding into proof.' },
    { need: { ff: 'a', ct: 'b' }, text: 'You trust life, and you trust people. That makes you easy to be around. Just make sure trust isn’t standing in for a plan.' },
    { need: { aa: 'b', dd: 'a' }, text: 'You’re at peace with where you are, and part of you still wants more. The risk is that peace quietly turns into waiting.' },
    { need: { ff: 'b', ct: 'a' }, text: 'You see what could go wrong, so you hold on tight. Control feels like safety. It costs you rest.' },
    { need: { swing: 'a', insight: 'a', dd: 'b' }, text: 'You’re steady and you act. People can count on you. The real question is whether you’re steadily walking toward what you actually want.' }
  ],
  // The result screen. Draft copy for Jarred to review. Rules: plain words, every line understood in seconds,
  // Jarred's tone (warm, blunt, never blaming, no hype), and only the guide's own tools, explained in plain words.
  types: {
    dreamer: {
      name: 'The Dreamer', line: 'Big vision. Not much follow-through.',
      read: 'You’ve got the wanting part down: the vision, the belief, the feeling of it. What’s missing is the doing part. Small daily steps that still happen on a bad day.',
      signs: ['You can see it clearly. Your calendar can’t.', 'You feel great in the morning and stuck by lunch.', 'When fear shows up, you cover it with a positive thought.'],
      strength: 'You can feel a future before it exists. That’s real fuel, and most people don’t have it.',
      cost: 'Feeling it isn’t the same as living it. Without small daily actions, your gut never gets proof, so the good feeling fades instead of sticking.',
      rep: { title: 'One tiny step a day', what: 'Pick the thing you want. Choose a daily step so small it feels almost too easy: ten minutes, one page, one call. Do it every day for 7 days.', rough: 'Two minutes still counts. Open the doc, send the text, put your shoes on.' },
      question: { name: 'The Price', ask: 'What will this really cost me, and will I still pay it on a bad day?', hint: 'Wanting is free. Knowing the price is what makes you ready to pay it.' }
    },
    achiever: {
      name: 'The Achiever', line: 'All effort. Busy, and running on fumes.',
      read: 'You can outwork almost anyone. What’s missing is the reason underneath the work, and letting someone else carry part of it.',
      signs: ['Rest feels like falling behind.', 'It’s easier to do it yourself than to explain it.', 'You hit the goal and feel strangely flat.'],
      strength: 'You keep the promises you make to yourself. That builds real self-trust, and most people never get there.',
      cost: 'Effort without a reason wears you down. The want behind the work goes quiet, and no one else gets to help carry it.',
      rep: { title: 'The hand-off', what: 'This week, hand one task to someone else and don’t redo it. Spend the time you get back on something you actually want to do.', rough: 'Ask for one small thing. Let it be done their way.' },
      question: { name: 'The Payoff', ask: 'What am I getting out of not having it yet?', hint: 'Sometimes staying busy feels safer than getting there.' }
    },
    excavator: {
      name: 'The Excavator', line: 'Deep insight. Not enough action.',
      read: 'You understand your patterns better than most people ever will. What’s missing is action: one small step that proves the insight changed something.',
      signs: ['You can explain exactly why you do what you do.', 'Figuring something out feels like progress.', 'You think it over, and the week is gone.'],
      strength: 'You look where most people never look. That depth means when you do act, you act on the right thing.',
      cost: 'Understanding a pattern doesn’t change it. Your gut believes what you do, not what you know.',
      rep: { title: 'One step in 24 hours', what: 'Take one thing you’ve learned about yourself this week and act on it within a day, before you think it through again.', rough: 'Do the smallest version. Two minutes is enough.' },
      question: { name: 'The Fear on the far side', ask: 'If I got it tomorrow, what would I be afraid of?', hint: 'Sometimes the thinking is a way to stay safe.' }
    },
    pendulum: {
      name: 'The Pendulum', line: 'Great weeks, then the crash.',
      read: 'Your good weeks are really good, and then the crash comes. What’s missing is a plan for the crash, so it stops costing you the next good week.',
      signs: ['Your great weeks feel unstoppable.', 'Then you crash, and scramble to catch up.', 'You restart more often than you keep going.'],
      strength: 'When you’re on, you’re really on. You already know what your best looks like.',
      cost: 'A high doesn’t last on its own. Every big week borrows energy from the next one, so the crash isn’t random. It’s the other half of the pattern.',
      rep: { title: 'The five-evening check-in', what: 'For five evenings, write down three things: your lowest moment, your best moment, and how long it took you to bounce back. By day three you’ll see your pattern.', rough: 'One line is enough: low, high, bounced back or not yet.' },
      question: { name: 'The Price', ask: 'What will this really cost me, and will I still pay it on a bad day?', hint: 'Your good weeks can pay it. Plan for the bad ones.' }
    },
    calibrated: {
      name: 'The Calibrated', line: 'Holding both sides.',
      read: 'You balance both sides better than most people. Your work now is keeping that balance when life gets harder.',
      signs: ['You can rest without guilt and push without panic.', 'Bad days slow you down. They don’t knock you over.', 'You notice when you start to slip.'],
      strength: 'You already do what the method teaches. You want things and work for them. You trust, and you face what’s hard.',
      cost: 'Balance gets tested when life gets loud. The risk isn’t slipping. It’s not noticing that you have.',
      rep: { title: 'The 2:47 check', what: 'Set an alarm for the middle of your afternoon. When it goes off, ask three things: What am I feeling in my gut right now? Is it what I’d tell someone I’m feeling? Can I feel it and still do my next task?', rough: 'Just ask the last one. If the answer is yes, you’re holding steady.' },
      question: { name: 'The Fear on the far side', ask: 'If I got it tomorrow, what would I be afraid of?', hint: 'Balanced people still flinch at the finish line. Notice where you would.' }
    }
  },
  // what each lean means, per pole pair: `a` when they lean to the first pole, `b` to the second, `mid` when balanced
  pairReads: {
    dd: {
      a: 'You run on wanting. That’s powerful, but it fades on low days. Steady daily effort is what carries the want through.',
      b: 'You run on effort. It gets results, but it can run dry. Knowing what you really want is what keeps the work worth doing.',
      mid: 'Your wanting and your working move together. That’s rarer than it looks. Protect it.'
    },
    ff: {
      a: 'You trust it’ll work out and move past fear fast. The risk is ignoring fear when it’s trying to tell you something.',
      b: 'You look right at what’s wrong. The risk is getting stuck there. A little trust lets you move before every doubt is solved.',
      mid: 'You can face the hard stuff and still believe. Most people only manage one.'
    },
    aa: {
      a: 'You’re always reaching for what’s next. Stopping to enjoy what you’ve built is what keeps the reaching from wearing you out.',
      b: 'You’re at peace with where you are. Keep it a place to rest, not a place to live. A little ambition keeps peace from turning into settling.',
      mid: 'You can want more and still enjoy now. Keep both.'
    },
    ct: {
      a: 'You carry things yourself so they’re done right. Letting someone hold part of the load is how you stop running on empty.',
      b: 'You share the load easily. Just make sure you still own the parts only you can do.',
      mid: 'You know what to hold and what to hand off. That’s a skill, not luck.'
    }
  },
  // added when the swing or the thinking pattern shows up, whatever the type
  patternReads: {
    swing: 'Your weeks swing up and down. That’s not a flaw in you. It just means you need a plan for the down part.',
    insight: 'You think before you act. Good instinct. Just make sure the thinking ends in a step.'
  }
};
// the browser reads window.OH_CONTENT; the server (api/quiz.js) requires this file
if (typeof module !== 'undefined' && module.exports) module.exports = OH_CONTENT; else window.OH_CONTENT = OH_CONTENT;
