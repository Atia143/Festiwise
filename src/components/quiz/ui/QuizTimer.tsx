import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizTimerProps {
  seconds: number;
  onReset: () => void;
  isActive: boolean;
}

export function QuizTimer({ seconds, onReset, isActive }: QuizTimerProps) {
  const [elapsed, setElapsed] = useState(seconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) return undefined;
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleReset = () => {
    setElapsed(0);
    onReset();
  };

  return (
    <div className="flex items-center gap-2">
      <motion.span
        key={elapsed}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="font-mono text-sm text-gray-700"
        aria-live="polite"
      >
        {elapsed}s
      </motion.span>
      <button
        onClick={handleReset}
        aria-label="Reset timer"
        className="ml-1 px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        Reset
      </button>
    </div>
  );
}
