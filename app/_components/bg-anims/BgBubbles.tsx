'use client';

// To remove this effect, delete this file and remove <BgBubbles /> plus its import from the parent.
import './BgBubbles.css';

// [left, sizePx, durationSec, delaySec, color, boxShadow]
const B: [string, number, number, number, string, string][] = [
  ['2%', 9, 17, 0, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['6%', 20, 22, 3, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['10%', 13, 19, 1, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['15%', 25, 26, 6, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['19%', 7, 13, 2, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['23%', 16, 20, 8, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['27%', 11, 16, 4, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['31%', 22, 24, 0, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['35%', 8, 14, 9, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['39%', 18, 21, 5, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['43%', 14, 18, 2, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['47%', 9, 15, 11, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['51%', 23, 25, 7, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['55%', 11, 17, 3, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['59%', 17, 20, 1, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['63%', 20, 23, 6, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['67%', 12, 16, 10, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['71%', 26, 28, 4, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['75%', 8, 13, 0, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['78%', 15, 19, 8, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['82%', 10, 22, 2, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['85%', 19, 24, 5, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['88%', 13, 18, 9, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['91%', 24, 26, 3, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['93%', 10, 15, 7, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['95%', 16, 21, 12, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['97%', 8, 17, 1, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['99%', 21, 23, 6, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
  ['5%', 14, 27, 10, '#4fc3dc', '0 0 8px #4fc3dc55,0 0 4px #4fc3dc,0 0 24px #4fc3dc33'],
  ['50%', 18, 25, 4, '#ff2d75', '0 0 8px #ff2d7555,0 0 4px #ff2d75,0 0 24px #ff2d7533'],
];

interface BgBubblesProps {
  speed?: number;
}

export function BgBubbles({ speed = 5 }: BgBubblesProps) {
  const speedFactor = speed / 5;
  return (
    <div className="bb-wrap" aria-hidden="true">
      {B.map(([left, size, dur, delay, background, boxShadow], i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: static immutable array, order never changes
          key={i}
          className="bb"
          style={{
            left,
            width: size,
            height: size,
            animationDuration: `${dur / speedFactor}s`,
            animationDelay: `${delay}s`,
            background,
            boxShadow,
          }}
        />
      ))}
    </div>
  );
}
