'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Festival, FestivalGridProps } from '@/types/festival';

export default function FestivalGrid({ festivals }: FestivalGridProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'duration'>('name');

  const sortedFestivals = useMemo(() => {
    return [...festivals].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.estimated_cost_usd.min - b.estimated_cost_usd.min;
        case 'duration':
          return b.duration_days - a.duration_days;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [festivals, sortBy]);

  const toggleFavorite = (festivalId: string) => {
    setFavorites(prev => 
      prev.includes(festivalId) 
        ? prev.filter(id => id !== festivalId)
        : [...prev, festivalId]
    );
  };

  const getAudienceIcon = (size: string) => {
    switch (size) {
      case 'massive': return '🏟️';
      case 'large': return '🎪';
      case 'medium': return '🎵';
      case 'small': return '🎼';
      default: return '🎪';
    }
  };

  return (
    <div>
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {festivals.length} Festival{festivals.length !== 1 ? 's' : ''} Found
        </h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'duration')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="duration">Sort by Duration</option>
        </select>
      </div>

      {/* Festival Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {sortedFestivals.map((festival, index) => (
            <motion.div
              key={festival.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="group h-full overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm border border-purple-100 hover:border-purple-300">
                {/* Festival Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* Festival Info Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="space-y-2">
                      <Badge className="bg-white/90 text-purple-700 text-xs">
                        {festival.months.join(', ')}
                      </Badge>
                      {festival.family_friendly && (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          Family Friendly
                        </Badge>
                      )}
                    </div>
                    
                    {/* Favorite Button */}
                    <motion.button
                      onClick={() => toggleFavorite(festival.id)}
                      className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                        favorites.includes(festival.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </motion.button>
                  </div>

                  {/* Location & Audience */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 text-sm">
                      <span>📍</span>
                      <span>{festival.city}, {festival.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span>{getAudienceIcon(festival.audience_size)}</span>
                      <span className="capitalize">{festival.audience_size} audience</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Festival Name & Duration */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {festival.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>⏰ {festival.duration_days} day{festival.duration_days > 1 ? 's' : ''}</span>
                      {festival.min_age && (
                        <span>🔞 {festival.min_age}+ only</span>
                      )}
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {festival.genres.slice(0, 3).map(genre => (
                        <Badge key={genre} className="text-xs bg-purple-50 text-purple-700 border border-purple-200">
                          {genre}
                        </Badge>
                      ))}
                      {festival.genres.length > 3 && (
                        <Badge className="text-xs bg-gray-50 text-gray-600">
                          +{festival.genres.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 text-sm">
                      {festival.camping && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full">
                          🏕️ Camping
                        </span>
                      )}
                      {festival.glamping && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full">
                          ⭐ Glamping
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Price Range</span>
                      <span className="font-bold text-lg text-purple-600">
                        ${festival.estimated_cost_usd.min} - ${festival.estimated_cost_usd.max}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/festival/${festival.id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-300 text-sm"
                    >
                      Explore
                    </Link>
                    <a
                      href={festival.ticket_official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 border border-purple-300 text-purple-700 hover:bg-purple-50 rounded-lg font-medium transition-all duration-300 text-sm"
                    >
                      Tickets
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {festivals.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎪</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No festivals found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
