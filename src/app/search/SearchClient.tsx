'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { Festival } from '@/types/festival';
import { getFestivalCover } from '@/lib/festivalImages';
import Image from 'next/image';

import rawFestivals from '@/data/festivals.json';
const ALL_FESTIVALS = rawFestivals as Festival[];

// ── Fuse.js setup ──────────────────────────────────────────────────────────────
const fuse = new Fuse(ALL_FESTIVALS, {
  keys: [
    { name: 'name',    weight: 3.0 },
    { name: 'genres',  weight: 2.0 },
    { name: 'city',    weight: 2.0 },
    { name: 'country', weight: 1.5 },
    { name: 'vibe',    weight: 1.0 },
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
});

// ── Filter constants ───────────────────────────────────────────────────────────
const GENRE_GROUPS: { label: string; values: string[] }[] = [
  { label: 'EDM',       values: ['edm', 'electronic', 'house', 'techno', 'trance', 'hardstyle', 'psytrance', 'dubstep', "drum'n'bass", 'bass'] },
  { label: 'Rock',      values: ['rock', 'metal', 'hardcore', 'indie'] },
  { label: 'Pop',       values: ['pop'] },
  { label: 'Hip-Hop',   values: ['hiphop', 'rap', 'trap', 'rnb'] },
  { label: 'Jazz',      values: ['jazz', 'blues', 'soul'] },
  { label: 'World',     values: ['world', 'folk', 'afrobeat', 'reggae', 'latin'] },
  { label: 'Classical', values: ['classical'] },
  { label: 'Ambient',   values: ['ambient', 'experimental'] },
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const BUDGET_FILTERS = [
  { label: 'Under $200',    min: 0,    max: 200  },
  { label: '$200–$500',     min: 200,  max: 500  },
  { label: '$500–$1,000',   min: 500,  max: 1000 },
  { label: 'Over $1,000',   min: 1000, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'relevance',   label: 'Best match'  },
  { value: 'cheapest',    label: 'Cheapest'    },
  { value: 'popular',     label: 'Most popular'},
  { value: 'duration',    label: 'Longest'     },
];

const SIZE_ORDER: Record<string, number> = { massive: 4, large: 3, medium: 2, small: 1 };

// ── Helper ─────────────────────────────────────────────────────────────────────
function festivalMatchesFilters(
  f: Festival,
  genre: string,
  month: string,
  budget: number,
  country: string,
): boolean {
  if (genre) {
    const groupValues = GENRE_GROUPS.find(g => g.label === genre)?.values ?? [];
    if (!f.genres.some(g => groupValues.includes(g))) return false;
  }
  if (month && !f.months.some(m => m.toLowerCase().startsWith(month.toLowerCase().slice(0, 3)))) return false;
  if (budget > 0 && f.estimated_cost_usd.min > budget) return false;
  if (country && f.country !== country) return false;
  return true;
}

// ── FestivalCard ───────────────────────────────────────────────────────────────
function FestivalCard({ festival }: { festival: Festival }) {
  const { imageUrl, gradient } = getFestivalCover(festival.id, festival.genres);
  const cost = `$${festival.estimated_cost_usd.min}–$${festival.estimated_cost_usd.max}`;
  const months = festival.months.slice(0, 2).join(', ');

  return (
    <Link
      href={`/festival/${festival.id}`}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={festival.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} group-hover:scale-105 transition-transform duration-300`} />
        )}
        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-1.5">
          {festival.camping && (
            <span className="bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">Camping</span>
          )}
          {festival.family_friendly && (
            <span className="bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">Family</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-purple-700 transition-colors line-clamp-1">
          {festival.name}
        </h3>
        <p className="text-xs text-gray-500">{festival.city}, {festival.country} · {months}</p>

        {/* Genres */}
        <div className="flex flex-wrap gap-1">
          {festival.genres.slice(0, 3).map(g => (
            <span key={g} className="text-[10px] font-medium bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full capitalize">{g}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">{cost}</span>
          <span className="text-xs text-gray-400 capitalize">{festival.audience_size}</span>
        </div>
      </div>
    </Link>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQ = searchParams?.get('q') ?? '';

  const [query,   setQuery]   = useState(initialQ);
  const [genre,   setGenre]   = useState('');
  const [month,   setMonth]   = useState('');
  const [budget,  setBudget]  = useState(0);
  const [country, setCountry] = useState('');
  const [sort,    setSort]    = useState<'relevance' | 'cheapest' | 'popular' | 'duration'>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const countries = useMemo(() => [...new Set(ALL_FESTIVALS.map(f => f.country))].sort(), []);

  // Sync URL ↔ state
  useEffect(() => {
    const q = searchParams?.get('q') ?? '';
    setQuery(q);
  }, [searchParams]);

  const updateURL = useCallback((q: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    router.replace(`/search${params.size ? '?' + params.toString() : ''}`, { scroll: false });
  }, [router]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    updateURL(e.target.value);
  }, [updateURL]);

  // Compute results
  const results = useMemo(() => {
    let base: Festival[];

    if (query.trim().length >= 2) {
      base = fuse.search(query.trim()).map(r => r.item);
    } else {
      base = [...ALL_FESTIVALS];
    }

    // Apply filters
    base = base.filter(f => festivalMatchesFilters(f, genre, month, budget, country));

    // Sort
    if (sort === 'cheapest') {
      base = [...base].sort((a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min);
    } else if (sort === 'popular') {
      base = [...base].sort((a, b) => (SIZE_ORDER[b.audience_size] ?? 0) - (SIZE_ORDER[a.audience_size] ?? 0));
    } else if (sort === 'duration') {
      base = [...base].sort((a, b) => b.duration_days - a.duration_days);
    }
    // 'relevance' = Fuse order (already sorted) or default JSON order

    return base;
  }, [query, genre, month, budget, country, sort]);

  const hasFilters = genre || month || budget > 0 || country;

  function clearAll() {
    setGenre('');
    setMonth('');
    setBudget(0);
    setCountry('');
    setQuery('');
    updateURL('');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero search bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="relative flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={handleChange}
                autoFocus={!initialQ}
                placeholder="Search festivals, cities, genres, vibes…"
                className="w-full pl-12 pr-10 py-3.5 text-base text-gray-900 bg-gray-50 rounded-2xl border border-gray-200 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all placeholder-gray-400"
              />
              {query && (
                <button onClick={() => { setQuery(''); updateURL(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border font-medium text-sm transition-all ${
                hasFilters
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasFilters && <span className="bg-white/30 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{[genre,month,budget>0,country].filter(Boolean).length}</span>}
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3">
              {/* Genre */}
              <div className="flex flex-wrap gap-1.5">
                {GENRE_GROUPS.map(g => (
                  <button
                    key={g.label}
                    onClick={() => setGenre(genre === g.label ? '' : g.label)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                      genre === g.label
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              <div className="w-full h-px bg-gray-100" />

              {/* Month */}
              <div className="flex flex-wrap gap-1.5">
                {MONTHS.map(m => (
                  <button
                    key={m}
                    onClick={() => setMonth(month === m ? '' : m)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                      month === m
                        ? 'bg-pink-500 border-pink-500 text-white'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'
                    }`}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>

              <div className="w-full h-px bg-gray-100" />

              {/* Budget + Country + Sort */}
              <div className="flex flex-wrap gap-2 items-center w-full">
                {/* Budget */}
                <select
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-purple-400"
                >
                  <option value={0}>Any budget</option>
                  {BUDGET_FILTERS.map(b => (
                    <option key={b.label} value={b.max === Infinity ? b.min : b.max}>{b.label}</option>
                  ))}
                </select>

                {/* Country */}
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-purple-400"
                >
                  <option value="">Any country</option>
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as typeof sort)}
                  className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-purple-400"
                >
                  {SORT_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>

                {hasFilters && (
                  <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600 font-medium ml-auto">
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Count + context */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {query.trim().length >= 2 || hasFilters
              ? <><span className="font-semibold text-gray-900">{results.length}</span> festival{results.length !== 1 ? 's' : ''} found{query ? ` for "${query}"` : ''}</>
              : <><span className="font-semibold text-gray-900">{results.length}</span> festivals in the database</>
            }
          </p>
          {!showFilters && (
            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-purple-400"
            >
              {SORT_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map(f => (
              <FestivalCard key={f.id} festival={f} />
            ))}
          </div>
        ) : (
          /* No results */
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-gray-900 mb-2">No festivals found</p>
            <p className="text-gray-500 mb-8">
              {query ? `Nothing matched "${query}"` : 'Try adjusting your filters'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={clearAll} className="px-6 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:border-gray-300 transition-all">
                Clear search
              </button>
              <Link
                href="/quiz"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-sm font-bold hover:opacity-90 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Take the quiz instead
              </Link>
            </div>
          </div>
        )}

        {/* Quiz CTA at bottom */}
        {results.length > 0 && (
          <div className="mt-16 text-center bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-10 text-white">
            <p className="text-2xl font-black mb-2">Not sure which one is right for you?</p>
            <p className="text-white/80 mb-6">Our 5-question quiz matches you to the perfect festival based on your vibe, budget, and travel window.</p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold rounded-2xl hover:bg-purple-50 transition-all shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Find my festival — 2 min
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
