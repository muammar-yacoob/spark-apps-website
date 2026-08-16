'use client';

import { ArrowUpRight, Megaphone, Sparkles } from 'lucide-react';
import { AppIcon } from './AppIcon';
import { AD_ENTRY_PRICE, AD_PRICING_URL, type Ad } from './ads';
import { useAppIcon } from './useAppIcon';

/**
 * The two cards the carousel draws: an advertised app, and the slot for sale.
 *
 * Both keep the surface recipe the rest of the site uses -- a hairline
 * border on a barely-lifted panel -- so the section reads as part of the page
 * rather than as an ad unit bolted onto it. `h-full` on both, because a flex
 * track sizes every card to the tallest one and a short card with a floating
 * footer looks broken next to a tall one.
 *
 * At rest a card is an icon, a name and four words. The describing sentence was
 * always on screen, which made four adverts the tallest block on the page
 * and put them between the figures and everything below. It opens on hover
 * instead, so the section is compact until somebody shows an interest in it.
 */

const SURFACE =
  'group relative flex h-full flex-col rounded-lg border p-3 transition-all duration-200 hover:-translate-y-0.5';

export function AdCard({ ad, onOpen }: { ad: Ad & { paid?: boolean }; onOpen?: () => void }) {
  const { data } = useAppIcon(ad.domain, ad.paid);
  const themeColor = data?.themeColor ?? null;

  return (
    <a
      href={ad.url}
      target="_blank"
      rel="noopener noreferrer"
      // Dragging the carousel must not also open the advertiser's site. The
      // native link drag is what puts a ghost of the href under the cursor.
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      // The click beacon, when the network is listening. The navigation is a
      // new tab, so nothing races the count.
      onClick={onOpen}
      className={`${SURFACE} overflow-hidden border-white/[0.08] bg-gray-900/40 hover:border-white/[0.14] hover:bg-white/[0.03]`}
    >
      {/*
       * A wash of the app's own colour, behind its own card.
       *
       * Barely there on purpose -- these sit in a row above the footer, and
       * several saturated panels would be a billboard. It is enough to tell
       * them apart at a glance, and it lifts on hover so the card still has
       * somewhere to go when the pointer arrives.
       */}
      {themeColor && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] transition-opacity duration-200 group-hover:opacity-[0.13]"
          style={{
            background: `radial-gradient(120% 100% at 0% 0%, ${themeColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Name over tagline, both beside the icon. */}
      <div className="relative flex items-center gap-3">
        <AppIcon ad={ad} iconUrl={data?.iconUrl} themeColor={themeColor} size={44} />
        <span className="min-w-0 flex-1">
          <span
            className={`block truncate font-semibold text-[15px] transition-colors ${themeColor ? '' : ad.accent}`}
            style={themeColor ? { color: themeColor } : undefined}
          >
            {ad.name}
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-gray-500">{ad.tagline}</span>
        </span>
        <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-400" />
      </div>

      {/* Held back until the pointer arrives -- see AdCard header note. */}
      <div className="relative grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out group-hover:grid-rows-[1fr] motion-reduce:grid-rows-[1fr]">
        <p className="overflow-hidden text-gray-400 text-xs leading-relaxed">
          <span className="block pt-2">{ad.body}</span>
        </p>
      </div>
    </a>
  );
}

/**
 * The empty slot.
 *
 * Dashed rather than solid, so it reads as a gap waiting to be filled instead
 * of as a fifth product. The price quoted is whatever is genuinely purchasable
 * on the other end -- see AD_ENTRY_PRICE.
 */
export function AdSlotCard() {
  return (
    <a
      href={AD_PRICING_URL}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className={`${SURFACE} overflow-hidden border-blue-400/30 border-dashed bg-blue-950/20 hover:border-blue-400/60 hover:bg-blue-950/40 hover:shadow-blue-400/10 hover:shadow-lg`}
    >
      <span
        aria-hidden="true"
        className="-right-[42px] pointer-events-none absolute top-[14px] w-[140px] rotate-45 border-blue-200/50 border-t border-b border-b-blue-700/50 bg-gradient-to-b from-blue-300 to-blue-500 py-1.5 text-center font-bold text-[10px] text-blue-950 uppercase tracking-wider shadow-black/40 shadow-lg"
      >
        1 slot left
      </span>

      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-blue-400/30 bg-blue-400/10 text-blue-400 transition-transform duration-200 group-hover:scale-105"
        >
          <Megaphone className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-[15px] text-blue-400 transition-colors group-hover:text-blue-300">
            Your app here
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-[11px] text-blue-200/60">
            <Sparkles className="h-3 w-3 flex-shrink-0" />
            From {AD_ENTRY_PRICE}
          </span>
        </span>
      </div>
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out group-hover:grid-rows-[1fr] motion-reduce:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <p className="pt-2 text-gray-400 text-xs leading-relaxed">
            Your app in this carousel, on every site in the Spark network, during your hour. Every
            day, for a month.
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 font-semibold text-blue-400 text-xs transition-colors group-hover:text-blue-300">
            See pricing
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </a>
  );
}
