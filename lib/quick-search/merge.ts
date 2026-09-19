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
  // Rows for hrefs the generator never saw, keyed so a second override for the
  // same href refines the first rather than listing it twice.
  const appended = new Map<string, QuickSearchItem>();

  for (const override of overrides) {
    const base = byHref.get(override.href);

    if (!base) {
      const existing = appended.get(override.href);
      // A title-less override exists to add vocabulary to a generated row; with
      // no row to attach to there is nothing to render.
      if (!existing && !override.title) continue;
      appended.set(override.href, {
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

  return [...byHref.values(), ...appended.values()].map(stripEmptyKeywords);
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
