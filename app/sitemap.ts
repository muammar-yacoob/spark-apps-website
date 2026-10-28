import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config/site';

/* No per-app URLs here. The apps are listed on the landing page and each one
   links straight out to wherever it actually lives, so there is nothing of
   ours at /apps/<id> to crawl. The privacy policies below are real pages and
   are linked from live store listings, so they stay. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();

  const privacy: MetadataRoute.Sitemap = ['bumboo', 'minutely', 'pitchplease', 'screenful'].map(
    (id) => ({
      url: `${base}/apps/${id}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    })
  );

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...privacy,
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];
}
