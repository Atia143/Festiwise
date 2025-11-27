'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileOptimizedBottomSheet() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDepth, setScrollDepth] = useState(0);
  const pathname = usePathname();

  // Don't show on quiz page
  const isQuizPage = pathname?.includes('/quiz') ?? false;

  useEffect(() => {
    let hasShown = false;

    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setScrollDepth(scrollPercent);

      // Show after user scrolls 40% down the page, only once
      if (scrollPercent > 40 && !hasShown && !isQuizPage) {
        setIsVisible(true);
        hasShown = true;
      }
    };

    // Only on mobile
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      setIsVisible(false);
      return;
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isQuizPage]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        >
          {/* Bottom Sheet - Safe area for mobile */}
          <div className="bg-gradient-to-t from-purple-900 via-purple-800 to-transparent backdrop-blur-md border-t border-white/20 shadow-2xl">
            <div className="px-4 py-6 pb-8 space-y-3">
              {/* Close hint line */}
              <div className="flex justify-center">
                <div className="w-12 h-1 bg-white/30 rounded-full" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-white font-bold text-center text-lg">
                  🎪 Discover Your Perfect Festival
                </h3>
                <p className="text-white/80 text-sm text-center">
                  Our AI-powered quiz takes just 2 minutes to find your match
                </p>

                {/* Primary CTA */}
                <Link href="/quiz" className="block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsVisible(false)}
                    className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base"
                  >
                    <span>Start Quiz</span>
                    <span>→</span>
                  </motion.button>
                </Link>

                {/* Secondary action */}
                <button
                  onClick={() => setIsVisible(false)}
                  className="w-full py-2 text-white/70 text-sm font-medium hover:text-white transition-colors"
                >
                  ✕ Maybe later
                </button>

                {/* Trust indicator */}
                <div className="flex items-center justify-center gap-3 text-xs text-white/60 pt-2">
                  <span>✓ Free</span>
                  <span>•</span>
                  <span>2 min</span>
                  <span>•</span>
                  <span>No spam</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
