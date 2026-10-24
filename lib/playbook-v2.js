// Playbook v2: deeper help for every step, for people who need more to move forward.
// Written from the approved playbook (v1): its voice, hard rules and method. It goes live by default. Jarred can
// change or remove any entry at any time on the review page; to remove one, set it to null.
//   why:   why the step works, in a line or two
//   how:   3 to 4 mini-steps, shown as "Walk me through it" with a tick box each
//   stuck: what to do if they get stuck
//   story: "In real life": a short, made-up example of one person doing the step. Always labeled as made up.
//          Never about Jarred, never a promise of results, and it ends on what the person actually did.
const H = {};
module.exports = { version: 2, live: '2026-10-21', help: H };

// ---- Discipline
H['dis-1'] = {
  why: 'Small steps you actually take teach your gut that this is real. A big plan you skip teaches it the opposite.',
  how: ['Pick the smallest action that still moves your goal forward.', 'Do it whenever today allows, wherever it fits.', 'Stop when the time’s up, even if you want to keep going. Leave yourself wanting more.'],
  stuck: 'If it feels too big to start, cut it in half, then in half again. Two minutes is still a step.',
  story: 'Maya wanted to write a book and had been “about to start” for two years. Her tiny step: one page before she opened her phone in the morning. Some pages were bad. A few were good. After three weeks she had twenty-one pages, and for the first time the book felt like something she was doing instead of something she was waiting on.'
};
H['dis-2'] = {
  why: 'A fixed time breaks the first day your schedule changes. Picking today’s best window each morning keeps the step alive on real days, not ideal ones.',
  how: ['Look at today as it actually is: meetings, kids, energy.', 'Find the one moment most likely to have ten quiet minutes.', 'Put it somewhere you’ll see it: a calendar block, a sticky note, a phone reminder.'],
  stuck: 'If no window looks free, pick the least bad one and do the small version there.',
  story: 'Marcus kept setting 6 a.m. workouts and missing them after late nights with the baby. He switched to choosing each morning. Monday it was lunch. Tuesday it was after bath time. Wednesday it was ten minutes in the parking lot before work. Different every day, but it happened most days, which 6 a.m. never managed.'
};
H['dis-3'] = {
  why: 'Most streaks don’t end on a normal day. They end on the bad one. Deciding your backup ahead of time means the bad day still has a step that fits.',
  how: ['Think of what a sideways day looks like for you: no sleep, sick kid, long shift.', 'Shrink your step until it would still be doable on that day.', 'Write it in one line: “If the day goes sideways, I’ll ___.”'],
  stuck: 'If the backup still feels like too much, cut it again. The backup should feel almost too easy.',
  story: 'Priya’s step was a 20-minute run. Her backup: put on her running shoes and walk to the corner and back. The first time she needed it was a Thursday with a migraine coming on. Five minutes, slow, done. She noticed it kept the week from collapsing, because Friday didn’t feel like starting over.'
};
H['dis-4'] = {
  why: 'Trust in yourself is built the same way as trust in anyone else: small promises, kept. One kept promise a day adds up fast.',
  how: ['This morning, pick one small thing you can finish today.', 'Say it to yourself as a promise: “By tonight, I will ___.”', 'Keep it. Before bed, notice that you did.'],
  stuck: 'If you keep breaking it, the promise is too big. Make it smaller until keeping it is likely.',
  story: 'Theo was known at work for following through and at home for “I’ll get to it.” He started making one morning promise to himself: book the dentist, call his mom back, fix the cabinet door. Small stuff. By Friday he’d kept five in a row, and he caught himself saying “I’ll do it today” and meaning it.'
};
H['dis-5'] = {
  why: 'Your mind remembers what you didn’t do. A written line about what you did shows the truth, and over time it becomes proof you can lean on.',
  how: ['Keep one note or notebook just for these lines.', 'Each night, write one honest line about what you did toward your goal.', 'Include how it felt if you want, but keep it to one line.'],
  stuck: 'If you did nothing today, write “not yet.” That’s still a line, and tomorrow is a new one.',
  story: 'Elena felt like she was getting nowhere with her Spanish. She started a one-line note: “10 min app.” “Ordered in Spanish, panicked, did it anyway.” “Not yet.” A month later she scrolled back and counted 24 days with something on them. The feeling of getting nowhere didn’t match the lines, so she started trusting the lines.'
};
H['dis-6'] = {
  why: 'Waiting to feel ready keeps you waiting. Starting usually brings the motivation, not the other way around. Five minutes is enough to find out.',
  how: ['Pick the first physical action of your step: open the laptop, put on the shoes.', 'Set a five-minute timer and start, ready or not.', 'When it rings, decide honestly: keep going, or stop here. Both count.'],
  stuck: 'If even five minutes feels impossible, make it two, and make the first action tiny.',
  story: 'Jordan dreaded starting his business plan. He set a five-minute timer and opened the doc, telling himself he could stop when it rang. He wrote three messy sentences. When the timer went off he was mid-thought, so he kept going for twenty minutes. Not every day went that way, but every day started.'
};

// ---- Desire
H['des-1'] = {
  why: 'Wants that sit on the surface fade fast. The deeper why is what pulls you through the low days, because it’s about how you want to feel, not only what you want to get.',
  how: ['Write your goal at the top of a page or a note.', 'Under it, write why you want it, in one honest line.', 'Ask “why does that matter?” about that line, and write the answer. Do it once more.'],
  stuck: 'If the answers sound like what you’re supposed to say, ask: what would I want here if no one would ever know?',
  story: 'Sam wanted to run a 5K. First why: “to get in shape.” Second: “because I’m out of breath chasing my kids.” Third: “because I want to be the dad who’s in the game, not on the bench.” That third one went on a sticky note on his running shoes. On days he didn’t feel like it, he didn’t read “get in shape.” He read the bench line, and he went.'
};
H['des-2'] = {
  why: 'When work takes everything, wanting starts to feel selfish, and then it goes quiet. Naming what you want outside of work brings your desire back to life.',
  how: ['Set a timer for five minutes.', 'Write five things you want that have nothing to do with work, money or other people’s needs.', 'Circle the one that makes you feel something.'],
  stuck: 'If nothing comes, finish this line five times: “It would be nice to…”',
  story: 'Aisha couldn’t think of a single thing at first. Then: “a slow Sunday,” “a pottery class,” “to see the ocean in winter,” “to read a whole book,” “a garden.” She circled pottery. It surprised her how much she wanted it. She looked up a class that night just to see, and saved it.'
};
H['des-3'] = {
  why: 'Big goals feel far away when you only picture the finish line. Picturing an ordinary day makes it feel real, and it tells you what you’re actually after.',
  how: ['Close your eyes somewhere quiet.', 'Picture a normal weekday once your goal is real: waking up, the morning, your body.', 'Notice one detail that stands out, and write it down.'],
  stuck: 'If the picture won’t come, start with your coffee. Where are you drinking it, and how do you feel?',
  story: 'Luis pictured life after paying off his debt. Not a party, just a Tuesday. What stood out was the morning: opening his banking app without his stomach dropping. That small detail became his why. He wrote “no stomach drop” at the top of his budget sheet.'
};
H['des-4'] = {
  why: 'If everything you do has to earn its place, you lose touch with what you enjoy, and then with what you want. Doing one thing just because it’s good reconnects you.',
  how: ['Pick one thing you enjoy that has no goal: music, a walk, cooking, a show.', 'Give it fifteen minutes today.', 'Don’t multitask it. Let it just be good.'],
  stuck: 'If it feels like a waste of time, that’s the feeling this step is working on. Do it anyway, and notice how you feel after.',
  story: 'Grace couldn’t remember the last thing she did just because. She played an old album loud while she made dinner, the one from college. Fifteen minutes, singing badly. Her daughter joined in. Nothing productive happened, and she felt more like herself than she had in weeks.'
};
H['des-5'] = {
  why: 'A day full of shoulds leaves no room for wants. Crossing off one should, on purpose, makes space and shows you that most of them were optional.',
  how: ['Look at your list for today or this week.', 'Find one task that’s there because you “should”, not because it matters to you.', 'Cross it off and leave the space empty.'],
  stuck: 'If everything feels mandatory, ask: what happens if this waits a week? Usually, not much.',
  story: 'Dev had “reorganize the garage” on his list for six weekends straight. Nobody had asked him to. He crossed it off. That Saturday, the hour he’d have spent feeling guilty about the garage, he spent teaching his son to ride a bike. The garage was fine.'
};
H['des-6'] = {
  why: 'Your goal is really about a feeling. Naming the feeling tells you what you’re chasing, and sometimes it shows you a shorter path to it.',
  how: ['Write the sentence: “When this is real, I’ll finally feel ___.”', 'Fill in the blank with the first honest word.', 'Ask: is there one small way to feel a bit of that this week?'],
  stuck: 'If the word that comes is about other people, like “they’ll respect me,” ask how you’d feel then, and write that.',
  story: 'Nina filled it in: “When I get the promotion, I’ll finally feel like I’m not behind.” Behind who? She realized she’d been comparing herself to her old roommate for ten years. She still wanted the promotion, but she stopped checking her roommate’s LinkedIn, and some of that behind feeling eased right away.'
};

// ---- Faith
H['fai-1'] = {
  why: 'Doubt says “people like me don’t do this.” One real example of someone who did is hard evidence against it.',
  how: ['Think of what your goal looks like when someone else has done it.', 'Find one person, known or not, who did something similar.', 'Write down how they started, not how they finished.'],
  stuck: 'If you can’t find anyone, look for someone who did something just as hard in a different area. The starting part is usually the same.',
  story: 'Omar wanted to open a food truck at 45 and kept thinking he was too late. He found an interview with a woman who started hers at 52 with one menu item and a borrowed trailer. He wrote down “one menu item.” That night he started testing his one best dish on friends.'
};
H['fai-2'] = {
  why: 'Waiting for the doubt to leave keeps you stuck, because it usually leaves after you act. Moving with the doubt still there is how it starts to shrink.',
  how: ['Name the doubt in one line.', 'Pick one step you can take today anyway.', 'Take it, and let the doubt come along for the ride.'],
  stuck: 'If the doubt is loud, make the step smaller. You’re practicing moving with it, not beating it.',
  story: 'Hannah doubted her photos were good enough to share. She posted one anyway, doubt and all, with a short caption. Eleven people liked it, one asked about prints. The doubt didn’t vanish, but it got a little quieter, and she posted another the next week.'
};
H['fai-3'] = {
  why: 'Your mind keeps a long list of what went wrong and a short one of what went right. Writing down what worked out evens the record.',
  how: ['Think back over the last five or ten years.', 'Write three things that worked out even though you doubted them at the time.', 'Next to each, write what you did that helped.'],
  stuck: 'If nothing feels big enough, start small: a test you passed, a hard talk that went fine, a move you survived.',
  story: 'Kenji felt sure his new job would go badly. He wrote his evidence list: “Moved across the country alone. Passed the certification on the second try. Fixed things with my brother.” Next to each he wrote what he did. Reading it back, he saw the pattern: he’s someone who figures things out. He kept the list in his wallet.'
};
H['fai-4'] = {
  why: 'Many people never ask, so the answer is always no. Asking, and letting the other person decide, gives life the chance to say yes.',
  how: ['Pick one thing you want that someone else can say yes to.', 'Write the ask in one or two clear sentences.', 'Send it or say it, then let them answer. Don’t answer for them.'],
  stuck: 'If you’re afraid of the no, remember it leaves you where you are now. Nothing is lost by asking.',
  story: 'Rosa had wanted to work from home on Fridays for a year and never asked. She wrote two sentences to her manager: the ask, and how she’d stay reachable. The answer was “let’s try it for a month.” She’d spent a year assuming no.'
};
H['fai-5'] = {
  why: 'Worry leaks into the whole day when it has no place to go. Giving it a set window lets you hear it out, then get back to living.',
  how: ['Set a ten-minute timer.', 'Write every “what if” in your head, without arguing with them.', 'When the timer ends, close the notebook and do your next thing.'],
  stuck: 'If a worry comes back later, tell it: “You have a spot tomorrow.” Write it down for the next window.',
  story: 'Ben worried about money all day, in meetings, in the car, at bedtime. He gave it ten minutes at 7 p.m. with a notebook. He wrote fourteen what ifs the first night. By the fourth night it was six, and two of them had turned into to-dos he could actually do something about.'
};
H['fai-6'] = {
  why: 'Your mind spends a lot of time on what could go wrong. Spending a few minutes on what happens if it goes right gives your hope something to hold.',
  how: ['Write your goal at the top.', 'Write what happens if it goes right: a month after, a year after.', 'Notice one part that makes you feel lighter.'],
  stuck: 'If “what if it works” feels silly, write it like you’re telling a friend’s story, not your own.',
  story: 'Leah had only ever pictured her bakery going under. She wrote what happens if it works: regulars by name, her mom helping on Saturdays, paying off the oven. Reading it back, her chest unclenched. She pinned it above the counter where she does the books.'
};

