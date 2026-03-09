import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import FestivalWorldMap from '@/components/FestivalWorldMap';

export const metadata: Metadata = {
  title: 'Global Festival Map - Explore by Region | FestiWise',
  description: 'Interactive world map of 100+ music festivals. Click any region to instantly explore festivals in North America, Europe, Asia, and beyond.',
  keywords: ['music festival map', 'world festival map', 'festival by region', 'global music festivals'],
  alternates: { canonical: 'https://getfestiwise.com/map' },
};

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-gray-400 text-sm mb-8 flex-wrap">
          <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-gray-700">Festival Map</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Global Festival Map
          </h1>
          <p className="text-gray-500 text-lg">
            100+ festivals across 9 regions. Click any bubble to explore.
          </p>
        </div>

        <FestivalWorldMap />

        {/* Quiz CTA */}
        <div className="mt-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Not sure which region is right for you?</h2>
          <p className="text-white/80 mb-6">Our quiz matches you to the perfect festival anywhere in the world.</p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg"
          >
            Find My Festival
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
