export const DEFAULT_SEO_CONFIG = {
  title: {
    default: 'FestiWise: Find Your Perfect Music Festival in 2 Minutes | 100+ World-Class Events',
    template: '%s | FestiWise'
  },
  description: 'Discover your ideal music festival from 100+ world-class events worldwide. Take our free 2-minute quiz for personalized recommendations by genre, budget & location. From Tomorrowland to Coachella.',
  canonical: 'https://getfestiwise.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://getfestiwise.com',
    siteName: 'FestiWise',
    title: 'FestiWise - Music Festival Finder & Recommendations',
    description: 'Find your perfect music festival match from 100+ curated worldwide events. Free personalized recommendations based on your preferences.',
    images: [
      {
        url: 'https://getfestiwise.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FestiWise - Find Your Perfect Music Festival'
      }
    ]
  },
  twitter: {
    handle: '@festiwise',
    site: '@festiwise',
    cardType: 'summary_large_image'
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      name: 'theme-color',
      content: '#6366f1'
    }
  ]
};

export const GLOBAL_STRUCTURED_DATA = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://getfestiwise.com/#organization',
    name: 'FestiWise',
    url: 'https://getfestiwise.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://getfestiwise.com/logo.png',
      width: 192,
      height: 192
    },
    sameAs: [
      'https://twitter.com/festiwise',
      'https://facebook.com/festiwise',
      'https://instagram.com/festiwise'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@getfestiwise.com'
    }
  },
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://getfestiwise.com/#website',
    name: 'FestiWise',
    description: 'Find your perfect music festival with personalized recommendations',
    publisher: { '@id': 'https://getfestiwise.com/#organization' },
    url: 'https://getfestiwise.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://getfestiwise.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }
};

export const generateFestivalSchema = (festival: any) => ({
  '@context': 'https://schema.org',
  '@type': 'MusicEvent',
  name: festival.name,
  description: festival.description,
  startDate: festival.startDate,
  endDate: festival.endDate,
  location: {
    '@type': 'Place',
    name: festival.venue,
    address: {
      '@type': 'PostalAddress',
      addressLocality: festival.city,
      addressCountry: festival.country
    }
  },
  image: festival.images,
  performer: {
    '@type': 'MusicGroup',
    name: festival.performers || 'Various Artists'
  },
  offers: {
    '@type': 'Offer',
    url: festival.ticketUrl,
    price: festival.ticketPrice,
    priceCurrency: festival.currency || 'USD',
    availability: 'https://schema.org/InStock',
    validFrom: festival.ticketSaleDate
  },
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  organizer: {
    '@type': 'Organization',
    name: festival.organizer,
    url: festival.organizerUrl
  }
});