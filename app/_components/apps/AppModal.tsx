'use client';

import { ArrowUpRight, Chrome, ExternalLink, Globe, Package, Rocket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { CloseButton } from '@/app/_components/ui/CloseButton';
import type { SparkApp } from '@/lib/data/apps';
import { fallbackTag, tagConfig } from '@/lib/data/tags';

export const linkIcons: Record<string, React.ElementType> = {
  website: Globe,
  app: Rocket,
  chrome: Chrome,
  npm: Package,
  github: ExternalLink,
};

/**
 * One modal for the whole grid: the page keeps a single instance and swaps the
 * app into it, so there is one copy of this markup rather than one per card.
 *
 * Built on native <dialog> + showModal(), which already gives us Esc to close,
 * the focus trap, focus restored to the card, the backdrop and top-layer
 * stacking. Pass `app: null` to close it.
 */
export function AppModal({ app, onClose }: { app: SparkApp | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (app && !el.open) el.showModal();
    else if (!app && el.open) el.close();
  }, [app]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop dismissal only; showModal() already closes the dialog on Escape and the close button is focusable.
    <dialog
      ref={ref}
      onClose={onClose}
      // A click on the ::backdrop targets the dialog itself; the panel below
      // swallows its own clicks, so this only fires outside it.
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="app-modal-title"
      className="m-auto w-[min(92vw,30rem)] rounded-2xl border border-white/10 bg-gray-900/95 p-0 text-gray-100 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {app && (
        <div className="animate-fade-in-up overflow-hidden rounded-2xl">
          {/* Accent bloom, so the panel reads as Spark chrome and not a UA dialog */}
          <div className="h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

          <div className="flex items-start gap-3 p-5 pb-3">
            <Image
              src={app.icon}
              alt=""
              width={48}
              height={48}
              className="flex-shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <h2 id="app-modal-title" className="font-semibold text-base text-white leading-tight">
                {app.name}
              </h2>
              <p className="text-[12px] text-gray-500 leading-tight">{app.tagline}</p>
            </div>
            <CloseButton onClick={onClose} />
          </div>

          <div className="px-5 pb-5">
            <p className="text-gray-300 text-sm leading-relaxed">{app.description}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {app.tags.map((tag) => {
                const cfg = tagConfig[tag] ?? fallbackTag;
                const TagIcon = cfg.icon;
                return (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium text-[10px] ${cfg.color}`}
                  >
                    <TagIcon className="h-2.5 w-2.5 flex-shrink-0" />
                    {tag}
                  </span>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-white/[0.06] border-t pt-4">
              {app.links.map((link) => {
                const Icon = linkIcons[link.type] ?? ExternalLink;
                const external = /^https?:\/\//.test(link.url);
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-gray-200 transition-colors hover:border-blue-400/30 hover:bg-white/[0.08] hover:text-white"
                  >
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                    {link.label}
                  </a>
                );
              })}
              {/* Every app has a catalogue page here, even the ones with no
                  external link at all, so this is never a dead end. */}
              <Link
                href={`/apps/${app.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-[12px] text-blue-200 transition-colors hover:bg-blue-400/20 hover:text-white"
              >
                Details
                <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
