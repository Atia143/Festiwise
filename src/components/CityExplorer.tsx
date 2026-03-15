import Link from 'next/link';

// Top festival cities — curated for diversity + search volume
const TOP_CITIES = [
  { city: 'Las Vegas',      slug: 'las-vegas',       country: 'USA',         count: null },
  { city: 'London',         slug: 'london',           country: 'UK',          count: null },
  { city: 'Barcelona',      slug: 'barcelona',        country: 'Spain',       count: null },
  { city: 'Miami',          slug: 'miami',            country: 'USA',         count: null },
  { city: 'Amsterdam',      slug: 'amsterdam',        country: 'Netherlands', count: null },
  { city: 'Chicago',        slug: 'chicago',          country: 'USA',         count: null },
  { city: 'Tokyo',          slug: 'tokyo',            country: 'Japan',       count: null },
  { city: 'Berlin',         slug: 'berlin',           country: 'Germany',     count: null },
  { city: 'Melbourne',      slug: 'melbourne',        country: 'Australia',   count: null },
  { city: 'New Orleans',    slug: 'new-orleans',      country: 'USA',         count: null },
  { city: 'Budapest',       slug: 'budapest',         country: 'Hungary',     count: null },
  { city: 'Novi Sad',       slug: 'novi-sad',         country: 'Serbia',      count: null },
];

export default function CityExplorer() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold uppercase tracking-widest rounded-full mb-3">
            Browse by city
          </span>
          <div className="flex items-end justify-between">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Festivals near you — or far away
            </h2>
            <Link
              href="/music-festivals-in"
              className="hidden sm:flex items-center gap-1.5 text-pink-600 font-semibold text-sm hover:text-pink-700 transition-colors whitespace-nowrap pb-1"
            >
              All cities
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <p className="text-gray-500 mt-2 text-base max-w-lg">
            Plan a trip around a festival. Every city, every lineup, every budget — all in one place.
          </p>
        </div>

        {/* City grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {TOP_CITIES.map(({ city, slug, country }) => (
            <Link
              key={slug}
              href={`/music-festivals-in/${slug}`}
              className="group flex flex-col p-4 rounded-2xl border border-gray-200 hover:border-pink-300 hover:shadow-md bg-white transition-all"
            >
              <span className="text-sm font-bold text-gray-900 group-hover:text-pink-700 transition-colors">
                {city}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">{country}</span>
              <span className="mt-2 text-xs text-pink-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                See festivals →
              </span>
            </Link>
          ))}
        </div>

        {/* Calendar link */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-900">Planning by date instead?</p>
            <p className="text-gray-500 text-sm mt-0.5">Browse the full festival calendar — every event, month by month.</p>
          </div>
          <Link
            href="/festival-calendar-2026"
            className="shrink-0 px-6 py-3 rounded-xl bg-white border border-purple-200 text-purple-700 font-semibold text-sm hover:bg-purple-50 transition-all shadow-sm whitespace-nowrap"
          >
            View 2026 Calendar →
          </Link>
        </div>
      </div>
    </section>
  );
}