// ---- Friction
H['fri-1'] = {
  why: 'Mid-afternoon is when the day wears thin and feelings get covered up. A short check at that moment shows you what you’re carrying and whether you can carry it and still keep going.',
  how: ['Set a daily alarm for mid-afternoon. Label it “2:47”.', 'When it goes off, ask: what am I feeling in my gut right now?', 'Ask: is it what I’d tell someone if they asked?', 'Ask: can I feel this and still do my next task?'],
  stuck: 'If you can’t name the feeling, pick the closest word: tired, tense, flat, okay. Close enough counts.',
  story: 'Tariq’s 2:47 alarm caught him mid-spreadsheet. Gut: anxious about the client call. What he’d tell someone: “fine.” Could he feel it and still make the call? Yes. He made the call with his stomach still a bit tight. He noticed that he’d been treating “anxious” like a stop sign, when it was really just weather.'
};
H['fri-2'] = {
  why: 'The part you avoid quietly runs the whole goal. Naming it takes away some of its power and shows you what you actually need to work on.',
  how: ['Write your goal.', 'Ask: what part of this do I keep stepping around?', 'Write it in plain words, even if it feels uncomfortable.'],
  stuck: 'If you’re not sure, look at what you keep putting off. The avoided part usually hides behind “later.”',
  story: 'Chloe wanted to grow her design business. The part she kept avoiding: talking about price. She’d send portfolios, chat, then go quiet when money came up. Naming it was humbling. It was also the first time she could see what was actually holding her back, and she started practicing her rate out loud in the car.'
};
H['fri-3'] = {
  why: 'Fear usually passes faster when you feel it instead of fighting it. Two minutes with it, then moving, teaches you that fear doesn’t have to decide.',
  how: ['When fear shows up, stop what you’re doing.', 'Notice where you feel it in your body. Breathe slowly for two minutes.', 'Then do the next thing, with the fear still there if it is.'],
  stuck: 'If two minutes feels too long, take three slow breaths or a quick five-minute walk, then move.',
  story: 'Andre felt sick before every sales call. He started sitting with it: hand on his chest, breathing, two minutes. He didn’t try to talk himself out of it. Then he dialed. The fear was still there sometimes, but it stopped running the show. He made more calls that week than the month before.'
};
H['fri-4'] = {
  why: 'Every goal costs something. Naming the cost ahead of time, and checking whether you’ll pay it on a bad day, keeps you from quitting when the price shows up.',
  how: ['Write your goal.', 'Answer: what will this really cost me? Time, comfort, money, sleep, something else.', 'Answer: will I still pay it on a bad day? If not, how could the step get smaller?'],
  stuck: 'If the cost feels too high, it doesn’t mean the goal is wrong. It may mean the step is too big.',
  story: 'Mei wanted to learn to code after work. The price: evenings and some TV. Would she pay it on a bad day? Honestly, not an hour. So she set her step at twenty minutes, three nights a week. That was a price she’d pay even tired, and she kept paying it.'
};
H['fri-5'] = {
  why: 'The moment you want to quit is often right before something gets easier. Staying a few minutes past it builds the muscle of holding steady.',
  how: ['Notice the moment you want to stop today’s step.', 'Set a timer for five more minutes.', 'Keep going until it rings, then stop with no guilt.'],
  stuck: 'If five minutes feels impossible, try one more minute. It’s about staying a little past the urge.',
  story: 'Isaac always stopped his guitar practice at the hard chord change. He started adding five minutes right when he wanted to quit. The chord was still clumsy. But he noticed his urge to stop came earlier on tired days, and staying past it taught him the urge wasn’t a real limit.'
};
H['fri-6'] = {
  why: 'A setback hurts. Looking at it with curiosity instead of blame turns it into information you can use next time.',
  how: ['Pick one thing that didn’t go your way this week.', 'Write what happened, in one line, without judging it.', 'Ask: what did this show me? Write one thing.'],
  stuck: 'If it still stings too much to look at, write how it felt first. Then come back to what it showed you tomorrow.',
  story: 'Fatima’s pitch to a big client fell flat. Her first thought was “I’m not good at this.” Instead she wrote: “Pitched for 20 minutes. Never asked what they actually needed.” That was the lesson. Her next pitch started with three questions, and it went very differently.'
};

// ---- Ambition
H['amb-1'] = {
  why: 'The far goal can feel unreachable. The next level, one step past where you are, is something you can see and start on today.',
  how: ['Write where you are with your goal right now, honestly.', 'Write what one level up looks like: not the dream, just the next step.', 'Pick one thing that moves you toward that level this week.'],
  stuck: 'If you can’t see the next level, ask someone a step ahead of you what came right after where you are.',
  story: 'Cole could run two miles and dreamed of a half marathon. The next level wasn’t 13 miles. It was three miles without stopping. He wrote that down, and added half a mile every week. It felt doable in a way the half marathon never had.'
};
H['amb-2'] = {
  why: 'Growth lives a little past comfortable. One stretch shows you that your limits are further out than you thought.',
  how: ['Pick one thing that feels a size too big for you.', 'Do the smallest real version of it today.', 'Notice how it feels afterward, whatever the outcome.'],
  stuck: 'If it feels too big to do today, draft it today and do it tomorrow. Drafting is part of the stretch.',
  story: 'Jasmine wanted to work with a well-known brand and assumed they were out of reach. She wrote the pitch, read it three times and sent it. They didn’t reply. She was surprised by how little that hurt, and the next “out of reach” email felt easier to send.'
};
H['amb-3'] = {
  why: 'Rest and settling can look the same from the outside. Telling them apart helps you rest without guilt, and notice when comfort has become a hiding place.',
  how: ['When you’re taking it easy, pause and ask: am I resting, or settling?', 'Resting: I chose it, it’s short, I feel better after.', 'Settling: I’m drifting, avoiding, and I don’t feel better.'],
  stuck: 'If you can’t tell, ask how you feel after. Rest refills you. Settling leaves you flat.',
  story: 'Raj spent most evenings on the couch and couldn’t tell if he was recharging or hiding. He asked the question for a week. Monday and Wednesday: resting, he felt better after. The other nights: settling, he was avoiding his side project. He kept two couch nights and gave the rest twenty minutes on the project.'
};
H['amb-4'] = {
  why: 'You don’t need a giant leap to grow. Raising one small standard, a notch at a time, changes how you see yourself.',
  how: ['Pick one thing you do every day or every week.', 'Decide what a notch better looks like, specifically.', 'Do it that way today.'],
  stuck: 'If it feels like nitpicking, pick something you care about. The standard should feel like respect, not pressure.',
  story: 'Bri sent client emails fast and fixed typos after. She raised one standard: read each email once before sending. It took an extra minute. Clients started replying “thanks for the clear update.” It was small, but it changed how she thought of her own work.'
};
H['amb-5'] = {
  why: 'A want you keep to yourself is easy to drop. Saying it out loud makes it real, and sometimes the person you tell can help.',
  how: ['Pick one person you trust.', 'Tell them in one sentence what you want next.', 'You don’t need a plan yet. Just say it.'],
  stuck: 'If saying it feels too exposed, write it somewhere you’ll see every day first. Say it out loud next week.',
  story: 'Noah told his sister over dinner: “I want to launch my podcast by spring.” She didn’t laugh. She asked what it was about, then said, “My coworker does audio editing.” He had kept that want to himself for a year, and within a week it had a name, a date and a possible helper.'
};
H['amb-6'] = {
  why: 'Trying new things is how you find out what you like and what you’re good at. Every try teaches you something, however it goes.',
  how: ['Pick one new thing connected to your goal: a class, an email, a tool, a route.', 'Do the beginner version.', 'Afterward, write one thing you learned about yourself.'],
  stuck: 'If nothing feels right, pick the one that makes you a little curious. Curiosity is enough.',
  story: 'Imani wanted to change careers but didn’t know to what. She tried a free beginner UX workshop. She didn’t love the software, but she loved interviewing users. That told her more than months of reading job posts. Her next try was a research course.'
};

// ---- Acceptance
H['acc-1'] = {
  why: 'When you only look at what’s left to do, you forget how far you’ve come. Counting what’s done gives you solid ground to stand on.',
  how: ['Set a five-minute timer.', 'Write five things you’ve already built, finished or handled.', 'Read them back slowly.'],
  stuck: 'If five feels like a lot, go small: a hard week you got through counts.',
  story: 'Victor felt like he’d done nothing with his thirties. He wrote: paid off the car, kept the same job through layoffs, learned to cook, stayed close with his dad, quit smoking. Reading it back, he laughed. It was a lot. He kept the list on his phone for the low days.'
};
H['acc-2'] = {
  why: 'Without a finish line, the day never feels done, and you never feel like you did enough. Deciding what “enough” is before you start gives you permission to stop.',
  how: ['Before you start today, look at what you want to get done.', 'Decide what counts as enough for today.', 'When you reach it, stop. Notice that it’s done.'],
  stuck: 'If you keep moving the line, write it down before you start. Written lines are harder to move.',
  story: 'Sofia ended every workday feeling behind, even on good days. She started writing “Enough today = ___” on a sticky note each morning. Thursday it said: “three emails, one proposal draft.” She got there by 4 p.m., closed the laptop and went for a walk. That felt strange at first, then good.'
};
H['acc-3'] = {
  why: 'Wins you don’t notice don’t count in your head. Marking one on purpose teaches your mind that progress is happening.',
  how: ['Look back at this week.', 'Pick one win, any size.', 'Mark it: tell someone, write it down, or treat yourself.'],
  stuck: 'If nothing feels like a win, pick something you did even though you didn’t want to. That’s a win.',
  story: 'Eli finished the first draft of his grant proposal and almost moved straight to the next task. Instead he texted a friend: “Draft done.” She replied with three exclamation points and a cake emoji. It took ten seconds and he smiled for an hour.'
};
H['acc-4'] = {
  why: 'Rushing everything keeps you a step ahead of your own life. Doing one thing slowly brings you back into the moment you’re actually in.',
  how: ['Pick one everyday thing: eating, walking, a shower, coffee.', 'Do it slowly, with no phone and no goal.', 'Notice three small details while you do it.'],
  stuck: 'If slowing down feels uncomfortable, that’s the point. Start with five minutes.',
  story: 'Dana always ate lunch at her desk, scrolling. She tried one lunch outside, no phone. She noticed the sandwich was actually good, the sun on her arm, a kid laughing nearby. Fifteen minutes. She went back to work calmer and kept doing it twice a week.'
};
H['acc-5'] = {
  why: 'Rest that only happens when you’re worn out isn’t rest, it’s recovery. Scheduling real rest, and keeping it, protects your steam before it runs out.',
  how: ['Look at your week and find twenty minutes.', 'Put it on your calendar as rest, like a meeting.', 'When it comes, rest for real: no podcast, no to-do list.'],
  stuck: 'If rest makes you anxious, start with ten minutes outside. Your body knows how to do this even if your mind fights it.',
  story: 'Marco ran his own shop and never stopped. He blocked “rest” on his calendar, 3 p.m. Wednesdays, twenty minutes. The first week he almost skipped it. He sat in the park with no headphones. He came back with an idea for the holiday sale that hadn’t come in weeks of pushing.'
};
H['acc-6'] = {
  why: 'Gratitude on its own can feel passive. Pairing it with what you did to earn it builds thankfulness and self-trust at the same time.',
  how: ['Name one thing you’re grateful for today.', 'Write one thing you did that helped bring it about.', 'Let both be true at once.'],
  stuck: 'If you can’t see your part in it, look smaller. Showing up counts.',
  story: 'Grace was grateful her team liked her new process. What did she do to get there? She’d asked them what was frustrating before changing anything. Writing both down, she felt thankful and capable at the same time, which was new.'
};

