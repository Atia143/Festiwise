import { Metadata } from 'next'
import { headers } from 'next/headers'

export const BASE_URL = 'https://getfestiwise.com'

export async function generateMetadata(): Promise<Metadata> {
  // Read current path from middleware-injected header for dynamic hreflang
  let pathname = '/';
  try {
    const h = await headers();
    pathname = h.get('x-pathname') ?? '/';
  } catch {
    // headers() not available in static context — use root path
  }

  // Strip leading slash for URL building (keep it for path '/')
  const path = pathname === '/' ? '' : pathname;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: 'FestiWise: Find Your Perfect Music Festival in 2 Minutes | 100+ World-Class Events',
      template: '%s | FestiWise'
    },
    description: 'Discover your ideal music festival from 100+ world-class events worldwide. Take our free 2-minute quiz for personalized recommendations by genre, budget & location. Find festivals like Tomorrowland, Coachella, Ultra & more.',
    keywords: [
      'music festival finder', 'festival finder quiz', `music festivals ${new Date().getFullYear()}`, 'festival recommendations',
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
    category: 'entertainment',
    openGraph: {
      title: 'FestiWise: Find Your Perfect Music Festival in 2 Minutes',
      description: 'Discover your ideal music festival from 100+ world-class events worldwide. Free personalized recommendations based on your preferences.',
      url: BASE_URL,
      siteName: 'FestiWise',
      type: 'website',
      images: [{
        url: `${BASE_URL}/api/og/quiz-results?score=95&genre=electronic&budget=mid`,
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
      images: [`${BASE_URL}/api/og/quiz-results?score=95&genre=electronic&budget=mid`],
    },
    // TODO: Replace with your actual Google Search Console verification code
    // Get it from: https://search.google.com/search-console → Add Property → HTML tag method
    // verification: {
    //   google: 'paste-your-code-here',
    // },
    alternates: {
      canonical: `${BASE_URL}${path}`,
      languages: {
        'en':        `${BASE_URL}${path}`,
        'es':        `${BASE_URL}/es${path}`,
        'de':        `${BASE_URL}/de${path}`,
        'fr':        `${BASE_URL}/fr${path}`,
        'x-default': `${BASE_URL}${path}`,
      },
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