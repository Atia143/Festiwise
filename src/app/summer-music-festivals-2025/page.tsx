import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Summer Music Festivals 2026 - Complete Guide to 100+ Events',
  description: 'Discover the best summer music festivals 2026! Complete guide to 100+ epic events from Coachella to Tomorrowland. Dates, tickets, lineups & insider tips.',
  keywords: 'summer music festivals 2026, music festivals summer 2026, festival season 2026, best summer festivals, festival calendar summer 2026',
  alternates: {
    canonical: 'https://getfestiwise.com/summer-music-festivals-2025',
  },
  openGraph: {
    title: 'Summer Music Festivals 2026 - Ultimate Festival Guide',
    description: 'Your complete guide to 100+ summer music festivals worldwide in 2026',
    url: 'https://getfestiwise.com/summer-music-festivals-2025',
    type: 'website',
    images: [{ url: 'https://getfestiwise.com/api/og/best?slug=summer&label=Summer&count=50', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Summer Music Festivals 2026 - Ultimate Festival Guide',
    description: 'Your complete guide to 100+ summer music festivals worldwide in 2026',
  },
};

const summerFestivals = [
  {
    name: 'Coachella',
    location: 'Indio, California',
    dates: 'April 2026',
    genre: 'Multi-Genre',
    tier: 'Legendary',
    highlight: 'The most Instagram-worthy festival with A-list artists and luxury experiences'
  },
  {
    name: 'Tomorrowland',
    location: 'Boom, Belgium',
    dates: 'July 2026',
    genre: 'Electronic',
    tier: 'World-Class',
    highlight: 'Fantasy EDM wonderland with incredible stage production'
  },
  {
    name: 'Glastonbury',
    location: 'Somerset, England',
    dates: 'June 2026',
    genre: 'Multi-Genre',
    tier: 'Legendary',
    highlight: 'The ultimate British festival experience with legendary headliners'
  },
  {
    name: 'Electric Daisy Carnival',
    location: 'Las Vegas, Nevada',
    dates: 'May 2026',
    genre: 'Electronic',
    tier: 'Epic',
    highlight: 'Under the electric sky - the largest EDM festival in North America'
  },
  {
    name: 'Rock am Ring',
    location: 'Nürburg, Germany',
    dates: 'June 2026',
    genre: 'Rock/Metal',
    tier: 'Legendary',
    highlight: 'Germany\'s biggest rock festival with massive headliners'
  },
  {
    name: 'Ultra Music Festival',
    location: 'Miami, Florida',
    dates: 'March 2026',
    genre: 'Electronic',
    tier: 'World-Class',
    highlight: 'Miami\'s premier electronic music festival'
  }
];

const monthlyGuide = {
  'March': ['Ultra Music Festival', 'SXSW', 'Winter Music Conference'],
  'April': ['Coachella', 'New Orleans Jazz Fest', 'Stagecoach'],
  'May': ['EDC Las Vegas', 'Primavera Sound', 'Movement Detroit'],
  'June': ['Glastonbury', 'Rock am Ring', 'Download Festival'],
  'July': ['Tomorrowland', 'Rolling Loud', 'Lollapalooza'],
  'August': ['Reading & Leeds', 'Sziget Festival', 'Outside Lands'],
  'September': ['Burning Man', 'Electric Zoo', 'Music Midtown']
};

const summerFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What are the best summer music festivals in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'The best summer music festivals of 2026 include Glastonbury (June, UK), Tomorrowland (July, Belgium), Rock am Ring (June, Germany), Lollapalooza (July, USA), Bonnaroo (June, USA), Outside Lands (August, USA), Reading & Leeds (August, UK), and Sziget Festival (August, Hungary). Use the FestiWise quiz to get a personalised list based on your genre, budget, and location.' } },
    { '@type': 'Question', name: 'When does summer festival season start and end?', acceptedAnswer: { '@type': 'Answer', text: 'Summer festival season typically runs from late March through early September. It begins with Ultra Music Festival (March), peaks in June-August with Glastonbury, Tomorrowland, and Bonnaroo, and closes with Reading & Leeds and Electric Zoo in late August-early September.' } },
    { '@type': 'Question', name: 'How hot is it at summer outdoor music festivals?', acceptedAnswer: { '@type': 'Answer', text: 'Temperatures vary significantly by location. Desert festivals like Coachella can reach 38°C (100°F). UK festivals like Glastonbury average 15-22°C but with frequent rain. European summer festivals in Spain and Italy typically see 25-35°C. Always check the specific forecast and pack for both heat and unexpected cold nights.' } },
    { '@type': 'Question', name: 'What should I pack for a summer music festival?', acceptedAnswer: { '@type': 'Answer', text: 'For summer festivals pack high-SPF sunscreen and reapply every 2 hours, a wide-brim hat, UV-protective sunglasses, a cooling towel, electrolyte packets, a refillable water bottle, light breathable clothing, and a light jacket for cool evenings. A portable charger and cash are also essential.' } },
  ],
};

const summerArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Summer Music Festivals 2026 — Complete Guide to 100+ Events',
  description: 'The best summer music festivals of 2026. From Glastonbury to Tomorrowland — dates, tickets, lineups, and insider tips for festival season.',
  author: { '@type': 'Organization', name: 'FestiWise', url: 'https://getfestiwise.com' },
  publisher: { '@type': 'Organization', name: 'FestiWise', url: 'https://getfestiwise.com' },
  datePublished: '2025-09-01',
  dateModified: '2026-03-17',
  url: 'https://getfestiwise.com/summer-music-festivals-2025',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://getfestiwise.com/summer-music-festivals-2025' },
};

export default function SummerMusicFestivals2025() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-pink-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(summerFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(summerArticleSchema) }} />
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 text-white overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center leading-tight">
            Summer Music Festivals 2026
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-4xl mx-auto text-center leading-relaxed">
            Your ultimate guide to 50+ epic summer music festivals! From legendary headliners to hidden gems, 
            find your perfect festival adventure this summer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/quiz"
              className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              🎯 Find My Perfect Summer Festival →
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Summer Stats */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Summer Festivals</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="text-3xl font-bold text-pink-600 mb-2">25+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">15M+</div>
              <div className="text-gray-600">Festival Goers</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">7</div>
              <div className="text-gray-600">Months of Fun</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Summer Festivals */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🌟 Must-Attend Summer Festivals 2026
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            These legendary festivals define summer festival season - from iconic headliners to unforgettable experiences.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {summerFestivals.map((festival, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {festival.tier}
                  </div>
                  <div className="text-2xl">🎪</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{festival.name}</h3>
                <div className="space-y-2 text-gray-600 mb-4">
                  <p><span className="text-orange-500">📍</span> {festival.location}</p>
                  <p><span className="text-blue-500">📅</span> {festival.dates}</p>
                  <p><span className="text-purple-500">🎵</span> {festival.genre}</p>
                </div>
                <p className="text-sm text-gray-500 italic">{festival.highlight}</p>
                <div className="mt-6">
                  <Link href="/quiz" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                    Find Similar Festivals →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Festival Guide */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            📅 Summer Festival Calendar 2026
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Plan your perfect summer festival journey - month by month guide to the best events.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(monthlyGuide).map(([month, festivals]) => (
              <div key={month} className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="text-2xl font-bold text-orange-600 mb-4">{month} 2026</h3>
                <ul className="space-y-2">
                  {festivals.map((festival, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="text-orange-500 mr-2">🎵</span>
                      {festival}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Link href="/quiz" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm">
                    Find {month} Festivals →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Planning Tips */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            ☀️ Summer Festival Success Guide
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">🎫 Ticket Strategy</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Buy early bird tickets (save 30-50%)</li>
                <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Set price alerts for festivals you want</li>
                <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Consider payment plans for expensive festivals</li>
                <li className="flex items-start"><span className="text-orange-500 mr-2">•</span>Check resale platforms closer to dates</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
              <h3 className="text-2xl font-bold text-pink-600 mb-4">🏕️ Summer Prep</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start"><span className="text-pink-500 mr-2">•</span>Pack sunscreen (SPF 30+) and hat</li>
                <li className="flex items-start"><span className="text-pink-500 mr-2">•</span>Bring portable charger and cooling towel</li>
                <li className="flex items-start"><span className="text-pink-500 mr-2">•</span>Stay hydrated - drink water between sets</li>
                <li className="flex items-start"><span className="text-pink-500 mr-2">•</span>Comfortable shoes for long days</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for Summer Festival Season?</h2>
          <p className="text-xl text-white/90 mb-8">
            Take our smart quiz to discover summer festivals that match your music taste, budget, and travel plans.
          </p>
          <Link href="/quiz" className="bg-white text-orange-600 px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl inline-block">
            Find My Perfect Summer Festival 🌞
          </Link>
        </div>
      </section>
    </div>
  );
}
