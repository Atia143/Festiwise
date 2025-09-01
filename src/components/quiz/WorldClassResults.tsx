'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from './QuizContext';
import NewsletterForm from '../NewsletterForm';

interface Festival {
  id: string;
  name: string;
  city: string;
  country: string;
  description?: string;
  genres: string[];
  months: string[];
  duration_days: number;
  audience_size: string;
  estimated_cost_usd: {
    min: number;
    max: number;
  };
  website?: string;
  ticket_official_url?: string;
  vibe: string[];
}

interface FestivalMatch {
  festival: Festival;
  score: number;
  reasons: string[];
}

// Currency formatter
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Score color helper
const getScoreColor = (score: number) => {
  if (score >= 0.8) return '#22c55e';
  if (score >= 0.6) return '#f59e0b';
  if (score >= 0.4) return '#3b82f6';
  return '#6b7280';
};

// Score label helper
const getScoreLabel = (score: number) => {
  if (score >= 0.8) return 'Perfect Match!';
  if (score >= 0.6) return 'Great Fit';
  if (score >= 0.4) return 'Good Option';
  return 'Consider It';
};

export function WorldClassResults() {
  const { state, resetQuiz } = useQuiz();
  const [matches, setMatches] = useState<FestivalMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [showNewsletter, setShowNewsletter] = useState(false);

  // Custom matching algorithm
  const calculateMatches = (festivals: Festival[], userAnswers: any): FestivalMatch[] => {
    const matches: FestivalMatch[] = [];
    
    festivals.forEach(festival => {
      let totalScore = 0;
      let maxScore = 0;
      const reasons: string[] = [];

      // Genre matching (30% weight)
      const genreWeight = 0.3;
      if (userAnswers.genres && festival.genres) {
        const userGenres = Array.isArray(userAnswers.genres) ? userAnswers.genres : [userAnswers.genres];
        const matchingGenres = userGenres.filter((genre: string) => 
          festival.genres.some(fg => fg.toLowerCase().includes(genre.toLowerCase()) || 
                                   genre.toLowerCase().includes(fg.toLowerCase()))
        );
        const genreScore = matchingGenres.length / Math.max(userGenres.length, 1);
        totalScore += genreScore * genreWeight;
        
        if (matchingGenres.length > 0) {
          reasons.push(`Perfect music match with ${matchingGenres.slice(0, 2).join(' & ')} vibes`);
        }
      }
      maxScore += genreWeight;

      // Budget matching (25% weight)
      const budgetWeight = 0.25;
      if (userAnswers.budget && festival.estimated_cost_usd) {
        const userBudget = typeof userAnswers.budget === 'object' ? 
          (userAnswers.budget.min + userAnswers.budget.max) / 2 : 
          parseInt(userAnswers.budget) || 2000;
        const festivalMin = festival.estimated_cost_usd.min;
        const festivalMax = festival.estimated_cost_usd.max;
        const festivalAvg = (festivalMin + festivalMax) / 2;
        
        let budgetScore = 0;
        if (userBudget >= festivalMin && userBudget <= festivalMax) {
          budgetScore = 1;
          reasons.push(`Perfect budget fit at ${formatCurrency(festivalAvg)}`);
        } else if (Math.abs(userBudget - festivalAvg) <= 500) {
          budgetScore = 0.8;
          reasons.push(`Great value within your budget range`);
        } else if (Math.abs(userBudget - festivalAvg) <= 1000) {
          budgetScore = 0.6;
        } else {
          budgetScore = 0.3;
        }
        
        totalScore += budgetScore * budgetWeight;
      }
      maxScore += budgetWeight;

      // Date/Month matching (20% weight)
      const dateWeight = 0.2;
      if (userAnswers.months && festival.months) {
        const userMonths = Array.isArray(userAnswers.months) ? userAnswers.months : [userAnswers.months];
        const matchingMonths = userMonths.filter((month: string) => 
          festival.months.includes(month)
        );
        let dateScore = matchingMonths.length / Math.max(userMonths.length, 1);
        
        if (matchingMonths.length > 0) {
          reasons.push(`Perfect timing in ${matchingMonths.slice(0, 2).join(' & ')}`);
        } else {
          dateScore = 0.5; // Some compatibility even without perfect month match
        }
        
        totalScore += dateScore * dateWeight;
      }
      maxScore += dateWeight;

      // Location matching (15% weight)
      const locationWeight = 0.15;
      if (userAnswers.region) {
        let locationScore = 0;
        if (userAnswers.region === 'anywhere' || userAnswers.region === 'global') {
          locationScore = 1;
          reasons.push(`Amazing ${festival.city} location to explore`);
        } else if (userAnswers.region === 'north-america' && 
                   ['United States', 'USA', 'US', 'Canada', 'Mexico'].includes(festival.country)) {
          locationScore = 1;
          reasons.push('Perfect North American destination');
        } else if (userAnswers.region === 'europe' && 
                   ['United Kingdom', 'Germany', 'France', 'Spain', 'Netherlands', 'Belgium', 'Italy'].includes(festival.country)) {
          locationScore = 1;
          reasons.push('Incredible European adventure');
        } else {
          locationScore = 0.3;
        }
        totalScore += locationScore * locationWeight;
      }
      maxScore += locationWeight;

      // Audience size matching (10% weight)
      const audienceWeight = 0.1;
      if (userAnswers.audienceSize && festival.audience_size) {
        let audienceScore = 0;
        const userPref = userAnswers.audienceSize.toLowerCase();
        const festivalSize = festival.audience_size.toLowerCase();
        
        if (userPref === festivalSize || userPref === 'any') {
          audienceScore = 1;
          reasons.push(`Perfect ${festivalSize} crowd atmosphere`);
        } else if ((userPref === 'medium' && ['small', 'large'].includes(festivalSize)) ||
                   (userPref === 'small' && festivalSize === 'medium') ||
                   (userPref === 'large' && festivalSize === 'medium')) {
          audienceScore = 0.7;
        } else {
          audienceScore = 0.4;
        }
        totalScore += audienceScore * audienceWeight;
      }
      maxScore += audienceWeight;

      // Calculate final normalized score
      const finalScore = maxScore > 0 ? totalScore / maxScore : 0;

      // Only include festivals with decent matches
      if (finalScore > 0.2) {
        matches.push({
          festival,
          score: finalScore,
          reasons: reasons.length > 0 ? reasons : ['Great festival experience awaits!']
        });
      }
    });

    // Sort by score and return top matches
    return matches.sort((a, b) => b.score - a.score).slice(0, 12);
  };

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      
      try {
        // Enhanced sample festival data
        const sampleFestivals: Festival[] = [
          {
            id: '1',
            name: 'Coachella Valley Music & Arts Festival',
            city: 'Indio',
            country: 'United States',
            description: 'One of the most famous music festivals featuring top artists across multiple genres',
            genres: ['Indie', 'Electronic', 'Hip-Hop', 'Alternative', 'Pop'],
            months: ['April'],
            duration_days: 6,
            audience_size: 'large',
            estimated_cost_usd: { min: 1500, max: 3500 },
            website: 'https://coachella.com',
            ticket_official_url: 'https://coachella.com/tickets',
            vibe: ['trendy', 'artistic', 'social', 'luxury']
          },
          {
            id: '2',
            name: 'Burning Man',
            city: 'Black Rock City',
            country: 'United States',
            description: 'A radical self-expression and self-reliance experiment in the Nevada desert',
            genres: ['Electronic', 'Experimental', 'Art Music', 'Ambient'],
            months: ['August', 'September'],
            duration_days: 8,
            audience_size: 'large',
            estimated_cost_usd: { min: 2000, max: 6000 },
            website: 'https://burningman.org',
            ticket_official_url: 'https://burningman.org/event/ticketing/',
            vibe: ['transformative', 'radical', 'community', 'artistic']
          },
          {
            id: '3',
            name: 'Electric Forest',
            city: 'Rothbury',
            country: 'United States',
            description: 'Electronic music festival in a magical forest setting',
            genres: ['Electronic', 'EDM', 'Bass', 'House', 'Dubstep'],
            months: ['June'],
            duration_days: 4,
            audience_size: 'medium',
            estimated_cost_usd: { min: 800, max: 1800 },
            website: 'https://electricforestfestival.com',
            ticket_official_url: 'https://electricforestfestival.com/tickets/',
            vibe: ['magical', 'nature', 'electronic', 'community']
          },
          {
            id: '4',
            name: 'Glastonbury Festival',
            city: 'Glastonbury',
            country: 'United Kingdom',
            description: 'Legendary British festival featuring diverse music and arts',
            genres: ['Rock', 'Pop', 'Electronic', 'Folk', 'World Music'],
            months: ['June'],
            duration_days: 5,
            audience_size: 'large',
            estimated_cost_usd: { min: 400, max: 800 },
            website: 'https://glastonburyfestivals.co.uk',
            ticket_official_url: 'https://glastonburyfestivals.co.uk/information/tickets/',
            vibe: ['legendary', 'diverse', 'muddy', 'iconic']
          },
          {
            id: '5',
            name: 'Tomorrowland',
            city: 'Boom',
            country: 'Belgium',
            description: 'The world\'s most famous electronic dance music festival',
            genres: ['Electronic', 'EDM', 'Techno', 'House', 'Trance'],
            months: ['July'],
            duration_days: 3,
            audience_size: 'large',
            estimated_cost_usd: { min: 1200, max: 2500 },
            website: 'https://tomorrowland.com',
            ticket_official_url: 'https://tomorrowland.com/en/tickets',
            vibe: ['magical', 'electronic', 'fantasy', 'unity']
          },
          {
            id: '6',
            name: 'Bonnaroo',
            city: 'Manchester',
            country: 'United States',
            description: 'Four-day music festival featuring diverse genres and camping',
            genres: ['Rock', 'Hip-Hop', 'Electronic', 'Folk', 'Indie'],
            months: ['June'],
            duration_days: 4,
            audience_size: 'large',
            estimated_cost_usd: { min: 600, max: 1400 },
            website: 'https://bonnaroo.com',
            ticket_official_url: 'https://bonnaroo.com/tickets/',
            vibe: ['community', 'camping', 'diverse', 'southern']
          }
        ];
        
        // Calculate matches with our custom algorithm
        const calculatedMatches = calculateMatches(sampleFestivals, state.answers);
        
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setMatches(calculatedMatches);
      } catch (error) {
        console.error('Error loading festival matches:', error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    if (state.answers && Object.keys(state.answers).length > 0) {
      loadMatches();
    }
  }, [state.answers]);

  // Share functionality
  const shareResults = () => {
    const shareText = `I just found ${matches.length} perfect festival matches! 🎪✨ Check out Festival Finder to discover your perfect festival experience.`;
    
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'My Festival Finder Results',
        text: shareText,
        url: window.location.href,
      });
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '60px 40px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              fontSize: '64px',
              marginBottom: '24px',
              display: 'inline-block'
            }}
          >
            🎪
          </motion.div>
          
          <h2 style={{
            fontSize: '32px',
            color: 'white',
            marginBottom: '16px',
            fontWeight: 'bold'
          }}>
            Finding Your Perfect Festivals...
          </h2>
          
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '32px'
          }}>
            Analyzing thousands of festivals worldwide
          </p>
          
          <div style={{
            width: '200px',
            height: '4px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            margin: '0 auto',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                borderRadius: '2px'
              }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // No Matches State
  if (matches.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '60px 40px',
            border: '1px solid rgba(255,255,255,0.2)',
            maxWidth: '600px'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
          <h2 style={{ fontSize: '28px', color: 'white', marginBottom: '16px', fontWeight: 'bold' }}>
            Let's Expand Your Search!
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '30px', lineHeight: 1.6 }}>
            We couldn't find perfect matches with your current preferences. Try adjusting your filters for more options!
          </p>
          <button
            onClick={resetQuiz}
            style={{
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
              fontFamily: 'inherit'
            }}
          >
            🔄 Try Different Preferences
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* WORLD-CLASS HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '50px' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
              marginBottom: '24px',
              fontSize: '36px'
            }}
          >
            ✨
          </motion.div>
          
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2
          }}>
            Your Perfect Festival Matches! 🎪
          </h1>
          
          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '32px',
            lineHeight: 1.5
          }}>
            We found <strong>{matches.length} amazing festivals</strong> that match your unique vibe
          </p>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <button
              onClick={shareResults}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
            >
              📤 Share Results
            </button>
            
            <button
              onClick={() => setShowNewsletter(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.4)',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
            >
              💾 Save My Results
            </button>
            
            <button
              onClick={resetQuiz}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
            >
              🔄 Take Quiz Again
            </button>
          </div>
        </motion.div>

        {/* WORLD-CLASS RESULTS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          {matches.map((match, index) => (
            <motion.div
              key={match.festival.id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => setSelectedFestival(match.festival)}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              {/* Rank Badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: index === 0 ? 'linear-gradient(135deg, #ffd700, #ffed4e)' : 
                           index === 1 ? 'linear-gradient(135deg, #c0c0c0, #e5e5e5)' :
                           index === 2 ? 'linear-gradient(135deg, #cd7f32, #daa520)' :
                           'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                color: index < 3 ? '#333' : 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {index === 0 ? '🏆 PERFECT MATCH' : `#${index + 1}`}
              </div>

              {/* Urgency Badge */}
              {index < 3 && (
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'linear-gradient(135deg, #ff4444, #ff6b6b)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  animation: 'pulse 2s infinite'
                }}>
                  {index === 0 ? '🔥 HOT' : index === 1 ? '⚡ TRENDING' : '🎯 POPULAR'}
                </div>
              )}

              {/* Match Score */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                marginTop: '40px'
              }}>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  background: `${getScoreColor(match.score)}40`,
                  border: `2px solid ${getScoreColor(match.score)}`,
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {Math.round(match.score * 100)}% Match
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: '600'
                }}>
                  {getScoreLabel(match.score)}
                </div>
              </div>

              {/* Festival Name & Location */}
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '8px',
                lineHeight: 1.3
              }}>
                {match.festival.name}
              </h3>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px'
              }}>
                <span style={{ fontSize: '16px' }}>📍</span>
                <span>{match.festival.city}, {match.festival.country}</span>
              </div>

              {/* Key Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px',
                fontSize: '13px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  <span>📅</span>
                  <span>{match.festival.months ? match.festival.months.slice(0, 2).join(', ') : 'Year-round'}</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  <span>💰</span>
                  <span>
                    {match.festival.estimated_cost_usd ? 
                      `${formatCurrency(match.festival.estimated_cost_usd.min)} - ${formatCurrency(match.festival.estimated_cost_usd.max)}` : 
                      'Price varies'
                    }
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  <span>👥</span>
                  <span style={{ textTransform: 'capitalize' }}>
                    {match.festival.audience_size || 'Medium'} crowd
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  <span>⏱️</span>
                  <span>{match.festival.duration_days || 3} days</span>
                </div>
              </div>

              {/* Genres */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}>
                  {(match.festival.genres || ['Music']).slice(0, 4).map((genre: string, idx: number) => (
                    <span
                      key={idx}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}
                    >
                      {genre}
                    </span>
                  ))}
                  {(match.festival.genres || []).length > 4 && (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      +{(match.festival.genres || []).length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Match Reasons */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '8px'
                }}>
                  Why it's perfect for you:
                </div>
                <div style={{ fontSize: '11px', lineHeight: 1.4 }}>
                  {match.reasons.slice(0, 3).map((reason, idx) => (
                    <div
                      key={idx}
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px'
                      }}
                    >
                      <span style={{ color: '#feca57', fontSize: '10px', marginTop: '2px' }}>●</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div style={{
                textAlign: 'center',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>
                Click to learn more & get tickets ✨
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        {showNewsletter && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '40px'
            }}
          >
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px'
            }}>
              🎉 Save Your Results & Get Updates!
            </h3>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '24px',
              lineHeight: 1.5
            }}>
              Enter your email to save these results and get notified about tickets, new festivals, and exclusive deals!
            </p>
            <NewsletterForm />
          </motion.div>
        )}

        {/* Festival Detail Modal */}
        {selectedFestival && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setSelectedFestival(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '32px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                fontFamily: 'inherit'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  lineHeight: 1.3
                }}>
                  {selectedFestival.name}
                </h2>
                <button
                  onClick={() => setSelectedFestival(null)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '8px',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '16px'
              }}>
                <span style={{ fontSize: '18px' }}>📍</span>
                <span>{selectedFestival.city}, {selectedFestival.country}</span>
              </div>

              {selectedFestival.description && (
                <p style={{
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                  fontSize: '16px'
                }}>
                  {selectedFestival.description}
                </p>
              )}

              {selectedFestival.genres && selectedFestival.genres.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{
                    color: 'white',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    fontSize: '14px'
                  }}>
                    🎵 Music Genres
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {selectedFestival.genres.map((genre: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedFestival.website && (
                <div style={{ textAlign: 'center' }}>
                  <a
                    href={selectedFestival.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🎟️ Get Tickets & Info
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
