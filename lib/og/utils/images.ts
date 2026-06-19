/**
 * Portable sharp-based image helpers for OG image generation.
 * All resources live in lib/og/res/ -- nothing in public/ needed.
 * Depends only on `sharp` -- no project-specific imports.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

/** Absolute path to the lib/og/res/ directory. */
export const OG_RES_DIR = join(process.cwd(), 'lib', 'og', 'res');

/** Resolve a path relative to lib/og/res/. */
export function ogAsset(...parts: string[]): string {
  return join(OG_RES_DIR, ...parts);
}

// ── Transparency detection ────────────────────────────────────────────

const transparencyCache = new Map<string, boolean>();

/** Check whether an image has transparent edge pixels (i.e. a cutout mascot). */
export async function hasTransparentBg(absPath: string): Promise<boolean> {
  const cached = transparencyCache.get(absPath);
  if (cached !== undefined) return cached;

  const { data, info } = await sharp(absPath)
    .resize(10, 10, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const corners = [[0, 0], [9, 0], [0, 9], [9, 9], [4, 0], [5, 9], [0, 5], [9, 4]];
  const result = corners.some(([x, y]) => data[(y * info.width + x) * 4 + 3] < 250);
  transparencyCache.set(absPath, result);
  return result;
}

// ── Colour extraction ─────────────────────────────────────────────────

const colorCache = new Map<string, string>();

/**
 * Extract a representative colour from an image.
 * - `'edge'`     -- averages all border pixels (mascot background matching).
 * - `'dominant'` -- averages saturated pixels, ignoring white/black/grey (favicon accent).
 *
 * Accepts an absolute file path. Results are cached per path+mode.
 */
export async function getImageColor(
  absPath: string,
  sample: 'edge' | 'dominant',
): Promise<string> {
  const key = `${absPath}:${sample}`;
  const cached = colorCache.get(key);
  if (cached) return cached;

  const dim = sample === 'edge' ? 20 : 10;
  const { data, info } = await sharp(absPath)
    .resize(dim, dim, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = (x: number, y: number): [number, number, number] => {
    const i = (y * info.width + x) * 3;
    return [data[i], data[i + 1], data[i + 2]];
  };

  let pixels: [number, number, number][];

  if (sample === 'edge') {
    pixels = [];
    for (let x = 0; x < dim; x++) {
      pixels.push(px(x, 0));
      pixels.push(px(x, dim - 1));
    }
    for (let y = 1; y < dim - 1; y++) {
      pixels.push(px(0, y));
      pixels.push(px(dim - 1, y));
    }
  } else {
    const all: [number, number, number][] = [];
    for (let y = 0; y < dim; y++) {
      for (let x = 0; x < dim; x++) {
        all.push(px(x, y));
      }
    }
    // Keep only saturated pixels -- discard near-white, near-black, and greys
    pixels = all.filter(([r, g, b]) => {
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      return mx > 40 && mn < 220 && mx - mn > 25;
    });
    if (pixels.length === 0) pixels = all;
  }

  // Quantise pixels into buckets (step=24), pick the largest cluster,
  // then average only its members for a smooth, dominant result.
  const step = 24;
  const buckets = new Map<string, [number, number, number][]>();
  for (const [r, g, b] of pixels) {
    const k = `${Math.round(r / step)},${Math.round(g / step)},${Math.round(b / step)}`;
    let bucket = buckets.get(k);
    if (!bucket) {
      bucket = [];
      buckets.set(k, bucket);
    }
    bucket.push([r, g, b]);
  }

  let largest: [number, number, number][] = pixels;
  let maxSize = 0;
  for (const bucket of buckets.values()) {
    if (bucket.length > maxSize) {
      maxSize = bucket.length;
      largest = bucket;
    }
  }

  const sum = largest.reduce(
    (acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b],
    [0, 0, 0],
  );
  const n = largest.length;
  const hex = `#${[sum[0], sum[1], sum[2]]
    .map((v) => Math.round(v / n).toString(16).padStart(2, '0'))
    .join('')}`;

  colorCache.set(key, hex);
  return hex;
}

// ── Image processing ──────────────────────────────────────────────────

const shadowCache = new Map<string, string>();

/** Load an image, bake a contour-following drop shadow via sharp. Returns a data URL. */
export async function loadImageWithShadow(absPath: string, size: number): Promise<string> {
  const cached = shadowCache.get(absPath);
  if (cached) return cached;

  const pad = 14;
  const resized = await sharp(absPath)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .png()
    .toBuffer();

  // Subtle shadow: black silhouette, faded to ~30% opacity, softly blurred
  const silhouette = await sharp(resized)
    .modulate({ brightness: 0, saturation: 0 })
    .png()
    .toBuffer();
  const faded = await sharp(silhouette)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      for (let i = 3; i < data.length; i += 4) data[i] = Math.round(data[i] * 0.3);
      return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
        .extend({
          top: pad,
          bottom: pad + 4,
          left: pad,
          right: pad,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .blur(8)
        .png()
        .toBuffer();
    });

  // Composite original on top of its shadow
  const result = await sharp(faded)
    .composite([{ input: resized, top: pad, left: pad, blend: 'over' }])
    .png()
    .toBuffer();

  const dataUrl = `data:image/png;base64,${result.toString('base64')}`;
  shadowCache.set(absPath, dataUrl);
  return dataUrl;
}

const dataUrlCache = new Map<string, string>();

/** Read an image from disk and return it as a base64 data URL. */
export async function loadImageAsDataUrl(absPath: string): Promise<string> {
  const cached = dataUrlCache.get(absPath);
  if (cached) return cached;

  const buf = await sharp(absPath).png().toBuffer();
  const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;
  dataUrlCache.set(absPath, dataUrl);
  return dataUrl;
}

// ── Font loading ──────────────────────────────────────────────────────

let fontCache: { heading: ArrayBuffer; body: ArrayBuffer } | null = null;

/**
 * Load OG font files from lib/og/res/fonts/.
 * Accepts the font file names (not full paths). Cached across requests.
 */
export async function loadFonts(
  headingFile: string,
  bodyFile: string,
): Promise<{ heading: ArrayBuffer; body: ArrayBuffer }> {
  if (fontCache) return fontCache;
  const dir = ogAsset('fonts');
  const [heading, body] = await Promise.all([
    readFile(join(dir, headingFile)),
    readFile(join(dir, bodyFile)),
  ]);
  fontCache = {
    heading: heading.buffer.slice(heading.byteOffset, heading.byteOffset + heading.byteLength),
    body: body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength),
  };
  return fontCache;
}
