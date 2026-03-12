import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Browse 100+ Music Festivals Worldwide',
  description: 'Explore and filter 100+ music festivals by genre, month, region, budget, and vibe. Compare festivals side-by-side and find your perfect match.',
  alternates: { canonical: 'https://getfestiwise.com/festivals' },
  openGraph: {
    title: 'Browse Music Festivals | FestiWise',
    description: 'Filter 100+ festivals by genre, month, region and budget. Electronic, rock, indie, jazz and more.',
    url: 'https://getfestiwise.com/festivals',
    type: 'website',
  },
};

const FestivalMarketplace = dynamic(
  () => import('@/components/FestivalMarketplace'),
  {
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading Festival Marketplace...</p>
        </div>
      </div>
    ),
  }
);

export default function FestivalsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50" />}>
      <FestivalMarketplace />
    </Suspense>
  );
}
