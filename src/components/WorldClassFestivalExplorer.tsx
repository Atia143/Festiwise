'use client';

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Grid3x3,
  List,
  Map,
  Clock,
  Heart,
  Share2,
  Filter,
  X,
  Check,
  Star,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  Music,
  Search,
  Zap,
  TrendingUp,
  Award,
  Flame,
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
type SortOption = 'trending' | 'rating' | 'price-low' | 'price-high' | 'name' | 'duration' | 'audience';

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

const MockRating = () => {
  const rating = Math.round((Math.random() * 20 + 80)) / 10; // 8.0 - 10.0
  const reviews = Math.floor(Math.random() * 3000 + 500);
  return { rating, reviews };
};

const TrendingBadge = ({ trend }: { trend: 'hot' | 'popular' | 'rising' }) => {
  const config = {
    hot: { icon: Flame, color: 'text-red-500', bg: 'bg-red-50', label: 'Hot' },
    popular: { icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Trending' },
    rising: { icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Rising' },
  };
  const Icon = config[trend].icon;
  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${config[trend].bg} text-xs font-semibold`}>
      <Icon className={`w-3 h-3 ${config[trend].color}`} />
      <span className={config[trend].color}>{config[trend].label}</span>
    </div>
  );
};

const PriceBadge = ({ min, max }: { min: number; max: number }) => {
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

export default function WorldClassFestivalExplorer() {
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
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
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
  const allAudience = useMemo(() => getUnique(festivals.map(f => f.audience_size)), [festivals]);

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
      case 'rating':
      default:
        arr.sort(() => (Math.random() > 0.5 ? 1 : -1)); // Randomize for visual diversity
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
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
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
              <option value="rating">Top Rated</option>
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
  section,
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
  isHovered,
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
  const { rating, reviews } = MockRating();
  const trend = Math.random() > 0.6 ? ('hot' as const) : Math.random() > 0.5 ? ('popular' as const) : ('rising' as const);

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
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
            <TrendingBadge trend={trend} />
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

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">{rating}</span>
            <span className="text-xs text-gray-600">({reviews})</span>
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

          {/* CTA Buttons */}
          <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
            <a
              href={festival.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-pink-700 transition-all text-center"
            >
              Learn More
            </a>
            <a
              href={festival.ticket_official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-900 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all text-center"
            >
              Tickets
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
  const { rating, reviews } = MockRating();

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
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="font-semibold ml-1">{rating}</span>
            </div>
            <span className="text-gray-600">
              ${festival.estimated_cost_usd.min} - ${festival.estimated_cost_usd.max}
            </span>
            <span className="text-gray-600">{festival.months[0]}</span>
            <span className="text-gray-600">{festival.genres.join(', ')}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {festival.family_friendly && <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">Family</span>}
            {festival.camping && <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium">Camping</span>}
            {festival.vibe.map(v => (
              <span key={v} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Quick CTA */}
        <div className="flex gap-2 flex-shrink-0">
          <a
            href={festival.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-all"
          >
            Learn More
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