// ---- Control
H['con-1'] = {
  why: 'Some parts of your goal can be shared or handed off. One part only you can do. Doing that part first moves everything else.',
  how: ['List the pieces of your goal.', 'Circle the one only you can do: your voice, your decision, your skill.', 'Spend today’s step on that piece.'],
  stuck: 'If everything feels like only you can do it, ask which piece would stall the most if you didn’t.',
  story: 'Tasha’s nonprofit needed a website, a logo, a donor list and a mission statement. A volunteer could do the website. A friend could do the logo. Only she could write why it existed. She spent ten minutes on the mission statement and the other pieces started lining up behind it.'
};
H['con-2'] = {
  why: 'Undecided things take up space in your head and stall everything around them. Making one decision frees energy and moves your goal forward.',
  how: ['List what you’ve been leaving to others or to “later”.', 'Pick one you could decide today with what you already know.', 'Decide, and write it down where you’ll see it.'],
  stuck: 'If you’re stuck between two options, pick the one you can undo more easily. You can adjust later.',
  story: 'Gabe had been “looking at gyms” for two months. He picked the one closest to work and signed up that afternoon. It wasn’t perfect. But the mental tab he’d had open for weeks closed, and he went twice that week.'
};
H['con-3'] = {
  why: 'Mornings go faster when you’ve already decided. Writing tomorrow’s three steps the night before means you start the day moving instead of planning.',
  how: ['Before bed, open a note or grab a sticky note.', 'Write three small steps toward your goal for tomorrow.', 'Put it where you’ll see it first thing.'],
  stuck: 'If three feels like too many, write one. A clear one beats three vague ones.',
  story: 'Anita wrote three steps on a sticky note and stuck it on her coffee maker: “Call the bank. Draft the post. Walk at lunch.” In the morning she didn’t have to think. She called the bank while the coffee brewed. One down before 8 a.m.'
};
H['con-4'] = {
  why: 'Avoiding the numbers keeps you guessing and anxious. Looking at one real number brings you back to what’s actually true.',
  how: ['Pick one number that tracks your goal: savings, minutes, pages, sales.', 'Look at it today, honestly.', 'Write it down with today’s date. No judging.'],
  stuck: 'If looking makes your stomach drop, look anyway, quickly. Knowing is easier than guessing.',
  story: 'Will hadn’t checked his savings in three months because he was scared of the number. He looked: $1,140. Lower than he wanted, higher than he’d feared. He wrote it down. Knowing the real number made it feel like something he could work with.'
};
H['con-5'] = {
  why: 'Time for your goal disappears unless you claim it. Blocking an hour and protecting it tells everyone, including you, that it matters.',
  how: ['Look at this week and find one hour.', 'Put it on your calendar with your goal’s name on it.', 'When it comes, protect it: phone away, door closed if you can.'],
  stuck: 'If an hour won’t fit, block fifteen minutes. Protected time beats more time that gets taken.',
  story: 'Lena blocked Thursdays 6 to 7 p.m. for her online shop and told her family. The first Thursday her phone buzzed eight times. She’d left it in the kitchen, so she didn’t see it until 7:01. She listed four new products. Nothing in those eight messages was urgent.'
};
H['con-6'] = {
  why: 'Every yes to something else is a no to your goal. One clear no gives your time back to what matters to you.',
  how: ['Look at what’s coming up this week.', 'Find one thing that takes time from your goal and isn’t needed.', 'Say no to it, simply, or push it back.'],
  stuck: 'If saying no feels rude, try: “I can’t this week, but thank you for thinking of me.”',
  story: 'Darius said no to an optional Friday planning meeting he went to out of habit. Two lines: “I’m going to skip this one. Send me the notes?” That hour went to his course. Nobody minded. He wondered how many other optional meetings he’d been treating as mandatory.'
};

// ---- Trust
H['tru-1'] = {
  why: 'Holding everything yourself caps how far you can go. Handing one task off, and leaving it handed off, builds trust in others and frees you.',
  how: ['Pick one task someone else could do well enough.', 'Hand it over with a clear ask: what, and by when.', 'Don’t check, redo or correct it. Let it be theirs.'],
  stuck: 'If the urge to redo it is strong, notice it and wait a day. Most “wrong” ways turn out fine.',
  story: 'Paula did all the planning at home. She asked her husband to handle Thursday dinner. He made breakfast-for-dinner. Her first instinct was to say something. She didn’t. The kids loved it. She got an hour to herself and realized she’d been carrying things nobody asked her to carry.'
};
H['tru-2'] = {
  why: 'Figuring everything out alone is slow and lonely. One question to someone who’s been there can save you months.',
  how: ['Think of someone who’s done something like your goal.', 'Write one specific question: “What would you do first?”', 'Send it, and be open to whatever they say.'],
  stuck: 'If you don’t know anyone, ask in a community or group related to your goal. People like to help.',
  story: 'Javier wanted to start freelancing and was overwhelmed. He messaged a former coworker who’d done it: “What would you do first?” She answered: “Get one client before you build a website.” That one line saved him weeks of designing a site nobody would see yet.'
};
H['tru-3'] = {
  why: 'Correcting how people help teaches them not to help. Letting their way stand, once, shows that trust and help can grow together.',
  how: ['Notice when someone helps you today.', 'Notice the urge to fix, redo or correct their way.', 'Let it stand. Say thank you.'],
  stuck: 'If it really needs to change, wait and mention it kindly later. Not in the moment.',
  story: 'Kim’s teenage son loaded the dishwasher. Wrong, by her system. She felt her hand reaching to rearrange it. She stopped, said thanks and walked away. The dishes came out clean. He loaded it again the next night without being asked.'
};
H['tru-4'] = {
  why: 'You can’t share a load you can’t see. Mapping what you carry shows what you could hand off and what has no owner yet.',
  how: ['List everything you carry for your goal.', 'Mark each one: me, someone else, or no one yet.', 'Circle one “me” that could become “someone else.”'],
  stuck: 'If the list feels overwhelming, stop at five items. You’re looking for one to move.',
  story: 'Nadia mapped her bakery load: baking, me. Books, me. Social posts, me. Deliveries, me. Ordering, me. Seeing it all marked “me” was a wake-up call. She circled social posts and asked her niece, who loved photos, to try it for a month.'
};
H['tru-5'] = {
  why: 'You hold on to things because you assume they’ll fall apart without you. Leaving one small thing undone shows you what actually happens, usually nothing.',
  how: ['Pick one small, low-stakes thing you’d normally do right away.', 'Leave it undone on purpose today.', 'Notice what happens, and how you feel.'],
  stuck: 'If it feels risky, pick something smaller. You’re testing the fear, not your job.',
  story: 'Peter always answered work emails within ten minutes, even at dinner. He left one non-urgent email until morning. Nobody followed up. Nothing broke. He realized he’d been treating every message like an emergency, and he turned off email alerts after 7 p.m.'
};
H['tru-6'] = {
  why: 'Nobody does anything big alone. Naming who could help turns “I have to figure this out” into “I have people.”',
  how: ['Write five roles: mentor, partner, helper, peer, professional.', 'Next to each, write a name, even a maybe.', 'Leave blanks blank. They show you who to look for.'],
  stuck: 'If you can only fill one, that’s a start. One name is one more than you thought you had.',
  story: 'Ruth thought she was going it alone on her career change. She wrote: Mentor, her old professor. Peer, a woman from her coding bootcamp. Helper, her sister, for childcare on class nights. Professional, blank. Partner, her husband. Seeing four names on the page changed how alone she felt.'
};

// ---- Habits
H['hab-1'] = {
  why: 'Doing the full version on every kind of day leads to burnout or skipping. Checking in first lets you match the step to the day you actually have.',
  how: ['Before today’s step, stop and ask: is today a good, okay or hard day?', 'Good: do the whole step. Okay: do part. Hard: do the small version.', 'Do the version that matches. All three count.'],
  stuck: 'If you can’t tell, pick half. You can always do more once you start.',
  story: 'Ivan used to do his full workout or nothing. After a bad night with the baby, he checked in: rough. He did five minutes of stretching. It felt like almost nothing, but it kept the habit going, and on Friday, a good day, he did the whole workout without having to restart.'
};
H['hab-2'] = {
  why: 'Clock times break the moment your day changes. Anchoring your step to something you already do every day lets the old habit carry the new one.',
  how: ['List three things you do every day without thinking: coffee, brushing your teeth, the school run.', 'Pick the one that comes right before a good moment for your step.', 'Finish this line: “After I ___, I ___.”'],
  stuck: 'If the anchor keeps slipping, try a different one tomorrow. The right anchor feels easy.',
  story: 'Zoe kept forgetting her evening stretches. Her anchor: after she brushes her teeth at night, she stretches on the bathroom floor for five minutes. Brushing her teeth never gets skipped, so the stretching stopped getting skipped too.'
};
H['hab-3'] = {
  why: 'Missing one day is normal. Missing two starts a new habit: not doing it. Coming back with the smallest version stops the slide before it starts.',
  how: ['If you missed yesterday, don’t try to make it up.', 'Do the smallest version of your step today.', 'That’s it. You’re back.'],
  stuck: 'If guilt makes it hard to start, remember: today’s small step matters more than yesterday’s missed one.',
  story: 'Hugo missed Monday’s walk after a long day. Tuesday he felt the pull to skip again, “the week’s already ruined.” Instead he walked around the block, five minutes. Wednesday he did his full walk. The week wasn’t ruined. It had one gap in it.'
};
H['hab-4'] = {
  why: 'Habits run on autopilot, and you can’t change what you can’t see. Writing down the moment it shows up turns a blur into a pattern you can work with.',
  how: ['Keep a note on your phone called “Triggers”.', 'Each time the old habit shows up, write the time, what just happened, and how you felt.', 'No judging and no fixing yet. Just notice.'],
  stuck: 'If you forget in the moment, write it down afterward. Even a few entries a day show the pattern.',
  story: 'Mia wanted to stop late-night snacking. She tracked the trigger for three days. Every entry looked the same: after 9 p.m., after a hard work message, feeling wired and alone. It wasn’t about hunger at all. That changed what she worked on next.'
};
H['hab-5'] = {
  why: 'Willpower runs out. Friction doesn’t. One extra step between you and the old habit gives you a moment to choose.',
  how: ['Look at how the old habit happens: where, with what, and how fast.', 'Add one step in the way: move it, log out, put it in another room.', 'At the same time, make the better option easier, if you can.'],
  stuck: 'If you push straight through the barrier, make it a little bigger, or pair it with a swap.',
  story: 'Carlos scrolled for an hour every night in bed. He started charging his phone in the kitchen and put a book on his nightstand. A couple of nights he walked to the kitchen anyway. Most nights he didn’t bother. The extra twenty steps were enough.'
};
H['hab-6'] = {
  why: 'Every habit gives you something. Take it away without replacing it and the need comes back louder. A swap meets the same need in a better way.',
  how: ['Name what the old habit gives you: relief, comfort, a break, a sense of control.', 'Pick something that gives you the same thing in a better way.', 'Decide ahead of time: “When the urge hits, I’ll ___ instead.”'],
  stuck: 'If the swap doesn’t satisfy, it may be meeting the wrong need. Look again at what the old habit really gives you.',
  story: 'Ama’s afternoon vending-machine trip wasn’t about food. It was a break from her desk. Her swap: a five-minute walk to the end of the hall and back, with water. Same break, no crash. Some days she still got the snack, and that was fine.'
};
H['hab-7'] = {
  why: 'A slip is information, not a verdict. Looking at it calmly shows you exactly what to change next time.',
  how: ['Write what happened, in one line.', 'Write what set it off: the time, the place, the feeling.', 'Write one thing that would help next time. Then let it go.'],
  stuck: 'If guilt takes over, remember that you’re learning the pattern. That is the work.',
  story: 'Owen skipped the gym after a meeting ran late. His debrief: “Late meeting, tired, gym bag was at home.” What would help: pack the bag the night before and keep it in the car. He did it that night. He noticed he felt like someone solving a problem, not someone who blew it.'
};
H['hab-9'] = {
  why: 'Forcing hard work on a low day costs twice: it goes badly and drains you more. Matching the task to your steam gets more done with less fight.',
  how: ['Before you start, rate your steam: high, medium or low.', 'High: create, decide, have the hard talk. Medium: build, edit, practice. Low: plan, gather, tidy, rest.', 'Pick the part of your goal that fits today’s steam.'],
  stuck: 'If you feel guilty doing a low-steam task, remember it still moves your goal forward.',
  story: 'Lucia planned to write her pitch on Wednesday but woke up foggy. Low steam. Instead of forcing it, she gathered three examples and outlined the main points. Thursday morning, high steam, she wrote the whole pitch in forty minutes because the groundwork was already done.'
};
H['hab-10'] = {
  why: 'Everyone has hours when things come easily. Finding yours lets you put your most important work where it flows instead of where it fights.',
  how: ['Each day this week, note when your best work happened.', 'Write the time, the place and what came right before it.', 'At the end of the week, look for a pattern.'],
  stuck: 'If no moment felt like your best, write the least-bad one. Patterns still show up.',
  story: 'Ray assumed he was a morning person because that’s what productive people are supposed to be. His week of notes said otherwise: three of his best moments were after 8 p.m., on the couch, after a walk. He moved his writing to evenings and stopped fighting his mornings.'
};
H['hab-8'] = {
  why: 'When a step goes stale, the goal is usually fine. The shape is tired. Changing where, when or how brings fresh energy without giving anything up.',
  how: ['Name what feels stale: the place, the time, the format or doing it alone.', 'Change one of those today.', 'Notice whether the energy comes back.'],
  stuck: 'If you can’t think of a change, try a new place. It’s the easiest one to switch.',
  story: 'Ana’s morning runs had gone flat after six months. Same route, same time, same playlist. She asked a coworker to run with her on Saturdays instead. Same goal, different shape. She started looking forward to it again.'
};

