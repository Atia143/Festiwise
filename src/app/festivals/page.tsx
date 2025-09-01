'use client';

import { useState, useMemo, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import festivalsData from '@/data/festivals.json';
import EnhancedFestivalCard from '@/components/EnhancedFestivalCard';
import { useAnalytics } from '@/components/Analytics/EventTracking';
import EnhancedNewsletterForm from '@/components/EnhancedNewsletterForm';
import { PremiumLoadingScreen, SmartContentLoader } from '@/components/LoadingStates/ProgressiveLoader';
import { FestivalGridSkeleton } from '@/components/LoadingStates/SkeletonComponents';
import { SITE_STATS } from '@/lib/stats';
import Seo from '@/components/Seo';
import type { Festival } from '@/types/festival';

// Internationalization constants - ready for i18n framework
const TEXT = {
  PAGE_TITLE: 'Festival Explorer - Discover Music Festivals Worldwide | FestiWise',
  HERO_TITLE: 'Festival Explorer',
  HERO_SUBTITLE: 'Discover extraordinary music festivals from around the globe. Advanced search, intelligent filtering, and personalized recommendations await.',
  CURRENCY_NOTE: 'All prices shown in USD • Currency conversion available',
  FILTERS: {
    COUNTRY: 'Country',
    GENRE: 'Genre', 
    MONTH: 'Month',
    PRICE_RANGE: 'Max Budget',
    SORT_BY: 'Sort by'
  },
  SORT_OPTIONS: {
    NAME: 'Name A-Z',
    PRICE: 'Price Low-High',
    CAPACITY: 'Audience Size',
    COUNTRY: 'Country',
    DURATION: 'Duration',
    POPULARITY: 'Popularity'
  },
  LABELS: {
    FOUND: 'Found',
    FESTIVALS: 'Festivals',
    COUNTRIES: 'Countries',
    GENRES: 'Genres',
    PRICE_RANGE_USD: 'Price Range (USD)',
    MONTHS: 'Months'
  },
  NO_RESULTS: {
    TITLE: 'No festivals found',
    SUBTITLE: 'Try adjusting your filters or search terms'
  }
} as const;

const festivals = festivalsData as Festival[];

// Advanced view modes
type ViewMode = 'grid' | 'list' | 'map';
type SortOption = 'name' | 'price' | 'capacity' | 'country' | 'duration' | 'popularity';

export default function FestivalsPage() {
  // Currency formatting for international users
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  // URL state management for SEO and shareability
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Analytics hook
  const { festival: trackFestival } = useAnalytics();

  // Initialize state from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlRegion = searchParams.get('region') || 'All';
    const urlGenre = searchParams.get('genre') || 'All';
    const urlMonth = searchParams.get('month') || 'All';
    const urlSort = searchParams.get('sort') as SortOption || 'name';
    const urlView = searchParams.get('view') as ViewMode || 'grid';
    const urlMinPrice = parseInt(searchParams.get('minPrice') || '0');
    const urlMaxPrice = parseInt(searchParams.get('maxPrice') || '5000');

    setSearchTerm(urlSearch);
    setSelectedRegion(urlRegion);
    setSelectedGenre(urlGenre);
    setSelectedMonth(urlMonth);
    setSortBy(urlSort);
    setViewMode(urlView);
    setPriceRange([urlMinPrice, urlMaxPrice]);
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== 'All' && value !== '' && value !== '0' && value !== '5000') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const newURL = params.toString() ? `?${params.toString()}` : '/festivals';
    router.push(newURL, { scroll: false });
  };

  // Premium loading experience with smart timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Delay content reveal for smooth transition
      setTimeout(() => setShowContent(true), 300);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('festival-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (festivalId: string) => {
    const newFavorites = favorites.includes(festivalId)
      ? favorites.filter(id => id !== festivalId)
      : [...favorites, festivalId];
    
    setFavorites(newFavorites);
    localStorage.setItem('festival-favorites', JSON.stringify(newFavorites));
  };

  // Enhanced filter change handlers with analytics and URL state
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateURL({ search: value });
    if (value.length > 2) {
      trackFestival.searchFestivals(value, filteredFestivals.length);
    }
  };

  const handleFilterChange = (type: string, value: string) => {
    switch (type) {
      case 'region':
        setSelectedRegion(value);
        updateURL({ region: value });
        break;
      case 'genre':
        setSelectedGenre(value);
        updateURL({ genre: value });
        break;
      case 'month':
        setSelectedMonth(value);
        updateURL({ month: value });
        break;
    }
    trackFestival.filterChange(type, value, filteredFestivals.length);
  };

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    updateURL({ sort: value });
    trackFestival.sortChange(value);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    updateURL({ view: mode });
  };

  const handlePriceRangeChange = (range: number[]) => {
    setPriceRange(range);
    updateURL({ 
      minPrice: range[0].toString(), 
      maxPrice: range[1].toString() 
    });
  };

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const countries = Array.from(new Set(festivals.map(f => f.country))).sort();
    const allGenres = festivals.flatMap(f => f.genres);
    const genres = Array.from(new Set(allGenres)).sort();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    return {
      countries: ['All', ...countries],
      genres: ['All', ...genres],
      months: ['All', ...months]
    };
  }, []);

  // Advanced filtering and sorting
  const filteredFestivals = useMemo(() => {
    const filtered = festivals.filter(festival => {
      const matchesSearch = festival.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           festival.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           festival.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           festival.genres.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           festival.vibe.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRegion = selectedRegion === 'All' || festival.country === selectedRegion;
      const matchesGenre = selectedGenre === 'All' || festival.genres.includes(selectedGenre);
      const matchesMonth = selectedMonth === 'All' || festival.months.includes(selectedMonth);
      const matchesPrice = festival.estimated_cost_usd.min >= priceRange[0] && 
                          festival.estimated_cost_usd.max <= priceRange[1];

      return matchesSearch && matchesRegion && matchesGenre && matchesMonth && matchesPrice;
    });

    // Advanced sorting
    filtered.sort((a, b) => {
      const sizeOrder = { 'massive': 4, 'large': 3, 'medium': 2, 'intimate': 1 };
      
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.estimated_cost_usd.min - b.estimated_cost_usd.min;
        case 'capacity':
          return (sizeOrder[b.audience_size as keyof typeof sizeOrder] || 0) - 
                 (sizeOrder[a.audience_size as keyof typeof sizeOrder] || 0);
        case 'country':
          return a.country.localeCompare(b.country);
        case 'duration':
          return b.duration_days - a.duration_days;
        case 'popularity':
          // Sort by favorites first, then by audience size
          const aFav = favorites.includes(a.id) ? 1 : 0;
          const bFav = favorites.includes(b.id) ? 1 : 0;
          if (aFav !== bFav) return bFav - aFav;
          return (sizeOrder[b.audience_size as keyof typeof sizeOrder] || 0) - 
                 (sizeOrder[a.audience_size as keyof typeof sizeOrder] || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedRegion, selectedGenre, selectedMonth, priceRange, sortBy, favorites]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-8">
            <motion.div
              className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-3xl">🎪</span>
            </motion.div>
            <motion.div
              className="absolute inset-0 w-20 h-20 mx-auto border-4 border-purple-200 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Festivals</h2>
          <p className="text-gray-600">Curating the perfect experiences for you...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Seo 
        title={`${TEXT.PAGE_TITLE}${searchTerm ? ` - ${searchTerm}` : ''}${selectedGenre !== 'All' ? ` - ${selectedGenre}` : ''}${selectedRegion !== 'All' ? ` - ${selectedRegion}` : ''}`}
        description={`Browse ${filteredFestivals.length} handpicked music festivals across ${filterOptions.countries.length - 1} countries. Advanced search, intelligent filtering, and personalized recommendations to find your perfect festival match.`}
        canonical={`https://festiwise.com/festivals${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
        type="website"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Music Festival Explorer',
            description: 'Comprehensive directory of music festivals worldwide',
            url: `https://festiwise.com/festivals${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: filteredFestivals.length,
              name: 'Music Festivals',
              description: 'Curated collection of music festivals',
              itemListElement: filteredFestivals.slice(0, 10).map((festival, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'MusicEvent',
                  '@id': `https://festiwise.com/festival/${festival.id}`,
                  name: festival.name,
                  description: `Music festival in ${festival.city}, ${festival.country}`,
                  url: festival.website,
                  location: {
                    '@type': 'Place',
                    name: `${festival.city}, ${festival.country}`,
                    address: {
                      '@type': 'PostalAddress',
                      addressLocality: festival.city,
                      addressCountry: festival.country
                    }
                  },
                  offers: {
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    price: festival.estimated_cost_usd.min,
                    priceRange: `${formatCurrency(festival.estimated_cost_usd.min)}-${formatCurrency(festival.estimated_cost_usd.max)}`,
                    availability: 'https://schema.org/InStock'
                  },
                  performer: {
                    '@type': 'MusicGroup',
                    name: 'Various Artists'
                  },
                  eventStatus: 'https://schema.org/EventScheduled',
                  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode'
                }
              }))
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://festiwise.com'
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Festival Explorer',
                  item: 'https://festiwise.com/festivals'
                }
              ]
            }
          }
        ]}
      />
      {/* Premium Loading Screen */}
      <PremiumLoadingScreen
        isVisible={isLoading}
        onComplete={() => setIsLoading(false)}
        context="festivals"
      />

      {/* Main Content with Smart Loading */}
      <SmartContentLoader
        isLoading={!showContent}
        skeleton={<FestivalGridSkeleton count={8} />}
        delay={0}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 -mt-20 pt-20">
          {/* Premium Hero Section */}
          <motion.section 
            className="relative px-4 sm:px-6 py-12 sm:py-24 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
        {/* Advanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-mesh-gradient opacity-3" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-blob animation-delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Premium Header */}
          <motion.div
            className="text-center mb-12 sm:mb-20"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 sm:space-x-3 px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500/15 to-pink-500/15 border border-purple-300/30 rounded-full mb-6 sm:mb-8 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="text-2xl sm:text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🎪
              </motion.span>
              <span className="text-white-100 font-bold text-base sm:text-lg">Live Updates</span>
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-8 tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                Festival
              </span>
              <br />
              <span className="text-gray-900">Explorer</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6 px-4">
              {TEXT.HERO_SUBTITLE}
            </p>

            {/* Currency Note for International Users */}
            <motion.div
              className="flex items-center justify-center gap-2 mb-6 sm:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm">
                <span>💱</span>
                <span>{TEXT.CURRENCY_NOTE}</span>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-8 mb-8 sm:mb-12"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {[
                { label: TEXT.LABELS.FESTIVALS, value: festivals.length, icon: '🎵', color: 'purple' },
                { label: TEXT.LABELS.COUNTRIES, value: filterOptions.countries.length - 1, icon: '🌍', color: 'blue' },
                { label: TEXT.LABELS.GENRES, value: filterOptions.genres.length - 1, icon: '🎸', color: 'pink' },
                { label: TEXT.LABELS.FOUND, value: filteredFestivals.length, icon: '🔍', color: 'green' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={`glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/30 text-center hover:scale-105 transition-transform duration-300 group`}
                  whileHover={{ y: -5 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="text-xl sm:text-2xl mb-1 group-hover:scale-110 transition-transform" aria-label={`${stat.label} icon`}>
                    {stat.icon}
                  </div>
                  <div className={`text-lg sm:text-2xl font-bold text-${stat.color}-600 mb-1`}>
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Trust Indicators - International Credibility */}
          <motion.div
            className="max-w-4xl mx-auto mb-8 sm:mb-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <div className="glass rounded-2xl p-6 sm:p-8 border border-white/20 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2">🌍</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Global Coverage</div>
                  <div className="text-xs text-gray-600">Festivals from {SITE_STATS.COUNTRIES_COVERED} countries</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2">🔒</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">GDPR Compliant</div>
                  <div className="text-xs text-gray-600">Your privacy protected</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Real-Time Updates</div>
                  <div className="text-xs text-gray-600">Always current information</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Advanced Search & Filter Interface */}
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/30 shadow-2xl backdrop-blur-xl">
              {/* Search Bar */}
              <div className="mb-6 sm:mb-8">
                <div className="relative">
                  <motion.div
                    className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-xl sm:text-2xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔍
                  </motion.div>
                  <Input
                    type="text"
                    placeholder="Search by name, city, genre, or vibe..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-6 text-base sm:text-xl rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg placeholder:text-gray-400"
                    aria-label="Search festivals by name, city, genre, or vibe"
                  />
                  {searchTerm && (
                    <motion.button
                      onClick={() => handleSearchChange('')}
                      className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      aria-label="Clear search"
                    >
                      ✕
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Filter Toggle */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-100 hover:bg-purple-200 rounded-xl sm:rounded-2xl transition-colors duration-300 group w-full sm:w-auto justify-center sm:justify-start"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`${showFilters ? 'Hide' : 'Show'} advanced filters`}
                  aria-expanded={showFilters}
                >
                  <span className="text-purple-700 font-semibold text-sm sm:text-base">Advanced Filters</span>
                  <motion.span
                    className="text-purple-600"
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ▼
                  </motion.span>
                </motion.button>

                {/* View Mode Selector */}
                <div className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 bg-gray-100 rounded-xl sm:rounded-2xl w-full sm:w-auto">
                  {[
                    { mode: 'grid' as ViewMode, icon: '⊞', label: 'Grid' },
                    { mode: 'list' as ViewMode, icon: '☰', label: 'List' },
                    { mode: 'map' as ViewMode, icon: '🗺️', label: 'Map' }
                  ].map((view) => (
                    <motion.button
                      key={view.mode}
                      onClick={() => handleViewModeChange(view.mode)}
                      className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm ${
                        viewMode === view.mode
                          ? 'bg-white shadow-md text-purple-600'
                          : 'text-gray-600 hover:text-purple-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={`Switch to ${view.label} view`}
                      aria-pressed={viewMode === view.mode}
                    >
                      <span className="mr-1 sm:mr-2">{view.icon}</span>
                      <span className="hidden sm:inline">{view.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 bg-white/50 rounded-xl sm:rounded-2xl border border-purple-100">
                      {/* Country Filter */}
                      <div>
                        <label htmlFor="country-filter" className="flex items-center text-sm font-bold text-gray-700 mb-3">
                          <span className="mr-2 text-lg" aria-label="Country">🌍</span>
                          Country
                        </label>
                        <select
                          id="country-filter"
                          value={selectedRegion}
                          onChange={(e) => handleFilterChange('region', e.target.value)}
                          aria-label="Filter festivals by country"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 bg-white/90 text-sm sm:text-base"
                        >
                          {filterOptions.countries.map((country: string) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Genre Filter */}
                      <div>
                        <label htmlFor="genre-filter" className="flex items-center text-sm font-bold text-gray-700 mb-3">
                          <span className="mr-2 text-lg" aria-label="Music genre">🎵</span>
                          Genre
                        </label>
                        <select
                          id="genre-filter"
                          value={selectedGenre}
                          onChange={(e) => handleFilterChange('genre', e.target.value)}
                          aria-label="Filter festivals by music genre"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 bg-white/90 text-sm sm:text-base"
                        >
                          {filterOptions.genres.map((genre: string) => (
                            <option key={genre} value={genre}>
                              {genre}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Month Filter */}
                      <div>
                        <label htmlFor="month-filter" className="flex items-center text-sm font-bold text-gray-700 mb-3">
                          <span className="mr-2 text-lg" aria-label="Month">📅</span>
                          Month
                        </label>
                        <select
                          id="month-filter"
                          value={selectedMonth}
                          onChange={(e) => handleFilterChange('month', e.target.value)}
                          aria-label="Filter festivals by month"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 bg-white/90 text-sm sm:text-base"
                        >
                          {filterOptions.months.map((month: string) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                          <span className="mr-2 text-lg">💰</span>
                          Max Budget: {formatCurrency(priceRange[1])}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="100"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceRangeChange([0, parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          aria-label={`Set maximum budget, currently ${formatCurrency(priceRange[1])}`}
                          aria-valuemin={0}
                          aria-valuemax={5000}
                          aria-valuenow={priceRange[1]}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{formatCurrency(0)}</span>
                          <span>{formatCurrency(5000)}+</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sort and Results */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200/50 gap-4">
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <label htmlFor="sort-select" className="text-sm font-bold text-gray-700 flex items-center">
                    <span className="mr-2" aria-label="Sort">⚡</span>
                    Sort by:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    aria-label="Sort festivals by different criteria"
                    className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all bg-white/90 font-medium text-sm sm:text-base"
                  >
                    <option value="name">Name A-Z</option>
                    <option value="price">Price Low-High</option>
                    <option value="capacity">Audience Size</option>
                    <option value="country">Country</option>
                    <option value="duration">Duration</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
                
                <motion.div 
                  className="text-base sm:text-lg font-bold w-full sm:w-auto text-center"
                  key={filteredFestivals.length}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-purple-600">{filteredFestivals.length}</span>
                  <span className="text-gray-600 ml-1">
                    festival{filteredFestivals.length !== 1 ? 's' : ''} found
                  </span>
                  {filteredFestivals.length !== festivals.length && (
                    <span className="text-sm text-gray-500 ml-2">
                      of {festivals.length} total
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Strategic Newsletter Banner - Discovery Momentum CTA */}
      <motion.div 
        className="max-w-6xl mx-auto px-4 sm:px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-full mb-6">
              <span className="text-2xl">🔍</span>
              <span className="font-bold">Overwhelmed by Options?</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Let Us Be Your Festival Compass
            </h3>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Stop endless scrolling! Get <strong>personalized picks</strong> delivered weekly based on festivals 
              you're actually considering. Join smart festival-goers who never miss their perfect match.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold text-sm">Smart Curation</div>
                <div className="text-xs text-white/80">Only festivals that match your exact vibe & budget</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">⏰</div>
                <div className="font-semibold text-sm">Save 5+ Hours Weekly</div>
                <div className="text-xs text-white/80">No more endless research & FOMO</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">💸</div>
                <div className="font-semibold text-sm">Early Bird Alerts</div>
                <div className="text-xs text-white/80">Get notified before tickets sell out</div>
              </div>
            </div>
            
            <div className="max-w-md mx-auto">
              <EnhancedNewsletterForm />
              <p className="text-xs text-white/70 mt-3 text-center">
                ⚡ Join <strong>{SITE_STATS.TOTAL_USERS.toLocaleString()} festival explorers</strong> getting personalized picks weekly!
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Festivals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {filteredFestivals.length === 0 ? (
          <motion.div
            className="text-center py-32"
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
              Try adjusting your search criteria or explore different filters to discover amazing festivals.
            </p>
            <motion.button
              onClick={() => {
                handleSearchChange('');
                handleFilterChange('region', 'All');
                handleFilterChange('genre', 'All');
                handleFilterChange('month', 'All');
                setPriceRange([0, 5000]);
              }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset All Filters
            </motion.button>
          </motion.div>
        ) : (
          <div className={`
            ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8' : 
              viewMode === 'list' ? 'space-y-4 sm:space-y-6' : 'grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8'}
          `}>
            <AnimatePresence mode="popLayout">
              {filteredFestivals.map((festival, index) => (
                <Fragment key={festival.id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ 
                      delay: Math.min(index * 0.1, 0.8), 
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                      layout: { duration: 0.4 }
                    }}
                    className="group h-full"
                  >
                  <Card className={`
                    h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 
                    bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm group-hover:scale-[1.02] 
                    ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}
                  `}>
                    {/* Festival Image Placeholder */}
                    <div className={`
                      relative bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 
                      ${viewMode === 'list' ? 'w-full sm:w-48 h-32 sm:h-auto flex-shrink-0' : 'h-32 sm:h-48 w-full'}
                      overflow-hidden
                    `}>
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                      
                      {/* Festival type indicator */}
                      <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                        <Badge 
                          variant="premium" 
                          className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs sm:text-sm"
                        >
                          {festival.audience_size}
                        </Badge>
                      </div>

                      {/* Favorite button */}
                      <motion.button
                        onClick={() => toggleFavorite(festival.id)}
                        className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group/fav"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.span
                          className={`text-lg sm:text-xl ${favorites.includes(festival.id) ? 'text-red-400' : 'text-white'}`}
                          animate={{
                            scale: favorites.includes(festival.id) ? [1, 1.3, 1] : 1
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {favorites.includes(festival.id) ? '❤️' : '🤍'}
                        </motion.span>
                      </motion.button>

                      {/* Festival duration indicator */}
                      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                        <span className="text-white/90 text-xs sm:text-sm font-medium bg-black/30 px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm">
                          {festival.duration_days} day{festival.duration_days !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Sparkle effect on hover */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                              left: `${20 + i * 15}%`,
                              top: `${20 + (i % 2) * 40}%`,
                            }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              delay: i * 0.2,
                              repeat: Infinity,
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>

                    <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-6">
                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                          <div className="flex-1">
                            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-1 sm:mb-2 line-clamp-2">
                              {festival.name}
                            </CardTitle>
                            <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                              <span className="mr-1">📍</span>
                              {festival.city}, {festival.country}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
                          {festival.genres.slice(0, 3).map((genre, genreIndex) => (
                            <motion.div
                              key={genre}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + genreIndex * 0.05 }}
                            >
                              <Badge 
                                variant="default" 
                                size="sm" 
                                className="bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer text-xs"
                              >
                                {genre}
                              </Badge>
                            </motion.div>
                          ))}
                          {festival.genres.length > 3 && (
                            <Badge variant="default" size="sm" className="bg-gray-100 text-gray-600 text-xs">
                              +{festival.genres.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Vibe indicators */}
                        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                          {festival.vibe.slice(0, 3).map((vibe, idx) => (
                            <span 
                              key={vibe}
                              className="text-xs px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-lg font-medium"
                            >
                              {vibe}
                            </span>
                          ))}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0 p-3 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
                          <div>
                            <span className="text-gray-500 block">💰 Price Range (USD):</span>
                            <div className="font-semibold text-purple-600 text-xs sm:text-sm">
                              {formatCurrency(festival.estimated_cost_usd.min)} - {formatCurrency(festival.estimated_cost_usd.max)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 block">📅 Months:</span>
                            <div className="font-semibold text-gray-800 text-xs sm:text-sm">{festival.months.join(', ')}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6 text-xs flex-wrap">
                          {festival.family_friendly && (
                            <motion.span 
                              className="text-green-600 bg-green-50 px-2 py-1 rounded-lg font-medium"
                              whileHover={{ scale: 1.05 }}
                            >
                              👨‍👩‍👧‍👦 Family
                            </motion.span>
                          )}
                          {festival.camping && (
                            <motion.span 
                              className="text-blue-600 bg-blue-50 px-2 py-1 rounded-lg font-medium"
                              whileHover={{ scale: 1.05 }}
                            >
                              ⛺ Camping
                            </motion.span>
                          )}
                          {festival.glamping && (
                            <motion.span 
                              className="text-purple-600 bg-purple-50 px-2 py-1 rounded-lg font-medium"
                              whileHover={{ scale: 1.05 }}
                            >
                              ✨ Glamping
                            </motion.span>
                          )}
                          {festival.min_age && (
                            <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-lg font-medium">
                              🔞 {festival.min_age}+
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2 sm:gap-3">
                          <Link href={`/festival/${festival.id}`} className="flex-1">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button 
                                variant="primary" 
                                size="sm" 
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm py-2 sm:py-3"
                              >
                                🔍 Explore
                              </Button>
                            </motion.div>
                          </Link>
                          <motion.a
                            href={festival.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 text-xs sm:text-sm py-2 sm:py-3"
                            >
                              🌐 Website
                            </Button>
                          </motion.a>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                  </motion.div>
                </Fragment>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Premium CTA Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 py-12 sm:py-24 px-4 sm:px-6 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Advanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-float animation-delay-1000" />
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-6 sm:mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xl sm:text-2xl">🎯</span>
              <span className="text-white font-semibold text-base sm:text-lg">Personalized Recommendations</span>
            </motion.div>

            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 sm:mb-8 tracking-tight">
              Still <span className="text-yellow-300">Deciding?</span>
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Let our AI analyze your preferences and discover festivals that match your 
              <span className="text-yellow-300 font-semibold"> music taste</span>, 
              <span className="text-pink-300 font-semibold"> budget</span>, and 
              <span className="text-blue-300 font-semibold"> travel style</span> perfectly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4">
              <Link href="/quiz">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="bg-white text-purple-600 hover:bg-yellow-50 font-bold px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl sm:rounded-2xl w-full sm:w-auto"
                  >
                    <span className="mr-2 sm:mr-3 text-xl sm:text-2xl group-hover:animate-bounce">🎯</span>
                    Find My Perfect Festival
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="/what-festival-should-i-go-to">
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl transition-all duration-300 rounded-xl sm:rounded-2xl backdrop-blur-sm w-full sm:w-auto"
                  >
                    <span className="mr-2 sm:mr-3 text-xl sm:text-2xl group-hover:animate-bounce">📚</span>
                    Browse Expert Guide
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Premium Features List */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { icon: '🧠', title: 'AI-Powered Matching', desc: 'Smart algorithms learn your preferences' },
                { icon: '⚡', title: 'Instant Results', desc: 'Get personalized recommendations in seconds' },
                { icon: '🎪', title: 'Curated Quality', desc: 'Hand-picked festivals from around the world' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="text-center glass rounded-2xl p-6 border border-white/20"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/80 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
        </div>
      </SmartContentLoader>
    </>
  );
}
