'use client';

/**
 * Portable cookie consent banner. Copy this whole folder into any Next.js app.
 *
 * Only worth installing if the app loads something non-essential (analytics,
 * chat widgets, embeds). Cookies that just keep a user signed in are "strictly
 * necessary" and need no consent, so a banner there is pure friction.
 *
 * Two ways to gate the non-essential thing, usable together:
 *   scripts   -- <script> tags injected only after Accept
 *   onAccept  -- callback fired after Accept, for SDKs like PostHog
 *
 * Accept and decline are given equal weight on purpose. A decline that is
 * hidden or hobbled is the specific thing EU/UK regulators issue fines over.
 *
 *   <CookieConsent
 *     scripts={["https://sparkbrain.app/chat.js"]}
 *     onAccept={() => initPostHog()}
 *     accent="#ff88ee"
 *   />
 */

import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';

/** "1" = optional cookies accepted, "0" = declined, null = no choice yet. */
type Consent = '1' | '0';

const DEFAULT_COOKIE = 'cookie_consent';

function readCookie(cookieName: string): Consent | null {
  const entry = document.cookie.split('; ').find((c) => c.startsWith(`${cookieName}=`));
  if (!entry) return null;
  const value = entry.slice(cookieName.length + 1);
  return value === '1' || value === '0' ? value : null;
}

function writeCookie(cookieName: string, value: Consent) {
  // 1-year expiry
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${cookieName}=${value}; path=/; expires=${expires}; SameSite=Lax`;
}

function readStored(cookieName: string): Consent | null {
  try {
    const value = localStorage.getItem(cookieName);
    return value === '1' || value === '0' ? value : null;
  } catch {
    // Storage blocked (private mode, strict privacy settings).
    return null;
  }
}

function readConsent(cookieName: string): Consent | null {
  if (typeof document === 'undefined') return null;

  const fromCookie = readCookie(cookieName);
  if (fromCookie) return fromCookie;

  // Safari's ITP caps a cookie written by document.cookie at 7 days, or at 24
  // hours when the visit arrived from a cross-site link, which is most of the
  // traffic a social-first product gets. The cookie quietly expires and the
  // banner returns to someone who already chose. localStorage is not capped
  // that way, so it holds the durable copy; re-issue the cookie from it so
  // anything reading the cookie (server or third party) still sees the choice.
  const fromStore = readStored(cookieName);
  if (fromStore) writeCookie(cookieName, fromStore);
  return fromStore;
}

function writeConsent(cookieName: string, value: Consent) {
  writeCookie(cookieName, value);
  try {
    localStorage.setItem(cookieName, value);
  } catch {
    // Storage blocked. The cookie alone still carries the choice.
  }
}

/**
 * Read consent from anywhere (guards, tracking calls made outside this tree).
 * Returns false until the user actively accepts.
 */
export function hasCookieConsent(cookieName = DEFAULT_COOKIE): boolean {
  return readConsent(cookieName) === '1';
}

/**
 * A script to load once consent is given. A bare URL covers the common case;
 * the object form carries the data-* attributes a widget reads off its own
 * script tag, which a plain URL cannot express.
 */
export type ConsentScript = string | { src: string; attrs?: Record<string, string | undefined> };

export interface CookieConsentProps {
  /** Third-party scripts to load only after Accept. */
  scripts?: ConsentScript[];
  /** Fired after Accept, for SDKs that self-initialise (PostHog, GA). */
  onAccept?: () => void;
  /** Fired after decline, e.g. to tear down anything already running. */
  onDecline?: () => void;
  /** Cookie storing the choice. Change it to re-prompt after a policy update. */
  cookieName?: string;
  /** Link target. Omit to hide the link if the app has no policy page yet. */
  privacyUrl?: string | null;
  /** Primary button colour. */
  accent?: string;
  /** Override the default wording to match what the app actually loads. */
  message?: string;
}

export function CookieConsent({
  scripts = [],
  onAccept,
  onDecline,
  cookieName = DEFAULT_COOKIE,
  privacyUrl = '/privacy-policy',
  accent = '#ff88ee',
  message = 'Essential cookies keep you signed in. Accepting also loads optional third-party services.',
}: CookieConsentProps) {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // Restoring a stored choice must fire once on mount. Tracking onAccept would
  // re-run it on every parent render and re-fire the third-party init.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    const consent = readConsent(cookieName);
    if (consent === null) {
      setVisible(true);
    } else if (consent === '1') {
      setAccepted(true);
      onAccept?.();
    }
  }, [cookieName]);

  const handleChoice = (value: Consent) => {
    writeConsent(cookieName, value);
    setVisible(false);
    if (value === '1') {
      setAccepted(true);
      onAccept?.();
    } else {
      onDecline?.();
    }
  };

  return (
    <>
      {accepted &&
        scripts.map((entry) => {
          const { src, attrs } =
            typeof entry === 'string' ? { src: entry, attrs: undefined } : entry;
          return <Script key={src} src={src} strategy="afterInteractive" {...attrs} />;
        })}

      {visible && (
        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-[hsl(224,71%,6%)]/95 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="text-sm text-slate-300 leading-relaxed">
              {message}{' '}
              {privacyUrl && (
                <Link
                  href={privacyUrl}
                  className="text-slate-400 underline underline-offset-2 hover:text-white"
                >
                  Privacy Policy
                </Link>
              )}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleChoice('0')}
                className="px-4 py-1.5 rounded-lg border border-white/15 text-slate-400 text-sm hover:text-slate-200 hover:border-white/30 transition-colors"
              >
                Necessary only
              </button>
              <button
                type="button"
                onClick={() => handleChoice('1')}
                style={{ backgroundColor: accent }}
                className="px-4 py-1.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
