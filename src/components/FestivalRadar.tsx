'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, Flame, Zap, ChevronDown, ChevronRight, MapPin, Users, Calendar } from 'lucide-react';
import festivalsData from '@/data/festivals.json';
import FestivalDatabaseHub from './FestivalDatabaseHub';

interface FestivalData {
  id: string;
  name: string;
  country: string;
  city: string;
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  audience_size: string;
  duration_days: number;
  vibe: string[];
  months: string[];
}

const PRO_TIPS: Record<string, { tip: string; icon: string }[]> = {
  tomorrowland: [
    { tip: 'Register your DreamVille camping spot by March — it sells out within hours of opening', icon: '⛺' },
    { tip: 'Thursday early-entry wristband avoids 2-hour Friday queues at the main gate', icon: '🚪' },
  ],
  coachella: [
    { tip: 'Weekend 2 tickets drop in November — resale prices peak sharply in January', icon: '🎫' },
    { tip: 'The Sahara Tent hits extreme heat before noon; front-load hydration before afternoon sets', icon: '☀️' },
  ],
  glastonbury: [
    { tip: 'Registration lottery opens in October — sign up now even without a ticket confirmed', icon: '🍀' },
    { tip: 'Park & Ride from Bristol is faster than the direct coach from London Victoria', icon: '🚌' },
  ],
  burning_man: [
    { tip: 'Playa alkaline dust destroys electronics — use sealed dry bags or hard cases for everything', icon: '🌪️' },
    { tip: 'Low-emission vehicle (LEV) tickets go on sale in January and cost less than GA', icon: '🚗' },
  ],
  ultra_miami: [
    { tip: 'Tier 1 tickets historically sell out within 10 minutes of the early-bird drop', icon: '⚡' },
    { tip: 'The Bayside Market stage has consistently shorter queues and cleaner sound', icon: '🎵' },
  ],
  primavera: [
    { tip: 'San Miguel Stage headliners go on at 1am — eat dinner early to avoid the crush', icon: '🍕' },
    { tip: 'Barcelona metro stops at 2am; book a festival shuttle in advance or pre-arrange rides', icon: '🚇' },
  ],
};

const GENRE_GRADIENTS: Record<string, string> = {
  electronic: 'from-purple-600 to-blue-600',
  edm: 'from-purple-600 to-blue-600',
  techno: 'from-blue-700 to-cyan-600',
  rock: 'from-red-600 to-orange-600',
  indie: 'from-green-500 to-teal-600',
  pop: 'from-pink-500 to-rose-600',
  'hip-hop': 'from-yellow-500 to-orange-600',
  jazz: 'from-blue-500 to-indigo-600',
  world: 'from-green-600 to-emerald-600',
  experimental: 'from-violet-600 to-fuchsia-600',
  ambient: 'from-cyan-500 to-teal-600',
};

function getGradient(genres: string[]): string {
  const key = (genres[0] ?? '').toLowerCase();
  return GENRE_GRADIENTS[key] ?? 'from-purple-600 to-pink-600';
}

function getTrendingScore(f: FestivalData): number {
  const audienceWeight: Record<string, number> = { small: 1, medium: 2, large: 3, massive: 4 };
  const weight = audienceWeight[f.audience_size] ?? 2;
  const genreBonus = f.genres.length > 2 ? 1.2 : 1;
  const vibeBonus = f.vibe.length > 3 ? 1.1 : 1;
  return weight * genreBonus * vibeBonus * (f.duration_days || 3);
}

const BADGES = [
  { label: 'Hot', color: 'bg-red-500', Icon: Flame },
  { label: 'Popular', color: 'bg-orange-500', Icon: TrendingUp },
  { label: 'Popular', color: 'bg-orange-500', Icon: TrendingUp },
  { label: 'Rising', color: 'bg-purple-500', Icon: Zap },
  { label: 'Rising', color: 'bg-purple-500', Icon: Zap },
  { label: 'Rising', color: 'bg-purple-500', Icon: Zap },
];

export default function FestivalRadar() {
  const [openTip, setOpenTip] = useState<string | null>(null);

  const trending = useMemo(() => {
    return [...(festivalsData as FestivalData[])]
      .sort((a, b) => getTrendingScore(b) - getTrendingScore(a))
      .slice(0, 6);
  }, []);

  const tipsEntries = useMemo(() => {
    return Object.entries(PRO_TIPS).map(([id, tips]) => {
      const f = (festivalsData as FestivalData[]).find(x => x.id === id);
      return { id, name: f?.name ?? id, country: f?.country ?? '', tips };
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-purple-950 to-black py-16 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, #7c3aed, transparent 50%), radial-gradient(circle at 80% 20%, #ec4899, transparent 50%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live Festival Intelligence
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              Festival{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Radar
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Trending lineups, insider secrets, and real-time festival intelligence — all in one feed.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300"
            >
              Find My Perfect Match
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5">
            <Flame className="w-4 h-4 text-red-500" />
            <span className="text-sm font-bold text-red-600 uppercase tracking-wider">Trending Now</span>
          </div>
          <p className="text-gray-500 text-sm">Festivals gaining the most momentum this week</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((festival, idx) => {
            const badge = BADGES[idx];
            const gradient = getGradient(festival.genres);
            return (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 group transition-all duration-300"
              >
                <div className={`h-28 bg-gradient-to-br ${gradient} relative flex items-end p-4`}>
                  <span className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 ${badge.color} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow`}>
                      <badge.Icon className="w-3 h-3" />
                      {badge.label}
                    </span>
                  </span>
                  <span className="text-white/30 text-5xl font-black absolute top-1 right-4 select-none">
                    #{idx + 1}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-purple-600 transition-colors">
                    {festival.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{festival.city}, {festival.country}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {festival.genres.slice(0, 3).map(g => (
                      <span
                        key={g}
                        className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full border border-purple-100"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {festival.audience_size.charAt(0).toUpperCase() + festival.audience_size.slice(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {festival.duration_days}d
                    </span>
                    <span className="font-semibold text-green-600">
                      From ${festival.estimated_cost_usd.min}
                    </span>
                  </div>
                </div>

                <div className="px-5 pb-4">
                  <Link
                    href={`/festival/${festival.id}`}
                    className="block text-center text-sm font-semibold text-purple-600 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 border border-purple-200 hover:border-transparent rounded-xl py-2 transition-all duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Insider Pro Tips */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
            <span className="text-amber-500 font-bold">★</span>
            <span className="text-sm font-bold text-amber-700 uppercase tracking-wider">Insider Pro Tips</span>
          </div>
          <p className="text-gray-500 text-sm">Secrets the festival websites won&apos;t tell you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tipsEntries.map(({ id, name, country, tips }) => (
            <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenTip(openTip === id ? null : id)}
                aria-expanded={openTip === id}
              >
                <div>
                  <span className="font-bold text-gray-900">{name}</span>
                  <span className="ml-2 text-gray-400 text-sm">{country}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openTip === id ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {openTip === id && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <ul className="px-6 pb-5 pt-3 space-y-3 border-t border-gray-100">
                      {tips.map((t, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-xl flex-shrink-0">{t.icon}</span>
                          <span className="text-sm text-gray-700 leading-relaxed">{t.tip}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Full Database Hub */}
      <div className="border-t-2 border-purple-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-extrabold text-gray-900">Full Festival Database</h2>
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
              100+ Festivals
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Search, filter, and compare every festival in our database</p>
        </div>
        <FestivalDatabaseHub />
      </div>
    </div>
  );
}
