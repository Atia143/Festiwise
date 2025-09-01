import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import rawFestivals from '@/data/festivals.json';
import FestivalGrid from '@/components/FestivalGrid';
import Breadcrumbs from '@/components/SEO/Breadcrumbs';
import SchemaMarkup from '@/components/SEO/SchemaMarkup';

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

// Generate static paths for genre pages
export async function generateStaticParams() {
  const genres = [...new Set(festivals.flatMap(f => f.genres))];
  return genres.map(genre => ({
    genre: genre.toLowerCase().replace(/\s+/g, '-')
  }));
}

// Generate dynamic metadata for each genre
export async function generateMetadata({ params }: { params: Promise<{ genre: string }> }): Promise<Metadata> {
  const { genre } = await params;
  const genreName = genre.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const genreFestivals = festivals.filter(f => 
    f.genres.some(g => g.toLowerCase().replace(/\s+/g, '-') === genre)
  );

  if (genreFestivals.length === 0) {
    return {
      title: 'Genre Not Found',
      description: 'No festivals found for this genre.'
    };
  }

  const countries = [...new Set(genreFestivals.map(f => f.country))];
  const minPrice = Math.min(...genreFestivals.map(f => f.estimated_cost_usd.min));

  return {
    title: `${genreFestivals.length} Best ${genreName} Music Festivals ${new Date().getFullYear()} | Complete Guide`,
    description: `Discover ${genreFestivals.length} incredible ${genreName} music festivals worldwide. From ${countries.slice(0, 3).join(', ')} and more. Tickets from $${minPrice}. Dates, lineup & festival guide.`,
    keywords: [
      `${genreName} festivals`,
      `${genreName} music festivals ${new Date().getFullYear()}`,
      `best ${genreName} festivals`,
      ...countries.map(c => `${genreName} festivals ${c}`),
      `${genreName} festival tickets`,
      `${genreName} events`
    ],
    openGraph: {
      title: `${genreFestivals.length} Best ${genreName} Music Festivals | ${new Date().getFullYear()} Guide`,
      description: `${genreFestivals.length} ${genreName} festivals across ${countries.length} countries. From $${minPrice}+ | Complete guide`,
      images: [{
        url: `/api/og/genre/${genre}`,
        width: 1200,
        height: 630,
        alt: `${genreName} Music Festivals ${new Date().getFullYear()}`
      }]
    },
    alternates: {
      canonical: `https://festiwise.com/festivals/genre/${genre}`
    }
  };
}

export default async function GenreFestivalsPage({ params }: { params: Promise<{ genre: string }> }) {
  const { genre } = await params;
  const genreName = genre.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const genreFestivals = festivals.filter(f => 
    f.genres.some(g => g.toLowerCase().replace(/\s+/g, '-') === genre)
  );

  if (genreFestivals.length === 0) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Festivals', href: '/festivals' },
    { label: 'By Genre', href: '/festivals/genre' },
    { label: genreName, href: `/festivals/genre/${genre}` }
  ];

  const countries = [...new Set(genreFestivals.map(f => f.country))];
  const avgPrice = Math.round(
    genreFestivals.reduce((sum, f) => sum + (f.estimated_cost_usd.min + f.estimated_cost_usd.max) / 2, 0) / genreFestivals.length
  );

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${genreName} Music Festivals`,
    "description": `Complete guide to ${genreFestivals.length} ${genreName} music festivals worldwide`,
    "url": `https://festiwise.com/festivals/genre/${genre}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": genreFestivals.length,
      "itemListElement": genreFestivals.map((festival, index) => ({
        "@type": "Event",
        "position": index + 1,
        "name": festival.name,
        "genre": genreName,
        "location": {
          "@type": "Place",
          "name": `${festival.city}, ${festival.country}`
        }
      }))
    }
  };

  return (
    <>
      <SchemaMarkup data={schemaData} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Breadcrumbs items={breadcrumbs} />
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              {genreName} Music Festivals
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Explore {genreFestivals.length} incredible {genreName} festivals across {countries.length} countries. 
              From intimate venues to massive celebrations.
            </p>
            
            {/* Genre Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{genreFestivals.length}</div>
                <div className="text-sm text-gray-600">Festivals</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{countries.length}</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  ${Math.min(...genreFestivals.map(f => f.estimated_cost_usd.min))}+
                </div>
                <div className="text-sm text-gray-600">From Price</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">${avgPrice}</div>
                <div className="text-sm text-gray-600">Avg Price</div>
              </div>
            </div>
          </div>

          <FestivalGrid festivals={genreFestivals} />
        </div>
      </div>
    </>
  );
}
