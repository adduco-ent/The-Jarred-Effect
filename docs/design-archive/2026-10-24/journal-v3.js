  // ---- the writer: its own page, a sheet of paper that grows with them, saved as they type.
  // One quiet header for every kind of entry: what it is, then the question. A letter's "To" sits on the sheet itself.
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
    var kick, q, extra = '';
    if (editing) { kick = kindLabel(e) + ' · ' + shortDate(new Date(e.at)); q = e.kind === 'letter' ? '' : e.prompt || ''; }
    else if (m === 'prompt') { kick = 'Today’s prompt'; q = curPrompt(); extra = '<button type="button" class="lnk jnext" data-jnext>' + againIcon + 'Another one</button>'; }
    else if (m === 'letter') { kick = 'A letter you won’t send'; q = L[li].prompt; }
    else if (m === 'quick') {
      kick = 'Quick line'; q = 'One sentence on today.';
      extra = '<p class="fb-l">What kind of day is it?</p>' + chips('data-jday', 'jw', [['full', STEAM.full], ['half', STEAM.half], ['rough', STEAM.rough]], d.day != null ? d.day : todayCi());
    } else { kick = 'Free write'; q = 'Whatever’s on your mind. Any length.'; }
    var title = editing ? e.title : d.title, body = editing ? e.body : d.text;
    var withTitle = m === 'free' || m === 'prompt';
    // a letter starts with who it's to, like a real one
    var to = m !== 'letter' ? ''
      : editing ? '<p class="jw-to"><span class="jw-to-k">To</span><span class="jw-to-s">' + esc(e.to || 'Future you') + '</span></p>'
      : '<div class="jw-to" role="radiogroup" aria-label="Who the letter is to"><span class="jw-to-k">To</span>' +
        L.map(function (x, i) { return '<button type="button" role="radio" aria-checked="' + (i === li) + '" data-jto="' + i + '">' + esc(x.to) + '</button>'; }).join('') + '</div>';
    var ph = m === 'quick' ? 'Just one line.' : m === 'letter' ? LETTER_HI[li] : 'Start with the first sentence that comes. Keep going as long as you like.';
    var rest = editing ? 'Changes save as you write' : 'Your draft saves as you write';
    var live = !!(talk && talk.on);
    var hint = talk && talk.note ? talk.note : SR ? '' : 'To talk instead of type, tap the mic on your keyboard.';
    return bar + '<header class="jw-head"><p class="pl-k">' + esc(kick) + '</p>' + (q ? '<h1 class="jw-q">' + esc(q) + '</h1>' : '<h1 class="sr">Your entry</h1>') + extra + '</header>' +
      '<div class="jw-paper' + (m === 'quick' ? ' is-quick' : '') + '">' + to +
        (withTitle ? '<input class="jw-title" id="jw-title" data-jw="title" type="text" maxlength="140" placeholder="Title (optional)" aria-label="Title, optional" autocomplete="off" value="' + esc(title || '') + '">' : '') +
        '<textarea class="jw-t' + (m === 'quick' ? ' is-quick' : '') + '" id="jw-t" data-jw="body" rows="' + (m === 'quick' ? 2 : 10) + '" aria-label="Your entry" placeholder="' + esc(ph) + '">' + esc(body || '') + '</textarea></div>' +
      '<p class="jw-foot"><span id="jw-wc">' + wcLabel(wc(body)) + '</span><span class="jw-st' + (live ? ' is-live' : '') + '" id="jw-st" data-rest="' + esc(rest) + '">' + esc(live ? 'Listening. Tap the mic to stop.' : rest) + '</span></p>' +
      (hint ? '<p class="pt-e jw-hint" role="status">' + esc(hint) + '</p>' : '');
  }

  // ---- one entry, on its own page: the words in full, Edit at the top, and the options as one list of rows
  function jGone() { return '<a class="pb-back" href="#journal"><span aria-hidden="true">‹</span>Journal</a><div class="wait"><p><b>That entry isn’t here anymore.</b></p><a class="yu-link" href="#journal">Back to your journal<span aria-hidden="true">→</span></a></div>'; }
  function jRead() {
    var e = findEntry(J.id);
    if (!e) return jGone();
    var pin = !!(st.jmeta[e.id] || {}).pin, personal = isPersonal(e);
    var date = e.src ? dayDate(e.n) : new Date(e.at);
    var kick = e.src ? 'From your plan · Day ' + e.n : kindLabel(e) + ' · ' + clock(e.at);
    var h1 = e.src ? e.label : e.title || longDate(date);
    var sub = e.src || e.title ? longDate(date) : '';
    var bar = '<div class="jw-bar"><a class="pb-back jw-back" href="#journal"><span aria-hidden="true">‹</span>Journal</a>' +
      (J.edit ? '' : '<button type="button" class="send-btn jr-edit" data-jedit>' + editIcon + 'Edit</button>') + '</div>';
    var body = J.edit && e.src
      ? '<section class="jw-paper jr-ed">' + words(e.kind, e.ref, e.field, 'In your words', 4) +
        '<p class="pt-e">This is the same note as on day ' + e.n + '. Changing it here changes it there too.</p>' +
        '<button type="button" class="send-btn" data-jedit-done>' + check + 'Done</button></section>'
      : '<article class="jw-paper jr-body">' + (e.kind === 'letter' && !e.src ? '<p class="jr-to">To ' + esc((e.to || 'Future you').replace(/^\w/, function (c) { return c.toLowerCase(); })) + '</p>' : '') + paras(e.body) + '</article>';
    function row(attr, icon, label, sub2, right, cls) {
      return '<li><button type="button" class="jr-o' + (cls ? ' ' + cls : '') + '" ' + attr + '><span class="jr-oi">' + icon + '</span>' +
        '<span class="jr-ot"><b>' + label + '</b>' + (sub2 ? '<span>' + sub2 + '</span>' : '') + '</span>' + (right || '') + '</button></li>';
    }
    var sw = '<i class="je-sw-i" aria-hidden="true"></i>';
    var opts = J.del
      ? '<div class="je-del" role="alert"><p class="fb-q">Delete this entry?</p><p class="pt-e">' + (e.src ? 'It’s removed from day ' + e.n + ' too. ' : '') + 'This can’t be undone.</p>' +
        '<div class="je-del-r"><button type="button" class="je-del-b" data-jdel-yes>' + binIcon + 'Delete</button><button type="button" class="lnk" data-jdel-no>Keep it</button></div></div>'
      : '<ul class="pb-card jr-opts">' +
        row('role="switch" aria-checked="' + pin + '" data-jpin', pinIcon, 'Pin to the top', '', sw) +
        row('role="switch" aria-checked="' + personal + '" data-jpersonal', lock, 'Keep it personal', 'Just for you. It won’t shape your plans, steps or suggestions.', sw) +
        (e.src ? row('data-view-day="' + e.n + '"', calIcon, 'Open day ' + e.n, '', chev) : '') +
        row('data-jdel', binIcon, 'Delete this entry', '', '', 'is-del') + '</ul>';
    return bar + '<header class="td-head sc-head jr-head"><p class="pl-k">' + esc(kick) + '</p><h1 class="td-h jr-h">' + esc(h1) + '</h1>' + (sub ? '<p class="pl-note">' + esc(sub) + '</p>' : '') + '</header>' +
      (J.warn ? safeCard() : '') +
      (e.prompt && e.kind !== 'letter' ? '<p class="jr-p">' + esc(e.prompt) + '</p>' : '') + body +
      '<p class="jw-foot"><span>' + wcLabel(wc(e.body)) + '</span></p>' +
      '<section class="jr-acts">' + opts + '</section>';
  }

  // ---- one entry in the list: one quiet line for when and what, then the title or the words. Tap to read it all.
  function kindShort(e) {
    if (e.src) return { checkin: 'Check-in', step: 'How your step went', skip: /^Your version/.test(e.label) ? 'Your version' : 'Gut call', receipt: 'One line on today', note: 'Day ' + e.n + ' question', lookback: 'Look back', next: 'Shape next week' }[e.kind] || 'From your plan';
    if (e.kind === 'letter') return 'Letter';
    if (e.kind === 'quick') return 'Quick line' + (e.day ? ' · ' + STEAM[e.day] + ' day' : '');
    return e.kind === 'prompt' ? 'Prompt' : 'Free write';
  }
  function entryCard(e, ro) {
    var meta = (e.src ? 'Day ' + e.n : shortDate(new Date(e.at))) + ' · ' + kindShort(e);
    var head = e.title || (e.kind === 'letter' && !e.src ? 'To ' + (e.to || 'Future you').replace(/^\w/, function (c) { return c.toLowerCase(); }) : '');
    var pin = (st.jmeta[e.id] || {}).pin, personal = isPersonal(e);
    var marks = ro ? '' : (pin ? '<span class="je-mark" aria-label="Pinned">' + pinIcon + '</span>' : '') + (personal ? '<span class="je-mark" aria-label="Kept personal">' + lock + '</span>' : '') + '<span class="je-chev" aria-hidden="true">›</span>';
    var text = (kindLabel(e) + ' ' + (e.title || '') + ' ' + (e.to || '') + ' ' + e.prompt + ' ' + e.body).toLowerCase();
    var top = '<span class="je-top"><span class="je-d">' + esc(meta) + '</span><span class="je-tags">' + marks + '</span></span>' +
      (head ? '<span class="je-t">' + esc(head) + '</span>' : '');
    if (ro) return '<li data-jtext="' + esc(text) + '"><article class="je is-ro">' + top + '<div class="je-x je-x--all">' + paras(e.body) + '</div></article></li>';
    return '<li data-jtext="' + esc(text) + '"><a class="je' + (J.saved === e.id ? ' is-new' : '') + '" href="#journal/e/' + encodeURIComponent(e.id) + '">' + top +
      '<span class="je-x' + (head ? ' is-short' : '') + '">' + esc(oneLine(e.body)) + '</span></a></li>';
  }

