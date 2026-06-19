'use client';

import { BgShootingStars } from '@/app/_components/bg-anims/BgShootingStars';
import { LegalPageFooter } from '@/app/_components/layout/LegalPageFooter';
import { SITE_NAME } from '@/lib/config/site';
import { teamMembers } from '@/lib/data/team';
import type { TeamMember } from '@/lib/data/team';
import { ArrowLeft } from 'lucide-react';
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

      {/* Avatar */}
      <div className="relative inline-block mb-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] rounded-full bg-[radial-gradient(circle,transparent_40%,rgba(104,176,245,0.25)_50%,transparent_60%)] animate-pulse-gentle" />
        <Image
          src={member.avatar}
          alt={member.role}
          width={110}
          height={110}
          className="relative z-[2] rounded-full border-[3px] border-blue-400/60 shadow-[0_8px_24px_rgba(104,176,245,0.25)] object-cover bg-white/[0.03] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
        />
      </div>

      {/* Info */}
      <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
      <p className="text-blue-400 text-sm font-medium mb-4">{member.role}</p>

      {/* Quote */}
      <div className="relative h-12 flex items-center justify-center px-4 mb-3">
        <span className="text-gray-400 text-sm italic before:content-['\u201C'] before:text-blue-400/50 before:text-lg before:mr-0.5 after:content-['\u201D'] after:text-blue-400/50 after:text-lg after:ml-0.5">
          {quote}
          {isTyping && (
            <span className="inline-block w-[2px] h-[14px] bg-blue-400 ml-0.5 align-middle animate-pulse" />
          )}
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
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 mt-5 px-5 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-400 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(104,176,245,0.4)] btn-shimmer"
        >
          Apply Now
        </Link>
      )}
    </div>
  );
}

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
            <Link href="/careers" className="hover:text-white transition-colors">
              Careers
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
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white transition-all mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
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

          {/* Join CTA */}
          <div className="mt-10 text-center p-8 rounded-2xl bg-gradient-to-br from-blue-500/[0.03] to-blue-500/[0.08] border border-blue-400/20 animate-fade-in animation-delay-800">
            <h3 className="text-xl font-semibold text-white mb-2">Want to Join Our Team?</h3>
            <p className="text-gray-400 text-sm mb-5">
              We're always looking for talented individuals who can quote The Office and ship great
              games.
            </p>
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-400 transition-all duration-200 hover:-translate-y-0.5 btn-shimmer"
            >
              View Positions
            </Link>
          </div>
        </section>
      )}

      <div className="mt-auto">
        <LegalPageFooter />
      </div>
    </div>
  );
}
