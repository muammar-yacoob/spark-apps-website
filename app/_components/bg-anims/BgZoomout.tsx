'use client';

// To remove: delete this file and remove <BgZoomout /> + its import from the parent.
// Pass image public paths: <BgZoomout images={['/app-icons/demo.png', ...]} />

import { useEffect, useState } from 'react';
import './BgZoomout.css';

type I = {
  src: string;
  sz: number;
  tx: number;
  ty: number;
  dur: string;
  spinDur: string;
  delay: string;
};

function build(imgs: string[]): I[] {
  // Each image gets floor(20/n) slots; remainder distributed one each to random images
  const base = Math.floor(20 / imgs.length);
  const extra = 20 % imgs.length;
  const shuffledImgs = [...imgs].sort(() => Math.random() - 0.5);
  const pool: string[] = [];
  for (let j = 0; j < shuffledImgs.length; j++) {
    const count = base + (j < extra ? 1 : 0);
    for (let k = 0; k < count; k++) pool.push(shuffledImgs[j]);
  }
  for (let j = pool.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [pool[j], pool[k]] = [pool[k], pool[j]];
  }

  return Array.from({ length: 20 }, (_, i) => {
    const sz = Math.floor(Math.random() * 70) + 30;
    return {
      src: pool[i],
      sz,
      tx: Math.floor(Math.random() * 1200) - 600,
      ty: Math.floor(Math.random() * 800) - 400,
      dur: `${(Math.random() * 6 + 8).toFixed(1)}s`,
      spinDur: `${(Math.random() * 10 + 15).toFixed(1)}s`,
      delay: `${(i * -0.5).toFixed(1)}s`,
    };
  });
}

export function BgZoomout({ images }: { images: string[] }) {
  const [items, setItems] = useState<I[]>([]);
  useEffect(() => {
    if (images.length) setItems(build(images));
  }, [images]);
  if (!items.length) return null;

  return (
    <div className="zo-wrap" aria-hidden="true">
      {items.map((it, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: randomised once in useEffect and the order never changes
          key={i}
          className="zo-item"
          style={
            {
              width: it.sz,
              height: it.sz,
              marginLeft: -it.sz / 2,
              marginTop: -it.sz / 2,
              '--tx': `${it.tx}px`,
              '--ty': `${it.ty}px`,
              '--dur': it.dur,
              '--spin-dur': it.spinDur,
              '--delay': it.delay,
            } as React.CSSProperties
          }
        >
          <img src={it.src} alt="" className="zo-img" loading="lazy" decoding="async" />
        </div>
      ))}
    </div>
  );
}
