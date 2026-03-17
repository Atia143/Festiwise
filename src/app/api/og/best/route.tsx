import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

const CATEGORY_COLORS: Record<string, string> = {
  edm:       '#7c3aed',
  rock:      '#dc2626',
  indie:     '#d97706',
  jazz:      '#0d9488',
  'hip-hop': '#f59e0b',
  world:     '#0891b2',
  afrobeats: '#ea580c',
  classical: '#3b82f6',
  budget:    '#10b981',
  camping:   '#16a34a',
  europe:    '#6366f1',
  usa:       '#ef4444',
  asia:      '#f97316',
  family:    '#ec4899',
  luxury:    '#a855f7',
  summer:    '#f59e0b',
};

function categoryColor(slug: string): string {
  return CATEGORY_COLORS[slug.toLowerCase()] ?? '#7c3aed';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug    = searchParams.get('slug')    ?? 'music';
  const label   = searchParams.get('label')   ?? 'Music';
  const count   = searchParams.get('count')   ?? '0';

  const accent = categoryColor(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0d2e 60%, #0d1a2e 100%)',
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Accent glow */}
        <div style={{ position: 'absolute', top: -100, left: -80, width: 500, height: 500, borderRadius: '50%', background: accent, opacity: 0.18, filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: accent, opacity: 0.12, filter: 'blur(60px)' }} />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 48px 0' }}>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 22, fontWeight: 700 }}>FestiWise</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>getfestiwise.com</span>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 48px' }}>
          {/* Eyebrow */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'inline-flex', background: `${accent}22`, border: `1.5px solid ${accent}44`, borderRadius: 100, padding: '8px 24px', color: 'rgba(255,255,255,0.6)', fontSize: 20, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
              Best Of 2026
            </div>
          </div>

          {/* Headline */}
          <div style={{ fontSize: label.length > 20 ? 64 : label.length > 12 ? 76 : 92, fontWeight: 900, color: '#ffffff', letterSpacing: '-2.5px', lineHeight: 1.05, marginBottom: 28 }}>
            Best {label}{'\n'}Festivals
          </div>

          {/* Count + year */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ background: `${accent}22`, border: `1.5px solid ${accent}44`, borderRadius: 100, padding: '10px 28px', color: 'rgba(255,255,255,0.8)', fontSize: 22, fontWeight: 700 }}>
              {count} curated picks
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 100, padding: '10px 28px', color: 'rgba(255,255,255,0.55)', fontSize: 22, fontWeight: 600 }}>
              FestiWise Editorial
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ margin: '0 48px 40px', background: `${accent}18`, border: `1px solid ${accent}33`, borderRadius: 14, padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 20, fontWeight: 600 }}>Ranked by cost, vibe, crowd size &amp; more</span>
          <div style={{ background: accent, color: '#fff', borderRadius: 8, padding: '10px 22px', fontSize: 18, fontWeight: 700 }}>
            See the List →
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
