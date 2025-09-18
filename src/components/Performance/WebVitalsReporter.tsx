'use client';

import { useEffect } from 'react';

export default function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;

    // Simple performance monitoring without web-vitals dependency
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Report to analytics if available
        if ((window as any).gtag && entry.entryType === 'navigation') {
          const navigation = entry as PerformanceNavigationTiming;
          (window as any).gtag('event', 'page_timing', {
            event_category: 'Performance',
            page_load_time: Math.round(navigation.loadEventEnd - navigation.fetchStart),
            dom_content_loaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.error('Performance observer failed:', error);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}