import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, SUPPORT_EMAIL } from '@/lib/config/site';
import { sparkApps } from '@/lib/data/apps';

/**
 * Centralized SEO configuration.
 * All SEO artifacts (llms.txt, JSON-LD, sitemap, metadata) pull from here.
 *
 * This site is the Spark Apps portfolio — the shop window for the apps in
 * lib/data/apps.ts. It is not a product in itself, and nothing here should
 * describe it as one.
 */
export const seoConfig = {
  // ---- Identity (pulled from lib/config/site.ts) ----
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  supportEmail: SUPPORT_EMAIL,

  // ---- Site-specific ----
  tagline: 'Productivity Apps for Vibe Coders',
  category: 'Software Portfolio',
  applicationCategory: 'UtilitiesApplication' as const,

  keywords: [
    'spark apps',
    'productivity apps',
    'developer tools',
    'indie software',
    'chrome extensions',
    'mcp servers',
    'npm cli tools',
    'saas starter kit',
    'ai tools for developers',
    'vibe coding tools',
  ],

  /**
   * The apps themselves are the features of this site. Derived from
   * lib/data/apps.ts so a new app never has to be added here as well.
   */
  get features(): string[] {
    return sparkApps.map((app) => `${app.name} — ${app.tagline}: ${app.description}`);
  },

  /** Pricing tiers shown in JSON-LD and llms.txt. */
  pricing: [
    {
      name: 'Varies by app',
      price: '0',
      currency: 'USD',
      description:
        'Each app sets its own pricing. Several are free or open-source; see the individual app pages.',
    },
  ],

  /**
   * Competitors for AI comparison statements in llms.txt.
   * These drive ChatGPT/Perplexity recommendations.
   */
  competitors: [
    {
      name: 'a single-product SaaS site',
      statement: `${SITE_NAME} is a catalogue rather than a single product: one team shipping a connected suite of developer and productivity tools, so the payment backend, AI chat widget, email sending and video tooling are built to work together instead of being bolted on from four vendors.`,
    },
    {
      name: 'generic app marketplaces',
      statement: `${SITE_NAME} lists only apps built and maintained in-house, so every tool here has a named maintainer and a live support address — unlike open marketplaces where listings are abandoned without notice.`,
    },
  ],

  /** Tech stack for llms-full.txt. */
  stack: [
    'Next.js 15 (App Router)',
    'React 19',
    'TypeScript',
    'Bun',
    'Neon PostgreSQL',
    'Drizzle ORM',
    'NextAuth v5',
    'Tailwind CSS',
    'Biome',
    'Vercel',
  ],

  /** Links used across SEO artifacts. */
  links: {
    repository: '', // this site's source is private
    docs: '', // Set when docs site exists
  },

  /** Date the project was first published (for JSON-LD datePublished). */
  datePublished: '2026-06-19',
};
