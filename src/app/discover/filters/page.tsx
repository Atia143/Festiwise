'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const FILTER_CATEGORIES = [
  {
    slug: 'electronic-festivals-under-500',
    title: 'Electronic Festivals Under $500',
    emoji: '🎧',
    description: 'Budget-friendly EDM and electronic music festivals worldwide',
    tags: ['Budget', 'Electronic', 'EDM']
  },
  {
    slug: 'luxury-music-festivals',
    title: 'Luxury Music Festivals',
    emoji: '✨',
    description: 'Premium festivals with glamping and VIP experiences',
    tags: ['Luxury', 'Glamping', 'Premium']
  },
  {
    slug: 'family-friendly-festivals',
    title: 'Family-Friendly Festivals',
    emoji: '👨‍👩‍👧‍👦',
    description: 'Festivals perfect for families with children',
    tags: ['Family', 'Kids', 'Friendly']
  },
  {
    slug: 'summer-festivals-europe',
    title: 'Summer Festivals in Europe',
    emoji: '☀️',
    description: 'Top European summer festivals June, July, August',
    tags: ['Summer', 'Europe', 'Season']
  },
  {
    slug: 'transformational-festivals',
    title: 'Transformational Festivals',
    emoji: '🧘',
    description: 'Spiritual and transformational music festivals',
    tags: ['Spiritual', 'Wellness', 'Deep']
  },
  {
    slug: 'underground-music-festivals',
    title: 'Underground & Alternative Festivals',
    emoji: '🎸',
    description: 'Authentic underground and indie music festivals',
    tags: ['Underground', 'Indie', 'Alternative']
  },
  {
    slug: 'festival-camping-glamping',
    title: 'Camping & Glamping Festivals',
    emoji: '⛺',
    description: 'Festivals with amazing camping and glamping options',
    tags: ['Camping', 'Glamping', 'Nature']
  },
  {
    slug: 'indie-rock-festivals',
    title: 'Indie & Rock Music Festivals',
    emoji: '🎸',
    description: 'Best indie rock festivals with emerging and established artists',
    tags: ['Indie', 'Rock', 'Music']
  },
  {
    slug: 'hip-hop-festivals',
    title: 'Hip-Hop & Rap Festivals',
    emoji: '🎤',
    description: 'Premium hip-hop festivals with top rap artists',
    tags: ['Hip-Hop', 'Rap', 'Urban']
  },
  {
    slug: 'spring-festivals-2025',
    title: 'Spring Festivals 2025',
    emoji: '🌸',
    description: 'Best spring music festivals April and May',
    tags: ['Spring', '2025', 'Season']
  }
];

export default function FiltersPage() {
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
              Festival <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">Collections</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Browse curated festival categories. Find the perfect festivals filtered by music style, budget, vibe, and location.
            </p>
            <Link href="/discover">
              <Button className="px-8 py-4 bg-white text-purple-900 hover:bg-gray-100 font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl">
                Back to Main Discovery →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FILTER_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <Link href={`/discover/${category.slug}`}>
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm group-hover:scale-[1.02] cursor-pointer">
                  {/* Gradient Background */}
                  <div className="relative h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent flex items-center justify-center">
                      <span className="text-6xl">{category.emoji}</span>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {category.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      {category.description}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {category.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Explore →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-purple-200"
        >
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Discover Your Perfect Festival
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            FestiWise curates the world's best music festivals across every genre, budget, and vibe. Whether you're seeking luxury experiences, underground gems, family-friendly events, or transformational journeys, we've got you covered.
          </p>
          <p className="text-lg text-gray-700">
            Not sure where to start? Take our <Link href="/quiz" className="font-bold text-purple-600 hover:text-purple-700">2-minute quiz</Link> to get personalized festival recommendations based on your taste, budget, and travel preferences.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
