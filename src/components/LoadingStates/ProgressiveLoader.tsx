'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// World-Class Progressive Loading System
export function useProgressiveLoading(phases: LoadingPhase[]) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentPhase >= phases.length) {
      setIsComplete(true);
      return;
    }

    const phase = phases[currentPhase];
    const timer = setTimeout(() => {
      setCurrentPhase(prev => prev + 1);
      setProgress(((currentPhase + 1) / phases.length) * 100);
    }, phase.duration);

    return () => clearTimeout(timer);
  }, [currentPhase, phases]);

  return {
    currentPhase: phases[currentPhase],
    progress,
    isComplete,
    phaseIndex: currentPhase
  };
}

interface LoadingPhase {
  id: string;
  title: string;
  subtitle?: string;
  duration: number;
  emoji?: string;
}

// Netflix-style loading component
export function PremiumLoadingScreen({ 
  isVisible, 
  onComplete,
  context = 'app'
}: {
  isVisible: boolean;
  onComplete: () => void;
  context?: 'app' | 'quiz' | 'results' | 'festivals';
}) {
  const getLoadingPhases = (context: string): LoadingPhase[] => {
    switch (context) {
      case 'quiz':
        return [
          { id: 'init', title: 'Preparing Your Quiz', subtitle: 'Analyzing global festival data', duration: 800, emoji: '🎪' },
          { id: 'personalize', title: 'Personalizing Experience', subtitle: 'Tailoring questions to your preferences', duration: 600, emoji: '✨' },
          { id: 'ready', title: 'Almost Ready!', subtitle: 'Finalizing your festival journey', duration: 400, emoji: '🚀' }
        ];
      case 'results':
        return [
          { id: 'analyze', title: 'Analyzing Your Preferences', subtitle: 'Processing your unique festival DNA', duration: 1000, emoji: '🧬' },
          { id: 'match', title: 'Finding Perfect Matches', subtitle: 'Scanning 3,000+ festivals worldwide', duration: 800, emoji: '🎯' },
          { id: 'rank', title: 'Ranking Your Results', subtitle: 'Prioritizing your top recommendations', duration: 600, emoji: '🏆' }
        ];
      case 'festivals':
        return [
          { id: 'load', title: 'Loading Festival Database', subtitle: 'Accessing 3,000+ festivals worldwide', duration: 600, emoji: '🌍' },
          { id: 'organize', title: 'Organizing Your View', subtitle: 'Preparing search and filters', duration: 400, emoji: '🔍' },
          { id: 'ready', title: 'Ready to Explore!', subtitle: 'Your festival adventure awaits', duration: 300, emoji: '🎉' }
        ];
      default:
        return [
          { id: 'init', title: 'Welcome to FestiWise', subtitle: 'Your festival discovery journey begins', duration: 800, emoji: '🎭' },
          { id: 'load', title: 'Loading Experience', subtitle: 'Preparing personalized recommendations', duration: 600, emoji: '⚡' }
        ];
    }
  };

  const { currentPhase, progress, isComplete } = useProgressiveLoading(getLoadingPhases(context));

  useEffect(() => {
    if (isComplete && onComplete) {
      const timer = setTimeout(onComplete, 200);
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && !isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 flex items-center justify-center"
        >
          <div className="text-center text-white max-w-md mx-auto px-6">
            {/* Animated Logo/Emoji */}
            <motion.div
              key={currentPhase?.emoji}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="text-8xl mb-8"
            >
              {currentPhase?.emoji}
            </motion.div>

            {/* Phase Title */}
            <motion.h2
              key={currentPhase?.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4"
            >
              {currentPhase?.title}
            </motion.h2>

            {/* Phase Subtitle */}
            <motion.p
              key={currentPhase?.subtitle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-white/80 mb-8"
            >
              {currentPhase?.subtitle}
            </motion.p>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>

            {/* Progress Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-white/70"
            >
              {Math.round(progress)}% Complete
            </motion.div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0, 
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight + 50
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -50,
                    x: Math.random() * window.innerWidth
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Smart content loading with progressive reveal
export function SmartContentLoader({
  isLoading,
  children,
  skeleton,
  delay = 0
}: {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton: React.ReactNode;
  delay?: number;
}) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowContent(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isLoading, delay]);

  return (
    <AnimatePresence mode="wait">
      {isLoading || !showContent ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Advanced loading hook with intelligent timing
export function useSmartLoading(minDuration = 1000, context = 'default') {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Minimum loading time for perceived quality
    const minTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, minDuration);

    return () => clearTimeout(minTimer);
  }, [minDuration]);

  const finishLoading = useCallback(() => {
    if (loadingComplete) {
      setIsLoading(false);
    }
  }, [loadingComplete]);

  useEffect(() => {
    if (loadingComplete) {
      // Add small delay for premium feel
      const finishTimer = setTimeout(finishLoading, 100);
      return () => clearTimeout(finishTimer);
    }
  }, [loadingComplete, finishLoading]);

  return { isLoading, finishLoading };
}
