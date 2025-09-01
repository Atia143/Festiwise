# Festival Matching Algorithm Documentation

## Overview

Our festival matching algorithm is designed to connect users with their ideal festival experiences by analyzing multiple factors and user preferences. This document explains how the algorithm works and how we calculate compatibility scores.

## Core Components

### 1. User Preferences Collection

The algorithm collects user preferences through a multi-step quiz that gathers information about:

- Music genre preferences
- Budget constraints
- Preferred months
- Geographic preferences
- Festival size preferences
- Additional amenities importance

### 2. Weighting System

Different factors are weighted based on their importance:

- Genre Match: 35%
- Budget Compatibility: 25%
- Date/Month Preference: 20%
- Location Match: 15%
- Additional Factors: 5%

### 3. Scoring Methodology

#### Genre Matching (35%)
- Direct matches between user preferences and festival genres
- Consideration of genre importance levels specified by users
- Weighted scoring based on primary vs secondary genre preferences

#### Budget Compatibility (25%)
- Comparison of user's budget range with festival costs
- Flexibility factor consideration
- Additional costs estimation (travel, accommodation)

#### Date/Month Preference (20%)
- Season/month availability matching
- Duration flexibility
- Weather considerations

#### Location Match (15%)
- Geographic distance calculation
- Travel accessibility
- Regional preferences

#### Additional Factors (5%)
- Festival size
- Camping/accommodation options
- Special features (workshops, art installations, etc.)

## Implementation Details

```typescript
interface MatchScore {
  total: number;
  genreScore: number;
  budgetScore: number;
  dateScore: number;
  locationScore: number;
  additionalScore: number;
}

interface UserPreferences {
  genres: string[];
  genreImportance: number;
  budget: {
    min: number;
    max: number;
  };
  budgetFlexibility: number;
  months: string[];
  location: string;
  additionalPreferences: {
    size: string;
    camping: boolean;
    // other preferences
  };
}

function calculateMatchScore(
  festival: Festival,
  preferences: UserPreferences
): MatchScore {
  // Implementation details in src/utils/match.ts
}
```

## Matching Process

1. User completes the quiz
2. Preferences are normalized and weighted
3. Each festival in the database is scored
4. Results are sorted by total score
5. Top matches are returned with detailed compatibility breakdown

## Adding New Festivals

When adding new festivals to the database, ensure:

1. Complete genre tagging
2. Accurate price ranges
3. Detailed location data
4. Comprehensive amenities list
5. Up-to-date scheduling information

## Future Improvements

- Machine learning integration for better personalization
- Historical attendance patterns analysis
- Weather pattern consideration
- Transportation difficulty scoring
- Social preferences integration
