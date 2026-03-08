'use client';

import { useSmartMatch } from '@/hooks/useSmartMatch';
import type { Festival } from '@/types/festival';

interface Props {
  festival: Festival;
  size?: 'sm' | 'md';
}

const TIER_STYLES = {
  perfect: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/30',
  great:   'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20',
  good:    'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm',
  none:    '',
};

export default function SmartMatchBadge({ festival, size = 'sm' }: Props) {
  const match = useSmartMatch(festival);
  if (!match) return null;

  const padding = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full ${padding} ${TIER_STYLES[match.tier]}`}>
      <svg className="w-2.5 h-2.5 fill-current opacity-90" viewBox="0 0 10 10">
        <path d="M5 0l1.18 3.64H10L6.91 5.9l1.18 3.64L5 7.28 1.91 9.54l1.18-3.64L0 3.64h3.82z" />
      </svg>
      {match.label}
    </span>
  );
}
