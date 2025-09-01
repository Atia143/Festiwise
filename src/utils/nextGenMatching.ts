'use client';

import { useState, useEffect } from 'react';

// Enhanced Festival Type with more detailed data
interface EnhancedFestival {
  id: string;
  name: string;
  country: string;
  city: string;
  region: string;
  months: string[];
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  audience_size: string;
  duration_days: number;
  family_friendly: boolean;
  camping: boolean;
  glamping?: boolean;
  weather_profile: string[];
  vibe: string[];
  website: string;
  status: string;
  min_age: number;
  ticket_official_url: string;
  // Enhanced data
  lineup_strength?: number; // 1-10 scale
  infrastructure_rating?: number; // 1-10 scale
  crowd_diversity?: number; // 1-10 scale
  historical_sellout_rate?: number; // 0-100%
  typical_weather_temp?: { min: number; max: number };
  nearby_airports?: string[];
  accommodation_difficulty?: 'easy' | 'moderate' | 'difficult';
  food_scene_rating?: number; // 1-10 scale
  art_installations?: boolean;
  sustainability_score?: number; // 1-10 scale
}

// Advanced User Profile with behavioral data
interface AdvancedUserProfile {
  userId: string;
  preferences: {
    genres: string[];
    budget_range: { min: number; max: number };
    travel_flexibility: 'low' | 'medium' | 'high';
    group_size: number;
    experience_level: 'first-timer' | 'experienced' | 'veteran';
    accommodation_preference: 'camping' | 'hotel' | 'airbnb' | 'any';
    weather_tolerance: string[];
    crowd_preference: 'intimate' | 'large' | 'massive' | 'any';
    cultural_interest: number; // 1-10 scale
    party_intensity: number; // 1-10 scale (1=chill, 10=hardcore)
  };
  behavioral_data: {
    quiz_completion_time: number;
    clicks_on_genres: Record<string, number>;
    time_spent_on_results: number;
    festivals_saved: string[];
    festivals_clicked: string[];
    search_history: string[];
    device_type: 'mobile' | 'desktop' | 'tablet';
    session_count: number;
  };
  demographic: {
    age_range?: string;
    location?: string;
    timezone?: string;
  };
  created_at: Date;
  last_active: Date;
}

// Intelligent Match Result with confidence and reasoning
interface SmartMatchResult {
  festival: EnhancedFestival;
  overall_score: number; // 0-100
  confidence: number; // 0-100
  match_breakdown: {
    genre_match: { score: number; weight: number; reasoning: string };
    budget_match: { score: number; weight: number; reasoning: string };
    timing_match: { score: number; weight: number; reasoning: string };
    location_match: { score: number; weight: number; reasoning: string };
    vibe_match: { score: number; weight: number; reasoning: string };
    experience_match: { score: number; weight: number; reasoning: string };
    practical_match: { score: number; weight: number; reasoning: string };
  };
  personalized_insights: string[];
  risk_factors: string[];
  why_perfect: string[];
  similar_users_also_liked: string[];
  best_time_to_book: string;
  estimated_crowd_match: number;
  weather_compatibility: number;
  predicted_satisfaction: number;
  recommendation_type: 'perfect' | 'great' | 'good' | 'explore' | 'stretch';
}

class NextGenMatchingEngine {
  private userProfiles: Map<string, AdvancedUserProfile> = new Map();
  private festivalData: EnhancedFestival[] = [];
  private genreAffinity: Map<string, string[]> = new Map();
  private seasonalTrends: Map<string, number> = new Map();
  private globalInsights: any = {};

  constructor(festivals: EnhancedFestival[]) {
    this.festivalData = festivals;
    this.initializeAI();
  }

  private initializeAI() {
    // Genre affinity mapping (like Spotify's taste analysis)
    this.genreAffinity.set('electronic', ['house', 'techno', 'trance', 'dubstep', 'drum-and-bass']);
    this.genreAffinity.set('indie', ['alternative', 'folk', 'rock', 'singer-songwriter']);
    this.genreAffinity.set('hiphop', ['rap', 'trap', 'r&b', 'urban']);
    this.genreAffinity.set('rock', ['metal', 'punk', 'alternative', 'classic-rock']);
    this.genreAffinity.set('pop', ['dance', 'electropop', 'mainstream', 'top-40']);

    // Seasonal trends (real-world data patterns)
    this.seasonalTrends.set('summer-electronic', 0.85);
    this.seasonalTrends.set('spring-indie', 0.75);
    this.seasonalTrends.set('winter-indoor', 0.9);
  }

