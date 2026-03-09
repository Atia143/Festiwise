import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, MapPin, DollarSign, Users, Clock } from 'lucide-react';
import rawFestivals from '@/data/festivals.json';
import type { Festival } from '@/types/festival';

const festivals = rawFestivals as Festival[];

// ── Static data ────────────────────────────────────────────────────────────────
const REGION_LABELS: Record<string, string> = {
  'asia': 'Asia',
  'asia-pacific': 'Asia Pacific',
  'central-america': 'Central America',
  'eastern-europe': 'Eastern Europe',
  'north-america': 'North America',
  'northern-europe': 'Northern Europe',
  'oceania': 'Oceania',
  'south-america': 'South America',
  'western-europe': 'Western Europe',
};

const GENRE_INTROS: Record<string, string> = {
  techno: 'Techno festivals are the beating heart of underground electronic culture - dark warehouses, pounding basslines, and communities built on shared sonic intensity. From Berlin\'s legendary scene to industrial venues across the globe, these events define the outer edge of dance music. Whether you\'re a seasoned raver or a curious newcomer, a great techno festival is a transformative experience that goes far beyond music.',
  electronic: 'Electronic music festivals span the full spectrum - from euphoric mainstage drops to intimate club stages running until dawn. These events attract the world\'s most innovative DJs and producers, setting the trends that ripple across global dance culture. With production values that rival stadium concerts and lineups that mix legends with cutting-edge new talent, electronic festivals are the pinnacle of the live music experience.',
  house: 'House music festivals celebrate the genre that gave birth to modern dance culture. Rooted in Chicago\'s underground clubs of the 1980s, house has evolved into a global language of joy, community, and self-expression. The best house festivals feel like a homecoming - warm, inclusive, and endlessly musical. From deep and soulful to peak-time bangers, there\'s a house festival for every shade of the genre.',
  trance: 'Trance festivals are marathon journeys of euphoria - soaring melodies, hypnotic rhythms, and crowds that move as one. The genre has built one of music\'s most passionate and loyal global communities. These events are famous for their emotional intensity, breathtaking production, and the sense of collective transcendence that only trance music can generate.',
  rock: 'Rock festivals are a pilgrimage for music lovers - days of powerful guitar riffs, unforgettable live performances, and the raw energy of crowds united by their love of the genre. From intimate independent events to stadium-scale extravaganzas, rock festivals span every subgenre imaginable. These events have defined generations and remain among the most iconic live experiences in the world.',
  indie: 'Indie festivals champion artistic independence and musical discovery. These events are where tomorrow\'s biggest names play alongside established cult acts, creating lineups that reward adventurous music fans. Known for their creative curation, distinctive atmospheres, and dedicated audiences, indie festivals offer a more intimate and authentic alternative to mainstream events.',
  pop: 'Pop festivals bring the biggest names in music to massive audiences, delivering spectacle and catchy anthems in equal measure. These events are a cultural moment - where chart-topping artists deliver career-defining performances and fans create lifelong memories. With production values that set the global standard, pop festivals are the most accessible and universally celebrated live music experiences.',
  metal: 'Metal festivals are a celebration of intensity, technicality, and the unbreakable bonds of the metal community. From classic heavy metal to extreme subgenres, these events attract the most dedicated fans in music - people who travel across continents to stand in the pit for their favourite bands. The atmosphere is electric, the performances are ferocious, and the sense of belonging is like nothing else.',
  hiphop: 'Hip-hop festivals showcase the culture that has defined popular music for four decades - rap, beats, and the artistic expression of communities worldwide. These events mix established legends with the newest voices in the scene, creating lineups that reflect hip-hop\'s extraordinary diversity. The best hip-hop festivals feel like a cultural summit, celebrating an art form that continues to evolve and lead.',
  jazz: 'Jazz festivals are where musical sophistication meets pure joy. These events attract world-class musicians who improvise, collaborate, and push the boundaries of one of music\'s richest traditions. Whether staged in picturesque outdoor settings or intimate club environments, jazz festivals offer a premium cultural experience that rewards listeners who appreciate musical mastery.',
  folk: 'Folk festivals celebrate the storytelling heart of music - acoustic instruments, poetic lyrics, and traditions that stretch back centuries alongside modern artists reinventing the genre. These events create uniquely warm communities, often set in beautiful natural landscapes, where the focus is on musical authenticity and human connection.',
  reggae: 'Reggae festivals are gatherings of peace, positivity, and powerful music rooted in Jamaican culture. The genre\'s messages of unity and resilience resonate with fans across the world, making these events among the most inclusive and spiritually uplifting experiences in live music. Expect world-class sound systems, iconic artists, and an atmosphere of pure love.',
  classical: 'Classical music festivals offer an unparalleled encounter with centuries of masterwork - orchestras, chamber ensembles, and soloists performing in settings that range from historic concert halls to open-air amphitheatres. These events attract music lovers who understand that great classical performance is one of humanity\'s highest cultural achievements.',
  edm: 'EDM festivals are among the largest and most spectacular live music events on the planet - massive stages, mind-bending light shows, and the world\'s most in-demand DJs performing for hundreds of thousands of fans. These events are a total sensory experience, engineered for maximum energy and unforgettable shared moments.',
  bass: 'Bass music festivals celebrate the low-end frequencies that move bodies and shake souls - from drum and bass to dubstep, trap, and everything in between. These events are renowned for their powerful sound systems, cutting-edge production, and communities united by their love of heavy, inventive music.',
  world: 'World music festivals are extraordinary celebrations of global culture - bringing together traditional and contemporary artists from across continents to create programs that educate, inspire, and connect audiences to the full richness of human musical expression. These events are a passport to musical cultures most people never encounter elsewhere.',
  latin: 'Latin music festivals pulsate with irresistible rhythm - salsa, reggaeton, cumbia, bachata and more, performed by the hottest artists from across Latin America and the Spanish-speaking world. These events are famous for their infectious energy, passionate crowds, and celebrations that last long into the night.',
  ambient: 'Ambient music festivals offer a rare kind of immersive experience - spaces designed for deep listening, where sonic landscapes wash over audiences and create states of reflection and wonder. These events attract the most discerning listeners in electronic music, people who understand that music can be a form of meditation.',
  psytrance: 'Psytrance festivals are transformative gatherings that blend music, art, and spiritual community into something unlike any other live event. Rooted in the Goa trance scene and guided by principles of openness and creativity, these events run through the night and into the dawn, soundtracked by hypnotic, mind-expanding music.',
  dubstep: 'Dubstep festivals bring together the architects of bass music culture - from the dark, wobbly originals to the brutal modern sound that has taken over arenas worldwide. These events celebrate innovation and heaviness in equal measure, drawing dedicated bass heads who expect nothing less than earth-shaking performances.',
  default: 'Music festivals bring together the world\'s most passionate fans for unforgettable shared experiences. These events combine outstanding lineups, remarkable production, and vibrant communities to create moments that stay with you forever. Discover the finest festivals in this genre and find your perfect match.',
};

