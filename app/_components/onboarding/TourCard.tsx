'use client';

/**
 * Generic onboarding tour card -- pure presentation, zero app logic.
 * Knows nothing about onborda, localStorage, or app-specific events.
 *
 * Viewport handling:
 *   >= 640px  Floating card near the target, clamped inside the viewport.
 *   <  640px  Portalled to document.body as a fixed bottom sheet.
 */

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const NARROW_BP = 640;

const peekInjected = { current: false };
function injectPeekCSS() {
  if (peekInjected.current || typeof document === 'undefined') return;
  peekInjected.current = true;
  const s = document.createElement('style');
  s.textContent = `@keyframes lottie-peek {
    0%   { transform: translate(-50%, 30%) rotate(180deg); opacity: 0 }
    30%  { opacity: 1 }
    60%  { transform: translate(-50%, -70%) rotate(-10deg) }
    80%  { transform: translate(-50%, -65%) rotate(5deg) }
    100% { transform: translate(-50%, -68%) rotate(0deg); opacity: 1 }
  }`;
  document.head.appendChild(s);
}

function PeekLottie({
  data,
  delay = 800,
  pause = 5000,
}: // biome-ignore lint/suspicious/noExplicitAny: Lottie JSON shape varies
{ data: any; delay?: number; pause?: number }) {
  const [visible, setVisible] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    injectPeekCSS();
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (playing) return;
    const t = setTimeout(() => {
      setCycle((c) => c + 1);
      setPlaying(true);
    }, pause);
    return () => clearTimeout(t);
  }, [playing, pause]);

  if (!visible) return null;

  return (
    <span
      className="absolute left-1/2 bottom-0 pointer-events-none z-10"
      style={{ animation: 'lottie-peek .6s cubic-bezier(.22,1,.36,1) forwards' }}
    >
      <Lottie
        key={cycle}
        animationData={data}
        loop={false}
        onComplete={() => setPlaying(false)}
        className="w-9 h-9"
      />
    </span>
  );
}

// -- Card ---------------------------------------------------------------------

export interface TourCardProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  arrow: ReactNode;
  iconSrc?: string;
  title: string;
  body: ReactNode;
  step: number;
  total: number;
  // biome-ignore lint/suspicious/noExplicitAny: Lottie JSON shape varies
  animationData?: any;
  warning?: boolean;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
}

export function TourCard({
  cardRef,
  arrow,
  iconSrc,
  title,
  body,
  step,
  total,
  animationData,
  warning,
  onBack,
  onSkip,
  onNext,
}: TourCardProps) {
  const isFirst = step === 0;
  const isLast = step === total - 1;
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < NARROW_BP);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const clampRaf = useRef(0);
  // biome-ignore lint/correctness/useExhaustiveDependencies: step triggers re-clamp on navigation
  useEffect(() => {
    if (narrow) return;
    const el = cardRef.current;
    if (!el) return;
    const clamp = () => {
      const r = el.getBoundingClientRect();
      const pad = 8;
      let dx = 0;
      let dy = 0;
      if (r.left < pad) dx = pad - r.left;
      else if (r.right > window.innerWidth - pad) dx = window.innerWidth - pad - r.right;
      if (r.top < pad) dy = pad - r.top;
      else if (r.bottom > window.innerHeight - pad) dy = window.innerHeight - pad - r.bottom;
      el.style.transform = dx || dy ? `translate(${dx}px,${dy}px)` : '';
    };
    const tid = setTimeout(() => {
      clampRaf.current = requestAnimationFrame(clamp);
    }, 350);
    window.addEventListener('resize', clamp);
    return () => {
      clearTimeout(tid);
      cancelAnimationFrame(clampRaf.current);
      window.removeEventListener('resize', clamp);
    };
  }, [cardRef, step, narrow]);

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {iconSrc && (
            <img src={iconSrc} alt="" width={22} height={22} className="rounded-sm shrink-0" />
          )}
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="p-1 -mr-1 rounded hover:bg-white/[0.06] transition-colors"
          title="Close tour"
        >
          <X className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>

      {/* Body */}
      <p className="text-xs text-gray-400 leading-relaxed mb-3">{body}</p>

      {/* Warning hint */}
      {warning && (
        <p className="text-[10px] text-amber-400/80 mb-2 animate-pulse">
          Click outside again to skip tour
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-600 tabular-nums">
          {step + 1} / {total}
        </span>
        <div className="flex items-center gap-1.5">
          {!isFirst && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-0.5 px-2 py-1 text-[11px] text-gray-400 hover:text-white border border-white/[0.07] hover:border-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-3 w-3" />
              Back
            </button>
          )}
          {!isLast && (
            <button
              type="button"
              onClick={onSkip}
              className="px-2 py-1 text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
            >
              Skip
            </button>
          )}
          <span className="relative">
            {animationData && <PeekLottie data={animationData} />}
            <button
              type="button"
              onClick={onNext}
              className="relative flex items-center gap-0.5 px-3 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              {isLast ? 'Done' : 'Next'}
              {!isLast && <ChevronRight className="h-3 w-3" />}
            </button>
          </span>
        </div>
      </div>
    </>
  );

  if (narrow) {
    return createPortal(
      <div
        ref={cardRef}
        className={`fixed bottom-0 inset-x-0 z-[9999] bg-[#0c0c0f] rounded-t-xl shadow-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t transition-colors duration-300 ${warning ? 'border-amber-500/40' : 'border-white/[0.1]'}`}
      >
        {content}
      </div>,
      document.body
    );
  }

  return (
    <div
      ref={cardRef}
      className={`relative overflow-visible bg-[#0c0c0f] rounded-xl shadow-2xl w-[280px] p-4 border transition-colors duration-300 ${warning ? 'border-amber-500/40' : 'border-white/[0.1]'}`}
    >
      {arrow}
      {content}
    </div>
  );
}
