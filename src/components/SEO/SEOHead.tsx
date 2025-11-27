import Head from 'next/head';
import Script from 'next/script';
import { schemaGenerator } from '@/lib/schema-generator';

import { WithContext, Organization } from 'schema-dts';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile' | 'event';
  structuredData?: WithContext<Organization> | any;
  noIndex?: boolean;
  hrefLangs?: Array<{
    hrefLang: string;
    href: string;
  }>;
}

export default function SEO({
  title = 'Music Festival Finder | Discover Perfect Festivals - FestiWise',
  description = 'Find your perfect music festival from 500+ worldwide events. Get personalized recommendations by genre, budget & location. Free quiz takes 2 minutes.',
  canonicalUrl = 'https://getfestiwise.com',
  ogImage = 'https://getfestiwise.com/og-image.jpg',
  ogType = 'website',
  structuredData = {},
  noIndex = false,
  hrefLangs = []
}: SEOProps) {
  // Generate base schema
  const baseSchema = ogType === 'website' 
    ? schemaGenerator.generateWebsiteSchema()
    : schemaGenerator.generateOrganizationSchema();

  const schemas = [baseSchema];
  if (Object.keys(structuredData).length > 0) {
    schemas.push(structuredData);
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots Meta */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="FestiWise" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@festiwise" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Language Alternates */}
      {hrefLangs.map(({ hrefLang, href }) => (
        <link
          key={hrefLang}
          rel="alternate"
          hrefLang={hrefLang}
          href={href}
        />
      ))}
      
      {/* Mobile Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#6366f1" />
      
      {/* Structured Data */}
      {schemas.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
      
      {/* Favicons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      
      {/* Web App Manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to Important Origins */}
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    </Head>
  );
}