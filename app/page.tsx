'use client';

import { Chrome, ExternalLink, Globe, Package, Rocket, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CrossPromo } from '@/app/_components/ads/CrossPromo';
import { MobileShowcase } from '@/app/_components/apps/MobileShowcase';
import { BgParticles } from '@/app/_components/bg-anims/BgParticles';
import { BgShootingStars } from '@/app/_components/bg-anims/BgShootingStars';
import SocialShareButton from '@/app/_components/social-share/SocialShareButton';
import { SHARE_CONFIG } from '@/app/_components/social-share/share-config';
import { Tooltip } from '@/app/_components/ui/Tooltip';
import { SITE_NAME } from '@/lib/config/site';
import type { SparkApp } from '@/lib/data/apps';
import { appHomepage, externalHomepage, sparkApps } from '@/lib/data/apps';
import { fallbackTag, tagConfig } from '@/lib/data/tags';
import { QuickSearch } from '@/lib/quick-search';
import { QUICK_SEARCH_ITEMS } from '@/lib/quick-search-items';

const linkIcons: Record<string, React.ElementType> = {
  website: Globe,
  app: Rocket,
  chrome: Chrome,
  npm: Package,
  github: ExternalLink,
};

/** The link whose URL the tooltip shows (site → deployment → store → npm → first). */
function primaryLink(app: SparkApp) {
  return (
    externalHomepage(app) ??
    app.links.find((l) => l.type === 'app') ??
    app.links.find((l) => l.type === 'chrome') ??
    app.links.find((l) => l.type === 'npm') ??
    app.links[0]
  );
}

/** Rich details shown inside the custom Tooltip on hover. */
function AppTooltipContent({ app }: { app: SparkApp }) {
  const primary = primaryLink(app);
  const PrimaryIcon = primary ? (linkIcons[primary.type] ?? ExternalLink) : ExternalLink;

  return (
    <div className="max-w-[240px]">
      <p className="text-[11px] text-gray-400 leading-tight mb-1.5">{app.tagline}</p>
      <p className="text-[11px] text-gray-300 leading-relaxed mb-2">{app.description}</p>

      <div className="flex flex-wrap gap-1 mb-2">
        {app.tags.map((tag) => {
          const cfg = tagConfig[tag] ?? fallbackTag;
          const TagIcon = cfg.icon;
          return (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium border rounded ${cfg.color}`}
            >
              <TagIcon className="w-2.5 h-2.5 flex-shrink-0" />
              {tag}
            </span>
          );
        })}
      </div>

      {primary ? (
        <p className="flex items-center gap-1 text-[10px] text-blue-300">
          <PrimaryIcon className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{primary.url.replace(/^https?:\/\//, '')}</span>
        </p>
      ) : (
        <p className="text-[10px] text-gray-500">Coming soon</p>
      )}
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
      <BgParticles />
      <BgShootingStars />

      {/* Nav */}
      <nav className="border-b border-white/[0.06] bg-gray-900/40 backdrop-blur-sm z-10 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* biome-ignore lint/performance/noImgElement: static favicon fallback rendered at a fixed small size; not worth a next/image wrapper. */}
            <img src="/favicon.ico" alt="" width={22} height={22} className="rounded" />
            <span className="text-sm font-semibold text-white leading-tight">{SITE_NAME}</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-gray-400">
            <QuickSearch
              items={QUICK_SEARCH_ITEMS}
              placeholder="Search pages and apps..."
              trigger={(open) => (
                <button
                  type="button"
                  onClick={open}
                  aria-label="Search (Ctrl+K)"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono text-gray-500 border border-white/10 rounded">
                    Ctrl K
                  </kbd>
                </button>
              )}
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
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
            <div className="flex flex-wrap justify-center gap-3">
              {sparkApps.map((app, i) => {
                // Its own site if it has one, else its page here — an app with
                // nothing but an npm or store listing still lands somewhere.
                const href = appHomepage(app);
                const isExternal = href.startsWith('http');
                const cardClass =
                  'group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-blue-400/25 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(104,176,245,0.1)] animate-fade-in-up flex flex-col text-left w-full h-full';
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
                  <Tooltip
                    key={app.id}
                    title={app.name}
                    content={<AppTooltipContent app={app} />}
                    className="flex w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)]"
                  >
                    {isExternal ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${cardClass} cursor-pointer`}
                        style={style}
                      >
                        {cardInner}
                      </a>
                    ) : (
                      <Link href={href} className={`${cardClass} cursor-pointer`} style={style}>
                        {cardInner}
                      </Link>
                    )}
                  </Tooltip>
                );
              })}
            </div>
          </section>
        )}

        <MobileShowcase />

        {/* Cross-promo: a compact, live slice of the Spark network, and the
            paid-slot vehicle. Not a duplicate of the Apps Grid above -- see
            CrossPromo.tsx for why. */}
        <CrossPromo />

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
