'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

interface ViralQuizResultsProps {
  festival: {
    id: string;
    name: string;
    country: string;
    genre: string;
    price: string;
  };
  matchScore: number;
  userGenre: string;
  userBudget: string;
}

export default function ViralQuizResults({
  festival,
  matchScore,
  userGenre,
  userBudget,
}: ViralQuizResultsProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://getfestiwise.com';

  // Generate OG image URL
  const ogImageUrl = `${baseUrl}/api/og/quiz-results?festival=${encodeURIComponent(festival.name)}&score=${Math.round(matchScore)}&genre=${encodeURIComponent(userGenre)}&budget=${encodeURIComponent(userBudget)}&country=${encodeURIComponent(festival.country)}`;

  // Generate shareable URL
  const shareUrl = `${baseUrl}/quiz?festival=${encodeURIComponent(festival.id)}&score=${Math.round(matchScore)}`;
  
  // Share text
  const shareText = `I just discovered ${festival.name} as my ${matchScore}% match on FestiWise! 🎪🎵 It's perfect for ${userGenre} lovers with a ${userBudget} budget. Take the quiz to find YOUR festival!`;

  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`, // Instagram requires app
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    window.open(socialLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-16 px-4 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-3"
          >
            🎉 Share Your Perfect Match!
          </motion.h2>
          <p className="text-lg text-gray-600">
            Your friends would love to know about {festival.name}
          </p>
        </div>

        {/* Preview Card - Shows what will be shared */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 border-2 border-purple-200 rounded-lg overflow-hidden bg-white shadow-lg"
        >
          <img
            src={ogImageUrl}
            alt="Your Festival Match"
            className="w-full h-auto"
          />
          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500">
            <p className="text-white text-sm font-semibold">
              This is how your match will appear on social media
            </p>
          </div>
        </motion.div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare('twitter')}
            className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <span>𝕏</span>
            <span className="hidden sm:inline">Tweet</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare('facebook')}
            className="px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <span>f</span>
            <span className="hidden sm:inline">Share</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare('whatsapp')}
            className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <span>💬</span>
            <span className="hidden sm:inline">Chat</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyLink}
            className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-lg border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(matchScore)}%</div>
            <p className="text-sm text-gray-600">Match Score</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{userGenre}</div>
            <p className="text-sm text-gray-600">Your Vibe</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userBudget}</div>
            <p className="text-sm text-gray-600">Budget</p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          💡 Tip: Sharing increases your chances of finding festival buddies! Join thousands discovering their perfect festival.
        </p>
      </div>
    </motion.section>
  );
}
