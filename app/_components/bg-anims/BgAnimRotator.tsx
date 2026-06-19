'use client';

// Rotates through background animations on each page refresh.
// Pass `images` (public paths) for the BgZoomout effect to use.

import { useEffect, useState } from 'react';
import { BgBokeh } from './BgBokeh';
import { BgBubbles } from './BgBubbles';
import { BgZoomout } from './BgZoomout';

const KEY = 'bg-anim-idx';
const COUNT = 3;

const NO_IMAGES: string[] = [];

export function BgAnimRotator({ images = NO_IMAGES }: { images?: string[] }) {
  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    const cur = Number(sessionStorage.getItem(KEY) ?? 0) % COUNT;
    sessionStorage.setItem(KEY, String((cur + 1) % COUNT));
    setIdx(cur);
  }, []);

  if (idx === null) return null;
  if (idx === 0) return <BgBubbles />;
  if (idx === 1) return <BgZoomout images={images} />;
  return <BgBokeh />;
}
