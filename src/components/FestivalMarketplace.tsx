'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Grid3x3,
  List,
  Heart,
  Filter,
  X,
  DollarSign,
  MapPin,
  Calendar,
  Music,
  Search,
  Zap,
  Award,
  AlertCircle,
  ExternalLink,
  BarChart3,
} from 'lucide-react';
import FestivalListingSchema from '@/components/SEO/FestivalListingSchema';
import { useCompare } from '@/contexts/CompareContext';
import festivalsData from '@/data/festivals.json';

type Festival = {
  id: string;
  name: string;
  country: string;
  city: string;
  region: string;
  months: string[];
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  audience_size: string;
  duration_days: number;
  family_friendly: boolean;
  camping: boolean;
  glamping: boolean;
  weather_profile: string[];
  vibe: string[];
  website: string;
  status: string;
  min_age: number;
  ticket_official_url: string;
};

type Filters = {
  search: string;
  genres: string[];
  months: string[];
  regions: string[];
  priceMin: number;
  priceMax: number;
  family: boolean | null;
  camping: boolean | null;
  vibes: string[];
  audience: string[];
};

type ViewMode = 'grid' | 'list';
type SortOption = 'trending' | 'price-low' | 'price-high' | 'name' | 'duration' | 'audience';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const getUnique = (arr: string[][] | string[]) =>
  Array.from(new Set(Array.isArray(arr[0]) ? (arr as string[][]).flat() : (arr as string[]))).filter(Boolean);

const VERIFIED_FESTIVALS = new Set([
  'tomorrowland', 'coachella', 'glastonbury', 'burning_man', 'ultra_miami',
  'rock_in_rio', 'fuji_rock', 'sziget', 'roskilde', 'primavera',
]);

// Genre → gradient for card headers
const GENRE_GRADIENTS: Record<string, string> = {
  electronic:  'from-violet-700 via-purple-600 to-blue-700',
  edm:         'from-violet-700 via-purple-600 to-blue-700',
  techno:      'from-slate-700 via-violet-700 to-indigo-700',
  house:       'from-indigo-700 via-violet-600 to-purple-600',
  rock:        'from-red-700 via-rose-600 to-orange-600',
  metal:       'from-gray-800 via-zinc-700 to-slate-700',
  indie:       'from-teal-700 via-emerald-600 to-cyan-600',
  alternative: 'from-teal-700 via-cyan-600 to-sky-600',
  pop:         'from-pink-600 via-rose-500 to-fuchsia-600',
  'hip-hop':   'from-amber-600 via-orange-500 to-yellow-500',
  jazz:        'from-blue-700 via-indigo-600 to-violet-600',
  blues:       'from-blue-800 via-blue-700 to-indigo-700',
  folk:        'from-amber-700 via-yellow-600 to-lime-600',
  country:     'from-amber-600 via-orange-500 to-yellow-400',
  world:       'from-green-700 via-emerald-600 to-teal-600',
  reggae:      'from-green-600 via-yellow-500 to-red-500',
  classical:   'from-slate-600 via-gray-500 to-zinc-600',
  soul:        'from-orange-600 via-amber-500 to-yellow-500',
};

function getGenreGradient(genres: string[]): string {
  const key = genres[0]?.toLowerCase() ?? '';
  return GENRE_GRADIENTS[key] ?? 'from-purple-700 via-pink-600 to-blue-700';
}

