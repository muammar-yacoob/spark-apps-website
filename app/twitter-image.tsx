import { ogConfig as OG } from '@/lib/og';

export { default } from './opengraph-image';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/** Derived, not hardcoded — this drifted from the brand name once already. */
export const alt = `${OG.name} - ${OG.url}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
