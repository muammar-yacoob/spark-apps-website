import pkg from '@/package.json';

const FALLBACK_URL = 'http://localhost:3000';

/** Canonical site URL, never trailing slash. */
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || FALLBACK_URL;

/** Display name shown in nav, modals, sidebar, loader, metadata. */
export const SITE_NAME = formatPackageName(pkg.name);

/** One-liner used in metadata description and marketing. */
export const SITE_DESCRIPTION = pkg.description;

/** Primary brand color (used for BgBokeh, accents, etc.). */
export const THEME_COLOR = '#3b82f6';

/** Support email derived from env or domain. */
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
  `hello@${SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;

/** Convert "spark-stack" to "SparkStack". */
function formatPackageName(name: string): string {
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}
