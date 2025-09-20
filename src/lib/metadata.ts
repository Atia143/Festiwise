import { Metadata } from 'next'

export const BASE_URL = 'https://getfestiwise.com'

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: 'FestiWise: Find Your Perfect Music Festival in 2 Minutes | 100+ World-Class Events',
      template: '%s | FestiWise - Music Festival Finder'
    },
    description: 'Discover your ideal music festival from 100+ world-class events worldwide. Take our free 2-minute quiz for personalized recommendations by genre, budget & location. Find festivals like Tomorrowland, Coachella, Ultra & more.',
    keywords: [
      'music festival finder', 'festival finder quiz', 'music festivals 2025', 'festival recommendations',
      'EDM festivals', 'rock festivals', 'electronic music festivals', 'indie festivals',
      'tomorrowland', 'coachella', 'burning man', 'glastonbury', 'ultra music festival',
      'festival tickets', 'music events', 'concert finder', 'festival guide',
      'best music festivals', 'festival calendar', 'music festival search',
      'european music festivals', 'american music festivals', 'festival travel',
      'festival quiz', 'personalized festival recommendations', 'festival matching',
      'music festival guide', 'worldwide music festivals', 'festival comparison',
      'music festival planner', 'festival budget calculator', 'festival travel guide'
    ],
    authors: [{ name: 'FestiWise Team' }],
    creator: 'FestiWise',
    publisher: 'FestiWise',
    applicationName: 'FestiWise',
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    category: 'entertainment',
    openGraph: {
      title: 'FestiWise: Find Your Perfect Music Festival in 2 Minutes',
      description: 'Discover your ideal music festival from 100+ world-class events worldwide. Free personalized recommendations based on your preferences.',
      url: BASE_URL,
      siteName: 'FestiWise',
      type: 'website',
      images: [{
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'FestiWise - Find Your Perfect Music Festival'
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: 'FestiWise - Find Your Perfect Music Festival',
      description: 'Discover your ideal music festival from 100+ world-class events worldwide.',
      site: '@festiwise',
      creator: '@festiwise',
      images: [`${BASE_URL}/twitter-image.jpg`],
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
    alternates: {
      canonical: BASE_URL,
      languages: {
        'en-US': BASE_URL,
        'en-GB': `${BASE_URL}/uk`,
        'es-ES': `${BASE_URL}/es`
      }
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },
  }
}