'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function ErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { status } = useSession();
  const router = useRouter();

  const cta =
    status === 'authenticated'
      ? { label: 'Go to dashboard', onClick: () => router.push('/dashboard') }
      : { label: 'Sign in', onClick: () => router.push('/?login=true') };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* biome-ignore lint/performance/noImgElement: mirrors global-error.tsx, which must not depend on next/image */}
      <img
        src="/imgs/500.png"
        alt="Server error"
        style={{ width: 220, height: 220, objectFit: 'contain' }}
      />

      <h1 className="text-2xl text-white font-semibold mt-6">Something went wrong</h1>
      <p className="text-gray-400 mt-2 text-center max-w-md">An unexpected error occurred.</p>
      {error.digest && <p className="text-xs text-gray-600 mt-2">Error ID: {error.digest}</p>}

      <div className="flex items-center gap-3 mt-8">
        <button
          type="button"
          onClick={cta.onClick}
          className="px-6 py-2.5 bg-white text-black font-medium rounded-lg text-sm hover:bg-gray-200 transition-colors"
        >
          {cta.label}
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-6 py-2.5 bg-gray-800 text-white font-medium rounded-lg border border-gray-700 text-sm hover:bg-gray-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SessionProvider>
      <ErrorContent error={error} reset={reset} />
    </SessionProvider>
  );
}
