// Enhanced analytics system with GA4 integration
'use client';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

interface QuizAnalytics {
  quiz_start: {
    source: string;
    user_id?: string;
  };
  quiz_complete: {
    duration_seconds: number;
    answers_count: number;
    top_genre: string;
    top_region: string;
    budget_range: string;
  };
  quiz_abandon: {
    step: number;
    duration_seconds: number;
  };
}

interface FilterAnalytics {
  filter_apply: {
    filter_type: 'genre' | 'country' | 'month' | 'budget' | 'search';
    filter_value: string;
    results_count: number;
  };
  filter_clear: {
    previous_filters_count: number;
  };
}

interface FestivalAnalytics {
  festival_view: {
    festival_id: string;
    festival_name: string;
    source: 'search' | 'quiz' | 'browse' | 'direct';
  };
  festival_click_out: {
    festival_id: string;
    festival_name: string;
    destination: 'official_website' | 'ticket_vendor';
    cost_range: string;
  };
  festival_favorite: {
    festival_id: string;
    festival_name: string;
  };
}

interface ConversionAnalytics {
  subscribe_success: {
    source: 'popup' | 'banner' | 'footer' | 'quiz_result';
    email_domain: string;
  };
  subscribe_attempt: {
    source: 'popup' | 'banner' | 'footer' | 'quiz_result';
  };
}

