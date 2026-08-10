/**
 * The per-app page, generated from lib/data/apps.ts.
 *
 * Exists so that every app has a homepage URL even when it has no domain of
 * its own — a CLI that only lives on npm, an extension still queued for the
 * store. Store submissions, README badges, and the sitemap all want a link,
 * and `/apps/<id>` is one without buying DNS or standing up a project.
 *
 * Apps that do have their own site still get a page (canonical stays here,
 * with the site as the first link out), so the route never has holes.
 */

import { ArrowLeft, Chrome, ExternalLink, Github, Globe, Package, Rocket } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/app/_components/seo/JsonLd';
import { PhoneSnapshot } from '@/app/_components/ui/PhoneSnapshot';
import { SITE_NAME, SITE_URL } from '@/lib/config/site';
import type { AppLink, SparkApp } from '@/lib/data/apps';
import { externalHomepage, getApp, sparkApps } from '@/lib/data/apps';
import { fallbackTag, tagConfig } from '@/lib/data/tags';

const linkIcons: Record<AppLink['type'], React.ElementType> = {
  website: Globe,
  app: Rocket,
  chrome: Chrome,
  npm: Package,
  github: Github,
};

export function generateStaticParams() {
  return sparkApps.map((app) => ({ slug: app.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return { title: 'App not found' };

  return {
    title: `${app.name} — ${app.tagline}`,
    description: app.description,
    keywords: app.tags,
    alternates: { canonical: `/apps/${app.id}` },
    openGraph: {
      title: `${app.name} — ${app.tagline}`,
      description: app.description,
      url: `${SITE_URL}/apps/${app.id}`,
      siteName: SITE_NAME,
      type: 'website',
    },
  };
}

/** Schema.org entry so the page reads as the app's homepage, not a directory row. */
function appJsonLd(app: SparkApp) {
  const site = externalHomepage(app);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: app.mobile ? 'iOS, Android' : 'Any',
    url: site?.url ?? `${SITE_URL}/apps/${app.id}`,
    image: `${SITE_URL}${app.icon}`,
    keywords: app.tags.join(', '),
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <JsonLd data={appJsonLd(app)} />

      <div className="flex-1 py-12 sm:py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white transition-all mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All apps
          </Link>

          <header className="flex items-center gap-4">
            <Image
              src={app.icon}
              alt=""
              width={64}
              height={64}
              className="rounded-2xl object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                {app.name}
              </h1>
              <p className="text-gray-400 mt-1">{app.tagline}</p>
            </div>
          </header>

          <p className="mt-6 text-lg text-gray-300 leading-relaxed">{app.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {app.tags.map((tag) => {
              const cfg = tagConfig[tag] ?? fallbackTag;
              const TagIcon = cfg.icon;
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-md ${cfg.color}`}
                >
                  <TagIcon className="w-3 h-3 flex-shrink-0" />
                  {tag}
                </span>
              );
            })}
          </div>

          {app.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {app.links.map((link) => {
                const Icon = linkIcons[link.type] ?? ExternalLink;
                const isExternal = /^https?:\/\//.test(link.url);
                const className =
                  'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-white/[0.08] bg-white/[0.05] text-gray-200 hover:bg-white/[0.1] hover:text-white transition-all';
                return isExternal ? (
                  // Keyed on the url: an app can have two 'website' links.
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.url} href={link.url} className={className}>
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          {app.mobile && (
            <div className="mt-14 flex justify-center">
              <PhoneSnapshot
                src={app.mobile.screenshot}
                alt={app.mobile.alt}
                accent={app.mobile.accent}
                caption={app.mobile.caption}
                width={240}
                height={486}
              />
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-gray-800 py-6">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-400 transition-colors">
              Home
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">
              Contact
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
