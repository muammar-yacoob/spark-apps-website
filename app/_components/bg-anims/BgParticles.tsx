'use client';

// Slow-drifting dots, ported from the spark-ai bg-anims pack.
// To remove: delete this file, remove the export from index.ts, and remove
// <BgParticles /> + its import from the parent.
import { type CSSProperties, useEffect, useState } from 'react';
import { THEME_COLOR } from '@/lib/config/site';
import './BgParticles.css';

type Dot = {
  left: string;
  top: string;
  dx: string;
  dy: string;
  s: string;
  o: string;
  dur: string;
  delay: string;
};

function build(count: number): Dot[] {
  return Array.from({ length: count }, () => ({
    left: `${(Math.random() * 100).toFixed(1)}%`,
    top: `${(Math.random() * 100).toFixed(1)}%`,
    dx: `${((Math.random() - 0.5) * 20).toFixed(1)}vw`,
    dy: `${((Math.random() - 0.5) * 20).toFixed(1)}vh`,
    s: (Math.random() * 2 + 1).toFixed(2),
    o: (Math.random() * 0.5 + 0.3).toFixed(2),
    dur: `${(Math.random() * 20 + 15).toFixed(1)}s`,
    delay: `${(Math.random() * -5).toFixed(1)}s`,
  }));
}

interface BgParticlesProps {
  count?: number;
  color?: string;
}

export function BgParticles({ count = 80, color = THEME_COLOR }: BgParticlesProps) {
  const [dots, setDots] = useState<Dot[]>([]);

  // Randomised on the client only; server-rendering it would mismatch on hydration.
  useEffect(() => {
    setDots(build(count));
  }, [count]);

  if (!dots.length) return null;

  return (
    <div className="pg-wrap" aria-hidden="true" style={{ '--pg-color': color } as CSSProperties}>
      {dots.map((d, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: randomised once in useEffect and the order never changes
          key={i}
          className="pg-dot"
          style={
            {
              left: d.left,
              top: d.top,
              '--dx': d.dx,
              '--dy': d.dy,
              '--s': d.s,
              '--o': d.o,
              animationDuration: d.dur,
              animationDelay: d.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
