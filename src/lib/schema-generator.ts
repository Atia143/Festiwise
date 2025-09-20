import { Organization, WithContext } from 'schema-dts';

export interface Festival {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    city: string;
    country: string;
  };
  images: string[];
  performers?: string[];
  ticketUrl?: string;
  ticketPrice?: {
    min: number;
    max: number;
    currency: string;
  };
  organizer?: {
    name: string;
    url: string;
  };
}

export interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    image?: string;
  };
  date: string;
  slug: string;
  image?: string;
  tags: string[];
  category: string;
}

class SchemaGenerator {
  private baseUrl: string = 'https://getfestiwise.com';

  public generateOrganizationSchema(): WithContext<Organization> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${this.baseUrl}/#organization`,
      name: 'FestiWise',
      description: 'Your ultimate music festival discovery platform',
      url: this.baseUrl,
      logo: `${this.baseUrl}/logo.png`,
      sameAs: [
        'https://twitter.com/festiwise',
        'https://facebook.com/festiwise',
        'https://instagram.com/festiwise'
      ],
      contactPoint: [{
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'support@getfestiwise.com'
      }]
    };
  }

  public generateWebsiteSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.baseUrl}/#website`,
      url: this.baseUrl,
      name: 'FestiWise',
      description: 'Find your perfect music festival with personalized recommendations',
      publisher: { '@id': `${this.baseUrl}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  public generateFestivalSchema(festival: Festival) {
    return {
      '@context': 'https://schema.org',
      '@type': 'MusicEvent',
      name: festival.name,
      description: festival.description,
      startDate: festival.startDate,
      endDate: festival.endDate,
      location: {
        '@type': 'Place',
        name: festival.location.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: festival.location.city,
          addressCountry: festival.location.country
        }
      },
      image: festival.images.map(img => ({
        '@type': 'ImageObject',
        url: img.startsWith('http') ? img : `${this.baseUrl}${img}`
      })),
      performer: festival.performers?.map(name => ({
        '@type': 'MusicGroup',
        name
      })) || [{
        '@type': 'MusicGroup',
        name: 'Various Artists'
      }],
      offers: festival.ticketPrice ? {
        '@type': 'Offer',
        url: festival.ticketUrl,
        price: festival.ticketPrice.min,
        priceCurrency: festival.ticketPrice.currency,
        priceValidUntil: festival.startDate,
        availability: 'https://schema.org/InStock'
      } : undefined,
      organizer: festival.organizer ? {
        '@type': 'Organization',
        name: festival.organizer.name,
        url: festival.organizer.url
      } : undefined
    };
  }

  public generateBlogPostSchema(post: BlogPost) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: post.image ? [post.image] : undefined,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Person',
        name: post.author.name,
        image: post.author.image
      },
      publisher: {
        '@type': 'Organization',
        name: 'FestiWise',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.baseUrl}/blog/${post.slug}`
      },
      keywords: post.tags.join(', '),
      articleSection: post.category
    };
  }

  public generateFAQSchema(faqs: Array<{question: string, answer: string}>) {
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

  public generateBreadcrumbSchema(items: Array<{name: string, url: string}>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${this.baseUrl}${item.url}`
      }))
    };
  }

  public generateQuizSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'Festival Finder Quiz',
      about: 'Find your perfect music festival match',
      educationalUse: 'assessment',
      assesses: 'Music festival preferences',
      hasPart: [
        {
          '@type': 'Question',
          name: 'Music Genre Preferences',
          text: 'What are your favorite music genres?'
        },
        {
          '@type': 'Question',
          name: 'Budget Range',
          text: 'What is your budget range for festival tickets?'
        },
        {
          '@type': 'Question',
          name: 'Location Preferences',
          text: 'Where would you like to attend a festival?'
        }
      ]
    };
  }

  public generateSearchResultsSchema(query: string, results: Festival[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      name: `Festival search results for "${query}"`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: results.length,
        itemListElement: results.map((festival, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'MusicEvent',
            name: festival.name,
            description: festival.description,
            url: `${this.baseUrl}/festival/${festival.id}`
          }
        }))
      }
    };
  }
}

export const schemaGenerator = new SchemaGenerator();