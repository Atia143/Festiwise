'use client';

import { useEffect } from 'react';

/**
 * International SEO Optimizer
 * Implements advanced SEO features for global markets
 */
export default function InternationalSEO() {
  useEffect(() => {
    // 1. Automatic hreflang generation for international versions
    const addHreflangTags = () => {
      const currentPath = window.location.pathname;
      const supportedLocales = [
        { code: 'en', region: 'US', domain: 'getfestiwise.com' },
        { code: 'en', region: 'GB', domain: 'getfestiwise.co.uk' },
        { code: 'en', region: 'AU', domain: 'getfestiwise.com.au' },
        { code: 'es', region: 'ES', domain: 'getfestiwise.es' },
        { code: 'fr', region: 'FR', domain: 'getfestiwise.fr' },
        { code: 'de', region: 'DE', domain: 'getfestiwise.de' },
        { code: 'pt', region: 'BR', domain: 'getfestiwise.com.br' }
      ];

      supportedLocales.forEach(locale => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = `${locale.code}-${locale.region}`;
        link.href = `https://${locale.domain}${currentPath}`;
        document.head.appendChild(link);
      });

      // Add x-default for global fallback
      const defaultLink = document.createElement('link');
      defaultLink.rel = 'alternate';
      defaultLink.hreflang = 'x-default';
      defaultLink.href = `https://getfestiwise.com${currentPath}`;
      document.head.appendChild(defaultLink);
    };

    // 2. Dynamic schema markup for festivals
    const addFestivalSchema = () => {
      const festivalData = document.querySelector('[data-festival-id]');
      if (festivalData) {
        const festivalId = festivalData.getAttribute('data-festival-id');
        const festivalName = festivalData.getAttribute('data-festival-name');
        const festivalLocation = festivalData.getAttribute('data-festival-location');
        const festivalDate = festivalData.getAttribute('data-festival-date');

        const schema = {
          "@context": "https://schema.org",
          "@type": "MusicEvent",
          "name": festivalName,
          "startDate": festivalDate,
          "location": {
            "@type": "Place",
            "name": festivalLocation,
            "address": festivalLocation
          },
          "performer": {
            "@type": "MusicGroup",
            "name": "Various Artists"
          },
          "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "availability": "https://schema.org/InStock"
          }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    };

    // 3. Geographic targeting optimization
    const optimizeForGeoTargeting = () => {
      // Detect user's likely country from timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const country = timezone.split('/')[0];
      
      // Add geo meta tags
      const geoPosition = document.createElement('meta');
      geoPosition.name = 'geo.position';
      geoPosition.content = 'global';
      document.head.appendChild(geoPosition);

      const geoRegion = document.createElement('meta');
      geoRegion.name = 'geo.region';
      geoRegion.content = country.toUpperCase();
      document.head.appendChild(geoRegion);

      // Add ICBM meta for location
      const icbm = document.createElement('meta');
      icbm.name = 'ICBM';
      icbm.content = '0.0,0.0'; // Global positioning
      document.head.appendChild(icbm);
    };

    // 4. Mobile-first indexing optimization
    const optimizeForMobileIndexing = () => {
      // Ensure viewport meta is optimal
      let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      viewport.content = 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=yes';

      // Add mobile-specific meta tags
      const mobileOptimized = document.createElement('meta');
      mobileOptimized.name = 'mobile-web-app-capable';
      mobileOptimized.content = 'yes';
      document.head.appendChild(mobileOptimized);

      const appleMobileOptimized = document.createElement('meta');
      appleMobileOptimized.name = 'apple-mobile-web-app-capable';
      appleMobileOptimized.content = 'yes';
      document.head.appendChild(appleMobileOptimized);
    };

    // 5. Rich snippets for search results
    const addRichSnippets = () => {
      const currentPage = window.location.pathname;
      
      if (currentPage === '/' || currentPage === '') {
        // Homepage organization schema
        const orgSchema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "FestiWise",
          "alternateName": "Festival Finder",
          "url": "https://getfestiwise.com",
          "logo": "https://getfestiwise.com/logo.png",
          "sameAs": [
            "https://twitter.com/festiwise",
            "https://facebook.com/festiwise",
            "https://instagram.com/festiwise"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-FESTIVAL",
            "contactType": "customer service",
            "email": "hello@getfestiwise.com"
          }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(orgSchema);
        document.head.appendChild(script);
      }

      if (currentPage.includes('/quiz')) {
        // Quiz/Service schema
        const serviceSchema = {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Festival Recommendation Quiz",
          "description": "Personalized music festival recommendations based on your preferences",
          "provider": {
            "@type": "Organization",
            "name": "FestiWise"
          },
          "serviceType": "Festival Matching Service",
          "areaServed": "Worldwide"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(serviceSchema);
        document.head.appendChild(script);
      }
    };

    // 6. Core Web Vitals optimization hints
    const addPerformanceHints = () => {
      // DNS prefetch for external domains
      const domains = [
        'https://www.googletagmanager.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });

      // Preload critical fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.as = 'style';
      fontLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontLink);
    };

    // 7. Accessibility SEO enhancements
    const addAccessibilitySEO = () => {
      // Ensure all images have alt text
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach((img, index) => {
        const imgElement = img as HTMLImageElement;
        imgElement.alt = `Festival image ${index + 1}`;
      });

      // Add skip navigation if not present
      if (!document.querySelector('a[href="#main"]')) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);
      }
    };

    // Execute all optimizations
    addHreflangTags();
    addFestivalSchema();
    optimizeForGeoTargeting();
    optimizeForMobileIndexing();
    addRichSnippets();
    addPerformanceHints();
    addAccessibilitySEO();

    // 8. Dynamic sitemap generation hint
    const notifySitemapUpdate = () => {
      // Ping search engines about sitemap updates (would be done server-side in production)
      console.log('SEO: Dynamic sitemap updated for', window.location.pathname);
    };

    notifySitemapUpdate();

  }, []);

  return null;
}