// ---- Field
H['fld-1'] = {
  why: 'What you let in shapes how you feel and what you do. Seeing it all on one page shows you what’s feeding you and what’s quietly draining you.',
  how: ['List what you let in this week: people, places, habits, food, feeds, commitments.', 'Mark each one: gives, drains or neither.', 'Circle one “gives” to keep and one “drains” to look at next.'],
  stuck: 'If marking people feels harsh, remember it’s about this week, not who they are. It can change.',
  story: 'Ellie listed her week: morning walk, gives. Late-night news, drains. Book club, gives. The group chat with old coworkers, drains. Saturday farmers market, gives. She was surprised how much of her low mood traced back to two things she did on autopilot.'
};
H['fld-2'] = {
  why: 'Drains rarely stop on their own. A clear, kind boundary protects your energy without making anyone the bad guy.',
  how: ['Pick one drain that keeps costing you.', 'Write the boundary in one sentence: what you will or won’t do, and when.', 'Say it once, calmly, without a long explanation.'],
  stuck: 'If saying it feels too hard, start by living it quietly, and say it out loud when it comes up.',
  story: 'Mateo’s boss called at all hours. He wrote one sentence: “I’m not taking work calls after 7 anymore, but I’ll reply first thing.” He said it once, on a Monday. His boss said, “Sure, fair.” Mateo had spent months dreading a conversation that took fifteen seconds.'
};
H['fld-3'] = {
  why: 'Feeds are part of your field, and they speak to you every day. Clearing the ones that leave you feeling worse makes room for what helps.',
  how: ['Scroll your feeds and notice how each account makes you feel.', 'Mute, unfollow or delete the ones that leave you worse.', 'Move one draining app off your home screen.'],
  stuck: 'If unfollowing feels dramatic, mute instead. Nobody gets notified.',
  story: 'Tessa noticed she felt behind after every scroll. She muted seven accounts, mostly people with perfect-looking lives. She moved the shopping app to a folder on her third screen. A week later she realized she’d stopped comparing her kitchen to strangers’ kitchens.'
};
H['fld-4'] = {
  why: 'Physical clutter pulls on your attention even when you don’t notice it. Clearing one space that’s in the way of your goal removes a quiet barrier.',
  how: ['Pick one small space connected to your goal: a desk, a shelf, a drawer.', 'Clear it: toss, donate or move what doesn’t belong.', 'Set it up for the step you want to take there.'],
  stuck: 'If the whole room feels overwhelming, do one drawer. One cleared space is enough.',
  story: 'Ade wanted to paint again, but the spare desk was buried in mail and cables. He cleared it in fifteen minutes and put out his brushes and one blank canvas. The next evening he sat down without thinking about it. The mess had been the barrier, not the motivation.'
};
H['fld-5'] = {
  why: 'Empty space fills back up with the old stuff if you don’t claim it. Putting something good in the gap locks in the change.',
  how: ['Look at the time or space you freed up.', 'Decide what goes there: something that feeds your goal.', 'Do it the next time the gap opens.'],
  stuck: 'If nothing comes to mind, pick something restful. Rest is a good use of freed-up time.',
  story: 'After Rachel stopped taking work calls after 7, she had her evenings back, and at first she just scrolled. So she filled the gap: a twenty-minute walk with her partner after dinner. It became the best part of their day.'
};
H['fld-6'] = {
  why: 'Big decisions about people are hard to undo. A little distance first shows you how you actually feel without them around, before you decide anything bigger.',
  how: ['Pick one person who leaves you drained.', 'Make a little less room for them this month: fewer plans, slower replies.', 'Notice how you feel. Decide later, with that information.'],
  stuck: 'If you feel guilty, remember distance isn’t a door slammed. It’s a pause to see clearly.',
  story: 'Jen had a friend who always left her feeling small. She didn’t cut her off. She just made fewer plans for a month. She noticed she felt lighter, and that the friendship mostly ran on Jen’s effort. She kept the distance, without any big conversation needed.'
};

// ---- Let loose
H['lse-5'] = {
  why: 'Hard moments get heavier when you take them too seriously. Feeling it first, then finding what’s funny, lets the moment move through instead of sticking.',
  how: ['When something goes wrong, let yourself feel it first. Don’t skip that.', 'Before you react, ask: what’s absurd or funny about this?', 'Let yourself smile, even a little. Then handle it.'],
  stuck: 'If nothing feels funny, picture telling the story to a friend next week. It often sounds funnier there.',
  story: 'Eddie spilled coffee down his shirt five minutes before the big presentation. Of course. He felt the jolt, then laughed. He borrowed a sweater from his coworker’s desk and walked in wearing reindeer in July. It broke the ice. He was looser than in any presentation he’d given.'
};
H['lse-6'] = {
  why: 'Anger and pressure build in your body before they come out of your mouth. Catching the build-up early gives you a choice before it chooses for you.',
  how: ['Notice where pressure shows up in your body: jaw, shoulders, chest, hands.', 'When you feel it, name it: “pressure” or “anger.”', 'Take three slow breaths, and let one thing loosen before you act.'],
  stuck: 'If you only notice after you react, that’s still progress. Notice it a little earlier next time.',
  story: 'Pedro noticed his jaw got tight in traffic every day. One evening he caught it: jaw tight, name it, pressure. Three breaths, shoulders down, a song he loves. Same traffic, same delay. He got home without bringing it in the door with him.'
};
H['lse-1'] = {
  why: 'In the moment, everything feels big. Asking whether it’ll matter in a year shrinks most things back to their real size.',
  how: ['When something feels heavy, pause.', 'Ask: will this matter in a year?', 'If not, let it be small. Handle it and move on.'],
  stuck: 'If the answer is yes, it matters, then take it seriously. The question just sorts the big from the small.',
  story: 'Kayla sent a client email with their name spelled wrong and felt sick about it. Will it matter in a year? No. She sent a one-line correction with a laughing emoji. The client replied “happens to everyone.” She saved the rest of her afternoon from spinning over it.'
};
H['lse-2'] = {
  why: 'Play isn’t a break from growing; it’s fuel for it. It drops stress, brings back ideas, and reminds you that life is for enjoying.',
  how: ['Pick something you do only because it’s fun.', 'Set ten minutes aside, with no goal and no score.', 'Let yourself be a little silly.'],
  stuck: 'If nothing comes to mind, think of what you loved doing at ten years old, and try a grown-up version of it.',
  story: 'Tom used to love building things as a kid. He bought a cheap Lego set and gave it ten minutes after dinner. No goal, just building. His teenage daughter wandered over and joined him. They didn’t talk about anything serious. It was the most relaxed he’d felt all week.'
};
H['lse-3'] = {
  why: 'A lot of what’s on your list is there because of pressure, not purpose. Cutting one thing makes the whole day lighter.',
  how: ['Look at today’s list.', 'Find one thing that’s there only because you feel pressure to do it.', 'Cut it, shrink it or move it.'],
  stuck: 'If nothing feels cuttable, shrink something. Half of it is still lighter.',
  story: 'Sarah had three workouts, two errands, a work deadline and a bake sale on her list. The third workout was there because she felt she “should.” She dropped it. Two workouts were plenty that week. The relief was immediate.'
};
H['lse-4'] = {
  why: 'If every step feels like work, you’ll stop. Enjoying one moment inside the step reminds you that growing can feel good.',
  how: ['Pick one moment in today’s step.', 'Slow down in that moment.', 'Notice one good thing about it: a taste, a sound, a feeling.'],
  stuck: 'If the step has no good moment, add one: music, a good drink, sunshine.',
  story: 'Danny wrote his book every morning and had started dreading it. He chose to enjoy one moment: the first sip of coffee, in the quiet, before typing. Thirty seconds. He started looking forward to sitting down, and the writing followed the coffee.'
};

// ---- Tools
H['tool-1'] = {
  why: 'You can’t see your patterns from inside a single day. Five evenings of short notes show how you really move through highs, lows and recovery.',
  how: ['Each evening for five days, write your low point and high point.', 'Write how long it took you to recover from the low.', 'Write whether you let yourself feel it, and whether you did your step.'],
  stuck: 'If five days feels long, do three. Even three evenings show a pattern.',
  story: 'Monica did the Tuesday test for five nights. Her lows were mostly about work emails. Her recovery time ranged from ten minutes to all evening. The fast ones were the nights she let herself be annoyed for a minute instead of pretending she was fine. That was the pattern she needed.'
};
H['tool-2'] = {
  why: 'It’s easy to believe change comes from wanting hard enough. Looking at what really changed in your life shows what actually worked.',
  how: ['List three real changes in your life from recent years.', 'For each, mark where it came from: mostly the wanting, or mostly small steps repeated.', 'Look at what that tells you about how you change.'],
  stuck: 'If it’s both, mark both. That’s useful too.',
  story: 'Aaron listed: paid off his car, mostly steps. Got closer with his dad, both. Lost 20 pounds, steps. He’d always felt like the guy who didn’t want things badly enough. His own list said he was the guy who changes through small, boring steps. He stopped waiting to feel motivated.'
};
H['tool-3'] = {
  why: 'A Try only teaches you something if you look at it. Answering the same questions, in order, turns any outcome into useful information.',
  how: ['How do I feel about it?', 'What actually happened?', 'What did I learn about what I like and what I’m good at? What would I do differently?', 'What good came out of it, even if it went sideways?'],
  stuck: 'If it went badly and you don’t want to look, answer just the first and last questions.',
  story: 'Simone taught three yoga classes as a Try. Her debrief: felt flat afterward. Three classes, small crowds. She liked teaching, not the admin. Next time she’d co-teach. Good part: she found out she’s calm in front of a room. She’d never have learned that without trying.'
};
H['tool-4'] = {
  why: 'Your gut often knows before your head does. Skipping or changing a step on purpose, and writing why, honors that knowing without losing the thread.',
  how: ['Notice when a step feels wrong in your gut.', 'Skip it or change it on purpose. Don’t just drift.', 'Write one line: what you changed and what your gut said.'],
  stuck: 'If you can’t tell gut from fear, write it down anyway. The check-back will tell you.',
  story: 'Ryan’s plan said to pitch a cold client. His gut said no, not this one. He skipped it and wrote: “Skipped the pitch. Gut said wrong client, not wrong timing.” He pitched a different client that week. He found that writing down the reason made it feel like a choice, not avoidance.'
};
H['tool-5'] = {
  why: 'Gut calls get sharper when you check how they played out. Looking back helps you learn the difference between intuition and fear in disguise.',
  how: ['Two weeks after a gut call, look at what you wrote.', 'Ask: how did it play out?', 'Ask: was it intuition, or fear dressed up as intuition?'],
  stuck: 'If you can’t tell, that’s okay. Keep checking back on calls, and your read will sharpen.',
  story: 'Kara looked back at two gut calls. Skipping the networking event: right call, it was a bad fit. Skipping the gym three times: fear, she’d been nervous about a new class. Both felt like gut in the moment. Now she knows what her fear feels like when it sounds wise.'
};
H['tool-6'] = {
  why: 'Loose words make loose results. When your goal is exact and true, your mind knows what to do and when it’s done.',
  how: ['Write your goal or today’s check-in.', 'Circle any loose words: try, more, better, soon, someday.', 'Rewrite them as exact and true: what, how much, by when.'],
  stuck: 'If exact feels scary, start with one word. Swap “soon” for a real date.',
  story: 'Jamal’s goal was “I’ll try to save more.” He rewrote it: “I move $50 to savings every Friday.” The new version felt smaller and much more real. He set up the transfer that afternoon. Six Fridays later he had $300, which “trying to save more” had never produced.'
};
H['tool-7'] = {
  why: 'New levels get tested. Logging each test, and whether you met it the old way or the new way, shows you how much you’ve actually changed.',
  how: ['When something tests your new level, notice it.', 'Write one line: what happened.', 'Write whether you met it with your old reaction or a new response.'],
  stuck: 'If you reacted the old way, write it down anyway. That’s information, not a verdict.',
  story: 'After leaving a draining job, Lily’s old boss called with a bigger offer. Old Lily would have said yes to avoid disappointing him. She wrote: “Old boss offered more money. New response: I said no, kindly.” Seeing it in writing made it real that she’d changed.'
};
H['tool-9'] = {
  why: 'Flow and resistance leave clues every day. A short nightly log turns those clues into a pattern you can actually follow.',
  how: ['Each evening, write one thing that came easily today.', 'Write one thing that fought you.', 'After two weeks, read it back and look for the pattern.'],
  stuck: 'If you miss a night, just write the next one. The pattern doesn’t need every day.',
  story: 'Victor kept a flow log for two weeks. Easy: client calls, every time. Fought him: the spreadsheet, every time. He’d been forcing himself to do the books and dreading calls. The log showed it was the other way around. He hired a bookkeeper for four hours a month.'
};
H['tool-10'] = {
  why: 'Some things open doors and give you energy. Others hit wall after wall. Looking at a few weeks honestly tells you which is which.',
  how: ['Pick one goal, path or person.', 'Look back over the last two to four weeks.', 'Ask: have doors mostly opened or mostly closed? Has it given me energy or taken it?'],
  stuck: 'If it’s mixed, that’s normal. Look at the overall direction, not every single day.',
  story: 'Nora looked at her two side projects. The podcast: guests kept saying yes, and she looked forward to recording. Flow. The online store: supplier problems, slow sales, dread every week. Resistance. She didn’t quit the store, but she put her extra hours into the podcast.'
};
H['tool-11'] = {
  why: 'Sometimes the clearest sign is the thing that keeps showing up without you pushing. Taking one step toward it is how you find out if it’s meant for you.',
  how: ['Notice what keeps opening up for you, again and again.', 'Write it down in one line.', 'Take one small step toward it.'],
  stuck: 'If you’re not sure what keeps showing up, ask a friend. They often see it first.',
  story: 'People kept asking Hector to teach what he did with woodworking. He’d always said “I’m not a teacher.” He booked one free workshop for four people at his garage. It was awkward and fun, and two of them asked when the next one was.'
};
H['tool-8'] = {
  why: 'Getting what you wanted changes things, some for the better and some at a cost. Reviewing it honestly helps you keep what matters.',
  how: ['When you reach your goal, set aside fifteen minutes.', 'Write what changed, what it drains and what it amplifies.', 'Write how it lands on the people around you, and what it costs to keep.'],
  stuck: 'If it feels ungrateful to look at the costs, remember: seeing the cost is how you protect the win.',
  story: 'Rebecca got the promotion she’d worked toward for two years. Her review: more money, less sleep. Her partner was proud, her kids missed her on Saturdays. Keeping it meant one Saturday off a month, protected. She asked for it, and got it.'
};

