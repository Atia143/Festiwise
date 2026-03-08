import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

const GENRE_GRADIENTS: Record<string, [string, string]> = {
  techno:     ['#0f0c29', '#302b63'],
  electronic: ['#1a1a2e', '#16213e'],
  house:      ['#c94b4b', '#4b134f'],
  trance:     ['#00b4db', '#0083b0'],
  rock:       ['#1f1c2c', '#928dab'],
  indie:      ['#d4a017', '#8B4513'],
  pop:        ['#f953c6', '#b91d73'],
  metal:      ['#232526', '#414345'],
  hiphop:     ['#373b44', '#4286f4'],
  jazz:       ['#3a1c71', '#d76d77'],
  folk:       ['#134e5e', '#71b280'],
  reggae:     ['#1d976c', '#93f9b9'],
  edm:        ['#6a3093', '#a044ff'],
  bass:       ['#0f2027', '#2c5364'],
  world:      ['#16222a', '#3a6186'],
  default:    ['#4a00e0', '#8e2de2'],
};

function getGradient(genres: string): [string, string] {
  const first = genres.split(',')[0]?.trim().toLowerCase() ?? '';
  return GENRE_GRADIENTS[first] ?? GENRE_GRADIENTS.default;
}

const VIBE_COLORS: Record<string, string> = {
  party:      '#f97316',
  luxury:     '#eab308',
  underground:'#8b5cf6',
  spiritual:  '#06b6d4',
  alternative:'#10b981',
  mainstream: '#f43f5e',
  community:  '#3b82f6',
  adventure:  '#22c55e',
  beach:      '#0ea5e9',
  intimate:   '#ec4899',
  intense:    '#ef4444',
  sustainable:'#84cc16',
};

function getVibeColor(vibe: string): string {
  return VIBE_COLORS[vibe] ?? '#a855f7';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const festival   = searchParams.get('festival') ?? 'Tomorrowland';
  const score      = parseInt(searchParams.get('score') ?? '92', 10);
  const genresRaw  = searchParams.get('genres') ?? 'electronic';
  const vibesRaw   = searchParams.get('vibes') ?? 'party,luxury';
  const budget     = searchParams.get('budget') ?? 'Mid-range';

  const genres = genresRaw.split(',').filter(Boolean).slice(0, 4);
  const vibes  = vibesRaw.split(',').filter(Boolean).slice(0, 5);
  const [colorA, colorB] = getGradient(genresRaw);

  return new ImageResponse(
    (
      <div
        style={{
          width: '540px',
          height: '960px',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(160deg, ${colorA} 0%, ${colorB} 60%, #0d0d0d 100%)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orb top-right */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '360px', height: '360px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)', display: 'flex',
        }} />
        {/* Glow orb bottom-left */}
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', display: 'flex',
        }} />

        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '36px 40px 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '28px' }}>🎪</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>FestiWise</div>
          </div>
          <div style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '5px 14px',
          }}>
            Festival DNA
          </div>
        </div>

        {/* ── Headline ─────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '48px 40px 0',
        }}>
          <div style={{
            fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.55)',
            letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px',
          }}>
            My Festival Personality
          </div>
          <div style={{
            fontSize: '44px', fontWeight: '900', color: 'white',
            textAlign: 'center', lineHeight: 1.1, letterSpacing: '-1.5px',
            textShadow: '0 4px 32px rgba(0,0,0,0.8)',
          }}>
            {festival}
          </div>
          <div style={{
            marginTop: '16px', padding: '12px 32px',
            background: 'rgba(255,255,255,0.12)',
            border: '1.5px solid rgba(255,255,255,0.22)',
            borderRadius: '50px',
            fontSize: '24px', fontWeight: '800', color: '#fde047',
          }}>
            {score}% Match
          </div>
        </div>

        {/* ── Genre pills ──────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px',
          padding: '36px 40px 0',
        }}>
          {genres.map(g => (
            <div key={g} style={{
              background: 'rgba(255,255,255,0.13)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '30px', padding: '8px 22px',
              color: 'white', fontSize: '18px', fontWeight: '600',
              textTransform: 'capitalize', display: 'flex',
            }}>
              {g}
            </div>
          ))}
        </div>

        {/* ── Vibe bars ────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', gap: '12px',
          padding: '40px 48px 0',
        }}>
          <div style={{
            fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.45)',
            letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px',
          }}>
            Your Vibe Profile
          </div>
          {vibes.map((v, i) => {
            const barWidth = 100 - i * 14;
            const color = getVibeColor(v);
            return (
              <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '100px', fontSize: '14px', fontWeight: '600',
                  color: 'rgba(255,255,255,0.75)', textTransform: 'capitalize',
                  display: 'flex',
                }}>
                  {v}
                </div>
                <div style={{
                  flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px', overflow: 'hidden', display: 'flex',
                }}>
                  <div style={{
                    width: `${barWidth}%`, height: '100%',
                    background: color,
                    borderRadius: '4px', display: 'flex',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Budget pill ──────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', justifyContent: 'center',
          padding: '36px 40px 0',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.09)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '14px', padding: '12px 28px',
            display: 'flex', gap: '8px', alignItems: 'center',
          }}>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', display: 'flex' }}>
              Budget Style
            </div>
            <div style={{ fontSize: '16px', color: 'white', fontWeight: '700', display: 'flex' }}>
              {budget}
            </div>
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: '40px', left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          zIndex: 1,
        }}>
          <div style={{
            fontSize: '22px', fontWeight: '800', color: '#fde047',
            textAlign: 'center',
          }}>
            Discover yours →
          </div>
          <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)' }}>
            getfestiwise.com/quiz
          </div>
        </div>
      </div>
    ),
    { width: 540, height: 960 }
  );
}
