'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from './QuizContext';
import festivalsData from '../../data/festivals.json';

// Results Page Newsletter Form Component
function ResultsNewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '00cc72fb-5e1a-4b24-b293-38bbdb1a9f33',
          email: email,
          subject: '🎉 Quiz Completed - Save Results & Weekly Updates',
          message: `User completed the festival quiz and wants to save results + receive weekly updates.
          
Email: ${email}
Source: Post-Quiz Results Page CTA 
Timestamp: ${new Date().toLocaleString()}
          
This user completed the entire quiz and is highly engaged - prime for conversion!`,
          from_name: 'Festival Finder Quiz Results',
          to_name: 'Festival Finder Team'
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail('');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white/15 backdrop-blur rounded-2xl p-6">
        <div className="text-center">
          <div className="text-3xl mb-3">🎉</div>
          <div className="font-bold text-lg mb-2">Results Saved!</div>
          <div className="text-white/90 text-sm mb-4">
            Perfect! We've saved your festival matches and you'll get weekly personalized picks sent to your inbox.
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-xs text-white/80">
              ✨ <strong>Next:</strong> Check your email for instant access to your personalized festival calendar
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white/15 backdrop-blur rounded-2xl p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email to save these results"
          className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/30"
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="w-full py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {isSubmitting ? '🔄 Saving...' : '🎪 Save My Results + Get Weekly Picks'}
        </button>
      </form>
      {error && (
        <p className="text-sm text-red-200 mt-3 text-center">{error}</p>
      )}
      <p className="text-xs text-white/70 mt-3 text-center">
        ✨ <strong>2,847 festival explorers</strong> already joined this week. No spam, unsubscribe anytime.
      </p>
    </div>
  );
}

interface Festival {
  id: string;
  name: string;
  city: string;
  country: string;
  region: string;
  months: string[];
  genres: string[];
  duration_days: number;
  audience_size: string;
  estimated_cost_usd: {
    min: number;
    max: number;
  };
  vibe: string[];
  website: string;
  status: string;
  min_age: number;
  ticket_official_url: string;
  family_friendly: boolean;
  camping: boolean;
  glamping: boolean;
  weather_profile: string[];
  description?: string;
  image?: string;
  matchScore?: number;
  highlights?: string[];
}

// Use the real festival database
const FESTIVALS = festivalsData as Festival[];

