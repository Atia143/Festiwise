'use client';

import { motion } from 'framer-motion';

export default function TrustBadges() {
  const badges = [
    { icon: '✓', label: '100% Free', color: 'bg-green-500/10 border-green-500/30 text-green-700' },
    { icon: '🔒', label: 'Secure & Private', color: 'bg-blue-500/10 border-blue-500/30 text-blue-700' },
    { icon: '👥', label: '50K+ Users', color: 'bg-purple-500/10 border-purple-500/30 text-purple-700' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {badges.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border ${badge.color} backdrop-blur-sm text-xs sm:text-sm font-medium`}
        >
          <span className="text-base">{badge.icon}</span>
          <span>{badge.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
