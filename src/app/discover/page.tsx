'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SimpleNewsletterForm from '@/components/Newsletter/SimpleNewsletterForm';
import { useAnalyticsTracker } from '@/lib/analytics-tracker';
import Head from 'next/head';
import { Suspense, lazy } from 'react';

// Import festival data
import festivalsData from '@/data/festivals.json';

interface Festival {
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
}

const allGenres = ['electronic', 'indie', 'rock', 'pop', 'hiphop', 'classical', 'jazz', 'reggae', 'folk', 'metal'];
const allVibes = ['mainstream', 'luxury', 'underground', 'cultural', 'party', 'chill', 'spiritual', 'transformational'];
const budgetRanges = [
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500-$1000', min: 500, max: 1000 },
  { label: '$1000-$2000', min: 1000, max: 2000 },
  { label: '$2000+', min: 2000, max: 999999 },
];
const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

type SortOption = 'trending' | 'budget-low' | 'budget-high' | 'audience';

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('All');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedFestivals, setSavedFestivals] = useState<string[]>([]);

  // Analytics tracking
  const { trackFilterChange, trackFestivalSave } = useAnalyticsTracker();

  // Load saved festivals from localStorage
  useEffect(() => {
    setIsLoading(false);
    const saved = localStorage.getItem('saved-festivals');
    if (saved) {
      setSavedFestivals(JSON.parse(saved));
    }
  }, []);

  const toggleSave = (festivalId: string) => {
    const newSaved = savedFestivals.includes(festivalId)
      ? savedFestivals.filter(id => id !== festivalId)
      : [...savedFestivals, festivalId];
    setSavedFestivals(newSaved);
    localStorage.setItem('saved-festivals', JSON.stringify(newSaved));
  };

  const allRegions = [...new Set((festivalsData as Festival[]).map(f => f.region))];

  const filteredFestivals = useMemo(() => {
    if (isLoading) return [];
    let filtered = [...festivalsData] as Festival[];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(festival =>
        festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        festival.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        festival.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(f => f.genres.includes(selectedGenre));
    }

    // Budget filter
    if (selectedBudget !== 'All') {
      const range = budgetRanges.find(r => r.label === selectedBudget);
      if (range) {
        filtered = filtered.filter(f =>
          f.estimated_cost_usd.min <= range.max && f.estimated_cost_usd.max >= range.min
        );
      }
    }

    // Vibe filter
    if (selectedVibe !== 'All') {
      filtered = filtered.filter(f => f.vibe.includes(selectedVibe));
    }

    // Month filter
    if (selectedMonth !== 'All') {
      filtered = filtered.filter(f => f.months.includes(selectedMonth));
    }

    // Region filter
    if (selectedRegion !== 'All') {
      filtered = filtered.filter(f => f.region === selectedRegion);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'budget-low':
          return a.estimated_cost_usd.min - b.estimated_cost_usd.min;
        case 'budget-high':
          return b.estimated_cost_usd.max - a.estimated_cost_usd.max;
        case 'audience':
          const audienceOrder = { massive: 3, large: 2, medium: 1, small: 0 };
          return (audienceOrder[b.audience_size as keyof typeof audienceOrder] || 0) -
                 (audienceOrder[a.audience_size as keyof typeof audienceOrder] || 0);
        case 'trending':
        default:
          return Math.random() - 0.5; // Pseudo-random for MVP
      }
    });

    return filtered;
  }, [festivalsData, searchTerm, selectedGenre, selectedBudget, selectedVibe, selectedMonth, selectedRegion, sortBy, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-3xl">🗺️</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Discovering Festivals</h2>
          <p className="text-lg text-gray-600">Loading your festival map...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 -mt-20 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/80 to-pink-800/90" />
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative px-4 sm:px-6 py-20 sm:py-32">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl">🗺️</span>
                <span className="text-white font-semibold text-sm md:text-base">Interactive Discovery</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </motion.div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
                Festival <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">Discovery</span>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
                Explore 100+ world-class festivals. 
                <span className="text-yellow-300 font-semibold"> Filter by vibe</span>, 
                <span className="text-pink-300 font-semibold"> budget</span>, 
                <span className="text-purple-300 font-semibold"> and location</span>.
              </p>
              <motion.div
                className="max-w-2xl mx-auto relative mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔍
                  </motion.div>
                  <input
                    type="text"
                    placeholder="Search festivals by name, city, or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-6 text-xl rounded-3xl border-2 border-white/20 focus:border-white/60 focus:ring-4 focus:ring-white/20 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                  />
                  {searchTerm && (
                    <motion.button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xl"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      ✕
                    </motion.button>
                  )}
                </div>
              </motion.div>
              <motion.div
                className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 text-white/80 px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Link href="/discover/planner" className="w-full sm:w-auto">
                  <motion.button
                    className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all font-medium text-white text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>🎯</span>
                    <span>Quick Planner</span>
                  </motion.button>
                </Link>
                <Link href="/discover/filters" className="w-full sm:w-auto">
                  <motion.button
                    className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all font-medium text-white text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>📂</span>
                    <span>Browse Filters</span>
                  </motion.button>
                </Link>
                <Link href="/discover/leaderboards" className="w-full sm:w-auto">
                  <motion.button
                    className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all font-medium text-white text-sm sm:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>🏆</span>
                    <span>See Rankings</span>
                  </motion.button>
                </Link>
              </motion.div>
              <motion.div
                className="flex flex-wrap justify-center gap-4 sm:gap-8 text-white/80 mt-8 px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300">{filteredFestivals.length}</div>
                  <div className="text-sm">Festivals Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300">{savedFestivals.length}</div>
                  <div className="text-sm">Saved Festivals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300">6</div>
                  <div className="text-sm">Continents</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              {['All', ...allGenres.slice(0, 5)].map((genre) => (
                <motion.button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 text-sm ${
                    selectedGenre === genre
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {genre === 'All' ? '🎵 All Genres' : genre}
                </motion.button>
              ))}
              <motion.button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  showAdvancedFilters
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚙️ More Filters
              </motion.button>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all bg-white"
              >
                <option value="trending">Trending</option>
                <option value="budget-low">Budget: Low to High</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="audience">Audience Size</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 pt-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Budget */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Budget</label>
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    >
                      <option value="All">All Budgets</option>
                      {budgetRanges.map(range => (
                        <option key={range.label} value={range.label}>{range.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Vibe */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Vibe</label>
                    <select
                      value={selectedVibe}
                      onChange={(e) => setSelectedVibe(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    >
                      <option value="All">All Vibes</option>
                      {allVibes.map(vibe => (
                        <option key={vibe} value={vibe}>{vibe}</option>
                      ))}
                    </select>
                  </div>

                  {/* Month */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    >
                      <option value="All">All Months</option>
                      {allMonths.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>

                  {/* Region */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Region</label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    >
                      <option value="All">All Regions</option>
                      {allRegions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Featured Festivals Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {filteredFestivals.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                  <span className="text-purple-600">{filteredFestivals.length}</span> Festivals Discovered
                </h2>
                <p className="text-xl text-gray-600">
                  {searchTerm || selectedGenre !== 'All' || selectedBudget !== 'All' 
                    ? 'Refine your search to discover more'
                    : 'Explore festivals tailored to your taste'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFestivals.map((festival: Festival, index: number) => (
                  <motion.div
                    key={festival.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="group"
                  >
                    <Link href={`/festival/${festival.id}`}>
                      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm group-hover:scale-[1.02] cursor-pointer">
                        {/* Image Placeholder */}
                        <div className="relative h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent" />
                          
                          {/* Badge Top-Left */}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/20 backdrop-blur-md border border-white/30 text-white">
                              {festival.audience_size}
                            </Badge>
                          </div>

                          {/* Save Button Top-Right */}
                          <motion.button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleSave(festival.id);
                            }}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <motion.span
                              className={`text-lg ${savedFestivals.includes(festival.id) ? 'text-red-400' : 'text-white'}`}
                              animate={{
                                scale: savedFestivals.includes(festival.id) ? [1, 1.3, 1] : 1
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {savedFestivals.includes(festival.id) ? '❤️' : '🤍'}
                            </motion.span>
                          </motion.button>

                          {/* Genres Bottom-Left */}
                          <div className="absolute bottom-4 left-4">
                            <div className="flex flex-wrap gap-1">
                              {festival.genres.slice(0, 2).map(genre => (
                                <span key={genre} className="text-white/90 text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                                  {genre}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Cost Bottom-Right */}
                          <div className="absolute bottom-4 right-4">
                            <span className="text-white font-bold bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full text-sm">
                              ${festival.estimated_cost_usd.min}-${festival.estimated_cost_usd.max}
                            </span>
                          </div>
                        </div>

                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                            {festival.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {festival.city}, {festival.country}
                          </p>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          {/* Key Info */}
                          <div className="flex flex-wrap gap-2">
                            {festival.camping && <Badge className="text-xs">🏕️ Camping</Badge>}
                            {festival.glamping && <Badge className="text-xs">✨ Glamping</Badge>}
                            {festival.family_friendly && <Badge className="text-xs">👨‍👩‍👧‍👦 Family</Badge>}
                          </div>

                          {/* Dates & Duration */}
                          <div className="text-sm text-gray-700">
                            <div className="font-semibold">{festival.months.join(', ')}</div>
                            <div className="text-gray-600">{festival.duration_days} days</div>
                          </div>

                          {/* Vibes */}
                          <div>
                            <div className="text-xs font-bold text-gray-700 uppercase mb-1">Vibes</div>
                            <div className="flex flex-wrap gap-1">
                              {festival.vibe.slice(0, 3).map(v => (
                                <span key={v} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                  {v}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Explore Button */}
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-4">
                            Explore →
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="text-8xl mb-8"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🔍
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">No festivals found</h3>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your filters to discover more festivals.
              </p>
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('All');
                  setSelectedBudget('All');
                  setSelectedVibe('All');
                  setSelectedMonth('All');
                  setSelectedRegion('All');
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset Filters
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Newsletter CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <SimpleNewsletterForm />
      </div>
    </div>
  );
}
