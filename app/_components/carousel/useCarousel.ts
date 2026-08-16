'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CarouselOptions } from './types';

/**
 * The transport layer: index maths, the infinite loop, and autoplay.
 *
 * Knows nothing about what is being scrolled. It reports where the track should
 * sit and which dot is lit; the component draws.
 *
 * ## How the loop works
 *
 * The list is rendered three times over and the track starts on the middle
 * copy. Advancing past the end of that copy lands on visually identical cards
 * from the third, so at that moment the transition is switched off, the index
 * is snapped back by one list length, and the transition is switched on again a
 * frame later. Nobody sees the jump, and the track can run forever without the
 * translate growing without bound.
 *
 * The same trick runs backwards, which the version this was ported from did not
 * do -- it only ever incremented, so a "previous" button would have walked off
 * the front of the track and stuck.
 */

/** Matches the CSS transition below; the snap must wait for the slide to finish. */
const SLIDE_MS = 700;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

export function useCarousel({
  itemCount,
  visibleCards,
  intervalMs = 5000,
  gap,
  reducedMotion = false,
}: CarouselOptions) {
  /** Only worth looping if there is something off-screen to loop to. */
  const canSlide = itemCount > visibleCards;
  const startOffset = canSlide ? itemCount : 0;

  const [index, setIndex] = useState(startOffset);
  const [animating, setAnimating] = useState(true);
  const [paused, setPaused] = useState(false);

  // Re-centre when the breakpoint changes the number of visible cards, or when
  // the list itself changes length.
  useEffect(() => {
    setIndex(startOffset);
  }, [startOffset]);

  const next = useCallback(() => setIndex((i) => i + 1), []);
  const previous = useCallback(() => setIndex((i) => i - 1), []);
  const goTo = useCallback((target: number) => setIndex(startOffset + target), [startOffset]);

  // --- autoplay ----------------------------------------------------------
  useEffect(() => {
    if (!canSlide || paused || reducedMotion || intervalMs <= 0) return;
    const timer = setInterval(next, intervalMs);
    return () => clearInterval(timer);
  }, [canSlide, paused, reducedMotion, intervalMs, next]);

  // --- the snap ----------------------------------------------------------
  //
  // Both directions. Once the index has walked a whole list length away from
  // the middle copy, jump it back without animating.
  useEffect(() => {
    if (!canSlide) return;
    const tooFar = index >= startOffset + itemCount;
    const tooNear = index < startOffset - itemCount;
    if (!tooFar && !tooNear) return;

    const snap = () => {
      setAnimating(false);
      setIndex((i) => (tooFar ? i - itemCount : i + itemCount));
    };

    // Reduced motion has no slide to wait for.
    if (reducedMotion) {
      snap();
      return;
    }
    const timer = setTimeout(snap, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, canSlide, itemCount, startOffset, reducedMotion]);

  // Re-arm the transition one tick after a snap, so the snap itself is silent
  // but the next move animates.
  useEffect(() => {
    if (animating) return;
    const timer = setTimeout(() => setAnimating(true), 50);
    return () => clearTimeout(timer);
  }, [animating]);

  // --- geometry ----------------------------------------------------------
  //
  // Widths are computed rather than fractioned so the gaps come out of the
  // track's width instead of overflowing it, and so the slide distance is
  // exactly one card plus one gap.
  const gapCount = visibleCards - 1;
  const cardWidth = `calc((100% - ${gap * gapCount}px) / ${visibleCards})`;
  const slideBy = `calc((100% - ${gap * gapCount}px) / ${visibleCards} + ${gap}px)`;

  const trackStyle = useMemo(
    () => ({
      gap: `${gap}px`,
      transform: `translateX(calc(-${index} * ${slideBy}))`,
      transition: animating && !reducedMotion ? `transform ${SLIDE_MS}ms ${EASING}` : 'none',
    }),
    [gap, index, slideBy, animating, reducedMotion]
  );

  /**
   * Which real item the leftmost visible card corresponds to.
   *
   * Modulo, then corrected: JavaScript's `%` keeps the sign of the dividend, so
   * a negative index -- reachable now that the loop runs backwards -- would
   * otherwise produce a negative dot.
   */
  const activeIndex = canSlide ? (((index - startOffset) % itemCount) + itemCount) % itemCount : 0;

  return {
    index,
    activeIndex,
    canSlide,
    startOffset,
    cardWidth,
    trackStyle,
    next,
    previous,
    goTo,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
    paused,
  };
}

/**
 * Which breakpoint we are on, as a card count.
 *
 * Measured with `matchMedia` rather than a resize listener plus a width read:
 * the browser already knows the answer and will tell us when it changes, which
 * is both cheaper and free of the debounce the original needed.
 *
 * Starts at the mobile count on purpose. The first client render must agree
 * with the server's, and the server has no viewport.
 */
export function useVisibleCards(breakpoints: { min: number; cards: number }[], fallback: number) {
  const [cards, setCards] = useState(fallback);
  // Sorted widest-first once, so the first match below wins.
  const ordered = useRef(breakpoints);
  ordered.current = [...breakpoints].sort((a, b) => b.min - a.min);

  useEffect(() => {
    const lists = ordered.current.map((bp) => ({
      cards: bp.cards,
      query: window.matchMedia(`(min-width: ${bp.min}px)`),
    }));

    const apply = () => {
      const hit = lists.find((l) => l.query.matches);
      setCards(hit ? hit.cards : fallback);
    };

    apply();
    for (const l of lists) l.query.addEventListener('change', apply);
    return () => {
      for (const l of lists) l.query.removeEventListener('change', apply);
    };
  }, [fallback]);

  return cards;
}

/** Tracks the user's motion preference, live. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return reduced;
}
