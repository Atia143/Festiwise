'use client';

import { useCallback } from 'react';
import { useToast } from '../components/Toast/ToastProvider';

interface QuizAnalyticsEvent {
  event: 'quiz_started' | 'quiz_step_completed' | 'quiz_completed' | 'quiz_saved' | 'quiz_resumed';
  timestamp: number;
  timeSpent?: number;
  currentStep?: number;
  totalSteps?: number;
  answers?: any;
  sessionId?: string;
}

/**
 * Hook for tracking quiz engagement and analytics
 * Integrates with the app's analytics system
 */
export function useQuizAnalytics() {
  const { addToast } = useToast();

  const trackEvent = useCallback((event: QuizAnalyticsEvent) => {
    try {
      // Send to your analytics service (e.g., GA4, Mixpanel, Segment)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.event, {
          time_spent: event.timeSpent,
          current_step: event.currentStep,
          total_steps: event.totalSteps,
        });
      }

      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Quiz Analytics Event:', event);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, []);

  const trackQuizStart = useCallback(() => {
    trackEvent({
      event: 'quiz_started',
      timestamp: Date.now(),
    });
  }, [trackEvent]);

  const trackStepCompleted = useCallback((step: number, total: number, timeSpent: number) => {
    trackEvent({
      event: 'quiz_step_completed',
      timestamp: Date.now(),
      currentStep: step,
      totalSteps: total,
      timeSpent,
    });
  }, [trackEvent]);

  const trackQuizCompleted = useCallback((totalTimeSpent: number, totalSteps: number) => {
    trackEvent({
      event: 'quiz_completed',
      timestamp: Date.now(),
      timeSpent: totalTimeSpent,
      totalSteps,
    });
    addToast('🎉 Your festival matches are ready!', 'success', 4000);
  }, [trackEvent, addToast]);

  const trackQuizSaved = useCallback(() => {
    trackEvent({
      event: 'quiz_saved',
      timestamp: Date.now(),
    });
    addToast('✓ Quiz progress saved', 'success', 2000);
  }, [trackEvent, addToast]);

  const trackQuizResumed = useCallback(() => {
    trackEvent({
      event: 'quiz_resumed',
      timestamp: Date.now(),
    });
    addToast('✓ Quiz resumed from your last session', 'info', 2000);
  }, [trackEvent, addToast]);

  // Legacy analytics functions for existing components
  const trackMatchResults = useCallback((matches: any[]) => {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'match_results_viewed', {
          match_count: matches.length,
        });
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Match Results Tracked:', matches.length);
      }
    } catch (error) {
      console.error('Error tracking match results:', error);
    }
  }, []);

  const trackFestivalOutboundClick = useCallback((festivalId: string, destinationUrl: string, matchScore?: number) => {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'festival_outbound_click', {
          festival_id: festivalId,
          destination_url: destinationUrl,
          match_score: matchScore,
        });
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Outbound Click Tracked:', festivalId, destinationUrl);
      }
    } catch (error) {
      console.error('Error tracking outbound click:', error);
    }
  }, []);

  return {
    trackEvent,
    trackQuizStart,
    trackStepCompleted,
    trackQuizCompleted,
    trackQuizSaved,
    trackQuizResumed,
    trackMatchResults,
    trackFestivalOutboundClick,
  };
}
