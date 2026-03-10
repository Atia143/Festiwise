import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  MapPin, Calendar, Clock, Users, DollarSign,
  Tent, Music, Thermometer, Bell, ChevronRight,
  Shield, Globe, ExternalLink, Ticket,
} from 'lucide-react';
import rawFestivals from '@/data/festivals.json';
import type { Festival } from '@/types/festival';
import EventSchema from '@/components/SEO/EventSchema';
import TicketAlertForm from '@/components/TicketAlertForm';
import SmartMatchBadge from '@/components/SmartMatchBadge';
import VibeRadarChart from '@/components/VibeRadarChart';
import UrgencyBadge from '@/components/UrgencyBadge';
import SimpleNewsletterForm from '@/components/Newsletter/SimpleNewsletterForm';
import SaveFavoriteButton from '@/components/SaveFavoriteButton';
import FestivalViewCount from '@/components/FestivalViewCount';
import { LocalPriceRange } from '@/components/LocalPrice';
import { getFestivalCover } from '@/lib/festivalImages';
import ShareFestivalButton from '@/components/ShareFestivalButton';

const festivals = rawFestivals as Festival[];

interface Props {
  params: Promise<{ id: string }>;
}

// ── SEO helpers ───────────────────────────────────────────────────────────────
function buildDescription(f: Festival): string {
  const budget =
    f.estimated_cost_usd.min < 400
      ? 'budget-friendly'
      : f.estimated_cost_usd.min < 1000
      ? 'mid-range'
      : 'premium';
  const crowd =
    f.audience_size === 'massive'
      ? "one of the world's largest festivals"
      : f.audience_size === 'large'
      ? 'a large-scale international festival'
      : f.audience_size === 'medium'
      ? 'a mid-size festival'
      : 'an intimate boutique festival';
  return `${f.name} is ${crowd} held in ${f.city}, ${f.country} each ${f.months.join(' and ')}. Known for its ${f.genres.join(', ')} music, the festival runs for ${f.duration_days} days and draws a ${f.vibe.slice(0, 2).join(', ')} crowd. Total costs typically range from $${f.estimated_cost_usd.min.toLocaleString()} to $${f.estimated_cost_usd.max.toLocaleString()}, making it a ${budget} choice.`;
}

function buildFAQ(f: Festival) {
  return [
    {
      q: `Is ${f.name} family-friendly?`,
      a: f.family_friendly
        ? `Yes, ${f.name} welcomes families with children and offers a welcoming atmosphere for all ages.`
        : `${f.name} is primarily an adult-oriented event${f.min_age ? ` with a minimum age of ${f.min_age}` : ''}. It may not be suitable for young children.`,
    },
    {
      q: `Can you camp at ${f.name}?`,
      a: f.camping
        ? `Yes, ${f.name} offers on-site camping${f.glamping ? ', as well as glamping options for those who prefer more comfort' : ''}. Book early as camping spots sell out quickly.`
        : `${f.name} does not offer on-site camping. Attendees typically book hotels or Airbnb accommodation nearby.`,
    },
    {
      q: `How much does ${f.name} cost?`,
      a: `Total cost including tickets, travel, food, and accommodation typically ranges from $${f.estimated_cost_usd.min.toLocaleString()} to $${f.estimated_cost_usd.max.toLocaleString()} USD, depending on your travel origin and how you plan your stay.`,
    },
    {
      q: `What genres are featured at ${f.name}?`,
      a: `${f.name} features ${f.genres.join(', ')} music. The festival runs for ${f.duration_days} days in ${f.months.join(' and ')} in ${f.city}, ${f.country}, and is known for its ${f.vibe.join(', ')} atmosphere.`,
    },
  ];
}

