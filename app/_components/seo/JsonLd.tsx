import { seoConfig } from '@/lib/seo/config';

/** Builds the JSON-LD @graph for the homepage. */
function buildHomepageJsonLd() {
  const {
    name,
    url,
    description,
    supportEmail,
    features,
    pricing,
    applicationCategory,
    datePublished,
  } = seoConfig;

  const today = new Date().toISOString().split('T')[0];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name,
        url,
        applicationCategory,
        operatingSystem: 'Web',
        description,
        offers: pricing.map((tier) => ({
          '@type': 'Offer',
          name: tier.name,
          price: tier.price,
          priceCurrency: tier.currency,
          description: tier.description,
        })),
        featureList: features,
        screenshot: `${url}/opengraph-image`,
      },
      {
        '@type': 'WebPage',
        '@id': `${url}/#webpage`,
        url,
        name: `${name} - ${description}`,
        datePublished,
        dateModified: today,
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '.hero-description', '.feature-card'],
        },
      },
      {
        '@type': 'Organization',
        name,
        url,
        logo: `${url}/favicon.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          email: supportEmail,
          contactType: 'customer support',
          url: `${url}/contact`,
        },
      },
      {
        '@type': 'WebSite',
        name,
        url,
      },
    ],
  };
}

/**
 * Server component that renders JSON-LD structured data.
 * Place in the root layout or on specific pages.
 */
export function JsonLd({ data }: { data?: Record<string, unknown> }) {
  const jsonLd = data ?? buildHomepageJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
