  // ---- Journal (full app): a private place to write more. Their own entries, plus everything they've written in the
  // plan, gathered in. Kept on this device until sign-in exists, and never sent as feedback: no one reads it but them.
  var J = { open: null, edit: null, del: null, saved: null, warn: false, wipe: false, f: 'all', q: '', focus: false };
  var MODES = [['prompt', 'Today’s prompt'], ['free', 'Free write'], ['quick', 'Quick line'], ['letter', 'Letter']];
  var LETTERS = [
    { to: 'Future you', prompt: 'Write to yourself a year from now. What do you hope is true?' },
    { to: 'Past you', prompt: 'What do you wish you’d known back then?' },
    { to: 'Someone you’re carrying', prompt: 'Say what happened, how it felt, and what you’re putting down. You won’t send it.' }
  ];
  var LETTER_HI = ['Dear future me,', 'Dear younger me,', 'Say it plainly. No one else will read it.'];
  var WEEKS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  var micIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="7.25" y="2.75" width="5.5" height="9" rx="2.75" stroke="currentColor" stroke-width="1.6"/><path d="M4.75 9.5a5.25 5.25 0 0010.5 0M10 14.75v2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var pinIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7.5 3.25h5l-.75 4.5 2.5 2.5v1.25h-8.5v-1.25l2.5-2.5-.75-4.5zM10 11.5v5.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var editIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16l.75-3.25 8.5-8.5a1.6 1.6 0 012.25 0l.25.25a1.6 1.6 0 010 2.25l-8.5 8.5L4 16z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  var binIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4.5 6h11M8 6V4.5h4V6M6 6l.6 9.25c.05.7.6 1.25 1.3 1.25h4.2c.7 0 1.25-.55 1.3-1.25L14 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var againIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M15.25 8.25A5.5 5.5 0 005.1 6.9M4.75 11.75A5.5 5.5 0 0014.9 13.1M5 3.75v3.5h3.5M15 16.25v-3.5h-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function jx() { return (plan && plan.journal) || {}; }
  function draft() { var d = st.jdraft; if (!d.mode) d.mode = 'prompt'; return d; }
  function letters() { return jx().letters || LETTERS; }
  function todayCi() { return st.checkin[Math.min(T, 7)]; }
  // today's prompt: the kind of day first, then the plays they're on, then the general set
  function prompts() {
    var j = jx(), ci = todayCi();
    var list = uniq([].concat((ci && j.day && j.day[ci]) || [], j.plays || [], j.general || []));
    return list.length ? list : ['What’s on your mind right now? Start with the first sentence that comes.'];
  }
  function curPrompt() { var d = draft(), l = prompts(); return d.ask || l[(d.pi || 0) % l.length]; }
  // in review, "now" is the day being looked at, so entries land on the right day
  function nowTs() {
    var n = new Date();
    if (!(REVIEW && params.get('day'))) return n.getTime();
    var d = dayDate(Math.min(T, 7)); d.setHours(n.getHours(), n.getMinutes(), n.getSeconds()); return d.getTime();
  }
  function shortDate(d) { return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
  function clock(ts) { return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase(); }

  // safety: if an entry suggests crisis or danger, gently show crisis resources. Never a diagnosis.
  var CRISIS = /\b(kill(ing)? myself|suicid\w*|end(ing)? (it all|my life)|take my (own )?life|want(ed)? to die|wish i (was|were) dead|better off (dead|without me)|don'?t want to (be here|live|wake up)|no reason to (live|go on)|can'?t go on|hurt(ing)? myself|self[- ]?harm\w*|cut(ting)? myself|overdos\w*|not safe at home|afraid for my life)\b/i;
  function risky(text) { return CRISIS.test(String(text || '').replace(/[’‘]/g, "'")); }
  function safeCard() {
    var s = jx().safety || {};
    return '<section class="pb-safe jsafe" role="alert"><p class="pl-k">Take care</p>' +
      '<h2 class="lk-t">' + esc(s.title || 'You don’t have to carry this alone') + '</h2>' +
      '<p class="pl-text">' + esc(s.text || 'If you’re thinking about hurting yourself, or you’re not safe right now, please reach out now. Call your local emergency number or a crisis line. In the US and Canada, you can call or text 988, any time.') + '</p>' +
      '<a class="yu-link" href="https://findahelpline.com" target="_blank" rel="noopener">' + esc(s.link || 'Find a crisis line where you are') + '<span aria-hidden="true">→</span></a>' +
      '<p class="pt-e">' + esc(s.note || 'Your words are saved. This app is for reflection, and it can’t replace real help.') + '</p></section>';
  }

  // everything they've written in the plan, gathered in. Editing it here edits it everywhere.
  function gathered(p) {
    var out = [];
    function add(id, n, label, prompt, kind, ref, field, body, order) {
      if (!body || !String(body).trim()) return;
      var at = dayDate(n); at.setHours(12, order || 0);
      out.push({ id: id, src: true, n: n, at: at.getTime(), label: label, prompt: prompt || '', kind: kind, ref: String(ref), field: field, body: String(body) });
    }
    p.days.forEach(function (d) {
      var n = d.day, ci = st.checkin[n];
      add('checkin.' + n, n, 'Your day ' + n + ' check-in', ci ? STEAM[ci] + ' day' : '', 'checkin', n, 'note', (fb.checkin[n] || {}).note, 1);
      if (d.kind === 'step') d.steps.forEach(function (s, i) {
        var k = key(d, s), sk = fb.skip[k] || {};
        add('step.' + k, n, 'How your step went, day ' + n, s.title, 'step', k, 'note', (fb.step[k] || {}).note, 10 + i);
        add('skip.' + k, n, (sk.action === 'change' ? 'Your version, day ' : 'Your gut call, day ') + n, s.title, 'skip', k, 'note', sk.note, 10 + i);
      });
      add('receipt.' + n, n, 'One line on day ' + n, '', 'receipt', n, 'text', (fb.receipt[n] || {}).text, 40);
      if (d.kind === 'question') add('note.' + n, n, 'The day ' + n + ' question', d.ask, 'note', n, 'text', (fb.note[n] || {}).text, 20);
      if (d.kind === 'lookback') {
        ['did', 'changed', 'keep'].forEach(function (f, i) { add('lookback.' + f, n, 'Your look back', d.prompts[i], 'lookback', '1', f, (fb.lookback['1'] || {})[f], 20 + i); });
        var nx = fb.next['1'] || {};
        (nx.asks || []).forEach(function (a, i) { if (a && p.asks[i]) add('next.' + i, n, 'Shape next week', end(p.asks[i].text), 'next', '1', 'ask.' + i, a.note, 30 + i); });
        add('next.want', n, 'Shape next week', 'Anything you want next week to have?', 'next', '1', 'want', nx.want, 35);
      }
    });
    return out;
  }
  function allEntries(p) { return st.journal.map(function (e) { return Object.assign({ src: false }, e); }).concat(gathered(p)); }
  function findEntry(eid) { return allEntries(plan).filter(function (e) { return e.id === eid; })[0]; }
  // Keep it personal: their own entries carry a flag; a plan note keeps a list of private fields, and those never leave the device
  function isPersonal(e) { return e.src ? ((fb[e.kind][e.ref] || {}).private || []).indexOf(e.field) >= 0 : !!(st.jmeta[e.id] || {}).personal; }
  function setPersonal(e, on) {
    if (!e.src) { setMeta(e.id, 'personal', on); return; }
    var o = fb[e.kind][e.ref] = fb[e.kind][e.ref] || {};
    var list = (o.private || []).filter(function (f) { return f !== e.field; });
    if (on) list.push(e.field);
    if (list.length) o.private = list; else delete o.private;
    sync(e.kind, e.ref, true);
  }
  function setMeta(eid, k, v) {
    var m = Object.assign({}, st.jmeta[eid]);
    if (v) m[k] = v; else delete m[k];
    if (Object.keys(m).length) st.jmeta[eid] = m; else delete st.jmeta[eid];
    save();
  }
  function removeEntry(e) {
    if (!e.src) { st.journal = st.journal.filter(function (x) { return x.id !== e.id; }); delete st.jmeta[e.id]; save(); return; }
    setPersonal(e, false);
    if (e.field.indexOf('ask.') === 0) { var i = +e.field.split('.')[1]; setNext(function (n) { n.asks[i] = Object.assign({}, n.asks[i], { note: '' }); }); }
    else { fb[e.kind][e.ref] = Object.assign({}, fb[e.kind][e.ref]); fb[e.kind][e.ref][e.field] = ''; sync(e.kind, e.ref, true); }
    delete st.jmeta[e.id]; save();
  }
  function kindLabel(e) {
    if (e.src) return e.label;
    if (e.kind === 'letter') return 'A letter to ' + (e.to || 'Future you').replace(/^\w/, function (c) { return c.toLowerCase(); });
    if (e.kind === 'quick') return 'Quick line' + (e.day ? ' · ' + STEAM[e.day] + ' day' : '');
    return e.kind === 'prompt' ? 'Today’s prompt' : 'Free write';
  }

  // ---- the writing card
  function talkBtn() {
    var on = !!(talk && talk.on);
    return '<button type="button" class="jw-mic' + (on ? ' is-on' : '') + '" data-jtalk aria-pressed="' + on + '">' +
      (on ? '<i class="jw-rec" aria-hidden="true"></i><span>Listening · Tap to stop</span>' : micIcon + '<span>Talk</span>') + '</button>';
  }
  function composer() {
    var d = draft(), m = d.mode, top = '', L = letters(), li = Math.min(d.to || 0, L.length - 1);
    if (m === 'prompt') top = '<div class="jw-p"><p class="jw-q">' + esc(curPrompt()) + '</p><button type="button" class="lnk" data-jnext>' + againIcon + 'Another one</button></div>';
    if (m === 'letter') top = '<p class="ci-q">Who is it to?</p>' + chips('data-jto', 'jw', L.map(function (x, i) { return [String(i), x.to]; }), String(li)) + '<p class="jw-q">' + esc(L[li].prompt) + '</p>';
    if (m === 'quick') top = '<p class="ci-q">What kind of day is it?</p>' + chips('data-jday', 'jw', [['full', STEAM.full], ['half', STEAM.half], ['rough', STEAM.rough]], d.day || todayCi());
    var ph = m === 'quick' ? 'One sentence on today.' : m === 'letter' ? LETTER_HI[li] : m === 'free' ? 'Whatever’s on your mind.' : 'Start with the first sentence that comes.';
    var hint = talk && talk.note ? talk.note : SR ? '' : 'To talk instead of type, tap the mic on your keyboard.';
    return '<section class="sc jw" id="j-write"><h2 class="sr">Write</h2>' + chips('data-jmode', 'jw', MODES, m, 'ci-o--4') +
      (top ? '<div class="jw-top">' + top + '</div>' : '') +
      '<div class="fbw"><textarea class="fb-t jw-t' + (m === 'quick' ? ' is-quick' : '') + '" id="jw-t" data-jw rows="' + (m === 'quick' ? 2 : 5) + '" aria-label="Your entry" placeholder="' + esc(ph) + '">' + esc(d.text || '') + '</textarea>' +
        '<span class="fb-s" aria-hidden="true">' + check + 'Draft saved</span></div>' +
      '<div class="jw-row">' + (SR ? talkBtn() : '<span></span>') + '<button type="button" class="send-btn" data-jsave>Save</button></div>' +
      (hint ? '<p class="pt-e jw-hint" role="status">' + esc(hint) + '</p>' : '') +
      (J.saved ? '<p class="nx-ok jw-ok" role="status">' + check + 'Saved to your journal.</p>' : '') + '</section>';
  }

  // ---- one entry: tap to open it, then pin, edit, keep it personal or delete
  function entryCard(e, ro) {
    var pin = (st.jmeta[e.id] || {}).pin, personal = isPersonal(e), open = !ro && J.open === e.id;
    var when = e.src ? 'Day ' + e.n + ' · ' + shortDate(dayDate(e.n)) : shortDate(new Date(e.at)) + ' · ' + clock(e.at);
    var inner = '<span class="je-top"><span class="je-d">' + esc(when) + '</span><span class="je-tags">' +
        (pin ? '<span class="je-tag">' + pinIcon + 'Pinned</span>' : '') + (personal ? '<span class="je-tag">' + lock + 'Personal</span>' : '') + '</span></span>' +
      '<span class="je-k">' + esc(kindLabel(e)) + '</span>' + (e.prompt ? '<span class="je-p">' + esc(e.prompt) + '</span>' : '') +
      '<span class="je-x">' + esc(e.body) + '</span>';
    var text = (kindLabel(e) + ' ' + e.prompt + ' ' + e.body).toLowerCase();
    if (ro) return '<li data-jtext="' + esc(text) + '"><article class="je is-open is-ro"><div class="je-c">' + inner + '</div></article></li>';
    var more = '';
    if (open) {
      var body;
      if (J.edit === e.id) {
        body = '<div class="je-ed">' + (e.src ? words(e.kind, e.ref, e.field, 'In your words', 3)
          : '<div class="fbw"><textarea class="fb-t" data-je="' + esc(e.id) + '" rows="3" aria-label="Edit this entry">' + esc(e.body) + '</textarea><span class="fb-s" aria-hidden="true">' + check + 'Saved</span></div>') +
          (e.src ? '<p class="pt-e">This is the same note as on day ' + e.n + '. Changing it here changes it there too.</p>' : '') +
          '<button type="button" class="send-btn" data-jedit-done>' + check + 'Done</button></div>';
      } else if (J.del === e.id) {
        body = '<div class="je-del" role="alert"><p class="fb-q">Delete this entry?</p><p class="pt-e">' + (e.src ? 'It’s removed from day ' + e.n + ' too. ' : '') + 'This can’t be undone.</p>' +
          '<div class="je-del-r"><button type="button" class="je-del-b" data-jdel-yes>' + binIcon + 'Delete</button><button type="button" class="lnk" data-jdel-no>Keep it</button></div></div>';
      } else {
        body = '<div class="je-acts">' +
          '<button type="button" class="je-a" data-jedit>' + editIcon + 'Edit</button>' +
          '<button type="button" class="je-a" data-jpin aria-pressed="' + !!pin + '">' + pinIcon + (pin ? 'Unpin' : 'Pin') + '</button>' +
          '<button type="button" class="je-a" data-jdel>' + binIcon + 'Delete</button>' +
          (e.src ? '<button type="button" class="je-a je-a--go" data-view-day="' + e.n + '">Day ' + e.n + '<span aria-hidden="true">→</span></button>' : '') + '</div>' +
          '<button type="button" class="je-sw" role="switch" aria-checked="' + personal + '" data-jpersonal><span class="je-sw-t"><b>Keep it personal</b>' +
            '<span>Just for you. It won’t shape your plans, steps or suggestions.</span></span><i class="je-sw-i" aria-hidden="true"></i></button>';
      }
      more = '<div class="je-more">' + body + '</div>';
    }
    return '<li data-jtext="' + esc(text) + '"><article class="je' + (open ? ' is-open' : '') + (J.saved === e.id ? ' is-new' : '') + '" data-jid="' + esc(e.id) + '">' +
      '<button type="button" class="je-b" data-jopen aria-expanded="' + open + '">' + inner + '</button>' + more + '</article></li>';
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
  var FILTERS = [['all', 'All'], ['here', 'Written here'], ['plan', 'From your plan'], ['letters', 'Letters']];
  function passes(e) { return J.f === 'here' ? !e.src : J.f === 'plan' ? e.src : J.f === 'letters' ? e.kind === 'letter' && !e.src : true; }
  // search hides what doesn't match, without redrawing the screen, so typing never jumps
  function jSearch() {
    var q = J.q.trim().toLowerCase(), any = false;
    root.querySelectorAll('[data-jtext]').forEach(function (li) { var hit = !q || li.getAttribute('data-jtext').indexOf(q) >= 0; li.hidden = !hit; if (hit) any = true; });
    root.querySelectorAll('[data-jg]').forEach(function (g) { g.hidden = !g.querySelector('[data-jtext]:not([hidden])'); });
    var none = root.querySelector('#jnone'); if (none) none.hidden = any || !root.querySelector('[data-jtext]');
  }

  function journalView(p) {
    var mineG = gathered(p);
    if (!paid()) {
      var g = mineG.sort(function (a, b) { return b.at - a.at; });
      return screenHead('Your words', 'Journal', 'Everything you write in your plan, kept in one place.') +
        '<section class="fs fs--top"><p class="pl-k">Your words so far</p>' +
          (g.length ? '<ul class="jl">' + g.map(function (e) { return entryCard(e, true); }).join('') + '</ul>'
            : '<div class="pt-soon"><p class="pl-k">Nothing here yet</p><p class="pt-e">As you check in and write a line each day, your words gather here.</p></div>') + '</section>' +
        fullApp('Write as much as you want', [
          ['Write more', 'A blank page, a prompt for your day, a quick line or a letter you won’t send.'],
          ['Talk instead of type', 'Tap the mic and your words appear as you speak.'],
          ['Find it again', 'Search, pins, and everything sorted by week.'],
          ['Private by default', 'Only you can read it. Keep any entry just for you.']
        ]);
    }
    var all = allEntries(p), list = all.filter(passes);
    return screenHead('Your words', 'Journal', 'A private place to write more. Everything you write in your plan gathers here too.') +
      composer() + (J.warn ? safeCard() : '') +
      (all.length
        ? '<section class="jt"><div class="pb-s"><input type="search" id="jq" class="fb-t" placeholder="Search your journal" aria-label="Search your journal" autocomplete="off" value="' + esc(J.q) + '"></div>' +
          '<div class="jf" role="group" aria-label="Show">' + FILTERS.map(function (f) { return '<button type="button" data-jf="' + f[0] + '" aria-pressed="' + (J.f === f[0]) + '">' + f[1] + '</button>'; }).join('') + '</div>' +
          (list.length ? timeline(list) : '<div class="pt-soon"><p class="pl-k">Nothing here yet</p><p class="pt-e">' + (J.f === 'letters' ? 'Letters you write show up here.' : J.f === 'plan' ? 'Your check-in notes and lines from each day show up here.' : 'What you write above shows up here.') + '</p></div>') +
          '<p class="pt-e jt-none" id="jnone" hidden>Nothing matches. Try another word.</p></section>'
        : '<div class="pt-soon"><p class="pl-k">Your journal starts here</p><p class="pt-e">Write your first entry above. Your check-in notes and lines from each day gather here too.</p></div>') +
      '<section class="fs jp"><p class="pl-k">Private by default</p><p class="pl-text">Only you can read your journal. No one at The Jarred Effect does. For now, it’s saved on this device only.</p>' +
        (J.wipe ? '<div class="je-del" role="alert"><p class="fb-q">Delete everything you’ve written here?</p><p class="pt-e">Your journal entries are deleted for good. Notes in your plan stay where they are.</p>' +
            '<div class="je-del-r"><button type="button" class="je-del-b" data-jwipe-yes>' + binIcon + 'Delete everything</button><button type="button" class="lnk" data-jwipe-no>Keep it</button></div></div>'
          : st.journal.length ? '<button type="button" class="lnk lnk--quiet" data-jwipe>Delete everything you’ve written here</button>' : '') + '</section>';
  }

  // ---- talk instead of type: the browser's own speech-to-text, where there is one
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var talk = null;
  function sentence(t) { t = t.trim(); if (!t) return ''; t = t.charAt(0).toUpperCase() + t.slice(1); return /[.!?]$/.test(t) ? t : t + '.'; }
  function paintTalk() { var b = root.querySelector('[data-jtalk]'); if (b) b.outerHTML = talkBtn(); }
  function talkStop(note) {
    if (talk) { talk.on = false; try { talk.rec.stop(); } catch (x) { /* already stopped */ } }
    talk = note ? { on: false, note: note } : null;
  }
  function talkStart() {
    var rec = new SR(), base = '';
    rec.continuous = true; rec.interimResults = true; rec.lang = navigator.language || 'en-US';
    function begin() { var ta = root.querySelector('#jw-t'); base = ta ? ta.value.replace(/\s+$/, '') : ''; }
    begin();
    rec.onresult = function (e) {
      var fin = [], mid = '';
      for (var i = 0; i < e.results.length; i++) { if (e.results[i].isFinal) fin.push(sentence(e.results[i][0].transcript)); else mid += e.results[i][0].transcript; }
      var heard = (fin.join(' ') + (mid.trim() ? ' ' + mid.trim() : '')).trim();
      var ta = root.querySelector('#jw-t'); if (!ta) return;
      ta.value = base + (base && heard ? ' ' : '') + heard;
      draft().text = ta.value; save(); grow(ta);
    };
    rec.onerror = function (e) {
      var why = e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'The mic is off for this site. Turn it on in your browser settings, or tap the mic on your keyboard.'
        : e.error === 'no-speech' || e.error === 'aborted' ? '' : 'Talking isn’t working in this browser right now. Tap the mic on your keyboard instead.';
      if (why) { talkStop(why); if (tab === 'journal') render(); }
    };
    // a pause ends the browser's listening; pick up again until they tap stop
    rec.onend = function () { if (talk && talk.rec === rec && talk.on) { begin(); try { rec.start(); } catch (x) { talkStop(); paintTalk(); } } };
    talk = { rec: rec, on: true };
    try { rec.start(); } catch (x) { talkStop('Talking isn’t working in this browser right now. Tap the mic on your keyboard instead.'); }
  }

