'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ShareableResult {
  festivalName: string;
  matchScore: number;
  userGenres: string[];
  budget: string;
}

export default function QuizResultsShare({ festival, matchScore }: { festival: any; matchScore: number }) {
  const generateShareText = () => {
    const text = `I just discovered ${festival.name} as my perfect festival match on FestiWise! 🎪🎵`;
    return text;
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const text = generateShareText();
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/quiz`;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard! Share it with friends.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-sm"
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          🎉 Share Your Match!
        </h3>
        <p className="text-sm text-gray-600">
          Let your friends know about your perfect festival
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('twitter')}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <span>𝕏</span> Tweet
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('facebook')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <span>f</span> Share
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('whatsapp')}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <span>💬</span> WhatsApp
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyLink}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
        >
          <span>📋</span> Copy
        </motion.button>
      </div>

      <p className="text-xs text-gray-600 text-center">
        Share your discovery and help friends find their perfect festival! 🎵
      </p>
    </motion.div>
  );
}
