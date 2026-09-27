'use client';

import confetti from 'canvas-confetti';
import type { CardComponentProps, Step } from 'onborda';
import { Onborda, OnbordaProvider, useOnborda } from 'onborda';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import logoAnim from '@/app/_animations/loader-cat.json';
import rawSteps from './steps.json';
import { TourCard } from './TourCard';

const STORAGE_KEY = 'sparkstack:onboarding-done';
const TOURS = [{ tour: 'dashboard', steps: rawSteps as Step[] }];

export const markOnboardingDone = () => localStorage.setItem(STORAGE_KEY, '1');
export const resetOnboarding = () => localStorage.removeItem(STORAGE_KEY);
export const isOnboardingDone = () => localStorage.getItem(STORAGE_KEY) === '1';

// -- Logic bridge: onborda CardComponentProps -> TourCard props ----------------

const WARN_TIMEOUT = 3000;

function CardBridge({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}: CardComponentProps) {
  const { closeOnborda } = useOnborda();
  const ref = useRef<HTMLDivElement>(null);
  const [warned, setWarned] = useState(false);
  const warnTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isLast = currentStep === totalSteps - 1;

  const dismiss = useCallback(() => {
    markOnboardingDone();
    closeOnborda();
    toast.info('Replay anytime from the user menu', { duration: 3000 });
  }, [closeOnborda]);

  const advance = () => {
    if (isLast) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      return dismiss();
    }
    nextStep();
  };

  // Click outside: first click warns, second click within 3s dismisses
  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (warned) {
          dismiss();
        } else {
          setWarned(true);
          clearTimeout(warnTimer.current);
          warnTimer.current = setTimeout(() => setWarned(false), WARN_TIMEOUT);
        }
      }
    };
    document.addEventListener('mousedown', on);
    return () => {
      document.removeEventListener('mousedown', on);
      clearTimeout(warnTimer.current);
    };
  }, [dismiss, warned]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset warning when step changes
  useEffect(() => setWarned(false), [currentStep]);

  return (
    <TourCard
      cardRef={ref}
      arrow={arrow}
      iconSrc="/favicon.ico"
      title={step.title}
      body={step.content}
      step={currentStep}
      total={totalSteps}
      animationData={currentStep === 0 || isLast ? logoAnim : undefined}
      warning={warned}
      onBack={prevStep}
      onSkip={dismiss}
      onNext={advance}
    />
  );
}

// -- Provider wrapper ---------------------------------------------------------

/**
 * First session runs welcome -> tour, in that order and never at once.
 *
 * `run` is the dashboard page saying the welcome has finished. The splash is
 * mounted out there, ABOVE the page's loading gate, so it takes the loader's
 * place rather than queueing behind it; this component only mounts once that
 * gate is open, which is also why the tour cannot spotlight a control that has
 * not rendered yet. Both are gated on the one flag below, so the splash shows
 * exactly when the tour does: a returning user gets neither, and replaying the
 * tour replays the welcome with it. Sequenced, never at once, or the tour
 * would spotlight a control nobody can see behind a full-screen overlay.
 */
export function OnBoarding({ children, run }: { children: ReactNode; run: boolean }) {
  const [tour, setTour] = useState(false);

  // The welcome has already given the page nine seconds to render and settle;
  // this only covers the overlay's own fade out, so the first card of the tour
  // does not arrive underneath it.
  useEffect(() => {
    if (!run) return;
    const timer = setTimeout(() => setTour(true), 250);
    return () => clearTimeout(timer);
  }, [run]);

  return (
    <OnbordaProvider>
      <Onborda
        steps={TOURS}
        showOnborda={tour}
        shadowRgb="0,0,0"
        shadowOpacity="0.7"
        cardTransition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 26 }}
        cardComponent={CardBridge}
      >
        {children}
      </Onborda>
    </OnbordaProvider>
  );
}