const GENRE_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  techno:     { bg: 'from-slate-900 via-slate-800 to-purple-900', text: 'text-purple-300', badge: 'bg-purple-900/50 text-purple-300' },
  electronic: { bg: 'from-blue-900 via-indigo-900 to-purple-900', text: 'text-blue-300',   badge: 'bg-blue-900/50 text-blue-300' },
  house:      { bg: 'from-orange-700 via-orange-800 to-red-900',  text: 'text-orange-200', badge: 'bg-orange-900/50 text-orange-200' },
  trance:     { bg: 'from-cyan-800 via-blue-900 to-indigo-900',   text: 'text-cyan-300',   badge: 'bg-cyan-900/50 text-cyan-300' },
  rock:       { bg: 'from-red-900 via-red-800 to-gray-900',       text: 'text-red-300',    badge: 'bg-red-900/50 text-red-300' },
  indie:      { bg: 'from-amber-800 via-yellow-900 to-orange-900',text: 'text-amber-300',  badge: 'bg-amber-900/50 text-amber-300' },
  pop:        { bg: 'from-pink-700 via-rose-800 to-purple-900',   text: 'text-pink-200',   badge: 'bg-pink-900/50 text-pink-200' },
  metal:      { bg: 'from-gray-900 via-zinc-900 to-slate-900',    text: 'text-gray-300',   badge: 'bg-gray-800/60 text-gray-300' },
  hiphop:     { bg: 'from-yellow-800 via-amber-900 to-orange-900',text: 'text-yellow-300', badge: 'bg-yellow-900/50 text-yellow-300' },
  jazz:       { bg: 'from-teal-800 via-teal-900 to-emerald-900', text: 'text-teal-300',   badge: 'bg-teal-900/50 text-teal-300' },
  folk:       { bg: 'from-green-800 via-emerald-900 to-teal-900', text: 'text-green-300',  badge: 'bg-green-900/50 text-green-300' },
  reggae:     { bg: 'from-green-700 via-yellow-800 to-red-900',   text: 'text-yellow-200', badge: 'bg-yellow-900/50 text-yellow-200' },
  default:    { bg: 'from-purple-800 via-purple-900 to-pink-900', text: 'text-purple-200', badge: 'bg-purple-900/50 text-purple-200' },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-');
}

