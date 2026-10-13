/* about.html — page behaviour. State lives in Component; /script.js applies it to the markup's data-* bindings. */
(function () {
var DCLogic = TJE.DCLogic;
class Component extends DCLogic {
  componentDidMount() {
    var self = this, w = window, d = document;
    var hero = d.querySelector('.tab-hero');
    this._raf = 0;
    // one rAF-throttled pass decides everything position-based. Section and chapter come from geometry
    // against a reading line, not IntersectionObserver rootMargin: inside a cross-origin iframe (the canvas,
    // embeds) rootMargin is ignored, which left the bar naming the story while you read the beliefs.
    this._onScroll = function () {
      if (self._raf) return;
      self._raf = w.requestAnimationFrame(function () {
        self._raf = 0;
        var vh = w.innerHeight || 800;
        var on = hero ? hero.getBoundingClientRect().bottom < 40 : true;
        var dark = false, chapter = '', chn = '1';
        Array.prototype.forEach.call(d.querySelectorAll('[data-tone="dark"]'), function (el) { var b = el.getBoundingClientRect(); if (b.top <= 42 && b.bottom >= 42) dark = true; });
        Array.prototype.forEach.call(d.querySelectorAll('[data-chapter]'), function (el) { if (el.getBoundingClientRect().top <= vh * 0.42) chapter = el.getAttribute('data-chapter'); });
        // the chapter rail: the last chapter to cross the reading line is the current one
        Array.prototype.forEach.call(d.querySelectorAll('[data-ch]'), function (el) { if (el.getBoundingClientRect().top <= vh * 0.4) chn = el.getAttribute('data-ch'); });
        var st = self.state || {};
        if (on !== !!st.bar || dark !== !!st.barDark || chapter !== (st.chapter || '') || chn !== (st.ch || '1')) self.setState({ bar: on, barDark: dark, chapter: chapter, ch: chn });
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
    }
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onScroll);
    if (this._raf) window.cancelAnimationFrame(this._raf);
    if (this._fio) this._fio.disconnect();
    clearTimeout(this._sendT);
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var sent = !!s.sent, errorAt = s.errorAt || '', sendingAt = s.sendingAt || '', suggestAt = s.suggestAt || '';
    var menu = !!s.menu, ch = s.ch || '1';
    var CH = { story: 'About · 01 The story', beliefs: 'About · 02 What I believe', start: 'About · 03 Start here' };
    var ROM = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V' };
    var CHT = { '1': 'Where I started', '2': 'What broke', '3': 'Where “manifestation” let me down', '4': 'What I found', '5': 'Why this exists now' };
    var inStory = s.chapter === 'story';
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
    var out = {
      shadow: this.props.shadowTone ?? '#0e1a2c',
      motionClass: (this.props.intro ?? true) ? 'is-motion' : '',
      year: String(new Date().getFullYear()),
      // the chrome recedes at the payoff: no bar label + CTA stacked on top of the form
      barClass: (s.bar && s.chapter !== 'start' ? 'is-on' : '') + (s.barDark ? ' is-dark' : '') + (s.formInView ? ' is-quiet' : ''),
      dockClass: (s.bar && !s.formInView && s.chapter !== 'start' && !sent) ? 'is-on' : '',
      // inside the story the bar names the chapter you're reading, not just the section
      chapterLabel: inStory ? 'The story · ' + ROM[ch] + ' · ' + CHT[ch] : (CH[s.chapter] || 'About'),
      chipClass: (s.bar && inStory) ? 'tab-chip is-on' : 'tab-chip',
      chRoman: ROM[ch],
      chTitle: CHT[ch],
      chPos: ch + ' of 5',
      email: s.email || '',
      errMsg: s.errMsg || '',
      suggestion: s.suggestion || '',
      sent: sent,
      notSent: !sent,
      onEmail: function (e) { var st = self.state || {}; var v = e && e.target ? e.target.value : ''; var n = { email: v }; if (st.errorAt) n.errorAt = ''; if (st.suggestAt) n.suggestAt = ''; self.setState(n); },
      resetStart: function () { self.setState({ sent: false, errorAt: '', suggestAt: '' }); setTimeout(function () { var el = field('start'); if (el) { el.value = (self.state || {}).email || ''; el.focus(); el.select(); } }, 60); },
      goStart: goTo('start-email', 'start'),
      menu: menu,
      menuLabel: menu ? 'Close menu' : 'Open menu',
      menuExpanded: menu ? 'true' : 'false',
      toggleMenu: function () { self.setState({ menu: !menu }); if (!menu) setTimeout(function () { var a = document.querySelector('#tje-menu-panel a'); if (a) a.focus(); }, 40); },
      closeMenu: function () { self.setState({ menu: false }); }
    };
    ['1', '2', '3', '4', '5'].forEach(function (k) {
      out['rc' + k] = ch === k ? 'is-on' : '';
      out['ra' + k] = ch === k ? 'true' : 'false';
    });
    ['start'].forEach(function (k) {
      var K = k.charAt(0).toUpperCase() + k.slice(1);
      out[k + 'Error'] = errorAt === k;
      out[k + 'Invalid'] = errorAt === k ? 'true' : 'false';
      out[k + 'InputClass'] = errorAt === k ? 'tje-input is-invalid' : 'tje-input';
      out[k + 'Sending'] = sendingAt === k;
      out[k + 'Idle'] = sendingAt !== k;
      out[k + 'Busy'] = sendingAt === k ? 'true' : 'false';
      out[k + 'Suggest'] = suggestAt === k && !!s.suggestion;
      out['submit' + K] = makeSubmit(k);
      out['blur' + K] = makeBlur(k);
      out['fix' + K] = makeFix(k);
    });
    return out;
  }
}
TJE.mount(Component);
})();
