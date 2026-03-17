import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const festA = searchParams.get('a') ?? 'Festival A';
  const festB = searchParams.get('b') ?? 'Festival B';
  const genreA = searchParams.get('ga') ?? '';
  const genreB = searchParams.get('gb') ?? '';

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
        {/* Glow left */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 360, height: 360, borderRadius: '50%', background: '#7c3aed', opacity: 0.2, filter: 'blur(80px)' }} />
        {/* Glow right */}
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: '#ec4899', opacity: 0.2, filter: 'blur(80px)' }} />

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 48px 0' }}>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 22, fontWeight: 700 }}>FestiWise</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>getfestiwise.com</span>
        </div>

        {/* Label */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <div style={{ background: 'rgba(124,58,237,0.2)', border: '1.5px solid rgba(124,58,237,0.4)', borderRadius: 100, padding: '8px 24px', color: 'rgba(255,255,255,0.7)', fontSize: 18, fontWeight: 600, letterSpacing: 1 }}>
            FESTIVAL COMPARISON
          </div>
        </div>

        {/* VS layout */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, padding: '0 48px' }}>
          {/* Festival A */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingRight: 48 }}>
            <div style={{ fontSize: festA.length > 18 ? 48 : festA.length > 12 ? 58 : 68, fontWeight: 900, color: '#ffffff', letterSpacing: '-2px', lineHeight: 1.05, textAlign: 'right' }}>
              {festA}
            </div>
            {genreA && (
              <div style={{ marginTop: 12, background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: 100, padding: '6px 20px', color: 'rgba(255,255,255,0.75)', fontSize: 18, fontWeight: 600 }}>
                {genreA}
              </div>
            )}
          </div>

          {/* VS badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              VS
            </div>
          </div>

          {/* Festival B */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 48 }}>
            <div style={{ fontSize: festB.length > 18 ? 48 : festB.length > 12 ? 58 : 68, fontWeight: 900, color: '#ffffff', letterSpacing: '-2px', lineHeight: 1.05, textAlign: 'left' }}>
              {festB}
            </div>
            {genreB && (
              <div style={{ marginTop: 12, background: 'rgba(236,72,153,0.25)', border: '1px solid rgba(236,72,153,0.4)', borderRadius: 100, padding: '6px 20px', color: 'rgba(255,255,255,0.75)', fontSize: 18, fontWeight: 600 }}>
                {genreB}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ margin: '0 48px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 20, fontWeight: 600 }}>Side-by-side breakdown — cost, dates, vibe &amp; more</span>
          <div style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#fff', borderRadius: 8, padding: '10px 22px', fontSize: 18, fontWeight: 700 }}>
            Compare Now →
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
