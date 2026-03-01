'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuiz } from './QuizContext';
import festivalsData from '../../data/festivals.json';
import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';
import { getTopFestivalMatches } from '@/utils/quizScoringAlgorithm';
import QuizResultsShare from '@/components/QuizResultsShare';
import ConfettiBurst from '@/components/ui/ConfettiBurst';

// Results Page Newsletter Form Component
function ResultsNewsletterForm({ topMatch }: { topMatch?: Festival }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState('loading');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          subject: topMatch
            ? `Quiz Result — Alert for ${topMatch.name}`
            : 'Quiz Completed — Save Results & Weekly Updates',
          from_name: 'FestiWise Quiz',
          message: `User completed the festival quiz.\n\nEmail: ${email}\nTop match: ${topMatch?.name ?? 'unknown'} (${topMatch?.city ?? ''}, ${topMatch?.country ?? ''})\nTimestamp: ${new Date().toISOString()}`,
          _cc: email,
          _subject: topMatch
            ? `Your FestiWise match: ${topMatch.name}`
            : 'Your FestiWise festival matches',
          _autoresponse: topMatch
            ? `Great news! Based on your quiz, ${topMatch.name} is your top match. We'll keep you updated with ticket alerts and personalised picks.`
            : "You're in! We'll send you weekly personalised festival recommendations.",
          botcheck: '',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setState('success');
        setEmail('');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white/15 backdrop-blur rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-xl">✓</span>
        </div>
        <p className="font-bold text-white text-lg mb-1">You&apos;re in!</p>
        <p className="text-white/80 text-sm">
          {topMatch
            ? `We saved your match with ${topMatch.name}. Ticket alerts and weekly picks are coming to your inbox.`
            : "Weekly personalised festival picks are on their way to your inbox."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={topMatch ? `Get alerts for ${topMatch.name}` : 'Enter your email address'}
          className="w-full px-4 py-3.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/70 focus:ring-2 focus:ring-white/30 text-sm"
          required
          disabled={state === 'loading'}
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={state === 'loading' || !email}
          className="w-full py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 text-sm"
        >
          {state === 'loading' ? 'Saving...' : 'Save My Results + Get Ticket Alerts'}
        </button>
      </form>
      {state === 'error' && (
        <p className="text-red-300 text-xs mt-2 text-center">Something went wrong. Please try again.</p>
      )}
      <p className="text-xs text-white/60 mt-3 text-center">
        No spam. Ticket alerts + weekly picks only. Unsubscribe anytime.
      </p>
    </div>
  );
}

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
  estimated_cost_usd: {
    min: number;
    max: number;
  };
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

// Use the real festival database
const FESTIVALS = festivalsData as Festival[];

