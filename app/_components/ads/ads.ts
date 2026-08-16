import type { CarouselItem } from '../carousel';

/**
 * The house adverts, and the slot that is for sale.
 *
 * This used to be two hardcoded cards in CrossSell.tsx, and that file argued
 * for keeping it to two: a wall of house adverts on a free tool reads as the
 * product being the advert. The carousel is the answer to that -- one or two
 * cards are on screen at a time regardless of how many are in the list, so the
 * section stays the same size whether it holds two entries or six.
 *
 * On spark-ads this list doubles as the fallback rotation for a slot nobody
 * has bought yet -- unsold inventory shows a house ad rather than an empty
 * space. Once a slot sells, the paid creative comes from the database instead
 * of this file.
 */

export interface Ad extends CarouselItem {
  name: string;
  url: string;
  /**
   * Bare host, no scheme and no trailing slash.
   *
   * Where the icon and the card's accent colour come from -- see
   * `lib/app-icon.ts`. Kept as its own field rather than parsed back out of
   * `url` because it is also the allowlist the icon route checks against, and
   * an allowlist assembled by string surgery is one bad `url` away from
   * fetching somewhere nobody intended.
   */
  domain: string;
  /** Four or five words. Sits under the name in small type. */
  tagline: string;
  /** One sentence. What it does, not why it is good. */
  body: string;
  /**
   * Tailwind text colour pair for the name: resting, then group-hover.
   *
   * The fallback, not the plan. The card themes itself from the favicon's own
   * dominant colour once that resolves; this is what it wears in the meantime,
   * and permanently if the icon is greyscale or missing.
   */
  accent: string;
  /** Drives the monogram fallback when no logo file is present. */
  monogram: string;
  /**
   * The product's SparkPay app_id, when it differs from `id`.
   *
   * Consumers identify themselves to /api/serve by their SparkPay app_id
   * ('quickpeek', 'spark-ai'), while some house entries predate that registry
   * and use their own slugs ('quick-peek', 'spark-brain'). The serve filter
   * checks both so an app is never handed its own advert.
   */
  appId?: string;
}

export const HOUSE_ADS: Ad[] = [
  {
    id: 'sellular',
    name: 'Sellular',
    url: 'https://sellular.online',
    domain: 'sellular.online',
    tagline: 'Get the company found',
    body: 'Submit your product to 30+ directories with pre-filled profiles, and track where it shows up.',
    accent: 'text-blue-400 group-hover:text-blue-300',
    monogram: 'S',
  },
  {
    id: 'bottled',
    name: 'Bottled',
    url: 'https://bottled.email',
    domain: 'bottled.email',
    tagline: 'Email on your own domain',
    body: 'Send and receive from your company address without handing a mailbox provider the keys.',
    accent: 'text-sky-400 group-hover:text-sky-300',
    monogram: 'B',
  },
  {
    id: 'viral-cat',
    name: 'Viral Cat',
    url: 'https://viral-cat.com',
    domain: 'viral-cat.com',
    tagline: 'Post everywhere at once',
    body: 'Schedule and publish to every social account from one queue, and see which posts actually landed.',
    accent: 'text-violet-400 group-hover:text-violet-300',
    monogram: 'V',
  },
  {
    id: 'spark-brain',
    appId: 'spark-ai',
    name: 'Spark Brain',
    url: 'https://sparkbrain.app',
    domain: 'sparkbrain.app',
    tagline: 'Support that answers itself',
    body: 'A support desk that reads your docs and handles the repetitive questions before they reach you.',
    accent: 'text-emerald-400 group-hover:text-emerald-300',
    monogram: 'AI',
  },
  {
    id: 'spark-stack',
    name: 'Spark Stack',
    url: 'https://sparkstack.dev',
    domain: 'sparkstack.dev',
    tagline: 'Skip the SaaS boilerplate',
    body: 'A Next.js boilerplate with auth, a database, a dashboard and SEO already wired in, so a new app starts past the setup.',
    accent: 'text-indigo-400 group-hover:text-indigo-300',
    monogram: 'SS',
  },
  {
    id: 'sparkpay',
    appId: 'spark-pay',
    name: 'SparkPay',
    url: 'https://sparkpay.dev',
    domain: 'sparkpay.dev',
    tagline: 'Pricing pages, wired to Stripe',
    body: 'Hosted pricing pages and a Stripe billing backend for indie apps, live without writing checkout code.',
    accent: 'text-amber-400 group-hover:text-amber-300',
    monogram: 'SP',
  },
  {
    id: 'quick-peek',
    appId: 'quickpeek',
    name: 'Quick Peek',
    url: 'https://quickpeek.co',
    domain: 'quickpeek.co',
    tagline: 'Demo videos without editing',
    body: 'Turns a product into a polished demo video without touching a timeline or an editor.',
    accent: 'text-rose-400 group-hover:text-rose-300',
    monogram: 'Q',
  },
  {
    id: 'still-applying',
    name: 'Still Applying',
    url: 'https://stillapplying.com',
    domain: 'stillapplying.com',
    tagline: 'Applications filled in seconds',
    body: 'Autofills job applications from your CV, so the time saved goes to the applications that matter.',
    accent: 'text-teal-400 group-hover:text-teal-300',
    monogram: 'SA',
  },
  {
    id: 'tax-ducks',
    name: 'Tax Ducks',
    url: 'https://ducktax.com',
    domain: 'ducktax.com',
    tagline: 'Free UK accounts check',
    body: "Checks a UK micro-entity's accounts are ready to file, free, before Companies House flags them.",
    accent: 'text-orange-400 group-hover:text-orange-300',
    monogram: 'TD',
  },
  {
    id: 'vidlet',
    name: 'VidLet',
    url: 'https://vidlet.app',
    domain: 'vidlet.app',
    tagline: 'Edit shorts without the suite',
    body: 'Trims, captions and reshapes footage into shorts without opening a full editing suite.',
    accent: 'text-fuchsia-400 group-hover:text-fuchsia-300',
    monogram: 'VL',
  },
];

/**
 * Where the empty slot sends people.
 *
 * The public SparkPay pricing page for this app: owner slug, then app slug.
 */
export const AD_PRICING_URL = 'https://sparkpay.dev/spark/sparkads';

/**
 * The cheapest thing somebody can actually buy, quoted on the slot card.
 *
 * Kept next to the URL as a reminder that the two have to agree. SparkPay bills
 * on monthly and yearly intervals only, so the weekly rate this was first
 * scoped around does not exist as a purchasable price; quoting one would send
 * people to a page that cannot sell it to them.
 */
export const AD_ENTRY_PRICE = '$9/month';
