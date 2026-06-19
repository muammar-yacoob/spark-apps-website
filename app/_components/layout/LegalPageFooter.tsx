import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function LegalBackButton() {
  return (
    <a
      href="/"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white transition-all mb-6"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back
    </a>
  );
}

export function LegalLastUpdated() {
  return (
    <div className="pt-8 border-t border-gray-800 text-sm text-gray-500">
      Last Updated:{' '}
      {new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}
    </div>
  );
}

export function LegalNavLinks({ showHome = false }: { showHome?: boolean }) {
  return (
    <>
      {showHome && (
        <>
          <Link href="/" className="hover:text-gray-400 transition-colors">
            Home
          </Link>
          <span>•</span>
        </>
      )}
      <Link href="/privacy" className="hover:text-gray-400 transition-colors">
        Privacy Policy
      </Link>
      <span>•</span>
      <Link href="/terms" className="hover:text-gray-400 transition-colors">
        Terms of Service
      </Link>
      <span>•</span>
      <Link href="/contact" className="hover:text-gray-400 transition-colors">
        Contact
      </Link>
    </>
  );
}

export function LegalPageFooter() {
  return (
    <footer className="border-t border-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <LegalNavLinks showHome />
        </div>
      </div>
    </footer>
  );
}
