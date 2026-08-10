import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config/site';
import { sparkApps } from '@/lib/data/apps';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();

  const apps: MetadataRoute.Sitemap = sparkApps.map((app) => ({
    url: `${base}/apps/${app.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...apps,
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/team`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];
}
