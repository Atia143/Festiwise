import Link from 'next/link';
import Image from 'next/image';
import rawFestivals from '@/data/festivals.json';
import type { Festival } from '@/types/festival';
import { getFestivalCover } from '@/lib/festivalImages';

const ALL = rawFestivals as Festival[];

const FEATURED_IDS = [
  'tomorrowland',
  'coachella',
  'glastonbury',
  'burning_man',
  'primavera',
  'fuji_rock',
  'bonnaroo',
  'ultra_miami',
  'rock_in_rio',
];

const GENRE_COLORS: Record<string, string> = {
  electronic: 'bg-blue-500/80',
  rock:        'bg-red-500/80',
  indie:       'bg-amber-500/80',
  jazz:        'bg-teal-500/80',
  pop:         'bg-pink-500/80',
  hiphop:      'bg-purple-500/80',
  world:       'bg-emerald-500/80',
  country:     'bg-yellow-600/80',
  metal:       'bg-gray-600/80',
  folk:        'bg-green-600/80',
};

function genrePill(g: string) {
  return GENRE_COLORS[g.toLowerCase()] ?? 'bg-purple-500/80';
}

function FestivalCard({ festival, large = false }: { festival: Festival; large?: boolean }) {
  const { imageUrl, gradient } = getFestivalCover(festival.id, festival.genres);

  return (
    <Link
      href={`/festival/${festival.id}`}
      className={`group relative overflow-hidden rounded-2xl block ${large ? 'row-span-2' : ''}`}
      style={{ aspectRatio: large ? '4/5' : '4/3' }}
    >
      {/* Background */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${festival.name} ${festival.genres[0] ?? ''} festival in ${festival.country}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}

      {/* Gradient overlay — stronger at bottom for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Top genre pill */}
      <div className="absolute top-3 left-3">
        <span className={`${genrePill(festival.genres[0])} backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize`}>
          {festival.genres[0]}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-white font-bold text-base md:text-lg leading-tight mb-1 group-hover:text-yellow-300 transition-colors">
          {festival.name}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-white/70 text-xs md:text-sm">
            {festival.city}, {festival.country}
          </p>
          <p className="text-white/60 text-xs">
            {festival.months[0]}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedFestivalsSection() {
  const festivals = FEATURED_IDS
    .map(id => ALL.find(f => f.id === id))
    .filter((f): f is Festival => f !== undefined);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-widest rounded-full mb-3">
              Iconic Festivals
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              The world&apos;s greatest<br className="hidden sm:block" /> music festivals
            </h2>
          </div>
          <Link
            href="/festivals"
            className="hidden sm:flex items-center gap-1.5 text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors whitespace-nowrap"
          >
            See all 100+
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Grid — 3 columns, varied heights */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {festivals.map((festival, i) => (
            <FestivalCard key={festival.id} festival={festival} />
          ))}
        </div>

        {/* Mobile "see all" link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/festivals"
            className="inline-flex items-center gap-2 text-purple-600 font-semibold text-sm"
          >
            See all 100+ festivals
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Quiz CTA below grid */}
        <div className="mt-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg md:text-xl mb-1">
              Not sure which one is right for you?
            </p>
            <p className="text-white/75 text-sm md:text-base">
              Our 2-minute quiz matches you across all 100+ festivals.
            </p>
          </div>
          <Link
            href="/quiz"
            className="flex-shrink-0 px-7 py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-yellow-50 transition-all shadow-lg hover:shadow-xl text-sm md:text-base touch-manipulation whitespace-nowrap"
          >
            Find My Festival →
          </Link>
        </div>
      </div>
    </section>
  );
}
