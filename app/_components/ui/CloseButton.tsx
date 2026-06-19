'use client';

import { X } from 'lucide-react';

export function CloseButton({
  onClick,
  size = 18,
  className = '',
}: {
  onClick: () => void;
  size?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={`p-1 text-gray-600 hover:text-red-400 transition-all hover:rotate-90 flex-shrink-0 ${className}`.trim()}
    >
      <X suppressHydrationWarning style={{ width: size, height: size }} />
    </button>
  );
}
