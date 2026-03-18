import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, MapPin, DollarSign, Clock, Users, Award } from 'lucide-react';
import { COLLECTIONS, getCollection, getCollectionFestivals } from '@/lib/collections';
import rawFestivals from '@/data/festivals.json';
import type { Festival } from '@/types/festival';

const allFestivals = rawFestivals as Festival[];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COLLECTIONS.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return { title: 'Collection not found' };
  const count = getCollectionFestivals(c, allFestivals).length;
  const title = `${c.title} — ${count} Expert Picks`;
  const description = `${c.subtitle}. ${count} hand-curated festivals selected by our editorial team.`;
  const ogParams = new URLSearchParams({
    slug,
    title: c.title,
    subtitle: c.subtitle,
    badge: c.badge,
    count: String(count),
  });
  const ogImageUrl = `https://getfestiwise.com/api/og/collection?${ogParams.toString()}`;
  return {
    title,
    description,
    keywords: [c.title, 'best festivals', 'music festivals 2026', c.badge, 'festival guide'],
    alternates: { canonical: `https://getfestiwise.com/collections/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://getfestiwise.com/collections/${slug}`,
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${c.title} — FestiWise` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

const GENRE_COLORS: Record<string, string> = {
  electronic: 'bg-blue-100 text-blue-700',
  techno:     'bg-purple-100 text-purple-700',
  rock:       'bg-red-100 text-red-700',
  indie:      'bg-amber-100 text-amber-700',
  pop:        'bg-pink-100 text-pink-700',
  hiphop:     'bg-yellow-100 text-yellow-700',
  jazz:       'bg-teal-100 text-teal-700',
  house:      'bg-orange-100 text-orange-700',
};
const genreColor = (g: string) => GENRE_COLORS[g] ?? 'bg-gray-100 text-gray-600';

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();

  const festivals = getCollectionFestivals(c, allFestivals);

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: c.title,
    description: c.subtitle,
    url: `https://getfestiwise.com/collections/${slug}`,
    numberOfItems: festivals.length,
    itemListElement: festivals.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://getfestiwise.com/festival/${f.id}`,
      name: f.name,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />

      {/* Hero */}
      <section className={`bg-gradient-to-br ${c.headerGradient} text-white`}>
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-12">
          <nav className="flex items-center gap-1.5 text-white/50 text-sm mb-8 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-white/80">{c.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${c.badgeColor}`}>
              {c.badge}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs font-semibold text-white/70">
              <Award className="w-3.5 h-3.5" />
              Editor&apos;s Choice
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 leading-tight">
            {c.title}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">{c.subtitle}</p>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-8">
            <div className="px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm backdrop-blur-sm">
              <span className="font-bold">{festivals.length}</span>
              <span className="opacity-60 ml-1">festivals</span>
            </div>
            <div className="px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm backdrop-blur-sm">
              <span className="font-bold">{[...new Set(festivals.map(f => f.country))].length}</span>
              <span className="opacity-60 ml-1">countries</span>
            </div>
            {festivals.length > 0 && (
              <div className="px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm backdrop-blur-sm">
                <span className="font-bold">${Math.min(...festivals.map(f => f.estimated_cost_usd.min)).toLocaleString()}+</span>
                <span className="opacity-60 ml-1">from</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">

        {/* Intro + expert note */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About This Collection</h2>
            <p className="text-gray-600 leading-relaxed">{c.intro}</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-700">Editor&apos;s Note</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{c.expertNote}</p>
          </div>
        </section>

        {/* Festival list */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            The {festivals.length} Best {c.title}
          </h2>
          <div className="space-y-4">
            {festivals.map((f, i) => {
              const budgetTier =
                f.estimated_cost_usd.min < 400 ? 'Budget'
                : f.estimated_cost_usd.min < 1000 ? 'Mid-range'
                : 'Premium';
              return (
                <Link
                  key={f.id}
                  href={`/festival/${f.id}`}
                  className="group flex gap-4 bg-white border border-gray-100 hover:border-purple-200 hover:shadow-lg rounded-2xl p-5 transition-all duration-200"
                >
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ${
                    i === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-md' :
                    i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                    i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {i + 1}
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors text-lg">
                        {f.name}
                      </h3>
                      {i === 0 && (
                        <span className="px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                          #1 Pick
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      {f.city}, {f.country} · {f.months.join(' & ')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {f.genres.slice(0, 3).map(g => (
                        <span key={g} className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${genreColor(g)}`}>
                          {g}
                        </span>
                      ))}
                      {f.vibe.slice(0, 2).map(v => (
                        <span key={v} className="px-2.5 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium capitalize">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex-shrink-0 flex flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="font-semibold text-gray-900">${f.estimated_cost_usd.min.toLocaleString()}+</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {f.duration_days} days
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Users className="w-3 h-3" />
                      <span className="capitalize">{f.audience_size}</span>
                    </div>
                    <span className="text-xs text-purple-600 font-semibold group-hover:text-purple-800 transition-colors">
                      {budgetTier}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* More collections */}
        <section className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">More Expert Collections</h2>
          <div className="flex flex-wrap gap-2.5">
            {COLLECTIONS.filter(col => col.slug !== slug).map(col => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="px-4 py-2 bg-white border border-gray-200 hover:border-purple-300 hover:text-purple-700 text-gray-600 rounded-xl text-sm font-medium transition-colors"
              >
                {col.title}
              </Link>
            ))}
          </div>
        </section>

        {/* Quiz CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Find your personal match</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Expert collections are a great start - but for a truly personalised recommendation, take our 2-minute quiz.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg"
          >
            Take the Quiz
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
