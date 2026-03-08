'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, ArrowRight } from 'lucide-react';
import rawFestivals from '@/data/festivals.json';
import type { Festival } from '@/types/festival';

const allFestivals = rawFestivals as Festival[];

// ── Region data — approximate geographic centroids on a 1000×500 canvas ────────
interface Region {
  id: string;
  label: string;
  cx: number;   // x in SVG units
  cy: number;   // y in SVG units
  color: string;
  glowColor: string;
}

const REGIONS: Region[] = [
  { id: 'North-America',    label: 'North America',   cx: 180, cy: 155, color: '#7c3aed', glowColor: 'rgba(124,58,237,0.35)' },
  { id: 'Central-America',  label: 'Central America', cx: 210, cy: 240, color: '#db2777', glowColor: 'rgba(219,39,119,0.35)' },
  { id: 'South-America',    label: 'South America',   cx: 255, cy: 335, color: '#16a34a', glowColor: 'rgba(22,163,74,0.35)' },
  { id: 'Western-Europe',   label: 'Western Europe',  cx: 460, cy: 140, color: '#2563eb', glowColor: 'rgba(37,99,235,0.35)' },
  { id: 'Northern-Europe',  label: 'Northern Europe', cx: 490, cy: 88,  color: '#0891b2', glowColor: 'rgba(8,145,178,0.35)' },
  { id: 'Eastern-Europe',   label: 'Eastern Europe',  cx: 540, cy: 145, color: '#9333ea', glowColor: 'rgba(147,51,234,0.35)' },
  { id: 'Asia',             label: 'Asia',            cx: 700, cy: 175, color: '#dc2626', glowColor: 'rgba(220,38,38,0.35)' },
  { id: 'Asia-Pacific',     label: 'Asia Pacific',    cx: 820, cy: 285, color: '#ea580c', glowColor: 'rgba(234,88,12,0.35)' },
  { id: 'Oceania',          label: 'Oceania',         cx: 840, cy: 385, color: '#65a30d', glowColor: 'rgba(101,163,13,0.35)' },
];

