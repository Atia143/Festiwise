import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city    = searchParams.get('city')    ?? 'Your City';
  const country = searchParams.get('country') ?? '';
  const count   = searchParams.get('count')   ?? '0';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0d1a0d 0%, #0d1a2e 50%, #1a0d2e 100%)',
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glows */}
        <div style={{ position: 'absolute', top: -100, left: -60, width: 400, height: 400, borderRadius: '50%', background: '#10b981', opacity: 0.15, filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: '#7c3aed', opacity: 0.18, filter: 'blur(70px)' }} />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 48px 0' }}>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 22, fontWeight: 700 }}>FestiWise</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>getfestiwise.com</span>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 48px' }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>📍</span>
            <span style={{ color: '#10b981', fontSize: 22, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
              {country || 'Music Festivals'}
            </span>
          </div>

          {/* Headline */}
          <div style={{ fontSize: city.length > 16 ? 64 : city.length > 10 ? 80 : 96, fontWeight: 900, color: '#ffffff', letterSpacing: '-3px', lineHeight: 1, marginBottom: 24 }}>
            {city}
          </div>

          {/* Count badge */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1.5px solid rgba(16,185,129,0.35)', borderRadius: 100, padding: '10px 28px', color: '#6ee7b7', fontSize: 22, fontWeight: 700 }}>
              {count} {parseInt(count) === 1 ? 'festival' : 'festivals'}
            </div>
            <div style={{ background: 'rgba(124,58,237,0.15)', border: '1.5px solid rgba(124,58,237,0.35)', borderRadius: 100, padding: '10px 28px', color: '#c4b5fd', fontSize: 22, fontWeight: 700 }}>
              2026 Guide
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ margin: '0 48px 40px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 20, fontWeight: 600 }}>Dates, cost, camping, family-friendly &amp; more</span>
          <div style={{ background: 'linear-gradient(135deg, #10b981, #7c3aed)', color: '#fff', borderRadius: 8, padding: '10px 22px', fontSize: 18, fontWeight: 700 }}>
            Browse Festivals →
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