const PRO_TIPS: Record<string, string[]> = {
  'tomorrowland': [
    'Book DreamVille camping in January - it sells out in under 30 minutes.',
    'Weekend 2 resale tickets are typically 15-20% cheaper than Weekend 1.',
    'The Mainstage is spectacular but Atmosphere & Freedom stages have the best acts.',
  ],
  'coachella': [
    'Weekend 2 resale tickets average 20-40% cheaper than Weekend 1.',
    'Car camping requires a separate wristband - book it at the same time as your ticket.',
    'The Sahara and Gobi tents run until after the headliner - perfect for EDM fans.',
  ],
  'glastonbury': [
    'You must register (with photo) before you can buy a ticket - registration is free.',
    'The Park and Strummerville stages are hidden gems away from the main crowds.',
    'Pack wellies and a poncho - rain is almost guaranteed at some point.',
  ],
  'burning-man': [
    'Tickets are released in waves via a pre-sale lottery - join the mailing list early.',
    'This is a cashless event: bring gifts, not cash. Coffee and ice are the only things sold.',
    'Alkaline dust storms hit daily - a quality dust mask and goggles are non-negotiable.',
  ],
  'ultra-miami': [
    'Park & Ride from Marlins Park is the easiest way to avoid traffic and parking fees.',
    'VIP day tickets often become available closer to the event when corporate passes go unsold.',
  ],
  'primavera': [
    'Buy the 3-day pass - it is significantly cheaper than individual day tickets.',
    'The venue is split across Parc del Forum and Poble Espanyol: plan your route in advance.',
    'Book accommodation in Poblenou for easy walking distance to the Parc del Forum stages.',
  ],
  'roskilde': [
    'Volunteer tickets are available - you work ~32 hours in exchange for free entry.',
    'Camping opens days before the music: arrive early for the best spots near the stages.',
    'The Orange Stage headliner lineup is announced just weeks before the festival.',
  ],
  'exit': [
    'The fortress opens at sunset and the main stage is set inside the medieval walls.',
    'Accommodation in Novi Sad city centre is far cheaper than festival camping packages.',
    'Night swim spots on the Danube are a local secret - ask at your hostel.',
  ],
  'sonar': [
    'Day (SonarDay) and Night (SonarNight) events are held at different venues - check which stage your artist plays.',
    'Book Fira de Barcelona hotels early - they block up 6+ months in advance.',
    'The SonarLab installations are free and an underrated part of the experience.',
  ],
  'rock-werchter': [
    'Camping tickets include all festival days - the campsite atmosphere is as good as the music.',
    'The VIP Golden Circle offers a massive close-up view of the Main Stage.',
    'The Barn and Club stages run until 5am - pace yourself across the weekend.',
  ],
  'fuji-rock': [
    'Book accommodation in Naeba (at the ski resort) for the closest lodging to the stages.',
    'Bring waterproof gear - summer rain in the mountains is common.',
    'The trek to the Field of Heaven stage takes 30+ minutes - plan extra time.',
  ],
  'sziget': [
    'Week-long "A-to-Z" tickets offer the best value if you can attend the full 7 days.',
    'The island has its own ferry service from Budapest - cheaper than taxi.',
    'Arrive by Wednesday for the best campsite spots before the main crowds arrive.',
  ],
  'electric-daisy-carnival': [
    'The festival runs overnight (9pm-7am) - bring layers for the desert cold before sunrise.',
    'Shuttle passes from Las Vegas Strip hotels are worth every dollar - avoid the traffic.',
    'The art installations around the venue are best explored just before dawn.',
  ],
  'lollapalooza': [
    'The festival is split between two distinct weekend lineups - check which artists play your weekend.',
    "Grant Park's shade is rare: bring sunscreen and a portable fan.",
    'VIP Platinum experience includes dedicated entrances and lounge areas.',
  ],
  'melt': [
    'The industrial steelworks setting is unlike any other festival in Europe.',
    'Book early-bird tickets - the price increases in three tiers.',
    'Head to the Ferropolis lake side for silent disco and the best sunrise views.',
  ],
};

