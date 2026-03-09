'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { getRecentlyTrending } from '@/components/FestivalViewCount';
import rawFestivals from '@/data/festivals.json';
import type { Festival } from '@/types/festival';

const allFestivals = rawFestivals as Festival[];

function getTrendingScore(f: Festival): number {
  const w: Record<string, number> = { small: 1, medium: 2, large: 3, massive: 4 };
  return (w[f.audience_size] ?? 2) * f.duration_days * (f.genres.length > 2 ? 1.2 : 1);
}

// Algorithmic fallback — top 3 by trending score
const ALGO_TOP3 = [...allFestivals]
  .filter(f => f.status === 'active')
  .sort((a, b) => getTrendingScore(b) - getTrendingScore(a))
  .slice(0, 3);

export default function LiveRadarSection() {
  const [trending, setTrending] = useState<Festival[]>([]);
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0); // drives the live counter animation

  useEffect(() => {
    setMounted(true);
    // Read recently viewed festivals from localStorage
    const recent = getRecentlyTrending(3);
    const personalised = recent
      .map(({ id }) => allFestivals.find(f => f.id === id))
      .filter((f): f is Festival => !!f && f.status === 'active');

    // Fill gaps with algorithmic top if needed
    const seen = new Set(personalised.map(f => f.id));
    const fallback = ALGO_TOP3.filter(f => !seen.has(f.id));
    setTrending([...personalised, ...fallback].slice(0, 3));

    // Animate the "viewer count" every 8s for life feel
    const interval = setInterval(() => setTick(t => t + 1), 8000);
    return () => clearInterval(interval);
  }, []);

  // Per-festival "current viewers" — seeded + small drift per tick
  const viewerCounts = useMemo(() => {
    return trending.map(f => {
      const seed = f.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const base = 12 + (seed % 24);
      const drift = (tick * 3 + seed) % 7;
      return base + drift;
    });
  }, [trending, tick]);

  if (!mounted || trending.length === 0) return null;

  return (
    <section className="py-10 px-4 bg-gray-950">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {/* Live pulse */}
            <span className="relative flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0">
                <motion.span
                  className="absolute inset-0 rounded-full bg-red-500"
                  animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
              <span className="text-red-500 text-xs font-extrabold uppercase tracking-widest">Live</span>
            </span>
            <h2 className="text-white font-extrabold text-lg">Festival Radar</h2>
          </div>
          <Link
            href="/discover"
            className="flex items-center gap-1 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trending.map((festival, i) => (
            <motion.div
              key={festival.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/festival/${festival.id}`}
                className="group flex flex-col bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-2xl overflow-hidden transition-all duration-300"
              >
                {/* Rank + gradient strip */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-900/60 to-pink-900/60">
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-xs font-bold tabular-nums">#{i + 1}</span>
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  {/* Live viewer count */}
                  <motion.span
                    key={`${festival.id}-${tick}`}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-white/50 font-medium tabular-nums"
                  >
                    {viewerCounts[i]} watching
                  </motion.span>
                </div>

                {/* Content */}
                <div className="px-4 py-3 flex-1">
                  <p className="text-white font-bold text-sm leading-tight group-hover:text-purple-300 transition-colors line-clamp-1">
                    {festival.name}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">{festival.city}, {festival.country}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {festival.genres.slice(0, 2).map(g => (
                      <span key={g} className="px-2 py-0.5 bg-white/8 text-white/60 text-[10px] rounded-full font-medium capitalize border border-white/10">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-white/40 text-xs">{festival.months.slice(0, 1).join('')}</span>
                  <span className="text-white/40 text-xs">from ${festival.estimated_cost_usd.min.toLocaleString()}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
