'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Share2, Star, Eye, Heart, Music, MapPin, RefreshCw } from 'lucide-react';
import festivalsData from '@/data/festivals.json';

interface Festival {
  id: string;
  name: string;
  city: string;
  country: string;
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
}

interface QuizAnswers {
  genres: string[];
  vibes: string[];
  budget: { min: number; max: number };
  region: string;
  months: string[];
}

interface ProfileData {
  quizDone: boolean;
  answers: QuizAnswers | null;
  savedIds: string[];
  viewedIds: string[];   // sorted by recency, top 6
  reviewCount: number;
  ratedFestivalIds: string[];
}

const ALL_FESTIVALS = festivalsData as Festival[];

const BUDGET_LABEL: Record<string, string> = {
  'budget':    'Budget traveller',
  'mid':       'Mid-range',
  'premium':   'Premium',
  'luxury':    'No budget limit',
};

const GENRE_COLOR: Record<string, string> = {
  edm:       'bg-purple-500/15 text-purple-400 border-purple-500/30',
  rock:      'bg-red-500/15 text-red-400 border-red-500/30',
  indie:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  jazz:      'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'hip-hop': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  world:     'bg-pink-500/15 text-pink-400 border-pink-500/30',
  afrobeats: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  pop:       'bg-rose-500/15 text-rose-400 border-rose-500/30',
  reggae:    'bg-green-500/15 text-green-400 border-green-500/30',
  ambient:   'bg-teal-500/15 text-teal-400 border-teal-500/30',
  latin:     'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  classical: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
};
const DEFAULT_PILL = 'bg-gray-500/15 text-gray-400 border-gray-500/30';

function genrePill(g: string) {
  return GENRE_COLOR[g.toLowerCase()] ?? DEFAULT_PILL;
}

function loadProfile(): ProfileData {
  const empty: ProfileData = { quizDone: false, answers: null, savedIds: [], viewedIds: [], reviewCount: 0, ratedFestivalIds: [] };
  if (typeof window === 'undefined') return empty;

  try {
    // Quiz
    const quiz = localStorage.getItem('festi_quiz_v1');
    const quizParsed = quiz ? JSON.parse(quiz) : null;
    const quizDone = Boolean(quizParsed?.isCompleted);
    const answers: QuizAnswers | null = quizDone ? quizParsed?.answers ?? null : null;

    // Saved
    const saved = localStorage.getItem('festiwise_favorites');
    const savedIds: string[] = saved ? JSON.parse(saved) : [];

    // Viewed
    const views = localStorage.getItem('festiwise_views');
    const viewsMap: Record<string, { count: number; lastViewed: number }> = views ? JSON.parse(views) : {};
    const viewedIds = Object.entries(viewsMap)
      .sort((a, b) => b[1].lastViewed - a[1].lastViewed)
      .slice(0, 6)
      .map(([id]) => id);

    // Reviews / ratings
    const allKeys = Object.keys(localStorage);
    const ratingKeys = allKeys.filter(k => k.startsWith('festiwise_myrating_') && localStorage.getItem(k));
    const ratedFestivalIds = ratingKeys.map(k => k.replace('festiwise_myrating_', ''));

    return { quizDone, answers, savedIds, viewedIds, reviewCount: ratedFestivalIds.length, ratedFestivalIds };
  } catch {
    return empty;
  }
}

function festivalById(id: string): Festival | undefined {
  return ALL_FESTIVALS.find(f => f.id === id);
}

