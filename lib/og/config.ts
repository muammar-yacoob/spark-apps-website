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
  badge: 'badges/ai-badge2.png',
  cta: 'Start Shipping Faster',
  socialProof: 'Trusted by indie devs worldwide',
  taglines: TAGLINES,
  mascots: discoverMascots(),
  fonts: {
    heading: { file: 'sora-700.ttf', family: 'Sora' },
    body: { file: 'inter-400.ttf', family: 'Inter' },
    brand: { file: 'sora-700.ttf', family: 'Sora' },
  },
  features: [
    { label: 'P&L in Excel', icon: 'creditCard', color: '#16a34a' },
    { label: 'Pricing Pages', icon: 'rocket', color: '#4f46e5' },
    { label: 'Referrals', icon: 'zap', color: '#f59e0b' },
    { label: 'Coupons', icon: 'code', color: '#ec4899' },
    { label: 'Pay-As-You-Go', icon: 'globe', color: '#14b8a6' },
    { label: 'Emails', icon: 'mail', color: '#0284c7' },
    { label: 'Invoices', icon: 'shield', color: '#64748b' },
    { label: 'Feature Gates', icon: 'shield', color: '#8b5cf6' },
  ] as { label: string; icon: string; color: string }[],
} as const;
