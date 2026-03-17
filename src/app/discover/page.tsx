import Link from 'next/link';
import { Flame, Compass, Gem, Calendar, MapPin, Music } from 'lucide-react';
import FestivalRadar from '@/components/FestivalRadar';
import festivalsData from '@/data/festivals.json';

export const metadata = {
  title: 'Discover Festivals — Trending, Hidden Gems & Editorial Picks | FestiWise',
  description: 'Explore trending festivals, hidden gems, and curated picks across 100+ global events. Browse by genre, season, or mood.',
};

interface Festival {
  id: string;
  name: string;
  city: string;
  country: string;
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  audience_size: string;
  months: string[];
}

const GENRES = [
  { label: 'EDM',        slug: 'edm',       color: 'from-purple-600 to-blue-600'  },
  { label: 'Rock',       slug: 'rock',      color: 'from-red-600 to-orange-600'   },
  { label: 'Indie',      slug: 'indie',     color: 'from-green-500 to-teal-600'   },
  { label: 'Jazz',       slug: 'jazz',      color: 'from-blue-500 to-indigo-600'  },
  { label: 'Hip-Hop',    slug: 'hip-hop',   color: 'from-yellow-500 to-orange-600'},
  { label: 'World',      slug: 'world',     color: 'from-green-600 to-emerald-600'},
  { label: 'Afrobeats',  slug: 'afrobeats', color: 'from-orange-500 to-red-500'   },
  { label: 'Classical',  slug: 'classical', color: 'from-indigo-500 to-purple-600'},
];

const SEASONS = [
  { label: 'Spring', months: ['March','April','May'],            emoji: '🌸' },
  { label: 'Summer', months: ['June','July','August'],           emoji: '☀️' },
  { label: 'Autumn', months: ['September','October','November'], emoji: '🍂' },
  { label: 'Winter', months: ['December','January','February'],  emoji: '❄️' },
];

function getHiddenGems(festivals: Festival[]): Festival[] {
  return festivals
    .filter(f => f.audience_size === 'small' || f.audience_size === 'medium')
    .sort((a, b) => a.estimated_cost_usd.min - b.estimated_cost_usd.min)
    .slice(0, 6);
}

function festivalsByMonth(festivals: Festival[], months: string[]): number {
  return festivals.filter(f => f.months.some((m: string) => months.includes(m))).length;
}

export default function DiscoverPage() {
  const festivals = festivalsData as Festival[];
  const hiddenGems = getHiddenGems(festivals);

  return (
    <div className="min-h-screen bg-white">

      {/* Editorial header */}
      <div className="bg-gray-950 text-white px-4 pt-16 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">Discover</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Find your next festival.
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Trending now, hidden gems, genre guides, and seasonal picks — all in one place.
          </p>

          {/* Quick jump links */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { label: 'Trending',     href: '#trending',     icon: Flame    },
              { label: 'Hidden Gems',  href: '#hidden-gems',  icon: Gem      },
              { label: 'By Genre',     href: '#by-genre',     icon: Music    },
              { label: 'By Season',    href: '#by-season',    icon: Calendar },
            ].map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-semibold text-gray-300 transition-all"
              >
                <Icon className="w-3 h-3" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FestivalRadar — Trending + For You + Pro Tips + Map */}
      <div id="trending">
        <FestivalRadar />
      </div>

      {/* Hidden Gems */}
      <section id="hidden-gems" className="bg-gray-950 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Gem className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Hidden Gems</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Under the radar.</h2>
          <p className="text-gray-500 text-sm mb-8">Smaller festivals with outsized experiences. Low crowds, lower cost.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hiddenGems.map(f => (
              <Link
                key={f.id}
                href={`/festival/${f.id}`}
                className="group block bg-white/[0.04] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors">
                      {f.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {f.city}, {f.country}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full whitespace-nowrap">
                    From ${f.estimated_cost_usd.min}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {f.genres.slice(0, 3).map(g => (
                    <span key={g} className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-semibold rounded-full capitalize">
                      {g}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/best/budget"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-white/20 text-gray-300 text-sm font-semibold rounded-xl transition-all"
            >
              See all budget festivals →
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Genre */}
      <section id="by-genre" className="py-14 px-4 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600 text-xs font-bold uppercase tracking-widest">Browse by Genre</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Find festivals by sound.</h2>
          <p className="text-gray-400 text-sm mb-8">Pick a genre to see all matching festivals and editorial picks.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GENRES.map(g => (
              <Link
                key={g.slug}
                href={`/best/${g.slug}`}
                className={`group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${g.color} text-white hover:scale-[1.02] active:scale-[0.98] transition-all`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <p className="relative font-black text-base">{g.label}</p>
                <p className="relative text-white/60 text-xs mt-0.5">Festivals →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Season */}
      <section id="by-season" className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Browse by Season</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">When do you want to go?</h2>
          <p className="text-gray-400 text-sm mb-8">See the full calendar for a month-by-month breakdown.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SEASONS.map(s => {
              const count = festivalsByMonth(festivals, s.months);
              return (
                <Link
                  key={s.label}
                  href="/festival-calendar-2026"
                  className="group block bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl p-6 text-center transition-all"
                >
                  <div className="text-3xl mb-3">{s.emoji}</div>
                  <p className="font-black text-gray-900 mb-1">{s.label}</p>
                  <p className="text-gray-400 text-xs">{count} festivals</p>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/festival-calendar-2026"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all"
            >
              Full 2026 Calendar →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
