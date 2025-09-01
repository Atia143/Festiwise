// Enhanced SEO metadata system
import { Metadata } from 'next';

interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'event';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
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

class SEOManager {
  private readonly baseUrl = 'https://festivalfinder.com';
  private readonly siteName = 'Festival Finder';
  private readonly defaultImage = '/images/og-default.jpg';

  generatePageMetadata(seoData: SEOData): Metadata {
    const {
      title,
      description,
      keywords = [],
      canonical,
      ogImage = this.defaultImage,
      type = 'website',
      publishedTime,
      modifiedTime,
      author = 'Festival Finder Team',
      section
    } = seoData;

    const fullTitle = title.includes(this.siteName) ? title : `${title} | ${this.siteName}`;
    const canonicalUrl = canonical ? `${this.baseUrl}${canonical}` : undefined;

    return {
      title: fullTitle,
      description,
      keywords: keywords.join(', '),
      alternates: {
        canonical: canonicalUrl
      },
      openGraph: {
        title: fullTitle,
        description,
        url: canonicalUrl,
        siteName: this.siteName,
        images: [
          {
            url: `${this.baseUrl}${ogImage}`,
            width: 1200,
            height: 630,
            alt: title
          }
        ],
        locale: 'en_US',
        type: type as any,
        ...(publishedTime && { publishedTime }),
        ...(modifiedTime && { modifiedTime }),
        ...(author && { authors: [author] }),
        ...(section && { section })
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        images: [`${this.baseUrl}${ogImage}`],
        creator: '@festivalfinder',
        site: '@festivalfinder'
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1
        }
      },
      verification: {
        google: 'your-google-verification-code'
      }
    };
  }

  // Homepage metadata
  generateHomepageMetadata(): Metadata {
    return this.generatePageMetadata({
      title: 'Find Your Perfect Music Festival 2025 | Festival Finder',
      description: 'Discover the best music festivals worldwide with our AI-powered recommendation engine. Compare 500+ festivals, get personalized matches, and book tickets.',
      keywords: [
        'music festivals',
        'festival finder',
        'music events 2025',
        'festival tickets',
        'EDM festivals',
        'indie festivals',
        'festival guide'
      ],
      canonical: '/',
      type: 'website'
    });
  }

  // Festival page metadata
  generateFestivalMetadata(festival: Festival): Metadata {
    const months = festival.months.join(' & ');
    const genres = festival.genres.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ');
    const priceRange = `$${festival.estimated_cost_usd.min}-${festival.estimated_cost_usd.max}`;

    return this.generatePageMetadata({
      title: `${festival.name} ${new Date().getFullYear()} | ${festival.city}, ${festival.country} Festival Guide`,
      description: `${festival.name} festival in ${festival.city}, ${festival.country}. ${months} ${new Date().getFullYear()}. ${genres} music. Tickets from ${priceRange}. Complete guide & tickets.`,
      keywords: [
        festival.name.toLowerCase(),
        `${festival.name.toLowerCase()} festival`,
        `${festival.city.toLowerCase()} festivals`,
        `${festival.country.toLowerCase()} music festivals`,
        ...festival.genres.map(g => `${g} festivals`),
        'festival tickets',
        'music festival guide'
      ],
      canonical: `/festival/${festival.id}`,
      type: 'event',
      ogImage: `/images/festivals/${festival.id}-og.jpg`
    });
  }

  // Country index metadata
  generateCountryIndexMetadata(country: string, festivalCount: number): Metadata {
    return this.generatePageMetadata({
      title: `${festivalCount} Best Music Festivals in ${country} 2025 | Complete Guide`,
      description: `Discover all ${festivalCount} music festivals in ${country} for 2025. EDM, indie, rock & more. Compare dates, prices & tickets for the best ${country} festival experience.`,
      keywords: [
        `${country.toLowerCase()} music festivals`,
        `${country.toLowerCase()} festivals 2025`,
        `best festivals ${country.toLowerCase()}`,
        `${country.toLowerCase()} EDM festivals`,
        `${country.toLowerCase()} indie festivals`,
        'festival guide',
        'music events'
      ],
      canonical: `/festivals/${country.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'website'
    });
  }

  // Genre index metadata
  generateGenreIndexMetadata(genre: string, festivalCount: number): Metadata {
    const genreName = this.capitalizeGenre(genre);
    
    return this.generatePageMetadata({
      title: `${festivalCount} Best ${genreName} Festivals 2025 | ${genreName} Music Events Worldwide`,
      description: `Find the best ${genreName.toLowerCase()} music festivals worldwide. ${festivalCount} festivals featuring top ${genreName.toLowerCase()} artists. Compare tickets, dates & lineups.`,
      keywords: [
        `${genreName.toLowerCase()} festivals`,
        `${genreName.toLowerCase()} music festivals`,
        `best ${genreName.toLowerCase()} festivals`,
        `${genreName.toLowerCase()} events 2025`,
        `${genreName.toLowerCase()} festival tickets`,
        'music festivals',
        'festival guide'
      ],
      canonical: `/festivals/genre/${genre.toLowerCase()}`,
      type: 'website'
    });
  }

  // Quiz metadata
  generateQuizMetadata(): Metadata {
    return this.generatePageMetadata({
      title: 'Festival Personality Quiz | Find Your Perfect Music Festival Match',
      description: 'Take our AI-powered festival quiz to discover your perfect music festival match. Answer 8 questions and get personalized recommendations from 500+ festivals worldwide.',
      keywords: [
        'festival quiz',
        'music festival quiz',
        'festival finder quiz',
        'festival personality test',
        'music festival recommendation',
        'festival matcher'
      ],
      canonical: '/quiz',
      type: 'website'
    });
  }

  private capitalizeGenre(genre: string): string {
    const genreMap: Record<string, string> = {
      'electronic': 'Electronic',
      'hiphop': 'Hip-Hop',
      'indie': 'Indie',
      'rock': 'Rock',
      'pop': 'Pop',
      'folk': 'Folk',
      'jazz': 'Jazz',
      'classical': 'Classical',
      'reggae': 'Reggae'
    };
    return genreMap[genre] || genre.charAt(0).toUpperCase() + genre.slice(1);
  }
}

export const seoManager = new SEOManager();
export type { SEOData, Festival };
