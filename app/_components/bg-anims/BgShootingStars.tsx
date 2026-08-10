'use client';

// Shooting stars; only one is in flight at a time, spawned every twelve seconds.
// To remove this effect, delete this file, remove the export from index.ts,
// and remove <BgShootingStars /> from PricingPageContent.
import { useEffect, useRef, useState } from 'react';
import './BgShootingStars.css';

const INTERVAL = 12000;
const MAX = 1;

type Star = { id: number; top: string; right: string; dur: string };

export function BgShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);
  const starsRef = useRef(stars);
  starsRef.current = stars;
  const idRef = useRef(0);

  useEffect(() => {
    const spawn = () => {
      if (starsRef.current.length < MAX) {
        setStars((prev) => [
          ...prev,
          {
            id: idRef.current++,
            top: `${Math.floor(Math.random() * 30)}%`,
            right: `${Math.floor(Math.random() * 80)}%`,
            dur: `${(Math.random() * 1.5 + 1).toFixed(2)}s`,
          },
        ]);
      }
    };
    const id = setInterval(spawn, INTERVAL);
    return () => clearInterval(id);
  }, []);

  if (!stars.length) return null;

  return (
    <div className="ss-wrap" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="ss"
          style={{ top: s.top, right: s.right, animationDuration: s.dur }}
          onAnimationEnd={() => setStars((prev) => prev.filter((x) => x.id !== s.id))}
        />
      ))}
    </div>
  );
}
