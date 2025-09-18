import { Metadata } from 'next';

interface GuidePageSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  category?: string;
}

export default function GuidePageSchema({ 
  title, 
  description, 
  url, 
  datePublished = new Date().toISOString(),
  dateModified = new Date().toISOString(),
  author = 'FestiWise Team',
  category = 'Festival Guide'
}: GuidePageSchemaProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        isPartOf: {
          '@id': `${url}#webpage`
        },
        author: {
          '@type': 'Person',
          name: author,
          url: 'https://getfestiwise.com/about'
        },
        headline: title,
        description: description,
        datePublished: datePublished,
        dateModified: dateModified,
        mainEntityOfPage: {
          '@id': `${url}#webpage`
        },
        publisher: {
          '@type': 'Organization',
          name: 'FestiWise',
          logo: {
            '@type': 'ImageObject',
            url: 'https://getfestiwise.com/logo.png'
          },
          url: 'https://getfestiwise.com'
        },
        articleSection: category,
        inLanguage: 'en-US'
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url: url,
        name: title,
        description: description,
        isPartOf: {
          '@id': 'https://getfestiwise.com#website'
        },
        datePublished: datePublished,
        dateModified: dateModified,
        inLanguage: 'en-US'
      },
      {
        '@type': 'WebSite',
        '@id': 'https://getfestiwise.com#website',
        name: 'FestiWise',
        description: 'Discover the perfect music festivals for your taste with our AI-powered recommendations',
        url: 'https://getfestiwise.com',
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://getfestiwise.com/search?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData, null, 2),
      }}
    />
  );
}