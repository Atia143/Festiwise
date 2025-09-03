import { motion } from 'framer-motion';

interface EnhancedProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function EnhancedProgressBar({ currentStep, totalSteps }: EnhancedProgressBarProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      {[...Array(totalSteps)].map((_, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        return (
          <motion.div
            key={idx}
            className={`flex-1 h-2 rounded-full transition-all duration-300 mx-0.5 ${
              isCompleted
                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                : isCurrent
                ? 'bg-purple-400'
                : 'bg-gray-200'
            }`}
            initial={{ scaleX: 0.8 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
          />
        );
      })}
    </div>
  );
}
