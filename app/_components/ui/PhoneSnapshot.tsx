'use client';

/**
 * The static version of the phone preview: a real screenshot of the app's own
 * dashboard at narrow width, dropped into the same device frame as PhoneDemo.
 *
 * This is what goes on a shipped app's landing hero (SafeSound, FullHouse) —
 * there is no generated content to render there, and a screenshot of the real
 * thing is more honest than a mockup approximating it. No JSON, no catalog, no
 * client work beyond loading one image.
 *
 * Take the screenshot at 2x the frame's CSS size (536x1080 for the default) so
 * it stays sharp on retina, and crop out the browser chrome and status bar —
 * the frame draws its own.
 *
 * Ships identically in spark-stack and expotemplate-site — keep them in sync.
 */

import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { PhoneFrame } from './PhoneFrame';

export interface PhoneSnapshotProps {
  /** Screenshot of the app at narrow width. Local asset or absolute URL. */
  src: string;
  /** Describe what the screen shows — this is content, not decoration. */
  alt: string;
  /** Tints the bezel and status bar so the frame matches the app. */
  accent?: string;
  accentHover?: string;
  width?: number;
  height?: number;
  caption?: string;
  /** Slowly pans the image to suggest scroll depth. Off by default. */
  pan?: boolean;
  /** Fired when the screenshot fails to load, so the caller can hide the frame. */
  onError?: () => void;
}

export function PhoneSnapshot({
  src,
  alt,
  accent,
  accentHover,
  width,
  height,
  caption,
  pan = false,
  onError,
}: PhoneSnapshotProps) {
  // The markup is server-rendered, so a 404 on the screenshot fires its error
  // before React attaches onError and the handler never runs. A ref callback
  // catches the case that already happened: a finished load with no pixels.
  const catchDeadImage = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth === 0) onError?.();
    },
    [onError]
  );

  return (
    <PhoneFrame
      accent={accent}
      accentHover={accentHover}
      width={width}
      height={height}
      caption={caption}
    >
      <div className="absolute inset-0 top-9 overflow-hidden">
        {/* biome-ignore lint/performance/noImgElement: the source may be a remote or generated screenshot URL, and motion.img drives the pan; next/image doesn't compose with framer-motion the same way. */}
        <motion.img
          ref={catchDeadImage}
          src={src}
          alt={alt}
          onError={onError}
          className="w-full object-cover object-top"
          initial={pan ? { y: 0 } : false}
          animate={pan ? { y: ['0%', '-18%', '0%'] } : undefined}
          transition={
            pan ? { duration: 18, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : undefined
          }
        />
      </div>
    </PhoneFrame>
  );
}