// ---- People
H['ppl-1'] = {
  why: 'Connection fades quietly when nobody reaches out. One small message, with no agenda, can reopen a door that’s been closed a long time.',
  how: ['Think of someone you haven’t talked to in a while.', 'Send one message: something that reminded you of them, or just “how are you, really?”', 'Don’t wait for a reason. No agenda needed.'],
  stuck: 'If it feels awkward after a long time, say so: “It’s been forever. I was thinking about you.”',
  story: 'Ahmed saw a song come on that he and his college roommate used to blast. He texted it with one line: “This came on. How are you, really?” They talked for an hour that weekend. It had been four years.'
};
H['ppl-2'] = {
  why: 'Being alone too long makes people feel far away, even when they’re not. Being around others, without pressure to talk, reminds you you’re part of the world.',
  how: ['Pick a place where other people are: a café, a park, a library.', 'Go there and do something you’d do at home anyway.', 'No need to talk to anyone. Just be there.'],
  stuck: 'If going out feels like too much, take a short walk somewhere busy.',
  story: 'Ines worked from home and could go days without seeing anyone. She started working from a café two mornings a week. She didn’t talk to anyone the first few times. By the third week, the barista knew her order, and it felt like a small part of the day belonged to her.'
};
H['ppl-3'] = {
  why: 'Time alone can recharge you or slowly drain you, and they can look the same. Asking honestly helps you keep the good kind.',
  how: ['When you’re alone, ask: did I choose this?', 'Ask: am I recharging, or drifting?', 'If it’s isolation, take one small step toward people.'],
  stuck: 'If you’re not sure, check how you feel after. Solitude refills. Isolation empties.',
  story: 'Luke spent most weekends alone and called it recharging. He asked the question. One Sunday with a book: solitude, he felt great. But he’d also skipped plans three weekends in a row and felt worse each time. That was isolation. He said yes to the next invite.'
};
H['ppl-4'] = {
  why: 'Too much input, from people, screens and noise, leaves no room to think or feel. Ten quiet minutes lets your nervous system reset.',
  how: ['Find ten minutes where you can be alone.', 'No phone, no talk, no music.', 'Sit, breathe and let your mind settle.'],
  stuck: 'If quiet feels uncomfortable, start with two minutes with your eyes closed.',
  story: 'Monique got home every day and went straight from work stress to kid chaos. She started sitting in the car for ten minutes before going inside, phone in the glovebox. Just breathing. She walked in calmer, and the evenings went better.'
};
H['ppl-5'] = {
  why: 'Overload builds when too much comes in at once. Turning off one input gives your mind breathing room.',
  how: ['Notice what’s been overloading you: a chat, alerts, news, noise.', 'Turn it off, mute it or move it for now.', 'Notice how the next few hours feel.'],
  stuck: 'If you can’t turn anything off, silence your phone for one hour.',
  story: 'Felix had five group chats buzzing all day. He muted the two busiest until Friday. That afternoon he finished a task he’d been stuck on for days. He didn’t miss anything important, and he kept one chat muted for good.'
};
H['ppl-6'] = {
  why: 'If you’re someone who recharges alone, that time disappears unless you claim it. Putting it on your calendar protects it.',
  how: ['Look at your week and find a stretch of time.', 'Block it as yours: alone, recharging.', 'Keep it like you’d keep a meeting.'],
  stuck: 'If a block feels selfish, remember: you show up better for people after you’ve recharged.',
  story: 'Wren blocked Saturday 9 to 11 a.m. as hers and told her partner. She walked, read, sat in the sun. Her partner took the kids to the park. By 11 she was ready for a full family day, instead of being half there all weekend.'
};
H['ppl-7'] = {
  why: 'New opportunities come through new people. Finding one room where people care about what you care about opens doors you can’t see from home.',
  how: ['Think about what your goal is about.', 'Find one place, event or group where people care about the same thing.', 'Sign up or plan to go.'],
  stuck: 'If in-person feels like too much, try an online group first.',
  story: 'Trevor wanted to get back into running but didn’t know anyone who ran. He found a Thursday run club through a local shop. He went, nervous. People were friendly, and someone mentioned a trail race he’d never heard of. He signed up for that too.'
};
H['ppl-8'] = {
  why: 'Giving first builds goodwill and connection. It also makes you the kind of person people want to help back.',
  how: ['Think of someone who could use help: a lead, an introduction, a skill.', 'Offer it with no ask attached.', 'Let it go once it’s given.'],
  stuck: 'If you don’t know what to give, share one useful link with someone it fits.',
  story: 'Priya knew two friends who both wanted to start podcasts. She introduced them in one email. They started recording together. A few months later one of them sent Priya a client referral out of nowhere. She hadn’t asked for anything.'
};
H['ppl-9'] = {
  why: 'The people you need are often one person away. A clear ask for an introduction opens doors you’d never find alone.',
  how: ['Think of someone you trust who knows a lot of people.', 'Ask: “Who do you know who…?”, tied to your goal.', 'Keep it specific and easy to say yes to.'],
  stuck: 'If asking feels pushy, remember most people enjoy connecting others. You’re giving them a chance to help.',
  story: 'Dina wanted to open a yoga studio. She asked her old boss: “Who do you know who’s opened a studio? I’d love to buy them a coffee.” Her boss knew someone. That coffee turned into two hours of advice Dina couldn’t have found online.'
};
H['ppl-10'] = {
  why: 'Most new connections fade because nobody follows up. One message keeps the door open, and that’s where real relationships start.',
  how: ['Think of someone you met recently.', 'Send a short follow-up: “Great talking. Want to grab lunch this month?”', 'Make it easy to say yes to.'],
  stuck: 'If it feels too forward, a simple “great meeting you” is enough.',
  story: 'Marcus met a guy at a conference who did the kind of work he wanted to do. He almost let it go. Instead he texted: “Great talking last week. Want to grab lunch?” They did. Two months later that guy brought him into a project.'
};

// ---- Agency
H['agc-1'] = {
  why: 'Most yeses that cost us are said on the spot, to avoid the awkward pause. Buying time lets you answer from what you actually have, not from pressure.',
  how: ['Decide your time-buying line ahead of time.', 'The next time someone asks for something, say it: “Let me check and get back to you.”', 'Then check your week and your cup, and answer honestly.'],
  stuck: 'If the words won’t come in the moment, just don’t say yes yet. A pause is enough.',
  story: 'Chris said yes to everything at his kids’ school, then resented it. He practiced one line: “Let me check my week and get back to you tonight.” The next ask was running the fall fundraiser. He checked, he was stretched thin, and that night he offered to help with setup instead.'
};
H['agc-2'] = {
  why: 'You can’t pour from an empty cup. Checking your cup before saying yes shows you what you actually have to give.',
  how: ['Before saying yes to anything today, stop for a second.', 'Rate your cup: full, half or empty.', 'Let the answer shape what you say.'],
  stuck: 'If you always rate it full, ask how you felt last time you said yes. Your body knows.',
  story: 'A friend asked Jada to help her move on Saturday. Jada checked her cup: empty, after a fifty-hour week. Old Jada would have gone anyway. She said, “I can’t this weekend, but I’ll send pizza for the crew.” Her friend was thrilled with the pizza.'
};
H['agc-3'] = {
  why: 'Yes and no aren’t the only options. A smaller yes lets you help in a way that fits what you actually have.',
  how: ['When someone asks for something, ask yourself: what can I really give?', 'Offer that version: “I can’t do all of it, but I can ___.”', 'Let them take it or leave it.'],
  stuck: 'If it feels like letting them down, remember a real smaller yes beats a full yes you resent.',
  story: 'Sam’s neighbor asked him to help paint their whole fence on Saturday. Sam said, “I can’t do all Saturday, but I can help for an hour in the morning.” The neighbor said great. Sam helped for an hour, then took his kids to the lake as planned.'
};
H['agc-4'] = {
  why: 'A yes said too fast keeps costing you every week. Going back and changing it is respectful to them and to you.',
  how: ['Think of one commitment you said yes to too quickly.', 'Decide what you can really give.', 'Go back and say it: “I said I’d ___. I can’t do that, but I can ___.”'],
  stuck: 'If it feels too late, it rarely is. People usually appreciate honesty over a half-hearted yes.',
  story: 'Laura had agreed to lead the PTA fundraiser and was drowning. She told the committee: “I can’t lead it, but I can run sign-ups.” Someone else stepped up to lead within a day. She’d been carrying it for three weeks.'
};
H['agc-5'] = {
  why: 'Some people and places make you smaller without you noticing. Naming where you shrink is the first step to standing back up.',
  how: ['Think about where you stop doing or saying what you normally would.', 'Write the people or places.', 'Next to each, write what you hold back there.'],
  stuck: 'If nothing comes up, think of where you feel tired after, with no clear reason.',
  story: 'Kevin wrote: at his in-laws’, he never says what he thinks. At work, he agrees to every deadline. With his older brother, he’s still sixteen. Seeing it on paper didn’t fix anything yet, but he finally understood why some visits wiped him out.'
};
H['agc-6'] = {
  why: 'Agency grows in small moments. Doing one small thing you’d normally hold back, around someone you shrink for, shows you that you can.',
  how: ['Pick one person or place where you usually shrink.', 'Choose one small thing you’d normally do or say.', 'Do it, once, today.'],
  stuck: 'If doing it feels too big, notice the moment you would have, and do it next time.',
  story: 'At dinner with her in-laws, Marisol always ordered what everyone else ordered. This time she ordered the fish she actually wanted. Nobody noticed. It was tiny, and she felt more like herself for the rest of the night.'
};
H['agc-7'] = {
  why: 'Over-explaining a no makes it sound up for negotiation. A short, kind no is clear and respectful, to them and to you.',
  how: ['Write your no in one or two sentences.', 'Cut any apologies and long reasons.', 'Say or send it as is.'],
  stuck: 'If you can’t send it today, write it and send it when you’re ready. The words will be waiting.',
  story: 'Ari used to write three paragraphs to turn down an invite. This time: “I can’t make it this time. Have a great night.” He stared at it, thought it sounded rude, and sent it anyway. His friend replied, “No worries!” That was it.'
};
H['agc-8'] = {
  why: 'Healthy relationships flow both ways. Looking honestly at what you give and get back shows you where things are uneven.',
  how: ['Pick one relationship.', 'Write what you give: time, favors, listening, money.', 'Write what you get back. Does it flow both ways?'],
  stuck: 'If it feels unkind to count, remember this is for you, not a scorecard to show anyone.',
  story: 'Tasha wrote it out for her friend Kayla. Gave: rides, listening, birthday plans. Got back: rarely a call back. She didn’t end the friendship. She stopped being the one who always reached out first, and set a boundary on late-night venting calls.'
};

