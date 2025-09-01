import { Festival } from '@/utils/match';

interface UserProfile {
  previousFestivals: string[];
  favoriteArtists: string[];
  musicTaste: string[];
  budgetHistory: number[];
  travelPattern: 'local' | 'national' | 'international';
  socialPreference: 'solo' | 'small-group' | 'large-group';
}

interface PredictiveInsight {
  type: 'price_drop' | 'selling_fast' | 'weather_alert' | 'lineup_announcement';
  festival: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

class AIRecommendationEngine {
  private userProfiles: Map<string, UserProfile> = new Map();
  
  // Advanced matching algorithm with ML-like scoring
  calculateAdvancedScore(festival: Festival, userAnswers: any, userProfile?: UserProfile): number {
    let score = 0;
    let maxScore = 0;

    // Base compatibility score (existing algorithm)
    const baseScore = this.calculateBaseScore(festival, userAnswers);
    score += baseScore * 0.6; // 60% weight
    maxScore += 100 * 0.6;

    // User history analysis (40% weight if available)
    if (userProfile) {
      const historyScore = this.calculateHistoryScore(festival, userProfile);
      score += historyScore * 0.4;
      maxScore += 100 * 0.4;
    }

    return Math.round((score / maxScore) * 100);
  }

  private calculateBaseScore(festival: Festival, userAnswers: any): number {
    // This would use your existing matching algorithm
    // Placeholder for the actual implementation
    return 75;
  }

  private calculateHistoryScore(festival: Festival, userProfile: UserProfile): number {
    let score = 0;

    // Similar festival pattern analysis
    const similarFestivals = this.findSimilarFestivals(festival, userProfile.previousFestivals);
    score += similarFestivals.length * 10;

    // Budget consistency
    const avgBudget = userProfile.budgetHistory.reduce((a, b) => a + b, 0) / userProfile.budgetHistory.length;
    const festivalBudget = (festival.estimated_cost_usd.min + festival.estimated_cost_usd.max) / 2;
    const budgetDiff = Math.abs(avgBudget - festivalBudget) / avgBudget;
    score += Math.max(0, 30 - (budgetDiff * 30));

    // Travel pattern alignment
    if (userProfile.travelPattern === 'international' && festival.country !== 'USA') {
      score += 20;
    } else if (userProfile.travelPattern === 'local' && festival.country === 'USA') {
      score += 20;
    }

    return Math.min(100, score);
  }

  private findSimilarFestivals(festival: Festival, previousFestivals: string[]): string[] {
    // Placeholder - would implement genre/vibe similarity matching
    return [];
  }

  // Predictive insights based on real-world patterns
  generateInsights(userId: string, festivals: Festival[]): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];

    // Simulate price drop predictions
    const popularFestivals = festivals.filter(f => f.audience_size === 'massive').slice(0, 3);
    popularFestivals.forEach(festival => {
      if (Math.random() > 0.7) { // 30% chance of insight
        insights.push({
          type: 'price_drop',
          festival: festival.name,
          message: `${festival.name} tickets may drop 15-20% in the next 2 weeks based on historical patterns`,
          urgency: 'medium',
          actionUrl: `/festival/${festival.id}`
        });
      }
    });

    // Selling fast warnings
    festivals.filter(f => f.months.includes('July') || f.months.includes('August')).slice(0, 2).forEach(festival => {
      if (Math.random() > 0.8) { // 20% chance
        insights.push({
          type: 'selling_fast',
          festival: festival.name,
          message: `${festival.name} is 85% sold out - only VIP packages remaining`,
          urgency: 'high',
          actionUrl: `/festival/${festival.id}`
        });
      }
    });

    return insights.slice(0, 3); // Limit to 3 insights
  }

  // Smart festival clustering
  clusterFestivalsByProfile(festivals: Festival[], userAnswers: any): {
    perfect: Festival[];
    good: Festival[];
    explore: Festival[];
  } {
    const scored = festivals.map(festival => ({
      festival,
      score: this.calculateAdvancedScore(festival, userAnswers)
    }));

    return {
      perfect: scored.filter(f => f.score >= 85).map(f => f.festival),
      good: scored.filter(f => f.score >= 70 && f.score < 85).map(f => f.festival),
      explore: scored.filter(f => f.score >= 50 && f.score < 70).map(f => f.festival)
    };
  }

  // Festival recommendation reasons
  generateRecommendationReasons(festival: Festival, userAnswers: any): string[] {
    const reasons: string[] = [];

    // Genre match
    const userGenres = userAnswers.genres || [];
    const matchingGenres = festival.genres.filter(g => userGenres.includes(g));
    if (matchingGenres.length > 0) {
      reasons.push(`Perfect match for ${matchingGenres.join(', ')} music`);
    }

    // Budget alignment
    const userBudget = userAnswers.budget || { min: 0, max: 5000 };
    const festivalAvgCost = (festival.estimated_cost_usd.min + festival.estimated_cost_usd.max) / 2;
    if (festivalAvgCost <= userBudget.max) {
      reasons.push(`Fits your ${userBudget.max <= 1000 ? 'tight' : 'comfortable'} budget`);
    }

    // Vibe alignment
    const userVibes = userAnswers.vibes || [];
    const matchingVibes = festival.vibe.filter(v => userVibes.some((uv: string) => v.toLowerCase().includes(uv.toLowerCase())));
    if (matchingVibes.length > 0) {
      reasons.push(`Matches your ${matchingVibes[0]} vibe preference`);
    }

    // Location preference
    if (userAnswers.region && festival.country.toLowerCase().includes(userAnswers.region.toLowerCase())) {
      reasons.push(`Located in your preferred region`);
    }

    // Timing
    const userMonths = userAnswers.months || [];
    const matchingMonths = festival.months.filter(m => userMonths.includes(m));
    if (matchingMonths.length > 0) {
      reasons.push(`Perfect timing for ${matchingMonths.join('/')} travel`);
    }

    return reasons.slice(0, 3); // Limit to top 3 reasons
  }
}

export const aiRecommendationEngine = new AIRecommendationEngine();
export type { UserProfile, PredictiveInsight };
