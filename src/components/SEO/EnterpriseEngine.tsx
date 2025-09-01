'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';

// 🔍 Enterprise SEO Engine - Zero Cost but Premium Features
// Dynamic meta generation, structured data, social optimization

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: any;
  noIndex?: boolean;
  priority?: number;
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

interface FestivalSEO {
  name: string;
  location: string;
  dates: string;
  genres: string[];
  price: { min: number; max: number };
  website: string;
  description: string;
}

class EnterpriseSEOEngine {
  private currentPage: string = '';
  private baseUrl: string = '';

  constructor() {
    if (typeof window !== 'undefined') {
      this.baseUrl = window.location.origin;
      this.currentPage = window.location.pathname;
      this.initializeSEO();
    }
  }

  private initializeSEO() {
    // Add canonical URL if missing
    this.ensureCanonicalUrl();
    
    // Add JSON-LD structured data
    this.addBaseStructuredData();
    
    // Monitor page changes for SPA
    this.monitorPageChanges();
    
    // Add social media optimization
    this.optimizeSocialMedia();
  }

  private ensureCanonicalUrl() {
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (!existingCanonical) {
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = this.baseUrl + this.currentPage;
      document.head.appendChild(canonical);
    }
  }

  private addBaseStructuredData() {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'FestiWise',
      description: 'Find your perfect music festival from 100+ world-class events worldwide',
      url: this.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/festivals?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      },
      publisher: {
        '@type': 'Organization',
        name: 'FestiWise',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`
        }
      }
    };

    this.injectStructuredData('website-schema', structuredData);
  }

  private monitorPageChanges() {
    let currentPath = window.location.pathname;
    
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.currentPage = currentPath;
        this.onPageChange();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private onPageChange() {
    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = this.baseUrl + this.currentPage;
    }

    // Generate page-specific structured data
    this.generatePageStructuredData();
  }

  private generatePageStructuredData() {
    if (this.currentPage.includes('/festival/')) {
      this.addFestivalStructuredData();
    } else if (this.currentPage.includes('/festivals')) {
      this.addFestivalListingStructuredData();
    } else if (this.currentPage === '/quiz') {
      this.addQuizStructuredData();
    } else if (this.currentPage === '/blog') {
      this.addBlogStructuredData();
    }
  }

  private addFestivalStructuredData() {
    // Extract festival ID from URL
    const festivalId = this.currentPage.split('/').pop();
    
    // This would typically fetch festival data
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'MusicEvent',
      name: 'Festival Name', // Dynamic from data
      startDate: '2025-07-15',
      endDate: '2025-07-17',
      location: {
        '@type': 'Place',
        name: 'Festival Venue',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'US'
        }
      },
      performer: {
        '@type': 'MusicGroup',
        name: 'Various Artists'
      },
      offers: {
        '@type': 'Offer',
        price: '250',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode'
    };

    this.injectStructuredData('festival-schema', structuredData);
  }

  private addFestivalListingStructuredData() {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Music Festivals',
      description: 'Curated list of world-class music festivals',
      numberOfItems: 100,
      itemListElement: [] // Would be populated with festival data
    };

    this.injectStructuredData('festival-listing-schema', structuredData);
  }

  private addQuizStructuredData() {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does the festival quiz work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our 2-minute quiz analyzes your music preferences, budget, location preferences, and festival vibes to recommend perfect festivals from our database of 100+ events worldwide.'
          }
        }
      ]
    };

    this.injectStructuredData('quiz-schema', structuredData);
  }

  private addBlogStructuredData() {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'FestiWise Blog',
      description: 'Festival guides, tips, and experiences from music festival experts',
      publisher: {
        '@type': 'Organization',
        name: 'FestiWise'
      }
    };

    this.injectStructuredData('blog-schema', structuredData);
  }

  private injectStructuredData(id: string, data: any) {
    // Remove existing schema
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }

    // Add new schema
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  private optimizeSocialMedia() {
    // Dynamic Open Graph optimization
    this.updateOpenGraphTags();
    
    // Twitter Card optimization
    this.updateTwitterCards();
  }

  private updateOpenGraphTags() {
    const ogTags = [
      { property: 'og:site_name', content: 'FestiWise' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'en_US' }
    ];

    ogTags.forEach(tag => {
      let element = document.querySelector(`meta[property="${tag.property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', tag.property);
        document.head.appendChild(element);
      }
      element.content = tag.content;
    });
  }

  private updateTwitterCards() {
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@festiwise' },
      { name: 'twitter:creator', content: '@festiwise' }
    ];

    twitterTags.forEach(tag => {
      let element = document.querySelector(`meta[name="${tag.name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', tag.name);
        document.head.appendChild(element);
      }
      element.content = tag.content;
    });
  }

  public generateFestivalSEO(festival: FestivalSEO): SEOConfig {
    const title = `${festival.name} ${new Date().getFullYear()} - ${festival.location} Music Festival | FestiWise`;
    const description = `Experience ${festival.name} in ${festival.location}. ${festival.description} Featuring ${festival.genres.join(', ')} music. Tickets from $${festival.price.min}. Get your festival guide on FestiWise.`;
    
    const keywords = [
      festival.name.toLowerCase(),
      ...festival.genres.map(g => g.toLowerCase()),
      festival.location.toLowerCase(),
      'music festival',
      'festival tickets',
      'festival guide',
      'music events',
      new Date().getFullYear().toString()
    ];

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'MusicEvent',
      name: festival.name,
      description: festival.description,
      startDate: festival.dates,
      location: {
        '@type': 'Place',
        name: festival.location
      },
      performer: {
        '@type': 'MusicGroup',
        name: 'Various Artists',
        genre: festival.genres
      },
      offers: {
        '@type': 'Offer',
        price: festival.price.min.toString(),
        priceCurrency: 'USD',
        highPrice: festival.price.max.toString(),
        availability: 'https://schema.org/InStock',
        url: festival.website
      },
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode'
    };

    return {
      title,
      description,
      keywords,
      structuredData,
      priority: 0.8,
      changeFreq: 'weekly'
    };
  }

  public generateLocationSEO(country: string, city?: string): SEOConfig {
    const location = city ? `${city}, ${country}` : country;
    const title = `Best Music Festivals in ${location} ${new Date().getFullYear()} | FestiWise`;
    const description = `Discover the best music festivals in ${location}. Find electronic, rock, pop, and world music events. Compare prices, dates, and get expert recommendations on FestiWise.`;
    
    const keywords = [
      `music festivals ${location.toLowerCase()}`,
      `${country.toLowerCase()} festivals`,
      'music events',
      'festival guide',
      'electronic music',
      'rock festivals',
      new Date().getFullYear().toString()
    ];

    if (city) {
      keywords.push(`${city.toLowerCase()} music festivals`);
    }

    return {
      title,
      description,
      keywords,
      priority: 0.7,
      changeFreq: 'monthly'
    };
  }

  public generateGenreSEO(genre: string): SEOConfig {
    const title = `Best ${genre} Music Festivals ${new Date().getFullYear()} | FestiWise`;
    const description = `Discover the world's best ${genre.toLowerCase()} music festivals. Find events, compare prices, get expert recommendations and festival guides on FestiWise.`;
    
    const keywords = [
      `${genre.toLowerCase()} festivals`,
      `${genre.toLowerCase()} music events`,
      'music festivals',
      'festival guide',
      'festival tickets',
      new Date().getFullYear().toString()
    ];

    return {
      title,
      description,
      keywords,
      priority: 0.6,
      changeFreq: 'monthly'
    };
  }

  public optimizeImages() {
    // Add loading="lazy" to images below the fold
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      if (index > 2) { // First 3 images load immediately
        img.setAttribute('loading', 'lazy');
      }
      
      // Add alt text if missing
      if (!img.alt) {
        const src = img.src || '';
        const filename = src.split('/').pop()?.split('.')[0] || '';
        img.alt = filename.replace(/[-_]/g, ' ');
      }
    });
  }

  public generateSitemap() {
    // Generate dynamic sitemap data
    const pages = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/festivals', priority: 0.9, changefreq: 'daily' },
      { url: '/quiz', priority: 0.8, changefreq: 'weekly' },
      { url: '/blog', priority: 0.7, changefreq: 'weekly' },
      { url: '/about', priority: 0.6, changefreq: 'monthly' },
      { url: '/contact', priority: 0.5, changefreq: 'monthly' },
      { url: '/faq', priority: 0.5, changefreq: 'monthly' }
    ];

    return pages.map(page => ({
      ...page,
      lastmod: new Date().toISOString().split('T')[0]
    }));
  }
}

