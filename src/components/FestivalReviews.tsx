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

// ── Star display ───────────────────────────────────────────────────────────────
function Stars({ value, size = 'sm' }: { value: number; size?: 'sm' | 'lg' }) {
  const px = size === 'lg' ? 'w-7 h-7' : 'w-4 h-4';
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          className={`${px} ${n <= Math.round(value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
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

// ── Main component ─────────────────────────────────────────────────────────────
export default function FestivalReviews({ festivalId, festivalName }: Props) {
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
    // Check if this browser already submitted
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Ratings &amp; Reviews</h2>

      {/* Aggregate summary */}
      {count > 0 && (
        <div className="flex gap-8 mb-8 p-6 bg-gray-50 rounded-2xl">
          {/* Big average */}
          <div className="text-center flex-shrink-0">
            <p className="text-5xl font-black text-gray-900 leading-none mb-1">{avg.toFixed(1)}</p>
            <Stars value={avg} size="sm" />
            <p className="text-xs text-gray-400 mt-1">{count} review{count !== 1 ? 's' : ''}</p>
          </div>

          {/* Distribution bars */}
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
              {/* Star picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your rating</label>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              {/* Name */}
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

              {/* Review text */}
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

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <Stars value={0} />
          <p className="mt-3 text-sm">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((r, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  {/* Avatar */}
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