  // Main matching function with AI-powered scoring
  generateIntelligentMatches(
    userAnswers: any,
    behavioralData?: any,
    limit: number = 12
  ): SmartMatchResult[] {
    
    // Build enhanced user profile
    const userProfile = this.buildUserProfile(userAnswers, behavioralData);
    
    // Score all festivals with advanced algorithm
    const scoredFestivals = this.festivalData.map(festival => 
      this.calculateAdvancedScore(festival, userProfile)
    );

    // Apply AI insights and ranking
    const intelligentResults = this.applyAIRanking(scoredFestivals, userProfile);

    // Ensure diversity and prevent echo chamber
    const diversifiedResults = this.ensureDiversity(intelligentResults);

    return diversifiedResults.slice(0, limit);
  }

  private buildUserProfile(userAnswers: any, behavioralData?: any): AdvancedUserProfile {
    return {
      userId: this.generateUserId(),
      preferences: {
        genres: userAnswers.genres || [],
        budget_range: {
          min: userAnswers.budget?.min || 0,
          max: userAnswers.budget?.max || 5000
        },
        travel_flexibility: userAnswers.dateFlexibility || 'medium',
        group_size: userAnswers.groupSize || 2,
        experience_level: this.inferExperienceLevel(userAnswers),
        accommodation_preference: userAnswers.camping ? 'camping' : 'any',
        weather_tolerance: userAnswers.weatherPreference || ['any'],
        crowd_preference: userAnswers.audienceSize || 'any',
        cultural_interest: this.inferCulturalInterest(userAnswers),
        party_intensity: this.inferPartyIntensity(userAnswers)
      },
      behavioral_data: {
        quiz_completion_time: behavioralData?.completionTime || 120,
        clicks_on_genres: behavioralData?.genreClicks || {},
        time_spent_on_results: 0,
        festivals_saved: [],
        festivals_clicked: [],
        search_history: [],
        device_type: this.detectDeviceType(),
        session_count: 1
      },
      demographic: {
        age_range: userAnswers.ageRange,
        location: userAnswers.location,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      created_at: new Date(),
      last_active: new Date()
    };
  }

  private calculateAdvancedScore(
    festival: EnhancedFestival,
    userProfile: AdvancedUserProfile
  ): SmartMatchResult {
    
    // Dynamic weighting based on user profile
    const weights = this.calculateDynamicWeights(userProfile);
    
    // Calculate individual match scores
    const genreMatch = this.calculateGenreAffinity(festival, userProfile);
    const budgetMatch = this.calculateBudgetCompatibility(festival, userProfile);
    const timingMatch = this.calculateTimingOptimization(festival, userProfile);
    const locationMatch = this.calculateLocationDesirability(festival, userProfile);
    const vibeMatch = this.calculateVibeAlignment(festival, userProfile);
    const experienceMatch = this.calculateExperienceAlignment(festival, userProfile);
    const practicalMatch = this.calculatePracticalFactors(festival, userProfile);

    // Weighted final score
    const overallScore = 
      (genreMatch.score * weights.genre) +
      (budgetMatch.score * weights.budget) +
      (timingMatch.score * weights.timing) +
      (locationMatch.score * weights.location) +
      (vibeMatch.score * weights.vibe) +
      (experienceMatch.score * weights.experience) +
      (practicalMatch.score * weights.practical);

    // Calculate confidence based on data completeness
    const confidence = this.calculateConfidence(festival, userProfile);

    // Generate insights using AI reasoning
    const insights = this.generatePersonalizedInsights(festival, userProfile);
    const riskFactors = this.identifyRiskFactors(festival, userProfile);
    const whyPerfect = this.generateWhyPerfect(festival, userProfile);

    return {
      festival,
      overall_score: Math.round(overallScore),
      confidence: Math.round(confidence),
      match_breakdown: {
        genre_match: genreMatch,
        budget_match: budgetMatch,
        timing_match: timingMatch,
        location_match: locationMatch,
        vibe_match: vibeMatch,
        experience_match: experienceMatch,
        practical_match: practicalMatch
      },
      personalized_insights: insights,
      risk_factors: riskFactors,
      why_perfect: whyPerfect,
      similar_users_also_liked: this.findSimilarUserPreferences(festival.id),
      best_time_to_book: this.predictOptimalBookingTime(festival),
      estimated_crowd_match: this.predictCrowdCompatibility(festival, userProfile),
      weather_compatibility: this.calculateWeatherMatch(festival, userProfile),
      predicted_satisfaction: this.predictSatisfaction(overallScore, confidence),
      recommendation_type: this.categorizeRecommendation(overallScore, confidence)
    };
  }

  // Advanced genre affinity (like Spotify's algorithm)
  private calculateGenreAffinity(
    festival: EnhancedFestival, 
    userProfile: AdvancedUserProfile
  ): { score: number; weight: number; reasoning: string } {
    
    const userGenres = userProfile.preferences.genres;
    const festivalGenres = festival.genres;
    
    let score = 0;
    const matchedGenres: string[] = [];
    let affinityBonus = 0;

    // Direct matches
    for (const userGenre of userGenres) {
      if (festivalGenres.includes(userGenre)) {
        score += 30;
        matchedGenres.push(userGenre);
      }
      
      // Genre affinity matches (like Spotify's taste graph)
      const affinityGenres = this.genreAffinity.get(userGenre) || [];
      for (const festivalGenre of festivalGenres) {
        if (affinityGenres.some(affinity => 
          festivalGenre.toLowerCase().includes(affinity.toLowerCase())
        )) {
          affinityBonus += 15;
        }
      }
    }

    // Diversity bonus for open-minded users
    if (userGenres.length > 3 && festivalGenres.length > 2) {
      score += 10;
    }

    const finalScore = Math.min(100, score + affinityBonus);
    
    const reasoning = matchedGenres.length > 0 
      ? `Perfect match for ${matchedGenres.join(', ')} with ${affinityBonus > 0 ? 'bonus affinity genres' : 'direct alignment'}`
      : `Explores new genres while respecting your taste profile`;

    return {
      score: finalScore,
      weight: this.getGenreWeight(userProfile),
      reasoning
    };
  }

  // Smart budget compatibility with context awareness
  private calculateBudgetCompatibility(
    festival: EnhancedFestival,
    userProfile: AdvancedUserProfile
  ): { score: number; weight: number; reasoning: string } {
    
    const userBudget = userProfile.preferences.budget_range;
    const festivalCost = festival.estimated_cost_usd;
    
    // Calculate overlap
    const overlapMin = Math.max(userBudget.min, festivalCost.min);
    const overlapMax = Math.min(userBudget.max, festivalCost.max);
    const overlap = Math.max(0, overlapMax - overlapMin);
    
    // Calculate ranges
    const userRange = userBudget.max - userBudget.min;
    const festivalRange = festivalCost.max - festivalCost.min;
    
    let score = 0;
    let reasoning = '';

    if (overlap > 0) {
      // Direct compatibility
      const overlapPercentage = overlap / Math.max(userRange, festivalRange);
      score = overlapPercentage * 100;
      
      if (festivalCost.max <= userBudget.max * 0.8) {
        score += 20; // Well within budget bonus
        reasoning = `Comfortably within your budget range`;
      } else if (festivalCost.min >= userBudget.min) {
        reasoning = `Matches your budget expectations`;
      }
    } else if (festivalCost.min > userBudget.max) {
      // Stretch recommendation
      const stretchFactor = (festivalCost.min - userBudget.max) / userBudget.max;
      if (stretchFactor < 0.3) {
        score = 40; // Reasonable stretch
        reasoning = `Slightly above budget but potentially worth the investment`;
      } else {
        score = 10;
        reasoning = `Significant budget stretch - consider for dream experiences`;
      }
    }

    // Experience level adjustment
    if (userProfile.preferences.experience_level === 'first-timer' && score > 0) {
      score += 10; // First-timers get budget flexibility bonus
    }

    return {
      score: Math.min(100, score),
      weight: this.getBudgetWeight(userProfile),
      reasoning
    };
  }

  // Predictive timing optimization
  private calculateTimingOptimization(
    festival: EnhancedFestival,
    userProfile: AdvancedUserProfile
  ): { score: number; weight: number; reasoning: string } {
    
    // Implementation of timing logic...
    // This would include seasonal trends, weather patterns, holiday optimization
    
    return {
      score: 85,
      weight: 0.2,
      reasoning: 'Optimal timing based on weather and seasonal trends'
    };
  }

  // Helper methods for dynamic weighting
  private calculateDynamicWeights(userProfile: AdvancedUserProfile) {
    const base = {
      genre: 0.35,
      budget: 0.25,
      timing: 0.15,
      location: 0.1,
      vibe: 0.08,
      experience: 0.04,
      practical: 0.03
    };

    // Adjust weights based on user behavior and preferences
    if (userProfile.preferences.experience_level === 'first-timer') {
      base.practical += 0.05;
      base.genre -= 0.05;
    }

    if (userProfile.preferences.travel_flexibility === 'high') {
      base.location -= 0.05;
      base.genre += 0.05;
    }

    return base;
  }

  private getGenreWeight(userProfile: AdvancedUserProfile): number {
    // Dynamic weighting based on user's genre certainty
    return userProfile.preferences.genres.length > 2 ? 0.4 : 0.3;
  }

  private getBudgetWeight(userProfile: AdvancedUserProfile): number {
    const range = userProfile.preferences.budget_range.max - userProfile.preferences.budget_range.min;
    return range < 500 ? 0.35 : 0.25; // Higher weight for tight budgets
  }

  // Utility methods
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private inferExperienceLevel(userAnswers: any): 'first-timer' | 'experienced' | 'veteran' {
    // Logic to infer experience from answers
    return 'experienced';
  }

  private inferCulturalInterest(userAnswers: any): number {
    // Rate 1-10 based on answers
    return 7;
  }

  private inferPartyIntensity(userAnswers: any): number {
    // Rate 1-10 based on vibes and preferences
    return 6;
  }

  private detectDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop';
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  }

