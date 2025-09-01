# Festival Content Guidelines

## Overview

This document outlines the standards and requirements for adding new festivals to our database. Following these guidelines ensures consistency and quality in our festival recommendations.

## Required Information

### Basic Information
- Festival Name (official name)
- Festival ID (lowercase, hyphenated)
- Location (city, country)
- Dates/Months
- Official Website
- Social Media Links

### Detailed Information
```json
{
  "id": "festival-name",
  "name": "Festival Name",
  "country": "Country Name",
  "city": "City Name",
  "months": ["Month1", "Month2"],
  "genres": ["Primary Genre", "Secondary Genre"],
  "estimated_cost_usd": {
    "min": 1000,
    "max": 2000
  },
  "size": "large|medium|small",
  "amenities": ["camping", "food", "workshops"],
  "official_links": {
    "website": "https://...",
    "instagram": "https://...",
    "twitter": "https://..."
  }
}
```

## Content Quality Standards

### 1. Accuracy
- Verify all information from official sources
- Update prices annually
- Confirm dates as soon as announced
- Cross-reference genre classifications

### 2. Descriptions
- Use clear, concise language
- Avoid promotional language
- Include unique features
- Mention notable historical facts

### 3. Genre Classification
Primary genres must be one of:
- EDM
- Rock
- Hip Hop
- Jazz
- Classical
- World Music
- Metal
- Pop
- Alternative
- Folk

### 4. Size Classification
- Small: < 10,000 attendees
- Medium: 10,000 - 50,000 attendees
- Large: > 50,000 attendees

### 5. Price Ranges
- Include all basic costs
- Specify currency and year
- Note any significant additional costs
- Include different ticket tiers

## Review Process

1. Submit new festival data
2. Peer review for accuracy
3. Data validation check
4. Test matching algorithm
5. Publish to database

## Maintenance

- Review each festival entry annually
- Update prices and dates quarterly
- Verify links monthly
- Add new amenities as they're announced

## Schema Validation

```typescript
interface Festival {
  id: string;
  name: string;
  country: string;
  city: string;
  months: string[];
  genres: string[];
  estimated_cost_usd: {
    min: number;
    max: number;
  };
  size: 'small' | 'medium' | 'large';
  amenities: string[];
  official_links: {
    website: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}
```

## Additional Notes

- Keep all content family-friendly
- Use inclusive language
- Maintain political neutrality
- Focus on factual information
- Include accessibility information when available
