'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Share2, Heart, Bookmark, ExternalLink, Users, MapPin, DollarSign, Calendar } from 'lucide-react';

interface Festival {
  id: string;
  name: string;
  matchScore: number;
  matchReasons: string[];
  image: string;
  location: string;
  country: string;
  dates: string;
  genres: string[];
  budget: string;
  vibe: string;
  attendees: number;
  website: string;
  ticketUrl: string;
  description: string;
  highlights: string[];
  safetyRating: number;
  reviews: number;
  reviewScore: number;
}

const SAMPLE_RESULTS: Festival[] = [
  {
    id: 'tomorrowland',
    name: 'Tomorrowland',
    matchScore: 96,
    matchReasons: ['Electronic dance music passion', 'International travel adventurer', 'Mid-high budget'],
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    location: 'Boom',
    country: 'Belgium',
    dates: 'July 19–21, 2025',
    genres: ['EDM', 'House', 'Techno', 'Trance'],
    budget: '$$$',
    vibe: 'High-energy, world-class production, 180,000+ attendees',
    attendees: 180000,
    website: 'tomorrowland.com',
    ticketUrl: 'https://www.tomorrowland.com',
    description: 'The world\'s most iconic EDM festival with top-tier production, multiple stages, and artists from around the globe.',
    highlights: ['World-famous mainstage', 'Intimate garden stages', 'Art installations', 'Camping village'],
    safetyRating: 9.2,
    reviews: 2847,
    reviewScore: 4.8,
  },
  {
    id: 'glastonbury',
    name: 'Glastonbury Festival',
    matchScore: 88,
    matchReasons: ['Genre diversity appeal', 'Cultural experience seeker', 'Medium budget works'],
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    location: 'Somerset',
    country: 'United Kingdom',
    dates: 'June 25–29, 2025',
    genres: ['Rock', 'Pop', 'Alternative', 'Indie', 'Electronic'],
    budget: '$$',
    vibe: 'Legendary, eclectic, cultural experience',
    attendees: 135000,
    website: 'glastonburyfestivals.co.uk',
    ticketUrl: 'https://www.glastonburyfestivals.co.uk',
    description: 'The world\'s longest-running festival with legendary status, diverse lineups across 100+ stages, and strong environmental mission.',
    highlights: ['5+ main stages', '100+ performance areas', 'Strong environmental focus', 'Iconic Pyramid Stage'],
    safetyRating: 9.0,
    reviews: 4231,
    reviewScore: 4.9,
  },
  {
    id: 'burning-man',
    name: 'Burning Man',
    matchScore: 81,
    matchReasons: ['Adventure & uniqueness', 'Creative experience', 'Budget-conscious option'],
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    location: 'Black Rock Desert',
    country: 'United States',
    dates: 'August 25 – September 1, 2025',
    genres: ['Electronic', 'Performance Art', 'Experimental'],
    budget: '$$',
    vibe: 'Experimental, art-focused, radical self-expression',
    attendees: 70000,
    website: 'burningman.org',
    ticketUrl: 'https://www.burningman.org',
    description: 'Transformational festival in the desert focused on art, self-expression, and community. More experience than concert.',
    highlights: ['The Burn (Thursday)', 'Art installations', 'No sponsors', 'Leave No Trace ethos'],
    safetyRating: 8.5,
    reviews: 1956,
    reviewScore: 4.7,
  },
];

