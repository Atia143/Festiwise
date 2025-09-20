// Image optimization utilities

// Check if browser supports modern image formats
export const supportsModernFormat = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  return (
    canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0 ||
    canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
  );
};

// Calculate optimal image width based on device and viewport
export const getOptimalImageWidth = (width: number): number => {
  if (typeof window === 'undefined') return width;
  
  const devicePixelRatio = window.devicePixelRatio || 1;
  const viewportWidth = window.innerWidth;
  
  // Don't serve images larger than viewport width * DPR
  const maxWidth = viewportWidth * devicePixelRatio;
  
  // Round up to nearest size in our configuration
  const sizes = [640, 750, 828, 1080, 1200, 1920, 2048];
  const optimal = sizes.find(size => size >= Math.min(width, maxWidth)) || sizes[sizes.length - 1];
  
  return optimal;
};

// Generate optimized image URL
export const getImageUrl = (src: string, width: number, format: string): string => {
  // Handle Cloudinary URLs
  if (src.includes('res.cloudinary.com')) {
    return src
      .replace('/image/upload/', `/image/upload/w_${width},f_${format},q_auto/`);
  }
  
  // Handle Unsplash URLs
  if (src.includes('images.unsplash.com')) {
    return `${src}&w=${width}&fm=${format}&q=75`;
  }
  
  // Handle local images
  if (src.startsWith('/')) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
  }
  
  return src;
};

// Performance monitoring for Core Web Vitals
export interface WebVital {
  id: string;
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
}

type MetricType = 'CLS' | 'FID' | 'LCP' | 'TTFB' | 'FCP';

interface MetricData {
  name: MetricType;
  value: number;
  delta: number;
  id: string;
  entries: PerformanceEntry[];
}

const reportWebVitals = (metric: MetricData) => {
  // Console logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
  
  // Send to Analytics in production
  if (typeof window.gtag === 'function') {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
};

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

export const initVitalsMonitoring = () => {
  try {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const entry = entries[entries.length - 1];
      
      reportWebVitals({
        id: 'lcp',
        name: 'LCP',
        value: entry.startTime,
        delta: entry.startTime,
        entries: [entry],
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const firstInput = entry as FirstInputEntry;
        reportWebVitals({
          id: 'fid',
          name: 'FID',
          value: firstInput.processingStart - firstInput.startTime,
          delta: firstInput.processingStart - firstInput.startTime,
          entries: [entry],
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];
    
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as LayoutShiftEntry[];
      
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });

      reportWebVitals({
        id: 'cls',
        name: 'CLS',
        value: clsValue,
        delta: clsValue,
        entries: clsEntries,
      });
    }).observe({ entryTypes: ['layout-shift'] });

  } catch (err) {
    console.warn('Web Vitals monitoring failed:', err);
  }
};

// Initialize monitoring when in browser
if (typeof window !== 'undefined') {
  // Wait for page load
  if (document.readyState === 'complete') {
    initVitalsMonitoring();
  } else {
    window.addEventListener('load', initVitalsMonitoring);
  }
}