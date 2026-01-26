'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  testimonial: string;
  festivalFound: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Music Festival Enthusiast',
    avatar: '👩‍🎤',
    testimonial: 'I was overwhelmed by festival options until I tried FestiWise. The 2-minute quiz matched me with Glastonbury perfectly!',
    festivalFound: 'Glastonbury 2025',
    rating: 5
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    role: 'First-time Raver',
    avatar: '👨‍🎤',
    testimonial: 'As a festival newbie, I was scared to commit. FestiWise\'s recommendations gave me confidence. Loved Tomorrowland!',
    festivalFound: 'Tomorrowland',
    rating: 5
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    role: 'Budget-Conscious Traveler',
    avatar: '👩‍💼',
    testimonial: 'Found an amazing underground festival for just $200. FestiWise saved me hundreds and I had the best time!',
    festivalFound: 'Electric Zoo',
    rating: 5
  },
  {
    id: '4',
    name: 'James Park',
    role: 'Festival Collector',
    avatar: '👨‍💻',
    testimonial: 'I\'ve been to 15 festivals. FestiWise still found hidden gems I would\'ve missed. Mind blown.',
    festivalFound: 'Decibel Festival',
    rating: 5
  },
  {
    id: '5',
    name: 'Olivia Smith',
    role: 'Group Coordinator',
    avatar: '👩‍🔬',
    testimonial: 'Organized a group trip of 8 people. FestiWise matched all of us to festivals we ALL loved. Perfect solution!',
    festivalFound: 'Latitude Festival',
    rating: 5
  }
];

export default function InstantTestimonialsCarousel() {
  const [current, setCurrentIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const handleDotClick = (idx: number) => {
    setCurrentIdx(idx);
    setAutoPlay(false);
  };

  const testimonial = testimonials[current];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl overflow-hidden shadow-lg border border-purple-100 p-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
          <span>⭐ Real Stories</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Real People, Real Festival Matches
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See how FestiWise helps people discover their perfect festivals and live their best festival moments
        </p>
      </div>

      {/* Testimonial Card Carousel */}
      <div className="relative bg-white rounded-2xl shadow-md p-8 md:p-10 mb-8 min-h-80 md:min-h-72">
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Stars */}
            <div className="flex gap-1">
              {Array(testimonial.rating)
                .fill(null)
                .map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">
                    ⭐
                  </span>
                ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg md:text-xl text-gray-900 font-medium leading-relaxed">
              "{testimonial.testimonial}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-4xl shadow-md">
                {testimonial.avatar}
              </div>
              <div>
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p className="text-xs text-green-600 font-semibold mt-1">
                  ✓ Found: {testimonial.festivalFound}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {testimonials.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => handleDotClick(i)}
            animate={{
              width: i === current ? 32 : 8,
              backgroundColor: i === current ? '#9333ea' : '#d1d5db'
            }}
            className="h-2 rounded-full transition-all"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          />
        ))}
      </div>

      {/* Social Proof Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-lg bg-purple-100/50">
          <div className="text-2xl font-bold text-purple-600">4.9★</div>
          <p className="text-xs text-gray-600">Avg Rating</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-lg bg-pink-100/50">
          <div className="text-2xl font-bold text-pink-600">98%</div>
          <p className="text-xs text-gray-600">Happy Users</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="p-4 rounded-lg bg-blue-100/50">
          <div className="text-2xl font-bold text-blue-600">2m</div>
          <p className="text-xs text-gray-600">Quiz Time</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
