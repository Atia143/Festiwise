import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import festivalsData from '@/data/festivals.json';
import type { Festival } from '@/types/festival';

// ── Category definitions ───────────────────────────────────────────────────────
interface Category {
  slug: string;
  title: string;
  headline: string;
  description: string;
  intro: string;
  filter: (f: Festival) => boolean;
  sort?: (a: Festival, b: Festival) => number;
}

const CATEGORIES: Category[] = [
  {
    slug: 'edm-festivals',
    title: 'Best EDM Festivals 2026',
    headline: 'The World\'s Best EDM & Electronic Music Festivals',
    description: 'Find the best EDM and electronic music festivals of 2026. From Tomorrowland to Ultra — ranked by scale, lineup quality, and experience.',
    intro: 'Whether you\'re into techno, house, trance, or bass music, these festivals represent the pinnacle of electronic music culture. Here are the top EDM festivals worldwide for 2026.',
    filter: f => f.genres.some(g => ['edm','electronic','house','techno','trance','hardstyle','psytrance','dubstep','bass'].includes(g)),
  },
  {
    slug: 'rock-festivals',
    title: 'Best Rock & Metal Festivals 2026',
    headline: 'The World\'s Best Rock & Metal Festivals',
    description: 'The ultimate guide to rock and metal festivals in 2026. Glastonbury, Rock am Ring, Download, and more — all ranked and reviewed.',
    intro: 'From stadium anthems to underground hardcore, the rock festival scene in 2026 is stronger than ever. Here\'s where to headbang this year.',
    filter: f => f.genres.some(g => ['rock','metal','hardcore','indie'].includes(g)),
  },
  {
    slug: 'budget-festivals',
    title: 'Best Budget Music Festivals 2026',
    headline: 'Best Music Festivals Under $300 in 2026',
    description: 'The best affordable music festivals of 2026. World-class lineups without the price tag. Ranked by value for money.',
    intro: 'You don\'t need to spend a fortune to have an unforgettable festival experience. These festivals deliver incredible lineups at prices that won\'t break the bank.',
    filter: f => f.estimated_cost_usd.min <= 300,
    sort: (a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min,
  },
  {
    slug: 'family-festivals',
    title: 'Best Family-Friendly Music Festivals 2026',
    headline: 'Best Music Festivals for Families in 2026',
    description: 'Family-friendly music festivals 2026. Safe, fun, and memorable festivals the whole family can enjoy — kids included.',
    intro: 'The best family festivals combine great music with kid-friendly activities, safe environments, and reasonable prices. Here are our top picks for 2026.',
    filter: f => f.family_friendly === true,
  },
  {
    slug: 'camping-festivals',
    title: 'Best Camping Music Festivals 2026',
    headline: 'Best Music Festivals with Camping in 2026',
    description: 'The ultimate camping festival experiences of 2026. Pack your tent, find your tribe, and make memories that last a lifetime.',
    intro: 'Camping festivals are a world apart from day events. The camaraderie, the late-night sessions, the mornings waking up to music — these are the best camping festivals worldwide.',
    filter: f => f.camping === true,
  },
  {
    slug: 'jazz-festivals',
    title: 'Best Jazz Festivals 2026',
    headline: 'The World\'s Best Jazz & Blues Festivals',
    description: 'Best jazz and blues festivals of 2026. From Montreux to Newport — the most prestigious jazz festivals on the planet.',
    intro: 'Jazz festivals attract the world\'s greatest musicians and the most discerning audiences. Here are the festivals that have defined jazz culture for decades.',
    filter: f => f.genres.some(g => ['jazz','blues','soul'].includes(g)),
  },
  {
    slug: 'europe-festivals',
    title: 'Best Music Festivals in Europe 2026',
    headline: 'The Best Music Festivals in Europe 2026',
    description: 'Top music festivals in Europe for 2026. Glastonbury, Tomorrowland, Primavera Sound, and more — the definitive European festival guide.',
    intro: 'Europe hosts some of the world\'s most iconic and diverse music festivals — from the British countryside to Spanish beaches to Belgian fields. Here are the best for 2026.',
    filter: f => ['UK','Germany','France','Spain','Netherlands','Belgium','Hungary','Denmark','Sweden','Switzerland','Portugal','Romania','Serbia','Finland'].includes(f.country),
    sort: (a, b) => (b.audience_size === 'massive' ? 1 : 0) - (a.audience_size === 'massive' ? 1 : 0),
  },
  {
    slug: 'usa-festivals',
    title: 'Best Music Festivals in the USA 2026',
    headline: 'The Best Music Festivals in America 2026',
    description: 'Top music festivals in the USA for 2026. Coachella, Lollapalooza, Bonnaroo, and more — the definitive American festival guide.',
    intro: 'From the California desert to the Tennessee mountains, the US festival scene is as diverse as the country itself. Here are the must-attend American festivals of 2026.',
    filter: f => f.country === 'USA',
  },
  {
    slug: 'summer-festivals',
    title: 'Best Summer Music Festivals 2026',
    headline: 'The Best Summer Music Festivals of 2026',
    description: 'The best summer music festivals 2026. June, July, and August — where to spend your summer this year.',
    intro: 'Summer festival season is the highlight of the year for millions of music fans. Here are the essential summer festivals you can\'t miss in 2026.',
    filter: f => f.months.some(m => ['june','july','august'].includes(m.toLowerCase())),
  },
  {
    slug: 'hip-hop-festivals',
    title: 'Best Hip-Hop & Rap Festivals 2026',
    headline: 'The Best Hip-Hop, Rap & Urban Festivals 2026',
    description: 'Best hip-hop and rap festivals of 2026. Rolling Loud, Rolling Loud and more — where hip-hop culture meets massive stages.',
    intro: 'Hip-hop festivals have grown into some of the highest-grossing events in the music world. Here are the best places to see your favourite artists live in 2026.',
    filter: f => f.genres.some(g => ['hiphop','rap','trap','rnb'].includes(g)),
  },
  {
    slug: 'world-music-festivals',
    title: 'Best World Music Festivals 2026',
    headline: 'The Best World Music & Cultural Festivals 2026',
    description: 'Best world music festivals 2026. Afrobeat, reggae, Latin rhythms, folk — celebrate music from every corner of the globe.',
    intro: 'World music festivals are a passport to global cultures. From African rhythms to Caribbean vibes, these festivals celebrate music\'s universal language.',
    filter: f => f.genres.some(g => ['world','folk','afrobeat','reggae','latin'].includes(g)),
  },
  {
    slug: 'luxury-festivals',
    title: 'Best Luxury Music Festival Experiences 2026',
    headline: 'The Best Premium & Luxury Music Festival Experiences',
    description: 'Luxury music festival experiences for 2026. Glamping, VIP packages, boutique events — when money is no object.',
    intro: 'Festival luxury has evolved far beyond a hotel room nearby. Today\'s premium festival experiences offer chef-curated meals, air-conditioned tents, and private viewing areas.',
    filter: f => f.estimated_cost_usd.min >= 500,
    sort: (a, b) => b.estimated_cost_usd.min - a.estimated_cost_usd.min,
  },
  {
    slug: 'small-festivals',
    title: 'Best Small & Boutique Music Festivals 2026',
    headline: 'The Best Small & Intimate Music Festivals 2026',
    description: 'Best small and boutique music festivals 2026. Escape the crowds — discover hidden gems with incredible lineups and tight-knit communities.',
    intro: 'Small festivals offer something the megafests can\'t: intimacy. You\'re close to the artists, the crowd is curated, and the whole thing feels personal. These are our favourite intimate festivals.',
    filter: f => ['small','medium'].includes(f.audience_size),
    sort: (a, b) => a.audience_size.localeCompare(b.audience_size),
  },
  {
    slug: 'australia-festivals',
    title: 'Best Music Festivals in Australia 2026',
    headline: 'The Best Music Festivals in Australia 2026',
    description: 'Top music festivals in Australia for 2026. Splendour in the Grass, Laneway Festival, and more — the definitive Australian festival guide.',
    intro: 'Australia\'s festival scene punches well above its weight — from lush Byron Bay hinterlands to urban parks in Melbourne and Sydney. Here are the must-attend Australian music festivals of 2026.',
    filter: f => f.country === 'Australia',
    sort: (a, b) => (SIZE_ORDER[b.audience_size] ?? 0) - (SIZE_ORDER[a.audience_size] ?? 0),
  },
  {
    slug: 'canada-festivals',
    title: 'Best Music Festivals in Canada 2026',
    headline: 'The Best Music Festivals in Canada 2026',
    description: 'Top music festivals in Canada for 2026. Osheaga, Bluesfest, and more — the definitive Canadian festival guide for 2026.',
    intro: 'Canada\'s festival scene stretches from Montréal\'s world-famous Osheaga to Victoria\'s folk roots. Whether you\'re after indie, blues, or electronic, Canada has a festival for every taste.',
    filter: f => f.country === 'Canada',
    sort: (a, b) => (SIZE_ORDER[b.audience_size] ?? 0) - (SIZE_ORDER[a.audience_size] ?? 0),
  },
  {
    slug: 'latin-america-festivals',
    title: 'Best Music Festivals in Latin America 2026',
    headline: 'The Best Music Festivals in Latin America 2026',
    description: 'Top music festivals in Latin America 2026. Rock in Rio, Lollapalooza Brazil, Corona Capital, and more — vibrant festivals across Brazil, Mexico, Argentina, and beyond.',
    intro: 'Latin America delivers some of the most passionate and vibrant festival experiences on earth. From Rock in Rio\'s massive stages to boutique Colombian events, the energy here is incomparable.',
    filter: f => ['Brazil','Mexico','Argentina','Colombia','Chile','Peru'].includes(f.country),
    sort: (a, b) => (SIZE_ORDER[b.audience_size] ?? 0) - (SIZE_ORDER[a.audience_size] ?? 0),
  },
  {
    slug: 'asia-pacific-festivals',
    title: 'Best Music Festivals in Asia Pacific 2026',
    headline: 'The Best Music Festivals in Asia & the Pacific 2026',
    description: 'Top music festivals in Asia Pacific for 2026. Fuji Rock, Splendour in the Grass, Ultra Korea, and more — the definitive Asia-Pacific festival guide.',
    intro: 'The Asia-Pacific festival scene has grown into one of the most exciting in the world. From Japan\'s iconic Fuji Rock amid misty mountains to Seoul\'s electronic showcases, this region rewards the adventurous festival traveller.',
    filter: f => ['Japan','South Korea','Australia','New Zealand','India','Thailand','Indonesia','Singapore','Taiwan','China'].includes(f.country),
    sort: (a, b) => (SIZE_ORDER[b.audience_size] ?? 0) - (SIZE_ORDER[a.audience_size] ?? 0),
  },
];

const SIZE_ORDER: Record<string, number> = { massive: 4, large: 3, medium: 2, small: 1 };

// ── Static params ──────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.slug === category);
  if (!cat) return {};
  const all = festivalsData as Festival[];
  const count = all.filter(cat.filter).length;
  // Extract slug keyword (e.g. "edm-festivals" → "edm", "budget-festivals" → "budget")
  const labelSlug = cat.slug.replace('-festivals', '');
  const labelDisplay = cat.headline.replace(/^(The |Best )/i, '').replace(/ Festivals.*/i, '').trim();
  const ogImg = `https://getfestiwise.com/api/og/best?slug=${encodeURIComponent(labelSlug)}&label=${encodeURIComponent(labelDisplay)}&count=${count}`;
  return {
    title: `${cat.title} | FestiWise`,
    description: cat.description,
    alternates: { canonical: `https://getfestiwise.com/best/${category}` },
    openGraph: {
      title: cat.title,
      description: cat.description,
      url: `https://getfestiwise.com/best/${category}`,
      type: 'website',
      images: [{ url: ogImg, width: 1200, height: 630, alt: cat.title }],
    },
    twitter: { card: 'summary_large_image', title: cat.title, description: cat.description, images: [ogImg] },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function BestCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.slug === category);
  if (!cat) notFound();

  const all = festivalsData as Festival[];
  const matched = all.filter(cat.filter);
  const sorted = cat.sort
    ? [...matched].sort(cat.sort)
    : [...matched].sort((a, b) => (SIZE_ORDER[b.audience_size] ?? 0) - (SIZE_ORDER[a.audience_size] ?? 0));

  // Related categories
  const related = CATEGORIES.filter(c => c.slug !== cat.slug).slice(0, 5);

  // JSON-LD
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: cat.title,
    description: cat.description,
    numberOfItems: sorted.length,
    itemListElement: sorted.slice(0, 10).map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Event',
        name: f.name,
        location: { '@type': 'Place', name: f.city, address: { '@type': 'PostalAddress', addressCountry: f.country } },
        url: `https://getfestiwise.com/festival/${f.id}`,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/best" className="text-purple-400 text-sm hover:text-purple-300 mb-4 inline-block">
              ← All Best-Of Lists
            </Link>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">{cat.headline}</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">{cat.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-2xl transition-all"
              >
                Find my perfect festival — 2 min quiz
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-2xl transition-all"
              >
                Search all 100+ festivals
              </Link>
            </div>
          </div>
        </section>

        {/* Count badge */}
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            <span className="font-bold text-gray-900 text-base">{sorted.length}</span> festivals matched
          </p>
          <Link href="/quiz" className="text-xs text-purple-600 font-semibold hover:underline">
            Get a personalised list →
          </Link>
        </div>

        {/* Festival Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((f, i) => (
              <Link
                key={f.id}
                href={`/festival/${f.id}`}
                className="group bg-white border border-gray-100 hover:border-purple-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative"
              >
                {/* Rank badge */}
                <span className="absolute top-4 right-4 w-7 h-7 bg-purple-100 text-purple-700 text-xs font-black rounded-full flex items-center justify-center">
                  #{i + 1}
                </span>

                <h2 className="font-bold text-gray-900 group-hover:text-purple-700 pr-8 mb-1 transition-colors">{f.name}</h2>
                <p className="text-sm text-gray-500 mb-3">{f.city}, {f.country} · {f.months.slice(0, 2).join(', ')}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {f.genres.slice(0, 3).map(g => (
                    <span key={g} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full capitalize">{g}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm mt-auto">
                  <span className="font-semibold text-gray-700">${f.estimated_cost_usd.min}–${f.estimated_cost_usd.max}</span>
                  <div className="flex gap-2 text-xs text-gray-400">
                    {f.camping && <span>Camping</span>}
                    {f.family_friendly && <span>Family</span>}
                    <span className="capitalize">{f.audience_size}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {sorted.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">No festivals found in this category yet.</p>
              <Link href="/festivals" className="mt-4 inline-block text-purple-600 font-semibold hover:underline">Browse all festivals →</Link>
            </div>
          )}
        </div>

        {/* Quiz CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-14 px-4 text-center">
          <h2 className="text-2xl font-black mb-3">Not sure which one is right for you?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">Our 5-question quiz narrows 100+ festivals down to your personal top 6 in under 2 minutes.</p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-black rounded-2xl hover:bg-purple-50 shadow-lg transition-all"
          >
            Find My Festival — Free
          </Link>
        </section>

        {/* Related categories */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-lg font-black text-gray-900 mb-5">More Best-Of Lists</h2>
          <div className="flex flex-wrap gap-3">
            {related.map(r => (
              <Link
                key={r.slug}
                href={`/best/${r.slug}`}
                className="px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-700 hover:border-purple-300 hover:text-purple-700 transition-all"
              >
                {r.title.replace(' | FestiWise', '')}
              </Link>
            ))}
            <Link href="/best" className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-sm font-semibold hover:bg-purple-100 transition-all">
              View all lists →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
