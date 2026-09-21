'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Optional companion for apps with no first-run notion of their own.
 *
 * The overlay itself owns no "have they seen it" flag on purpose: most apps
 * already answer that question somewhere (a tour flag, a `created_at`, a
 * server-side field), and a second answer kept inside the kit is a second
 * source of truth for the same fact. Where there genuinely is no first answer
 * yet, this is the smallest one that works.
 *
 *   const { show, dismiss } = useFirstRun('viralcat:welcome');
 *   <WelcomeWarp show={show} onDone={dismiss} />
 *
 * `show` starts false and is only raised in an effect, never read during
 * render. localStorage does not exist on the server, so deciding this while
 * rendering would either throw during SSR or hand the client different markup
 * from the one the server sent and lose the hydration.
 */
export function useFirstRun(storageKey: string, enabled = true) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    try {
      if (localStorage.getItem(storageKey) !== '1') setShow(true);
    } catch {
      // Storage blocked (private mode, strict privacy settings). A welcome
      // that cannot be remembered is better skipped than replayed on every
      // page load for the life of the session.
    }
  }, [storageKey, enabled]);

  /** Hide it and record that it has been seen. Pass as `onDone`. */
  const dismiss = useCallback(() => {
    setShow(false);
    try {
      localStorage.setItem(storageKey, '1');
    } catch {}
  }, [storageKey]);

  /** Forget the flag, so the next mount plays it again. For a replay control. */
  const reset = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey]);

  /** Play it now without touching the flag. For a dev bar or a menu item. */
  const replay = useCallback(() => setShow(true), []);

  return { show, dismiss, reset, replay };
}
