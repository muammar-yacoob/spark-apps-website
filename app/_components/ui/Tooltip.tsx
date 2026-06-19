'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Self-contained animated hover tooltip.
 *
 * Renders via a portal so it escapes overflow:clip panels without clipping.
 */

// ── Animation styles (injected once) ────────────────────────────────────────

let stylesInjected = false;

function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;

  const css = `
[data-spark-tooltip-enter] {
  transform-origin: bottom center;
  animation: sparkTooltipIn 130ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
[data-spark-tooltip-exit] {
  transform-origin: bottom center;
  animation: sparkTooltipOut 110ms ease-in both;
}
@keyframes sparkTooltipIn {
  from { opacity: 0; transform: scale(0.82); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes sparkTooltipOut {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.82); }
}`;

  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
}

// ── Hook ────────────────────────────────────────────────────────────────────

function useTooltipState() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter() {
    if (timer.current) clearTimeout(timer.current);
    setClosing(false);
    setVisible(true);
  }

  function handleLeave() {
    setClosing(true);
    timer.current = setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 110);
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return { visible, closing, handleEnter, handleLeave };
}

// ── Bubble (portalled, position:fixed) ──────────────────────────────────────

function TooltipBubble({
  title,
  content,
  align,
  closing,
  rect,
}: {
  title?: string;
  content: ReactNode;
  align: 'center' | 'right' | 'left';
  closing: boolean;
  rect: DOMRect;
}) {
  const gap = 10;

  const left =
    align === 'right' ? rect.right : align === 'left' ? rect.left : rect.left + rect.width / 2;
  const transformX = align === 'right' ? '-100%' : align === 'left' ? '0%' : '-50%';
  const caretClass =
    align === 'right'
      ? 'justify-end pr-2.5'
      : align === 'left'
        ? 'justify-start pl-2.5'
        : 'justify-center';

  return (
    <div
      style={{
        position: 'fixed',
        top: rect.top - gap,
        left,
        transform: `translateX(${transformX}) translateY(-100%)`,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
      {...(closing ? { 'data-spark-tooltip-exit': '' } : { 'data-spark-tooltip-enter': '' })}
    >
      <div className="bg-gray-900 border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[148px]">
        {title ? (
          <p className="text-[10px] text-gray-200 font-medium px-3 pt-2 pb-1 mb-1 border-b border-white/10 whitespace-nowrap">
            {title}
          </p>
        ) : null}
        <div className={title ? 'px-3 pb-2' : ''}>{content}</div>
      </div>
      <div className={`flex ${caretClass}`}>
        <div
          className="w-0 h-0"
          style={{
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid rgba(255,255,255,0.1)',
          }}
        />
      </div>
    </div>
  );
}

// ── Public component ────────────────────────────────────────────────────────

export interface TooltipProps {
  /** Bold header text inside the tooltip. Omit to render `content` flush. */
  title?: string;
  /** Body content (can be any JSX). */
  content: ReactNode;
  /** Horizontal alignment relative to the trigger. */
  align?: 'center' | 'right' | 'left';
  /** CSS classes on the wrapper div. */
  className?: string;
  /** The trigger element(s). */
  children: ReactNode;
}

export function Tooltip({
  title,
  content,
  align = 'center',
  className = 'inline-flex items-center justify-center',
  children,
}: TooltipProps) {
  const { visible, closing, handleEnter, handleLeave } = useTooltipState();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    injectStyles();
    setMounted(true);
  }, []);

  const onEnter = () => {
    if (wrapRef.current) setRect(wrapRef.current.getBoundingClientRect());
    handleEnter();
  };

  return (
    <div ref={wrapRef} className={className} onMouseEnter={onEnter} onMouseLeave={handleLeave}>
      {children}
      {mounted &&
        visible &&
        rect &&
        createPortal(
          <TooltipBubble
            title={title}
            content={content}
            align={align}
            closing={closing}
            rect={rect}
          />,
          document.body
        )}
    </div>
  );
}
