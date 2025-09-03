import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StepTransitionProps {
  children: ReactNode;
  stepKey: string | number;
}

export function StepTransition({ children, stepKey }: StepTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
