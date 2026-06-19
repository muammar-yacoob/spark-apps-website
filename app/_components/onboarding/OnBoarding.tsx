'use client';

import logoAnim from '@/app/_animations/loader-cat.json';
import confetti from 'canvas-confetti';
import { Onborda, OnbordaProvider, useOnborda } from 'onborda';
import type { CardComponentProps, Step } from 'onborda';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { TourCard } from './TourCard';
import rawSteps from './steps.json';

const STORAGE_KEY = 'sparkstack:onboarding-done';
const TOURS = [{ tour: 'dashboard', steps: rawSteps as Step[] }];

export const markOnboardingDone = () => localStorage.setItem(STORAGE_KEY, '1');
export const resetOnboarding = () => localStorage.removeItem(STORAGE_KEY);

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

export function OnBoarding({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== '1') setShow(true);
  }, []);

  return (
    <OnbordaProvider>
      <Onborda
        steps={TOURS}
        showOnborda={show}
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
