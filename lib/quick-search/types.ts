/** A destination the palette can take the user to. */
export interface QuickSearchItem {
  /** Unique across all registered items. */
  id: string;
  /** What the row says; also what the query is matched against first. */
  title: string;
  /** Where selecting the row goes. */
  href: string;
  /** Section header the row is listed under ("Pages", "Settings", ...). */
  group?: string;
  /** Extra terms that should find this row without appearing in its title. */
  keywords?: string[];
  /** Dimmed text on the right of the row, usually the destination path. */
  hint?: string;
  /** Optional leading icon. */
  icon?: React.ReactNode;
}

/** A ranked hit: the item plus which title characters matched, for highlighting. */
export interface QuickSearchResult {
  item: QuickSearchItem;
  score: number;
  /** [start, end) ranges into item.title. Empty when the match came from keywords. */
  ranges: Array<[number, number]>;
}
