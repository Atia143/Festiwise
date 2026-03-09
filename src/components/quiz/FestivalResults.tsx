'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from './QuizContext';
import festivalsData from '../../data/festivals.json';
import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';
import { getTopFestivalMatches } from '@/utils/quizScoringAlgorithm';
import QuizResultsShare from '@/components/QuizResultsShare';
import ConfettiBurst from '@/components/ui/ConfettiBurst';

interface Festival {
  id: string;
  name: string;
  city: string;
  country: string;
  region?: string;
  months: string[];
  genres: string[];
  duration_days: number;
  audience_size: string;
  estimated_cost_usd: { min: number; max: number };
  vibe: string[];
  website: string;
  status: string;
  min_age?: number;
  ticket_official_url: string;
  family_friendly: boolean;
  camping: boolean;
  glamping?: boolean;
  weather_profile: string[];
  description?: string;
  image?: string;
  matchScore?: number;
  highlights?: string[];
}

interface FestivalWithMatch extends Festival {
  matchScore: number;
  reasons: string[];
}

const FESTIVALS = festivalsData as Festival[];

// ── Animated score counter ─────────────────────────────────────────────────────
function AnimatedScore({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return <>{display}</>;
}

// ── Ticket alert form — inline, strong value prop ─────────────────────────────
function TicketAlertForm({ festival }: { festival: FestivalWithMatch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState('loading');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          from_name: name || 'FestiWise User',
          subject: `Ticket Alert - ${festival.name}`,
          message: `User requested ticket alerts.\n\nName: ${name || '(not provided)'}\nEmail: ${email}\nFestival: ${festival.name} (${festival.city}, ${festival.country})\nMatch score: ${festival.matchScore}%\nTimestamp: ${new Date().toISOString()}`,
          _autoresponse: `Hi ${name || 'there'},\n\nYou're on the early-access list for ${festival.name}!\n\nWe'll email you as soon as tickets go on sale - before we announce it publicly. You'll also receive our Pro member guide with tips on the best camping spots, lineup predictions, and travel hacks for ${festival.name}.\n\nIn the meantime, explore the full festival details at https://getfestiwise.com/festival/${festival.id}\n\n- The FestiWise Team`,
          botcheck: '',
        }),
      });
      const data = await res.json();
      setState(data.success ? 'success' : 'error');
      if (data.success) { setEmail(''); setName(''); }
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3.5">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-green-800 text-sm">You&apos;re on the early-access list!</p>
          <p className="text-green-600 text-xs">Check your inbox - we sent you the insider guide for {festival.name}.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          className="w-28 px-3 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 text-gray-900 placeholder-gray-400 min-h-[44px]"
          disabled={state === 'loading'}
          aria-label="First name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 text-gray-900 placeholder-gray-400 min-h-[44px]"
          required
          disabled={state === 'loading'}
          aria-label="Email address"
        />
      </div>
      <button
        type="submit"
        disabled={state === 'loading' || !email}
        className="w-full px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 text-sm min-h-[44px] tap-highlight-none touch-manipulation"
      >
        {state === 'loading' ? 'Saving…' : 'Get Early Access + Insider Guide'}
      </button>
      {state === 'error' && (
        <p className="text-red-500 text-xs">Something went wrong - try again.</p>
      )}
    </form>
  );
}

