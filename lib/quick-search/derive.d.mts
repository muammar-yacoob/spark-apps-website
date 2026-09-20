/** Types for derive.mjs, which is plain JS so node and the browser can share it. */

export interface DeriveConfig {
  /** Regex sources for paths that are never a destination (auth, api, ...). */
  exclude: string[];
  /** Words to uppercase in a title: "api" -> "API". */
  acronyms: string[];
  /** Group label for paths with no parent segment ("/", "/pricing"). */
  rootGroup: string;
  /** Joins nested area names: "Dashboard" + "Settings". */
  groupSeparator: string;
  /** Renames a derived group, keyed by the derived label. */
  groups: Record<string, string>;
  /** Renames a derived title, keyed by href. */
  titles: Record<string, string>;
  /** Extra search terms, keyed by href. */
  keywords: Record<string, string[]>;
}

export declare const DEFAULT_DERIVE: DeriveConfig;

export declare function titleCase(segment: string, acronyms: string[]): string;

export declare function groupFor(
  segments: string[],
  config: Pick<DeriveConfig, 'rootGroup' | 'groupSeparator' | 'groups' | 'acronyms'>
): string;

export declare function idFor(segments: string[]): string;

export declare function autoKeywords(segments: string[], kind: 'root' | 'index' | 'leaf'): string[];

export declare function orderItems<T extends { group?: string; href: string; title: string }>(
  items: T[],
  rootGroup: string,
  indexHrefs?: Set<string>
): T[];
