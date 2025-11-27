'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import OptimizedImg from './OptimizedImg';

interface Festival {
  name: string;
  location: string;
  genres: string[];
  image: string;
}

const previewFestivals: Festival[] = [
  {
    name: "Tomorrowland",
    location: "🇧🇪 Boom, Belgium",
    genres: ["EDM", "Techno", "House"],
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Glastonbury",
    location: "🇬🇧 Somerset, UK",
    genres: ["Rock", "Alternative", "Pop"],
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Coachella",
    location: "🇺🇸 California, USA",
    genres: ["Pop", "Hip-Hop", "Rock"],
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Burning Man",
    location: "🇺🇸 Nevada, USA",
    genres: ["Electronic", "Experimental", "Performance Art"],
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  }
];

export default function ImprovedExitModal() {
  const [showModal, setShowModal] = useState(false);
  const [currentFestival, setCurrentFestival] = useState(0);
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (hasShownRef.current) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger on top of page (mouse leaving upward)
      if (e.clientY <= 0 && !hasShownRef.current) {
        setShowModal(true);
        hasShownRef.current = true;
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleCycle = () => {
    setCurrentFestival((prev) => (prev + 1) % previewFestivals.length);
  };

  const festival = previewFestivals[currentFestival];

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Festival Preview Image */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
              <OptimizedImg
                src={festival.image}
                alt={festival.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-4 right-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="bg-white/90 hover:bg-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg"
                >
                  ✕
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {festival.name}
                  </h3>
                  <p className="text-sm text-gray-600">{festival.location}</p>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {festival.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Message */}
              <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                <strong>Wait!</strong> We found festivals you'll love. Take our 2-minute quiz to discover more matches based on your exact preferences.
              </p>

              {/* Festival Carousel Indicator */}
              <div className="flex justify-center gap-2 mb-6">
                {previewFestivals.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={handleCycle}
                    animate={{
                      scale: i === currentFestival ? 1.2 : 1,
                      backgroundColor: i === currentFestival ? '#9333ea' : '#e5e7eb'
                    }}
                    className="w-2 h-2 rounded-full transition-all"
                  />
                ))}
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <Link href="/quiz" className="block w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    onClick={() => setShowModal(false)}
                  >
                    <span>🎯 Find My Perfect Festival</span>
                    <span>→</span>
                  </motion.button>
                </Link>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                >
                  Maybe later
                </button>
              </div>

              {/* Trust indicator */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-2 text-xs text-gray-600">
                <span>✓</span>
                <span>100% Free • Takes 2 Minutes • No Spam</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