// ── Hero card — #1 match, mobile-first, fits one viewport ─────────────────────
function HeroMatchCard({
  festival,
  showConfetti,
  onGetTickets,
}: {
  festival: FestivalWithMatch;
  showConfetti: boolean;
  onGetTickets: () => void;
}) {
  const months = festival.months.slice(0, 2).join(', ');
  const topReasons = festival.reasons.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden"
    >
      {/* Top gradient bar with #1 label + score */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <motion.span
              className="text-3xl"
              animate={showConfetti ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              🥇
            </motion.span>
            <ConfettiBurst show={showConfetti} radius={90} />
          </div>
          <div>
            <div className="text-white/70 text-xs font-medium uppercase tracking-wider">Your top match</div>
            <div className="text-white font-bold text-sm">{festival.genres.slice(0, 2).join(' · ')}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-black text-3xl leading-none tabular-nums">
            <AnimatedScore target={festival.matchScore} />%
          </div>
          <div className="text-white/70 text-xs mt-0.5">match score</div>
        </div>
      </div>

      {/* Festival name + location */}
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-1">
          {festival.name}
        </h2>
        <p className="text-gray-500 text-sm flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {festival.city}, {festival.country}
        </p>
      </div>

      {/* Why you matched — criteria pills */}
      {topReasons.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Why you matched</p>
          <div className="flex flex-wrap gap-2">
            {topReasons.map((reason) => (
              <span
                key={reason}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-medium"
              >
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {reason}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick stats bar */}
      <div className="mx-5 mb-4 flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-xs">Cost</span>
          <span className="font-bold text-gray-900 text-sm">
            ${festival.estimated_cost_usd.min.toLocaleString()}–${festival.estimated_cost_usd.max.toLocaleString()}
          </span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-xs">Duration</span>
          <span className="font-bold text-gray-900 text-sm">{festival.duration_days} days</span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-xs">When</span>
          <span className="font-bold text-gray-900 text-sm">{months}</span>
        </div>
      </div>

      {/* CTAs */}
      <div className="px-5 pb-5 flex flex-col sm:flex-row gap-3">
        <Link
          href={`/festival/${festival.id}`}
          className="flex-1 flex items-center justify-center py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-lg active:scale-95 transition-all text-sm tap-highlight-none touch-manipulation min-h-[48px]"
        >
          View Full Details
        </Link>
        {festival.ticket_official_url ? (
          <a
            href={festival.ticket_official_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onGetTickets}
            className="flex-1 flex items-center justify-center py-3.5 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 active:scale-95 transition-all text-sm tap-highlight-none touch-manipulation min-h-[48px]"
          >
            Get Tickets →
          </a>
        ) : (
          <a
            href={festival.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onGetTickets}
            className="flex-1 flex items-center justify-center py-3.5 border-2 border-purple-600 text-purple-600 font-bold rounded-2xl hover:bg-purple-50 active:scale-95 transition-all text-sm tap-highlight-none touch-manipulation min-h-[48px]"
          >
            Official Website →
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ── Compact card for secondary matches (#2–6) ─────────────────────────────────
function CompactMatchCard({
  festival,
  index,
  onGetTickets,
}: {
  festival: FestivalWithMatch;
  index: number;
  onGetTickets: () => void;
}) {
  const medals = ['🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex-shrink-0 w-[220px] snap-start bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-3.5 py-2.5 flex items-center justify-between">
        <span className="text-base">{medals[index]}</span>
        <span className="text-white font-bold text-sm tabular-nums">{festival.matchScore}%</span>
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
          {festival.name}
        </h3>
        <p className="text-gray-400 text-xs mb-2">
          {festival.city}, {festival.country}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {festival.genres.slice(0, 2).map((g) => (
            <span key={g} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs capitalize">
              {g}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mb-3 mt-auto">
          ${festival.estimated_cost_usd.min.toLocaleString()}–${festival.estimated_cost_usd.max.toLocaleString()}
        </p>

        <Link
          href={`/festival/${festival.id}`}
          className="block text-center py-2.5 bg-gray-100 hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-semibold rounded-xl text-xs transition-colors active:scale-95 tap-highlight-none touch-manipulation"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

// ── Share section (collapsible) ────────────────────────────────────────────────
function ShareSection({ festival, matchScore }: { festival: FestivalWithMatch; matchScore: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left tap-highlight-none touch-manipulation"
        aria-expanded={expanded}
      >
        <div>
          <p className="font-semibold text-gray-900 text-sm">Challenge a friend</p>
          <p className="text-xs text-gray-400 mt-0.5">Share your match and see what they get</p>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 text-lg leading-none ml-4"
        >
          &#8964;
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <QuizResultsShare festival={festival} matchScore={matchScore} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Festival DNA Card — beautiful inline preview, Instagram-Story optimised ─────
const GENRE_BG: Record<string, string> = {
  edm:        'from-[#6a3093] to-[#a044ff]',
  electronic: 'from-[#1a1a2e] to-[#16213e]',
  techno:     'from-[#0f0c29] to-[#302b63]',
  rock:       'from-[#1f1c2c] to-[#928dab]',
  indie:      'from-[#d4a017] to-[#8B4513]',
  pop:        'from-[#f953c6] to-[#b91d73]',
  jazz:       'from-[#3a1c71] to-[#d76d77]',
  reggae:     'from-[#1d976c] to-[#93f9b9]',
  hiphop:     'from-[#373b44] to-[#4286f4]',
  world:      'from-[#16222a] to-[#3a6186]',
  ambient:    'from-[#134e5e] to-[#71b280]',
  default:    'from-[#4a00e0] to-[#8e2de2]',
};

function getGenreBg(genres: string[]): string {
  const key = (genres[0] ?? '').toLowerCase().replace(/[^a-z]/g, '');
  return GENRE_BG[key] ?? GENRE_BG.default;
}

function FestivalDNAShare({
  festival,
  genres,
  vibes,
  budget,
}: {
  festival: FestivalWithMatch;
  genres: string[];
  vibes: string[];
  budget: { min: number; max: number };
}) {
  const [shared, setShared] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const budgetLabel =
    budget.max < 600 ? 'Budget' : budget.max < 1500 ? 'Mid-range' : 'Premium';

  const dnaImageUrl =
    `/api/og/festival-dna?` +
    `festival=${encodeURIComponent(festival.name)}&` +
    `score=${festival.matchScore}&` +
    `genres=${encodeURIComponent(genres.slice(0, 4).join(','))}&` +
    `vibes=${encodeURIComponent(vibes.slice(0, 5).join(','))}&` +
    `budget=${encodeURIComponent(budgetLabel)}`;

  const topGenre = genres[0] ?? 'Music';
  const bg = getGenreBg(genres);

  async function handleDownload() {
    setDownloading(true);
    try {
      const a = document.createElement('a');
      a.href = dnaImageUrl;
      a.download = `festival-dna-${festival.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  }

  async function handleShare() {
    const shareUrl = `${window.location.origin}/quiz`;
    const text = `My Festival DNA: ${topGenre} lover, ${festival.matchScore}% match with ${festival.name}. What's yours?`;
    if (navigator.share) {
      await navigator.share({ title: 'My Festival DNA: FestiWise', text, url: shareUrl }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`).catch(() => {});
    }
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  }

  // Vibe bar values (0–100 visually, based on vibe list)
  const VIBE_DIMS = ['Energy', 'Crowd', 'Luxury', 'Discovery', 'Chill'];
  const vibeSet = new Set(vibes.map(v => v.toLowerCase()));
  const vibeBars = [
    vibeSet.has('party') ? 90 : vibeSet.has('chill') ? 35 : 60,
    festival.audience_size === 'massive' ? 95 : festival.audience_size === 'large' ? 75 : 45,
    vibeSet.has('vip') ? 90 : (festival.estimated_cost_usd.min > 1500 ? 70 : 30),
    vibeSet.has('discovery') ? 90 : vibeSet.has('immersive') ? 70 : 40,
    vibeSet.has('chill') ? 90 : vibeSet.has('cultural') ? 65 : 30,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-3xl overflow-hidden shadow-2xl border border-white/10"
    >
      {/* ── Inline 9:16 Card Preview ── */}
      <div className={`bg-gradient-to-b ${bg} px-6 pt-7 pb-6`}>
        {/* Header label */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white/50 rounded-full" />
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Festival DNA</span>
          </div>
          <span className="text-white/50 text-[10px] font-medium">getfestiwise.com</span>
        </div>

        {/* Top genre pill */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="text-white font-extrabold text-sm capitalize">{topGenre}</span>
        </div>

        {/* Festival name */}
        <h3 className="text-white font-black text-2xl leading-tight mb-1">{festival.name}</h3>
        <p className="text-white/60 text-xs mb-5">{festival.city}, {festival.country} · {budgetLabel}</p>

        {/* Score badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-baseline gap-0.5">
            <span className="text-white font-black text-5xl leading-none tabular-nums">{festival.matchScore}</span>
            <span className="text-white/70 text-xl font-bold">%</span>
          </div>
          <div>
            <p className="text-white/90 font-bold text-sm">Match Score</p>
            <p className="text-white/50 text-xs">{festival.matchScore >= 82 ? 'Perfect' : festival.matchScore >= 68 ? 'Great' : 'Good'} match</p>
          </div>
        </div>

        {/* Vibe bars */}
        <div className="space-y-2.5">
          {VIBE_DIMS.map((dim, i) => (
            <div key={dim} className="flex items-center gap-3">
              <span className="text-white/50 text-[10px] font-semibold w-16 flex-shrink-0">{dim}</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/80 rounded-full"
                  style={{ width: `${vibeBars[i]}%` }}
                />
              </div>
              <span className="text-white/40 text-[10px] tabular-nums w-6 text-right">{vibeBars[i]}</span>
            </div>
          ))}
        </div>

        {/* Genre pills */}
        <div className="flex flex-wrap gap-1.5 mt-5">
          {genres.slice(0, 4).map(g => (
            <span key={g} className="px-2.5 py-1 bg-white/10 border border-white/20 text-white/80 text-[10px] font-semibold rounded-full capitalize">
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* ── Action strip ── */}
      <div className="bg-white px-5 py-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">Your Festival DNA</p>
          <p className="text-gray-400 text-xs truncate">{genres.slice(0, 2).join(' · ')} · {festival.matchScore}% match</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] border-2 border-purple-200 text-purple-700 text-sm font-bold rounded-xl hover:border-purple-400 active:scale-95 transition-all tap-highlight-none touch-manipulation disabled:opacity-50"
        >
          {downloading ? '…' : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          Save
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all tap-highlight-none touch-manipulation"
        >
          {shared ? '✓ Done!' : 'Share Story'}
        </button>
      </div>
    </motion.div>
  );
}

// ── Email gate — shown once before revealing results ──────────────────────────
function EmailGate({
  topScore,
  onUnlock,
}: {
  topScore: number;
  onUnlock: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          from_name: name || 'FestiWise User',
          subject: 'FestiWise - New Quiz Result Signup',
          message: `New signup from quiz results.\n\nName: ${name || '(not provided)'}\nEmail: ${email}\nTop score seen: ${topScore}%\nTimestamp: ${new Date().toISOString()}`,
          _autoresponse: `Hi ${name || 'there'},\n\nYour festival matches are waiting! Head back to FestiWise at any time to view or re-take your quiz.\n\nYou'll also receive our weekly festival insider - early ticket alerts, lineup drops, and travel tips for the festivals on your list.\n\n- The FestiWise Team`,
          botcheck: '',
        }),
      });
    } catch { /* non-blocking */ }
    try { localStorage.setItem('festi_email_v1', JSON.stringify({ email, name, savedAt: Date.now() })); } catch { /* ignore */ }
    setLoading(false);
    onUnlock();
  }

  function handleSkip() {
    try { localStorage.setItem('festi_email_v1', JSON.stringify({ skipped: true, savedAt: Date.now() })); } catch { /* ignore */ }
    onUnlock();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Score teaser */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
            className="inline-flex items-end gap-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl px-8 py-5 shadow-2xl shadow-purple-200 mb-5"
          >
            <span className="text-white font-black text-6xl leading-none tabular-nums">{topScore}</span>
            <span className="text-white/70 text-2xl font-bold mb-1">%</span>
          </motion.div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Your top match is ready
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Enter your email to unlock your results - and get early ticket alerts when sales open.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="First name (optional)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 placeholder-gray-400 min-h-[44px]"
              disabled={loading}
            />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 placeholder-gray-400 min-h-[44px]"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 text-base min-h-[52px] tap-highlight-none touch-manipulation"
            >
              {loading ? 'Unlocking…' : 'See My Festival Matches →'}
            </button>
          </form>
          <p className="text-center text-[11px] text-gray-400 mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>

        {/* Skip */}
        <div className="text-center mt-4">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors tap-highlight-none"
          >
            Skip for now →
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function FestivalResults() {
  const { state, resetQuiz } = useQuiz();
  const [matches, setMatches] = useState<FestivalWithMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [challengeCopied, setChallengeCopied] = useState(false);
  const [emailUnlocked, setEmailUnlocked] = useState(false);

  const { trackMatchResults, trackFestivalOutboundClick } = useQuizAnalytics();

  // Check if email already captured on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('festi_email_v1');
      if (saved) setEmailUnlocked(true);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const raw = getTopFestivalMatches(FESTIVALS, state.answers, 6);
      const withReasons: FestivalWithMatch[] = raw.map((m) => ({
        ...(m.festival as Festival),
        matchScore: m.score,
        reasons: m.reasons,
      }));
      setMatches(withReasons);
      setLoading(false);

      if (withReasons.length > 0) {
        setTimeout(() => {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 1400);
        }, 350);
        trackMatchResults(withReasons);
      }
    }, 1400);

    return () => clearTimeout(timer);
  }, [state.answers]);

  // ── Email gate ───────────────────────────────────────────────────────────────
  if (!loading && !emailUnlocked && matches.length > 0) {
    return (
      <EmailGate
        topScore={matches[0].matchScore}
        onUnlock={() => setEmailUnlocked(true)}
      />
    );
  }

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-5"
          />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Finding Your Matches…</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Analyzing your preferences across 100+ global festivals
          </p>
          <div className="mt-5 h-1.5 bg-purple-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-1/2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // ── No matches ───────────────────────────────────────────────────────────────
  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-sm"
        >
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No matches found</h3>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            Try broadening your preferences - adjust your budget or region and take the quiz again.
          </p>
          <button
            onClick={resetQuiz}
            className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-lg active:scale-95 transition-all tap-highlight-none touch-manipulation"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const topMatch = matches[0];
  const secondaryMatches = matches.slice(1);

  // ── Results ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center pb-2"
        >
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
            Your Festival Matches
          </h1>
          <p className="text-gray-500 text-sm">
            Based on your preferences - {matches.length} festivals found
          </p>
        </motion.div>

        {/* 1. Hero card — #1 match */}
        <HeroMatchCard
          festival={topMatch}
          showConfetti={showConfetti}
          onGetTickets={() => trackFestivalOutboundClick(topMatch.id, topMatch.ticket_official_url, topMatch.matchScore)}
        />

        {/* 2. Email capture — immediately after #1 match */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 px-5 py-5"
        >
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Early Access Open</span>
            </div>
            <p className="font-extrabold text-gray-900 text-base leading-snug">
              Be first in line for {topMatch.name} tickets
            </p>
            <p className="text-gray-500 text-xs mt-1">
              We&apos;ll alert you before public sales open - plus send you our insider guide: best camping spots, travel tips, and what to pack.
            </p>
          </div>
          <TicketAlertForm festival={topMatch} />
          <p className="text-center text-[10px] text-gray-400 mt-2">
            Free forever. Unsubscribe anytime.
          </p>
        </motion.div>

        {/* 3. Secondary matches — horizontal snap scroll */}
        {secondaryMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <p className="text-sm font-semibold text-gray-500 mb-3 px-1">
              Other matches for you
            </p>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-3 sm:mx-0 sm:px-0">
              {secondaryMatches.map((festival, i) => (
                <CompactMatchCard
                  key={festival.id}
                  festival={festival}
                  index={i}
                  onGetTickets={() => trackFestivalOutboundClick(festival.id, festival.ticket_official_url, festival.matchScore)}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-2 sm:hidden">
              Swipe to see more →
            </p>
          </motion.div>
        )}

        {/* 4. Festival DNA Share Card */}
        <FestivalDNAShare
          festival={topMatch}
          genres={state.answers.genres}
          vibes={state.answers.vibes}
          budget={state.answers.budget}
        />

        {/* 5. Share section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
        >
          <ShareSection festival={topMatch} matchScore={topMatch.matchScore} />
        </motion.div>

        {/* 5. Footer actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 pb-8"
        >
          <button
            onClick={resetQuiz}
            className="flex-1 py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:border-purple-300 hover:text-purple-600 active:scale-95 transition-all text-sm tap-highlight-none touch-manipulation min-h-[48px]"
          >
            Retake Quiz
          </button>
          <button
            onClick={async () => {
              const url = 'https://getfestiwise.com/quiz';
              const text = 'Can you beat my festival match? Take the FestiWise quiz!';
              if (typeof navigator !== 'undefined' && navigator.share) {
                await navigator.share({ title: 'Challenge a Friend - FestiWise', text, url }).catch(() => {});
              } else {
                await navigator.clipboard.writeText(url);
                setChallengeCopied(true);
                setTimeout(() => setChallengeCopied(false), 2500);
              }
            }}
            className="flex-1 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold rounded-2xl hover:shadow-lg active:scale-95 transition-all text-sm tap-highlight-none touch-manipulation min-h-[48px]"
          >
            {challengeCopied ? '✓ Link Copied!' : 'Challenge a Friend'}
          </button>
        </motion.div>

      </div>
    </div>
  );
}
