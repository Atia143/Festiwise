'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

// Advanced UI Components for World-Class Experience

// 1. Premium Loading States
interface AdvancedLoadingProps {
  type: 'festival-search' | 'match-analysis' | 'data-sync' | 'image-load';
  progress?: number;
  stage?: string;
  estimatedTime?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userContext?: any;
}

export const PremiumLoadingExperience: React.FC<AdvancedLoadingProps> = ({
  type,
  progress = 0,
  stage = '',
  estimatedTime = 0,
  userContext
}) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  const loadingTips = {
    'festival-search': [
      'Finding festivals that match your vibe...',
      'Analyzing 600+ festivals worldwide...',
      'Calculating travel logistics...',
      'Checking weather patterns...',
      'Optimizing your perfect matches...'
    ],
    'match-analysis': [
      'Processing your music preferences...',
      'Analyzing festival personalities...',
      'Calculating compatibility scores...',
      'Finding hidden gems...',
      'Preparing personalized insights...'
    ],
    'data-sync': [
      'Syncing latest festival data...',
      'Updating venue information...',
      'Refreshing pricing details...',
      'Loading new festivals...',
      'Optimizing database...'
    ],
    'image-load': [
      'Loading festival images...',
      'Optimizing visual content...',
      'Preparing gallery...',
      'Enhancing image quality...',
      'Finalizing media...'
    ]
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % (loadingTips[type]?.length || 5));
      setTimeElapsed(prev => prev + 1);
    }, 2000);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center space-y-6 sm:space-y-8 max-w-md mx-auto p-6 sm:p-8 w-full">
        {/* Animated Festival Icon */}
        <motion.div 
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto relative"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute inset-2 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full opacity-40"></div>
          <div className="absolute inset-4 bg-gradient-to-r from-pink-300 to-violet-300 rounded-full opacity-60"></div>
          <div className="absolute inset-6 bg-gradient-to-r from-pink-200 to-violet-200 rounded-full"></div>
        </motion.div>

        {/* Progress Bar */}
        <div className="space-y-3 sm:space-y-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-pink-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-white/70">
            <span>{progress}% complete</span>
            {estimatedTime > 0 && (
              <span>{Math.max(0, estimatedTime - timeElapsed)}s remaining</span>
            )}
          </div>
        </div>

        {/* Dynamic Tips */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-white text-base sm:text-lg font-medium px-2"
          >
            {loadingTips[type]?.[currentTip] || 'Processing...'}
          </motion.div>
        </AnimatePresence>

        {/* Stage Indicator */}
        {stage && (
          <motion.div 
            className="text-white/60 text-sm px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Current stage: {stage}
          </motion.div>
        )}

        {/* Contextual Information */}
        {userContext && (
          <motion.div 
            className="bg-white/10 rounded-lg p-3 sm:p-4 text-white/80 text-xs sm:text-sm mx-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            {userContext.genres && (
              <p className="mb-1">Focusing on: {userContext.genres.slice(0, 3).join(', ')}</p>
            )}
            {userContext.budget && (
              <p>Budget range: ${userContext.budget.min} - ${userContext.budget.max}</p>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// 2. Advanced Festival Card with Micro-Interactions
interface PremiumFestivalCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  festival: any;
  matchScore?: number;
  onSave?: () => void;
  onShare?: () => void;
  onViewDetails?: () => void;
  saved?: boolean;
}

export const PremiumFestivalCard: React.FC<PremiumFestivalCardProps> = ({
  festival,
  matchScore = 85,
  onSave,
  onShare,
  onViewDetails,
  saved = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / 10);
    mouseY.set((e.clientY - centerY) / 10);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer group w-full"
      style={{
        rotateX: mouseY,
        rotateY: mouseX,
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onViewDetails}
    >
      {/* Match Score Badge */}
      <motion.div 
        className="absolute top-3 right-3 z-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
          {matchScore}% match
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button
        className="absolute top-3 left-3 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full touch-manipulation"
        style={{ minWidth: '44px', minHeight: '44px' }} // Touch target
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onSave?.();
        }}
      >
        <motion.div
          animate={{ 
            scale: saved ? [1, 1.2, 1] : 1,
            rotate: saved ? [0, 15, -15, 0] : 0
          }}
          transition={{ duration: 0.5 }}
          className="text-lg"
        >
          {saved ? '❤️' : '🤍'}
        </motion.div>
      </motion.button>

      {/* Festival Image */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <motion.img
          src={festival.image || '/api/placeholder/400/300'}
          alt={festival.name}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ 
            scale: imageLoaded ? (isHovered ? 1.1 : 1) : 1.1, 
            opacity: imageLoaded ? 1 : 0 
          }}
          transition={{ duration: 0.6 }}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Quick Action Buttons - Hidden on mobile, shown on hover for desktop */}
        <AnimatePresence>
          {isHovered && window.innerWidth >= 768 && (
            <motion.div 
              className="absolute bottom-4 left-4 flex space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <motion.button
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white touch-manipulation"
                style={{ minWidth: '44px', minHeight: '44px' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.();
                }}
              >
                📤
              </motion.button>
              <motion.button
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white touch-manipulation"
                style={{ minWidth: '44px', minHeight: '44px' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                📍
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Festival Information */}
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">{festival.name}</h3>
            <p className="text-gray-600 text-sm truncate">
              {festival.city}, {festival.country}
            </p>
          </div>
          <div className="text-right ml-3 flex-shrink-0">
            <div className="text-xs sm:text-sm text-gray-500">{festival.dates}</div>
            <div className="text-base sm:text-lg font-bold text-purple-600">
              ${festival.estimated_cost_usd?.min || 0}+
            </div>
          </div>
        </div>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {festival.genres?.slice(0, window.innerWidth < 640 ? 2 : 3).map((genre: string, index: number) => (
            <motion.span
              key={genre}
              className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              {genre}
            </motion.span>
          ))}
          {festival.genres?.length > (window.innerWidth < 640 ? 2 : 3) && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{festival.genres.length - (window.innerWidth < 640 ? 2 : 3)}
            </span>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center mb-4">
          <div>
            <div className="text-xs text-gray-500">Vibe</div>
            <div className="text-xs sm:text-sm font-medium truncate">{festival.vibe || 'Festival'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Size</div>
            <div className="text-xs sm:text-sm font-medium">{festival.size || 'Medium'}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Days</div>
            <div className="text-xs sm:text-sm font-medium">{festival.duration || '3'}</div>
          </div>
        </div>

        {/* Match Reasoning (Premium Feature) - Desktop only or touch to reveal */}
        <AnimatePresence>
          {(isHovered || window.innerWidth < 768) && matchScore && (
            <motion.div 
              className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-xs sm:text-sm text-green-800">
                <strong>Why this matches:</strong> Perfect genre alignment, within budget, great weather timing
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// 3. Advanced Search Interface
interface SmartSearchProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSearch: (query: string, filters: any) => void;
  suggestions?: string[];
  recentSearches?: string[];
}

export const SmartSearchInterface: React.FC<SmartSearchProps> = ({
  onSearch,
  suggestions = [],
  recentSearches = []
}) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, {});
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 sm:px-0">
      {/* Search Input */}
      <motion.div 
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
          isActive 
            ? 'bg-white shadow-2xl ring-2 ring-purple-500' 
            : 'bg-white/90 shadow-lg'
        }`}
        animate={{ 
          scale: isActive ? 1.02 : 1,
        }}
      >
        <div className="flex items-center p-3 sm:p-4">
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg sm:text-xl"
          >
            🔍
          </motion.div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsActive(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsActive(false);
                setShowSuggestions(false);
              }, 200);
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search festivals, genres, locations..."
            className="flex-1 mx-3 sm:mx-4 text-base sm:text-lg bg-transparent border-none outline-none placeholder-gray-400"
            style={{ fontSize: window.innerWidth < 640 ? '16px' : '18px' }} // Prevents zoom on iOS
          />

          {/* Voice Search */}
          <motion.button
            className="p-2 hover:bg-gray-100 rounded-full touch-manipulation"
            style={{ minWidth: '44px', minHeight: '44px' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🎤
          </motion.button>

          {/* Search Button */}
          <motion.button
            onClick={handleSearch}
            className="ml-2 px-4 sm:px-6 py-2 sm:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium text-sm sm:text-base touch-manipulation"
            style={{ minHeight: '44px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </div>

        {/* Advanced Filters Toggle */}
        <AnimatePresence>
          {isActive && (
            <motion.div 
              className="border-t border-gray-100 p-3 sm:p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-wrap gap-2">
                {['Electronic', 'Rock', 'Hip-Hop', 'Europe', 'Under $500', 'Summer'].map((filter) => (
                  <motion.button
                    key={filter}
                    className="px-3 py-2 bg-gray-100 hover:bg-purple-100 rounded-full text-xs sm:text-sm transition-colors touch-manipulation"
                    style={{ minHeight: '36px' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
          <motion.div 
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-50 mx-4 sm:mx-0"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-3 sm:p-4 border-b">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Searches</h4>
                {recentSearches.slice(0, 3).map((search, index) => (
                  <motion.button
                    key={search}
                    className="block w-full text-left p-2 sm:p-3 hover:bg-gray-50 rounded-lg text-sm touch-manipulation"
                    style={{ minHeight: '44px' }}
                    onClick={() => {
                      setQuery(search);
                      handleSearch();
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    🕒 {search}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3 sm:p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Suggestions</h4>
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    className="block w-full text-left p-2 sm:p-3 hover:bg-gray-50 rounded-lg text-sm touch-manipulation"
                    style={{ minHeight: '44px' }}
                    onClick={() => {
                      setQuery(suggestion);
                      handleSearch();
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    🔍 {suggestion}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 4. Interactive Results Grid
interface ResultsGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  festivals: any[];
  loading?: boolean;
  viewMode?: 'grid' | 'list' | 'map';
  sortBy?: string;
  onSort?: (sort: string) => void;
  onViewModeChange?: (mode: 'grid' | 'list' | 'map') => void;
}

export const InteractiveResultsGrid: React.FC<ResultsGridProps> = ({
  festivals,
  loading = false,
  viewMode = 'grid',
  sortBy = 'relevance',
  onSort,
  onViewModeChange
}) => {

  if (loading) {
    return (
      <div className={`grid gap-4 sm:gap-6 px-4 sm:px-0 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-gray-200 rounded-2xl h-64 sm:h-80 animate-pulse"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {festivals.length} Festivals Found
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Sorted by {sortBy} • {viewMode} view
          </p>
        </div>

        {/* View Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Sort Dropdown */}
          <select 
            value={sortBy}
            onChange={(e) => onSort?.(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
            style={{ minHeight: '44px' }}
          >
            <option value="relevance">Relevance</option>
            <option value="price">Price</option>
            <option value="date">Date</option>
            <option value="popularity">Popularity</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['grid', 'list', 'map'].map((mode) => (
              <motion.button
                key={mode}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => onViewModeChange?.(mode as any)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors touch-manipulation ${
                  viewMode === mode 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{ minWidth: '44px', minHeight: '36px' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mode === 'grid' ? '⊞' : mode === 'list' ? '☰' : '🗺️'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <motion.div 
        className={`grid gap-4 sm:gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}
        layout
      >
        <AnimatePresence>
          {festivals.map((festival, index) => (
            <motion.div
              key={festival.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                delay: index * 0.05,
                layout: { duration: 0.3 }
              }}
            >
              <PremiumFestivalCard 
                festival={festival}
                matchScore={festival.matchScore}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More */}
      {festivals.length > 0 && (
        <motion.div 
          className="text-center pt-6 sm:pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="px-6 sm:px-8 py-3 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium text-sm sm:text-base touch-manipulation w-full sm:w-auto"
            style={{ minHeight: '48px' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Festivals
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default {
  PremiumLoadingExperience,
  PremiumFestivalCard,
  SmartSearchInterface,
  InteractiveResultsGrid
};
