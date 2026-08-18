'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      // Dev: unregister any stale SW and clear its caches so it can't
      // serve cached production HTML during development
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const r of regs) r.unregister();
      });
      caches.keys().then((keys) => {
        for (const k of keys) caches.delete(k);
      });
      return;
    }

    // updateViaCache 'none': the HTTP cache is allowed to hold sw.js for a day,
    // and whoever is running a broken worker is exactly who cannot afford to wait.
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => {});
  }, []);

  return null;
}
