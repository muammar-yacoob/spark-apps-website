/**
 * Subsequence fuzzy matcher: every query character must appear in order.
 *
 * Scoring favours what a person means when they type a fragment: characters
 * at the start of words beat characters mid-word, unbroken runs beat
 * scattered ones, and earlier matches beat later ones. Tuned for short
 * navigation titles, not documents.
 */

const WORD_START_BONUS = 8;
const CONSECUTIVE_BONUS = 5;
const FIRST_CHAR_BONUS = 6;
const GAP_PENALTY = 1;
const MAX_GAP_PENALTY = 10;

function isWordStart(text: string, index: number): boolean {
  if (index === 0) return true;
  const prev = text[index - 1];
  return prev === ' ' || prev === '-' || prev === '_' || prev === '/' || prev === '.';
}

/**
 * Match `query` against `text` (both already lowercased by the caller).
 * Returns a score and the matched [start, end) ranges, or null on no match.
 */
export function fuzzyMatch(
  query: string,
  text: string
): { score: number; ranges: Array<[number, number]> } | null {
  if (!query) return { score: 0, ranges: [] };

  let score = 0;
  let ti = 0;
  let lastMatch = -2;
  const ranges: Array<[number, number]> = [];

  for (let qi = 0; qi < query.length; qi++) {
    // Prefer the next word start holding this character over the nearest
    // occurrence: "cp" should hit "Category & Pricing", not the "c...p" inside
    // one word.
    let found = -1;
    for (let i = ti; i < text.length; i++) {
      if (text[i] === query[qi] && isWordStart(text, i)) {
        found = i;
        break;
      }
    }
    if (found === -1) found = text.indexOf(query[qi], ti);
    if (found === -1) return null;

    if (found === 0) score += FIRST_CHAR_BONUS;
    if (isWordStart(text, found)) score += WORD_START_BONUS;
    if (found === lastMatch + 1) {
      score += CONSECUTIVE_BONUS;
      ranges[ranges.length - 1][1] = found + 1;
    } else {
      score -= Math.min(MAX_GAP_PENALTY, (found - ti) * GAP_PENALTY);
      ranges.push([found, found + 1]);
    }

    lastMatch = found;
    ti = found + 1;
  }

  // Fuller matches rank above matches lost in long strings.
  score += Math.max(0, 12 - (text.length - query.length));
  return { score, ranges };
}
