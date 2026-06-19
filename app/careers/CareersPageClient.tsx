'use client';

import { BgBokeh } from '@/app/_components/bg-anims/BgBokeh';
import { LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';
import { SITE_NAME, THEME_COLOR } from '@/lib/config/site';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const requirements = [
  'Proficiency in Unity and environment design',
  'Strong skills in Blender or similar 3D software',
  'Experience with world building and level design',
  'Portfolio showcasing environment art (student work acceptable)',
  'Must appreciate Adventure Time references',
];

const niceToHave = [
  'Experience with procedural generation',
  'Knowledge of optimization techniques',
  'Shader programming skills',
  'Mathematical! Algebraic! (If you know, you know)',
];

const perks = [
  'Work on exciting game projects with creative freedom',
  'Fully remote position - work from anywhere',
  'Collaborative team that loves TV show references',
  'Valuable learning experience and portfolio development opportunities',
];

export function CareersPageClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <BgBokeh primaryColor={THEME_COLOR} speed={3} />

      {/* Nav */}
      <nav className="border-b border-white/[0.06] bg-gray-900/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/favicon.ico" alt="" width={22} height={22} className="rounded" />
            <span className="text-sm font-semibold text-white">{SITE_NAME}</span>
          </Link>
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
          <Link
            href="/team"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white transition-all mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Team
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent animate-fade-in-up">
            Join Our Team
          </h1>
          <p className="mt-3 text-base text-gray-400 leading-relaxed max-w-xl mx-auto animate-fade-in animation-delay-200">
            Help us create amazing gaming experiences
          </p>
        </div>
      </section>

      {/* Content */}
      {mounted && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 relative z-[1] w-full">
          <h2 className="text-xl font-bold text-white mb-6 animate-fade-in animation-delay-400">
            Open Positions
          </h2>

          {/* Job Listing */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8 transition-all duration-300 hover:border-blue-400/30 hover:bg-white/[0.05] animate-fade-in-up animation-delay-400">
            <h3 className="text-2xl font-semibold text-blue-400 mb-1">Environment Artist</h3>
            <p className="text-gray-400 text-sm mb-5">Unpaid Internship - Remote</p>

            <p className="text-gray-300 leading-relaxed mb-6">
              We're offering an exciting unpaid internship opportunity for an aspiring Environment
              Artist to gain hands-on experience in game development. You'll work alongside our team
              to design and build immersive environments while developing your skills in a
              real-world setting.
            </p>

            {/* Requirements */}
            <div className="mb-6">
              <h4 className="text-blue-400 font-medium mb-3">Requirements:</h4>
              <ul className="space-y-2">
                {requirements.map((req) => (
                  <li
                    key={req}
                    className="text-gray-300 text-sm pl-5 relative before:content-['\u25B8'] before:text-blue-400 before:absolute before:left-0"
                  >
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nice to have */}
            <div className="mb-8">
              <h4 className="text-blue-400 font-medium mb-3">Nice to Have:</h4>
              <ul className="space-y-2">
                {niceToHave.map((item) => (
                  <li
                    key={item}
                    className="text-gray-300 text-sm pl-5 relative before:content-['\u25B8'] before:text-blue-400 before:absolute before:left-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="mailto:careers@spark-games.co.uk?subject=Environment Artist Application"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-400 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(104,176,245,0.4)] btn-shimmer"
            >
              Apply Now
            </a>
          </div>

          {/* Why Join */}
          <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-500/[0.03] to-blue-500/[0.08] border border-blue-400/20 animate-fade-in animation-delay-600">
            <h3 className="text-lg font-semibold text-white mb-4">
              Why Join {SITE_NAME.replace('Website', '')}?
            </h3>
            <ul className="space-y-3">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2.5 text-gray-300 text-sm">
                  <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="mt-auto">
        <LegalPageFooter />
      </div>
    </div>
  );
}
