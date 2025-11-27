'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function StickyCTABar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-md border-t border-white/20 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-white font-semibold text-sm sm:text-base">
                Ready to find your perfect festival?
              </p>
              <p className="text-white/80 text-xs sm:text-sm hidden sm:block">
                Our AI-powered quiz matches you in 2 minutes
              </p>
            </div>
            <Link href="/quiz" className="flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
              >
                Find My Festival →
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
