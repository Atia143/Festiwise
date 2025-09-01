'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface AnalyticsConfig {
  gaId?: string;
  enableDebug?: boolean;
  enableEcommerce?: boolean;
  enableConversions?: boolean;
}

interface ConversionEvent {
  eventName: string;
  conversionValue?: number;
  currency?: string;
  items?: any[];
  customParameters?: Record<string, any>;
}

interface UserJourneyStep {
  step: string;
  timestamp: number;
  page: string;
  action: string;
  value?: string | number;
}

class WorldClassAnalytics {
  private config: AnalyticsConfig;
  private userJourney: UserJourneyStep[] = [];
  private sessionStart: number;
  private userId?: string;
  private isInitialized = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.sessionStart = Date.now();
    this.initializeAnalytics();
  }

  private initializeAnalytics() {
    if (typeof window === 'undefined' || this.isInitialized) return;

    // Initialize Google Analytics
    this.initializeGA();
    
    // Track user identification
    this.initializeUserTracking();
    
    // Track scroll depth
    this.initializeScrollTracking();
    
    // Track engagement
    this.initializeEngagementTracking();
    
    // Track errors
    this.initializeErrorTracking();
    
    // Track conversions
    this.initializeConversionTracking();

    this.isInitialized = true;
  }

  private initializeGA() {
    if (!this.config.gaId) return;

    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function(...args: any[]) {
      (window as any).dataLayer.push(args);
    };

    (window as any).gtag('js', new Date());
    (window as any).gtag('config', this.config.gaId, {
      page_title: document.title,
      page_location: window.location.href,
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
      custom_map: {
        custom_parameter_1: 'user_type',
        custom_parameter_2: 'festival_preference',
        custom_parameter_3: 'conversion_source'
      }
    });

    // Enhanced ecommerce
    if (this.config.enableEcommerce) {
      (window as any).gtag('config', this.config.gaId, {
        send_page_view: false // We'll send custom page views
      });
    }
  }

  private initializeUserTracking() {
    // Generate or retrieve user ID
    this.userId = localStorage.getItem('ff_user_id') || this.generateUserId();
    localStorage.setItem('ff_user_id', this.userId);

    // Set user properties
    if (window.gtag) {
      window.gtag('config', this.config.gaId, {
        user_id: this.userId,
        custom_parameters: {
          user_type: this.getUserType(),
          session_start: this.sessionStart,
          returning_user: this.isReturningUser()
        }
      });
    }
  }

  private initializeScrollTracking() {
    let maxScroll = 0;
    const thresholds = [25, 50, 75, 90, 100];
    const reported = new Set<number>();

    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      maxScroll = Math.max(maxScroll, scrollPercent);

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !reported.has(threshold)) {
          reported.add(threshold);
          this.trackEvent('scroll_depth', {
            event_category: 'Engagement',
            event_label: `${threshold}%`,
            value: threshold,
            custom_parameters: {
              page_url: window.location.href,
              scroll_depth: threshold
            }
          });
        }
      });
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
  }

  private initializeEngagementTracking() {
    const startTime = Date.now();
    let isActive = true;
    let totalEngagementTime = 0;

    // Track active time
    const trackEngagement = () => {
      if (isActive) {
        totalEngagementTime += 5000; // 5 second intervals
        
        // Report engagement milestones
        if (totalEngagementTime % 30000 === 0) { // Every 30 seconds
          this.trackEvent('user_engagement', {
            event_category: 'Engagement',
            event_label: 'active_time',
            value: totalEngagementTime / 1000,
            custom_parameters: {
              engagement_time: totalEngagementTime,
              page_url: window.location.href
            }
          });
        }
      }
    };

    // Track when user becomes active/inactive
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        isActive = true;
      }, { passive: true });
    });

    // Track when user becomes inactive
    document.addEventListener('visibilitychange', () => {
      isActive = !document.hidden;
    });

    setInterval(trackEngagement, 5000);
  }

  private initializeErrorTracking() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', {
        event_category: 'Error',
        event_label: event.message,
        custom_parameters: {
          error_message: event.message,
          error_filename: event.filename,
          error_line: event.lineno,
          error_column: event.colno,
          error_stack: event.error?.stack
        }
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('promise_rejection', {
        event_category: 'Error',
        event_label: 'Unhandled Promise Rejection',
        custom_parameters: {
          rejection_reason: event.reason?.toString(),
          page_url: window.location.href
        }
      });
    });
  }

  private initializeConversionTracking() {
    if (!this.config.enableConversions) return;

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const formName = form.name || form.id || 'unknown_form';
      
      this.trackConversion('form_submit', {
        eventName: 'form_submission',
        customParameters: {
          form_name: formName,
          form_action: form.action,
          page_url: window.location.href
        }
      });
    });

    // Track button clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('button, [role="button"], .btn');
      
      if (button) {
        const buttonText = button.textContent?.trim() || 'unknown_button';
        const isConversionButton = this.isConversionButton(buttonText);
        
        if (isConversionButton) {
          this.trackConversion('button_click', {
            eventName: 'conversion_button_click',
            customParameters: {
              button_text: buttonText,
              button_type: this.getButtonType(buttonText),
              page_url: window.location.href
            }
          });
        }
      }
    });
  }

  private generateUserId(): string {
    return 'ff_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private getUserType(): string {
    const visitCount = parseInt(localStorage.getItem('ff_visit_count') || '0') + 1;
    localStorage.setItem('ff_visit_count', visitCount.toString());
    
    if (visitCount === 1) return 'new_user';
    if (visitCount <= 3) return 'returning_user';
    return 'loyal_user';
  }

  private isReturningUser(): boolean {
    return parseInt(localStorage.getItem('ff_visit_count') || '0') > 1;
  }

  private isConversionButton(text: string): boolean {
    const conversionKeywords = [
      'quiz', 'start', 'begin', 'take quiz', 'find festival',
      'subscribe', 'newsletter', 'sign up', 'join',
      'buy', 'purchase', 'ticket', 'book',
      'download', 'guide', 'get guide'
    ];
    
    return conversionKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private getButtonType(text: string): string {
    if (text.toLowerCase().includes('quiz')) return 'quiz_conversion';
    if (text.toLowerCase().includes('newsletter') || text.toLowerCase().includes('subscribe')) return 'email_conversion';
    if (text.toLowerCase().includes('ticket') || text.toLowerCase().includes('buy')) return 'ticket_conversion';
    if (text.toLowerCase().includes('guide') || text.toLowerCase().includes('download')) return 'content_conversion';
    return 'other_conversion';
  }

  // Public methods
  public trackPageView(path: string, title?: string) {
    if (!window.gtag) return;

    window.gtag('config', this.config.gaId, {
      page_title: title || document.title,
      page_location: window.location.href,
      page_path: path,
      custom_parameters: {
        user_type: this.getUserType(),
        session_duration: Date.now() - this.sessionStart,
        journey_step: this.userJourney.length + 1
      }
    });

    // Add to user journey
    this.userJourney.push({
      step: `page_view_${this.userJourney.length + 1}`,
      timestamp: Date.now(),
      page: path,
      action: 'page_view',
      value: title
    });

    if (this.config.enableDebug) {
      console.log('📊 Page View:', { path, title, journey: this.userJourney });
    }
  }

  public trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (!window.gtag) return;

    window.gtag('event', eventName, {
      ...parameters,
      user_id: this.userId,
      session_id: this.sessionStart,
      timestamp: Date.now()
    });

    if (this.config.enableDebug) {
      console.log('📊 Event:', eventName, parameters);
    }
  }

  public trackConversion(conversionType: string, conversion: ConversionEvent) {
    if (!window.gtag) return;

    window.gtag('event', 'conversion', {
      event_category: 'Conversion',
      event_label: conversionType,
      value: conversion.conversionValue || 1,
      currency: conversion.currency || 'USD',
      custom_parameters: {
        conversion_type: conversionType,
        conversion_name: conversion.eventName,
        user_journey_length: this.userJourney.length,
        session_duration: Date.now() - this.sessionStart,
        ...conversion.customParameters
      }
    });

    // Track enhanced ecommerce if enabled
    if (this.config.enableEcommerce && conversion.items) {
      window.gtag('event', 'purchase', {
        transaction_id: this.generateTransactionId(),
        value: conversion.conversionValue,
        currency: conversion.currency || 'USD',
        items: conversion.items
      });
    }

    // Add to user journey
    this.userJourney.push({
      step: `conversion_${conversionType}`,
      timestamp: Date.now(),
      page: window.location.pathname,
      action: 'conversion',
      value: conversion.conversionValue
    });

    if (this.config.enableDebug) {
      console.log('🎯 Conversion:', conversionType, conversion);
    }
  }

  public trackQuizProgress(step: number, totalSteps: number, answers: Record<string, any>) {
    this.trackEvent('quiz_progress', {
      event_category: 'Quiz',
      event_label: `step_${step}`,
      value: Math.round((step / totalSteps) * 100),
      custom_parameters: {
        quiz_step: step,
        quiz_total_steps: totalSteps,
        quiz_progress: Math.round((step / totalSteps) * 100),
        quiz_answers: JSON.stringify(answers)
      }
    });
  }

  public trackQuizCompletion(results: any[], matchScore: number) {
    this.trackConversion('quiz_completion', {
      eventName: 'quiz_completed',
      conversionValue: 10, // Assign value to quiz completion
      customParameters: {
        results_count: results.length,
        top_match_score: matchScore,
        completion_time: Date.now() - this.sessionStart,
        user_journey_length: this.userJourney.length
      }
    });
  }

  private generateTransactionId(): string {
    return 'txn_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  public getUserJourney(): UserJourneyStep[] {
    return [...this.userJourney];
  }

  public getSessionDuration(): number {
    return Date.now() - this.sessionStart;
  }
}

