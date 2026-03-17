import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Music Festivals 2026 — Curated Lists by Category | FestiWise',
  description: 'Curated lists of the best music festivals for every taste in 2026. Best EDM, rock, jazz, family, budget, Europe, USA, and more.',
  openGraph: {
    title: 'Best Music Festivals 2026 — Curated Lists by Category',
    description: 'Find the best festivals by category: EDM, rock, budget, family, camping, summer, Europe, USA, and more.',
  },
};

const LISTS = [
  { slug: 'edm-festivals',        label: 'Best EDM Festivals',            icon: '🎛',  desc: 'Tomorrowland, Ultra, EDC, and the best electronic music events' },
  { slug: 'rock-festivals',       label: 'Best Rock Festivals',           icon: '🎸',  desc: 'Glastonbury, Rock am Ring, Download, and more' },
  { slug: 'hip-hop-festivals',    label: 'Best Hip-Hop Festivals',        icon: '🎤',  desc: 'Rolling Loud and the top rap & urban music events' },
  { slug: 'jazz-festivals',       label: 'Best Jazz Festivals',           icon: '🎷',  desc: 'Montreux, Newport, and the most prestigious jazz events' },
  { slug: 'world-music-festivals',label: 'Best World Music Festivals',    icon: '🌍',  desc: 'Afrobeat, reggae, Latin, folk — music from every culture' },
  { slug: 'summer-festivals',     label: 'Best Summer Festivals',         icon: '☀️',  desc: 'The essential June, July, and August festival calendar' },
  { slug: 'europe-festivals',     label: 'Best Festivals in Europe',      icon: '🇪🇺',  desc: 'From UK fields to Spanish beaches to Belgian farmlands' },
  { slug: 'usa-festivals',        label: 'Best Festivals in the USA',     icon: '🇺🇸',  desc: 'Coachella, Bonnaroo, Lollapalooza, and America\'s best' },
  { slug: 'budget-festivals',     label: 'Best Budget Festivals',         icon: '💸',  desc: 'World-class lineups under $300. No compromise on fun.' },
  { slug: 'luxury-festivals',     label: 'Best Luxury Festival Experiences',icon: '✨', desc: 'Glamping, VIP, and the premium festival experience' },
  { slug: 'camping-festivals',    label: 'Best Camping Festivals',        icon: '⛺',  desc: 'Pack your tent and stay for the full multi-day experience' },
  { slug: 'family-festivals',     label: 'Best Family-Friendly Festivals',icon: '👨‍👩‍👧', desc: 'Safe, fun, and musical adventures for the whole family' },
  { slug: 'small-festivals',        label: 'Best Boutique & Small Festivals',  icon: '🌿', desc: 'Intimate events with curated lineups and tight-knit vibes' },
  { slug: 'australia-festivals',    label: 'Best Festivals in Australia',      icon: '🦘', desc: 'Splendour in the Grass, Laneway, and the best Down Under' },
  { slug: 'canada-festivals',       label: 'Best Festivals in Canada',         icon: '🍁', desc: 'Osheaga, Bluesfest, and Canada\'s top music events' },
  { slug: 'latin-america-festivals',label: 'Best Festivals in Latin America',  icon: '🌎', desc: 'Rock in Rio, Lollapalooza Brazil, and the best of LATAM' },
  { slug: 'asia-pacific-festivals', label: 'Best Festivals in Asia Pacific',   icon: '🌏', desc: 'Fuji Rock, Ultra Korea, and the best across Asia & Oceania' },
];

export default function BestPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 text-white py-16 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Best Music Festivals 2026</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
          Curated lists for every taste — whether you want the biggest EDM events, the most affordable weekends, or a family-friendly adventure.
        </p>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-2xl transition-all"
        >
          Get a personalised list — 2 min quiz
        </Link>
      </section>

      {/* Lists grid */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-sm text-gray-500 mb-8">{LISTS.length} curated lists · Updated for 2026 · Worldwide coverage</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LISTS.map(l => (
            <Link
              key={l.slug}
              href={`/best/${l.slug}`}
              className="group bg-white border border-gray-100 hover:border-purple-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <span className="text-3xl mb-3 block">{l.icon}</span>
              <h2 className="font-bold text-gray-900 group-hover:text-purple-700 mb-1 transition-colors">{l.label}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{l.desc}</p>
              <span className="mt-3 inline-flex text-xs text-purple-600 font-semibold group-hover:underline">
                See the list →
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-10 text-white">
          <h2 className="text-2xl font-black mb-3">Can't decide? Take the quiz.</h2>
          <p className="text-white/80 mb-6">5 questions. Personalised results. No signup needed.</p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold rounded-2xl hover:bg-purple-50 shadow-lg transition-all"
          >
            Find My Festival — Free
          </Link>
        </div>
      </div>
    </main>
  );
}
