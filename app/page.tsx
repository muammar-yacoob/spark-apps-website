'use client';

import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SparkAdsCarousel } from '@/app/_components/ads/SparkAdsCarousel';
import { AppModal, linkIcons } from '@/app/_components/apps/AppModal';
import { MobileShowcase } from '@/app/_components/apps/MobileShowcase';
import { EnterIfSignedIn } from '@/app/_components/auth/EnterIfSignedIn';
import { BgParticles } from '@/app/_components/bg-anims/BgParticles';
import { BgShootingStars } from '@/app/_components/bg-anims/BgShootingStars';
import SocialShareButton from '@/app/_components/social-share/SocialShareButton';
import { SHARE_CONFIG } from '@/app/_components/social-share/share-config';
import { AppMark } from '@/app/_components/ui/AppMark';
import { SITE_NAME } from '@/lib/config/site';
import type { SparkApp } from '@/lib/data/apps';
import {
  appHomepage,
  externalHomepage,
  hasPublicDestination,
  isChromeExtension,
  isOpenSource,
  sparkApps,
} from '@/lib/data/apps';
import { fallbackTag, tagConfig } from '@/lib/data/tags';
import { QuickSearch, QuickSearchTrigger } from '@/lib/quick-search';
import { QUICK_SEARCH_ITEMS } from '@/lib/quick-search-items';

/**
 * The grid in three buckets, by what the app actually ships as. First match
 * wins, so an extension stays with the extensions even once it has a domain
 * of its own.
 *
 * Open Source is a public repo and nothing else. An npm-only tool is not open
 * source - the tarball says nothing about the repo - so it files with the
 * products, which is where a paid CLI belongs anyway.
 */
function appGroups() {
  const listed = sparkApps.filter(hasPublicDestination);
  const extensions = listed.filter(isChromeExtension);
  const rest = listed.filter((app) => !isChromeExtension(app));
  return [
    { title: 'Apps & SaaS', apps: rest.filter((app) => !isOpenSource(app)) },
    { title: 'Chrome Extensions', apps: extensions },
    { title: 'Open Source', apps: rest.filter(isOpenSource) },
  ].filter((group) => group.apps.length > 0);
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  /** The card whose details the shared modal is showing; null when closed. */
  const [selected, setSelected] = useState<SparkApp | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
      <EnterIfSignedIn />
      <BgParticles />
      <BgShootingStars />

      {/* Nav */}
      <nav className="border-b border-white/[0.06] bg-gray-900/40 backdrop-blur-sm z-10 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AppMark size={22} />
            <span className="text-sm font-semibold text-white leading-tight">{SITE_NAME}</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-gray-400">
            <QuickSearch
              items={QUICK_SEARCH_ITEMS}
              placeholder="Search pages and apps..."
              trigger={(open) => <QuickSearchTrigger onClick={open} />}
            />
            <Link href="/about" className="hidden sm:inline hover:text-white transition-colors">
              About
            </Link>
            <Link href="/team" className="hidden sm:inline hover:text-white transition-colors">
              Team
            </Link>
            <Link href="/careers" className="hidden sm:inline hover:text-white transition-colors">
              Careers
            </Link>
            <Link href="/contact" className="hidden sm:inline hover:text-white transition-colors">
              Contact
            </Link>
            {/* The Unity and game-dev back-catalogue is not listed here; it keeps
                its own site. Linked so the two halves of the brand stay connected. */}
            <a
              href="https://spark-games.co.uk"
              className="hidden md:inline hover:text-white transition-colors"
            >
              Games ↗
            </a>
            <SocialShareButton size={16} {...SHARE_CONFIG} />
          </div>
        </div>
      </nav>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto relative z-[1]">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-3xl mx-auto px-6 py-14 sm:py-20 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent animate-fade-in-up">
              Tools for Creators
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto animate-fade-in animation-delay-200">
              Tools, starters, and utilities built to help you ship faster.
            </p>
          </div>
        </section>

        {/* Apps Grid */}
        {mounted && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 space-y-10">
            {/* Apps with nowhere public to go are hidden here; their pages,
                sitemap entries and privacy policies all stay put. */}
            {appGroups().map((group) => (
              <div key={group.title}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="font-semibold text-[12px] text-gray-300 uppercase tracking-[0.14em]">
                    {group.title}
                  </h2>
                  <span className="text-[11px] text-gray-600">{group.apps.length}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-white/[0.1] to-transparent" />
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {group.apps.map((app, i) => {
                    // Still a real href so the card is crawlable and middle-click
                    // works; a plain click opens the modal instead (below).
                    const href = appHomepage(app);
                    const isExternal = href.startsWith('http');
                    const cardClass =
                      'group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-blue-400/25 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(104,176,245,0.1)] animate-fade-in-up flex flex-col text-left cursor-pointer w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)]';
                    const style = {
                      animationDelay: `${i * 60}ms`,
                      animationFillMode: 'both' as const,
                    };

                    const cardInner = (
                      <>
                        {/* Header: icon + name + tagline */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <Image
                              src={app.icon}
                              alt={app.name}
                              width={36}
                              height={36}
                              className="rounded-lg object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors duration-200 leading-tight">
                              {app.name}
                            </h3>
                            <p className="text-[11px] text-gray-500 leading-tight">{app.tagline}</p>
                          </div>
                          {app.links.length > 0 && (
                            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {app.links.slice(0, 2).map((link) => {
                                const Icon = linkIcons[link.type] ?? ExternalLink;
                                return (
                                  // Keyed on the url, not the type: an app can have
                                  // two 'website' links (site + privacy page).
                                  <span key={link.url}>
                                    <Icon className="w-3 h-3 text-gray-600" />
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
                          {app.description}
                        </p>

                        {/* Tags - centered, no wrap */}
                        <div className="flex justify-center gap-1.5 mt-auto overflow-hidden">
                          {app.tags.map((tag) => {
                            const cfg = tagConfig[tag] ?? fallbackTag;
                            const TagIcon = cfg.icon;
                            return (
                              <span
                                key={tag}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium border rounded-md whitespace-nowrap transition-all duration-200 group-hover:scale-105 ${cfg.color}`}
                              >
                                <TagIcon className="w-2.5 h-2.5 flex-shrink-0" />
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                      </>
                    );

                    return (
                      <a
                        key={app.id}
                        href={href}
                        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className={cardClass}
                        style={style}
                        onClick={(e) => {
                          // Modified clicks keep the browser's own behaviour.
                          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                          e.preventDefault();
                          setSelected(app);
                        }}
                      >
                        {cardInner}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}

        <AppModal app={selected} onClose={() => setSelected(null)} />

        <MobileShowcase />

        {/* Cross-promo: a compact, live slice of the Spark network, and the
            paid-slot vehicle. Not a duplicate of the Apps Grid above -- see
            SparkAdsCarousel.tsx for why. */}
        <SparkAdsCarousel className="mx-auto max-w-3xl px-4 pb-10 sm:px-6" />

        {/* Footer */}
        <footer className="border-t border-gray-800 py-6">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <Link href="/about" className="hover:text-gray-400 transition-colors">
                About
              </Link>
              <span>·</span>
              <Link href="/team" className="hover:text-gray-400 transition-colors">
                Team
              </Link>
              <span>·</span>
              <Link href="/careers" className="hover:text-gray-400 transition-colors">
                Careers
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
      </main>
    </div>
  );
}
