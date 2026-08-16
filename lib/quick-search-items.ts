/**
 * Registry for the Ctrl/Cmd+K quick-search palette.
 *
 * Static pages are listed by hand; the Apps group is derived from
 * lib/data/apps.ts so a new app appears in the palette the moment it is
 * added to the portfolio, with its tags and tagline as search keywords.
 */

import { sparkApps } from '@/lib/data/apps';
import type { QuickSearchItem } from '@/lib/quick-search';

const PAGES: QuickSearchItem[] = [
  {
    id: 'home',
    title: 'Home',
    href: '/',
    group: 'Pages',
    keywords: ['landing', 'portfolio', 'overview', 'apps', 'start'],
    hint: '/',
  },
  {
    id: 'about',
    title: 'About',
    href: '/about',
    group: 'Pages',
    keywords: ['story', 'company', 'studio', 'mission', 'who we are'],
    hint: '/about',
  },
  {
    id: 'team',
    title: 'Team',
    href: '/team',
    group: 'Pages',
    keywords: ['people', 'founders', 'developers', 'who', 'staff'],
    hint: '/team',
  },
  {
    id: 'careers',
    title: 'Careers',
    href: '/careers',
    group: 'Pages',
    keywords: ['jobs', 'hiring', 'work', 'join', 'positions', 'vacancies'],
    hint: '/careers',
  },
  {
    id: 'contact',
    title: 'Contact',
    href: '/contact',
    group: 'Pages',
    keywords: ['email', 'support', 'help', 'reach', 'message', 'feedback'],
    hint: '/contact',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    group: 'Pages',
    keywords: ['admin', 'stats', 'analytics', 'sign in', 'login'],
    hint: '/dashboard',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    href: '/privacy',
    group: 'Legal',
    keywords: ['data', 'gdpr', 'cookies', 'policy'],
    hint: '/privacy',
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    href: '/terms',
    group: 'Legal',
    keywords: ['legal', 'conditions', 'tos', 'agreement', 'license'],
    hint: '/terms',
  },
];

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
