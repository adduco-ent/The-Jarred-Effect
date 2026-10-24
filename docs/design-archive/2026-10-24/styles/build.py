# Builds the three whole-page style mockups: a = the app, start to finish; c = the same with a founder card; b = editorial.
import io, os
D=os.path.dirname(os.path.abspath(__file__))
HEAD='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>%s</title><base href="http://localhost:4321/">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Instrument+Sans:wght@400;500;600;700&family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;1,400&display=swap">
<link rel="stylesheet" href="file://'''+D+'''/base.css"><style>%s</style></head><body>'''
ARR='<svg viewBox="0 0 20 20" fill="none"><path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CK='<svg viewBox="0 0 20 20" fill="none"><path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
TRUST='<ul class="trust"><li>'+CK+'Free, no card</li><li>'+CK+'3 minutes</li><li>'+CK+'No sign-up to start</li></ul>'
NAV='<header class="nav"><a class="logo" href="#"><img src="assets/img/logo-lockup.png" alt="The Jarred Effect"></a><div class="nav-r"><a href="#">How it works</a><a href="#">About</a><a href="#">Free guide</a><a class="btn btn-sm" href="#">Take the free quiz</a></div></header>'
H1='You’re not failing to vibrate high enough. You’re missing <em>the other half.</em>'
SUB='Take the free 3-minute quiz to find the half you’ve been skipping. Then the Other Half turns it into one small step a day, built around your life.'
PAINS=['You journal gratitude every morning and still feel stuck by noon.','You’ve read the books, and you’re the same person with a better vocabulary.','You keep hearing “raise your vibration”, and nobody says what it costs.','You get the good week, then the crash nobody planned for.']
STEPS=[('morning','app-quiz.jpg','Step 1','Find your half','Eighteen quick questions show which half you lean on and which one you skip.'),
       ('afternoon','app-today.jpg','Step 2','One small step a day','Written for your goal and your life, with a smaller version for hard days.'),
       ('','app-progress.jpg','Step 3','See your patterns','Tell me how each step felt. Week by week, you see when you’re at your best.')]
WHEN=[('Day 3','A Tuesday goes sideways. You do the small version in four minutes, and it still counts.'),('Week 2','You notice your money steps get done before noon, so you stop fighting your own rhythm.'),('Week 4','Someone asks what changed. You say you keep your word to yourself now.')]
FAQ=[('What is the Other Half?','An app that turns the other half into a few minutes a day. You take a free 3-minute quiz, and I build your first week from your answers: one small step a day, with a smaller version for hard days.'),('How much does it cost?',''),('Is it written by AI?','')]

# ---------------- A and C: the app, start to finish ----------------
PCSS='''
.p-hero{position:relative;padding:1.5rem 0 0;text-align:center;background:radial-gradient(56rem 40rem at -8% 62%,rgba(198,182,238,.16),rgba(198,182,238,0) 72%),radial-gradient(46rem 34rem at 108% -8%,rgba(140,182,236,.14),rgba(140,182,236,0) 70%)}
.p-hero .top{display:flex;flex-direction:column;align-items:center;gap:1.25rem;padding:0 1.25rem}
.p-hero .h1{font-size:4.5rem;max-width:56rem}
.p-hero .sub{max-width:36rem}
.p-hero .go{display:flex;flex-direction:column;align-items:center;gap:1rem;margin-top:.5rem}
.stage{width:min(72rem,calc(100% - 2 * var(--pad)));height:32rem;margin:3.5rem auto 0;border-radius:2.75rem;box-shadow:0 2.5rem 5rem -3.5rem rgba(52,40,80,.55)}
.stage .phone{position:absolute;left:50%;top:3.25rem}
.pc{width:17rem;transform:translateX(-50%);z-index:2}
.pl{width:15rem;transform:translateX(calc(-50% - 17rem)) translateY(4.5rem) rotate(-7deg)}
.pr{width:15rem;transform:translateX(calc(-50% + 17rem)) translateY(4.5rem) rotate(7deg)}
.sec{padding:7rem var(--pad) 0}
.lab{margin:0 0 .875rem;font-size:.75rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
.head{max-width:44rem;margin:0 auto;text-align:center}
.head .sub{margin:1rem auto 0;max-width:36rem}
.card{background:#fff;border-radius:1.75rem;box-shadow:var(--app-card),inset 0 0 0 1px rgba(26,42,68,.06)}
.pains{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;max-width:62rem;margin:3rem auto 0;padding:0;list-style:none}
.pains li{display:flex;align-items:center;gap:1.25rem;padding:1.5rem 1.5rem;font-size:1.125rem;line-height:1.5}
.pains li span{flex:1}
.pains li i{flex:none;width:1.75rem;height:1.75rem;border-radius:50%;box-shadow:inset 0 0 0 1.5px rgba(26,42,68,.25)}
.pains li.on{box-shadow:inset 0 0 0 1.5px var(--navy),0 1.25rem 2.5rem -1.875rem rgba(20,34,58,.45);background:#f3f6fc}
.pains li.on i{background:var(--navy) url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 10.5l3 3 7-7.5" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>') center/1rem no-repeat;box-shadow:none}
.verdict{max-width:62rem;margin:1rem auto 0;padding:1.75rem 2rem;border-radius:1.75rem;color:#f4eee4;background:radial-gradient(110% 90% at 100% 100%,rgba(86,132,204,.5),rgba(86,132,204,0) 62%),radial-gradient(80% 70% at 0% 110%,rgba(150,128,212,.28),rgba(150,128,212,0) 60%),linear-gradient(180deg,#16253d,#0d1829);display:flex;align-items:center;justify-content:space-between;gap:2rem}
.verdict p{margin:0}.verdict .vh{font-family:var(--display);font-size:1.625rem}.verdict .vb{margin-top:.375rem;color:rgba(239,231,218,.75)}
.steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem;max-width:72rem;margin:3.5rem auto 0}
.step{overflow:hidden}
.step .tile{height:21rem;display:flex;justify-content:center;padding-top:2.25rem;border-radius:1.75rem 1.75rem 0 0}
.step .tile .phone{width:13.5rem}
.step .tx{padding:1.5rem 1.625rem 1.75rem}
.step .tx b{display:block;font-size:.75rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
.step .tx h3{margin:.5rem 0 .5rem;font-family:var(--display);font-weight:400;font-size:1.75rem;line-height:1.1}
.step .tx p{margin:0;font-size:1rem;line-height:1.55;color:var(--dim)}
.where{max-width:72rem;margin:0 auto;padding:4rem 3.5rem 3.75rem;border-radius:2.25rem;color:#f4eee4;background:radial-gradient(110% 90% at 100% 100%,rgba(86,132,204,.45),rgba(86,132,204,0) 62%),radial-gradient(80% 70% at 0% 110%,rgba(150,128,212,.26),rgba(150,128,212,0) 60%),linear-gradient(180deg,#16253d,#0d1829)}
.where .lab{color:rgba(239,231,218,.7)}.where .h2 em{color:#f3a378}
.where ul{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem;margin:2.75rem 0 0;padding:2rem 0 0;list-style:none;border-top:1px solid rgba(239,231,218,.14)}
.where li b{display:block;font-size:.75rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#b9c9ea}
.where li p{margin:.75rem 0 0;font-family:var(--serif);font-size:1.25rem;line-height:1.45}
.founder{display:grid;grid-template-columns:auto minmax(0,1fr);gap:2.5rem;align-items:center;max-width:62rem;margin:0 auto;padding:2.5rem 3rem}
.founder img{width:9rem;height:9rem;border-radius:50%;object-fit:cover;box-shadow:0 0 0 .375rem #fff,0 1.25rem 2.5rem -1.25rem rgba(20,34,58,.5)}
.founder q{display:block;margin:0;font-family:var(--serif);font-style:italic;font-size:1.625rem;line-height:1.35;quotes:none}
.founder p{margin:.875rem 0 0;font-size:1rem;line-height:1.6;color:var(--dim)}
.founder a{display:inline-block;margin-top:1rem;font-weight:600;color:var(--navy);text-decoration:none}
.faq{max-width:48rem;margin:3rem auto 0;display:grid;gap:.75rem}
.faq .card{padding:1.375rem 1.5rem}
.faq .q{display:flex;justify-content:space-between;align-items:center;gap:1rem;font-size:1.125rem;font-weight:500}
.faq .q i{flex:none;width:2rem;height:2rem;border-radius:50%;box-shadow:inset 0 0 0 1.5px rgba(26,42,68,.22);position:relative}
.faq .q i::before,.faq .q i::after{content:"";position:absolute;left:50%;top:50%;width:.75rem;height:1.5px;background:var(--ink);transform:translate(-50%,-50%)}
.faq .q i::after{transform:translate(-50%,-50%) rotate(90deg)}
.faq .open .q i{background:var(--navy);box-shadow:none}.faq .open .q i::before,.faq .open .q i::after{background:#fff}.faq .open .q i::after{display:none}
.faq .a{margin:.75rem 0 0;font-size:1rem;line-height:1.6;color:var(--dim)}
.final{max-width:72rem;margin:7rem auto 0;padding:5rem 2rem;border-radius:2.75rem;text-align:center}
.final .h2{font-size:3.5rem}
.final .sub{margin:1rem auto 2rem;max-width:32rem;color:#3f382f}
.final .trust{margin-top:1rem}
@media (max-width:767px){
  .p-hero .h1{font-size:2.75rem}.p-hero .sub{font-size:1.0625rem}.p-hero .go{align-self:stretch}.p-hero .go .btn{width:100%}
  .stage{width:calc(100% - 1.5rem);height:24rem;margin-top:2.5rem;border-radius:2rem}.pc{width:13rem}.pl,.pr{width:11rem}
  .pl{transform:translateX(calc(-50% - 9.75rem)) translateY(3rem) rotate(-7deg)}.pr{transform:translateX(calc(-50% + 9.75rem)) translateY(3rem) rotate(7deg)}
  .sec{padding-top:5rem}.pains,.steps,.where ul{grid-template-columns:minmax(0,1fr)}.verdict{flex-direction:column;align-items:flex-start}
  .where{padding:2.5rem 1.5rem}.founder{grid-template-columns:minmax(0,1fr);padding:2rem 1.5rem;text-align:center}.founder img{margin:0 auto}.final .h2{font-size:2.5rem}
}
'''
def product(founder):
    pains=''.join('<li class="card%s"><span>%s</span><i></i></li>' % (' on' if k in (0,3) else '',t) for k,t in enumerate(PAINS))
    steps=''.join('<article class="card step"><div class="sky %s tile"><div class="phone"><img src="assets/img/%s" alt=""></div></div><div class="tx"><b>%s</b><h3>%s</h3><p>%s</p></div></article>' % (('sky--'+s) if s else '',img,n,t,x) for s,img,n,t,x in STEPS)
    when=''.join('<li><b>%s</b><p>%s</p></li>' % w for w in WHEN)
    faq=''.join('<div class="card%s"><div class="q">%s<i></i></div>%s</div>' % (' open' if k==0 else '',q,('<p class="a">'+a+'</p>') if a else '') for k,(q,a) in enumerate(FAQ))
    fnd=('''<section class="sec"><div class="card founder"><img src="assets/img/jarred-face.jpg" alt=""><div><p class="lab">Built by Jarred</p><q>“Nobody hands you a mentor, so I built the one I wish I’d had.”</q><p>I paid “gurus” thousands for manifestation coaching. It worked, but none of them taught me the other half. The Other Half is the accountable friend I never had.</p><a href="#">Read my story →</a></div></div></section>''' if founder else '')
    return (HEAD % ('Style · App first' + (' + founder' if founder else ''), PCSS)) + NAV + '''
<section class="p-hero"><div class="top"><p class="lab" style="color:#1a2a44;margin:0">For people sick of spiritual platitudes</p><h1 class="h1">'''+H1+'''</h1><p class="sub">'''+SUB+'''</p><div class="go"><a class="btn btn-xl" href="#">Find my other half'''+ARR+'''</a>'''+TRUST+'''</div></div>
<div class="sky stage"><div class="phone pl"><img src="assets/img/app-quiz.jpg" alt=""></div><div class="phone pr"><img src="assets/img/app-progress.jpg" alt=""></div><div class="phone pc"><img src="assets/img/app-welcome.jpg" alt=""></div></div></section>
<section class="sec"><div class="head"><p class="lab">Sound familiar?</p><h2 class="h2">You’ve done the vision boards. <em>Here’s why nothing changed.</em></h2></div><ul class="pains">'''+pains+'''</ul>
<div class="verdict"><div><p class="vh">Two of four. That’s not you failing.</p><p class="vb">It’s the other half missing, and the quiz shows you which one.</p></div><a class="btn btn-light" href="#">Find my other half</a></div></section>
<section class="sec"><div class="head"><p class="lab">How it works</p><h2 class="h2">Three steps, <em>a few minutes a day.</em></h2><p class="sub">If it doesn’t survive a Tuesday, it doesn’t make the cut.</p></div><div class="steps">'''+steps+'''</div></section>
<section class="sec"><div class="where"><p class="lab">Where this goes</p><h2 class="h2">Not a new you. <em>The whole you.</em></h2><ul>'''+when+'''</ul></div></section>
'''+fnd+'''
<section class="sec"><div class="head"><p class="lab">Questions</p><h2 class="h2">Before you start.</h2></div><div class="faq">'''+faq+'''</div></section>
<section class="sec" style="padding-top:0"><div class="sky final"><h2 class="h2">Find your <em>other half.</em></h2><p class="sub">One question at a time, three minutes, and your first week is free.</p><a class="btn btn-xl" href="#">Find my other half'''+ARR+'''</a>'''+TRUST+'''</div></section>
<footer class="foot" style="margin-top:6rem"><img src="assets/img/logo-lockup.png" alt=""><span>How it works · About · Free guide · Privacy</span></footer></body></html>'''

# ---------------- B: editorial, Jarred's method in print ----------------
BCSS='''
body{background:#fdfcf9}
.grain{position:absolute;inset:0;background:url(assets/img/grain.png) repeat;background-size:11rem;opacity:.3;mix-blend-mode:soft-light;pointer-events:none}
.e-hero{padding:2.5rem var(--pad) 0;text-align:center}
.e-hero .eye{margin:0 0 1.5rem;font-size:.78rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#3e6cab}
.e-hero .h1{position:relative;display:inline-block;font-size:5.5rem;max-width:62rem}
.note{font-family:Caveat,cursive;font-weight:600;font-size:1.875rem;line-height:.95;color:var(--rust)}
.e-hero .note{position:absolute;right:-9rem;top:-.5rem;transform:rotate(-5deg);text-align:left}
.e-hero .sub{max-width:34rem;margin:1.75rem auto 0}
.e-hero .go{display:flex;flex-direction:column;align-items:center;gap:1rem;margin-top:2.25rem}
.kick{display:flex;align-items:center;gap:.75rem;margin:0 0 1.375rem;font-size:.78rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#3e6cab}
.kick b{font-family:var(--display);font-weight:400;font-size:.95rem;letter-spacing:0;color:var(--rust)}
.kick i{width:2rem;height:1px;background:currentColor;opacity:.4}
.esec{padding:8rem var(--pad) 0}
.split{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:5rem;align-items:start}
.list{margin:0;padding:0;list-style:none;border-top:1px solid rgba(28,24,18,.12)}
.list li{display:grid;grid-template-columns:3rem minmax(0,1fr);gap:1rem;padding:1.5rem 0;border-bottom:1px solid rgba(28,24,18,.12);font-family:var(--serif);font-size:1.375rem;line-height:1.4}
.list li b{font-family:var(--display);font-weight:400;color:var(--rust)}
.mech{text-align:center}
.panel{position:relative;max-width:72rem;height:30rem;margin:3.5rem auto 0;border-radius:2.5rem;overflow:hidden;background:linear-gradient(90deg,#f5efe5 50%,#0e1a2c 50%)}
.panel img{position:absolute;left:50%;top:50%;width:36rem;transform:translate(-50%,-50%)}
.panel .ink{clip-path:inset(0 50% 0 0)}.panel .crm{clip-path:inset(0 0 0 50%)}
.cap{max-width:40rem;margin:-3rem auto 0;position:relative;padding:2rem 2.5rem;background:#fff;border-radius:1.75rem;box-shadow:0 3rem 5rem -3rem rgba(6,12,24,.45);font-family:var(--serif);font-style:italic;font-size:1.375rem;line-height:1.5}
.spread{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);max-width:72rem;margin:0 auto;border-radius:2.5rem;overflow:hidden}
.spread .l{padding:4.5rem 4rem;background:#f5efe5}
.spread .r{position:relative;display:flex;justify-content:center;align-items:flex-end;padding-top:4rem;background:#0e1a2c;overflow:hidden}
.spread .r .phone{width:16rem;margin-bottom:-7rem}
.spread .r .note{position:absolute;left:2.25rem;top:3rem;color:#f3a378;transform:rotate(-6deg)}
.steps2{margin:2rem 0 0;padding:0;list-style:none;display:grid;gap:1.25rem}
.steps2 li{display:grid;grid-template-columns:2.5rem minmax(0,1fr);gap:.75rem}
.steps2 b{font-family:var(--display);font-weight:400;font-size:1.5rem;color:var(--rust)}
.steps2 h3{margin:0;font-family:var(--display);font-weight:400;font-size:1.5rem}
.steps2 p{margin:.25rem 0 0;color:var(--dim);line-height:1.55}
.who{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:5rem;align-items:center}
.who .ph{position:relative}
.who .ph img{width:100%;aspect-ratio:5/6;object-fit:cover;border-radius:2.75rem 2.75rem .5rem 2.75rem;box-shadow:0 2.5rem 5rem -2.25rem rgba(28,24,18,.45)}
.who .orb{position:absolute;right:-1.5rem;top:2.5rem;width:4.75rem;height:4.75rem;border-radius:50%;background:linear-gradient(90deg,#e8743a 50%,#0e1a2c 50%);box-shadow:0 0 0 .4375rem #fdfcf9}
.who .pq{margin:1.75rem 0 0;font-family:var(--serif);font-style:italic;font-size:1.5rem;line-height:1.45}
.who .sig{margin:.75rem 0 0;font-family:Caveat,cursive;font-weight:600;font-size:2rem;color:#3e6cab;transform:rotate(-3deg);transform-origin:left}
.two{display:grid;grid-template-columns:1fr 1fr;max-width:72rem;margin:8rem auto 0;border-radius:2.5rem;overflow:hidden}
.two>div{padding:4.5rem 3.5rem}
.two .a{background:#f5efe5;text-align:right}.two .b{position:relative;background:#0e1a2c;color:#efe7da}
.two .h2{font-size:2.75rem}.two .b .h2 em{color:#f3a378}
.two .b .btn{margin-top:2rem}
.lead{margin:1.25rem 0 0;font-size:1.1875rem;line-height:1.6;color:var(--dim)}
@media (max-width:767px){
  .e-hero .h1{font-size:2.875rem}.e-hero .note{display:none}.e-hero .sub{font-size:1.0625rem}.e-hero .go{align-self:stretch}.e-hero .go .btn{width:100%}
  .esec{padding-top:5rem}.split,.who,.spread,.two{grid-template-columns:minmax(0,1fr);gap:2rem}.panel{height:18rem}.panel img{width:22rem}
  .spread .l{padding:2.5rem 1.5rem}.spread .r{min-height:22rem}.two .a{text-align:left}.two>div{padding:2.5rem 1.5rem}
}
'''
def editorial():
    pains=''.join('<li><b>0%d</b><span>%s</span></li>' % (k+1,t) for k,t in enumerate(PAINS))
    steps=''.join('<li><b>%d</b><div><h3>%s</h3><p>%s</p></div></li>' % (k+1,t,x) for k,(s,img,n,t,x) in enumerate(STEPS))
    return (HEAD % ('Style · Editorial', BCSS)) + NAV + '''
<section class="e-hero"><p class="eye">For people sick of spiritual platitudes</p><h1 class="h1">You’re not failing to vibrate high enough. You’re missing <em>the other half.</em><span class="note">the half nobody<br>sells you</span></h1><p class="sub">'''+SUB+'''</p><div class="go"><a class="btn btn-xl" href="#">Find my other half'''+ARR+'''</a>'''+TRUST+'''</div></section>
<section class="esec"><div class="split"><div><p class="kick"><b>01</b><i></i>The problem</p><h2 class="h2">You’ve done the vision boards. <em>Here’s why nothing changed.</em></h2></div><ol class="list">'''+pains+'''</ol></div></section>
<section class="esec mech"><p class="kick" style="justify-content:center"><b>02</b><i></i>The real mechanism</p><h2 class="h2">It’s not what you say. Not what you think. <em>It’s what you feel.</em></h2><div class="panel"><img class="ink" src="assets/img/vitruvian-ink.png" alt=""><img class="crm" src="assets/img/vitruvian-cream.png" alt=""><div class="grain"></div></div><p class="cap">Whatever’s held in your gut and heart is the signal your life responds to.</p></section>
<section class="esec"><div class="spread"><div class="l"><p class="kick"><b>03</b><i></i>The practice</p><h2 class="h2">Knowing it is half. <em>Living it is the other half.</em></h2><ol class="steps2">'''+steps+'''</ol><div style="margin-top:2.25rem"><a class="btn" href="#">Find my other half'''+ARR+'''</a></div></div><div class="r"><div class="grain"></div><span class="note">where you’ll<br>live it</span><div class="phone"><img src="assets/img/app-welcome.jpg" alt=""></div></div></div></section>
<section class="esec"><div class="who"><div class="ph"><img src="assets/img/jarred-sunrise.jpg" alt=""><span class="orb"></span></div><div><p class="kick"><b>04</b><i></i>Who’s behind this</p><h2 class="h2">I’m not a guru. Just someone who got it wrong enough times to find <em>the other half.</em></h2><p class="lead">I paid “gurus” thousands of dollars for manifestation coaching. It worked, but none of them taught me the other half.</p><p class="pq">“Nobody hands you a mentor, so I built the one I wish I’d had.”</p><p class="sig">— Jarred</p></div></div></section>
<section style="padding:0 var(--pad)"><div class="two"><div class="a"><p class="kick" style="justify-content:flex-end">If nothing changes</p><h2 class="h2">Stay on one side.</h2></div><div class="b"><div class="grain"></div><p class="kick" style="color:#f3a378">If you take the quiz</p><h2 class="h2">Get <em>the other half.</em></h2><a class="btn btn-light" href="#">Find my other half'''+ARR+'''</a></div></div></section>
<footer class="foot" style="margin-top:6rem"><img src="assets/img/logo-lockup.png" alt=""><span>How it works · About · Free guide · Privacy</span></footer></body></html>'''

io.open(os.path.join(D,'a.html'),'w',encoding='utf-8').write(product(False))
io.open(os.path.join(D,'c.html'),'w',encoding='utf-8').write(product(True))
io.open(os.path.join(D,'b.html'),'w',encoding='utf-8').write(editorial())
print('built')
