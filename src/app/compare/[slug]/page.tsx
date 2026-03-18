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

// ─── Top comparison pairs (search-intent driven) ──────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function idToSlug(id: string) {
  return id.replace(/_/g, '-');
}

function slugToId(slug: string) {
  return slug.replace(/-/g, '_');
}

function parseSlug(slug: string): [string, string] | null {
  const idx = slug.indexOf('-vs-');
  if (idx === -1) return null;
  const a = slugToId(slug.slice(0, idx));
  const b = slugToId(slug.slice(idx + 4));
  return [a, b];
}

function getFestival(id: string): Festival | undefined {
  return (festivalsData as Festival[]).find(f => f.id === id);
}

function formatCost(f: Festival) {
  return `$${f.estimated_cost_usd.min.toLocaleString()} – $${f.estimated_cost_usd.max.toLocaleString()}`;
}

function audienceLabel(size: string) {
  const map: Record<string, string> = {
    massive: 'Massive (100K+)',
    large: 'Large (50K+)',
    medium: 'Medium (10–50K)',
    small: 'Small (< 10K)',
    intimate: 'Intimate',
  };
  return map[size.toLowerCase()] ?? size;
}

export const revalidate = 86400;

// ─── Static params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return COMPARISON_PAIRS.map(([a, b]) => ({
    slug: `${idToSlug(a)}-vs-${idToSlug(b)}`,
  }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ids = parseSlug(slug);
  if (!ids) return { title: 'Festival Comparison' };

  const [a, b] = ids.map(getFestival);
  if (!a || !b) return { title: 'Festival Comparison' };

  const title = `${a.name} vs ${b.name} — Which Festival is Right for You?`;
  const description = `${a.name} (${a.city}, ${a.country}) vs ${b.name} (${b.city}, ${b.country}). Side-by-side comparison of budget, genres, vibe, duration, and more. Find out which festival matches you.`;

  return {
    title,
    description,
    alternates: { canonical: `https://getfestiwise.com/compare/${slug}` },
    openGraph: {
      title, description, url: `https://getfestiwise.com/compare/${slug}`, type: 'website',
      images: [{
        url: `https://getfestiwise.com/api/og/compare?a=${encodeURIComponent(a.name)}&b=${encodeURIComponent(b.name)}&ga=${encodeURIComponent(a.genres[0] ?? '')}&gb=${encodeURIComponent(b.genres[0] ?? '')}`,
        width: 1200, height: 630, alt: `${a.name} vs ${b.name}`,
      }],
    },
    twitter: { card: 'summary_large_image', title, description,
      images: [`https://getfestiwise.com/api/og/compare?a=${encodeURIComponent(a.name)}&b=${encodeURIComponent(b.name)}&ga=${encodeURIComponent(a.genres[0] ?? '')}&gb=${encodeURIComponent(b.genres[0] ?? '')}`],
    },
  };
}

