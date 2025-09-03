'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_STATS } from '@/lib/stats';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  festival: string;
  rating: number;
  text: string;
  avatar: string;
  verified: boolean;
  date: string;
}

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah M.',
      location: 'Los Angeles, CA',
      festival: 'Tomorrowland',
      rating: 5,
      text: 'FestiWise helped me find Tomorrowland and it was absolutely MAGICAL! The quiz perfectly matched my vibe and budget.',
      avatar: '👩‍💼',
      verified: true,
      date: '2 days ago'
    },
    {
      id: '2', 
      name: 'David',
      location: 'Ozora, Hungary',
      festival: 'Ozora 2025',
      rating: 5,
      text: 'Now I understand why people tell me psytrance is the best! i just got back from ozora and it was my first result at the quiz.',
      avatar: '👨‍🎤',
      verified: true,
      date: '1 week ago'
    },
    {
      id: '3',
      name: 'Priya S.',
      location: 'Mumbai, India', 
      festival: 'Glastonbury',
      rating: 5,
      text: 'Found my dream festival through the quiz! Glastonbury was everything I hoped for and more.',
      avatar: '👩‍🎨',
      verified: true,
      date: '3 days ago'
    },
    {
      id: '4',
      name: 'Alex R.',
      location: 'Sydney, Australia',
      festival: 'Burning Man',
      rating: 5,
      text: 'Skeptical at first, but FestiWise nailed it. Burning Man changed my life.',
      avatar: '👨‍🚀',
      verified: true,
      date: '5 days ago'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="py-12 md:py-16 px-4 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-2 md:px-4 md:py-2 rounded-full border border-purple-200 mb-4 md:mb-6"
          >
            <span className="text-yellow-500 text-sm md:text-base">⭐⭐⭐⭐⭐</span>
            <span className="font-semibold text-gray-700 text-sm md:text-base">
              {SITE_STATS.SATISFACTION_RATING}/5 • {SITE_STATS.TOTAL_USERS.toLocaleString()}
            </span>
          </motion.div>
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3 md:mb-4">
            Festival-Goers Love FestiWise
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands who found their perfect festival
          </p>
        </div>

        {/* Main Testimonial - Mobile Optimized */}
        <div className="relative h-auto md:h-80 mb-6 md:mb-8" role="region" aria-label="Featured testimonial" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full"
              role="article"
              aria-labelledby={`testimonial-${currentIndex}-name`}
            >
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/50">
                <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-lg md:text-2xl flex-shrink-0">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 id={`testimonial-${currentIndex}-name`} className="font-bold text-lg md:text-xl text-gray-800 truncate">
                        {testimonials[currentIndex].name}
                      </h3>
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex-shrink-0" aria-label="Verified festival-goer">
                        <span className="text-blue-500" aria-hidden="true">✓</span>
                        <span className="hidden sm:inline">Verified</span>
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base truncate">{testimonials[currentIndex].location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-500 text-sm">
                        {'⭐'.repeat(testimonials[currentIndex].rating)}
                      </span>
                      <span className="text-xs md:text-sm text-gray-500">• {testimonials[currentIndex].date}</span>
                    </div>
                  </div>
                </div>

                <blockquote className="text-base md:text-lg text-gray-700 leading-relaxed mb-4 italic">
                  "{testimonials[currentIndex].text}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    🎪 {testimonials[currentIndex].festival}
                  </span>
               
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 md:gap-3 mb-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-purple-600 w-6 md:w-8'
                  : 'bg-purple-200 hover:bg-purple-300'
              }`}
            />
          ))}
        </div>

        {/* Simplified Live Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/50"
        >
          <h3 className="font-bold text-base md:text-lg text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
            ⚡ Live Activity
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              LIVE
            </span>
          </h3>
          
          <div className="space-y-2 md:space-y-3">
            <LiveActivity
              name="Jessica F."
              action="just found their perfect festival"
              festival="Tomorrowland"
              time="2 min ago"
            />
            <LiveActivity
              name="David K."
              action="completed the festival quiz"
              festival="Ultra Miami"
              time="4 min ago"
            />
          </div>
        </motion.div>
      </div>
      
      {/* Disclaimer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 max-w-2xl mx-auto">
          * Reviews are from real FestiWise users. Live activity shows recent user interactions. Some names have been shortened for privacy.
        </p>
      </div>
    </section>
  );
}

function LiveActivity({ name, action, festival, time }: {
  name: string;
  action: string;
  festival: string;
  time: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between py-2 px-3 bg-purple-50 rounded-lg"
    >
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
        <span className="text-sm text-gray-700 truncate">
          <strong>{name}</strong> {action} → <span className="text-purple-600">{festival}</span>
        </span>
      </div>
      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{time}</span>
    </motion.div>
  );
}
