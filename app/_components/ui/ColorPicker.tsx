'use client';

import { Pipette } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const inputClass =
  'w-full bg-transparent text-xs text-white border-0 border-b border-white/15 outline-none pb-0.5 transition-colors placeholder:text-gray-600 focus:border-white/30';

export function ColorPicker({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hasEyeDropper, setHasEyeDropper] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasEyeDropper('EyeDropper' in window);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  async function pickWithEyeDropper() {
    try {
      const dropper = new (
        window as unknown as { EyeDropper: new () => { open(): Promise<{ sRGBHex: string }> } }
      ).EyeDropper();
      const result = await dropper.open();
      onChange(result.sRGBHex);
    } catch {
      // user cancelled or API unavailable
    }
  }

  const displayColor = /^#[0-9a-fA-F]{3,8}$/.test(value) ? value : '#68b0f5';

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-6 w-7 rounded border border-white/15 cursor-pointer flex-shrink-0 transition-transform hover:scale-110"
        style={{ background: displayColor }}
        title={value}
      />
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        placeholder="#68b0f5"
        spellCheck={false}
      />
      {open && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-[#0d0d12] border border-white/[0.08] rounded-lg shadow-[0_8px_32px_rgb(0_0_0/0.6)] p-2.5 flex flex-col gap-2">
          <HexColorPicker
            color={displayColor}
            onChange={onChange}
            style={{ width: 180, height: 140, borderRadius: 8 }}
          />
          <div className="flex items-center gap-1.5 mt-1.5">
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`${inputClass} text-[11px] font-mono flex-1`}
              placeholder="#68b0f5"
              spellCheck={false}
            />
            {hasEyeDropper && (
              <button
                type="button"
                onClick={pickWithEyeDropper}
                className="flex-shrink-0 p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors"
                title="Pick color from screen"
              >
                <Pipette suppressHydrationWarning className="h-[22px] w-[22px]" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
