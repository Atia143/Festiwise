import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = {
  title: 'Search Music Festivals 2026 | FestiWise',
  description: 'Search and filter 100+ music festivals worldwide. Filter by genre, country, month, and budget. Find the perfect festival for you.',
  openGraph: {
    title: 'Search Music Festivals 2026 | FestiWise',
    description: 'Search and filter 100+ music festivals worldwide by genre, country, month, and budget.',
  },
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchClient />
    </Suspense>
  );
}