// ── Animated score counter ────────────────────────────────────────────────────
function AnimatedScore({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setDisplay(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return <>{display}</>;
}

// ── Collapsible share section (compact on mobile, full on desktop) ────────────
function ShareSection({ festival, matchScore }: { festival: Festival; matchScore: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden"
    >
      {/* Header row — always visible */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        aria-expanded={expanded}
      >
        <div>
          <p className="font-semibold text-gray-900 text-sm">Love your top match? Share it</p>
          <p className="text-xs text-gray-400 mt-0.5">Let friends discover their perfect festival too</p>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 text-lg leading-none ml-4"
        >
          &#8964;
        </motion.div>
      </button>

      {/* Expandable body */}
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
    </motion.div>
  );
}

export function FestivalResults() {
  const { state, resetQuiz } = useQuiz();
  const [matchedFestivals, setMatchedFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [challengeCopied, setChallengeCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Analytics tracking
  const { trackMatchResults, trackFestivalOutboundClick } = useQuizAnalytics();

  useEffect(() => {
    // Use advanced scoring algorithm
    const calculateMatches = () => {
      // Use the advanced 50-factor scoring algorithm
      const matches = getTopFestivalMatches(FESTIVALS, state.answers, 6);
      
      // Convert to Festival interface format with matchScore
      const festivals = matches.map(match => ({
        ...match.festival,
        matchScore: match.score
      }));

      setMatchedFestivals(festivals);
      setLoading(false);

      // Trigger confetti burst on reveal
      if (festivals.length > 0) {
        setTimeout(() => {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 1400);
        }, 400);
        trackMatchResults(festivals);
      }
    };

    const timer = setTimeout(calculateMatches, 1500); // Quick load with advanced algorithm
    return () => clearTimeout(timer);
  }, [state.answers]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Finding Your Perfect Festivals...</h2>
          <p className="text-gray-600">Analyzing your preferences and matching with the best events worldwide</p>
          <div className="mt-6 space-y-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-2 bg-purple-200 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 w-1/3"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="relative inline-flex items-center justify-center mb-4">
            <motion.div
              className="text-6xl"
              animate={showConfetti ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              🎉
            </motion.div>
            <ConfettiBurst show={showConfetti} radius={110} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Perfect Festival Matches!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your preferences, we've found {matchedFestivals.length} amazing festivals that match your vibe.
          </p>
        </motion.div>

        {/* Results */}
        {matchedFestivals.length > 0 ? (
          <div className="space-y-8">
            {matchedFestivals.map((festival, index) => (
              <React.Fragment key={festival.id}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -10 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2
                }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden"
              >
                <div className="md:flex">
                  {/* Festival Image */}
                  <div className="md:w-1/3 h-64 md:h-auto bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl relative z-10">🎪</div>
                    {/* Animated background elements */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20"
                    />
                  </div>

                  {/* Festival Details */}
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{festival.name}</h3>
                        <p className="text-lg text-gray-600 mb-3 flex items-center">
                          <span className="mr-2">📍</span>
                          {festival.city}, {festival.country}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <span className="mr-1">⏱️</span>
                            {festival.duration_days} days
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <span className="mr-1">📅</span>
                            {festival.months.join(', ')}
                          </span>
                          <span>•</span>
                          <span className="flex items-center capitalize">
                            <span className="mr-1">👥</span>
                            {festival.audience_size} crowd
                          </span>
                          {festival.family_friendly && (
                            <>
                              <span>•</span>
                              <span className="flex items-center text-green-600">
                                <span className="mr-1">👨‍👩‍👧‍👦</span>
                                Family-friendly
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg tabular-nums">
                          {index === 0 ? <><AnimatedScore target={festival.matchScore ?? 0} />%</> : `${festival.matchScore}%`} Match
                        </div>
                        <div className="text-xl font-bold text-gray-900 mt-3">
                          ${festival.estimated_cost_usd.min.toLocaleString()} - ${festival.estimated_cost_usd.max.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">USD total cost</div>
                      </div>
                    </div>

                    {/* Genres & Vibes */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="mr-2">🎵</span>
                          Music Genres
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {festival.genres.map(genre => (
                            <span
                              key={genre}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="mr-2">✨</span>
                          Festival Vibes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {festival.vibe.map(vibe => (
                            <span
                              key={vibe}
                              className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium capitalize"
                            >
                              {vibe}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Festival Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">🏕️</span>
                        What's Available
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className={`flex items-center ${festival.camping ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className="mr-1">{festival.camping ? '✅' : '❌'}</span>
                          Camping
                        </div>
                        <div className={`flex items-center ${festival.glamping ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className="mr-1">{festival.glamping ? '✅' : '❌'}</span>
                          Glamping
                        </div>
                        <div className={`flex items-center ${festival.family_friendly ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className="mr-1">{festival.family_friendly ? '✅' : '❌'}</span>
                          Family-friendly
                        </div>
                        <div className="flex items-center text-blue-600">
                          <span className="mr-1">🌡️</span>
                          {festival.weather_profile.join(', ')}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {festival.description}
                    </p>

                    {/* Highlights */}
                    {festival.highlights && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Festival Highlights</h4>
                        <div className="space-y-1">
                          {festival.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="text-green-500">✓</span>
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                        View Details
                      </button>
                      {festival.website && (
                        <a
                          href={festival.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300"
                          onClick={() => trackFestivalOutboundClick(festival.id, festival.website, festival.matchScore)}
                        >
                          Official Website
                        </a>
                      )}
                      {festival.ticket_official_url && (
                        <a
                          href={festival.ticket_official_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300"
                          onClick={() => trackFestivalOutboundClick(festival.id, festival.ticket_official_url, festival.matchScore)}
                        >
                          Get Tickets
                        </a>
                      )}
                      <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300">
                        Save to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Share section shown after #1 match */}
              {index === 0 && (
                <ShareSection festival={festival} matchScore={festival.matchScore ?? 0} />
              )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Perfect Matches Found</h3>
            <p className="text-gray-600 mb-6">
              Don't worry! Try adjusting your preferences or take the quiz again for different results.
            </p>
            <button
              onClick={resetQuiz}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Take Quiz Again
            </button>
          </motion.div>
        )}

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center space-y-6"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Want More Options?</h3>
            <p className="text-gray-600 mb-6">
              Explore all festivals worldwide or refine your search with different preferences.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Take Quiz Again
              </button>
              <button className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300">
                Browse All Festivals
              </button>
              <button
                onClick={async () => {
                  const quizUrl = 'https://getfestiwise.com/quiz';
                  const text = 'Can you beat my festival match? Take the quiz and find YOUR perfect festival!';
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    await navigator.share({ title: 'Challenge a Friend — FestiWise', text, url: quizUrl }).catch(() => {});
                  } else {
                    await navigator.clipboard.writeText(quizUrl);
                    setChallengeCopied(true);
                    setTimeout(() => setChallengeCopied(false), 2500);
                  }
                }}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                {challengeCopied ? '✓ Link Copied!' : 'Challenge a Friend'}
              </button>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-4">
                <span className="text-yellow-400">🎉</span>
                <span className="font-semibold">Congratulations! Quiz Complete</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Love Your Results? Get More Like This! 
              </h3>
              <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                You just discovered your perfect festival matches! Join festival lovers who get 
                <strong> weekly personalized recommendations</strong> and <strong>exclusive early-bird access</strong> to tickets.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-semibold text-sm">Personalized Weekly Picks</div>
                  <div className="text-xs text-white/80">Based on your exact preferences</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-semibold text-sm">24-Hour Early Access</div>
                  <div className="text-xs text-white/80">Beat the crowds to popular tickets</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-semibold text-sm">Exclusive Discounts</div>
                  <div className="text-xs text-white/80">Member-only deals up to 40% off</div>
                </div>
              </div>
              
                            <ResultsNewsletterForm topMatch={matchedFestivals[0]} />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-white/80">
                  🔒 Your email stays private. We only send you festivals you'll actually love.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