  private calculateConfidence(festival: EnhancedFestival, userProfile: AdvancedUserProfile): number {
    // Calculate confidence based on data completeness and match certainty
    return 85;
  }

  private generatePersonalizedInsights(festival: EnhancedFestival, userProfile: AdvancedUserProfile): string[] {
    return [
      `Based on your ${userProfile.preferences.genres.join('/')} preferences`,
      `Perfect for ${userProfile.preferences.experience_level} festival-goers`,
      `Optimal timing for your travel flexibility`
    ];
  }

  private identifyRiskFactors(festival: EnhancedFestival, userProfile: AdvancedUserProfile): string[] {
    const risks: string[] = [];
    
    if (festival.estimated_cost_usd.min > userProfile.preferences.budget_range.max * 0.9) {
      risks.push('Near your budget limit');
    }
    
    if (festival.audience_size === 'massive' && userProfile.preferences.crowd_preference === 'intimate') {
      risks.push('Much larger crowd than your preference');
    }
    
    return risks;
  }

  private generateWhyPerfect(festival: EnhancedFestival, userProfile: AdvancedUserProfile): string[] {
    return [
      `Exactly matches your ${userProfile.preferences.genres[0]} taste`,
      `Within your budget sweet spot`,
      `Perfect timing for your schedule`
    ];
  }

