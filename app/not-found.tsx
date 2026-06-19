'use client';

import animationData from '@/app/_animations/error-space.json';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        <Lottie animationData={animationData} loop className="w-full h-full" />
      </div>

      <h1 className="text-2xl text-white font-semibold mt-6">Page not found</h1>
      <p className="text-gray-400 mt-2 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 px-6 py-2.5 bg-gray-800 text-white font-medium rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
