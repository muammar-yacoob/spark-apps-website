# quick-search

A self-contained Ctrl/Cmd+K command palette for React + Tailwind apps. No
dependencies beyond `react` / `react-dom`; copy this folder into any project.

The item list is generated from the App Router tree, so the palette knows every
page without anyone maintaining a list by hand — see **Generated items** below.

## Usage

Mount the component once in any client component (a header is the natural
home). `ROUTE_ITEMS` is the generated list; `QuickSearchTrigger` is the
launcher button:

```tsx
"use client";

import {
  QuickSearch,
  QuickSearchTrigger,
  ROUTE_ITEMS,
} from "@/lib/quick-search";

export function Header() {
  return (
    <QuickSearch
      items={ROUTE_ITEMS}
      trigger={(open) => <QuickSearchTrigger onClick={open} />}
    />
  );
}
```

`QuickSearchTrigger` takes its colours from `currentColor`, so it inherits the
surrounding header on a dark bar or a light one. The shortcut reads `⌘ K` on
every platform — it is the palette's mark rather than a claim about the
keyboard, and Ctrl+K opens it just the same, which the accessible name says.

Pass `className` to restyle it outright, `hideKeysBelow` to drop the shortcut
on narrow screens, or `hideBelow` to hide the whole button (both take `""` |
`"sm"` | `"md"` | `"lg"`).

## Generated items

`generate.mjs` walks the App Router tree and writes `items.generated.ts`:

```bash
node lib/quick-search/generate.mjs          # write the list
node lib/quick-search/generate.mjs --check  # fail if it is stale (CI)
```

Wire it up as `"quick-search": "node lib/quick-search/generate.mjs"` and re-run
it after adding or renaming a page.

What it derives, with no configuration:

| From the tree                     | Becomes                               |
| --------------------------------- | ------------------------------------- |
| `app/pricing/page.tsx`            | "Pricing" in group "Pages"            |
| `app/dashboard/inbox/page.tsx`    | "Inbox" in group "Dashboard"          |
| `app/dashboard/settings/api/…`    | "API" in group "Dashboard · Settings" |
| `app/(marketing)/docs/page.tsx`   | "Docs" — route groups leave the URL   |
| `app/blog/[slug]/page.tsx`        | nothing — no params to link with      |

Nesting becomes the section header, so sections appear as the app grows rather
than being declared. Acronyms stay uppercase (`api` → "API"), joining words
stay lowercase, an area's index page is listed inside its own area, and path
words become search terms. Pages under `/api`, `/auth`, sign-in and error
routes, and `*-success` landings are left out by default.

Routes come from `git ls-files` when the project is a git repo, so scratch
pages that were never committed stay out of the palette.

Override any of it with a `quick-search.config.json` at the repo root:

```json
{
  "appDir": "app",
  "out": "lib/quick-search/items.generated.ts",
  "groups": { "Dashboard · Settings": "Settings" },
  "titles": { "/dashboard": "Overview" },
  "keywords": { "/dashboard/junk": ["spam", "trash"] },
  "skip": ["/internal"],
  "extra": [{ "title": "Status", "href": "https://status.example.com" }],
  "exclude": ["^/api(/|$)"],
  "acronyms": ["api", "dns"]
}
```

For anything JSON cannot hold — an `icon`, vocabulary you would rather keep
type-checked next to the app — layer it on in TypeScript instead:

```tsx
import { mergeQuickSearchItems, ROUTE_ITEMS } from "@/lib/quick-search";

export const ITEMS = mergeQuickSearchItems(ROUTE_ITEMS, [
  { href: "/dashboard", title: "Overview", keywords: ["stats", "unread"] },
  { href: "/dashboard?view=settings", title: "Appearance", group: "Settings" },
]);
```

Fields replace, `keywords` accumulate, and an override for an href with no page
of its own (a query-param view, an external link) is appended as a new row.

## Hand-written items

Nothing stops you passing a list directly:

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
- `QuickSearchTrigger.tsx` - the header launcher (theme-agnostic, platform-aware)
- `generate.mjs` - route scanner that writes `items.generated.ts`
- `items.generated.ts` - the generated list, committed
- `merge.ts` - layers hand-written detail over the generated list
- `index.ts` - public exports

The source files are written for the strictest setup they might be copied into:
they pass `noUncheckedIndexedAccess` and contain no `any`. Run the host
project's own formatter after copying — house styles differ, and an unformatted
copy re-diverges on the next `npm run format`.
