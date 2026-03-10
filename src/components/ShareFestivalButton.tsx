'use client';

import { useState } from 'react';
import { Share2, Check, Link } from 'lucide-react';

interface Props {
  festivalName: string;
  festivalId: string;
}

export default function ShareFestivalButton({ festivalName, festivalId }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `https://getfestiwise.com/festival/${festivalId}`;
    const text = `Check out ${festivalName} on FestiWise — find your perfect festival match`;

    if (navigator.share) {
      try {
        await navigator.share({ title: festivalName, text, url });
      } catch {
        // user cancelled
      }
      return;
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all touch-manipulation"
      aria-label={`Share ${festivalName}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-green-300">Link copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share
        </>
      )}
    </button>
  );
}
