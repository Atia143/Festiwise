import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Browse 100+ Music Festivals Worldwide 2026 | FestiWise',
  description: 'Explore and filter 100+ music festivals by genre, month, region, budget, and vibe. Compare festivals side-by-side and find your perfect match.',
  alternates: { canonical: 'https://getfestiwise.com/festivals' },
  openGraph: {
    title: 'Browse 100+ Music Festivals Worldwide 2026 | FestiWise',
    description: 'Filter 100+ festivals by genre, month, region and budget. Electronic, rock, indie, jazz and more.',
    url: 'https://getfestiwise.com/festivals',
    type: 'website',
    images: [{ url: 'https://getfestiwise.com/api/og/best?slug=music&label=Music&count=100', width: 1200, height: 630 }],
  },
};

const HUBS = [
  { label: 'Best EDM',      href: '/best/edm-festivals'    },
  { label: 'Best Rock',     href: '/best/rock-festivals'   },
  { label: 'Best Budget',   href: '/best/budget-festivals' },
  { label: 'Best Camping',  href: '/best/camping-festivals'},
  { label: 'Best Europe',   href: '/best/europe-festivals' },
  { label: 'Best USA',      href: '/best/usa-festivals'    },
  { label: 'Compare',       href: '/compare'               },
  { label: 'By City',       href: '/music-festivals-in'    },
  { label: 'Calendar 2026', href: '/festival-calendar-2026'},
];

const FestivalMarketplace = dynamic(
  () => import('@/components/FestivalMarketplace'),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading festivals…</p>
        </div>
      </div>
    ),
  }
);

export default function FestivalsPage() {
  return (
    <>
      {/* Server-rendered editorial header — visible to Google */}
      <div className="bg-gray-950 text-white px-4 pt-14 pb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            100+ Music Festivals Worldwide
          </h1>
          <p className="text-gray-400 text-base max-w-2xl mb-6">
            Browse, filter, and compare every festival in the FestiWise database.
            Filter by genre, month, region, budget, camping, and more.
          </p>

          {/* Hub links — internal linking + crawlability */}
          <div className="flex flex-wrap gap-2">
            {HUBS.map(h => (
              <Link
                key={h.href}
                href={h.href}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-semibold text-gray-300 transition-all"
              >
                {h.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Festival listing with all filters */}
      <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
        <FestivalMarketplace />
      </Suspense>
    </>
  );
}
