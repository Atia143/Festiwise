'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMemo } from 'react';
import {
  MapPin, Calendar, Clock, Users, DollarSign,
  Tent, Music, Heart, Shield, ChevronRight, Check, X,
  BarChart3, Sparkles,
} from 'lucide-react';
import rawFestivals from '@/data/festivals.json';
import type { Festival } from '@/types/festival';
import { useSmartMatchAll } from '@/hooks/useSmartMatch';

const allFestivals = rawFestivals as Festival[];

// ── Helpers ────────────────────────────────────────────────────────────────────
const AUDIENCE_ORDER = ['small', 'medium', 'large', 'massive'];
function audienceScore(s: string) { return AUDIENCE_ORDER.indexOf(s); }

function budgetLabel(min: number) {
  if (min < 400) return { label: 'Budget', color: 'text-green-600 bg-green-50' };
  if (min < 1000) return { label: 'Mid-range', color: 'text-amber-600 bg-amber-50' };
  return { label: 'Premium', color: 'text-purple-600 bg-purple-50' };
}

// Column header gradient per position
const COL_GRADIENTS = [
  'from-purple-600 to-purple-700',
  'from-pink-600 to-rose-600',
  'from-indigo-600 to-blue-600',
];

// ── Row definitions ────────────────────────────────────────────────────────────
interface CompareRow {
  id: string;
  label: string;
  icon: React.ReactNode;
  render: (f: Festival, festivals: Festival[]) => React.ReactNode;
  best?: (f: Festival) => number; // higher = better for "winner" highlight
}

