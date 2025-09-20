import {
  supportsModernFormat,
  getOptimalImageWidth,
  getImageUrl,
  initVitalsMonitoring
} from './performance-utils';

// Performance optimization configurations and utilities
const CACHE_CONTROL_HEADERS = {
  // Aggressive caching for static assets
  static: {
    'Cache-Control': 'public, max-age=31536000, immutable'
  },
  // Balanced caching for dynamic content
  dynamic: {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
  },
  // No caching for sensitive content
  noStore: {
    'Cache-Control': 'no-store, must-revalidate'
  }
};

// Image optimization configuration
const IMAGE_CONFIG = {
  formats: ['webp', 'avif'],
  sizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  placeholder: 'blur',
  quality: 75,
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  domains: ['images.unsplash.com', 'res.cloudinary.com'],
  minimumCacheTTL: 604800, // 1 week
};

// Critical CSS paths for above-the-fold content
const CRITICAL_CSS_PATHS = [
  '/styles/layout.css',
  '/styles/header.css',
  '/styles/hero.css',
  '/styles/navigation.css'
];

// Performance optimization functions
const optimizeImages = (imageSrc: string, width: number) => {
  // Convert to WebP/AVIF if supported
  const modernFormat = supportsModernFormat() ? 'webp' : 'jpeg';
  
  // Calculate optimal size
  const optimalWidth = getOptimalImageWidth(width);
  
  // Generate srcset for responsive images
  const srcSet = IMAGE_CONFIG.sizes
    .filter(size => size <= optimalWidth * 2) // Don't go beyond 2x
    .map(size => `${getImageUrl(imageSrc, size, modernFormat)} ${size}w`)
    .join(', ');
    
  return {
    src: getImageUrl(imageSrc, optimalWidth, modernFormat),
    srcSet,
    sizes: `(max-width: ${optimalWidth}px) 100vw, ${optimalWidth}px`,
  };
};

// Lazy loading configuration
const LAZY_LOAD_CONFIG = {
  threshold: 0.1,
  rootMargin: '50px 0px',
  enabled: true
};

// Resource hints generator
const generateResourceHints = (urls: string[]) => {
  return {
    preconnect: urls.map(url => ({
      rel: 'preconnect',
      href: url,
      crossOrigin: 'anonymous'
    })),
    prefetch: [],
    preload: CRITICAL_CSS_PATHS.map(path => ({
      rel: 'preload',
      href: path,
      as: 'style'
    }))
  };
};

// Script loading strategy configuration
const SCRIPT_CONFIG = {
  strategy: 'defer' as const,
  critical: [] as string[],
  async: [
    'analytics',
    'chat-widget',
    'social-share'
  ]
};

// Export configurations and utilities
export {
  CACHE_CONTROL_HEADERS,
  IMAGE_CONFIG,
  CRITICAL_CSS_PATHS,
  LAZY_LOAD_CONFIG,
  SCRIPT_CONFIG,
  optimizeImages,
  generateResourceHints,
  initVitalsMonitoring as initPerformanceMonitoring,
};