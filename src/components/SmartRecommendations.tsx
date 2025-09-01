'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// This component provides AI-like recommendations using client-side processing
// No actual AI/ML costs as it's purely algorithm-based matching
export default function SmartRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [userPreferences, setUserPreferences] = useState({
    genres: [] as string[],
    budget: '',
    region: '',
    season: '',
    size: '',
  });
  const [step, setStep] = useState(0);
  const [showSurvey, setShowSurvey] = useState(false);

  // Sample data - in production this would come from your actual festival database
  const sampleFestivals = [
    {
      id: 'tomorrowland',
      name: 'Tomorrowland',
      location: 'Boom, Belgium',
      region: 'europe',
      dates: 'July 19-28, 2025',
      season: 'summer',
      price_range: '$400-$1000',
      budget_level: 'high',
      genres: ['EDM', 'House', 'Techno', 'Trance'],
      audience_size: 'massive',
      size: 'large',
      camping_available: true,
      rating: 4.9,
      image_url: 'https://images.unsplash.com/photo-1534329539061-64caeb388c42?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'glastonbury',
      name: 'Glastonbury',
      location: 'Somerset, UK',
      region: 'europe',
      dates: 'June 25-29, 2025',
      season: 'summer',
      price_range: '$300-$500',
      budget_level: 'medium',
      genres: ['Rock', 'Alternative', 'Pop', 'Hip Hop', 'Electronic'],
      audience_size: 'massive',
      size: 'large',
      camping_available: true,
      rating: 4.8,
      image_url: 'https://images.unsplash.com/photo-1505285624497-a32b92a4e1db?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'coachella',
      name: 'Coachella',
      location: 'California, USA',
      region: 'north_america',
      dates: 'April 11-20, 2025',
      season: 'spring',
      price_range: '$500-$1200',
      budget_level: 'high',
      genres: ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Alternative'],
      audience_size: 'massive',
      size: 'large',
      camping_available: true,
      rating: 4.7,
      image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'sonar',
      name: 'Sónar',
      location: 'Barcelona, Spain',
      region: 'europe',
      dates: 'June 12-14, 2025',
      season: 'summer',
      price_range: '$180-$250',
      budget_level: 'medium',
      genres: ['Electronic', 'Experimental', 'Techno', 'House'],
      audience_size: 'large',
      size: 'medium',
      camping_available: false,
      rating: 4.6,
      image_url: 'https://images.unsplash.com/photo-1576060974333-fcc859cce544?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'burning-man',
      name: 'Burning Man',
      location: 'Nevada, USA',
      region: 'north_america',
      dates: 'Aug 24 - Sep 1, 2025',
      season: 'summer',
      price_range: '$500-$1500',
      budget_level: 'high',
      genres: ['Electronic', 'Experimental', 'Art'],
      audience_size: 'massive',
      size: 'large',
      camping_available: true,
      rating: 4.9,
      image_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'ultra',
      name: 'Ultra Music Festival',
      location: 'Miami, USA',
      region: 'north_america',
      dates: 'March 28-30, 2025',
      season: 'spring',
      price_range: '$350-$700',
      budget_level: 'high',
      genres: ['EDM', 'House', 'Techno', 'Trance'],
      audience_size: 'large',
      size: 'large',
      camping_available: false,
      rating: 4.5,
      image_url: 'https://images.unsplash.com/photo-1581537034578-6cabb5c23329?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'fuji-rock',
      name: 'Fuji Rock',
      location: 'Niigata, Japan',
      region: 'asia',
      dates: 'July 25-27, 2025',
      season: 'summer',
      price_range: '$300-$450',
      budget_level: 'medium',
      genres: ['Rock', 'Alternative', 'Electronic', 'Pop'],
      audience_size: 'large',
      size: 'medium',
      camping_available: true,
      rating: 4.7,
      image_url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'primavera',
      name: 'Primavera Sound',
      location: 'Barcelona, Spain',
      region: 'europe',
      dates: 'June 5-7, 2025',
      season: 'summer',
      price_range: '$225-$400',
      budget_level: 'medium',
      genres: ['Indie', 'Alternative', 'Electronic', 'Hip Hop'],
      audience_size: 'large',
      size: 'medium',
      camping_available: false,
      rating: 4.8,
      image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800'
    },
  ];

  // Algorithm to match festivals based on user preferences
  const generateRecommendations = () => {
    setIsLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Algorithm: score each festival based on matching criteria
      const scoredFestivals = sampleFestivals.map(festival => {
        let score = 0;
        
        // Genre matching (most important)
        const genreMatches = festival.genres.filter(genre => 
          userPreferences.genres.includes(genre)
        ).length;
        
        if (genreMatches > 0) {
          // 50 points max for genre matches
          score += (genreMatches / userPreferences.genres.length) * 50;
        }
        
        // Budget matching (25 points)
        if (userPreferences.budget && festival.budget_level === userPreferences.budget) {
          score += 25;
        }
        
        // Region matching (15 points)
        if (userPreferences.region && festival.region === userPreferences.region) {
          score += 15;
        }
        
        // Season matching (5 points)
        if (userPreferences.season && festival.season === userPreferences.season) {
          score += 5;
        }
        
        // Size matching (5 points)
        if (userPreferences.size && festival.size === userPreferences.size) {
          score += 5;
        }
        
        return {
          ...festival,
          matchScore: score,
          // Generate personalized reasons for the match
          matchReasons: [
            genreMatches > 0 ? `${genreMatches} of your favorite genres` : null,
            userPreferences.budget && festival.budget_level === userPreferences.budget ? 
              'Matches your budget preferences' : null,
            userPreferences.region && festival.region === userPreferences.region ?
              'Located in your preferred region' : null,
            userPreferences.season && festival.season === userPreferences.season ?
              'Happens during your preferred season' : null,
            userPreferences.size && festival.size === userPreferences.size ?
              'Festival size matches your preference' : null
          ].filter(Boolean)
        };
      });
      
      // Sort by match score and take top results
      const sortedRecommendations = scoredFestivals
        .sort((a, b) => b.matchScore - a.matchScore)
        .filter(festival => festival.matchScore > 10) // Only include reasonable matches
        .slice(0, 4);
      
      setRecommendations(sortedRecommendations);
      setIsLoading(false);
    }, 1500);
  };
  
  // Handles moving through the preference collection wizard
  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      generateRecommendations();
      setStep(5);
    }
  };
  
  // Survey steps content
  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">What music genres do you enjoy?</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Rock', 'Pop', 'Electronic', 'EDM', 'Hip Hop', 'R&B', 'Jazz', 'Metal', 'Indie', 'Alternative', 'Techno', 'House'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setUserPreferences(prev => ({
                      ...prev,
                      genres: prev.genres.includes(genre) 
                        ? prev.genres.filter(g => g !== genre) 
                        : [...prev.genres, genre]
                    }));
                  }}
                  className={`px-4 py-2 rounded-full border ${
                    userPreferences.genres.includes(genre)
                      ? 'bg-purple-100 border-purple-500 text-purple-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">What's your festival budget?</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'low', label: 'Budget-friendly ($100-300)' },
                { id: 'medium', label: 'Mid-range ($300-600)' },
                { id: 'high', label: 'Premium ($600+)' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setUserPreferences(prev => ({
                      ...prev,
                      budget: option.id
                    }));
                  }}
                  className={`px-4 py-3 rounded-lg border ${
                    userPreferences.budget === option.id
                      ? 'bg-purple-100 border-purple-500 text-purple-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Which region are you interested in?</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'north_america', label: 'North America' },
                { id: 'europe', label: 'Europe' },
                { id: 'asia', label: 'Asia & Pacific' },
                { id: 'other', label: 'Other Regions' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setUserPreferences(prev => ({
                      ...prev,
                      region: option.id
                    }));
                  }}
                  className={`px-4 py-3 rounded-lg border ${
                    userPreferences.region === option.id
                      ? 'bg-purple-100 border-purple-500 text-purple-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">What season do you prefer?</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'spring', label: 'Spring' },
                { id: 'summer', label: 'Summer' },
                { id: 'fall', label: 'Fall' },
                { id: 'winter', label: 'Winter' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setUserPreferences(prev => ({
                      ...prev,
                      season: option.id
                    }));
                  }}
                  className={`px-4 py-3 rounded-lg border ${
                    userPreferences.season === option.id
                      ? 'bg-purple-100 border-purple-500 text-purple-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">What size festival do you prefer?</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'small', label: 'Intimate (under 10,000 people)' },
                { id: 'medium', label: 'Medium (10,000-50,000 people)' },
                { id: 'large', label: 'Large (50,000+ people)' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setUserPreferences(prev => ({
                      ...prev,
                      size: option.id
                    }));
                  }}
                  className={`px-4 py-3 rounded-lg border ${
                    userPreferences.size === option.id
                      ? 'bg-purple-100 border-purple-500 text-purple-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Festival Matches</h2>
          <p className="text-gray-600">Discover festivals tailored to your taste</p>
        </div>
        
        {!showSurvey && recommendations.length === 0 && (
          <div className="text-center">
            <button
              onClick={() => setShowSurvey(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Find My Festival Match
            </button>
          </div>
        )}
        
        {/* Mini-survey modal */}
        <AnimatePresence>
          {showSurvey && step < 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              >
                {/* Progress bar */}
                <div className="w-full h-1 bg-gray-200 rounded-full mb-6">
                  <div 
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${((step + 1) / 5) * 100}%` }}
                  ></div>
                </div>
                
                {renderStepContent()}
                
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => {
                      if (step === 0) {
                        setShowSurvey(false);
                      } else {
                        setStep(step - 1);
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {step === 0 ? 'Cancel' : 'Back'}
                  </button>
                  
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    disabled={
                      (step === 0 && userPreferences.genres.length === 0) ||
                      (step === 1 && !userPreferences.budget) ||
                      (step === 2 && !userPreferences.region) ||
                      (step === 3 && !userPreferences.season) ||
                      (step === 4 && !userPreferences.size)
                    }
                  >
                    {step < 4 ? 'Next' : 'Find Matches'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50"
            >
              <div className="bg-white rounded-2xl p-8 max-w-md w-full flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-4 border-t-purple-600 border-r-purple-600 border-b-gray-200 border-l-gray-200 animate-spin"></div>
                <h3 className="text-xl font-bold mt-6 mb-2">Finding your perfect festivals</h3>
                <p className="text-gray-500 text-center">
                  Our algorithm is analyzing {sampleFestivals.length} festivals to find your perfect matches...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Results */}
        {recommendations.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {recommendations.map((festival) => (
                <motion.div
                  key={festival.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                >
                  <div
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${festival.image_url})` }}
                  >
                    <div className="h-full bg-gradient-to-b from-transparent to-black/60 p-4 flex items-end">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {Math.round(festival.matchScore)}% Match
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{festival.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{festival.location}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Why it's a match:</h4>
                      <ul className="space-y-1">
                        {festival.matchReasons.slice(0, 2).map((reason, idx) => (
                          <li key={idx} className="text-sm flex items-start">
                            <svg className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link 
                      href={`/festival/${festival.id}`}
                      className="text-sm text-purple-600 font-medium hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <button
                onClick={() => {
                  setStep(0);
                  setShowSurvey(true);
                }}
                className="text-purple-600 font-medium hover:text-purple-800"
              >
                Refine my preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
