'use client';

import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LottiePlayerProps {
  animationData: object;
  width?: number;
  height?: number;
  loop?: boolean | number;
  className?: string;
  style?: React.CSSProperties;
}

export function LottiePlayer({
  animationData,
  width,
  height,
  loop = true,
  className,
  style,
}: LottiePlayerProps) {
  return (
    <span className={className} style={{ display: 'inline-flex', width, height, ...style }}>
      <Lottie animationData={animationData} loop={loop} style={{ width: '100%', height: '100%' }} />
    </span>
  );
}