// ---- Worth
H['wrt-1'] = {
  why: 'Saying no is a skill, and skills grow in steps. Starting with the easiest no builds the muscle for the harder ones.',
  how: ['Write five nos you’ve been avoiding.', 'Rank them from easiest to hardest.', 'Say the easiest one this week.'],
  stuck: 'If even the easiest feels hard, make an easier one: no to the extra bag, no to the upsell.',
  story: 'Rob’s no ladder: 1. The upsell at the car wash. 2. The extra shift. 3. His cousin’s loan request. 4. Hosting Thanksgiving again. 5. His dad’s business idea. He said no to the upsell on Tuesday. It felt silly. On Friday he said no to the extra shift, and it felt a little less hard.'
};
H['wrt-2'] = {
  why: 'Pushback is where most nos fall apart. Repeating the same calm words, without new reasons, shows that your no is a decision, not an opening bid.',
  how: ['Decide your words now: “I can’t this time.”', 'When they push back, repeat the same words calmly.', 'Don’t add new reasons. Repeat as needed.'],
  stuck: 'If you start explaining, stop and go back to your words. Explaining invites debate.',
  story: 'Natalie’s sister pushed hard for her to host the holidays again. “I can’t this year.” “But you always do it!” “I can’t this year.” “Mom will be upset.” “I can’t this year.” Her sister sighed and said she’d ask their brother. It took three repeats.'
};
H['wrt-3'] = {
  why: 'Holding back what you think, over and over, slowly teaches you that your thoughts don’t matter. One true sentence starts to reverse that.',
  how: ['In one conversation today, notice when you want to go along.', 'Say one thing you actually think, simply.', 'Let it land. No need to defend it.'],
  stuck: 'If saying it out loud feels too much, say it in a text instead.',
  story: 'When her team was picking a meeting day, Gina usually just said “whatever works.” This time: “Honestly, I’d rather do Thursday.” They picked Thursday. Small, but she noticed she felt more present in the meeting itself.'
};
H['wrt-4'] = {
  why: 'Words like “just,” “sorry” and “only” make you smaller before anyone else does. Dropping them lets what you say carry its full weight.',
  how: ['Before you send one message today, reread it.', 'Delete the shrink words: just, sorry, only, “I’m no expert, but.”', 'Send it without them.'],
  stuck: 'If it sounds too blunt without them, add “thanks” at the end. That’s warm without shrinking.',
  story: 'Olivia reread her email: “Sorry to bother you, I just wanted to quickly check if maybe…” She cut it to: “I wanted to check on the timeline.” Her boss replied faster than usual. She noticed how many “sorrys” she’d been sending every day.'
};
H['wrt-5'] = {
  why: 'Before something hard, your mind forgets everything you’ve already handled. A written proof list reminds you who you are when you need it most.',
  how: ['Write ten things you’ve done, handled or made it through.', 'Include the hard ones, not only the wins.', 'Keep it where you can read it before something hard.'],
  stuck: 'If ten feels like too many, write three. You can add more later.',
  story: 'Before his first job interview in eight years, Patrick read his proof list: moved cities alone, got through the layoff, taught himself to code, raised two kids, kept going after his divorce. He walked in steadier than he expected.'
};
H['wrt-6'] = {
  why: 'Deflecting a compliment tells your mind it wasn’t true. Saying “thank you” and stopping lets the good thing land.',
  how: ['When someone compliments you today, notice the urge to deflect.', 'Say “thank you.”', 'Stop there. No “oh, it was nothing.”'],
  stuck: 'If you deflect anyway, notice it. Noticing is the first step.',
  story: 'After her presentation, Lauren’s manager said, “That was really clear.” She felt the “oh, I was so nervous” rising. She said, “Thank you.” And stopped. It felt strange. Then it felt good, and she replayed the compliment on the drive home instead of the mistakes.'
};
H['wrt-7'] = {
  why: 'If you won’t say your number, nobody else will. Writing it down and saying it out loud makes it real, to you first.',
  how: ['Write what your time or work is really worth.', 'Look at it until it stops feeling strange.', 'Say it out loud once, to yourself or someone else.'],
  stuck: 'If the number feels too high, it might be right. Say it anyway, and notice what happens.',
  story: 'Alex had charged $60 an hour for three years. He wrote $85 and stared at it. Said it out loud in the car. The next new client asked his rate. He said $85. They said, “Sounds good.” He’d been undercharging out of fear, not because of the market.'
};
H['wrt-8'] = {
  why: 'Your inner critic is often harsher than you’d ever be with a friend. Answering it the way you’d answer a friend gives you a kinder, truer voice to listen to.',
  how: ['When the critic speaks, write down exactly what it said.', 'Imagine a friend said it about themselves.', 'Write what you’d tell them.'],
  stuck: 'If you can’t find the kind answer, just write what the critic said. Seeing it on paper already takes away some of its power.',
  story: 'Liam’s critic said: “You always mess this up.” He imagined his best friend saying that about himself. What would he tell him? “You’ve done harder things than this. Try again tomorrow.” He wrote it down and read it twice. It was the first time he’d talked to himself like a friend.'
};
H['wrt-9'] = {
  why: 'Guilt often shows up right after a healthy no. It doesn’t mean you did something wrong. It means you did something new.',
  how: ['After you say no, notice the guilt when it shows up.', 'Feel it for a few minutes. Don’t fight it.', 'Don’t take the no back. Let it stand.'],
  stuck: 'If the guilt is loud, take three slow breaths and remind yourself: the no stands.',
  story: 'Jasmine said no to a weekend trip with friends because she needed rest. She felt awful for an hour and almost texted “never mind, I’ll come.” She didn’t. By evening, the guilt turned into relief. She spent Saturday sleeping in and reading, and came back Monday rested.'
};

// ---- Error thoughts
H['err-1'] = {
  why: 'Harsh thoughts about yourself feel like facts because they’re automatic. Calling them “error thoughts” and writing them down shows you they’re just thoughts.',
  how: ['When a harsh thought about yourself shows up, say “error thought.”', 'Write down the exact words.', 'Don’t argue with it yet. Just catch it.'],
  stuck: 'If you miss it in the moment, write it down later. Catching it at all is the skill.',
  story: 'Diego was stuck on his budget and thought, “I’m so bad at this.” He said “error thought” out loud, which felt silly, and wrote it in a note. By the end of the day he’d caught four. Three were about money. Seeing the pattern was the start.'
};
H['err-2'] = {
  why: 'Catching an error thought is half the work. Flipping it into something true and believable gives your mind a new track to run on.',
  how: ['Look at an error thought you caught.', 'Write its opposite, in words you can actually believe.', 'If the full flip feels fake, use a bridge: “I’m learning this.”'],
  stuck: 'If nothing feels believable, try “I’m working on this.” It’s always true.',
  story: 'Ruth caught “I’m too old to start this.” The full flip, “I’m the perfect age,” felt fake. Her bridge: “Plenty of people start at my age, and I’m learning.” She could believe that. She wrote it on a sticky note on her laptop.'
};
H['err-3'] = {
  why: 'Many error thoughts started as someone else’s words. Finding where you first heard one helps you see it’s not yours to keep.',
  how: ['Pick one error thought that keeps coming back.', 'Ask: where did I first hear this?', 'Write it down. Then decide if it’s yours to keep.'],
  stuck: 'If you can’t remember, ask: whose voice does it sound like? That’s usually enough.',
  story: '“You’re not a math person” had followed Nia for twenty years. When she asked where it came from, she remembered: her fifth-grade teacher, in front of the class. That was one person’s opinion of a ten-year-old. She enrolled in an accounting course that week.'
};
H['err-4'] = {
  why: 'A flipped thought becomes real when you act on it. One small piece of proof makes the new version easier to believe.',
  how: ['Pick a thought you flipped.', 'Ask: what’s one small thing I can do that proves the new version?', 'Do it today.'],
  stuck: 'If you can’t think of proof, two minutes of the thing counts.',
  story: 'Cam flipped “I can’t do money” to “I’m learning money.” Then he read one page about budgeting. One page. It wasn’t much, but it made the new thought true. He read another page the next day.'
};
H['err-5'] = {
  why: 'What you say about yourself out loud trains what you believe. Correcting one error statement mid-sentence rewrites the script in real time.',
  how: ['Listen to what you say about yourself in conversation today.', 'When an error statement comes out, stop mid-sentence.', 'Correct it: “Actually, I’m getting better at…”'],
  stuck: 'If you miss it, notice it afterward. Next time, you’ll catch it sooner.',
  story: 'Talking to a coworker, Kyle started: “I’m terrible at public spea—actually, I’m getting better at it.” His coworker nodded. It felt awkward. But he realized how many times a week he’d been telling people he was terrible at things.'
};
H['err-6'] = {
  why: 'Catching error thoughts gets easier with practice. A daily log shows you the patterns and how much stronger you’re getting.',
  how: ['Each evening, write the error thoughts you caught today.', 'Next to each, write the flip you used.', 'Look back at the week on Sunday.'],
  stuck: 'If writing them all feels like a lot, use tally marks. Just count how many you caught.',
  story: 'Mara kept an error log for two weeks. Week one: eleven caught, mostly “I’m behind.” Week two: seven, and she’d flipped most of them. Her favorite flip: “I’m behind” became “I’m on my own timeline.” She noticed the thought showed up less once she had an answer ready.'
};

// ---- Circle
H['cir-1'] = {
  why: 'You become a lot like the people you spend the most time with. Mapping your five shows who’s amplifying you and who’s pulling you down.',
  how: ['List the five people you spent the most time with this month.', 'Mark each one: amplified, drained or neutral.', 'Notice the overall balance.'],
  stuck: 'If marking people feels harsh, remember it’s about how you feel around them, not who they are.',
  story: 'Andrea listed her five: her husband, amplified. Her coworker Dee, drained. Her sister, amplified. Her neighbor, neutral. Her group chat, neutral. Two amplifiers, one drain. She realized she spent more hours with Dee than with her sister, and wanted to change that.'
};
H['cir-2'] = {
  why: 'We pick up habits, moods and words from the people around us without noticing. Seeing what you’ve picked up shows you how much your circle shapes you.',
  how: ['Pick one person from your five.', 'Write one habit, mood or phrase you’ve picked up from them, good or bad.', 'Decide whether you want to keep it.'],
  stuck: 'If nothing comes to mind, ask how you talk or act differently after time with them.',
  story: 'Ty noticed he’d started running because his friend Sam runs. Good. He also noticed he’d started complaining about work as much as his coworker Dee. Not good. Seeing both helped him decide who to spend more time with.'
};
H['cir-3'] = {
  why: 'Time with people who amplify you doesn’t happen by accident. Making a plan to see one of them this week puts more of that energy in your life.',
  how: ['Name one person who leaves you feeling amplified.', 'Reach out and make a plan this week.', 'Put it on your calendar.'],
  stuck: 'If a plan feels like too much, send them one message.',
  story: 'Jordan always left breakfast with her friend Sasha fired up about her business. They hadn’t met in two months. She texted, “Breakfast Saturday?” They went. Jordan came home with three new ideas and the energy to try one.'
};
H['cir-4'] = {
  why: 'Being around people a step ahead shows you what’s possible and how they got there. It amplifies you just by being in the room.',
  how: ['Find one place where people are a step further along in what you want.', 'Plan to go.', 'Go, and listen more than you talk.'],
  stuck: 'If in-person feels too big, start with an online group or a podcast in that world.',
  story: 'Marco wanted to grow his small business. He joined a local founders’ meetup, mostly people further along. He didn’t say much the first time. He listened to someone explain how they hired their first employee, and took notes. It was the most useful hour of his month.'
};
H['cir-5'] = {
  why: 'The circle you want is built by being that kind of friend first. Doing for someone what you wish someone would do for you sets the tone.',
  how: ['Think of what you wish a friend would do for you.', 'Pick one friend.', 'Do that for them: encourage, invite or check in.'],
  stuck: 'If you don’t know what they need, send one line of encouragement. It’s always welcome.',
  story: 'Ella wished someone would cheer her on before big moments. Her friend had a job interview on Tuesday. Ella sent a voice note that morning: “You’ve got this. Go show them.” Her friend called her after, beaming. A week later, before Ella’s big presentation, she got a voice note back.'
};
H['cir-6'] = {
  why: 'Chosen family stays strong through small, regular contact. Reaching out with no agenda reminds both of you that the connection matters.',
  how: ['Pick one person in your chosen family.', 'Reach out this week: a call, a text, a voice note.', 'No agenda. Just connect.'],
  stuck: 'If a call feels like a lot, send a one-line hello.',
  story: 'Ben called his old roommate on the drive home. No reason. They talked for twenty minutes about nothing much. Ben hung up feeling more like himself than he had all week.'
};
H['cir-7'] = {
  why: 'Your time decides your circle. Moving one hour from draining time to amplifying time shifts the balance in a way you can feel.',
  how: ['Look at your week.', 'Find one hour spent with people who drain you.', 'Move it to time with someone who amplifies you.'],
  stuck: 'If an hour feels like too much to move, start with twenty minutes.',
  story: 'Every Thursday, Theresa got drinks with coworkers who mostly complained about work. She skipped it once and took a walk with her brother instead. She came home lighter. She still goes to Thursday drinks sometimes, just not every week.'
};

