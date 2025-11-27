'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OptimizedImg from './OptimizedImg';

// 📱 COMPREHENSIVE MOBILE OPTIMIZATION SUITE
// Ensures FestiWise delivers premium mobile experience across all devices

// 1. Mobile-First Responsive Hook
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    breakpoint,
    screenSize,
    // Utility functions
    showMobileLayout: breakpoint === 'mobile',
    showCompactLayout: breakpoint !== 'desktop',
    maxCardColumns: breakpoint === 'mobile' ? 1 : breakpoint === 'tablet' ? 2 : 3
  };
}

// 2. Enhanced Mobile-Optimized Components

// Mobile-First Hero Component
interface MobileOptimizedHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

export const MobileOptimizedHero: React.FC<MobileOptimizedHeroProps> = ({
  title,
  subtitle,
  backgroundImage
}) => {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
        style={backgroundImage ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto">
        <motion.h1 
          className={`font-black tracking-tight mb-6 text-white ${
            isMobile ? 'text-4xl' : isTablet ? 'text-6xl' : 'text-7xl'
          }`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>
        
        <motion.p 
          className={`text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto ${
            isMobile ? 'text-lg px-2' : isTablet ? 'text-xl px-4' : 'text-2xl'
          }`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
        
        {/* Mobile-optimized CTA buttons */}
        <motion.div 
          className={`flex gap-4 justify-center ${
            isMobile ? 'flex-col px-6' : 'flex-row'
          }`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button className={`bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 ${
            isMobile ? 'px-8 py-4 text-lg w-full' : 'px-10 py-4 text-xl'
          }`}>
            Take the Quiz
          </button>
          
          <button className={`border-2 border-white text-white font-bold rounded-2xl transition-all duration-300 hover:bg-white hover:text-purple-600 ${
            isMobile ? 'px-8 py-4 text-lg w-full' : 'px-10 py-4 text-xl'
          }`}>
            Browse Festivals
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// Mobile-Optimized Festival Grid
interface MobileFestivalGridProps {
  festivals: any[];
  loading?: boolean;
}

export const MobileFestivalGrid: React.FC<MobileFestivalGridProps> = ({
  festivals,
  loading = false
}) => {
  const { isMobile, maxCardColumns } = useResponsive();

  if (loading) {
    return (
      <div className={`grid gap-4 px-4 ${
        isMobile ? 'grid-cols-1' : `grid-cols-${maxCardColumns}`
      }`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 px-4 sm:px-6 lg:px-8 ${
      isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }`}>
      {festivals.map((festival, index) => (
        <MobileOptimizedFestivalCard 
          key={festival.id} 
          festival={festival} 
          index={index}
        />
      ))}
    </div>
  );
};

// Mobile-First Festival Card
interface MobileCardProps {
  festival: any;
  index: number;
}

export const MobileOptimizedFestivalCard: React.FC<MobileCardProps> = ({
  festival,
  index
}) => {
  const { isMobile } = useResponsive();
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <OptimizedImg
          src={festival.image || '/api/placeholder/400/300'}
          alt={festival.name}
          className="w-full h-full object-cover"
        />
        
        {/* Mobile-optimized overlay buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button 
            onClick={() => setSaved(!saved)}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white"
          >
            {saved ? '❤️' : '🤍'}
          </button>
        </div>
        
        {/* Match score - mobile optimized */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {festival.matchScore || 85}% match
          </div>
        </div>
      </div>
      
      {/* Content Section - Mobile Optimized */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0"> {/* min-w-0 prevents text overflow */}
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {festival.name}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {festival.city}, {festival.country}
            </p>
          </div>
          <div className="text-right ml-2 flex-shrink-0">
            <div className="text-sm text-gray-500">{festival.dates}</div>
            <div className="text-lg font-bold text-purple-600">
              ${festival.estimated_cost_usd?.min || 0}+
            </div>
          </div>
        </div>

        {/* Genre Tags - Mobile Responsive */}
        <div className="flex flex-wrap gap-1 mb-3">
          {festival.genres?.slice(0, isMobile ? 2 : 3).map((genre: string) => (
            <span
              key={genre}
              className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
            >
              {genre}
            </span>
          ))}
          {festival.genres?.length > (isMobile ? 2 : 3) && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{festival.genres.length - (isMobile ? 2 : 3)}
            </span>
          )}
        </div>

        {/* Mobile-optimized action buttons */}
        <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
          <button className={`bg-purple-600 text-white font-medium rounded-lg transition-colors hover:bg-purple-700 ${
            isMobile ? 'py-3 text-base w-full' : 'px-4 py-2 text-sm flex-1'
          }`}>
            View Details
          </button>
          
          <button className={`border border-purple-600 text-purple-600 font-medium rounded-lg transition-colors hover:bg-purple-50 ${
            isMobile ? 'py-3 text-base w-full' : 'px-4 py-2 text-sm flex-1'
          }`}>
            Save for Later
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Touch-Optimized Search Component
interface MobileSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const MobileOptimizedSearch: React.FC<MobileSearchProps> = ({
  onSearch,
  placeholder = "Search festivals..."
}) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const { isMobile } = useResponsive();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className={`relative w-full max-w-2xl mx-auto ${
        isMobile ? 'px-2' : ''
      }`}>
        <div className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
          isActive ? 'border-purple-500 shadow-xl' : 'border-gray-200'
        }`}>
          <div className="flex items-center p-4">
            <div className="text-gray-400 mr-3">
              🔍
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsActive(true)}
              onBlur={() => setIsActive(false)}
              onKeyPress={(e) => e.key === 'Enter' && onSearch(query)}
              placeholder={placeholder}
              className={`flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 ${
                isMobile ? 'text-lg' : 'text-base'
              }`}
              style={{ fontSize: isMobile ? '16px' : '14px' }} // Prevents zoom on iOS
            />

            {/* Voice Search Button - Touch Optimized */}
            <button className={`text-gray-400 hover:text-purple-600 transition-colors ${
              isMobile ? 'p-3 -m-3' : 'p-2 -m-2'
            }`}>
              🎤
            </button>

            {/* Search Button */}
            <button
              onClick={() => onSearch(query)}
              className={`ml-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
                isMobile ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm'
              }`}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile-Optimized Navigation Hook
export function useMobileNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useResponsive();

  useEffect(() => {
    // Close menu when switching to desktop
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return {
    isMenuOpen,
    setIsMenuOpen,
    toggleMenu: () => setIsMenuOpen(!isMenuOpen),
    closeMenu: () => setIsMenuOpen(false)
  };
}

// Touch-Optimized Button Component
interface TouchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

export const TouchOptimizedButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false
}) => {
  const { isMobile } = useResponsive();
  
  const baseClasses = `font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
  }`;
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
    secondary: 'bg-gray-600 text-white',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
  };
  
  // Touch-friendly sizing
  const sizeClasses = {
    sm: isMobile ? 'px-4 py-3 text-sm min-h-[44px]' : 'px-3 py-2 text-sm',
    md: isMobile ? 'px-6 py-4 text-base min-h-[48px]' : 'px-4 py-3 text-base',
    lg: isMobile ? 'px-8 py-5 text-lg min-h-[52px]' : 'px-6 py-4 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// Mobile Performance Optimization Hook
export function useMobileOptimization() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const { isMobile } = useResponsive();

  useEffect(() => {
    // Check connection speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setIsSlowConnection(connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g');
    }
  }, []);

  return {
    // Reduce animations on slow connections or low-end mobile devices
    shouldReduceMotion: isSlowConnection || (isMobile && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    
    // Optimize image loading
    getOptimizedImageUrl: (url: string, width: number) => {
      if (isMobile) {
        return `${url}?w=${Math.min(width, 600)}&q=${isSlowConnection ? 60 : 80}`;
      }
      return `${url}?w=${width}&q=85`;
    },
    
    // Lazy loading threshold
    lazyLoadThreshold: isMobile ? '50px' : '100px',
    
    // Debounce search input for mobile
    searchDebounce: isMobile ? 500 : 300
  };
}

export default {
  useResponsive,
  MobileOptimizedHero,
  MobileFestivalGrid,
  MobileOptimizedFestivalCard,
  MobileOptimizedSearch,
  useMobileNavigation,
  TouchOptimizedButton,
  useMobileOptimization
};
