'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface PreviewFestival {
  id: string;
  name: string;
  location: string;
  vibe: string;
  genres: string[];
  budget: string;
  image: string;
  matchReason: string;
}

const previewFestivals: PreviewFestival[] = [
  {
    id: '1',
    name: 'Tomorrowland',
    location: 'Boom, Belgium',
    vibe: 'High-Energy Dance Paradise',
    genres: ['EDM', 'Techno', 'House'],
    budget: '$$$',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    matchReason: 'Most Popular - 100K+ attendees, world-class production'
  },
  {
    id: '2',
    name: 'Glastonbury',
    location: 'Somerset, UK',
    vibe: 'Eclectic Festival Culture',
    genres: ['Rock', 'Alternative', 'Indie'],
    budget: '$$',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    matchReason: 'Best for variety - 5+ stages, 300+ artists'
  },
  {
    id: '3',
    name: 'Coachella',
    location: 'California, USA',
    vibe: 'Celebrity & Trendsetter Haven',
    genres: ['Pop', 'Indie', 'Hip-Hop'],
    budget: '$$$',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    matchReason: 'Style & Trendsetters - Fashion, celebrities, influencers'
  },
  {
    id: '4',
    name: 'Burning Man',
    location: 'Nevada, USA',
    vibe: 'Art & Counterculture Experience',
    genres: ['Electronic', 'Experimental', 'Performance Art'],
    budget: '$$',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    matchReason: 'Most Unique - Self-expression, art, community'
  },
  {
    id: '5',
    name: 'Reading & Leeds',
    location: 'UK',
    vibe: 'Rock & Alternative Hub',
    genres: ['Rock', 'Alternative', 'Punk'],
    budget: '$$',
    image: 'https://images.unsplash.com/photo-1478359866814-4c6cffe4d8b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    matchReason: 'Best for rockers - Underground + mainstream acts'
  }
];

export default function FestivalPreviewCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + previewFestivals.length) % previewFestivals.length);
  };

  const festival = previewFestivals[current];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl overflow-hidden shadow-xl border border-purple-100"
    >
      <div className="p-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
            <span>🎪 Preview</span>
            <span>See what you'll find</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Popular Festivals You Might Love
          </h2>
          <p className="text-gray-600">
            Take our quiz to get personalized matches based on your exact preferences
          </p>
        </div>

        {/* Carousel */}
        <div className="space-y-6">
          {/* Festival Card Carousel */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg h-96">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={festival.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 }
                }}
                className="absolute inset-0"
              >
                <div className="flex h-full">
                  {/* Image Side */}
                  <div className="w-1/2 relative overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
                    <img
                      src={festival.image}
                      alt={festival.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    
                    {/* Budget Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-purple-600">
                      {festival.budget}
                    </div>
                  </div>

                  {/* Info Side */}
                  <div className="w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">
                        {festival.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">{festival.location}</p>
                      <p className="text-sm text-gray-700 font-semibold mb-3">
                        {festival.vibe}
                      </p>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {festival.genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>

                      {/* Match Reason */}
                      <div className="text-xs text-green-600 font-semibold">
                        ✓ {festival.matchReason}
                      </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="text-xs text-gray-500">
                      Preview {current + 1} of {previewFestivals.length}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(-1)}
              className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-full transition-colors"
            >
              ← Previous
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {previewFestivals.map((_, i) => (
                <motion.button
                  key={i}
                  animate={{
                    width: i === current ? 24 : 8,
                    backgroundColor: i === current ? '#9333ea' : '#d1d5db'
                  }}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className="h-2 rounded-full transition-all"
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(1)}
              className="p-3 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-full transition-colors"
            >
              Next →
            </motion.button>
          </div>

          {/* Main CTA */}
          <Link href="/quiz" className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2"
            >
              <span>🎯 Get Your Personalized Matches</span>
              <span>→</span>
            </motion.button>
          </Link>

          {/* Sub CTA */}
          <p className="text-center text-sm text-gray-600">
            Takes 2 minutes • 100% Free • No spam • Your results stay private
          </p>
        </div>
      </div>
    </motion.div>
  );
}
