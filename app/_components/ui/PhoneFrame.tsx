'use client';

/**
 * The device shell both phone previews sit in: bezel, notch, status bar and an
 * optional tab bar. Nothing app-specific lives here, so the live mockup
 * (PhoneDemo) and the static screenshot (PhoneSnapshot) sit in the same
 * hardware and read as the same product.
 *
 * Ships identically in spark-stack and expotemplate-site — keep them in sync.
 */

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

export interface PhoneFrameProps {
  children: ReactNode;
  /** Rendered pinned to the bottom edge, above the home indicator. */
  tabBar?: ReactNode;
  /** Overrides --accent inside the phone only, so one page can show several. */
  accent?: string;
  accentHover?: string;
  width?: number;
  height?: number;
  /** Skip the entrance animation when several frames appear at once. */
  still?: boolean;
  caption?: string;
}

export function PhoneFrame({
  children,
  tabBar,
  accent,
  accentHover,
  width = 268,
  height = 540,
  still = false,
  caption,
}: PhoneFrameProps) {
  const accentOverride = accent
    ? ({
        '--accent': accent,
        '--accent-hover': accentHover ?? accent,
      } as CSSProperties)
    : undefined;

  return (
    <div className="relative mx-auto" style={{ width, ...accentOverride }}>
      <motion.div
        className="rounded-[2.6rem] bg-gray-900 p-2.5 shadow-2xl ring-1 ring-white/10"
        initial={still ? false : { opacity: 0, y: 24, rotate: -1.5 }}
        animate={still ? undefined : { opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative overflow-hidden rounded-[2.1rem] bg-[#0b0d12]" style={{ height }}>
          <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

          <div className="flex items-center justify-between px-6 pt-3.5 text-[11px] font-semibold text-gray-300">
            <span>9:41</span>
            <span className="flex items-center gap-1.5 tracking-tight">
              <Bell className="h-3 w-3" suppressHydrationWarning />● ● ● 100%
            </span>
          </div>

          <div className={tabBar ? 'pb-16' : ''}>{children}</div>

          {tabBar && (
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-white/[0.06] bg-[#0b0d12]/90 px-4 py-3 backdrop-blur">
              {tabBar}
            </div>
          )}
        </div>
      </motion.div>
      {caption && <p className="mt-3 text-center text-[11px] text-gray-500">{caption}</p>}
    </div>
  );
}
