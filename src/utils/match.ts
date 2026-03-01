export type Festival = {
  id: string;
  name: string;
  country: string;
  city: string;
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
  status?: string;
  min_age?: number;
  ticket_official_url?: string;
};

export type QuizInput = {
  preferredGenres: string[];
  monthWindow?: string[];
  maxBudget?: number;
  minBudget?: number;
  audiencePref?: 'intimate' | 'medium' | 'massive' | 'any';
  duration?: 'day' | 'weekend' | 'week+';
  familyFriendly?: boolean | 'any';
  wantsCamping?: boolean | 'any';
  weatherLikes?: string[];
  regions?: string[];
  // New fields for preference strength
  genreImportance?: number; // 1-5
  budgetFlexibility?: 'strict' | 'flexible' | 'very flexible';
  dateFlexibility?: 'strict' | 'flexible' | 'very flexible';
};

type MatchResult = {
  festival: Festival;
  score: number;
  normalizedScore: number;
  compatibility: number;
  reasons: string[];
  matchDetails: {
    genreMatch: number;
    budgetMatch: number;
    dateMatch: number;
    locationMatch: number;
    vibeMatch: number;
    amenitiesMatch: number;
  };
};

const WEIGHTS = {
  genre: 30,
  budget: 25,
  dates: 20,
  location: 10,
  vibe: 8,
  amenities: 7,
};

const countryToRegion = (c: string): string => {
  const regions = {
    europe: ['Belgium', 'France', 'Germany', 'UK', 'Netherlands', 'Spain', 'Portugal', 'Italy', 'Poland', 'Czechia', 'Hungary', 'Croatia', 'Serbia', 'Sweden', 'Norway', 'Finland', 'Denmark', 'Switzerland', 'Austria', 'Ireland'],
    usa: ['USA', 'United States', 'United States of America'],
    asia: ['Japan', 'South Korea', 'Thailand', 'Indonesia', 'India'],
    oceania: ['Australia', 'New Zealand'],
    southAmerica: ['Brazil', 'Argentina', 'Chile', 'Colombia'],
  };

  for (const [region, countries] of Object.entries(regions)) {
    if (countries.includes(c)) return region.charAt(0).toUpperCase() + region.slice(1);
  }
  return 'Other';
};

const calculateGenreMatch = (festivalGenres: string[], preferredGenres: string[], importance: number = 3): number => {
  if (!preferredGenres.length) return 0.5; // Neutral score if no preferences

  const overlap = festivalGenres.filter(g => preferredGenres.includes(g)).length;
  const totalGenres = new Set([...festivalGenres, ...preferredGenres]).size;
  const baseScore = overlap / Math.max(preferredGenres.length, 1);
  
  // Apply importance multiplier (1-5 scale)
  return baseScore * (importance / 3);
};

const calculateBudgetMatch = (
  festivalCost: { min: number; max: number },
  userBudget: { min?: number; max?: number },
  flexibility: 'strict' | 'flexible' | 'very flexible' = 'flexible'
): number => {
  if (!userBudget.max && !userBudget.min) return 0.5; // Neutral score if no budget specified

  const flexibilityMultiplier = {
    strict: 0.1,
    flexible: 0.2,
    'very flexible': 0.3,
  };

  const buffer = festivalCost.max * flexibilityMultiplier[flexibility];
  const withinBudget = (
    (userBudget.min ?? 0) <= festivalCost.max + buffer &&
    (userBudget.max ?? Infinity) >= festivalCost.min - buffer
  );

  if (!withinBudget) return 0;

  // Calculate how well it fits within the budget
  const idealPrice = (userBudget.max ?? Infinity) * 0.8; // 80% of max budget is ideal
  const priceScore = 1 - Math.abs(festivalCost.min - idealPrice) / idealPrice;
  
  return Math.max(0.3, Math.min(1, priceScore));
};

const calculateDateMatch = (
  festivalMonths: string[],
  preferredMonths?: string[],
  flexibility: 'strict' | 'flexible' | 'very flexible' = 'flexible'
): number => {
  if (!preferredMonths?.length) return 0.5; // Neutral score if no date preference

  const flexibilityScores = {
    strict: { direct: 1, adjacent: 0.3 },
    flexible: { direct: 1, adjacent: 0.6 },
    'very flexible': { direct: 1, adjacent: 0.8 },
  };

  const scores = festivalMonths.map(month => {
    if (preferredMonths.includes(month)) return flexibilityScores[flexibility].direct;
    
    // Check adjacent months
    const monthIndex = new Date(Date.parse(month + " 1, 2000")).getMonth();
    const adjacentMonths = [
      new Date(2000, monthIndex - 1).toLocaleString('default', { month: 'long' }),
      new Date(2000, monthIndex + 1).toLocaleString('default', { month: 'long' }),
    ];
    
    if (adjacentMonths.some(m => preferredMonths.includes(m))) {
      return flexibilityScores[flexibility].adjacent;
    }
    
    return 0;
  });

  return Math.max(...scores, 0);
};

