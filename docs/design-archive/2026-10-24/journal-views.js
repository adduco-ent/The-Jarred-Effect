  // ---- small helpers for long writing
  function wc(t) { return (String(t || '').match(/\S+/g) || []).length; }
  function wcLabel(n) { return n === 1 ? '1 word' : n.toLocaleString('en-US') + ' words'; }
  function oneLine(t) { return String(t || '').replace(/\s+/g, ' ').trim(); }
  // their paragraphs, kept as they wrote them: a blank line starts a new paragraph, a single return stays a line break
  function paras(t) { return String(t || '').trim().split(/\n\s*\n/).map(function (x) { return '<p>' + esc(x.trim()).replace(/\n/g, '<br>') + '</p>'; }).join(''); }
  function longDate(d) { return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }); }
  function modeName(m) { return { prompt: 'Today’s prompt', free: 'Free write', quick: 'Quick line', letter: 'Letter' }[m] || 'Free write'; }
  function jEntry() { return st.journal.filter(function (x) { return x.id === J.id; })[0]; }
  // words go where they belong: the entry being edited, or the draft. Saved as they type.
  function putWords(field, val) {
    if (J.view === 'edit') { var x = jEntry(); if (x) x[field] = val; }
    else draft()[field === 'body' ? 'text' : field] = val;
    save();
    if (field === 'body') { var c = root.querySelector('#jw-wc'); if (c) c.textContent = wcLabel(wc(val)); }
    var s = root.querySelector('#jw-st');
    if (s) { clearTimeout(s._t); s._t = setTimeout(function () { s.textContent = 'Saved'; s.classList.add('on'); clearTimeout(s._o); s._o = setTimeout(function () { s.classList.remove('on'); s.textContent = s.getAttribute('data-rest'); }, 1800); }, 600); }
  }
  function tagsFor(e) {
    var pin = (st.jmeta[e.id] || {}).pin;
    return (pin ? '<span class="je-tag">' + pinIcon + 'Pinned</span>' : '') + (isPersonal(e) ? '<span class="je-tag">' + lock + 'Personal</span>' : '');
  }

  function talkBtn() {
    var on = !!(talk && talk.on);
    return '<button type="button" class="jw-mic' + (on ? ' is-on' : '') + '" data-jtalk aria-pressed="' + on + '" aria-label="' + (on ? 'Stop talking' : 'Talk instead of type') + '">' +
      (on ? '<i class="jw-rec" aria-hidden="true"></i><span>Stop</span>' : micIcon + '<span>Talk</span>') + '</button>';
  }

  // ---- Journal home: what to write today, any draft in progress, then everything written, by week
  function jHome(p) {
    var d = draft(), all = allEntries(p), list = all.filter(passes);
    var hasDraft = !!((d.text || '').trim() || (d.title || '').trim());
    var draftCard = !hasDraft ? '' : '<section class="sc jd"><p class="pl-k">Your draft</p>' +
      (d.title ? '<p class="jd-t">' + esc(d.title) + '</p>' : '') + (d.text ? '<p class="jd-x">' + esc(oneLine(d.text)) + '</p>' : '') +
      '<p class="jd-m">' + esc(modeName(d.mode)) + ' · ' + wcLabel(wc(d.text)) + ' · kept as you write</p>' +
      (J.discard
        ? '<div class="je-del" role="alert"><p class="fb-q">Throw away this draft?</p><p class="pt-e">It can’t be brought back.</p><div class="je-del-r"><button type="button" class="je-del-b" data-jdiscard-yes>' + binIcon + 'Throw it away</button><button type="button" class="lnk" data-jdiscard-no>Keep it</button></div></div>'
        : '<div class="jd-r"><button type="button" class="pl-do" data-jgo="draft">' + editIcon + '<span>Keep writing</span></button><button type="button" class="lnk lnk--quiet" data-jdiscard>Throw away</button></div>') + '</section>';
    var start = '<section class="sc jstart"><p class="pl-k">Today’s prompt</p><p class="jw-q">' + esc(curPrompt()) + '</p>' +
      '<button type="button" class="lnk jnext" data-jnext>' + againIcon + 'Another one</button>' +
      '<button type="button" class="pl-do" data-jgo="prompt">' + editIcon + '<span>' + (hasDraft && d.mode === 'prompt' ? 'Keep writing' : 'Start writing') + '</span></button>' +
      '<div class="jways"><p class="fb-l">Or write your own way</p><div class="jways-r">' +
        [['free', 'Free write', penIcon], ['quick', 'Quick line', lineIcon], ['letter', 'Letter', letterIcon]].map(function (w) {
          return '<button type="button" class="jway" data-jgo="' + w[0] + '">' + w[2] + '<span>' + w[1] + '</span></button>';
        }).join('') + '</div></div></section>';
    return screenHead('Your words', 'Journal', 'A private place to write more, as long as you like. Everything you write in your plan gathers here too.') +
      (J.saved ? '<p class="nx-ok jw-ok" role="status">' + check + 'Saved to your journal.</p>' : '') + (J.warn ? safeCard() : '') +
      draftCard + start +
      (all.length
        ? '<section class="jt"><div class="pb-s"><input type="search" id="jq" class="fb-t" placeholder="Search your journal" aria-label="Search your journal" autocomplete="off" value="' + esc(J.q) + '"></div>' +
          '<div class="jf" role="group" aria-label="Show">' + FILTERS.map(function (f) { return '<button type="button" data-jf="' + f[0] + '" aria-pressed="' + (J.f === f[0]) + '">' + f[1] + '</button>'; }).join('') + '</div>' +
          (list.length ? timeline(list) : '<div class="pt-soon"><p class="pl-k">Nothing here yet</p><p class="pt-e">' + (J.f === 'plan' ? 'Your check-in notes and lines from each day show up here.' : 'What you write shows up here.') + '</p></div>') +
          '<p class="pt-e jt-none" id="jnone" hidden>Nothing matches. Try another word.</p></section>'
        : '<div class="pt-soon"><p class="pl-k">Your journal starts here</p><p class="pt-e">What you write shows up here, newest first. Your check-in notes and lines from each day gather here too.</p></div>') +
      '<section class="fs jp"><p class="pl-k">Private by default</p><p class="pl-text">Only you can read your journal. No one at The Jarred Effect does. For now, it’s saved on this device only.</p>' +
        (J.wipe ? '<div class="je-del" role="alert"><p class="fb-q">Delete everything you’ve written here?</p><p class="pt-e">Your journal entries are deleted for good. Notes in your plan stay where they are.</p>' +
            '<div class="je-del-r"><button type="button" class="je-del-b" data-jwipe-yes>' + binIcon + 'Delete everything</button><button type="button" class="lnk" data-jwipe-no>Keep it</button></div></div>'
          : st.journal.length ? '<button type="button" class="lnk lnk--quiet" data-jwipe>Delete everything you’ve written here</button>' : '') + '</section>';
  }

  // ---- the writer: its own page, a sheet of paper that grows with them, saved as they type
  function jWriter() {
    var editing = J.view === 'edit', e = editing ? jEntry() : null;
    if (editing && !e) return jGone();
    var d = draft(), m = editing ? e.kind : d.mode, L = letters(), li = Math.min(d.to || 0, L.length - 1);
    var backTo = editing ? '' : J.from || 'journal';
    var bar = '<div class="jw-bar">' +
      (editing ? '<button type="button" class="pb-back jw-back" data-jdone><span aria-hidden="true">‹</span>Back</button>'
        : '<a class="pb-back jw-back" href="#' + backTo + '"><span aria-hidden="true">‹</span>' + cap(backTo) + '</a>') +
      '<div class="jw-acts">' + (SR ? talkBtn() : '') +
        (editing ? '<button type="button" class="send-btn" data-jdone>Done</button>' : '<button type="button" class="send-btn" data-jsave>Save</button>') + '</div></div>';
    var head;
    if (editing) head = '<p class="pl-k">' + esc(kindLabel(e)) + ' · ' + esc(shortDate(new Date(e.at))) + '</p>' + (e.prompt ? '<h1 class="jw-q">' + esc(e.prompt) + '</h1>' : '<h1 class="sr">Edit your entry</h1>');
    else if (m === 'prompt') head = '<p class="pl-k">Today’s prompt</p><h1 class="jw-q">' + esc(curPrompt()) + '</h1><button type="button" class="lnk jnext" data-jnext>' + againIcon + 'Another one</button>';
    else if (m === 'letter') head = '<p class="pl-k">A letter you won’t send</p><h1 class="jw-q">' + esc(L[li].prompt) + '</h1><p class="fb-l">Who is it to?</p>' + chips('data-jto', 'jw', L.map(function (x, i) { return [String(i), x.to]; }), String(li), 'ci-o--to');
    else if (m === 'quick') head = '<p class="pl-k">Quick line</p><h1 class="jw-q">One sentence on today.</h1><p class="fb-l">What kind of day is it?</p>' + chips('data-jday', 'jw', [['full', STEAM.full], ['half', STEAM.half], ['rough', STEAM.rough]], d.day != null ? d.day : todayCi());
    else head = '<p class="pl-k">Free write</p><h1 class="jw-q">Whatever’s on your mind. Any length.</h1>';
    var title = editing ? e.title : d.title, body = editing ? e.body : d.text;
    var withTitle = m === 'free' || m === 'prompt';
    var ph = m === 'quick' ? 'Just one line.' : m === 'letter' ? LETTER_HI[li] : 'Start with the first sentence that comes. Keep going as long as you like.';
    var rest = editing ? 'Changes save as you write' : 'Your draft saves as you write';
    var hint = talk && talk.note ? talk.note : SR ? '' : 'To talk instead of type, tap the mic on your keyboard.';
    return bar + '<header class="jw-head">' + head + '</header>' +
      '<div class="jw-paper">' + (withTitle ? '<input class="jw-title" id="jw-title" data-jw="title" type="text" maxlength="140" placeholder="Title (optional)" aria-label="Title, optional" autocomplete="off" value="' + esc(title || '') + '">' : '') +
        '<textarea class="jw-t' + (m === 'quick' ? ' is-quick' : '') + '" id="jw-t" data-jw="body" rows="' + (m === 'quick' ? 2 : 10) + '" aria-label="Your entry" placeholder="' + esc(ph) + '">' + esc(body || '') + '</textarea></div>' +
      '<p class="jw-foot"><span id="jw-wc">' + wcLabel(wc(body)) + '</span><span class="jw-st" id="jw-st" data-rest="' + esc(rest) + '">' + esc(rest) + '</span></p>' +
      (hint ? '<p class="pt-e jw-hint" role="status">' + esc(hint) + '</p>' : '');
  }

  // ---- one entry, on its own page: the whole thing, easy to read, then what they can do with it
  function jGone() { return '<a class="pb-back" href="#journal"><span aria-hidden="true">‹</span>Journal</a><div class="wait"><p><b>That entry isn’t here anymore.</b></p><a class="yu-link" href="#journal">Back to your journal<span aria-hidden="true">→</span></a></div>'; }
  function jRead() {
    var e = findEntry(J.id);
    if (!e) return jGone();
    var pin = (st.jmeta[e.id] || {}).pin, personal = isPersonal(e);
    var date = e.src ? dayDate(e.n) : new Date(e.at);
    var kick = e.src ? 'From your plan · Day ' + e.n : kindLabel(e) + ' · ' + clock(e.at);
    var h1 = e.src ? e.label : e.title || longDate(date);
    var sub = e.src || e.title ? longDate(date) : '';
    var body = J.edit && e.src
      ? '<section class="jw-paper jr-ed">' + words(e.kind, e.ref, e.field, 'In your words', 4) +
        '<p class="pt-e">This is the same note as on day ' + e.n + '. Changing it here changes it there too.</p>' +
        '<button type="button" class="send-btn" data-jedit-done>' + check + 'Done</button></section>'
      : '<article class="jw-paper jr-body">' + paras(e.body) + '</article>';
    var acts = J.del
      ? '<div class="je-del" role="alert"><p class="fb-q">Delete this entry?</p><p class="pt-e">' + (e.src ? 'It’s removed from day ' + e.n + ' too. ' : '') + 'This can’t be undone.</p>' +
        '<div class="je-del-r"><button type="button" class="je-del-b" data-jdel-yes>' + binIcon + 'Delete</button><button type="button" class="lnk" data-jdel-no>Keep it</button></div></div>'
      : '<div class="je-acts">' +
        '<button type="button" class="je-a" data-jedit>' + editIcon + 'Edit</button>' +
        '<button type="button" class="je-a" data-jpin aria-pressed="' + !!pin + '">' + pinIcon + (pin ? 'Unpin' : 'Pin') + '</button>' +
        '<button type="button" class="je-a" data-jdel>' + binIcon + 'Delete</button>' +
        (e.src ? '<button type="button" class="je-a je-a--go" data-view-day="' + e.n + '">Day ' + e.n + '<span aria-hidden="true">→</span></button>' : '') + '</div>';
    return '<a class="pb-back" href="#journal"><span aria-hidden="true">‹</span>Journal</a>' +
      '<header class="td-head sc-head jr-head"><p class="pl-k">' + esc(kick) + '</p><h1 class="td-h jr-h">' + esc(h1) + '</h1>' + (sub ? '<p class="pl-note">' + esc(sub) + '</p>' : '') + '</header>' +
      (J.warn ? safeCard() : '') +
      (e.prompt ? '<p class="jr-p">' + esc(e.prompt) + '</p>' : '') + body +
      '<p class="jw-foot"><span>' + wcLabel(wc(e.body)) + '</span><span class="je-tags">' + tagsFor(e) + '</span></p>' +
      '<section class="sc jr-acts">' + acts +
        '<button type="button" class="je-sw" role="switch" aria-checked="' + personal + '" data-jpersonal><span class="je-sw-t"><b>Keep it personal</b>' +
          '<span>Just for you. It won’t shape your plans, steps or suggestions.</span></span><i class="je-sw-i" aria-hidden="true"></i></button></section>';
  }

  // ---- one entry in the list: a few lines of it, tap to read the whole thing
  function entryCard(e, ro) {
    var when = e.src ? 'Day ' + e.n + ' · ' + shortDate(dayDate(e.n)) : shortDate(new Date(e.at)) + ' · ' + clock(e.at);
    var n = wc(e.body);
    var text = (kindLabel(e) + ' ' + (e.title || '') + ' ' + e.prompt + ' ' + e.body).toLowerCase();
    var top = '<span class="je-top"><span class="je-d">' + esc(when) + '</span><span class="je-tags">' + (ro ? '' : tagsFor(e)) + '</span></span>' +
      '<span class="je-k">' + esc(kindLabel(e)) + '</span>' +
      (e.title ? '<span class="je-t">' + esc(e.title) + '</span>' : e.prompt ? '<span class="je-p">' + esc(e.prompt) + '</span>' : '');
    if (ro) return '<li data-jtext="' + esc(text) + '"><article class="je is-ro">' + top + '<div class="je-x je-x--all">' + paras(e.body) + '</div></article></li>';
    return '<li data-jtext="' + esc(text) + '"><a class="je' + (J.saved === e.id ? ' is-new' : '') + '" href="#journal/e/' + encodeURIComponent(e.id) + '">' + top +
      '<span class="je-x">' + esc(oneLine(e.body)) + '</span>' +
      '<span class="je-f"><span>' + (n >= 40 ? wcLabel(n) : '') + '</span><span class="je-go">Read<span aria-hidden="true">›</span></span></span></a></li>';
  }

  // ---- by week of their plan, newest first, with anything pinned on top
  function weekOf(ts) { return Math.max(1, Math.floor((ts - fromYmd(st.start).getTime()) / 6048e5) + 1); }
  function weekRange(w) {
    var a = dayDate((w - 1) * 7 + 1), b = dayDate(w * 7);
    var am = a.toLocaleDateString('en-US', { month: 'short' }), bm = b.toLocaleDateString('en-US', { month: 'short' });
    return am + ' ' + a.getDate() + ' – ' + (am === bm ? '' : bm + ' ') + b.getDate();
  }
  function timeline(list) {
    var pins = list.filter(function (e) { return (st.jmeta[e.id] || {}).pin; }).sort(function (a, b) { return st.jmeta[b.id].pin - st.jmeta[a.id].pin; });
    var rest = list.filter(function (e) { return !(st.jmeta[e.id] || {}).pin; }).sort(function (a, b) { return b.at - a.at; });
    var weeks = [], by = {};
    rest.forEach(function (e) { var w = weekOf(e.at); if (!by[w]) { by[w] = []; weeks.push(w); } by[w].push(e); });
    function group(title, sub, items) {
      return '<section class="jg" data-jg><p class="pl-k">' + esc(title) + (sub ? '<span>' + esc(sub) + '</span>' : '') + '</p><ul class="jl">' + items.map(function (e) { return entryCard(e); }).join('') + '</ul></section>';
    }
    return (pins.length ? group('Pinned', '', pins) : '') +
      weeks.map(function (w) { return group('Week ' + (WEEKS[w - 1] || w), weekRange(w), by[w]); }).join('');
  }
  // letters are found by searching "letter", so the row stays one line on a phone
  var FILTERS = [['all', 'All'], ['here', 'Written here'], ['plan', 'From your plan']];
  function passes(e) { return J.f === 'here' ? !e.src : J.f === 'plan' ? e.src : true; }
  // search hides what doesn't match, without redrawing the screen, so typing never jumps
  function jSearch() {
    var q = J.q.trim().toLowerCase(), any = false;
    root.querySelectorAll('[data-jtext]').forEach(function (li) { var hit = !q || li.getAttribute('data-jtext').indexOf(q) >= 0; li.hidden = !hit; if (hit) any = true; });
    root.querySelectorAll('[data-jg]').forEach(function (g) { g.hidden = !g.querySelector('[data-jtext]:not([hidden])'); });
    var none = root.querySelector('#jnone'); if (none) none.hidden = any || !root.querySelector('[data-jtext]');
  }

  function journalView(p) {
    if (!paid()) {
      var g = gathered(p).sort(function (a, b) { return b.at - a.at; });
      return screenHead('Your words', 'Journal', 'Everything you write in your plan, kept in one place.') +
        '<section class="fs fs--top"><p class="pl-k">Your words so far</p>' +
          (g.length ? '<ul class="jl">' + g.map(function (e) { return entryCard(e, true); }).join('') + '</ul>'
            : '<div class="pt-soon"><p class="pl-k">Nothing here yet</p><p class="pt-e">As you check in and write a line each day, your words gather here.</p></div>') + '</section>' +
        fullApp('Write as much as you want', [
          ['Write more', 'A page that grows with you: a prompt for your day, a blank page, a quick line or a letter you won’t send.'],
          ['Talk instead of type', 'Tap the mic and your words appear as you speak.'],
          ['Find it again', 'Search, pins, and everything sorted by week.'],
          ['Private by default', 'Only you can read it. Keep any entry just for you.']
        ]);
    }
    return J.view === 'write' || J.view === 'edit' ? jWriter() : J.view === 'read' ? jRead() : jHome(p);
  }

