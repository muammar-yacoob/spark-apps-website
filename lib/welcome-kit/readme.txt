Welcome Kit
===========

A one-shot "travelling through space" splash for a user's FIRST session: a
starfield rushing past, the product introducing itself, and one line addressed
to the person reading it. Gone in nine seconds.

Copy this folder into any React DOM app and import it. It pulls in nothing but
react and react-dom, uses no Tailwind classes, no global stylesheet and
nothing from the host application, so the copy IS the installation.

Sellular is where it is maintained: change it there and copy it across, the
way lib/favicon is handled. The one thing that legitimately differs between
copies is formatting -- each repo's Biome config decides its own quote style,
so run the formatter after copying and diff the copies with whitespace and
quotes ignored.


Files
-----

WelcomeWarp.tsx   "use client" component. Timing, skip handling, the portal
styles.ts         the whole stylesheet as a string, plus the star layers
use-first-run.ts  optional localStorage gate for apps with no first-run flag
index.ts          barrel exports


Install
-------

  import { WelcomeWarp, useFirstRun } from '@/lib/welcome-kit';

  const { show, dismiss } = useFirstRun('myapp:welcome');

  <WelcomeWarp
    show={show}
    onDone={dismiss}
    logoSrc="/favicon.png"
    title={`Welcome to ${SITE_NAME}`}
    tagline="Your one-liner here"
    accent="#2dd4bf"
  />

Every prop but `show` is optional and each branding row is skipped when its
prop is absent, so the same component runs as a bare message in a project that
has no mark or no strapline yet.

`useFirstRun` is a convenience, not the design. The overlay owns no "have they
seen it" flag, because most apps already answer that somewhere (a tour flag, a
created_at, a server-side field) and a second answer kept in here would be a
second source of truth for the same fact. Sellular hands it the onboarding
flag it already had, and runs welcome -> tour as one phase so the two can
never overlap. Use the hook only where there is no first answer yet.

Pull the name, mark and strapline from whatever the host already uses for
them, but check what that module costs in a CLIENT bundle first. Sellular's
strapline lived in its SEO config, which drags a directory-kit generator and
28 KB of JSON behind it, and a component in the root layout renders on every
page: the strapline moved to the small config module that was already there.


