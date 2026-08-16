/**
 * Query expansion: words people type that should find rows titled otherwise.
 *
 * Each entry is one meaning; every member of a group finds rows matching any
 * other member. Matching is prefix-based both ways, so a half-typed "conf"
 * already behaves like "settings". Apps can extend or replace this via the
 * `synonyms` prop; keep this default list universal, not app-specific.
 */
export type SynonymMap = Record<string, string[]>;

export const DEFAULT_SYNONYMS: SynonymMap = {
  settings: ['config', 'configuration', 'preferences', 'options', 'setup'],
  appearance: ['theme', 'branding', 'style', 'color', 'colour', 'look'],
  notifications: ['alerts', 'push'],
  analytics: ['stats', 'statistics', 'metrics', 'traffic', 'insights'],
  pricing: ['billing', 'plans', 'subscription', 'payment', 'upgrade', 'cost'],
  overview: ['home', 'start', 'main'],
  docs: ['documentation', 'help', 'guide', 'manual'],
  account: ['profile', 'user'],
  email: ['mail', 'inbox'],
  directory: ['listings', 'catalog'],
  community: ['social', 'members'],
  search: ['find', 'lookup'],
};

/**
 * The typed word plus every member of any group it belongs to. The caller
 * scores expansions slightly below the literal word so exact typing wins.
 */
export function expandWord(word: string, synonyms: SynonymMap): string[] {
  const seen = new Set([word]);
  for (const [key, alts] of Object.entries(synonyms)) {
    const group = [key, ...alts];
    if (group.some((g) => g.startsWith(word) || word.startsWith(g))) {
      for (const g of group) seen.add(g);
    }
  }
  return [...seen];
}
