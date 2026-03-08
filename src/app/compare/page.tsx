import type { Metadata } from 'next';
import { Suspense } from 'react';
import ComparePageClient from './ComparePageClient';

export const metadata: Metadata = {
  title: 'Compare Festivals Side-by-Side | FestiWise',
  description: 'Compare up to 3 music festivals side-by-side. See price ranges, crowd sizes, vibes, genres and more — all in one view.',
  robots: { index: false },
};

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
      </div>
    }>
      <ComparePageClient />
    </Suspense>
  );
}
