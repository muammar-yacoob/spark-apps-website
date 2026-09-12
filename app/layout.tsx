import type { Metadata, Viewport } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, THEME_COLOR } from '@/lib/config/site';
import { seoConfig } from '@/lib/seo/config';
import './globals.css';
import { CookieConsent } from '@/lib/cookie-kit/CookieConsent';
import { NavigationLoader } from './_components/feedback/NavigationLoader';
import { ServiceWorkerRegistrar } from './_components/ServiceWorkerRegistrar';
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

// SparkBrain chat widget key, DEV ONLY. spark-apps.co is a registered domain,
// so production authenticates by Origin and needs no key -- and must not send
// one: a key present takes priority over the Origin check, so a stale value
// 403s /api/widget/init and the widget vanishes instead of falling back. It
// would also publish a spendable key in the page source. Only localhost lacks
// a registered Origin. NODE_ENV is inlined at build time, so this is undefined
// in a production bundle and the data-api-key attribute below drops out.
const CHAT_API_KEY =
  process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_CHAT_API_KEY : undefined;

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
        <CookieConsent
          scripts={[
            {
              src: 'https://sparkbrain.app/chat.js',
              attrs: {
                'data-domain': 'spark-apps.co',
                ...(CHAT_API_KEY ? { 'data-api-key': CHAT_API_KEY } : {}),
              },
            },
          ]}
          cookieName="spark_apps_website_consent"
          accent="#3b82f6"
          privacyUrl="/privacy"
          message="Essential cookies keep this site working. Accepting also loads optional third-party services."
        />
      </body>
    </html>
  );
}
