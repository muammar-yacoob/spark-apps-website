'use client';

import { Tooltip } from '@/app/_components/ui/Tooltip';
import styles from '../dashboard.module.css';

// ── Donut chart ──────────────────────────────────────────────────────────────

export function DonutChart({
  value,
  max,
  label,
  color,
}: { value: number; max: number; label: string; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const filled = max > 0 ? (value / max) * circ : 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={88} height={88} viewBox="0 0 88 88" aria-hidden="true">
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke="rgb(255 255 255 / 0.06)"
          strokeWidth="8"
        />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
          className={styles.donutArc}
          style={{ '--filled': filled, '--circ': circ } as React.CSSProperties}
        />
        <text
          x="44"
          y="44"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-white text-sm font-bold"
        >
          {value}
        </text>
      </svg>
      <span className="text-[11px] text-gray-500">{label}</span>
    </div>
  );
}

// ── Bar chart ────────────────────────────────────────────────────────────────

export function MiniBarChart({
  data,
}: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-3 h-28">
      {data.map((d) => (
        <Tooltip
          key={d.label}
          title={d.label}
          content={
            <p className="text-[11px] text-gray-400">
              <span className="text-white font-semibold">{d.value}</span> rows
            </p>
          }
        >
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className="w-full rounded-t transition-all duration-700"
              style={{
                height: `${Math.max((d.value / max) * 90, 4)}px`,
                background: d.color,
                minWidth: 24,
              }}
            />
            <span className="text-[10px] text-gray-500 truncate max-w-[60px]">{d.label}</span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}