function DNACard({ answers }: { answers: QuizAnswers }) {
  const [shared, setShared] = useState(false);
  const budgetTier = answers.budget.max < 600 ? 'budget' : answers.budget.max < 1500 ? 'mid' : answers.budget.max < 3000 ? 'premium' : 'luxury';
  const budgetDisplay = BUDGET_LABEL[budgetTier] ?? 'Flexible';
  const topGenre = answers.genres[0] ?? 'Music';

  async function handleShare() {
    const text = `My Festival DNA: ${answers.genres.slice(0, 2).join(' + ')} fan, ${budgetDisplay} budget. What's yours?`;
    const url = 'https://getfestiwise.com/quiz';
    if (navigator.share) {
      await navigator.share({ title: 'My Festival DNA — FestiWise', text, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`).catch(() => {});
    }
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden border border-white/10"
    >
      {/* Card header */}
      <div className="bg-gradient-to-br from-purple-900/70 to-pink-900/50 px-6 py-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Festival DNA</p>
            <h3 className="text-white font-black text-2xl">{topGenre} Lover</h3>
            <p className="text-white/50 text-sm mt-0.5">{budgetDisplay} · {answers.region ?? 'Anywhere'}</p>
          </div>
          <div className="flex items-center gap-1 bg-white/10 rounded-xl px-3 py-1.5">
            <Music className="w-3 h-3 text-white/60" />
            <span className="text-white/70 text-xs font-semibold">{answers.genres.length} genres</span>
          </div>
        </div>

        {/* Genre pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {answers.genres.map(g => (
            <span key={g} className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${genrePill(g)}`}>
              {g}
            </span>
          ))}
        </div>

        {/* Vibe pills */}
        {answers.vibes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {answers.vibes.map(v => (
              <span key={v} className="px-2.5 py-1 bg-white/5 border border-white/10 text-white/50 rounded-full text-xs capitalize">
                {v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Share strip */}
      <div className="bg-gray-900 px-5 py-3.5 flex items-center justify-between">
        <p className="text-gray-500 text-xs">Share your festival taste</p>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold rounded-xl transition-all active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5" />
          {shared ? 'Copied!' : 'Share DNA'}
        </button>
      </div>
    </motion.div>
  );
}

function FestivalCard({ id, label }: { id: string; label?: string }) {
  const f = festivalById(id);
  if (!f) return null;
  return (
    <Link
      href={`/festival/${id}`}
      className="block group bg-gray-900 border border-white/5 hover:border-white/15 rounded-xl p-4 transition-all"
    >
      {label && (
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
      )}
      <p className="text-white font-bold text-sm leading-tight group-hover:text-purple-300 transition-colors">
        {f.name}
      </p>
      <p className="text-gray-500 text-xs mt-0.5">{f.city}, {f.country}</p>
      <div className="flex flex-wrap gap-1 mt-2">
        {f.genres.slice(0, 2).map(g => (
          <span key={g} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${genrePill(g)}`}>
            {g}
          </span>
        ))}
      </div>
    </Link>
  );
}

function EmptyState({ icon: Icon, title, sub, href, cta }: {
  icon: React.ElementType;
  title: string;
  sub: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="text-center py-10 px-4">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <p className="text-gray-400 font-semibold text-sm mb-1">{title}</p>
      <p className="text-gray-600 text-xs mb-4">{sub}</p>
      <Link
        href={href}
        className="inline-block px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs font-semibold rounded-lg transition-all"
      >
        {cta}
      </Link>
    </div>
  );
}

export default function UserProfileDashboard() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/40 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const savedFestivals = profile.savedIds.map(festivalById).filter(Boolean) as Festival[];
  const viewedFestivals = profile.viewedIds.map(festivalById).filter(Boolean) as Festival[];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* Page header */}
        <div>
          <h1 className="text-3xl font-black text-white">Your Festival Passport</h1>
          <p className="text-gray-500 text-sm mt-1">Everything FestiWise knows about your taste.</p>
        </div>

        {/* Activity strip */}
        <div className="grid grid-cols-3 divide-x divide-white/5 border border-white/5 rounded-2xl bg-white/[0.02]">
          {[
            { icon: Heart,  value: profile.savedIds.length,   label: 'Saved' },
            { icon: Eye,    value: profile.viewedIds.length,   label: 'Viewed' },
            { icon: Star,   value: profile.reviewCount,        label: 'Reviewed' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="px-4 py-4 text-center">
              <Icon className="w-4 h-4 text-gray-600 mx-auto mb-1" />
              <div className="text-xl font-black text-white">{value}</div>
              <div className="text-gray-600 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* DNA Card */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Your Music DNA</h2>
          {profile.quizDone && profile.answers ? (
            <DNACard answers={profile.answers} />
          ) : (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-8 text-center">
              <Music className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 font-semibold text-sm mb-1">No quiz results yet</p>
              <p className="text-gray-600 text-xs mb-4">Take the quiz to discover your festival DNA.</p>
              <Link
                href="/quiz"
                className="inline-block px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all"
              >
                Take the Quiz →
              </Link>
            </div>
          )}
        </div>

        {/* Saved festivals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Saved Festivals</h2>
            {savedFestivals.length > 0 && (
              <Link href="/my-bucket-list" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                View bucket list →
              </Link>
            )}
          </div>
          {savedFestivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedFestivals.slice(0, 6).map(f => (
                <FestivalCard key={f.id} id={f.id} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
              <EmptyState
                icon={Heart}
                title="No saved festivals yet"
                sub="Tap the bookmark icon on any festival to save it here."
                href="/festivals"
                cta="Browse festivals"
              />
            </div>
          )}
        </div>

        {/* Recently viewed */}
        {viewedFestivals.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {viewedFestivals.map(f => (
                <FestivalCard key={f.id} id={f.id} />
              ))}
            </div>
          </div>
        )}

        {/* Rated festivals */}
        {profile.ratedFestivalIds.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Festivals You Rated
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.ratedFestivalIds.slice(0, 4).map(id => (
                <FestivalCard key={id} id={id} />
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href="/quiz"
            className="flex items-center gap-2 px-4 py-3.5 bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl text-sm font-semibold text-gray-300 transition-all group"
          >
            <RefreshCw className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
            Retake Quiz
          </Link>
          <Link
            href="/festivals"
            className="flex items-center gap-2 px-4 py-3.5 bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl text-sm font-semibold text-gray-300 transition-all group"
          >
            <MapPin className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
            Browse All
          </Link>
        </div>

      </div>
    </div>
  );
}
