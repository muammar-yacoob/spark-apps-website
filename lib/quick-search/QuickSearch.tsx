'use client';

/**
 * Command-palette navigation: Ctrl/Cmd+K opens it, typing filters, Enter goes.
 *
 * Self-contained on purpose (no icon/animation/state libraries, portal to
 * <body>) so the folder can be dropped into any React + Tailwind project.
 * Navigation is a full location.assign by default: it works in any router and
 * lands cleanly on URLs whose query params are only read on mount. Pass
 * `onNavigate` for client-side routing.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { SynonymMap } from './synonyms';
import type { QuickSearchItem, QuickSearchResult } from './types';
import { useQuickSearch } from './useQuickSearch';

export function QuickSearch({
  items,
  placeholder = 'Search pages and settings...',
  onNavigate,
  trigger,
  synonyms,
}: {
  items: QuickSearchItem[];
  placeholder?: string;
  /** Override the default full-page navigation (e.g. with router.push). */
  onNavigate?: (item: QuickSearchItem) => void;
  /** Optional launcher (a header button); the hotkey works regardless. */
  trigger?: (open: () => void) => React.ReactNode;
  /** Extend or replace DEFAULT_SYNONYMS for app-specific vocabulary. */
  synonyms?: SynonymMap;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const results = useQuickSearch(items, query, synonyms);

  const show = useCallback(() => {
    setQuery('');
    setActive(0);
    setOpen(true);
  }, []);
  const hide = useCallback(() => setOpen(false), []);

  const go = useCallback(
    (item: QuickSearchItem) => {
      hide();
      if (onNavigate) onNavigate(item);
      else window.location.assign(item.href);
    },
    [hide, onNavigate]
  );

  // Global hotkey. Ignore plain typing in fields; Ctrl/Cmd+K is safe anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) hide();
        else show();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, show, hide]);

  // Focus the input and freeze page scroll while open.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Typing narrows the list; the selection restarts from the best hit.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset selection when the query changes
  useEffect(() => setActive(0), [query]);

  // Keep the keyboard selection in view.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs after each selection move; the DOM query finds the new active row
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((v) => Math.min(v + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((v) => Math.max(v - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) go(results[active].item);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      hide();
    }
  };

  return (
    <>
      {trigger?.(show)}
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-[12vh]"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) hide();
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Quick search"
          >
            <div className="w-full max-w-lg rounded-xl border border-white/[0.08] bg-gray-900 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2.5 px-4 border-b border-white/[0.06]">
                <SearchIcon />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder-gray-500 outline-none"
                  spellCheck={false}
                  autoComplete="off"
                />
                <kbd className="text-[10px] text-gray-500 border border-white/[0.08] rounded px-1.5 py-0.5">
                  esc
                </kbd>
              </div>

              <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1.5">
                {results.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-gray-500">
                    Nothing matches &ldquo;{query}&rdquo;
                  </p>
                ) : (
                  groupResults(results).map(([group, rows]) => (
                    <div key={group}>
                      {group && (
                        <p className="px-4 pt-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                          {group}
                        </p>
                      )}
                      {rows.map(({ result, index }) => (
                        <button
                          key={result.item.id}
                          type="button"
                          data-active={index === active}
                          onMouseEnter={() => setActive(index)}
                          onClick={() => go(result.item)}
                          className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors ${
                            index === active ? 'bg-white/[0.06]' : ''
                          }`}
                        >
                          {result.item.icon && (
                            <span className="text-gray-500 shrink-0">{result.item.icon}</span>
                          )}
                          <span className="flex-1 min-w-0 truncate text-sm text-gray-200">
                            <Highlighted title={result.item.title} ranges={result.ranges} />
                          </span>
                          {result.item.hint && (
                            <span className="shrink-0 text-[11px] text-gray-600">
                              {result.item.hint}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-3 px-4 py-2 border-t border-white/[0.06] text-[10px] text-gray-600">
                <span>
                  <Key>↑</Key> <Key>↓</Key> navigate
                </span>
                <span>
                  <Key>↵</Key> open
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

/** Rows in rank order, but rendered under their group headers. A group's
    position follows its best hit, so relevance still reads top-down. */
function groupResults(
  results: QuickSearchResult[]
): Array<[string, Array<{ result: QuickSearchResult; index: number }>]> {
  const groups = new Map<string, Array<{ result: QuickSearchResult; index: number }>>();
  results.forEach((result, index) => {
    const key = result.item.group ?? '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)?.push({ result, index });
  });
  return [...groups.entries()];
}

function Highlighted({ title, ranges }: { title: string; ranges: Array<[number, number]> }) {
  if (ranges.length === 0) return <>{title}</>;
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start > cursor) parts.push(title.slice(cursor, start));
    parts.push(
      <mark key={start} className="bg-transparent text-teal-400 font-medium">
        {title.slice(start, end)}
      </mark>
    );
    cursor = end;
  }
  if (cursor < title.length) parts.push(title.slice(cursor));
  return <>{parts}</>;
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="border border-white/[0.08] rounded px-1 py-0.5 text-gray-500">{children}</kbd>
  );
}

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-500 shrink-0"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