export function FestivalResults() {
  const { state, resetQuiz } = useQuiz();
  const [matchedFestivals, setMatchedFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate matching algorithm
    const calculateMatches = () => {
      // Development logging disabled for production
      // console.log('🔍 Quiz answers:', state.answers);
      
      const festivals = FESTIVALS.map(festival => {
        let score = 0;
        let maxScore = 0;

        // Genre matching (40% weight)
        const genreWeight = 40;
        maxScore += genreWeight;
        const userGenres = state.answers.genres || [];
        // console.log('🎵 User genres:', userGenres);
        // console.log('🎪 Festival genres:', festival.genres);
        
        if (userGenres.length > 0) {
          const genreMatches = festival.genres.filter(genre => 
            userGenres.some(userGenre => 
              genre.toLowerCase().includes(userGenre.toLowerCase()) ||
              userGenre.toLowerCase().includes(genre.toLowerCase()) ||
              // Handle quiz genre mappings
              (userGenre === 'electronic' && genre.toLowerCase().includes('edm')) ||
              (userGenre === 'electronic' && genre.toLowerCase().includes('electronic')) ||
              (userGenre === 'hiphop' && genre.toLowerCase().includes('hip-hop')) ||
              (userGenre === 'rock' && genre.toLowerCase().includes('metal'))
            )
          ).length;
          score += (genreMatches / Math.max(festival.genres.length, 1)) * genreWeight;
          // console.log(`🎵 ${festival.name} genre matches:`, genreMatches, 'score:', (genreMatches / Math.max(festival.genres.length, 1)) * genreWeight);
        }

        // Budget matching (25% weight)
        const budgetWeight = 25;
        maxScore += budgetWeight;
        // console.log('💰 User budget:', state.answers.budget);
        if (state.answers.budget && state.answers.budget.min !== undefined && state.answers.budget.max !== undefined) {
          const festivalAvgCost = (festival.estimated_cost_usd.min + festival.estimated_cost_usd.max) / 2;
          const userAvgBudget = (state.answers.budget.min + state.answers.budget.max) / 2;
          const budgetDiff = Math.abs(festivalAvgCost - userAvgBudget);
          const maxBudgetDiff = Math.max(festivalAvgCost, userAvgBudget);
          const budgetScore = Math.max(0, (1 - budgetDiff / maxBudgetDiff)) * budgetWeight;
          score += budgetScore;
          // console.log(`💰 ${festival.name} budget score:`, budgetScore);
        }

        // Region matching (20% weight)  
        const regionWeight = 20;
        maxScore += regionWeight;
        // console.log('🌍 User region:', state.answers.region);
        if (state.answers.region) {
          // Handle quiz region mappings
          const userRegions = Array.isArray(state.answers.region) ? state.answers.region : [state.answers.region];
          const hasMatch = userRegions.some(userRegion => {
            if (userRegion === 'anywhere') return true;
            if (userRegion === 'western-europe' && festival.region === 'Western-Europe') return true;
            if (userRegion === 'eastern-europe' && festival.region === 'Eastern-Europe') return true;
            if (userRegion === 'north-america' && festival.region === 'North-America') return true;
            if (userRegion === 'south-america' && festival.region === 'South-America') return true;
            if (userRegion === 'asia-pacific' && festival.region === 'Asia') return true;
            return userRegion === festival.region;
          });
          if (hasMatch) {
            score += regionWeight;
            // console.log(`🌍 ${festival.name} region match!`);
          }
        }

        // Vibe matching (15% weight) - use 'vibes' field from QuizContext
        const vibeWeight = 15;
        maxScore += vibeWeight;
        const userVibes = state.answers.vibes || [];
        // console.log('✨ User vibes:', userVibes);
        // console.log('✨ Festival vibes:', festival.vibe);
        
        if (userVibes.length > 0) {
          const vibeMatches = festival.vibe.filter(vibe => 
            userVibes.includes(vibe)
          ).length;
          if (vibeMatches > 0) {
            const vibeScore = (vibeMatches / Math.max(festival.vibe.length, 1)) * vibeWeight;
            score += vibeScore;
            // console.log(`✨ ${festival.name} vibe matches:`, vibeMatches, 'score:', vibeScore);
          }
        }

        // Month/timing matching (bonus points)
        const userMonths = state.answers.months || [];
        // console.log('📅 User months:', userMonths);
        // console.log('📅 Festival months:', festival.months);
        
        if (userMonths.length > 0) {
          const monthMatches = festival.months.filter(month => 
            userMonths.includes(month.toLowerCase()) || userMonths.includes(month)
          ).length;
          if (monthMatches > 0) {
            // Give bonus points for month matching (10% of total score)
            const monthBonus = 10;
            score += monthBonus;
            // console.log(`📅 ${festival.name} month matches:`, monthMatches, 'bonus:', monthBonus);
          }
        }

        return {
          ...festival,
          matchScore: Math.round((score / maxScore) * 100)
        };
      });

      // Sort by match score and take top 6 (more results with comprehensive database)
      const sortedFestivals = festivals
        .filter(f => f.matchScore && f.matchScore > 15) // Lower threshold for more results
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, 6);

      setMatchedFestivals(sortedFestivals);
      setLoading(false);
    };

    const timer = setTimeout(calculateMatches, 2000); // Simulate loading
    return () => clearTimeout(timer);
  }, [state.answers]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Finding Your Perfect Festivals...</h2>
          <p className="text-gray-600">Analyzing your preferences and matching with the best events worldwide</p>
          <div className="mt-6 space-y-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-2 bg-purple-200 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 w-1/3"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Perfect Festival Matches!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Based on your preferences, we've found {matchedFestivals.length} amazing festivals that match your vibe.
          </p>
        </motion.div>

        {/* Results */}
        {matchedFestivals.length > 0 ? (
          <div className="space-y-8">
            {matchedFestivals.map((festival, index) => (
              <motion.div
                key={festival.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -10 }}
                transition={{ 
                  duration: 0.6,
                  delay: index * 0.2
                }}
                className="bg-white rounded-3xl shadow-xl overflow-hidden"
              >
                <div className="md:flex">
                  {/* Festival Image */}
                  <div className="md:w-1/3 h-64 md:h-auto bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl relative z-10">🎪</div>
                    {/* Animated background elements */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20"
                    />
                  </div>

                  {/* Festival Details */}
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{festival.name}</h3>
                        <p className="text-lg text-gray-600 mb-3 flex items-center">
                          <span className="mr-2">📍</span>
                          {festival.city}, {festival.country}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <span className="mr-1">⏱️</span>
                            {festival.duration_days} days
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <span className="mr-1">📅</span>
                            {festival.months.join(', ')}
                          </span>
                          <span>•</span>
                          <span className="flex items-center capitalize">
                            <span className="mr-1">👥</span>
                            {festival.audience_size} crowd
                          </span>
                          {festival.family_friendly && (
                            <>
                              <span>•</span>
                              <span className="flex items-center text-green-600">
                                <span className="mr-1">👨‍👩‍👧‍👦</span>
                                Family-friendly
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                          {festival.matchScore}% Match
                        </div>
                        <div className="text-xl font-bold text-gray-900 mt-3">
                          ${festival.estimated_cost_usd.min.toLocaleString()} - ${festival.estimated_cost_usd.max.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">USD total cost</div>
                      </div>
                    </div>

                    {/* Genres & Vibes */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="mr-2">🎵</span>
                          Music Genres
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {festival.genres.map(genre => (
                            <span
                              key={genre}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="mr-2">✨</span>
                          Festival Vibes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {festival.vibe.map(vibe => (
                            <span
                              key={vibe}
                              className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium capitalize"
                            >
                              {vibe}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Festival Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">🏕️</span>
                        What's Available
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className={`flex items-center ${festival.camping ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className="mr-1">{festival.camping ? '✅' : '❌'}</span>
                          Camping
                        </div>
                        <div className={`flex items-center ${festival.glamping ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className="mr-1">{festival.glamping ? '✅' : '❌'}</span>
                          Glamping
                        </div>
                        <div className={`flex items-center ${festival.family_friendly ? 'text-green-600' : 'text-gray-400'}`}>
                          <span className="mr-1">{festival.family_friendly ? '✅' : '❌'}</span>
                          Family-friendly
                        </div>
                        <div className="flex items-center text-blue-600">
                          <span className="mr-1">🌡️</span>
                          {festival.weather_profile.join(', ')}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {festival.description}
                    </p>

                    {/* Highlights */}
                    {festival.highlights && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Festival Highlights</h4>
                        <div className="space-y-1">
                          {festival.highlights.map((highlight, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="text-green-500">✓</span>
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                        View Details
                      </button>
                      {festival.website && (
                        <a
                          href={festival.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-purple-600 border-2 border-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300"
                        >
                          Official Website
                        </a>
                      )}
                      <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300">
                        Save to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Perfect Matches Found</h3>
            <p className="text-gray-600 mb-6">
              Don't worry! Try adjusting your preferences or take the quiz again for different results.
            </p>
            <button
              onClick={resetQuiz}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Take Quiz Again
            </button>
          </motion.div>
        )}

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center space-y-6"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Want More Options?</h3>
            <p className="text-gray-600 mb-6">
              Explore all festivals worldwide or refine your search with different preferences.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Take Quiz Again
              </button>
              <button className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300">
                Browse All Festivals
              </button>
              <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300">
                Share Results
              </button>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-4">
                <span className="text-yellow-400">🎉</span>
                <span className="font-semibold">Congratulations! Quiz Complete</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Love Your Results? Get More Like This! 
              </h3>
              <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                You just discovered your perfect festival matches! Join festival lovers who get 
                <strong> weekly personalized recommendations</strong> and <strong>exclusive early-bird access</strong> to tickets.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="font-semibold text-sm">Personalized Weekly Picks</div>
                  <div className="text-xs text-white/80">Based on your exact preferences</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="font-semibold text-sm">24-Hour Early Access</div>
                  <div className="text-xs text-white/80">Beat the crowds to popular tickets</div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="font-semibold text-sm">Exclusive Discounts</div>
                  <div className="text-xs text-white/80">Member-only deals up to 40% off</div>
                </div>
              </div>
              
                            <ResultsNewsletterForm />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-white/80">
                  🔒 Your email stays private. We only send you festivals you'll actually love.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
