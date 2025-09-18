'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Simple analytics component that sends page view data to our internal endpoint
 * This will work even if the user has not consented to cookies/external analytics
 */
function SimpleAnalyticsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Skip during development to avoid skewing metrics
    if (process.env.NODE_ENV === 'development') {
      return;
    }
    
    // Track the pageview
    const track = async () => {
      try {
        // Only track after the page has fully loaded
        if (document.readyState !== 'complete') {
          return;
        }

        const data = {
          page: pathname,
          referrer: document.referrer,
          query: searchParams ? Object.fromEntries(searchParams.entries()) : {},
          language: navigator.language,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          timestamp: new Date().toISOString()
        };
        
        // Use sendBeacon if available for more reliable data collection
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/stats', blob);
        } else {
          // Fallback to fetch
          fetch('/api/analytics/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            // Keep-alive to ensure data is sent even when navigating away
            keepalive: true
          }).catch(err => console.error('Error tracking pageview', err));
        }
      } catch (error) {
        // Silently fail - analytics should never break the app
        console.error('Analytics error:', error);
      }
    };

    // Track immediately if the page is already loaded
    if (document.readyState === 'complete') {
      track();
    } else {
      // Otherwise wait for page load
      window.addEventListener('load', track);
      return () => window.removeEventListener('load', track);
    }
  }, [pathname, searchParams]);

  return null;
}

// Export with Suspense
export default function SimpleAnalytics() {
  return (
    <Suspense fallback={null}>
      <SimpleAnalyticsContent />
    </Suspense>
  );
}
