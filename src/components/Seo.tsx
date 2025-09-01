'use client';

import Head from 'next/head';
import Script from 'next/script';

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  structuredData?: object[];
}

export default function Seo({
  title = 'Music Festival Finder | Discover Perfect Festivals - FestiWise',
  description = 'Find your perfect music festival from 500+ worldwide events. Get personalized recommendations by genre, budget & location. Free quiz takes 2 minutes.',
  canonical = 'https://getfestiwise.com',
  image = 'https://getfestiwise.com/og-image.jpg',
  type = 'website',
  structuredData = []
}: SeoProps) {
  
  const jsonLd = [
    // Organization
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'FestiWise',
      description: 'Music festival finder and recommendation platform',
      url: 'https://getfestiwise.com',
      logo: 'https://getfestiwise.com/logo.png',
      sameAs: [
        'https://twitter.com/festiwise',
        'https://facebook.com/festiwise'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'hello@getfestiwise.com'
      }
    },
    // WebSite with SearchAction
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'FestiWise',
      url: 'https://getfestiwise.com',
      description: 'Music festival finder and recommendation platform',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://getfestiwise.com/festivals?search={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    },
    // Custom structured data
    ...structuredData
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content="FestiWise" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Sitemap and RSS */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </Head>
      
      {/* JSON-LD Structured Data */}
      {jsonLd.map((data, index) => (
        <Script
          key={index}
          id={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
