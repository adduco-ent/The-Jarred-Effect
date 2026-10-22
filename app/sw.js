// The Other Half app's service worker (scope /app/).
// 1. Offline: every page and file is fetched fresh from the network first; the last copy is kept for when there's
//    no signal, so a step can still be read on a plane. Never stale while online.
// 2. The daily nudge: shows the push, and a tap opens their plan at Today.
var CACHE = 'other-half-v1';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname === '/api/nudge' || url.pathname === '/api/nudge-send' || url.pathname === '/api/feedback') return;
  e.respondWith(fetch(req).then(function (res) {
    if (res.ok && res.type === 'basic') { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) {
      return hit || caches.match(req, { ignoreSearch: true }).then(function (h) { return h || (req.mode === 'navigate' ? caches.match('/app/plan.html', { ignoreSearch: true }) : undefined); });
    });
  }));
});

self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Other Half', {
    body: d.body || 'Today’s step is ready.',
    icon: '/app/icons/icon-192.png',
    badge: '/app/icons/badge-96.png',
    tag: 'other-half-nudge',
    data: { url: d.url || '/app/plan.html#today' }
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/app/plan.html#today';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.indexOf('/app/plan.html') >= 0 && 'focus' in c) { if ('navigate' in c) c.navigate(url); return c.focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
