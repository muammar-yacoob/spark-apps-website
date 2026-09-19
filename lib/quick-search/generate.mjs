#!/usr/bin/env node

/**
 * Generates the palette's item list from the Next.js App Router tree, so the
 * command palette knows every page in the app without anyone maintaining a
 * list by hand.
 *
 * Self-contained: no dependencies, no framework imports, no config required.
 * Run it from the repo root:
 *
 *   node lib/quick-search/generate.mjs            # write items.generated.ts
 *   node lib/quick-search/generate.mjs --check    # fail if the file is stale
 *
 * Routes come from `git ls-files` when the project is a git repo, so scratch
 * pages that were never committed never leak into the palette; a plain
 * directory walk is the fallback.
 *
 * Every default can be overridden by a `quick-search.config.json` at the repo
 * root — see README.md ("Generated items").
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODULE_DIR = dirname(fileURLToPath(import.meta.url));
const PAGE_FILE = /^page\.(tsx|ts|jsx|js)$/;

/** Segments the router strips from the URL: groups, private dirs, slots. */
const NON_URL_SEGMENT = /^[(@_]/;
/** Dynamic segments can't be linked to without data, so pages under them go. */
const DYNAMIC_SEGMENT = /^\[.*\]$/;

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

const DEFAULTS = {
  appDir: 'app',
  out: 'lib/quick-search/items.generated.ts',
  exclude: DEFAULT_EXCLUDE,
  acronyms: DEFAULT_ACRONYMS,
  /** Group label for routes with no parent segment ("/", "/pricing"). */
  rootGroup: 'Pages',
  /** Joins nested area names: "Dashboard" + "Settings". */
  groupSeparator: ' · ',
  /** Rename a derived group: { "Dashboard · Settings": "Settings" }. */
  groups: {},
  /** Rename a derived title, keyed by href: { "/dashboard": "Overview" }. */
  titles: {},
  /** Extra search terms, keyed by href: { "/junk": ["spam", "trash"] }. */
  keywords: {},
  /** Hrefs to drop even though they are real routes. */
  skip: [],
  /** Extra routes the file tree can't know about (query-param views, etc). */
  extra: [],
};

// ---------------------------------------------------------------- discovery

function readConfig(root) {
  for (const name of ['quick-search.config.json', '.quicksearchrc.json']) {
    const path = join(root, name);
    if (!existsSync(path)) continue;
    try {
      return { ...DEFAULTS, ...JSON.parse(readFileSync(path, 'utf8')) };
    } catch (err) {
      throw new Error(`${name} is not valid JSON: ${err.message}`);
    }
  }
  return { ...DEFAULTS };
}

/** Page files, preferring git's index so uncommitted scratch routes are ignored. */
function findPageFiles(root, appDir) {
  const abs = join(root, appDir);
  if (!existsSync(abs)) return [];

  try {
    const out = execFileSync('git', ['ls-files', '--', appDir], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const tracked = out.split('\n').filter((p) => PAGE_FILE.test(p.slice(p.lastIndexOf('/') + 1)));
    if (tracked.length > 0) return tracked;
  } catch {
    // Not a git repo (or git missing): fall through to the directory walk.
  }

  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (PAGE_FILE.test(entry.name)) found.push(relative(root, path).split('\\').join('/'));
    }
  };
  walk(abs);
  return found.sort();
}

/** "app/(marketing)/docs/api/page.tsx" -> ["docs", "api"], or null if unlinkable. */
function routeSegments(file, appDir) {
  const parts = file
    .slice(appDir.length + 1)
    .split('/')
    .slice(0, -1); // drop page.tsx
  const segments = [];
  for (const part of parts) {
    if (DYNAMIC_SEGMENT.test(part)) return null; // needs params to link
    if (NON_URL_SEGMENT.test(part)) continue; // (group), _private, @slot
    segments.push(part);
  }
  return segments;
}

// ------------------------------------------------------------------ naming

