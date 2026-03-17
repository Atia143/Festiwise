import type { Metadata } from 'next';
import Link from 'next/link';
import festivalsData from '@/data/festivals.json';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Festival {
  id: string;
  name: string;
  city: string;
  country: string;
  months: string[];
  genres: string[];
  duration_days: number;
  audience_size: string;
  estimated_cost_usd: { min: number; max: number };
  vibe: string[];
  camping: boolean;
  family_friendly: boolean;
  website: string;
  description?: string;
}

// ─── City slug helpers ────────────────────────────────────────────────────────
function cityToSlug(city: string): string {
  return city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // strip diacritics (é→e, ü→u, etc.)
    .replace(/[^a-z0-9\s-]/g, ' ')     // special chars → space
    .trim()
    .replace(/\s+/g, '-')              // spaces → hyphens
    .replace(/-+/g, '-');              // dedupe hyphens
}

function slugToCity(slug: string, festivals: Festival[]): string | undefined {
  return festivals.find(f => cityToSlug(f.city) === slug)?.city;
}

function allFestivalsByCity(city: string): Festival[] {
  return (festivalsData as Festival[]).filter(f => f.city === city);
}

function formatCost(f: Festival) {
  return `$${f.estimated_cost_usd.min.toLocaleString()}–$${f.estimated_cost_usd.max.toLocaleString()}`;
}

const AUDIENCE_LABEL: Record<string, string> = {
  massive: 'Massive',
  large: 'Large',
  medium: 'Medium',
  small: 'Small',
  intimate: 'Intimate',
};

