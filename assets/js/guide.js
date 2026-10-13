/* opt-in.html — page behaviour. State lives in Component; /script.js applies it to the markup's data-* bindings. */
(function () {
var DCLogic = TJE.DCLogic;
class Component extends DCLogic {
  componentDidMount() {
    var self = this, w = window, d = document;
    // the bar and dock arrive the moment the hero form leaves the screen: the form is the point of the page
    var heroCard = d.querySelector('#hero-form .tgd-card');
    this._raf = 0;
    // position-based state comes from geometry, not IntersectionObserver rootMargin, which is ignored
    // inside cross-origin iframes (the canvas, embeds)
    this._onScroll = function () {
      if (self._raf) return;
      self._raf = w.requestAnimationFrame(function () {
        self._raf = 0;
        var on = heroCard ? heroCard.getBoundingClientRect().bottom < 60 : true;
        var dark = false;
        Array.prototype.forEach.call(d.querySelectorAll('[data-tone="dark"]'), function (el) { var b = el.getBoundingClientRect(); if (b.top <= 42 && b.bottom >= 42) dark = true; });
        var st = self.state || {};
        if (on !== !!st.bar || dark !== !!st.barDark) self.setState({ bar: on, barDark: dark });
      });
    };
    w.addEventListener('scroll', this._onScroll, { passive: true });
    w.addEventListener('resize', this._onScroll);
    this._onScroll();
    // Enter in the first-name field moves on to email instead of submitting a half-filled form
    this._onKey = function (e) {
      if (e.key !== 'Enter' || e.isComposing) return;
      var t = e.target;
      if (!t || !t.id || !/-name$/.test(t.id)) return;
      var em = d.getElementById(t.id.replace(/-name$/, '-email'));
      if (em) { e.preventDefault(); em.focus(); }
    };
    d.addEventListener('keydown', this._onKey);
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
    document.removeEventListener('keydown', this._onKey);
    if (this._raf) window.cancelAnimationFrame(this._raf);
    if (this._fio) this._fio.disconnect();
    clearTimeout(this._sendT);
  }
  renderVals() {
    var self = this;
    var s = this.state || {};
    var sent = !!s.sent, errorAt = s.errorAt || '', sendingAt = s.sendingAt || '', suggestAt = s.suggestAt || '';
    var TYPOS = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gmail.cm': 'gmail.com', 'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmail.co': 'hotmail.com', 'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.co': 'yahoo.com', 'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com', 'outlook.co': 'outlook.com', 'iclod.com': 'icloud.com', 'icloud.co': 'icloud.com' };
    var isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
    var typoFix = function (v) { var m = /^([^@\s]+)@([^@\s]+)$/.exec(v); if (!m) return ''; var f = TYPOS[m[2].toLowerCase()]; return f ? m[1] + '@' + f : ''; };
    var msgFor = function (v) { return v ? 'That doesn’t look like an email yet — mind checking it?' : 'Pop your email in and I’ll send it right over.'; };
    var field = function (where, f) { return document.getElementById(where + '-' + (f || 'email')); };
    var reduce = function () { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); };
    // the bar, dock and in-page links send you to whichever form is nearest, not always back to the top
    var goForm = function (e) {
      if (e && e.preventDefault) e.preventDefault();
      var vh = window.innerHeight || 800, best = '', bestD = Infinity;
      ['hero', 'final'].forEach(function (k) {
        var box = document.getElementById(k + '-form');
        if (!box) return;
        var r = box.getBoundingClientRect();
        var dd = Math.abs((r.top + r.bottom) / 2 - vh / 2);
        if (dd < bestD) { bestD = dd; best = k; }
      });
      if (!best) return;
      document.getElementById(best + '-form').scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'center' });
      var fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
      var inp = field(best, 'name');
      if (fine && inp && !(self.state || {}).sent) setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (err) { inp.focus(); } }, 480);
    };
    var makeSubmit = function (where) {
      return function (e) {
        if (e && e.preventDefault) e.preventDefault();
        if ((self.state || {}).sendingAt) return;
        var el = field(where), nm = field(where, 'name');
        var v = ((el && el.value) || '').trim();
        var name = ((nm && nm.value) || '').trim().replace(/\s+/g, ' ').slice(0, 40);
        if (!isEmail(v)) { self.setState({ errorAt: where, errMsg: msgFor(v), suggestAt: '' }); if (el) el.focus(); return; }
        self.setState({ email: v, name: name, sendingAt: where, errorAt: '', suggestAt: '' });
        clearTimeout(self._sendT);
        // the real send: api/subscribe.js adds the contact in Resend and emails the guide
        TJE.subscribe({ email: v, name: name, source: TJE.page + ':' + where, form: e && e.target }).then(function () {
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
    var makeReset = function (where) {
      return function () {
        self.setState({ sent: false, errorAt: '', suggestAt: '' });
        setTimeout(function () {
          var st = self.state || {}, el = field(where), nm = field(where, 'name');
          if (nm) nm.value = st.name || '';
          if (el) { el.value = st.email || ''; el.focus(); el.select(); }
        }, 60);
      };
    };
    var first = (s.name || '').split(' ')[0];
    first = first ? first.charAt(0).toUpperCase() + first.slice(1) : '';
    // after sending, offer a one-tap jump into their inbox when we know the provider
    var INBOX = { 'gmail.com': ['Gmail', 'https://mail.google.com/mail/u/0/#inbox'], 'googlemail.com': ['Gmail', 'https://mail.google.com/mail/u/0/#inbox'], 'outlook.com': ['Outlook', 'https://outlook.live.com/mail/0/inbox'], 'hotmail.com': ['Outlook', 'https://outlook.live.com/mail/0/inbox'], 'live.com': ['Outlook', 'https://outlook.live.com/mail/0/inbox'], 'msn.com': ['Outlook', 'https://outlook.live.com/mail/0/inbox'], 'yahoo.com': ['Yahoo Mail', 'https://mail.yahoo.com/'], 'ymail.com': ['Yahoo Mail', 'https://mail.yahoo.com/'], 'icloud.com': ['iCloud Mail', 'https://www.icloud.com/mail'], 'me.com': ['iCloud Mail', 'https://www.icloud.com/mail'], 'mac.com': ['iCloud Mail', 'https://www.icloud.com/mail'], 'proton.me': ['Proton Mail', 'https://mail.proton.me/u/0/inbox'], 'protonmail.com': ['Proton Mail', 'https://mail.proton.me/u/0/inbox'], 'aol.com': ['AOL Mail', 'https://mail.aol.com/'] };
    var dom = ((s.email || '').split('@')[1] || '').toLowerCase();
    var inbox = INBOX[dom] || null;
    var out = {
      shadow: this.props.shadowTone ?? '#0e1a2c',
      motionClass: (this.props.intro ?? true) ? 'is-motion' : '',
      year: String(new Date().getFullYear()),
      // once a form is on screen (or the guide is sent) the bar keeps its place but drops its button
      barClass: (s.bar ? 'is-on' : '') + (s.barDark ? ' is-dark' : '') + ((s.formInView || sent) ? ' is-quiet' : ''),
      barLabel: sent ? 'On its way · check your inbox' : 'Free guide · What all gurus are failing to disclose',
      dockClass: (s.bar && !s.formInView && !sent) ? 'is-on' : '',
      successTitle: first ? 'It’s on its way, ' + first + '.' : 'It’s on its way.',
      finalLabelledBy: sent ? 'final-title-sent' : 'final-title',
      hasInbox: !!inbox,
      inboxName: inbox ? inbox[0] : '',
      inboxUrl: inbox ? inbox[1] : '#',
      inboxLabel: inbox ? 'Open ' + inbox[0] + ' in a new tab' : '',
      email: s.email || '',
      errMsg: s.errMsg || '',
      suggestion: s.suggestion || '',
      sent: sent,
      notSent: !sent,
      onEmail: function (e) { var st = self.state || {}; var v = e && e.target ? e.target.value : ''; var n = { email: v }; if (st.errorAt) n.errorAt = ''; if (st.suggestAt) n.suggestAt = ''; self.setState(n); },
      goForm: goForm
    };
    ['hero', 'final'].forEach(function (k) {
      var K = k.charAt(0).toUpperCase() + k.slice(1);
      out[k + 'Error'] = errorAt === k;
      out[k + 'Invalid'] = errorAt === k ? 'true' : 'false';
      out[k + 'InputClass'] = errorAt === k ? 'tje-input is-invalid' : 'tje-input';
      // the error, when there is one, is read out as part of the email field
      out[k + 'Desc'] = errorAt === k ? k + '-err ' + k + '-trust' : k + '-trust';
      out[k + 'Sending'] = sendingAt === k;
      out[k + 'Idle'] = sendingAt !== k;
      out[k + 'Busy'] = sendingAt === k ? 'true' : 'false';
      out[k + 'Suggest'] = suggestAt === k && !!s.suggestion;
      out['submit' + K] = makeSubmit(k);
      out['blur' + K] = makeBlur(k);
      out['fix' + K] = makeFix(k);
      out['reset' + K] = makeReset(k);
    });
    return out;
  }
}
TJE.mount(Component);
})();
