'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActivityNotification {
  id: string;
  text: string;
  icon: string;
  type: 'quiz' | 'match' | 'signup';
}

const activities: ActivityNotification[] = [
  { id: '1', text: 'Sarah from NYC just found her perfect festival!', icon: '🎯', type: 'match' },
  { id: '2', text: '127 people took the quiz in the last hour', icon: '⚡', type: 'quiz' },
  { id: '3', text: 'Mike matched with Tomorrowland (92% match)', icon: '🎪', type: 'match' },
  { id: '4', text: '8 people signed up for festival alerts', icon: '🔔', type: 'signup' },
  { id: '5', text: 'Emma found 3 perfect festivals in under 2 minutes', icon: '🚀', type: 'match' },
  { id: '6', text: '456 festival recommendations sent today', icon: '📊', type: 'quiz' },
];

export default function LiveActivityFeed() {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentActivity];

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-50 max-w-sm"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {activity.icon}
              </motion.div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {activity.text}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-500 ml-2">Just now</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
