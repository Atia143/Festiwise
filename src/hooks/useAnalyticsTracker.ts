interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export function useAnalyticsTracker() {
  const trackEvent = (category: string, action: string, properties: Record<string, any> = {}) => {
    if (typeof window === 'undefined') return;

    // Track with Google Analytics
    if ('gtag' in window) {
      (window as any).gtag('event', action, {
        event_category: category,
        ...properties
      });
    }

    // You can add more analytics providers here
    // For example: Mixpanel, Amplitude, etc.
  };

  return {
    trackEvent
  };
}