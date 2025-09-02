'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type RecommendationHistory = {
  date: string;
  festivals: {
    id: string;
    name: string;
    match: number;
    reasons: string[];
    location: string;
    year: string;
  }[];
  preferences: {
    genres: string[];
    budget: string;
    location: string;
    season: string;
  };
}

export default function MyRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Sample data - in production this would be fetched from user's account
  const sampleRecommendationHistory: RecommendationHistory[] = [
    {
      date: '2025-08-20',
      festivals: [
        {
          id: 'tomorrowland',
          name: 'Tomorrowland',
          match: 94,
          reasons: ['Electronic dance music', 'Summer season', 'International'],
          location: 'Boom, Belgium',
          year: '2025'
        },
        {
          id: 'ultra',
          name: 'Ultra Music Festival',
          match: 89,
          reasons: ['EDM focus', 'City festival', 'International DJs'],
          location: 'Miami, USA',
          year: '2025'
        },
        {
          id: 'crssd',
          name: 'CRSSD Festival',
          match: 85,
          reasons: ['House & Techno', 'Boutique size', 'Beachfront venue'],
          location: 'San Diego, USA',
          year: '2025'
        }
      ],
      preferences: {
        genres: ['Electronic', 'House', 'Techno'],
        budget: 'High',
        location: 'International',
        season: 'Summer'
      }
    },
    {
      date: '2025-07-15',
      festivals: [
        {
          id: 'glastonbury',
          name: 'Glastonbury Festival',
          match: 91,
          reasons: ['Multi-genre', 'Legendary status', 'Camping experience'],
          location: 'Somerset, UK',
          year: '2025'
        },
        {
          id: 'primavera',
          name: 'Primavera Sound',
          match: 88,
          reasons: ['Alternative focus', 'Urban setting', 'Art integration'],
          location: 'Barcelona, Spain',
          year: '2025'
        },
        {
          id: 'osheaga',
          name: 'Osheaga',
          match: 82,
          reasons: ['Indie rock focus', 'City accessible', 'Multiple stages'],
          location: 'Montreal, Canada',
          year: '2025'
        }
      ],
      preferences: {
        genres: ['Rock', 'Indie', 'Alternative'],
        budget: 'Medium',
        location: 'International',
        season: 'Summer'
      }
    },
    {
      date: '2025-06-01',
      festivals: [
        {
          id: 'bonnaroo',
          name: 'Bonnaroo',
          match: 87,
          reasons: ['Mixed genres', 'Camping community', 'Art installations'],
          location: 'Tennessee, USA',
          year: '2025'
        },
        {
          id: 'coachella',
          name: 'Coachella',
          match: 84,
          reasons: ['Diverse lineup', 'Art & fashion', 'Desert experience'],
          location: 'California, USA',
          year: '2025'
        }
      ],
      preferences: {
        genres: ['Pop', 'Hip Hop', 'Electronic'],
        budget: 'High',
        location: 'North America',
        season: 'Spring'
      }
    }
  ];
  
  useEffect(() => {
    // Simulate loading data from API or local storage
    const timer = setTimeout(() => {
      setRecommendations(sampleRecommendationHistory);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white -mt-20 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800">Loading your recommendations...</h2>
          </div>
        </div>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-white -mt-20 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No recommendations yet</h2>
            <p className="text-gray-600 mb-6">
              Take our festival quiz to get personalized recommendations based on your preferences.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
            >
              Take the Festival Quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white -mt-20 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Your Recommendation History</h1>
            <p className="text-gray-600 mt-2">
              See how your festival preferences have evolved over time
            </p>
          </div>
          
          {/* Timeline selector */}
          <div className="mb-10">
            <div className="bg-gray-50 rounded-xl p-4 overflow-x-auto">
              <div className="flex min-w-max">
                {recommendations.map((rec, index) => (
                  <button
                    key={rec.date}
                    className={`px-5 py-2 rounded-lg text-sm font-medium mr-2 last:mr-0 transition-colors ${
                      activeIndex === index
                        ? 'bg-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    {new Date(rec.date).toLocaleDateString('en-US', { 
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Active recommendation details */}
          <motion.div
            key={recommendations[activeIndex].date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Recommendations from {new Date(recommendations[activeIndex].date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </h2>
                    <p className="text-gray-600">Based on your preferences at that time</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <button className="text-sm text-purple-600 font-medium hover:text-purple-700">
                      Retake with these preferences
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Genres
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {recommendations[activeIndex].preferences.genres.map(genre => (
                        <span 
                          key={genre} 
                          className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Budget
                    </h3>
                    <span className="text-gray-800">
                      {recommendations[activeIndex].preferences.budget}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Location
                    </h3>
                    <span className="text-gray-800">
                      {recommendations[activeIndex].preferences.location}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Season
                    </h3>
                    <span className="text-gray-800">
                      {recommendations[activeIndex].preferences.season}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Festival Matches</h3>
                  
                  <div className="space-y-4">
                    {recommendations[activeIndex].festivals.map((festival) => (
                      <div 
                        key={festival.id} 
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {festival.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {festival.location} • {festival.year}
                              </p>
                            </div>
                            
                            <div className="bg-purple-100 text-purple-800 font-medium rounded-full px-3 py-1 text-sm">
                              {festival.match}% Match
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              Why it matched
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {festival.reasons.map((reason, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700"
                                >
                                  <svg className="mr-1 h-2 w-2 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="3" />
                                  </svg>
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end">
                            <Link
                              href={`/festival/${festival.id}`}
                              className="text-sm font-medium text-purple-600 hover:text-purple-700"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                href="/quiz" 
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
              >
                Get New Recommendations
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
