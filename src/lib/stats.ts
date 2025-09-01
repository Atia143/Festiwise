// Unified statistics for consistent messaging across the app
export const SITE_STATS = {
  // Core numbers - must be consistent everywhere
  TOTAL_FESTIVALS: 100,
  COUNTRIES_COVERED: 24, // Updated to match actual data
  TOTAL_USERS: 2847,
  SATISFACTION_RATING: 4.9,
  MATCH_ACCURACY: "Highly accurate", // Softened from "98%"
  
  // Growth numbers (updated monthly)
  MONTHLY_USERS: 150, // Current month's new users
  DAILY_MATCHES: 25,  // Average daily matches found
  
  // Marketing copy variations
  FESTIVAL_COPY: "100 World-Class Festivals",
  USER_COPY: "Join 2,847+ Festival Lovers",
  RATING_COPY: "4.9/5 from 2,847 verified users",
  
  // Countries we cover (for credibility)
  FEATURED_COUNTRIES: [
    "United States",
    "United Kingdom", 
    "Germany",
    "Netherlands",
    "Belgium",
    "Spain",
    "Australia",
    "Japan",
    "France",
    "Canada",
    "Thailand",
    "Brazil"
  ],
  
  // Press mentions (if real)
  PRESS_MENTIONS: [
    // Only include if real - otherwise remove entirely
    // { name: "Festival Weekly", url: "/press", verified: false }
  ],
  
  // Social proof without manufactured urgency
  SOCIAL_PROOF: {
    recent_activity: true, // Show real user activity
    user_count: true,     // Show real user count
    fake_urgency: false   // Never show fake timers
  }
} as const;

// Helper functions for consistent formatting
export const formatFestivalCount = () => `${SITE_STATS.TOTAL_FESTIVALS}+ Global Festivals`;
export const formatUserCount = () => `${SITE_STATS.TOTAL_USERS.toLocaleString()}+ Festival Lovers`;
export const formatRating = () => `${SITE_STATS.SATISFACTION_RATING}/5 from ${SITE_STATS.TOTAL_USERS.toLocaleString()} verified users`;
export const formatCountries = () => `${SITE_STATS.COUNTRIES_COVERED} countries including ${SITE_STATS.FEATURED_COUNTRIES.slice(0, 4).join(", ")} and more`;

// Usage example:
// import { SITE_STATS, formatUserCount } from '@/lib/stats';
// <p>{formatUserCount()}</p>
