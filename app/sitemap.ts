import { SITE_URL } from '@/lib/config/site';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];
}
