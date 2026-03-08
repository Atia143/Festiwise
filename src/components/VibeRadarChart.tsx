'use client';

import type { Festival } from '@/types/festival';

interface Props {
  festival: Festival;
}

// ── Dimension calculators ──────────────────────────────────────────────────────
function calcEnergy(f: Festival): number {
  const HIGH_VIBES = new Set(['party', 'intense', 'underground', 'urban', 'alternative', 'fantasy']);
  const LOW_VIBES  = new Set(['spiritual', 'ambient', 'intimate', 'community']);
  let score = 50;
  for (const v of f.vibe) {
    if (HIGH_VIBES.has(v)) score += 12;
    if (LOW_VIBES.has(v)) score -= 8;
  }
  if (f.audience_size === 'massive') score += 15;
  if (f.audience_size === 'large') score += 8;
  if (f.audience_size === 'small') score -= 10;
  return Math.min(100, Math.max(10, score));
}

function calcCrowdScale(f: Festival): number {
  const map: Record<string, number> = { small: 20, medium: 48, large: 75, massive: 100 };
  return map[f.audience_size] ?? 50;
}

function calcLuxury(f: Festival): number {
  let score = 30;
  if (f.vibe.includes('luxury')) score += 35;
  if (f.vibe.includes('themed')) score += 10;
  if (f.vibe.includes('mainstream')) score += 8;
  if (f.glamping) score += 20;
  if (!f.camping) score += 15; // hotel-style crowd
  if (f.estimated_cost_usd.min > 1500) score += 15;
  if (f.estimated_cost_usd.min > 800) score += 8;
  return Math.min(100, Math.max(5, score));
}

function calcMusicVariety(f: Festival): number {
  const base = Math.min(f.genres.length * 18, 90);
  const vibeBonus = f.vibe.includes('cultural') || f.vibe.includes('world') ? 10 : 0;
  return Math.min(100, base + vibeBonus);
}

function calcValueScore(f: Festival): number {
  // High value = more duration per dollar
  const daysPerDollar = f.duration_days / (f.estimated_cost_usd.min || 1);
  const normalized = Math.min(daysPerDollar * 600, 90);
  return Math.max(10, Math.round(normalized));
}

// ── Radar maths ────────────────────────────────────────────────────────────────
const SIZE  = 220;
const CX    = SIZE / 2;
const CY    = SIZE / 2;
const OUTER = 85;

function polar(angle: number, r: number): [number, number] {
  const rad = (angle - 90) * (Math.PI / 180);
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}

function toPath(points: [number, number][]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z';
}

const DIMS = [
  { key: 'Energy',        angle: 0   },
  { key: 'Crowd Scale',   angle: 72  },
  { key: 'Luxury',        angle: 144 },
  { key: 'Music Variety', angle: 216 },
  { key: 'Value',         angle: 288 },
] as const;

const GRID_STEPS = [0.25, 0.5, 0.75, 1];
const HEX_LABEL_RADIUS = OUTER + 22;

// ── Component ─────────────────────────────────────────────────────────────────
export default function VibeRadarChart({ festival }: Props) {
  const scores = [
    calcEnergy(festival),
    calcCrowdScale(festival),
    calcLuxury(festival),
    calcMusicVariety(festival),
    calcValueScore(festival),
  ];

  const dataPoints = DIMS.map((d, i) => polar(d.angle, (scores[i] / 100) * OUTER));
  const dataPath   = toPath(dataPoints);

  const gridPaths = GRID_STEPS.map(step => {
    const pts = DIMS.map(d => polar(d.angle, step * OUTER));
    return toPath(pts);
  });

  const axisLines = DIMS.map(d => {
    const [x, y] = polar(d.angle, OUTER);
    return { x, y };
  });

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Vibe Radar</h2>
      <p className="text-xs text-gray-400 mb-4">5-dimension festival personality</p>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Radar */}
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          width={SIZE}
          height={SIZE}
          aria-label={`Vibe radar chart for ${festival.name}`}
          className="flex-shrink-0"
        >
          {/* Grid rings */}
          {gridPaths.map((path, i) => (
            <path
              key={i}
              d={path}
              fill="none"
              stroke={i === GRID_STEPS.length - 1 ? '#d1d5db' : '#e5e7eb'}
              strokeWidth={i === GRID_STEPS.length - 1 ? 1.5 : 0.75}
            />
          ))}

          {/* Axis lines */}
          {axisLines.map((pt, i) => (
            <line
              key={i}
              x1={CX} y1={CY}
              x2={pt.x} y2={pt.y}
              stroke="#e5e7eb"
              strokeWidth={0.75}
            />
          ))}

          {/* Data area */}
          <path
            d={dataPath}
            fill="url(#radarGrad)"
            fillOpacity={0.35}
            stroke="url(#radarStroke)"
            strokeWidth={2}
            strokeLinejoin="round"
          />

          {/* Data points */}
          {dataPoints.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={3.5} fill="#9333ea" stroke="#fff" strokeWidth={1.5} />
          ))}

          {/* Axis labels */}
          {DIMS.map((d, i) => {
            const [lx, ly] = polar(d.angle, HEX_LABEL_RADIUS);
            const anchor =
              lx < CX - 5 ? 'end' : lx > CX + 5 ? 'start' : 'middle';
            const dy = ly < CY - 5 ? '-0.3em' : ly > CY + 5 ? '1em' : '0.35em';
            return (
              <text
                key={i}
                x={lx}
                y={ly}
                textAnchor={anchor}
                dy={dy}
                fontSize={9.5}
                fontWeight={600}
                fill="#6b7280"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {d.key}
              </text>
            );
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
          </defs>
        </svg>

        {/* Score legend */}
        <div className="flex-1 w-full space-y-3">
          {DIMS.map((d, i) => (
            <div key={d.key}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-gray-700">{d.key}</span>
                <span className="text-gray-500 tabular-nums">{scores[i]}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                  style={{ width: `${scores[i]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
