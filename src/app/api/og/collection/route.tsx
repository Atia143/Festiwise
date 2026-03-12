import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

// Map collection slugs to actual CSS hex colours (Tailwind classes don't work in edge ImageResponse)
const GRADIENTS: Record<string, { from: string; via: string; to: string; accent: string }> = {
  'most-sustainable':    { from: '#064e3b', via: '#065f46', to: '#0f766e', accent: '#10b981' },
  'solo-traveler-best':  { from: '#1e3a8a', via: '#3730a3', to: '#4c1d95', accent: '#818cf8' },
  'budget-gems':         { from: '#92400e', via: '#9a3412', to: '#7f1d1d', accent: '#fbbf24' },
  'luxury-experiences':  { from: '#4c1d95', via: '#5b21b6', to: '#831843', accent: '#c084fc' },
  'family-adventures':   { from: '#9d174d', via: '#9f1239', to: '#9a3412', accent: '#f9a8d4' },
  'underground-legends': { from: '#0f172a', via: '#1e293b', to: '#09090b', accent: '#94a3b8' },
  'beach-summer-vibes':  { from: '#0369a1', via: '#1d4ed8', to: '#0e7490', accent: '#38bdf8' },
  'electronic-meccas':   { from: '#312e81', via: '#4c1d95', to: '#1e3a5f', accent: '#a5b4fc' },
};

const DEFAULT_GRADIENT = { from: '#3b0764', via: '#4c1d95', to: '#831843', accent: '#c084fc' };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const slug     = searchParams.get('slug')     ?? '';
  const title    = searchParams.get('title')    ?? 'Curated Festival Collection';
  const subtitle = searchParams.get('subtitle') ?? 'Hand-picked by our editorial team';
  const badge    = searchParams.get('badge')    ?? 'Editor\'s Choice';
  const count    = searchParams.get('count')    ?? '0';

  const colors = GRADIENTS[slug] ?? DEFAULT_GRADIENT;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.via} 50%, ${colors.to} 100%)`,
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orb top-right */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: colors.accent,
            opacity: 0.15,
            filter: 'blur(90px)',
          }}
        />
        {/* Glow orb bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: colors.accent,
            opacity: 0.1,
            filter: 'blur(70px)',
          }}
        />

        {/* Top bar */}
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
                background: colors.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              🎪
            </div>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 22, fontWeight: 700 }}>
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
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: `${colors.accent}30`,
              border: `1.5px solid ${colors.accent}60`,
              borderRadius: 100,
              padding: '7px 20px',
              marginBottom: 24,
              width: 'fit-content',
            }}
          >
            <span style={{ color: colors.accent, fontSize: 18, fontWeight: 700, letterSpacing: '0.5px' }}>
              {badge}  ·  {count} Festivals
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 32 ? 56 : title.length > 22 ? 66 : 76,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-1.5px',
              lineHeight: 1.08,
              marginBottom: 20,
            }}
          >
            {title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 26,
              color: 'rgba(255,255,255,0.65)',
              fontWeight: 400,
              lineHeight: 1.4,
              maxWidth: 700,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom CTA bar */}
        <div
          style={{
            margin: '0 48px 40px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 14,
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 22, fontWeight: 600 }}>
            Find your perfect festival match
          </span>
          <div
            style={{
              background: colors.accent,
              color: '#000',
              borderRadius: 8,
              padding: '10px 22px',
              fontSize: 20,
              fontWeight: 800,
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
