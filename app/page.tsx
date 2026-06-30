'use client';

import { BgShootingStars } from '@/app/_components/bg-anims/BgShootingStars';
import SocialShareButton from '@/app/_components/social-share/SocialShareButton';
import { SHARE_CONFIG } from '@/app/_components/social-share/share-config';
import { SITE_NAME } from '@/lib/config/site';
import type { SparkApp } from '@/lib/data/apps';
import { sparkApps } from '@/lib/data/apps';
import { fallbackTag, tagConfig } from '@/lib/data/tags';
import { Chrome, ExternalLink, Globe, Package, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const linkIcons: Record<string, React.ElementType> = {
  website: Globe,
  chrome: Chrome,
  npm: Package,
  github: ExternalLink,
};

function AppDetailModal({ app, onClose }: { app: SparkApp; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape handled via keydown */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 max-w-md w-full mx-4 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.08] p-6 animate-scale-in">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={app.icon}
            alt={app.name}
            width={48}
            height={48}
            className="rounded-xl object-cover"
          />
          <div>
            <h2 className="text-lg font-bold text-white">{app.name}</h2>
            <p className="text-sm text-gray-400">{app.tagline}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed mb-5">{app.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {app.tags.map((tag) => {
            const cfg = tagConfig[tag] ?? fallbackTag;
            const TagIcon = cfg.icon;
            return (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border rounded-md ${cfg.color}`}
              >
                <TagIcon className="w-3 h-3 flex-shrink-0" />
                {tag}
              </span>
            );
          })}
        </div>

        {/* Links */}
        {app.links.length > 0 && (
          <div className="flex flex-col gap-2">
            {app.links.map((link) => {
              const Icon = linkIcons[link.type] ?? ExternalLink;
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-blue-400/30 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                      {link.label}
                    </span>
                    <p className="text-xs text-gray-500 truncate">
                      {link.url.replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                </a>
              );
            })}
          </div>
        )}

        {app.links.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-2">Coming soon</p>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [selectedApp, setSelectedApp] = useState<SparkApp | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeModal = useCallback(() => setSelectedApp(null), []);

  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
      <BgShootingStars />

      {/* Nav */}
      <nav className="border-b border-white/[0.06] bg-gray-900/40 backdrop-blur-sm z-10 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.ico" alt="" width={22} height={22} className="rounded" />
            <span className="text-sm font-semibold text-white leading-tight">{SITE_NAME}</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-gray-400">
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
              {sparkApps.map((app, i) => (
                <button
                  type="button"
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-blue-400/25 hover:bg-white/[0.05] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(104,176,245,0.1)] animate-fade-in-up flex flex-col text-left w-full sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)]"
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
                    {app.links.length > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {app.links.slice(0, 2).map((link) => {
                          const Icon = linkIcons[link.type] ?? ExternalLink;
                          return (
                            <span key={link.type} title={link.label}>
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
                </button>
              ))}
            </div>
          </section>
        )}

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

      {/* App Detail Modal */}
      {selectedApp && <AppDetailModal app={selectedApp} onClose={closeModal} />}
    </div>
  );
}
