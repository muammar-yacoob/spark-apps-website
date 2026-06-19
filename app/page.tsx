'use client';

import { BgBokeh } from '@/app/_components/bg-anims/BgBokeh';
import { useRotatingTagline } from '@/app/_components/hooks/useRotatingTagline';
import { ShareModal } from '@/app/_components/social/ShareModal';
import { CloseButton } from '@/app/_components/ui/CloseButton';
import { SITE_NAME, THEME_COLOR } from '@/lib/config/site';
import { sparkApps } from '@/lib/data/apps';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, Share2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function GoogleLogo() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppIcon({ app }: { app: (typeof sparkApps)[number] }) {
  if (app.icon) {
    return (
      <Image
        src={app.icon}
        alt={app.name}
        width={40}
        height={40}
        className="rounded-lg object-cover"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/[0.08] flex items-center justify-center">
      <Box className="w-5 h-5 text-blue-400/70" />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginClosing, setLoginClosing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const { tagline, index: taglineIndex } = useRotatingTagline();

  useEffect(() => {
    setMounted(true);
    if (searchParams.get('login') === 'true') {
      openLogin();
    }
  }, [searchParams]);

  function openLogin() {
    setLoginClosing(false);
    setShowLogin(true);
  }

  function closeLogin() {
    setLoginClosing(true);
    setTimeout(() => {
      setShowLogin(false);
      setLoginClosing(false);
    }, 200);
    if (searchParams.get('login') === 'true') {
      router.replace('/', { scroll: false });
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <BgBokeh primaryColor={THEME_COLOR} speed={3} />

      {/* Nav */}
      <nav className="border-b border-white/[0.06] bg-gray-900/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.ico" alt="" width={22} height={22} className="rounded" />
            <div>
              <span className="text-sm font-semibold text-white leading-tight">{SITE_NAME}</span>
              <div className="relative h-3 w-36 overflow-hidden hidden sm:block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={taglineIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 text-[9px] text-gray-600 truncate"
                  >
                    {tagline}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
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
            <button
              type="button"
              onClick={openLogin}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-white/[0.08] text-gray-200 transition-colors font-medium cursor-pointer"
            >
              <GoogleLogo />
              <span className="hidden sm:inline">Sign in</span>
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
                    <AppIcon app={app} />
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

      {/* Login modal */}
      {showLogin && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${loginClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeLogin();
          }}
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape handled on parent */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={closeLogin} />
          <div className="relative z-10 max-w-sm w-full mx-4 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.08] p-8 animate-scale-in">
            <CloseButton onClick={closeLogin} className="absolute top-3 right-3" />
            <div className="text-center">
              <div className="mb-5 flex justify-center">
                <img src="/favicon.ico" alt="" width={40} height={40} className="rounded-lg" />
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{SITE_NAME}</h2>
              <p className="text-sm text-gray-400 mb-8">Sign in to access the dashboard.</p>

              <button
                type="button"
                disabled={signingIn}
                onClick={() => {
                  setSigningIn(true);
                  signIn('google', { callbackUrl: '/dashboard' });
                }}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-100 rounded-lg font-semibold transition-colors border border-white/[0.08] btn-shimmer text-sm disabled:opacity-60 disabled:pointer-events-none"
              >
                {signingIn ? (
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
                ) : (
                  <GoogleLogo />
                )}
                {signingIn ? 'Signing in...' : 'Sign in with Google'}
              </button>

              <p className="mt-6 text-xs text-gray-500">
                <Link href="/privacy" className="hover:text-gray-400 underline transition-colors">
                  Privacy
                </Link>
                {' and '}
                <Link href="/terms" className="hover:text-gray-400 underline transition-colors">
                  Terms
                </Link>
                {' apply'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Share modal */}
      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}
