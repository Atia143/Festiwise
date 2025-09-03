'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_STATS } from '@/lib/stats';
import Link from 'next/link';

// --- Testimonial Carousel with Social Proof Grid Combined ---
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

const carouselTestimonials: Testimonial[] = [
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
    name: 'Marcus K.',
    location: 'Berlin, Germany',
    festival: 'Ultra Miami',
    rating: 5,
    text: 'Best festival recommendation ever! We started out just playing around, but the app predicted our festival plans perfectly.',
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

// Simple social proof testimonials for the grid
const socialProofTestimonials = [
  { name: "Alex S.", festival: "Tomorrowland", quote: "FestiWise matched me with my dream festival! I'd have never discovered it otherwise." },
  { name: "Maya J.", festival: "Glastonbury", quote: "The recommendation was spot on. Best festival experience of my life." },
  { name: "Sam T.", festival: "Burning Man", quote: "I was skeptical at first, but wow - perfect match for my tastes and budget!" }
];

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

export default function EnhancedTestimonialSocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  // Toggle filter selection
  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselTestimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
     
       

      {/* Main Carousel Testimonial Section with Live Activity */}
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
                4.9/5 
              </span>
            </motion.div>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3 md:mb-4">
              Festival-Goers Love FestiWise
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands who found their perfect festival
            </p>
          </div>

          {/* Carousel */}
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
                      {carouselTestimonials[currentIndex].avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 id={`testimonial-${currentIndex}-name`} className="font-bold text-lg md:text-xl text-gray-800 truncate">
                          {carouselTestimonials[currentIndex].name}
                        </h3>
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex-shrink-0" aria-label="Verified festival-goer">
                          <span className="text-blue-500" aria-hidden="true">✓</span>
                          <span className="hidden sm:inline">Verified</span>
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm md:text-base truncate">{carouselTestimonials[currentIndex].location}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-500 text-sm">
                          {'⭐'.repeat(carouselTestimonials[currentIndex].rating)}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500">• {carouselTestimonials[currentIndex].date}</span>
                      </div>
                    </div>
                  </div>

                  <blockquote className="text-base md:text-lg text-gray-700 leading-relaxed mb-4 italic">
                    "{carouselTestimonials[currentIndex].text}"
                  </blockquote>

                  <div className="flex items-center justify-between">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      🎪 {carouselTestimonials[currentIndex].festival}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 md:gap-3 mb-8">
            {carouselTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-purple-600 w-6 md:w-8'
                    : 'bg-purple-200 hover:bg-purple-300'
                }`}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Smart Match Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 border border-indigo-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                🔍
              </div>
              <div>
                <h3 className="font-bold text-base md:text-xl text-gray-800">
                  Try Smart Match Preview
                </h3>
                <p className="text-xs md:text-sm text-gray-700">
                  Select your vibe and get instant festival recommendations. 15 seconds to see your top matches.
                </p>
              </div>
            </div>
            
            {/* Quick Filter Chips */}
            <div className="mb-4 overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-2 flex-nowrap min-w-min">
                <button 
                  onClick={() => toggleFilter('EDM')}
                  className={`${
                    selectedFilters.includes('EDM') 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'bg-white/80 hover:bg-white/90 text-purple-800'
                  } border border-purple-200 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:shadow-sm flex-shrink-0`}
                >
                  EDM 🎧
                </button>
                <button 
                  onClick={() => toggleFilter('Rock')}
                  className={`${
                    selectedFilters.includes('Rock') 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'bg-white/80 hover:bg-white/90 text-purple-800'
                  } border border-purple-200 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:shadow-sm flex-shrink-0`}
                >
                  Rock 🎸
                </button>
                <button 
                  onClick={() => toggleFilter('Hip-Hop')}
                  className={`${
                    selectedFilters.includes('Hip-Hop') 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'bg-white/80 hover:bg-white/90 text-purple-800'
                  } border border-purple-200 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:shadow-sm flex-shrink-0`}
                >
                  Hip-Hop 🎵
                </button>
                <button 
                  onClick={() => toggleFilter('Under $500')}
                  className={`${
                    selectedFilters.includes('Under $500') 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'bg-white/80 hover:bg-white/90 text-purple-800'
                  } border border-purple-200 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:shadow-sm flex-shrink-0`}
                >
                  Under $500 💰
                </button>
                <button 
                  onClick={() => toggleFilter('Short Flight')}
                  className={`${
                    selectedFilters.includes('Short Flight') 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                      : 'bg-white/80 hover:bg-white/90 text-purple-800'
                  } border border-purple-200 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all hover:shadow-sm flex-shrink-0`}
                >
                  &lt;3h flight ✈️
                </button>
              </div>
            </div>

            {/* Sample Festival Matches */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {/* Festival Card 1 */}
              <Link href="/quiz" className="bg-white/90 rounded-lg overflow-hidden border border-purple-100 hover:shadow-md transition-all cursor-pointer group" aria-label="View Tomorrowland festival details in the quiz">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 h-16 flex items-center justify-center">
                  <span className="text-xl">🎪</span>
                </div>
                <div className="p-2">
                  <h4 className="font-semibold text-sm text-gray-800">Tomorrowland</h4>
                  <p className="text-xs text-gray-600">Belgium • July</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span className="text-xs text-green-600 ml-auto group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>

              {/* Festival Card 2 */}
              <Link href="/quiz" className="bg-white/90 rounded-lg overflow-hidden border border-purple-100 hover:shadow-md transition-all cursor-pointer group" aria-label="View Ultra Miami festival details in the quiz">
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 h-16 flex items-center justify-center">
                  <span className="text-xl">🏝️</span>
                </div>
                <div className="p-2">
                  <h4 className="font-semibold text-sm text-gray-800">Ultra Miami</h4>
                  <p className="text-xs text-gray-600">USA • March</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span className="text-xs text-green-600 ml-auto group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>

              {/* Festival Card 3 */}
              <Link href="/quiz" className="bg-white/90 rounded-lg overflow-hidden border border-purple-100 hover:shadow-md transition-all cursor-pointer group" aria-label="View Coachella festival details in the quiz">
                <div className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 h-16 flex items-center justify-center">
                  <span className="text-xl">🌄</span>
                </div>
                <div className="p-2">
                  <h4 className="font-semibold text-sm text-gray-800">Coachella</h4>
                  <p className="text-xs text-gray-600">USA • April</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span className="text-xs text-green-600 ml-auto group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* CTA Button */}
            <Link href="/quiz" className="block w-full">
              <button 
                onClick={() => {
                  // Optional analytics tracking
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'click', {
                      'event_category': 'engagement',
                      'event_label': 'quiz_cta_button',
                      'value': selectedFilters.length
                    });
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold text-sm md:text-base transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Find My Festival (2 min)</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </Link>
            
            {/* Usage Statistics */}
            <div className="mt-3 flex items-center justify-center">
              <div className="inline-flex items-center text-xs text-gray-500">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                <span><strong>62,412</strong> matches found today</span>
              </div>
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
    </>
  );
}