function ProTips({ festivalId }: { festivalId: string }) {
  const tips = PRO_TIPS[festivalId];
  const [open, setOpen] = useState(false);
  if (!tips || tips.length === 0) return null;
  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 hover:bg-amber-400/20 transition-colors"
      >
        <span>PRO TIPS</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <ul className="mt-2 space-y-1.5">
          {tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-xs text-gray-300 bg-amber-400/8 rounded-lg px-3 py-2 border border-amber-400/10">
              <span className="text-amber-400 font-bold shrink-0">★</span>
              {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 select-none">
      <svg viewBox="0 0 20 20" className="w-3 h-3 fill-current flex-shrink-0">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Verified
    </div>
  );
}

function PriceBadge({ max }: { max: number }) {
  const level = max <= 300 ? 'budget' : max <= 700 ? 'mid' : 'premium';
  const config = {
    budget:  { cls: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'Budget' },
    mid:     { cls: 'bg-blue-500/20 text-blue-300 border-blue-500/30',   label: 'Mid-Range' },
    premium: { cls: 'bg-purple-500/20 text-purple-300 border-purple-500/30', label: 'Premium' },
  };
  const { cls, label } = config[level];
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

export default function FestivalMarketplace() {
  const [festivals] = useState<Festival[]>(() => {
    try {
      return Array.isArray(festivalsData) ? (festivalsData as Festival[]) : [];
    } catch {
      return [];
    }
  });

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set(['genres']));
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { selected: comparing, toggle: toggleCompare } = useCompare();

  const [filters, setFilters] = useState<Filters>({
    search: '',
    genres: [],
    months: [],
    regions: [],
    priceMin: 0,
    priceMax: 5000,
    family: null,
    camping: null,
    vibes: [],
    audience: [],
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const fav = JSON.parse(window.localStorage.getItem('festiwise_favorites') || '[]');
        setFavorites(Array.isArray(fav) ? fav : []);
      } catch { /* empty */ }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      window.localStorage.setItem('festiwise_favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const allGenres  = useMemo(() => getUnique(festivals.map(f => f.genres)), [festivals]);
  const allMonths  = useMemo(() => getUnique(festivals.map(f => f.months)), [festivals]);
  const allRegions = useMemo(() => getUnique(festivals.map(f => f.region)), [festivals]);
  const allVibes   = useMemo(() => getUnique(festivals.map(f => f.vibe)), [festivals]);

  const filtered = useMemo(() => {
    return festivals.filter(fest => {
      if (filters.search && !fest.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.genres.length && !filters.genres.some(g => fest.genres.includes(g))) return false;
      if (filters.months.length && !filters.months.some(m => fest.months.includes(m))) return false;
      if (filters.regions.length && !filters.regions.includes(fest.region)) return false;
      if (filters.family !== null && fest.family_friendly !== filters.family) return false;
      if (filters.camping !== null && fest.camping !== filters.camping) return false;
      if (filters.vibes.length && !filters.vibes.some(v => fest.vibe.includes(v))) return false;
      if (filters.audience.length && !filters.audience.includes(fest.audience_size)) return false;
      const { min, max } = fest.estimated_cost_usd;
      if (max < filters.priceMin || min > filters.priceMax) return false;
      return true;
    });
  }, [festivals, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const sizeOrder = { massive: 4, large: 3, medium: 2, small: 1 };
    switch (sortBy) {
      case 'price-low':  arr.sort((a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min); break;
      case 'price-high': arr.sort((a, b) => b.estimated_cost_usd.max - a.estimated_cost_usd.max); break;
      case 'duration':   arr.sort((a, b) => b.duration_days - a.duration_days); break;
      case 'name':       arr.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'audience':
        arr.sort((a, b) =>
          (sizeOrder[b.audience_size as keyof typeof sizeOrder] || 0) -
          (sizeOrder[a.audience_size as keyof typeof sizeOrder] || 0)
        );
        break;
      default:
        arr.sort((a, b) => {
          const diff =
            (sizeOrder[b.audience_size as keyof typeof sizeOrder] || 0) -
            (sizeOrder[a.audience_size as keyof typeof sizeOrder] || 0);
          return diff !== 0 ? diff : a.name.localeCompare(b.name);
        });
    }
    return arr;
  }, [filtered, sortBy]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, []);

  const toggleFilterExpanded = (name: string) => {
    setExpandedFilters(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '', genres: [], months: [], regions: [],
      priceMin: 0, priceMax: 5000,
      family: null, camping: null, vibes: [], audience: [],
    });
  };

  const activeFilterCount = useMemo(() =>
    (filters.search ? 1 : 0) +
    filters.genres.length + filters.months.length + filters.regions.length +
    filters.vibes.length + filters.audience.length +
    (filters.family !== null ? 1 : 0) + (filters.camping !== null ? 1 : 0),
  [filters]);

  return (
    <div className="min-h-screen bg-gray-950">
      <FestivalListingSchema
        festivals={sorted}
        pageTitle="Festival Marketplace | FestiWise"
        pageDescription="Discover, explore, and compare the world's best music festivals with advanced filtering and personalized recommendations."
        pageUrl="https://getfestiwise.com/festivals"
      />

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Festival Marketplace
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {sorted.length} festivals
              {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode */}
            <div className="inline-flex items-center bg-gray-900 border border-white/10 rounded-lg p-1 gap-1">
              {(['grid', 'list'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded transition-all ${
                    viewMode === mode
                      ? 'bg-white/10 text-white shadow'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                  title={mode}
                >
                  {mode === 'grid' ? <Grid3x3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2 rounded-lg border border-white/10 bg-gray-900 text-gray-300 text-sm hover:border-white/20 transition-colors focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="trending">Trending</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration</option>
              <option value="name">A – Z</option>
              <option value="audience">Audience Size</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-medium ${
                showFilters
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-900 border border-white/10 text-gray-300 hover:border-white/20'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 bg-pink-500 text-white rounded-full text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick-filter chips: Genre + Month */}
      <div className="sticky top-[65px] z-40 bg-gray-950/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Genre row */}
          <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
            <span className="flex-shrink-0 text-[10px] font-bold text-gray-600 uppercase tracking-widest pr-1 min-w-[42px]">Genre</span>
            <button
              onClick={() => setFilters(f => ({ ...f, genres: [] }))}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                filters.genres.length === 0
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/25 hover:text-white'
              }`}
            >
              All
            </button>
            {allGenres.map(genre => (
              <button
                key={genre}
                onClick={() =>
                  setFilters(f => ({
                    ...f,
                    genres: f.genres.includes(genre)
                      ? f.genres.filter(g => g !== genre)
                      : [...f.genres, genre],
                  }))
                }
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border capitalize ${
                  filters.genres.includes(genre)
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/25 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
          {/* Month row */}
          <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
            <span className="flex-shrink-0 text-[10px] font-bold text-gray-600 uppercase tracking-widest pr-1 min-w-[42px]">Month</span>
            <button
              onClick={() => setFilters(f => ({ ...f, months: [] }))}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                filters.months.length === 0
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white border-transparent shadow'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/25 hover:text-white'
              }`}
            >
              All
            </button>
            {['January','February','March','April','May','June','July','August','September','October','November','December'].map(month => (
              <button
                key={month}
                onClick={() =>
                  setFilters(f => ({
                    ...f,
                    months: f.months.includes(month)
                      ? f.months.filter(m => m !== month)
                      : [...f.months, month],
                  }))
                }
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  filters.months.includes(month)
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white border-transparent shadow'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/25 hover:text-white'
                }`}
              >
                {month.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className={`grid gap-8 ${showFilters ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'}`}>

          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="lg:col-span-1 hidden lg:block"
              >
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sticky top-36 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white">Filters</h2>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Reset
                      </button>
                    )}
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search festivals..."
                      value={filters.search}
                      onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-gray-800 text-gray-200 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleFilterExpanded('price')}
                      className="flex items-center justify-between w-full text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" /> Price Range</span>
                      {expandedFilters.has('price') ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {expandedFilters.has('price') && (
                      <div className="space-y-3 pl-4">
                        <div>
                          <label className="text-xs text-gray-500">Min: ${filters.priceMin}</label>
                          <input type="range" min="0" max="5000" step="100" value={filters.priceMin}
                            onChange={e => setFilters(f => ({ ...f, priceMin: parseInt(e.target.value) }))}
                            className="w-full accent-purple-500" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Max: ${filters.priceMax}</label>
                          <input type="range" min="0" max="5000" step="100" value={filters.priceMax}
                            onChange={e => setFilters(f => ({ ...f, priceMax: parseInt(e.target.value) }))}
                            className="w-full accent-purple-500" />
                        </div>
                      </div>
                    )}
                  </div>

                  <SidebarFilterSection title="Genres" icon={Music} section="genres"
                    expanded={expandedFilters.has('genres')} onToggle={() => toggleFilterExpanded('genres')}
                    options={allGenres} selected={filters.genres}
                    onChange={(g, on) => setFilters(f => ({ ...f, genres: on ? [...f.genres, g] : f.genres.filter(x => x !== g) }))}
                  />
                  <SidebarFilterSection title="Months" icon={Calendar} section="months"
                    expanded={expandedFilters.has('months')} onToggle={() => toggleFilterExpanded('months')}
                    options={allMonths} selected={filters.months}
                    onChange={(m, on) => setFilters(f => ({ ...f, months: on ? [...f.months, m] : f.months.filter(x => x !== m) }))}
                  />
                  <SidebarFilterSection title="Regions" icon={MapPin} section="regions"
                    expanded={expandedFilters.has('regions')} onToggle={() => toggleFilterExpanded('regions')}
                    options={allRegions} selected={filters.regions}
                    onChange={(r, on) => setFilters(f => ({ ...f, regions: on ? [...f.regions, r] : f.regions.filter(x => x !== r) }))}
                  />
                  <SidebarFilterSection title="Vibes" icon={Zap} section="vibes"
                    expanded={expandedFilters.has('vibes')} onToggle={() => toggleFilterExpanded('vibes')}
                    options={allVibes} selected={filters.vibes}
                    onChange={(v, on) => setFilters(f => ({ ...f, vibes: on ? [...f.vibes, v] : f.vibes.filter(x => x !== v) }))}
                  />

                  {/* Amenities */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5" /> Amenities
                    </h3>
                    <div className="space-y-2 pl-4">
                      {[
                        { label: 'Family Friendly', field: 'family' as const },
                        { label: 'Camping Available', field: 'camping' as const },
                      ].map(({ label, field }) => (
                        <label key={field} className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters[field] === true}
                            onChange={e => setFilters(f => ({ ...f, [field]: e.target.checked ? true : null }))}
                            className="w-3.5 h-3.5 rounded accent-purple-500"
                          />
                          <span className="text-xs text-gray-400">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'col-span-1'}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-500 text-xs font-medium">
                {!isLoaded ? 'Loading...' : `${sorted.length} ${sorted.length === 1 ? 'festival' : 'festivals'}`}
              </p>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {!isLoaded ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Loading festivals...</p>
              </div>
            ) : sorted.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <AlertCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No festivals found</h3>
                <p className="text-gray-500 mb-6 text-sm">Try adjusting your filters</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                  <motion.div
                    key="grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                  >
                    {sorted.map(festival => (
                      <FestivalCard
                        key={festival.id}
                        festival={festival}
                        isFavorite={favorites.includes(festival.id)}
                        isComparing={comparing.some(f => f.id === festival.id)}
                        onFavorite={() => toggleFavorite(festival.id)}
                        onCompare={() => toggleCompare(festival)}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    {sorted.map(festival => (
                      <FestivalListItem
                        key={festival.id}
                        festival={festival}
                        isFavorite={favorites.includes(festival.id)}
                        isComparing={comparing.some(f => f.id === festival.id)}
                        onFavorite={() => toggleFavorite(festival.id)}
                        onCompare={() => toggleCompare(festival)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Filter Section ─────────────────────────────────────────────────

function SidebarFilterSection({
  title, icon: Icon, section: _section, expanded, onToggle, options, selected, onChange,
}: {
  title: string;
  icon: React.ComponentType<{ className: string }>;
  section: string;
  expanded: boolean;
  onToggle: () => void;
  options: string[];
  selected: string[];
  onChange: (value: string, checked: boolean) => void;
}) {
  return (
    <div className="space-y-2">
      <button onClick={onToggle} className="flex items-center justify-between w-full text-xs font-semibold text-gray-400 hover:text-white transition-colors">
        <span className="flex items-center gap-2"><Icon className="w-3.5 h-3.5" />{title}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      {expanded && (
        <div className="space-y-1.5 pl-4 max-h-48 overflow-y-auto scrollbar-hide">
          {options.map(option => (
            <label key={option} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={e => onChange(option, e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-purple-500"
              />
              <span className="text-xs text-gray-400 capitalize">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Festival Card ───────────────────────────────────────────────────────────

function FestivalCard({
  festival, isFavorite, isComparing, onFavorite, onCompare,
}: {
  festival: Festival;
  isFavorite: boolean;
  isComparing: boolean;
  onFavorite: () => void;
  onCompare: () => void;
}) {
  const gradient = getGenreGradient(festival.genres);

  return (
    <motion.div variants={itemVariants} className="relative group">
      <div className="bg-gray-900 rounded-2xl border border-white/8 hover:border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">

        {/* Genre-colored header */}
        <div className={`relative h-36 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Badges top-left */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {VERIFIED_FESTIVALS.has(festival.id) && <VerifiedBadge />}
            {festival.family_friendly && (
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold border border-green-400/30">Family</span>
            )}
            {festival.camping && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">Camping</span>
            )}
          </div>

          {/* Action buttons top-right */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            <button
              onClick={onFavorite}
              className={`p-2 rounded-full backdrop-blur-sm shadow transition-all ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onCompare}
              className={`p-2 rounded-full backdrop-blur-sm shadow transition-all ${
                isComparing ? 'bg-purple-600 text-white' : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'
              }`}
              title="Add to compare"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>

          {/* Location + price bottom of header */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <p className="text-white/70 text-xs font-medium truncate">
              {festival.city}, {festival.country}
            </p>
            <PriceBadge max={festival.estimated_cost_usd.max} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{festival.name}</h3>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />{festival.months[0]}
            </span>
            <span>{festival.duration_days}d</span>
            <span className="capitalize">{festival.audience_size}</span>
          </div>

          {/* Genre pills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {festival.genres.slice(0, 3).map(g => (
              <span key={g} className="px-2 py-0.5 rounded-full bg-white/8 text-gray-300 text-xs border border-white/10 capitalize">{g}</span>
            ))}
          </div>

          {/* Vibe pills */}
          {festival.vibe.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {festival.vibe.slice(0, 2).map(v => (
                <span key={v} className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 text-xs border border-purple-400/20 capitalize">{v}</span>
              ))}
            </div>
          )}

          <ProTips festivalId={festival.id} />

          {/* CTAs */}
          <div className="flex gap-2 mt-auto pt-3 border-t border-white/8">
            <motion.a
              href={`/go/${festival.id}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              aria-label={`Get tickets for ${festival.name}`}
              animate={{ boxShadow: ['0 0 0 0 rgba(249,115,22,0.2)', '0 4px 18px 4px rgba(249,115,22,0.15)', '0 0 0 0 rgba(249,115,22,0.2)'] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg font-bold text-xs hover:from-orange-600 hover:to-rose-600 transition-colors text-center"
            >
              Get Tickets
            </motion.a>
            <a
              href={`/festival/${festival.id}`}
              className="flex-1 py-2 bg-white/8 border border-white/10 text-gray-300 rounded-lg font-semibold text-xs hover:bg-white/12 transition-colors text-center flex items-center justify-center gap-1"
            >
              Details <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Festival List Item ──────────────────────────────────────────────────────

function FestivalListItem({
  festival, isFavorite, isComparing, onFavorite, onCompare,
}: {
  festival: Festival;
  isFavorite: boolean;
  isComparing: boolean;
  onFavorite: () => void;
  onCompare: () => void;
}) {
  const gradient = getGenreGradient(festival.genres);

  return (
    <motion.div variants={itemVariants}>
      <div className="bg-gray-900 border border-white/8 hover:border-white/18 rounded-xl p-4 flex gap-4 transition-all duration-200">
        {/* Colour swatch */}
        <div className={`hidden sm:block w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex-shrink-0`} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h3 className="text-sm font-bold text-white">{festival.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />{festival.city}, {festival.country}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={onFavorite}
                className={`p-1.5 rounded-full transition-all ${
                  isFavorite ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-500 hover:text-gray-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onCompare}
                className={`p-1.5 rounded-full transition-all ${
                  isComparing ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-500 hover:text-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
            <span>${festival.estimated_cost_usd.min}–${festival.estimated_cost_usd.max}</span>
            <span>{festival.months[0]}</span>
            <span>{festival.duration_days}d</span>
            <span className="capitalize">{festival.genres[0]}</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-2">
            {festival.family_friendly && <span className="px-2 py-0.5 bg-green-500/15 text-green-400 rounded text-xs border border-green-400/20">Family</span>}
            {festival.camping && <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 rounded text-xs border border-amber-400/20">Camping</span>}
            {festival.vibe.slice(0, 2).map(v => (
              <span key={v} className="px-2 py-0.5 bg-purple-500/15 text-purple-300 rounded text-xs border border-purple-400/20 capitalize">{v}</span>
            ))}
          </div>

          <ProTips festivalId={festival.id} />
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 flex-shrink-0 justify-center">
          <motion.a
            href={`/go/${festival.id}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={`Get tickets for ${festival.name}`}
            animate={{ boxShadow: ['0 0 0 0 rgba(249,115,22,0.2)', '0 4px 14px 2px rgba(249,115,22,0.14)', '0 0 0 0 rgba(249,115,22,0.2)'] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg font-bold text-xs hover:from-orange-600 hover:to-rose-600 transition-colors whitespace-nowrap"
          >
            Get Tickets
          </motion.a>
          <a
            href={`/festival/${festival.id}`}
            className="px-4 py-2 bg-white/8 border border-white/10 text-gray-300 rounded-lg font-semibold text-xs hover:bg-white/12 transition-colors text-center"
          >
            Details
          </a>
        </div>
      </div>
    </motion.div>
  );
}
