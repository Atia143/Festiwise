'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Content component (does not use client hooks like useSearchParams)
function NotFoundContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('/globe.svg')] opacity-5 bg-repeat-space"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* 404 Number */}
          <motion.h1
            className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            404
          </motion.h1>

          {/* Message */}
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Festival Not Found
          </motion.h2>

          <motion.p
            className="text-lg text-white/80 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Looks like this page got lost in the crowd. Let's get you back to discovering amazing festivals!
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Back to Home
            </Link>
            <Link
              href="/quiz"
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white/50 hover:bg-white/10 transition-all duration-200 transform hover:scale-105"
            >
              Take the Quiz
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="mt-12 pt-8 border-t border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <p className="text-white/60 mb-4">Or explore these popular sections:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/blog" className="text-white/80 hover:text-white transition-colors">
                Festival Guides
              </Link>
              <span className="text-white/40">•</span>
              <Link href="/faq" className="text-white/80 hover:text-white transition-colors">
                FAQ
              </Link>
              <span className="text-white/40">•</span>
              <Link href="/festivals" className="text-white/80 hover:text-white transition-colors">
                Browse Festivals
              </Link>
              <span className="text-white/40">•</span>
              <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                About Us
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Defensive: Wrap with Suspense in case any child uses useSearchParams
export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <NotFoundContent />
    </Suspense>
  );
}