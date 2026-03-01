'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check, Link2, X } from 'lucide-react';

// ── Monochromatic social icons (fill="currentColor") ──────────────────────────
function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function IconXTwitter() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────────
const SHARE_TEXT = 'Discover your perfect music festival with FestiWise — free, personalised recommendations in seconds.';

const PLATFORMS = [
  {
    name: 'WhatsApp',
    Icon: IconWhatsApp,
    buildUrl: (text: string, url: string) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    name: 'X',
    Icon: IconXTwitter,
    buildUrl: (text: string, url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Facebook',
    Icon: IconFacebook,
    buildUrl: (_: string, url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
] as const;

// ── Component ───────────────────────────────────────────────────────────────────
export default function SharePrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<Element | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Client-only native share detection (avoids SSR mismatch)
  useEffect(() => {
    setHasNativeShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  // Show after 30 s (3 s in dev for testing)
  useEffect(() => {
    const delay = process.env.NODE_ENV === 'development' ? 3000 : 30000;
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, []);

  // Focus trap
  useEffect(() => {
    if (isVisible) {
      lastFocusedRef.current = document.activeElement;
      popupRef.current?.focus();
    } else {
      (lastFocusedRef.current as HTMLElement | null)?.focus();
    }
  }, [isVisible]);

  // ESC to close
  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsVisible(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isVisible]);

  // Cleanup copy timer
  useEffect(() => () => { if (copyTimerRef.current) clearTimeout(copyTimerRef.current); }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function track(method: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share_click', { method, page_section: 'global_prompt' });
    }
  }

  async function handleNativeShare() {
    try {
      await navigator.share({ title: 'FestiWise', text: SHARE_TEXT, url: window.location.href });
      track('native');
      setIsVisible(false);
    } catch (_e) {
      // User cancelled — no-op
    }
  }

  function handlePlatformShare(platform: string, buildUrl: (t: string, u: string) => string) {
    window.open(buildUrl(SHARE_TEXT, window.location.href), '_blank', 'noopener,noreferrer,width=600,height=420');
    track(platform);
    setIsVisible(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (_e) { /* ignore */ }
    track('copy');
    setCopied(true);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={popupRef}
          role="dialog"
          aria-labelledby="share-prompt-title"
          aria-modal="true"
          tabIndex={-1}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-4 sm:left-6 z-[9000] w-[260px] focus:outline-none"
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-900/10 p-5 flex flex-col gap-3 relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Dismiss */}
            <button
              onClick={() => setIsVisible(false)}
              aria-label="Dismiss share prompt"
              className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-white rounded-full border border-gray-100 shadow-md text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>

            {/* Header */}
            <div>
              <p id="share-prompt-title" className="text-sm font-semibold text-gray-900 leading-snug">
                Enjoying FestiWise?
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Help a friend find their perfect festival.</p>
            </div>

            {/* Primary CTA — native share on mobile */}
            {hasNativeShare && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm py-3 rounded-xl shadow-md shadow-purple-500/20 transition-all"
                aria-label="Share FestiWise"
              >
                <Share2 className="w-4 h-4" />
                Share Now
              </motion.button>
            )}

            {/* Platform grid */}
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map(({ name, Icon, buildUrl }) => (
                <button
                  key={name}
                  onClick={() => handlePlatformShare(name, buildUrl)}
                  aria-label={`Share on ${name}`}
                  className="flex flex-col items-center justify-center gap-1.5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl border border-gray-100 text-xs font-medium transition-colors"
                >
                  <Icon />
                  {name}
                </button>
              ))}
            </div>

            {/* Copy link row */}
            <button
              onClick={handleCopy}
              aria-label="Copy page link"
              className="w-full flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 rounded-xl px-3.5 py-2.5 transition-colors group"
            >
              <Link2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-xs text-gray-400 truncate text-left">getfestiwise.com</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? 'done' : 'idle'}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.14 }}
                  className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold ${copied ? 'text-green-600' : 'text-purple-600'}`}
                >
                  {copied ? <><Check className="w-3 h-3" /> Copied</> : 'Copy'}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
