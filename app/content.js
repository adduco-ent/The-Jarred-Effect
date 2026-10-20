/* The Other Half app — words the app shows. Edit copy here; app.js only reads it.
   Quiz answers score -2 (A), 0 (both) or +2 (B). */
window.OH_CONTENT = {
  pairs: [
    { id: 'dd', a: 'Desire', b: 'Discipline' },
    { id: 'ff', a: 'Faith', b: 'Friction' },
    { id: 'aa', a: 'Ambition', b: 'Acceptance' },
    { id: 'ct', a: 'Control', b: 'Trust' }
  ],
  // names for the two patterns that aren't pole pairs (used in the "See all 12 questions" list)
  patterns: { swing: 'The swing', insight: 'Insight vs. action' },
  // short lines that appear above a few questions, so the quiz feels like it's building toward something
  moments: { 1: 'Go with your first instinct.', 5: 'Your balance is starting to show.', 9: 'Four left. Your type is taking shape.', 12: 'Last one.' },
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
    { on: 'insight', ask: 'I’m better at…', a: 'Taking action.', b: 'Figuring out why.' }
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
