'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Link2, Share2 } from 'lucide-react';

// ── Inline SVG social icons (monochromatic, no emoji) ──────────────────────────
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

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

// ── Types ───────────────────────────────────────────────────────────────────────
interface Festival {
  id: string;
  name: string;
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  country: string;
}

// ── Component ───────────────────────────────────────────────────────────────────
export default function QuizResultsShare({
  festival,
  matchScore,
}: {
  festival: Festival;
  matchScore: number;
}) {
  const [copied, setCopied] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect native share on client only (avoids SSR mismatch)
  useEffect(() => {
    setHasNativeShare(typeof navigator !== 'undefined' && 'share' in navigator);
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const genre = festival.genres?.[0] ?? 'Music';
  const budget = `$${festival.estimated_cost_usd?.min ?? 0}-${festival.estimated_cost_usd?.max ?? 999}`;
  const country = festival.country ?? '';

  function buildParams() {
    return new URLSearchParams({
      score: String(matchScore),
      genre,
      budget,
      ...(country ? { country } : {}),
    });
  }

  function getShareUrl() {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://getfestiwise.com';
    return `${base}/share/${festival.id}?${buildParams().toString()}`;
  }

  function getOgImageUrl() {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://getfestiwise.com';
    const params = new URLSearchParams({
      festival: festival.name,
      score: String(matchScore),
      genre,
      budget,
      ...(country ? { country } : {}),
    });
    return `${base}/api/og/quiz-results?${params.toString()}`;
  }

  const shareText = `I matched ${matchScore}% with ${festival.name} on FestiWise! Find your perfect festival:`;

  async function handleNativeShare() {
    if (!hasNativeShare) return;
    try {
      await navigator.share({ title: `${matchScore}% match with ${festival.name}!`, text: shareText, url: getShareUrl() });
    } catch (_e) {
      // User cancelled — no-op
    }
  }

  function handlePlatformShare(platform: 'twitter' | 'facebook' | 'whatsapp') {
    const shareUrl = getShareUrl();
    const map = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    };
    window.open(map[platform], '_blank', 'width=600,height=400,noopener,noreferrer');
  }

  async function copyLink() {
    await navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
  }

  // Truncated display URL
  const shortUrl = getShareUrl().replace(/^https?:\/\//, '').split('?')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-900">Your match card</h3>
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
            {matchScore}% match
          </span>
        </div>
        <p className="text-sm text-gray-400">This is exactly what your friends will see</p>
      </div>

      {/* ── OG Image Preview ────────────────────────────────────────── */}
      <div className="mx-6 mb-5 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-100 relative" style={{ aspectRatio: '1200/630' }}>
        {/* Skeleton while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-purple-200 border-t-purple-500 animate-spin" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getOgImageUrl()}
          alt={`${festival.name} match card`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />
      </div>

      {/* ── Actions ─────────────────────────────────────────────────── */}
      <div className="px-6 pb-6 space-y-3">

        {/* Primary: native share on mobile, platform row on desktop */}
        {hasNativeShare ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm py-3.5 rounded-2xl transition-all shadow-md shadow-purple-500/20 active:shadow-none"
          >
            <Share2 className="w-4 h-4" />
            Share Now
          </motion.button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handlePlatformShare('twitter')}
              className="flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black text-white font-medium text-xs py-3 rounded-xl transition-colors"
            >
              <IconXTwitter /> X
            </button>
            <button
              onClick={() => handlePlatformShare('facebook')}
              className="flex items-center justify-center gap-1.5 bg-[#1877F2] hover:bg-[#1665d8] text-white font-medium text-xs py-3 rounded-xl transition-colors"
            >
              <IconFacebook /> Facebook
            </button>
            <button
              onClick={() => handlePlatformShare('whatsapp')}
              className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1fb356] text-white font-medium text-xs py-3 rounded-xl transition-colors"
            >
              <IconWhatsApp /> WhatsApp
            </button>
          </div>
        )}

        {/* Secondary platform row (shown on mobile after native share) */}
        {hasNativeShare && (
          <>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or share via</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handlePlatformShare('twitter')}
                className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-xs py-2.5 rounded-xl border border-gray-100 transition-colors"
              >
                <IconXTwitter /> X
              </button>
              <button
                onClick={() => handlePlatformShare('facebook')}
                className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-xs py-2.5 rounded-xl border border-gray-100 transition-colors"
              >
                <IconFacebook /> FB
              </button>
              <button
                onClick={() => handlePlatformShare('whatsapp')}
                className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-xs py-2.5 rounded-xl border border-gray-100 transition-colors"
              >
                <IconWhatsApp /> WA
              </button>
            </div>
          </>
        )}

        {/* Copy link row */}
        <button
          onClick={copyLink}
          className="w-full flex items-center gap-3 bg-gray-50 hover:bg-gray-100/80 border border-gray-100 hover:border-gray-200 rounded-2xl px-4 py-3 group transition-colors text-left"
          aria-label="Copy share link"
        >
          <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="flex-1 text-xs text-gray-500 truncate font-mono">{shortUrl}</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? 'done' : 'idle'}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.15 }}
              className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold ${copied ? 'text-green-600' : 'text-purple-600'}`}
            >
              {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : 'Copy'}
            </motion.span>
          </AnimatePresence>
        </button>

      </div>
    </motion.div>
  );
}