const ROWS: CompareRow[] = [
  {
    id: 'location',
    label: 'Location',
    icon: <MapPin className="w-4 h-4" />,
    render: (f) => (
      <div>
        <div className="font-semibold text-gray-900">{f.city}</div>
        <div className="text-sm text-gray-500">{f.country}</div>
      </div>
    ),
  },
  {
    id: 'dates',
    label: 'When',
    icon: <Calendar className="w-4 h-4" />,
    render: (f) => (
      <div className="text-sm font-medium text-gray-900">{f.months.join(' & ')}</div>
    ),
  },
  {
    id: 'duration',
    label: 'Duration',
    icon: <Clock className="w-4 h-4" />,
    render: (f) => (
      <span className="font-bold text-gray-900">{f.duration_days} <span className="font-normal text-gray-500">days</span></span>
    ),
    best: (f) => f.duration_days,
  },
  {
    id: 'genre',
    label: 'Music',
    icon: <Music className="w-4 h-4" />,
    render: (f) => (
      <div className="flex flex-wrap gap-1">
        {f.genres.map(g => (
          <span key={g} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
            {g}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: 'vibe',
    label: 'Vibe',
    icon: <Heart className="w-4 h-4" />,
    render: (f) => (
      <div className="flex flex-wrap gap-1">
        {f.vibe.slice(0, 4).map(v => (
          <span key={v} className="px-2 py-0.5 bg-pink-50 text-pink-700 rounded-full text-xs font-medium capitalize">
            {v}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: 'price',
    label: 'Total Cost',
    icon: <DollarSign className="w-4 h-4" />,
    render: (f) => {
      const bl = budgetLabel(f.estimated_cost_usd.min);
      return (
        <div>
          <div className="font-bold text-gray-900">
            ${f.estimated_cost_usd.min.toLocaleString()} – ${f.estimated_cost_usd.max.toLocaleString()}
          </div>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${bl.color}`}>
            {bl.label}
          </span>
        </div>
      );
    },
    best: (f) => -f.estimated_cost_usd.min, // lower is better
  },
  {
    id: 'crowd',
    label: 'Crowd Size',
    icon: <Users className="w-4 h-4" />,
    render: (f) => (
      <span className="font-semibold text-gray-900 capitalize">{f.audience_size}</span>
    ),
    best: (f) => audienceScore(f.audience_size),
  },
  {
    id: 'camping',
    label: 'Camping',
    icon: <Tent className="w-4 h-4" />,
    render: (f) => (
      <div>
        {f.camping ? (
          <div className="flex items-center gap-1 text-green-600 font-semibold">
            <Check className="w-4 h-4" />
            {f.glamping ? 'Camping + Glamping' : 'Available'}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-400">
            <X className="w-4 h-4" />
            Not available
          </div>
        )}
      </div>
    ),
  },
  {
    id: 'family',
    label: 'Family Friendly',
    icon: <Heart className="w-4 h-4" />,
    render: (f) =>
      f.family_friendly ? (
        <div className="flex items-center gap-1 text-green-600 font-semibold">
          <Check className="w-4 h-4" /> Yes
        </div>
      ) : (
        <div className="flex items-center gap-1 text-gray-400">
          <X className="w-4 h-4" /> No
        </div>
      ),
  },
  {
    id: 'age',
    label: 'Min Age',
    icon: <Shield className="w-4 h-4" />,
    render: (f) => (
      <span className="font-semibold text-gray-900">
        {f.min_age ? `${f.min_age}+` : 'All ages'}
      </span>
    ),
  },
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function ComparePageClient() {
  const searchParams = useSearchParams();
  const ids = (searchParams?.get('ids') ?? '').split(',').filter(Boolean).slice(0, 3);

  const festivals = useMemo(
    () => ids.map(id => allFestivals.find(f => f.id === id)).filter(Boolean) as Festival[],
    [ids],
  );

  const matchScores = useSmartMatchAll(festivals);

  if (festivals.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">No festivals selected</h1>
        <p className="text-gray-500 max-w-sm">
          Browse our festival database and tap the Compare button on any festival card to start comparing.
        </p>
        <Link
          href="/festivals"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
        >
          Browse Festivals
        </Link>
      </div>
    );
  }

  // Determine best value for numeric rows
  function isBest(row: CompareRow, f: Festival): boolean {
    if (!row.best || festivals.length < 2) return false;
    const scores = festivals.map(row.best!);
    const max = Math.max(...scores);
    return row.best!(f) === max;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/40">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Festival Comparison
          </h1>
          <p className="text-gray-500">Side-by-side breakdown to help you choose</p>
        </div>

        {/* Festival header cards */}
        <div className="grid gap-4 mb-2" style={{ gridTemplateColumns: `200px repeat(${festivals.length}, 1fr)` }}>
          <div /> {/* empty corner */}
          {festivals.map((f, i) => (
            <div
              key={f.id}
              className={`rounded-2xl bg-gradient-to-br ${COL_GRADIENTS[i]} p-5 text-white shadow-lg`}
            >
              <div className="flex flex-wrap gap-1 mb-3">
                {f.genres.slice(0, 2).map(g => (
                  <span key={g} className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium capitalize">
                    {g}
                  </span>
                ))}
                {matchScores.has(f.id) && (
                  <span className="px-2 py-0.5 bg-white text-purple-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {matchScores.get(f.id)!.label}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold mb-1 leading-tight">{f.name}</h2>
              <p className="text-white/70 text-sm flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {f.city}, {f.country}
              </p>
              <Link
                href={`/festival/${f.id}`}
                className="mt-4 inline-flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
              >
                Full guide <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Smart Match row — only shown if quiz data exists */}
          {matchScores.size > 0 && (
            <div
              className="grid items-start gap-4 px-4 py-4 bg-purple-50/60"
              style={{ gridTemplateColumns: `200px repeat(${festivals.length}, 1fr)` }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 pt-1">
                <Sparkles className="w-4 h-4" />
                Match for You
              </div>
              {festivals.map(f => {
                const m = matchScores.get(f.id);
                return (
                  <div key={f.id} className="pt-1">
                    {m ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                              style={{ width: `${m.score}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-purple-700 tabular-nums">{m.score}%</span>
                        </div>
                        <span className="text-xs text-purple-500 font-medium capitalize">{m.tier === 'perfect' ? 'Perfect match' : m.tier === 'great' ? 'Great match' : 'Good match'}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No data</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {ROWS.map((row, rowIdx) => (
            <div
              key={row.id}
              className={`grid items-start gap-4 px-4 py-4 ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
              style={{ gridTemplateColumns: `200px repeat(${festivals.length}, 1fr)` }}
            >
              {/* Row label */}
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 pt-1">
                <span className="text-gray-400">{row.icon}</span>
                {row.label}
              </div>

              {/* Cell per festival */}
              {festivals.map((f) => {
                const winner = isBest(row, f);
                return (
                  <div
                    key={f.id}
                    className={`relative rounded-xl p-3 ${winner ? 'ring-2 ring-purple-400 bg-purple-50/60' : ''}`}
                  >
                    {winner && (
                      <span className="absolute -top-2 left-3 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
                        Best
                      </span>
                    )}
                    {row.render(f, festivals)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className={`grid gap-4 mt-4`} style={{ gridTemplateColumns: `200px repeat(${festivals.length}, 1fr)` }}>
          <div />
          {festivals.map((f, i) => (
            <div key={f.id} className="flex flex-col gap-2">
              <Link
                href={`/go/${f.id}`}
                className={`w-full text-center py-3 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity bg-gradient-to-r ${COL_GRADIENTS[i]}`}
              >
                Get Tickets
              </Link>
              <Link
                href={`/festival/${f.id}`}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Full Guide
              </Link>
            </div>
          ))}
        </div>

        {/* Add more / quiz */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/festivals"
            className="px-6 py-3 border-2 border-purple-200 text-purple-700 font-semibold rounded-xl hover:border-purple-400 transition-colors"
          >
            Add another festival
          </Link>
          <Link
            href="/quiz"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            Let us match you instead
          </Link>
        </div>
      </div>
    </div>
  );
}
