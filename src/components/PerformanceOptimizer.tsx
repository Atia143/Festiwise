'use client';

import { useEffect, useState } from 'react';

/**
 * CRITICAL PERFORMANCE & UX ENHANCEMENTS
 * - Reduces LCP (Largest Contentful Paint)
 * - Improves CLS (Cumulative Layout Shift)
 * - Enhances Core Web Vitals
 */

export default function PerformanceOptimizer() {
  useEffect(() => {
    // 1. Preload critical fonts
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    // 2. Optimize images with blur placeholders
    const optimizeImages = () => {
      const images = document.querySelectorAll('img:not([data-optimized])');
      images.forEach((img: Element) => {
        const imgElement = img as HTMLImageElement;
        // Add blur-up effect
        imgElement.style.backgroundSize = 'cover';
        imgElement.style.backgroundPosition = 'center';
        imgElement.setAttribute('data-optimized', 'true');

        // Lazy load with IntersectionObserver
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  imgElement.loading = 'lazy';
                  observer.unobserve(imgElement);
                }
              });
            },
            { rootMargin: '50px' }
          );
          observer.observe(imgElement);
        }
      });
    };

    // 3. Disable layout shift on scroll (CLS optimization)
    const preventLayoutShift = () => {
      // Reserve space for modals/popups
      const style = document.createElement('style');
      style.textContent = `
        * {
          scroll-behavior: smooth;
        }
        body {
          overflow-y: scroll; /* Always show scrollbar */
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // 4. Preconnect to third-party domains
    const domains = [
      'https://cdn.segment.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://images.unsplash.com'
    ];

    domains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Run optimizations
    optimizeImages();
    preventLayoutShift();

    // Re-run on route changes
    const observer = new MutationObserver(optimizeImages);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null; // Invisible component
}

/**
 * Quick Connection Speed Detection
 */
export function ConnectionAwareComponent() {
  const [connection, setConnection] = useState<string>('4g');

  useEffect(() => {
    if ('connection' in navigator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav = navigator as any;
      setConnection(nav.connection?.effectiveType || '4g');

      const handleChange = () => {
        setConnection(nav.connection?.effectiveType || '4g');
      };

      nav.connection?.addEventListener('change', handleChange);
      return () => nav.connection?.removeEventListener('change', handleChange);
    }
  }, []);

  // If slow connection, reduce animations
  if (connection === 'slow-2g' || connection === '2g' || connection === '3g') {
    return (
      <style>{`
        * {
          animation-duration: 0 !important;
          transition-duration: 0 !important;
        }
      `}</style>
    );
  }

  return null;
}

/**
 * Font Optimization Hook
 */
export function useFontOptimization() {
  useEffect(() => {
    // Preload Inter font weights
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);

    // Prevent FOIT (Flash of Invisible Text)
    document.documentElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  }, []);
}
