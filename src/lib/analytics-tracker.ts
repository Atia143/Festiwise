'use client';

/**
 * FestiWise Analytics Tracker - Comprehensive User Journey Tracking
 * 
 * This module provides a robust analytics implementation to track the complete
 * user journey from landing page view to quiz completion, match viewing, outbound clicks
 * and email opt-ins as specified in the analytics implementation plan.
 * 
 * Supports multiple analytics providers:
 * - Google Analytics 4 (GA4)
 * - Vercel Analytics 
 * - PostHog (can be enabled)
 */

type AnalyticsParams = Record<string, any>;

/**
 * Core analytics tracking function that sends events to all configured analytics providers
 */
export const trackEvent = (eventName: string, parameters: AnalyticsParams = {}): void => {
  // Add common parameters to all events
  const enrichedParams = {
    ...parameters,
    timestamp: new Date().toISOString(),
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    device: getDeviceInfo(),
    country: parameters.country || getCountryInfo(),
  };

  // 1. Track in Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, enrichedParams);
  }

  // 2. Track in Vercel Analytics
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', {
      name: eventName,
      ...enrichedParams
    });
  }

  // 3. Send to custom analytics API (e.g. PostHog or custom backend)
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventName,
        parameters: enrichedParams,
        timestamp: new Date().toISOString(),
        page: typeof window !== 'undefined' ? window.location.pathname : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      }),
    }).catch(console.error);
  }

  // Log in development for easy debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, enrichedParams);
  }
};

/**
 * 1. Core Event Tracking (Highest Priority)
 */

/**
 * Track a page view when user lands on any page
 * @param referrer - The referring URL or source
 * @param utmParams - UTM parameters if available
 */
export const trackLandingPageView = (
  referrer: string = typeof document !== 'undefined' ? document.referrer : '',
  utmParams: Record<string, string> = getUtmParams()
): void => {
  trackEvent('landing_page_view', {
    referrer,
    ...utmParams,
    device: getDeviceInfo(),
    country: getCountryInfo(),
  });
};

/**
 * Track when a user starts the quiz
 * @param source - Where the user initiated the quiz from (home, browse, other)
 */
export const trackQuizStart = (source: 'home' | 'browse' | 'other' = 'other'): void => {
  trackEvent('quiz_start', {
    source,
    device: getDeviceInfo(),
    country: getCountryInfo(),
  });
};

/**
 * Track when a user completes the quiz
 * @param timeToCompleteInSec - How long it took to complete the quiz in seconds
 * @param numQuestions - Number of questions answered
 */
export const trackQuizComplete = (timeToCompleteInSec: number, numQuestions: number): void => {
  trackEvent('quiz_complete', {
    time_to_complete_sec: timeToCompleteInSec,
    num_questions: numQuestions,
    device: getDeviceInfo(),
    country: getCountryInfo(),
  });
};

/**
 * Track when a user views their festival matches
 * @param numMatches - Number of matches shown
 * @param topMatchId - ID of the top match
 * @param topMatchScore - Score of the top match
 */
export const trackMatchView = (numMatches: number, topMatchId: string, topMatchScore: number): void => {
  trackEvent('match_view', {
    num_matches: numMatches,
    top_match_id: topMatchId,
    top_match_score: topMatchScore,
    device: getDeviceInfo(),
  });
};

/**
 * Track when a user clicks an outbound link to a festival's official page
 * @param festivalId - ID of the festival
 * @param destinationUrl - URL being navigated to
 * @param matchScore - Match score for this festival (if applicable)
 */
export const trackOutboundClick = (
  festivalId: string, 
  destinationUrl: string, 
  matchScore?: number
): void => {
  trackEvent('outbound_click', {
    festival_id: festivalId,
    destination_url: destinationUrl,
    match_score: matchScore,
    device: getDeviceInfo(),
  });
};

/**
 * Track when a user submits their email to opt-in
 * @param placement - Where the form is placed (hero, footer, popup, quiz-results)
 * @param status - Whether the submission was successful
 */
export const trackEmailOptIn = (
  placement: 'hero' | 'footer' | 'popup' | 'quiz-results' | 'other',
  status: 'success' | 'error'
): void => {
  trackEvent('email_opt_in', {
    placement,
    status,
    device: getDeviceInfo(),
  });
};

