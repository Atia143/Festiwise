import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Extract parameters from query string
  const festivalName = searchParams.get('festival') || 'FestiWise';
  const matchScore = searchParams.get('score') || '92';
  const userGenre = searchParams.get('genre') || 'Electronic';
  const userBudget = searchParams.get('budget') || '$200-500';
  const country = searchParams.get('country') || 'Global';

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
          padding: '40px',
          textAlign: 'center',
          gap: '20px',
        }}
      >
        {/* Header */}
        <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '20px' }}>
          🎪 FestiWise
        </div>

        {/* Festival Name - Large */}
        <div style={{ fontSize: '64px', fontWeight: '900' }}>{festivalName}</div>

        {/* Match Score - Highlighted */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: '700',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '20px 40px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          }}
        >
          ⭐ {matchScore}% Match!
        </div>

        {/* Details Row */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            justifyContent: 'center',
            fontSize: '32px',
            marginTop: '20px',
          }}
        >
          <div>🎵 {userGenre}</div>
          <div>💰 {userBudget}</div>
          <div>🌍 {country}</div>
        </div>

        {/* CTA */}
        <div
          style={{
            fontSize: '40px',
            marginTop: '30px',
            fontWeight: '600',
            color: '#FFD700',
          }}
        >
          ← Tap to discover more festivals
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: '24px',
            marginTop: '20px',
            opacity: 0.8,
          }}
        >
          Share on Instagram • TikTok • Twitter
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
