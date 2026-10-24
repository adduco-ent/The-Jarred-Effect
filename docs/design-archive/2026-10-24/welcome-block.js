  // ---- the welcome: a breather before the day. Once a day, the first time the app opens: a sky that follows the time
  // of day, a greeting, a line for the day, a quote, and one warm question. The answer is the day's check-in.
  // Review: ?welcome=1 shows it again, ?sky=morning|afternoon|evening|night picks the sky.
  var welcomeSeen = false;
  function welcomeKey() { return ymd(new Date()) + ':' + T; }
  function needWelcome() {
    if (!plan || tab !== 'today' || T > 7 || welcomeSeen) return false;
    if (REVIEW && params.get('welcome') === '1') return true;
    return st.welcomed !== welcomeKey();
  }
  function skyPart() {
    var forced = REVIEW && params.get('sky');
    if (/^(morning|afternoon|evening|night)$/.test(forced || '')) return forced;
    var h = new Date().getHours();
    return h < 5 ? 'night' : h < 11 ? 'morning' : h < 17 ? 'afternoon' : h < 21 ? 'evening' : 'night';
  }
  var wxIcons = {
    full: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="5.5" stroke="currentColor" stroke-width="1.8"/><path d="M16 4.5v3M16 24.5v3M4.5 16h3M24.5 16h3M7.9 7.9l2.1 2.1M22 22l2.1 2.1M7.9 24.1L10 22M22 10l2.1-2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    half: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 3.5v2M3.5 12h2M6 6l1.4 1.4M18 6l-1.4 1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M11 25.5h12.5a4.5 4.5 0 00.3-9 6 6 0 00-11.5 1.6A3.75 3.75 0 0011 25.5z" fill="var(--wx-fill,#fff)" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    rough: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M9.5 20h14a4.75 4.75 0 00.3-9.5 6.25 6.25 0 00-12 1.75A3.9 3.9 0 009.5 20z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 23.5l-1.25 3M17 23.5l-1.25 3M22 23.5l-1.25 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };
  function welcomeView(p) {
    var w = cheer().welcome || {}, part = skyPart(), d = p.days[T - 1] || p.days[0];
    var many = d.kind === 'step' && d.steps.length > 1, ci = st.checkin[T];
    var hello = { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening', night: 'Good evening' }[part] + (p.name ? ', ' + p.name : '') + '.';
    var quotes = w.quotes || [], qt = quotes.length ? quotes[(T - 1) % quotes.length] : null;
    var ask = (w.ask || 'How’s today treating you?').replace(/\?$/, (p.name ? ', ' + p.name : '') + '?');
    var reply = ci && w.today ? w.today[ci === 'half' && many ? 'halfMany' : ci] : '';
    var arrowIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return '<section class="wl wl--' + part + '" aria-labelledby="wl-ask">' +
      '<div class="wl-sky" aria-hidden="true"><i class="wl-glow"></i><i class="wl-sun"></i>' + (part === 'night' ? '<i class="wl-stars"></i>' : '') +
        '<i class="wl-cloud wl-c1"></i><i class="wl-cloud wl-c2"></i><i class="wl-cloud wl-c3"></i><i class="wl-hz"></i></div>' +
      '<div class="wl-in"><p class="wl-hi">' + esc(hello) + '</p>' +
        '<p class="wl-line">' + esc((w.days || [])[T - 1] || w.later || '') + '</p>' +
        (qt ? '<figure class="wl-q"><blockquote>“' + esc(qt.q) + '”</blockquote><figcaption>' + esc(qt.by) + '</figcaption></figure>' : '') +
        '<h1 class="wl-ask" id="wl-ask">' + esc(ask) + '</h1>' +
        '<div class="wl-o" role="radiogroup" aria-labelledby="wl-ask">' + [['full', STEAM.full], ['half', STEAM.half], ['rough', STEAM.rough]].map(function (o) {
          return '<button type="button" role="radio" aria-checked="' + (ci === o[0]) + '" data-wl="' + o[0] + '">' + wxIcons[o[0]] + '<span>' + o[1] + '</span></button>';
        }).join('') + '</div>' +
        '<p class="wl-reply" role="status">' + esc(reply) + '</p>' +
        '<button type="button" class="pl-do wl-go" data-wl-go' + (ci ? '' : ' disabled') + '><span>' + esc(w.go || 'Let’s go') + '</span>' + arrowIcon + '</button>' +
        '<button type="button" class="lnk wl-skip" data-wl-skip>Straight to today</button></div></section>';
  }
  function leaveWelcome() {
    st.welcomed = welcomeKey(); welcomeSeen = true; save(); sel = T; render(); window.scrollTo(0, 0);
  }

