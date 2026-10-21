// Builds app/plan-sample.json: the sample plan used to review the plan template (app/plan.html?… with no id, and
// the plan email preview). An Achiever with two Asks. Run: node scripts/build-plan-sample.js
const fs = require('fs');
const path = require('path');
const { assemble } = require('../lib/plan');

const plan = assemble({
  type: 'achiever', typeName: 'The Achiever', r: 'bbaoobaooaoa',
  asks: [
    { text: 'Run a 5K by spring.', otherHalf: 'desire', protocol: 'new-habit' },
    { text: 'Stop working past 7 p.m.', otherHalf: 'trust', protocol: 'unlearn' }
  ],
  read: 'You already know how to put the work in. This week isn’t about more effort. It’s about remembering why you want to cross that finish line, and letting the workday end, so both the running and your evenings start to feel like yours.',
  days: [
    { steps: [{ ask: 0, id: 'des-1', example: 'Run a 5K → feel strong in my body again → keep up with my kids on Saturdays.' }, { ask: 1, id: 'hab-4', example: '7:20 p.m., one more email “so tomorrow’s easier”. Felt: anxious, behind.' }] },
    { steps: [{ ask: 0, id: 'dis-1', example: 'Walk-run for ten minutes: one minute jogging, two minutes walking.' }, { ask: 1, id: 'fld-2', example: 'Tell the team: “I’m offline after 7. I’ll pick it up first thing.”' }] },
    { steps: [{ ask: 0, id: 'hab-2', example: 'Right after school drop-off, I walk-run before I go home.' }, { ask: 1, id: 'hab-5', example: 'Laptop goes in the hall closet at 7. Email off my phone’s home screen.' }] },
    { question: 'payoff', hint: 'Sometimes staying busy feels safer than getting there.' },
    { steps: [{ ask: 0, id: 'sig-1', example: 'Crossing the finish line in April, legs heavy, someone handing me water, smiling for no reason.' }, { ask: 1, id: 'hab-6', example: 'When the urge to check email hits after 7: ten minutes outside with the dog instead.' }] },
    { steps: [{ ask: 0, id: 'lse-2', example: 'A goofy race with the kids around the block. No watch, no pace.' }, { ask: 1, id: 'hab-7', example: 'Worked till 8 on Thursday. What set it off: a late client email. Next time: reply at 8 a.m.' }] },
    { lookback: true }
  ]
});
fs.writeFileSync(path.join(__dirname, '..', 'app', 'plan-sample.json'), JSON.stringify(plan, null, 2) + '\n');
console.log('plan-sample.json:', plan.asks.map((a) => a.text).join(' | '));
