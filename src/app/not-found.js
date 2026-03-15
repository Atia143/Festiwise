import Link from 'next/link';

const QUICK_LINKS = [
  { href: '/quiz',                   label: 'Festival Quiz',          desc: '5 questions, instant match' },
  { href: '/search',                 label: 'Search Festivals',       desc: 'Search 100+ events' },
  { href: '/festival-calendar-2026', label: 'Festival Calendar',      desc: 'All festivals by month' },
  { href: '/compare',                label: 'Compare Festivals',      desc: 'Side-by-side breakdowns' },
  { href: '/best',                   label: 'Best-Of Lists',          desc: 'EDM, rock, budget & more' },
  { href: '/music-festivals-in',     label: 'Browse by City',         desc: '85+ city pages' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center">
        {/* 404 */}
        <p className="text-8xl font-black text-white/10 leading-none mb-2">404</p>
        <h1 className="text-2xl font-black text-white mb-2">Page not found</h1>
        <p className="text-gray-400 mb-10 text-sm">
          This page got lost in the crowd. Try searching below or browse what&apos;s available.
        </p>

        {/* Search box — links to /search */}
        <form
          action="/search"
          method="get"
          className="flex gap-2 max-w-md mx-auto mb-12"
        >
          <input
            type="search"
            name="q"
            placeholder="Search festivals, cities, genres…"
            className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl text-sm hover:opacity-90 transition-all whitespace-nowrap"
          >
            Search
          </button>
        </form>

        {/* Quick links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {QUICK_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 text-left transition-all group"
            >
              <p className="text-white text-sm font-semibold group-hover:text-purple-300 transition-colors leading-tight mb-1">{l.label}</p>
              <p className="text-gray-500 text-xs">{l.desc}</p>
            </Link>
          ))}
        </div>

        {/* Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  );
}
