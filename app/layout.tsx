import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, THEME_COLOR } from '@/lib/config/site';
import { seoConfig } from '@/lib/seo/config';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerRegistrar } from './_components/ServiceWorkerRegistrar';
import { NavigationLoader } from './_components/feedback/NavigationLoader';
import { JsonLd } from './_components/seo/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  manifest: '/manifest.json',
  title: {
    default: `${SITE_NAME} - ${seoConfig.tagline}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: seoConfig.keywords,
  authors: [{ name: SITE_NAME }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} - ${seoConfig.tagline}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - ${seoConfig.tagline}`,
    description: SITE_DESCRIPTION,
    images: ['/twitter-image'],
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'text/plain': '/llms.txt',
    },
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': SITE_NAME,
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: THEME_COLOR,
};

const IS_PROD = process.env.NODE_ENV === 'production';
const CHAT_WIDGET_URL = process.env.NEXT_PUBLIC_CHAT_WIDGET_URL;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          href="/opensearch.xml"
          title={SITE_NAME}
        />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>
        <JsonLd />
        <ServiceWorkerRegistrar />
        <NavigationLoader>{children}</NavigationLoader>
        {IS_PROD && CHAT_WIDGET_URL && <script src={CHAT_WIDGET_URL} />}
      </body>
    </html>
  );
}
