'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { calculateFestivalScore } from '@/utils/quizScoringAlgorithm';
import type { Festival } from '@/types/festival';
import rawFestivals from '@/data/festivals.json';

const allFestivals = rawFestivals as Festival[];

interface Match {
  festival: Festival;
  score: number;
  reasons: string[];
}

export default function MyRecommendationsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [hasQuizData, setHasQuizData] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('festi_quiz_v1');
      if (!raw) { setHasQuizData(false); return; }
      const { answers } = JSON.parse(raw);
      if (!answers || (answers.genres.length === 0 && answers.vibes.length === 0)) {
        setHasQuizData(false);
        return;
      }
      setHasQuizData(true);
      const results = allFestivals
        .filter(f => f.status === 'active')
        .map(f => {
          try {
            const { score, reasons } = calculateFestivalScore(f, answers);
            return { festival: f, score: Math.min(99, Math.round(score)), reasons };
          } catch {
            return { festival: f, score: 0, reasons: [] };
          }
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 12);
      setMatches(results);
    } catch {
      setHasQuizData(false);
    }
  }, []);

  // Loading
  if (hasQuizData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  // No quiz data
  if (!hasQuizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full text-center"
        >
          <div className="text-6xl mb-5">🎪</div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">No matches yet</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Take our 2-minute quiz so we can find your perfect festival matches based on your taste.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
          >
            Take the Quiz →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Your Matches</h1>
          <p className="text-gray-500">Ranked by how well they fit your taste profile.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((m, i) => (
            <motion.div
              key={m.festival.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all overflow-hidden"
            >
              {/* Score bar */}
              <div className="h-1.5 bg-gray-100">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${m.score}%` }}
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{m.festival.name}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{m.festival.city}, {m.festival.country}</p>
                  </div>
                  <span className="ml-3 text-lg font-black text-purple-600 tabular-nums flex-shrink-0">
                    {m.score}%
                  </span>
                </div>

                {/* Top reasons */}
                {m.reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {m.reasons.slice(0, 2).map(r => (
                      <span key={r} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span>${m.festival.estimated_cost_usd.min.toLocaleString()}–${m.festival.estimated_cost_usd.max.toLocaleString()}</span>
                  <span>·</span>
                  <span>{m.festival.duration_days} days</span>
                  <span>·</span>
                  <span>{m.festival.months.slice(0, 1).join(', ')}</span>
                </div>

                <Link
                  href={`/festival/${m.festival.id}`}
                  className="block text-center py-2.5 bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-semibold rounded-xl text-sm transition-colors"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-3">Want better matches?</p>
          <Link
            href="/quiz"
            className="inline-block border-2 border-purple-200 text-purple-700 font-bold px-6 py-3 rounded-2xl hover:border-purple-400 transition-colors"
          >
            Retake the Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
