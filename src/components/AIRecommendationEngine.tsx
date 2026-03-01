'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';

interface Festival {
  id: string;
  name: string;
  genre: string;
  location: string;
  price: number;
  month: string;
  country: string;
  vibe: string;
  rating: number;
  image?: string;
}

interface UserProfile {
  preferredGenres: string[];
  budgetRange: [number, number];
  preferredMonths: string[];
  preferredCountries: string[];
  preferredVibes: string[];
  previousSelections: string[];
  engagement: {
    timeSpent: number;
    festivalsViewed: string[];
    searchQueries: string[];
  };
}

interface RecommendationReason {
  type: 'genre' | 'budget' | 'location' | 'vibe' | 'popularity' | 'trending';
  strength: number; // 0-1
  explanation: string;
  color: string;
}

interface SmartRecommendation {
  festival: Festival;
  score: number;
  confidence: number;
  reasons: RecommendationReason[];
  category: 'perfect' | 'great' | 'explore';
}

class AIRecommendationEngine {
  private userProfile: UserProfile | null = null;
  private festivals: Festival[] = [];

  constructor(festivals: Festival[]) {
    this.festivals = festivals;
    this.loadUserProfile();
  }

  // Build user profile from interactions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildUserProfile(quizAnswers: any, interactions: any[]): UserProfile {
    const profile: UserProfile = {
      preferredGenres: quizAnswers.genres || [],
      budgetRange: quizAnswers.budget || [0, 5000],
      preferredMonths: quizAnswers.months || [],
      preferredCountries: quizAnswers.countries || [],
      preferredVibes: quizAnswers.vibes || [],
      previousSelections: interactions.map(i => i.festivalId).filter(Boolean),
      engagement: {
        timeSpent: 0,
        festivalsViewed: [],
        searchQueries: []
      }
    };

