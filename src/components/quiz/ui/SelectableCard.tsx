import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  colorScheme?: 'purple' | 'green' | 'blue' | 'pink';
  ariaLabel?: string;
}

export function SelectableCard({ selected, onClick, children, colorScheme = 'purple', ariaLabel }: SelectableCardProps) {
  const colorMap = {
    purple: 'from-purple-500 to-pink-500 border-purple-500',
    green: 'from-green-500 to-emerald-500 border-green-500',
    blue: 'from-blue-500 to-cyan-500 border-blue-500',
    pink: 'from-pink-500 to-rose-500 border-pink-500',
  };
  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      aria-label={ariaLabel}
      tabIndex={0}
      onClick={onClick}
      className={`relative w-full p-6 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 cursor-pointer text-left
        ${selected ? `bg-gradient-to-br ${colorMap[colorScheme]} text-white shadow-2xl` : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:shadow-lg'}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {selected && (
        <motion.span
          className="absolute top-3 right-3 text-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          ✅
        </motion.span>
      )}
      {children}
    </motion.button>
  );
}
