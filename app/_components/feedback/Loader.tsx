'use client';

export default function Loader({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className ?? ''}`}>
      <div className="w-8 h-8 border-3 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}
