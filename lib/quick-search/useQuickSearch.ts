'use client';

import { useMemo } from 'react';
import { fuzzyMatch } from './fuzzy';
import { DEFAULT_SYNONYMS, expandWord, type SynonymMap } from './synonyms';
import type { QuickSearchItem, QuickSearchResult } from './types';

const KEYWORD_WEIGHT = 0.75;
const SYNONYM_WEIGHT = 0.85;
const MAX_RESULTS = 12;

/**
 * Rank `items` against `query`.
 *
 * Multi-word queries AND together: every word (or one of its synonyms) must
 * match the title or a keyword. Title matches carry the highlight ranges;
 * keyword and synonym matches count for ranking but highlight nothing (the
 * matched text is not on screen). An empty query returns every item in
 * registration order, so the palette opens as a browsable directory rather
 * than a blank box.
 */
export function useQuickSearch(
  items: QuickSearchItem[],
  query: string,
  synonyms: SynonymMap = DEFAULT_SYNONYMS
): QuickSearchResult[] {
  return useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return items.map((item) => ({ item, score: 0, ranges: [] }));
    }

    const expanded = words.map((w) => expandWord(w, synonyms));
    const results: QuickSearchResult[] = [];

    for (const item of items) {
      const title = item.title.toLowerCase();
      const keywords = (item.keywords ?? []).map((k) => k.toLowerCase());
      let score = 0;
      let ranges: Array<[number, number]> = [];
      let matchedAll = true;

      for (let w = 0; w < words.length; w++) {
        // Best hit across the literal word and its synonyms; the literal word
        // is always alternatives[0] and scores at full weight.
        let best: { score: number; ranges: Array<[number, number]> } | null = null;
        for (const alt of expanded[w]) {
          const weight = alt === words[w] ? 1 : SYNONYM_WEIGHT;
          const titleHit = fuzzyMatch(alt, title);
          if (titleHit && (!best || titleHit.score * weight > best.score)) {
            best = { score: titleHit.score * weight, ranges: titleHit.ranges };
          }
          for (const k of keywords) {
            const keywordHit = fuzzyMatch(alt, k);
            if (keywordHit) {
              const weighted = keywordHit.score * weight * KEYWORD_WEIGHT;
              if (!best || weighted > best.score) best = { score: weighted, ranges: [] };
            }
          }
        }
        if (!best) {
          matchedAll = false;
          break;
        }
        score += best.score;
        ranges = ranges.concat(best.ranges);
      }

      if (matchedAll) results.push({ item, score, ranges: mergeRanges(ranges) });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS);
  }, [items, query, synonyms]);
}

/** Overlapping words ("gen ge") produce overlapping ranges; merge before rendering. */
function mergeRanges(ranges: Array<[number, number]>): Array<[number, number]> {
  if (ranges.length < 2) return ranges;
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    if (sorted[i][0] <= last[1]) last[1] = Math.max(last[1], sorted[i][1]);
    else merged.push([sorted[i][0], sorted[i][1]]);
  }
  return merged;
}
