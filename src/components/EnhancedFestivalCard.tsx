'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { useAnalytics } from '@/components/Analytics/EventTracking';

interface EnhancedFestivalCardProps {
  festival: {
    id: string;
    name: string;
    country: string;
    city: string;
    months: string[];
    genres: string[];
    estimated_cost_usd: { min: number; max: number };
    audience_size: string;
    duration_days: number;
    family_friendly: boolean;
    camping: boolean;
    glamping?: boolean;
    weather_profile: string[];
    vibe: string[];
    website: string;
    status: string;
    min_age?: number;
    ticket_official_url: string;
  };
  viewMode?: 'grid' | 'list' | 'compact';
  showSaveButton?: boolean;
  showComparison?: boolean;
  savedFestivals?: string[];
  onSave?: (festivalId: string) => void;
  index?: number;
}

export default function EnhancedFestivalCard({
  festival,
  viewMode = 'grid',
  showSaveButton = true,
  showComparison: _showComparison = false,
  savedFestivals = [],
  onSave,
  index = 0
}: EnhancedFestivalCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { festival: trackFestival } = useAnalytics();
  
  const isSaved = savedFestivals.includes(festival.id);
  
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave?.(festival.id);
    
    if (isSaved) {
      trackFestival.unsaveFestival(festival.id, festival.name);
    } else {
      trackFestival.saveFestival(festival.id, festival.name);
    }
  };

  const handleTicketClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    trackFestival.clickTickets(festival.id, festival.name, festival.ticket_official_url);
    window.open(festival.ticket_official_url, '_blank', 'noopener,noreferrer');
  };

  const handleCardClick = () => {
    trackFestival.viewFestival(festival.id, festival.name, 'browse');
  };

  const getAudienceIcon = (size: string) => {
    switch (size) {
      case 'massive': return { icon: '🏟️', label: '100k+' };
      case 'large': return { icon: '🎪', label: '50k+' };
      case 'medium': return { icon: '🎵', label: '20k+' };
      case 'small': return { icon: '🎼', label: '<10k' };
      default: return { icon: '🎪', label: 'Unknown' };
    }
  };

  const getWeatherIcon = (weather: string[]) => {
    if (weather.includes('hot')) return '☀️';
    if (weather.includes('warm')) return '🌤️';
    if (weather.includes('rainy')) return '🌧️';
    if (weather.includes('cold')) return '❄️';
    return '🌤️';
  };

  const audienceInfo = getAudienceIcon(festival.audience_size);
  const weatherIcon = getWeatherIcon(festival.weather_profile);

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 p-6"
      >
        <Link href={`/festival/${festival.id}`} onClick={handleCardClick}>
          <div className="flex items-start gap-6">
            {/* Festival Image */}
            <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {!imageError ? (
                  <Image
                    src={`/api/festival-image/${festival.id}`}
                    alt={`${festival.name} festival`}
                    fill
                    className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                  />
                ) : null}
                {!imageLoaded && (
                  <span className="text-white text-2xl">🎪</span>
                )}
              </div>
              
              {/* Status Badge */}
              {festival.status === 'sold-out' && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Sold Out
                </div>
              )}
            </div>

            {/* Festival Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
                    {festival.name}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <span>📍</span>
                    <span>{festival.city}, {festival.country}</span>
                    <span className="mx-2">•</span>
                    <span>📅 {festival.months.join(', ')}</span>
                  </p>
                </div>
                
                {showSaveButton && (
                  <motion.button
                    onClick={handleSave}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isSaved
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </motion.button>
                )}
              </div>

              {/* Genres & Features */}
              <div className="flex flex-wrap gap-2 mb-3">
                {festival.genres.slice(0, 3).map(genre => (
                  <Badge key={genre} className="bg-purple-100 text-purple-700 text-xs">
                    {genre}
                  </Badge>
                ))}
                {festival.camping && (
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    🏕️ Camping
                  </Badge>
                )}
                {festival.family_friendly && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs">
                    👨‍👩‍👧‍👦 Family
                  </Badge>
                )}
              </div>

              {/* Key Info */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <span>{audienceInfo.icon}</span>
                  <span>{audienceInfo.label} people</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>⏰</span>
                  <span>{festival.duration_days} day{festival.duration_days > 1 ? 's' : ''}</span>
                </span>
                <span className="flex items-center gap-1">
                  <span>{weatherIcon}</span>
                  <span>{festival.weather_profile[0]}</span>
                </span>
              </div>

              {/* Price & Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-purple-600">
                    ${festival.estimated_cost_usd.min} - ${festival.estimated_cost_usd.max}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">USD</span>
                </div>
                
                <button
                  onClick={handleTicketClick}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Get Tickets
                </button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-white/90 backdrop-blur-sm rounded-xl border border-purple-100 hover:border-purple-300 overflow-hidden hover:shadow-2xl transition-all duration-500"
      whileHover={{ y: -5 }}
    >
      <Link href={`/festival/${festival.id}`} onClick={handleCardClick}>
        {/* Festival Image */}
        <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
          {!imageError ? (
            <Image
              src={`/api/festival-image/${festival.id}`}
              alt={`${festival.name} festival`}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : null}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div className="space-y-2">
              <Badge className="bg-white/90 text-purple-700 text-xs">
                {festival.months.join(', ')}
              </Badge>
              {festival.status === 'sold-out' && (
                <Badge className="bg-red-500 text-white text-xs">
                  Sold Out
                </Badge>
              )}
            </div>
            
            {showSaveButton && (
              <motion.button
                onClick={handleSave}
                className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                  isSaved
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            )}
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-4 text-sm mb-2">
              <span className="flex items-center gap-1">
                📍 {festival.city}, {festival.country}
              </span>
              <span className="flex items-center gap-1">
                {audienceInfo.icon} {audienceInfo.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                ⏰ {festival.duration_days}d
              </span>
              <span className="flex items-center gap-1">
                {weatherIcon} {festival.weather_profile[0]}
              </span>
              {festival.min_age && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {festival.min_age}+
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Festival Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
            {festival.name}
          </h3>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-4">
            {festival.genres.slice(0, 3).map(genre => (
              <Badge key={genre} className="text-xs bg-purple-50 text-purple-700 border border-purple-200">
                {genre}
              </Badge>
            ))}
            {festival.genres.length > 3 && (
              <Badge className="text-xs bg-gray-50 text-gray-600">
                +{festival.genres.length - 3}
              </Badge>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {festival.camping && (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                🏕️ Camping
              </span>
            )}
            {festival.glamping && (
              <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                ⭐ Glamping
              </span>
            )}
            {festival.family_friendly && (
              <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                👨‍👩‍👧‍👦 Family
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-purple-600">
                ${festival.estimated_cost_usd.min}
              </span>
              <span className="text-lg text-gray-500">
                - ${festival.estimated_cost_usd.max}
              </span>
            </div>
            <span className="text-xs text-gray-500">Price range (USD)</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleTicketClick}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 text-sm transform hover:scale-105"
            >
              Tickets
            </button>
            <Link
              href={`/festival/${festival.id}`}
              className="px-4 py-2 border border-purple-300 text-purple-700 hover:bg-purple-50 rounded-lg font-medium transition-all duration-300 text-sm"
              onClick={handleCardClick}
            >
              Details
            </Link>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
