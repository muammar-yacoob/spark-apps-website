'use client';

import { BgShootingStars } from '@/app/_components/bg-anims/BgShootingStars';
import { ShareModal } from '@/app/_components/social/ShareModal';
import { SITE_NAME } from '@/lib/config/site';
import { sparkApps } from '@/lib/data/apps';
import { Share2 } from 'lucide-react';
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
                className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:border-blue-400/25 hover:bg-white/[0.05] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(104,176,245,0.08)] animate-fade-in-up"
                style={{
                  animationDelay: `${i * 60}ms`,
                  animationFillMode: 'both',
                }}
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={app.icon}
                      alt={app.name}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors duration-200">
                      {app.name}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                      {app.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {app.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-medium text-gray-500 bg-white/[0.04] border border-white/[0.06] rounded-md transition-colors duration-200 group-hover:text-blue-400/70 group-hover:border-blue-400/15"
                    >
                      {tag}
                    </span>
                  ))}
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
