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
export const alt = `${OG.name} - ${OG.url}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// ── Helpers ─────────────────────────────────────────────────────────────

const PADDING = 40 * 2;
const MASCOT_W = 500;
const GAP = 24;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function splitTagline(t: string) {
  const idx = t.indexOf(', ');
  if (idx === -1) return { line1: t, line2: '' };
  return { line1: t.slice(0, idx + 1), line2: t.slice(idx + 2) };
}

function autoFontSize(line1: string, line2: string, hasMascot: boolean) {
  const textW = size.width - PADDING - (hasMascot ? MASCOT_W + GAP : 0);
  // 0.65 avg char width for Sora Bold - conservative to guarantee no wrapping
  const fit1 = Math.floor(textW / (line1.length * 0.65));
  const fit2 = line2 ? Math.floor(textW / (line2.length * 0.65)) : fit1;
  return Math.min(56, Math.min(fit1, fit2));
}


/** Resolve a path relative to app/. */
function appAsset(relativePath: string) {
  return join(process.cwd(), 'app', relativePath);
}

// ── Render ──────────────────────────────────────────────────────────────

export default async function Image() {
  const { line1, line2 } = splitTagline(pick(OG.taglines));
  const mascot = nextMascot();
  const hasMascot = mascot !== '';
  const fontSize = autoFontSize(line1, line2, hasMascot);

  const mascotPath = hasMascot ? ogAsset(mascot) : '';
  const faviconPath = appAsset(OG.favicon);
  const badgePath = OG.badge ? ogAsset(OG.badge) : '';

  const brandFontPath = ogAsset('fonts', OG.fonts.brand.file);
  const [fonts, brandFontBuf, edgeBg, ctaColor, faviconSrc, badgeSrc, transparent, mascotSrc] =
    await Promise.all([
      loadFonts(OG.fonts.heading.file, OG.fonts.body.file),
      readFile(brandFontPath),
      hasMascot ? getImageColor(mascotPath, 'edge') : Promise.resolve(''),
      getImageColor(faviconPath, 'dominant'),
      loadImageWithShadow(faviconPath, 80),
      loadImageWithShadow(badgePath, 96),
      hasMascot ? hasTransparentBg(mascotPath) : Promise.resolve(false),
      hasMascot ? loadImageAsDataUrl(mascotPath) : Promise.resolve(''),
    ]);
  const brandFontData = brandFontBuf.buffer.slice(brandFontBuf.byteOffset, brandFontBuf.byteOffset + brandFontBuf.byteLength);
  const bg = !hasMascot ? darken(ctaColor, 0.15) : transparent ? ctaColor : edgeBg;

  const hFont = OG.fonts.heading.family;
  const bFont = OG.fonts.body.family;
  const brandFont = OG.fonts.brand.family;

  // Two-tone palette: favicon accent vs whitesmoke, picked by bg brightness
  const light = luminance(bg) > 100;
  const veryLight = luminance(bg) > 200;
  const rawAccent = light ? darken(ctaColor, 0.55) : ctaColor;
  const accentColor = ensureContrast(rawAccent, bg);
  const textColor = light ? accentColor : '#f5f5f5';
  const mutedColor = light ? darken(accentColor, 0.7) : 'rgba(245,245,245,0.6)';
  const brandShadow = light
    ? '0 2px 12px rgba(0,0,0,0.25)'
    : '0 2px 12px rgba(0,0,0,0.5)';

  // On near-white backgrounds, swap brand name + tagline line2 to app purple
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
        padding: 16,
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
        justifyContent: 'space-between',
        padding: '32px 40px',
        color: textColor,
        backgroundColor: bg,
        borderRadius: 24,
      }}
    >
      {/* Top: brand + optional badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src={faviconSrc} width={108} height={108} style={{ margin: -14 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                fontSize: 40,
                fontWeight: 700,
                fontFamily: brandFont,
                textShadow: brandShadow,
              }}
            >
              <span style={{ color: brandNameColor }}>{OG.name.replaceAll('-', ' ')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 20, color: veryLight ? darken(APP_PURPLE, 0.7) : '#f5f5f5', textShadow: brandShadow }}>
              {OG.url.split('.').map((part, i, arr) => (
                <span key={part} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && (
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: brandNameColor,
                      margin: '0 2px',
                      marginTop: 10,
                    }} />
                  )}
                  {part}
                </span>
              ))}
            </div>
          </div>
        </div>
        {OG.badge ? (
          <img src={badgeSrc} width={124} height={124} style={{ margin: -14 }} />
        ) : null}
      </div>

      {/* Middle: tagline + CTA + mascot */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: GAP }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{ fontSize, fontWeight: 700, lineHeight: 1.15, fontFamily: hFont, color: accentColor, whiteSpace: 'nowrap' }}>
            {line1}
          </span>
          {line2 && (
            <span style={{ fontSize, fontWeight: 700, lineHeight: 1.15, fontFamily: hFont, color: taglineLine2Color, whiteSpace: 'nowrap' }}>
              {line2}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: accentColor, padding: '12px 28px', borderRadius: 99, fontSize: 20, fontWeight: 700, fontFamily: hFont, color: 'white' }}>
              {OG.cta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <span style={{ fontSize: 13, color: mutedColor, whiteSpace: 'nowrap' }}>{OG.socialProof}</span>
          </div>
        </div>
        {hasMascot && (
          <img src={mascotSrc} style={{ height: '100%', maxWidth: 500, objectFit: 'contain' }} />
        )}
      </div>

      {/* Bottom: feature pills + domain */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {OG.features.map(({ label, icon, color }) => {
            const pillBg = color;
            const ptc = 'white';
            return (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: pillBg,
                  padding: '6px 14px',
                  borderRadius: 99,
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: hFont,
                  color: ptc,
                }}
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={ptc}
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
            );
          })}
        </div>
      </div>
    </div>
    </div>,
    {
      ...size,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
      fonts: [
        { name: hFont, data: fonts.heading, weight: 700, style: 'normal' as const },
        { name: bFont, data: fonts.body, weight: 400, style: 'normal' as const },
        { name: brandFont, data: brandFontData, weight: 700, style: 'normal' as const },
      ],
    }
  );
}
