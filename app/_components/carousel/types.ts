/**
 * Shared types for the carousel package.
 *
 * The only thing the carousel demands of an item is a stable `id`. Everything
 * else is the consumer's business, rendered through `renderItem`.
 */

export interface CarouselItem {
  /**
   * Stable and unique within the list.
   *
   * Not a name, not an index. The version this was ported from keyed slides,
   * dots and internal maps off a display name, so two entries sharing one made
   * them collide and React warned on duplicate keys. Indices are no better:
   * the loop renders three copies of the list, so index 0 appears three times.
   */
  id: string;
}

export interface CarouselOptions {
  /** How many items are in the real list, before the loop triplicates it. */
  itemCount: number;
  /** How many are visible at once at the current breakpoint. */
  visibleCards: number;
  /** Milliseconds between automatic advances. Zero or less disables autoplay. */
  intervalMs?: number;
  /** Gap between cards, in pixels. Must match the CSS gap for the maths to line up. */
  gap: number;
  /**
   * Skip animation and autoplay.
   *
   * Driven by `prefers-reduced-motion` in `Carousel`, but exposed so a host can
   * force it -- inside a modal, in a print view, or under test.
   */
  reducedMotion?: boolean;
}
