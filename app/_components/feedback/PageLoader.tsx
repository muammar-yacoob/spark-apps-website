'use client';

import animationData from '@/app/_animations/loader-cat.json';
import { useRotatingTagline } from '@/app/_components/hooks/useRotatingTagline';
import { SITE_NAME } from '@/lib/config/site';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function PageLoader() {
  const { tagline, index } = useRotatingTagline(2200);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Brand mark */}
        <div className="flex items-center gap-2">
          <img src="/favicon.ico" alt="" width={22} height={22} className="rounded-sm" />
          <span className="text-white font-semibold text-sm tracking-wide">{SITE_NAME}</span>
        </div>

        {/* Lottie animation */}
        <div className="w-32 h-32 flex items-center justify-center">
          <Lottie animationData={animationData} loop />
        </div>

        {/* Rotating tagline */}
        <div className="relative h-5 w-72 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 text-center text-gray-500 text-xs tracking-wide"
            >
              {tagline}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