/**
 * 3. Secondary Events (Optional, for deeper insights)
 */

/**
 * Track when a user applies filters on the Browse Festivals page
 * @param filters - The filters that were applied
 */
export const trackBrowseFilterUse = (filters: {
  genre?: string[],
  budget_min?: number,
  budget_max?: number,
  travel_time?: string
}): void => {
  trackEvent('browse_filter_use', {
    ...filters,
    device: getDeviceInfo(),
  });
};

/**
 * Track when a user saves a festival to their list
 * @param festivalId - ID of the saved festival
 */
export const trackFestivalSave = (festivalId: string): void => {
  trackEvent('festival_save', {
    festival_id: festivalId,
    device: getDeviceInfo(),
  });
};

/**
 * Blog Page Event Tracking
 */

/**
 * Track when a user clicks a "Take Quiz" button
 * @param page_section - The section of the blog page where the button was clicked
 */
export const trackTakeQuiz = (page_section: string): void => {
  trackEvent('click_take_quiz', {
    page_section,
    device: getDeviceInfo(),
  });
};

/**
 * Track when a user clicks "Read Full Story" link
 * @param post_id - ID/slug of the blog post
 * @param tag_list - List of tags associated with the post
 */
export const trackReadFullStory = (post_id: string, tag_list: string[]): void => {
  trackEvent('click_read_full_story', {
    page_section: 'blog',
    post_id,
    tag_list: tag_list.join(','),
    device: getDeviceInfo(),
  });
};

/**
 * Track when a user starts the newsletter subscription process
 * @param page_section - The section of the blog page where the form is located
 */
export const trackSubscribeStart = (page_section: string): void => {
  trackEvent('subscribe_start', {
    page_section,
    device: getDeviceInfo(),
  });
};

/**
 * Track when a user successfully subscribes to the newsletter
 * @param page_section - The section of the blog page where the form is located
 */
export const trackSubscribeSuccess = (page_section: string): void => {
  trackEvent('subscribe_success', {
    page_section,
    device: getDeviceInfo(),
  });
};

/**
 * Track when a user changes a filter on the blog page
 * @param filter_type - The type of filter (category, sort)
 * @param value - The selected value
 */
export const trackFilterChange = (filter_type: 'category' | 'sort' | 'tag', value: string): void => {
  trackEvent('filter_change', {
    page_section: 'blog',
    filter_type,
    value,
    device: getDeviceInfo(),
  });
};

/**
 * Track when a user clicks on share button
 * @param method - The sharing method used (social platform, copy link, etc)
 */
export const trackShareClick = (method: string): void => {
  trackEvent('share_click', {
    page_section: 'blog',
    method,
    device: getDeviceInfo(),
  });
};

/**
 * Helper functions
 */

// Get device information
function getDeviceInfo(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}

// Get country information (simplified - would use IP geolocation in production)
function getCountryInfo(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  
  try {
    // This is a simplified version - in a real app, you'd use a geolocation service
    return navigator.language.split('-')[1] || 'unknown';
  } catch {
    return 'unknown';
  }
}

// Extract UTM parameters from URL
function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};
  
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });
  
  return utmParams;
}

// Calculate time to complete in seconds
export function calculateTimeToComplete(startTime: number): number {
  return Math.round((Date.now() - startTime) / 1000);
}

// React hook for easy use within components
import { useCallback, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track page views automatically
  useEffect(() => {
    if (pathname) {
      // Only track landing page view on initial page load
      if (typeof window !== 'undefined' && 
          window.sessionStorage && 
          !window.sessionStorage.getItem('already_tracked_landing')) {
        trackLandingPageView();
        window.sessionStorage.setItem('already_tracked_landing', 'true');
      }
    }
  }, [pathname, searchParams]);
  
  return {
    // Core tracking
    trackLandingPageView,
    trackQuizStart,
    trackQuizComplete,
    trackMatchView,
    trackOutboundClick,
    trackEmailOptIn,
    trackBrowseFilterUse,
    trackFestivalSave,
    calculateTimeToComplete,
    
    // Blog page tracking
    trackTakeQuiz,
    trackReadFullStory,
    trackSubscribeStart,
    trackSubscribeSuccess,
    trackFilterChange,
    trackShareClick,
  };
}
