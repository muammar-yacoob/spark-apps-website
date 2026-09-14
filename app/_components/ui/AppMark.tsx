import { Sparkles } from 'lucide-react';
import { THEME_COLOR } from '@/lib/config/site';

/**
 * The Spark Apps brand mark: the spark glyph lit by a soft accent bloom,
 * the same mark SparkStack uses. Replaces the raw favicon, which rendered
 * as a flat pasted square wherever the brand appeared.
 */
export function AppMark({ size = 22, accent = THEME_COLOR }: { size?: number; accent?: string }) {
  return (
    <span
      className="relative inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {/* Soft accent bloom behind the glyph — reads as a lit app icon without
          reintroducing a solid background plate. */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-[28%] blur-md"
        style={{ background: `radial-gradient(circle at 50% 45%, ${accent}55, transparent 70%)` }}
      />
      <Sparkles
        aria-hidden
        className="relative"
        style={{
          width: size * 0.82,
          height: size * 0.82,
          color: accent,
          filter: `drop-shadow(0 1px 3px ${accent}80)`,
        }}
        strokeWidth={2.25}
        absoluteStrokeWidth
      />
    </span>
  );
}
