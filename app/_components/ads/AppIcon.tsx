'use client';

import { useState } from 'react';
import type { Ad } from './ads';

/**
 * An advertised app's logo, with a monogram to fall back on.
 *
 * This used to point at `/apps/{id}.png`, a directory that has never existed,
 * so all four cards had been quietly drawing lettermarks since the section
 * shipped. The icon now comes from the advertiser's own site, resolved by
 * `/api/app-icon` -- spark-pay's ladder of `/apple-touch-icon.png`,
 * `/favicon.png`, `/icon.png`, `/favicon.ico`, then Google's cache.
 *
 * The monogram is still here and still earns its place: a domain can be down,
 * and Google's fallback is a generic globe that the route rejects on size.
 */
export function AppIcon({
  ad,
  iconUrl,
  themeColor,
  size = 32,
}: {
  ad: Ad;
  iconUrl?: string | null;
  themeColor?: string | null;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!iconUrl || failed) {
    return (
      <span
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          // Once the colour is known the monogram wears it too, so an icon that
          // loads and then breaks does not also change the card's palette.
          ...(themeColor && { color: themeColor, borderColor: `${themeColor}40` }),
        }}
        className={`flex flex-shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.04] font-bold text-[11px] ${themeColor ? '' : ad.accent}`}
      >
        {ad.monogram}
      </span>
    );
  }

  return (
    // biome-ignore lint/performance/noImgElement: third-party favicon from an arbitrary host; next/image would need every advertiser's domain in remotePatterns
    <img
      src={iconUrl}
      alt=""
      width={size}
      height={size}
      draggable={false}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="flex-shrink-0 select-none rounded-md object-contain"
      style={{ width: size, height: size }}
    />
  );
}
