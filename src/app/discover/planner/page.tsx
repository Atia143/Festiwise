'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import festivalsData from '@/data/festivals.json';

interface Festival {
  id: string;
  name: string;
  country: string;
  city: string;
  months: string[];
  genres: string[];
  estimated_cost_usd: { min: number; max: number };
  duration_days: number;
  vibe: string[];
  website: string;
  ticket_official_url: string;
}

const allGenres = ['electronic', 'indie', 'rock', 'pop', 'hiphop', 'classical', 'jazz', 'reggae', 'folk', 'metal'];
const budgetOptions = [
  { label: 'Any Budget', min: 0, max: 999999 },
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500-$1000', min: 500, max: 1000 },
  { label: '$1000-$2000', min: 1000, max: 2000 },
];
const daysOptions = [1, 2, 3, 'Weekend', 'Week'];

export default function QuickPlanCreator() {
  const [days, setDays] = useState<number | string>('Weekend');
  const [budget, setBudget] = useState('Any Budget');
  const [genres, setGenres] = useState<string[]>(['electronic']);
  const [recommendations, setRecommendations] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenreToggle = (genre: string) => {
    setGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const generatePlan = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const budgetRange = budgetOptions.find(b => b.label === budget);
    let filtered = (festivalsData as Festival[]).filter(f =>
      genres.some(g => f.genres.includes(g)) &&
      f.estimated_cost_usd.min <= (budgetRange?.max || 999999) &&
      f.estimated_cost_usd.max >= (budgetRange?.min || 0)
    );

    // Filter by duration if specified
    if (typeof days === 'number') {
      filtered = filtered.filter(f => f.duration_days >= days);
    } else if (days === 'Weekend') {
      filtered = filtered.filter(f => f.duration_days <= 3);
    } else if (days === 'Week') {
      filtered = filtered.filter(f => f.duration_days >= 4);
    }

    setRecommendations(filtered.slice(0, 3));
    setIsLoading(false);
  };

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
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8">
              <span className="text-2xl">🎯</span>
              <span className="text-white font-semibold">Festival Planning Made Easy</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
              Find Your Perfect <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">Festival Plan</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Tell us how many days you have, your budget, and music style. We'll recommend the perfect festivals for your next adventure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="overflow-hidden border-0 shadow-2xl bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
              <CardTitle className="text-2xl">Quick Festival Planner</CardTitle>
              <p className="text-white/90 text-sm mt-2">Answer 3 simple questions to get personalized recommendations</p>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Duration Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">How many days do you have?</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {daysOptions.map((option) => (
                    <motion.button
                      key={JSON.stringify(option)}
                      onClick={() => setDays(option)}
                      className={`p-4 rounded-xl font-bold transition-all duration-300 ${
                        days === option
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {typeof option === 'number' ? `${option} Day${option > 1 ? 's' : ''}` : option}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Budget Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">What's your budget?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {budgetOptions.map((option) => (
                    <motion.button
                      key={option.label}
                      onClick={() => setBudget(option.label)}
                      className={`p-4 rounded-xl font-bold transition-all duration-300 text-left ${
                        budget === option.label
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Genre Selection */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">What music genres do you love?</h3>
                <p className="text-sm text-gray-600 mb-3">(Select one or more)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {allGenres.map((genre) => (
                    <motion.button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`p-3 rounded-lg font-semibold transition-all duration-300 text-sm ${
                        genres.includes(genre)
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {genre}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={generatePlan}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⏳
                      </motion.span>
                      Creating Your Plan...
                    </span>
                  ) : (
                    '🎉 Generate My Festival Plan'
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 text-center">
              Your Perfect Festival <span className="text-purple-600">Matches</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((festival: Festival, index: number) => (
                <motion.div
                  key={festival.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link href={`/festival/${festival.id}`}>
                    <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50/50 hover:scale-[1.02] cursor-pointer">
                      <div className="relative h-40 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 overflow-hidden flex items-center justify-center">
                        <div className="text-6xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {festival.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {festival.city}, {festival.country}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-700">Cost:</span>
                          <span className="text-purple-600 font-bold">
                            ${festival.estimated_cost_usd.min}-${festival.estimated_cost_usd.max}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-700">Duration:</span>
                          <span className="text-purple-600 font-bold">{festival.duration_days} days</span>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-gray-700 block mb-2">Genres</span>
                          <div className="flex flex-wrap gap-1">
                            {festival.genres.slice(0, 3).map(g => (
                              <Badge key={g} className="text-xs">{g}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-gray-700 block mb-2">Vibes</span>
                          <div className="flex flex-wrap gap-1">
                            {festival.vibe.slice(0, 2).map(v => (
                              <span key={v} className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded">
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-4">
                          View Details →
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">💡 Festival Trip Tips</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-xl">🎫</span>
                  <span><strong>Book Early:</strong> Early-bird tickets sell out fast. Lock in your price now.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">🏕️</span>
                  <span><strong>Accommodation:</strong> Secure camping or hotels near the festival venue.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">🎒</span>
                  <span><strong>Preparation:</strong> Check our festival guides for packing lists and safety tips.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-xl">👥</span>
                  <span><strong>Connect:</strong> Join festival communities online to meet other attendees.</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
