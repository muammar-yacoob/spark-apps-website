/**
 * Fetch + cache Inter font files for Satori rendering.
 * Uses Google Fonts CDN. Module-level cache avoids re-fetching.
 */

let fontCache: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;
let overlayFontCache: { bold: ArrayBuffer } | null = null;

async function fetchGoogleFont(
	family: string,
	weight: number,
): Promise<ArrayBuffer> {
	const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
	const css = await (await fetch(url)).text();
	const match = css.match(/src:\s*url\(([^)]+)\)/);
	if (!match?.[1])
		throw new Error(`Failed to parse font URL for ${family}@${weight}`);
	return fetch(match[1]).then((r) => r.arrayBuffer());
}

async function fetchFont(weight: number): Promise<ArrayBuffer> {
	return fetchGoogleFont("Inter", weight);
}

export async function getFonts() {
	if (fontCache) return fontCache;
	const [regular, bold] = await Promise.all([fetchFont(400), fetchFont(700)]);
	fontCache = { regular, bold };
	return fontCache;
}

export function getSatoriFont() {
	return getFonts().then(({ regular, bold }) => [
		{ name: "Inter", data: regular, weight: 400 as const },
		{ name: "Inter", data: bold, weight: 700 as const },
	]);
}

/** Poppins bold for AI image text overlays (more modern, bolder). */
export async function getOverlayFont() {
	if (overlayFontCache) return overlayFontCache;
	const bold = await fetchGoogleFont("Poppins", 700);
	overlayFontCache = { bold };
	return overlayFontCache;
}

/** Montserrat Black for video karaoke captions (TikTok/Instagram style). */
let captionFontCache: ArrayBuffer | null = null;
async function getCaptionFont() {
	if (captionFontCache) return captionFontCache;
	captionFontCache = await fetchGoogleFont("Montserrat", 900);
	return captionFontCache;
}

export function getSatoriCaptionFont() {
	return getCaptionFont().then((data) => [
		{ name: "Montserrat", data, weight: 900 as const },
	]);
}
