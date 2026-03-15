import type { Metadata } from 'next';
import Link from 'next/link';
import festivalsData from '@/data/festivals.json';

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
  status: string;
  camping: boolean;
  family_friendly: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const AUDIENCE_SHORT: Record<string, string> = {
  massive: '100K+',
  large: '50K+',
  medium: '10–50K',
  small: '<10K',
  intimate: 'Intimate',
};

const SIZE_ORDER: Record<string, number> = {
  massive: 4, large: 3, medium: 2, small: 1, intimate: 0,
};

export const metadata: Metadata = {
  title: 'Music Festival Calendar 2026 — All Festivals by Month | FestiWise',
  description:
    'Complete music festival calendar for 2026. Browse 100+ festivals month by month — January through December. Find the perfect festival for your schedule and budget.',
  alternates: { canonical: 'https://getfestiwise.com/festival-calendar-2026' },
  openGraph: {
    title: 'Music Festival Calendar 2026 — All Festivals by Month',
    description:
      'Browse 100+ music festivals month by month. Find the right festival for your travel window, budget, and taste.',
    url: 'https://getfestiwise.com/festival-calendar-2026',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music Festival Calendar 2026 — All Festivals by Month | FestiWise',
    description: 'Browse 100+ music festivals month by month. Find your perfect festival for 2026.',
  },
};

export default function FestivalCalendarPage() {
  const festivals = (festivalsData as Festival[]).filter(f => f.status === 'active');

  const byMonth = MONTHS.map(month => ({
    month,
    festivals: festivals
      .filter(f => f.months.includes(month))
      .sort((a, b) => (SIZE_ORDER[b.audience_size] ?? 0) - (SIZE_ORDER[a.audience_size] ?? 0)),
  })).filter(m => m.festivals.length > 0);

  const total = new Set(festivals.flatMap(f => f.months).filter(m => MONTHS.includes(m))).size;

  // JSON-LD: ItemList of all festivals in calendar
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Music Festival Calendar 2026',
    description: 'Complete list of music festivals in 2026, organized by month',
    numberOfItems: festivals.length,
    itemListElement: festivals.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.name,
      url: `https://getfestiwise.com/festival/${f.id}`,
    })),
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FestiWise', item: 'https://getfestiwise.com' },
      { '@type': 'ListItem', position: 2, name: 'Festival Calendar 2026', item: 'https://getfestiwise.com/festival-calendar-2026' },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-4">
            FestiWise
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Music Festival Calendar 2026
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mb-8">
            Every major festival, month by month. {festivals.length} events across {total} months —
            from intimate gatherings to 100,000+ crowd spectacles.
          </p>

          {/* Month quick-jump */}
          <div className="flex flex-wrap gap-2">
            {byMonth.map(({ month }) => (
              <a
                key={month}
                href={`#${month.toLowerCase()}`}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-medium transition-all"
              >
                {month.slice(0, 3)}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar body */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {byMonth.map(({ month, festivals: mf }) => (
          <section key={month} id={month.toLowerCase()}>
            {/* Month header */}
            <div className="flex items-baseline gap-4 mb-6 pb-3 border-b border-gray-100">
              <h2 className="text-2xl font-extrabold text-gray-900">{month}</h2>
              <span className="text-gray-400 text-sm">{mf.length} festival{mf.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Festival rows */}
            <div className="space-y-3">
              {mf.map(f => (
                <Link
                  key={`${month}-${f.id}`}
                  href={`/festival/${f.id}`}
                  className="group flex items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                        {f.name}
                      </h3>
                      {f.months.length > 1 && (
                        <span className="text-xs text-gray-400 hidden sm:inline">
                          ({f.months.join(', ')})
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {f.city}, {f.country}
                    </p>
                    {/* Genre pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {f.genres.slice(0, 3).map(g => (
                        <span
                          key={g}
                          className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100 capitalize"
                        >
                          {g}
                        </span>
                      ))}
                      {f.genres.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">
                          +{f.genres.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      ${f.estimated_cost_usd.min.toLocaleString()}–${f.estimated_cost_usd.max.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {f.duration_days}d · {AUDIENCE_SHORT[f.audience_size] ?? f.audience_size}
                    </p>
                    <div className="flex gap-1.5 justify-end mt-1.5">
                      {f.camping && (
                        <span className="text-xs text-green-600 font-medium">Camping</span>
                      )}
                      {f.family_friendly && (
                        <span className="text-xs text-blue-600 font-medium">Family</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Quiz CTA */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Know your window — now find the right festival
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-lg mx-auto">
            Our 2-minute quiz matches you with the best festivals for your music taste, budget, and travel style from this entire calendar.
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
