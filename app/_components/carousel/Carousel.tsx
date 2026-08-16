'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type ReactNode, useRef, useState } from 'react';
import type { CarouselItem } from './types';
import { useCarousel, useReducedMotion, useVisibleCards } from './useCarousel';

/**
 * A generic, dependency-light carousel.
 *
 * Give it items with stable ids and a function to draw one. It handles the
 * sliding, the looping, autoplay, swipe, arrows and dots.
 *
 * Deliberately unopinionated about how a card looks: no card chrome, no
 * heading, no colours of its own beyond `currentColor` and two CSS custom
 * properties. Everything visible is either the consumer's markup or inherits
 * from the host page, which is what makes this portable between projects.
 *
 * ## Theming
 *
 * Two optional custom properties, both with sane fallbacks:
 *
 *   --carousel-accent   the active dot and the arrows' hover tint
 *   --carousel-surface  the arrows' background
 *
 * ## Accessibility
 *
 * The viewport is a labelled group carrying `aria-roledescription="carousel"`.
 * Autoplay stops on hover, on focus anywhere inside, and whenever the user has
 * asked for reduced motion -- in which case the track does not animate at all
 * and the whole thing degrades to a static, scrollable row.
 */

/** Distance in pixels before a pointer drag counts as a swipe rather than a click. */
const SWIPE_THRESHOLD = 45;

export interface CarouselProps<T extends CarouselItem> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Names the carousel for assistive tech, e.g. "Sponsored apps". */
  label: string;
  /**
   * How many cards fit, by minimum viewport width. The smallest count is used
   * below every breakpoint, and on the server.
   */
  breakpoints?: { min: number; cards: number }[];
  mobileCards?: number;
  /** Milliseconds between advances. Zero disables autoplay. */
  intervalMs?: number;
  gap?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

export function Carousel<T extends CarouselItem>({
  items,
  renderItem,
  label,
  breakpoints = [
    { min: 640, cards: 2 },
    { min: 1024, cards: 3 },
  ],
  mobileCards = 1,
  intervalMs = 5000,
  gap = 16,
  showArrows = true,
  showDots = true,
  className = '',
}: CarouselProps<T>) {
  const reducedMotion = useReducedMotion();
  const visibleCards = useVisibleCards(breakpoints, mobileCards);

  const { activeIndex, canSlide, cardWidth, trackStyle, next, previous, goTo, pause, resume } =
    useCarousel({
      itemCount: items.length,
      visibleCards,
      intervalMs,
      gap,
      reducedMotion,
    });

  // --- swipe -------------------------------------------------------------
  //
  // The port's biggest gap: with no arrows and no swipe, a phone user could
  // only wait for autoplay or hunt for a 8px dot.
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!canSlide) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    pause();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const from = dragStart.current;
    dragStart.current = null;
    setDragging(false);
    resume();
    if (!from) return;

    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    // Vertical intent is a page scroll, not a swipe -- let it through.
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else previous();
  };

  if (items.length === 0) return null;

  // Three copies so the loop has somewhere to run. Without sliding, one is
  // plenty and the extra copies would just be duplicate DOM.
  const rendered = canSlide ? [...items, ...items, ...items] : items;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: pointer handlers only pause autoplay; the slides carry their own controls
    <div
      className={`relative ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: a carousel is a labelled group, not a region landmark */}
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        className="overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragStart.current = null;
          setDragging(false);
          resume();
        }}
        // `pan-y` and not `none`: a carousel that eats vertical swipes traps
        // the page under it on a phone.
        style={{
          touchAction: 'pan-y',
          cursor: canSlide ? (dragging ? 'grabbing' : 'grab') : undefined,
        }}
      >
        <div className="flex" style={trackStyle}>
          {rendered.map((item, i) => (
            <div
              // The id alone is not unique across three copies, so the copy
              // number goes in too.
              key={`${item.id}-${Math.floor(i / items.length)}`}
              className="flex-shrink-0"
              style={{ width: cardWidth }}
              // Only the middle copy is the "real" one for assistive tech;
              // the clones are decorative duplicates.
              aria-hidden={canSlide && (i < items.length || i >= items.length * 2)}
            >
              {renderItem(item, i % items.length)}
            </div>
          ))}
        </div>
      </div>

      {canSlide && showArrows && (
        <>
          <Arrow direction="previous" onClick={previous} label={`Previous ${label}`} />
          <Arrow direction="next" onClick={next} label={`Next ${label}`} />
        </>
      )}

      {canSlide && showDots && (
        <div className="mt-4 flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to item ${i + 1} of ${items.length}`}
              aria-current={i === activeIndex}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-6 bg-[var(--carousel-accent,currentColor)]'
                  : 'w-2 bg-white/25 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Arrow({
  direction,
  onClick,
  label,
}: {
  direction: 'previous' | 'next';
  onClick: () => void;
  label: string;
}) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      // Hidden until the carousel is hovered or the button itself is focused,
      // so the arrows do not sit permanently on top of the first and last card.
      className={`-translate-y-1/2 absolute top-1/2 z-10 hidden rounded-full border border-white/[0.14] bg-[var(--carousel-surface,rgb(17_24_39/0.9))] p-1.5 text-gray-300 opacity-0 transition-all hover:border-white/30 hover:text-white focus-visible:opacity-100 group-hover/carousel:opacity-100 sm:block ${
        direction === 'previous' ? '-left-3' : '-right-3'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