function getSimilarFestivals(current: Festival, count = 4): Festival[] {
  const scored = festivals
    .filter(f => f.id !== current.id && f.status === 'active')
    .map(f => {
      const sharedGenres = f.genres.filter(g => current.genres.includes(g)).length;
      const sharedVibes = f.vibe.filter(v => current.vibe.includes(v)).length;
      const sameRegion = f.region === current.region ? 2 : 0;
      const similarBudget =
        Math.abs(f.estimated_cost_usd.min - current.estimated_cost_usd.min) < 400 ? 1 : 0;
      return { festival: f, score: sharedGenres * 3 + sharedVibes * 2 + sameRegion + similarBudget };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map(x => x.festival);
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const f = festivals.find(f => f.id === id);
  if (!f) return { title: 'Festival Not Found' };

  const title = `${f.name} ${new Date().getFullYear()} — Complete Festival Guide`;
  const description = `Everything you need to know about ${f.name} in ${f.city}, ${f.country}. Dates, tickets, budget, camping, and what to expect.`;

  const ogParams = new URLSearchParams({
    name:    f.name,
    genre:   f.genres[0] ?? 'music',
    genres:  f.genres.slice(0, 4).join(','),
    country: f.country,
    city:    f.city,
    month:   f.months.slice(0, 2).join(' & '),
    days:    String(f.duration_days),
    min:     String(f.estimated_cost_usd.min),
    max:     String(f.estimated_cost_usd.max),
  });
  const ogImageUrl = `https://getfestiwise.com/api/og/festival?${ogParams.toString()}`;

  return {
    title,
    description,
    keywords: [f.name, 'music festival', ...f.genres, f.country, f.city, 'festival guide', 'festival tickets'],
    openGraph: {
      title,
      description,
      url: `https://getfestiwise.com/festival/${f.id}`,
      type: 'article',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${f.name} festival guide` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: { canonical: `https://getfestiwise.com/festival/${f.id}` },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function FestivalPage({ params }: Props) {
  const { id } = await params;
  const festival = festivals.find(f => f.id === id);
  if (!festival) return notFound();

  const description = buildDescription(festival);
  const faq = buildFAQ(festival);
  const similar = getSimilarFestivals(festival);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const GENRE_COLORS: Record<string, string> = {
    electronic: 'bg-blue-100 text-blue-700',
    rock: 'bg-red-100 text-red-700',
    indie: 'bg-amber-100 text-amber-700',
    pop: 'bg-pink-100 text-pink-700',
    hiphop: 'bg-purple-100 text-purple-700',
    jazz: 'bg-teal-100 text-teal-700',
    classical: 'bg-slate-100 text-slate-700',
    folk: 'bg-green-100 text-green-700',
    metal: 'bg-gray-100 text-gray-700',
    reggae: 'bg-yellow-100 text-yellow-700',
  };
  const genreColor = (g: string) => GENRE_COLORS[g] ?? 'bg-purple-100 text-purple-700';
  const { imageUrl, gradient } = getFestivalCover(festival.id, festival.genres);

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD: Event + FAQ */}
      <EventSchema festival={festival} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className={`relative text-white overflow-hidden ${imageUrl ? '' : `bg-gradient-to-br ${gradient}`}`}>
        {imageUrl && (
          <>
            <Image
              src={imageUrl}
              alt={festival.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </>
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-white/60 text-sm mb-8" aria-label="Breadcrumb">
            <Link href="/festivals" className="hover:text-white transition-colors">Festivals</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/90">{festival.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                {festival.name}
              </h1>
              <div className="flex items-center gap-1.5 text-white/80 text-lg mb-5">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{festival.city}, {festival.country}</span>
              </div>
              {/* Genre tags + smart match */}
              <div className="flex flex-wrap gap-2 items-center">
                {festival.genres.map(g => (
                  <span key={g} className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium capitalize">
                    {g}
                  </span>
                ))}
                <SmartMatchBadge festival={festival} size="md" />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 min-w-[200px]">
              {festival.ticket_official_url && (
                <div className="text-center">
                  <Link
                    href={`/go/${festival.id}`}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Ticket className="w-4 h-4" />
                    Get Tickets
                  </Link>
                  <FestivalViewCount festivalId={festival.id} />
                </div>
              )}
              <SaveFavoriteButton festivalId={festival.id} festivalName={festival.name} />
              <ShareFestivalButton festivalId={festival.id} festivalName={festival.name} />
              {festival.website && (
                <a
                  href={festival.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all"
                >
                  <Globe className="w-4 h-4" />
                  Official Website
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="relative z-10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90 items-center">
              <UrgencyBadge months={festival.months} status={festival.status} size="sm" />
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {festival.months.join(' & ')}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {festival.duration_days} days
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span className="capitalize">{festival.audience_size} crowd</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <LocalPriceRange minUsd={festival.estimated_cost_usd.min} maxUsd={festival.estimated_cost_usd.max} />
              </div>
              {festival.min_age && (
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {festival.min_age}+ only
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">

        {/* About */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About {festival.name}</h2>
          <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
        </section>

        {/* Two-column: Key Info + Vibe */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Key Info */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Festival Details</h2>
            <dl className="space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <dt className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="w-4 h-4" />
                  Budget range
                </dt>
                <dd className="font-semibold text-gray-900">
                  <LocalPriceRange minUsd={festival.estimated_cost_usd.min} maxUsd={festival.estimated_cost_usd.max} />
                </dd>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3.5">
                <dt className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  Duration
                </dt>
                <dd className="font-semibold text-gray-900">{festival.duration_days} days</dd>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3.5">
                <dt className="flex items-center gap-2 text-gray-500">
                  <Users className="w-4 h-4" />
                  Crowd size
                </dt>
                <dd className="font-semibold text-gray-900 capitalize">{festival.audience_size}</dd>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3.5">
                <dt className="flex items-center gap-2 text-gray-500">
                  <Tent className="w-4 h-4" />
                  Camping
                </dt>
                <dd className={`font-semibold ${festival.camping ? 'text-green-600' : 'text-gray-400'}`}>
                  {festival.camping ? (festival.glamping ? 'Camping + Glamping' : 'Available') : 'Not available'}
                </dd>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3.5">
                <dt className="flex items-center gap-2 text-gray-500">
                  <Users className="w-4 h-4" />
                  Family-friendly
                </dt>
                <dd className={`font-semibold ${festival.family_friendly ? 'text-green-600' : 'text-gray-400'}`}>
                  {festival.family_friendly ? 'Yes' : 'No'}
                </dd>
              </div>
              {festival.min_age && (
                <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3.5">
                  <dt className="flex items-center gap-2 text-gray-500">
                    <Shield className="w-4 h-4" />
                    Minimum age
                  </dt>
                  <dd className="font-semibold text-gray-900">{festival.min_age}+</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Vibe & Weather */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Vibe &amp; Atmosphere</h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" />
                  Music
                </h3>
                <div className="flex flex-wrap gap-2">
                  {festival.genres.map(g => (
                    <span key={g} className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${genreColor(g)}`}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {festival.vibe && festival.vibe.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Vibe</h3>
                  <div className="flex flex-wrap gap-2">
                    {festival.vibe.map(v => (
                      <span key={v} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium capitalize">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {festival.weather_profile && festival.weather_profile.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5" />
                    Weather
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {festival.weather_profile.map(w => (
                      <span key={w} className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium capitalize">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Vibe Radar Chart */}
        <VibeRadarChart festival={festival} />

        {/* Ticket Alert CTA */}
        {festival.ticket_official_url && (
          <section className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Be first when tickets drop</h2>
                <p className="text-gray-600 mt-1">
                  {festival.name} tickets sell out fast. Enter your email and we&apos;ll alert you the moment they go on sale - before it&apos;s announced publicly.
                </p>
              </div>
            </div>
            <TicketAlertForm festivalName={festival.name} festivalId={festival.id} />
            <p className="text-xs text-gray-400 mt-3">No spam. One email when tickets drop.</p>
          </section>
        )}

        {/* Similar Festivals */}
        {similar.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
              <Link
                href="/festivals"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                Browse all →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {similar.map(f => {
                const sharedGenres = f.genres.filter(g => festival.genres.includes(g));
                const sharedVibes = f.vibe.filter(v => festival.vibe.includes(v));
                const reasons = [
                  ...sharedGenres.map(g => g.charAt(0).toUpperCase() + g.slice(1)),
                  ...sharedVibes.map(v => v.charAt(0).toUpperCase() + v.slice(1) + ' vibe'),
                ].slice(0, 3);
                return (
                  <div
                    key={f.id}
                    className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-purple-200 hover:shadow-lg rounded-2xl p-5 transition-all duration-200"
                  >
                    {/* Genre + vibe tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {f.genres.slice(0, 2).map(g => (
                        <span key={g} className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${genreColor(g)}`}>
                          {g}
                        </span>
                      ))}
                      {f.vibe.slice(0, 1).map(v => (
                        <span key={v} className="px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full text-xs font-medium capitalize">
                          {v}
                        </span>
                      ))}
                    </div>

                    <Link href={`/festival/${f.id}`} className="block">
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-1 text-lg">
                        {f.name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {f.city}, {f.country}
                      </p>
                      <p className="text-sm text-gray-400">{f.months.join(' & ')} · {f.duration_days} days · ${f.estimated_cost_usd.min.toLocaleString()}+</p>
                    </Link>

                    {/* Why it matches */}
                    {reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-400">Similar:</span>
                        {reasons.map(r => (
                          <span key={r} className="text-xs text-purple-600 font-medium">{r}</span>
                        ))}
                      </div>
                    )}

                    {/* Compare link */}
                    <Link
                      href={`/compare?ids=${festival.id},${f.id}`}
                      className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Compare with {festival.name}
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl px-6 py-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quiz CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Not sure {festival.name} is right for you?</h2>
          <p className="text-white/80 mb-6">
            Take our 2-minute quiz and we&apos;ll match you with the perfect festival based on your music taste, budget, and style.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
          >
            Find My Perfect Festival
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Newsletter */}
        <SimpleNewsletterForm />

        {/* Find more */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Explore More Festivals</h2>
          <div className="flex flex-wrap gap-3">
            {festival.region && festival.genres.slice(0, 2).map(g => (
              <Link
                key={g}
                href={`/festivals/${g.toLowerCase()}/${festival.region!.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-sm font-medium transition-colors capitalize"
              >
                {g} in {festival.region}
              </Link>
            ))}
            {festival.genres.slice(0, 2).map(g => (
              <Link
                key={`genre-${g}`}
                href={`/festivals/genre/${g.toLowerCase()}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors capitalize"
              >
                All {g} festivals
              </Link>
            ))}
            <Link
              href="/festivals"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
            >
              All 100+ Festivals
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
