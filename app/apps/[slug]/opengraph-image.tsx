import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/config/site';
import { getApp } from '@/lib/data/apps';
import {
  darken,
  ensureContrast,
  getImageColor,
  loadFonts,
  loadImageWithShadow,
  luminance,
  ogConfig as OG,
} from '@/lib/og';

/**
 * The share card for one app's page.
 *
 * These pages had no og:image at all: generateMetadata sets `openGraph`
 * without images, which overrides the root app/opengraph-image.tsx instead of
 * inheriting it, so every share of an app page -- the fallback homepage for
 * apps with no site of their own -- was a bare link. Sellular's health check
 * on /apps/fullhouse is what surfaced it.
 *
 * Deliberately not a copy of the root card. That one sells the portfolio, with
 * mascots and feature pills; this one has one job, which is to say which app
 * this is, in its own colour.
 */

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE_NAME} app`;

function publicAsset(relativePath: string) {
  return join(process.cwd(), 'public', relativePath);
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApp(slug);

  const iconPath = publicAsset(app?.icon ?? '/favicon.png');
  const [fonts, accent, iconSrc] = await Promise.all([
    loadFonts(OG.fonts.heading.file, OG.fonts.body.file),
    // The app's own icon decides the background, so two apps never share a
    // card, and the colour is the one people already associate with it.
    getImageColor(iconPath, 'dominant').catch(() => '#111827'),
    loadImageWithShadow(iconPath, 200).catch(() => ''),
  ]);

  const bg = darken(accent, 0.55);
  const light = luminance(bg) > 100;
  const ink = light ? '#0b0f14' : '#f5f5f5';
  const muted = light ? 'rgba(11,15,20,0.72)' : 'rgba(245,245,245,0.72)';
  const badge = ensureContrast(accent, bg);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 56,
        padding: '0 80px',
        background: `linear-gradient(135deg, ${bg} 0%, ${darken(bg, 0.35)} 100%)`,
        fontFamily: OG.fonts.body.family,
      }}
    >
      {iconSrc ? (
        // biome-ignore lint/performance/noImgElement: Satori renders this, not a browser
        <img src={iconSrc} width={220} height={220} alt="" style={{ borderRadius: 44 }} />
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 740 }}>
        <div
          style={{
            fontSize: 26,
            color: badge,
            fontFamily: OG.fonts.heading.family,
            letterSpacing: 1,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 76,
            lineHeight: 1.05,
            marginTop: 10,
            color: ink,
            fontFamily: OG.fonts.heading.family,
          }}
        >
          {app?.name ?? SITE_NAME}
        </div>
        <div style={{ fontSize: 34, marginTop: 18, color: muted }}>{app?.tagline ?? ''}</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: OG.fonts.heading.family, data: fonts.heading, weight: 700, style: 'normal' },
        { name: OG.fonts.body.family, data: fonts.body, weight: 400, style: 'normal' },
      ],
    }
  );
}
