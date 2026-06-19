export interface PlatformDims {
	width: number;
	height: number;
	label: string;
}

/**
 * Platforms that support auto-generated image content.
 * Key = platform connection key (matches platform_connections.platformName).
 *
 * Dimensions follow each platform's recommended single-image post ratio.
 * Platforms sharing width+height are rendered once via groupByDimensions().
 */
export const PLATFORM_DIMS: Record<string, PlatformDims> = {
	twitter: { width: 1200, height: 675, label: "X / Twitter" },
	reddit: { width: 1200, height: 628, label: "Reddit" },
	linkedin: { width: 1200, height: 627, label: "LinkedIn" },
	instagram: { width: 1080, height: 1080, label: "Instagram" },
	threads: { width: 1080, height: 1080, label: "Threads" },
	tiktok: { width: 1080, height: 1920, label: "TikTok" },
	youtube: { width: 1080, height: 1920, label: "YouTube Shorts" },
	bluesky: { width: 1200, height: 675, label: "Bluesky" },
	pinterest: { width: 1000, height: 1500, label: "Pinterest" },
};

/** All platform keys that support content generation */
export const CONTENT_GEN_PLATFORMS = Object.keys(PLATFORM_DIMS);

// ─── Dimension grouping ──────────────────────────────────────────────────────

/** Dimension key for grouping, e.g. "1200x675" */
type DimKey = string;

function dimKey(d: PlatformDims): DimKey {
	return `${d.width}x${d.height}`;
}

export interface DimGroup {
	key: DimKey;
	width: number;
	height: number;
	platforms: string[]; // platform keys sharing this dimension
}

/**
 * Group a list of platform keys by their shared image dimensions.
 * Platforms with identical width+height share one rendered image.
 */
export function groupByDimensions(platformKeys: string[]): DimGroup[] {
	const map = new Map<DimKey, DimGroup>();

	for (const key of platformKeys) {
		const dims = PLATFORM_DIMS[key];
		if (!dims) continue;
		const dk = dimKey(dims);
		const existing = map.get(dk);
		if (existing) {
			existing.platforms.push(key);
		} else {
			map.set(dk, {
				key: dk,
				width: dims.width,
				height: dims.height,
				platforms: [key],
			});
		}
	}

	return [...map.values()];
}
