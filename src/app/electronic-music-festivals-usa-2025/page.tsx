import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Electronic Music Festivals USA 2026 - Complete EDM Festival Guide',
  description: 'Discover the best electronic music festivals in USA 2026! EDC, Ultra, Electric Forest, and 25+ more epic EDM events with dates, tickets & lineups.',
  keywords: 'electronic music festivals usa 2026, edm festivals america 2026, edc ultra electric forest 2026, electronic dance music events 2026',
  openGraph: {
    title: 'Electronic Music Festivals USA 2026 - Ultimate EDM Guide',
    description: "Complete guide to America's hottest electronic music festivals in 2026",
    url: 'https://getfestiwise.com/electronic-music-festivals-usa-2025',
    type: 'website',
    images: [{ url: 'https://getfestiwise.com/api/og/best?slug=edm&label=EDM+USA&count=25', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electronic Music Festivals USA 2026 - Ultimate EDM Guide',
    description: "Complete guide to America's hottest electronic music festivals in 2026",
  },
  alternates: {
    canonical: 'https://getfestiwise.com/electronic-music-festivals-usa-2025',
  },
};

const topEDMFestivals = [
  {
    name: 'EDC Las Vegas',
    location: 'Las Vegas, Nevada',
    dates: 'May 2026',
    price: '$400-$800',
    rating: 4.9,
    capacity: '400,000+',
    highlights: ['Massive production', 'World-class DJs', 'Desert vibes'],
    headliners: ['Tiësto', 'Armin van Buuren', 'Deadmau5'],
    why: 'The biggest electronic music festival in North America with unmatched production value.',
    vibes: ['Massive crowds', 'Desert setting', 'Non-stop energy']
  },
  {
    name: 'Ultra Music Festival',
    location: 'Miami, Florida',
    dates: 'March 2026',
    price: '$350-$600',
    rating: 4.8,
    capacity: '165,000',
    highlights: ['Miami vibes', 'Beach parties', 'Pool events'],
    headliners: ['Martin Garrix', 'Swedish House Mafia', 'Calvin Harris'],
    why: 'The ultimate electronic music party in the heart of Miami\'s vibrant nightlife scene.',
    vibes: ['Beach city', 'Party atmosphere', 'International crowd']
  },
  {
    name: 'Electric Forest',
    location: 'Rothbury, Michigan',
    dates: 'June 2026',
    price: '$300-$500',
    rating: 4.7,
    capacity: '45,000',
    highlights: ['Forest setting', 'Art installations', 'Intimate vibe'],
    headliners: ['Bassnectar', 'Flume', 'ODESZA'],
    why: 'A magical forest experience combining electronic music with stunning art and nature.',
    vibes: ['Forest magic', 'Art focus', 'Spiritual journey']
  },
  {
    name: 'Electric Zoo',
    location: 'New York City',
    dates: 'September 2026',
    price: '$250-$450',
    rating: 4.6,
    capacity: '100,000',
    highlights: ['NYC skyline', 'Electronic only', 'Labor Day weekend'],
    headliners: ['David Guetta', 'Skrillex', 'Diplo'],
    why: 'Pure electronic music festival with the iconic NYC skyline as your backdrop.',
    vibes: ['City festival', 'Skyline views', 'Urban energy']
  }
];

const regionalFestivals = [
  {
    region: 'West Coast',
    festivals: [
      { name: 'Lightning in a Bottle', location: 'California', genre: 'Bass & Art' },
      { name: 'Nocturnal Wonderland', location: 'California', genre: 'House & Techno' },
      { name: 'Paradiso', location: 'Washington', genre: 'Trance & Progressive' }
    ]
  },
  {
    region: 'East Coast',
    festivals: [
      { name: 'Moonrise Festival', location: 'Maryland', genre: 'Dubstep & Bass' },
      { name: 'Electric Adventure', location: 'New Jersey', genre: 'Multi-Genre EDM' },
      { name: 'Imagine Festival', location: 'Georgia', genre: 'Electronic Fantasy' }
    ]
  },
  {
    region: 'Midwest',
    festivals: [
      { name: 'Spring Awakening', location: 'Chicago', genre: 'Progressive House' },
      { name: 'Freaky Deaky', location: 'Illinois', genre: 'Bass & Dubstep' },
      { name: 'Wavefront', location: 'Chicago', genre: 'Techno & House' }
    ]
  },
  {
    region: 'South',
    festivals: [
      { name: 'Something Wicked', location: 'Texas', genre: 'Dark Electronic' },
      { name: 'Ubbi Dubbi', location: 'Texas', genre: 'Colorful Bass' },
      { name: 'Okeechobee', location: 'Florida', genre: 'Electronic & Jam' }
    ]
  }
];

const edmGenres = [
  {
    genre: 'House Music',
    description: 'Four-on-the-floor beats, deep basslines, soulful vocals',
    festivals: ['Electric Zoo', 'Spring Awakening', 'Wavefront'],
    artists: ['Calvin Harris', 'Disclosure', 'Fisher'],
    vibe: 'Groovy, danceable, feel-good energy'
  },
  {
    genre: 'Techno',
    description: 'Driving beats, hypnotic rhythms, underground vibes',
    festivals: ['Movement Detroit', 'Wavefront', 'Elements'],
    artists: ['Charlotte de Witte', 'Adam Beyer', 'Amelie Lens'],
    vibe: 'Dark, intense, hypnotic experience'
  },
  {
    genre: 'Dubstep',
    description: 'Heavy bass drops, aggressive synths, high energy',
    festivals: ['Lost Lands', 'Bass Canyon', 'Freaky Deaky'],
    artists: ['Skrillex', 'Excision', 'Subtronics'],
    vibe: 'Headbanging, aggressive, bass-heavy'
  },
  {
    genre: 'Trance',
    description: 'Uplifting melodies, emotional builds, euphoric drops',
    festivals: ['Dreamstate', 'Luminosity', 'A State of Trance'],
    artists: ['Armin van Buuren', 'Above & Beyond', 'Ferry Corsten'],
    vibe: 'Emotional, uplifting, transcendent'
  }
];

const edmFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the biggest electronic music festival in the USA?', acceptedAnswer: { '@type': 'Answer', text: 'EDC Las Vegas (Electric Daisy Carnival) is the largest electronic music festival in North America, drawing over 400,000 attendees across three nights in May. Ultra Music Festival in Miami (165,000 capacity) is the second largest. Both feature world-class production and headliners like Tiësto, Martin Garrix, and Armin van Buuren.' } },
    { '@type': 'Question', name: 'How much do US electronic music festival tickets cost in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'US EDM festival ticket prices in 2026 range from $250 for Electric Zoo (New York) to $800+ for EDC Las Vegas VIP packages. Ultra Miami runs $350-600, Electric Forest $300-500, and Spring Awakening $150-300. Early bird tickets typically save 20-30%. Three-day GA passes are the best value.' } },
    { '@type': 'Question', name: 'What is the difference between house, techno, and dubstep festivals?', acceptedAnswer: { '@type': 'Answer', text: 'House music festivals (Electric Zoo, Spring Awakening) feature four-on-the-floor beats and groovy, danceable energy. Techno events (Movement Detroit, Elements) are darker and more hypnotic with underground vibes. Dubstep and bass festivals (Lost Lands, Bass Canyon) focus on heavy drops and aggressive bass-heavy sounds. EDC and Ultra cover all electronic genres across multiple stages.' } },
    { '@type': 'Question', name: 'What is the best EDM festival for first-timers in the USA?', acceptedAnswer: { '@type': 'Answer', text: 'Electric Forest in Michigan is ideal for first-timers — it combines electronic music with stunning forest art installations and a welcoming community (45,000 capacity). Spring Awakening in Chicago is another great entry point at a more affordable price. Avoid EDC Las Vegas for your first festival — 400,000 people across three stages can be overwhelming.' } },
  ],
};

const edmArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Electronic Music Festivals USA 2026 — Complete EDM Festival Guide',
  description: 'The best electronic music festivals in the USA for 2026. EDC, Ultra, Electric Forest, and 25+ more with dates, ticket prices, and insider tips.',
  author: { '@type': 'Organization', name: 'FestiWise', url: 'https://getfestiwise.com' },
  publisher: { '@type': 'Organization', name: 'FestiWise', url: 'https://getfestiwise.com' },
  datePublished: '2025-09-01',
  dateModified: '2026-03-17',
  url: 'https://getfestiwise.com/electronic-music-festivals-usa-2025',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://getfestiwise.com/electronic-music-festivals-usa-2025' },
};

export default function ElectronicMusicFestivalsUSA() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(edmFaqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(edmArticleSchema) }} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-600 via-purple-600 to-pink-600 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Electronic Music Festivals USA 2026
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-4xl mx-auto">
            From massive desert raves to intimate forest gatherings - discover America's most epic electronic music experiences!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-2xl font-bold">25+</p>
              <p className="text-sm opacity-90">Major EDM Festivals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm opacity-90">World-Class DJs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-2xl font-bold">2M+</p>
              <p className="text-sm opacity-90">Electronic Music Fans</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top EDM Festivals */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🎛️ Top Electronic Music Festivals 2026
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            These legendary festivals define America's electronic music scene:
          </p>
          
          <div className="space-y-8">
            {topEDMFestivals.map((festival, _index) => (
              <div
                key={festival.name}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-cyan-100"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-900 mb-3">{festival.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <p className="text-gray-600">📍 {festival.location}</p>
                          <p className="text-gray-600">📅 {festival.dates}</p>
                          <p className="text-gray-600">👥 {festival.capacity} attendees</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < Math.floor(festival.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                            <span className="font-semibold text-gray-700">{festival.rating}/5</span>
                          </div>
                          <p className="text-2xl font-bold text-cyan-600">{festival.price}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 text-lg">{festival.why}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">🎵 Headliners 2026</h4>
                          <div className="space-y-1">
                            {festival.headliners.map((artist, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="text-cyan-600">🎧</span>
                                <span className="text-gray-700">{artist}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">✨ Festival Vibes</h4>
                          <div className="space-y-1">
                            {festival.vibes.map((vibe, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="text-purple-600">🌟</span>
                                <span className="text-gray-700">{vibe}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:ml-8 mt-6 lg:mt-0">
                      <Link href="/festivals" className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-cyan-700 hover:to-purple-700 transition-all duration-300 inline-block text-center w-full lg:w-auto">
                        Get Tickets 🎫
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Guide */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            🗺️ Electronic Festivals by Region
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regionalFestivals.map((region, _index) => (
              <div
                key={region.region}
                className="bg-white rounded-xl p-8 shadow-lg border border-purple-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{region.region}</h3>
                <div className="space-y-4">
                  {region.festivals.map((festival, i) => (
                    <div key={i} className="border-l-4 border-cyan-400 pl-4">
                      <h4 className="font-bold text-gray-900">{festival.name}</h4>
                      <p className="text-gray-600 text-sm">📍 {festival.location}</p>
                      <p className="text-cyan-600 text-sm font-medium">{festival.genre}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDM Genres Guide */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🎵 Electronic Music Genres Guide
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Find festivals that match your electronic music taste
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {edmGenres.map((genre, _index) => (
              <div
                key={genre.genre}
                className="bg-gradient-to-br from-cyan-50 to-purple-50 rounded-xl p-8 border border-cyan-100"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{genre.genre}</h3>
                <p className="text-gray-600 mb-4">{genre.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🎪 Best Festivals:</h4>
                    <p className="text-sm text-gray-600">{genre.festivals.join(', ')}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">🎧 Top Artists:</h4>
                    <p className="text-sm text-gray-600">{genre.artists.join(', ')}</p>
                  </div>
                  
                  <div className="bg-white/70 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">✨ Vibe:</h4>
                    <p className="text-sm text-cyan-700">{genre.vibe}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Connected to the Beat 🎵</h2>
          <p className="text-xl text-gray-100 mb-8">
            Get personalized EDM festival picks and new additions to our database delivered to your inbox.
          </p>
          <Link href="/" className="bg-white text-cyan-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 inline-block">
            Join the EDM Community
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Rave?</h2>
          <p className="text-xl text-gray-100 mb-8">
            Find electronic music festivals that match your vibe and budget with our smart quiz.
          </p>
          <Link href="/quiz" className="bg-white text-cyan-600 px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl inline-block">
            Find My EDM Festival 🎛️
          </Link>
        </div>
      </section>
    </div>
  );
}
