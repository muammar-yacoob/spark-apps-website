'use client';

import { BgShootingStars } from '@/app/_components/bg-anims/BgShootingStars';
import { ShareModal } from '@/app/_components/social/ShareModal';
import { SITE_NAME } from '@/lib/config/site';
import { sparkApps } from '@/lib/data/apps';
import {
  BarChart3,
  Box,
  Brain,
  Code,
  CreditCard,
  ExternalLink,
  Globe,
  Layers,
  Mail,
  MessageSquare,
  Monitor,
  Puzzle,
  Rocket,
  Search,
  Server,
  Share2,
  Shield,
  Terminal,
  Video,
  Wrench,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const tagConfig: Record<string, { color: string; icon: React.ElementType }> = {
  AI: { color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: Brain },
  Video: { color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', icon: Video },
  Web: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Globe },
  Desktop: { color: 'text-slate-400 bg-slate-400/10 border-slate-400/20', icon: Monitor },
  Tools: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Wrench },
  SEO: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: Search },
  Marketing: { color: 'text-pink-400 bg-pink-400/10 border-pink-400/20', icon: Zap },
  Starter: { color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', icon: Rocket },
  'Full-Stack': { color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', icon: Layers },
  Email: { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Mail },
  Domain: { color: 'text-teal-400 bg-teal-400/10 border-teal-400/20', icon: Globe },
  Communication: { color: 'text-teal-400 bg-teal-400/10 border-teal-400/20', icon: Mail },
  'Social Media': { color: 'text-pink-400 bg-pink-400/10 border-pink-400/20', icon: Share2 },
  Analytics: { color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', icon: BarChart3 },
  Demo: { color: 'text-violet-400 bg-violet-400/10 border-violet-400/20', icon: Video },
  'Chrome Extension': {
    color: 'text-green-400 bg-green-400/10 border-green-400/20',
    icon: Puzzle,
  },
  Detection: { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: Shield },
  Chat: { color: 'text-sky-400 bg-sky-400/10 border-sky-400/20', icon: MessageSquare },
  Widget: { color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: Box },
  Payments: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CreditCard },
  Stripe: { color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: Zap },
  Backend: { color: 'text-slate-400 bg-slate-400/10 border-slate-400/20', icon: Server },
  CLI: { color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: Terminal },
  DevTools: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Code },
  Cleanup: { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: Wrench },
  'Next.js': { color: 'text-white bg-white/10 border-white/20', icon: Layers },
};

const fallbackTag = { color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: Box };

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <BgShootingStars />

      {/* Nav */}
      <nav className="border-b border-white/[0.06] bg-gray-900/40 backdrop-blur-sm sticky top-0 z-10">
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
              <Share2 suppressHydrationWarning className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24 text-center relative z-[1]">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent animate-fade-in-up">
            Productivity Apps for Vibe Coders
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto animate-fade-in animation-delay-200">
            Tools, starters, and utilities built to help you ship faster.
          </p>
        </div>
      </section>

      {/* Apps Grid */}
      {mounted && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 relative z-[1] w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sparkApps.map((app, i) => (
              <div
                key={app.id}
                className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:border-blue-400/25 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(104,176,245,0.08)] animate-fade-in-up flex flex-col"
                style={{
                  animationDelay: `${i * 60}ms`,
                  animationFillMode: 'both',
                }}
              >
                {/* Header: icon + name + tagline */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={app.icon}
                      alt={app.name}
                      width={36}
                      height={36}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors duration-200 leading-tight">
                      {app.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-tight">{app.tagline}</p>
                  </div>
                  {/* Links inline at top-right */}
                  {app.links && (
                    <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                      {app.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={link.label}
                          className="p-1 rounded hover:bg-white/[0.06] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-gray-600 hover:text-blue-400 transition-colors" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3 pl-[48px]">
                  {app.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto pl-[48px]">
                  {app.tags.map((tag) => {
                    const cfg = tagConfig[tag] ?? fallbackTag;
                    const TagIcon = cfg.icon;
                    return (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium border rounded-md transition-all duration-200 group-hover:scale-105 ${cfg.color}`}
                      >
                        <TagIcon className="w-2.5 h-2.5" />
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

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 relative z-[1] mt-auto">
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

      {/* Share modal */}
      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}