    this.userProfile = profile;
    this.saveUserProfile(profile);
    return profile;
  }

  // Spotify-style recommendation algorithm
  generateRecommendations(limit: number = 12): SmartRecommendation[] {
    if (!this.userProfile) {
      return this.getFallbackRecommendations(limit);
    }

    const scoredFestivals = this.festivals.map(festival => {
      const recommendation = this.scoreFestival(festival);
      return recommendation;
    });

    // Sort by score and confidence
    scoredFestivals.sort((a, b) => {
      const scoreA = a.score * a.confidence;
      const scoreB = b.score * b.confidence;
      return scoreB - scoreA;
    });

    // Categorize recommendations
    const categorized = this.categorizeRecommendations(scoredFestivals.slice(0, limit));
    
    // Ensure diversity in results
    return this.ensureDiversity(categorized);
  }

  private scoreFestival(festival: Festival): SmartRecommendation {
    if (!this.userProfile) {
      return this.getBasicRecommendation(festival);
    }

    let totalScore = 0;
    let confidence = 0;
    const reasons: RecommendationReason[] = [];

    // 1. Genre Matching (40% weight)
    const genreScore = this.calculateGenreScore(festival);
    if (genreScore.score > 0) {
      totalScore += genreScore.score * 0.4;
      confidence += 0.4;
      reasons.push({
        type: 'genre',
        strength: genreScore.score,
        explanation: genreScore.reason,
        color: 'bg-purple-100 text-purple-800'
      });
    }

    // 2. Budget Compatibility (25% weight)
    const budgetScore = this.calculateBudgetScore(festival);
    if (budgetScore.score > 0) {
      totalScore += budgetScore.score * 0.25;
      confidence += 0.25;
      reasons.push({
        type: 'budget',
        strength: budgetScore.score,
        explanation: budgetScore.reason,
        color: 'bg-green-100 text-green-800'
      });
    }

    // 3. Location Preference (15% weight)
    const locationScore = this.calculateLocationScore(festival);
    if (locationScore.score > 0) {
      totalScore += locationScore.score * 0.15;
      confidence += 0.15;
      reasons.push({
        type: 'location',
        strength: locationScore.score,
        explanation: locationScore.reason,
        color: 'bg-blue-100 text-blue-800'
      });
    }

    // 4. Vibe Matching (10% weight)
    const vibeScore = this.calculateVibeScore(festival);
    if (vibeScore.score > 0) {
      totalScore += vibeScore.score * 0.1;
      confidence += 0.1;
      reasons.push({
        type: 'vibe',
        strength: vibeScore.score,
        explanation: vibeScore.reason,
        color: 'bg-pink-100 text-pink-800'
      });
    }

    // 5. Popularity & Trends (10% weight)
    const popularityScore = this.calculatePopularityScore(festival);
    if (popularityScore.score > 0) {
      totalScore += popularityScore.score * 0.1;
      confidence += 0.1;
      reasons.push({
        type: 'popularity',
        strength: popularityScore.score,
        explanation: popularityScore.reason,
        color: 'bg-yellow-100 text-yellow-800'
      });
    }

    // Determine category based on score
    let category: 'perfect' | 'great' | 'explore';
    if (totalScore >= 0.8) category = 'perfect';
    else if (totalScore >= 0.6) category = 'great';
    else category = 'explore';

    return {
      festival,
      score: totalScore,
      confidence: confidence / 5, // Normalize confidence
      reasons: reasons.sort((a, b) => b.strength - a.strength).slice(0, 3),
      category
    };
  }

  private calculateGenreScore(festival: Festival): { score: number; reason: string } {
    if (!this.userProfile) return { score: 0, reason: '' };

    const userGenres = this.userProfile.preferredGenres.map(g => g.toLowerCase());
    const festivalGenre = festival.genre.toLowerCase();

    if (userGenres.includes(festivalGenre)) {
      return {
        score: 1.0,
        reason: `Perfect match for ${festival.genre}`
      };
    }

    // Genre similarity matching
    const genreSimilarity = this.getGenreSimilarity(festivalGenre, userGenres);
    if (genreSimilarity > 0.5) {
      return {
        score: genreSimilarity,
        reason: `Great fit for your music taste`
      };
    }

    return { score: 0, reason: '' };
  }

  private calculateBudgetScore(festival: Festival): { score: number; reason: string } {
    if (!this.userProfile) return { score: 0, reason: '' };

    const [minBudget, maxBudget] = this.userProfile.budgetRange;
    const festivalPrice = festival.price;

    if (festivalPrice >= minBudget && festivalPrice <= maxBudget) {
      const budgetUtilization = (festivalPrice - minBudget) / (maxBudget - minBudget);
      return {
        score: 1.0,
        reason: budgetUtilization > 0.7 
          ? `Premium option within budget` 
          : `Great value within budget`
      };
    }

    // Slightly over budget penalty
    if (festivalPrice < maxBudget * 1.2) {
      return {
        score: 0.7,
        reason: `Slightly over budget but worth it`
      };
    }

    return { score: 0, reason: '' };
  }

  private calculateLocationScore(festival: Festival): { score: number; reason: string } {
    if (!this.userProfile) return { score: 0, reason: '' };

    const preferredCountries = this.userProfile.preferredCountries.map(c => c.toLowerCase());
    const festivalCountry = festival.country.toLowerCase();

    if (preferredCountries.includes(festivalCountry)) {
      return {
        score: 1.0,
        reason: `Perfect location match`
      };
    }

    // Regional proximity bonus
    const regionalScore = this.getRegionalProximity(festivalCountry, preferredCountries);
    if (regionalScore > 0) {
      return {
        score: regionalScore,
        reason: `Great location nearby`
      };
    }

    return { score: 0.3, reason: `New destination to explore` };
  }

  private calculateVibeScore(festival: Festival): { score: number; reason: string } {
    if (!this.userProfile) return { score: 0, reason: '' };

    const userVibes = this.userProfile.preferredVibes.map(v => v.toLowerCase());
    const festivalVibe = festival.vibe?.toLowerCase() || '';

    if (userVibes.includes(festivalVibe)) {
      return {
        score: 1.0,
        reason: `Perfect vibe match`
      };
    }

    return { score: 0.5, reason: `Different vibe to explore` };
  }

  private calculatePopularityScore(festival: Festival): { score: number; reason: string } {
    // Simulate popularity based on rating and trending factors
    const popularityScore = (festival.rating || 4.0) / 5.0;
    
    if (popularityScore >= 0.9) {
      return {
        score: 1.0,
        reason: `Legendary festival experience`
      };
    } else if (popularityScore >= 0.8) {
      return {
        score: 0.8,
        reason: `Highly rated by festival-goers`
      };
    }

    return { score: 0.6, reason: `Rising festival to discover` };
  }

  private getGenreSimilarity(festivalGenre: string, userGenres: string[]): number {
    // Genre similarity matrix (simplified)
    const similarities: { [key: string]: string[] } = {
      'electronic': ['edm', 'techno', 'house', 'trance'],
      'rock': ['indie', 'alternative', 'metal'],
      'pop': ['indie', 'alternative'],
      'hip-hop': ['r&b', 'rap'],
      'indie': ['alternative', 'rock', 'pop']
    };

    for (const userGenre of userGenres) {
      if (similarities[userGenre]?.includes(festivalGenre) || 
          similarities[festivalGenre]?.includes(userGenre)) {
        return 0.7;
      }
    }

    return 0;
  }

  private getRegionalProximity(festivalCountry: string, userCountries: string[]): number {
    // Regional groupings for proximity scoring
    const regions: { [key: string]: string[] } = {
      'europe': ['uk', 'germany', 'france', 'spain', 'italy', 'netherlands', 'belgium'],
      'north_america': ['usa', 'canada', 'mexico'],
      'asia': ['japan', 'south korea', 'thailand', 'singapore']
    };

    for (const [_region, countries] of Object.entries(regions)) {
      if (countries.includes(festivalCountry)) {
        const hasUserCountryInRegion = userCountries.some(uc => countries.includes(uc));
        if (hasUserCountryInRegion) return 0.7;
      }
    }

    return 0;
  }

  private categorizeRecommendations(recommendations: SmartRecommendation[]): SmartRecommendation[] {
    return recommendations.map(rec => {
      if (rec.score >= 0.8 && rec.confidence >= 0.7) {
        return { ...rec, category: 'perfect' };
      } else if (rec.score >= 0.6) {
        return { ...rec, category: 'great' };
      } else {
        return { ...rec, category: 'explore' };
      }
    });
  }

  private ensureDiversity(recommendations: SmartRecommendation[]): SmartRecommendation[] {
    // Ensure diversity in genres, locations, price points
    const diverse: SmartRecommendation[] = [];
    const usedGenres = new Set<string>();
    const usedCountries = new Set<string>();

    for (const rec of recommendations) {
      const genre = rec.festival.genre;
      const country = rec.festival.country;

      // Always include perfect matches
      if (rec.category === 'perfect') {
        diverse.push(rec);
        usedGenres.add(genre);
        usedCountries.add(country);
        continue;
      }

      // Ensure diversity for other categories
      if (!usedGenres.has(genre) || !usedCountries.has(country) || diverse.length < 6) {
        diverse.push(rec);
        usedGenres.add(genre);
        usedCountries.add(country);
      }

      if (diverse.length >= 12) break;
    }

    return diverse;
  }

  private getFallbackRecommendations(limit: number): SmartRecommendation[] {
    // Return popular festivals when no user profile exists
    return this.festivals
      .sort((a, b) => (b.rating || 4.0) - (a.rating || 4.0))
      .slice(0, limit)
      .map(festival => this.getBasicRecommendation(festival));
  }

  private getBasicRecommendation(festival: Festival): SmartRecommendation {
    return {
      festival,
      score: (festival.rating || 4.0) / 5.0,
      confidence: 0.5,
      reasons: [{
        type: 'popularity',
        strength: (festival.rating || 4.0) / 5.0,
        explanation: 'Popular choice',
        color: 'bg-gray-100 text-gray-800'
      }],
      category: 'explore'
    };
  }

  private loadUserProfile(): void {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage?.getItem('festiwise_user_profile') : null;
      if (stored) {
        this.userProfile = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load user profile:', error);
    }
  }

  private saveUserProfile(profile: UserProfile): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage?.setItem('festiwise_user_profile', JSON.stringify(profile));
      }
    } catch (error) {
      console.warn('Failed to save user profile:', error);
    }
  }
}

