'use client';

import { BgShootingStars } from '@/app/_components/bg-anims/BgShootingStars';
import { LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';
import { SITE_NAME } from '@/lib/config/site';
import { teamMembers } from '@/lib/data/team';
import type { TeamMember } from '@/lib/data/team';
import { ArrowLeft, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [quote, setQuote] = useState('Hover to see a quote...');
  const [isTyping, setIsTyping] = useState(false);
  const quoteIndexRef = useRef(0);
  const typingRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const typeQuote = useCallback((text: string) => {
    setIsTyping(true);
    setQuote('');
    let i = 0;
    const type = () => {
      if (i < text.length) {
        setQuote((prev) => prev + text.charAt(i));
        i++;
        typingRef.current = setTimeout(type, 40);
      } else {
        setIsTyping(false);
      }
    };
    type();
  }, []);

  const handleMouseEnter = () => {
    if (isTyping) return;
    if (typingRef.current) clearTimeout(typingRef.current);
    const q = member.quotes[quoteIndexRef.current % member.quotes.length];
    quoteIndexRef.current++;
    typeQuote(q);
  };

  const handleMouseLeave = () => {
    if (typingRef.current) clearTimeout(typingRef.current);
    setIsTyping(false);
    setQuote('Hover to see a quote...');
  };

  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  return (
    <div
      className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center transition-all duration-300 hover:border-blue-400/30 hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(104,176,245,0.1)] animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {member.isVacancy && (
        <div className="absolute top-0 right-0 w-[120px] h-[120px] overflow-hidden z-10 pointer-events-none">
          <div className="absolute top-[22px] right-[-35px] w-[160px] bg-red-500 text-white text-[0.6rem] font-bold uppercase tracking-wider py-1.5 text-center rotate-45 shadow-lg">
            New Opening
          </div>
        </div>
      )}

      {/* Avatar - circular mask */}
      <div className="relative inline-block mb-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] rounded-full bg-[radial-gradient(circle,transparent_40%,rgba(104,176,245,0.25)_50%,transparent_60%)] animate-pulse-gentle" />
        <div className="relative z-[2] w-[110px] h-[110px] rounded-full overflow-hidden border-[3px] border-blue-400/60 shadow-[0_8px_24px_rgba(104,176,245,0.25)] bg-white/[0.03] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Image
            src={member.avatar}
            alt={member.role}
            width={110}
            height={110}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
      <p className="text-blue-400 text-sm font-medium mb-4">{member.role}</p>

      {/* Quote */}
      <div className="relative h-12 flex items-center justify-center px-4 mb-3">
        <span className="text-gray-400 text-sm italic">
          <span className="text-blue-400/50 text-lg mr-0.5">{'\u201C'}</span>
          {quote}
          {isTyping && (
            <span className="inline-block w-[2px] h-[14px] bg-blue-400 ml-0.5 align-middle animate-pulse" />
          )}
          <span className="text-blue-400/50 text-lg ml-0.5">{'\u201D'}</span>
        </span>
      </div>

      <p className="text-gray-500 text-xs mb-4">- {member.show}</p>

      {/* Skills */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {member.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full transition-all duration-200 hover:bg-blue-400/20 hover:border-blue-400/40 hover:scale-105"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Apply button for vacancies */}
      {member.isVacancy && (
        <a
          href="#openings"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-400 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(104,176,245,0.4)] btn-shimmer"
        >
          Apply Now
        </a>
      )}
    </div>
  );
}

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
];

const perks = [
  'Work on exciting game projects with creative freedom',
  'Fully remote position - work from anywhere',
  'Collaborative team that loves TV show references',
  'Valuable learning experience and portfolio development',
];

export function TeamPageClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sort vacancies first
  const sorted = [...teamMembers].sort((a, b) => {
    if (a.isVacancy && !b.isVacancy) return -1;
    if (!a.isVacancy && b.isVacancy) return 1;
    return 0;
  });

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
            Meet The Team
          </h1>
          <p className="mt-3 text-base text-gray-400 leading-relaxed max-w-xl mx-auto animate-fade-in animation-delay-200">
            A diverse group of passionate creators, united by our love for gaming and questionable
            taste in TV shows.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      {mounted && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 relative z-[1] w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {sorted.map((member, i) => (
              <TeamMemberCard key={member.id} member={member} index={i} />
            ))}
          </div>

          {/* Open Positions */}
          <div id="openings" className="scroll-mt-20 mt-12">
            <h2 className="text-2xl font-bold text-white mb-6 animate-fade-in">Open Positions</h2>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8 transition-all duration-300 hover:border-blue-400/30 hover:bg-white/[0.05] animate-fade-in-up animation-delay-200">
              <h3 className="text-xl font-semibold text-blue-400 mb-1">Environment Artist</h3>
              <p className="text-gray-400 text-sm mb-4">Unpaid Internship - Remote</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-5">
                Exciting internship for an aspiring Environment Artist to gain hands-on experience
                in game development. Work alongside our team to design and build immersive
                environments.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-blue-400 text-sm font-medium mb-2">Requirements:</h4>
                  <ul className="space-y-1.5">
                    {requirements.map((req) => (
                      <li
                        key={req}
                        className="text-gray-300 text-xs pl-4 relative before:content-['\u25B8'] before:text-blue-400 before:absolute before:left-0 before:text-[10px]"
                      >
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-blue-400 text-sm font-medium mb-2">Nice to Have:</h4>
                  <ul className="space-y-1.5">
                    {niceToHave.map((item) => (
                      <li
                        key={item}
                        className="text-gray-300 text-xs pl-4 relative before:content-['\u25B8'] before:text-blue-400 before:absolute before:left-0 before:text-[10px]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href="mailto:careers@spark-games.co.uk?subject=Environment Artist Application"
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-400 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(104,176,245,0.4)] btn-shimmer"
              >
                Apply Now
              </a>
            </div>

            {/* Perks */}
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-blue-500/[0.03] to-blue-500/[0.08] border border-blue-400/20 animate-fade-in animation-delay-400">
              <h3 className="text-base font-semibold text-white mb-3">Why Join Us?</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-gray-300 text-xs">
                    <Check className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <div className="mt-auto">
        <LegalPageFooter />
      </div>
    </div>
  );
}
