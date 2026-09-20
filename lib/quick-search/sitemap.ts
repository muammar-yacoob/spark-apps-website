'use client';

/**
 * Builds the palette from the host app's own sitemap, at runtime.
 *
 * The generator (generate.mjs) reads the App Router tree, which is exact but
 * needs a build step. This is the zero-setup alternative: drop the folder into
 * any app that serves /sitemap.xml — Next, Astro, Rails, a static site — and
 * the palette knows its pages without being told, because the app already
 * publishes the list for search engines.
 *
 * Naming and grouping come from derive.mjs, the same rules the generator uses,
 * so a page found either way reads identically.
 */

import { useEffect, useState } from 'react';
import {
  autoKeywords,
  DEFAULT_DERIVE,
  type DeriveConfig,
  groupFor,
  idFor,
  orderItems,
  titleCase,
} from './derive.mjs';
import type { QuickSearchItem } from './types';

export interface SitemapOptions extends Partial<DeriveConfig> {
  /** Where the sitemap lives. Relative is resolved against the current origin. */
  url?: string;
  /** Hrefs to leave out even though the sitemap lists them. */
  skip?: string[];
  /** Follow a sitemap index to its children (one level). Defaults to true. */
  followIndex?: boolean;
  signal?: AbortSignal;
}

/** <loc> is the only element that matters here, and it never nests. */
const LOC = /<loc>\s*([^<\s]+)\s*<\/loc>/g;

function locations(xml: string): string[] {
  const found: string[] = [];
  LOC.lastIndex = 0;
  let match = LOC.exec(xml);
  while (match) {
    if (match[1]) found.push(decodeXml(match[1]));
    match = LOC.exec(xml);
  }
  return found;
}

function decodeXml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/** A sitemap index points at more sitemaps rather than at pages. */
function isIndex(xml: string): boolean {
  return /<sitemapindex[\s>]/i.test(xml);
}

/** "https://site.com/docs/api?x=1" -> ["docs", "api"], or null if unusable. */
function pathSegments(location: string): string[] | null {
  let path: string;
  try {
    path = new URL(location, 'https://localhost').pathname;
  } catch {
    return null;
  }
  const segments = path.split('/').filter(Boolean).map(decodeURIComponent);
  // A segment that still looks like a template was never expanded.
  return segments.some((s) => s.includes('[') || s.includes(':')) ? null : segments;
}

/**
 * Turns sitemap XML into palette rows.
 *
 * Exported separately from the fetch so a server component can hand the XML
 * over, or a test can pass a fixture.
 */
export function itemsFromSitemapXml(xml: string, options: SitemapOptions = {}): QuickSearchItem[] {
  const config = { ...DEFAULT_DERIVE, ...options };
  const excluded = config.exclude.map((p) => new RegExp(p, 'i'));
  const skip = new Set(options.skip ?? []);
  const byHref = new Map<string, QuickSearchItem>();
  const parents = new Set<string>();

  const paths = locations(xml)
    .map(pathSegments)
    .filter((s): s is string[] => s !== null);

  for (const segments of paths)
    for (let i = 1; i < segments.length; i++) parents.add(segments.slice(0, i).join('/'));

  for (const segments of paths) {
    const href = `/${segments.join('/')}`.replace(/\/$/, '') || '/';
    if (skip.has(href) || byHref.has(href)) continue;
    if (excluded.some((re) => re.test(href))) continue;

    const isAreaIndex = segments.length > 0 && parents.has(segments.join('/'));
    const last = segments[segments.length - 1] ?? '';
    const title =
      config.titles[href] ?? (segments.length === 0 ? 'Home' : titleCase(last, config.acronyms));
    const group = isAreaIndex
      ? (config.groups[titleCase(last, config.acronyms)] ?? titleCase(last, config.acronyms))
      : groupFor(segments, config);

    const keywords = [
      ...new Set([
        ...autoKeywords(segments, segments.length === 0 ? 'root' : isAreaIndex ? 'index' : 'leaf'),
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

  const indexHrefs = new Set(
    [...byHref.keys()].filter((href) => parents.has(href.slice(1).replace(/\/$/, '')))
  );
  return orderItems([...byHref.values()], config.rootGroup, indexHrefs);
}

/** Fetches the sitemap and builds the rows. Resolves to [] if it cannot. */
export async function fetchSitemapItems(options: SitemapOptions = {}): Promise<QuickSearchItem[]> {
  const url = options.url ?? '/sitemap.xml';
  const xml = await read(url, options.signal);
  if (!xml) return [];

  if (isIndex(xml) && options.followIndex !== false) {
    const children = await Promise.all(locations(xml).map((child) => read(child, options.signal)));
    return itemsFromSitemapXml(children.filter(Boolean).join('\n'), options);
  }

  return itemsFromSitemapXml(xml, options);
}

async function read(url: string, signal?: AbortSignal): Promise<string> {
  try {
    const response = await fetch(url, { signal });
    return response.ok ? await response.text() : '';
  } catch {
    // A missing sitemap is not an error worth breaking a header over.
    return '';
  }
}

/**
 * The sitemap rows, fetched once on mount.
 *
 * `fallback` is what the palette shows until the fetch lands — pass the
 * generated list where there is one, so the palette is never empty, or leave
 * it out for an app with no build step.
 */
export function useSitemapItems(
  fallback: QuickSearchItem[] = [],
  options: SitemapOptions = {}
): QuickSearchItem[] {
  const [items, setItems] = useState(fallback);
  const url = options.url ?? '/sitemap.xml';

  useEffect(() => {
    const controller = new AbortController();
    fetchSitemapItems({ ...options, url, signal: controller.signal })
      .then((found) => {
        if (found.length > 0) setItems(found);
      })
      .catch(() => {
        // Keep the fallback; an unreachable sitemap is not worth a error.
      });
    return () => controller.abort();
    // The options object is usually an inline literal; the url is what identifies it.
  }, [url]);

  return items;
}
