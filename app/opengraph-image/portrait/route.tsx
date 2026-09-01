import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import {
  ICON_PATHS,
  darken,
  ensureContrast,
  getImageColor,
  hasTransparentBg,
  loadFonts,
  loadImageAsDataUrl,
  loadImageWithShadow,
  luminance,
  nextMascot,
  ogAsset,
  ogConfig as OG,
} from '@/lib/og';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Portrait 1080x1920 card for short-form video backgrounds.
 *
 * Not a crop of the 1200x630 OG card: at 9:16 the landscape card fills
 * only a third of the frame and the feature pills drop to roughly 12px
 * of text. This is a dedicated stacked layout so every element stays
 * legible at thumbnail size.
 *
 * GET /opengraph-image/portrait
 */

const SIZE = { width: 1080, height: 1920 };

/** Usable text width: frame padding (24*2) + card padding (40*2). */
const TEXT_W = SIZE.width - 48 - 80;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function splitTagline(t: string) {
  const idx = t.indexOf(', ');
  if (idx === -1) return { line1: t, line2: '' };
  return { line1: t.slice(0, idx + 1), line2: t.slice(idx + 2) };
}

/**
 * Shrink the headline until both lines fit on one line each. The two-line
 * split from splitTagline() is deliberate, so the headline must never
 * re-wrap on its own. 0.62 is a conservative average char width for Sora
 * Bold at this size.
 */
function autoFontSize(line1: string, line2: string) {
  const fit1 = Math.floor(TEXT_W / (line1.length * 0.62));
  const fit2 = line2 ? Math.floor(TEXT_W / (line2.length * 0.62)) : fit1;
  return Math.min(76, fit1, fit2);
}

/**
 * Feature pills, greedily packed into as many rows as needed to stay
 * within the card width, rather than a hard-coded row split that would
 * silently clip pills if the feature list grows.
 */
const PILL_CHROME = 28 + 12 + 44; // icon width + icon-label gap + horizontal padding
const PILL_CHAR_W = 13; // conservative avg char width for 24px Sora Bold
const PILL_GAP = 16;

function pillRows<T extends { label: string }>(features: readonly T[]): T[][] {
  const rows: T[][] = [];
  let row: T[] = [];
  let rowWidth = 0;
  for (const f of features) {
    const w = f.label.length * PILL_CHAR_W + PILL_CHROME;
    const withGap = row.length ? w + PILL_GAP : w;
    if (row.length && rowWidth + withGap > TEXT_W) {
      rows.push(row);
      row = [f];
      rowWidth = w;
    } else {
      row.push(f);
      rowWidth += withGap;
    }
  }
  if (row.length) rows.push(row);
  return rows;
}

/** Resolve a path relative to app/. */
function appAsset(relativePath: string) {
  return join(process.cwd(), 'app', relativePath);
}

