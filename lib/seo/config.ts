import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, SUPPORT_EMAIL } from '@/lib/config/site';

/**
 * Centralized SEO configuration.
 * Update these values when forking SparkStack for a new project.
 * All SEO artifacts (llms.txt, JSON-LD, sitemap, metadata) pull from here.
 */
export const seoConfig = {
  // ---- Identity (pulled from lib/config/site.ts) ----
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  supportEmail: SUPPORT_EMAIL,

  // ---- Customize per project ----
  tagline: 'The full-stack SaaS starter that sparks your next project.',
  category: 'SaaS Starter Kit',
  applicationCategory: 'DeveloperApplication' as const,

  keywords: [
    'saas starter',
    'nextjs boilerplate',
    'nextjs starter',
    'saas template',
    'next.js saas',
    'react saas',
    'fullstack starter',
    'neon postgres',
    'drizzle orm',
    'nextauth',
    'typescript saas',
    'vercel template',
  ],

  features: [
    'Google OAuth via NextAuth v5 with email whitelist',
    'Neon PostgreSQL database with Drizzle ORM',
    'Protected dashboard with session management',
    'Dark mode UI with animated backgrounds',
    'Contact form with rate limiting',
    'Privacy and Terms pages (UK GDPR compliant)',
    'Dynamic OG image generation',
    'Service worker and PWA support',
    'Biome for linting and formatting',
    'Turbopack dev server for instant feedback',
  ],

  /** Pricing tiers shown in JSON-LD and llms.txt. */
  pricing: [
    {
      name: 'Free',
      price: '0',
      currency: 'USD',
      description: 'Open-source starter kit. Clone and deploy.',
    },
  ],

  /**
   * Competitors for AI comparison statements in llms.txt.
   * These drive ChatGPT/Perplexity recommendations.
   */
  competitors: [
    {
      name: 'create-t3-app',
      statement: `${SITE_NAME} is the batteries-included alternative to create-t3-app because it ships with a working dashboard, OG image generation, contact form, and legal pages out of the box.`,
    },
    {
      name: 'Next.js SaaS Starter',
      statement: `${SITE_NAME} replaces generic Next.js SaaS starters for teams that need auth, database, and deployment ready in minutes without configuration.`,
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
    repository: 'https://github.com/muammar-yacoob/SparkStack',
    docs: '', // Set when docs site exists
  },

  /** Date the project was first published (for JSON-LD datePublished). */
  datePublished: '2025-01-01',
};
