/**
 * The overlay's entire stylesheet, shipped as a string.
 *
 * It lives in a `<style>` tag inside the portal rather than in the host's
 * global CSS so that copying this folder is the whole installation: no
 * stylesheet import to remember, nothing to add to a Tailwind content glob,
 * and no chance of a host's reset reaching in. Every class is `swk-` prefixed
 * and every tunable is a custom property set on the root by the component.
 */

/**
 * One pass of a star layer, front to back.
 *
 * The four layers and their stagger are derived from this, so it is the only
 * number to change to alter the speed of the field: the delays below are
 * quarter-cycle fractions of it, and the tile's own zoom keyframe is played
 * over it.
 */
export const CYCLE_MS = 4000;

/**
 * Four copies of the same tile, a quarter cycle apart.
 *
 * The delays are NEGATIVE so each layer starts mid-flight: with positive
 * delays the first layer arrives alone and the field takes a full cycle to
 * fill, which the viewer sees as the effect starting late.
 */
export const LAYERS = [
  { position: '50% 50%', delay: 0 },
  { position: '20% 60%', delay: -CYCLE_MS / 4 },
  { position: '-20% -30%', delay: -CYCLE_MS / 2 },
  { position: '40% -80%', delay: -(CYCLE_MS * 3) / 4 },
];

/** Used when the host sets no `--font-brand` and the caller names no font. */
export const FALLBACK_FONT =
  'var(--font-brand, ui-sans-serif), ui-sans-serif, system-ui, -apple-system, sans-serif';

/** The gutter either side of the card. Scales with the viewport. */
export const DEFAULT_PAD = 'clamp(1.25rem, 5vw, 5rem)';

