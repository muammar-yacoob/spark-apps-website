'use client';

import { BgShootingStars } from '@/app/_components/bg-anims/BgShootingStars';
import { LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';
import { SITE_NAME } from '@/lib/config/site';
import { ArrowLeft, Boxes, Loader2, Mail, PlayCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PORTFOLIO_URL = 'https://muammar-yacoob.github.io/InteractivePortfolio3D/';
const PORTFOLIO_REPO = 'https://github.com/muammar-yacoob/InteractivePortfolio3D#setup';

function UnityPortfolio() {
  // 'idle' = placeholder, 'loading' = spinner shown, 'ready' = iframe loaded.
  const [state, setState] = useState<'idle' | 'loading' | 'ready'>('idle');

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-400/[0.08] to-blue-400/[0.03] pt-[56.25%]">
      {state === 'idle' && (
        <button
          type="button"
          onClick={() => setState('loading')}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center transition-all duration-300 hover:bg-blue-400/[0.06]"
        >
          <PlayCircle className="h-14 w-14 text-blue-400 transition-transform duration-300 group-hover:scale-110" />
          <h3 className="text-lg sm:text-xl font-semibold text-white drop-shadow">
            Interactive 3D Portfolio
          </h3>
          <p className="text-sm text-gray-300">Click to explore the interactive experience</p>
          <span className="mt-1 inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-400/20 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-100">
            <Boxes className="h-3.5 w-3.5" />
            UNITY WEBGL
          </span>
        </button>
      )}

      {state === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <h3 className="text-base sm:text-lg font-semibold text-white">
            Loading Interactive Portfolio...
          </h3>
          <p className="text-sm text-gray-400">Please wait while the 3D experience loads</p>
        </div>
      )}

      {state !== 'idle' && (
        <iframe
          src={PORTFOLIO_URL}
          title="Interactive 3D Portfolio"
          allowFullScreen
          onLoad={() => setState('ready')}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${
            state === 'ready' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}

export function AboutPageClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <BgShootingStars />

      {/* Nav with back button */}
      <nav className="border-b border-white/[0.06] bg-gray-900/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <img src="/favicon.ico" alt="" width={22} height={22} className="rounded" />
              <span className="text-sm font-semibold text-white">{SITE_NAME}</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              Apps
            </Link>
            <Link href="/team" className="hover:text-white transition-colors">
              Team
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-8 text-center relative z-[1]">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent animate-fade-in-up">
            About {SITE_NAME}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-blue-400 font-medium animate-fade-in animation-delay-200">
            Crafting Seasonal Gaming Wonders and Developer Solutions
          </p>
          <p className="mt-4 text-base text-gray-400 leading-relaxed max-w-xl mx-auto animate-fade-in animation-delay-200">
            Our journey began with a spark of inspiration to create games that bring joy to players
            of all ages. Alongside our games, we build tools that empower fellow developers on their
            game-making journey. Explore the magic of our seasonal gaming world!
          </p>

          {/* Meet the Team link */}
          <Link
            href="/team"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors animate-fade-in animation-delay-400"
          >
            <Users className="h-4 w-4" />
            Meet the Team
          </Link>
        </div>
      </section>

      {/* Interactive Portfolio */}
      {mounted && (
        <section className="max-w-3xl w-full mx-auto px-4 sm:px-6 pb-4 relative z-[1] animate-fade-in-up animation-delay-200">
          <UnityPortfolio />

          <p className="mt-4 text-center text-sm text-gray-400">
            Make it yours with{' '}
            <a
              href={PORTFOLIO_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              this tool
            </a>
            .
          </p>
        </section>
      )}

      {/* Get in touch */}
      <section className="max-w-3xl w-full mx-auto px-6 py-10 text-center relative z-[1]">
        <p className="text-sm text-gray-400">
          Got a project in mind, questions about our services, or collaboration ideas?
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-400 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(104,176,245,0.4)] btn-shimmer"
        >
          <Mail className="h-4 w-4" />
          Get in Touch
        </Link>
      </section>

      <div className="mt-auto">
        <LegalPageFooter />
      </div>
    </div>
  );
}
