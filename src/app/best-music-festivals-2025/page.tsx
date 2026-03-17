import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import StructuredData from '@/components/SEO/StructuredData';

export const metadata: Metadata = {
  title: 'Best Music Festivals 2026 | Top 100+ Festivals Worldwide',
  description: 'Discover the best music festivals of 2026. Complete guide to Tomorrowland, Coachella, Burning Man, Glastonbury and 100+ world-class festivals. Find your perfect festival match.',
  keywords: [
    'best music festivals 2026', 'top music festivals 2026', 'music festival guide 2026',
    'tomorrowland 2026', 'coachella 2026', 'burning man 2026', 'glastonbury 2026',
    'electronic music festivals 2026', 'rock festivals 2026', 'festival calendar 2026'
  ],
  alternates: {
    canonical: 'https://getfestiwise.com/best-music-festivals-2025',
  },
  openGraph: {
    title: 'Best Music Festivals 2026 | Complete Guide',
    description: 'The ultimate guide to 100+ world-class music festivals in 2026. From Tomorrowland to Burning Man.',
    url: 'https://getfestiwise.com/best-music-festivals-2025',
    type: 'website',
    images: [{ url: 'https://getfestiwise.com/api/og/best?slug=music&label=Music&count=100', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Music Festivals 2026 | Complete Guide',
    description: 'The ultimate guide to 100+ world-class music festivals in 2026.',
  },
};

const topFestivals = [
  {
    name: 'Tomorrowland',
    location: 'Belgium',
    genre: 'EDM',
    dates: 'July 2026',
    tier: 'Legendary',
    highlight: 'The world\'s most magical EDM experience'
  },
  {
    name: 'Coachella',
    location: 'California, USA',
    genre: 'Multi-Genre',
    dates: 'April 2026',
    tier: 'Iconic',
    highlight: 'Where fashion meets music in the desert'
  },
  {
    name: 'Burning Man',
    location: 'Nevada, USA',
    genre: 'Experimental',
    dates: 'August 2026',
    tier: 'Transformational',
    highlight: 'A life-changing cultural phenomenon'
  },
  {
    name: 'Glastonbury',
    location: 'UK',
    genre: 'Multi-Genre',
    dates: 'June 2026',
    tier: 'Legendary',
    highlight: 'The most famous festival in the world'
  }
];

const structuredData = {
  "@type": "WebPage",
  name: "Best Music Festivals 2026",
  description: "Complete guide to the world's best music festivals in 2026",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: 50,
    itemListElement: topFestivals.map((festival, index) => ({
      "@type": "Event",
      position: index + 1,
      name: festival.name,
      location: festival.location,
      startDate: festival.dates
    }))
  }
};

const bestFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What are the best music festivals in the world in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'The world\'s best music festivals in 2026 include Tomorrowland (Belgium) for EDM, Glastonbury (UK) for multi-genre, Coachella (USA) for pop culture, Burning Man (USA) for transformational experiences, Primavera Sound (Spain) for indie, Rock am Ring (Germany) for rock, and Fuji Rock (Japan) for Asian music culture. Each offers a unique world-class experience.' } },
    { '@type': 'Question', name: 'What is the most famous music festival in the world?', acceptedAnswer: { '@type': 'Answer', text: 'Glastonbury Festival in Somerset, UK is widely considered the most famous music festival in the world, running since 1970 with a 200,000+ capacity. Tomorrowland in Belgium is arguably the most prestigious EDM festival globally. Coachella in California is the most commercially influential festival for pop culture and fashion.' } },
    { '@type': 'Question', name: 'Which music festival is best for electronic music in 2026?', acceptedAnswer: { '@type': 'Answer', text: 'Tomorrowland (Belgium, July) is the world\'s premier EDM festival with unmatched stage production. EDC Las Vegas (May) is the largest in North America. Ultra Music Festival (Miami, March) is the most prestigious for dance music artists. Creamfields UK (August) is the best for UK electronic music fans.' } },
    { '@type': 'Question', name: 'How do I find the right music festival for me?', acceptedAnswer: { '@type': 'Answer', text: 'Consider four key factors: genre (does it match your music taste?), budget (ticket + travel + accommodation + food), location (domestic vs. international), and experience type (camping vs. hotel, intimate vs. massive). The FestiWise quiz narrows 100+ festivals to your personal top 6 in under 2 minutes — completely free.' } },
  ],
};

export default function BestFestivals2025() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black">
      <StructuredData type="WebSite" data={structuredData} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bestFaqSchema) }} />
      
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <div className="relative py-20 px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Best Music Festivals
              </span>
              <br />
              <span className="text-white">2026</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The ultimate guide to 50+ world-class music festivals. From legendary EDM spectacles to transformational desert experiences.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge className="bg-purple-500/20 text-purple-300 px-4 py-2">50+ Festivals</Badge>
              <Badge className="bg-blue-500/20 text-blue-300 px-4 py-2">25+ Countries</Badge>
              <Badge className="bg-green-500/20 text-green-300 px-4 py-2">All Genres</Badge>
              <Badge className="bg-yellow-500/20 text-yellow-300 px-4 py-2">2026 Dates</Badge>
            </div>
            
            <Link href="/quiz">
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full">
                Find Your Perfect Festival →
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Festivals Grid */}
        <div className="py-20 px-4">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              Top Tier Festivals 2026
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {topFestivals.map((festival, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        #{index + 1}
                      </Badge>
                      <Badge className="border border-purple-400 text-purple-300 bg-transparent">
                        {festival.tier}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-xl">{festival.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-gray-300">
                      <p><span className="text-purple-400">📍</span> {festival.location}</p>
                      <p><span className="text-blue-400">🎵</span> {festival.genre}</p>
                      <p><span className="text-green-400">📅</span> {festival.dates}</p>
                      <p className="text-sm italic mt-3 text-gray-400">{festival.highlight}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-6">
                Ready to Find Your Festival?
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Take our smart quiz to get personalized recommendations from our database of 50+ world-class festivals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quiz">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3">
                    Take Festival Quiz
                  </Button>
                </Link>
                <Link href="/festivals">
                  <Button className="border border-purple-400 text-purple-300 hover:bg-purple-500/20 bg-transparent px-8 py-3">
                    Browse All Festivals
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
