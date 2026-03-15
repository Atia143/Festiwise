'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

// Pages where the bar should never appear
const HIDDEN_ON = ['/quiz', '/search', '/pricing', '/for-festivals'];

// Context-aware copy per path prefix
function getCopy(pathname: string, quizDone: boolean): { headline: string; sub: string; cta: string; href: string } {
  if (quizDone) {
    return {
      headline: 'Your festival matches are ready.',
      sub:      'Pick up where you left off.',
      cta:      'View matches →',
      href:     '/quiz',
    };
  }
  if (pathname.startsWith('/festival/')) {
    return {
      headline: 'Not sure this is the one?',
      sub:      '5 questions. Your personal top 6.',
      cta:      'Find my match →',
      href:     '/quiz',
    };
  }
  if (pathname.startsWith('/compare/')) {
    return {
      headline: 'Comparison done.',
      sub:      'Get a personalised list based on your taste.',
      cta:      'Take the quiz →',
      href:     '/quiz',
    };
  }
  if (pathname.startsWith('/best/')) {
    return {
      headline: 'See your personal best-of.',
      sub:      'Ranked just for you in 2 minutes.',
      cta:      'Take the quiz →',
      href:     '/quiz',
    };
  }
  if (pathname.startsWith('/music-festivals-in/')) {
    return {
      headline: 'Want festivals matched to you?',
      sub:      'Not just by city — by vibe, budget, and genre.',
      cta:      'Take the quiz →',
      href:     '/quiz',
    };
  }
  if (pathname.startsWith('/festival-calendar')) {
    return {
      headline: 'Find the right month for you.',
      sub:      'Quiz picks the best festivals for your dates.',
      cta:      'Take the quiz →',
      href:     '/quiz',
    };
  }
  if (pathname.startsWith('/collections/')) {
    return {
      headline: 'Like this collection?',
      sub:      'We\'ll build one just for you.',
      cta:      'Find my match →',
      href:     '/quiz',
    };
  }
  // Default
  return {
    headline: 'Find your perfect festival.',
    sub:      '5 questions. Instant personalised results.',
    cta:      'Start the quiz →',
    href:     '/quiz',
  };
}

export default function StickyCTABar() {
  const [visible,   setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [quizDone,  setQuizDone]  = useState(false);
  const pathname = usePathname() ?? '';

  // Check quiz completion from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('festi_quiz_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        setQuizDone(Boolean(parsed?.isCompleted));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const hidden = HIDDEN_ON.some(p => pathname.startsWith(p));
    if (hidden || dismissed) return;

    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname, dismissed]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    setVisible(false);
  }, []);

  const hidden = HIDDEN_ON.some(p => pathname.startsWith(p));
  if (hidden || dismissed) return null;

  const copy = getCopy(pathname, quizDone);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{ y: 80,    opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950 border-t border-white/10 shadow-2xl"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* Copy */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">
                {copy.headline}
              </p>
              <p className="text-gray-400 text-xs hidden sm:block mt-0.5">
                {copy.sub}
              </p>
            </div>

            {/* CTA */}
            <Link
              href={copy.href}
              className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all touch-manipulation min-h-[40px] flex items-center whitespace-nowrap shadow-lg"
            >
              {copy.cta}
            </Link>

            {/* Dismiss */}
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
