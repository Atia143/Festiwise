import type { Metadata } from 'next';
import Link from 'next/link';
import festivalsData from '@/data/festivals.json';

interface Festival {
  id: string;
  name: string;
  city: string;
  country: string;
  genres: string[];
  audience_size: string;
  estimated_cost_usd: { min: number; max: number };
  months: string[];
}

const COMPARISON_PAIRS: [string, string][] = [
  ['coachella', 'tomorrowland'],
  ['coachella', 'glastonbury'],
  ['coachella', 'burning_man'],
  ['coachella', 'lollapalooza_chicago'],
  ['coachella', 'bonnaroo'],
  ['tomorrowland', 'ultra_miami'],
  ['tomorrowland', 'glastonbury'],
  ['tomorrowland', 'exit_festival'],
  ['glastonbury', 'reading_leeds'],
  ['glastonbury', 'download_festival'],
  ['glastonbury', 'primavera'],
  ['ultra_miami', 'electric_daisy_carnival'],
  ['burning_man', 'lightning_in_a_bottle'],
  ['lollapalooza_chicago', 'governors_ball'],
  ['lollapalooza_chicago', 'outside_lands'],
  ['primavera', 'sonar'],
  ['sziget', 'exit_festival'],
  ['fuji_rock', 'splendour_in_the_grass'],
  ['osheaga', 'lollapalooza_chicago'],
  ['rock_am_ring', 'rock_im_park'],
  ['creamfields_uk', 'tomorrowland'],
  ['montreux_jazz', 'newport_jazz'],
  ['roskilde', 'glastonbury'],
  ['rolling_loud_california', 'coachella'],
  ['outside_lands', 'bonnaroo'],
];

function idToSlug(id: string) {
  return id.replace(/_/g, '-');
}

function getFestival(id: string): Festival | undefined {
  return (festivalsData as Festival[]).find(f => f.id === id);
}

// Group pairs by the first festival for logical clusters
const CATEGORIES = [
  { label: 'Coachella vs', ids: ['coachella'] },
  { label: 'Tomorrowland vs', ids: ['tomorrowland'] },
  { label: 'Glastonbury vs', ids: ['glastonbury'] },
  { label: 'Other matchups', ids: [] as string[] },
];

export const metadata: Metadata = {
  title: 'Festival Comparisons — Coachella vs Tomorrowland & More',
  description:
    'Side-by-side festival comparisons. Coachella vs Tomorrowland, Glastonbury vs Primavera, Ultra vs EDC, and 20+ more head-to-head breakdowns. Find which festival is right for you.',
  alternates: { canonical: 'https://getfestiwise.com/compare' },
  openGraph: {
    title: 'Festival Comparisons — Which Festival Is Right for You?',
    description:
      '25+ side-by-side festival comparisons. Compare budget, genres, vibe, duration and crowd size.',
    url: 'https://getfestiwise.com/compare',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Festival Comparisons | FestiWise',
    description: '25+ side-by-side festival comparisons. Find which festival suits you.',
  },
};

export default function CompareIndexPage() {
  // Enrich pairs with festival data
  const enriched = COMPARISON_PAIRS.map(([aId, bId]) => {
    const a = getFestival(aId);
    const b = getFestival(bId);
    if (!a || !b) return null;
    return {
      slug: `${idToSlug(aId)}-vs-${idToSlug(bId)}`,
      a,
      b,
      aId,
      bId,
    };
  }).filter((x): x is NonNullable<typeof x> => x !== null);

  // Split into Coachella / Tomorrowland / Glastonbury / Rest
  const coachellaMatches = enriched.filter(p => p.aId === 'coachella' || p.bId === 'coachella');
  const tomorrowlandMatches = enriched.filter(
    p => (p.aId === 'tomorrowland' || p.bId === 'tomorrowland') && p.aId !== 'coachella' && p.bId !== 'coachella'
  );
  const glastonburyMatches = enriched.filter(
    p =>
      (p.aId === 'glastonbury' || p.bId === 'glastonbury') &&
      p.aId !== 'coachella' &&
      p.bId !== 'coachella' &&
      p.aId !== 'tomorrowland' &&
      p.bId !== 'tomorrowland'
  );
  const rest = enriched.filter(
    p =>
      !coachellaMatches.includes(p) &&
      !tomorrowlandMatches.includes(p) &&
      !glastonburyMatches.includes(p)
  );

  const sections = [
    { title: 'Coachella compared', pairs: coachellaMatches },
    { title: 'Tomorrowland compared', pairs: tomorrowlandMatches },
    { title: 'Glastonbury compared', pairs: glastonburyMatches },
    { title: 'More matchups', pairs: rest },
  ].filter(s => s.pairs.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 text-center">
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Festival Comparisons
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            Which festival is right for you?
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            {enriched.length} head-to-head breakdowns across budget, genres, crowd size, vibe, and more.
            Stop guessing — start comparing.
          </p>
        </div>
      </div>

      {/* Comparison sections */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">
        {sections.map(({ title, pairs }) => (
          <section key={title}>
            <h2 className="text-xl font-bold text-gray-900 mb-5">{title}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {pairs.map(({ slug, a, b }) => (
                <Link
                  key={slug}
                  href={`/compare/${slug}`}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors leading-snug">
                      {a.name}
                      <span className="text-purple-400 font-normal mx-1.5">vs</span>
                      {b.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {a.city} · {b.city}
                    </p>
                    {/* Quick cost delta */}
                    <p className="text-xs text-gray-500 mt-1">
                      ${a.estimated_cost_usd.min.toLocaleString()} vs ${b.estimated_cost_usd.min.toLocaleString()} starting
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-purple-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
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
            Can&apos;t decide even after comparing?
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-lg mx-auto">
            Our 2-minute quiz matches you against all 100+ festivals based on your music taste, budget, and vibe — not just these two.
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
