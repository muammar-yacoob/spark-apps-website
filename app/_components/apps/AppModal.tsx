'use client';

import { ArrowUpRight, Chrome, ExternalLink, Globe, Package, Rocket } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { CloseButton } from '@/app/_components/ui/CloseButton';
import type { AppLink, SparkApp } from '@/lib/data/apps';
import { primaryLink } from '@/lib/data/apps';
import { fallbackTag, tagConfig } from '@/lib/data/tags';

export const linkIcons: Record<string, React.ElementType> = {
  website: Globe,
  app: Rocket,
  chrome: Chrome,
  npm: Package,
  github: ExternalLink,
};

const CTA_LABEL: Record<AppLink['type'], string> = {
  website: 'Visit site',
  app: 'Open app',
  chrome: 'Chrome Web Store',
  npm: 'View on npm',
  github: 'View on GitHub',
};

/**
 * One modal for the whole grid: the page keeps a single instance and swaps the
 * app into it, so there is one copy of this markup rather than one per card.
 *
 * Built on native <dialog> + showModal(), which already gives us Esc to close,
 * the focus trap, focus restored to the card, the backdrop and top-layer
 * stacking. Pass `app: null` to close it.
 *
 * ONE button, not a row of them: the destination is a single CTA and anything
 * else is an icon the width of its own glyph. There is no Details link because
 * there are no per-app pages on this site any more, so this modal is the
 * detail view and the CTA is the only way out of it.
 */
export function AppModal({ app, onClose }: { app: SparkApp | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (app && !el.open) {
      el.showModal();
      /* showModal() focuses the first control it finds, which is the close
         button, and Chrome paints a focus ring for that even when the modal
         was opened with the mouse. autofocus on the dialog is not honoured
         here, so take the focus explicitly: the dialog is tabindex="-1" and
         globals.css draws no ring for those, and tabbing from it still
         reaches every control in order. */
      el.focus();
    } else if (!app && el.open) el.close();
  }, [app]);

  const primary = app ? primaryLink(app) : undefined;
  const secondary = app ? app.links.filter((l) => l !== primary) : [];

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
      data-app-modal
      aria-labelledby="app-modal-title"
      // Focused on open in place of the close button; see the effect above.
      tabIndex={-1}
      className="m-auto w-[min(92vw,32rem)] overflow-hidden rounded-2xl border border-white/10 bg-gray-900/95 p-0 text-gray-100 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {app && (
        <div className="flex flex-col sm:flex-row">
          {/* Just the mark. No plate, no tinted panel, no blurred bloom
              behind it: the icons are already rounded artwork with their own
              background, and wrapping each one in a second surface read as a
              sticker on a card rather than as the app's own mark. */}
          <div className="flex shrink-0 items-center justify-center pt-6 pb-2 sm:p-6 sm:pr-0">
            <Image
              src={app.icon}
              alt={app.name}
              width={256}
              height={256}
              // Eager: Next lazy-loads by default and a <dialog> in the top
              // layer never fires the observer that would have loaded it.
              loading="eager"
              className="h-28 w-28 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] sm:h-32 sm:w-32"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col p-5">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h2
                  id="app-modal-title"
                  className="font-semibold text-base text-white leading-tight"
                >
                  {app.name}
                </h2>
                <p className="text-[12px] text-gray-500 leading-tight">{app.tagline}</p>
              </div>
              <CloseButton onClick={onClose} />
            </div>

            <p className="mt-3 text-[13px] text-gray-300 leading-relaxed">{app.description}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
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

            <div className="mt-5 flex flex-col gap-2 pt-1">
              {primary && (
                <a
                  href={primary.url}
                  {...(/^https?:\/\//.test(primary.url)
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-500/90 px-3.5 py-2.5 font-medium text-[13px] text-white transition-colors hover:bg-blue-400"
                >
                  {/* A relative link is an on-site privacy policy, not a
                      site, so it keeps its own label rather than being
                      announced as somewhere to visit. */}
                  {/^https?:\/\//.test(primary.url)
                    ? (CTA_LABEL[primary.type] ?? primary.label)
                    : primary.label}
                  <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0" />
                </a>
              )}

              {/* Icon only, and only as wide as the glyph. Real destinations,
                  but never the one being asked for. */}
              {secondary.length > 0 && (
                <div className="flex items-center justify-center gap-1.5">
                  {secondary.map((link) => {
                    const Icon = linkIcons[link.type] ?? ExternalLink;
                    const external = /^https?:\/\//.test(link.url);
                    return (
                      <a
                        key={link.url}
                        href={link.url}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        title={link.label}
                        aria-label={link.label}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
