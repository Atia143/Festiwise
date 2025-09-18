'use client';

import { useEffect, useState } from 'react';

interface WebVitalsMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

interface PerformanceGrade {
  lcp: 'good' | 'needs-improvement' | 'poor';
  fid: 'good' | 'needs-improvement' | 'poor';
  cls: 'good' | 'needs-improvement' | 'poor';
  overall: 'good' | 'needs-improvement' | 'poor';
}

export default function WebVitalsMonitor() {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({});
  const [grades, setGrades] = useState<PerformanceGrade>({
    lcp: 'good',
    fid: 'good', 
    cls: 'good',
    overall: 'good'
  });

  // Grade thresholds based on Google's Core Web Vitals
  const getGrade = (metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'fid':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  };

  // Calculate overall grade
  const calculateOverallGrade = (lcp: string, fid: string, cls: string) => {
    const scores = [lcp, fid, cls];
    if (scores.includes('poor')) return 'poor';
    if (scores.includes('needs-improvement')) return 'needs-improvement';
    return 'good';
  };

  useEffect(() => {
    // Only render in production if user has opted in or in development
    if (process.env.NODE_ENV !== 'development' && (typeof window === 'undefined' || !window.localStorage?.getItem('show-perf-monitor'))) {
      return;
    }

    let lcpObserver: PerformanceObserver | null = null;
    let fidObserver: PerformanceObserver | null = null;
    let clsObserver: PerformanceObserver | null = null;

    // Monitor LCP (Largest Contentful Paint)
    try {
      lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcpValue = lastEntry.startTime;
        
        setMetrics(prev => ({ ...prev, lcp: lcpValue }));
        setGrades(prev => ({
          ...prev,
          lcp: getGrade('lcp', lcpValue),
          overall: calculateOverallGrade(getGrade('lcp', lcpValue), prev.fid, prev.cls)
        }));

        // Report to analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'LCP',
            value: Math.round(lcpValue)
          });
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP monitoring not supported');
    }

    // Monitor FID (First Input Delay)
    try {
      fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as any; // PerformanceEventTiming
          const fidValue = fidEntry.processingStart - fidEntry.startTime;
          
          setMetrics(prev => ({ ...prev, fid: fidValue }));
          setGrades(prev => ({
            ...prev,
            fid: getGrade('fid', fidValue),
            overall: calculateOverallGrade(prev.lcp, getGrade('fid', fidValue), prev.cls)
          }));

          // Report to analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'FID',
              value: Math.round(fidValue)
            });
          }
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('FID monitoring not supported');
    }

    // Monitor CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        setMetrics(prev => ({ ...prev, cls: clsValue }));
        setGrades(prev => ({
          ...prev,
          cls: getGrade('cls', clsValue),
          overall: calculateOverallGrade(prev.lcp, prev.fid, getGrade('cls', clsValue))
        }));

        // Report to analytics (throttled)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'CLS',
            value: Math.round(clsValue * 1000) / 1000
          });
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }

    // Monitor additional metrics
    try {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcpEntry = entries[0];
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      });
      fcpObserver.observe({ type: 'paint', buffered: true });

      // Time to First Byte
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const ttfb = navigationEntries[0].responseStart;
        setMetrics(prev => ({ ...prev, ttfb }));
      }
    } catch (e) {
      console.warn('Additional metrics monitoring not supported');
    }

    // Cleanup
    return () => {
      lcpObserver?.disconnect();
      fidObserver?.disconnect();
      clsObserver?.disconnect();
    };
  }, []);

  // Don't render in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && (typeof window === 'undefined' || !window.localStorage?.getItem('show-perf-monitor'))) {
    return null;
  }

  const formatMetric = (value: number | undefined, unit: string, decimals: number = 0) => {
    if (value === undefined) return 'measuring...';
    return `${value.toFixed(decimals)}${unit}`;
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'good': return 'bg-green-500 text-white';
      case 'needs-improvement': return 'bg-yellow-500 text-black';
      case 'poor': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-white p-3 rounded-lg font-mono text-xs space-y-1 backdrop-blur-sm border border-gray-600">
      <div className="font-semibold text-center mb-2">Core Web Vitals</div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className={`px-2 py-1 rounded text-center ${getGradeColor(grades.lcp)}`}>
          <div className="font-semibold">LCP</div>
          <div>{formatMetric(metrics.lcp, 'ms')}</div>
        </div>
        
        <div className={`px-2 py-1 rounded text-center ${getGradeColor(grades.fid)}`}>
          <div className="font-semibold">FID</div>
          <div>{formatMetric(metrics.fid, 'ms')}</div>
        </div>
        
        <div className={`px-2 py-1 rounded text-center ${getGradeColor(grades.cls)}`}>
          <div className="font-semibold">CLS</div>
          <div>{formatMetric(metrics.cls, '', 3)}</div>
        </div>
        
        <div className={`px-2 py-1 rounded text-center ${getGradeColor(grades.overall)}`}>
          <div className="font-semibold">Overall</div>
          <div className="text-xs">{grades.overall.toUpperCase()}</div>
        </div>
      </div>

      {/* Additional metrics */}
      <div className="pt-2 border-t border-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span>{formatMetric(metrics.fcp, 'ms')}</span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span>{formatMetric(metrics.ttfb, 'ms')}</span>
        </div>
      </div>

      <div className="text-center pt-2 border-t border-gray-600">
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.localStorage?.removeItem('show-perf-monitor');
            }
          }}
          className="text-gray-400 hover:text-white text-xs underline"
        >
          Hide Monitor
        </button>
      </div>
    </div>
  );
}

// Export function to enable monitoring in production
export const enablePerformanceMonitoring = () => {
  if (typeof window !== 'undefined') {
    window.localStorage?.setItem('show-perf-monitor', 'true');
    window.location.reload();
  }
};

// Performance optimization utilities
export const performanceUtils = {
  // Preload critical images
  preloadImage: (src: string, priority: 'high' | 'low' = 'low') => {
    if (typeof window === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    if (priority === 'high') {
      link.setAttribute('fetchpriority', 'high');
    }
    document.head.appendChild(link);
  },

  // Mark critical rendering path
  markCritical: (selector: string) => {
    if (typeof window === 'undefined') return;
    
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.setAttribute('data-critical', 'true');
    });
  },

  // Report custom performance metrics
  reportCustomMetric: (name: string, value: number, unit: string = 'ms') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'custom_performance', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        custom_parameter_1: unit
      });
    }
  }
};