import type { Metadata } from 'next';
import { Suspense } from 'react';
import BucketListClient from './BucketListClient';

export const metadata: Metadata = {
  title: 'My Festival Bucket List | FestiWise',
  description: 'Your personal festival bucket list — saved festivals, total budget estimate, and easy sharing.',
  robots: { index: false },
};

export default function BucketListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
      </div>
    }>
      <BucketListClient />
    </Suspense>
  );
}
