'use client';

import React, { useEffect, useCallback, useRef, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime?: number;
  errorCount: number;
  memoryUsage?: number;
  connectionType?: string;
}

interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: PerformanceEntry[];
}

class WorldClassPerformanceMonitor {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    errorCount: 0
  };

  private observers: PerformanceObserver[] = [];
  private vitalsReported = new Set<string>();

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeWebVitals();
    
    // Monitor resource loading
    this.observeResourceTiming();
    
    // Monitor long tasks
    this.observeLongTasks();
    
    // Monitor layout shifts
    this.observeLayoutShifts();
    
    // Monitor memory usage
    this.observeMemoryUsage();
    
    // Monitor network information
    this.observeNetworkInfo();
    
    // Track page load time
    this.trackPageLoadTime();
  }

  private observeWebVitals() {
    // First Contentful Paint (FCP)
    this.observeMetric('first-contentful-paint', (entries) => {
      const entry = entries[entries.length - 1];
      this.reportWebVital('FCP', entry.startTime, entry.name);
    });

    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entries) => {
      const entry = entries[entries.length - 1];
      this.reportWebVital('LCP', entry.startTime, entry.name);
    });

    // First Input Delay (FID) - via event timing
    this.observeMetric('first-input', (entries) => {
      const entry = entries[0] as PerformanceEventTiming;
      const fid = entry.processingStart - entry.startTime;
      this.reportWebVital('FID', fid, entry.name);
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsEntries: PerformanceEntry[] = [];
    
    this.observeMetric('layout-shift', (entries) => {
      for (const entry of entries) {
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
          clsEntries.push(entry);
        }
      }
      this.reportWebVital('CLS', clsValue, 'layout-shift');
    });
  }

  private observeMetric(type: string, callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ type, buffered: true });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Performance observer for ${type} not supported:`, error);
    }
  }

  private observeResourceTiming() {
    this.observeMetric('resource', (entries) => {
      entries.forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming;
        
        // Track slow resources
        if (resourceEntry.duration > 1000) {
          this.reportSlowResource(resourceEntry);
        }
        
        // Track failed resources
        if (resourceEntry.transferSize === 0 && resourceEntry.decodedBodySize === 0) {
          this.reportFailedResource(resourceEntry);
        }
      });
    });
  }

  private observeLongTasks() {
    this.observeMetric('longtask', (entries) => {
      entries.forEach((entry) => {
        this.reportLongTask(entry as PerformanceEntry);
      });
    });
  }

  private observeLayoutShifts() {
    this.observeMetric('layout-shift', (entries) => {
      entries.forEach((entry) => {
        const layoutShiftEntry = entry as any;
        if (layoutShiftEntry.value > 0.1) {
          this.reportSignificantLayoutShift(layoutShiftEntry);
        }
      });
    });
  }

  private observeMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
        
        // Report if memory usage is high
        if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
          this.reportHighMemoryUsage(memory);
        }
      }, 30000); // Check every 30 seconds
    }
  }

  private observeNetworkInfo() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.connectionType = connection.effectiveType;
      
      connection.addEventListener('change', () => {
        this.reportNetworkChange(connection);
      });
    }
  }

  private trackPageLoadTime() {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.metrics.loadTime = loadTime;
      
      // Report page load performance
      this.reportPageLoadTime(loadTime);
    });
  }

  private reportWebVital(name: string, value: number, id: string) {
    if (this.vitalsReported.has(name)) return;
    
    this.vitalsReported.add(name);
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        custom_parameters: {
          metric_name: name,
          metric_value: value,
          metric_id: id,
          performance_grade: this.getPerformanceGrade(name, value)
        }
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${name}: ${Math.round(value)}ms (${this.getPerformanceGrade(name, value)})`);
    }
  }

  private getPerformanceGrade(metric: string, value: number): string {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private reportSlowResource(entry: PerformanceResourceTiming) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'slow_resource', {
        event_category: 'Performance',
        event_label: entry.name,
        value: Math.round(entry.duration),
        custom_parameters: {
          resource_url: entry.name,
          resource_duration: entry.duration,
          resource_size: entry.transferSize
        }
      });
    }
  }

  private reportFailedResource(entry: PerformanceResourceTiming) {
    this.metrics.errorCount++;
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'resource_error', {
        event_category: 'Error',
        event_label: entry.name,
        custom_parameters: {
          resource_url: entry.name,
          error_type: 'failed_to_load'
        }
      });
    }
  }

  private reportLongTask(entry: PerformanceEntry) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'long_task', {
        event_category: 'Performance',
        event_label: 'main_thread_blocking',
        value: Math.round(entry.duration),
        custom_parameters: {
          task_duration: entry.duration,
          task_start: entry.startTime
        }
      });
    }
  }

  private reportSignificantLayoutShift(entry: any) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'layout_shift', {
        event_category: 'Performance',
        event_label: 'significant_shift',
        value: Math.round(entry.value * 1000),
        custom_parameters: {
          shift_value: entry.value,
          had_recent_input: entry.hadRecentInput
        }
      });
    }
  }

  private reportHighMemoryUsage(memory: any) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'high_memory_usage', {
        event_category: 'Performance',
        event_label: 'memory_warning',
        value: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
        custom_parameters: {
          used_heap_size: memory.usedJSHeapSize,
          total_heap_size: memory.totalJSHeapSize,
          heap_size_limit: memory.jsHeapSizeLimit
        }
      });
    }
  }

  private reportNetworkChange(connection: any) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'network_change', {
        event_category: 'Performance',
        event_label: connection.effectiveType,
        custom_parameters: {
          effective_type: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        }
      });
    }
  }

  private reportPageLoadTime(loadTime: number) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_load_time', {
        event_category: 'Performance',
        event_label: 'full_page_load',
        value: Math.round(loadTime),
        custom_parameters: {
          load_time: loadTime,
          performance_grade: loadTime < 3000 ? 'good' : loadTime < 5000 ? 'needs-improvement' : 'poor'
        }
      });
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React Hook for Performance Monitoring
export function usePerformanceMonitoring() {
  const monitorRef = useRef<WorldClassPerformanceMonitor | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      monitorRef.current = new WorldClassPerformanceMonitor();
    }

    return () => {
      if (monitorRef.current) {
        monitorRef.current.destroy();
      }
    };
  }, []);

  const getMetrics = useCallback(() => {
    return monitorRef.current?.getMetrics() || {
      loadTime: 0,
      renderTime: 0,
      errorCount: 0
    };
  }, []);

  return { getMetrics };
}

// Performance Badge Component
export function PerformanceBadge() {
  const { getMetrics } = usePerformanceMonitoring();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(getMetrics());
    }, 5000);

    return () => clearInterval(timer);
  }, [getMetrics]);

  if (!metrics || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="space-y-1">
        <div>Load: {Math.round(metrics.loadTime)}ms</div>
        <div>Memory: {metrics.memoryUsage ? `${Math.round(metrics.memoryUsage / 1024 / 1024)}MB` : 'N/A'}</div>
        <div>Errors: {metrics.errorCount}</div>
        <div>Network: {metrics.connectionType || 'unknown'}</div>
      </div>
    </div>
  );
}

export default WorldClassPerformanceMonitor;
