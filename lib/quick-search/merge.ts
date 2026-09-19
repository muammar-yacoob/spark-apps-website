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
 * Both lists keep their order: generated rows stay where the tree put them,
 * extra rows follow.
 */
export function mergeQuickSearchItems(
  generated: QuickSearchItem[],
  overrides: QuickSearchOverride[] = []
): QuickSearchItem[] {
  const byHref = new Map(generated.map((item) => [item.href, item]));
  const appended: QuickSearchItem[] = [];

  for (const override of overrides) {
    const base = byHref.get(override.href);

    if (!base) {
      if (!override.title) continue; // nothing to show a row for
      appended.push({
        ...(override as QuickSearchItem),
        id: override.id ?? slugify(override.href),
        hint: override.hint ?? override.href,
      });
      continue;
    }

    byHref.set(override.href, {
      ...base,
      ...override,
      keywords: dedupe([...(base.keywords ?? []), ...(override.keywords ?? [])]),
    });
  }

  return [...byHref.values(), ...appended].map(stripEmptyKeywords);
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
