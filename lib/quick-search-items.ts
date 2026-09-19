/**
 * Registry for the Ctrl/Cmd+K quick-search palette.
 *
 * The page rows come from ROUTE_ITEMS, which lib/quick-search/generate.mjs
 * derives from the App Router tree, so a new page appears in the palette
 * without anyone editing a list. OVERRIDES layers on what the file tree cannot
 * know: that /privacy is called "Privacy Policy", that the legal pages belong
 * together, and the vocabulary people actually type.
 *
 * The Apps group stays derived from lib/data/apps.ts — those rows are served by
 * /apps/[slug], which has no file of its own for the generator to find.
 */

import { sparkApps } from '@/lib/data/apps';
import {
  mergeQuickSearchItems,
  type QuickSearchItem,
  type QuickSearchOverride,
  ROUTE_ITEMS,
} from '@/lib/quick-search';

/** Hand-written detail layered over the generated routes, keyed by href. */
const OVERRIDES: QuickSearchOverride[] = [
  {
    href: '/',
    keywords: ['landing', 'portfolio', 'overview', 'apps', 'start'],
  },
  {
    href: '/about',
    keywords: ['story', 'company', 'studio', 'mission', 'who we are'],
  },
  {
    href: '/team',
    keywords: ['people', 'founders', 'developers', 'who', 'staff'],
  },
  {
    href: '/careers',
    keywords: ['jobs', 'hiring', 'work', 'join', 'positions', 'vacancies'],
  },
  {
    href: '/contact',
    keywords: ['email', 'support', 'help', 'reach', 'message', 'feedback'],
  },
  {
    href: '/dashboard',
    keywords: ['admin', 'stats', 'analytics', 'sign in', 'login'],
  },
  {
    href: '/privacy',
    title: 'Privacy Policy',
    group: 'Legal',
    keywords: ['data', 'gdpr', 'cookies', 'policy'],
  },
  {
    href: '/terms',
    title: 'Terms of Service',
    group: 'Legal',
    keywords: ['legal', 'conditions', 'tos', 'agreement', 'license'],
  },
  /*
   * Three apps ship their own store-required privacy page. The generator finds
   * them but titles each one "Privacy" under its own app group, which reads as
   * three identical rows; named and gathered under Legal they stay tellable
   * apart. Only these three exist — every other app's privacy lives off-site.
   */
  {
    href: '/apps/bumboo/privacy',
    id: 'privacy-bumboo',
    title: 'Bumboo Privacy Policy',
    group: 'Legal',
    keywords: ['bumboo', 'app privacy', 'gdpr', 'data', 'store listing'],
  },
  {
    href: '/apps/pitchplease/privacy',
    id: 'privacy-pitchplease',
    title: 'PitchPlease Privacy Policy',
    group: 'Legal',
    keywords: ['pitchplease', 'app privacy', 'gdpr', 'data', 'store listing'],
  },
  {
    href: '/apps/screenful/privacy',
    id: 'privacy-screenful',
    title: 'Screenful Privacy Policy',
    group: 'Legal',
    keywords: ['screenful', 'app privacy', 'gdpr', 'data', 'store listing'],
  },
];

const PAGES: QuickSearchItem[] = mergeQuickSearchItems(ROUTE_ITEMS, OVERRIDES);

/** Extra aliases per app id, for vocabulary the tags and tagline miss. */
const APP_ALIASES: Record<string, string[]> = {
  sparkstack: ['boilerplate', 'template', 'saas kit'],
  sparkmobile: ['expo', 'react native', 'ios', 'android'],
  sellular: ['seo', 'directory', 'visibility', 'marketing'],
  bottled: ['email', 'smtp', 'newsletter', 'mailbox'],
  vidlet: ['video', 'editing', 'youtube', 'shorts'],
  viralcat: ['social', 'posts', 'scheduler', 'twitter', 'automation'],
  quickpeek: ['demo', 'screen recording', 'voiceover', 'walkthrough'],
  botornot: ['ai detector', 'detection', 'human', 'content check'],
  screenful: ['screenshot', 'capture', 'full page'],
  textpert: ['autocorrect', 'spelling', 'grammar', 'typing'],
  'spark-ai': ['chatbot', 'chat widget', 'assistant', 'support bot'],
  'spark-stripe': ['payments', 'billing', 'checkout', 'stripe', 'subscriptions'],
  pitchplease: ['dark mode', 'theme', 'night'],
  klean: ['cleanup', 'cli', 'node_modules', 'disk space'],
  'still-applying': ['resume', 'cv', 'ats', 'job application'],
  flexcel: ['excel', 'spreadsheet', 'formulas', 'add-in'],
  fullhouse: ['game', 'timing', 'reflex'],
  piclet: ['images', 'convert', 'resize', 'compress'],
  ducktax: ['tax', 'accounts', 'hmrc', 'filing', 'micro-entity'],
  safesound: ['safety', 'alert', 'emergency', 'personal'],
};

const APPS: QuickSearchItem[] = sparkApps.map((app) => ({
  id: `app-${app.id}`,
  title: app.name,
  href: `/apps/${app.id}`,
  group: 'Apps',
  keywords: [...app.tags, ...app.tagline.split(/\s+/), ...(APP_ALIASES[app.id] ?? [])],
  hint: app.tagline,
}));

export const QUICK_SEARCH_ITEMS: QuickSearchItem[] = [...PAGES, ...APPS];
