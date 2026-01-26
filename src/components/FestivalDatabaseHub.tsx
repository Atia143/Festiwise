'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, MapPin, Calendar, Users, DollarSign } from 'lucide-react';

interface Festival {
  id: string;
  name: string;
  image: string;
  location: string;
  country: string;
  dates: string;
  genres: string[];
  budget: '$' | '$$' | '$$$';
  vibe: string;
  attendees: number;
  rating: number;
  reviews: number;
  safetyRating: number;
  familyFriendly: boolean;
  accessible: boolean;
  campingAvailable: boolean;
  website: string;
}

const FESTIVALS: Festival[] = [
  {
    id: 'tomorrowland',
    name: 'Tomorrowland',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Boom',
    country: 'Belgium',
    dates: 'July 19–21, 2025',
    genres: ['EDM', 'House', 'Techno', 'Trance'],
    budget: '$$$',
    vibe: 'High-energy, world-class production',
    attendees: 180000,
    rating: 4.8,
    reviews: 2847,
    safetyRating: 9.2,
    familyFriendly: false,
    accessible: true,
    campingAvailable: true,
    website: 'tomorrowland.com',
  },
  {
    id: 'glastonbury',
    name: 'Glastonbury Festival',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Somerset',
    country: 'United Kingdom',
    dates: 'June 25–29, 2025',
    genres: ['Rock', 'Pop', 'Alternative', 'Indie'],
    budget: '$$',
    vibe: 'Legendary, eclectic, cultural',
    attendees: 135000,
    rating: 4.9,
    reviews: 4231,
    safetyRating: 9.0,
    familyFriendly: true,
    accessible: true,
    campingAvailable: true,
    website: 'glastonburyfestivals.co.uk',
  },
  {
    id: 'coachella',
    name: 'Coachella',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'California',
    country: 'United States',
    dates: 'April 11–13, April 18–20, 2025',
    genres: ['Pop', 'Indie', 'Hip-Hop', 'Electronic'],
    budget: '$$$',
    vibe: 'Celebrity, trendsetter, fashion',
    attendees: 125000,
    rating: 4.7,
    reviews: 3456,
    safetyRating: 8.8,
    familyFriendly: false,
    accessible: true,
    campingAvailable: false,
    website: 'coachella.com',
  },
  {
    id: 'burning-man',
    name: 'Burning Man',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Black Rock Desert',
    country: 'United States',
    dates: 'August 25 – September 1, 2025',
    genres: ['Electronic', 'Performance Art', 'Experimental'],
    budget: '$$',
    vibe: 'Experimental, art-focused, radical',
    attendees: 70000,
    rating: 4.7,
    reviews: 1956,
    safetyRating: 8.5,
    familyFriendly: false,
    accessible: false,
    campingAvailable: true,
    website: 'burningman.org',
  },
  {
    id: 'primavera',
    name: 'Primavera Sound',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Barcelona',
    country: 'Spain',
    dates: 'May 29 – June 8, 2025',
    genres: ['Indie', 'Alternative', 'Electronic', 'Rock'],
    budget: '$$',
    vibe: 'Urban, artistic, indie-focused',
    attendees: 120000,
    rating: 4.8,
    reviews: 2234,
    safetyRating: 9.1,
    familyFriendly: true,
    accessible: true,
    campingAvailable: false,
    website: 'primaverasound.com',
  },
  {
    id: 'reading-leeds',
    name: 'Reading & Leeds',
    image: 'https://images.unsplash.com/photo-1478359866814-4c6cffe4d8b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    location: 'Reading/Leeds',
    country: 'United Kingdom',
    dates: 'August 22–24, 2025',
    genres: ['Rock', 'Alternative', 'Punk', 'Indie'],
    budget: '$$',
    vibe: 'Rock-focused, young crowd, vibrant',
    attendees: 100000,
    rating: 4.6,
    reviews: 1823,
    safetyRating: 8.7,
    familyFriendly: false,
    accessible: true,
    campingAvailable: true,
    website: 'readingandleedsfestival.com',
  },
];

type GenreFilter = 'all' | 'EDM' | 'Rock' | 'Indie' | 'Pop' | 'Hip-Hop' | 'Electronic';
type BudgetFilter = 'all' | '$' | '$$' | '$$$';

