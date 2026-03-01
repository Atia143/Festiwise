import { motion } from 'framer-motion';

interface EnhancedProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function EnhancedProgressBar({ currentStep, totalSteps }: EnhancedProgressBarProps) {
  const pct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Thin continuous bar */}
      <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: pct / 100 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          style={{ transformOrigin: 'left' }}
        />
      </div>
      {/* Step label */}
      <span className="text-xs font-medium text-white/70 tabular-nums flex-shrink-0">
        {currentStep}/{totalSteps}
      </span>
    </div>
  );
}
