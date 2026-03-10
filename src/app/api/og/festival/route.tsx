import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

// Genre → accent colour
const GENRE_COLORS: Record<string, string> = {
  electronic: '#7c3aed',
  rock:        '#dc2626',
  indie:       '#d97706',
  jazz:        '#0d9488',
  country:     '#ca8a04',
  metal:       '#6b7280',
  folk:        '#16a34a',
  hiphop:      '#7c3aed',
  pop:         '#db2777',
  world:       '#0891b2',
  classical:   '#3b82f6',
  ambient:     '#6366f1',
  blues:       '#1d4ed8',
  reggae:      '#15803d',
  latin:       '#ea580c',
};

function accentColor(genre: string): string {
  const key = genre.toLowerCase().replace(/[^a-z]/g, '');
  return GENRE_COLORS[key] ?? '#7c3aed';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name     = searchParams.get('name')     ?? 'Festival';
  const genre    = searchParams.get('genre')    ?? 'Music';
  const genres   = searchParams.get('genres')   ?? genre; // comma-separated
  const country  = searchParams.get('country')  ?? '';
  const city     = searchParams.get('city')     ?? '';
  const month    = searchParams.get('month')    ?? '';
  const minCost  = searchParams.get('min')      ?? '';
  const maxCost  = searchParams.get('max')      ?? '';
  const days     = searchParams.get('days')     ?? '';

  const accent = accentColor(genre);
  const genreList = genres.split(',').slice(0, 4).map(g => g.trim());
  const location = [city, country].filter(Boolean).join(', ');
  const cost = minCost && maxCost ? `$${minCost}–$${maxCost}` : minCost ? `From $${minCost}` : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0d2e 50%, #0d1a2e 100%)',
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Accent glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: accent,
            opacity: 0.18,
            filter: 'blur(80px)',
          }}
        />
        {/* Accent glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -100,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: accent,
            opacity: 0.12,
            filter: 'blur(60px)',
          }}
        />

        {/* Top bar — FestiWise brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '32px 48px 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              🎪
            </div>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
              FestiWise
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 18 }}>
            getfestiwise.com
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 48px',
          }}
        >
          {/* Festival name */}
          <div
            style={{
              fontSize: name.length > 24 ? 62 : name.length > 16 ? 74 : 86,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-2px',
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            {name}
          </div>

          {/* Genre pills */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
            {genreList.map((g) => (
              <div
                key={g}
                style={{
                  background: `${accent}33`,
                  border: `1.5px solid ${accent}66`,
                  color: 'rgba(255,255,255,0.85)',
                  borderRadius: 100,
                  padding: '6px 18px',
                  fontSize: 20,
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {g}
              </div>
            ))}
          </div>

          {/* Meta row */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>📍</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 24, fontWeight: 500 }}>{location}</span>
              </div>
            )}
            {month && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>📅</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 24, fontWeight: 500 }}>{month}</span>
              </div>
            )}
            {days && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>⏱</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 24, fontWeight: 500 }}>{days} days</span>
              </div>
            )}
            {cost && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>💰</span>
                <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 24, fontWeight: 500 }}>{cost}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA bar */}
        <div
          style={{
            margin: '0 48px 40px',
            background: `${accent}22`,
            border: `1px solid ${accent}44`,
            borderRadius: 14,
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 22, fontWeight: 600 }}>
            Find your perfect festival match
          </span>
          <div
            style={{
              background: accent,
              color: '#fff',
              borderRadius: 8,
              padding: '10px 22px',
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            Take the Free Quiz →
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