export async function GET() {
  const { line1, line2 } = splitTagline(pick(OG.taglines));
  const mascot = nextMascot();
  const hasMascot = mascot !== '';
  const headlineSize = autoFontSize(line1, line2);

  const mascotPath = hasMascot ? ogAsset(mascot) : '';
  const faviconPath = appAsset(OG.favicon);

  const brandFontPath = ogAsset('fonts', OG.fonts.brand.file);
  const [fonts, brandFontBuf, edgeBg, ctaColor, faviconSrc, transparent, mascotSrc] =
    await Promise.all([
      loadFonts(OG.fonts.heading.file, OG.fonts.body.file),
      readFile(brandFontPath),
      hasMascot ? getImageColor(mascotPath, 'edge') : Promise.resolve(''),
      getImageColor(faviconPath, 'dominant'),
      loadImageWithShadow(faviconPath, 180),
      hasMascot ? hasTransparentBg(mascotPath) : Promise.resolve(false),
      hasMascot ? loadImageAsDataUrl(mascotPath) : Promise.resolve(''),
    ]);

  const brandFontData = brandFontBuf.buffer.slice(
    brandFontBuf.byteOffset,
    brandFontBuf.byteOffset + brandFontBuf.byteLength,
  );
  const bg = !hasMascot ? darken(ctaColor, 0.15) : transparent ? ctaColor : edgeBg;

  const hFont = OG.fonts.heading.family;
  const bFont = OG.fonts.body.family;
  const brandFont = OG.fonts.brand.family;

  // Same two-tone palette rules as the landscape card.
  const light = luminance(bg) > 100;
  // The badge ships in two art variants; which one reads on the card
  // depends on the background, which is only settled here.
  const badgeSrc = OG.badge
    ? await loadImageWithShadow(ogAsset(light ? OG.badgeOnLight : OG.badge), 200)
    : '';
  const veryLight = luminance(bg) > 200;
  const rawAccent = light ? darken(ctaColor, 0.55) : ctaColor;
  const accentColor = ensureContrast(rawAccent, bg);
  const textColor = light ? accentColor : '#f5f5f5';
  const mutedColor = light ? darken(accentColor, 0.7) : 'rgba(245,245,245,0.6)';
  const brandShadow = light
    ? '0 2px 12px rgba(0,0,0,0.25)'
    : '0 2px 12px rgba(0,0,0,0.5)';

  const APP_PURPLE = '#818cf8';
  const brandNameColor = veryLight ? APP_PURPLE : 'white';
  const taglineLine2Color = veryLight ? APP_PURPLE : 'white';
  const frameBg = darken(bg, 0.25);

  return new ImageResponse(
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: 24,
        backgroundColor: frameBg,
        fontFamily: bFont,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '72px 40px',
          color: textColor,
          backgroundColor: bg,
          borderRadius: 48,
        }}
      >
        {/* Top: brand lockup + AI badge, all on one row.
            Deliberately larger than a proportional scale of the
            landscape header: at 9:16 this is read as a thumbnail. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
          }}
        >
          <img
            src={faviconSrc}
            width={200}
            height={200}
            style={{ margin: -24, objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 92,
                fontWeight: 700,
                fontFamily: brandFont,
                color: brandNameColor,
                textShadow: brandShadow,
              }}
            >
              {OG.name.replaceAll('-', ' ')}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 38,
                color: veryLight ? darken(APP_PURPLE, 0.7) : '#f5f5f5',
                textShadow: brandShadow,
              }}
            >
              {OG.url}
            </div>
          </div>
          {OG.badge ? (
            <img
              src={badgeSrc}
              width={168}
              height={168}
              style={{ margin: -16, objectFit: 'contain' }}
            />
          ) : null}
        </div>
        {/* Same lockup as the landscape card, scaled for 9:16. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            marginTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 700,
              fontFamily: hFont,
              color: mutedColor,
            }}
          >
            Works with Claude
          </span>
          <svg
            width={116}
            height={116}
            viewBox="0 0 24 24"
            fill="none"
            stroke={textColor}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICON_PATHS.mcp.map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
        </div>

        {/* Middle: mascot above tagline, both centred */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 48,
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {hasMascot && (
            <img
              src={mascotSrc}
              style={{ width: 864, maxHeight: 780, objectFit: 'contain' }}
            />
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: headlineSize,
                fontWeight: 700,
                lineHeight: 1.15,
                fontFamily: hFont,
                color: accentColor,
                whiteSpace: 'nowrap',
              }}
            >
              {line1}
            </span>
            {line2 && (
              <span
                style={{
                  fontSize: headlineSize,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  fontFamily: hFont,
                  color: taglineLine2Color,
                  whiteSpace: 'nowrap',
                }}
              >
                {line2}
              </span>
            )}
          </div>
          {/* CTA row. The subtext is scaled well above its landscape
              ratio: proportional scaling would leave it unreadable
              once the card is a phone-sized thumbnail. Wraps onto its
              own line rather than clipping at the card edge -- cta and
              socialProof are copy-configurable and not guaranteed to
              fit one row at this font size. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              maxWidth: TEXT_W,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                backgroundColor: accentColor,
                padding: '28px 64px',
                borderRadius: 99,
                fontSize: 44,
                fontWeight: 700,
                fontFamily: hFont,
                color: 'white',
              }}
            >
              {OG.cta}
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <span
              style={{
                fontSize: 34,
                color: textColor,
                whiteSpace: 'nowrap',
              }}
            >
              {OG.socialProof}
            </span>
          </div>
        </div>

        {/* Bottom: feature pills, packed into as many rows as the
            feature list needs. See pillRows() above. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          {pillRows(OG.features).map((row) => (
            <div
              key={row.map((f) => f.label).join()}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {row.map(({ label, icon, color }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    backgroundColor: color,
                    padding: '14px 22px',
                    borderRadius: 99,
                    fontSize: 24,
                    fontWeight: 700,
                    fontFamily: hFont,
                    color: 'white',
                  }}
                >
                  <svg
                    width={28}
                    height={28}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {(ICON_PATHS[icon] ?? []).map((d, i) => (
                      <path key={`${icon}-${i}`} d={d} />
                    ))}
                  </svg>
                  <span style={{ lineHeight: 1 }}>{label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...SIZE,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
      fonts: [
        { name: hFont, data: fonts.heading, weight: 700, style: 'normal' as const },
        { name: bFont, data: fonts.body, weight: 400, style: 'normal' as const },
        { name: brandFont, data: brandFontData, weight: 700, style: 'normal' as const },
      ],
    },
  );
}