interface SmartRecommendationCardProps {
  recommendation: SmartRecommendation;
  onView: (festivalId: string) => void;
}

export function SmartRecommendationCard({ recommendation, onView }: SmartRecommendationCardProps) {
  const { festival, score, reasons, category } = recommendation;

  const categoryConfig = {
    perfect: { color: 'from-green-500 to-emerald-600', emoji: '🎯', label: 'Perfect Match' },
    great: { color: 'from-blue-500 to-indigo-600', emoji: '⭐', label: 'Great Choice' },
    explore: { color: 'from-purple-500 to-pink-600', emoji: '🚀', label: 'Worth Exploring' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Category Badge */}
      <div className={`bg-gradient-to-r ${categoryConfig[category].color} p-3 text-white`}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            {categoryConfig[category].emoji} {categoryConfig[category].label}
          </span>
          <span className="text-sm opacity-90">
            {Math.round(score * 100)}% match
          </span>
        </div>
      </div>

      {/* Festival Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{festival.name}</h3>
        <p className="text-gray-600 mb-4">{festival.location} • {festival.month}</p>

        {/* AI Reasoning */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Why this matches you:</h4>
          <div className="flex flex-wrap gap-2">
            {reasons.map((reason, index) => (
              <Badge
                key={index}
                variant="default"
                className={`${reason.color} text-xs`}
              >
                {reason.explanation}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={() => onView(festival.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
        >
          View Festival Details
        </motion.button>
      </div>
    </motion.div>
  );
}

export { AIRecommendationEngine };
export type { SmartRecommendation, UserProfile, Festival };
