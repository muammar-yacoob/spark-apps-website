'use client';

/**
 * The header launcher for the palette: a magnifier and the shortcut inside one
 * pill, sized so the glyphs and the lens share a top and bottom edge.
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
  // currentColor at 30% keeps the outline legible on any header colour without
  // the component knowing the palette.
  const subtle = 'color-mix(in srgb, currentColor 30%, transparent)';
  const keysHidden = KEY_VISIBILITY[hideKeysBelow];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label} (Ctrl or ⌘ K)`}
      title={`${label} (Ctrl or ⌘ K)`}
      className={
        className ??
        `${BUTTON_VISIBILITY[hideBelow]} items-center gap-2 rounded-lg border px-3 py-1.5 opacity-70 transition-[opacity,background-color] hover:bg-[color-mix(in_srgb,currentColor_12%,transparent)] hover:opacity-100`
      }
      style={className ? undefined : { borderColor: subtle }}
    >
      <Magnifier size={21} />
      {/* fontFamily inherit: a bare <kbd> falls back to the browser's
			    monospace, which never matches the header it sits in. */}
      <kbd
        className={`${keysHidden} items-center gap-1 font-semibold leading-none`}
        style={{ fontFamily: 'inherit' }}
      >
        {/* Sized so the ⌘ ink box matches the lens and the K: 15px tall, same
				    centre line. The nudges cancel the descender space each glyph
				    reserves but never draws into. */}
        <span className="leading-none" style={{ fontSize: 18, transform: 'translateY(1.5px)' }}>
          ⌘
        </span>
        <span className="leading-none" style={{ fontSize: 21, transform: 'translateY(1.5px)' }}>
          K
        </span>
      </kbd>
    </button>
  );
}
