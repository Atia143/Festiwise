'use client';

import { motion } from 'framer-motion';

type QuizSummaryProps = {
  answers: any;
  onEdit: (step: number) => void;
};

export function QuizSummary({ answers, onEdit }: QuizSummaryProps) {
  const summaryItems = [
    {
      label: 'Music Genres',
      value: answers.genres?.join(', ') || 'Not specified',
      stepIndex: 0,
      emoji: '🎵'
    },
    {
      label: 'Budget Range',
      value: `$${answers.budget?.min || 0} - $${answers.budget?.max || 1000}`,
      stepIndex: 1,
      emoji: '💰'
    },
    {
      label: 'Available Months',
      value: answers.months?.join(', ') || 'Not specified',
      stepIndex: 2,
      emoji: '📅'
    },
    {
      label: 'Preferred Region',
      value: answers.region || 'Not specified',
      stepIndex: 3,
      emoji: '🌍'
    },
    {
      label: 'Festival Vibes',
      value: answers.vibes?.join(', ') || 'Not specified',
      stepIndex: 4,
      emoji: '✨'
    },
    {
      label: 'Duration Preference',
      value: answers.duration || 'Not specified',
      stepIndex: 5,
      emoji: '⏰'
    },
    {
      label: 'Accommodation',
      value: answers.camping ? 'Camping/Glamping' : 'Hotels/Airbnb',
      stepIndex: 6,
      emoji: '🏕️'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8"
    >
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="mr-2">📋</span>
        Your Quiz Summary
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {summaryItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{item.emoji}</span>
              <div>
                <div className="font-medium text-white text-sm">{item.label}</div>
                <div className="text-white/70 text-xs truncate max-w-40">{item.value}</div>
              </div>
            </div>
            <button
              onClick={() => onEdit(item.stepIndex)}
              className="text-pink-400 hover:text-pink-300 text-xs font-medium transition-colors"
            >
              Edit
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
