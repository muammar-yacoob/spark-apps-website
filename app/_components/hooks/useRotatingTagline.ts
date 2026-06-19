import { TAGLINES } from '@/lib/config/taglines';
import { useEffect, useState } from 'react';

/** Cycles through TAGLINES at the given interval (ms). */
export function useRotatingTagline(interval = 3000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TAGLINES.length);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  return { tagline: TAGLINES[index], index };
}