function fromSlug(s: string) {
  return s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getGenreColor(genre: string) {
  return GENRE_COLORS[genre] ?? GENRE_COLORS.default;
}

function getFilteredFestivals(genre: string, region: string): Festival[] {
  return festivals.filter(f => {
    const matchGenre = f.genres.some(g => toSlug(g) === genre);
    const matchRegion = f.region ? toSlug(f.region) === region : false;
    return matchGenre && matchRegion && f.status === 'active';
  });
}

// ── Static Params (pre-render all non-empty combos) ────────────────────────────
export async function generateStaticParams() {
  const params: { genre: string; region: string }[] = [];
  const allGenres = [...new Set(festivals.flatMap(f => f.genres))];
  const allRegions = [...new Set(festivals.map(f => f.region).filter(Boolean) as string[])];

  for (const genre of allGenres) {
    for (const region of allRegions) {
      const matches = getFilteredFestivals(toSlug(genre), toSlug(region));
      if (matches.length > 0) {
        params.push({ genre: toSlug(genre), region: toSlug(region) });
      }
    }
  }
  return params;
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ genre: string; region: string }>;
}): Promise<Metadata> {
  const { genre, region } = await params;
  const regionLabel = REGION_LABELS[region] ?? fromSlug(region);
  const genreLabel = fromSlug(genre);
  const matched = getFilteredFestivals(genre, region);

  if (matched.length === 0) return { title: 'No festivals found' };

  const minPrice = Math.min(...matched.map(f => f.estimated_cost_usd.min));
  const year = new Date().getFullYear();

  const title = `Best ${genreLabel} Festivals in ${regionLabel} ${year} — ${matched.length} Events`;
  const description = `Discover ${matched.length} top ${genreLabel} music festivals in ${regionLabel}. Compare dates, prices (from $${minPrice}), crowd sizes and vibes. Find your perfect ${genreLabel} festival experience.`;

  return {
    title,
    description,
    keywords: [
      `${genreLabel} festivals ${regionLabel}`,
      `${genreLabel} music festival ${year}`,
      `best ${genreLabel} festivals ${regionLabel}`,
      `${regionLabel} ${genreLabel} events`,
      `${genreLabel} festival tickets`,
    ],
    openGraph: {
      title,
      description,
      url: `https://getfestiwise.com/festivals/${genre}/${region}`,
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://getfestiwise.com/festivals/${genre}/${region}` },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function GenreRegionPage({
  params,
}: {
  params: Promise<{ genre: string; region: string }>;
}) {
  const { genre, region } = await params;
  const regionLabel = REGION_LABELS[region] ?? fromSlug(region);
  const genreLabel = fromSlug(genre);
  const matched = getFilteredFestivals(genre, region);

  if (matched.length === 0) notFound();

  const colors = getGenreColor(genre);
  const intro = GENRE_INTROS[genre] ?? GENRE_INTROS.default;
  const minPrice = Math.min(...matched.map(f => f.estimated_cost_usd.min));
  const avgDuration = Math.round(matched.reduce((s, f) => s + f.duration_days, 0) / matched.length);
  const countries = [...new Set(matched.map(f => f.country))];

  // ── Structured data ────────────────────────────────────────────────────────
  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${genreLabel} Festivals in ${regionLabel}`,
    description: `Curated list of ${matched.length} ${genreLabel} music festivals in ${regionLabel}`,
    url: `https://getfestiwise.com/festivals/${genre}/${region}`,
    numberOfItems: matched.length,
    itemListElement: matched.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://getfestiwise.com/festival/${f.id}`,
      name: f.name,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className={`bg-gradient-to-br ${colors.bg} text-white`}>
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-white/50 text-sm mb-8 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href="/festivals" className="hover:text-white transition-colors">Festivals</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="capitalize text-white/80">{genreLabel}</span>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-white/90">{regionLabel}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 leading-tight">
            {genreLabel} Festivals<br />
            <span className={colors.text}>in {regionLabel}</span>
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-2xl">
            {matched.length} curated {genreLabel.toLowerCase()} events across {countries.length} {countries.length === 1 ? 'country' : 'countries'} -discover, compare and plan your perfect festival trip.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Festivals', value: matched.length },
              { label: 'Countries', value: countries.length },
              { label: 'From', value: `$${minPrice.toLocaleString()}` },
              { label: 'Avg duration', value: `${avgDuration} days` },
            ].map(s => (
              <div key={s.label} className={`px-4 py-2.5 rounded-xl text-sm backdrop-blur-sm border border-white/10 ${colors.badge}`}>
                <span className="font-bold text-base mr-1">{s.value}</span>
                <span className="opacity-70">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

       
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {genreLabel} Festivals in {regionLabel} - Complete Guide
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">{intro}</p>
          <p className="text-gray-500 leading-relaxed mt-4">
            {regionLabel} has established itself as one of the world&apos;s premier destinations for {genreLabel.toLowerCase()} music. The region&apos;s festivals attract top-tier international talent alongside local artists, creating events that feel both globally connected and distinctly regional. Below you&apos;ll find every {genreLabel.toLowerCase()} festival in {regionLabel} that we track - with full details on pricing, crowd size, and atmosphere to help you choose the right event for your style and budget.
          </p>
        </section>

        {/* Festival cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {matched.length} {genreLabel} Festival{matched.length !== 1 ? 's' : ''} in {regionLabel}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {matched.map((f) => {
              const budgetLabel =
                f.estimated_cost_usd.min < 400
                  ? 'Budget-friendly'
                  : f.estimated_cost_usd.min < 1000
                  ? 'Mid-range'
                  : 'Premium';
              return (
                <Link
                  key={f.id}
                  href={`/festival/${f.id}`}
                  className="group block bg-white border border-gray-100 hover:border-purple-200 hover:shadow-xl rounded-2xl p-6 transition-all duration-200"
                >
                  {/* Genre + vibe tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {f.genres.slice(0, 3).map(g => (
                      <span key={g} className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold capitalize">
                        {g}
                      </span>
                    ))}
                    {f.vibe.slice(0, 2).map(v => (
                      <span key={v} className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium capitalize">
                        {v}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-1">
                    {f.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {f.city}, {f.country}
                  </p>

                  <div className="grid grid-cols-3 gap-3 text-center border-t border-gray-100 pt-4">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-0.5">
                        <DollarSign className="w-3 h-3" />
                        <span>Cost</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        ${f.estimated_cost_usd.min.toLocaleString()}+
                      </div>
                      <div className="text-xs text-gray-400">{budgetLabel}</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Duration</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">{f.duration_days} days</div>
                      <div className="text-xs text-gray-400">{f.months.slice(0, 2).join(' & ')}</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-0.5">
                        <Users className="w-3 h-3" />
                        <span>Crowd</span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 capitalize">{f.audience_size}</div>
                      <div className="text-xs text-gray-400">{f.camping ? 'Camping' : 'No camping'}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-purple-600 font-semibold group-hover:text-purple-800 transition-colors">
                      View full guide →
                    </span>
                    {f.ticket_official_url && (
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">
                        Tickets available
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Cross-links: other regions for this genre */}
        <section className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {genreLabel} Festivals in Other Regions
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(REGION_LABELS)
              .filter(([slug]) => slug !== region)
              .map(([slug, label]) => {
                const count = getFilteredFestivals(genre, slug).length;
                if (count === 0) return null;
                return (
                  <Link
                    key={slug}
                    href={`/festivals/${genre}/${slug}`}
                    className="px-4 py-2 bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-700 text-gray-600 rounded-xl text-sm font-medium transition-colors"
                  >
                    {label}
                    <span className="ml-1.5 text-xs text-gray-400">({count})</span>
                  </Link>
                );
              })}
          </div>
        </section>

        {/* Cross-links: other genres in this region */}
        <section className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Other Genres in {regionLabel}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {[...new Set(festivals.flatMap(f => f.genres))]
              .filter(g => toSlug(g) !== genre)
              .map(g => {
                const count = getFilteredFestivals(toSlug(g), region).length;
                if (count === 0) return null;
                return (
                  <Link
                    key={g}
                    href={`/festivals/${toSlug(g)}/${region}`}
                    className="px-4 py-2 bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-700 text-gray-600 rounded-xl text-sm font-medium transition-colors capitalize"
                  >
                    {g}
                    <span className="ml-1.5 text-xs text-gray-400">({count})</span>
                  </Link>
                );
              })}
          </div>
        </section>

        {/* Quiz CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Not sure which {genreLabel} festival is right for you?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Take our 2-minute festival quiz and get a personalised match based on your music taste, budget, travel style and more.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
          >
            Find My Perfect Festival
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
