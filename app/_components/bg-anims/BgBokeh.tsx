'use client';

// To remove: delete this file and remove <BgBokeh /> + its import from the parent.
// Each span is invisible, and only its box-shadow (the bokeh orb) is visible, orbiting
// a random transform-origin as it rotates.

import { useEffect, useState } from 'react';
import './BgBokeh.css';

type P = {
  top: string;
  left: string;
  dur: string;
  delay: string;
  origin: string;
  shadow: string;
};

function build(primaryColor: string): P[] {
  return Array.from({ length: 20 }, () => {
    const x = Math.random() > 0.5 ? 1 : -1;
    const blur = `${((Math.random() + 0.5) * 10).toFixed(1)}vmin`;
    return {
      top: `${(Math.random() * 100).toFixed(1)}%`,
      left: `${(Math.random() * 100).toFixed(1)}%`,
      dur: `${(Math.random() * 12 + 20).toFixed(1)}s`,
      delay: `${(Math.random() * -32).toFixed(1)}s`,
      origin: `${(Math.random() * 50 - 25).toFixed(1)}vw ${(Math.random() * 50 - 25).toFixed(1)}vh`,
      shadow: `${40 * x}vmin 0 ${blur} ${primaryColor}`,
    };
  });
}

interface BgBokehProps {
  primaryColor?: string;
  speed?: number;
}

export function BgBokeh({ primaryColor = '#14b8a6', speed = 5 }: BgBokehProps) {
  const [particles, setParticles] = useState<P[]>([]);
  useEffect(() => {
    setParticles(build(primaryColor));
  }, [primaryColor]);
  const speedFactor = speed / 5;
  if (!particles.length) return null;

  return (
    <div className="bk-wrap" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: randomised once in useEffect and the order never changes
          key={i}
          className="bk-p"
          style={{
            top: p.top,
            left: p.left,
            animationDuration: `${Number.parseFloat(p.dur) / speedFactor}s`,
            animationDelay: p.delay,
            transformOrigin: p.origin,
            boxShadow: p.shadow,
          }}
        />
      ))}
    </div>
  );
}