// React Hook for Analytics
export function useWorldClassAnalytics(config: AnalyticsConfig = {}) {
  const analyticsRef = useRef<WorldClassAnalytics | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && !analyticsRef.current) {
      analyticsRef.current = new WorldClassAnalytics({
        gaId: process.env.NEXT_PUBLIC_GA_ID,
        enableDebug: process.env.NODE_ENV === 'development',
        enableEcommerce: true,
        enableConversions: true,
        ...config
      });
    }
  }, [config]);

  // Track page views
  useEffect(() => {
    if (analyticsRef.current) {
      const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      analyticsRef.current.trackPageView(fullPath);
    }
  }, [pathname, searchParams]);

  const trackEvent = useCallback((eventName: string, parameters?: Record<string, any>) => {
    analyticsRef.current?.trackEvent(eventName, parameters);
  }, []);

  const trackConversion = useCallback((conversionType: string, conversion: ConversionEvent) => {
    analyticsRef.current?.trackConversion(conversionType, conversion);
  }, []);

  const trackQuizProgress = useCallback((step: number, totalSteps: number, answers: Record<string, any>) => {
    analyticsRef.current?.trackQuizProgress(step, totalSteps, answers);
  }, []);

  const trackQuizCompletion = useCallback((results: any[], matchScore: number) => {
    analyticsRef.current?.trackQuizCompletion(results, matchScore);
  }, []);

  return {
    trackEvent,
    trackConversion,
    trackQuizProgress,
    trackQuizCompletion
  };
}

export default WorldClassAnalytics;
