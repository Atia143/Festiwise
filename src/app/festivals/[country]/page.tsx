import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import rawFestivals from '@/data/festivals.json';
import FestivalGrid from '@/components/FestivalGrid';
import Breadcrumbs from '@/components/SEO/Breadcrumbs';
import FestivalListingSchema from '@/components/SEO/FestivalListingSchema';

interface Festival {
  id: string;
  name: string;
  country: string;
  city: string;
  months: string[];
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  audience_size: string;
  duration_days: number;
  family_friendly: boolean;
  camping: boolean;
  glamping?: boolean;
  weather_profile: string[];
  vibe: string[];
  website: string;
  status: string;
  min_age?: number;
  ticket_official_url: string;
}

const festivals = rawFestivals as Festival[];

// Generate static paths for all countries
export async function generateStaticParams() {
  const countries = [...new Set(festivals.map(f => f.country.toLowerCase().replace(/\s+/g, '-')))];
  return countries.map(country => ({ country }));
}

// Generate dynamic metadata for each country
export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const countryName = country.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const countryFestivals = festivals.filter(f => 
    f.country.toLowerCase().replace(/\s+/g, '-') === country
  );

  if (countryFestivals.length === 0) {
    return {
      title: 'Country Not Found',
      description: 'The requested country was not found in our festival database.'
    };
  }

  const topGenres = [...new Set(countryFestivals.flatMap(f => f.genres))].slice(0, 3);
  const avgPrice = Math.round(
    countryFestivals.reduce((sum, f) => sum + (f.estimated_cost_usd.min + f.estimated_cost_usd.max) / 2, 0) / countryFestivals.length
  );

  return {
    title: `${countryFestivals.length} Music Festivals in ${countryName} | ${new Date().getFullYear()} Guide`,
    description: `Discover ${countryFestivals.length} incredible music festivals in ${countryName}. From ${topGenres.join(', ')} events starting at $${Math.min(...countryFestivals.map(f => f.estimated_cost_usd.min))}. Complete guide with dates, tickets & reviews.`,
    keywords: [
      `${countryName} music festivals`,
      `festivals in ${countryName}`,
      ...topGenres.map(g => `${g} festivals ${countryName}`),
      `${countryName} festival guide ${new Date().getFullYear()}`
    ],
    openGraph: {
      title: `${countryFestivals.length} Music Festivals in ${countryName} | Complete ${new Date().getFullYear()} Guide`,
      description: `Explore ${countryFestivals.length} festivals in ${countryName}. ${topGenres.join(', ')} events from $${Math.min(...countryFestivals.map(f => f.estimated_cost_usd.min))}+`,
      images: [{
        url: `/api/og/country/${country}`,
        width: 1200,
        height: 630,
        alt: `${countryName} Music Festivals ${new Date().getFullYear()}`
      }]
    },
    alternates: {
      canonical: `https://getfestiwise.com/festivals/${country}`
    }
  };
}

export default async function CountryFestivalsPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const countryName = country.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const countryFestivals = festivals.filter(f => 
    f.country.toLowerCase().replace(/\s+/g, '-') === country
  );

  if (countryFestivals.length === 0) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Festivals', href: '/festivals' },
    { label: countryName, href: `/festivals/${country}` }
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Music Festivals in ${countryName}`,
    "description": `Complete guide to ${countryFestivals.length} music festivals in ${countryName}`,
    "url": `https://getfestiwise.com/festivals/${country}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": countryFestivals.length,
      "itemListElement": countryFestivals.map((festival, index) => ({
        "@type": "Event",
        "position": index + 1,
        "name": festival.name,
        "location": {
          "@type": "Place",
          "name": `${festival.city}, ${festival.country}`,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": festival.country,
            "addressLocality": festival.city
          }
        },
        "organizer": {
          "@type": "Organization",
          "name": festival.name,
          "url": festival.website
        },
        "offers": {
          "@type": "Offer",
          "lowPrice": festival.estimated_cost_usd.min,
          "highPrice": festival.estimated_cost_usd.max,
          "priceCurrency": "USD"
        }
      }))
    }
  };

  return (
    <>
      <FestivalListingSchema 
        festivals={countryFestivals}
        pageTitle={`Music Festivals in ${countryName}`}
        pageDescription={`Complete guide to ${countryFestivals.length} music festivals in ${countryName}`}
        pageUrl={`https://getfestiwise.com/festivals/${country}`}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Breadcrumbs items={breadcrumbs} />
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Music Festivals in {countryName}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover {countryFestivals.length} incredible festivals across {countryName}. 
              From intimate venues to massive celebrations, find your perfect music experience.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{countryFestivals.length}</div>
                <div className="text-sm text-gray-600">Festivals</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  ${Math.min(...countryFestivals.map(f => f.estimated_cost_usd.min))}+
                </div>
                <div className="text-sm text-gray-600">From Price</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {[...new Set(countryFestivals.flatMap(f => f.genres))].length}
                </div>
                <div className="text-sm text-gray-600">Genres</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {[...new Set(countryFestivals.map(f => f.city))].length}
                </div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
            </div>
          </div>

          <FestivalGrid festivals={countryFestivals} />
        </div>
      </div>
    </>
  );
}