// ---- Four ways to stay clear
H['agr-1'] = {
  why: 'Every kept promise builds trust, with others and with yourself. Saying so early when you can’t keep one keeps that trust intact.',
  how: ['Make one promise today, to yourself or someone else.', 'Keep it.', 'If you can’t, say so early, before it’s due.'],
  stuck: 'If you keep breaking promises, make them smaller. Small and kept beats big and broken.',
  story: 'Mike told his son he’d be at the game by 5. At 4:15 a meeting was running long. He said, “I need to leave at 4:30, I made a promise.” He left at 4:30 and made it by 4:55. His son spotted him in the stands and waved.'
};
H['agr-2'] = {
  why: 'When someone’s words or mood sting, it’s easy to make it about your worth. Usually it’s about what’s going on for them.',
  how: ['When something stings, write what they did.', 'Write what might be going on for them.', 'Ask: is this really about me?'],
  stuck: 'If you can’t think of what’s going on for them, just ask the last question. It loosens the grip.',
  story: 'Kendra’s boss snapped at her in a meeting. Her first thought: “She thinks I’m bad at my job.” Then she wrote what might be going on: her boss had been covering two jobs since March. It still stung, but it stopped feeling like a verdict on Kendra.'
};
H['agr-3'] = {
  why: 'Guessing what people think or mean fills your head with stories that are often wrong. One clear question replaces the story with the truth.',
  how: ['Notice one guess you’re making about someone today.', 'Turn it into a clear question.', 'Ask it, simply.'],
  stuck: 'If asking feels awkward, ask by text. It’s easier, and the answer is just as clear.',
  story: 'Lucy’s friend hadn’t replied in two days. Lucy assumed she was mad about the canceled dinner. She asked: “Hey, are we good?” Her friend replied an hour later: “Omg yes, my phone broke!” Lucy had spent two days worrying over a broken phone.'
};
H['agr-4'] = {
  why: 'Your best changes with the day. Deciding what your best looks like each morning lets you give it fully without measuring yourself against a perfect day.',
  how: ['At the start of the day, check in with yourself.', 'Decide: is today a good-day, okay-day or hard-day best?', 'Say it: “Today, my best is ___.” Then give that.'],
  stuck: 'If you feel guilty about a half-day best, remember: a real half beats a pretend full.',
  story: 'Raul woke up after four hours of sleep. “Today my best is the half version.” He did a shorter workout, handled his three biggest tasks and let the rest wait. At the end of the day he felt good about it, instead of beating himself up for not doing everything.'
};
H['agr-5'] = {
  why: 'Words that tear down, aimed at you or someone else, leave a mark. Saying the same thing in a way that builds gets the point across without the damage.',
  how: ['Notice one time today you used words against yourself or someone else.', 'Ask: what did I actually mean?', 'Say it again in a way that builds.'],
  stuck: 'If you miss it in the moment, rephrase it later. It still counts.',
  story: 'Tired and frustrated, Jess snapped at her partner: “You never help.” She caught it. A few minutes later she said, “I’d love help with the dishes tonight.” He got up and helped. The first version would have started a fight. The second got the dishes done.'
};
H['agr-6'] = {
  why: 'The four ways only work if you practice them. A short evening check shows you where you’re clear and where you slipped, without judgment.',
  how: ['Before bed, ask: did I mean what I said today?', 'Did I let someone else’s words or mood decide how I felt about myself?', 'Did I guess instead of asking?', 'Did I give my best for the day I had?'],
  stuck: 'If all four feels like too much, pick one. Rotate through them across the week.',
  story: 'Ana ran through the four before bed. Meant what she said: yes. Let the email get to her: a little. Guessed instead of asking: no. Best for the day: yes, the half version. She went to sleep knowing tomorrow’s focus was the email thing.'
};

// ---- Foundations
H['fnd-1'] = {
  why: 'After a gap, the biggest risk is trying to come back at full speed. Three days of the smallest version rebuilds the habit without overwhelming you.',
  how: ['After time away, pick the small version of your step.', 'Do just that, three days in a row.', 'On day four, decide whether to do more.'],
  stuck: 'If even the rough version feels hard, one minute counts.',
  story: 'Darnell hadn’t worked out in a month after a family emergency. Instead of jumping back into hour-long sessions, he did two-minute walks Monday, Tuesday and Wednesday. Thursday, he felt ready for twenty minutes. He came back without crashing, which never happened before.'
};
H['fnd-2'] = {
  why: 'Understanding what pulled you away helps you plan for it next time. Keeping it to one line keeps it from becoming a guilt spiral.',
  how: ['Write one line on what pulled you away.', 'Read it once.', 'Close it and move on.'],
  stuck: 'If one line turns into a page, stop. One word is enough.',
  story: 'Annie wrote: “The new job ate my evenings.” That was it. She didn’t write about how she should have tried harder. She closed the notebook and moved her step to mornings, which the new job didn’t touch.'
};
H['fnd-3'] = {
  why: 'Falling off is usually easy because there’s an easy exit. Removing one makes staying on easier than falling off.',
  how: ['Think about how you usually fall off.', 'Name the easy exit: no clothes ready, no plan, the couch is too close.', 'Change one thing to close it.'],
  stuck: 'If you can’t see the exit, look at the moment right before you usually stop.',
  story: 'Every morning Ken meant to work out and every morning he didn’t. His easy exit: getting dressed for the gym took decisions. He started laying out his clothes the night before. Next morning, clothes on the chair. He put them on and went.'
};
H['fnd-4'] = {
  why: 'Sleep is the foundation everything else stands on. A wind-down time, without screens at the end, helps your body know it’s time to rest.',
  how: ['Pick a time to start winding down tonight.', 'At that time, put your phone out of reach: another room if you can.', 'Do something calm: a book, a shower, quiet music.'],
  stuck: 'If a full wind-down feels like too much, put your phone out of reach for just the last ten minutes.',
  story: 'Sophie fell asleep with her phone in her hand most nights. She set 10 p.m. as wind-down: phone on the kitchen charger, book in bed. The first few nights she felt antsy. By the second week she was falling asleep faster and waking up less groggy.'
};
H['fnd-5'] = {
  why: 'Movement changes your mood, energy and thinking. A ten-minute walk is easy to start and fits almost any day.',
  how: ['Pick a moment today for ten minutes.', 'Walk, at any pace, anywhere.', 'No goal beyond moving.'],
  stuck: 'If ten minutes won’t fit, two minutes outside still counts.',
  story: 'Max felt sluggish every afternoon. He started walking around the block after lunch. Ten minutes, no podcast. He noticed he came back clearer, and his 3 p.m. crash got softer.'
};
H['fnd-6'] = {
  why: 'You wake up a little dehydrated, and coffee first makes it worse. A glass of water before coffee is one of the easiest good habits there is.',
  how: ['Put a glass by your coffee maker tonight.', 'Tomorrow, drink it before your coffee.', 'That’s it.'],
  stuck: 'If a full glass is too much, a few sips count.',
  story: 'Joy put a glass next to her coffee maker. Every morning: water, then coffee. It took two weeks before she stopped forgetting. She didn’t notice a dramatic change. She just felt a bit steadier in the mornings, and she liked keeping a tiny promise first thing.'
};
H['fnd-7'] = {
  why: 'Daylight early in the day helps set your body clock, which helps your energy and sleep later. It takes only a few minutes outside.',
  how: ['Within an hour or two of waking, get outside.', 'Spend a few minutes in daylight, even if it’s cloudy.', 'Bring your coffee if you want.'],
  stuck: 'If going outside isn’t possible, open the blinds and stand by the window.',
  story: 'Paul started drinking his morning coffee on the porch instead of the couch. Ten minutes, rain or shine. He didn’t expect much. After a few weeks he noticed he was getting sleepy at a reasonable hour for the first time in years.'
};
H['fnd-8'] = {
  why: 'During big changes, your capacity drops. Cutting to small versions keeps your habits alive without adding pressure when life is already heavy.',
  how: ['Notice that life is in a big change right now.', 'Cut your plan to small versions only.', 'Drop anything that can wait.'],
  stuck: 'If even that feels like too much, keep just your one anchor.',
  story: 'After moving across the country, Gwen felt overwhelmed by her plan. She cut it to small versions: two minutes of writing, nothing else. For two weeks, that was it. When she settled in, she built back up. Her habits survived the move.'
};
H['fnd-9'] = {
  why: 'When life is upside down, you need one thing that stays the same. One small anchor, done every day, keeps you grounded.',
  how: ['Pick one small thing you can do every day, no matter what.', 'Make it small enough to survive a bad day.', 'Do it, every day, while things are upside down.'],
  stuck: 'If every day feels impossible, one minute of it still counts.',
  story: 'During her divorce, everything in Maria’s life changed. One thing didn’t: a morning walk with her dog. Some days ten minutes, some days two. It was the one thing she could count on, and it reminded her she was still herself.'
};
H['fnd-10'] = {
  why: 'Vague offers of help rarely turn into help. One specific ask is easy to say yes to, and lets people actually show up.',
  how: ['Think of one specific thing that would help.', 'Pick one person who could do it.', 'Ask clearly: what, and when.'],
  stuck: 'If asking feels like a burden, remember people usually want to help. They just don’t know how.',
  story: 'When Ahmed’s wife had surgery, friends kept saying “let us know if you need anything.” He asked one friend: “Could you bring dinner Thursday?” She did, with dessert. Then she set up a meal schedule for the whole week.'
};
H['fnd-11'] = {
  why: 'Some goals are borrowed from parents, partners or what you’re “supposed” to want. Checking whose goal it is keeps you from climbing the wrong ladder.',
  how: ['Write your goal.', 'Ask honestly: is this mine, or someone else’s?', 'If it’s someone else’s, ask what you want instead.'],
  stuck: 'If you can’t tell, ask: would I still want this if nobody would ever know?',
  story: 'Jalen wrote his goal: “Become a lawyer.” Was it his? His dad’s, if he was honest. What did he actually want? To teach. He didn’t change everything overnight, but he started taking one education class on the side, and felt more alive than he had in law school.'
};
H['fnd-12'] = {
  why: 'You know who you are best in the moments you felt most like yourself. Looking at those moments shows you what you really value.',
  how: ['Think of three moments you felt most like yourself.', 'Write each one down.', 'Next to each, write what was true in that moment.'],
  stuck: 'If three feels like a lot, start with one. Even a small moment works.',
  story: 'Ivy remembered building a treehouse with her kids, teaching a friend to bake and hiking alone at sunrise. What was true: making something real, sharing what she knows, freedom. Those three moments told her more about her values than any quiz.'
};
H['fnd-13'] = {
  why: 'Values are the compass for your goals. Naming your top three makes decisions clearer and shows you when you’re off course.',
  how: ['Look at your “most like me” moments.', 'Find the values that show up: freedom, family, craft, connection, whatever is true.', 'Pick your top three.'],
  stuck: 'If you can’t narrow it down, pick the one that would hurt most to give up.',
  story: 'From his moments, Leo found: freedom, family, craft. Seeing them written down, he realized why the corner-office promotion had felt so wrong. It would have cost him freedom and family for a little more craft.'
};
H['fnd-14'] = {
  why: 'A goal can serve one value and cost another. Checking it against your top three helps you go after it in a way that fits your life.',
  how: ['Write your goal.', 'For each of your top three values, ask: does this serve it or cost it?', 'If it costs one, ask how you could change the goal to protect it.'],
  stuck: 'If you’re not sure, start with just one value.',
  story: 'Kristen wanted the promotion. Craft: served. Family: cost, with more evenings. Freedom: neutral. Instead of saying no, she asked for the promotion with a four-day week. Her boss agreed to try it.'
};