export default function FestivalDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('all');
  const [selectedBudget, setSelectedBudget] = useState<BudgetFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [savedFestivals, setSavedFestivals] = useState<string[]>([]);

  const filteredFestivals = useMemo(() => {
    return FESTIVALS.filter((festival) => {
      const matchesSearch = festival.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           festival.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           festival.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'all' || festival.genres.includes(selectedGenre);
      const matchesBudget = selectedBudget === 'all' || festival.budget === selectedBudget;
      return matchesSearch && matchesGenre && matchesBudget;
    });
  }, [searchQuery, selectedGenre, selectedBudget]);

  const toggleSave = (festivalId: string) => {
    setSavedFestivals((prev) =>
      prev.includes(festivalId)
        ? prev.filter((id) => id !== festivalId)
        : [...prev, festivalId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mb-4">
            Festival Database
          </h1>
        </div>
      </div>

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-4"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search festivals, countries, cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-800/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
              >
                <Filter size={18} />
                Filters
              </button>
              {selectedGenre !== 'all' && (
                <div className="px-4 py-2 bg-purple-500 rounded-lg text-sm font-semibold">
                  {selectedGenre} ✕
                </div>
              )}
              {selectedBudget !== 'all' && (
                <div className="px-4 py-2 bg-pink-500 rounded-lg text-sm font-semibold">
                  Budget: {selectedBudget} ✕
                </div>
              )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 border border-white/10 rounded-xl p-6 space-y-6"
              >
                <div>
                  <h4 className="font-bold mb-3">Genre</h4>
                  <div className="flex flex-wrap gap-3">
                    {(['all', 'EDM', 'Rock', 'Indie', 'Pop', 'Hip-Hop', 'Electronic'] as const).map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre as GenreFilter)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          selectedGenre === genre
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        }`}
                      >
                        {genre === 'all' ? 'All Genres' : genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Budget</h4>
                  <div className="flex flex-wrap gap-3">
                    {(['all', '$', '$$', '$$$'] as const).map((budget) => (
                      <button
                        key={budget}
                        onClick={() => setSelectedBudget(budget as BudgetFilter)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          selectedBudget === budget
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        }`}
                      >
                        {budget === 'all' ? 'All Budgets' : budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-3">Features</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Family Friendly', icon: '👨‍👩‍👧‍👦' },
                      { label: 'Accessible', icon: '♿' },
                      { label: 'Camping Available', icon: '⛺' },
                    ].map((feature, idx) => (
                      <label key={idx} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span>{feature.icon} {feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-400">
              Showing {filteredFestivals.length} of {FESTIVALS.length} festivals
              {selectedGenre !== 'all' && ` • Genre: ${selectedGenre}`}
              {selectedBudget !== 'all' && ` • Budget: ${selectedBudget}`}
            </p>
          </div>

          {/* Festivals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFestivals.map((festival, idx) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={festival.image}
                    alt={festival.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />

                  {/* Save Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSave(festival.id)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/75 rounded-full transition-all"
                  >
                    <Heart
                      size={20}
                      fill={savedFestivals.includes(festival.id) ? 'currentColor' : 'none'}
                      className={savedFestivals.includes(festival.id) ? 'text-red-500' : 'text-white'}
                    />
                  </motion.button>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg px-3 py-1 flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-bold">{festival.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{festival.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 flex items-center gap-1">
                    <MapPin size={14} />
                    {festival.location}, {festival.country}
                  </p>

                  {/* Quick Info */}
                  <div className="space-y-2 mb-4 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-yellow-400" />
                      {festival.dates}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-pink-400" />
                      {(festival.attendees / 1000).toFixed(0)}K attendees
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-green-400" />
                      {festival.budget}
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {festival.genres.slice(0, 2).map((genre, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-purple-500/30 rounded-full text-purple-200">
                        {genre}
                      </span>
                    ))}
                    {festival.genres.length > 2 && (
                      <span className="text-xs px-3 py-1 bg-gray-600/30 rounded-full text-gray-300">
                        +{festival.genres.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex gap-2 mb-6">
                    {festival.familyFriendly && <span className="text-lg">👨‍👩‍👧‍👦</span>}
                    {festival.accessible && <span className="text-lg">♿</span>}
                    {festival.campingAvailable && <span className="text-lg">⛺</span>}
                  </div>

                  {/* CTA */}
                  <a
                    href={festival.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-gradient-to-r from-yellow-400 to-pink-400 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-pink-500 transition-all text-center"
                  >
                    Learn More →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredFestivals.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-2xl font-bold mb-2">No festivals found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
