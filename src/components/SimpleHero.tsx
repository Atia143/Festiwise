'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import festivalsData from '@/data/festivals.json';

const FESTIVAL_NAMES = (festivalsData as { name: string }[]).map(f => f.name);

const GENRES = [
  { label: 'EDM', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { label: 'Rock', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { label: 'Indie', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { label: 'Jazz', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { label: 'Hip-Hop', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { label: 'World', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  { label: 'Afrobeats', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { label: 'Classical', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
];

const STATS = [
  { value: '100+', label: 'curated festivals' },
  { value: '24',   label: 'countries covered' },
  { value: '5',    label: 'questions, 2 minutes' },
];

// Duplicate for seamless infinite loop
const TICKER_NAMES = [...FESTIVAL_NAMES, ...FESTIVAL_NAMES];

export default function SimpleHero() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const [tickerWidth, setTickerWidth] = useState(0);

  useEffect(() => {
    if (tickerRef.current) {
      setTickerWidth(tickerRef.current.scrollWidth / 2);
    }
  }, []);

  return (
    <section className="relative bg-gray-950 overflow-hidden">
      {/* Subtle radial gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-pink-600/8 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          100+ festivals curated worldwide
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-6"
        >
          Your next festival{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
            is already out there.
          </span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Tell us your music taste, budget, and travel window.
          We match you to the festivals you&apos;ll actually love.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="flex flex-col items-center gap-3 mb-10"
        >
          <Link
            href="/quiz"
            className="group inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold text-lg rounded-2xl shadow-2xl shadow-purple-900/40 hover:shadow-purple-900/60 hover:scale-[1.03] active:scale-95 transition-all duration-200 touch-manipulation"
          >
            Find My Festival
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
            >
              →
            </motion.span>
          </Link>

          <div className="flex flex-wrap justify-center gap-4 text-gray-500 text-sm">
            <span>No account needed</span>
            <span className="text-gray-700">·</span>
            <span>Takes 2 minutes</span>
            <span className="text-gray-700">·</span>
            <span>100% free</span>
          </div>
        </motion.div>

        {/* Genre pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {GENRES.map((g) => (
            <span
              key={g.label}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${g.color}`}
            >
              {g.label}
            </span>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="grid grid-cols-3 divide-x divide-white/10 border border-white/10 rounded-2xl bg-white/[0.03] mb-0"
        >
          {STATS.map(s => (
            <div key={s.label} className="px-4 py-4">
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Festival name ticker */}
      <div className="relative overflow-hidden border-t border-white/5 py-4 bg-white/[0.02]">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-950 to-transparent z-10 pointer-events-none" />

        <motion.div
          ref={tickerRef}
          className="flex gap-6 whitespace-nowrap"
          animate={tickerWidth ? { x: [0, -tickerWidth] } : {}}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {TICKER_NAMES.map((name, i) => (
            <span key={i} className="text-gray-600 text-sm font-medium flex items-center gap-4">
              <span className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0" />
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
