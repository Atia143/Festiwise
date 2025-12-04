'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

const achievements: UserAchievement[] = [
  {
    id: 'first_quiz',
    name: 'Marketplace Explorer',
    description: 'Completed your first quiz',
    icon: '🎫'
  },
  {
    id: 'quiz_speedrun',
    name: 'Speedy Raver',
    description: 'Completed quiz in under 90 seconds',
    icon: '⚡'
  },
  {
    id: 'all_genres',
    name: 'Genre Connoisseur',
    description: 'Selected 5+ different music genres',
    icon: '🎵'
  },
  {
    id: 'budget_explorer',
    name: 'Budget Conscious',
    description: 'Found festival under $500',
    icon: '💰'
  },
  {
    id: 'international',
    name: 'World Traveler',
    description: 'Matched with festival outside your continent',
    icon: '🌍'
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Shared your results with 3+ friends',
    icon: '🦋'
  }
];

export default function GamificationBadges() {
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    // Simulate getting unlocked achievements from localStorage or API
    const stored = localStorage.getItem('festiwise_badges');
    if (stored) {
      setUnlockedBadges(JSON.parse(stored));
    }
  }, []);

  const totalUnlocked = unlockedBadges.length;
  const progress = Math.floor((totalUnlocked / achievements.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 shadow-sm"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">🏆 Your Achievements</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
            />
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {totalUnlocked}/{achievements.length}
          </span>
        </div>
        <p className="text-xs text-gray-600">
          Unlock badges by exploring festivals and sharing your discoveries!
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {achievements.map((achievement) => {
          const isUnlocked = unlockedBadges.includes(achievement.id);

          return (
            <motion.div
              key={achievement.id}
              whileHover={isUnlocked ? { scale: 1.1 } : {}}
              className="flex flex-col items-center"
              title={achievement.name}
            >
              <motion.div
                animate={{
                  opacity: isUnlocked ? 1 : 0.4,
                  filter: isUnlocked ? 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.6))' : 'grayscale(1)'
                }}
                className="relative w-12 h-12 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center text-2xl shadow-sm"
              >
                {achievement.icon}
                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="absolute top-0 right-0 bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  >
                    ✓
                  </motion.div>
                )}
              </motion.div>
              <p className="text-xs text-center text-gray-700 mt-1 line-clamp-2 font-medium">
                {achievement.name}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Streak Indicator (optional) */}
      {totalUnlocked > 0 && (
        <div className="mt-4 pt-4 border-t border-orange-100 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
            <span>🔥</span>
            <span>{totalUnlocked} badge{totalUnlocked !== 1 ? 's' : ''} unlocked!</span>
            <span>Keep exploring</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
