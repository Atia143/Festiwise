'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { calculateFestivalScore } from '@/utils/quizScoringAlgorithm';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatRange } from '@/lib/currencies';
import type { Festival } from '@/types/festival';
import rawFestivals from '@/data/festivals.json';

const allFestivals = rawFestivals as Festival[];

interface QuizStorage {
  answers: Parameters<typeof calculateFestivalScore>[1];
  isCompleted?: boolean;
}

function readQuiz(): QuizStorage | null {
  try {
    const raw = localStorage.getItem('festi_quiz_v1');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as QuizStorage;
    const a = parsed.answers;
    if (!a || (a.genres.length === 0 && a.vibes.length === 0)) return null;
    return parsed;
  } catch {
    return null;
  }
}

interface ScoredFestival {
  festival: Festival;
  score: number;
}

export default function ForYouSection() {
  const [quiz, setQuiz] = useState<QuizStorage | null>(null);
  const [mounted, setMounted] = useState(false);
  const { currency } = useCurrency();

  useEffect(() => {
    setMounted(true);
    setQuiz(readQuiz());
  }, []);

  const topMatches = useMemo<ScoredFestival[]>(() => {
    if (!quiz) return [];
    const scored = allFestivals
      .filter(f => f.status === 'active')
      .map(f => {
        try {
          const { score } = calculateFestivalScore(f, quiz.answers);
          return { festival: f, score: Math.min(99, Math.max(0, score)) };
        } catch {
          return { festival: f, score: 0 };
        }
      })
      .filter(x => x.score >= 54)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
    return scored;
  }, [quiz]);

  // Don't render until mounted (avoids SSR mismatch)
  if (!mounted || topMatches.length === 0) return null;

  // Derive name hint from top genres
  const topGenres = quiz?.answers?.genres ?? [];
  const genreHint = topGenres.length > 0
    ? topGenres.slice(0, 2).map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(' & ')
    : null;

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">Personalised for You</span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {genreHint ? `Your Top ${genreHint} Picks` : 'Your Top Festival Picks'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Based on your quiz results — ranked by match score</p>
          </div>
          <Link
            href="/my-recommendations"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topMatches.map(({ festival, score }, i) => (
            <motion.div
              key={festival.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
            >
              <Link
                href={`/festival/${festival.id}`}
                className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg border border-purple-100 hover:border-purple-300 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient header */}
                <div className="relative h-24 bg-gradient-to-br from-purple-600 to-pink-600 flex items-end p-3">
                  {/* Match badge */}
                  <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {score}% match
                  </span>
                  <div className="text-white">
                    <p className="font-extrabold text-base leading-tight line-clamp-1">{festival.name}</p>
                    <p className="text-xs text-white/70 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                      {festival.city}, {festival.country}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {festival.months.slice(0, 2).join(' & ')}
                    </span>
                    <span className="font-semibold text-purple-700">
                      {formatRange(festival.estimated_cost_usd.min, festival.estimated_cost_usd.max, currency)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {festival.genres.slice(0, 2).map(g => (
                      <span key={g} className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full font-medium capitalize">
                        {g}
                      </span>
                    ))}
                  </div>
                  {/* Score bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/my-recommendations"
            className="text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            See all recommendations →
          </Link>
        </div>
      </div>
    </section>
  );
}