type AllAnalyticsEvents = QuizAnalytics & FilterAnalytics & FestivalAnalytics & ConversionAnalytics;

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private isInitialized = false;
  private gaId?: string;
  private userId?: string;
  private sessionId: string;
  private sessionStart: number;
  
  private constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.initializeUserId();
  }

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  // Initialize GA4
  initialize(gaId: string = 'G-BDQF8TX7MF'): void {
    if (typeof window === 'undefined') return;
    
    // Initialize in all environments for testing
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('Analytics disabled in development');
    //   return;
    // }

    this.gaId = gaId;
    
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function(...args: any[]) {
      (window as any).dataLayer.push(args);
    };

    (window as any).gtag('js', new Date());
    (window as any).gtag('config', gaId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure'
    });

    this.isInitialized = true;
    if (process.env.NODE_ENV === 'development') {
      console.log('🎭 FestiWise Analytics initialized');
    }
  }

  // Track custom events
  track<T extends keyof AllAnalyticsEvents>(
    eventName: T, 
    parameters: AllAnalyticsEvents[T]
  ) {
    if (typeof window === 'undefined' || !this.isInitialized) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics event (offline):', eventName, parameters);
      }
      return;
    }

    const eventData = {
      ...parameters,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: new Date().toISOString()
    };

    // Send to GA4
    (window as any).gtag?.('event', eventName, eventData);

    // Send to custom analytics endpoint (optional)
    this.sendToCustomEndpoint(eventName, eventData);

    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics event:', eventName, eventData);
    }
  }

  // Page view tracking
  trackPageView(url: string, title: string) {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    (window as any).gtag?.('config', 'GA_MEASUREMENT_ID', {
      page_path: url,
      page_title: title,
      user_id: this.userId,
      session_id: this.sessionId
    });
  }

  // Generic event tracking method for custom events
  trackEvent(eventName: string, parameters: Record<string, any> = {}) {
    if (typeof window === 'undefined' || !this.isInitialized) return;

    (window as any).gtag?.('event', eventName, {
      ...parameters,
      timestamp: Date.now(),
      session_id: this.sessionId,
      user_id: this.userId
    });
  }

  // Quiz flow tracking
  trackQuizStart(source: string = 'direct') {
    this.track('quiz_start', {
      source,
      user_id: this.userId
    });
  }

  trackQuizComplete(duration: number, answers: any) {
    const topGenre = this.getMostCommonValue(answers.genres || []);
    const topRegion = answers.region || 'unknown';
    const budgetRange = this.getBudgetRange(answers.budget);

    this.track('quiz_complete', {
      duration_seconds: Math.round(duration / 1000),
      answers_count: Object.keys(answers).length,
      top_genre: topGenre,
      top_region: topRegion,
      budget_range: budgetRange
    });
  }

  trackQuizAbandon(step: number, duration: number) {
    this.track('quiz_abandon', {
      step,
      duration_seconds: Math.round(duration / 1000)
    });
  }

  // Filter tracking
  trackFilterApply(filterType: string, filterValue: string, resultsCount: number) {
    this.track('filter_apply', {
      filter_type: filterType as any,
      filter_value: filterValue,
      results_count: resultsCount
    });
  }

  trackFilterClear(previousFiltersCount: number) {
    this.track('filter_clear', {
      previous_filters_count: previousFiltersCount
    });
  }

  // Festival tracking
  trackFestivalView(festivalId: string, festivalName: string, source: string) {
    this.track('festival_view', {
      festival_id: festivalId,
      festival_name: festivalName,
      source: source as any
    });
  }

  trackFestivalClickOut(festivalId: string, festivalName: string, destination: string, costRange: string) {
    this.track('festival_click_out', {
      festival_id: festivalId,
      festival_name: festivalName,
      destination: destination as any,
      cost_range: costRange
    });
  }

  trackFestivalFavorite(festivalId: string, festivalName: string) {
    this.track('festival_favorite', {
      festival_id: festivalId,
      festival_name: festivalName
    });
  }

  // Conversion tracking
  trackSubscribeSuccess(source: string, email: string) {
    const emailDomain = email.split('@')[1] || 'unknown';
    this.track('subscribe_success', {
      source: source as any,
      email_domain: emailDomain
    });
  }

  trackSubscribeAttempt(source: string) {
    this.track('subscribe_attempt', {
      source: source as any
    });
  }

  // Funnel analysis
  getFunnelData() {
    if (typeof window === 'undefined') return null;

    const funnelData = {
      session_id: this.sessionId,
      session_duration: Date.now() - this.sessionStart,
      user_id: this.userId,
      pages_viewed: this.getSessionPageViews(),
      events_triggered: this.getSessionEvents()
    };

    return funnelData;
  }

  // Helper methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeUserId() {
    if (typeof window === 'undefined') return;

    let userId = localStorage.getItem('festival_finder_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('festival_finder_user_id', userId);
    }
    this.userId = userId;
  }

  private getMostCommonValue(array: string[]): string {
    if (!array.length) return 'none';
    const counts = array.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  private getBudgetRange(budget: any): string {
    if (!budget || typeof budget !== 'object') return 'unknown';
    const { min, max } = budget;
    if (max <= 500) return 'budget';
    if (max <= 1000) return 'mid-range';
    if (max <= 2000) return 'premium';
    return 'luxury';
  }

  private sendToCustomEndpoint(eventName: string, data: any) {
    // Optional: Send to your own analytics endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ event: eventName, data })
    // }).catch(console.error);
  }

  private getSessionPageViews(): string[] {
    // In a real implementation, you'd track this throughout the session
    return [window.location.pathname];
  }

  private getSessionEvents(): string[] {
    // In a real implementation, you'd track this throughout the session
    return [];
  }
}

// Error logging
export class ErrorLogger {
  static logError(error: Error, context?: string) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
      timestamp: new Date().toISOString()
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorData);
    }

    // Send to error logging service
    this.sendToErrorService(errorData);
  }

  private static sendToErrorService(errorData: any) {
    // Send to service like Sentry, LogRocket, etc.
    // For now, just store in localStorage for debugging
    if (typeof window !== 'undefined') {
      const errors = JSON.parse(localStorage.getItem('festival_finder_errors') || '[]');
      errors.push(errorData);
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      localStorage.setItem('festival_finder_errors', JSON.stringify(errors));
    }
  }
}

export const analytics = AnalyticsManager.getInstance();
export type { QuizAnalytics, FilterAnalytics, FestivalAnalytics, ConversionAnalytics };
