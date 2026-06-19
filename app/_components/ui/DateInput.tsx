'use client';

import { Calendar as CalendarIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DayPicker, type Matcher } from 'react-day-picker';
import { createPortal } from 'react-dom';
import 'react-day-picker/src/style.css';
import styles from '@/app/_components/date-input/DateInput.module.css';

export function DateInput({
  id,
  value,
  onChange,
  variant = 'underline',
  min,
  max,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  variant?: 'underline' | 'pill';
  min?: string;
  max?: string;
}) {
  const [open, setOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        popoverRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPopoverStyle({
      position: 'fixed',
      top: rect.bottom + 4,
      left: rect.left,
      zIndex: 9999,
    });
  }, [open]);

  const selected = value ? new Date(`${value}T00:00:00`) : undefined;
  const formatted = selected
    ? selected.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Select date';

  const disabled: Matcher[] = [];
  if (min) disabled.push({ before: new Date(`${min}T00:00:00`) });
  if (max) disabled.push({ after: new Date(`${max}T00:00:00`) });

  function handleSelect(date: Date | undefined) {
    if (date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      onChange(`${y}-${m}-${d}`);
    }
    setOpen(false);
  }

  const trigger =
    variant === 'pill' ? (
      <>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard navigation handled by DayPicker inside the portal */}
        <div
          id={id}
          ref={triggerRef}
          className="flex items-center gap-1.5 px-2 py-1 bg-gray-900 border border-white/[0.07] rounded-md cursor-pointer hover:border-white/20 transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          <CalendarIcon suppressHydrationWarning className="h-5 w-5 text-gray-500 flex-shrink-0" />
          <span className={`text-[11px] ${value ? 'text-gray-300' : 'text-gray-600'}`}>
            {formatted}
          </span>
        </div>
      </>
    ) : (
      <>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: keyboard navigation handled by DayPicker inside the portal */}
        <div
          id={id}
          ref={triggerRef}
          className={`${styles.input} flex items-center gap-1.5 cursor-pointer focus-within:[border-bottom-color:rgb(255_255_255/0.3)]`}
          onClick={() => setOpen((o) => !o)}
        >
          <CalendarIcon suppressHydrationWarning className="h-5 w-5 text-gray-600 flex-shrink-0" />
          <span className={`text-xs flex-1 ${value ? 'text-white' : 'text-gray-700'}`}>
            {formatted}
          </span>
        </div>
      </>
    );

  return (
    <>
      {trigger}
      {open &&
        createPortal(
          <div ref={popoverRef} className={styles.calendarPopover} style={popoverStyle}>
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              disabled={disabled.length > 0 ? disabled : undefined}
              className={styles.darkCalendar}
              captionLayout="dropdown"
              showOutsideDays
              components={{
                Dropdown: ({ value, onChange, options }) => (
                  <select value={value} onChange={onChange} className={styles.calendarDropdown}>
                    {options?.map((opt) => (
                      <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ),
              }}
              footer={
                <button
                  type="button"
                  className="w-full mt-1 py-1 text-[11px] text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleSelect(new Date())}
                >
                  Today
                </button>
              }
            />
          </div>,
          document.body
        )}
    </>
  );
}