export const WELCOME_CSS = `
.swk-root {
  position: fixed;
  inset: 0;
  z-index: var(--swk-z);
  overflow: hidden;
  background: var(--swk-bg);
  /* Not \`pointer\`: the overlay takes no input and cannot be skipped, and a
     hand cursor over it advertises a click that does nothing. It still eats
     pointer events rather than letting them through, so nobody clicks blind
     into the app mounting underneath. */
  cursor: default;
  /* Layout and paint only, deliberately not \`strict\`: that adds size
     containment, which sizes an element as if it were empty. This one is
     sized by its insets so it survives, but a copy of this kit that is ever
     given an auto height would collapse, and the perf win is the same. */
  contain: layout paint;
  animation: swk-veil var(--swk-dur) linear forwards;
}
.swk-stars {
  position: absolute;
  /* Oversized so the corners stay covered at full zoom, since the layer
     scales about its own centre. */
  inset: -50%;
  opacity: 0;
  will-change: transform, opacity;
  background-repeat: repeat;
  background-size: 200px 200px;
  background-image:
    radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 110px 180px, #cfe8ff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 175px 25px, #fff, rgba(0,0,0,0));
  animation: swk-zoom ${CYCLE_MS}ms infinite;
}
/* A glow at the vanishing point, so the stars read as coming from somewhere
   ahead rather than from the edges of a flat plane. */
.swk-core {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in srgb, var(--swk-accent) 22%, transparent) 0%,
    rgba(0, 0, 0, 0) 45%
  );
}
/* The card does not move. Only the starfield does, and that is the whole
   point of the effect: a headline that scales or rises while the field rushes
   past it competes with that motion for the same attention, and the copy is
   what the beat exists to deliver. It is readable from the first frame and
   still until the overlay takes it away.

   Nothing in here animates, so nothing here carries a will-change: the only
   compositor layers this overlay asks for are the four star layers.

   The block is sized off the VIEWPORT rather than a max-width in ems, so the
   type grows with the screen instead of sitting in a fixed column in the
   middle of a 4K monitor. --swk-pad is the gutter, and it scales too. */
.swk-stack {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(100vw - var(--swk-pad) * 2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4em;
  transform: translate(-50%, -50%);
  text-align: center;
  text-wrap: balance;
  /* The fallback list lives INSIDE the var(), not after it. A var() naming an
     undefined property makes the whole declaration invalid at computed-value
     time, so \`font-family: var(--undefined), system-ui\` does not fall back to
     system-ui -- it drops the declaration and inherits whatever the host body
     uses. That is the difference between this kit looking deliberate and
     looking unstyled in a project that has no --font-brand. */
  font-family: var(--swk-font);
}
.swk-stack > * {
  max-width: 100%;
}
.swk-stack p,
.swk-stack hr {
  margin: 0;
}
/* The branding is wrapped so ONE element carries the settle. Scaling the
   mark, the wordmark and the strapline separately would pull the group apart,
   since the same scale applied to three different box sizes moves each by a
   different distance. The message is outside it: it types, it does not
   settle, and the two beats are meant to read as consecutive. */
.swk-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4em;
  animation: swk-settle calc(var(--swk-dur) * var(--swk-settle-share)) ease-out both;
}
.swk-logo {
  width: clamp(3.5rem, min(10vw, 18vh), 16rem);
  height: clamp(3.5rem, min(10vw, 18vh), 16rem);
  object-fit: contain;
  border-radius: 22%;
  filter: drop-shadow(0 0 22px color-mix(in srgb, var(--swk-accent) 70%, transparent));
}
/* Every size below is clamp(floor, min(vw, vh), ceiling).

   The vw term is calibrated so a wordmark of roughly twenty characters spans
   the gutters on a wide screen; a longer name wraps instead, which
   text-wrap: balance keeps even and which still fills the width. The vh term
   is what keeps a wide, SHORT window (a laptop at 1920x600, a browser sharing
   the screen with something else) from pushing the block taller than the
   viewport, since sizing on width alone knows nothing about the height it is
   filling. The ceilings sit high enough to stay out of the way up to about
   2560px and only stop the growth on a genuinely enormous display. */
.swk-name {
  font-size: clamp(2rem, min(9.5vw, 17vh), 15rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: 0.01em;
  color: var(--swk-fg);
  text-shadow: 0 0 4px var(--swk-accent), 0 0 42px color-mix(in srgb, var(--swk-accent) 55%, transparent);
}
.swk-tagline {
  font-size: clamp(0.72rem, min(2.3vw, 4vh), 3.5rem);
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--swk-fg) 55%, transparent);
}
/* A rule rather than more spacing: the brand block above it is the product
   introducing itself and the line below it is addressed to one person, and
   without a break between them the second reads as a third line of marketing.
   Its width tracks the type, so it stays proportionate as the block grows. */
.swk-rule {
  width: min(26vw, 30rem);
  height: 1px;
  border: 0;
  margin: 0.5em 0 0.35em;
  background: linear-gradient(90deg, transparent, var(--swk-accent), transparent);
}
.swk-message {
  font-size: clamp(1.1rem, min(5vw, 9vh), 8rem);
  font-weight: 600;
  line-height: 1.25;
  color: color-mix(in srgb, var(--swk-accent) 45%, var(--swk-fg));
  text-shadow: 0 0 26px color-mix(in srgb, var(--swk-accent) 45%, transparent);
}
/* Typed one character at a time, but the WHOLE string is laid out from the
   first frame and the characters only become visible on a stagger.

   The usual CSS typewriter animates a width with steps() behind an
   overflow:hidden, which needs the text on one line: this message is a prop,
   a longer one in another project wraps, and a growing width would reflow and
   re-break those lines on every character. Revealing in place cannot, because
   nothing about the layout changes. It also costs no re-renders and no
   reflow: opacity on a span that is already where it will stay.

   --swk-type-step is a fraction of the total duration worked out from the
   character count, so a longer message types faster rather than running past
   the end of the overlay. */
.swk-ch {
  opacity: 0;
  animation: swk-type 40ms ease-out forwards;
}
/* The message reaches assistive tech as one string from a hidden copy, while
   the visible characters are hidden from the tree. Without it a screen reader
   in the live region announces the line one letter at a time. */
.swk-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
  white-space: nowrap;
  clip-path: inset(50%);
}
/* Micro, and deliberately so: enough that the brand block arrives rather than
   appears, not enough to read as a transition of its own while the starfield
   is already moving behind it. */
@keyframes swk-settle {
  from { opacity: 0; transform: scale(1.07); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes swk-type {
  to { opacity: 1; }
}
@keyframes swk-veil {
  0% { opacity: 0; }
  6% { opacity: 1; }
  84% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes swk-zoom {
  0% { opacity: 0; transform: scale(0.5); animation-timing-function: ease-in; }
  85% { opacity: 1; transform: scale(2.8); animation-timing-function: linear; }
  100% { opacity: 0; transform: scale(3.5); }
}
/* Motion sensitivity: the field still has depth, it just stops rushing at
   you. The overlay keeps its own fade, so the beat still reads as a moment
   rather than a flash of black. The card never moved in the first place. */
@media (prefers-reduced-motion: reduce) {
  .swk-stars { opacity: 0.85; transform: scale(1.4); animation: none; }
  .swk-brand { animation: none; }
  .swk-ch { animation: none; opacity: 1; }
}
`;