// ─── Static params — one page per unique city ─────────────────────────────────
export async function generateStaticParams() {
  const festivals = festivalsData as Festival[];
  const uniqueCities = [...new Set(festivals.map(f => f.city))].filter(
    c => c !== 'Multiple Cities'
  );
  return uniqueCities.map(city => ({ city: cityToSlug(city) }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const festivals = festivalsData as Festival[];
  const cityName = slugToCity(citySlug, festivals);

  if (!cityName) return { title: 'Music Festivals | FestiWise' };

  const cityFestivals = allFestivalsByCity(cityName);
  const country = cityFestivals[0]?.country ?? '';
  const count = cityFestivals.length;
  const festivalNames = cityFestivals.map(f => f.name).join(', ');

  const title = `Music Festivals in ${cityName} ${new Date().getFullYear()} — ${count === 1 ? cityFestivals[0].name : `${count} Festivals`} | FestiWise`;
  const description =
    count === 1
      ? `Everything you need to know about ${cityFestivals[0].name} in ${cityName}, ${country}. Dates, budget, genres, tickets and more.`
      : `${count} music festivals in ${cityName}, ${country}: ${festivalNames}. Compare dates, budgets, genres and find the one that suits you.`;

  return {
    title,
    description,
    alternates: { canonical: `https://getfestiwise.com/music-festivals-in/${citySlug}` },
    openGraph: {
      title,
      description,
      url: `https://getfestiwise.com/music-festivals-in/${citySlug}`,
      type: 'website',
      images: [{
        url: `https://getfestiwise.com/api/og/city?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(country)}&count=${count}`,
        width: 1200, height: 630, alt: `Music Festivals in ${cityName}`,
      }],
    },
    twitter: { card: 'summary_large_image', title, description,
      images: [`https://getfestiwise.com/api/og/city?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(country)}&count=${count}`],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CityFestivalsPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const festivals = festivalsData as Festival[];
  const cityName = slugToCity(citySlug, festivals);

  if (!cityName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No festivals found for this city.</p>
          <Link href="/festivals" className="text-purple-600 hover:underline font-medium">
            Browse all festivals →
          </Link>
        </div>
      </div>
    );
  }

  const cityFestivals = allFestivalsByCity(cityName);
  const country = cityFestivals[0]?.country ?? '';
  const allGenres = [...new Set(cityFestivals.flatMap(f => f.genres))];
  const allMonths = [...new Set(cityFestivals.flatMap(f => f.months))].sort(
    (a, b) =>
      ['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(a) -
      ['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(b)
  );

  // Nearby cities — same country, different city
  const nearbyCities = [
    ...new Set(
      festivals
        .filter(f => f.country === country && f.city !== cityName && f.city !== 'Multiple Cities')
        .map(f => f.city)
    ),
  ].slice(0, 5);

  // JSON-LD schemas
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Music Festivals in ${cityName}`,
    description: `${cityFestivals.length} music festival${cityFestivals.length !== 1 ? 's' : ''} in ${cityName}, ${country}`,
    numberOfItems: cityFestivals.length,
    itemListElement: cityFestivals.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.name,
      url: `https://getfestiwise.com/festival/${f.id}`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FestiWise', item: 'https://getfestiwise.com' },
      { '@type': 'ListItem', position: 2, name: 'Festivals by City', item: 'https://getfestiwise.com/music-festivals-in' },
      { '@type': 'ListItem', position: 3, name: `Music Festivals in ${cityName}`, item: `https://getfestiwise.com/music-festivals-in/${citySlug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-6 py-14 md:py-20">
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-4">
            {country}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Music Festivals<br className="hidden sm:block" /> in {cityName}
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mb-8">
            {cityFestivals.length === 1
              ? `${cityFestivals[0].name} is the premier music festival in ${cityName}. Here's everything you need to plan your trip.`
              : `${cityFestivals.length} music festivals take place in ${cityName}. Compare them side-by-side and find the one that fits you.`}
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <span>
              <span className="text-white font-bold">{cityFestivals.length}</span> festival{cityFestivals.length !== 1 ? 's' : ''}
            </span>
            {allMonths.length > 0 && (
              <span>
                <span className="text-white font-bold">{allMonths.slice(0, 3).join(', ')}</span>
                {allMonths.length > 3 && ' & more'}
              </span>
            )}
            {allGenres.length > 0 && (
              <span>
                <span className="text-white font-bold">{allGenres.slice(0, 3).join(', ')}</span>
                {allGenres.length > 3 && ` +${allGenres.length - 3} genres`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Festival cards */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {cityFestivals.length === 1 ? 'The festival' : `All ${cityFestivals.length} festivals`} in {cityName}
        </h2>

        <div className="space-y-5">
          {cityFestivals.map(festival => (
            <Link
              key={festival.id}
              href={`/festival/${festival.id}`}
              className="block group"
            >
              <div className="border border-gray-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {festival.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {festival.city}, {festival.country} · {festival.months.join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{formatCost(festival)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{festival.duration_days} days</p>
                  </div>
                </div>

                {/* Genre tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {festival.genres.slice(0, 5).map(g => (
                    <span
                      key={g}
                      className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100"
                    >
                      {g}
                    </span>
                  ))}
                  {festival.genres.length > 5 && (
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">
                      +{festival.genres.length - 5}
                    </span>
                  )}
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
                  <span>{AUDIENCE_LABEL[festival.audience_size.toLowerCase()] ?? festival.audience_size} crowd</span>
                  {festival.camping && <span>Camping available</span>}
                  {festival.family_friendly && <span>Family friendly</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Description if single festival */}
        {cityFestivals.length === 1 && cityFestivals[0].description && (
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
            <p className="text-gray-700 leading-relaxed">{cityFestivals[0].description}</p>
          </div>
        )}
      </div>

      {/* Quiz CTA */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Not sure {cityName} is the right fit?
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-lg mx-auto">
            Take our 2-minute quiz and we&apos;ll match you with the perfect festival from our database of 100+ worldwide events.
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

      {/* Other cities in same country */}
      {nearbyCities.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h3 className="text-base font-bold text-gray-900 mb-5">
            More festivals in {country}
          </h3>
          <div className="flex flex-wrap gap-3">
            {nearbyCities.map(city => (
              <Link
                key={city}
                href={`/music-festivals-in/${cityToSlug(city)}`}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:border-purple-300 hover:text-purple-700 transition-all"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
