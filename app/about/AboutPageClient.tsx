'use client';

import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { BgParticles } from '@/app/_components/bg-anims/BgParticles';
import { BgShootingStars } from '@/app/_components/bg-anims/BgShootingStars';
import { LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';
import { SITE_NAME } from '@/lib/config/site';

export function AboutPageClient() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <BgParticles />
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
              {/* biome-ignore lint/performance/noImgElement: static favicon fallback rendered at a fixed small size; not worth a next/image wrapper. */}
              <img src="/favicon.ico" alt="" width={22} height={22} className="rounded" />
              <span className="text-sm font-semibold text-white">{SITE_NAME}</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              Apps
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
            Small tools, shipped often
          </p>
          <p className="mt-4 text-base text-gray-400 leading-relaxed max-w-xl mx-auto animate-fade-in animation-delay-200">
            Spark Apps is an independent studio building SaaS products, Chrome extensions and
            developer tooling. Everything in the catalogue is built and maintained in house, and
            most of it started as something needed for another project.
          </p>
        </div>
      </section>

      {/* What we build */}
      <section className="max-w-3xl w-full mx-auto px-6 pb-4 relative z-[1] animate-fade-in animation-delay-400">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white mb-3">How it fits together</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            The products share one foundation. SparkStack is the starter the web apps are built
            from, SparkPay handles their payments, Bottled sends their email and Spark AI answers
            their support questions. Each one is sold on its own, and each one is used in anger
            across the rest of the catalogue before it ships.
          </p>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            The games and Unity back-catalogue live separately, at{' '}
            <a
              href="https://spark-games.co.uk"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              spark-games.co.uk
            </a>
            .
          </p>
        </div>
      </section>

      {/* Get in touch */}
      <section className="max-w-3xl w-full mx-auto px-6 py-10 text-center relative z-[1]">
        <p className="text-sm text-gray-400">
          Questions about a product, or want something built? Get in touch.
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
