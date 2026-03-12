'use client';

import { usePathname } from 'next/navigation';
import FestivalBuddy from '@/components/FestivalBuddy';
import CompareBar from '@/components/CompareBar';
import LiveMatchToast from '@/components/LiveMatchToast';

// Hide floating UI on focused funnel pages — reduces JS noise and conversion distraction
const HIDE_ON_PATHS = ['/quiz', '/pricing', '/for-festivals', '/contact'];

export default function ConditionalFloatingUI() {
  const pathname = usePathname() ?? '';
  const hidden = HIDE_ON_PATHS.some(p => pathname.startsWith(p));
  if (hidden) return null;
  return (
    <>
      <CompareBar />
      <LiveMatchToast />
      <FestivalBuddy />
    </>
  );
}
