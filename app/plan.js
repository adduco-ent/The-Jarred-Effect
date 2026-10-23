/* The Other Half app, free layer. Everyone who takes the quiz and asks for a plan gets in.
   Today: one day at a time. A daily check-in (good, okay or hard), then one card per goal's step, and a strip of
     the seven days. Days open by the calendar from the day the plan is first opened; future days show a preview.
   Progress: days done, steps, minutes, check-ins, each goal's progress, the week at a glance, and their own words.
   Playbook, patterns over time, week 2 and adding more goals are shown but locked until they join.

   Feedback, in their own words, is asked for at the moment it's true, never as a form:
     check-in okay or hard → what's going on · step done → how it felt · step doesn't fit → skip or change, and why
     day done → one line on today · day 3 → is the app easy · day 7 → look back, then shape next week · You → make it better
   Everything is kept in this browser, and sent to /api/feedback (table plan_feedback) when the plan has an id.
   That's what next week's plan is built from. */
(function () {
  'use strict';
  var root = document.getElementById('plan');
  var nav = document.getElementById('tabs');
  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  var source = id ? '/api/plan?id=' + encodeURIComponent(id) : '/app/plan-sample.json';
  var KEY = 'oh.app.' + (id || 'sample');
  // review mode (local, or ?review): every day opens, and ?day=N pretends today is day N. ?review=0 turns it off.
  var REVIEW = params.get('review') !== '0' && (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || params.has('review'));
  var TABS = ['today', 'progress', 'playbook', 'journal', 'you'];
  // opened from the Home Screen, the icon opens /app/plan.html with no id: bring them back to their own plan
  try {
    if (id) localStorage.setItem('oh.app.last', id);
    else if (!REVIEW) {
      var lastId = localStorage.getItem('oh.app.last');
      if (lastId && /^[A-Za-z0-9_-]{8,64}$/.test(lastId)) { location.replace(location.pathname + '?id=' + encodeURIComponent(lastId) + location.hash); return; }
    }
  } catch (e) { /* storage blocked: the sample opens */ }
  var FB_KINDS = ['step', 'skip', 'checkin', 'receipt', 'note', 'lookback', 'next', 'app', 'ask'];

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ymd(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function fromYmd(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* ignore */ }
    s = s && typeof s === 'object' ? s : {};
    s.done = s.done || {}; s.checkin = s.checkin || {}; s.walk = s.walk || {}; s.fb = s.fb || {};
    s.at = s.at || {}; // when each step was marked done, for "when you show up" in Patterns
    // the journal (full app): their entries, pins and Keep it personal, and an unsaved draft
    s.journal = Array.isArray(s.journal) ? s.journal : []; s.jmeta = s.jmeta || {}; s.jdraft = s.jdraft || {};
    s.nudge = s.nudge || {}; // the daily nudge: { on, time, via: push | calendar, dismissed, lastDone }
    FB_KINDS.forEach(function (k) { s.fb[k] = s.fb[k] || {}; });
    // notes from the earlier version move into feedback
    if (s.notes) { Object.keys(s.notes).forEach(function (d) { if (s.notes[d]) s.fb.note[d] = { text: s.notes[d] }; }); delete s.notes; }
    if (!s.start) {
      try { var old = JSON.parse(localStorage.getItem('oh.plan.' + (id || 'sample'))); if (old && typeof old === 'object') s.done = old; } catch (e) { /* ignore */ }
      s.start = ymd(new Date());
    }
    return s;
  }
  var st = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* private window: nothing sticks */ } }
  save();
  var done = st.done, fb = st.fb;

  // ---- sending feedback: debounced per answer, flushed if they leave the page
  var pending = {};
  function payload(kind, ref) {
    var d = fb[kind][ref] || {};
    var out = kind === 'checkin' ? { day: st.checkin[ref] || null, note: d.note || '' } : Object.assign({}, d);
    // anything they marked Keep it personal stays on their device and never shapes a plan
    (d.private || []).forEach(function (f) {
      if (f.indexOf('ask.') === 0 && out.asks) { var i = +f.split('.')[1]; out.asks = out.asks.map(function (a, j) { return j === i ? Object.assign({}, a, { note: '' }) : a; }); }
      else delete out[f];
    });
    delete out.private;
    return out;
  }
  function send(kind, ref) {
    delete pending[kind + ':' + ref];
    if (!id) return;
    try {
      fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
        body: JSON.stringify({ plan: id, kind: kind, ref: String(ref), data: payload(kind, ref) }) }).catch(function () { /* kept locally */ });
    } catch (e) { /* kept locally */ }
  }
  function sync(kind, ref, now) {
    save();
    var k = kind + ':' + ref;
    if (pending[k]) clearTimeout(pending[k].t);
    if (now) return send(kind, ref);
    pending[k] = { kind: kind, ref: ref, t: setTimeout(function () { send(kind, ref); }, 900) };
  }
  window.addEventListener('pagehide', function () { Object.keys(pending).forEach(function (k) { clearTimeout(pending[k].t); send(pending[k].kind, pending[k].ref); }); });

  var plan = null, tab = 'today', T = 1, sel = 1, said = null, keepLayers = true;
  var pbId = null, lib = null, libAsked = false; // the playbook library (app/playbook.json), loaded when first needed
  // the full app: a paid plan, or ?tier=paid in review mode to see the paid screens
  function paid() { return (REVIEW && params.get('tier') === 'paid') || (plan && plan.tier === 'paid'); }
  function needLib() {
    if (lib || libAsked) return;
    libAsked = true;
    fetch('/app/playbook.json').then(function (r) { return r.json(); }).then(function (d) { lib = d; render(); }).catch(function () { libAsked = false; });
  }
  var skipOpen = {}, appThanks = false, addOpen = false;

  var check = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5.5 10.5l3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var skipIcon = '<svg class="sk-i" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 14c1.2-4.2 4.6-6.5 8.6-6.1M10.5 4.5l3.3 3.3-3.4 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var upIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5.5 12.5L10 8l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var undoIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7.5 6.5L4 10l3.5 3.5M4.5 10H12a4 4 0 010 8h-1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var lock = '<svg class="lk-i" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3.25" y="7" width="9.5" height="6.75" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 7V5.25a2.5 2.5 0 015 0V7" stroke="currentColor" stroke-width="1.4"/></svg>';

  // ---- days and dates
  function dayDate(n) { var d = fromYmd(st.start); d.setDate(d.getDate() + n - 1); return d; }
  function weekday(n, short) { return dayDate(n).toLocaleDateString('en-US', { weekday: short ? 'short' : 'long' }); }
  function todayNum() {
    var forced = REVIEW ? parseInt(params.get('day'), 10) : 0;
    if (forced >= 1 && forced <= 8) return forced;
    var diff = Math.round((fromYmd(ymd(new Date())) - fromYmd(st.start)) / 86400000);
    return Math.max(1, Math.min(8, diff + 1)); // 8 = the week is over
  }

  // ---- done state: a key per step ("3.1" = day 3, Ask 2), a key per day for the question and look back days
  function key(d, s) { return s ? d.day + '.' + s.ask : String(d.day); }
  function stepsDone(d) { return d.steps.filter(function (s) { return done[key(d, s)]; }).length; }
  // a day counts once any step is done: on a half or rough day, one goal's step is the day
  function kept(d) { return d.kind === 'step' ? stepsDone(d) > 0 : !!done[key(d)]; }
  function keptCount(p) { return p.days.filter(kept).length; }
  // a step skipped on purpose is a gut call, not a miss
  // (today only counts as a gut call once every step is skipped, since there's still time to do one)
  function skippedOnly(d) {
    if (d.kind !== 'step' || kept(d)) return false;
    var sk = function (s) { return (fb.skip[key(d, s)] || {}).action === 'skip'; };
    return d.day === T ? d.steps.every(sk) : d.steps.some(sk);
  }
  function dayState(d) { return kept(d) ? 'kept' : skippedOnly(d) && d.day <= T ? 'gut' : d.day < T ? 'missed' : d.day === T ? 'today' : 'future'; }
  // done their own way: every step they did was their own version (changed to fit, then marked done). It counts the
  // same and shows an anchor. If even one step went as planned, the day shows the plain check; skips never mark a done day.
  function mineDay(d) {
    if (d.kind !== 'step' || !kept(d)) return false;
    return d.steps.filter(function (s) { return done[key(d, s)]; }).every(function (s) { return (fb.skip[key(d, s)] || {}).action === 'change'; });
  }
  var anchorIcon = '<svg class="an-i" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="4.75" r="1.75" stroke="currentColor" stroke-width="1.6"/><path d="M10 6.5V17M6.75 9.5h6.5M4.25 12.25c.55 2.75 2.95 4.75 5.75 4.75s5.2-2 5.75-4.75M4.25 12.25l-1 1.5M4.25 12.25l1.75.25M15.75 12.25l1 1.5M15.75 12.25l-1.75.25" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function titles(d) { return d.kind === 'step' ? d.steps.map(function (s) { return s.title; }) : [d.title]; }

  // ---- Jarred's encouragement (plan.cheer, from the playbook): answers real moments, never hype
  function cheer() { return (plan && plan.cheer) || {}; }
  function doneLine(day) {
    var c = cheer();
    if (day > 1 && !kept(plan.days[day - 2]) && c.missed) return c.missed; // back after a missed day, no guilt
    var list = c.done || [];
    return list.length ? list[(day - 1) % list.length] : '';
  }

  function end(t) { t = String(t || '').trim(); return /[.!?]$/.test(t) ? t : t + '.'; }
  function uniq(list) { return list.filter(function (x, i) { return x && list.indexOf(x) === i; }); }
  function others(p) { return uniq(p.asks.map(function (a) { return a.otherHalf && a.otherHalf.toLowerCase(); })).join(' and '); }
  function focuses(p) { return uniq(p.asks.map(function (a) { return a.focus; })).join(' · '); }
  // the check-in, in plain words: what kind of day is it? Underneath it's the method's full, half or rough day.
  var STEAM = { full: 'Good', half: 'Okay', rough: 'Hard' };
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // a small, obviously tappable row of choices
  function chips(attr, ref, options, current, cls) {
    return '<div class="ci-o' + (cls ? ' ' + cls : '') + '" style="--n:' + options.length + '">' + options.map(function (o) {
      return '<button type="button" ' + attr + '="' + o[0] + '" data-ref="' + ref + '" aria-pressed="' + (current === o[0]) + '">' + esc(o[1]) + '</button>';
    }).join('') + '</div>';
  }
  // their words: a quiet box that saves as they type
  function askNote(ref, field) { var n = fb.next[ref]; var i = +field.split('.')[1]; return n && n.asks && n.asks[i] ? n.asks[i].note || '' : ''; }
  function words(kind, ref, field, placeholder, rows, label) {
    var v = field.indexOf('ask.') === 0 ? askNote(ref, field) : (fb[kind][ref] || {})[field] || '';
    var idAttr = 'w-' + kind + '-' + String(ref).replace(/\./g, '_') + '-' + field.replace(/\./g, '_');
    return '<div class="fbw' + (v ? ' is-saved' : '') + '">' + (label ? '<label class="fb-l" for="' + idAttr + '">' + esc(label) + '</label>' : '') +
      '<textarea class="fb-t" id="' + idAttr + '" data-fb="' + kind + '" data-ref="' + ref + '" data-field="' + field + '" rows="1"' +
      (label ? '' : ' aria-label="' + esc(placeholder) + '"') + ' placeholder="' + esc(placeholder) + '">' + esc(v) + '</textarea>' +
      '<p class="fb-s" role="status">' + (v ? savedLine() : '') + '</p></div>';
  }

  function doneBtn(k, label) {
    var isDone = !!done[k];
    return '<button class="pl-done" type="button" data-done="' + k + '" aria-pressed="' + isDone + '"' + (label ? ' aria-label="' + esc((isDone ? 'Done: ' : 'Mark done: ') + label) + '"' : '') + '>' + check + '<span>' + (isDone ? 'Done · Undo' : 'Mark done') + '</span></button>';
  }
  function reply(k) { return said && said.key === k && done[k] && said.line ? '<p class="pl-said" role="status">' + esc(said.line) + '</p>' : ''; }

  // ---- the layers under each step, for people who want more before they move
  function layers(d, s) {
    var h = s.help || {}, k = key(d, s), open = st.guide === 'walk';
    var a = plan.asks[s.ask] || {};
    function det(name, label, body, isOpen) {
      return '<details class="pl-more" data-l="' + k + ':' + name + '"' + (isOpen ? ' open' : '') + '><summary><span>' + label + '</span><i aria-hidden="true"></i></summary><div class="pl-more-b">' + body + '</div></details>';
    }
    var out = '';
    if (h.how && h.how.length) {
      var ticks = st.walk[k] || [];
      var n = h.how.filter(function (x, i) { return ticks[i]; }).length;
      out += det('walk', 'Walk me through it <em data-walk-n="' + k + '">' + (n ? n + ' of ' + h.how.length : '') + '</em>',
        '<ol class="wk">' + h.how.map(function (x, i) {
          return '<li><label><input type="checkbox" data-walk="' + k + '" data-i="' + i + '"' + (ticks[i] ? ' checked' : '') + '><span>' + esc(x) + '</span></label></li>';
        }).join('') + '</ol>', open);
    }
    if (h.story) out += det('story', 'See it in real life', '<p class="pl-story">' + esc(h.story) + '</p><p class="pl-story-k">A made-up example, but it’s how this usually goes.</p>', open);
    if (h.why || h.stuck) {
      out += det('why', 'Why it works',
        (h.why ? '<div><p class="pl-more-k">Why it works</p><p>' + esc(h.why) + '</p></div>' : '') +
        (h.stuck ? '<div><p class="pl-more-k">If you get stuck</p><p>' + esc(h.stuck) + '</p></div>' : ''), false);
    }
    if (a.deeper) {
      out += det('deep', 'The play behind this step: ' + esc(a.deeper.name),
        '<p>' + esc(a.deeper.when) + '</p><ol>' + a.deeper.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
        (a.deeper.safety ? '<p class="pl-safe">' + esc(a.deeper.safety) + '</p>' : '') +
        '<a class="yu-link" href="#playbook">The whole playbook<span aria-hidden="true">→</span></a>', false);
    }
    return out ? '<div class="pl-layers">' + out + '</div>' : '';
  }

  // ---- after a step: how it felt (done), or a gut call (not done)
  var FEEL = [['easy', 'Easy'], ['okay', 'Okay'], ['hard', 'Hard']];
  function afterStep(k, isDone) {
    if (isDone) {
      var f = fb.step[k] || {};
      return '<div class="fb"><p class="fb-q">How did it feel?</p>' + chips('data-feel', k, FEEL, f.feel) +
        (f.feel ? words('step', k, 'note', f.feel === 'hard' ? 'What made it hard? In your words, if you want.' : 'Anything to add? In your words, if you want.') : '') + '</div>';
    }
    var sk = fb.skip[k];
    if (sk && sk.action && !isDone) return '';
    if (sk && sk.action) {
      var skip = sk.action === 'skip';
      return '<div class="st-box" role="status"><p class="st-t">' + (skip ? skipIcon + 'Skipped today, on purpose' : check + 'Your version') + '</p>' +
        '<p class="st-x">' + (skip ? 'A gut call counts as information. Tomorrow’s step is a fresh start.' : 'Do your version, then mark it done. It counts the same.') + '</p>' +
        words('skip', k, 'note', skip ? 'What did your gut say?' : 'What did you change it to?') +
        '<button type="button" class="st-undo" data-unskip="' + k + '">' + undoIcon + (skip ? 'Undo skip' : 'Undo change') + '</button></div>';
    }
    // a gut call: say what's inside before it opens, then two clear choices, each with what it means
    var chev = '<svg class="gut-c" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (skipOpen[k]) {
      var row = function (v, icon, title, line) {
        return '<button type="button" class="gt-r" data-skip="' + v + '" data-ref="' + k + '"><span class="gt-ic" aria-hidden="true">' + icon + '</span>' +
          '<span class="gt-t"><b>' + title + '</b><span>' + line + '</span></span><span class="gt-go" aria-hidden="true">›</span></button>';
      };
      return '<div class="gt" role="group" aria-labelledby="gt-' + k.replace('.', '_') + '">' +
        '<div class="gt-h"><p class="gt-q" id="gt-' + k.replace('.', '_') + '">Your gut has the final say. What would fit today?</p>' +
          '<button type="button" class="gt-x" data-skipopen="' + k + '" aria-label="Never mind, keep this step"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></div>' +
        '<div class="gt-o">' + row('change', penIcon, 'Change it to fit', 'Do your own version, and it counts the same.') +
          row('skip', skipIcon, 'Skip it today', 'A gut call is information, and tomorrow starts fresh.') + '</div></div>';
    }
    return '<button type="button" class="gut-b" data-skipopen="' + k + '" aria-expanded="false"><span>Doesn’t fit today?</span><b>Change or skip it</b>' + chev + '</button>';
  }

  // ---- a gut call, the next layer: one question, quick answers to tap, room for their own words, a reassuring line
  var GUT_PICKS = { skip: ['Too tired', 'No time today', 'It didn’t feel right', 'Something came up'],
    change: ['Do a smaller part of it', 'Do it later today', 'Do it a different way'] };
  function gutNote(k, kind) {
    var skip = kind === 'skip', note = (fb.skip[k] || {}).note || '';
    var picked = note.split(/,\s*/);
    return '<div class="gn"><p class="gn-q">' + (skip ? 'What did your gut say?' : 'What will you do instead?') + '</p>' +
      '<div class="gn-c" role="group" aria-label="Quick answers">' + GUT_PICKS[kind].map(function (p) {
        return '<button type="button" class="gn-p" data-gnpick="' + k + '" data-v="' + esc(p) + '" aria-pressed="' + (picked.indexOf(p) >= 0) + '"><span>' + esc(p) + '</span><i class="gn-m" aria-hidden="true">' + check + '</i></button>';
      }).join('') + '</div>' +
      // their own words: return finishes (the keyboard key reads "done"); a skip also gets a check button once typed
      words('skip', k, 'note', 'Or in your own words').replace('<textarea ', '<textarea enterkeyhint="done" data-gn-enter ')
        .replace('</textarea>', '</textarea>' + (skip ? '<button type="button" class="gn-go" data-gngo="' + k + '" aria-label="Done, skip with this note">' + check + '</button>' : '')) +
      '<p class="gn-x">' + (skip ? 'A gut call counts as information, and tomorrow starts fresh.' : 'Do your version, then mark it done. It counts the same as the original.') + '</p></div>';
  }

  // ---- the day's progress: one slim bar under the heading. Check in, each step, one line. On an okay or hard day it
  // asks for one step, not all of them. Tap a segment to jump there.
  function dayBar(d) {
    var ci = st.checkin[d.day], light = d.steps.length > 1 && (ci === 'half' || ci === 'rough');
    var parts = [{ id: 'ci', label: 'Check in', ok: !!ci }];
    if (light) parts.push({ id: 'steps', label: 'One step', ok: kept(d) });
    else d.steps.forEach(function (x, i) { parts.push({ id: 'step-' + key(d, x).replace('.', '_'), label: d.steps.length > 1 ? 'Step ' + (i + 1) : 'Your step', ok: !!done[key(d, x)] }); });
    parts.push({ id: kept(d) ? 'rc' : 'steps', label: 'One line', ok: !!((fb.receipt[d.day] || {}).text || '').trim() });
    var n = parts.filter(function (x) { return x.ok; }).length, all = n === parts.length, cur = -1;
    parts.forEach(function (x, i) { if (cur < 0 && !x.ok) cur = i; });
    return '<div class="db' + (all ? ' is-all' : '') + '" role="group" aria-label="Today’s progress"><p class="db-top"><span>' + (all ? check + 'Day done' : 'Today') + '</span><span class="db-n">' + n + ' of ' + parts.length + ' done</span></p>' +
      '<div class="db-segs">' + parts.map(function (x, i) {
        return '<button type="button" class="db-s' + (x.ok ? ' is-done' : '') + (i === cur ? ' is-now' : '') + '" data-jump="' + x.id + '"' + (i === cur ? ' aria-current="step"' : '') + ' aria-label="' + esc(x.label + (x.ok ? ', done' : '')) + '"><i aria-hidden="true"></i><span>' + esc(x.label) + '</span></button>';
      }).join('') + '</div></div>';
  }
  // a finished step folds into a slim bar after a short beat; tap it to open again
  var fresh = {}, hold = {}, openCard = {};
  // a step folds to a bar once it's settled: done, or skipped with the gut call answered
  function skipSettled(k) { var x = fb.skip[k]; return !done[k] && !!x && x.action === 'skip' && !!x.settled; }
  function folded(k) { return (!!done[k] || skipSettled(k)) && !fresh[k] && !openCard[k]; }
  // skipped, folded: the skip icon, the title, and why in a few words
  function skipBar(k, s, many) {
    var note = ((fb.skip[k] || {}).note || '').trim(), bits = [];
    if (many) bits.push('Goal ' + (s.ask + 1));
    bits.push('Skipped today');
    if (note) bits.push(note.length > 30 ? note.slice(0, 29).trim() + '…' : note);
    return '<article class="pl-day pl-foldc pl-foldc--skip" id="j-step-' + k.replace('.', '_') + '"><button type="button" class="pl-fold" data-unfold="' + k + '" aria-expanded="false">' +
      '<span class="pl-sk" aria-hidden="true">' + skipIcon + '</span><span class="pl-fold-t"><b>' + esc(s.title) + '</b><small>' + bits.map(esc).join('<i class="pl-fold-dot" aria-hidden="true">·</i>') + '</small></span>' +
      '<span class="pl-fold-go" aria-hidden="true">' + upIcon + '</span></button></article>';
  }
  // once the gut call is answered (a quick answer tapped, or their own words written and left), the card settles
  // into its bar after a beat, unless they're still writing or tapping
  var settleT = {};
  // their own words are in: put the keyboard away, and a skip folds into its bar right away
  function finishGut(k) {
    var a = document.activeElement; if (a && a.blur) a.blur();
    if ((fb.skip[k] || {}).action === 'skip') settleSkip(k, 150);
  }
  function settleSkip(k, ms) {
    clearTimeout(settleT[k]);
    settleT[k] = setTimeout(function () {
      var c = root.querySelector(cardSel(k)), x = fb.skip[k];
      if (!c || !x || x.action !== 'skip' || tab !== 'today') return;
      var a = document.activeElement;
      if (a && c.contains(a) && a.tagName === 'TEXTAREA') return;
      fb.skip[k] = Object.assign({}, x, { settled: true }); delete openCard[k]; save();
      morphRender(cardSel(k));
    }, ms);
  }
  // a finished step, folded: the check, the title, and one quiet status line (which goal, and how it felt or an ask)
  function foldBar(k, title, sub, feel, noAsk, mine) {
    var status = (sub ? esc(sub) + '<i class="pl-fold-dot" aria-hidden="true">·</i>' : '') + (mine ? 'Your version<i class="pl-fold-dot" aria-hidden="true">·</i>' : '') + (noAsk ? 'Done' : feel ? 'Felt ' + esc(feel.toLowerCase()) : '<em>How did it feel?</em>');
    return '<article class="pl-day pl-foldc" id="j-step-' + k.replace('.', '_') + '"><button type="button" class="pl-fold" data-unfold="' + k + '" aria-expanded="false">' +
      '<span class="pl-fold-ck" aria-hidden="true">' + check + '</span><span class="pl-fold-t"><b>' + esc(title) + '</b><small>' + status + '</small></span>' +
      '<span class="pl-fold-go" aria-hidden="true">' + upIcon + '</span></button></article>';
  }
  var FEELW = { easy: 'Easy', okay: 'Okay', hard: 'Hard' };

  // ---- one card per goal's step
  // how they said the day is shapes Today: the heading line, and on an okay or hard day the smallest step comes first
  function todayLine(d, many) {
    var w = cheer().welcome, ci = st.checkin[d.day];
    return w && w.today && ci && d.kind === 'step' ? w.today[ci === 'half' && many ? 'halfMany' : ci] : '';
  }
  function orderedSteps(d) {
    var ci = st.checkin[d.day];
    if (!(d.steps.length > 1 && (ci === 'half' || ci === 'rough'))) return d.steps;
    return d.steps.map(function (x, i) { return [x, i]; }).sort(function (a, b) { return (a[0].minutes - b[0].minutes) || (a[1] - b[1]); }).map(function (x) { return x[0]; });
  }
  function stepCard(d, s, many, idx) {
    var k = key(d, s), isDone = !!done[k], rough = st.checkin[d.day] === 'rough';
    if (folded(k)) return done[k] ? foldBar(k, s.title, many ? 'Goal ' + (s.ask + 1) : '', FEELW[(fb.step[k] || {}).feel], false, (fb.skip[k] || {}).action === 'change') : skipBar(k, s, many);
    // an okay or hard day asks for one goal: once one step is done, the rest say so instead of looking unfinished
    var light = many && (st.checkin[d.day] === 'half' || rough) && !isDone && (kept(d) || idx > 0);
    var sk = fb.skip[k], skipped = !isDone && sk && sk.action === 'skip', changed = !isDone && sk && sk.action === 'change';
    var head = many
      ? '<p class="pl-step-ask"><i>' + (s.ask + 1) + '</i><span>' + esc(plan.asks[s.ask].text) + '</span></p>'
      : '<p class="pl-day-k"><span class="pl-min">' + s.minutes + ' min</span></p>';
    var title = '<h3 class="pl-day-t">' + esc(s.title) + (many ? ' <span class="pl-t-min">' + s.minutes + ' min</span>' : '') + '</h3>';
    // skipped: the same clean header as a finished step, then one question with quick answers, then a quiet undo
    if (skipped) {
      return '<article class="pl-day pl-step-card is-skipped" id="j-step-' + k.replace('.', '_') + '" data-card="' + k + '">' +
        '<div class="pl-dh pl-dh--skip"><span class="pl-sk" aria-hidden="true">' + skipIcon + '</span><span class="pl-fold-t"><b>' + esc(s.title) + '</b><small>' +
          (many ? 'Goal ' + (s.ask + 1) + '<i class="pl-fold-dot" aria-hidden="true">·</i>' : '') + 'Skipped today, on purpose</small></span>' +
          (sk.settled ? '<button type="button" class="pl-fold-x" data-fold="' + k + '" aria-label="Fold this step away">' + upIcon + '</button>' : '') + '</div>' +
        gutNote(k, 'skip') +
        '<button type="button" class="lnk pl-undo" data-unskip="' + k + '">Not skipping after all? Undo</button></article>';
    }
    // your version, in order: say what you'll do instead, do it, mark it done; the original folds away
    if (changed) {
      return '<article class="pl-day pl-step-card is-changed" id="j-step-' + k.replace('.', '_') + '" data-card="' + k + '">' +
        '<div class="pl-day-h">' + head + '<span class="pl-opt pl-opt--mine">' + penIcon + 'Your version</span></div>' + title +
        // the original, one tap away right under the title, for a look before deciding your version
        '<details class="pl-orig"><summary>See the original step</summary><p class="pl-text">' + esc(s.what) + '</p><div class="pl-sub"><span>For example</span><p>' + esc(s.example) + '</p></div></details>' +
        gutNote(k, 'change') +
        '<button type="button" class="pl-do" data-done="' + k + '"' + (many ? ' aria-label="Mark my version done: ' + esc(plan.asks[s.ask].text) + '"' : '') + '>' + check + '<span>Mark my version done</span></button>' +
        '<button type="button" class="lnk pl-back" data-unskip="' + k + '">Go back to the original step</button></article>';
    }
    // done and open: the header mirrors the folded bar (check, title, one status line, round arrow), so it reads as
    // the same thing opened up
    var doneHead = '<div class="pl-dh"><span class="pl-fold-ck" aria-hidden="true">' + check + '</span><span class="pl-fold-t"><b>' + esc(s.title) + '</b><small>' +
      (many ? 'Goal ' + (s.ask + 1) + '<i class="pl-fold-dot" aria-hidden="true">·</i>' : '') + 'Done</small></span>' +
      '<button type="button" class="pl-fold-x" data-fold="' + k + '" aria-label="Fold this step away">' + upIcon + '</button></div>';
    return '<article class="pl-day pl-step-card' + (isDone ? ' is-done' : '') + (changed ? ' is-changed' : '') + '" id="j-step-' + k.replace('.', '_') + '" data-card="' + k + '">' +
      (isDone ? doneHead : '<div class="pl-day-h">' + head + (light ? '<span class="pl-opt">Optional</span>' : '') + '</div>' +
      title) +
      // once it's done, the card steps back to its title: the how-to has done its job
      (isDone ? '' : rough
        ? '<div class="pl-v"><span>Your small version</span><p>' + esc(s.rough) + '</p></div><p class="pl-full"><b>The full step, for another day:</b> ' + esc(s.what) + '</p>'
        : '<p class="pl-text">' + esc(s.what) + '</p><div class="pl-sub"><span>For example</span><p>' + esc(s.example) + '</p></div><p class="pl-rough"><b>Hard day?</b> ' + esc(s.rough) + '</p>') +
      (isDone ? '' : '<button type="button" class="pl-do" data-done="' + k + '"' + (many ? ' aria-label="Mark done: ' + esc(plan.asks[s.ask].text) + '"' : '') + '>' + check + '<span>Mark done</span></button>') +
      reply(k) + afterStep(k, isDone) + layers(d, s) +
      (isDone ? '<button type="button" class="lnk pl-undo" data-done="' + k + '" aria-label="Undo: mark ' + esc(s.title) + ' not done">Not done yet? Undo</button>' : '') + '</article>';
  }

  // ---- the question day and the look back
  function wholeDayCard(d) {
    var k = key(d), body;
    if (folded(k)) return foldBar(k, d.kind === 'lookback' ? 'Look back' : 'One honest question', '', '', true);
    if (d.kind === 'question') {
      body = '<h3 class="pl-day-t">' + esc(d.title) + '</h3>' +
        '<p class="pl-q">' + esc(d.ask) + '</p>' +
        (d.help ? '<p class="pl-text">' + esc(d.help) + '</p>' : '') +
        (d.hint ? '<p class="pl-text">' + esc(d.hint) + (d.help ? '' : ' Answer it honestly, not nicely.') + '</p>' : d.help ? '' : '<p class="pl-text">Answer it honestly, not nicely.</p>') +
        (d.forMany ? '<p class="pl-text">Use it on the goal that feels heaviest right now.</p>' : '') +
        (d.followUps && d.followUps.length ? '<div class="pl-sub"><span>If you want to go deeper</span>' + d.followUps.map(function (f) { return '<p>' + esc(f) + '</p>'; }).join('') + '</div>' : '') +
        '<div class="nt">' + words('note', d.day, 'text', 'Whatever comes up. Only you and your next plan see this.', 4, 'Write it down') + '</div>' +
        (paid() ? '<button type="button" class="lnk jgo" data-jgo="ask" data-jask="' + esc(d.ask) + '">Keep going in your journal<span aria-hidden="true">→</span></button>' : '');
    } else {
      body = '<h3 class="pl-day-t">' + esc(d.title) + '</h3>' +
        '<p class="pl-text">Grab five minutes. Let’s look at your week clearly before the next one.</p>' +
        '<div class="lb">' + ['did', 'changed', 'keep'].map(function (f, i) { return '<div class="nt">' + words('lookback', '1', f, 'In your words', 3, (i + 1) + '. ' + d.prompts[i]) + '</div>'; }).join('') + '</div>' +
        (paid() ? '<button type="button" class="lnk jgo" data-jgo="ask" data-jask="What else do you want to remember about this week?">Keep going in your journal<span aria-hidden="true">→</span></button>' : '');
    }
    return '<article class="pl-day pl-day--' + d.kind + (done[k] ? ' is-done' : '') + '" data-card="' + k + '">' +
      '<div class="pl-day-h"><p class="pl-day-k"><span class="pl-min">' + (d.kind === 'lookback' ? '5 min' : 'A few minutes') + '</span></p>' + (done[k] ? '<span class="pl-hd-r">' + doneBtn(k) + (openCard[k] ? '<button type="button" class="pl-fold-x" data-fold="' + k + '" aria-label="Fold this away">' + upIcon + '</button>' : '') + '</span>' : '') + '</div>' +
      reply(k) + body + (done[k] ? '' : '<button type="button" class="pl-do" data-done="' + k + '">' + check + '<span>Mark done</span></button>') + '</article>';
  }

  // ---- day 7: shape next week. Their answers are the input for week 2.
  var NEXT = [['keep', 'Keep going'], ['change', 'Change it'], ['done', 'Reached it'], ['pause', 'Pause it']];
  var NEXT_HINT = { keep: 'Anything to add?', change: 'What would make it fit better?', done: 'What did it take? Say it proudly.', pause: 'What needs to happen first?' };
  function nextWeek(p) {
    var n = fb.next['1'] || {}, asks = n.asks || [];
    return '<section class="nx" id="next-week"><p class="pl-k">Shape next week</p><h2 class="lk-t">Tell me how to build week 2</h2>' +
      '<p class="pl-text">Your answers decide what stays, what changes and how much you take on.</p>' +
      p.asks.map(function (a, i) {
        var c = (asks[i] || {}).choice;
        return '<div class="nx-a"><p class="pg-ask"><i>' + (i + 1) + '</i>' + esc(end(a.text)) + '</p>' + chips('data-next', i, NEXT, c, 'ci-o--4') +
          (c ? words('next', '1', 'ask.' + i, NEXT_HINT[c]) : '') + '</div>';
      }).join('') +
      '<div class="nx-a"><p class="fb-q">How was the pace this week?</p>' + chips('data-pace', '1', [['light', 'Too light'], ['right', 'About right'], ['much', 'Too much']], n.pace) + '</div>' +
      '<div class="nx-a">' + words('next', '1', 'want', 'A new goal, a different time of day, more or less help…', 3, 'Anything you want next week to have?') + '</div>' +
      (n.sent
        ? '<p class="nx-ok" role="status">' + check + (plan.tier === 'paid' ? 'Got it. Week 2 is built from exactly this.' : 'Saved. Week 2 comes with the full app, and it’s built from exactly this.') + '</p>'
        : '<button type="button" class="pl-do nx-send" data-nx-send><span>Send it</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>') +
      '</section>';
  }

  // ---- the plan card: their goal(s) and the seven days, on navy
  function strip() {
    // each circle says how the day went: ✓ done, an anchor for done your own way, the skip arrow for skipped on purpose,
    // a dashed ring for a past day with nothing marked
    var LABEL = { kept: 'done', gut: 'skipped on purpose', missed: 'nothing marked', today: 'today', future: 'coming up' };
    return '<div class="ds" role="group" aria-label="Your seven days">' + plan.days.map(function (d) {
      var s = dayState(d), mine = s === 'kept' && mineDay(d);
      return '<button type="button" class="ds-d is-' + s + (mine ? ' is-mine' : '') + (d.day === sel ? ' is-sel' : '') + '" data-view-day="' + d.day + '"' +
        ' aria-label="Day ' + d.day + ', ' + weekday(d.day) + ', ' + (mine ? 'done, your own version' : LABEL[s]) + '"' + (d.day === sel ? ' aria-current="true"' : '') + '>' +
        '<small>' + weekday(d.day, true) + '</small><b>' + (s === 'kept' ? (mine ? anchorIcon : check) : s === 'gut' ? skipIcon : d.day) + '</b></button>';
    }).join('') + '</div>';
  }
  function legend(p) {
    var hasKept = p.days.some(kept), hasGut = p.days.some(function (d) { return dayState(d) === 'gut'; });
    if (!hasKept && !hasGut) return '';
    return '<p class="ds-leg">' + (hasKept ? '<span>' + check + 'done</span>' : '') + (hasGut ? '<span>' + skipIcon + 'gut call</span>' : '') + '</p>';
  }
  function planCard(p) {
    return '<section class="pl-card pl-card--app">' +
      '<p class="pl-card-k"><span class="oh-dot" aria-hidden="true"></span>' + (p.asks.length > 1 ? 'Your goals' : 'Your goal') + '</p>' +
      (p.asks.length === 1
        ? '<p class="pl-ask">“' + esc(end(p.asks[0].text)) + '”</p>'
        : '<ol class="pl-asks">' + p.asks.map(function (a, i) { return '<li><i>' + (i + 1) + '</i><span>' + esc(end(a.text)) + '</span></li>'; }).join('') + '</ol>') +
      strip() + '</section>';
  }

  // ---- what joining opens, said plainly. Membership isn't open yet, so the button says what happens.
  function unlock(what) {
    return '<div class="lk-cta"><button class="lk-btn" type="button" data-unlock>' + lock + '<span>Unlock ' + esc(what) + '</span></button>' +
      '<p class="lk-soon" hidden>The full app opens soon. Founding members get in first, at the best price it will ever be. You’ll hear from me first, at the email your plan went to.</p></div>';
  }
  function lockedCard(kicker, title, text, preview, what) {
    return '<section class="lk"><p class="lk-k">' + lock + esc(kicker) + '</p><h2 class="lk-t">' + esc(title) + '</h2><p class="lk-x">' + esc(text) + '</p>' +
      (preview ? '<div class="lk-peek" aria-hidden="true">' + preview + '</div>' : '') + unlock(what) + '</section>';
  }
  function week2() {
    if (paid()) return nextCard();
    return lockedCard('Week 2', 'Your next week, built from this one', 'What worked stays. What didn’t gets changed. Your second week is shaped by how this one actually went, in your own words.', '', 'week 2');
  }

  // ---- Today
  function todayView(p) {
    var c = cheer();
    var d = p.days[sel - 1];
    var s = dayState(d);
    var many = d.kind === 'step' && d.steps.length > 1;
    var html = '';
    if (T > 7) {
      html += '<section class="td-over"><p class="pl-k">Week one</p><h1 class="td-h">Your week is done.</h1>' +
        '<p class="td-x">' + esc(keptCount(p) === 7 || !c.weekDone ? c.allDone || '' : c.weekDone.replace('{n}', keptCount(p))) + '</p>' +
        (fb.next['1'] && fb.next['1'].sent ? '<a class="yu-link" href="#progress">See your progress<span aria-hidden="true">→</span></a>' : '<button type="button" class="lnk" data-view-day="7">Shape next week →</button>') + '</section>';
    }
    html += planCard(p);
    html += '<header class="td-head"><p class="pl-k">Day ' + sel + ' of 7' + (sel === T ? ' · ' + esc(weekday(sel)) : '') + '</p>' +
      '<h1 class="td-h">' + (sel === T ? 'Today' : esc(weekday(sel))) + '</h1>' +
      (many ? '<p class="pl-sum">' + (st.checkin[sel] === 'half' || st.checkin[sel] === 'rough' ? 'One step today. The smallest comes first.' : d.steps.length + ' steps, one for each goal · ' + d.minutes + ' min in all') + '</p>' : '') +
      (s === 'future' && !REVIEW ? '' : (s === 'missed' && c.missedDay ? '<p class="pl-note">' + esc(c.missedDay) + '</p>' : todayLine(d, many) ? '<p class="pl-note">' + esc(todayLine(d, many)) + '</p>' : c.days && c.days[sel] ? '<p class="pl-note">' + esc(c.days[sel]) + '</p>' : '')) +
      '</header>';

    if (s === 'future' && !REVIEW) {
      return html + '<section class="fut"><p class="fut-k">' + lock + 'Opens ' + esc(weekday(sel)) + '</p>' +
        '<ul class="fut-l fut-l--peek">' + (d.kind === 'step' ? d.steps.map(function (x) { return '<li><b>' + esc(x.title) + '</b><span>' + esc(x.what) + '</span></li>'; }).join('') : '<li><b>' + esc(d.title) + '</b>' + (d.ask ? '<span>' + esc(d.ask) + '</span>' : '') + '</li>') + '</ul>' +
        '<p class="pl-note">' + esc(c.future || '') + '</p>' +
        (T <= 7 ? '<button class="fut-b" type="button" data-view-day="' + T + '"><span aria-hidden="true">‹</span>Back to today</button>' : '') + '</section>';
    }

    if (d.kind === 'step' && st.guide) html += dayBar(d);
    if (!st.guide && d.kind === 'step') {
      html += '<section class="gd"><p class="pl-k">Welcome to your week</p><h2 class="gd-t">Here’s how this works</h2>' +
        '<p class="gd-x">Your goal is the thing you want most right now.</p>' +
        '<ol class="gd-l"><li><b>One day at a time.</b> Today’s step is the only one that matters.</li>' +
        '<li><b>Check in, do your step, then say how it went.</b> That’s the whole loop.</li>' +
        '<li><b>Your words shape next week.</b> Nothing is graded.</li></ol>' +
        '<p class="ci-q">How much help do you want with each step?</p>' +
        '<div class="gd-o" role="radiogroup" aria-label="How much help you want with each step">' +
          '<button type="button" role="radio" aria-checked="false" data-guide="step"><i class="gd-r" aria-hidden="true"></i><span class="gd-b"><b>Just the step</b><span>Short and simple. Extra help is one tap away.</span></span></button>' +
          '<button type="button" role="radio" aria-checked="false" data-guide="walk"><i class="gd-r" aria-hidden="true"></i><span class="gd-b"><b>Walk me through it</b><span>Mini-steps and a real-life example, open under every step.</span></span></button></div>' +
        '<p class="gd-k">You can change this any time in You.</p></section>';
    }
    if (d.kind === 'step') {
      var ci = st.checkin[sel];
      var ciLine = ci && c.checkin ? c.checkin[ci === 'half' && many ? 'halfMany' : ci] : '';
      // answered already (on the welcome screen, or earlier): a settled row with Update, not the question again
      var ciSet = ci && !ciOpen[sel];
      html += '<section class="ci' + (ciSet ? ' ci--set' : '') + '" id="j-ci">' + (ciSet
        ? '<div class="ci-set"><span class="ci-ic" aria-hidden="true">' + wxIcons[ci] + '</span><span class="ci-set-t"><span class="ci-set-k">' + (sel === T ? 'Today' : 'Day ' + sel) + '</span><b>' + { full: 'A good day', half: 'An okay day', rough: 'A hard day' }[ci] + '</b></span>' +
          '<button type="button" class="ci-up" data-ci-up aria-label="Update how ' + (sel === T ? 'today is' : 'that day was') + ' going">Update</button></div>'
        : '<p class="ci-q">' + (sel === T ? 'What kind of day is it?' : 'What kind of day was it?') + '</p><p class="ci-s">Be honest. Your steps adjust to fit.</p>' +
        chips('data-checkin', sel, [['full', STEAM.full], ['half', STEAM.half], ['rough', STEAM.rough]], ci)) +
        (ciLine && !todayLine(d, many) ? '<p class="ci-a">' + esc(ciLine) + '</p>' : '') +
        (ci === 'half' || ci === 'rough' ? words('checkin', sel, 'note', 'Want to tell me what’s going on? It helps shape next week.') : '') +
        (ci === 'rough' && paid() ? '<button type="button" class="lnk jgo" data-jgo="hard">Want to write it out?<span aria-hidden="true">→</span></button>' : '') + '</section>';
      html += '<div id="j-steps" class="pl-steps">' + orderedSteps(d).map(function (x, i) { return stepCard(d, x, many, i); }).join('') + '</div>';
    } else {
      html += wholeDayCard(d);
    }

    // the day kept: their receipt, in one line
    if (kept(d) && d.kind === 'step') {
      html += '<section class="rc" id="j-rc"><p class="fb-q">One line on today</p>' + words('receipt', d.day, 'text', 'One line on what you actually did today.', 2) +
        (paid() ? '<button type="button" class="lnk jgo" data-jgo="free">Write more<span aria-hidden="true">→</span></button>' : '') + '</section>';
    }
    // once, on day 3: is the app easy to use?
    if (sel === 3 && kept(d)) {
      var ap = fb.app.day3 || {};
      html += '<section class="rc"><p class="fb-q">Quick one: is the app easy to use so far?</p>' +
        chips('data-ease', 'day3', [['yes', 'Yes'], ['kind_of', 'Kind of'], ['not_really', 'Not really']], ap.ease) +
        (ap.ease ? words('app', 'day3', 'text', ap.ease === 'yes' ? 'Anything you love, or anything missing?' : 'What’s getting in the way? Tell me plainly.') : '') + '</section>';
    }
    if (d.kind === 'lookback') html += nextWeek(p);

    if (kept(d) && sel === T && T < 7) {
      var nx = p.days[T];
      html += '<section class="tm"><p class="pl-note">' + esc(c.tomorrow || '') + '</p>' +
        '<p class="tm-k">Tomorrow · ' + esc(weekday(T + 1)) + '</p><ul class="fut-l">' + titles(nx).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        (st.nudge.on ? '<p class="tm-n">' + bellIcon + end('Your nudge comes at ' + timeLabel(nudgeTime())) + '</p>' : '') + '</section>';
      html += nudgeOffer();
    }
    if (sel === 7 && kept(d)) html += '<section class="pl-end is-all"><p>' + esc(c.allDone || '') + '</p><img src="/assets/img/signature-jarred.png" width="104" height="50" alt="Jarred"></section>';
    if (T > 7) html += week2();
    return html;
  }

  // ---- each screen opens the same way: a small kicker, a display title, one line under it
  function screenHead(kicker, title, sub) {
    return '<header class="td-head sc-head"><p class="pl-k">' + esc(kicker) + '</p><h1 class="td-h">' + esc(title) + '</h1>' +
      (sub ? '<p class="pl-note">' + esc(sub) + '</p>' : '') + '</header>';
  }
  function fullApp(title, rows) {
    return '<section class="lk"><p class="lk-k">' + lock + 'With the full app</p><h2 class="lk-t">' + esc(title) + '</h2>' +
      '<ul class="lk-rows">' + rows.map(function (r) { return '<li><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></li>'; }).join('') + '</ul>' +
      unlock('the full app') + '</section>';
  }
  function waiting(text) { return '<div class="wait" role="status"><span class="wait-o" aria-hidden="true"></span><p>' + esc(text) + '</p></div>'; }
  function mine(p) { return uniq(p.asks.map(function (a) { return a.protocol; })); }

  // ---- next week (full app): what week 2 is being built from, in their words
  function nextCard() {
    var n = fb.next['1'] || {};
    var asks = plan.asks.map(function (a, i) { return [a, (n.asks || [])[i] || {}]; });
    var LABEL = { keep: 'Keep going', change: 'Change it', done: 'Reached it', pause: 'Pause it' };
    var extra = (st.extraAsks || []).filter(function (x) { return x.status !== 'removed'; });
    if (!n.sent) {
      return '<section class="sc nx-card"><p class="pl-k">Week 2</p><h2 class="lk-t">Built from how this week goes</h2>' +
        '<p class="pl-text">On day 7, you’ll tell me what stays, what changes and how much to take on. Week 2 is built from exactly that.</p>' +
        '<a class="yu-link" href="#today" data-view-day="7">Go to day 7<span aria-hidden="true">→</span></a></section>';
    }
    return '<section class="sc nx-card"><p class="pl-k">Week 2</p><h2 class="lk-t">Being built from your words</h2>' +
      '<ul class="nx-sum">' + asks.map(function (x, i) {
        return '<li><p class="pg-ask"><i>' + (i + 1) + '</i>' + esc(end(x[0].text)) + '</p><span class="pg-ci">' + esc(LABEL[x[1].choice] || 'No answer yet') + '</span>' +
          (x[1].note ? '<p class="nx-note">' + esc(x[1].note) + '</p>' : '') + '</li>';
      }).join('') +
      extra.map(function (x) { return '<li><p class="pg-ask"><i>+</i>' + esc(end(x.text)) + '</p><span class="pg-ci">New goal</span></li>'; }).join('') + '</ul>' +
      (n.pace ? '<p class="nx-pace">Pace: <b>' + esc({ light: 'a little more', right: 'about the same', much: 'a little less' }[n.pace]) + '</b></p>' : '') +
      '<p class="pb-x">Ready on ' + esc(weekday(8)) + '. Your new week opens here.</p></section>';
  }

  // ---- Patterns (full app): what this week says about how they move
  function patterns(p) {
    var ciCount = { full: 0, half: 0, rough: 0 };
    var cols = p.days.map(function (d) {
      var ci = st.checkin[d.day]; if (ci) ciCount[ci]++;
      var s = dayState(d);
      var h = { full: 100, half: 62, rough: 32 }[ci] || 10;
      return '<div class="pt-c is-' + (ci || 'none') + '"><span class="pt-bw"><span class="pt-b" style="height:' + h + '%"></span></span>' +
        '<span class="pt-k">' + (s === 'kept' ? check : s === 'gut' ? skipIcon : '') + '</span><small>' + esc(weekday(d.day, true)) + '</small></div>';
    }).join('');
    var easy = [], hard = [], guts = [];
    p.days.forEach(function (d) {
      if (d.kind !== 'step') return;
      d.steps.forEach(function (s) {
        var k = key(d, s), f = (fb.step[k] || {}).feel, g = fb.skip[k] || {};
        if (f === 'easy') easy.push(s.title);
        if (f === 'hard') hard.push(s.title + ((fb.step[k] || {}).note ? ': “' + fb.step[k].note + '”' : ''));
        if (g.action) guts.push(s.title + ' · ' + (g.action === 'skip' ? 'skipped' : 'changed') + (g.note ? ': “' + g.note + '”' : ''));
      });
    });
    // when they show up: morning before noon, afternoon before 5, evening after
    var when = { Morning: 0, Afternoon: 0, Evening: 0 };
    Object.keys(st.at).forEach(function (k) { var h = new Date(st.at[k]).getHours(); when[h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening']++; });
    var whenTotal = when.Morning + when.Afternoon + when.Evening;
    var top = Object.keys(when).sort(function (a, b) { return when[b] - when[a]; })[0];
    var order = Object.keys(ciCount).sort(function (a, b) { return ciCount[b] - ciCount[a]; });
    var most = ciCount[order[0]] > ciCount[order[1]] ? order[0] : null; // only "mostly" when one clearly leads
    var read = !ciCount.full && !ciCount.half && !ciCount.rough ? 'Check in each day, and your rhythm shows up here.'
      : ciCount.rough >= 2 ? 'You had ' + ciCount.rough + ' hard days, and the small versions kept you going. That’s the method working.'
      : most === 'full' ? 'Mostly good days. Keep the steps small so it stays easy.'
      : most === 'half' ? 'Mostly okay days. That’s real life, and it still counts.'
      : 'A mix of days so far. The plan bends with you, and every version counts.';
    function list(items, empty) { return items.length ? '<ul class="pt-l">' + items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '<p class="pt-e">' + esc(empty) + '</p>'; }
    return '<section class="fs"><p class="pl-k">Patterns</p><h2 class="fs-t">How you moved this week</h2></section>' +
      '<section class="sc pt"><div class="pt-g" role="img" aria-label="Kind of day: ' + ciCount.full + ' good, ' + ciCount.half + ' okay, ' + ciCount.rough + ' hard">' + cols + '</div>' +
        '<p class="pt-leg"><span class="is-full"></span>Good ' + ciCount.full + '<span class="is-half"></span>Okay ' + ciCount.half + '<span class="is-rough"></span>Hard ' + ciCount.rough + '</p>' +
        '<p class="pl-note">' + esc(read) + '</p></section>' +
      '<section class="sc pt-n">' + [['What came easy', easy, 'Mark how steps feel, and the easy ones collect here.'], ['What felt hard', hard, 'Nothing marked hard yet.'], ['Your gut calls', guts, 'No gut calls this week.']].map(function (r) {
        return '<div><p class="pl-k">' + r[0] + '</p>' + list(r[1], r[2]) + '</div>';
      }).join('') + '</section>' +
      '<section class="fs fs--tight"><p class="pl-k">When you show up</p>' +
        (whenTotal ? '<div class="pt-w">' + Object.keys(when).map(function (k) { return '<span' + (k === top ? ' class="is-top"' : '') + '><b>' + when[k] + '</b>' + k + '</span>'; }).join('') + '</div>' +
          '<p class="pl-note">Most of your steps happen in the ' + top.toLowerCase() + '. Plan the hard ones there.</p>'
          : '<p class="pt-e">Mark steps done, and the time of day you tend to show up appears here.</p>') + '</section>' +
      '<section class="pt-soon"><p class="pl-k">Over the weeks</p><p class="pl-text">Week-over-week trends start after week 2, and a look back every month after week 4.</p></section>';
  }

  // ---- Progress
  function progressView(p) {
    var c = cheer();
    var n = keptCount(p);
    var steps = 0, mins = 0, feel = { easy: 0, okay: 0, hard: 0 }, guts = 0;
    p.days.forEach(function (d) {
      if (d.kind === 'step') d.steps.forEach(function (s) {
        var k = key(d, s);
        if (done[k]) { steps++; mins += s.minutes; }
        var f = (fb.step[k] || {}).feel; if (f) feel[f]++;
        if ((fb.skip[k] || {}).action) guts++;
      });
      else if (done[key(d)]) mins += d.minutes || 0;
    });
    var cis = Object.keys(st.checkin).length;
    var bar = p.days.map(function (d) { return '<i class="' + (kept(d) ? 'on' : '') + '"></i>'; }).join('');
    var asks = p.asks.map(function (a, i) {
      var total = 0, got = 0;
      p.days.forEach(function (d) { if (d.kind === 'step') d.steps.forEach(function (s) { if (s.ask === i) { total++; if (done[key(d, s)]) got++; } }); });
      return '<li><p class="pg-ask"><i>' + (i + 1) + '</i>' + esc(end(a.text)) + '</p>' +
        '<div class="pg-meter" role="img" aria-label="' + got + ' of ' + total + ' steps"><i style="width:' + (total ? Math.round(got / total * 100) : 0) + '%"></i></div>' +
        '<p class="pg-sub">' + got + ' of ' + total + ' steps' + (a.otherHalf ? ' · Building ' + esc(a.otherHalf.toLowerCase()) : '') + '</p></li>';
    }).join('');
    var rows = p.days.map(function (d) {
      var s = dayState(d), ci = st.checkin[d.day];
      return '<li><button type="button" class="pg-row is-' + s + '" data-view-day="' + d.day + '">' +
        '<span class="pg-dot">' + (s === 'kept' ? (mineDay(d) ? anchorIcon : check) : s === 'gut' ? skipIcon : d.day) + '</span>' +
        '<span class="pg-t"><small>Day ' + d.day + ' · ' + esc(weekday(d.day)) + '</small>' + esc(titles(d).join(' · ')) + '</span>' +
        (s === 'gut' ? '<span class="pg-ci">Gut call</span>' : ci ? '<span class="pg-ci">' + STEAM[ci] + '</span>' : '<span></span>') + '<span class="pg-go" aria-hidden="true">›</span></button></li>';
    }).join('');
    var theirs = p.days.map(function (d) {
      var bits = [];
      var r = (fb.receipt[d.day] || {}).text; if (r && r.trim()) bits.push(r);
      var nt = (fb.note[d.day] || {}).text; if (nt && nt.trim()) bits.push(nt);
      if (d.kind === 'lookback') { var lb = fb.lookback['1'] || {}; ['did', 'changed', 'keep'].forEach(function (f) { if (lb[f] && lb[f].trim()) bits.push(lb[f]); }); }
      return bits.length ? '<li><p class="pg-nk">Day ' + d.day + ' · ' + esc(weekday(d.day)) + '</p>' + bits.map(function (b) { return '<p class="pg-nt">' + esc(b) + '</p>'; }).join('') + '</li>' : '';
    }).join('');
    var felt = feel.easy + feel.okay + feel.hard + guts;
    return screenHead('Week one', 'Progress', T <= 7 ? 'Day ' + Math.min(T, 7) + ' of 7 · ' + weekday(Math.min(T, 7)) : 'All seven days are open to look back on.') +
      '<section class="sc pg-hero"><p class="pg-n"><b>' + n + '</b> of 7 days done</p>' +
        '<div class="pg-bar" aria-hidden="true">' + bar + '</div>' + (c.progress && c.progress[n] ? '<p class="pl-note">' + esc(c.progress[n]) + '</p>' : '') + '</section>' +
      '<section class="pg-stats"><div><b>' + steps + '</b><span>steps done</span></div><div><b>' + mins + '</b><span>minutes spent</span></div><div><b>' + cis + '</b><span>check-ins</span></div></section>' +
      (felt ? '<section class="sc"><p class="pl-k">How it felt</p><div class="pg-feel">' +
        [['Easy', feel.easy], ['Okay', feel.okay], ['Hard', feel.hard], ['Skipped or changed', guts]].map(function (x) { return '<span' + (x[1] ? '' : ' class="is-zero"') + '><b>' + x[1] + '</b>' + x[0] + '</span>'; }).join('') + '</div></section>' : '') +
      '<section class="sc"><p class="pl-k">' + (p.asks.length > 1 ? 'Your goals' : 'Your goal') + '</p><ul class="pg-asks">' + asks + '</ul></section>' +
      '<section class="sc-plain"><p class="pl-k">The week at a glance</p><ol class="pg-week">' + rows + '</ol></section>' +
      (theirs ? '<section class="sc"><p class="pl-k">In your words</p><ul class="pg-notes">' + theirs + '</ul></section>' : '') +
      (paid() ? patterns(p) + nextCard() : fullApp('Keep going past week one', [
        ['Your patterns', 'Which days go best and which steps stick, week over week, with a look back every month.'],
        ['Week 2', 'Your next week, built from how this one went, in your own words.']
      ]));
  }

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
    var stops = [['Where to start', x.start], ['Going deeper', x.deeper], ['When it’s done', x.done]].filter(function (s) { return s[1]; });
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

  // ---- You: one navy card for who they are, then content that floats, and one card for settings
  function youView(p) {
    var link = p.r ? '/app/?r=' + encodeURIComponent(p.r) + '#result' : '/app/';
    var full = paid();
    var extra = (st.extraAsks || []).map(function (x, i) { return [x, i]; }).filter(function (x) { return x[0].status !== 'removed'; });
    var total = p.asks.length + extra.length;
    var addBox = !addOpen ? '' : full
      ? '<div class="yu-addb"><label class="fb-l" for="new-ask">A new goal, in your words</label><div class="yu-addr"><input id="new-ask" class="fb-t" type="text" maxlength="200" placeholder="e.g. Sleep by 11 p.m." autocomplete="off"><button type="button" class="send-btn" data-ask-add>Add</button></div>' +
        '<p class="yu-focus' + (total >= 3 ? ' is-strong' : '') + '">' + esc(p.focus || '') + '</p><p class="pt-e">New goals start with next week’s plan.</p></div>'
      : '<div class="yu-addb"><p class="pl-text">' + esc(p.focus || '') + '</p>' + unlock('more goals') + '</div>';
    return screenHead('Your profile', 'You', '') +
      '<section class="pl-card pl-card--app yu-card"><p class="pl-card-k"><span class="oh-dot" aria-hidden="true"></span>Your type</p>' +
        '<p class="yu-type">' + esc(p.typeName) + '</p>' +
        (others(p) ? '<p class="pl-meta">What you’re building: <b>' + esc(others(p)) + '</b></p>' : '') +
        '<a class="yu-link" href="' + link + '">Read your full result<span aria-hidden="true">→</span></a></section>' +
      '<section class="fs"><p class="pl-k">' + (total > 1 ? 'Your goals' : 'Your goal') + '</p>' +
        '<ol class="yu-asks">' + p.asks.map(function (a, i) { return '<li><i>' + (i + 1) + '</i><span>' + esc(end(a.text)) + '</span></li>'; }).join('') +
        extra.map(function (x, n) { return '<li class="is-new"><i>' + (p.asks.length + n + 1) + '</i><span>' + esc(end(x[0].text)) + '<em>Starts next week</em></span><button type="button" class="lnk" data-ask-remove="' + x[1] + '" aria-label="Remove ' + esc(x[0].text) + '">Remove</button></li>'; }).join('') + '</ol>' +
        '<button type="button" class="yu-add" data-add-ask aria-expanded="' + addOpen + '"><span class="yu-plus" aria-hidden="true">+</span><span class="yu-add-l">Add a goal</span>' + (full ? '' : '<span class="yu-tag">' + lock + 'Full app</span>') + '</button>' + addBox + '</section>' +
      '<section class="fs"><p class="pl-k">This week</p><blockquote class="yu-read">' + esc(p.read) + '</blockquote>' +
        (p.asks.some(function (a) { return a.focus; }) ? '<div class="yu-from"><span>From the playbook</span>' +
          uniq(p.asks.map(function (a) { return a.focus && a.protocol ? a.protocol + '|' + a.focus : ''; })).map(function (x) { var y = x.split('|'); return '<a href="#playbook/' + esc(y[0]) + '">' + esc(y[1]) + '</a>'; }).join('') + '</div>' : '') + '</section>' +
      '<section class="fs"><p class="pl-k">How this week works</p><ul class="pl-how">' + p.how.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="sc set"><p class="pl-k">Settings</p><div class="set-r"><p class="set-l">How much help do you want with each step?</p>' +
        '<div class="gd-o set-o" role="radiogroup" aria-label="How much help you want with each step">' + [['step', 'Just the step', 'Short and simple. Extra help is one tap away.'], ['walk', 'Walk me through it', 'Mini-steps and a real-life example, open under every step.']].map(function (o) {
          var on = (st.guide === 'walk' ? 'walk' : 'step') === o[0];
          return '<button type="button" role="radio" aria-checked="' + on + '" data-guide="' + o[0] + '"><i class="gd-r" aria-hidden="true"></i><span class="gd-b"><b>' + o[1] + '</b><span>' + o[2] + '</span></span></button>';
        }).join('') + '</div></div>' + nudgeRow() + '</section>' + installCard() +
      '<section class="fs"><p class="pl-k">Help us improve the app</p><p class="sc-q">Tell us what’s confusing, missing or great. We read every note, and it’s how we decide what to make better next.</p>' +
        '<div class="nt"><textarea class="fb-t" id="app-note" rows="3" aria-label="Your feedback on the app" placeholder="What would make Other Half better for you?"></textarea></div>' +
        '<button type="button" class="send-btn sc-send" data-app-send>Send<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        (appThanks ? '<p class="nx-ok" role="status">' + check + 'Thank you. We read every note, and yours helps shape what we improve next.</p>' : '') + '</section>' +
      (full ? '<section class="fs"><p class="pl-k">Your access</p><p class="pl-text"><b>Full app.</b> Every play, your patterns, a new plan every week, and as many goals as you want.</p></section>'
        : fullApp('Your plan is free. There’s more.', [
          ['The whole playbook', 'All the plays, any time.'],
          ['Your patterns', 'What works for you, week over week.'],
          ['A new plan every week', 'Built from your own words.'],
          ['More goals', 'As many as you want, at your pace.']
        ]));
  }

  // ---- Journal (full app): a private place to write more, a line or pages. Home is what to write and everything
  // written, by week; writing and reading each get their own page. Their own entries, plus everything they've written
  // in the plan, gathered in. Kept on this device until sign-in exists, and never sent as feedback: no one reads it but them.
  // view: home | write | edit | read. pend carries "saved" and the safety check across a page change.
  var J = { view: 'home', id: null, edit: false, del: false, saved: null, warn: false, wipe: false, discard: false, f: 'all', q: '', focus: false, from: null, pend: null, homeY: 0 };
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
  var penIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16l.75-3.25 8.5-8.5a1.6 1.6 0 012.25 0l.25.25a1.6 1.6 0 010 2.25l-8.5 8.5L4 16z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  var lineIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 7.5h12M4 12.5h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var letterIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="5" width="14" height="10.5" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3.75 6.25L10 11l6.25-4.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
    if (s && !(talk && talk.on)) {
      clearTimeout(s._t); s.classList.remove('on'); s.textContent = 'Saving…';
      s._t = setTimeout(function () { s.innerHTML = navigator.onLine ? check + (J.view === 'edit' ? 'Saved' : 'Draft saved') : check + 'Saved on this phone'; s.classList.add('on'); }, 600);
    }
  }
  function tagsFor(e) {
    var pin = (st.jmeta[e.id] || {}).pin;
    return (pin ? '<span class="je-tag">' + pinIcon + 'Pinned</span>' : '') + (isPersonal(e) ? '<span class="je-tag">' + lock + 'Personal</span>' : '');
  }

  // talk instead of type: a round mic beside Save; while it listens, the line under the sheet says so
  function talkBtn() {
    var on = !!(talk && talk.on);
    return '<button type="button" class="jw-mic' + (on ? ' is-on' : '') + '" data-jtalk aria-pressed="' + on + '" aria-label="' + (on ? 'Stop talking' : 'Talk instead of type') + '">' + micIcon + '</button>';
  }

  // ---- Journal home: what to write today, any draft in progress, then everything written, by week
  function jHome(p) {
    var d = draft(), all = allEntries(p), list = all.filter(passes);
    var hasDraft = !!((d.text || '').trim() || (d.title || '').trim());
    var draftCard = !hasDraft ? '' : '<section class="sc jd"><p class="pl-k">Your draft</p>' +
      (d.title ? '<p class="jd-t">' + esc(d.title) + '</p>' : '') + (d.text ? '<p class="jd-x">' + esc(oneLine(d.text)) + '</p>' : '') +
      '<p class="jd-m">' + esc(modeName(d.mode)) + ' · ' + wcLabel(wc(d.text)) + ' · saved as you write</p>' +
      (J.discard
        ? '<div class="je-del" role="alert"><p class="fb-q">Throw away this draft?</p><p class="pt-e">It can’t be brought back.</p><div class="je-del-r"><button type="button" class="je-del-b" data-jdiscard-yes>' + binIcon + 'Throw it away</button><button type="button" class="lnk" data-jdiscard-no>Keep it</button></div></div>'
        : '<div class="jd-r"><button type="button" class="pl-do" data-jgo="draft">' + editIcon + '<span>Keep writing</span></button><button type="button" class="lnk lnk--quiet" data-jdiscard>Throw away</button></div>') + '</section>';
    var start = '<section class="sc jstart"><p class="pl-k">Today’s prompt</p><p class="jw-q">' + esc(curPrompt()) + '</p>' +
      '<button type="button" class="lnk jnext" data-jnext>' + againIcon + 'Another one</button>' +
      '<button type="button" class="pl-do" data-jgo="prompt">' + editIcon + '<span>Start writing</span></button>' +
      '<div class="jways"><p class="fb-l">Or write your own way</p><div class="jways-r">' +
        [['free', 'Free write', penIcon], ['quick', 'Quick line', lineIcon], ['letter', 'Letter', letterIcon]].map(function (w) {
          return '<button type="button" class="jway" data-jgo="' + w[0] + '">' + w[2] + '<span>' + w[1] + '</span></button>';
        }).join('') + '</div></div></section>';
    return screenHead('Your words', 'Journal', 'A private place to write, a line or pages.') +
      (J.saved ? '<p class="nx-ok jw-ok" role="status">' + check + 'Saved to your journal.</p>' : '') + (J.warn ? safeCard() : '') +
      // one draft at a time: while there is one, it's the way back in
      (hasDraft ? draftCard : start) +
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

  // ---- talk instead of type: the browser's own speech-to-text, where there is one
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var talk = null;
  function sentence(t) { t = t.trim(); if (!t) return ''; t = t.charAt(0).toUpperCase() + t.slice(1); return /[.!?]$/.test(t) ? t : t + '.'; }
  function paintTalk() {
    var b = root.querySelector('[data-jtalk]'); if (b) b.outerHTML = talkBtn();
    var s = root.querySelector('#jw-st'), on = !!(talk && talk.on);
    if (s) { s.textContent = on ? 'Listening. Tap the mic to stop.' : s.getAttribute('data-rest'); s.classList.toggle('is-live', on); }
  }
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
      putWords('body', ta.value); grow(ta);
    };
    rec.onerror = function (e) {
      var why = e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'The mic is off for this site. Turn it on in your browser settings, or tap the mic on your keyboard.'
        : e.error === 'no-speech' || e.error === 'aborted' ? '' : 'Talking isn’t working in this browser right now. Tap the mic on your keyboard instead.';
      if (why) { talkStop(why); if (tab === 'journal' && (J.view === 'write' || J.view === 'edit')) render(); }
    };
    // a pause ends the browser's listening; pick up again until they tap stop
    rec.onend = function () { if (talk && talk.rec === rec && talk.on) { begin(); try { rec.start(); } catch (x) { talkStop(); paintTalk(); } } };
    talk = { rec: rec, on: true };
    try { rec.start(); } catch (x) { talkStop('Talking isn’t working in this browser right now. Tap the mic on your keyboard instead.'); }
  }

  // ---- on their phone: Add to Home Screen, and a daily nudge at the time they usually show up.
  // Push where the phone allows it (Android, or iPhone once it's on the Home Screen); a calendar reminder otherwise.
  // The nudge is skipped on any day they've already done their step (the server is told when they mark one done).
  var IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var ANDROID = /Android/i.test(navigator.userAgent);
  var menuIcon = '<svg class="nd-share" viewBox="0 0 20 20" aria-label="the menu button"><circle cx="10" cy="4.5" r="1.6" fill="currentColor"/><circle cx="10" cy="10" r="1.6" fill="currentColor"/><circle cx="10" cy="15.5" r="1.6" fill="currentColor"/></svg>';
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
    // review: ?nudge=home | calendar | denied shows that path (an iPhone in Safari, no push, notifications blocked);
    // otherwise review on localhost shows the "on" state. Nothing is sent in review.
    var force = REVIEW && params.get('nudge');
    if (force && /^(home|calendar|denied)$/.test(force)) { ND.show = force; render(); return; }
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
    // matches Safari as it is now: ••• opens a menu with Share at the top, and Add to Home Screen lives in the Share
    // sheet, a short scroll down. Older iPhones have Share right in the toolbar.
    return '<ol class="nd-steps"><li>In Safari, tap <b>•••</b> and then <b>Share</b> ' + shareIcon + ', or tap Share right in the toolbar if you see it there.</li>' +
      '<li>Scroll down a little and tap <b>Add to Home Screen</b>, then <b>Add</b>.</li>' +
      '<li>Open Other Half from your Home Screen' + (forNudges ? ' and turn on your nudge in You.' : ', and it opens full screen like any app.') + '</li></ol>';
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
    return '<div class="nd-help"><p class="fb-q">Your calendar can do the nudging.</p><p class="pt-e">' + end('One reminder a day at ' + t + (paid() ? '' : ', through the end of your week')) + ' Your calendar opens to add it.</p>' + cal + '</div>';
  }
  function timeField(where) {
    return '<label class="nd-t"><span>' + bellIcon + 'At</span><input type="time" class="nd-time" data-nd-time value="' + nudgeTime() + '" aria-label="Nudge time"></label>';
  }
  // You → Settings: the switch, the time, and what happens next
  function nudgeRow() {
    if (!paid() && T > 7) return '';
    var n = st.nudge || {}, on = !!n.on, t = nudgeTime();
    var sub = on ? end((n.via === 'calendar' ? 'In your calendar at ' : 'On this phone at ') + timeLabel(t)) + ' Skipped on days you’ve already done your step.'
      : 'One gentle reminder a day. Skipped on days you’ve already done your step.';
    var usual = !on && Object.keys(st.at).length ? '<p class="pt-e">' + end('You usually show up in the ' + partOfDay(usualTime()) + ', around ' + timeLabel(usualTime())) + '</p>' : '';
    return '<div class="set-r nd">' +
      '<button type="button" class="je-sw" role="switch" aria-checked="' + on + '" data-nd-toggle' + (ND.busy ? ' aria-busy="true"' : '') + '><span class="je-sw-t"><b>A daily nudge</b><span>' + esc(sub) + '</span></span><i class="je-sw-i" aria-hidden="true"></i></button>' +
      timeField('you') + usual + nudgeHelp('you') +
      (ND.just && ND.where === 'you' ? '<p class="nx-ok" role="status">' + check + end('Nudges are on for ' + timeLabel(t)) + '</p>' : '') + '</div>';
  }
  // Today, once, after a step on days 1 to 3: the moment a reminder helps most
  function nudgeOffer() {
    var n = st.nudge || {};
    if (ND.just && ND.where === 'today') return '<section class="sc nd-offer"><p class="nx-ok" role="status">' + check + end('Nudges are on for ' + timeLabel(nudgeTime())) + ' Change it any time in You.</p></section>';
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
    if (standalone()) return '';
    // on a computer: how to get it onto their phone, for iPhone and Android
    if (!installEvt && !IOS && !TOUCH) {
      return '<section class="sc in-card"><p class="pl-k">On your phone</p><h2 class="lk-t">Put Other Half on your phone</h2>' +
        '<p class="pl-text">It’s at its best as an app on your phone, opening with one tap, full screen, right where your day happens.</p>' +
        '<ol class="nd-steps"><li>Open this page in your phone’s browser.</li>' +
        '<li><b>On iPhone</b>, tap <b>•••</b> in Safari, then <b>Share</b> ' + shareIcon + ', scroll down a little and tap <b>Add to Home Screen</b>.</li>' +
        '<li><b>On Android</b>, tap the menu ' + menuIcon + ' and choose <b>Add to Home Screen</b> or <b>Install app</b>.</li></ol></section>';
    }
    return '<section class="sc in-card"><p class="pl-k">On your phone</p><h2 class="lk-t">Put Other Half on your Home Screen</h2>' +
      '<p class="pl-text">Open it with one tap, full screen, just like your other apps.' + (IOS ? ' On iPhone, it’s also how your daily nudge reaches you.' : '') + '</p>' +
      (installEvt ? '<button type="button" class="pl-do" data-install>' + homeIcon + '<span>Add to Home Screen</span></button>'
        : IOS ? homeSteps(false)
        : '<ol class="nd-steps"><li>' + (ANDROID ? 'Tap your browser’s menu ' + menuIcon + ' at the top right.' : 'Open your browser’s menu.') + '</li>' +
          '<li>Choose <b>Add to Home Screen</b> or <b>Install app</b>.</li></ol>') + '</section>';
  }

  // ---- the welcome: a breather before the day. Once a day, the first time the app opens: a sky that follows the time
  // of day, a greeting, a line for the day, a quote, and one warm question. The answer is the day's check-in.
  // Review: ?welcome=1 shows it again, ?sky=morning|afternoon|evening|night picks the sky.
  var welcomeSeen = false, wlPlayed = false;
  var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ciOpen = {}, ciTimer = null; // days whose check-in question is open on Today (answered here, or Update tapped)
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
    // said the way a friend would: short and warm, with their name once we know it
    var hello = p.name
      ? { morning: 'Morning, ', afternoon: 'Hey, ', evening: 'Evening, ', night: 'Hey, ' }[part] + p.name + '.'
      : { morning: 'Morning.', afternoon: 'Hey there.', evening: 'Evening.', night: 'Hey, night owl.' }[part];
    // three quotes for the day, different each day of the week; they take turns in the same panel
    var quotes = w.quotes || [], qn = quotes.length, qset = [];
    if (qn) [0, 3, 6].forEach(function (o) { var q = quotes[(T - 1 + o) % qn]; if (qset.indexOf(q) < 0) qset.push(q); });
    var ask = (w.ask || 'How’s today treating you?').replace(/\?$/, (p.name ? ', ' + p.name : '') + '?');
    var reply = ci && w.today ? w.today[ci === 'half' && many ? 'halfMany' : ci] : '';
    var date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    var arrowIcon = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    // the week so far: a dot per day, filled when it's done, ringed for today
    var week = p.days.map(function (x, n) { var s = dayState(x); return '<i class="' + (s === 'kept' ? 'is-done' : x.day === T ? 'is-now' : '') + '" style="--i:' + n + '"></i>'; }).join('');
    // a few motes of light drifting up through the sky (fixed, not random, so every visit feels the same)
    var motes = '';
    for (var m = 0; m < 9; m++) motes += '<i class="wl-mote" style="--x:' + ((m * 37 + 11) % 92 + 4) + '%;--s:' + (2 + (m * 7) % 3) + 'px;--t:' + (13 + (m * 5) % 9) + 's;--dl:-' + ((m * 3.7) % 13).toFixed(1) + 's"></i>';
    // the entrance plays once; picking an answer re-renders without replaying it
    return '<section class="wl wl--' + part + (wlPlayed ? ' is-on' : '') + '" aria-labelledby="wl-hi">' +
      '<div class="wl-sky" aria-hidden="true"><i class="wl-glow"></i><i class="wl-rays"></i><i class="wl-sun"></i>' + (part === 'night' ? '<i class="wl-stars"></i><i class="wl-stars wl-stars--b"></i>' : '') +
        '<i class="wl-cloud wl-c1"></i><i class="wl-cloud wl-c2"></i><i class="wl-cloud wl-c3"></i><i class="wl-hz"></i>' + motes + '</div>' +
      '<header class="wl-top"><p class="wl-date wl-in" style="--d:0">' + esc(date) + '</p>' +
        '<p class="wl-week wl-in" style="--d:1" role="img" aria-label="Day ' + T + ' of 7">' + week + '</p>' +
        '<h1 class="wl-hi" id="wl-hi">' + hello.split(' ').map(function (x, n) { return '<span class="wl-w" style="--w:' + n + '">' + esc(x) + '</span>'; }).join(' ') + '</h1>' +
        '<p class="wl-line wl-in" style="--d:3">' + esc((w.days || [])[T - 1] || w.later || '') + '</p></header>' +
      (qset.length ? '<figure class="wl-q wl-in" style="--d:4"><div class="wl-qs">' + qset.map(function (q, n) {
        return '<div class="wl-qi' + (n ? '' : ' is-on') + '"' + (n ? ' aria-hidden="true"' : '') + '><blockquote>' + esc(q.q) + '</blockquote><figcaption>' + esc(q.by) + '</figcaption></div>';
      }).join('') + '</div></figure>' : '') +
      '<div class="wl-card wl-in" style="--d:5"><p class="wl-ask" id="wl-ask">' + esc(ask) + '</p>' +
        '<div class="wl-o" role="radiogroup" aria-labelledby="wl-ask">' + [['full', STEAM.full], ['half', STEAM.half], ['rough', STEAM.rough]].map(function (o) {
          return '<button type="button" role="radio" aria-checked="' + (ci === o[0]) + '" data-wl="' + o[0] + '"><span class="wl-ic">' + wxIcons[o[0]] + '</span><span>' + o[1] + '</span><i class="wl-ok" aria-hidden="true">' + check + '</i></button>';
        }).join('') + '</div>' +
        (ci ? '<p class="wl-reply" role="status">' + esc(reply) + '</p><button type="button" class="pl-do wl-go" data-wl-go><span>' + esc(w.go || 'Let’s go') + '</span>' + arrowIcon + '</button>'
          : '<button type="button" class="lnk wl-skip" data-wl-skip>Straight to today</button>') +
      '</div></section>';
  }
  // answering is the way in: the pick lands (it lifts, the others recede), then the welcome gives way to Today. Where
  // the browser can, the chosen icon travels to Today's check-in row while the welcome zooms softly away and Today rises.
  var wlLeaving = false;
  function pickWelcome(o, btn) {
    if (wlLeaving) return;
    st.checkin[T] = o; sync('checkin', T, true);
    var sec = root.querySelector('.wl');
    if (!sec) { render(); return; }
    [].forEach.call(sec.querySelectorAll('[data-wl]'), function (b) { b.setAttribute('aria-checked', String(b === btn)); b.classList.remove('is-press'); });
    sec.classList.remove('is-idle'); sec.classList.add('is-on', 'is-picked');
    wlLeaving = true;
    setTimeout(function () { leaveWelcome(btn); }, calm ? 0 : 620);
  }
  // the day's quotes take turns: every 7 seconds one softens out and the next comes into focus
  var wlQTimer = 0;
  function wlQuotes() {
    clearInterval(wlQTimer);
    wlQTimer = setInterval(function () {
      var sec = root.querySelector('.wl'), items = sec ? sec.querySelectorAll('.wl-qi') : [];
      if (!sec || sec.classList.contains('is-picked') || sec.classList.contains('is-out')) { if (!sec) clearInterval(wlQTimer); return; }
      if (items.length < 2 || document.hidden) return;
      var cur = 0; [].forEach.call(items, function (x, n) { if (x.classList.contains('is-on')) cur = n; });
      var next = (cur + 1) % items.length;
      items[cur].classList.remove('is-on'); items[cur].setAttribute('aria-hidden', 'true');
      items[next].classList.add('is-on'); items[next].removeAttribute('aria-hidden');
    }, 7000);
  }
  // a screen's parts rise into place one after another (check-in row only fades, so its icon can land from the welcome)
  function riseIn(dur, base, step) {
    if (calm || !root.animate) return;
    [].forEach.call(root.children, function (c, i) {
      var kf = c.id === 'j-ci' ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(1.25rem)' }, { opacity: 1, transform: 'none' }];
      c.animate(kf, { duration: dur, delay: base + Math.min(i, 7) * step, easing: 'cubic-bezier(.25,.1,.25,1)', fill: 'backwards' });
    });
  }
  function enterToday() { riseIn(800, 120, 80); }
  // changing days: the hero card holds still, its highlight glides to the new day, and the day's content slides in from
  // the side you moved toward (a later day from the right, an earlier one from the left)
  function dayGlide(r0, prevSel) {
    if (calm || !r0 || prevSel === sel || !root.animate) return;
    var ns = root.querySelector('.ds-d.is-sel'); if (!ns) return;
    var ds = ns.parentNode, r1 = ns.getBoundingClientRect(), rp = ds.getBoundingClientRect();
    var pill = document.createElement('i'); pill.className = 'ds-glide'; pill.setAttribute('aria-hidden', 'true');
    pill.style.cssText = 'left:' + (r1.left - rp.left) + 'px;top:' + (r1.top - rp.top) + 'px;width:' + r1.width + 'px;height:' + r1.height + 'px';
    ds.appendChild(pill); ns.classList.add('is-gliding');
    var g = pill.animate([{ transform: 'translateX(' + (r0.left - r1.left) + 'px)' }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.45,0,.2,1)' });
    g.onfinish = g.oncancel = function () { ns.classList.remove('is-gliding'); if (pill.parentNode) pill.parentNode.removeChild(pill); };
    var dir = sel > prevSel ? 1 : -1, i = 0;
    [].forEach.call(root.children, function (c) {
      if (c.classList.contains('pl-card')) return;
      c.animate([{ opacity: 0, transform: 'translateX(' + dir * 1.5 + 'rem)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: Math.min(i++, 6) * 40, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'backwards' });
    });
  }
  function leaveWelcome(btn) {
    var go = function () { st.welcomed = welcomeKey(); welcomeSeen = true; save(); sel = T; render(); window.scrollTo(0, 0); };
    var sec = root.querySelector('.wl');
    wlLeaving = true;
    if (calm || !sec) { go(); wlLeaving = false; return; }
    if (document.startViewTransition) {
      var ic = btn && btn.querySelector('.wl-ic'), to = null;
      if (ic) ic.style.viewTransitionName = 'wl-mood';
      document.documentElement.classList.add('vt-welcome');
      var vt = document.startViewTransition(function () {
        go(); enterToday();
        to = ic && root.querySelector('.ci-ic');
        if (to && to.getBoundingClientRect().top < window.innerHeight - 48) to.style.viewTransitionName = 'wl-mood'; else to = null;
      });
      var done = function () { document.documentElement.classList.remove('vt-welcome'); if (to) to.style.viewTransitionName = ''; wlLeaving = false; };
      vt.finished.then(done, done);
      return;
    }
    sec.classList.add('is-out');
    setTimeout(function () { go(); enterToday(); wlLeaving = false; }, 420);
  }

  // touch on the welcome: a pressed tile leans toward the finger with a little light under it
  function wlPress(b, e) {
    var r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    b.style.setProperty('--tx', ((x - .5) * 2).toFixed(3)); b.style.setProperty('--ty', ((y - .5) * 2).toFixed(3));
    b.style.setProperty('--mx', Math.round(x * 100) + '%'); b.style.setProperty('--my', Math.round(y * 100) + '%');
  }
  root.addEventListener('pointermove', function (e) {
    if (!document.body.classList.contains('is-welcome')) return;
    var b = e.target.closest && e.target.closest('.wl-o button');
    if (b && b.classList.contains('is-press')) wlPress(b, e);
  });
  root.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.wl-o button'); if (!b || calm || wlLeaving) return;
    wlPress(b, e); b.classList.add('is-press');
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
    root.addEventListener(ev, function (e) { var b = e.target.closest && e.target.closest('.wl-o button'); if (b) { b.classList.remove('is-press'); if (ev !== 'pointerup') { b.style.setProperty('--tx', 0); b.style.setProperty('--ty', 0); } } }, true);
  });


  function render() {
    if (!plan) return;
    // once a day, a breather before Today
    var wl = needWelcome();
    document.body.classList.toggle('is-welcome', wl);
    if (wl) { var firstWl = !wlPlayed; root.innerHTML = welcomeView(plan); wlPlayed = true; nav.hidden = true;
      if (firstWl && !calm) wlQuotes();
      if (firstWl && !st.checkin[T] && !calm) setTimeout(function () { var sec = root.querySelector('.wl'); if (sec && !sec.classList.contains('is-picked')) sec.classList.add('is-idle'); }, 5200); root.classList.remove('is-writing'); return; }
    var views = { today: todayView, progress: progressView, playbook: playbookView, journal: journalView, you: youView };
    var was = {};
    root.querySelectorAll('details[data-l]').forEach(function (x) { was[x.getAttribute('data-l')] = x.open; });
    root.innerHTML = views[tab](plan);
    if (keepLayers) root.querySelectorAll('details[data-l]').forEach(function (x) { var v = was[x.getAttribute('data-l')]; if (v !== undefined) x.open = v; });
    keepLayers = true;
    root.querySelectorAll('.fb-t, .jw-t').forEach(grow);
    if (tab === 'journal') { jSearch(); barStuck(); }
    // writing gets the whole screen: no tab bar, and room under the words so the line being written sits mid-screen
    var writing = tab === 'journal' && (J.view === 'write' || J.view === 'edit') && !!paid();
    root.classList.toggle('is-writing', writing);
    nav.hidden = writing;
    nav.classList.toggle('is-full', !!paid());
    nav.querySelectorAll('[data-tab]').forEach(function (b) {
      if (b.getAttribute('data-tab') === tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
  }
  function go(t, scroll) {
    var parts = String(t || '').split('/');
    t = parts[0] === 'week' ? 'today' : parts[0];
    tab = TABS.indexOf(t) >= 0 ? t : 'today';
    pbId = tab === 'playbook' ? parts[1] || null : null;
    said = null; appThanks = false;
    // the journal's own pages: #journal, #journal/write, #journal/edit/<id>, #journal/e/<id>
    var wasHome = J.view === 'home' && J.tab === 'journal';
    if (wasHome) J.homeY = window.scrollY;
    var jv = tab === 'journal' ? parts[1] || '' : '';
    var backHome = wasHome === false && J.view === 'read' && J.tab === 'journal' && !jv;
    J.tab = tab;
    J.view = { write: 'write', edit: 'edit', e: 'read' }[jv] || 'home';
    J.id = J.view === 'edit' || J.view === 'read' ? decodeURIComponent(parts[2] || '') : null;
    var pend = J.pend || {}; J.pend = null;
    J.saved = pend.saved || null; J.warn = !!pend.warn; J.edit = J.del = J.wipe = J.discard = false;
    if (tab !== 'journal') J.q = '';
    if (J.view !== 'write') J.from = null;
    if (J.view !== 'write' && J.view !== 'edit') talkStop();
    ND.show = null; ND.just = false;
    fresh = {}; hold = {}; openCard = {};
    var write = (J.view === 'write' || J.view === 'edit') && J.focus;
    J.focus = false;
    render();
    if (write) { var ta = root.querySelector('#jw-t'); if (ta) { window.scrollTo(0, 0); ta.focus({ preventScroll: true }); var n = ta.value.length; try { ta.setSelectionRange(n, n); } catch (x) { /* fine */ } return; } }
    // back from reading an entry: land where they were in the list
    if (backHome && !J.saved) { window.scrollTo(0, J.homeY || 0); return; }
    if (scroll) window.scrollTo(0, 0);
  }
  // moving between screens feels like the welcome opening into Today: the old screen fades as the new one fades in
  // (header and tab bar stay still), then the new screen's parts rise into place one after another
  function navTo(h) {
    var run = function () { go(h, true); if (!document.body.classList.contains('is-welcome')) enterScreen(); };
    if (calm || !plan || document.body.classList.contains('is-welcome') || !document.startViewTransition || document.hidden) return run();
    document.documentElement.classList.add('vt-tab');
    var vt = document.startViewTransition(run);
    var done = function () { document.documentElement.classList.remove('vt-tab'); };
    vt.finished.then(done, done);
  }
  function enterScreen() { riseIn(900, 60, 80); }
  window.addEventListener('hashchange', function () { navTo(location.hash.slice(1)); });
  // the writer's bar only gets a backing once something has scrolled under it
  function barStuck() {
    var b = root.querySelector('.jw-bar');
    if (b) b.classList.toggle('is-stuck', window.scrollY > 0 && b.getBoundingClientRect().top <= (parseFloat(getComputedStyle(b).top) || 0) + 1);
  }
  window.addEventListener('scroll', barStuck, { passive: true });
  // fields grow with their words instead of scrolling inside a box
  function grow(t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 2 + 'px'; }
  // a quiet "Saved" a moment after they stop typing, so there's never a save button to hunt for
  // saving you can see: "Saving…" while they type, then a check and where it went, and it stays until they edit again.
  // The very first time anyone writes, one line explains it; with no signal, it says so honestly.
  function savedLine(where) {
    if (!navigator.onLine) return check + 'Saved on this phone. It’ll sync when you’re back online.';
    return check + 'Saved' + (where === '' ? '' : ' · ' + (where || 'shapes next week'));
  }
  function savedHint(t, where) {
    var box = t.closest('.fbw'), h = box && box.querySelector('.fb-s');
    if (!h) return;
    clearTimeout(t._saved);
    box.classList.remove('is-saved');
    var empty = !t.value.trim();
    box.classList.toggle('is-typing', !empty);
    h.textContent = empty ? '' : 'Saving…';
    t._saved = setTimeout(function () {
      box.classList.remove('is-typing');
      if (empty) { h.textContent = ''; return; }
      box.classList.add('is-saved');
      if (!st.savedTip) { st.savedTip = 1; save(); h.innerHTML = check + 'Everything you write saves on its own. No button needed.'; return; }
      h.innerHTML = savedLine(where);
    }, 650);
  }
  // re-fit fields when the screen changes width (rotating a phone, resizing a window)
  var regrow;
  window.addEventListener('resize', function () { clearTimeout(regrow); regrow = setTimeout(function () { root.querySelectorAll('.fb-t, .jw-t').forEach(grow); }, 120); });
  function refocus(q) { var el = root.querySelector(q); if (el) el.focus({ preventScroll: true }); }
  // keep your place: re-render, then scroll so the new version of what you tapped sits exactly where the old one was.
  // A card that grows or shrinks above your finger never pulls the page out from under you.
  function anchorRender(from, toSel) {
    var y = from && from.getBoundingClientRect ? from.getBoundingClientRect().top : null;
    render();
    if (y == null) return;
    var to = root.querySelector(toSel);
    if (!to) return;
    var dy = to.getBoundingClientRect().top - y;
    if (Math.abs(dy) > 1) window.scrollBy(0, dy);
  }
  function cardSel(k) { return '#j-step-' + String(k).replace('.', '_'); }
  // a card folding into its bar (or opening back up), smoothly: its height eases from the old size to the new one so
  // everything below glides instead of jumping, the old content fades out on top while the new content fades in, and
  // the card's top edge stays where it was
  // The fades run as separate animations layered on top (never by swapping CSS rules in and out), so when they end
  // nothing underneath replays: no blink, no bump at the finish.
  var morphing = {}, EASE = 'cubic-bezier(.45,0,.2,1)';
  function morphRender(sel, plain) {
    var old = root.querySelector(sel);
    if (!old || calm || !old.animate) { render(); return; }
    var r0 = old.getBoundingClientRect(), ghost = plain ? null : old.cloneNode(true);
    render();
    var el = root.querySelector(sel);
    if (!el) return;
    var dy = el.getBoundingClientRect().top - r0.top;
    if (Math.abs(dy) > 1) window.scrollBy(0, dy);
    var h1 = el.getBoundingClientRect().height;
    if (Math.abs(h1 - r0.height) < 2) return;
    if (morphing[sel]) morphing[sel].cancel();
    el.classList.add('mo-el');
    if (ghost) {
      ghost.removeAttribute('id'); ghost.setAttribute('aria-hidden', 'true'); ghost.classList.add('mo-ghost');
      [].forEach.call(ghost.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); });
      ghost.style.height = r0.height + 'px';
      el.appendChild(ghost);
      ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 360, easing: 'ease', fill: 'forwards' });
      [].forEach.call(el.children, function (c) { if (c !== ghost) c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 160, easing: 'ease', fill: 'backwards' }); });
    }
    var a = morphing[sel] = el.animate([{ height: r0.height + 'px' }, { height: h1 + 'px' }], { duration: 700, easing: EASE });
    a.onfinish = a.oncancel = function () { if (morphing[sel] === a) delete morphing[sel]; el.classList.remove('mo-el'); if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost); };
  }

  function setNext(fn) { var n = fb.next['1'] = fb.next['1'] || { asks: [] }; n.asks = n.asks || []; fn(n); sync('next', '1'); }

  root.addEventListener('click', function (e) {
    var t = e.target, el;
    if ((el = t.closest('[data-unlock]'))) { var note = el.parentNode.querySelector('.lk-soon'); if (note) note.hidden = false; return; }
    // ---- the daily nudge and Add to Home Screen
    if ((el = t.closest('[data-nd-toggle]'))) { if (!ND.busy) { if (st.nudge.on) nudgeOff('you'); else nudgeOn('you'); } return; }
    if ((el = t.closest('[data-nd-on]'))) { if (!ND.busy) nudgeOn(el.getAttribute('data-nd-on')); return; }
    if ((el = t.closest('[data-nd-no]'))) { st.nudge = Object.assign({}, st.nudge, { dismissed: true }); save(); ND.show = null; render(); return; }
    // the link opens the calendar file; the app remembers the choice
    if ((el = t.closest('[data-nd-cal]'))) { st.nudge = Object.assign({}, st.nudge, { on: true, via: 'calendar', time: nudgeTime() }); save(); ND.show = null; ND.just = true; setTimeout(render, 400); return; }
    if ((el = t.closest('[data-install]'))) { if (installEvt) { installEvt.prompt(); installEvt.userChoice.then(function () { installEvt = null; render(); }); } return; }
    // ---- the journal
    if ((el = t.closest('[data-jgo]'))) {
      var jg = el.getAttribute('data-jgo'), dr = draft();
      if (jg !== 'draft') {
        dr.mode = jg === 'hard' || jg === 'ask' ? 'prompt' : jg;
        if (jg === 'ask') dr.ask = el.getAttribute('data-jask'); else if (jg !== 'prompt') delete dr.ask;
        if (jg === 'hard') dr.pi = 0;
      }
      J.from = tab === 'journal' ? null : tab;
      save(); J.focus = true; location.hash = 'journal/write'; return;
    }
    if ((el = t.closest('[data-jnext]'))) { var dn = draft(); if (dn.ask) delete dn.ask; else dn.pi = ((dn.pi || 0) + 1) % prompts().length; save(); render(); refocus('[data-jnext]'); return; }
    if ((el = t.closest('[data-jto]'))) { draft().to = +el.getAttribute('data-jto'); save(); render(); refocus('[data-jto="' + draft().to + '"]'); return; }
    if ((el = t.closest('[data-jday]'))) { var dd = draft(), dv = el.getAttribute('data-jday'), was = dd.day != null ? dd.day : todayCi(); dd.day = was === dv ? '' : dv; save(); render(); refocus('[data-jday="' + dv + '"]'); return; }
    if ((el = t.closest('[data-jtalk]'))) {
      if (talk && talk.on) talkStop(); else talkStart();
      if (talk && talk.note) render(); else paintTalk();
      refocus('[data-jtalk]'); return;
    }
    if ((el = t.closest('[data-jsave]'))) {
      var dj = draft(), jta = root.querySelector('#jw-t'), jti = root.querySelector('#jw-title');
      var jb = jta ? jta.value.replace(/^\s*\n|\s+$/g, '') : '', jt = jti ? jti.value.trim() : '';
      if (!jb.trim()) { refocus('#jw-t'); return; }
      if (talk && talk.on) talkStop();
      var ne = { id: 'j' + Date.now().toString(36), at: nowTs(), kind: dj.mode, body: jb };
      if (jt) ne.title = jt;
      if (dj.mode === 'prompt') ne.prompt = curPrompt();
      if (dj.mode === 'letter') { var lt = letters()[Math.min(dj.to || 0, letters().length - 1)]; ne.to = lt.to; ne.prompt = lt.prompt; }
      if (dj.mode === 'quick') ne.day = (dj.day != null ? dj.day : todayCi()) || null;
      st.journal.push(ne);
      st.jdraft = { mode: dj.mode, pi: dj.pi, to: dj.to };
      J.pend = { saved: ne.id, warn: risky(jt + ' ' + jb) }; J.f = 'all'; J.q = '';
      save(); location.hash = 'journal'; return;
    }
    if ((el = t.closest('[data-jdone]'))) {
      var ed = jEntry();
      if (ed && !ed.body.trim() && !(ed.title || '').trim()) { removeEntry(ed); location.hash = 'journal'; return; }
      if (ed) { ed.body = ed.body.replace(/^\s*\n|\s+$/g, ''); ed.title = (ed.title || '').trim(); if (!ed.title) delete ed.title; save(); }
      J.pend = { warn: !!(ed && risky((ed.title || '') + ' ' + ed.body)) };
      location.hash = 'journal/e/' + encodeURIComponent(J.id); return;
    }
    if (t.closest('[data-jdiscard]')) { J.discard = true; render(); refocus('[data-jdiscard-no]'); return; }
    if (t.closest('[data-jdiscard-no]')) { J.discard = false; render(); refocus('[data-jdiscard]'); return; }
    if (t.closest('[data-jdiscard-yes]')) { st.jdraft = { mode: draft().mode, pi: draft().pi, to: draft().to }; J.discard = false; save(); render(); return; }
    if ((el = t.closest('[data-jf]'))) { J.f = el.getAttribute('data-jf'); render(); refocus('[data-jf="' + J.f + '"]'); return; }
    if (t.closest('[data-jwipe]')) { J.wipe = true; render(); refocus('[data-jwipe-no]'); return; }
    if (t.closest('[data-jwipe-no]')) { J.wipe = false; render(); return; }
    if (t.closest('[data-jwipe-yes]')) { st.journal.forEach(function (x) { delete st.jmeta[x.id]; }); st.journal = []; st.jdraft = {}; J.wipe = false; save(); render(); return; }
    var je = tab === 'journal' && J.view === 'read' && findEntry(J.id);
    if (je) {
      if (t.closest('[data-jedit]')) {
        if (!je.src) { J.focus = true; location.hash = 'journal/edit/' + encodeURIComponent(je.id); return; }
        J.edit = true; render(); refocus('.jr-ed textarea'); return;
      }
      if (t.closest('[data-jedit-done]')) { var now = findEntry(je.id); J.edit = false; J.warn = J.warn || !!(now && risky(now.body)); if (!now) { location.hash = 'journal'; return; } render(); refocus('[data-jedit]'); return; }
      if (t.closest('[data-jpin]')) { setMeta(je.id, 'pin', (st.jmeta[je.id] || {}).pin ? 0 : Date.now()); render(); refocus('[data-jpin]'); return; }
      if (t.closest('[data-jdel]')) { J.del = true; render(); refocus('[data-jdel-no]'); return; }
      if (t.closest('[data-jdel-no]')) { J.del = false; render(); refocus('[data-jdel]'); return; }
      if (t.closest('[data-jdel-yes]')) { removeEntry(je); location.hash = 'journal'; return; }
      if (t.closest('[data-jpersonal]')) { setPersonal(je, !isPersonal(je)); render(); refocus('[data-jpersonal]'); return; }
    }
    if ((el = t.closest('[data-add-ask]'))) { addOpen = !addOpen; render(); refocus(addOpen && paid() ? '#new-ask' : '[data-add-ask]'); return; }
    if ((el = t.closest('[data-ask-add]'))) {
      var inp = root.querySelector('#new-ask'), txt = inp && inp.value.replace(/\s+/g, ' ').trim();
      if (!txt) { if (inp) inp.focus(); return; }
      st.extraAsks = st.extraAsks || [];
      var ref = 'a' + Date.now();
      st.extraAsks.push({ text: txt, ref: ref, status: 'next' });
      fb.ask[ref] = { text: txt, status: 'next' }; sync('ask', ref, true);
      addOpen = false; render(); return;
    }
    if ((el = t.closest('[data-ask-remove]'))) {
      var x = (st.extraAsks || [])[+el.getAttribute('data-ask-remove')];
      if (x) { x.status = 'removed'; fb.ask[x.ref] = { text: x.text, status: 'removed' }; sync('ask', x.ref, true); render(); }
      return;
    }
    if ((el = t.closest('[data-view-day]'))) {
      var prevSel = sel, oldPill = root.querySelector('.ds-d.is-sel'), r0 = oldPill ? oldPill.getBoundingClientRect() : null;
      sel = parseInt(el.getAttribute('data-view-day'), 10); said = null;
      if (tab !== 'today') { e.preventDefault(); location.hash = 'today'; }
      else { render(); dayGlide(r0, prevSel); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      return;
    }
    if ((el = t.closest('[data-wl]'))) { pickWelcome(el.getAttribute('data-wl'), el); return; }
    if (t.closest('[data-wl-go]') || t.closest('[data-wl-skip]')) { leaveWelcome(root.querySelector('[data-wl][aria-checked="true"]')); return; }
    if ((el = t.closest('[data-unfold]'))) { var uk = el.getAttribute('data-unfold'); openCard[uk] = true; morphRender(cardSel(uk)); refocus('[data-card="' + uk + '"] .pl-done'); return; }
    if ((el = t.closest('[data-fold]'))) { var fk2 = el.getAttribute('data-fold'); delete openCard[fk2]; delete fresh[fk2]; delete hold[fk2]; morphRender(cardSel(fk2)); refocus('[data-unfold="' + fk2 + '"]'); return; }
    if ((el = t.closest('[data-jump]'))) {
      var to = root.querySelector('#j-' + el.getAttribute('data-jump'));
      if (to) { to.scrollIntoView({ behavior: 'smooth', block: 'start' }); var f = to.querySelector('button,textarea'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 450); }
      return;
    }
    if ((el = t.closest('[data-guide]'))) { st.guide = el.getAttribute('data-guide'); save(); keepLayers = false; render(); return; }
    if ((el = t.closest('[data-ci-up]'))) { ciOpen[sel] = true; morphRender('#j-ci'); refocus('[data-checkin][aria-pressed="true"]'); return; }
    if ((el = t.closest('[data-checkin]'))) {
      ciOpen[sel] = true;
      var o = el.getAttribute('data-checkin');
      if (st.checkin[sel] === o) delete st.checkin[sel]; else st.checkin[sel] = o;
      sync('checkin', sel, true); said = null; render(); refocus('[data-checkin="' + o + '"]');
      // the pick shows for a beat, then settles into the row with Update
      var cd = sel; clearTimeout(ciTimer);
      if (st.checkin[cd]) ciTimer = setTimeout(function () { if (st.checkin[cd] && sel === cd && tab === 'today' && !root.contains(document.activeElement && document.activeElement.tagName === 'TEXTAREA' ? document.activeElement : null)) { delete ciOpen[cd]; morphRender('#j-ci'); refocus('[data-ci-up]'); } }, 700);
      return;
    }
    if ((el = t.closest('[data-feel]'))) {
      var fk = el.getAttribute('data-ref'), fv = el.getAttribute('data-feel');
      fb.step[fk] = Object.assign({}, fb.step[fk], { feel: fv }); sync('step', fk, true); render(); refocus('[data-feel="' + fv + '"][data-ref="' + fk + '"]');
      return;
    }
    if ((el = t.closest('[data-skipopen]'))) {
      var so = el.getAttribute('data-skipopen'), sFrom = el.closest('.gt') || el;
      skipOpen[so] = !skipOpen[so];
      if (calm) anchorRender(sFrom, cardSel(so) + (skipOpen[so] ? ' .gt' : ' .gut-b')); else morphRender(cardSel(so), true);
      refocus(skipOpen[so] ? '[data-skip][data-ref="' + so + '"]' : '[data-skipopen="' + so + '"]'); return;
    }
    if ((el = t.closest('[data-skip]'))) {
      var sk = el.getAttribute('data-ref');
      // a note belongs to the choice it was written for: switching from skip to change (or back) starts it fresh
      var sAct = el.getAttribute('data-skip'), sPrev = fb.skip[sk] || {};
      fb.skip[sk] = { action: sAct, note: sPrev.noteFor && sPrev.noteFor !== sAct ? '' : sPrev.note || '', noteFor: sAct }; skipOpen[sk] = false; sync('skip', sk, true);
      anchorRender(el.closest('.gt') || el, cardSel(sk) + ' .gn');
      refocus('[data-gnpick="' + sk + '"]');
      return;
    }
    if ((el = t.closest('[data-gngo]'))) { finishGut(el.getAttribute('data-gngo')); return; }
    if ((el = t.closest('[data-gnpick]'))) {
      var gk = el.getAttribute('data-gnpick'), gv = el.getAttribute('data-v');
      var gta = root.querySelector('textarea[data-fb="skip"][data-ref="' + gk + '"]');
      if (!gta) return;
      var parts = gta.value.split(/,\s*/).map(function (x) { return x.trim(); }).filter(Boolean), gat = parts.indexOf(gv);
      if (gat >= 0) parts.splice(gat, 1); else parts.push(gv);
      gta.value = parts.join(', '); grow(gta);
      gta.dispatchEvent(new Event('input', { bubbles: true }));
      el.setAttribute('aria-pressed', String(gat < 0));
      if ((fb.skip[gk] || {}).action === 'skip' && parts.length) settleSkip(gk, 1400); else clearTimeout(settleT[gk]);
      return;
    }
    if ((el = t.closest('[data-unskip]'))) { var us = el.getAttribute('data-unskip'); fb.skip[us] = { note: (fb.skip[us] || {}).note || '', noteFor: (fb.skip[us] || {}).noteFor || (fb.skip[us] || {}).action }; sync('skip', us, true); anchorRender(el, cardSel(us) + ' .gut-b'); refocus('[data-skipopen="' + us + '"]'); return; }
    if ((el = t.closest('[data-next]'))) {
      var ni = +el.getAttribute('data-ref'), nv = el.getAttribute('data-next');
      setNext(function (n) { n.asks[ni] = Object.assign({}, n.asks[ni], { choice: nv }); }); render(); refocus('[data-next="' + nv + '"][data-ref="' + ni + '"]');
      return;
    }
    if ((el = t.closest('[data-pace]'))) { var pv = el.getAttribute('data-pace'); setNext(function (n) { n.pace = pv; }); render(); refocus('[data-pace="' + pv + '"]'); return; }
    if ((el = t.closest('[data-nx-send]'))) { setNext(function (n) { n.sent = new Date().toISOString(); }); sync('next', '1', true); render(); return; }
    if ((el = t.closest('[data-ease]'))) { var ev = el.getAttribute('data-ease'); fb.app.day3 = Object.assign({}, fb.app.day3, { ease: ev }); sync('app', 'day3', true); render(); refocus('[data-ease="' + ev + '"]'); return; }
    if ((el = t.closest('[data-app-send]'))) {
      var ta = root.querySelector('#app-note'), v = ta && ta.value.trim();
      if (!v) { if (ta) ta.focus(); return; }
      var ref = 'n' + Date.now();
      fb.app[ref] = { text: v }; sync('app', ref, true); appThanks = true; render();
      return;
    }
    var b = t.closest('[data-done]');
    if (!b || !plan) return;
    var k = b.getAttribute('data-done');
    var day = parseInt(k, 10);
    var wasKept = kept(plan.days[day - 1]);
    done[k] = !done[k];
    if (done[k]) st.at[k] = Date.now(); else delete st.at[k];
    save();
    if (done[k]) nudgeDone(day);
    // the encouragement shows first; then the card folds away unless they're still using it
    if (done[k]) { fresh[k] = true; delete openCard[k]; setTimeout(function () { if (fresh[k] && !hold[k] && tab === 'today') { delete fresh[k]; said = null; morphRender(cardSel(k)); } else if (fresh[k] && hold[k]) { /* folds next visit */ } }, 1600); }
    else { delete fresh[k]; delete hold[k]; delete openCard[k]; }
    var list = cheer().done || [];
    // the day's first step gets the day's line; another goal's step on the same day gets a different one
    said = done[k] ? { key: k, line: wasKept ? list[(day + 2) % (list.length || 1)] || '' : doneLine(day) } : null;
    // keep your place: Mark done lands on "How did it feel?", Undo lands back on Mark done
    anchorRender(b.closest('.pl-do, .pl-undo, .pl-done') || b, cardSel(k) + (done[k] ? ' .fb' : ' .pl-do'));
    refocus('[data-done="' + k + '"]');
  });
  // sections that open (the + layers, See the original step): ease open with the content fading in, ease closed
  root.addEventListener('click', function (e) {
    var sm = e.target.closest && e.target.closest('details > summary');
    if (!sm || calm) return;
    var d = sm.parentNode;
    if (!d.animate) return;
    e.preventDefault();
    if (d.getAttribute('data-anim')) return;
    var from = d.getBoundingClientRect().height, opening = !d.open, to;
    if (opening) { d.open = true; to = d.getBoundingClientRect().height; }
    else { d.open = false; to = d.getBoundingClientRect().height; d.open = true; }
    d.setAttribute('data-anim', '1'); d.style.overflow = 'hidden';
    var a = d.animate([{ height: from + 'px' }, { height: to + 'px' }], { duration: opening ? 650 : 500, easing: 'cubic-bezier(.45,0,.2,1)' });
    var body = [].filter.call(d.children, function (c) { return c.tagName !== 'SUMMARY'; });
    body.forEach(function (b) { b.animate(opening ? [{ opacity: 0, transform: 'translateY(-.25rem)' }, { opacity: 1, transform: 'none' }] : [{ opacity: 1 }, { opacity: 0 }], { duration: opening ? 460 : 260, delay: opening ? 100 : 0, easing: 'ease', fill: opening ? 'backwards' : 'forwards' }); });
    a.onfinish = a.oncancel = function () { if (!opening) { d.open = false; body.forEach(function (b) { b.getAnimations().forEach(function (x) { x.cancel(); }); }); } d.style.overflow = ''; d.removeAttribute('data-anim'); };
  });
  // return in a gut-call note finishes it (shift+return still makes a new line)
  root.addEventListener('keydown', function (e) {
    var t = e.target;
    if (e.key !== 'Enter' || e.shiftKey || e.isComposing || !(t.matches && t.matches('textarea[data-gn-enter]'))) return;
    e.preventDefault();
    if (t.value.trim()) finishGut(t.getAttribute('data-ref')); else t.blur();
  });
  // writing their own words pauses the fold; leaving the box with words in it settles the skip
  root.addEventListener('focusin', function (e) { var t = e.target; if (t.matches && t.matches('textarea[data-fb="skip"]')) clearTimeout(settleT[t.getAttribute('data-ref')]); });
  root.addEventListener('focusout', function (e) {
    var t = e.target; if (!(t.matches && t.matches('textarea[data-fb="skip"]'))) return;
    var sk2 = t.getAttribute('data-ref');
    if ((fb.skip[sk2] || {}).action === 'skip' && t.value.trim()) settleSkip(sk2, 900);
  });
  ['pointerdown', 'focusin'].forEach(function (ev) {
    root.addEventListener(ev, function (e) { var c = e.target.closest && e.target.closest('[data-card]'); if (c && fresh[c.getAttribute('data-card')] && !e.target.closest('.pl-done,.pl-undo')) hold[c.getAttribute('data-card')] = true; });
  });
  root.addEventListener('change', function (e) {
    if (e.target.hasAttribute('data-nd-time')) { nudgeSetTime(e.target.value); return; }
    var w = e.target.closest('[data-walk]');
    if (!w) return;
    var k = w.getAttribute('data-walk'), i = +w.getAttribute('data-i');
    var list = st.walk[k] = st.walk[k] || [];
    list[i] = w.checked; save();
    var boxes = root.querySelectorAll('[data-walk="' + k + '"]');
    var n = [].filter.call(boxes, function (x) { return x.checked; }).length;
    var em = root.querySelector('[data-walk-n="' + k + '"]'); if (em) em.textContent = n ? n + ' of ' + boxes.length : '';
  });
  // their words save as they type, without re-rendering (so the cursor stays put)
  root.addEventListener('input', function (e) {
    if (e.target.id === 'pb-q') {
      var q = e.target.value.trim().toLowerCase(), any = false;
      root.querySelectorAll('#pb-all [data-pb-name]').forEach(function (a) { var hit = !q || a.getAttribute('data-pb-name').indexOf(q) >= 0; a.parentNode.hidden = !hit; if (hit) any = true; });
      var none = root.querySelector('#pb-none'); if (none) none.hidden = any;
      root.querySelectorAll('[data-pb-hide]').forEach(function (sec) { sec.hidden = !!q; });
      return;
    }
    if (e.target.id === 'jq') { J.q = e.target.value; jSearch(); return; }
    if (e.target.hasAttribute('data-jw')) {
      if (e.target.tagName === 'TEXTAREA') grow(e.target);
      putWords(e.target.getAttribute('data-jw'), e.target.value);
      return;
    }
    if (e.target.classList && e.target.classList.contains('fb-t')) grow(e.target);
    var t = e.target.closest('[data-fb]');
    if (!t) return;
    savedHint(t);
    var kind = t.getAttribute('data-fb'), ref = t.getAttribute('data-ref'), field = t.getAttribute('data-field');
    if (kind === 'next' && field.indexOf('ask.') === 0) {
      var i = +field.split('.')[1];
      setNext(function (n) { n.asks[i] = Object.assign({}, n.asks[i], { note: t.value }); });
      return;
    }
    var o = fb[kind][ref] = Object.assign({}, fb[kind][ref]);
    o[field] = t.value;
    sync(kind, ref);
    // the quick answers stay true to what's in the box, whether tapped or typed
    if (kind === 'skip') { var have = t.value.split(/,\s*/).map(function (x) { return x.trim(); });
      root.querySelectorAll('[data-gnpick="' + ref + '"]').forEach(function (p) { p.setAttribute('aria-pressed', String(have.indexOf(p.getAttribute('data-v')) >= 0)); }); }
  });

  fetch(source, { headers: { Accept: 'application/json' } })
    .then(function (r) { if (!r.ok) throw new Error('not found'); return r.json(); })
    .then(function (p) {
      plan = p.plan || p;
      // ticks saved before Done went per-step (a step day keyed by the day alone) carry over as every step done
      plan.days.forEach(function (d) { if (d.kind === 'step' && done[d.day]) { d.steps.forEach(function (s) { done[key(d, s)] = true; }); delete done[d.day]; } });
      save();
      T = todayNum();
      sel = Math.min(T, 7);
      nav.hidden = false;
      go(location.hash.slice(1), false);
    })
    .catch(function () {
      root.innerHTML = '<section class="pl-sec"><p class="pl-k">Your plan</p><p class="pl-read">We couldn’t open this plan. Check the link in your email, or open it again in a minute.</p></section>';
    });
})();
