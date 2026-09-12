/*!
 * Lin's EDC Calculator
 * Copyright (c) 2026 Weiping Lin, D.O., FACOG, FACOOG (Holy Name Medical Center, OB/GYN). Wlin@holyname.org
 * Licensed under Creative Commons Attribution 4.0 International (CC BY 4.0):
 * https://creativecommons.org/licenses/by/4.0/
 * You may share and adapt this work, including commercially, with attribution to
 * Weiping Lin, D.O., a link to the license, and an indication of any changes made.
 * Artwork (icons, avatar, photo) is not covered by this license and is included for use with this app only.
 * This notice must be kept in all copies or adaptations, including code pasted into AI tools.
 */
/* Lin's EDC Calculator — service worker
   To publish an update: change VERSION below (and VERSION in index.html), then redeploy.
   Installed apps detect the new sw.js, download the update, and show a "Reload" bar. */
const VERSION = "1.4.0";
const CACHE = `lins-edc-${VERSION}`;
const RUNTIME = "lins-edc-runtime";
const CORE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./LICENSE.md",
  "./icons/lin.png",
  "./icons/photo.png",
  "./icons/icon-192-v4.png",
  "./icons/icon-512-v4.png",
  "./icons/maskable-192-v4.png",
  "./icons/maskable-512-v4.png",
  "./icons/apple-touch-icon-v4.png",
  "./icons/favicon-32-v4.png",
  "./icons/favicon-64-v4.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: "reload" }))))
  );
  // Wait for the user to tap "Reload" (SKIP_WAITING) so nothing changes mid-calculation.
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith("lins-edc-") && k !== CACHE && k !== RUNTIME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // App page: network first (fresh when online), cached copy when offline.
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 4000);
        const fresh = await fetch(req, { signal: ctrl.signal, cache: "no-store" });
        clearTimeout(t);
        if (fresh && fresh.ok) {
          const c = await caches.open(CACHE);
          c.put("./index.html", fresh.clone());
        }
        return fresh;
      } catch {
        return (await caches.match("./index.html")) || (await caches.match("./")) || Response.error();
      }
    })());
    return;
  }

  // Google Fonts: serve cached, refresh in background.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith((async () => {
      const c = await caches.open(RUNTIME);
      const hit = await c.match(req);
      const net = fetch(req).then((r) => { if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })());
    return;
  }

  // Same-origin assets: cache first, fall back to network.
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const hit = await caches.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const r = await fetch(req);
      if (r && r.ok) (await caches.open(CACHE)).put(req, r.clone());
      return r;
    })());
  }
});
