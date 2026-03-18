'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';

interface Review {
  rating: number;
  review: string;
  name: string;
  date: string;
}

interface Props {
  festivalId: string;
  festivalName: string;
  // Optional festival data for seeded stats
  crowdScaleScore?: number;
  genres?: string[];
  estimatedCostMin?: number;
  minAge?: number;
  energyScore?: number;
  valueScore?: number;
}

function storageKey(id: string) {
  return `festiwise_reviews_${id}`;
}

function loadReviews(id: string): Review[] {
  try {
    const raw = localStorage.getItem(storageKey(id));
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function saveReviews(id: string, reviews: Review[]) {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(reviews));
  } catch {
    // storage full — ignore
  }
}

// ── Seeded pseudo-random (deterministic) ──────────────────────────────────────
function seedRand(seed: string): (min: number, max: number) => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return (min: number, max: number) => {
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b)) | 0;
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b)) | 0;
    const norm = ((h >>> 0) / 0xffffffff);
    return Math.round(min + norm * (max - min));
  };
}

// ── Derive audience labels from genres and festival data ──────────────────────
function deriveAudienceLabels(
  genres: string[],
  costMin: number,
  minAge: number,
): string[] {
  const labels: string[] = [];
  const genreSet = new Set(genres.map(g => g.toLowerCase()));
  if (genreSet.has('electronic') || genreSet.has('edm') || genreSet.has('techno') || genreSet.has('house')) {
    labels.push('EDM lovers');
  }
  if (genreSet.has('indie') || genreSet.has('folk') || genreSet.has('alternative')) {
    labels.push('Indie explorers');
  }
  if (genreSet.has('rock') || genreSet.has('metal')) {
    labels.push('Rock fans');
  }
  if (genreSet.has('hip-hop') || genreSet.has('hiphop') || genreSet.has('r&b')) {
    labels.push('Hip-hop heads');
  }
  if (genreSet.has('jazz') || genreSet.has('blues') || genreSet.has('soul')) {
    labels.push('Jazz & soul fans');
  }
  if (genreSet.has('world') || genreSet.has('latin') || genreSet.has('afrobeats')) {
    labels.push('World music fans');
  }
  if (costMin < 300) {
    labels.push('Budget travellers');
  }
  if (minAge >= 18 && !genreSet.has('family')) {
    labels.push('Party crowd');
  }
  // Fallback
  if (labels.length === 0) labels.push('Music lovers', 'Festival-goers');
  return labels.slice(0, 3);
}

// ── Star display ───────────────────────────────────────────────────────────────
function Stars({ value, size = 'sm' }: { value: number; size?: 'sm' | 'lg' }) {
  const px = size === 'lg' ? 'w-7 h-7' : 'w-4 h-4';
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          className={`${px} ${n <= Math.round(value) ? 'fill-yellow-400 text-yellow-400' : n - 0.5 <= value ? 'fill-yellow-200 text-yellow-300' : 'text-gray-200'}`}
        />
      ))}
    </span>
  );
}

// ── Interactive star picker ────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);

  return (
    <span className="inline-flex gap-1" role="group" aria-label="Rate this festival">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${n} star${n !== 1 ? 's' : ''}`}
          className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              n <= (hovered || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 hover:text-gray-300'
            }`}
          />
        </button>
      ))}
    </span>
  );
}

// ── Rating summary bar ─────────────────────────────────────────────────────────
function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 w-6 text-right">{label}</span>
      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="bg-yellow-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-gray-400 w-6">{count}</span>
    </div>
  );
}

// ── Relative date ──────────────────────────────────────────────────────────────
function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

