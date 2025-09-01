// components/Analytics/EventTracking.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Window interface is already declared in global.d.ts

// Core Analytics Events for FestiWise
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
    });
  }
  
  // Also send to custom analytics if needed
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventName,
        parameters,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        userAgent: navigator.userAgent,
      }),
    }).catch(console.error);
  }
};

// Specific tracking functions
export const festivalTracking = {
  // Festival Discovery & Browsing
  viewFestival: (festivalId: string, festivalName: string, source: string) => {
    trackEvent('view_festival', {
      festival_id: festivalId,
      festival_name: festivalName,
      source, // 'search', 'browse', 'recommendation', 'direct'
    });
  },
  
  viewFestivalList: (filters: Record<string, any>, resultCount: number) => {
    trackEvent('view_festival_list', {
      filters,
      result_count: resultCount,
      filter_count: Object.keys(filters).length,
    });
  },
  
  searchFestivals: (query: string, resultCount: number) => {
    trackEvent('search_festivals', {
      search_term: query,
      result_count: resultCount,
    });
  },
  
  filterChange: (filterType: string, filterValue: string, resultCount: number) => {
    trackEvent('filter_change', {
      filter_type: filterType, // 'genre', 'country', 'month', 'price'
      filter_value: filterValue,
      result_count: resultCount,
    });
  },
  
  // User Engagement
  saveFestival: (festivalId: string, festivalName: string) => {
    trackEvent('save_festival', {
      festival_id: festivalId,
      festival_name: festivalName,
    });
  },
  
  unsaveFestival: (festivalId: string, festivalName: string) => {
    trackEvent('unsave_festival', {
      festival_id: festivalId,
      festival_name: festivalName,
    });
  },
  
  shareFestival: (festivalId: string, platform: string) => {
    trackEvent('share_festival', {
      festival_id: festivalId,
      platform, // 'facebook', 'twitter', 'whatsapp', 'copy_link'
    });
  },
  
  // Quiz & Recommendations
  startQuiz: () => {
    trackEvent('start_quiz', {});
  },
  
  completeQuiz: (answers: Record<string, any>, recommendationCount: number) => {
    trackEvent('complete_quiz', {
      answers,
      recommendation_count: recommendationCount,
      completion_time: Date.now(), // You'd track start time too
    });
  },
  
  viewQuizResults: (recommendationCount: number) => {
    trackEvent('view_quiz_results', {
      recommendation_count: recommendationCount,
    });
  },
  
  // Ticket & Conversion Intent
  clickTickets: (festivalId: string, festivalName: string, ticketUrl: string) => {
    trackEvent('click_tickets', {
      festival_id: festivalId,
      festival_name: festivalName,
      ticket_url: ticketUrl,
      value: 1, // For conversion tracking
    });
  },
  
  clickWebsite: (festivalId: string, festivalName: string, websiteUrl: string) => {
    trackEvent('click_website', {
      festival_id: festivalId,
      festival_name: festivalName,
      website_url: websiteUrl,
    });
  },
  
  // Newsletter & Engagement
  subscribeNewsletter: (source: string, interests: string[]) => {
    trackEvent('subscribe_newsletter', {
      source, // 'header', 'footer', 'quiz_result', 'festival_page'
      interests,
    });
  },
  
  // Navigation & UX
  viewMode: (mode: string) => {
    trackEvent('change_view_mode', {
      view_mode: mode, // 'grid', 'list', 'map'
    });
  },
  
  sortChange: (sortBy: string) => {
    trackEvent('change_sort', {
      sort_by: sortBy, // 'name', 'price', 'date', 'popularity'
    });
  },
  
  // Performance Tracking
  pageLoadTime: (loadTime: number) => {
    trackEvent('page_load_time', {
      load_time: loadTime,
      page_type: 'festival_list', // or 'festival_detail', 'quiz', etc.
    });
  },
  
  searchTime: (searchTime: number, resultCount: number) => {
    trackEvent('search_performance', {
      search_time: searchTime,
      result_count: resultCount,
    });
  },
};

// Page view tracking component
export default function EventTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: pathname,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// Hook for easy tracking in components
export const useAnalytics = () => {
  return {
    track: trackEvent,
    festival: festivalTracking,
  };
};
