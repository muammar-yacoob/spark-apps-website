# quick-search

A self-contained Ctrl/Cmd+K command palette for React + Tailwind apps. No
dependencies beyond `react` / `react-dom`; copy this folder into any project.

## Usage

Define the destinations and mount the component once in any client component
(a header is the natural home):

```tsx
'use client';

import { QuickSearch, type QuickSearchItem } from '@/lib/quick-search';

const ITEMS: QuickSearchItem[] = [
  { id: 'home', title: 'Overview', href: '/dashboard', group: 'Dashboard' },
  {
    id: 'settings-appearance',
    title: 'Appearance',
    href: '/dashboard?view=settings&section=appearance',
    group: 'Settings',
    keywords: ['color', 'theme', 'logo'],
    hint: 'Settings',
  },
  { id: 'pricing', title: 'Pricing', href: '/pricing', group: 'Pages', hint: '/pricing' },
];

export function Header() {
  return (
    <QuickSearch
      items={ITEMS}
      trigger={(open) => (
        <button type="button" onClick={open} aria-label="Search (Ctrl+K)">
          ...
        </button>
      )}
    />
  );
}
```

Ctrl/Cmd+K works with or without a `trigger`. Selecting a row does a full
`location.assign(href)`, which lands correctly on URLs whose query params are
only read on mount; pass `onNavigate` to use your router instead:

```tsx
<QuickSearch items={ITEMS} onNavigate={(item) => router.push(item.href)} />
```

## Item fields

| Field      | Purpose                                                        |
| ---------- | -------------------------------------------------------------- |
| `title`    | Row label; fuzzy-matched first, matches are highlighted.       |
| `keywords` | Terms that should find the row without being in its title.     |
| `group`    | Section header; rank order still wins between groups.          |
| `hint`     | Dimmed right-hand text, usually the destination path.          |
| `icon`     | Optional leading `ReactNode`.                                  |

## Matching

`fuzzy.ts` is a subsequence matcher tuned for short navigation titles:
word-start hits and unbroken runs rank highest, so `cp` finds
"Category & Pricing". Everything is case-insensitive. Multi-word queries AND
together across title and keywords. An empty query lists everything, making
the palette double as a site map.

Near-miss vocabulary is handled by `synonyms.ts`: typing "config" (or just
"conf") finds rows titled "Settings", "theme" finds "Appearance", and so on.
`DEFAULT_SYNONYMS` covers universal app vocabulary; pass your own map to add
domain terms:

```tsx
<QuickSearch
  items={ITEMS}
  synonyms={{ ...DEFAULT_SYNONYMS, invoice: ['receipt', 'bill'] }}
/>
```

Synonym and keyword hits rank slightly below literal title hits, so exact
typing always wins.

## Files

- `types.ts` - `QuickSearchItem` / `QuickSearchResult`
- `fuzzy.ts` - scoring subsequence matcher (pure, unit-testable)
- `synonyms.ts` - default synonym map + query expansion
- `useQuickSearch.ts` - ranking hook over an item list
- `QuickSearch.tsx` - the palette (portal, hotkey, keyboard nav)
- `index.ts` - public exports
