'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
        
        // Track exit intent
        if (typeof window !== 'undefined' && 'gtag' in window) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).gtag('event', 'exit_intent_triggered', {
            event_category: 'engagement',
            event_label: 'popup_shown'
          });
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  const handleTakeQuiz = () => {
    // Track conversion
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag('event', 'exit_intent_conversion', {
        event_category: 'engagement',
        event_label: 'popup_quiz_click'
      });
    }
    setShowPopup(false);
    router.push('/quiz');
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 max-w-md w-full text-white relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.2, 1, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
            >
              ×
            </button>

            {/* Content */}
            <div className="relative z-10 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-6xl mb-4"
              >
                😱
              </motion.div>

              <h2 className="text-3xl font-bold mb-4">
                Wait! Don't Miss Out!
              </h2>

              <p className="text-lg mb-6 text-white/90">
                <span className="text-yellow-300 font-semibold">100 world-class festivals</span> from 24 countries await.
                <br />
                <span className="text-pink-300">Find your perfect match in just 2 minutes!</span>
              </p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-yellow-300 font-bold text-lg">100</div>
                    <div className="text-white/80">World-class festivals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-300 font-bold text-lg">24</div>
                    <div className="text-white/80">Countries covered</div>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleTakeQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-6 rounded-2xl text-lg shadow-2xl mb-4 relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10">
                  🎯 Yes! Find My Perfect Festival (FREE)
                </span>
              </motion.button>

              <p className="text-xs text-white/60">
                ✓ 100% FREE ✓ No signup required ✓ 2-minute quiz ✓ Instant results
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