export default function WorldClassResultsPage() {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(SAMPLE_RESULTS[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedFestivals, setSavedFestivals] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(false);

  const toggleSave = (festivalId: string) => {
    setSavedFestivals((prev) =>
      prev.includes(festivalId)
        ? prev.filter((id) => id !== festivalId)
        : [...prev, festivalId]
    );
  };

  const shareResult = async () => {
    if (selectedFestival) {
      const text = `🎪 My FestiWise Match: ${selectedFestival.name} (${selectedFestival.matchScore}% match!)\n\nFind your perfect festival: https://festiwise.com`;
      if (navigator.share) {
        await navigator.share({ title: 'FestiWise Match', text });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              FestiWise
            </h1>
          </Link>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Share2 size={18} />
            Share Results
          </button>
        </div>
      </div>

      <div className="pt-20 pb-8">
        {/* Hero Section - Your Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto px-4 mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
              Your Perfect Festival Matches
            </h2>
            <p className="text-xl text-gray-300">
              Based on your taste, budget, and vibe
            </p>
          </div>

          {/* Main Carousel */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {selectedFestival && (
                <motion.div
                  key={selectedFestival.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                  {/* Festival Image */}
                  <div className="relative h-96 overflow-hidden">
                    <motion.img
                      src={selectedFestival.image}
                      alt={selectedFestival.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                    {/* Match Score Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-6 right-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full px-6 py-3 text-center shadow-2xl"
                    >
                      <div className="text-3xl font-black text-white">
                        {selectedFestival.matchScore}%
                      </div>
                      <div className="text-xs font-bold text-white/90">Match</div>
                    </motion.div>

                    {/* Festival Title Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-4xl font-black text-white mb-2">
                        {selectedFestival.name}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-200">
                        <MapPin size={18} />
                        <span>{selectedFestival.location}, {selectedFestival.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="p-8 border-b border-white/10">
                    <h4 className="text-sm font-bold text-gray-400 mb-4">WHY YOU MATCH</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedFestival.matchReasons.map((reason, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 rounded-full text-sm font-semibold"
                        >
                          ✓ {reason}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="p-8 border-b border-white/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <Calendar size={24} className="mx-auto mb-2 text-yellow-400" />
                        <div className="text-sm text-gray-400">Dates</div>
                        <div className="font-bold text-white text-sm">{selectedFestival.dates}</div>
                      </div>
                      <div className="text-center">
                        <Users size={24} className="mx-auto mb-2 text-pink-400" />
                        <div className="text-sm text-gray-400">Size</div>
                        <div className="font-bold text-white text-sm">{selectedFestival.attendees.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <DollarSign size={24} className="mx-auto mb-2 text-green-400" />
                        <div className="text-sm text-gray-400">Budget</div>
                        <div className="font-bold text-white text-sm">{selectedFestival.budget}</div>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl mb-2 block">⭐</span>
                        <div className="text-sm text-gray-400">Rating</div>
                        <div className="font-bold text-white text-sm">{selectedFestival.reviewScore}/5 ({selectedFestival.reviews.toLocaleString()})</div>
                      </div>
                    </div>
                  </div>

                  {/* Description & Highlights */}
                  <div className="p-8 border-b border-white/10">
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {selectedFestival.description}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedFestival.highlights.map((highlight, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-center gap-2 text-sm text-gray-200"
                        >
                          <span className="text-lg">🎪</span> {highlight}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-8 flex gap-4 flex-wrap">
                    <a
                      href={selectedFestival.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all flex items-center justify-center gap-2 group"
                    >
                      <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                      Buy Tickets
                    </a>
                    <button
                      onClick={() => toggleSave(selectedFestival.id)}
                      className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                        savedFestivals.includes(selectedFestival.id)
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      }`}
                    >
                      <Heart size={18} fill={savedFestivals.includes(selectedFestival.id) ? 'currentColor' : 'none'} />
                      {savedFestivals.includes(selectedFestival.id) ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={shareResult}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-bold transition-all flex items-center gap-2"
                    >
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Carousel Navigation */}
        <div className="max-w-5xl mx-auto px-4 mb-12">
          <div className="flex justify-center gap-3 flex-wrap">
            {SAMPLE_RESULTS.map((festival, idx) => (
              <motion.button
                key={festival.id}
                onClick={() => {
                  setSelectedFestival(festival);
                  setCurrentIndex(idx);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full font-bold transition-all ${
                  currentIndex === idx
                    ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-black'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
              >
                <div>{festival.name.split(' ')[0]}</div>
                <div className="text-xs text-gray-400">{festival.matchScore}%</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Additional Matches Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-4"
        >
          <h3 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            All Your Matches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAMPLE_RESULTS.map((festival, idx) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => setSelectedFestival(festival)}
              >
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={festival.image}
                    alt={festival.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <h4 className="font-bold text-lg text-white">{festival.name}</h4>
                        <p className="text-sm text-gray-300">{festival.location}</p>
                      </div>
                      <div className="bg-green-500 rounded-full px-4 py-2 font-bold text-white text-lg">
                        {festival.matchScore}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  {festival.genres.slice(0, 3).map((genre, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 bg-gray-700 rounded-full text-gray-200">
                      {genre}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto px-4 mt-16"
        >
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Want More Festivals?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Explore 500+ festivals in our database, get real-time lineup updates, and find your festival buddies.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all">
              Explore All Festivals
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