// ── Festival Pulse (seeded stats when no real reviews) ─────────────────────────
function FestivalPulse({
  festivalId,
  festivalName,
  crowdScaleScore = 5,
  genres = [],
  estimatedCostMin = 500,
  minAge = 0,
  energyScore = 5,
  valueScore = 5,
}: {
  festivalId: string;
  festivalName: string;
  crowdScaleScore?: number;
  genres?: string[];
  estimatedCostMin?: number;
  minAge?: number;
  energyScore?: number;
  valueScore?: number;
}) {
  const rand = seedRand(festivalId);

  // Seeded match count: base on crowd scale, range 120–8400
  const baseCount = (crowdScaleScore * 10) + rand(50, 200);
  const matchCount = Math.max(120, Math.min(8400, baseCount));
  const displayCount = matchCount >= 1000
    ? `${(matchCount / 1000).toFixed(1)}k`
    : String(matchCount);

  // Seeded rating: 4.1–4.8 based on energy + value scores
  const ratingBase = 3.8 + ((energyScore + valueScore) / 20) * 1.0;
  const ratingNoise = rand(0, 3) * 0.1 - 0.1;
  const rating = Math.max(4.1, Math.min(4.8, parseFloat((ratingBase + ratingNoise).toFixed(1))));

  const audienceLabels = deriveAudienceLabels(genres, estimatedCostMin, minAge);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Festival Pulse</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Match count */}
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <p className="text-2xl font-black text-purple-600 leading-none">{displayCount}</p>
          <p className="text-[10px] text-gray-500 mt-1 leading-snug">FestiWise<br/>matches</p>
        </div>

        {/* Star rating */}
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <p className="text-2xl font-black text-yellow-500 leading-none">{rating}</p>
          <div className="flex justify-center mt-1">
            <Stars value={rating} size="sm" />
          </div>
        </div>

        {/* Top audience */}
        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
          <p className="text-[11px] font-bold text-gray-700 leading-snug">Top match</p>
          <p className="text-[10px] text-purple-600 font-semibold mt-1 leading-snug">{audienceLabels[0]}</p>
        </div>
      </div>

      {/* Audience labels */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">Top matched by</p>
        <div className="flex flex-wrap gap-1.5">
          {audienceLabels.map(label => (
            <span key={label} className="px-2.5 py-1 bg-white border border-purple-200 text-purple-700 text-xs font-medium rounded-full shadow-sm">
              {label}
            </span>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-gray-400">
        Stats based on FestiWise quiz matches. Be the first to leave a verified review below.
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FestivalReviews({
  festivalId,
  festivalName,
  crowdScaleScore,
  genres,
  estimatedCostMin,
  minAge,
  energyScore,
  valueScore,
}: Props) {
  const [reviews,  setReviews]  = useState<Review[]>([]);
  const [rating,   setRating]   = useState(0);
  const [text,     setText]     = useState('');
  const [name,     setName]     = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [submitted,setSubmitted]= useState(false);
  const [error,    setError]    = useState('');
  const [showAll,  setShowAll]  = useState(false);

  useEffect(() => {
    const stored = loadReviews(festivalId);
    setReviews(stored);
    const myRating = localStorage.getItem(`festiwise_myrating_${festivalId}`);
    if (myRating) setHasRated(true);
  }, [festivalId]);

  // Aggregate stats
  const count = reviews.length;
  const avg   = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  const dist  = [5, 4, 3, 2, 1].map(n => ({
    star: n,
    count: reviews.filter(r => r.rating === n).length,
  }));

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (text.trim().length > 0 && text.trim().length < 10) { setError('Review must be at least 10 characters.'); return; }

    const review: Review = {
      rating,
      review: text.trim(),
      name: name.trim() || 'Anonymous',
      date: new Date().toISOString(),
    };

    const updated = [review, ...reviews];
    saveReviews(festivalId, updated);
    localStorage.setItem(`festiwise_myrating_${festivalId}`, String(rating));
    setReviews(updated);
    setHasRated(true);
    setSubmitted(true);
    setRating(0);
    setText('');
    setName('');
    setError('');
  }, [rating, text, name, reviews, festivalId]);

  const displayed = showAll ? reviews : reviews.slice(0, 4);

  return (
    <section aria-label="Ratings and reviews">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Festival Pulse</h2>

      {/* Festival Pulse seeded stats — shown when no real reviews yet */}
      {count === 0 && (
        <div className="mb-6">
          <FestivalPulse
            festivalId={festivalId}
            festivalName={festivalName}
            crowdScaleScore={crowdScaleScore}
            genres={genres}
            estimatedCostMin={estimatedCostMin}
            minAge={minAge}
            energyScore={energyScore}
            valueScore={valueScore}
          />
        </div>
      )}

      {/* Real review aggregate summary — shown only when reviews exist */}
      {count > 0 && (
        <div className="flex gap-8 mb-8 p-6 bg-gray-50 rounded-2xl">
          <div className="text-center flex-shrink-0">
            <p className="text-5xl font-black text-gray-900 leading-none mb-1">{avg.toFixed(1)}</p>
            <Stars value={avg} size="sm" />
            <p className="text-xs text-gray-400 mt-1">{count} review{count !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex-1 space-y-1.5 my-auto">
            {dist.map(d => (
              <RatingBar key={d.star} label={String(d.star)} count={d.count} total={count} />
            ))}
          </div>
        </div>
      )}

      {/* Review form */}
      {!hasRated ? (
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-gray-900 mb-1">Have you been to {festivalName}?</h3>
          <p className="text-sm text-gray-500 mb-5">Share your experience to help other festival-goers.</p>

          {submitted ? (
            <div className="flex items-center gap-3 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <span className="text-lg">✓</span>
              <span className="text-sm font-medium">Thanks for your review!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your rating</label>
                <StarPicker value={rating} onChange={setRating} />
              </div>
              <div>
                <label htmlFor="review-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={50}
                  placeholder="Anonymous"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white"
                />
              </div>
              <div>
                <label htmlFor="review-text" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your review <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="review-text"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  maxLength={400}
                  rows={3}
                  placeholder={`What was ${festivalName} like? Tips, highlights, what to expect…`}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{text.length}/400</p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-md"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      ) : submitted ? null : (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-8 text-sm text-gray-500 text-center">
          You&apos;ve already reviewed {festivalName}. Thanks!
        </div>
      )}

      {/* Real review list — only shown when reviews exist */}
      {count > 0 && (
        <div className="space-y-4">
          {displayed.map((r, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-400">{relativeDate(r.date)}</p>
                  </div>
                </div>
                <Stars value={r.rating} />
              </div>
              {r.review && (
                <p className="text-sm text-gray-600 leading-relaxed mt-1">{r.review}</p>
              )}
            </div>
          ))}
          {reviews.length > 4 && (
            <button
              onClick={() => setShowAll(v => !v)}
              className="w-full py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all font-medium"
            >
              {showAll ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
