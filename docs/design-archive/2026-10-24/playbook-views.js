  // ---- Playbook: the library. Free: their own plays open in full, the rest locked. Full app: everything.
  // Home: their plays as cards (which Ask each is for), the paths as one card of rows that open, then every play as a list.
  var chev = '<span class="pb-chev" aria-hidden="true">›</span>';
  function askFor(id) { var n = -1; plan.asks.forEach(function (a, i) { if (n < 0 && a.protocol === id) n = i; }); return n; }
  function forAsk(i) { return i >= 0 && plan.asks[i] ? '<span class="pb-for"><i>' + (i + 1) + '</i><span>' + esc(end(plan.asks[i].text)) + '</span></span>' : ''; }
  function mineCard(x) {
    return '<a class="pb-mine" href="#playbook/' + esc(x.id) + '">' + forAsk(askFor(x.id)) +
      '<span class="pb-mn">' + esc(x.name) + '</span><span class="pb-mw">' + esc(x.when) + '</span>' +
      '<span class="pb-mf"><span>' + (x.steps && x.steps.length ? x.steps.length + ' steps' : '') + '</span><span class="pb-mgo">Read the play' + chev + '</span></span></a>';
  }
  function playRow(x, isMine, locked) {
    var inner = '<span class="pb-rt"><span class="pb-rn">' + esc(x.name) + '</span><span class="pb-rw">' + esc(x.when) + '</span></span>' +
      (isMine ? '<span class="pb-badge" aria-label="In your plan">' + check + '</span>' : '') + (locked ? '<span class="pb-lk">' + lock + '</span>' : chev);
    return locked ? '<li><span class="pb-r is-locked">' + inner + '</span></li>'
      : '<li><a class="pb-r" href="#playbook/' + esc(x.id) + '" data-pb-name="' + esc((x.name + ' ' + x.when).toLowerCase()) + '">' + inner + '</a></li>';
  }
  function pathCard(byId) {
    return '<ul class="pb-card">' + lib.pathways.map(function (w, k) {
      return '<li><details class="pw" data-l="pw-' + k + '"><summary><span class="pw-t"><span class="pw-n">' + esc(w.name) + '</span><span class="pw-f">' + esc(w.for) + '</span></span><i aria-hidden="true"></i></summary>' +
        '<ol class="pw-s">' + w.path.map(function (pid, i) {
          var x = byId[pid];
          return x ? '<li><a href="#playbook/' + esc(pid) + '"><b>' + (i + 1) + '</b><span>' + esc(x.name) + '</span>' + chev + '</a></li>' : '';
        }).join('') + '</ol></details></li>';
    }).join('') + '</ul>';
  }
  function playbookView(p) {
    needLib();
    if (pbId) return protocolView(p, pbId);
    var head = screenHead('The method', 'Playbook', 'Every play behind your plan, in plain words.');
    if (!lib) return head + waiting('Opening the library…');
    var my = mine(p), byId = {};
    lib.protocols.forEach(function (x) { byId[x.id] = x; });
    var mineCards = my.map(function (id) { return byId[id]; }).filter(Boolean).map(mineCard).join('');
    var mineSec = mineCards ? '<section class="fs fs--top" data-pb-hide><p class="pl-k">In your plan</p><div class="pb-mines">' + mineCards + '</div>' +
      (paid() ? '' : '<p class="pb-x">Free with your plan. Tap one to read it in full.</p>') + '</section>' : '';
    if (!paid()) {
      var rest = lib.protocols.filter(function (x) { return my.indexOf(x.id) < 0; });
      return head + mineSec +
        '<section class="lk"><p class="lk-k">' + lock + 'With the full app</p><h2 class="lk-t">All ' + lib.protocols.length + ' plays</h2>' +
          '<p class="lk-x">From building a habit to keeping your power. Read any of it, any time, and pull steps into your week.</p>' +
          '<div class="lk-peek" aria-hidden="true"><ul class="pb-card pb-card--peek">' + rest.slice(0, 4).map(function (x) { return playRow(x, false, true); }).join('') + '</ul>' +
          (rest.length > 4 ? '<p class="lk-more">and ' + (rest.length - 4) + ' more</p>' : '') + '</div>' +
          unlock('the playbook') + '</section>';
    }
    return head +
      '<div class="pb-s"><input type="search" id="pb-q" class="fb-t" placeholder="Search the playbook" aria-label="Search the playbook" autocomplete="off"></div>' +
      mineSec +
      '<section class="fs" data-pb-hide><p class="pl-k">Start here</p><p class="pb-x pb-x--top">Plays that work best in order, by what you’re stuck on.</p>' + pathCard(byId) + '</section>' +
      '<section class="fs"><p class="pl-k pb-k">All plays<span>' + lib.protocols.length + '</span></p><ul class="pb-card" id="pb-all">' +
        lib.protocols.map(function (x) { return playRow(x, my.indexOf(x.id) >= 0); }).join('') + '</ul>' +
        '<p class="pt-e pb-none" id="pb-none" hidden>Nothing matches. Try another word.</p></section>';
  }

  // ---- one play: what it's for, their own steps from it, how it works, then how it goes and where next
  function protocolView(p, id) {
    var back = '<a class="pb-back" href="#playbook"><span aria-hidden="true">‹</span>Playbook</a>';
    if (!lib) return back + waiting('Opening this play…');
    var x = lib.protocols.filter(function (y) { return y.id === id; })[0];
    if (!x) return back + '<div class="wait"><p><b>That one isn’t in the playbook.</b></p><a class="yu-link" href="#playbook">Back to the playbook<span aria-hidden="true">→</span></a></div>';
    var isMine = mine(p).indexOf(id) >= 0, open = paid() || isMine, ai = askFor(id);
    var html = back + '<header class="td-head sc-head pb-head"><p class="pl-k">' + (isMine ? 'In your plan' : 'Play') + '</p><h1 class="td-h pb-h">' + esc(x.name) + '</h1>' +
      (isMine ? forAsk(ai) : '') + '</header><p class="pb-when">' + esc(x.when) + '</p>';
    if (!open) return html + fullApp('Read this play in full', [['The whole method', 'How it works, step by step.'], ['Signs it fits, and signs it’s working', 'So you know where you are.'], ['Where to go next', 'The plays that follow it.']]);
    var byId = {}; lib.protocols.forEach(function (y) { byId[y.id] = y; });
    function lst(a) { return '<ul class="pt-l">' + a.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>'; }
    // their own steps this week that come from this play
    var yours = [];
    if (isMine) p.days.forEach(function (d) { if (d.kind === 'step') d.steps.forEach(function (s) { if (p.asks[s.ask] && p.asks[s.ask].protocol === id) yours.push([d, s]); }); });
    var stops = [['Start', x.start], ['Then', x.deeper], ['When it’s done', x.done]].filter(function (s) { return s[1]; });
    return html +
      (yours.length ? '<section class="sc pb-yours"><p class="pl-k">Your steps from this play</p><ul class="pb-ys">' + yours.map(function (y) {
        var d = y[0], s = y[1], ok = !!done[key(d, s)];
        return '<li><button type="button" class="pb-y' + (ok ? ' is-done' : '') + '" data-view-day="' + d.day + '"><span class="pb-yd">' + (ok ? check : d.day) + '</span>' +
          '<span class="pb-yt"><small>Day ' + d.day + ' · ' + esc(weekday(d.day)) + (ok ? ' · Done' : '') + '</small>' + esc(s.title) + '</span>' + chev + '</button></li>';
      }).join('') + '</ul></section>' : '') +
      '<section class="sc"><p class="pl-k">How it works</p><ol class="pb-steps">' + x.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></section>' +
      (x.lens ? '<section class="sc pb-lens"><div><p class="pl-k">If you see it as energy</p><p class="pl-text">' + esc(x.lens.energy) + '</p></div><div><p class="pl-k">If you see it as psychology</p><p class="pl-text">' + esc(x.lens.mind) + '</p></div></section>' : '') +
      (x.signals.length ? '<section class="fs fs--tight"><p class="pl-k">Signs it fits you</p>' + lst(x.signals) + '</section>' : '') +
      (stops.length ? '<section class="sc pb-how"><p class="pl-k">How it goes</p><ol class="pb-tl">' + stops.map(function (s) { return '<li><b>' + s[0] + '</b><p>' + esc(s[1]) + '</p></li>'; }).join('') + '</ol></section>' : '') +
      (x.working.length ? '<section class="fs fs--tight"><p class="pl-k">Signs it’s working</p>' + lst(x.working) + '</section>' : '') +
      (x.safety ? '<section class="pb-safe"><p class="pl-k">Take care</p><p class="pl-text">' + esc(x.safety) + '</p></section>' : '') +
      (x.next.length ? '<section class="fs"><p class="pl-k">Where to go next</p><ul class="pb-card">' + x.next.map(function (n) { var y = byId[n]; return y ? playRow(y, mine(p).indexOf(n) >= 0) : ''; }).join('') + '</ul></section>' : '');
  }

