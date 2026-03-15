import Link from 'next/link';

const FEATURED_PAIRS = [
  { slug: 'coachella-vs-tomorrowland',   a: 'Coachella',    b: 'Tomorrowland',   tagline: 'USA desert vs Belgium megafest' },
  { slug: 'coachella-vs-glastonbury',    a: 'Coachella',    b: 'Glastonbury',    tagline: 'California sun vs English countryside' },
  { slug: 'tomorrowland-vs-ultra-miami', a: 'Tomorrowland', b: 'Ultra Miami',    tagline: 'EDM royalty head-to-head' },
  { slug: 'glastonbury-vs-primavera',    a: 'Glastonbury',  b: 'Primavera Sound',tagline: 'Legends vs indie darling' },
  { slug: 'coachella-vs-burning-man',    a: 'Coachella',    b: 'Burning Man',    tagline: 'Commercial vs counterculture' },
  { slug: 'lollapalooza-chicago-vs-outside-lands', a: 'Lollapalooza', b: 'Outside Lands', tagline: 'Chicago vs San Francisco' },
];

export default function CompareShowcase() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-widest rounded-full mb-3">
              Head-to-head
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Compare top festivals
            </h2>
            <p className="text-gray-500 mt-2 text-base max-w-lg">
              Budget, genres, crowd size, vibe — every key difference, side by side.
            </p>
          </div>
          <Link
            href="/compare"
            className="hidden sm:flex items-center gap-1.5 text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors whitespace-nowrap"
          >
            All {25} comparisons
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURED_PAIRS.map(({ slug, a, b, tagline }) => (
            <Link
              key={slug}
              href={`/compare/${slug}`}
              className="group flex flex-col p-5 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{tagline}</p>
              <div className="flex items-center gap-2 flex-1">
                <span className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors text-sm">
                  {a}
                </span>
                <span className="text-purple-400 text-xs font-medium shrink-0">vs</span>
                <span className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors text-sm">
                  {b}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-purple-600 font-medium">
                See comparison
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile see all */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/compare" className="text-purple-600 font-semibold text-sm">
            See all 25 comparisons →
          </Link>
        </div>
      </div>
    </section>
  );
}
