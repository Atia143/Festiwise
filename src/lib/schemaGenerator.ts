// JSON-LD Schema markup system
import { statsManager } from './realTimeStats';

interface SchemaEvent {
  '@context': string;
  '@type': string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location: {
    '@type': string;
    name: string;
    address: {
      '@type': string;
      addressLocality: string;
      addressCountry: string;
    };
  };
  offers?: {
    '@type': string;
    url: string;
    priceCurrency: string;
    lowPrice: number;
    highPrice: number;
  };
  organizer?: {
    '@type': string;
    name: string;
    url?: string;
  };
  image?: string[];
  url: string;
}

interface Festival {
  id: string;
  name: string;
  country: string;
  city: string;
  months: string[];
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  website: string;
  description?: string;
}

class SchemaGenerator {
  private baseUrl = 'https://festivalfinder.com';

  // Generate Organization schema
  generateOrganizationSchema() {
    const stats = statsManager.getFormattedStats();
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Festival Finder',
      url: this.baseUrl,
      logo: `${this.baseUrl}/images/logo.png`,
      description: 'AI-powered music festival discovery platform helping music lovers find their perfect festival experience worldwide.',
      foundingDate: '2024',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'hello@festivalfinder.com',
        availableLanguage: 'English'
      },
      sameAs: [
        'https://twitter.com/festivalfinder',
        'https://instagram.com/festivalfinder',
        'https://facebook.com/festivalfinder'
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: stats.users.replace(/[^\d]/g, ''),
        bestRating: '5',
        worstRating: '1'
      }
    };
  }

  // Generate WebSite schema with search
  generateWebSiteSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Festival Finder',
      url: this.baseUrl,
      description: 'Discover the best music festivals worldwide with AI-powered recommendations.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };
  }

  // Generate Festival Event schema
  generateFestivalEventSchema(festival: Festival): SchemaEvent {
    // Convert month names to dates (approximate)
    const currentYear = new Date().getFullYear();
    const monthMap: Record<string, string> = {
      'january': '01-15',
      'february': '02-15',
      'march': '03-15',
      'april': '04-15',
      'may': '05-15',
      'june': '06-15',
      'july': '07-15',
      'august': '08-15',
      'september': '09-15',
      'october': '10-15',
      'november': '11-15',
      'december': '12-15'
    };

    const startDate = festival.months.length > 0 
      ? `${currentYear}-${monthMap[festival.months[0].toLowerCase()] || '07-15'}`
      : `${currentYear}-07-15`;

    return {
      '@context': 'https://schema.org',
      '@type': 'MusicEvent',
      name: festival.name,
      description: festival.description || `${festival.name} is a ${festival.genres.join(', ')} music festival in ${festival.city}, ${festival.country}.`,
      startDate,
      location: {
        '@type': 'Place',
        name: `${festival.city}, ${festival.country}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: festival.city,
          addressCountry: festival.country
        }
      },
      offers: {
        '@type': 'Offer',
        url: festival.website,
        priceCurrency: 'USD',
        lowPrice: festival.estimated_cost_usd.min,
        highPrice: festival.estimated_cost_usd.max
      },
      organizer: {
        '@type': 'Organization',
        name: festival.name,
        url: festival.website
      },
      image: [
        `${this.baseUrl}/images/festivals/${festival.id}-1.jpg`,
        `${this.baseUrl}/images/festivals/${festival.id}-2.jpg`
      ],
      url: `${this.baseUrl}/festival/${festival.id}`
    };
  }

  // Generate BreadcrumbList schema
  generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.baseUrl}${item.url}`
      }))
    };
  }

  // Generate FAQ schema
  generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  // Generate AggregateRating schema
  generateAggregateRatingSchema(festivalId: string) {
    // Mock rating data - replace with real data
    return {
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      itemReviewed: {
        '@type': 'MusicEvent',
        name: festivalId
      },
      ratingValue: '4.5',
      reviewCount: '1247',
      bestRating: '5',
      worstRating: '1'
    };
  }

  // Generate collection page schema
  generateCollectionPageSchema(title: string, description: string, items: Festival[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: this.baseUrl,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: items.length,
        itemListElement: items.slice(0, 10).map((festival, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'MusicEvent',
            name: festival.name,
            url: `${this.baseUrl}/festival/${festival.id}`
          }
        }))
      }
    };
  }
}

export const schemaGenerator = new SchemaGenerator();
export type { SchemaEvent, Festival };
