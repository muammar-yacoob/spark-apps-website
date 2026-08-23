/**
 * Project-specific OG image configuration.
 *
 * This is the ONLY file in lib/og/ that references project internals.
 * Allowed external references: site.ts (name, domain), taglines.json,
 * and the favicon path. The other modules are fully portable.
 */

import { readdirSync } from 'node:fs';
import { SITE_NAME, SITE_URL } from '@/lib/config/site';
import { TAGLINES } from '@/lib/config/taglines';
import { ogAsset } from './utils/images';

// ── SVG icon paths (Lucide-style, 24x24 viewBox) ─────────────────────

export const ICON_PATHS: Record<string, string[]> = {
  // The MCP glyph's two paths, rendered single-color. Byte-identical across
  // every portfolio OG card, so the "Works with Claude" mark is ONE mark.
  mcp: [
    'M3.49994 11.7501L11.6717 3.57855C12.7762 2.47398 14.5672 2.47398 15.6717 3.57855C16.7762 4.68312 16.7762 6.47398 15.6717 7.57855M15.6717 7.57855L9.49994 13.7501M15.6717 7.57855C16.7762 6.47398 18.5672 6.47398 19.6717 7.57855C20.7762 8.68312 20.7762 10.474 19.6717 11.5785L12.7072 18.543C12.3167 18.9335 12.3167 19.5667 12.7072 19.9572L13.9999 21.2499',
    'M17.4999 9.74921L11.3282 15.921C10.2237 17.0255 8.43272 17.0255 7.32822 15.921C6.22373 14.8164 6.22373 13.0255 7.32822 11.921L13.4999 5.74939',
  ],
  zap: ['M13 2L3 14h9l-1 10 10-12h-9l1-10'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10'],
  video: [
    'M23 7l-7 5 7 5V7',
    'M1 5h15a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  ],
  mail: [
    'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2',
    'M22 6l-10 7L2 6',
  ],
  code: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
  globe: [
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20',
    'M2 12h20',
    'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2',
  ],
  creditCard: [
    'M1 4h22a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z',
    'M1 10h22',
  ],
  rocket: [
    'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09',
    'M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2',
    'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0',
    'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  ],
};

// ── Mascot discovery + round-robin ────────────────────────────────────

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function discoverMascots(): string[] {
  const dir = ogAsset('mascots');
  try {
    return readdirSync(dir)
      .filter((f) => IMAGE_EXTS.has(f.slice(f.lastIndexOf('.')).toLowerCase()))
      .map((f) => `mascots/${f}`);
  } catch {
    return [];
  }
}

let mascotIndex = 0;

/** Return the next mascot path in round-robin order. */
export function nextMascot(): string {
  const list = ogConfig.mascots;
  if (!list.length) return '';
  const m = list[mascotIndex % list.length];
  mascotIndex++;
  return m;
}

// ── Config object ─────────────────────────────────────────────────────

export const ogConfig = {
  name: SITE_NAME,
  url: SITE_URL.replace(/^https?:\/\//, ''),
  favicon: 'favicon.png',
  // Two art variants of the same mark. The renderer picks by card
  // background: the white one on dark cards, the gradient one on light.
  badge: 'badges/ai-badge-on-dark.png',
  badgeOnLight: 'badges/ai-badge-on-light.png',
  cta: 'Browse the Apps',
  socialProof: 'Trusted by indie devs worldwide',
  taglines: TAGLINES,
  mascots: discoverMascots(),
  fonts: {
    heading: { file: 'sora-700.ttf', family: 'Sora' },
    body: { file: 'inter-400.ttf', family: 'Inter' },
    brand: { file: 'sora-700.ttf', family: 'Sora' },
  },
  // Drawn from what the catalogue in lib/data/apps.ts actually holds. These
  // used to be SparkPay's pills -- invoices, coupons, feature gates -- which
  // this site sells none of; they came across with the rest of the OG kit.
  features: [
    { label: 'Next.js Starters', icon: 'rocket', color: '#4f46e5' },
    { label: 'AI Tools', icon: 'zap', color: '#ec4899' },
    { label: 'Chrome Extensions', icon: 'globe', color: '#14b8a6' },
    { label: 'CLI & DevTools', icon: 'code', color: '#f59e0b' },
    { label: 'Claude-ready', icon: 'mcp', color: '#5eead4' },
  ] as { label: string; icon: string; color: string }[],
} as const;