function titleCase(segment, acronyms) {
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
function groupFor(segments, config) {
  const parents = segments.slice(0, -1);
  if (parents.length === 0) return config.rootGroup;
  const derived = parents.map((s) => titleCase(s, config.acronyms)).join(config.groupSeparator);
  return config.groups[derived] ?? derived;
}

function idFor(segments) {
  return segments.length === 0 ? 'home' : segments.join('-').toLowerCase();
}

/** Path words are free search terms: /tools/domain-check finds "tools", "domain". */
function autoKeywords(segments, kind) {
  const words = new Set();
  for (const segment of segments)
    for (const word of segment.split('-')) if (word.length > 1) words.add(word);
  if (kind === 'root') for (const word of HOME_KEYWORDS) words.add(word);
  if (kind === 'index') for (const word of INDEX_KEYWORDS) words.add(word);
  return [...words];
}

// --------------------------------------------------------------- assembly

export function buildItems(root, config) {
  const files = findPageFiles(root, config.appDir);
  const excluded = config.exclude.map((p) => new RegExp(p, 'i'));
  const skip = new Set(config.skip);
  const byHref = new Map();

  // Every path that has at least one page below it, so an area index page can
  // be recognised in one pass instead of rescanning the tree per route.
  const parents = new Set();
  for (const file of files) {
    const segments = routeSegments(file, config.appDir);
    if (segments === null) continue;
    for (let i = 1; i < segments.length; i++) parents.add(segments.slice(0, i).join('/'));
  }

  for (const file of files) {
    const segments = routeSegments(file, config.appDir);
    if (segments === null) continue;

    const href = `/${segments.join('/')}`.replace(/\/$/, '') || '/';
    if (skip.has(href)) continue;
    if (excluded.some((re) => re.test(href))) continue;
    if (byHref.has(href)) continue; // same URL from two route groups

    // An area's index page ("/dashboard") is titled after the area itself and
    // listed inside it, so the section never links to a page outside itself.
    const isIndex = segments.length > 0 && parents.has(segments.join('/'));
    const last = segments[segments.length - 1];
    const title =
      config.titles[href] ?? (segments.length === 0 ? 'Home' : titleCase(last, config.acronyms));
    const group = isIndex
      ? (config.groups[titleCase(last, config.acronyms)] ?? titleCase(last, config.acronyms))
      : groupFor(segments, config);

    const keywords = [
      ...new Set([
        ...autoKeywords(segments, segments.length === 0 ? 'root' : isIndex ? 'index' : 'leaf'),
        ...(config.keywords[href] ?? []),
      ]),
    ].filter((word) => !title.toLowerCase().includes(word.toLowerCase()));

    byHref.set(href, {
      id: idFor(segments),
      title,
      href,
      group,
      ...(keywords.length > 0 ? { keywords: keywords.sort() } : {}),
      hint: href,
    });
  }

  for (const item of config.extra) {
    if (!item?.href || !item?.title) continue;
    byHref.set(item.href, {
      id: item.id ?? item.href.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, ''),
      hint: item.href,
      ...item,
    });
  }

  // Group members stay together, groups keep first-seen order, so the palette's
  // empty state reads like a site map rather than a shuffled list.
  const order = [...new Set([...byHref.values()].map((i) => i.group))];
  return [...byHref.values()].sort(
    (a, b) =>
      order.indexOf(a.group) - order.indexOf(b.group) ||
      a.href.split('/').length - b.href.split('/').length ||
      a.title.localeCompare(b.title)
  );
}

export function render(items) {
  const body = items
    .map((item) => {
      const fields = [
        `\t\tid: ${JSON.stringify(item.id)}`,
        `\t\ttitle: ${JSON.stringify(item.title)}`,
        `\t\thref: ${JSON.stringify(item.href)}`,
        `\t\tgroup: ${JSON.stringify(item.group)}`,
      ];
      if (item.keywords?.length) fields.push(`\t\tkeywords: ${JSON.stringify(item.keywords)}`);
      if (item.hint) fields.push(`\t\thint: ${JSON.stringify(item.hint)}`);
      return `\t{\n${fields.join(',\n')},\n\t}`;
    })
    .join(',\n');

  return `// Generated by lib/quick-search/generate.mjs — do not edit by hand.
// Re-run \`npm run quick-search\` after adding or renaming a page.

import type { QuickSearchItem } from "./types";

/** Every linkable page in the App Router tree, grouped by where it lives. */
export const ROUTE_ITEMS: QuickSearchItem[] = [
${body},
];
`;
}

// ------------------------------------------------------------------- cli

function main(argv) {
  const root = resolve(
    argv.find((a) => a.startsWith('--root='))?.slice(7) ?? process.env.INIT_CWD ?? process.cwd()
  );
  const config = readConfig(root);
  const outArg = argv.find((a) => a.startsWith('--out='))?.slice(6);
  const out = resolve(root, outArg ?? config.out);

  const items = buildItems(root, config);
  if (items.length === 0) {
    console.error(`quick-search: no pages found under ${join(root, config.appDir)}/`);
    process.exit(1);
  }

  const next = render(items);
  const current = existsSync(out) ? readFileSync(out, 'utf8') : '';

  if (argv.includes('--check')) {
    if (current === next) {
      console.log(`quick-search: ${relative(root, out)} is up to date`);
      return;
    }
    console.error(`quick-search: ${relative(root, out)} is stale — run \`npm run quick-search\``);
    process.exit(1);
  }

  if (current === next) {
    console.log(`quick-search: ${items.length} pages, no change`);
    return;
  }
  writeFileSync(out, next);
  const groups = new Set(items.map((i) => i.group));
  console.log(
    `quick-search: wrote ${items.length} pages in ${groups.size} groups -> ${relative(root, out)}`
  );
}

if (resolve(process.argv[1] ?? '') === resolve(MODULE_DIR, 'generate.mjs')) {
  main(process.argv.slice(2));
}
