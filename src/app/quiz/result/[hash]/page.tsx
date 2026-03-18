import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import rawFestivals from '@/data/festivals.json';
import type { Festival } from '@/types/festival';
import { getFestivalCover, type FestivalCover } from '@/lib/festivalImages';

const BASE_URL = 'https://getfestiwise.com';
const festivals = rawFestivals as Festival[];

interface Props {
  params: Promise<{ hash: string }>;
}

function decodeHash(hash: string): string[] | null {
  try {
    const decoded = Buffer.from(decodeURIComponent(hash), 'base64').toString('utf-8');
    const ids = JSON.parse(decoded);
    if (Array.isArray(ids) && ids.length > 0 && ids.every(id => typeof id === 'string')) {
      return ids;
    }
    return null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hash } = await params;
  const ids = decodeHash(hash);
  if (!ids) return { title: 'Festival Match Results' };

  const top = festivals.find(f => f.id === ids[0]);
  if (!top) return { title: 'Festival Match Results' };

  const title = `My top festival match is ${top.name}`;
  const description = `I just discovered my perfect festival match on FestiWise: ${top.name} in ${top.city}, ${top.country}. Take the free quiz to find yours!`;
  const cover = getFestivalCover(top.id, top.genres);
  const ogImage = cover.imageUrl ?? `${BASE_URL}/api/og/quiz-results?score=95&genre=${encodeURIComponent(top.genres[0] ?? 'electronic')}&budget=mid`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/quiz/result/${hash}`,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${top.name} festival` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function QuizResultPage({ params }: Props) {
  const { hash } = await params;
  const ids = decodeHash(hash);
  if (!ids) notFound();

  const matches = ids
    .map(id => festivals.find(f => f.id === id))
    .filter((f): f is Festival => f !== null && f !== undefined);

  if (matches.length === 0) notFound();

  const topMatch = matches[0];
  const cover: FestivalCover = getFestivalCover(topMatch.id, topMatch.genres);
  const coverImage = cover.imageUrl ?? `https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=80`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Festival Match</p>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            My top match is <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{topMatch.name}</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Matched by FestiWise &mdash; getfestiwise.com</p>
        </div>

        {/* Top match card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Hero image */}
          <div className="relative h-48 sm:h-56 w-full">
            <Image
              src={coverImage}
              alt={topMatch.name}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <div className="flex flex-wrap gap-1.5">
                {topMatch.genres.slice(0, 3).map(g => (
                  <span key={g} className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold rounded-full capitalize">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="px-5 pt-4 pb-3">
            <h2 className="text-2xl font-black text-gray-900 mb-0.5">{topMatch.name}</h2>
            <p className="text-gray-500 text-sm">{topMatch.city}, {topMatch.country} &middot; {topMatch.months.slice(0, 2).join(', ')}</p>
          </div>

          {/* Stats */}
          <div className="mx-5 mb-4 flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs">Cost</span>
              <span className="font-bold text-gray-900">${topMatch.estimated_cost_usd.min.toLocaleString()}–${topMatch.estimated_cost_usd.max.toLocaleString()}</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs">Duration</span>
              <span className="font-bold text-gray-900">{topMatch.duration_days} days</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-xs">Crowd</span>
              <span className="font-bold text-gray-900 capitalize">{topMatch.audience_size}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="px-5 pb-5 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/festival/${topMatch.id}`}
              className="flex-1 flex items-center justify-center py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-lg active:scale-95 transition-all text-sm min-h-[48px]"
            >
              View Full Details
            </Link>
          </div>
        </div>

        {/* Secondary matches */}
        {matches.length > 1 && (
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-3">Also matched</p>
            <div className="grid grid-cols-2 gap-3">
              {matches.slice(1).map((festival) => (
                <Link
                  key={festival.id}
                  href={`/festival/${festival.id}`}
                  className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{festival.name}</h3>
                  <p className="text-gray-400 text-xs">{festival.city}, {festival.country}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {festival.genres.slice(0, 2).map(g => (
                      <span key={g} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded-full capitalize">{g}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quiz CTA */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 text-center text-white shadow-xl">
          <p className="font-black text-xl mb-1">What&apos;s your festival match?</p>
          <p className="text-white/80 text-sm mb-4">Take the free 2-minute quiz and discover your perfect festival from 100+ events worldwide.</p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-purple-700 font-bold rounded-2xl hover:bg-gray-50 active:scale-95 transition-all text-sm min-h-[48px]"
          >
            Find My Festival Match
          </Link>
        </div>

        {/* Branding */}
        <p className="text-center text-xs text-gray-400">
          Matched by{' '}
          <Link href="/" className="text-purple-600 font-semibold hover:underline">
            FestiWise
          </Link>{' '}
          &mdash; getfestiwise.com
        </p>

      </div>
    </div>
  );
}
