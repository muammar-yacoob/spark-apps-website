'use client';

import { useQuery } from '@tanstack/react-query';
import { type Ad, HOUSE_ADS } from './ads';

/**
 * The cross-promo list, served by SparkAds when it is reachable.
 *
 * SparkAds (the spark-ads app) owns the network inventory: house ads plus
 * whoever has bought the current hour. This hook asks it what to show and
 * falls back to the local hardcoded HOUSE_ADS on any failure -- or when
 * NEXT_PUBLIC_SPARK_ADS_URL is simply not set, which is also the local-dev
 * and network-is-down story. The site must render identically whether the ad
 * network exists or not; only the list's freshness changes.
 *
 * Shape note: the serve API returns the same `Ad` fields HOUSE_ADS already
 * carries, so a network ad and a local ad are indistinguishable downstream.
 * `paid` is the one addition, used only to decide what gets a tracking
 * beacon and where its icon resolves from (see useAppIcon's `fromNetwork`).
 */

const ADS_BASE = process.env.NEXT_PUBLIC_SPARK_ADS_URL?.replace(/\/$/, '');
const APP_ID = 'spark-apps';

export interface NetworkAd extends Ad {
  paid?: boolean;
}

interface ServeResponse {
  ads: NetworkAd[];
  slot: { forSale: boolean; pricingUrl: string; from: string };
}

export function useNetworkAds(): { ads: NetworkAd[]; slotForSale: boolean } {
  const { data } = useQuery<ServeResponse | null>({
    queryKey: ['network-ads'],
    queryFn: async () => {
      const res = await fetch(`${ADS_BASE}/api/serve?app=${APP_ID}`);
      if (!res.ok) return null;
      return (await res.json()) as ServeResponse;
    },
    enabled: Boolean(ADS_BASE),
    // Matches the serve API's own CDN window; refetching faster buys nothing.
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    ads: data?.ads?.length ? data.ads : HOUSE_ADS,
    slotForSale: data?.slot?.forSale ?? true,
  };
}

/**
 * Fire-and-forget count. sendBeacon so a click beacon survives the page
 * being torn down by the very navigation it is counting; silently a no-op
 * when the network is not configured, because a count nobody can read is
 * not worth a request.
 */
export function trackAd(creativeId: string, event: 'impression' | 'click'): void {
  if (!ADS_BASE) return;
  const body = JSON.stringify({ app: APP_ID, creativeId, event });
  try {
    if (!navigator.sendBeacon(`${ADS_BASE}/api/track`, new Blob([body], { type: 'text/plain' }))) {
      fetch(`${ADS_BASE}/api/track`, { method: 'POST', body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Tracking must never surface to somebody just browsing the site.
  }
}
