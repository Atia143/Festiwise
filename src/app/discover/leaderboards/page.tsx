'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import SimpleNewsletterForm from '@/components/Newsletter/SimpleNewsletterForm';
import festivalsData from '@/data/festivals.json';

interface Festival {
  id: string;
  name: string;
  country: string;
  city: string;
  region: string;
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  audience_size: string;
  duration_days: number;
  family_friendly: boolean;
  camping: boolean;
  glamping: boolean;
  vibe: string[];
  website: string;
  months: string[];
}

interface RankedFestival extends Festival {
  score: number;
  reason: string;
}

type LeaderboardType = 'trending' | 'budget-friendly' | 'largest' | 'most-diverse' | 'best-vibes';

const LEADERBOARDS: Record<LeaderboardType, {
  title: string;
  emoji: string;
  description: string;
  scoreFn: (f: Festival) => number;
  reason: (f: Festival) => string;
}> = {
  'trending': {
    title: 'Trending This Week',
    emoji: '🔥',
    description: 'Hottest festivals gaining momentum right now',
    scoreFn: (_f) => Math.random() * 100, // Simulated trending score
    reason: (f) => `${f.name} is trending in ${f.region}!`
  },
  'budget-friendly': {
    title: 'Best Budget Festivals',
    emoji: '💰',
    description: 'Top festivals with the best value for money',
    scoreFn: (f) => 100 - (f.estimated_cost_usd.min / 10),
    reason: (f) => `Starting at just $${f.estimated_cost_usd.min}`
  },
  'largest': {
    title: 'Biggest Festivals',
    emoji: '👥',
    description: 'Festivals with the largest audiences and biggest lineups',
    scoreFn: (f) => {
      const audienceMap = { 'massive': 100, 'large': 75, 'medium': 50, 'small': 25 };
      return audienceMap[f.audience_size as keyof typeof audienceMap] || 0;
    },
    reason: (f) => `${f.audience_size} audience with premium lineups`
  },
  'most-diverse': {
    title: 'Most Diverse Festivals',
    emoji: '🎵',
    description: 'Festivals featuring the widest range of music genres',
    scoreFn: (f) => f.genres.length * 20,
    reason: (f) => `${f.genres.length} genres: ${f.genres.slice(0, 3).join(', ')}`
  },
  'best-vibes': {
    title: 'Best Vibes',
    emoji: '✨',
    description: 'Festivals with the most positive and unique atmospheres',
    scoreFn: (f) => f.vibe.length * 15 + (f.glamping ? 20 : 0),
    reason: (f) => `Vibes: ${f.vibe.slice(0, 2).join(', ')}`
  }
};

export default function LeaderboardsPage() {
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<LeaderboardType>('trending');
  const [isLoading, setIsLoading] = useState(true);
  const [savedFestivals, setSavedFestivals] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(false);
    const saved = localStorage.getItem('saved-festivals');
    if (saved) {
      setSavedFestivals(JSON.parse(saved));
    }
  }, []);

  const toggleSave = (festivalId: string) => {
    const newSaved = savedFestivals.includes(festivalId)
      ? savedFestivals.filter(id => id !== festivalId)
      : [...savedFestivals, festivalId];
    setSavedFestivals(newSaved);
    localStorage.setItem('saved-festivals', JSON.stringify(newSaved));
  };

  const rankedFestivals = useMemo(() => {
    if (isLoading) return [];
    const config = LEADERBOARDS[selectedLeaderboard];
    return (festivalsData as Festival[])
      .map(f => ({
        ...f,
        score: config.scoreFn(f),
        reason: config.reason(f)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }, [selectedLeaderboard, isLoading]);

  const currentConfig = LEADERBOARDS[selectedLeaderboard];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-3xl">🏆</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Loading Rankings</h2>
          <p className="text-lg text-gray-600">Calculating festival scores...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 -mt-20 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/80 to-pink-800/90" />
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8">
              <span className="text-2xl">🏆</span>
              <span className="text-white font-semibold">Rankings & Leaderboards</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
              Festival <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">Rankings</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              {currentConfig.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leaderboard Selector */}
      <section className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {(Object.keys(LEADERBOARDS) as LeaderboardType[]).map((lb) => (
              <motion.button
                key={lb}
                onClick={() => setSelectedLeaderboard(lb)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedLeaderboard === lb
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {LEADERBOARDS[lb].emoji} {LEADERBOARDS[lb].title}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Rankings Table */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-4">
            {rankedFestivals.map((festival: RankedFestival, index: number) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Link href={`/festival/${festival.id}`}>
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:scale-[1.01] cursor-pointer">
                    <div className="flex items-center gap-6 p-6">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                        </div>
                      </div>

                      {/* Festival Info */}
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{festival.name}</h3>
                        <p className="text-gray-600 mb-3">{festival.city}, {festival.country}</p>
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge>{festival.audience_size}</Badge>
                          <Badge>${festival.estimated_cost_usd.min}-${festival.estimated_cost_usd.max}</Badge>
                          <span className="text-sm text-purple-600 font-semibold">{festival.reason}</span>
                        </div>
                      </div>

                      {/* Save & Score */}
                      <div className="flex-shrink-0 flex flex-col items-end gap-4">
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSave(festival.id);
                          }}
                          className="text-3xl"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {savedFestivals.includes(festival.id) ? '❤️' : '🤍'}
                        </motion.button>
                        <div className="text-center">
                          <div className="text-3xl font-black text-purple-600">{Math.round(festival.score)}</div>
                          <div className="text-xs text-gray-600 font-semibold">Score</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Newsletter CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <SimpleNewsletterForm />
      </div>
    </div>
  );
}
