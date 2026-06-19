'use client';

// Spawns a shooting star at every click position; always active regardless of app settings.
// Uses useEffect (client-only) per Next.js hydration guidelines.

import { useEffect, useRef, useState } from 'react';
import './BgClickShootingStars.css';

// The CSS animation moves the star by (-TRAVEL * cos(315°), -TRAVEL * sin(315°)) in screen coords.
// To make the star ARRIVE at the click point, spawn it at the inverse offset so the
// destination lands exactly on (e.clientX, e.clientY).
const TRAVEL_PX = 700;
const ANGLE_RAD = (315 * Math.PI) / 180;
const ANIM_DX = -TRAVEL_PX * Math.cos(ANGLE_RAD); // ≈ -495 (leftward)
const ANIM_DY = -TRAVEL_PX * Math.sin(ANGLE_RAD); // ≈ +495 (downward)

type ClickStar = { id: number; x: number; y: number; dur: string };

export function BgClickShootingStars() {
  const [stars, setStars] = useState<ClickStar[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Spawn upper-right of click so the star travels and arrives at (clientX, clientY)
      setStars((prev) => [
        ...prev,
        {
          id: idRef.current++,
          x: e.clientX - ANIM_DX, // cx + 495 → star starts right of click
          y: e.clientY - ANIM_DY, // cy - 495 → star starts above click
          dur: `${(Math.random() * 0.4 + 0.5).toFixed(2)}s`,
        },
      ]);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  if (!stars.length) return null;

  return (
    <div className="ss-c-wrap" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="ss-c"
          style={{ left: s.x, top: s.y, animationDuration: s.dur }}
          onAnimationEnd={() => setStars((prev) => prev.filter((x) => x.id !== s.id))}
        />
      ))}
    </div>
  );
}
