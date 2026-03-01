// 🎪 Consolidated Festival Types - Single Source of Truth
// Used across the entire application to prevent duplicates

export interface Festival {
  id: string;
  name: string;
  country: string;
  city: string;
  region?: string;
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
  min_age?: number;
  ticket_official_url: string;
}

export interface FestivalMatch {
  festival: Festival;
  score: number;
  reasons: string[];
}

export interface FestivalGridProps {
  festivals: Festival[];
}

export interface FestivalAnalytics {
  festivalId: string;
  views: number;
  clicks: number;
  conversions: number;
  lastUpdated: string;
}

export interface FestivalRecommendation {
  festival: Festival;
  matchScore: number;
  reasons: string[];
  personalizedInsights: string[];
}

// Enhanced types for premium features
export interface EnhancedFestival extends Festival {
  tagline?: string;
  description: string;
  venue?: {
    name: string;
    type: 'outdoor' | 'indoor' | 'mixed';
    capacity: number;
    accessibility: boolean;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  pricing?: {
    currency: string;
    tiers: {
      name: string;
      price: number;
      features: string[];
    }[];
  };
  images?: {
    thumbnail: string;
    hero: string;
    gallery: string[];
  };
}
