import type { Metadata } from 'next';
import Link from 'next/link';
import festivalsData from '@/data/festivals.json';

interface Festival {
  id: string;
  city: string;
  country: string;
  status: string;
}

function cityToSlug(city: string): string {
  return city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const CONTINENT_MAP: Record<string, string> = {
  USA:         'North America',
  Canada:      'North America',
  Mexico:      'North America',
  'Costa Rica':'North America',
  Jamaica:     'North America',
  Brazil:      'South America',
  UK:          'Europe',
  Germany:     'Europe',
  France:      'Europe',
  Spain:       'Europe',
  Netherlands: 'Europe',
  Belgium:     'Europe',
  Hungary:     'Europe',
  Denmark:     'Europe',
  Sweden:      'Europe',
  Switzerland: 'Europe',
  Portugal:    'Europe',
  Romania:     'Europe',
  Serbia:      'Europe',
  Finland:     'Europe',
  Japan:       'Asia-Pacific',
  Australia:   'Asia-Pacific',
  Thailand:    'Asia-Pacific',
  India:       'Asia-Pacific',
};

const CONTINENT_ORDER = ['Europe', 'North America', 'Asia-Pacific', 'South America'];

export const metadata: Metadata = {
  title: 'Music Festivals by City — Browse Every Festival City | FestiWise',
  description:
    'Browse music festivals by city. 80+ festival cities across Europe, North America, Asia, and beyond — from London and Barcelona to Tokyo and Melbourne.',
  alternates: { canonical: 'https://getfestiwise.com/music-festivals-in' },
  openGraph: {
    title: 'Music Festivals by City | FestiWise',
    description: 'Browse 80+ festival cities worldwide. Find every festival in your destination city.',
    url: 'https://getfestiwise.com/music-festivals-in',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music Festivals by City | FestiWise',
    description: 'Browse 80+ festival cities worldwide.',
  },
};

export default function CityIndexPage() {
  const festivals = (festivalsData as Festival[]).filter(
    f => f.city !== 'Multiple Cities'
  );

  // Build city → { country, count } map
  const cityMap = new Map<string, { country: string; count: number }>();
  for (const f of festivals) {
    const existing = cityMap.get(f.city);
    if (existing) {
      existing.count++;
    } else {
      cityMap.set(f.city, { country: f.country, count: 1 });
    }
  }

  // Group by continent → country → cities
  const continents: Record<string, Record<string, { city: string; slug: string; count: number }[]>> = {};
  for (const [city, { country, count }] of cityMap.entries()) {
    const continent = CONTINENT_MAP[country] ?? 'Other';
    if (!continents[continent]) continents[continent] = {};
    if (!continents[continent][country]) continents[continent][country] = [];
    continents[continent][country].push({ city, slug: cityToSlug(city), count });
  }

  // Sort cities within each country
  for (const continent of Object.values(continents)) {
    for (const cities of Object.values(continent)) {
      cities.sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
    }
  }

  const totalCities = cityMap.size;

  // JSON-LD: ItemList of all city pages
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Music Festival Cities',
    description: `Browse music festivals in ${totalCities} cities worldwide`,
    numberOfItems: totalCities,
    itemListElement: [...cityMap.entries()].map(([city, { country }], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Music Festivals in ${city}`,
      url: `https://getfestiwise.com/music-festivals-in/${cityToSlug(city)}`,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Browse by city
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Music festivals by city
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">
            {totalCities} festival cities across Europe, North America, Asia-Pacific, and beyond.
            Plan your trip around the music.
          </p>
        </div>
      </div>

      {/* City grid by continent */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">
        {CONTINENT_ORDER.filter(c => continents[c]).map(continentName => (
          <section key={continentName}>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">{continentName}</h2>

            <div className="space-y-8">
              {Object.entries(continents[continentName])
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([country, cities]) => (
                  <div key={country}>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3 pb-2 border-b border-gray-100">
                      {country}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cities.map(({ city, slug, count }) => (
                        <Link
                          key={slug}
                          href={`/music-festivals-in/${slug}`}
                          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-sm bg-white transition-all"
                        >
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                            {city}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-100 group-hover:bg-purple-100 group-hover:text-purple-600 rounded-full px-1.5 py-0.5 transition-colors">
                            {count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>

      {/* Quiz CTA */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Not sure which city to visit?
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-lg mx-auto">
            Our 2-minute quiz matches you with the right festival — and city — based on your music taste, budget, and travel style.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-purple-700 font-bold text-base hover:bg-purple-50 transition-all shadow-lg"
          >
            Find my perfect festival
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