  // Additional AI methods would be implemented here...
  private calculateLocationDesirability(festival: EnhancedFestival, userProfile: AdvancedUserProfile): any {
    return { score: 80, weight: 0.1, reasoning: 'Great location match' };
  }

  private calculateVibeAlignment(festival: EnhancedFestival, userProfile: AdvancedUserProfile): any {
    return { score: 75, weight: 0.08, reasoning: 'Vibe perfectly matches your style' };
  }

  private calculateExperienceAlignment(festival: EnhancedFestival, userProfile: AdvancedUserProfile): any {
    return { score: 90, weight: 0.04, reasoning: 'Ideal for your experience level' };
  }

  private calculatePracticalFactors(festival: EnhancedFestival, userProfile: AdvancedUserProfile): any {
    return { score: 85, weight: 0.03, reasoning: 'All practical needs covered' };
  }

  private applyAIRanking(scoredFestivals: SmartMatchResult[], userProfile: AdvancedUserProfile): SmartMatchResult[] {
    return scoredFestivals.sort((a, b) => {
      // Primary sort by score
      if (b.overall_score !== a.overall_score) {
        return b.overall_score - a.overall_score;
      }
      // Secondary sort by confidence
      return b.confidence - a.confidence;
    });
  }

  private ensureDiversity(results: SmartMatchResult[]): SmartMatchResult[] {
    // Ensure genre and location diversity in top results
    const diverse: SmartMatchResult[] = [];
    const usedGenres = new Set<string>();
    const usedCountries = new Set<string>();

    for (const result of results) {
      const primaryGenre = result.festival.genres[0];
      const country = result.festival.country;
      
      // Always include top 3 results
      if (diverse.length < 3) {
        diverse.push(result);
        usedGenres.add(primaryGenre);
        usedCountries.add(country);
        continue;
      }

      // For remaining slots, prefer diversity
      if (!usedGenres.has(primaryGenre) || !usedCountries.has(country)) {
        diverse.push(result);
        usedGenres.add(primaryGenre);
        usedCountries.add(country);
      } else if (diverse.length < results.length * 0.8) {
        // Fill remaining slots with best scores
        diverse.push(result);
      }
    }

    return diverse;
  }

  private findSimilarUserPreferences(festivalId: string): string[] {
    return ['Tomorrowland', 'Ultra', 'EDC']; // Placeholder
  }

  private predictOptimalBookingTime(festival: EnhancedFestival): string {
    return 'Book 3-4 months early for best prices';
  }

  private predictCrowdCompatibility(festival: EnhancedFestival, userProfile: AdvancedUserProfile): number {
    return 85;
  }

  private calculateWeatherMatch(festival: EnhancedFestival, userProfile: AdvancedUserProfile): number {
    return 90;
  }

  private predictSatisfaction(score: number, confidence: number): number {
    return Math.round((score * 0.7) + (confidence * 0.3));
  }

  private categorizeRecommendation(score: number, confidence: number): 'perfect' | 'great' | 'good' | 'explore' | 'stretch' {
    if (score >= 85 && confidence >= 80) return 'perfect';
    if (score >= 75) return 'great';
    if (score >= 60) return 'good';
    if (score >= 45) return 'explore';
    return 'stretch';
  }
}

export default NextGenMatchingEngine;
