import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

const GENRE_GRADIENTS: Record<string, [string, string]> = {
  electronic: ['#667eea', '#764ba2'],
  edm: ['#667eea', '#764ba2'],
  indie: ['#f093fb', '#f5576c'],
  rock: ['#4facfe', '#00f2fe'],
  pop: ['#f83600', '#f9d423'],
  hiphop: ['#2c3e50', '#4ca1af'],
  jazz: ['#3a1c71', '#d76d77'],
  classical: ['#1a1a2e', '#0f3460'],
  metal: ['#232526', '#414345'],
  folk: ['#56ab2f', '#a8e063'],
  reggae: ['#f7971e', '#ffd200'],
  country: ['#e65c00', '#f9d423'],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const festivalName = searchParams.get('festival') || 'Tomorrowland';
  const matchScore = searchParams.get('score') || '92';
  const userGenre = searchParams.get('genre') || 'Electronic';
  const userBudget = searchParams.get('budget') || '$200-500';
  const country = searchParams.get('country') || '';

  const genreKey = userGenre.toLowerCase().replace(/[\s-]/g, '');
  const [colorA, colorB] = GENRE_GRADIENTS[genreKey] ?? ['#6b21a8', '#be185d'];
  const score = parseInt(matchScore, 10);
  const isHighScore = score >= 90;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '"Inter", system-ui, sans-serif',
          background: `linear-gradient(135deg, ${colorA} 0%, ${colorB} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)', display: 'flex' }} />

        {/* Decorative circle - top right */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', display: 'flex',
        }} />
        {/* Decorative circle - bottom left */}
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', display: 'flex',
        }} />

        {/* Top bar */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '32px 48px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '34px' }}>🎪</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>FestiWise</div>
          </div>
          <div style={{
            fontSize: '16px', color: 'rgba(255,255,255,0.65)',
            background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '6px 16px',
          }}>
            getfestiwise.com
          </div>
        </div>

        {/* Main content */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          flex: 1, padding: '0 60px', gap: '18px',
        }}>
          <div style={{
            fontSize: '18px', fontWeight: '700', color: 'rgba(255,255,255,0.75)',
            letterSpacing: '4px', textTransform: 'uppercase',
          }}>
            My Perfect Festival Match
          </div>

          <div style={{
            fontSize: festivalName.length > 18 ? '58px' : '72px',
            fontWeight: '900', color: 'white', textAlign: 'center',
            lineHeight: 1.05, letterSpacing: '-2px',
            textShadow: '0 4px 24px rgba(0,0,0,0.6)',
          }}>
            {festivalName}
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            background: 'rgba(255,255,255,0.14)',
            border: '2px solid rgba(255,255,255,0.28)',
            borderRadius: '18px', padding: '16px 40px',
          }}>
            <div style={{ fontSize: '56px', fontWeight: '900', color: '#fde047', lineHeight: 1 }}>
              {matchScore}%
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'white' }}>Match Score</div>
              {isHighScore && (
                <div style={{ fontSize: '14px', color: '#fde047', fontWeight: '600' }}>Exceptional Match 🔥</div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              `🎵 ${userGenre}`,
              `💰 ${userBudget}`,
              ...(country ? [`🌍 ${country}`] : []),
            ].map(tag => (
              <div key={tag} style={{
                background: 'rgba(255,255,255,0.13)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px', padding: '10px 22px',
                color: 'white', fontSize: '22px', fontWeight: '600',
                display: 'flex',
              }}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', justifyContent: 'center',
          padding: '24px 48px 32px',
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#fde047', textAlign: 'center' }}>
            Find your match → getfestiwise.com/quiz
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
