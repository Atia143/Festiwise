'use client';

import { useState, useEffect } from 'react';

export const VIEWS_KEY = 'festiwise_views';
const DAY_MS = 24 * 60 * 60 * 1000;

interface ViewEntry {
  count: number;
  last: number; // Unix ms timestamp
}

// Read the view map (exported for the Live Radar section)
export function readViewMap(): Record<string, ViewEntry> {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(VIEWS_KEY) : null;
    return raw ? (JSON.parse(raw) as Record<string, ViewEntry>) : {};
  } catch {
    return {};
  }
}

function recordView(festivalId: string) {
  try {
    const map = readViewMap();
    const prev = map[festivalId] ?? { count: 0, last: 0 };
    map[festivalId] = { count: prev.count + 1, last: Date.now() };
    localStorage.setItem(VIEWS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

// Return top N festival IDs viewed in the last 24h, sorted by view count desc
export function getRecentlyTrending(n = 3): Array<{ id: string; count: number }> {
  const map = readViewMap();
  const cutoff = Date.now() - DAY_MS;
  return Object.entries(map)
    .filter(([, v]) => v.last >= cutoff)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, n)
    .map(([id, v]) => ({ id, count: v.count }));
}

interface Props {
  festivalId: string;
}

export default function FestivalViewCount({ festivalId }: Props) {
  const [displayCount, setDisplayCount] = useState<number | null>(null);

  useEffect(() => {
    // Record this visit
    recordView(festivalId);
    // Compute a display count: real views + a seeded "global" baseline so it
    // reads more naturally to first-time visitors (real count is tracked regardless)
    const map = readViewMap();
    const real = map[festivalId]?.count ?? 1;
    const seed = festivalId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const baseline = 40 + (seed % 80); // 40-119 simulated background views
    setDisplayCount(baseline + real);
  }, [festivalId]);

  if (displayCount === null) return null;

  return (
    <p className="flex items-center gap-1.5 text-xs text-white/70 mt-1.5 justify-center">
      <span className="text-orange-300">&#128293;</span>
      <span>
        <span className="font-semibold text-white">{displayCount}</span> people viewed this today
      </span>
    </p>
  );
}
