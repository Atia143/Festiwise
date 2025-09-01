'use client';

import { useEffect, useState, useCallback } from 'react';

// 🚀 Enterprise Analytics Engine
// Zero-cost but enterprise-level tracking like Mixpanel/Amplitude

interface UserJourney {
  sessionId: string;
  userId?: string;
  startTime: number;
  events: AnalyticsEvent[];
  pageViews: PageView[];
  currentPath: string;
  referrer: string;
  userAgent: string;
  deviceInfo: DeviceInfo;
  performance: PerformanceData;
}

interface AnalyticsEvent {
  id: string;
  name: string;
  properties: Record<string, any>;
  timestamp: number;
  page: string;
  userId?: string;
  sessionId: string;
}

interface PageView {
  path: string;
  title: string;
  timestamp: number;
  timeOnPage?: number;
  scrollDepth: number;
  interactions: number;
}

interface DeviceInfo {
  screenWidth: number;
  screenHeight: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  connectionType?: string;
}

interface PerformanceData {
  loadTime: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

interface ConversionFunnel {
  step: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
  avgTimeSpent: number;
}

class EnterpriseAnalytics {
  private journey: UserJourney;
  private sessionStartTime: number;
  private pageStartTime: number;
  private scrollDepth: number = 0;
  private interactions: number = 0;
  private isTracking: boolean = false;

  constructor() {
    this.sessionStartTime = Date.now();
    this.pageStartTime = Date.now();
    
    this.journey = {
      sessionId: this.generateSessionId(),
      startTime: this.sessionStartTime,
      events: [],
      pageViews: [],
      currentPath: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      deviceInfo: this.getDeviceInfo(),
      performance: this.getPerformanceData()
    };

    if (typeof window !== 'undefined') {
      this.initializeTracking();
    }
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        screenWidth: 0,
        screenHeight: 0,
        deviceType: 'desktop',
        browser: 'unknown',
        os: 'unknown'
      };
    }

    const width = window.screen.width;
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    
    if (width < 768) deviceType = 'mobile';
    else if (width < 1024) deviceType = 'tablet';

    const ua = navigator.userAgent;
    const browser = this.getBrowserInfo(ua);
    const os = this.getOSInfo(ua);

