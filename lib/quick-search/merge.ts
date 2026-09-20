import type { QuickSearchItem } from './types';

/** A tweak to a generated row, or a whole new row when it carries a title. */
export type QuickSearchOverride = Partial<QuickSearchItem> & Pick<QuickSearchItem, 'href'>;

/**
 * Layers hand-written detail over the generated route list.
 *
 * The generator knows every page but nothing about vocabulary — that "Junk" is
 * what somebody calls spam, or which row deserves an icon. Overrides supply
 * that by `href`: fields replace, `keywords` accumulate, and an override for an
 * href that has no page yet (a query-param view, an external link) is appended
 * as its own row.
 *
 * `siblings` is for rows that share an href with a page that DOES exist — the
 * tools inside one editor, the sections of one settings page. Those cannot be
 * overrides: an override keyed by href would overwrite the page's own row
 * instead of joining it. They are appended as they are, in order.
 *
 * Every list keeps its order: generated rows stay where the tree put them,
 * then override-only rows, then siblings.
 */
export function mergeQuickSearchItems(
  generated: QuickSearchItem[],
  overrides: QuickSearchOverride[] = [],
  siblings: QuickSearchItem[] = []
): QuickSearchItem[] {
  const byHref = new Map(generated.map((item) => [item.href, item]));
  // Rows for hrefs the generator never saw. Keyed by id where one is given:
  // several rows legitimately share an href — in-page views and anchors have no
  // URL of their own — and only a repeat of the same id is a duplicate.
  const appended = new Map<string, QuickSearchItem>();

  for (const override of overrides) {
    const base = byHref.get(override.href);

    if (!base) {
      const key = override.id ?? override.href;
      const existing = appended.get(key);
      // A title-less override exists to add vocabulary to a generated row; with
      // no row to attach to there is nothing to render.
      if (!existing && !override.title) continue;
      appended.set(key, {
        ...(existing as QuickSearchItem),
        ...(override as QuickSearchItem),
        id: override.id ?? existing?.id ?? slugify(override.href),
        hint: override.hint ?? existing?.hint ?? override.href,
        keywords: dedupe([...(existing?.keywords ?? []), ...(override.keywords ?? [])]),
      });
      continue;
    }

    byHref.set(override.href, {
      ...base,
      ...override,
      keywords: dedupe([...(base.keywords ?? []), ...(override.keywords ?? [])]),
    });
  }

  // Siblings are appended verbatim, deduped by id so a list concatenated twice
  // does not double the palette.
  const bySiblingId = new Map<string, QuickSearchItem>();
  for (const sibling of siblings) bySiblingId.set(sibling.id, sibling);

  return [...byHref.values(), ...appended.values(), ...bySiblingId.values()].map(
    stripEmptyKeywords
  );
}

function slugify(href: string) {
  return href.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'home';
}

function dedupe(words: string[]) {
  return [...new Set(words.map((w) => w.trim()).filter(Boolean))];
}

function stripEmptyKeywords(item: QuickSearchItem): QuickSearchItem {
  if (item.keywords && item.keywords.length === 0) {
    const { keywords: _drop, ...rest } = item;
    return rest;
  }
  return item;
}