// React Hook for Enterprise SEO
export function useEnterpriseSEO() {
  const [seoEngine] = useState(() => new EnterpriseSEOEngine());

  const applySEO = (config: SEOConfig) => {
    // Update title
    document.title = config.title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = config.description;

    // Update keywords
    if (config.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = config.keywords.join(', ');
    }

    // Update Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (ogTitle) ogTitle.content = config.title;

    const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (ogDesc) ogDesc.content = config.description;

    const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
    if (ogUrl) ogUrl.content = window.location.href;

    // Add structured data
    if (config.structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(config.structuredData);
      document.head.appendChild(script);
    }

    // Update robots meta
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = config.noIndex ? 'noindex,nofollow' : 'index,follow';
  };

  return {
    applySEO,
    generateFestivalSEO: seoEngine.generateFestivalSEO.bind(seoEngine),
    generateLocationSEO: seoEngine.generateLocationSEO.bind(seoEngine),
    generateGenreSEO: seoEngine.generateGenreSEO.bind(seoEngine),
    optimizeImages: seoEngine.optimizeImages.bind(seoEngine),
    generateSitemap: seoEngine.generateSitemap.bind(seoEngine)
  };
}

// SEO Monitor Component
export function SEOMonitor() {
  const [seoScore, setSEOScore] = useState(0);
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const checkSEO = () => {
      let score = 100;
      const currentIssues: string[] = [];

      // Check title
      if (!document.title || document.title.length < 30) {
        score -= 20;
        currentIssues.push('Title too short');
      }

      // Check meta description
      const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!metaDesc || metaDesc.content.length < 120) {
        score -= 20;
        currentIssues.push('Meta description missing or too short');
      }

      // Check headings
      const h1s = document.querySelectorAll('h1');
      if (h1s.length === 0) {
        score -= 15;
        currentIssues.push('Missing H1 tag');
      } else if (h1s.length > 1) {
        score -= 10;
        currentIssues.push('Multiple H1 tags');
      }

      // Check images alt text
      const images = document.querySelectorAll('img');
      const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
      if (imagesWithoutAlt.length > 0) {
        score -= 15;
        currentIssues.push(`${imagesWithoutAlt.length} images missing alt text`);
      }

      setSEOScore(Math.max(0, score));
      setIssues(currentIssues);
    };

    checkSEO();
    const interval = setInterval(checkSEO, 5000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed top-4 left-4 bg-white p-3 rounded-lg shadow-lg text-xs z-50 border max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <span>🔍</span>
        <span className="font-semibold">SEO Score:</span>
        <span className={`font-bold ${getScoreColor(seoScore)}`}>{seoScore}/100</span>
      </div>
      
      {issues.length > 0 && (
        <div>
          <div className="font-semibold text-red-600 mb-1">Issues:</div>
          <ul className="space-y-1">
            {issues.map((issue, index) => (
              <li key={index} className="text-red-600">• {issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EnterpriseSEOEngine;
