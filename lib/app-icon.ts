/**
 * An app's favicon, and the colour to theme its card with.
 *
 * Ported from spark-pay's `lib/services/app-branding.ts`, which is the version
 * that actually works, and the `dominant` branch of `lib/og/utils/images.ts`
 * for the colour. Kept in one file here because spark-ads needs both halves
 * together, for the house-ad domains (and, later, paid advertisers' domains),
 * and nothing else has a use for either.
 *
 * The three strategies, in order, and the middle one is the one that matters:
 *
 *   direct  the usual paths on the domain
 *   html    parse `<link rel="icon">` out of the page's head
 *   google  their favicon cache, as a last resort
 *
 * A first attempt here skipped `html` and went straight from `direct` to
 * `google`, which is how the cards ended up wearing Google's low-resolution
 * thumbnails: plenty of sites serve no icon at any guessable path and declare
 * it in a `<link>` instead, and the whole point of that middle strategy is that
 * it asks the site rather than guessing at it.
 *
 * Server-side on purpose. The colour needs the icon's actual pixels, and a
 * canvas in the browser cannot read them: every one of these is cross-origin
 * and none of the hosts send the CORS headers `getImageData` would need.
 */

import sharp from 'sharp';
import { ensureContrast } from './og/utils/colors';
import { readBodyCapped, safeFetch } from './utils/safe-fetch';

/** PNG/WebP first: they are what the colour pass can actually decode. */
const DIRECT_PATHS = [
  '/favicon.png',
  '/apple-touch-icon.png',
  '/icon.png',
  '/favicon-32x32.png',
  '/favicon.ico',
];

const MAX_ICON_BYTES = 5 * 1024 * 1024;
const HTML_WINDOW_BYTES = 16384;
/** Google's generic globe placeholder is ~1439 bytes; real icons are bigger. */
const GOOGLE_MIN_BYTES = 1500;
/** Anything smaller is a 1x1 placeholder or an error page wearing an image type. */
const MIN_ICON_BYTES = 200;

/**
 * The card these colours land on.
 *
 * `bg-gray-900/40` over the dashboard's near-black comes out around here. The
 * extracted colour is lifted against it before it ever reaches the browser --
 * a dark icon that scores fine as a "dominant colour" is unreadable as text on
 * this.
 */
const CARD_BG = '#0b0f19';

export interface AppIcon {
  /** Absolute URL the browser can point an `<img>` at. */
  iconUrl: string;
  /**
   * Dominant colour of the icon, as `#rrggbb`, lifted for contrast.
   *
   * Null when the icon is greyscale or could not be decoded, in which case the
   * card keeps the accent it already had. A grey "theme colour" is not a theme.
   */
  themeColor: string | null;
}

