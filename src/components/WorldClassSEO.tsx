'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  structuredData?: any;
  noIndex?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

interface WorldClassSEOProps extends SEOMetadata {
  children?: React.ReactNode;
}

const DEFAULT_SEO = {
  title: 'Festival Finder - Discover Your Perfect Music Festival 2025',
  description: 'Find your ideal music festival with our AI-powered recommendations. Discover 500+ festivals worldwide, get personalized matches, and plan your perfect festival experience.',
  keywords: [
    'music festivals',
    'festival finder',
    'music events',
    'festival recommendations',
    'electronic music festivals',
    'rock festivals',
    'festival guide 2025',
    'music festival tickets',
    'festival calendar',
    'best music festivals'
  ],
  ogImage: '/og-image-festival-finder.png',
  author: 'Festival Finder Team'
};

export default function WorldClassSEO({
  title,
  description,
  keywords = [],
  ogImage,
  ogType = 'website',
  canonicalUrl,
  structuredData,
  noIndex = false,
  author,
  publishedTime,
  modifiedTime,
  children
}: WorldClassSEOProps) {
  const pathname = usePathname();
  
  // Construct full URLs
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://festivalfinder.com';
  const fullCanonicalUrl = canonicalUrl || `${baseUrl}${pathname}`;
  const fullOgImage = ogImage || `${baseUrl}${DEFAULT_SEO.ogImage}`;
  
  // Combine keywords
  const allKeywords = [...DEFAULT_SEO.keywords, ...keywords];
  
  // Generate page-specific structured data
  const generateStructuredData = () => {
    const baseStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Festival Finder',
      description: description || DEFAULT_SEO.description,
      url: baseUrl,
      applicationCategory: 'EntertainmentApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      author: {
        '@type': 'Organization',
        name: 'Festival Finder',
        url: baseUrl
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '12500'
      }
    };

    if (structuredData) {
      return {
        ...baseStructuredData,
        ...structuredData
      };
    }

    return baseStructuredData;
  };

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: fullCanonicalUrl,
        custom_parameters: {
          content_group1: 'Festival Finder',
          content_group2: pathname.split('/')[1] || 'home'
        }
      });

      // Enhanced page view tracking
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: fullCanonicalUrl,
        page_path: pathname,
        custom_parameters: {
          seo_optimized: true,
          page_type: ogType,
          has_structured_data: !!structuredData
        }
      });
    }
  }, [title, fullCanonicalUrl, pathname, ogType, structuredData]);

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={allKeywords.join(', ')} />
        
        {/* Author and Publication */}
        {author && <meta name="author" content={author} />}
        {publishedTime && <meta name="article:published_time" content={publishedTime} />}
        {modifiedTime && <meta name="article:modified_time" content={modifiedTime} />}
        
        {/* Canonical URL */}
        <link rel="canonical" href={fullCanonicalUrl} />
        
        {/* Robots */}
        <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
        <meta name="googlebot" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
        
        {/* Open Graph */}
        <meta property="og:type" content={ogType} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullOgImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />
        <meta property="og:url" content={fullCanonicalUrl} />
        <meta property="og:site_name" content="Festival Finder" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@festivalfinder" />
        <meta name="twitter:creator" content="@festivalfinder" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullOgImage} />
        <meta name="twitter:image:alt" content={title} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Festival Finder" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData())
          }}
        />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Performance Hints */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      {children}
    </>
  );
}

// Specialized SEO components for different page types
export const FestivalPageSEO = ({ festival, children }: { festival: any; children?: React.ReactNode }) => (
  <WorldClassSEO
    title={`${festival.name} - ${festival.location.city}, ${festival.location.country} | Festival Finder`}
    description={`Discover ${festival.name} in ${festival.location.city}. Get tickets, lineup info, and everything you need to know about this ${festival.genres.join(', ')} festival.`}
    keywords={[
      festival.name.toLowerCase(),
      ...festival.genres.map((g: string) => g.toLowerCase()),
      festival.location.city.toLowerCase(),
      festival.location.country.toLowerCase(),
      'festival tickets',
      'lineup',
      'dates'
    ]}
    ogType="event"
    structuredData={{
      '@type': 'MusicEvent',
      name: festival.name,
      description: festival.description,
      startDate: festival.dates.start,
      endDate: festival.dates.end,
      location: {
        '@type': 'Place',
        name: festival.location.venue || festival.location.city,
        address: {
          '@type': 'PostalAddress',
          addressLocality: festival.location.city,
          addressCountry: festival.location.country
        }
      },
      performer: {
        '@type': 'MusicGroup',
        name: 'Various Artists'
      },
      offers: festival.ticketPrice ? {
        '@type': 'Offer',
        price: festival.ticketPrice.min,
        priceCurrency: festival.ticketPrice.currency,
        availability: 'https://schema.org/InStock'
      } : undefined
    }}
  >
    {children}
  </WorldClassSEO>
);

export const QuizPageSEO = ({ children }: { children?: React.ReactNode }) => (
  <WorldClassSEO
    title="Festival Quiz - Find Your Perfect Music Festival Match | Festival Finder"
    description="Take our 2-minute AI-powered quiz to discover music festivals perfectly matched to your taste. Get personalized recommendations from 500+ festivals worldwide."
    keywords={[
      'festival quiz',
      'music festival quiz',
      'festival recommendations',
      'festival matcher',
      'ai festival finder',
      'personalized festival guide'
    ]}
    ogType="website"
    structuredData={{
      '@type': 'Quiz',
      name: 'Festival Finder Quiz',
      description: 'AI-powered quiz to find your perfect music festival',
      about: {
        '@type': 'Thing',
        name: 'Music Festivals'
      }
    }}
  >
    {children}
  </WorldClassSEO>
);

export const BlogPostSEO = ({ 
  post, 
  children 
}: { 
  post: {
    title: string;
    description: string;
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    tags: string[];
  };
  children?: React.ReactNode;
}) => (
  <WorldClassSEO
    title={`${post.title} | Festival Finder Blog`}
    description={post.description}
    keywords={post.tags}
    author={post.author}
    publishedTime={post.publishedTime}
    modifiedTime={post.modifiedTime}
    ogType="article"
    structuredData={{
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      author: {
        '@type': 'Person',
        name: post.author
      },
      datePublished: post.publishedTime,
      dateModified: post.modifiedTime || post.publishedTime,
      publisher: {
        '@type': 'Organization',
        name: 'Festival Finder'
      }
    }}
  >
    {children}
  </WorldClassSEO>
);
