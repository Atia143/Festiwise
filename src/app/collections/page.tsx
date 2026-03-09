import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { COLLECTIONS, getCollectionFestivals } from '@/lib/collections';
import rawFestivals from '@/data/festivals.json';
import type { Festival } from '@/types/festival';

const festivals = rawFestivals as Festival[];

export const metadata: Metadata = {
  title: 'Expert Festival Collections | FestiWise',
  description: 'Hand-curated expert collections - best sustainable festivals, luxury experiences, budget gems, family picks, underground legends, and more.',
  keywords: ['best music festivals', 'curated festival list', 'expert festival picks', 'festival collections', 'top music festivals 2026'],
  alternates: { canonical: 'https://getfestiwise.com/collections' },
  openGraph: {
    title: 'Expert Festival Collections | FestiWise',
    description: 'Hand-curated lists of the world\'s best festivals by theme, vibe, and budget.',
    url: 'https://getfestiwise.com/collections',
    type: 'website',
  },
};

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-purple-900 text-white">
        <div className="max-w-5xl mx-auto px-4 pt-16 pb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-semibold text-white/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Expert Picks
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Curated Festival<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Collections
            </span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl">
            Beyond algorithms. Our editors have hand-picked the world&apos;s finest festivals by theme, vibe, and purpose - so you can find exactly the right event for who you are.
          </p>
        </div>
      </section>

      {/* Collection grid */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-2 gap-6">
          {COLLECTIONS.map(c => {
            const count = getCollectionFestivals(c, festivals).length;
            return (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="group block rounded-2xl overflow-hidden border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-200 bg-white"
              >
                {/* Gradient header */}
                <div className={`bg-gradient-to-br ${c.headerGradient} px-6 py-8`}>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                    <span className="text-white/50 text-sm tabular-nums">{count} festivals</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white leading-tight group-hover:opacity-90 transition-opacity">
                    {c.title}
                  </h2>
                </div>

                {/* Card body */}
                <div className="px-6 py-5">
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{c.subtitle}</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-purple-600 group-hover:text-purple-800 transition-colors">
                    Explore collection
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quiz CTA */}
        <div className="mt-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Want a personalised recommendation?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Our quiz matches you to the perfect festival based on your unique music taste, budget, vibe, and travel style - in under 2 minutes.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg"
          >
            Take the Quiz
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
