// Enhanced Festival Data Model for Better UX and SEO
export interface EnhancedFestival {
  // Core Identity
  id: string;
  name: string;
  tagline?: string;
  description: string;
  
  // Location & Timing
  country: string;
  city: string;
  venue: {
    name: string;
    type: 'outdoor' | 'indoor' | 'mixed';
    capacity: number;
    accessibility: boolean;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  timezone: string;
  dates: {
    year: number;
    start: string; // ISO date
    end: string;   // ISO date
    announced: boolean;
    soldOut: boolean;
  };
  
  // Music & Content
  genres: {
    primary: string[];
    secondary: string[];
  };
  lineup: {
    headliners: string[];
    confirmed: boolean;
    totalArtists: number;
    lastUpdated: string;
  };
  stages: {
    count: number;
    types: ('main' | 'electronic' | 'acoustic' | 'art')[];
  };
  
  // Pricing & Tickets
  pricing: {
    currency: string;
    tiers: {
      name: string;
      price: number;
      available: boolean;
      perks: string[];
    }[];
    fees: {
      booking: number;
      service: number;
    };
    earlyBird?: {
      discount: number;
      deadline: string;
    };
  };
  
  // Accommodation & Travel
  accommodation: {
    camping: {
      available: boolean;
      types: ('basic' | 'comfort' | 'luxury')[];
      included: boolean;
      price?: number;
    };
    glamping?: {
      available: boolean;
      types: string[];
      price: number;
    };
    hotels: {
      nearby: boolean;
      shuttle: boolean;
      avgDistance: number; // km
      avgPrice: number;
    };
  };
  
  // Experience & Demographics
  audience: {
    size: 'small' | 'medium' | 'large' | 'massive';
    ageRange: {
      min: number;
      max: number;
      average: number;
    };
    demographics: {
      local: number;    // percentage
      national: number;
      international: number;
    };
  };
  
  // Features & Services
  features: {
    familyFriendly: boolean;
    accessibility: {
      wheelchair: boolean;
      hearingLoop: boolean;
      signLanguage: boolean;
    };
    sustainability: {
      ecoFriendly: boolean;
      certifications: string[];
      initiatives: string[];
    };
    amenities: {
      foodVendors: number;
      bars: number;
      artInstallations: boolean;
      workshops: boolean;
      wellness: boolean;
    };
  };
  
  // Practical Info
  weather: {
    expected: string[];
    temperature: {
      high: number;
      low: number;
    };
    rainfall: number; // mm
  };
  whatToBring: string[];
  restrictions: string[];
  
  // Business & Marketing
  organizer: {
    name: string;
    website: string;
    social: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
  ticketing: {
    official: string;
    authorized: string[];
    resale: boolean;
  };
  
  // SEO & Content
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    slug: string;
  };
  images: {
    hero: string;
    gallery: string[];
    lineup?: string;
  };
  videos?: {
    trailer?: string;
    aftermovie?: string;
  };
  
  // Reviews & Social Proof
  ratings: {
    overall: number;
    music: number;
    organization: number;
    value: number;
    venue: number;
    totalReviews: number;
  };
  socialProof: {
    attendeeCount: number;
    repeatAttendees: number; // percentage
    testimonials: {
      quote: string;
      author: string;
      year: number;
    }[];
  };
  
  // Status & Updates
  status: 'active' | 'cancelled' | 'postponed' | 'sold-out';
  lastUpdated: string;
  featured: boolean;
  trending: boolean;
}
