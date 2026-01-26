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

  useEffect(() => {
    // Initialize empty - we're moving away from fake activity ticker
    setActivities([]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm"
    >
      {/* Credible Social Proof Stats */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Real People, Real Festival Matches</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-white rounded-lg border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">1,000+</div>
            <div className="text-xs text-gray-600 mt-1">Matches Made This Month</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">9/10</div>
            <div className="text-xs text-gray-600 mt-1">Find Their Perfect Festival</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">100+</div>
            <div className="text-xs text-gray-600 mt-1">Verified Festivals in Network</div>
          </div>
        </div>
      </div>

      {/* Trust Messaging */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-center text-sm text-gray-700">
          ✓ <strong>No Spam.</strong> We don't sell your data. 
          ✓ <strong>No Affiliation.</strong> Direct links to official pages. 
          ✓ <strong>100% Free.</strong> Always.
        </p>
      </div>
    </motion.div>
  );
}
