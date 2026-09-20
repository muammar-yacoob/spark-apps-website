import type { NextConfig } from 'next';
import pkg from './package.json';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  devIndicators: false,
  outputFileTracingIncludes: {
    '/opengraph-image': ['./lib/og/res/**/*', './app/favicon.png'],
    '/twitter-image': ['./lib/og/res/**/*', './app/favicon.png'],
    // The per-app card reads each app's icon off disk for its colour and its
    // artwork. public/ is served by the CDN and is NOT in the function's
    // filesystem unless it is traced, so without this the card rendered with
    // the icon missing and the fallback background.
    '/apps/[slug]/opengraph-image': ['./lib/og/res/**/*', './public/imgs/apps/**/*'],
  },
  headers: async () => [
    {
      source: '/llms.txt',
      headers: [
        { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
        { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
      ],
    },
    {
      source: '/llms-full.txt',
      headers: [
        { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
        { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
      ],
    },
    {
      source: '/.well-known/security.txt',
      headers: [
        { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
        { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
      ],
    },
    {
      source: '/opensearch.xml',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' }],
    },
  ],
};

export default nextConfig;
