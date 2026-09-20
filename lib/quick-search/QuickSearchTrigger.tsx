'use client';

/**
 * The header launcher for the palette: a magnifier and the shortcut inside one
 * pill, sized so the glyphs and the lens share a top and bottom edge.
 *
 * It sits at the weight of the icons around it and swells slightly while Ctrl
 * or ⌘ is held — the moment the shortcut is about to matter. That growth is a
 * transform rather than a size change, so nothing beside it reflows.
 *
 * The shortcut reads ⌘ K on every platform — it is the palette's mark rather
 * than a claim about the keyboard, and Ctrl+K opens it just the same, which
 * the accessible name says.
 *
 * Theme-agnostic on purpose. Everything colour-related derives from
 * `currentColor`, so the pill inherits whatever the surrounding header uses and
 * the same component works on a dark app bar or a light one. Pass `className`
 * to restyle it outright.
 */

import { useEffect, useState } from 'react';

/** Inline SVG rather than an icon package, so the folder stays dependency-free. */
function Magnifier({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/**
 * True while Ctrl or ⌘ is held.
 *
 * Clears on blur as well as keyup: holding a modifier and switching window
 * swallows the keyup, and a pill left swollen would be lying about the
 * keyboard.
 */
function useModifierHeld() {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const isModifier = (key: string) => key === 'Meta' || key === 'Control';
    const down = (e: KeyboardEvent) => {
      if (isModifier(e.key)) setHeld(true);
    };
    const up = (e: KeyboardEvent) => {
      if (isModifier(e.key)) setHeld(false);
    };
    const clear = () => setHeld(false);

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
    };
  }, []);

  return held;
}

/** Written out in full: Tailwind only emits classes it can see as literals. */
const KEY_VISIBILITY = {
  '': 'flex',
  sm: 'hidden sm:flex',
  md: 'hidden md:flex',
  lg: 'hidden lg:flex',
} as const;

/** Same literals for the button itself, for headers that drop it on phones. */
const BUTTON_VISIBILITY = {
  '': 'flex',
  sm: 'hidden sm:flex',
  md: 'hidden md:flex',
  lg: 'hidden lg:flex',
} as const;

export function QuickSearchTrigger({
  onClick,
  className,
  label = 'Search',
  hideKeysBelow = 'sm',
  hideBelow = '',
}: {
  onClick: () => void;
  /** Replaces the default pill styling entirely. */
  className?: string;
  /** Accessible name; the shortcut is appended automatically. */
  label?: string;
  /** Tailwind breakpoint at which the shortcut appears; "" keeps it always. */
  hideKeysBelow?: '' | 'sm' | 'md' | 'lg';
  /** Breakpoint below which the whole button is hidden; "" always shows it. */
  hideBelow?: '' | 'sm' | 'md' | 'lg';
}) {
  const held = useModifierHeld();
  const keysHidden = KEY_VISIBILITY[hideKeysBelow];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} (Ctrl or ⌘ K)`}
      title={`${label} (Ctrl or ⌘ K)`}
      className={
        className ??
        `${BUTTON_VISIBILITY[hideBelow]} origin-center items-center gap-1.5 rounded-md border px-2 py-1 transition-[transform,opacity,background-color,border-color] duration-150 ease-out hover:bg-[color-mix(in_srgb,currentColor_12%,transparent)] hover:opacity-100 motion-reduce:transition-none`
      }
      style={
        className
          ? undefined
          : {
              // currentColor keeps the pill legible on any header without the
              // component knowing the palette; it firms up while the shortcut
              // is live.
              borderColor: `color-mix(in srgb, currentColor ${held ? 50 : 22}%, transparent)`,
              opacity: held ? 1 : 0.65,
              // Transform, not font size: the pill grows in place and the
              // header beside it never moves.
              transform: held ? 'scale(1.14)' : 'scale(1)',
            }
      }
    >
      <Magnifier size={15} />
      {/* fontFamily inherit: a bare <kbd> falls back to the browser's
			    monospace, which never matches the header it sits in. */}
      <kbd
        className={`${keysHidden} items-center gap-0.5 font-semibold leading-none`}
        style={{ fontFamily: 'inherit' }}
      >
        {/* Sized so the ⌘ ink box matches the lens and the K: same height,
				    same centre line. The nudges cancel the descender space each glyph
				    reserves but never draws into. */}
        <span className="leading-none" style={{ fontSize: 13, transform: 'translateY(1px)' }}>
          ⌘
        </span>
        <span className="leading-none" style={{ fontSize: 15, transform: 'translateY(1px)' }}>
          K
        </span>
      </kbd>
    </button>
  );
}
