'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MapPin, DollarSign, Calendar, Clock, Users,
  Share2, BarChart3, Trash2, Plus, Sparkles, Tent,
} from 'lucide-react';
import rawFestivals from '@/data/festivals.json';
import type { Festival } from '@/types/festival';
import { useSmartMatchAll } from '@/hooks/useSmartMatch';
import { useCompare } from '@/contexts/CompareContext';

const allFestivals = rawFestivals as Festival[];

const STORAGE_KEY = 'festiwise_favorites';

function readFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavoriteIds(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

const BUDGET_NOTES = [
  'Ticket price only — travel and accommodation not included.',
  'Estimates based on minimum reported costs. Actual spend may vary.',
  'Exchange rates not applied — all figures in USD.',
];

export default function BucketListClient() {
  const [ids, setIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const { toggle, isSelected } = useCompare();

  useEffect(() => {
    setMounted(true);
    setIds(readFavoriteIds());
  }, []);

  const festivals = useMemo(
    () => ids.map(id => allFestivals.find(f => f.id === id)).filter(Boolean) as Festival[],
    [ids],
  );

  const matchScores = useSmartMatchAll(festivals);

  // Budget summary
  const totalMin = useMemo(() => festivals.reduce((s, f) => s + f.estimated_cost_usd.min, 0), [festivals]);
  const totalMax = useMemo(() => festivals.reduce((s, f) => s + f.estimated_cost_usd.max, 0), [festivals]);

  function remove(id: string) {
    const next = ids.filter(i => i !== id);
    setIds(next);
    saveFavoriteIds(next);
  }

  async function share() {
    const url = `${window.location.origin}/my-bucket-list?share=${ids.join(',')}`;
    const text = `My ${ids.length}-festival bucket list on FestiWise — ${totalMin.toLocaleString()}–${totalMax.toLocaleString()} USD total`;
    if (navigator.share) {
      await navigator.share({ title: 'My Festival Bucket List', text, url });
    } else {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
      </div>
    );
  }

  if (festivals.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Your bucket list is empty</h1>
        <p className="text-gray-500 max-w-sm text-lg">
          Save festivals from anywhere on the site — tap the heart icon to add them here.
        </p>
        <Link
          href="/quiz"
          className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg text-lg"
        >
          Find My Festivals
        </Link>
        <Link href="/festivals" className="text-sm text-gray-400 hover:text-purple-600 transition-colors">
          Browse all festivals →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/60 via-white to-purple-50/40">
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
              My Festival Bucket List
            </h1>
            <p className="text-gray-500 text-lg">{festivals.length} festival{festivals.length !== 1 ? 's' : ''} saved</p>
          </div>
          <button
            onClick={share}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg text-sm flex-shrink-0"
          >
            <Share2 className="w-4 h-4" />
            {shareCopied ? 'Link copied!' : 'Share List'}
          </button>
        </div>

        {/* Budget Summary Card */}
        <div className="bg-white border border-purple-100 rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            Dream Season Budget Estimate
          </h2>
          <div className="flex flex-wrap gap-6 items-end mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Minimum</div>
              <div className="text-3xl font-extrabold text-gray-900">${totalMin.toLocaleString()}</div>
            </div>
            <div className="text-2xl text-gray-300 font-light mb-1">—</div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Maximum</div>
              <div className="text-3xl font-extrabold text-purple-600">${totalMax.toLocaleString()}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm text-gray-500 mb-1">Per festival avg</div>
              <div className="text-xl font-bold text-gray-700">${Math.round((totalMin + totalMax) / 2 / festivals.length).toLocaleString()}</div>
            </div>
          </div>

          {/* Budget bar per festival */}
          <div className="space-y-2">
            {festivals.map(f => {
              const pct = Math.round((f.estimated_cost_usd.min / totalMin) * 100);
              return (
                <div key={f.id} className="flex items-center gap-3 text-sm">
                  <span className="w-32 truncate text-gray-600 font-medium flex-shrink-0">{f.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-gray-500 tabular-nums w-20 text-right">${f.estimated_cost_usd.min.toLocaleString()}+</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 mt-4">{BUDGET_NOTES[0]}</p>
        </div>

        {/* Compare shortcut */}
        {festivals.length >= 2 && (
          <Link
            href={`/compare?ids=${festivals.slice(0, 3).map(f => f.id).join(',')}`}
            className="flex items-center gap-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl px-5 py-4 mb-6 transition-colors group"
          >
            <BarChart3 className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-purple-800 text-sm">Compare your saved festivals</div>
              <div className="text-xs text-purple-500">Side-by-side table of your top picks</div>
            </div>
            <span className="text-purple-400 group-hover:translate-x-1 transition-transform text-lg">→</span>
          </Link>
        )}

        {/* Festival cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {festivals.map((f, idx) => {
              const match = matchScores.get(f.id);
              const budgetTier =
                f.estimated_cost_usd.min < 400 ? { label: 'Budget', color: 'text-green-600 bg-green-50' }
                : f.estimated_cost_usd.min < 1000 ? { label: 'Mid-range', color: 'text-amber-600 bg-amber-50' }
                : { label: 'Premium', color: 'text-purple-600 bg-purple-50' };

              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  layout
                  className="bg-white border border-gray-100 hover:border-purple-200 hover:shadow-lg rounded-2xl p-5 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Position number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link
                          href={`/festival/${f.id}`}
                          className="text-lg font-bold text-gray-900 hover:text-purple-700 transition-colors"
                        >
                          {f.name}
                        </Link>
                        {match && (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">
                            <Sparkles className="w-2.5 h-2.5" />
                            {match.label}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {f.city}, {f.country}
                      </p>

                      {/* Stats row */}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {f.months.slice(0, 2).join(' & ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {f.duration_days} days
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="capitalize">{f.audience_size}</span>
                        </span>
                        {f.camping && (
                          <span className="flex items-center gap-1">
                            <Tent className="w-3.5 h-3.5" />
                            {f.glamping ? 'Glamping' : 'Camping'}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${budgetTier.color}`}>
                          {budgetTier.label}
                        </span>
                      </div>
                    </div>

                    {/* Cost + actions */}
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <div className="text-right">
                        <div className="text-base font-bold text-gray-900">${f.estimated_cost_usd.min.toLocaleString()}+</div>
                        <div className="text-xs text-gray-400">est. total</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggle(f)}
                          title={isSelected(f.id) ? 'In compare' : 'Add to compare'}
                          className={`p-2 rounded-lg transition-colors ${isSelected(f.id) ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => remove(f.id)}
                          title="Remove from bucket list"
                          className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Add more */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/quiz"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Find More Festivals
          </Link>
          <Link
            href="/festivals"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-purple-200 text-purple-700 font-semibold rounded-xl hover:border-purple-400 transition-colors"
          >
            Browse All 100+ Festivals
          </Link>
        </div>

      </div>
    </div>
  );
}
