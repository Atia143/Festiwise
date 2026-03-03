'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StickyCTABar() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isQuizPage = pathname?.includes('/quiz') ?? false;
      setIsVisible(window.scrollY > 300 && !isQuizPage);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-600 to-pink-600 border-t border-white/20 shadow-2xl"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm sm:text-base truncate">
                Ready to find your perfect festival?
              </p>
              <p className="text-white/80 text-xs sm:text-sm hidden sm:block">
                Our quiz matches you in 2 minutes
              </p>
            </div>
            <Link
              href="/quiz"
              className="flex-shrink-0 px-6 py-3.5 sm:px-8 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-150 text-sm sm:text-base tap-highlight-none touch-manipulation min-h-[44px] flex items-center"
            >
              Find My Festival →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
