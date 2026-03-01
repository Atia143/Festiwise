'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    id: '1',
    step: '01',
    title: 'Tell us your vibe',
    body: 'Answer 8 questions about your music taste, travel style, and budget. Takes under 2 minutes — no sign-up required.',
    detail: 'Genre preferences · Budget range · Travel distance · Group size · Camping or hotel',
    cta: { label: 'Start the Quiz', href: '/quiz' },
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: '2',
    step: '02',
    title: 'We score 100+ festivals',
    body: 'Our algorithm runs 50+ matching factors across every festival in the database — from lineup and vibe to cost and logistics.',
    detail: 'Genre match · Budget fit · Audience size · Camping options · Weather profile',
    cta: { label: 'Browse Festivals', href: '/festivals' },
    color: 'from-indigo-600 to-purple-600',
  },
  {
    id: '3',
    step: '03',
    title: 'See your ranked matches',
    body: 'Results are ranked by match percentage — with full details on cost, lineup genres, camping, family-friendliness, and more.',
    detail: 'Match score · Cost estimate · Ticket links · Festival highlights · Similar events',
    cta: { label: 'See How It Works', href: '/faq' },
    color: 'from-pink-600 to-rose-600',
  },
  {
    id: '4',
    step: '04',
    title: 'Save and share your picks',
    body: 'Favourite festivals are saved to your device. Share your top match with friends or challenge them to beat your score.',
    detail: 'Browser-based saves · One-tap sharing · "Challenge a Friend" link',
    cta: { label: 'Try the Quiz', href: '/quiz' },
    color: 'from-teal-600 to-emerald-600',
  },
  {
    id: '5',
    step: '05',
    title: 'Get ticket alerts',
    body: 'Subscribe to a specific festival and we\'ll notify you when ticket sales open or when there\'s a price drop.',
    detail: 'Per-festival alerts · Early-bird notifications · No spam — unsubscribe anytime',
    cta: { label: 'Browse Festivals', href: '/festivals' },
    color: 'from-orange-600 to-amber-600',
  },
];

export default function InstantTestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const slide = SLIDES[current];

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="text-center px-8 pt-10 pb-6">
        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-widest rounded-full mb-4">
          How It Works
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          From quiz to festival — in 5 steps
        </h2>
      </div>

      {/* Slide */}
      <div className="px-6 pb-6">
        <div className={`relative bg-gradient-to-br ${slide.color} rounded-2xl overflow-hidden`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="p-8 md:p-10"
            >
              <div className="flex items-start gap-4 mb-5">
                <span className="text-white/30 font-black text-5xl leading-none select-none">
                  {slide.step}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                  <p className="text-white/85 leading-relaxed text-base">{slide.body}</p>
                </div>
              </div>

              {/* Detail chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {slide.detail.split(' · ').map((tag) => (
                  <span key={tag} className="text-xs text-white/70 bg-white/10 rounded-full px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href={slide.cta.href}
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all shadow-md"
              >
                {slide.cta.label}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation dots */}
      <div
        className="flex justify-center gap-2 pb-8"
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        {SLIDES.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => { setCurrent(i); setAutoPlay(false); }}
            animate={{ width: i === current ? 28 : 8, backgroundColor: i === current ? '#9333ea' : '#e5e7eb' }}
            transition={{ duration: 0.25 }}
            className="h-2 rounded-full"
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
