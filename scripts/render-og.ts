/**
 * Render the OG card to a PNG on disk, without booting Next.
 *
 * `bun scripts/render-og.ts [out.png]`
 *
 * The route's default export is an ordinary async function returning an
 * ImageResponse, so it can be called directly. Useful for eyeballing a change
 * to the icon, the palette or the badge row.
 */

import { writeFile } from 'node:fs/promises';
import Image from '@/app/opengraph-image';

const out = process.argv[2] ?? 'og-preview.png';

const res = await Image();
await writeFile(out, Buffer.from(await res.arrayBuffer()));

console.log(`wrote ${out}`);