export function matchFestivals(
  festivals: Festival[],
  quiz: QuizInput,
  maxResults: number = 50
): MatchResult[] {
  // Development logging disabled for production
  /*
  console.log('matchFestivals input:', { 
    quiz, 
    festivalCount: festivals.length,
    hasGenres: !!quiz.preferredGenres?.length,
    hasMonths: !!quiz.monthWindow?.length,
    hasBudget: !!(quiz.maxBudget || quiz.minBudget)
  });
  */
  
  const results: MatchResult[] = festivals.map(festival => {
    // Initialize match details
    const matchDetails = {
      genreMatch: calculateGenreMatch(festival.genres, quiz.preferredGenres, quiz.genreImportance),
      budgetMatch: calculateBudgetMatch(
        festival.estimated_cost_usd,
        { min: quiz.minBudget, max: quiz.maxBudget },
        quiz.budgetFlexibility
      ),
      dateMatch: calculateDateMatch(festival.months, quiz.monthWindow, quiz.dateFlexibility),
      locationMatch: quiz.regions?.includes('Anywhere') || quiz.regions?.includes(countryToRegion(festival.country)) ? 1 : 0,
      vibeMatch: quiz.audiencePref === 'any' ? 0.5 :
        festival.audience_size === quiz.audiencePref ? 1 : 0,
      amenitiesMatch: calculateAmenitiesMatch(festival, quiz),
    };

    // Calculate weighted score
    const weightedScore = Object.entries(WEIGHTS).reduce((score, [key, weight]) => {
      return score + (matchDetails[key + 'Match' as keyof typeof matchDetails] * weight);
    }, 0);

    // Normalize score to 0-100 range
    const normalizedScore = (weightedScore / Object.values(WEIGHTS).reduce((a, b) => a + b)) * 100;
    
    // Calculate compatibility percentage (considering only relevant criteria)
    const relevantCriteria = Object.entries(matchDetails).filter(([_, value]) => value !== 0.5);
    const compatibility = relevantCriteria.length ? 
      (relevantCriteria.reduce((sum, [_, value]) => sum + value, 0) / relevantCriteria.length) * 100 :
      0;

    const reasons = generateMatchReasons(festival, matchDetails, quiz);

    return {
      festival,
      score: weightedScore,
      normalizedScore: Math.round(normalizedScore),
      compatibility: Math.round(compatibility),
      reasons,
      matchDetails,
    };
  });

  // Sort by score and return top matches
  return results
    .sort((a, b) => b.normalizedScore - a.normalizedScore)
    .slice(0, maxResults);
}

function calculateAmenitiesMatch(festival: Festival, quiz: QuizInput): number {
  let matches = 0;
  let total = 0;

  if (quiz.wantsCamping !== 'any') {
    total++;
    if ((quiz.wantsCamping && festival.camping) || (!quiz.wantsCamping && !festival.camping)) {
      matches++;
    }
  }

  if (quiz.familyFriendly !== 'any') {
    total++;
    if (festival.family_friendly === quiz.familyFriendly) {
      matches++;
    }
  }

  return total === 0 ? 0.5 : matches / total;
}

function generateMatchReasons(
  festival: Festival,
  matchDetails: MatchResult['matchDetails'],
  quiz: QuizInput
): string[] {
  const reasons: string[] = [];

  if (matchDetails.genreMatch > 0.7) {
    const matchedGenres = festival.genres.filter(g => quiz.preferredGenres.includes(g));
    reasons.push(`Strong genre match: ${matchedGenres.join(', ')}`);
  }

  if (matchDetails.budgetMatch > 0.8) {
    reasons.push(`Excellent budget fit: $${festival.estimated_cost_usd.min}-${festival.estimated_cost_usd.max}`);
  } else if (matchDetails.budgetMatch > 0.5) {
    reasons.push(`Within your budget range`);
  }

  if (matchDetails.dateMatch > 0.7) {
    reasons.push(`Perfect timing: ${festival.months.join(', ')}`);
  }

  if (matchDetails.locationMatch > 0) {
    reasons.push(`Located in your preferred region: ${countryToRegion(festival.country)}`);
  }

  if (matchDetails.vibeMatch > 0.7) {
    reasons.push(`Matches your preferred atmosphere: ${festival.audience_size} festival`);
  }

  if (matchDetails.amenitiesMatch > 0.7) {
    const amenities = [];
    if (festival.camping) amenities.push('camping available');
    if (festival.glamping) amenities.push('glamping available');
    if (festival.family_friendly) amenities.push('family-friendly');
    reasons.push(`Offers desired amenities: ${amenities.join(', ')}`);
  }

  return reasons;
}

