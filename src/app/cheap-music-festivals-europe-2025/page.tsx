import { Metadata } from 'next';
import Link from 'next/link';
import GuidePageSchema from '@/components/SEO/GuidePageSchema';

export const metadata: Metadata = {
  title: 'Cheap Music Festivals Europe 2025 - Best Budget Festival Guide',
  description: 'Discover 25+ affordable music festivals across Europe under €200! Complete guide to cheap festivals in Germany, UK, Spain, Netherlands & more.',
  keywords: 'cheap music festivals europe, budget festivals, affordable festivals europe, music festivals under 200 euros, festival deals europe',
  alternates: {
    canonical: 'https://getfestiwise.com/cheap-music-festivals-europe-2025'
  },
  openGraph: {
    title: 'Cheap Music Festivals Europe 2025 - Budget Guide',
    description: 'Find amazing music festivals across Europe for under €200',
    url: 'https://getfestiwise.com/cheap-music-festivals-europe-2025',
    type: 'website',
    images: [
      {
        url: 'https://getfestiwise.com/api/og/cheap-festivals-europe',
        width: 1200,
        height: 630,
        alt: 'Cheap Music Festivals Europe 2025'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cheap Music Festivals Europe 2025 - Budget Guide',
    description: 'Find amazing music festivals across Europe for under €200'
  }
};

const budgetFestivals = [
  {
    name: 'Pohoda Festival',
    location: 'Slovakia',
    price: '€89',
    dates: 'July 10-13, 2025',
    genre: 'Multi-Genre',
    highlights: ['Incredible value', 'Diverse lineup', 'Beautiful setting'],
    why: 'One of Europe\'s best value festivals with international acts and local charm.',
    accommodation: 'Camping included',
    food: '€20-30/day'
  },
  {
    name: 'INmusic Festival',
    location: 'Zagreb, Croatia',
    price: '€120',
    dates: 'June 23-25, 2025',
    genre: 'Rock & Alternative',
    highlights: ['Jarun Lake setting', 'Great headliners', 'Affordable city'],
    why: 'Premium lineup at budget prices in beautiful Zagreb.',
    accommodation: 'Hotels from €30/night',
    food: '€15-25/day'
  },
  {
    name: 'Volt Festival',
    location: 'Sopron, Hungary',
    price: '€150',
    dates: 'June 25-28, 2025',
    genre: 'Electronic & Pop',
    highlights: ['Castle backdrop', 'Electronic focus', 'Great weather'],
    why: 'Electronic music paradise with historic castle views.',
    accommodation: 'Camping €40 total',
    food: '€20-30/day'
  },
  {
    name: 'Colours of Ostrava',
    location: 'Czech Republic',
    price: '€160',
    dates: 'July 16-19, 2025',
    genre: 'Multi-Genre',
    highlights: ['Industrial setting', 'Diverse acts', 'Czech beer'],
    why: 'Unique industrial venue with world-class acts and cheap Czech beer.',
    accommodation: 'Hotels from €25/night',
    food: '€15-20/day'
  },
  {
    name: 'Strand Festival',
    location: 'Ulm, Germany',
    price: '€180',
    dates: 'August 1-3, 2025',
    genre: 'Electronic',
    highlights: ['Danube River', 'Techno focus', 'Small but mighty'],
    why: 'Intimate electronic festival by the Danube with top-tier DJs.',
    accommodation: 'Camping €50 total',
    food: '€25-35/day'
  }
];

const countryGuides = [
  {
    country: 'Germany',
    festivals: ['Fusion Festival', 'Hurricane Festival', 'Melt Festival'],
    avgPrice: '€150-250',
    bestTime: 'June-August',
    tip: 'Book early for significant discounts'
  },
  {
    country: 'Netherlands',
    festivals: ['Lowlands', 'Down The Rabbit Hole', 'Best Kept Secret'],
    avgPrice: '€180-280',
    bestTime: 'June-September',
    tip: 'Consider camping to save on accommodation'
  },
  {
    country: 'UK',
    festivals: ['Latitude', 'Green Man', 'Y Not Festival'],
    avgPrice: '£120-220',
    bestTime: 'June-September',
    tip: 'Look for payment plan options'
  },
  {
    country: 'Spain',
    festivals: ['FIB Benicàssim', 'Primavera Sound', 'Resurrection Fest'],
    avgPrice: '€140-240',
    bestTime: 'May-September',
    tip: 'Beach festivals offer great value with beach access'
  }
];

const budgetTips = [
  {
    icon: '🎫',
    title: 'Early Bird Tickets',
    tip: 'Buy tickets 6+ months early to save 30-50%',
    savings: 'Save €50-200'
  },
  {
    icon: '🏕️',
    title: 'Camping Options',
    tip: 'Choose camping over hotels for massive savings',
    savings: 'Save €300-800'
  },
  {
    icon: '🍕',
    title: 'Food Strategy',
    tip: 'Bring snacks and eat one meal inside, rest outside',
    savings: 'Save €100-200'
  },
  {
    icon: '✈️',
    title: 'Travel Smart',
    tip: 'Book flights 2-3 months ahead, consider budget airlines',
    savings: 'Save €100-400'
  },
  {
    icon: '👥',
    title: 'Group Discounts',
    tip: 'Many festivals offer group rates for 4+ people',
    savings: 'Save €20-80 per person'
  },
  {
    icon: '📱',
    title: 'Follow Social Media',
    tip: 'Flash sales and promo codes announced on social',
    savings: 'Save €30-100'
  }
];

export default function CheapMusicFestivalsEurope() {
  return (
    <>
      <GuidePageSchema 
        title="Cheap Music Festivals Europe 2025 - Best Budget Festival Guide"
        description="Discover 25+ affordable music festivals across Europe under €200! Complete guide to cheap festivals in Germany, UK, Spain, Netherlands & more."
        url="https://getfestiwise.com/cheap-music-festivals-europe-2025"
        category="Budget Festival Guide"
        datePublished="2024-09-01T00:00:00Z"
        dateModified={new Date().toISOString()}
      />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto text-center text-white">
                    <h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 text-center leading-tight"
          >
            Cheap Music Festivals Europe 2025
          </h1>
          <p
            className="text-xl text-white/90 mb-8 max-w-4xl mx-auto text-center leading-relaxed"
          >
            Discover 25+ incredible budget-friendly music festivals across Europe under €200. 
            Your guide to affordable festival adventures without compromising on quality!
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/quiz"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl"
            >
              🎯 Find Your Perfect Festival →
            </Link>
          </div>
        </div>
      </section>

      {/* Top Budget Festivals */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            💎 Best Value Festivals Under €200
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            These festivals prove you don't need to spend a fortune for an incredible music experience:
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {budgetFestivals.map((festival, _index) => (
              <div
                key={festival.name}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{festival.name}</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>📍 {festival.location}</p>
                        <p>📅 {festival.dates}</p>
                        <p className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {festival.genre}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{festival.price}</div>
                      <div className="text-sm text-gray-500">per ticket</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{festival.why}</p>
                  
                  <div className="space-y-3 mb-6">
                    {festival.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-green-600">✨</span>
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">🏨 Accommodation:</span>
                      <span className="font-medium">{festival.accommodation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">🍕 Food Budget:</span>
                      <span className="font-medium">{festival.food}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country Guides */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            🗺️ Budget Festivals by Country
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {countryGuides.map((guide, _index) => (
              <div
                key={guide.country}
                className="bg-white rounded-xl p-8 shadow-lg border border-blue-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{guide.country}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 mb-2">Top Budget Festivals:</p>
                    <div className="space-y-1">
                      {guide.festivals.map((festival, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-blue-600">🎪</span>
                          <span className="text-gray-700">{festival}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">💰 Price Range:</span>
                    <span className="font-bold text-blue-600">{guide.avgPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🌤️ Best Time:</span>
                    <span className="font-medium">{guide.bestTime}</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">💡 Pro Tip: {guide.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Money-Saving Tips */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            💰 Expert Money-Saving Tips
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Save hundreds of euros with these insider strategies
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {budgetTips.map((tip, _index) => (
              <div
                key={tip.title}
                className="bg-white rounded-xl p-6 shadow-lg border border-green-100 text-center"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h3>
                <p className="text-gray-600 mb-4">{tip.tip}</p>
                <div className="bg-gradient-to-r from-green-100 to-blue-100 py-2 px-4 rounded-full">
                  <span className="text-green-700 font-bold">{tip.savings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Total Budget Calculator */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-100 to-blue-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            🧮 Total Festival Budget Calculator
          </h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Budget Breakdown</h3>
                <div className="space-y-4 text-left">
                  <div className="flex justify-between border-b pb-2">
                    <span>Festival Ticket</span>
                    <span className="font-bold">€89 - €200</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Accommodation (3 nights)</span>
                    <span className="font-bold">€40 - €150</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Food & Drinks</span>
                    <span className="font-bold">€60 - €120</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Travel</span>
                    <span className="font-bold">€50 - €300</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t-2">
                    <span>Total Budget</span>
                    <span className="text-green-600">€239 - €770</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Pro Budget Tips</h3>
                <ul className="space-y-3 text-left text-gray-700">
                  <li>• Book early bird tickets for 30-50% savings</li>
                  <li>• Choose camping over hotels (save €200+)</li>
                  <li>• Travel with friends to split costs</li>
                  <li>• Eat breakfast at accommodation</li>
                  <li>• Use budget airlines or trains</li>
                  <li>• Bring reusable water bottle</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Never Miss a Festival Deal 💌</h2>
          <p className="text-xl text-gray-100 mb-8">
            Get personalized budget festival picks and new festival discoveries delivered to your inbox.
          </p>
          <Link href="/" className="bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 inline-block">
            Join 50,000+ Festival Lovers
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Budget Festival?</h2>
          <p className="text-xl text-gray-100 mb-8">
            Take our quiz to discover affordable festivals that match your music taste and budget.
          </p>
          <Link href="/quiz" className="bg-white text-green-600 px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl inline-block">
            Find My Perfect Budget Festival 🎯
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
