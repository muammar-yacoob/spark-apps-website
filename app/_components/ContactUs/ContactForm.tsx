'use client';

import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LottiePlayer } from './LottiePlayer';
import contactAnimationDefault from './animations/contact.json';
import emailSentAnimationDefault from './animations/email-sent.json';

export interface ContactFormConfig {
  /** POST endpoint for the form (default: '/api/contact') */
  apiEndpoint?: string;
  /** Where to redirect after the sent animation plays (default: '/') */
  redirectTo?: string;
  /** Delay before redirect in ms (default: 4000) */
  redirectDelay?: number;
  /** Brand color for the submit button (default: '#68b0f5') */
  accentColor?: string;
  /** Hover color for the submit button (default: '#5aa0e5') */
  accentHoverColor?: string;
  /** Minimum message length to enable submit (default: 20) */
  minMessageLength?: number;
  /** Title text (default: 'Get in touch') */
  title?: string;
  /** Subtitle text (default: 'We typically reply within 24 hours.') */
  subtitle?: string;
  /** App name shown in header */
  appName?: string;
  /** Tagline shown below app name in header */
  appTagline?: string;
  /** App icon/favicon URL shown in header */
  appIcon?: string;
  /** Home link in header (default: '/') */
  homeUrl?: string;
  /** Privacy policy link in footer (default: '/privacy') */
  privacyUrl?: string;
  /** Terms of service link in footer (default: '/terms') */
  termsUrl?: string;
  /** Override the contact animation JSON */
  contactAnimation?: object;
  /** Override the email-sent animation JSON */
  emailSentAnimation?: object;
}

const INPUT_CLASS =
  'w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all';

export function ContactForm({
  apiEndpoint = '/api/contact',
  redirectTo = '/',
  redirectDelay = 4000,
  accentColor = '#68b0f5',
  accentHoverColor = '#5aa0e5',
  minMessageLength = 20,
  title = 'Get in touch',
  subtitle = 'We typically reply within 24 hours.',
  appName,
  appTagline,
  appIcon = '/favicon.ico',
  homeUrl = '/',
  privacyUrl = '/privacy',
  termsUrl = '/terms',
  contactAnimation = contactAnimationDefault,
  emailSentAnimation = emailSentAnimationDefault,
}: ContactFormConfig = {}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honey, setHoney] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [loadedAt] = useState(Date.now);

  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(() => router.push(redirectTo), redirectDelay);
    return () => clearTimeout(timer);
  }, [sent, router, redirectTo, redirectDelay]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSending(true);
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _hp: honey,
          _t: loadedAt,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setSent(true);
      toast.success('Message sent!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  const isValid =
    name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    message.trim().length >= minMessageLength;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="px-8 sm:px-16 lg:px-24 py-6 flex items-center justify-between">
        <Link
          href={homeUrl}
          className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {appIcon && <img src={appIcon} alt="" className="h-9 w-9 rounded-lg" />}
          {appName && (
            <div>
              <span className="text-base font-semibold text-white">{appName}</span>
              {appTagline && (
                <p className="text-[10px] text-gray-500 leading-tight">{appTagline}</p>
              )}
            </div>
          )}
        </Link>
        <Link
          href={homeUrl}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" suppressHydrationWarning />
          Back
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-2">
            <LottiePlayer animationData={contactAnimation} loop width={220} height={165} />
          </div>

          {sent ? (
            <div className="text-center animate-fade-in">
              <div className="flex justify-center mb-4">
                <LottiePlayer
                  animationData={emailSentAnimation}
                  loop={false}
                  width={200}
                  height={200}
                />
              </div>
              <h1 className="text-xl font-semibold text-white mb-2">Message sent!</h1>
              <p className="text-sm text-gray-400">
                We will get back to you at <span className="text-gray-300">{email}</span> soon.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-xl font-semibold text-white mb-1">{title}</h1>
                <p className="text-xs text-gray-500">{subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Honeypot -- hidden from humans, filled by bots */}
                <input
                  type="text"
                  value={honey}
                  onChange={(e) => setHoney(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Name"
                  autoComplete="name"
                  className={INPUT_CLASS}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                  autoComplete="email"
                  className={INPUT_CLASS}
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="How can we help?"
                  className={`${INPUT_CLASS} resize-none`}
                />
                <button
                  type="submit"
                  disabled={sending || !isValid}
                  style={
                    {
                      '--accent': accentColor,
                      '--accent-hover': accentHoverColor,
                    } as React.CSSProperties
                  }
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  suppressHydrationWarning
                >
                  <Send className="h-3.5 w-3.5" suppressHydrationWarning />
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-4 px-4">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <Link href={privacyUrl} className="hover:text-gray-300 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-gray-700">·</span>
          <Link href={termsUrl} className="hover:text-gray-300 transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
