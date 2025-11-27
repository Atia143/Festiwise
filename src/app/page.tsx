'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SimpleHero from '@/components/SimpleHero';
import SimpleSocialProof from '@/components/SimpleSocialProof';
import SimpleFestivalGrid from '@/components/SimpleFestivalGrid';
import SimpleNewsletter from '@/components/SimpleNewsletter';
import SimpleFAQ from '@/components/SimpleFAQ';
import ConversionBanner from '@/components/ConversionBanner';
import ImprovedExitModal from '@/components/ImprovedExitModal';
import RealtimeSocialProof from '@/components/RealtimeSocialProof';
import FestivalPreviewCarousel from '@/components/FestivalPreviewCarousel';

export default function HomePage() {
  // State to control content visibility - no artificial delay for better LCP
  const [isLoading, setIsLoading] = useState(false); // Changed to false for immediate render

  useEffect(() => {
    // No artificial delay - let content render immediately for better Core Web Vitals
    setIsLoading(false);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} // Reduced animation time
          className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }} // Faster transition
            className="text-center"
          >
            <motion.div
              className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear"
              }}
            >
              <span className="text-5xl animate-pulse">✨</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg">
              Loading FestiWise
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-2">
              Finding the perfect festival for you...
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" />
              <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce delay-150" />
              <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce delay-300" />
            </div>
          </motion.div>
          <div className="absolute bottom-6 w-full text-center text-white/60 text-xs tracking-wide">
            FestiWise &copy; {new Date().getFullYear()}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Exit Intent Modal - Captures abandoning users */}
          <ImprovedExitModal />

          {/* Conversion Banner */}
          <ConversionBanner variant="quiz" position="bottom" autoHide={30} />

          <SimpleHero />
          
          {/* Realtime Social Proof - Shows live user activity */}
          <section className="py-12 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <RealtimeSocialProof />
            </div>
          </section>

          {/* Festival Preview Carousel - Shows sample results without quiz */}
          <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-purple-50">
            <div className="max-w-5xl mx-auto">
              <FestivalPreviewCarousel />
            </div>
          </section>

          <SimpleFestivalGrid />
          <SimpleSocialProof />
          <SimpleNewsletter />
          <SimpleFAQ />
        </motion.div>
      )}
    </AnimatePresence>
  );
}