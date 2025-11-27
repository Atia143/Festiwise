'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LiveActivity {
  id: string;
  type: 'quiz_started' | 'quiz_completed' | 'user_online' | 'match_found';
  text: string;
  emoji: string;
  timestamp: number;
}

// Simulated live activity generator
const generateActivityMessage = (): LiveActivity => {
  const activities = [
    { type: 'quiz_started' as const, text: 'Someone just started the quiz', emoji: '🎪', weight: 0.3 },
    { type: 'quiz_completed' as const, text: 'Found their perfect festival!', emoji: '🎉', weight: 0.2 },
    { type: 'user_online' as const, text: 'person exploring festivals', emoji: '🔍', weight: 0.3 },
    { type: 'match_found' as const, text: 'got matched to Coachella', emoji: '✨', weight: 0.2 },
  ];

  const weighted = activities.sort(() => Math.random() - 0.5)[0];
  return {
    id: `${Date.now()}-${Math.random()}`,
    type: weighted.type as any,
    text: weighted.text,
    emoji: weighted.emoji,
    timestamp: Date.now(),
  };
};

export default function RealtimeSocialProof() {
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    // Simulate initial activities
    const initial = Array(3)
      .fill(null)
      .map((_, i) => ({
        ...generateActivityMessage(),
        id: `init-${i}`,
      }));
    setActivities(initial);
    setActiveUsers(Math.floor(Math.random() * 100) + 15);

    // Add new activity every 4-8 seconds
    const interval = setInterval(() => {
      const newActivity = generateActivityMessage();
      setActivities((prev) => [newActivity, ...prev.slice(0, 3)]);

      // Randomly update active users
      if (Math.random() > 0.7) {
        setActiveUsers((prev) => Math.max(10, prev + Math.floor(Math.random() * 5) - 2));
      }
    }, 5000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex -space-x-2">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-xs text-white font-bold"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {activeUsers}+ people discovering festivals now
        </span>
      </div>

      {/* Live Activity Feed */}
      <div className="space-y-2">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 text-sm text-gray-700 bg-white/60 backdrop-blur px-3 py-2 rounded-lg border border-white/80"
          >
            <span className="text-lg">{activity.emoji}</span>
            <span>
              <span className="font-semibold">Someone</span> {activity.text}
            </span>
            <span className="ml-auto text-xs text-gray-500">just now</span>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <button
        onClick={() => window.location.href = '/quiz'}
        className="w-full mt-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors border-t border-purple-100 pt-3"
      >
        → Join them, take the quiz
      </button>
    </motion.div>
  );
}
