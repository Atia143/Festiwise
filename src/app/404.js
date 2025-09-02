'use client';

import { Suspense } from 'react';
import NotFound from './not-found';

// This component is used for static builds
export default function Custom404Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    }>
      <NotFound />
    </Suspense>
  );
}