Props
-----

  show        mounts the overlay
  onDone      fires at the end, or the instant it is skipped
  logoSrc     brand mark above the wordmark; row skipped when absent or 404
  title       the brand line, e.g. `Welcome to Sellular`
  tagline     the product's one-liner, under the brand line
  message     default: "You're here because you're special!"
  durationMs  whole lifetime including both fades (default 9000)
  accent      glow for the mark, the rule and the message (default #6cf)
  background  backdrop behind the stars (default #000)
  foreground  ink for the wordmark; tagline and message mix from it
  fontFamily  display face; defaults to --font-brand, else a system stack
  padding     gutter either side of the card; any CSS length
  zIndex      default 10001, above a typical modal layer


Where it runs
-------------

Anywhere React renders to the DOM. Verified against the stacks in this
portfolio: Next 15/16 with React 19 (Sellular, ViralCat, spark-pay, spark-ai,
Bottled, QuickPeek's web/, SparkStack, spark-apps-website) takes it as-is.

It does NOT run on spark-mobile, which is React Native: there is no DOM, no
createPortal to document.body, no <style> element and no CSS animation, so
every mechanism here is missing. A React Native version would be a rewrite
against Animated or Reanimated, sharing the design and none of the code.

VidLet is a Node CLI and MCP server with no React at all, so the question does
not arise there.


Why gradients and not a canvas
------------------------------

A canvas warp needs a rAF loop and a backing store of viewport x DPR squared
(about 33 MB on a 4K screen at DPR 2), running main-thread JavaScript at the
exact moment the app behind it is mounting and hydrating.

This draws four divs. Each carries the same repeating 200x200 radial-gradient
tile and scales up on a staggered loop, so the GPU repeats one tile and
composites four transforms. Everything animated is opacity or transform:
after the first frame there is no layout, no paint and no main-thread work.
The layers start on NEGATIVE delays, a quarter cycle apart, so the field is
already full at t=0 instead of fading up from an empty screen.

The technique is the classic CSS starfield (tiled radial-gradients plus an
infinite scale), fitted here with a fixed lifetime and a message.


Timing
------

One keyframe animation, `swk-veil`, runs the fade in / hold / fade out and its
duration IS durationMs, so the percentages rescale themselves when a caller
passes a different length. A single setTimeout fires onDone at the same mark.
There is no second clock that can drift from what is on screen.

The onDone callback is held in a ref and kept out of every dependency array.
Callers pass an inline arrow far more often than a memoised one, and a new
identity on each parent render would restart that timer every time: an
overlay that never reaches its own end.


One beat, then a hold
---------------------

The branding settles (a micro zoom-out, 1.07 to 1) while the message types
under it. Both start at zero: the line is the reason the overlay exists, and
one that spends its first second and a half not writing it feels like it is
loading. Then nothing moves until the overlay fades, on purpose -- motion
under a line someone is reading competes with the reading for the same
attention.

At the 9s default: settle and typing both from 0, ending at 1.6s and 1.8s, at
about 51ms a character; the finished card holds until 7.6s; fade to 9s.

ONE element carries the settle, the .swk-brand wrapper: scaling the mark,
wordmark and strapline separately would pull the group apart, since one scale
on three box sizes moves each a different distance.

The message is typed one character at a time, but the WHOLE string is laid
out from the first frame and the characters only become visible on a stagger.
The usual CSS typewriter animates a width with steps() behind an
overflow:hidden, which needs the text on one line: the message is a prop, a
longer one in another project wraps, and a growing width would reflow and
re-break those lines on every character. Revealing in place cannot, because
nothing about the layout changes, and it costs no re-renders and no reflow --
opacity on a span already sitting where it will stay. The per-character step
is worked out from the character count against the duration, so a longer
message types at the same total speed rather than running past the end. The
flip side is that typing SPEED falls out of TYPE_SHARE times the duration over
the character count: change durationMs and the feel of the typing changes with
it, so check both.

A hidden copy of the line carries it to assistive tech and the visible
characters are hidden from the tree. This sits in a live region: without that
a screen reader announces the message one letter at a time.

There was once a third beat, where the branding collapsed away and the message
grew into its space. It needed two figures measured off the rendered DOM
(how far the message centre sat below the stack centre, and how far the line
could grow before it hit the gutters) because both depend on the size of text
supplied as a prop. It was removed on request, and the measurement with it.
If it ever comes back, that is what it costs: CSS alone cannot size or centre
against content it has not been told the dimensions of.


Layout
------

The block is sized off the VIEWPORT, not a max-width in ems, so the type grows
with the screen instead of sitting in a fixed column in the middle of a 4K
monitor. --swk-pad is the gutter and scales too.

Every size is clamp(floor, min(vw, vh), ceiling). The vw term is calibrated so
a wordmark of roughly twenty characters spans the gutters on a wide screen; a
longer name wraps instead, which text-wrap: balance keeps even and which still
fills the width. The vh term is what keeps a wide but SHORT window from
pushing the block past the bottom of the viewport, since sizing on width alone
knows nothing about the height it is filling. Measured: 87% of the gutter
width at 1920x1080 and 89% at 375x812, and at 1920x600 the height term takes
over and the block still fits.


Theming
-------

Six custom properties on the root carry every colour, length and face, and
each one has a prop behind it. The stylesheet reads only those, so a host
restyles the overlay without touching styles.ts.

One trap worth knowing if you edit the CSS: a font-family fallback list has to
live INSIDE the var(), not after it. `var(--undefined), system-ui` does not
fall back to system-ui -- a var() naming an undefined property makes the whole
declaration invalid at computed-value time, so the declaration is dropped and
the element inherits the host body's face instead. That is the difference
between this looking deliberate and looking unstyled in a project with no
--font-brand.


Accessibility
-------------

prefers-reduced-motion holds the starfield still at a fixed depth, drops the
settle and reveals the whole message at once, and leaves the fades alone, so the beat still reads as a moment rather than a black
flash. Escape skips it, and so does a click anywhere; nine seconds is short
but it is nine seconds of somebody's screen being covered. The overlay is a
polite live region rather than a control, which is why it is not focusable and
why the keyboard escape hatch is a window listener.