// ── Simplified continent outlines (very approximate decorative paths) ──────────
const LANDMASSES = [
  // North & Central America
  { d: 'M120,80 C140,70 200,75 240,110 C260,130 270,160 250,200 C240,230 225,250 210,260 C195,275 185,290 185,310 C175,305 160,285 150,260 C130,220 100,180 95,150 C90,120 105,90 120,80 Z', fill: '#e5e7eb' },
  // South America
  { d: 'M195,270 C215,265 250,275 265,300 C285,330 290,365 280,395 C265,420 240,430 220,425 C200,418 185,400 180,375 C175,350 178,320 190,300 C192,290 193,280 195,270 Z', fill: '#e5e7eb' },
  // Europe & part of Africa
  { d: 'M420,60 C450,55 510,65 550,85 C580,100 590,130 580,160 C570,185 545,195 520,200 C490,205 455,195 435,175 C415,155 408,125 412,100 C413,82 416,68 420,60 Z', fill: '#e5e7eb' },
  // Africa
  { d: 'M430,205 C455,200 495,210 515,235 C540,265 545,310 535,350 C520,390 490,415 460,420 C435,422 415,408 405,385 C390,355 395,310 405,275 C415,245 425,215 430,205 Z', fill: '#e5e7eb' },
  // Asia
  { d: 'M555,60 C610,50 700,55 770,85 C830,110 865,155 855,200 C845,240 800,265 750,270 C700,275 645,260 600,235 C560,215 530,185 530,155 C530,115 548,72 555,60 Z', fill: '#e5e7eb' },
  // Southeast Asia / Pacific
  { d: 'M780,230 C810,220 850,235 870,260 C890,285 890,320 875,345 C858,370 830,378 805,370 C778,362 760,340 758,315 C756,290 765,248 780,230 Z', fill: '#e5e7eb' },
  // Australia
  { d: 'M790,355 C820,345 860,350 880,375 C900,398 898,430 882,450 C862,472 830,475 808,462 C785,448 775,420 778,398 C780,378 782,360 790,355 Z', fill: '#e5e7eb' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function FestivalWorldMap() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const festivalsByRegion = useMemo(() => {
    const map = new Map<string, Festival[]>();
    for (const f of allFestivals) {
      if (!f.region || f.status !== 'active') continue;
      if (!map.has(f.region)) map.set(f.region, []);
      map.get(f.region)!.push(f);
    }
    return map;
  }, []);

  const activeFestivals = activeRegion ? (festivalsByRegion.get(activeRegion) ?? []) : [];
  const activeRegionData = REGIONS.find(r => r.id === activeRegion);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">World Festival Map</h2>
          <p className="text-sm text-gray-500 mt-0.5">Click any region to explore its festivals</p>
        </div>
        {activeRegion && (
          <button
            onClick={() => setActiveRegion(null)}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* SVG Map */}
        <div className="flex-1 p-4">
          <svg
            viewBox="0 0 1000 500"
            className="w-full"
            style={{ maxHeight: '360px' }}
            aria-label="Interactive world festival map"
          >
            {/* Ocean background */}
            <rect width="1000" height="500" fill="#f0f9ff" rx="12" />

            {/* Grid lines (longitude/latitude feel) */}
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(x => (
              <line key={`v${x}`} x1={x} y1={0} x2={x} y2={500} stroke="#e0f2fe" strokeWidth={0.5} />
            ))}
            {[100, 200, 300, 400].map(y => (
              <line key={`h${y}`} x1={0} y1={y} x2={1000} y2={y} stroke="#e0f2fe" strokeWidth={0.5} />
            ))}

            {/* Landmasses */}
            {LANDMASSES.map((lm, i) => (
              <path key={i} d={lm.d} fill={lm.fill} stroke="#d1d5db" strokeWidth={0.5} />
            ))}

            {/* Region bubbles */}
            {REGIONS.map(r => {
              const count = festivalsByRegion.get(r.id)?.length ?? 0;
              if (count === 0) return null;
              const isActive = activeRegion === r.id;
              const radius = Math.max(22, Math.min(38, 18 + count * 2.5));

              return (
                <g
                  key={r.id}
                  onClick={() => setActiveRegion(isActive ? null : r.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Pulse ring */}
                  {isActive && (
                    <circle
                      cx={r.cx} cy={r.cy} r={radius + 12}
                      fill={r.glowColor}
                      stroke={r.color}
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                    />
                  )}
                  {/* Glow */}
                  <circle cx={r.cx} cy={r.cy} r={radius + 6} fill={r.glowColor} />
                  {/* Main circle */}
                  <circle
                    cx={r.cx} cy={r.cy} r={radius}
                    fill={isActive ? r.color : 'white'}
                    stroke={r.color}
                    strokeWidth={isActive ? 0 : 2}
                  />
                  {/* Count */}
                  <text
                    x={r.cx} y={r.cy - 3}
                    textAnchor="middle" fontSize={13} fontWeight="800"
                    fill={isActive ? 'white' : r.color}
                    fontFamily="system-ui, sans-serif"
                  >
                    {count}
                  </text>
                  <text
                    x={r.cx} y={r.cy + 11}
                    textAnchor="middle" fontSize={7} fontWeight="600"
                    fill={isActive ? 'rgba(255,255,255,0.8)' : r.color}
                    fontFamily="system-ui, sans-serif"
                  >
                    festivals
                  </text>
                  {/* Label below */}
                  <text
                    x={r.cx} y={r.cy + radius + 14}
                    textAnchor="middle" fontSize={9} fontWeight={isActive ? '700' : '500'}
                    fill={isActive ? r.color : '#6b7280'}
                    fontFamily="system-ui, sans-serif"
                  >
                    {r.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Sidebar — festival list for selected region */}
        <AnimatePresence mode="wait">
          {activeRegion && activeFestivals.length > 0 && (
            <motion.div
              key={activeRegion}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.22 }}
              className="lg:w-72 border-t lg:border-t-0 lg:border-l border-gray-100"
            >
              <div
                className="px-4 py-3 text-white text-sm font-bold"
                style={{ background: activeRegionData?.color }}
              >
                {activeRegionData?.label} — {activeFestivals.length} Festivals
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: '340px' }}>
                {activeFestivals.map(f => (
                  <Link
                    key={f.id}
                    href={`/festival/${f.id}`}
                    className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-purple-50/60 transition-colors group"
                  >
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                        {f.name}
                      </div>
                      <div className="text-xs text-gray-400">{f.city} · {f.months.slice(0, 2).join(' & ')}</div>
                      <div className="text-xs text-gray-500 mt-0.5">${f.estimated_cost_usd.min.toLocaleString()}+</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-500 flex-shrink-0 mt-0.5 transition-colors" />
                  </Link>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100">
                <Link
                  href={`/discover?region=${encodeURIComponent(activeRegion)}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  All {activeRegionData?.label} festivals
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
