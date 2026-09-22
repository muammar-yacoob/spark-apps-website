'use client';

/**
 * Portable "travelling through space" welcome splash.
 *
 * Copy this folder into any React DOM app. It imports nothing but react and
 * react-dom, uses no Tailwind classes, no global stylesheet and nothing from
 * the host application, so installing it is the copy and one import.
 *
 *   <WelcomeWarp show={isFirstRun} onDone={startOnboarding} />
 *
 * The starfield is FOUR TILED GRADIENT LAYERS, not a canvas.
 *
 * A canvas warp means a requestAnimationFrame loop, a backing store the size
 * of the viewport times the device pixel ratio (about 33 MB on a 4K screen at
 * DPR 2) and per-frame JavaScript on the main thread while the app behind it
 * is still mounting and hydrating. Four divs carrying a repeating
 * radial-gradient and one scale() each cost a single 200x200 tile that the
 * GPU repeats, and every property animated is opacity or transform, so the
 * whole thing runs on the compositor: no layout, no paint, no main-thread
 * work at all after the first frame.
 *
 * The overlay's fade in / hold / fade out is one keyframe animation whose
 * duration IS `durationMs`, so the percentages rescale themselves for any
 * length a caller passes; a single timer fires `onDone` at the same mark, and
 * there is no second clock that can drift out of step with what is on screen.
 *
 * Everything the host might want to change is a prop, and every prop is
 * optional: each branding row is skipped when its prop is absent, so the same
 * component runs as a bare message in a project with no mark and no strapline
 * yet. See readme.txt.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_PAD, FALLBACK_FONT, LAYERS, WELCOME_CSS } from './styles';

/**
 * Share of the total duration the branding takes to settle.
 *
 * The typing runs UNDER it rather than after it: both start at zero. The line
 * is the reason the overlay exists, and an overlay that spends its first
 * fifth of a second and a half doing nothing to it feels like it is loading.
 */
const SETTLE_SHARE = 0.18;
/**
 * Share of the total duration the whole message takes to type.
 *
 * Being a share rather than a fixed per-character rate is what keeps a long
 * message from running past the end of the overlay, but it also means the
 * typing SPEED falls out of this times the duration over the character count.
 * At the 9s default and this share that is about 51ms a character, which is
 * roughly the rate a person types at. Changing the duration changes the feel
 * of the typing too; check both.
 */
const TYPE_SHARE = 0.2;

export type WelcomeWarpProps = {
  /** Mounts the overlay. Flip it false again after `onDone` fires. */
  show: boolean;
  /** Fires once the animation has run its course. */
  onDone?: () => void;
  /** Brand mark above the wordmark. Any URL the host serves; row skipped if absent. */
  logoSrc?: string;
  /** The brand line, e.g. `Welcome to Sellular`. */
  title?: string;
  /** The product's one-liner, under the brand line. */
  tagline?: string;
  /** The line the whole thing exists to deliver. */
  message?: string;
  /** Whole lifetime including both fades. */
  durationMs?: number;
  /** Glow colour for the mark, the rule and the message. */
  accent?: string;
  /** Backdrop behind the stars. */
  background?: string;
  /** Ink for the wordmark; the tagline and message are mixed from it. */
  foreground?: string;
  /** Display face. Defaults to the host's `--font-brand`, else a system stack. */
  fontFamily?: string;
  /** Gutter either side of the card. Any CSS length. */
  padding?: string;
  zIndex?: number;
};