// ─── Comparison row component ─────────────────────────────────────────────────
function Row({
  label,
  a,
  b,
  winnerSide,
  winnerLabel,
}: {
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
  winnerSide?: 'a' | 'b' | null;
  winnerLabel?: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 py-5 border-b border-gray-100 items-start">
      <div className="text-right">
        <div className="text-sm text-gray-900 font-medium">{a}</div>
        {winnerSide === 'a' && winnerLabel && (
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
            {winnerLabel}
          </span>
        )}
      </div>
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center pt-0.5 w-20 shrink-0">
        {label}
      </div>
      <div className="text-left">
        <div className="text-sm text-gray-900 font-medium">{b}</div>
        {winnerSide === 'b' && winnerLabel && (
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
            {winnerLabel}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function CompareSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ids = parseSlug(slug);

  if (!ids) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Comparison not found.</p>
      </div>
    );
  }

  const [fa, fb] = ids.map(getFestival);

  if (!fa || !fb) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">One or both festivals not found.</p>
      </div>
    );
  }

  // JSON-LD schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FestiWise', item: 'https://getfestiwise.com' },
      { '@type': 'ListItem', position: 2, name: 'Festival Comparisons', item: 'https://getfestiwise.com/compare' },
      { '@type': 'ListItem', position: 3, name: `${fa.name} vs ${fb.name}`, item: `https://getfestiwise.com/compare/${slug}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Which is cheaper, ${fa.name} or ${fb.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: fa.estimated_cost_usd.min < fb.estimated_cost_usd.min
            ? `${fa.name} is generally more affordable, starting from $${fa.estimated_cost_usd.min.toLocaleString()} compared to ${fb.name} which starts from $${fb.estimated_cost_usd.min.toLocaleString()}.`
            : fb.estimated_cost_usd.min < fa.estimated_cost_usd.min
            ? `${fb.name} is generally more affordable, starting from $${fb.estimated_cost_usd.min.toLocaleString()} compared to ${fa.name} which starts from $${fa.estimated_cost_usd.min.toLocaleString()}.`
            : `${fa.name} and ${fb.name} have similar starting costs of around $${fa.estimated_cost_usd.min.toLocaleString()}.`,
        },
      },
      {
        '@type': 'Question',
        name: `How long is ${fa.name} compared to ${fb.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${fa.name} runs for ${fa.duration_days} day${fa.duration_days !== 1 ? 's' : ''}, while ${fb.name} runs for ${fb.duration_days} day${fb.duration_days !== 1 ? 's' : ''}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What music genres are at ${fa.name} vs ${fb.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${fa.name} features ${fa.genres.join(', ')} music. ${fb.name} features ${fb.genres.join(', ')} music.`,
        },
      },
      {
        '@type': 'Question',
        name: `Where are ${fa.name} and ${fb.name} located?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${fa.name} takes place in ${fa.city}, ${fa.country}. ${fb.name} takes place in ${fb.city}, ${fb.country}.`,
        },
      },
    ],
  };

  const costWinner =
    fa.estimated_cost_usd.min < fb.estimated_cost_usd.min ? 'a' :
    fb.estimated_cost_usd.min < fa.estimated_cost_usd.min ? 'b' : null;

  const durationWinner =
    fa.duration_days > fb.duration_days ? 'a' :
    fb.duration_days > fa.duration_days ? 'b' : null;

  const genreWinner =
    fa.genres.length > fb.genres.length ? 'a' :
    fb.genres.length > fa.genres.length ? 'b' : null;

  // Related pairs for internal linking
  const relatedPairs = COMPARISON_PAIRS.filter(
    ([a, b]) =>
      (a === fa.id || b === fa.id || a === fb.id || b === fb.id) &&
      `${idToSlug(a)}-vs-${idToSlug(b)}` !== slug
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Header */}
      <div className="bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-6 py-14 md:py-20">
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-4 text-center">
            Festival Comparison
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-center leading-tight mb-4">
            {fa.name} <span className="text-purple-400">vs</span> {fb.name}
          </h1>
          <p className="text-gray-400 text-center text-base md:text-lg max-w-xl mx-auto">
            Which festival is right for you? We break down every key difference so you can decide.
          </p>

          {/* Hero stats */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            {[fa, fb].map((f, i) => (
              <div key={f.id} className={`rounded-2xl p-5 border ${i === 0 ? 'border-purple-500/40 bg-purple-900/20' : 'border-pink-500/40 bg-pink-900/20'}`}>
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${i === 0 ? 'text-purple-400' : 'text-pink-400'}`}>
                  Festival {i === 0 ? 'A' : 'B'}
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{f.name}</h2>
                <p className="text-gray-400 text-sm">{f.city}, {f.country}</p>
                <p className="text-gray-400 text-sm mt-1">{f.months.slice(0, 2).join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Side-by-side breakdown</h2>
        <p className="text-gray-500 text-sm mb-8">Every key difference, objectively compared.</p>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-2">
          <div className="text-right">
            <span className="text-sm font-bold text-purple-700">{fa.name}</span>
          </div>
          <div className="w-20" />
          <div className="text-left">
            <span className="text-sm font-bold text-pink-700">{fb.name}</span>
          </div>
        </div>

        <Row
          label="Location"
          a={`${fa.city}, ${fa.country}`}
          b={`${fb.city}, ${fb.country}`}
        />
        <Row
          label="Dates"
          a={fa.months.join(', ')}
          b={fb.months.join(', ')}
        />
        <Row
          label="Duration"
          a={`${fa.duration_days} day${fa.duration_days !== 1 ? 's' : ''}`}
          b={`${fb.duration_days} day${fb.duration_days !== 1 ? 's' : ''}`}
          winnerSide={durationWinner}
          winnerLabel="Longer"
        />
        <Row
          label="Budget"
          a={formatCost(fa)}
          b={formatCost(fb)}
          winnerSide={costWinner}
          winnerLabel="More affordable"
        />
        <Row
          label="Crowd"
          a={audienceLabel(fa.audience_size)}
          b={audienceLabel(fb.audience_size)}
        />
        <Row
          label="Genres"
          a={
            <span>
              {fa.genres.slice(0, 4).join(', ')}
              {fa.genres.length > 4 && ` +${fa.genres.length - 4} more`}
            </span>
          }
          b={
            <span>
              {fb.genres.slice(0, 4).join(', ')}
              {fb.genres.length > 4 && ` +${fb.genres.length - 4} more`}
            </span>
          }
          winnerSide={genreWinner}
          winnerLabel="More diverse"
        />
        <Row
          label="Vibe"
          a={fa.vibe.slice(0, 3).join(', ')}
          b={fb.vibe.slice(0, 3).join(', ')}
        />
        <Row
          label="Camping"
          a={fa.camping ? '✓ Available' : '✗ Not available'}
          b={fb.camping ? '✓ Available' : '✗ Not available'}
        />
        <Row
          label="Family"
          a={fa.family_friendly ? '✓ Family friendly' : '18+ focused'}
          b={fb.family_friendly ? '✓ Family friendly' : '18+ focused'}
        />

        {/* Official links */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {[fa, fb].map(f => (
            <a
              key={f.id}
              href={f.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-purple-300 hover:text-purple-700 transition-all"
            >
              {f.name} official site →
            </a>
          ))}
        </div>
      </div>

      {/* Quiz CTA */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Still not sure which one suits you?</h2>
          <p className="text-white/80 text-base mb-8 max-w-lg mx-auto">
            Our 2-minute quiz matches you against 100+ festivals based on your music taste, budget, and vibe — not just these two.
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

      {/* Related comparisons */}
      {relatedPairs.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h3 className="text-base font-bold text-gray-900 mb-5">More comparisons</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedPairs.map(([a, b]) => {
              const festA = getFestival(a);
              const festB = getFestival(b);
              if (!festA || !festB) return null;
              const pairSlug = `${idToSlug(a)}-vs-${idToSlug(b)}`;
              return (
                <Link
                  key={pairSlug}
                  href={`/compare/${pairSlug}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all group"
                >
                  <span className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                    {festA.name} vs {festB.name}
                  </span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
