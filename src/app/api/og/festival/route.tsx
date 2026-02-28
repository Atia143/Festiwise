import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Extract festival details
  const name = searchParams.get('name') || 'Epic Festival';
  const genre = searchParams.get('genre') || 'Electronic';
  const country = searchParams.get('country') || 'Europe';
  const month = searchParams.get('month') || 'July';
  const price = searchParams.get('price') || '$200';

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
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
          gap: '15px',
          position: 'relative',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            fontSize: '60px',
          }}
        >
          🎸
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            fontSize: '60px',
          }}
        >
          🎤
        </div>

        {/* Festival Name */}
        <div style={{ fontSize: '72px', fontWeight: '900', marginBottom: '10px' }}>
          {name}
        </div>

        {/* Details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            fontSize: '36px',
            marginTop: '20px',
          }}
        >
          <div>🎵 {genre}</div>
          <div>📍 {country}</div>
          <div>📅 {month}</div>
          <div>💵 {price}</div>
        </div>

        {/* CTA */}
        <div
          style={{
            fontSize: '42px',
            marginTop: '30px',
            fontWeight: '700',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '15px 30px',
            borderRadius: '8px',
          }}
        >
          Discover on FestiWise
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
