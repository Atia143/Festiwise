import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import StructuredData from '@/components/SEO/StructuredData';

export const metadata: Metadata = {
  title: 'Best Music Festivals 2025 | Top 50 Festivals Worldwide',
  description: 'Discover the best music festivals of 2025. Complete guide to Tomorrowland, Coachella, Burning Man, and 47 more world-class festivals. Find your perfect festival match.',
  keywords: [
    'best music festivals 2025', 'top music festivals', 'music festival guide 2025',
    'tomorrowland 2025', 'coachella 2025', 'burning man 2025', 'glastonbury 2025',
    'electronic music festivals', 'rock festivals', 'festival calendar 2025'
  ],
  openGraph: {
    title: 'Best Music Festivals 2025 | Complete Guide',
    description: 'The ultimate guide to 50 world-class music festivals in 2025. From Tomorrowland to Burning Man.',
    images: [{ url: '/og-best-festivals-2025.jpg', width: 1200, height: 630 }]
  }
};

const topFestivals = [
  {
    name: 'Tomorrowland',
    location: 'Belgium',
    genre: 'EDM',
    dates: 'July 2025',
    tier: 'Legendary',
    highlight: 'The world\'s most magical EDM experience'
  },
  {
    name: 'Coachella',
    location: 'California, USA',
    genre: 'Multi-Genre',
    dates: 'April 2025',
    tier: 'Iconic',
    highlight: 'Where fashion meets music in the desert'
  },
  {
    name: 'Burning Man',
    location: 'Nevada, USA',
    genre: 'Experimental',
    dates: 'August 2025',
    tier: 'Transformational',
    highlight: 'A life-changing cultural phenomenon'
  },
  {
    name: 'Glastonbury',
    location: 'UK',
    genre: 'Multi-Genre',
    dates: 'June 2025',
    tier: 'Legendary',
    highlight: 'The most famous festival in the world'
  }
];

const structuredData = {
  "@type": "WebPage",
  name: "Best Music Festivals 2025",
  description: "Complete guide to the world's best music festivals in 2025",
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

export default function BestFestivals2025() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black">
      <StructuredData type="WebSite" data={structuredData} />
      
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <div className="relative py-20 px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Best Music Festivals
              </span>
              <br />
              <span className="text-white">2025</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The ultimate guide to 50+ world-class music festivals. From legendary EDM spectacles to transformational desert experiences.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge className="bg-purple-500/20 text-purple-300 px-4 py-2">50+ Festivals</Badge>
              <Badge className="bg-blue-500/20 text-blue-300 px-4 py-2">25+ Countries</Badge>
              <Badge className="bg-green-500/20 text-green-300 px-4 py-2">All Genres</Badge>
              <Badge className="bg-yellow-500/20 text-yellow-300 px-4 py-2">2025 Dates</Badge>
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
              Top Tier Festivals 2025
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
