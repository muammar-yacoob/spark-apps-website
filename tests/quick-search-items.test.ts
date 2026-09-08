import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';
import { QUICK_SEARCH_ITEMS } from '../lib/quick-search-items';

/**
 * Keeps the Ctrl/Cmd+K palette honest about what this app contains.
 *
 * It drifts in both directions, and both are silent. A row can outlive the page
 * it points at, and the palette becomes a menu of dead ends. More quietly, a
 * page or a feature ships without a row -- and since an empty query lists
 * everything, the palette then under-reports the product to the person most
 * likely to be looking for it.
 *
 * So: every row lands somewhere real, and every page is either listed or
 * excused in `UNLISTED` with the reason. Adding a page and not the row is
 * meant to fail here rather than be discovered by a user who assumed the
 * feature did not exist.
 *
 * Controls that live inside a page (a toggle in a menu, a pane held in React
 * state) have no URL of their own, so nothing mechanical can check them. Give
 * them a row pointing at the page that holds them, and the keywords people
 * would actually type.
 */

const ROOT = resolve(import.meta.dirname, '..');
const APP = join(ROOT, 'app');
/** Where JSX lives, for collecting `id="..."` anchor targets. */
const SOURCE_DIRS = ['app', 'components', 'lib', 'src'];

/** Pages the palette is right to leave out, and the reason it is right. */
const UNLISTED: Record<string, string> = {
  '/error': 'Next.js error boundary, reached by failing, not by navigating',
};

interface Routes {
  /** Static page routes, as the palette would spell them. */
  pages: string[];
  /** Page routes with a `[param]` segment. */
  dynamic: string[];
  /** Paths served by a route handler rather than a page (llms.txt, feeds). */
  handlers: string[];
}

function routes(): Routes {
  const pages: string[] = [];
  const dynamic: string[] = [];
  const handlers: string[] = [];

  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Private folders are not routes; `api` is one only at the top level,
        // where it is the API namespace -- a docs/api page is a real page.
        if (entry.name.startsWith('_') || entry.name === 'node_modules') continue;
        if (entry.name === 'api' && prefix === '') continue;
        // A (group) folder organises files without appearing in the URL.
        const segment = /^\(.+\)$/.test(entry.name) ? '' : `/${entry.name}`;
        walk(path, prefix + segment);
        continue;
      }

      const route = prefix === '' ? '/' : prefix;
      if (entry.name === 'page.tsx' || entry.name === 'page.jsx') {
        (route.includes('[') ? dynamic : pages).push(route);
      } else if (entry.name === 'route.ts' || entry.name === 'route.tsx') {
        handlers.push(route);
      }
    }
  };

  walk(APP, '');
  return {
    pages: [...new Set(pages)].sort(),
    dynamic: [...new Set(dynamic)],
    handlers: [...new Set(handlers)],
  };
}

/** Every `id="..."` in the source tree; the targets of the palette's #anchors. */
function anchorIds(): Set<string> {
  const ids = new Set<string>();

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        walk(path);
      } else if (entry.name.endsWith('.tsx')) {
        for (const [, id] of readFileSync(path, 'utf8').matchAll(/\bid="([^"]+)"/g)) {
          ids.add(id as string);
        }
      }
    }
  };

  for (const dir of SOURCE_DIRS) {
    const path = join(ROOT, dir);
    if (existsSync(path)) walk(path);
  }
  return ids;
}

/** `/builder/new` is served by `/builder/[resumeId]`; `[...rest]` eats the tail. */
function matchesDynamic(path: string, dynamic: string[]): boolean {
  const parts = path.split('/');
  return dynamic.some((route) => {
    const segments = route.split('/');
    for (const [i, segment] of segments.entries()) {
      if (segment.startsWith('[...')) return parts.length > i;
      if (segment.startsWith('[')) {
        if (!parts[i]) return false;
      } else if (segment !== parts[i]) {
        return false;
      }
    }
    return segments.length === parts.length;
  });
}

/** The path part of an href, without its query string or #anchor. */
const pathOf = (href: string) => href.split(/[?#]/)[0] as string;

describe('quick search items', () => {
  test('ids are unique', () => {
    const ids = QUICK_SEARCH_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every row points at something that exists', () => {
    const { pages, dynamic, handlers } = routes();

    for (const item of QUICK_SEARCH_ITEMS) {
      if (!item.href.startsWith('/')) {
        // Off-site rows (a web store, the pricing host) are still links.
        expect(item.href, item.id).toMatch(/^https:\/\//);
        continue;
      }

      const path = pathOf(item.href);
      const found =
        pages.includes(path) || handlers.includes(path) || matchesDynamic(path, dynamic);
      expect(found, `${item.id} -> ${item.href}`).toBe(true);
    }
  });

  test('every #anchor a row points at exists', () => {
    const ids = anchorIds();

    for (const item of QUICK_SEARCH_ITEMS) {
      const hash = item.href.split('#')[1];
      if (!hash) continue;
      expect(ids, `${item.id} -> #${hash}`).toContain(hash);
    }
  });

  test('every page is either listed or excused', () => {
    const listed = new Set(
      QUICK_SEARCH_ITEMS.filter((item) => item.href.startsWith('/')).map((item) =>
        pathOf(item.href)
      )
    );

    const missing = routes().pages.filter((page) => !listed.has(page) && !(page in UNLISTED));
    expect(missing).toEqual([]);
  });

  test('the excuses are still about pages that exist and are unlisted', () => {
    const { pages } = routes();
    const listed = new Set(
      QUICK_SEARCH_ITEMS.filter((item) => item.href.startsWith('/')).map((item) =>
        pathOf(item.href)
      )
    );

    // A stale excuse is how the check above quietly stops covering something.
    const stale = Object.keys(UNLISTED).filter((page) => !pages.includes(page) || listed.has(page));
    expect(stale).toEqual([]);
  });
});
