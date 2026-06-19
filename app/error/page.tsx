'use client';

import animationData from '@/app/_animations/error-something-wrong.json';
import Loader from '@/app/_components/feedback/Loader';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

function ErrorContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'unknown';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const errorConfig = {
    not_found: {
      title: 'Page Not Found',
      description: "The page you're looking for doesn't exist.",
    },
    unauthorized: {
      title: 'Unauthorized',
      description: "You don't have permission to access this page.",
    },
    unknown: {
      title: 'Something Went Wrong',
      description: 'An unexpected error occurred.',
    },
  };

  const error = errorConfig[reason as keyof typeof errorConfig] || errorConfig.unknown;
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@example.com';

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-rose-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-rose-500/20 p-8 relative z-10 animate-fade-in-up">
        <div className="text-center">
          {/* Error animation */}
          {mounted && (
            <div className="mb-6 w-40 h-40 mx-auto animate-scale-in">
              <Lottie animationData={animationData} loop />
            </div>
          )}

          {/* Error Title */}
          <h1 className="text-3xl font-bold text-white mb-3 animate-fade-in bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">
            {error.title}
          </h1>

          {/* Error Description */}
          <p className="text-gray-300 mb-6 animate-fade-in animation-delay-200 leading-relaxed">
            {error.description}
          </p>

          {/* Action Button */}
          <div className="mb-6 animate-fade-in animation-delay-400">
            <button
              type="button"
              onClick={handleGoBack}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 font-semibold border border-gray-700 hover:border-rose-500/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Go Back
            </button>
          </div>

          {/* Support Link */}
          <div className="text-center animate-fade-in animation-delay-600">
            <a
              href={`mailto:${supportEmail}?subject=Error - ${reason}`}
              className="text-gray-400 hover:text-rose-400 text-sm transition-colors duration-200 underline decoration-dotted"
            >
              Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-rose-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-rose-500/20 p-8">
            <div className="text-center">
              <Loader className="w-24 h-24 mx-auto" />
              <h1 className="text-2xl font-bold text-white mt-4">Loading...</h1>
            </div>
          </div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