// ---- Your signal
H['sig-1'] = {
  why: 'Your body responds to what you picture as if it’s partly real. Practicing the feeling of your future makes it familiar instead of far away.',
  how: ['Sit somewhere quiet and close your eyes.', 'Picture an ordinary moment after your goal is real. Not the big finish: a normal Tuesday.', 'Notice where you feel it in your body, and stay with it for two minutes.'],
  stuck: 'If doubt crashes in, that’s normal. Notice it, write it down afterward, and come back to the picture.',
  story: 'Tara pictured walking into her own studio on a Tuesday morning. Keys in hand, light through the window, shoulders loose. She stayed with it for two minutes. She opened her eyes feeling like the studio was somewhere she was going, not just something she wanted.'
};
H['sig-2'] = {
  why: 'Right after you picture your future, a doubt or fear often shows up. That gap is important. Feeling it instead of covering it is how it starts to close.',
  how: ['Right after picturing your goal, notice what feeling shows up next.', 'Write it down in a few words.', 'Feel it for a moment. Don’t fix it or argue with it.'],
  stuck: 'If you can’t name it, one word is enough: scared, unsure, unworthy, tight.',
  story: 'Right after picturing her studio, Tara felt it: “Who am I to run a studio?” She wrote it down. She didn’t argue with it. She just saw it. Now she knew what she was actually working with, and it wasn’t the business plan.'
};
H['sig-3'] = {
  why: 'You can’t feel your future all day, but you can hold one feeling from it, steady rather than high. That steady feeling shapes how you show up.',
  how: ['Choose one feeling from your future: calm, enough, sure, free.', 'Name it this morning.', 'Check in with it a few times today: lunch, 2:47, before bed.'],
  stuck: 'If you lose the feeling, just name it again. Coming back is the practice.',
  story: 'Today Owen chose to hold “enough.” He checked in at lunch: still there. At 2:47: gone, he was rushing. He named it again and slowed down. By evening he noticed he’d been less frantic all day, even with the same to-do list.'
};
H['sig-4'] = {
  why: 'You become your future self by making their choices now. One choice today, the way they would make it, starts closing the gap.',
  how: ['Picture the version of you who already has your goal.', 'Ask: what would they do in one moment today?', 'Make that choice.'],
  stuck: 'If you can’t think of a choice, name one now and make it tomorrow.',
  story: 'Mila wanted a full client list. Would that version of her discount her rate for a new client? No. She quoted her real rate. The client accepted. It was one choice, and she felt a little more like the person she was becoming.'
};
H['sig-5'] = {
  why: 'What you’re holding inside shows up in how you act. A quick check shows you what you’re putting out, and gives you a chance to change it.',
  how: ['Stop for a moment.', 'Ask: what am I holding right now?', 'Ask: is it what I want to be putting out? If not, take three breaths and come back to steady.'],
  stuck: 'If you can’t tell what you’re holding, notice your body: shoulders, jaw, breath.',
  story: 'Midway through a busy afternoon, Jake asked: what am I holding? Rushed and behind. Was that what he wanted to bring into his next meeting? No. Three slow breaths. He walked in steady, and the meeting went better than the morning had.'
};
H['sig-6'] = {
  why: 'When you’re watching for signs, you notice more of them. Writing down what’s moving, and being thankful for it, keeps your attention on what’s working.',
  how: ['Tonight, think back over the day.', 'Write the signs that something is moving: a door, a person, a coincidence.', 'Say thank you for each one, even quietly.'],
  stuck: 'If nothing comes to mind, look smaller. A kind word or a good idea counts.',
  story: 'Aria wrote down her signs: an old client emailed out of nowhere, she saw a studio for rent on her walk, a friend mentioned a grant. She said thank you for each one. She wasn’t sure what any of it meant yet, but she followed up on the email the next morning.'
};
H['sig-7'] = {
  why: 'Gripping how and when your goal happens makes you tense and closed. Letting the how stay open keeps you looser and more ready for what shows up.',
  how: ['Write your goal.', 'Under it, write: “The how and the when are open.”', 'Read it once, and notice your grip loosen.'],
  stuck: 'If letting go of the how feels scary, remember you’re still taking steps. You’re just not forcing the path.',
  story: 'Sean wrote: “Own a studio by next fall. The how and the when are open.” He’d been fixated on one specific building. Reading it, he felt his chest unclench. A week later a friend mentioned sharing a space, a path he’d never considered.'
};
H['sig-8'] = {
  why: 'Big feelings often peak and pass if you let them move instead of fighting them. Ninety seconds of letting it be can change how the rest of your day goes.',
  how: ['When a big feeling hits, set a timer for ninety seconds.', 'Breathe and let the feeling move through. Don’t fix it.', 'When the timer ends, notice where you are.'],
  stuck: 'If ninety seconds feels too long, three slow breaths with it count.',
  story: 'After a tense call, anger flooded Rae’s chest. She set a ninety-second timer and just breathed, letting it rise and fall. By the end she felt calmer. Not happy, but clear enough to decide what to do next instead of firing off an angry email.'
};
H['sig-9'] = {
  why: 'Jumping from a low feeling straight to a high one rarely works. Climbing one step up, to a feeling you can actually believe, moves you in the right direction.',
  how: ['Name the feeling you’re in right now.', 'Ask: what’s the next feeling up that I can actually believe?', 'Move toward that one. Then maybe the next.'],
  stuck: 'If you can’t find the next feeling, “a little less ___” counts as one step up.',
  story: 'Nate felt hopeless about his job search. He couldn’t believe “excited.” But frustrated? He could believe that. Frustrated turned into “maybe there’s another way.” That afternoon he messaged a friend about a different kind of role.'
};

// ---- Keeping your power
H['pwr-1'] = {
  why: 'We often wait for someone else to unlock our next step. Naming what you’re waiting on shows you whether it’s really true.',
  how: ['Finish this sentence: “I can’t move forward until ___.”', 'Ask honestly: is that really true?', 'If not, write what you could do without it.'],
  stuck: 'If it is true, ask: is there a smaller step that doesn’t need it?',
  story: 'Monica wrote: “I can’t launch my course until a big account takes a chance on me.” Was that true? No. She could launch to ten people. She emailed her ten warmest contacts that week.'
};
H['pwr-2'] = {
  why: 'No single source has all the answers for your life. Sorting advice into keep and leave lets you use what fits without handing over your judgment.',
  how: ['After advice from anyone, sit with it for a minute.', 'Write two lists: what to keep, and what to leave.', 'Act on the keeps. Let the leaves go, guilt-free.'],
  stuck: 'If everything feels like a keep, ask which parts actually fit your life right now.',
  story: 'After a productivity podcast, Joel made two lists. Keep: post every week. Leave: “wake up at 4 a.m.” That’s not him, and he has toddlers. He started posting weekly and slept in until 6.'
};
H['pwr-3'] = {
  why: 'Advice can sound right and still not fit you. Testing it for a week, as a Try, lets your own experience decide.',
  how: ['Pick one piece of advice you’ve been given.', 'Test it for one week.', 'At the end, ask: did it work for me? Keep, change or drop it.'],
  stuck: 'If a week feels too long, test it once.',
  story: 'Everyone told Iris to batch-write on Sundays. She tried it for a week. It worked for emails, not for ideas: her ideas came on morning walks. She kept the Sunday emails and dropped the rest.'
};
H['pwr-4'] = {
  why: 'Your own way often gets buried under how everyone says it should be done. Writing how you’d do it, with no rules, brings your instincts back.',
  how: ['Imagine no one has ever told you how to go after your goal.', 'Write how you’d do it.', 'Notice what’s different from the “right” way.'],
  stuck: 'If nothing comes, ask: what would I do if I couldn’t get it wrong?',
  story: 'Everyone told Sam to build a funnel and run ads. When he wrote his own way, it was: call the ten people he’d most love to work with. No funnel. He made three of those calls that week.'
};
H['pwr-5'] = {
  why: 'When something works, it’s easy to credit luck or other people. Naming your part builds trust in your own ability.',
  how: ['When something works this week, notice it.', 'Write what you did to make it happen.', 'Read it back.'],
  stuck: 'If you can’t see your part, look smaller: showing up, following up, asking.',
  story: 'Kara landed a meeting with a company she’d wanted to work with. Her first thought: lucky timing. What did she actually do? She followed up twice when most people stop after one. She wrote it down: “Got the meeting because I followed up.”'
};
H['pwr-6'] = {
  why: 'Waiting on someone else hands them a key to your progress. Taking one step without them takes the key back.',
  how: ['Pick one thing you’ve been waiting on someone else for.', 'Find one step you can take without them.', 'Take it today.'],
  stuck: 'If you truly can’t move without them, name the key you want back and ask for it clearly.',
  story: 'Eric had been waiting three months for his business partner to start the website. He bought the domain himself that afternoon and set up a simple page. His partner saw it and said, “Oh good, let’s go.” The wait had been the only thing in the way.'
};

// ---- Making room: letting go of the old to let the new in
H['rm-1'] = {
  why: 'You can’t let go of what you haven’t named. Writing it down turns a vague heaviness into a short list you can actually work with.',
  how: ['Set a ten-minute timer.', 'List what you’re still holding on to: roles, labels, stories, hurts, hopes, things you keep paying for.', 'Circle the one that feels heaviest. You don’t have to do anything with it yet.'],
  stuck: 'If nothing comes, ask: what do I keep bringing up, or what do I avoid thinking about? Both point to something you’re carrying.',
  story: 'Kofi thought he’d moved on from his old job. Then he wrote his list: the title he still used in his bio, a grudge against his old manager, a business card stack in his drawer. Seeing it on paper, he realized he’d been living half in his old life. He circled the grudge.'
};
H['rm-2'] = {
  why: 'Letting go feels like loss when you skip the thank you. Honoring what something gave you lets you close it with respect instead of regret.',
  how: ['Pick one thing from your list.', 'Write what it gave you: a skill, a lesson, a season of your life.', 'Write “thank you”, then one line of goodbye.'],
  stuck: 'If it only ever hurt you, write what it taught you instead. That counts as what it gave you.',
  story: 'Sadie had kept her old dance shoes for six years without dancing. She wrote: “You gave me my twenties and my best friends. Thank you. I’m not that dancer anymore, and that’s okay.” She gave the shoes to her niece. It felt like closing a good book instead of losing something.'
};
H['rm-3'] = {
  why: 'Old labels quietly decide what you’ll even try. Retiring one, on purpose, gives the newer version of you room to act.',
  how: ['Write one label you’ve outgrown, exactly as you say it.', 'Ask: is this still true, or just familiar?', 'Write who you’re becoming instead, in words you can believe today.'],
  stuck: 'If the new version feels fake, make it smaller: “I’m learning to…” is always true.',
  story: 'Arjun had called himself “not a people person” since school. He wrote it down and noticed he’d led three projects this year and liked it. He rewrote it: “I’m someone who’s good with people one on one.” He signed up to mentor a new hire.'
};
H['rm-4'] = {
  why: 'Time and money already spent are gone either way. Asking “would I start this today?” shows you what keeping it is really costing you now.',
  how: ['Pick one thing you keep mostly because of what you’ve put in.', 'Ask: if I were starting fresh today, would I choose this?', 'Write what keeping it costs you each week: time, money, energy.'],
  stuck: 'If you can’t decide, you don’t have to. Write the cost down, and look again in a week.',
  story: 'Beth had spent two years and most of her savings on an online store that barely sold. Would she start it today? No. It cost her every Sunday and a knot in her stomach. She didn’t shut it down that day. She set a date, and her Sundays started to feel like hers again.'
};
H['rm-5'] = {
  why: 'Holding a grudge keeps you tied to the person who hurt you. Forgiving, for your own sake, puts the weight down without saying what happened was okay.',
  how: ['Pick one person you’re still carrying.', 'Write them a letter you will never send: what happened, how it felt, what it cost you.', 'End with what you’re putting down, then close the page.'],
  stuck: 'If you’re not ready to forgive, don’t force it. Write the letter anyway. Saying it fully is often the first step. If it involves abuse or trauma, talk to someone you trust or a professional.',
  story: 'Malik was still angry at a friend who’d bailed on a business they’d started together. He wrote the letter, all of it, then the last line: “I’m done carrying this around for you.” He didn’t send it or call him. He just noticed, a few days later, that he’d stopped rehearsing the argument in the shower.'
};
H['rm-6'] = {
  why: 'Even the right goodbye can hurt. Letting grief move through in small doses keeps it from building up or pulling you back to what you left.',
  how: ['When the missing or sadness shows up, notice it.', 'Give it five minutes: breathe, feel it, maybe write a line.', 'Then go back to your day on purpose.'],
  stuck: 'If five minutes feels like too much, three slow breaths with it count.',
  story: 'Yara left a job she’d outgrown and missed her team more than she expected. On Monday the missing hit on her drive in. She let it be there for five minutes, no podcast. Then she parked, walked in, and made her first call at the new place.'
};
H['rm-7'] = {
  why: 'Empty space feels uncomfortable, so it’s tempting to fill it with something that looks like the old thing. Leaving it open a while gives something new a chance to show up.',
  how: ['For the next 7 days, don’t rush to replace what you let go.', 'Each evening, write anything new you noticed: an idea, a person, a pull.', 'At the end of the week, read the list back.'],
  stuck: 'If the space feels too empty, fill it with rest, not with a copy of the old thing.',
  story: 'Dom left a relationship and felt the urge to download the dating apps that same night. He didn’t. For a week he wrote down what showed up instead: a pottery class he’d always wanted to try, an old friend who called, a weekend he enjoyed alone. By Sunday the space felt less like a gap and more like room.'
};