/** Strip scheme and path, lowercase; '' when nothing usable remains. */
export function cleanDomain(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/\/+$/, '');
  // A bare hostname only: no spaces, at least one dot, no leftover URL syntax.
  if (!cleaned || /[\s@?#:]/.test(cleaned) || !cleaned.includes('.')) return '';
  return cleaned;
}

interface Found {
  url: string;
  bytes: Buffer;
}

/**
 * Content type check.
 *
 * Unlike spark-pay this does not block ICO or SVG. There that list exists
 * because the bytes get written to disk as a `.png`, which neither format
 * survives. Here the URL is handed to an `<img>` and the browser renders both
 * happily -- and if sharp cannot decode one for the colour pass, that costs a
 * theme colour, not the icon.
 */
function imageType(res: Response): string | null {
  const ct = (res.headers.get('content-type') || '').split(';')[0]?.trim() ?? '';
  return ct.startsWith('image/') ? ct : null;
}

/** The usual paths on the domain itself. */
async function fetchDirect(domain: string): Promise<Found | null> {
  for (const path of DIRECT_PATHS) {
    const url = `https://${domain}${path}`;
    const res = await safeFetch(url);
    if (!res.ok || !res.response.ok) continue;
    if (!imageType(res.response)) continue;
    const bytes = await readBodyCapped(res.response, MAX_ICON_BYTES);
    if (bytes && bytes.byteLength >= MIN_ICON_BYTES) return { url, bytes };
  }
  return null;
}

/** Ask the page: `<link rel="icon">` or `<link rel="apple-touch-icon">`. */
async function fetchFromHtml(domain: string): Promise<Found | null> {
  const page = await safeFetch(`https://${domain}`, { accept: 'text/html' });
  if (!page.ok || !page.response.ok) return null;

  // First 16KB only: enough for <head>, without pulling the whole document.
  const reader = page.response.body?.getReader();
  if (!reader) return null;
  let html = '';
  while (html.length < HTML_WINDOW_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    html += new TextDecoder().decode(value);
  }
  reader.cancel().catch(() => {});

  const linkPattern =
    /<link[^>]*rel=["'](?:shortcut\s+)?(?:icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let bestHref: string | null = null;
  for (const match of html.matchAll(linkPattern)) {
    bestHref = match[1] ?? null;
    // Prefer apple-touch-icon: it is the one authored at a usable size.
    if (match[0].includes('apple-touch-icon')) break;
  }
  if (!bestHref) return null;

  // Resolved against the FINAL page URL, and the href is untrusted page
  // content, so it re-enters safeFetch's full guard rather than being trusted.
  let iconUrl: string;
  try {
    iconUrl = new URL(bestHref, page.finalUrl).toString();
  } catch {
    return null;
  }

  const iconRes = await safeFetch(iconUrl);
  if (!iconRes.ok || !iconRes.response.ok) return null;
  if (!imageType(iconRes.response)) return null;
  const bytes = await readBodyCapped(iconRes.response, MAX_ICON_BYTES);
  return bytes && bytes.byteLength >= MIN_ICON_BYTES ? { url: iconUrl, bytes } : null;
}

/** Google's cache, when the site itself offered nothing. */
async function fetchFromGoogle(domain: string): Promise<Found | null> {
  const url = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  const res = await safeFetch(url);
  if (!res.ok || !res.response.ok) return null;
  if (!imageType(res.response)) return null;
  const bytes = await readBodyCapped(res.response, MAX_ICON_BYTES);
  return bytes && bytes.byteLength > GOOGLE_MIN_BYTES ? { url, bytes } : null;
}

/** Direct paths, then the page's own declaration, then Google. */
async function fetchFavicon(domain: string): Promise<Found | null> {
  return (
    (await fetchDirect(domain)) ?? (await fetchFromHtml(domain)) ?? (await fetchFromGoogle(domain))
  );
}

/**
 * The icon's dominant colour, ignoring white, black and grey.
 *
 * spark-pay's algorithm, unchanged: sample a 10x10, discard the unsaturated
 * pixels, quantise what is left into buckets and average the largest one.
 * Averaging every pixel instead gives the muddy brown you would expect from
 * mixing a whole logo together; the bucket step is what keeps it a colour
 * somebody would name.
 */
async function dominantColor(bytes: Buffer): Promise<string | null> {
  const dim = 10;
  const { data, info } = await sharp(bytes)
    .resize(dim, dim, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const all: [number, number, number][] = [];
  for (let y = 0; y < dim; y++) {
    for (let x = 0; x < dim; x++) {
      const i = (y * info.width + x) * 3;
      // `?? 0` only to satisfy noUncheckedIndexedAccess: the buffer is exactly
      // `width * height * 3` bytes and every index here is inside it.
      all.push([data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0]);
    }
  }

  const saturated = all.filter(([r, g, b]) => {
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    return mx > 40 && mn < 220 && mx - mn > 25;
  });
  // A greyscale icon returns null rather than falling back to the average of
  // everything. There the colour is a swatch somebody confirms; here it is
  // applied unseen, and grey-on-grey is worse than the existing accent.
  if (saturated.length === 0) return null;

  const step = 24;
  const buckets = new Map<string, [number, number, number][]>();
  for (const [r, g, b] of saturated) {
    const key = `${Math.round(r / step)},${Math.round(g / step)},${Math.round(b / step)}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push([r, g, b]);
    else buckets.set(key, [[r, g, b]]);
  }

  let largest = saturated;
  let maxSize = 0;
  for (const bucket of buckets.values()) {
    if (bucket.length > maxSize) {
      maxSize = bucket.length;
      largest = bucket;
    }
  }

  const sum = largest.reduce((acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b], [0, 0, 0]);
  return `#${sum
    .map((v) =>
      Math.round(v / largest.length)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
}

/**
 * Resolved icons, kept for the life of the server process.
 *
 * The house advertisers are a fixed, small list and their logos change about
 * never, so this is a handful of entries that saves every dashboard render
 * from going back out to their hosts. Failures are cached too: a domain with
 * no icon should be asked once, not once per page view.
 */
const cache = new Map<string, AppIcon | null>();
const inflight = new Map<string, Promise<AppIcon | null>>();

export async function resolveAppIcon(domain: string): Promise<AppIcon | null> {
  const key = cleanDomain(domain);
  if (!key) return null;

  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  // Several cards mount at once and would otherwise each start their own crawl.
  const running = inflight.get(key);
  if (running) return running;

  const task = (async (): Promise<AppIcon | null> => {
    const favicon = await fetchFavicon(key);
    if (!favicon) return null;

    let themeColor: string | null = null;
    try {
      const dominant = await dominantColor(favicon.bytes);
      // Lifted here rather than in the card, so the colour that crosses the
      // wire is the one that gets painted and there is no second opinion.
      themeColor = dominant ? ensureContrast(dominant, CARD_BG) : null;
    } catch {
      // An icon sharp cannot decode -- an ICO, most likely -- is still an icon
      // worth showing; it just does not get to set the colour.
    }
    return { iconUrl: favicon.url, themeColor };
  })();

  inflight.set(key, task);
  try {
    const result = await task;
    cache.set(key, result);
    return result;
  } finally {
    inflight.delete(key);
  }
}
