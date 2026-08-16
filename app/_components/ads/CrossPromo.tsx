'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type CSSProperties, useEffect, useState } from 'react';
import { AdCard, AdSlotCard } from '@/app/_components/ads/AdCard';
import { type NetworkAd, trackAd, useNetworkAds } from '@/app/_components/ads/useNetworkAds';
import { Carousel } from '@/app/_components/carousel';

/**
 * The SparkAds cross-promo strip: a compact, rotating slice of the network,
 * plus the one slot still for sale.
 *
 * This is NOT a second "our apps" section -- the homepage already has a full
 * grid of every Spark Apps product (see app/page.tsx's Apps Grid, backed by
 * lib/data/apps.ts), with tooltips, tags and descriptions. Duplicating that
 * here as another wall of the same logos would read as the page repeating
 * itself. What this strip adds instead:
 *
 *   - it is fed live by spark-ads' /api/serve, so it can carry a paid
 *     advertiser that never joins the portfolio grid at all
 *   - it is the one place on this site with an actual "buy this slot" unit
 *   - it stays a fixed, small footprint (one or two cards) regardless of
 *     how many are in the list, unlike the full grid
 *
 * So it is mounted small and secondary -- above the footer, below
 * everything else -- rather than competing with the grid for the fold.
 *
 * The list comes from SparkAds (see useNetworkAds): house ads plus whoever
 * bought the current hour, with the local hardcoded HOUSE_ADS as the offline
 * story. Impressions are counted once per list per mount, not per carousel
 * rotation -- a rotation is the same visitor still sitting there.
 */

type Slide = { id: string; ad?: NetworkAd };

const SLOT_ID = '__slot__';

/** The site's own accent, so the active dot matches everything else worth pressing. */
const THEME = { '--carousel-accent': 'var(--color-brand)' } as CSSProperties;

/**
 * Owns its own QueryClient rather than reaching for a page-level provider.
 *
 * Unlike /dashboard (see DashboardProviders.tsx), the marketing pages this
 * mounts on have no react-query provider in their tree, and adding one at
 * the root for a single cross-promo strip would be a wider change than the
 * strip itself. This keeps the component self-contained wherever it lands.
 */
export function CrossPromo() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <CrossPromoInner />
    </QueryClientProvider>
  );
}

function CrossPromoInner() {
  const { ads, slotForSale } = useNetworkAds();

  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the ad ids, not the array identity a refetch gives back
  useEffect(() => {
    for (const ad of ads) trackAd(ad.id, 'impression');
  }, [ads.map((ad) => ad.id).join()]);

  const slides: Slide[] = [
    ...ads.map((ad) => ({ id: ad.id, ad })),
    ...(slotForSale ? [{ id: SLOT_ID }] : []),
  ];

  if (slides.length === 0) return null;

  return (
    <section
      className="group/carousel mx-auto max-w-3xl space-y-3 px-4 pb-10 sm:px-6"
      style={THEME}
    >
      <h2 className="text-center font-medium text-gray-500 text-sm">From the Spark network</h2>

      <Carousel
        items={slides}
        label="More apps from the Spark network"
        breakpoints={[{ min: 640, cards: 2 }]}
        mobileCards={1}
        gap={12}
        // Slower than a hero carousel's default: this sits quietly above the
        // footer, not fighting for attention with the grid above it.
        intervalMs={7000}
        renderItem={(slide) =>
          slide.ad ? (
            <AdCard ad={slide.ad} onOpen={() => trackAd(slide.id, 'click')} />
          ) : (
            <AdSlotCard />
          )
        }
      />
    </section>
  );
}