    return {
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      deviceType,
      browser,
      os,
      connectionType: (navigator as any)?.connection?.effectiveType || 'unknown'
    };
  }

  private getBrowserInfo(ua: string): string {
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOSInfo(ua: string): string {
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getPerformanceData(): PerformanceData {
    if (typeof performance === 'undefined') {
      return { loadTime: 0 };
    }

    const navigation = performance.getEntriesByType('navigation')[0] as any;
    const loadTime = navigation ? navigation.loadEventEnd - navigation.navigationStart : 0;

    return {
      loadTime: Math.round(loadTime),
      firstContentfulPaint: this.getMetric('first-contentful-paint'),
      largestContentfulPaint: this.getMetric('largest-contentful-paint'),
    };
  }

  private getMetric(name: string): number | undefined {
    const entries = performance.getEntriesByName(name);
    return entries.length > 0 ? Math.round(entries[0].startTime) : undefined;
  }

  private initializeTracking() {
    this.isTracking = true;

    // Track page view
    this.trackPageView();

    // Track scroll depth
    this.trackScrollDepth();

    // Track interactions
    this.trackInteractions();

    // Track page visibility
    this.trackPageVisibility();

    // Track before unload
    this.trackBeforeUnload();

    // Auto-save journey data
    this.startAutoSave();
  }

  private trackPageView() {
    const pageView: PageView = {
      path: window.location.pathname,
      title: document.title,
      timestamp: Date.now(),
      scrollDepth: 0,
      interactions: 0
    };

    this.journey.pageViews.push(pageView);
    this.journey.currentPath = window.location.pathname;
    this.pageStartTime = Date.now();
    this.scrollDepth = 0;
    this.interactions = 0;

    this.trackEvent('page_view', {
      path: pageView.path,
      title: pageView.title,
      referrer: document.referrer
    });
  }

  private trackScrollDepth() {
    let maxScroll = 0;
    
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        this.scrollDepth = maxScroll;

        // Track milestone scrolls
        if ([25, 50, 75, 90].includes(maxScroll)) {
          this.trackEvent('scroll_depth', {
            depth: maxScroll,
            page: window.location.pathname
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  private trackInteractions() {
    const events = ['click', 'keydown', 'touchstart'];
    
    events.forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        this.interactions++;
        
        if (eventType === 'click') {
          const target = e.target as HTMLElement;
          const tagName = target.tagName.toLowerCase();
          const text = target.textContent?.slice(0, 100) || '';
          const href = (target as HTMLAnchorElement).href || '';
          const className = target.className || '';

          this.trackEvent('click', {
            element: tagName,
            text,
            href,
            className,
            x: (e as MouseEvent).clientX,
            y: (e as MouseEvent).clientY
          });
        }
      }, { passive: true });
    });
  }

  private trackPageVisibility() {
    let pageVisible = !document.hidden;
    let visibilityStart = Date.now();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && pageVisible) {
        // Page became hidden
        const timeVisible = Date.now() - visibilityStart;
        this.trackEvent('page_hidden', {
          timeVisible,
          page: window.location.pathname
        });
        pageVisible = false;
      } else if (!document.hidden && !pageVisible) {
        // Page became visible
        this.trackEvent('page_visible', {
          page: window.location.pathname
        });
        pageVisible = true;
        visibilityStart = Date.now();
      }
    });
  }

  private trackBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      // Update last page view with time spent
      const currentPageView = this.journey.pageViews[this.journey.pageViews.length - 1];
      if (currentPageView) {
        currentPageView.timeOnPage = Date.now() - this.pageStartTime;
        currentPageView.scrollDepth = this.scrollDepth;
        currentPageView.interactions = this.interactions;
      }

      this.saveJourneyData();
    });
  }

  private startAutoSave() {
    setInterval(() => {
      this.saveJourneyData();
    }, 30000); // Save every 30 seconds
  }

  private saveJourneyData() {
    try {
      const data = {
        journey: this.journey,
        lastUpdated: Date.now()
      };
      
      localStorage.setItem('festiwise_analytics', JSON.stringify(data));
      
      // Send to your analytics endpoint (free tier limits apply)
      this.sendToAnalytics(data);
    } catch (error) {
      console.warn('Failed to save analytics data:', error);
    }
  }

  private sendToAnalytics(data: any) {
    // Send to Google Analytics 4 (free)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'user_journey_update', {
        session_id: data.journey.sessionId,
        page_views: data.journey.pageViews.length,
        events_count: data.journey.events.length,
        session_duration: Date.now() - data.journey.startTime,
        device_type: data.journey.deviceInfo.deviceType
      });
    }

    // Could also send to free tiers of:
    // - PostHog (generous free tier)
    // - Mixpanel (free up to 20M events)
    // - Amplitude (free up to 10M events)
  }

  public trackEvent(name: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      properties: {
        ...properties,
        timestamp: Date.now(),
        session_duration: Date.now() - this.sessionStartTime,
        page: window.location.pathname,
        device_type: this.journey.deviceInfo.deviceType,
        browser: this.journey.deviceInfo.browser
      },
      timestamp: Date.now(),
      page: window.location.pathname,
      sessionId: this.journey.sessionId
    };

    this.journey.events.push(event);

    // Real-time event processing
    this.processEvent(event);
  }

  private processEvent(event: AnalyticsEvent) {
    // Trigger custom events for real-time features
    window.dispatchEvent(new CustomEvent('analytics-event', {
      detail: event
    }));

    // Check for conversion events
    this.checkConversions(event);
  }

  private checkConversions(event: AnalyticsEvent) {
    const conversionEvents = [
      'quiz_completed',
      'newsletter_signup',
      'festival_clicked',
      'contact_form_submitted'
    ];

    if (conversionEvents.includes(event.name)) {
      this.trackEvent('conversion', {
        conversion_type: event.name,
        conversion_value: 1,
        funnel_step: this.getFunnelStep(event.name)
      });
    }
  }

  private getFunnelStep(eventName: string): number {
    const funnelSteps: Record<string, number> = {
      'page_view': 1,
      'quiz_started': 2,
      'quiz_completed': 3,
      'newsletter_signup': 4,
      'festival_clicked': 5
    };

    return funnelSteps[eventName] || 0;
  }

  public getJourney(): UserJourney {
    return { ...this.journey };
  }

  public getConversionFunnel(): ConversionFunnel[] {
    const events = this.journey.events;
    const funnelSteps = [
      { step: 'Landing', event: 'page_view' },
      { step: 'Quiz Started', event: 'quiz_started' },
      { step: 'Quiz Completed', event: 'quiz_completed' },
      { step: 'Newsletter Signup', event: 'newsletter_signup' },
      { step: 'Festival Clicked', event: 'festival_clicked' }
    ];

    const results: ConversionFunnel[] = [];
    let previousUsers = events.filter(e => e.name === 'page_view').length || 1;

    funnelSteps.forEach((step, index) => {
      const currentUsers = events.filter(e => e.name === step.event).length;
      const conversionRate = previousUsers > 0 ? (currentUsers / previousUsers) * 100 : 0;
      const dropOffRate = 100 - conversionRate;
      
      const stepEvents = events.filter(e => e.name === step.event);
      const avgTimeSpent = stepEvents.length > 0 
        ? stepEvents.reduce((sum, e) => sum + (e.timestamp - this.journey.startTime), 0) / stepEvents.length 
        : 0;

      results.push({
        step: step.step,
        users: currentUsers,
        conversionRate: Math.round(conversionRate * 100) / 100,
        dropOffRate: Math.round(dropOffRate * 100) / 100,
        avgTimeSpent: Math.round(avgTimeSpent / 1000) // Convert to seconds
      });

      previousUsers = currentUsers;
    });

    return results;
  }

  public getEngagementMetrics() {
    const journey = this.journey;
    const sessionDuration = Date.now() - journey.startTime;
    const totalPageViews = journey.pageViews.length;
    const avgTimePerPage = totalPageViews > 0 
      ? journey.pageViews.reduce((sum, pv) => sum + (pv.timeOnPage || 0), 0) / totalPageViews 
      : 0;
    const avgScrollDepth = totalPageViews > 0
      ? journey.pageViews.reduce((sum, pv) => sum + pv.scrollDepth, 0) / totalPageViews
      : 0;
    const totalInteractions = journey.pageViews.reduce((sum, pv) => sum + pv.interactions, 0);

    return {
      sessionDuration: Math.round(sessionDuration / 1000),
      pageViews: totalPageViews,
      avgTimePerPage: Math.round(avgTimePerPage / 1000),
      avgScrollDepth: Math.round(avgScrollDepth),
      totalInteractions,
      engagementScore: this.calculateEngagementScore()
    };
  }

  private calculateEngagementScore(): number {
    const metrics = this.getEngagementMetrics();
    let score = 0;

    // Session duration score (max 30 points)
    score += Math.min(30, metrics.sessionDuration / 10);

    // Page views score (max 20 points)
    score += Math.min(20, metrics.pageViews * 5);

    // Scroll depth score (max 25 points)
    score += (metrics.avgScrollDepth / 100) * 25;

    // Interactions score (max 25 points)
    score += Math.min(25, metrics.totalInteractions * 2);

    return Math.round(score);
  }

  public cleanup() {
    this.isTracking = false;
    this.saveJourneyData();
  }
}

