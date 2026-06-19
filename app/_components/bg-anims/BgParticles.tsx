'use client';

// Floating particle dots that drift randomly across the container.
// Uses CSS custom properties for per-particle randomization.

import { useEffect, useState } from 'react';
import './BgParticles.css';

interface Particle {
  left: string;
  top: string;
  dx: string;
  dy: string;
  scale: string;
  opacity: string;
  duration: string;
  delay: string;
}

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    left: `${(Math.random() * 100).toFixed(1)}%`,
    top: `${(Math.random() * 100).toFixed(1)}%`,
    dx: `${((Math.random() - 0.5) * 20).toFixed(1)}vw`,
    dy: `${((Math.random() - 0.5) * 20).toFixed(1)}vh`,
    scale: `${(Math.random() * 2 + 1).toFixed(1)}`,
    opacity: `${(Math.random() * 0.5 + 0.3).toFixed(2)}`,
    duration: `${(Math.random() * 20 + 15).toFixed(1)}s`,
    delay: `${(Math.random() * 5).toFixed(1)}s`,
  }));
}

export function BgParticles({ count = 80, color = '#818cf8' }: { count?: number; color?: string }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(buildParticles(count));
  }, [count]);

  if (!particles.length) return null;

  return (
    <div
      className="pg-wrap"
      aria-hidden="true"
      style={{ '--pg-color': color } as React.CSSProperties}
    >
      {particles.map((p, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: randomized once, order never changes
          key={i}
          className="pg-dot"
          style={
            {
              left: p.left,
              top: p.top,
              '--dx': p.dx,
              '--dy': p.dy,
              '--s': p.scale,
              '--o': p.opacity,
              animationDuration: p.duration,
              animationDelay: p.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
