'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Grid3x3,
  List,
  Map,
  Clock,
  Heart,
  Filter,
  X,
  Check,
  DollarSign,
  MapPin,
  Calendar,
  Music,
  Search,
  Zap,
  Award,
  AlertCircle,
} from 'lucide-react';
import FestivalListingSchema from '@/components/SEO/FestivalListingSchema';
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

type ViewMode = 'grid' | 'list' | 'map' | 'timeline';
type SortOption = 'trending' | 'price-low' | 'price-high' | 'name' | 'duration' | 'audience';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const getUnique = (arr: string[][] | string[]) =>
  Array.from(new Set(Array.isArray(arr[0]) ? (arr as string[][]).flat() : (arr as string[]))).filter(Boolean);

// Top 10 festivals manually reviewed and verified by FestiWise editors
const VERIFIED_FESTIVALS = new Set([
  'tomorrowland', 'coachella', 'glastonbury', 'burning_man', 'ultra_miami',
  'rock_in_rio', 'fuji_rock', 'sziget', 'roskilde', 'primavera',
]);

const VerifiedBadge = () => (
  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 select-none">
    <svg viewBox="0 0 20 20" className="w-3 h-3 fill-current flex-shrink-0" aria-hidden="true">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    Verified
  </div>
);

// Pro Tips per festival — insider knowledge to boost conversions
const PRO_TIPS: Record<string, string[]> = {
  'tomorrowland': [
    'Book DreamVille camping in January — it sells out in under 30 minutes.',
    'Weekend 2 resale tickets are typically 15-20% cheaper than Weekend 1.',
    'The Mainstage is spectacular but Atmosphere & Freedom stage have the best acts.',
  ],
  'coachella': [
    'Weekend 2 resale tickets average 20-40% cheaper than Weekend 1.',
    'Car camping requires a separate wristband — book it at the same time as your ticket.',
    'The Sahara and Gobi tents run until after the headliner — perfect for EDM fans.',
  ],
  'glastonbury': [
    'You must register (with photo) before you can buy a ticket — registration is free.',
    'The Park and Strummerville stages are hidden gems away from the main crowds.',
    'Pack wellies and a poncho — rain is almost guaranteed at some point.',
  ],
  'burning-man': [
    'Tickets are released in waves via a pre-sale lottery — join the mailing list early.',
    'This is a cashless event: bring gifts, not cash. Coffee and ice are the only things sold.',
    'Alkaline dust storms hit daily — a quality dust mask and goggles are non-negotiable.',
  ],
  'ultra-miami': [
    'Park & Ride from Marlins Park is the easiest way to avoid traffic and parking fees.',
    'VIP day tickets often become available closer to the event when corporate passes go unsold.',
  ],
  'primavera': [
    'Buy the 3-day pass — it is significantly cheaper than individual day tickets.',
    'The venue is split across Parc del Forum and Poble Espanyol: plan your route in advance.',
    'Book accommodation in Poblenou for easy walking distance to the Parc del Forum stages.',
  ],
  'roskilde': [
    'Volunteer tickets are available — you work ~32 hours in exchange for free entry.',
    'Camping opens days before the music: arrive early for the best spots near the stages.',
    'The Orange Stage headliner lineup is announced just weeks before the festival.',
  ],
  'exit': [
    'The fortress opens at sunset and the main stage is set inside the medieval walls.',
    'Accommodation in Novi Sad city centre is far cheaper than festival camping packages.',
    'Night swim spots on the Danube are a local secret — ask at your hostel.',
  ],
  'sonar': [
    'Day (SonarDay) and Night (SonarNight) events are held at different venues — check which stage your artist plays.',
    'Book Fira de Barcelona hotels early — they block up 6+ months in advance.',
    'The SonarLab installations are free and an underrated part of the experience.',
  ],
  'rock-werchter': [
    'Camping tickets include all festival days — the campsite atmosphere is as good as the music.',
    'The VIP Golden Circle offers a massive close-up view of the Main Stage.',
    'The Barn and Club stages run until 5am — pace yourself across the weekend.',
  ],
  'fuji-rock': [
    'Book accommodation in Naeba (at the ski resort) for the closest lodging to the stages.',
    'Bring waterproof gear — summer rain in the mountains is common.',
    'The trek to the Field of Heaven stage takes 30+ minutes — plan extra time.',
  ],
  'sziget': [
    'Week-long "A-to-Z" tickets offer the best value if you can attend the full 7 days.',
    'The island has its own ferry service from Budapest — cheaper than taxi.',
    'Arrive by Wednesday for the best campsite spots before the main crowds arrive.',
  ],
  'electric-daisy-carnival': [
    'The festival runs overnight (9pm–7am) — bring layers for the desert cold before sunrise.',
    'Shuttle passes from Las Vegas Strip hotels are worth every dollar — avoid the traffic.',
    'The art installations around the venue are best explored just before dawn.',
  ],
  'lollapalooza': [
    'The festival is split between two distinct weekend lineups — check which artists play your weekend.',
    'Grant Park\'s shade is rare: bring sunscreen and a portable fan.',
    'VIP Platinum experience includes dedicated entrances and lounge areas.',
  ],
  'melt': [
    'The industrial steelworks setting is unlike any other festival in Europe.',
    'Book early-bird tickets — the price increases in three tiers.',
    'Head to the Ferropolis lake side for silent disco and the best sunrise views.',
  ],
};

