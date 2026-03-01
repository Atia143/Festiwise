'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  memoryUsage: number;
  connectionSpeed: string;
  deviceType: string;
  score: number;
}

interface LiveMetrics {
  currentUsers: number;
  conversionRate: number;
  averageSessionTime: number;
  bounceRate: number;
  topPages: { path: string; views: number }[];
}

export default function LivePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [liveData, setLiveData] = useState<LiveMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show performance monitor only in development or for admins
    const showMonitor = process.env.NODE_ENV === 'development' || 
                       localStorage.getItem('festiwise_admin') === 'true';
    setIsVisible(showMonitor);

    if (showMonitor) {
      measurePerformance();
      startLiveMonitoring();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const measurePerformance = () => {
    // Wait for page to fully load
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      let fcp = 0;
      let lcp = 0;
      
      paintEntries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          fcp = entry.startTime;
        }
      });

      // Get LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          lcp = lastEntry.startTime;
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Get CLS
      let cls = 0;
      new PerformanceObserver((list) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });

      // Calculate metrics
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      const timeToInteractive = navigation.domInteractive - navigation.fetchStart;
      
      // Memory usage (if available)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / (1024 * 1024) : 0;

      // Connection info
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const connection = (navigator as any).connection;
      const connectionSpeed = connection ? connection.effectiveType : 'unknown';

      // Device type detection
      const deviceType = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop';

      // Calculate performance score (0-100)
      const score = calculatePerformanceScore({
        pageLoadTime,
        timeToInteractive,
        fcp,
        lcp: lcp || pageLoadTime, // fallback
        cls,
        memoryUsage
      });

      const performanceMetrics: PerformanceMetrics = {
        pageLoadTime: Math.round(pageLoadTime),
        timeToInteractive: Math.round(timeToInteractive),
        firstContentfulPaint: Math.round(fcp),
        largestContentfulPaint: Math.round(lcp || pageLoadTime),
        cumulativeLayoutShift: Math.round(cls * 1000) / 1000,
        memoryUsage: Math.round(memoryUsage * 10) / 10,
        connectionSpeed,
        deviceType,
        score
      };

      setMetrics(performanceMetrics);

      // Send to analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('event', 'performance_metrics', {
          event_category: 'performance',
          page_load_time: performanceMetrics.pageLoadTime,
          time_to_interactive: performanceMetrics.timeToInteractive,
          performance_score: performanceMetrics.score,
          device_type: performanceMetrics.deviceType,
          connection_speed: performanceMetrics.connectionSpeed
        });
      }
    }, 2000);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculatePerformanceScore = (metrics: any): number => {
    let score = 100;

    // Page load time penalty
    if (metrics.pageLoadTime > 3000) score -= 20;
    else if (metrics.pageLoadTime > 2000) score -= 10;

    // LCP penalty
    if (metrics.lcp > 2500) score -= 15;
    else if (metrics.lcp > 1500) score -= 8;

    // CLS penalty
    if (metrics.cls > 0.1) score -= 15;
    else if (metrics.cls > 0.05) score -= 8;

    // Memory usage penalty
    if (metrics.memoryUsage > 50) score -= 10;
    else if (metrics.memoryUsage > 30) score -= 5;

    return Math.max(0, score);
  };

  const startLiveMonitoring = () => {
    // Simulate live data (in production, this would connect to your analytics API)
    const updateLiveData = () => {
      const mockData: LiveMetrics = {
        currentUsers: Math.floor(Math.random() * 50) + 20,
        conversionRate: Math.floor(Math.random() * 15) + 60, // 60-75%
        averageSessionTime: Math.floor(Math.random() * 120) + 180, // 3-5 minutes
        bounceRate: Math.floor(Math.random() * 20) + 25, // 25-45%
        topPages: [
          { path: '/', views: Math.floor(Math.random() * 500) + 800 },
          { path: '/quiz', views: Math.floor(Math.random() * 300) + 400 },
          { path: '/festivals', views: Math.floor(Math.random() * 200) + 300 },
          { path: '/best-music-festivals-2025', views: Math.floor(Math.random() * 150) + 200 }
        ]
      };
      setLiveData(mockData);
    };

    updateLiveData();
    const interval = setInterval(updateLiveData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  };

  if (!isVisible || !metrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-lg text-white rounded-2xl p-4 w-80 text-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-green-400">⚡ Live Performance</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      {/* Performance Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span>Performance Score</span>
          <span className={`font-bold ${
            metrics.score >= 90 ? 'text-green-400' :
            metrics.score >= 75 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {metrics.score}/100
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${
              metrics.score >= 90 ? 'bg-green-400' :
              metrics.score >= 75 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${metrics.score}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <MetricItem
          label="Page Load"
          value={`${metrics.pageLoadTime}ms`}
          good={metrics.pageLoadTime < 2000}
        />
        <MetricItem
          label="LCP"
          value={`${metrics.largestContentfulPaint}ms`}
          good={metrics.largestContentfulPaint < 2500}
        />
        <MetricItem
          label="CLS"
          value={metrics.cumulativeLayoutShift.toString()}
          good={metrics.cumulativeLayoutShift < 0.1}
        />
        <MetricItem
          label="Memory"
          value={`${metrics.memoryUsage}MB`}
          good={metrics.memoryUsage < 30}
        />
      </div>

      {/* Live Data */}
      {liveData && (
        <div className="border-t border-gray-700 pt-3">
          <h4 className="font-semibold text-blue-400 mb-2">📊 Live Analytics</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-gray-400">Active Users</div>
              <div className="font-bold text-green-400">{liveData.currentUsers}</div>
            </div>
            <div>
              <div className="text-gray-400">Conversion</div>
              <div className="font-bold text-yellow-400">{liveData.conversionRate}%</div>
            </div>
            <div>
              <div className="text-gray-400">Avg Session</div>
              <div className="font-bold text-blue-400">{Math.floor(liveData.averageSessionTime / 60)}m</div>
            </div>
            <div>
              <div className="text-gray-400">Bounce Rate</div>
              <div className="font-bold text-red-400">{liveData.bounceRate}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Device Info */}
      <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400">
        {metrics.deviceType} • {metrics.connectionSpeed}
      </div>
    </motion.div>
  );
}

function MetricItem({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div>
      <div className="text-gray-400">{label}</div>
      <div className={`font-bold ${good ? 'text-green-400' : 'text-yellow-400'}`}>
        {value}
      </div>
    </div>
  );
}
