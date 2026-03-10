'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import type { Festival } from '@/types/festival';
import { getFestivalCover } from '@/lib/festivalImages';

// Load festival data statically — no API needed
import rawFestivals from '@/data/festivals.json';
const ALL_FESTIVALS = rawFestivals as Festival[];

function score(festival: Festival, q: string): number {
  const name    = festival.name.toLowerCase();
  const city    = festival.city.toLowerCase();
  const country = festival.country.toLowerCase();
  const genres  = festival.genres.join(' ').toLowerCase();

  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 60;
  if (city.startsWith(q) || country.startsWith(q)) return 40;
  if (genres.includes(q) || city.includes(q) || country.includes(q)) return 20;
  return 0;
}

function search(query: string): Festival[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return ALL_FESTIVALS
    .map(f => ({ festival: f, score: score(f, q) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(x => x.festival);
}

interface Props {
  onClose?: () => void;
}

export default function FestivalSearch({ onClose }: Props) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<Festival[]>([]);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState(-1);
  const inputRef  = useRef<HTMLInputElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActive(-1);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    const hits = search(val);
    setResults(hits);
    setOpen(hits.length > 0);
    setActive(-1);
  }, []);

  function handleKey(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    } else if (e.key === 'Enter' && active >= 0) {
      window.location.href = `/festival/${results[active].id}`;
    }
  }

  function clear() {
    setQuery('');
    setResults([]);
    setOpen(false);
    setActive(-1);
    inputRef.current?.focus();
  }

  function handleSelect() {
    setQuery('');
    setResults([]);
    setOpen(false);
    onClose?.();
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKey}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search festivals, cities, genres…"
          autoComplete="off"
          spellCheck={false}
          className="w-full pl-9 pr-8 py-2 text-sm text-gray-900 bg-gray-100 rounded-xl border border-transparent focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all placeholder-gray-400"
          aria-label="Search festivals"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-2.5 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <ul role="listbox">
            {results.map((festival, i) => {
              const { imageUrl, gradient } = getFestivalCover(festival.id, festival.genres);
              return (
                <li key={festival.id} role="option" aria-selected={i === active}>
                  <Link
                    href={`/festival/${festival.id}`}
                    onClick={handleSelect}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors ${
                      i === active ? 'bg-purple-50' : ''
                    } ${i > 0 ? 'border-t border-gray-50' : ''}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={festival.name} fill sizes="40px" className="object-cover" />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{festival.name}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {festival.city}, {festival.country} · {festival.months[0]}
                      </p>
                    </div>

                    {/* Primary genre pill */}
                    <span className="hidden sm:inline-flex text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                      {festival.genres[0]}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Footer hint */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
            <Link
              href={`/festivals`}
              onClick={handleSelect}
              className="text-xs text-purple-600 font-medium hover:text-purple-700"
            >
              Browse all 100+ →
            </Link>
          </div>
        </div>
      )}

      {/* No results */}
      {open && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
          <div className="px-4 py-5 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">No festivals found for &ldquo;{query}&rdquo;</p>
            <Link
              href="/quiz"
              onClick={handleSelect}
              className="text-xs text-purple-600 font-medium hover:underline"
            >
              Take the quiz to find your match →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