// React Hook for Enterprise Analytics
export function useEnterpriseAnalytics() {
  const [analytics] = useState(() => new EnterpriseAnalytics());
  const [metrics, setMetrics] = useState(analytics.getEngagementMetrics());
  const [funnel, setFunnel] = useState(analytics.getConversionFunnel());

  const trackEvent = useCallback((name: string, properties?: Record<string, any>) => {
    analytics.trackEvent(name, properties);
    setMetrics(analytics.getEngagementMetrics());
    setFunnel(analytics.getConversionFunnel());
  }, [analytics]);

  useEffect(() => {
    const handleAnalyticsEvent = () => {
      setMetrics(analytics.getEngagementMetrics());
      setFunnel(analytics.getConversionFunnel());
    };

    window.addEventListener('analytics-event', handleAnalyticsEvent);

    return () => {
      window.removeEventListener('analytics-event', handleAnalyticsEvent);
      analytics.cleanup();
    };
  }, [analytics]);

  return {
    trackEvent,
    metrics,
    funnel,
    journey: analytics.getJourney()
  };
}

// Real-time Analytics Dashboard Component
export function AnalyticsDashboard() {
  const { metrics, funnel } = useEnterpriseAnalytics();

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-50 border">
      <h3 className="text-sm font-semibold mb-2">📊 Live Analytics</h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Engagement Score:</span>
          <span className="font-semibold">{metrics.engagementScore}/100</span>
        </div>
        
        <div className="flex justify-between">
          <span>Session Time:</span>
          <span>{Math.floor(metrics.sessionDuration / 60)}:{String(metrics.sessionDuration % 60).padStart(2, '0')}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Page Views:</span>
          <span>{metrics.pageViews}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Avg Scroll:</span>
          <span>{metrics.avgScrollDepth}%</span>
        </div>
        
        <div className="flex justify-between">
          <span>Interactions:</span>
          <span>{metrics.totalInteractions}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t">
        <h4 className="text-xs font-semibold mb-1">Conversion Funnel:</h4>
        {funnel.slice(0, 3).map((step, index) => (
          <div key={step.step} className="flex justify-between text-xs">
            <span>{step.step}:</span>
            <span>{step.conversionRate}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EnterpriseAnalytics;
