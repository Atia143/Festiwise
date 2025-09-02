'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackLandingPageView } from '@/lib/analytics-tracker';

/**
 * ClientAnalytics - Component to initialize and manage analytics tracking
 * 
 * This component handles:
 * - Tracking initial page views
 * - Setting up any necessary analytics providers
 * - Passing UTM parameters and referrer information
 */
export default function ClientAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track landing page view on initial load
  useEffect(() => {
    // Only track on client-side and only once per session
    if (typeof window !== 'undefined') {
      const hasBeenTracked = sessionStorage.getItem('landing_page_tracked');
      
      if (!hasBeenTracked) {
        // Get referrer information
        const referrer = document.referrer;
        
        // Extract UTM parameters
        const utmParams: Record<string, string> = {};
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
          const value = searchParams?.get(param);
          if (value) {
            utmParams[param] = value;
          }
        });
        
        // Track the landing page view
        trackLandingPageView(referrer, utmParams);
        
        // Mark as tracked for this session
        sessionStorage.setItem('landing_page_tracked', 'true');
      }
    }
  }, [searchParams]);
  
  // Track page changes only if consent has been given
  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      // Check for analytics consent
      let hasAnalyticsConsent = false;
      
      try {
        const savedConsent = localStorage.getItem('cookieConsent');
        if (savedConsent) {
          const preferences = JSON.parse(savedConsent);
          hasAnalyticsConsent = preferences.analytics;
        }
      } catch (e) {
        console.error('Error reading consent data', e);
      }
      
      // Only track if consent has been given
      if (hasAnalyticsConsent) {
        // Track in GA4 if available
        if (window.gtag) {
          window.gtag('config', 'G-BDQF8TX7MF', {
            page_path: pathname,
          });
        }
        
        // Track in Vercel Analytics if available
        if ((window as any).va) {
          (window as any).va('page_view');
        }
      }
    }
  }, [pathname]);
  
  return null;
}
