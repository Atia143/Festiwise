'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SimpleNewsletterForm from '@/components/Newsletter/SimpleNewsletterForm';
import { useParams } from 'next/navigation';
import festivalsData from '@/data/festivals.json';

interface Festival {
  id: string;
  name: string;
  country: string;
  city: string;
  region: string;
  months: string[];
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  audience_size: string;
  duration_days: number;
  family_friendly: boolean;
  camping: boolean;
  glamping: boolean;
  weather_profile: string[];
  vibe: string[];
  website: string;
  status: string;
  min_age: number;
  ticket_official_url: string;
}

const FILTER_CONFIGS: Record<string, {
  title: string;
  description: string;
  keywords: string[];
  filter: (f: Festival) => boolean;
}> = {
  'electronic-festivals-under-500': {
    title: 'Best Electronic Music Festivals Under $500',
    description: 'Discover the top electronic music festivals worldwide that fit your budget. Find world-class EDM, techno, and house festivals for under $500 USD.',
    keywords: ['electronic festivals', 'EDM festivals', 'budget festivals', 'techno festivals'],
    filter: (f) => f.genres.includes('electronic') && f.estimated_cost_usd.max <= 500,
  },
  'luxury-music-festivals': {
    title: 'Luxury Music Festivals Worldwide',
    description: 'Experience the most exclusive and luxurious music festivals. VIP camping, glamping, and premium experiences for discerning festival-goers.',
    keywords: ['luxury festivals', 'glamping festivals', 'premium festivals', 'exclusive events'],
    filter: (f) => f.vibe.includes('luxury'),
  },
  'family-friendly-festivals': {
    title: 'Best Family-Friendly Music Festivals',
    description: 'Festivals perfect for families with kids. Safe, welcoming environments with activities for all ages.',
    keywords: ['family festivals', 'kid-friendly events', 'family music festivals'],
    filter: (f) => f.family_friendly === true,
  },
  'summer-festivals-europe': {
    title: 'Top Summer Music Festivals in Europe',
    description: 'Experience Europe\'s best summer music festivals. From underground raves to mainstream mega-events.',
    keywords: ['summer festivals Europe', 'European music festivals', 'festival season'],
    filter: (f) => (f.region.includes('Europe') || f.region.includes('Western-Europe')) && f.months.some(m => ['June', 'July', 'August'].includes(m)),
  },
  'transformational-festivals': {
    title: 'Transformational Music Festivals',
    description: 'Spiritual, deep, and transformational festivals that change perspective. Music, art, wellness, and community in perfect harmony.',
    keywords: ['transformational festivals', 'spiritual festivals', 'wellness festivals'],
    filter: (f) => f.vibe.includes('transformational') || f.vibe.includes('spiritual'),
  },
  'underground-music-festivals': {
    title: 'Underground & Alternative Music Festivals',
    description: 'Discover authentic underground music festivals with cutting-edge lineups and intimate vibes.',
    keywords: ['underground festivals', 'indie festivals', 'alternative music festivals'],
    filter: (f) => f.vibe.includes('underground') || f.genres.includes('indie'),
  },
  'festival-camping-glamping': {
    title: 'Best Camping & Glamping Festivals',
    description: 'Festivals with amazing camping and glamping options. Sleep under the stars at these incredible music events.',
    keywords: ['camping festivals', 'glamping festivals', 'festival camping'],
    filter: (f) => f.camping === true || f.glamping === true,
  },
  'indie-rock-festivals': {
    title: 'Best Indie & Rock Music Festivals',
    description: 'Top indie rock festivals worldwide. Discover emerging and established indie and rock artists.',
    keywords: ['indie festivals', 'rock festivals', 'indie rock music'],
    filter: (f) => f.genres.includes('indie') || f.genres.includes('rock'),
  },
  'hip-hop-festivals': {
    title: 'Hip-Hop & Rap Music Festivals',
    description: 'Premium hip-hop festivals with the best rap artists and urban culture.',
    keywords: ['hip-hop festivals', 'rap festivals', 'hip-hop music events'],
    filter: (f) => f.genres.includes('hiphop'),
  },
  'spring-festivals-2025': {
    title: 'Best Spring Music Festivals 2025',
    description: 'Kick off festival season with the top spring music festivals. April and May events worldwide.',
    keywords: ['spring festivals 2025', 'April festivals', 'May festivals'],
    filter: (f) => f.months.some(m => ['April', 'May'].includes(m)),
  },
};

