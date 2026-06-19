'use client';

// Slowly drifting gradient background using the app's primary theme color.
// The gradient is rendered at low opacity so it doesn't overpower content.

import { useEffect, useState } from 'react';
import './BgGradient.css';

interface BgGradientProps {
  primaryColor?: string;
  speed?: number;
}

export function BgGradient({ primaryColor = '#14b8a6', speed = 5 }: BgGradientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const duration = `${28 / (speed / 5)}s`;

  return (
    <div
      className="grad-wrap"
      aria-hidden="true"
      style={{ '--grad-color': primaryColor, animationDuration: duration } as React.CSSProperties}
    />
  );
}