// Collapsible Pro Tips widget used inside cards
function ProTips({ festivalId }: { festivalId: string }) {
  const tips = PRO_TIPS[festivalId];
  const [open, setOpen] = useState(false);
  if (!tips || tips.length === 0) return null;
  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 hover:bg-amber-100 transition-colors"
      >
        <span>PRO TIPS</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <ul className="mt-2 space-y-1.5">
          {tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-xs text-gray-700 bg-amber-50 rounded-lg px-3 py-2">
              <span className="text-amber-500 font-bold shrink-0">★</span>
              {tip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


const PriceBadge = ({ min: _min, max }: { min: number; max: number }) => {
  const level = max <= 300 ? 'budget' : max <= 700 ? 'mid' : 'premium';
  const colors = {
    budget: 'bg-green-50 text-green-700 border-green-200',
    mid: 'bg-blue-50 text-blue-700 border-blue-200',
    premium: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  const labels = {
    budget: '💰 Budget Friendly',
    mid: '💎 Mid-Range',
    premium: '👑 Premium',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>
      {labels[level]}
    </span>
  );
};

export default function FestivalMarketplace() {
  const [festivals, setFestivals] = useState<Festival[]>(() => {
    // Initialize festivals immediately on client
    try {
      return festivalsData && Array.isArray(festivalsData) ? (festivalsData as Festival[]) : [];
    } catch {
      return [];
    }
  });
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set(['genres']));
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [hoveredFestival, setHoveredFestival] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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

  // Load data and favorites on client-side only
  useEffect(() => {
    try {
      const data = festivalsData as Festival[];
      if (data && Array.isArray(data) && data.length > 0) {
        setFestivals(data);
      } else {
        console.warn('No festivals data found:', { data, isArray: Array.isArray(data), length: data?.length });
      }
      
      if (typeof window !== 'undefined') {
        const fav = JSON.parse(window.localStorage?.getItem('festi_favs') || '[]');
        setFavorites(Array.isArray(fav) ? fav : []);
      }
    } catch (error) {
      console.error('Error loading festivals:', error);
      setFestivals([]);
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem('festi_favs', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Get unique values for filter dropdowns
  const allGenres = useMemo(() => getUnique(festivals.map(f => f.genres)), [festivals]);
  const allMonths = useMemo(() => getUnique(festivals.map(f => f.months)), [festivals]);
  const allRegions = useMemo(() => getUnique(festivals.map(f => f.region)), [festivals]);
  const allVibes = useMemo(() => getUnique(festivals.map(f => f.vibe)), [festivals]);

  // Memoized filtering
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
      const min = fest.estimated_cost_usd.min;
      const max = fest.estimated_cost_usd.max;
      if (max < filters.priceMin || min > filters.priceMax) return false;
      return true;
    });
  }, [festivals, filters]);

  // Memoized sorting
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortBy) {
      case 'price-low':
        arr.sort((a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min);
        break;
      case 'price-high':
        arr.sort((a, b) => b.estimated_cost_usd.max - a.estimated_cost_usd.max);
        break;
      case 'duration':
        arr.sort((a, b) => b.duration_days - a.duration_days);
        break;
      case 'name':
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'audience': {
        const order = { 'massive': 4, 'large': 3, 'medium': 2, 'small': 1 };
        arr.sort(
          (a, b) =>
            (order[b.audience_size as keyof typeof order] || 0) -
            (order[a.audience_size as keyof typeof order] || 0)
        );
        break;
      }
      case 'trending':
      default: {
        const sizeOrder = { 'massive': 4, 'large': 3, 'medium': 2, 'small': 1 };
        arr.sort(
          (a, b) =>
            (sizeOrder[b.audience_size as keyof typeof sizeOrder] || 0) -
            (sizeOrder[a.audience_size as keyof typeof sizeOrder] || 0)
        );
        break;
      }
    }
    return arr;
  }, [filtered, sortBy]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }, []);

  const toggleFilterExpanded = (name: string) => {
    setExpandedFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(name)) newSet.delete(name);
      else newSet.add(name);
      return newSet;
    });
  };

  const resetFilters = () => {
    setFilters({
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
  };

  const activeFilterCount = useMemo(() => {
    return (
      (filters.search ? 1 : 0) +
      filters.genres.length +
      filters.months.length +
      filters.regions.length +
      filters.vibes.length +
      filters.audience.length +
      (filters.family !== null ? 1 : 0) +
      (filters.camping !== null ? 1 : 0)
    );
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <FestivalListingSchema
        festivals={sorted}
        pageTitle="Festival Marketplace | FestiWise"
        pageDescription="Discover, explore, and compare the world's best music festivals with advanced filtering, comparisons, and personalized recommendations."
        pageUrl="https://getfestiwise.com/festivals"
      />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Festival Marketplace
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {sorted.length} festivals • {activeFilterCount > 0 && `${activeFilterCount} active filters`}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View Mode Toggle */}
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              {(['grid', 'list', 'map', 'timeline'] as ViewMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded transition-all ${
                    viewMode === mode
                      ? 'bg-white text-purple-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={mode}
                >
                  {mode === 'grid' && <Grid3x3 className="w-5 h-5" />}
                  {mode === 'list' && <List className="w-5 h-5" />}
                  {mode === 'map' && <Map className="w-5 h-5" />}
                  {mode === 'timeline' && <Clock className="w-5 h-5" />}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm hover:border-gray-400 transition-colors"
            >
              <option value="trending">Trending</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="duration">Duration</option>
              <option value="name">Name (A-Z)</option>
              <option value="audience">Audience Size</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                showFilters
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Comparison Badge */}
            {compare.length > 0 && (
              <button
                className="px-4 py-2 rounded-lg bg-amber-100 text-amber-900 font-medium text-sm hover:bg-amber-200 transition-colors"
              >
                Compare ({compare.length}/3)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1 hidden lg:block"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search festivals..."
                      value={filters.search}
                      onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <button
                      onClick={() => toggleFilterExpanded('price')}
                      className="flex items-center justify-between w-full text-sm font-semibold text-gray-900"
                    >
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price Range
                      </span>
                      {expandedFilters.has('price') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedFilters.has('price') && (
                      <div className="space-y-3 pl-6">
                        <div>
                          <label className="text-xs text-gray-600">Min: ${filters.priceMin}</label>
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={filters.priceMin}
                            onChange={e => setFilters(f => ({ ...f, priceMin: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Max: ${filters.priceMax}</label>
                          <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={filters.priceMax}
                            onChange={e => setFilters(f => ({ ...f, priceMax: parseInt(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  <FilterSection
                    title="Genres"
                    icon={Music}
                    section="genres"
                    expanded={expandedFilters.has('genres')}
                    onToggle={() => toggleFilterExpanded('genres')}
                    options={allGenres}
                    selected={filters.genres}
                    onChange={(genre, checked) =>
                      setFilters(f => ({
                        ...f,
                        genres: checked
                          ? [...f.genres, genre]
                          : f.genres.filter(g => g !== genre),
                      }))
                    }
                  />

                  {/* Months */}
                  <FilterSection
                    title="Months"
                    icon={Calendar}
                    section="months"
                    expanded={expandedFilters.has('months')}
                    onToggle={() => toggleFilterExpanded('months')}
                    options={allMonths}
                    selected={filters.months}
                    onChange={(month, checked) =>
                      setFilters(f => ({
                        ...f,
                        months: checked
                          ? [...f.months, month]
                          : f.months.filter(m => m !== month),
                      }))
                    }
                  />

                  {/* Regions */}
                  <FilterSection
                    title="Regions"
                    icon={MapPin}
                    section="regions"
                    expanded={expandedFilters.has('regions')}
                    onToggle={() => toggleFilterExpanded('regions')}
                    options={allRegions}
                    selected={filters.regions}
                    onChange={(region, checked) =>
                      setFilters(f => ({
                        ...f,
                        regions: checked
                          ? [...f.regions, region]
                          : f.regions.filter(r => r !== region),
                      }))
                    }
                  />

                  {/* Vibes */}
                  <FilterSection
                    title="Vibes"
                    icon={Zap}
                    section="vibes"
                    expanded={expandedFilters.has('vibes')}
                    onToggle={() => toggleFilterExpanded('vibes')}
                    options={allVibes}
                    selected={filters.vibes}
                    onChange={(vibe, checked) =>
                      setFilters(f => ({
                        ...f,
                        vibes: checked
                          ? [...f.vibes, vibe]
                          : f.vibes.filter(v => v !== vibe),
                      }))
                    }
                  />

                  {/* Amenities */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Amenities
                    </h3>
                    <div className="space-y-2 pl-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.family === true}
                          onChange={e =>
                            setFilters(f => ({
                              ...f,
                              family: e.target.checked ? true : null,
                            }))
                          }
                          className="w-4 h-4 rounded text-purple-600"
                        />
                        <span className="text-sm text-gray-700">Family Friendly</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.camping === true}
                          onChange={e =>
                            setFilters(f => ({
                              ...f,
                              camping: e.target.checked ? true : null,
                            }))
                          }
                          className="w-4 h-4 rounded text-purple-600"
                        />
                        <span className="text-sm text-gray-700">Camping Available</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 text-sm font-medium">
                {!isLoaded ? 'Loading...' : `Showing ${sorted.length} ${sorted.length === 1 ? 'festival' : 'festivals'}`}
              </p>
            </div>

            {/* Festival Grid/List */}
            {!isLoaded ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading festivals...</p>
              </div>
            ) : !festivals || festivals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full text-center py-16"
              >
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No festivals available</h3>
                <p className="text-gray-600 mb-6">Festivals data is currently unavailable</p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {sorted.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full text-center py-16"
                  >
                    <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No festivals found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your search criteria to discover more festivals</p>
                    <button
                      onClick={resetFilters}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                ) : viewMode === 'grid' ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {sorted.map(festival => (
                      <FestivalCard
                        key={festival.id}
                        festival={festival}
                        isFavorite={favorites.includes(festival.id)}
                        isComparing={compare.includes(festival.id)}
                        isHovered={hoveredFestival === festival.id}
                        onFavorite={() => toggleFavorite(festival.id)}
                        onCompare={() => toggleCompare(festival.id)}
                        onHover={() => setHoveredFestival(festival.id)}
                        onUnhover={() => setHoveredFestival(null)}
                      />
                    ))}
                  </motion.div>
                ) : viewMode === 'list' ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                  >
                    {sorted.map(festival => (
                      <FestivalListItem
                        key={festival.id}
                        festival={festival}
                        isFavorite={favorites.includes(festival.id)}
                        isComparing={compare.includes(festival.id)}
                        onFavorite={() => toggleFavorite(festival.id)}
                        onCompare={() => toggleCompare(festival.id)}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 text-gray-600"
                  >
                    Switch to grid view to browse festivals
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Drawer */}
      {compare.length > 0 && (
        <ComparisonDrawer
          festivals={festivals.filter(f => compare.includes(f.id))}
          onClose={() => setCompare([])}
        />
      )}
    </div>
  );
}

// Filter Section Component
function FilterSection({
  title,
  icon: Icon,
  section: _section,
  expanded,
  onToggle,
  options,
  selected,
  onChange,
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
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-900"
      >
        <span className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {expanded && (
        <div className="space-y-2 pl-6">
          {options.map(option => (
            <label key={option} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={e => onChange(option, e.target.checked)}
                className="w-4 h-4 rounded text-purple-600"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// Festival Card Component
function FestivalCard({
  festival,
  isFavorite,
  isComparing,
  isHovered: _isHovered,
  onFavorite,
  onCompare,
  onHover,
  onUnhover,
}: {
  festival: Festival;
  isFavorite: boolean;
  isComparing: boolean;
  isHovered: boolean;
  onFavorite: () => void;
  onCompare: () => void;
  onHover: () => void;
  onUnhover: () => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      className="relative group"
    >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
          {/* Dark overlay + festival name watermark */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-12 left-4 right-16">
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest truncate">{festival.city}, {festival.country}</p>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
            {VERIFIED_FESTIVALS.has(festival.id) && <VerifiedBadge />}
            {festival.family_friendly && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                👨‍👩‍👧‍👦 Family
              </div>
            )}
            {festival.camping && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                🏕️ Camping
              </div>
            )}
          </div>

          {/* Action Buttons - Top Right */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={onFavorite}
              className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onCompare}
              className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all ${
                isComparing
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <Check className="w-5 h-5" />
            </button>
          </div>

          {/* Price Badge - Bottom Right */}
          <div className="absolute bottom-4 right-4">
            <PriceBadge min={festival.estimated_cost_usd.min} max={festival.estimated_cost_usd.max} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">
              {festival.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {festival.city}, {festival.country}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-gray-600 font-medium mb-1">Dates</p>
              <p className="font-semibold text-gray-900">{festival.months[0]}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-gray-600 font-medium mb-1">Duration</p>
              <p className="font-semibold text-gray-900">{festival.duration_days}d</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-gray-600 font-medium mb-1">Genres</p>
              <p className="font-semibold text-gray-900 truncate">{festival.genres[0]}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-gray-600 font-medium mb-1">Crowd</p>
              <p className="font-semibold text-gray-900">{festival.audience_size}</p>
            </div>
          </div>

          {/* Vibes Tags */}
          {festival.vibe.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {festival.vibe.slice(0, 3).map(vibe => (
                <span key={vibe} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {vibe}
                </span>
              ))}
            </div>
          )}

          <ProTips festivalId={festival.id} />

          {/* CTA Buttons */}
          <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
            <motion.a
              href={`/go/${festival.id}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              aria-label={`Get tickets for ${festival.name}`}
              animate={{ boxShadow: ['0 0 0 0 rgba(249,115,22,0.25)', '0 4px 20px 4px rgba(249,115,22,0.18)', '0 0 0 0 rgba(249,115,22,0.25)'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex-1 px-3 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg font-bold text-sm hover:from-orange-600 hover:to-rose-600 transition-colors text-center"
            >
              Get Tickets →
            </motion.a>
            <a
              href={festival.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Festival List Item Component
function FestivalListItem({
  festival,
  isFavorite,
  isComparing,
  onFavorite,
  onCompare,
}: {
  festival: Festival;
  isFavorite: boolean;
  isComparing: boolean;
  onFavorite: () => void;
  onCompare: () => void;
}) {

  return (
    <motion.div variants={itemVariants}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 p-4 flex gap-4">
        {/* Visual */}
        <div className="hidden md:block w-24 h-24 rounded-lg bg-gradient-to-br from-purple-400 to-blue-400 flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{festival.name}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {festival.city}, {festival.country}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={onFavorite}
                className={`p-2 rounded-full transition-all ${
                  isFavorite
                    ? 'bg-red-50 text-red-600'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onCompare}
                className={`p-2 rounded-full transition-all ${
                  isComparing
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 text-sm mb-3">
            <span className="text-gray-600">
              ${festival.estimated_cost_usd.min} - ${festival.estimated_cost_usd.max}
            </span>
            <span className="text-gray-600">{festival.months[0]}</span>
            <span className="text-gray-600">{festival.genres.join(', ')}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {festival.family_friendly && <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">Family</span>}
            {festival.camping && <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium">Camping</span>}
            {festival.vibe.map(v => (
              <span key={v} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                {v}
              </span>
            ))}
          </div>

          <ProTips festivalId={festival.id} />
        </div>

        {/* Quick CTAs */}
        <div className="flex gap-2 flex-shrink-0">
          <motion.a
            href={`/go/${festival.id}`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={`Get tickets for ${festival.name}`}
            animate={{ boxShadow: ['0 0 0 0 rgba(249,115,22,0.25)', '0 4px 20px 4px rgba(249,115,22,0.18)', '0 0 0 0 rgba(249,115,22,0.25)'] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-lg font-bold text-sm hover:from-orange-600 hover:to-rose-600 transition-colors whitespace-nowrap"
          >
            Get Tickets →
          </motion.a>
          <a
            href={festival.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all"
          >
            Info
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// Comparison Drawer Component
function ComparisonDrawer({
  festivals,
  onClose,
}: {
  festivals: Festival[];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl rounded-t-2xl max-h-96 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Comparing {festivals.length} Festivals</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {festivals.map(festival => (
            <div key={festival.id} className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{festival.name}</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Price:</span> ${festival.estimated_cost_usd.min} - ${festival.estimated_cost_usd.max}</p>
                <p><span className="font-semibold">Duration:</span> {festival.duration_days} days</p>
                <p><span className="font-semibold">Genres:</span> {festival.genres.join(', ')}</p>
                <p><span className="font-semibold">Audience:</span> {festival.audience_size}</p>
                <p><span className="font-semibold">Location:</span> {festival.city}, {festival.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
