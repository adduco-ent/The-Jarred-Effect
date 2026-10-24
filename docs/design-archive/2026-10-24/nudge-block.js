  // ---- on their phone: Add to Home Screen, and a daily nudge at the time they usually show up.
  // Push where the phone allows it (Android, or iPhone once it's on the Home Screen); a calendar reminder otherwise.
  // The nudge is skipped on any day they've already done their step (the server is told when they mark one done).
  var IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var TOUCH = !!(window.matchMedia && matchMedia('(pointer:coarse)').matches);
  function standalone() { return !!((window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true); }
  var installEvt = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; if (plan && tab === 'you') render(); });
  window.addEventListener('appinstalled', function () { installEvt = null; if (plan) render(); });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/app/sw.js', { scope: '/app/' }).catch(function () { /* no offline copy; the app still works */ });

  var bellIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3.25a4.25 4.25 0 00-4.25 4.25v2.6c0 .6-.2 1.2-.57 1.67L4.25 13h11.5l-.93-1.23a2.75 2.75 0 01-.57-1.67V7.5A4.25 4.25 0 0010 3.25zM8.25 15.5a1.75 1.75 0 003.5 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var shareIcon = '<svg class="nd-share" viewBox="0 0 20 20" fill="none" aria-label="the Share button"><path d="M10 12.5V3M6.75 6.25L10 3l3.25 3.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.75 8.75h-1A1.75 1.75 0 004 10.5v5.25c0 .97.78 1.75 1.75 1.75h8.5c.97 0 1.75-.78 1.75-1.75V10.5c0-.97-.78-1.75-1.75-1.75h-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var calIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3.25" y="4.5" width="13.5" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 8.25h13M7 3v3M13 3v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var homeIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3.25" y="3.25" width="13.5" height="13.5" rx="3.25" stroke="currentColor" stroke-width="1.5"/><path d="M10 7v6M7 10h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  // what to show after a tap: 'home' (iPhone in Safari), 'calendar', 'denied', 'cal-again' (new time), 'cal-off'
  var ND = { show: null, where: null, busy: false, just: false };
  function pad2(n) { return ('0' + n).slice(-2); }
  // the time they usually show up: the middle of the times they've marked steps done, to the nearest half hour
  function usualTime() {
    var mins = Object.keys(st.at).map(function (k) { var d = new Date(st.at[k]); return d.getHours() * 60 + d.getMinutes(); }).sort(function (a, b) { return a - b; });
    if (!mins.length) return '19:00';
    var m = Math.min(1410, Math.round(mins[Math.floor(mins.length / 2)] / 30) * 30);
    return pad2(Math.floor(m / 60)) + ':' + pad2(m % 60);
  }
  function nudgeTime() { var t = st.nudge && st.nudge.time; return /^\d{2}:\d{2}$/.test(t || '') ? t : usualTime(); }
  function timeLabel(t) { var h = +t.slice(0, 2), m = t.slice(3); return (h % 12 || 12) + (m === '00' ? '' : ':' + m) + (h < 12 ? ' a.m.' : ' p.m.'); }
  function partOfDay(t) { var h = +t.slice(0, 2); return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'; }
  function tzName() { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } }
  function canPush() { return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window; }
  function nudgePost(data) {
    if (!id) return Promise.resolve(false);
    return fetch('/api/nudge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true, body: JSON.stringify(Object.assign({ plan: id }, data)) })
      .then(function (r) { return r.ok; }).catch(function () { return false; });
  }
  function keyBytes(b64) {
    var s = (b64 + '='.repeat((4 - b64.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/'), raw = atob(s), out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }
  // the calendar version: daily at their time, from the next one, through the end of a free week (no end on the full app)
  function calUrl() {
    var t = nudgeTime(), now = new Date(), from = new Date(), late = now.getHours() * 60 + now.getMinutes() >= +t.slice(0, 2) * 60 + +t.slice(3);
    if (late) from.setDate(from.getDate() + 1);
    var first = Math.min(T, 8) + (late ? 1 : 0), days = paid() ? 0 : Math.max(1, 8 - first);
    return '/api/nudge?ics=1&time=' + t + '&from=' + ymd(from) + '&days=' + days + (id ? '&plan=' + encodeURIComponent(id) : '');
  }

  function nudgeOn(where) {
    ND.where = where; ND.show = null; ND.just = false;
    var t = nudgeTime();
    // review on localhost: show the "on" state; nothing is sent
    if (REVIEW && !id) { st.nudge = { on: true, time: t, via: 'push' }; save(); ND.just = true; render(); return; }
    if (!canPush()) { ND.show = IOS && !standalone() ? 'home' : 'calendar'; render(); return; }
    ND.busy = true;
    var ask = Notification.requestPermission(); // straight from the tap, so the phone shows its own prompt
    render();
    Promise.resolve(ask).then(function (perm) {
      if (perm !== 'granted') throw new Error('denied');
      return fetch('/api/nudge').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    }).then(function (d) {
      if (!d || !d.publicKey) throw new Error('calendar');
      return navigator.serviceWorker.ready.then(function (reg) {
        return reg.pushManager.getSubscription().then(function (s) { return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(d.publicKey) }); });
      });
    }).then(function (sub) {
      return nudgePost({ action: 'on', sub: sub.toJSON(), time: t, tz: tzName(), start: st.start, tier: paid() ? 'paid' : 'free' })
        .then(function (ok) { if (!ok) throw new Error('calendar'); return sub; });
    }).then(function (sub) {
      st.nudge = { on: true, time: t, via: 'push', endpoint: sub.endpoint }; save(); ND.busy = false; ND.just = true; render();
    }).catch(function (e) {
      ND.busy = false; ND.show = e && e.message === 'denied' ? 'denied' : 'calendar'; render();
    });
  }
  function nudgeOff(where) {
    var n = st.nudge || {};
    ND.where = where; ND.just = false; ND.show = n.via === 'calendar' ? 'cal-off' : null;
    if (n.via === 'push' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration('/app/').then(function (reg) { return reg && reg.pushManager.getSubscription(); })
        .then(function (s) { if (s) { nudgePost({ action: 'off', endpoint: s.endpoint }); s.unsubscribe(); } }).catch(function () { /* nothing to remove */ });
    }
    st.nudge = { on: false, time: n.time, dismissed: true }; save(); render();
  }
  function nudgeSetTime(v) {
    if (!/^\d{2}:\d{2}$/.test(v)) return;
    var n = st.nudge = Object.assign({}, st.nudge, { time: v }); save();
    if (n.on && n.via === 'push') nudgePost({ action: 'time', time: v, tz: tzName() });
    ND.just = false; ND.show = n.on && n.via === 'calendar' ? 'cal-again' : ND.show === 'calendar' || ND.show === 'home' ? ND.show : null;
    render();
  }
  // a step done today: tell the server, so today's nudge is skipped
  function nudgeDone(day) {
    var n = st.nudge || {}, today = ymd(new Date());
    if (!n.on || n.via !== 'push' || day !== T || n.lastDone === today) return;
    n.lastDone = today; save(); nudgePost({ action: 'done', date: today });
  }

  function homeSteps(forNudges) {
    return '<ol class="nd-steps"><li>In Safari, tap <b>Share</b> ' + shareIcon + '. On newer iPhones it’s under <b>•••</b>.</li>' +
      '<li>Tap <b>Add to Home Screen</b>, then <b>Add</b>.</li>' +
      '<li>Open Other Half from your Home Screen' + (forNudges ? ' and turn nudges on in You.' : '.') + '</li></ol>';
  }
  function nudgeHelp(where) {
    if (ND.where !== where || !ND.show) return '';
    var cal = '<a class="pl-do nd-cal" href="' + esc(calUrl()) + '" data-nd-cal>' + calIcon + '<span>Add it to my calendar</span></a>';
    var t = timeLabel(nudgeTime());
    if (ND.show === 'cal-off') return '<div class="nd-help" role="status"><p class="pt-e">To stop the reminder, delete “Your Other Half step” in your calendar.</p></div>';
    if (ND.show === 'cal-again') return '<div class="nd-help"><p class="fb-q">Move your reminder to ' + t + '</p><p class="pt-e">Add the new time, then delete the old “Your Other Half step” in your calendar.</p>' + cal + '</div>';
    if (ND.show === 'home') return '<div class="nd-help"><p class="fb-q">On iPhone, nudges come from the app on your Home Screen.</p>' + homeSteps(true) +
      '<p class="pt-e nd-or">Or let your calendar do the nudging instead.</p>' + cal + '</div>';
    if (ND.show === 'denied') return '<div class="nd-help"><p class="fb-q">Notifications are off for this app.</p><p class="pt-e">Turn them on in your phone’s Settings and try again, or let your calendar do the nudging.</p>' + cal + '</div>';
    return '<div class="nd-help"><p class="fb-q">Your calendar can do the nudging.</p><p class="pt-e">One reminder a day at ' + t + (paid() ? '' : ', through the end of your week') + '. Your calendar opens to add it.</p>' + cal + '</div>';
  }
  function timeField(where) {
    return '<label class="nd-t"><span>' + bellIcon + 'At</span><input type="time" class="nd-time" data-nd-time value="' + nudgeTime() + '" aria-label="Nudge time"></label>';
  }
  // You → Settings: the switch, the time, and what happens next
  function nudgeRow() {
    if (!paid() && T > 7) return '';
    var n = st.nudge || {}, on = !!n.on, t = nudgeTime();
    var sub = on ? (n.via === 'calendar' ? 'In your calendar at ' : 'On this phone at ') + timeLabel(t) + '. Skipped on days you’ve already done your step.'
      : 'One gentle reminder a day. Skipped on days you’ve already done your step.';
    var usual = !on && Object.keys(st.at).length ? '<p class="pt-e">You usually show up in the ' + partOfDay(usualTime()) + ', around ' + timeLabel(usualTime()) + '.</p>' : '';
    return '<div class="set-r nd">' +
      '<button type="button" class="je-sw" role="switch" aria-checked="' + on + '" data-nd-toggle' + (ND.busy ? ' aria-busy="true"' : '') + '><span class="je-sw-t"><b>A daily nudge</b><span>' + esc(sub) + '</span></span><i class="je-sw-i" aria-hidden="true"></i></button>' +
      timeField('you') + usual + nudgeHelp('you') +
      (ND.just && ND.where === 'you' ? '<p class="nx-ok" role="status">' + check + 'Nudges are on for ' + timeLabel(t) + '.</p>' : '') + '</div>';
  }
  // Today, once, after a step on days 1 to 3: the moment a reminder helps most
  function nudgeOffer() {
    var n = st.nudge || {};
    if (ND.just && ND.where === 'today') return '<section class="sc nd-offer"><p class="nx-ok" role="status">' + check + 'Nudges are on for ' + timeLabel(nudgeTime()) + '. Change it any time in You.</p></section>';
    if (n.on || n.dismissed || sel !== T || T > 3) return '';
    var t = nudgeTime(), seen = Object.keys(st.at).length > 0;
    return '<section class="sc nd-offer" id="j-nudge"><p class="pl-k">A daily nudge</p><h2 class="lk-t">Want a nudge tomorrow?</h2>' +
      '<p class="pl-text">' + (seen ? 'You showed up in the ' + partOfDay(usualTime()) + ' today. A gentle reminder around then keeps it easy.' : 'A gentle reminder each day keeps it easy.') +
      ' It’s skipped on any day you’ve already done your step.</p>' + timeField('today') +
      (ND.where === 'today' && ND.show ? nudgeHelp('today') + '<button type="button" class="lnk nd-no" data-nd-no>Not now</button>'
        : '<button type="button" class="pl-do" data-nd-on="today"' + (ND.busy ? ' aria-busy="true"' : '') + '>' + bellIcon + '<span>' + (ND.busy ? 'One moment…' : 'Turn on nudges') + '</span></button><button type="button" class="lnk nd-no" data-nd-no>No thanks</button>') + '</section>';
  }
  // You: put the app on the Home Screen (nothing to show on a computer that can't install it)
  function installCard() {
    if (standalone() || (!installEvt && !IOS && !TOUCH)) return '';
    return '<section class="sc in-card"><p class="pl-k">On your phone</p><h2 class="lk-t">Put Other Half on your Home Screen</h2>' +
      '<p class="pl-text">One tap to open, full screen, like any app.' + (IOS ? ' On iPhone, daily nudges need it too.' : '') + '</p>' +
      (installEvt ? '<button type="button" class="pl-do" data-install>' + homeIcon + '<span>Add to Home Screen</span></button>'
        : IOS ? homeSteps(false) : '<p class="pt-e">Open your browser’s menu and choose <b>Add to Home Screen</b> or <b>Install app</b>.</p>') + '</section>';
  }

