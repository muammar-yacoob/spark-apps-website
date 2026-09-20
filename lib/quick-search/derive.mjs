/**
 * How a path becomes a palette row: what it is called, which section it lands
 * in, and what finds it.
 *
 * Plain JavaScript with no imports, because both readers need it — the
 * build-time route scanner (generate.mjs, run by node) and the runtime sitemap
 * reader (sitemap.ts, run by the browser). One copy means a page discovered
 * either way is named and grouped identically. See derive.d.mts for the types.
 */

/** Routes that exist but are never a destination somebody searches for. */
const DEFAULT_EXCLUDE = [
  '^/api(/|$)',
  '^/auth(/|$)',
  '(^|/)(signin|sign-in|signout|sign-out|login|logout|register|verify-request)(/|$)',
  '(^|/)(error|not-found|unauthorized|forbidden|loading|offline)(/|$)',
  '(^|/)(callback|redirect)(/|$)',
  '-(success|cancelled|canceled|failed)$',
];

/** Words whose Title Case is wrong: "Api keys" reads as a typo, "API keys". */
const DEFAULT_ACRONYMS = [
  'ai',
  'api',
  'cdn',
  'cli',
  'cms',
  'crm',
  'css',
  'dkim',
  'dns',
  'faq',
  'faqs',
  'ftp',
  'gdpr',
  'html',
  'http',
  'https',
  'id',
  'ios',
  'json',
  'kpi',
  'llm',
  'mcp',
  'mx',
  'ocr',
  'pdf',
  'qr',
  'rss',
  'saas',
  'sdk',
  'seo',
  'smtp',
  'spf',
  'sql',
  'ssl',
  'svg',
  'tls',
  'ui',
  'url',
  'ux',
  'vat',
  'vpn',
  'yaml',
];

/** Terms that find an area's index page without being in its title. */
const INDEX_KEYWORDS = ['overview', 'index'];
/** The site root answers to more names than any other page. */
const HOME_KEYWORDS = ['home', 'landing', 'start', 'overview'];
/** Kept lowercase inside a title: "Send Email from Your Domain". */
const MINOR_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'by',
  'for',
  'from',
  'in',
  'of',
  'on',
  'or',
  'the',
  'to',
  'vs',
  'with',
]);

export const DEFAULT_DERIVE = {
  exclude: DEFAULT_EXCLUDE,
  acronyms: DEFAULT_ACRONYMS,
  /** Group label for routes with no parent segment ("/", "/pricing"). */
  rootGroup: 'Pages',
  /** Joins nested area names: "Dashboard" + "Settings". */
  groupSeparator: ' \u00b7 ',
  /** Rename a derived group: { "Dashboard \u00b7 Settings": "Settings" }. */
  groups: {},
  /** Rename a derived title, keyed by href: { "/dashboard": "Overview" }. */
  titles: {},
  /** Extra search terms, keyed by href: { "/junk": ["spam", "trash"] }. */
  keywords: {},
};

// ------------------------------------------------------------------ naming

export function titleCase(segment, acronyms) {
  const upper = new Set(acronyms);
  return segment
    .split('-')
    .filter(Boolean)
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (upper.has(lower)) return word.toUpperCase();
      if (i > 0 && MINOR_WORDS.has(lower)) return lower;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/** Nesting becomes the section header: /dashboard/settings/api -> "Dashboard · Settings". */
export function groupFor(segments, config) {
  const parents = segments.slice(0, -1);
  if (parents.length === 0) return config.rootGroup;
  const derived = parents.map((s) => titleCase(s, config.acronyms)).join(config.groupSeparator);
  return config.groups[derived] ?? derived;
}

export function idFor(segments) {
  return segments.length === 0 ? 'home' : segments.join('-').toLowerCase();
}

/** Path words are free search terms: /tools/domain-check finds "tools", "domain". */
export function autoKeywords(segments, kind) {
  const words = new Set();
  for (const segment of segments)
    for (const word of segment.split('-')) if (word.length > 1) words.add(word);
  if (kind === 'root') for (const word of HOME_KEYWORDS) words.add(word);
  if (kind === 'index') for (const word of INDEX_KEYWORDS) words.add(word);
  return [...words];
}

/**
 * Puts the list in the order the palette opens with.
 *
 * Order matters more than it looks: an empty query lists everything and the
 * first row is selected, so whatever sorts first is what Ctrl+K then Enter
 * does. Root pages lead, then each area, and an area's own index page heads
 * its section.
 */
export function orderItems(items, rootGroup, indexHrefs = new Set()) {
  const seen = [...new Set(items.map((i) => i.group))];
  const order = [...seen.filter((g) => g === rootGroup), ...seen.filter((g) => g !== rootGroup)];
  const rank = (item) => (item.href === '/' ? 0 : indexHrefs.has(item.href) ? 1 : 2);

  return [...items].sort(
    (a, b) =>
      order.indexOf(a.group) - order.indexOf(b.group) ||
      rank(a) - rank(b) ||
      a.href.split('/').length - b.href.split('/').length ||
      a.title.localeCompare(b.title)
  );
}
