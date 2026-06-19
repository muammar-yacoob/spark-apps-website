'use client';

import PageLoader from '@/app/_components/feedback/PageLoader';
import { useRotatingTagline } from '@/app/_components/hooks/useRotatingTagline';
import { OnBoarding, resetOnboarding } from '@/app/_components/onboarding/OnBoarding';
import SocialShareButton from '@/app/_components/social-share/SocialShareButton';
import { SHARE_CONFIG } from '@/app/_components/social-share/share-config';
import { SITE_NAME } from '@/lib/config/site';
import { TOAST_CONFIG } from '@/lib/config/toast';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, ChevronDown, HelpCircle, LogOut, Settings } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { Toaster } from 'sonner';
import { OverviewPanel } from './_components/OverviewPanel';
import { SettingsView } from './_components/SettingsView';
import type { View } from './_components/types';
import styles from './dashboard.module.css';
import { useDashboardStats } from './hooks/useDashboardStats';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<View>('home');
  const menuRef = useRef<HTMLDivElement>(null);
  const { tagline, index: taglineIndex } = useRotatingTagline();

  const { data: db = { connected: false }, isPending: loading } = useDashboardStats({
    enabled: status === 'authenticated',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  if (!mounted || status === 'loading') {
    return <PageLoader />;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">You need to sign in to access the dashboard.</p>
          <a
            href="/?login=true"
            className="inline-flex px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <OnBoarding>
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <Toaster {...TOAST_CONFIG} />

        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside
            id="onborda-sidebar"
            className="hidden md:flex w-56 min-h-screen border-r border-white/[0.06] bg-gray-900/40 p-4 flex-col gap-1"
          >
            <div className="mb-6" />
            <button
              type="button"
              onClick={() => setView('home')}
              className={`${styles.sidebarItem} ${view === 'home' ? styles.sidebarItemActive : ''} ${styles.iconPopTrigger}`}
              suppressHydrationWarning
            >
              <BarChart3
                suppressHydrationWarning
                className={`w-4 h-4 text-gray-500 ${styles.iconPop}`}
              />
              <span className="text-sm text-gray-300">Overview</span>
            </button>
            <button
              type="button"
              id="onborda-settings"
              onClick={() => setView('settings')}
              className={`${styles.sidebarItem} ${view === 'settings' ? styles.sidebarItemActive : ''} ${styles.iconSpinTrigger}`}
              suppressHydrationWarning
            >
              <Settings
                suppressHydrationWarning
                className={`w-4 h-4 text-gray-500 ${styles.iconSpin}`}
              />
              <span className="text-sm text-gray-300">Settings</span>
            </button>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Header */}
            <header className="border-b border-white/[0.06] bg-gray-900/40 backdrop-blur-sm sticky top-0 z-10">
              <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src="/favicon.ico" alt="" width={22} height={22} className="rounded" />
                  <div>
                    <h1 className="text-sm font-semibold text-white leading-tight">{SITE_NAME}</h1>
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
                <div className="flex items-center gap-1">
                  {/* Share */}
                  <SocialShareButton
                    size={16}
                    className={`p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors ${styles.iconPopTrigger}`}
                    {...SHARE_CONFIG}
                  />

                  {/* Avatar menu */}
                  <div id="onborda-user-menu" className="relative" ref={menuRef}>
                    <button
                      type="button"
                      onClick={() => setMenuOpen((v) => !v)}
                      className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 hover:bg-white/[0.04] transition-colors"
                      suppressHydrationWarning
                    >
                      {session?.user?.image ? (
                        <img
                          src={session.user.image}
                          alt=""
                          width={28}
                          height={28}
                          className="rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {session?.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                      )}
                      <span className="text-sm text-gray-300 hidden sm:inline">
                        {session?.user?.name ?? 'User'}
                      </span>
                      <ChevronDown
                        suppressHydrationWarning
                        className={`w-3.5 h-3.5 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {menuOpen && (
                      <div
                        className={`absolute right-0 top-full mt-1 w-56 bg-gray-900 border border-white/[0.08] rounded-xl shadow-xl overflow-hidden ${styles.menuDropdown}`}
                      >
                        <div className="px-4 py-3 border-b border-white/[0.06]">
                          <p className="text-xs text-gray-300 font-medium truncate">
                            {session?.user?.name ?? 'User'}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {session?.user?.email ?? ''}
                          </p>
                        </div>
                        <div className="py-1" suppressHydrationWarning>
                          <button
                            type="button"
                            onClick={() => {
                              resetOnboarding();
                              setMenuOpen(false);
                              window.location.reload();
                            }}
                            className={`${styles.menuItem} w-full text-left px-4 py-2 text-sm text-gray-300 flex items-center gap-2.5`}
                            suppressHydrationWarning
                          >
                            <HelpCircle
                              suppressHydrationWarning
                              className="w-3.5 h-3.5 text-gray-500"
                            />
                            Dashboard Tour
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setView('settings');
                              setMenuOpen(false);
                            }}
                            className={`${styles.menuItem} w-full text-left px-4 py-2 text-sm text-gray-300 flex items-center gap-2.5 ${styles.iconSpinTrigger}`}
                            suppressHydrationWarning
                          >
                            <Settings
                              suppressHydrationWarning
                              className={`w-3.5 h-3.5 text-gray-500 ${styles.iconSpin}`}
                            />
                            Settings
                          </button>
                          <button
                            type="button"
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className={`${styles.menuItem} w-full text-left px-4 py-2 text-sm text-gray-300 flex items-center gap-2.5`}
                            suppressHydrationWarning
                          >
                            <LogOut
                              suppressHydrationWarning
                              className="w-3.5 h-3.5 text-gray-500"
                            />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile tab bar */}
            <div
              className="md:hidden flex border-b border-white/[0.06] bg-gray-900/40"
              suppressHydrationWarning
            >
              <button
                type="button"
                onClick={() => setView('home')}
                className={`${styles.tabBtn} flex-1 flex items-center justify-center gap-1.5 ${view === 'home' ? styles.tabBtnActive : ''}`}
                suppressHydrationWarning
              >
                <BarChart3 suppressHydrationWarning className="w-3.5 h-3.5" />
                Overview
              </button>
              <button
                type="button"
                onClick={() => setView('settings')}
                className={`${styles.tabBtn} flex-1 flex items-center justify-center gap-1.5 ${view === 'settings' ? styles.tabBtnActive : ''}`}
                suppressHydrationWarning
              >
                <Settings suppressHydrationWarning className="w-3.5 h-3.5" />
                Settings
              </button>
            </div>

            <main id="onborda-overview" className="p-4 sm:p-6 overflow-hidden" key={view}>
              {view === 'settings' ? (
                <SettingsView />
              ) : (
                <OverviewPanel session={session} loading={loading} db={db} />
              )}
            </main>
          </div>
        </div>
      </div>
    </OnBoarding>
  );
}
