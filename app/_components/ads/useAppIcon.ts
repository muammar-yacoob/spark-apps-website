'use client';

import { useQuery } from '@tanstack/react-query';
import type { AppIcon } from '@/lib/app-icon';

/**
 * An advertiser's favicon and the colour to theme its card with.
 *
 * A query rather than a mutation: this is a fact about a domain, it is the same
 * for everybody, and it should be fetched on sight. The server caches the
 * resolved answer for the life of the process and the response carries a day of
 * `Cache-Control`, so the cost of a card appearing is one request, once.
 *
 * A missing icon resolves to `null` rather than throwing. Not having a logo is
 * the ordinary case here, not a failure -- the card has a monogram for it.
 *
 * Paid network creatives resolve at spark-ads rather than here: this route
 * only allowlists the house domains (see app/api/app-icon/route.ts), and
 * teaching this site every advertiser's domain is the central network's job.
 */
const NETWORK_BASE = process.env.NEXT_PUBLIC_SPARK_ADS_URL?.replace(/\/$/, '') ?? '';

export function useAppIcon(domain: string, fromNetwork = false) {
  const base = fromNetwork ? NETWORK_BASE : '';
  return useQuery<AppIcon | null>({
    queryKey: ['app-icon', domain, fromNetwork],
    queryFn: async () => {
      const res = await fetch(`${base}/api/app-icon?domain=${encodeURIComponent(domain)}`);
      if (!res.ok) return null;
      return (await res.json()) as AppIcon;
    },
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
}
