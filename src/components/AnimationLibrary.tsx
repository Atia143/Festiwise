'use client';

import { motion } from 'framer-motion';

/**
 * Confetti animation for celebration moments
 * Fires when users complete quiz or find match
 */
export function CelebrationConfetti() {
  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1,
    x: (Math.random() - 0.5) * 300,
    y: Math.random() * -400,
    rotation: Math.random() * 360,
    emoji: ['🎉', '🎊', '✨', '🎪', '🎵', '🎸', '🎤'][Math.floor(Math.random() * 7)]
  }));

  return (
    <>
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          className="fixed pointer-events-none text-2xl"
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0
          }}
          animate={{
            x: item.x,
            y: item.y,
            opacity: 0,
            scale: 0,
            rotate: item.rotation
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            ease: 'easeOut'
          }}
          style={{
            left: '50%',
            top: '50%'
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </>
  );
}

/**
 * Success toast notification
 */
export function SuccessToast({ message, icon = '✓' }: { message: string; icon?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100, y: -20 }}
      className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 font-semibold"
    >
      <span className="text-xl">{icon}</span>
      <span>{message}</span>
    </motion.div>
  );
}

/**
 * Error toast notification
 */
export function ErrorToast({ message, icon = '⚠' }: { message: string; icon?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 100, y: -20 }}
      className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 font-semibold"
    >
      <span className="text-xl">{icon}</span>
      <span>{message}</span>
    </motion.div>
  );
}

/**
 * Page transition animation wrapper
 */
export function PageTransition({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered list animation
 */
export function StaggeredList({
  items,
  children
}: {
  items: any[];
  children: (item: any, index: number) => React.ReactNode;
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {items.map((data, idx) => (
        <motion.div key={idx} variants={item}>
          {children(data, idx)}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Bounce animation for CTAs
 */
export function BouncingCTA({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 2
      }}
    >
      {children}
    </motion.div>
  );
}
