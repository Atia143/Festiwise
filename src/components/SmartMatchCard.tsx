'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

interface SmartMatchCardProps {
  match: {
    festival: any;
    overall_score: number;
    confidence: number;
    match_breakdown: any;
    personalized_insights: string[];
    risk_factors: string[];
    why_perfect: string[];
    recommendation_type: 'perfect' | 'great' | 'good' | 'explore' | 'stretch';
    predicted_satisfaction: number;
    best_time_to_book: string;
  };
  index: number;
}

export default function SmartMatchCard({ match, index }: SmartMatchCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [saved, setSaved] = useState(false);

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'perfect': return 'from-green-500 to-emerald-600';
      case 'great': return 'from-blue-500 to-cyan-600';
      case 'good': return 'from-purple-500 to-violet-600';
      case 'explore': return 'from-orange-500 to-amber-600';
      case 'stretch': return 'from-pink-500 to-rose-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'perfect': return '🎯';
      case 'great': return '⭐';
      case 'good': return '👍';
      case 'explore': return '🔍';
      case 'stretch': return '🚀';
      default: return '🎪';
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    
    // Analytics tracking
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', saved ? 'festival_unsaved' : 'festival_saved', {
        event_category: 'engagement',
        event_label: match.festival.name,
        festival_id: match.festival.id
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
    >
      {/* Header with Match Score */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                {match.festival.name}
              </h3>
              <span className="text-lg">
                {getRecommendationIcon(match.recommendation_type)}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-3">
              📍 {match.festival.city}, {match.festival.country}
            </p>
            
            <div className="flex items-center gap-3">
              {/* Match Score */}
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getRecommendationColor(match.recommendation_type)} text-white text-sm font-bold`}>
                {match.overall_score}% Match
              </div>
              
              {/* Recommendation Type */}
              <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700 capitalize">
                {match.recommendation_type} Match
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-full transition-all duration-300 ${
              saved 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <span className="text-lg">{saved ? '❤️' : '🤍'}</span>
          </motion.button>
        </div>

        {/* Festival Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🎵</span>
            <span>{match.festival.genres?.slice(0, 3).join(', ')}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>💰</span>
            <span>${match.festival.estimated_cost_usd?.min}-${match.festival.estimated_cost_usd?.max}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📅</span>
            <span>{match.festival.months?.join(', ')}</span>
          </div>
        </div>

        {/* Why Perfect Section */}
        {match.why_perfect?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-green-700 mb-2">✨ Why This Is Perfect:</h4>
            <div className="space-y-1">
              {match.why_perfect.slice(0, 2).map((reason, idx) => (
                <div key={idx} className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-lg">
                  {reason}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Factors */}
        {match.risk_factors?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-orange-700 mb-2">⚠️ Consider:</h4>
            <div className="space-y-1">
              {match.risk_factors.slice(0, 2).map((risk, idx) => (
                <div key={idx} className="text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-lg">
                  {risk}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence & Satisfaction */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{match.confidence}%</div>
            <div className="text-xs text-gray-600">Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{match.predicted_satisfaction}%</div>
            <div className="text-xs text-gray-600">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Match Breakdown Toggle */}
      <div className="px-6 pb-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-left text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center justify-between transition-colors"
        >
          <span>View Match Details</span>
          <motion.span
            animate={{ rotate: showDetails ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ↓
          </motion.span>
        </button>

        {/* Detailed Match Breakdown */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: showDetails ? 'auto' : 0,
            opacity: showDetails ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {showDetails && (
            <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
              {Object.entries(match.match_breakdown || {}).map(([key, data]: [string, any]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {data.score}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${data.score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                  
                  {data.reasoning && (
                    <p className="text-xs text-gray-600">{data.reasoning}</p>
                  )}
                </div>
              ))}

              {/* Insights */}
              {match.personalized_insights?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-blue-700 mb-2">🧠 AI Insights:</h4>
                  <div className="space-y-1">
                    {match.personalized_insights.map((insight, idx) => (
                      <div key={idx} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Advice */}
              {match.best_time_to_book && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">💡 Booking Tip:</h4>
                  <p className="text-xs text-yellow-700">{match.best_time_to_book}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={match.festival.website || '#'}
            target="_blank"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span>🎪</span>
            <span>Festival Info</span>
          </Link>
          
          <Link
            href={match.festival.ticket_official_url || '#'}
            target="_blank"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-all duration-300 hover:scale-105"
          >
            <span>🎫</span>
            <span>Get Tickets</span>
          </Link>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        initial={false}
      />
    </motion.div>
  );
}

// Loading state component
export function SmartMatchCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded-lg mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
          <div className="flex gap-3">
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}
