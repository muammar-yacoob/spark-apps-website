/**
 * Portable colour utilities for OG image generation.
 * Zero project dependencies -- safe to copy into any project.
 */

// ── Conversions ───────────────────────────────────────────────────────

export function hexToRgb(hex: string): [number, number, number] {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    const tt = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

// ── Manipulation ──────────────────────────────────────────────────────

/** Darken a hex colour by a factor (0-1). */
export function darken(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(Math.round(r * factor), Math.round(g * factor), Math.round(b * factor));
}

/** Perceived brightness (0-255) of a hex colour. */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/** WCAG relative luminance (0-1). */
function relLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Adjust `fg` lightness until it meets `minRatio` WCAG contrast against `bg`.
 * Preserves the original hue and saturation -- only lightness shifts.
 */
export function ensureContrast(fg: string, bg: string, minRatio = 3.5): string {
  const bgRel = relLuminance(bg);
  const [h, s] = rgbToHsl(...hexToRgb(fg));
  let l = rgbToHsl(...hexToRgb(fg))[2];
  const goDown = bgRel > 0.2;

  for (let i = 0; i < 25; i++) {
    const candidate = rgbToHex(...hslToRgb(h, s, Math.max(0, Math.min(1, l))));
    const fgRel = relLuminance(candidate);
    const hi = Math.max(fgRel, bgRel);
    const lo = Math.min(fgRel, bgRel);
    if ((hi + 0.05) / (lo + 0.05) >= minRatio) return candidate;
    l += goDown ? -0.04 : 0.04;
  }
  // Extreme fallback keeps the hue tint
  return rgbToHex(...hslToRgb(h, s * 0.3, goDown ? 0.08 : 0.92));
}