export default function FilterLandingPage() {
  const params = useParams();
  const filterSlug = params?.filter ? String(params.filter) : '';
  const [savedFestivals, setSavedFestivals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const config = FILTER_CONFIGS[filterSlug];

  useEffect(() => {
    setIsLoading(false);
    const saved = localStorage.getItem('saved-festivals');
    if (saved) {
      setSavedFestivals(JSON.parse(saved));
    }
  }, []);

  const toggleSave = (festivalId: string) => {
    const newSaved = savedFestivals.includes(festivalId)
      ? savedFestivals.filter(id => id !== festivalId)
      : [...savedFestivals, festivalId];
    setSavedFestivals(newSaved);
    localStorage.setItem('saved-festivals', JSON.stringify(newSaved));
  };

  const filteredFestivals = useMemo(() => {
    if (!config || isLoading) return [];
    return (festivalsData as Festival[]).filter(config.filter);
  }, [config, isLoading]);

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Filter Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">This festival filter doesn't exist.</p>
          <Link href="/discover">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              Back to Discovery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-3xl">🎪</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Loading Festivals</h2>
          <p className="text-lg text-gray-600">Fetching your curated festivals...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 -mt-20 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/80 to-pink-800/90" />
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl"
            animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/discover" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition">
              <span>←</span>
              <span>Back to Discovery</span>
            </Link>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
              {config.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              {config.description}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {config.keywords.map((keyword) => (
                <Badge key={keyword} className="bg-white/20 text-white border border-white/30">
                  {keyword}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Festivals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {filteredFestivals.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                <span className="text-purple-600">{filteredFestivals.length}</span> Matching Festivals
              </h2>
              <p className="text-xl text-gray-600">
                Curated list of festivals matching your preferences. Click any to learn more and get tickets.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFestivals.map((festival: Festival, index: number) => (
                <motion.div
                  key={festival.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <Link href={`/festival/${festival.id}`}>
                    <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm group-hover:scale-[1.02] cursor-pointer">
                      {/* Image Placeholder */}
                      <div className="relative h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent" />
                        
                        {/* Badge Top-Left */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/20 backdrop-blur-md border border-white/30 text-white">
                            {festival.audience_size}
                          </Badge>
                        </div>

                        {/* Save Button Top-Right */}
                        <motion.button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleSave(festival.id);
                          }}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <motion.span
                            className={`text-lg ${savedFestivals.includes(festival.id) ? 'text-red-400' : 'text-white'}`}
                            animate={{
                              scale: savedFestivals.includes(festival.id) ? [1, 1.3, 1] : 1
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {savedFestivals.includes(festival.id) ? '❤️' : '🤍'}
                          </motion.span>
                        </motion.button>

                        {/* Cost Bottom-Right */}
                        <div className="absolute bottom-4 right-4">
                          <span className="text-white font-bold bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full text-sm">
                            ${festival.estimated_cost_usd.min}-${festival.estimated_cost_usd.max}
                          </span>
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                          {festival.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {festival.city}, {festival.country}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        {/* Dates & Duration */}
                        <div className="text-sm text-gray-700">
                          <div className="font-semibold">{festival.months.join(', ')}</div>
                          <div className="text-gray-600">{festival.duration_days} days</div>
                        </div>

                        {/* Vibes */}
                        <div>
                          <div className="text-xs font-bold text-gray-700 uppercase mb-1">Vibes</div>
                          <div className="flex flex-wrap gap-1">
                            {festival.vibe.slice(0, 3).map(v => (
                              <span key={v} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Explore Button */}
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-4">
                          Learn More →
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-8xl mb-8"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🔍
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">No festivals found</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Try exploring other festival categories or browsing all festivals.
            </p>
            <Link href="/discover">
              <Button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Back to Discovery
              </Button>
            </Link>
          </motion.div>
        )}
      </section>

      {/* Newsletter CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <SimpleNewsletterForm />
      </div>
    </div>
  );
}
