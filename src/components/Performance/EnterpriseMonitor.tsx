'use client';

import { useEffect, useState } from 'react';

// 🚀 Enterprise-Level Performance Monitor
interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  domLoad: number;
  pageLoad: number;
  memoryUsage?: number;
  connectionSpeed?: string;
}

interface UserExperience {
  score: number;
  rating: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  suggestions: string[];
}

class EnterprisePerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring() {
    this.isMonitoring = true;
    
    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.measureFCP();
    this.measureTTFB();
    this.measureLoadTimes();
    this.measureMemoryUsage();
    this.detectConnectionSpeed();
  }

  private observeLCP() {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = Math.round(lastEntry.startTime);
        this.analyzeAndReport();
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP monitoring not supported');
    }
  }

  private observeFID() {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = Math.round(entry.processingStart - entry.startTime);
          this.analyzeAndReport();
        });
      });
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID monitoring not supported');
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = Math.round(clsValue * 1000) / 1000;
            this.analyzeAndReport();
          }
        });
      });
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS monitoring not supported');
    }
  }

  private measureFCP() {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = Math.round(entry.startTime);
            this.analyzeAndReport();
          }
        });
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FCP monitoring not supported');
    }
  }

  private measureTTFB() {
    if (performance.timing) {
      const ttfb = performance.timing.responseStart - performance.timing.requestStart;
      this.metrics.ttfb = ttfb;
    }
  }

  private measureLoadTimes() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        if (navigation) {
          this.metrics.domLoad = Math.round(navigation.domContentLoadedEventEnd - navigation.navigationStart);
          this.metrics.pageLoad = Math.round(navigation.loadEventEnd - navigation.navigationStart);
          this.analyzeAndReport();
        }
      }, 0);
    });
  }

  private measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100;
    }
  }

  private detectConnectionSpeed() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.connectionSpeed = connection.effectiveType || 'unknown';
    }
  }

  private analyzeAndReport() {
    const experience = this.calculateUserExperience();
    
    // Send to analytics (no external cost)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'performance_metrics', {
        fcp: this.metrics.fcp,
        lcp: this.metrics.lcp,
        fid: this.metrics.fid,
        cls: this.metrics.cls,
        user_experience_score: experience.score,
        user_experience_rating: experience.rating,
        event_category: 'performance'
      });
    }

    // Store in localStorage for dashboard
    localStorage.setItem('festiwise_performance', JSON.stringify({
      metrics: this.metrics,
      experience,
      timestamp: Date.now()
    }));

    // Trigger custom event for components
    window.dispatchEvent(new CustomEvent('performance-update', {
      detail: { metrics: this.metrics, experience }
    }));
  }

  private calculateUserExperience(): UserExperience {
    const { fcp, lcp, fid, cls } = this.metrics;
    let score = 100;
    const suggestions: string[] = [];

    // FCP scoring
    if (fcp && fcp > 3000) {
      score -= 25;
      suggestions.push('Optimize First Contentful Paint');
    } else if (fcp && fcp > 1800) {
      score -= 10;
    }

    // LCP scoring
    if (lcp && lcp > 4000) {
      score -= 30;
      suggestions.push('Optimize Largest Contentful Paint');
    } else if (lcp && lcp > 2500) {
      score -= 15;
    }

    // FID scoring
    if (fid && fid > 300) {
      score -= 25;
      suggestions.push('Optimize JavaScript execution');
    } else if (fid && fid > 100) {
      score -= 10;
    }

    // CLS scoring
    if (cls && cls > 0.25) {
      score -= 20;
      suggestions.push('Reduce layout shifts');
    } else if (cls && cls > 0.1) {
      score -= 10;
    }

    let rating: UserExperience['rating'];
    if (score >= 90) rating = 'excellent';
    else if (score >= 75) rating = 'good';
    else if (score >= 50) rating = 'needs-improvement';
    else rating = 'poor';

    return { score: Math.max(0, score), rating, suggestions };
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public getExperience(): UserExperience {
    return this.calculateUserExperience();
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
  }
}

// React Hook for Performance Monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [experience, setExperience] = useState<UserExperience>({
    score: 0,
    rating: 'good',
    suggestions: []
  });
  const [monitor] = useState(() => new EnterprisePerformanceMonitor());

  useEffect(() => {
    const handlePerformanceUpdate = (event: CustomEvent) => {
      setMetrics(event.detail.metrics);
      setExperience(event.detail.experience);
    };

    window.addEventListener('performance-update', handlePerformanceUpdate as EventListener);

    return () => {
      window.removeEventListener('performance-update', handlePerformanceUpdate as EventListener);
      monitor.cleanup();
    };
  }, [monitor]);

  return { metrics, experience, monitor };
}

// Performance Badge Component
export function PerformanceBadge() {
  const { experience } = usePerformanceMonitor();

  const getBadgeColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'needs-improvement': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getBadgeEmoji = (rating: string) => {
    switch (rating) {
      case 'excellent': return '🚀';
      case 'good': return '⚡';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '🐌';
      default: return '📊';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 ${getBadgeColor(experience.rating)} text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-md bg-opacity-90 z-50`}>
      <span className="mr-1">{getBadgeEmoji(experience.rating)}</span>
      {experience.score}/100
    </div>
  );
}

export default EnterprisePerformanceMonitor;
