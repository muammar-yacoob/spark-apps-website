'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Share2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PLATFORM_SVGS } from './platform-icons';

/* ── Config ───────────────────────────────────────────────────────────────── */

export interface SocialShareConfig {
  appName: string;
  appUrl: string;
  appIcon: string;
  taglines: string[];
  hashtags?: string;
  messageEndpoint?: string | null;
}

/* ── Platforms ─────────────────────────────────────────────────────────────── */

const PLATFORMS = [
  { name: 'X', key: 'x', color: '#e4e4e7' },
  { name: 'Bluesky', key: 'bluesky', color: '#0085FF' },
  { name: 'Threads', key: 'threads', color: '#e4e4e7' },
  { name: 'LinkedIn', key: 'linkedin', color: '#0077B5' },
  { name: 'Facebook', key: 'facebook', color: '#1877F2' },
  { name: 'Reddit', key: 'reddit', color: '#FF4500' },
  { name: 'WhatsApp', key: 'whatsapp', color: '#25D366' },
  { name: 'Telegram', key: 'telegram', color: '#0088CC' },
] as const;

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function utmUrl(appUrl: string, source: string) {
  const sep = appUrl.includes('?') ? '&' : '?';
  return `${appUrl}${sep}ref=${source}`;
}

function buildLinks(text: string, appUrl: string, hashtags: string) {
  const t = encodeURIComponent(text);
  const u = encodeURIComponent(appUrl);
  return {
    x: `https://twitter.com/intent/tweet?text=${t}&url=${u}&hashtags=${encodeURIComponent(hashtags)}`,
    bluesky: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text}\n${utmUrl(appUrl, 'bluesky')}`)}`,
    threads: `https://www.threads.net/intent/post?text=${encodeURIComponent(`${text}\n${utmUrl(appUrl, 'threads')}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(utmUrl(appUrl, 'linkedin'))}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(utmUrl(appUrl, 'facebook'))}&quote=${t}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(utmUrl(appUrl, 'reddit'))}&title=${t}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n${utmUrl(appUrl, 'whatsapp')}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(utmUrl(appUrl, 'telegram'))}&text=${t}`,
  };
}

function getFallbackTagline(taglines: string[]): string {
  const STORAGE_KEY = 'social_share_idx';
  let idx = 0;
  try {
    idx = Number.parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) || 0;
  } catch {
    /* localStorage may be unavailable */
  }
  const tagline = taglines[idx % taglines.length];
  try {
    localStorage.setItem(STORAGE_KEY, String((idx + 1) % taglines.length));
  } catch {
    /* localStorage may be unavailable */
  }
  return tagline;
}

/* ── Resolved config type ─────────────────────────────────────────────────── */

interface ResolvedConfig {
  appName: string;
  appUrl: string;
  appIcon: string;
  taglines: string[];
  hashtags: string;
  messageEndpoint: string | null;
}

/* ── Share Modal ─────────────────────────────────────────────────────────── */

function ShareModal({
  isOpen,
  onClose,
  config: cfg,
}: {
  isOpen: boolean;
  onClose: () => void;
  config: ResolvedConfig;
}) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tagline, setTagline] = useState('');
  const [links, setLinks] = useState<Record<string, string>>({});
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const fallback = getFallbackTagline(cfg.taglines);
    setTagline(fallback);
    setLinks(buildLinks(fallback, cfg.appUrl, cfg.hashtags));

    if (!cfg.messageEndpoint) return;

    fetch(cfg.messageEndpoint)
      .then((r) => r.json())
      .then((data: { message: string | null; hashtags: string | null }) => {
        const msg = data.message ?? fallback;
        const tags = data.hashtags ?? cfg.hashtags;
        setTagline(msg);
        setLinks(buildLinks(msg, cfg.appUrl, tags));
      })
      .catch(() => {
        /* keep fallback already set */
      });
  }, [isOpen, cfg]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(utmUrl(cfg.appUrl, 'copy_link'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API unavailable */
    }
  }, [cfg.appUrl]);

  const handlePlatformClick = useCallback(
    (key: string, url: string) => {
      if (!url) return;
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
      onClose();
    },
    [onClose]
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.target === overlayRef.current && onClose()}
        >
          <motion.div
            className="w-[85%] max-w-[270px] rounded-xl border border-white/10 bg-[hsl(var(--card))] p-3.5"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-end gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cfg.appIcon}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded object-contain"
                />
                <h3 className="text-[13px] font-semibold text-foreground">Share {cfg.appName}</h3>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="group p-1 rounded-lg text-white hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <X className="w-3 h-3 transition-transform duration-200 group-hover:rotate-90" />
              </button>
            </div>

            {/* Tagline */}
            <div className="mb-2 flex items-start">
              <p className="text-[11px] text-muted-foreground leading-relaxed">{tagline}</p>
            </div>

            {/* Platform grid - 3x3 */}
            <div className="grid grid-cols-3 gap-1 mb-2.5">
              {PLATFORMS.map(({ name, key, color }, i) => (
                <motion.button
                  key={key}
                  type="button"
                  onClick={() => handlePlatformClick(key, links[key])}
                  className="flex flex-col items-center gap-0.5 py-1 px-0.5 rounded-md border border-transparent bg-white/[0.03] text-[8px] font-medium cursor-pointer"
                  style={{ color }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 + 0.05, duration: 0.18 }}
                  whileHover={{
                    scale: 1.08,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderColor: `${color}33`,
                    boxShadow: `0 0 12px ${color}15`,
                    transition: { duration: 0.15 },
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <motion.span
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: PLATFORM_SVGS is a hardcoded in-file map of SVG markup strings.
                    dangerouslySetInnerHTML={{
                      __html: PLATFORM_SVGS[key] || '',
                    }}
                    className="[&_svg]:w-3 [&_svg]:h-3"
                  />
                  <span>{name}</span>
                </motion.button>
              ))}
            </div>

            {/* Copy link */}
            <motion.button
              type="button"
              onClick={handleCopy}
              className={`flex items-center justify-center gap-1.5 w-full h-6 rounded-md border text-[9px] font-mono transition-all duration-150 ${
                copied
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                  : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.18 }}
              whileTap={{ scale: 0.97 }}
            >
              {copied ? <Check size={10} /> : <Copy size={10} />}
              <span>{copied ? 'Copied!' : cfg.appUrl.replace(/^https?:\/\//, '')}</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ── Share Button ─────────────────────────────────────────────────────────── */

export default function SocialShareButton({
  size = 16,
  className,
  appName,
  appUrl,
  appIcon,
  taglines,
  hashtags,
  messageEndpoint,
}: {
  size?: number;
  className?: string;
} & SocialShareConfig) {
  const [open, setOpen] = useState(false);

  const resolved: ResolvedConfig = {
    appName,
    appUrl,
    appIcon,
    taglines,
    hashtags: hashtags ?? '',
    messageEndpoint: messageEndpoint !== undefined ? messageEndpoint : null,
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          'p-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-colors duration-200 backdrop-blur-sm'
        }
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        title="Share"
        suppressHydrationWarning
      >
        <Share2 size={size} suppressHydrationWarning />
      </motion.button>
      <ShareModal isOpen={open} onClose={() => setOpen(false)} config={resolved} />
    </>
  );
}
