'use client';

import Script from 'next/script';
import type { CSSProperties } from 'react';

/**
 * The SparkAds cross-promo strip: a compact, rotating slice of the network,
 * plus the one slot still for sale.
 *
 * Previously a vendored fork of the carousel -- CrossPromo.tsx, AdCard.tsx,
 * useNetworkAds.ts, useAppIcon.ts, ads.ts, plus this site's own
 * `/api/app-icon` route and `lib/app-icon.ts` to resolve favicons for it. Ten
 * other apps in the network carried the same fork independently (see
 * spark-ads' docs/carousel-distribution.md) and all of them have since moved
 * to this: one script tag and one custom element, so the card that ships is
 * the card that's live everywhere, on SparkAds' next deploy rather than this
 * site's.
 *
 * This is NOT a second "our apps" section -- the homepage already has a full
 * grid of every Spark Apps product (see app/page.tsx's Apps Grid, backed by
 * lib/data/apps.ts), with tooltips, tags and descriptions. What this strip
 * adds is a live feed from SparkAds that can carry a paid advertiser never
 * added to the portfolio grid, plus the one "buy this slot" unit on the site.
 */

/** Production unless NEXT_PUBLIC_SPARK_ADS_URL points somewhere else. */
const BASE = process.env.NEXT_PUBLIC_SPARK_ADS_URL?.replace(/\/+$/, '') || 'https://sparkads.dev';

/** The site's own accent, so the active dot matches everything else worth pressing. */
const THEME = { '--carousel-accent': 'var(--color-brand)' } as CSSProperties;

interface Props {
  /** The heading drawn above the cards. */
  title?: string;
  className?: string;
}

export function SparkAdsCarousel({ title = 'From the Spark network', className }: Props = {}) {
  return (
    <div className={className}>
      {/*
       * `afterInteractive`, not `lazyOnload`: the tag below is an empty inline
       * box until this lands and upgrades it, so loading the bundle after
       * everything else means a gap near the bottom of the page that fills in
       * late. next/script dedupes on `src`, so mounting this twice still
       * fetches it once.
       */}
      <Script src={`${BASE}/embed.js`} strategy="afterInteractive" />
      <spark-ads-carousel app="spark-apps-website" title={title} style={THEME} />
    </div>
  );
}
