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

// ── Ticket alert form — inline, honest copy ────────────────────────────────────
function TicketAlertForm({ festival }: { festival: FestivalWithMatch }) {
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
          subject: `Ticket Alert — ${festival.name}`,
          from_name: 'FestiWise Quiz',
          message: `User requested ticket alerts.\n\nEmail: ${email}\nFestival: ${festival.name} (${festival.city}, ${festival.country})\nMatch score: ${festival.matchScore}%\nTimestamp: ${new Date().toISOString()}`,
          _cc: email,
          _subject: `You're on the list for ${festival.name}`,
          _autoresponse: `We'll notify you when ${festival.name} ticket sales open. In the meantime, check out the full festival details at getfestiwise.com.`,
          botcheck: '',
        }),
      });
      const data = await res.json();
      setState(data.success ? 'success' : 'error');
      if (data.success) setEmail('');
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
          <p className="font-semibold text-green-800 text-sm">You&apos;re on the list!</p>
          <p className="text-green-600 text-xs">We&apos;ll email you when {festival.name} tickets open.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
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
      <button
        type="submit"
        disabled={state === 'loading' || !email}
        className="px-5 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 text-sm whitespace-nowrap min-h-[44px] tap-highlight-none touch-manipulation"
      >
        {state === 'loading' ? 'Saving…' : 'Notify Me'}
      </button>
      {state === 'error' && (
        <p className="text-red-500 text-xs mt-1 sm:col-span-2">Something went wrong — try again.</p>
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

// ── Main component ─────────────────────────────────────────────────────────────
export function FestivalResults() {
  const { state, resetQuiz } = useQuiz();
  const [matches, setMatches] = useState<FestivalWithMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [challengeCopied, setChallengeCopied] = useState(false);

  const { trackMatchResults, trackFestivalOutboundClick } = useQuizAnalytics();

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
            Try broadening your preferences — adjust your budget or region and take the quiz again.
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
            Based on your preferences — {matches.length} festivals found
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
          className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-4.5 h-4.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Get notified when {topMatch.name} tickets open</p>
              <p className="text-gray-400 text-xs mt-0.5">Free. No spam. One email when sales go live.</p>
            </div>
          </div>
          <TicketAlertForm festival={topMatch} />
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

        {/* 4. Share section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
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
                await navigator.share({ title: 'Challenge a Friend — FestiWise', text, url }).catch(() => {});
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
