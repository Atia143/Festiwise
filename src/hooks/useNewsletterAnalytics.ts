'use client';

import { useState, useCallback } from 'react';
import { trackEmailOptIn } from '@/lib/analytics-tracker';

/**
 * Custom hook to handle newsletter subscriptions with analytics tracking
 */
export function useNewsletterAnalytics() {
  const [submissionState, setSubmissionState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Handle newsletter submission
  const handleNewsletterSubmit = useCallback(async (
    email: string, 
    placement: 'hero' | 'footer' | 'popup' | 'quiz-results' | 'other',
    submitFunc: (email: string) => Promise<{success: boolean}>
  ) => {
    setSubmissionState('loading');
    
    try {
      const result = await submitFunc(email);
      
      if (result.success) {
        setSubmissionState('success');
        trackEmailOptIn(placement, 'success');
        
        // Store in local storage to avoid showing popups again
        if (typeof window !== 'undefined') {
          localStorage.setItem('newsletter-subscribed', 'true');
          localStorage.setItem('newsletter-email', email);
        }
        
        return true;
      } else {
        setSubmissionState('error');
        trackEmailOptIn(placement, 'error');
        return false;
      }
    } catch (error) {
      setSubmissionState('error');
      trackEmailOptIn(placement, 'error');
      return false;
    }
  }, []);
  
  // Reset submission state
  const resetSubmissionState = useCallback(() => {
    setSubmissionState('idle');
  }, []);

  return {
    submissionState,
    handleNewsletterSubmit,
    resetSubmissionState
  };
}
