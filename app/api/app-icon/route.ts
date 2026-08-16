import { type NextRequest, NextResponse } from 'next/server';
import { HOUSE_ADS } from '@/app/_components/ads/ads';
import { resolveAppIcon } from '@/lib/app-icon';

/**
 * The favicon and accent colour for one advertised app.
 *
 * A route rather than doing this in the server component, because the carousel
 * and everything around it is client-rendered, and the colour needs `sharp` and
 * the icon's real bytes -- neither of which exists in a browser.
 *
 * `sharp` is a native binary, so this stays on the Node runtime. It is also why
 * the domain is checked against `HOUSE_ADS` rather than taken as given: an open
 * endpoint that fetches and decodes an arbitrary URL on request is a
 * server-side request forgery hole and a free image-decoding service for
 * whoever finds it.
 *
 * spark-ads (the network's own copy of this route) also allowlists any
 * APPROVED paid creative's domain from its database. This site has no ad
 * inventory of its own to sell or approve -- it only ever renders the house
 * ads plus whatever spark-ads' /api/serve hands back -- so the allowlist here
 * stays HOUSE_ADS-only. A paid network creative's icon resolves at spark-ads
 * itself (see useAppIcon's `fromNetwork`), not through this route.
 */

export const runtime = 'nodejs';

const HOUSE_DOMAINS = new Set(HOUSE_ADS.map((ad) => ad.domain));

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get('domain');
  if (!domain) {
    return NextResponse.json({ error: 'A domain is required.' }, { status: 400 });
  }
  if (!HOUSE_DOMAINS.has(domain)) {
    return NextResponse.json({ error: 'Unknown domain.' }, { status: 404 });
  }

  const icon = await resolveAppIcon(domain);
  if (!icon) {
    return NextResponse.json({ error: 'No icon found.' }, { status: 404 });
  }

  return NextResponse.json(icon, {
    // Resolved server-side already; this keeps the browser and any CDN in
    // front of it from asking again for a day.
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
