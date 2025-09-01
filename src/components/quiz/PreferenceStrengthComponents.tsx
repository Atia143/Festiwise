'use client';

import { motion } from 'framer-motion';

interface FlexibilityOptionProps {
  value: 'strict' | 'flexible' | 'very flexible';
  label: string;
  description: string;
  selected: boolean;
  onChange: (value: 'strict' | 'flexible' | 'very flexible') => void;
}

export function FlexibilityOption({ value, label, description, selected, onChange }: FlexibilityOptionProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
        selected
          ? 'border-purple-500 bg-purple-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onChange(value)}
    >
      <div className="font-medium">{label}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </motion.button>
  );
}

interface ImportanceLevelProps {
  level: number;
  selected: boolean;
  onChange: (level: number) => void;
}

export function ImportanceLevel({ level, selected, onChange }: ImportanceLevelProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-purple-500 bg-purple-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onChange(level)}
    >
      <div className="text-lg font-bold text-center">{level}</div>
      <div className="text-xs text-gray-500 text-center">
        {level === 1 ? 'Flexible' : level === 5 ? 'Must-have' : ''}
      </div>
    </motion.button>
  );
}
