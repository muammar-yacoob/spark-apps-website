'use client';

import { BgShootingStars } from '@/app/_components/bg-anims/BgShootingStars';
import { ShareModal } from '@/app/_components/social/ShareModal';
import { SITE_NAME } from '@/lib/config/site';
import { sparkApps } from '@/lib/data/apps';
import { fallbackTag, tagConfig } from '@/lib/data/tags';
import { ExternalLink, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
      <BgShootingStars />

      {/* Nav - fixed, outside scroll */}
      <nav className="border-b border-white/[0.06] bg-gray-900/40 backdrop-blur-sm z-10 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.ico" alt="" width={22} height={22} className="rounded" />
            <span className="text-sm font-semibold text-white leading-tight">{SITE_NAME}</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-gray-400">
            <Link href="/team" className="hidden sm:inline hover:text-white transition-colors">
              Team
            </Link>
            <Link href="/careers" className="hidden sm:inline hover:text-white transition-colors">
              Careers
            </Link>
            <Link href="/contact" className="hidden sm:inline hover:text-white transition-colors">
              Contact
            </Link>
            <button
              type="button"
              onClick={() => setShowShare(true)}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Share"
              suppressHydrationWarning
            >
              <Share2
                suppressHydrationWarning
                className="w-4 h-4 text-gray-400 transition-transform duration-200 hover:scale-110"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto relative z-[1]">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-3xl mx-auto px-6 py-14 sm:py-20 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent animate-fade-in-up">
              Productivity Tools for Creators
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
              {sparkApps.map((app, i) => (
                <div
                  key={app.id}
                  className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-blue-400/25 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(104,176,245,0.1)] animate-fade-in-up flex flex-col w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)]"
                  style={{
                    animationDelay: `${i * 60}ms`,
                    animationFillMode: 'both',
                  }}
                >
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
                    {app.links && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {app.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={link.label}
                            className="p-1 rounded hover:bg-white/[0.08] transition-all"
                          >
                            <ExternalLink className="w-3 h-3 text-gray-600 hover:text-blue-400 hover:scale-110 transition-all duration-200" />
                          </a>
                        ))}
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
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer - inside scroll */}
        <footer className="border-t border-gray-800 py-6">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
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

      {/* Share modal */}
      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}
