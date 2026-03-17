'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

// Pages where exit modal should never fire
const BLOCKED_PATHS = ['/quiz', '/search', '/pricing', '/contact', '/for-festivals'];

// Context-aware copy per path
function getCopy(pathname: string) {
  if (pathname.startsWith('/festival/')) {
    return {
      headline: 'Not sure this is the one?',
      sub: 'Answer 5 questions and we\'ll rank every festival in our database against your taste, budget, and vibe.',
      cta: 'Find my perfect match →',
    };
  }
  if (pathname.startsWith('/compare/')) {
    return {
      headline: 'Want a personalised comparison?',
      sub: 'The quiz scores all 100+ festivals specifically for you — not a generic side-by-side.',
      cta: 'Take the quiz — 2 min →',
    };
  }
  if (pathname.startsWith('/best/') || pathname.startsWith('/collections/')) {
    return {
      headline: 'See your personal best-of.',
      sub: 'These lists are curated. Yours would be ranked by your exact genres, budget, and travel window.',
      cta: 'Build my personal list →',
    };
  }
  if (pathname.startsWith('/music-festivals-in/')) {
    return {
      headline: 'Want festivals matched to you?',
      sub: 'Not just by city — by vibe, budget, and genre. 5 questions, instant results.',
      cta: 'Find my match →',
    };
  }
  if (pathname.startsWith('/festival-calendar')) {
    return {
      headline: 'Which month is right for you?',
      sub: 'The quiz factors in your timing, budget, and music taste — and ranks every festival accordingly.',
      cta: 'Match me to a date →',
    };
  }
  // Default / homepage
  return {
    headline: 'Before you go —',
    sub: '5 questions. Personalised results from 100+ festivals worldwide. Takes 2 minutes.',
    cta: 'Find my festival →',
  };
}

const STATS = [
  { value: '100+', label: 'festivals ranked' },
  { value: '2 min', label: 'to complete' },
  { value: 'Free', label: 'no account needed' },
];

export default function ImprovedExitModal() {
  const [show, setShow] = useState(false);
  const shown = useRef(false);
  const pathname = usePathname() ?? '';

  const blocked = BLOCKED_PATHS.some(p => pathname.startsWith(p));

  const trigger = useCallback(() => {
    if (shown.current || blocked) return;
    // Don't show if user has already taken the quiz
    try {
      const saved = localStorage.getItem('festi_quiz_v1');
      if (saved && JSON.parse(saved)?.isCompleted) return;
    } catch { /* ignore */ }
    shown.current = true;
    setShow(true);
  }, [blocked]);

  useEffect(() => {
    if (blocked) return;

    // Desktop: mouse leaves top of viewport
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };
    document.addEventListener('mouseleave', onMouseLeave);

    // Mobile: fire after 45s of inactivity
    const timer = setTimeout(trigger, 45000);

    // Escape key to close
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShow(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('keydown', onKey);
      clearTimeout(timer);
    };
  }, [blocked, trigger]);

  const copy = getCopy(pathname);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{ opacity: 0,    y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Top gradient bar */}
            <div className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 px-6 pt-7 pb-6">
              {/* Close */}
              <button
                onClick={() => setShow(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">FestiWise Quiz</span>
              </div>

              {/* Headline */}
              <h2 className="text-white font-black text-2xl leading-snug mb-2">
                {copy.headline}
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                {copy.sub}
              </p>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
              {STATS.map(s => (
                <div key={s.label} className="px-3 py-3 text-center">
                  <div className="text-base font-black text-gray-900">{s.value}</div>
                  <div className="text-gray-400 text-[10px] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-6 py-5 space-y-3">
              <Link
                href="/quiz"
                onClick={() => setShow(false)}
                className="block w-full text-center py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-purple-200 text-sm"
              >
                {copy.cta}
              </Link>
              <button
                onClick={() => setShow(false)}
                className="block w-full text-center py-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
              >
                Not now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
