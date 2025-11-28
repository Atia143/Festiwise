'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import with loading fallback
const WorldClassFestivalExplorer = dynamic(
  () => import('@/components/WorldClassFestivalExplorer'),
  { 
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading Festival Explorer...</p>
        </div>
      </div>
    ),
    ssr: false // Client-side only
  }
);

export default function PremiumFestivalExplorer() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50" />}>
      <WorldClassFestivalExplorer />
    </Suspense>
  );
}
