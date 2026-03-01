'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Festival {
  id: string;
  name: string;
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  country: string;
}

export default function QuizResultsShare({
  festival,
  matchScore,
}: {
  festival: Festival;
  matchScore: number;
}) {
  const [copied, setCopied] = useState(false);

  const genre = festival.genres?.[0] ?? 'Music';
  const budget = `$${festival.estimated_cost_usd?.min ?? 0}-${festival.estimated_cost_usd?.max ?? 999}`;
  const country = festival.country ?? '';

  const getShareUrl = () => {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://getfestiwise.com';
    const params = new URLSearchParams({
      score: String(matchScore),
      genre,
      budget,
      ...(country ? { country } : {}),
    });
    return `${base}/share/${festival.id}?${params.toString()}`;
  };

  const shareText = `I matched ${matchScore}% with ${festival.name} on FestiWise! 🎪 Find your perfect festival:`;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${matchScore}% match with ${festival.name}!`,
          text: shareText,
          url: getShareUrl(),
        });
      } catch (_e) {
        // User cancelled
      }
    }
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const shareUrl = getShareUrl();
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-sm"
    >
      <div className="text-center mb-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Share Your Match!</h3>
        <p className="text-sm text-gray-500">Friends will see a personalised preview card</p>
      </div>

      {/* Native share button (mobile) */}
      {hasNativeShare && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNativeShare}
          className="w-full mb-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md"
        >
          Share {festival.name} — {matchScore}% match
        </motion.button>
      )}

      {/* Platform buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('twitter')}
          className="px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors"
        >
          𝕏 Tweet
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('facebook')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors"
        >
          f Facebook
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('whatsapp')}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors"
        >
          WhatsApp
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyLink}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {copied ? '✓ Copied!' : '📋 Copy link'}
        </motion.button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Shared links show a personalised festival card with your match details
      </p>
    </motion.div>
  );
}
