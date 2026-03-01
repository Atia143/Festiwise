import type { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://getfestiwise.com';

interface Props {
  params: Promise<{ festivalId: string }>;
  searchParams: Promise<{ score?: string; genre?: string; budget?: string; country?: string }>;
}

function festivalIdToName(id: string): string {
  return id
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { festivalId } = await params;
  const { score = '92', genre = 'Electronic', budget = '$200-500', country = '' } = await searchParams;

  const festivalName = festivalIdToName(festivalId);

  const ogUrl = new URL(`${BASE_URL}/api/og/quiz-results`);
  ogUrl.searchParams.set('festival', festivalName);
  ogUrl.searchParams.set('score', score);
  ogUrl.searchParams.set('genre', genre);
  ogUrl.searchParams.set('budget', budget);
  if (country) ogUrl.searchParams.set('country', country);

  const title = `I matched ${score}% with ${festivalName}!`;
  const description = `I discovered ${festivalName} as my perfect ${genre} festival match on FestiWise. Find YOUR perfect festival match in 2 minutes — it's free!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: title }],
      type: 'website',
      siteName: 'FestiWise',
      url: `${BASE_URL}/share/${festivalId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl.toString()],
      creator: '@festiwise',
      site: '@festiwise',
    },
  };
}

export default async function SharePage({ params, searchParams }: Props) {
  const { festivalId } = await params;
  const { score = '92', genre = 'Electronic', budget = '$200-500', country = '' } = await searchParams;

  const festivalName = festivalIdToName(festivalId);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-pink-900 flex flex-col items-center justify-center p-6 -mt-20 pt-20">
      <div className="max-w-lg w-full mx-auto text-center">
        {/* Brand */}
        <p className="text-white/50 text-xs font-bold tracking-widest uppercase mb-8">FestiWise</p>

        {/* Friend's result card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-5">Festival Match Result</p>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 leading-tight">
            {festivalName}
          </h1>

          <div className="text-7xl font-black text-yellow-300 my-5 leading-none">
            {score}%
          </div>
          <p className="text-white/60 text-sm mb-5">Match Score</p>

          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-4 py-2 bg-white/15 rounded-full text-white text-sm font-semibold">
              🎵 {genre}
            </span>
            <span className="px-4 py-2 bg-white/15 rounded-full text-white text-sm font-semibold">
              💰 {budget}
            </span>
            {country && (
              <span className="px-4 py-2 bg-white/15 rounded-full text-white text-sm font-semibold">
                🌍 {country}
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <h2 className="text-2xl font-bold text-white mb-2">
          What's YOUR festival match?
        </h2>
        <p className="text-white/60 text-sm mb-8">
          Answer 5 quick questions and discover the perfect festival for your taste, budget, and vibe.
        </p>

        <Link
          href="/quiz"
          className="inline-block w-full px-8 py-5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-black text-lg rounded-2xl hover:scale-[1.02] transition-transform shadow-2xl"
        >
          Find My Festival Match →
        </Link>

        <p className="text-white/40 text-xs mt-4">Free · 2 minutes · 100+ festivals</p>
      </div>
    </main>
  );
}