export function WelcomeWarp({
  show,
  onDone,
  logoSrc,
  title,
  tagline,
  message = "You're here because you're special!",
  durationMs = 9000,
  accent = '#6cf',
  background = '#000',
  foreground = '#fff',
  fontFamily = FALLBACK_FONT,
  padding = DEFAULT_PAD,
  zIndex = 10001,
}: WelcomeWarpProps) {
  // A logo that 404s in a project whose assets sit elsewhere should leave a
  // gap, not a broken-image glyph in the middle of the brand card.
  const [logoFailed, setLogoFailed] = useState(false);

  // `onDone` is held in a ref and never in a dependency array. Callers pass an
  // inline arrow (`onDone={() => setWelcome(false)}`) far more often than a
  // memoised one, and a new identity on every parent render would restart the
  // timer below each time: an overlay that never reaches its own end.
  const done = useRef(onDone);
  done.current = onDone;
  const finish = useCallback(() => done.current?.(), []);

  // One timer for the whole thing, started on mount and cleared on unmount, so
  // a caller that pulls `show` early (a route change) cannot leave a callback
  // queued against an overlay that is no longer on screen.
  //
  // It is the ONLY way out. There is no Escape handler and no click-to-skip:
  // this plays once, on a first run, immediately before the tour that explains
  // the app, and a first-time user who dismisses it by reflex never sees it
  // again. Nine seconds of a covered screen is the price of that being true.
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(finish, durationMs);
    return () => clearTimeout(timer);
  }, [show, durationMs, finish]);

  // Each mount gets a clean slate, or a retried logo stays hidden on replay.
  useEffect(() => {
    if (show) setLogoFailed(false);
  }, [show]);

  // Portalled for the same reason a modal is: any transformed ancestor becomes
  // the containing block for position:fixed, which would pin this inside a
  // panel instead of over the viewport. The `document` guard is what makes the
  // component safe to render from a server-rendered tree.
  if (!show || typeof document === 'undefined') return null;

  const hasBrand = Boolean(title || tagline);
  // Array.from, not split(''): an emoji or an accented character is one
  // grapheme, and splitting on code units would reveal half of one first.
  const letters = Array.from(message);
  // The message finishes typing at roughly TYPE_SHARE of the way
  // through whatever its length, so a longer one types faster rather than
  // still going when the overlay has started to fade.
  const typeStep = `${(durationMs * TYPE_SHARE) / Math.max(letters.length, 1)}ms`;

  return createPortal(
    <div
      className="swk-root"
      role="status"
      aria-live="polite"
      style={
        {
          '--swk-dur': `${durationMs}ms`,
          '--swk-pad': padding,
          '--swk-accent': accent,
          '--swk-bg': background,
          '--swk-fg': foreground,
          '--swk-font': fontFamily,
          '--swk-settle-share': SETTLE_SHARE,
          '--swk-type-step': typeStep,
          '--swk-z': zIndex,
        } as React.CSSProperties
      }
    >
      {/* Inline rather than in the host's stylesheet so that copying the
        folder is the whole installation. Two mounted instances would inject
        this twice, which is idempotent: the rules are identical and every
        value they read comes from the root above. */}
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static stylesheet, no interpolation of user input */}
      <style dangerouslySetInnerHTML={{ __html: WELCOME_CSS }} />
      {LAYERS.map((layer) => (
        <div
          key={layer.position}
          className="swk-stars"
          style={{ backgroundPosition: layer.position, animationDelay: `${layer.delay}ms` }}
        />
      ))}
      <div className="swk-core" />
      <div className="swk-stack">
        <div className="swk-brand">
          {/* A plain <img>, not next/image: the kit has to drop into any React
            app, and the mark is one small asset the host already serves. Empty
            alt because the wordmark directly below says the same thing. */}
          {logoSrc && !logoFailed ? (
            // biome-ignore lint/performance/noImgElement: next/image would tie a portable kit to Next, and this is one small already-served asset
            <img className="swk-logo" src={logoSrc} alt="" onError={() => setLogoFailed(true)} />
          ) : null}
          {title ? <p className="swk-name">{title}</p> : null}
          {tagline ? <p className="swk-tagline">{tagline}</p> : null}
          {hasBrand ? <hr className="swk-rule" /> : null}
        </div>
        {/* One span per character, each revealed on a stagger by the
          stylesheet, plus a hidden copy of the whole line for assistive tech:
          this sits inside a live region, and without it a screen reader
          announces the message one letter at a time. */}
        <p className="swk-message">
          <span className="swk-sr">{message}</span>
          {letters.map((letter, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: position IS the identity here, and the list only changes when the whole message does
              key={i}
              className="swk-ch"
              aria-hidden="true"
              style={{
                animationDelay: `calc(var(--swk-type-step) * ${i})`,
              }}
            >
              {letter}
            </span>
          ))}
        </p>
      </div>
    </div>,
    document.body
  );
}
