/* index.html — page behaviour. State lives in Component; /script.js applies it to the markup's data-* bindings. */
(function () {
var DCLogic = TJE.DCLogic;
class Component extends DCLogic {
  componentDidMount() {
    var self = this, w = window, d = document;
    var HAS_HERO = true;
    var hero = d.getElementById('capture');
    this._raf = 0;
    this._onScroll = function () {
      if (self._raf) return;
      self._raf = w.requestAnimationFrame(function () {
        self._raf = 0;
        var y = w.scrollY || d.documentElement.scrollTop || 0;
        var on;
        if (HAS_HERO) {
          if (!hero) { on = false; } else { var r = hero.getBoundingClientRect(); on = (r.bottom + y) < (y + 40) && y > 200; }
        } else { on = true; }
        var dark = false, chapter = '', vh = w.innerHeight || 800;
        Array.prototype.forEach.call(d.querySelectorAll('[data-tone="dark"]'), function (el) { var b = el.getBoundingClientRect(); if (b.top <= 42 && b.bottom >= 42) dark = true; });
        // the section crossing the reading line names the bar. Geometry, not IntersectionObserver rootMargin,
        // which browsers ignore inside cross-origin iframes (previews, embeds)
        Array.prototype.forEach.call(d.querySelectorAll('[data-chapter]'), function (el) { if (el.getBoundingClientRect().top <= vh * 0.42) chapter = el.getAttribute('data-chapter'); });
        var st = self.state || {};
        if (on !== !!st.bar || dark !== !!st.barDark || chapter !== (st.chapter || '')) self.setState({ bar: on, barDark: dark, chapter: chapter });
      });
    };
    w.addEventListener('scroll', this._onScroll, { passive: true });
    w.addEventListener('resize', this._onScroll);
    this._onScroll();
    if ('IntersectionObserver' in w) {
      this._seen = new Set();
      this._fio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) self._seen.add(en.target); else self._seen.delete(en.target); });
        var fv = self._seen.size > 0;
        if (fv !== !!(self.state || {}).formInView) self.setState({ formInView: fv });
      }, { threshold: 0.2 });
      Array.prototype.forEach.call(d.querySelectorAll('[data-capture]'), function (f) { self._fio.observe(f); });
      var vid = d.querySelector('.tje-video video');
      var reduce = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) this.setState({ userPaused: true });
      if (vid) {
        this._vio = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            var st = self.state || {};
            if (en.isIntersecting && !st.userPaused) { var p = vid.play(); if (p && p.catch) p.catch(function () {}); }
            else if (!en.isIntersecting) { vid.pause(); }
          });
        }, { threshold: 0.4 });
        this._vio.observe(vid);
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScroll);
    if (this._raf) window.cancelAnimationFrame(this._raf);
    if (this._chio) this._chio.disconnect();
    if (this._fio) this._fio.disconnect();
    if (this._vio) this._vio.disconnect();
    clearTimeout(this._sendT);
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var sent = !!s.sent, errorAt = s.errorAt || '', sendingAt = s.sendingAt || '', suggestAt = s.suggestAt || '';
    var menu = !!s.menu, muted = s.muted !== false, userPaused = !!s.userPaused, side = s.side || '';
    var CH = { problem: '01 · The problem', mechanism: '02 · The real mechanism', plan: '03 · How it works', story: '04 · Who’s behind this', where: '05 · Where this goes', faq: '06 · Before you go', final: '07 · Your move', guide: 'The free guide' };
    var TYPOS = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gmail.cm': 'gmail.com', 'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmail.co': 'hotmail.com', 'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.co': 'yahoo.com', 'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com', 'outlook.co': 'outlook.com', 'iclod.com': 'icloud.com', 'icloud.co': 'icloud.com' };
    var isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
    var typoFix = function (v) { var m = /^([^@\s]+)@([^@\s]+)$/.exec(v); if (!m) return ''; var f = TYPOS[m[2].toLowerCase()]; return f ? m[1] + '@' + f : ''; };
    var msgFor = function (v) { return v ? 'That doesn’t look like an email yet — mind checking it?' : 'Pop your email in and I’ll send it right over.'; };
    var field = function (where) { return document.getElementById(where + '-email'); };
    var reduce = function () { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); };
    var goTo = function (inputId, sectionId) {
      return function (e) {
        var target = document.getElementById(inputId) || document.getElementById(sectionId);
        if (!target) return;
        if (e && e.preventDefault) e.preventDefault();
        self.setState({ menu: false });
        target.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'center' });
        var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
        var inp = document.getElementById(inputId);
        if (fine && inp) setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (err) { inp.focus(); } }, 480);
      };
    };
    var makeSubmit = function (where) {
      return function (e) {
        if (e && e.preventDefault) e.preventDefault();
        if ((self.state || {}).sendingAt) return;
        var el = field(where);
        var v = ((el && el.value) || '').trim();
        if (!isEmail(v)) { self.setState({ errorAt: where, errMsg: msgFor(v), suggestAt: '' }); if (el) el.focus(); return; }
        self.setState({ email: v, sendingAt: where, errorAt: '', suggestAt: '' });
        clearTimeout(self._sendT);
        // the real send: api/subscribe.js adds the contact in Resend and emails the guide
        TJE.subscribe({ email: v, name: '', source: TJE.page + ':' + where, form: e && e.target }).then(function () {
          self.setState({ sent: true, sendingAt: '' });
        }, function (err) {
          self.setState({ sendingAt: '', errorAt: where, errMsg: err.message, suggestAt: '' });
          if (el) el.focus();
        });
      };
    };
    var makeBlur = function (where) {
      return function (e) {
        var v = ((e && e.target && e.target.value) || '').trim();
        var st = self.state || {};
        var next = {};
        if (v && !isEmail(v)) { next.errorAt = where; next.errMsg = msgFor(v); } else if (st.errorAt === where) { next.errorAt = ''; }
        var fix = typoFix(v);
        next.suggestAt = fix ? where : (st.suggestAt === where ? '' : st.suggestAt || '');
        next.suggestion = fix || st.suggestion || '';
        self.setState(next);
      };
    };
    var makeFix = function (where) {
      return function () {
        var el = field(where), sg = (self.state || {}).suggestion || '';
        if (el && sg) { el.value = sg; el.focus(); }
        self.setState({ email: sg, suggestAt: '', errorAt: '' });
      };
    };
    var pains = s.pains || {};
    var picked = ['1', '2', '3', '4'].filter(function (k) { return pains[k]; });
    var painCount = picked.length;
    var togglePain = function (k) { return function () { var st = self.state || {}; var p = Object.assign({}, st.pains || {}); p[k] = !p[k]; self.setState({ pains: p, painTick: (st.painTick || 0) + 1 }); }; };
    // one read per selection and per combination (15 in total) + the empty state
    var READS = {
      '': ['Your read shows up here.', 'Pick one or more. Each combination says something different about what’s missing.'],
      '1': ['Gratitude that’s gone by noon.', 'The practice isn’t wrong — it’s working one side only. The morning high has nothing to hold it once the day pushes back.'],
      '2': ['You don’t need more input.', 'You’ve learned the language of change. What’s missing is the half that turns knowing it into actually being different.'],
      '3': ['“Raise your vibration” is half an instruction.', 'Nobody mentions the cost because the cost lives on the side most teachers skip.'],
      '4': ['The crash isn’t you doing it wrong.', 'It’s the other side showing up in a system that only planned for the high. Of course it feels like failure.'],
      '12': ['Practice every morning. Shelves of courses. Still stuck.', 'That’s not a lack of effort or information. Both have been working the same single side.'],
      '13': ['Doing the high-vibe work — and paying for it by noon.', 'That midday drop is the cost nobody put on the label.'],
      '14': ['The noon slump and the crash are the same signal.', 'One is daily and quiet, one is weekly and loud. Both are the half your practice never accounts for.'],
      '23': ['All that learning, and nobody named the cost.', 'The courses teach the light side fluently. The other half is the part they leave out.'],
      '24': ['You know the theory. The crash keeps rewriting it.', 'A bigger vocabulary doesn’t help when the system has no room for a bad week.'],
      '34': ['High vibe, then the crash. That’s the bill arriving.', 'If no one tells you what raising your vibration costs, you pay it later — usually all at once.'],
      '123': ['Three kinds of effort, one shared blind spot.', 'Practice, study, positivity — all aimed at the same side. None of them include the other half.'],
      '124': ['Every tool you’ve tried skips the same thing.', 'The gratitude, the courses, the good weeks — none of it planned for the low. That’s the pattern, not you.'],
      '134': ['You’re living the full loop: high, cost, crash.', 'That’s not a character flaw. It’s what one-sided manifestation does on repeat.'],
      '234': ['You’ve studied it, lived it, and crashed out of it.', 'The teaching was missing a half. The crash is where you keep running into it.'],
      '1234': ['All four. That’s not you failing — that’s the other half missing.', 'Every one of these traces back to the same gap, and that gap is what the Other Half is for.']
    };
    var read = READS[picked.join('')] || READS[''];
    var painTick = s.painTick || 0;
    var pip = function (k) { return pains[k] ? 'tje-pip is-on' : 'tje-pip'; };
    // phone: the 4 cards stack taller than the screen, so while you're picking, the dock points to your read
    var dockRead = s.chapter === 'problem' && painCount > 0;
    var videoOf = function (e) { var b = e && e.currentTarget; var box = b && b.closest ? b.closest('.tje-video') : null; return box ? box.querySelector('video') : null; };
    var out = {
      shadow: this.props.shadowTone ?? '#0e1a2c',
      motionClass: (this.props.intro ?? true) ? 'is-motion' : '',
      year: String(new Date().getFullYear()),
      // at the finale the chrome recedes: no duplicate "Your move" label, no third CTA
      barClass: (s.bar && s.chapter !== 'final' ? 'is-on' : '') + (s.barDark ? ' is-dark' : '') + (s.formInView ? ' is-quiet' : ''),
      dockClass: (s.bar && !s.formInView && s.chapter !== 'final' && (!sent || dockRead)) ? 'is-on' : '',
      resetFinal: function () { self.setState({ sent: false, errorAt: '', suggestAt: '' }); setTimeout(function () { var el = field('final'); if (el) { el.value = (self.state || {}).email || ''; el.focus(); el.select(); } }, 60); },
      // finale path A lists the visitor's own picks from 01; with no picks it shows 1, 2 and 4 as the default
      fin1: painCount > 0 ? !!pains['1'] : true,
      fin2: painCount > 0 ? !!pains['2'] : true,
      fin3: painCount > 0 ? !!pains['3'] : false,
      fin4: painCount > 0 ? !!pains['4'] : true,
      finPicked: painCount > 0,
      finClass: sent ? 'ffin is-chosen' : 'ffin',
      dockRead: dockRead,
      dockGuide: !dockRead,
      goRead: function (e) { if (e && e.preventDefault) e.preventDefault(); var v = document.getElementById('problem-read'); if (v) v.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'center' }); },
      chapterLabel: CH[s.chapter] || '',
      email: s.email || '',
      errMsg: s.errMsg || '',
      suggestion: s.suggestion || '',
      sent: sent,
      notSent: !sent,
      onEmail: function (e) { var st = self.state || {}; var v = e && e.target ? e.target.value : ''; var n = { email: v }; if (st.errorAt) n.errorAt = ''; if (st.suggestAt) n.suggestAt = ''; self.setState(n); },
      reset: function () { self.setState({ sent: false, email: '', errorAt: '', suggestAt: '' }); setTimeout(function () { var el = field('hero'); if (el) el.focus(); }, 60); },
      goHero: goTo('hero-email', 'capture'),
      goGuide: goTo('guide-email', 'guide'),
      menu: menu,
      menuLabel: menu ? 'Close menu' : 'Open menu',
      menuExpanded: menu ? 'true' : 'false',
      toggleMenu: function () { self.setState({ menu: !menu }); if (!menu) setTimeout(function () { var a = document.querySelector('#tje-menu-panel a'); if (a) a.focus(); }, 40); },
      closeMenu: function () { self.setState({ menu: false }); },
      p1: pains['1'] ? 'true' : 'false', p2: pains['2'] ? 'true' : 'false', p3: pains['3'] ? 'true' : 'false', p4: pains['4'] ? 'true' : 'false',
      tp1: togglePain('1'), tp2: togglePain('2'), tp3: togglePain('3'), tp4: togglePain('4'),
      painCount: String(painCount),
      anyPain: painCount > 0,
      painHead: read[0],
      painBody: read[1],
      painCta: painCount === 4 ? 'Take the free quiz' : (painCount > 1 ? 'Take the quiz that connects them' : 'Take the quiz that names it'),
      verdictClass: painCount > 0 ? 'tje-verdict is-on' : 'tje-verdict',
      swapClass: 'tje-verdict-copy' + (painTick === 0 ? '' : (painTick % 2 ? ' tje-swap-a' : ' tje-swap-b')),
      pip1: pip('1'), pip2: pip('2'), pip3: pip('3'), pip4: pip('4'),
      figClass: side === 'neg' ? 'is-neg' : (side === 'pos' ? 'is-pos' : ''),
      negOn: side === 'neg' ? 'true' : 'false',
      posOn: side === 'pos' ? 'true' : 'false',
      pickNeg: function () { self.setState({ side: side === 'neg' ? '' : 'neg' }); },
      pickPos: function () { self.setState({ side: side === 'pos' ? '' : 'pos' }); },
      muted: muted,
      unmuted: !muted,
      muteLabel: muted ? 'Unmute video' : 'Mute video',
      toggleMute: function (e) { var v = videoOf(e); if (v) v.muted = !muted; self.setState({ muted: !muted }); },
      playing: !userPaused,
      paused: userPaused,
      playLabel: userPaused ? 'Play video' : 'Pause video',
      togglePlay: function (e) { var v = videoOf(e); if (v) { if (userPaused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); } } self.setState({ userPaused: !userPaused }); }
    };
    // 04 · how it works: tap a step and the phone shows that screen; on phones the step's words sit under the tabs
    var planAt = s.plan || 1;
    var PLAN = ['', 'Eighteen quick questions show which half you lean on and which one you skip. It takes three minutes, and it’s free.',
      'One small step a day for the goal you care about, written for your life, with a smaller version for hard days.',
      'Tell me how each step felt, and the next one adjusts. Along the way you see your own patterns: when you’re at your best, and what amplifies or drains you.'];
    out.planDesc = PLAN[planAt];
    out.planTitle = ['', 'Take the quiz', 'Get your week', 'Check in'][planAt];
    // the handwritten note beside the phone, in the same hand as the hero's
    out.planNote = ['', 'go with your gut', 'one small step per goal', 'I notice the patterns'][planAt];
    [1, 2, 3].forEach(function (k) {
      out['plan' + k] = function () { self.setState({ plan: k }); };
      out['plan' + k + 'Sel'] = planAt === k ? 'true' : 'false';
      out['plan' + k + 'Class'] = 'tje-seg-b' + (planAt === k ? ' is-on' : '');
      out['shot' + k + 'Class'] = 'tje-plan-shot' + (planAt === k ? ' is-on' : '');
    });
    ['hero', 'guide', 'final'].forEach(function (k) {
      out[k + 'Error'] = errorAt === k;
      out[k + 'Invalid'] = errorAt === k ? 'true' : 'false';
      out[k + 'InputClass'] = errorAt === k ? 'tje-input is-invalid' : 'tje-input';
      out[k + 'Sending'] = sendingAt === k;
      out[k + 'Idle'] = sendingAt !== k;
      out[k + 'Busy'] = sendingAt === k ? 'true' : 'false';
      out[k + 'Suggest'] = suggestAt === k && !!s.suggestion;
      out['submit' + k.charAt(0).toUpperCase() + k.slice(1)] = makeSubmit(k);
      out['blur' + k.charAt(0).toUpperCase() + k.slice(1)] = makeBlur(k);
      out['fix' + k.charAt(0).toUpperCase() + k.slice(1)] = makeFix(k);
    });
    return out;
  }
}
TJE.mount(Component);
})();
