'use client';

import { usePathname } from 'next/navigation';

/**
 * Injects structured data for SEO based on current page context.
 */
export default function ClientStructuredData() {
  const pathname = usePathname();
  const siteUrl = 'https://getfestiwise.com';
  
  // Organization data
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'FestiWise',
    'url': siteUrl,
    'logo': `${siteUrl}/favicon.png`,
    'sameAs': [
      'https://twitter.com/festiwise',
      'https://www.instagram.com/festiwise',
      'https://www.facebook.com/festiwise'
    ],
    'description': 'Find your perfect music festival in 2 minutes with our festival finder quiz and personalized recommendations.'
  };

  // Website data
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'FestiWise',
    'url': siteUrl,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
  
  // Current page structured data
  let pageSpecificData = null;
  
  // FAQ page structured data
  if (pathname === '/faq') {
    pageSpecificData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is FestiWise?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'FestiWise is a free festival finder that helps music fans discover their perfect festival match. Take our quick quiz to get personalized recommendations based on your music taste, budget, and travel preferences.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How does the festival finder quiz work?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Our quiz analyzes your preferences for music genres, budget, location, atmosphere, and timing to match you with festivals from our curated database of 100+ world-class events.'
          }
        },
        {
          '@type': 'Question',
          'name': 'Is FestiWise free to use?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes, FestiWise is completely free to use. We don\'t charge any fees for our festival recommendations or matching service.'
          }
        }
      ]
    };
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      {pageSpecificData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSpecificData) }}
        />
      )}
    </>
  );
}
