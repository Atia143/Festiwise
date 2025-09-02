# FestiWise Analytics Implementation Guide

This document outlines the complete analytics implementation for tracking the user journey through FestiWise.

## Core Event Tracking Implementation

### 1. Overview

The following events are now fully implemented to track the complete user journey from landing to quiz completion, match viewing, outbound clicks, and email opt-ins:

- `landing_page_view` - Triggers on page load
- `quiz_start` - Triggers when user clicks any "Start Quiz" CTA
- `quiz_complete` - Triggers when user finishes the quiz
- `match_view` - Triggers when user views their festival matches
- `outbound_click` - Triggers when user clicks to visit a festival's official ticket page
- `email_opt_in` - Triggers when user submits email in any form

### 2. Implementation Files

The implementation consists of several core files:

- `/src/lib/analytics-tracker.ts` - The main analytics tracking module
- `/src/hooks/useQuizAnalytics.ts` - Hook for quiz tracking integration
- `/src/hooks/useNewsletterAnalytics.ts` - Hook for newsletter tracking
- `/src/hooks/useNewsletterSignup.ts` - Newsletter form submission with analytics
- `/src/components/Analytics/ClientAnalytics.tsx` - Component for page view tracking

### 3. Analytics Parameters

Each event includes the following parameters:

**Landing Page View:**
```
{
  referrer: string,
  utm_source?: string,
  utm_campaign?: string,
  device: string,
  country: string
}
```

**Quiz Start:**
```
{
  source: 'home' | 'browse' | 'other',
  device: string,
  country: string
}
```

**Quiz Complete:**
```
{
  time_to_complete_sec: number,
  num_questions: number,
  device: string,
  country: string
}
```

**Match View:**
```
{
  num_matches: number,
  top_match_id: string,
  top_match_score: number,
  device: string
}
```

**Outbound Click:**
```
{
  festival_id: string,
  destination_url: string,
  match_score?: number,
  device: string
}
```

**Email Opt-In:**
```
{
  placement: 'hero' | 'footer' | 'popup' | 'quiz-results' | 'other',
  status: 'success' | 'error',
  device: string
}
```

## How to Use the Analytics Implementation

### 1. Page View Tracking

Page views are automatically tracked by the `ClientAnalytics` component which is now included in the root layout.

### 2. Quiz Flow Tracking

Quiz tracking is handled by the `useQuizAnalytics` hook:

```tsx
import { useQuizAnalytics } from '@/hooks/useQuizAnalytics';

function YourQuizComponent() {
  const { trackMatchResults, trackFestivalOutboundClick } = useQuizAnalytics();
  
  // Track when showing festival matches
  useEffect(() => {
    if (matches.length > 0) {
      trackMatchResults(matches);
    }
  }, [matches]);
  
  // Track outbound clicks
  const handleWebsiteClick = (festivalId, url) => {
    trackFestivalOutboundClick(festivalId, url);
  };
}
```

### 3. Email Opt-in Tracking

Email subscriptions are tracked using the `useNewsletterSignup` hook:

```tsx
import useNewsletterSignup from '@/hooks/useNewsletterSignup';

function NewsletterComponent() {
  const { 
    email, 
    setEmail, 
    submissionState, 
    submitNewsletterForm 
  } = useNewsletterSignup({
    placement: 'footer' // or 'hero', 'popup', 'quiz-results', etc.
  });
  
  return (
    <form onSubmit={submitNewsletterForm}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <button type="submit">
        {submissionState === 'loading' ? 'Submitting...' : 'Subscribe'}
      </button>
    </form>
  );
}
```

## Funnel Visualization

The implemented events create a complete funnel for analysis:
1. Landing Page View
2. Quiz Start
3. Quiz Complete
4. Match View
5. Outbound Click
6. Email Opt-In

This data can be viewed in Google Analytics 4 Funnel Exploration reports and in Vercel Analytics.

## Data Validation

To validate the tracking implementation:
1. Open browser developer tools
2. Check the Network tab for analytics requests
3. Filter by `/collect` (GA4) or `/api/analytics` endpoints
4. Verify the payload matches the expected parameters

## Next Steps

- Add custom funnel visualizations in a dashboard
- Implement A/B testing using the analytics data
- Set up automated reports for key conversion metrics
