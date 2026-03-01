'use client';

import { useState, useEffect } from 'react';

interface Props {
  festivalId: string;
}

export default function FestivalViewCount({ festivalId }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Seed the random from the festivalId so it stays consistent within a session
    // but feels organic. Range: 50-150.
    const seed = festivalId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const base = 50 + (seed % 101);
    // Slight drift ±5 to feel live
    const drift = Math.floor(Math.random() * 11) - 5;
    setCount(Math.max(50, Math.min(150, base + drift)));
  }, [festivalId]);

  if (count === null) return null;

  return (
    <p className="flex items-center gap-1.5 text-xs text-white/70 mt-1.5 justify-center">
      <span className="text-orange-300">&#128293;</span>
      <span>
        <span className="font-semibold text-white">{count}</span> people viewed this today
      </span>
    </p>
  );
}
