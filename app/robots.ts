import { SITE_URL } from '@/lib/config/site';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL;
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/privacy', '/terms', '/contact', '/llms.txt', '/llms-full.txt'],
        disallow: ['/dashboard/', '/api/', '/error'],
      },
      // AI retrieval crawlers (search/citation)
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      // AI training crawlers
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      // Block low-value scrapers
      { userAgent: 'Bytespider', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
