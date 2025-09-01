import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import rawFestivals from '@/data/festivals.json';
import type { Festival } from '@/utils/match';
import SimpleNewsletterForm from '@/components/Newsletter/SimpleNewsletterForm';

const festivals = rawFestivals as Festival[];

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const festival = festivals.find(f => f.id === id);
  
  if (!festival) {
    return {
      title: 'Festival Not Found',
      description: 'The requested festival could not be found.'
    };
  }

  const title = `${festival.name} ${new Date().getFullYear()} - Festival Guide`;
  const description = `Everything you need to know about ${festival.name} in ${festival.city}, ${festival.country}. Find dates, tickets, accommodation, and more.`;

  return {
    title,
    description,
    keywords: [festival.name, 'music festival', ...festival.genres, festival.country, festival.city],
    openGraph: {
      title,
      description,
      url: `https://festiwise.com/festival/${festival.id}`,
      type: 'article',
      images: [
        {
          url: `/festivals/${festival.id}.jpg`,
          width: 1200,
          height: 630,
          alt: `${festival.name} Festival`
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/festivals/${festival.id}.jpg`],
    },
    alternates: {
      canonical: `https://festiwise.com/festival/${festival.id}`,
    }
  };
}

export default async function FestivalPage({ params }: Props) {
  const { id } = await params;
  const festival = festivals.find(f => f.id === id);

  if (!festival) {
    return notFound();
  }

  // Helper function to get region from country
  function getRegion(country: string) {
    const europe = [
      "Belgium","France","Germany","UK","Netherlands","Spain","Portugal","Italy","Poland","Czechia","Hungary","Croatia","Serbia","Sweden","Norway","Finland","Denmark","Switzerland","Austria","Ireland"
    ];
    const usa = ["USA", "United States", "United States of America"];
    if (europe.includes(country)) return "europe";
    if (usa.includes(country)) return "usa";
    if (["Japan","China","Israel"].includes(country)) return "asia";
    return "other";
  }

  const region = getRegion(festival.country);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black text-white pb-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-400 py-20 px-4 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
            {festival.name}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2">
            {festival.city}, {festival.country}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/80 mb-6">
            <span className="flex items-center gap-1">
              📅 {festival.months.join(', ')}
            </span>
            <span className="flex items-center gap-1">
              ⏱️ {festival.duration_days} days
            </span>
            <span className="flex items-center gap-1">
              👥 {festival.audience_size}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {festival.genres.map(genre => (
              <span key={genre} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {(festival as any).ticket_official_url && (
              <a
                href={(festival as any).ticket_official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform"
              >
                🎫 Get Tickets
              </a>
            )}
            {festival.website && (
              <a
                href={festival.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors"
              >
                🌐 Official Website
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Festival Details */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Key Info Card */}
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8 border-4 border-purple-300">
            <h2 className="text-3xl font-bold text-purple-900 mb-6">Festival Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-purple-100">
                <span className="font-semibold text-gray-700">Budget Range:</span>
                <span className="text-purple-800 font-bold">${festival.estimated_cost_usd.min} - ${festival.estimated_cost_usd.max}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-100">
                <span className="font-semibold text-gray-700">Duration:</span>
                <span className="text-purple-800">{festival.duration_days} days</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-100">
                <span className="font-semibold text-gray-700">Audience Size:</span>
                <span className="text-purple-800 capitalize">{festival.audience_size}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-100">
                <span className="font-semibold text-gray-700">Family Friendly:</span>
                <span className={`font-semibold ${festival.family_friendly ? 'text-green-600' : 'text-red-600'}`}>
                  {festival.family_friendly ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-100">
                <span className="font-semibold text-gray-700">Camping:</span>
                <span className={`font-semibold ${festival.camping ? 'text-green-600' : 'text-red-600'}`}>
                  {festival.camping ? '🏕️ Available' : '🚫 Not Available'}
                </span>
              </div>
              {festival.glamping && (
                <div className="flex justify-between items-center py-2 border-b border-purple-100">
                  <span className="font-semibold text-gray-700">Glamping:</span>
                  <span className="text-green-600 font-semibold">✨ Available</span>
                </div>
              )}
              {(festival as any).min_age && (
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold text-gray-700">Minimum Age:</span>
                  <span className="text-purple-800">{(festival as any).min_age}+</span>
                </div>
              )}
            </div>
          </div>

          {/* Vibe & Atmosphere */}
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8 border-4 border-pink-300">
            <h2 className="text-3xl font-bold text-pink-900 mb-6">Vibe & Atmosphere</h2>
            <div className="space-y-6">
              {festival.vibe && festival.vibe.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Festival Vibe:</h3>
                  <div className="flex flex-wrap gap-2">
                    {festival.vibe.map(v => (
                      <span key={v} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {festival.weather_profile && festival.weather_profile.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Expected Weather:</h3>
                  <div className="flex flex-wrap gap-2">
                    {festival.weather_profile.map(weather => (
                      <span key={weather} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {weather}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Music Genres:</h3>
                <div className="flex flex-wrap gap-2">
                  {festival.genres.map(genre => (
                    <span key={genre} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Similar Festivals */}
      <section className="max-w-5xl mx-auto px-4 mt-20">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 border-4 border-yellow-300">
          <h2 className="text-3xl font-bold text-yellow-900 mb-6 text-center">Find More Festivals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href={`/best/${region}`}
              className="block p-6 bg-yellow-100 rounded-xl text-center hover:bg-yellow-200 transition-colors"
            >
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">More in {festival.country}</h3>
              <p className="text-yellow-700">Explore other festivals in this region</p>
            </Link>
            
            <Link
              href="/quiz"
              className="block p-6 bg-purple-100 rounded-xl text-center hover:bg-purple-200 transition-colors"
            >
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Take Our Quiz</h3>
              <p className="text-purple-700">Get personalized festival recommendations</p>
            </Link>
            
            {festival.months.length > 0 && (
              <Link
                href={`/best/${region}/${festival.months[0].toLowerCase()}`}
                className="block p-6 bg-pink-100 rounded-xl text-center hover:bg-pink-200 transition-colors"
              >
                <h3 className="text-lg font-semibold text-pink-800 mb-2">Same Month</h3>
                <p className="text-pink-700">Other festivals in {festival.months[0]}</p>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Banner */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <SimpleNewsletterForm />
      </section>
    </div>
  );
}
