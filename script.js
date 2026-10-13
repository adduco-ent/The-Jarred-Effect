/*!
 * The Jarred Effect — page runtime. No build step, no dependencies.
 *
 * Every page ships its real HTML. Its page script (assets/js/<page>.js) defines a Component:
 * state lives in this.state, renderVals() turns state into values, and setState() re-applies
 * those values to the markup through a handful of attributes:
 *
 *   data-text="key"                 the element's text
 *   data-tpl="Sent to {{ email }}"  the element's text from a template (a value inside a sentence)
 *   data-if="key"                   an <x-if> wrapper, shown while the value is truthy
 *                                   (x-if is display:contents, so it never adds a layout box)
 *   data-class="key"                extra classes from the value (classes written in the HTML stay)
 *   data-attr="name:key; name:key"  attributes: false/null removes one, true sets it empty
 *   data-on-click | data-on-submit | data-on-input | data-on-focusout = "key"
 *                                   event handlers returned by renderVals (delegated from document)
 *
 * TJE.subscribe() posts a sign-up to /api/subscribe (see api/subscribe.js).
 */
(function () {
  'use strict';

  var EVENTS = ['click', 'submit', 'input', 'focusout'];
  var comp = null;
  var vals = {};
  var queued = false;
  var applied = new WeakMap(); // element -> dynamic classes we added last render

  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(patch) {
      this.state = Object.assign({}, this.state, typeof patch === 'function' ? patch(this.state) : patch);
      schedule();
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    Promise.resolve().then(render);
  }

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  function render() {
    queued = false;
    vals = comp.renderVals() || {};

    each('[data-text]', function (el) {
      var v = vals[el.getAttribute('data-text')];
      var t = v == null ? '' : String(v);
      if (el.textContent !== t) el.textContent = t;
    });

    each('[data-tpl]', function (el) {
      var t = el.getAttribute('data-tpl').replace(/\{\{\s*([\w.]+)\s*\}\}/g, function (m, k) { return vals[k] == null ? '' : String(vals[k]); });
      if (el.textContent !== t) el.textContent = t;
    });

    each('[data-if]', function (el) {
      var on = !!vals[el.getAttribute('data-if')];
      if (el.hidden === on) el.hidden = !on;
    });

    each('[data-class]', function (el) {
      var next = String(vals[el.getAttribute('data-class')] || '').split(/\s+/).filter(Boolean);
      var prev = applied.has(el) ? applied.get(el) : next;
      prev.forEach(function (c) { if (next.indexOf(c) < 0) el.classList.remove(c); });
      next.forEach(function (c) { if (!el.classList.contains(c)) el.classList.add(c); });
      applied.set(el, next);
    });

    each('[data-attr]', function (el) {
      el.getAttribute('data-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i < 0) return;
        var name = pair.slice(0, i).trim();
        var v = vals[pair.slice(i + 1).trim()];
        if (v === false || v == null) {
          if (el.hasAttribute(name)) el.removeAttribute(name);
        } else {
          var s = v === true ? '' : String(v);
          if (el.getAttribute(name) !== s) el.setAttribute(name, s);
        }
      });
    });
  }

  // Handlers get a small event object: currentTarget is the element that declared the handler.
  function handler(type) {
    var attr = 'data-on-' + type;
    return function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[' + attr + ']') : null;
      if (!el) return;
      var fn = vals[el.getAttribute(attr)];
      if (typeof fn !== 'function') return;
      fn({
        type: type,
        target: e.target,
        currentTarget: el,
        nativeEvent: e,
        preventDefault: function () { e.preventDefault(); },
        stopPropagation: function () { e.stopPropagation(); }
      });
    };
  }

  function mount(Component) {
    comp = new Component({});
    EVENTS.forEach(function (t) { document.addEventListener(t, handler(t), t === 'focusout'); });
    render();
    if (comp.componentDidMount) comp.componentDidMount();
  }

  // ---------------------------------------------------------------- sign-ups

  var MESSAGES = {
    invalid_email: 'That doesn’t look like an email yet — mind checking it?',
    not_configured: 'Sign-ups aren’t switched on yet. Please check back soon.',
    failed: 'That didn’t go through. Mind trying again in a moment?',
    offline: 'Couldn’t reach the server. Check your connection and try again.',
    local: 'Sign-ups work once the site is live; they can’t send from a file on your computer.',
    no_api: 'Sign-ups work once the site is live; this local preview can’t send them.'
  };

  function subscribe(opts) {
    opts = opts || {};
    if (location.protocol === 'file:') return Promise.reject(new Error(MESSAGES.local));
    var hp = opts.form && opts.form.querySelector ? opts.form.querySelector('input[name="company"]') : null;
    var payload = {
      email: opts.email || '',
      name: opts.name || '',
      source: opts.source || '',
      company: hp ? hp.value : '' // honeypot: people never see this field, bots fill it in
    };
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : 0;
    return fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      clearTimeout(timer);
      return res.json().catch(function () { return {}; }).then(function (json) {
        if (res.ok && json.ok) return json;
        // a plain file server (e.g. python3 -m http.server) has no /api: it answers 404/405/501 with no JSON error
        var noApi = !json.error && (res.status === 404 || res.status === 405 || res.status === 501);
        throw new Error(noApi ? MESSAGES.no_api : (MESSAGES[json.error] || MESSAGES.failed));
      });
    }, function () {
      clearTimeout(timer);
      throw new Error(MESSAGES.offline);
    });
  }

  window.TJE = {
    DCLogic: DCLogic,
    mount: mount,
    subscribe: subscribe,
    page: (document.body && document.body.getAttribute('data-page')) || ''
  };
})();
