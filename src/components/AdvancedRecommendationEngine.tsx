'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Heart, Music, MapPin, Calendar } from 'lucide-react';

interface QuizAnswers {
  genres: string[];
  budget: 'low' | 'medium' | 'high';
  duration: 'weekend' | 'week' | 'multi-week';
  experience: 'solo' | 'friends' | 'family';
  environment: 'camping' | 'nearby' | 'resort';
  vibe: 'party' | 'discovery' | 'cultural' | 'chill';
  accessibility: boolean;
  international: boolean;
}

interface FestivalMatch {
  id: string;
  name: string;
  matchScore: number;
  reasons: string[];
  image: string;
  genres: string[];
  dates: string;
  location: string;
  budget: string;
  vibeMatch: number;
  genreMatch: number;
  experienceMatch: number;
}

interface RecommendationCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  festivals: FestivalMatch[];
  color: string;
}

// Advanced matching algorithm
function calculateFestivalMatch(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  festival: any,
  answers: QuizAnswers
): FestivalMatch {
  let score = 0;
  const reasons: string[] = [];

  // Genre matching (0-25 points)
  const genreMatch = festival.genres.filter((g: string) =>
    answers.genres.includes(g)
  ).length;
  const genreScore = (genreMatch / Math.max(answers.genres.length, 1)) * 25;
  score += genreScore;
  if (genreScore > 20) reasons.push(`Perfect for ${answers.genres.join(' & ')}`);
  else if (genreScore > 10) reasons.push(`Great ${answers.genres[0]} lineup`);

  // Budget matching (0-20 points)
  const budgetMatch = festival.budget === answers.budget;
  if (budgetMatch) {
    score += 20;
    reasons.push(`Within your ${answers.budget} budget`);
  } else {
    score += 10;
  }

  // Duration matching (0-15 points)
  const durationMap: Record<string, string> = {
    weekend: '2-3 days',
    week: '4-7 days',
    'multi-week': '7+ days',
  };
  if (
    festival.dates.toLowerCase().includes(durationMap[answers.duration])
  ) {
    score += 15;
    reasons.push(`Perfect ${answers.duration} getaway`);
  } else {
    score += 7;
  }

  // Vibe matching (0-20 points)
  const vibeScores: Record<string, number> = {
    party: 20,
    discovery: 15,
    cultural: 18,
    chill: 16,
  };
  const vibeScore = vibeScores[festival.vibe] || 0;
  score += Math.min(vibeScore * 0.8, 20);
  if (vibeScore > 15) reasons.push(`${festival.vibe} vibe matches yours`);

  // Experience type (0-10 points)
  const experienceMatch = festival.experience === answers.experience;
  if (experienceMatch) {
    score += 10;
    reasons.push(`Ideal for ${answers.experience} travelers`);
  } else {
    score += 5;
  }

  // Accessibility (0-10 points)
  if (answers.accessibility && festival.accessible) {
    score += 10;
    reasons.push('Fully accessible');
  }

  // International preference (0-5 points)
  if (answers.international && festival.international) {
    score += 5;
    reasons.push('International destination');
  }

  // Bonus: Trending/Popular (0-5 points)
  if (festival.trending) {
    score += 5;
    reasons.push('Trending this season');
  }

  return {
    id: festival.id,
    name: festival.name,
    matchScore: Math.round(Math.min(score, 100)),
    reasons: reasons.slice(0, 3),
    image: festival.image,
    genres: festival.genres,
    dates: festival.dates,
    location: festival.location,
    budget: festival.budget,
    vibeMatch: Math.round(vibeScore),
    genreMatch: Math.round(genreScore),
    experienceMatch: experienceMatch ? 100 : 50,
  };
}

// Recommendation insights based on user preferences
function generateRecommendationInsights(
  matches: FestivalMatch[],
  answers: QuizAnswers
): RecommendationCard[] {
  return [
    {
      id: 'top-matches',
      title: 'Your Perfect Matches',
      subtitle: `${matches.filter((m) => m.matchScore >= 85).length} festivals match your vibe`,
      icon: <Heart className="text-red-500" size={24} />,
      description: 'These festivals align perfectly with your preferences',
      festivals: matches.filter((m) => m.matchScore >= 85).slice(0, 3),
      color: 'from-red-500/20 to-pink-500/20',
    },
    {
      id: 'rising-stars',
      title: 'Rising Stars',
      subtitle: 'New & trending festivals gaining buzz',
      icon: <TrendingUp className="text-yellow-500" size={24} />,
      description: 'Discover emerging festivals before they blow up',
      festivals: matches.filter((m) => m.matchScore >= 70).slice(0, 3),
      color: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      id: 'genre-deep-dive',
      title: `Best ${answers.genres[0]} Festivals`,
      subtitle: `${answers.genres[0]} festivals curated just for you`,
      icon: <Music className="text-purple-500" size={24} />,
      description: 'Top-rated festivals in your favorite genre',
      festivals: matches.slice(0, 3),
      color: 'from-purple-500/20 to-pink-500/20',
    },
  ];
}

export default function AdvancedRecommendationEngine({
  quizAnswers = {
    genres: ['Electronic', 'Indie'],
    budget: 'medium',
    duration: 'weekend',
    experience: 'friends',
    environment: 'camping',
    vibe: 'party',
    accessibility: false,
    international: true,
  } as QuizAnswers,
}) {
  const [recommendations, setRecommendations] = useState<RecommendationCard[]>(
    []
  );
  const [topMatches, setTopMatches] = useState<FestivalMatch[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample festival database (would be replaced with real data)
  const FESTIVALS = [
    {
      id: '1',
      name: 'Tomorrowland',
      genres: ['Electronic', 'House', 'Techno'],
      budget: 'high',
      dates: 'July',
      location: 'Boom, Belgium',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
      vibe: 'party',
      experience: 'friends',
      accessible: true,
      international: true,
      trending: true,
    },
    {
      id: '2',
      name: 'Coachella',
      genres: ['Indie', 'Pop', 'Rock'],
      budget: 'high',
      dates: 'April',
      location: 'California, USA',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
      vibe: 'discovery',
      experience: 'friends',
      accessible: true,
      international: true,
      trending: true,
    },
    {
      id: '3',
      name: 'Glastonbury',
      genres: ['Rock', 'Indie', 'Electronic'],
      budget: 'medium',
      dates: 'June',
      location: 'Somerset, UK',
      image: 'https://images.unsplash.com/photo-1516968519265-95nacde37eae?w=400&h=300&fit=crop',
      vibe: 'cultural',
      experience: 'friends',
      accessible: true,
      international: true,
      trending: false,
    },
    {
      id: '4',
      name: 'Burning Man',
      genres: ['Electronic', 'Experimental'],
      budget: 'medium',
      dates: 'August–September',
      location: 'Nevada, USA',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      vibe: 'party',
      experience: 'solo',
      accessible: false,
      international: true,
      trending: true,
    },
    {
      id: '5',
      name: 'Reading & Leeds',
      genres: ['Rock', 'Indie', 'Pop'],
      budget: 'low',
      dates: 'August',
      location: 'UK',
      image: 'https://images.unsplash.com/photo-1504386886739-7e858dc5c1c0?w=400&h=300&fit=crop',
      vibe: 'party',
      experience: 'friends',
      accessible: true,
      international: false,
      trending: false,
    },
    {
      id: '6',
      name: 'Primavera Sound',
      genres: ['Indie', 'Alternative', 'Electronic'],
      budget: 'medium',
      dates: 'May–June',
      location: 'Barcelona, Spain',
      image: 'https://images.unsplash.com/photo-1478529143081-80f7f84ca84d?w=400&h=300&fit=crop',
      vibe: 'discovery',
      experience: 'friends',
      accessible: true,
      international: true,
      trending: true,
    },
  ];

  useEffect(() => {
    // Simulate processing
    setLoading(true);
    const timer = setTimeout(() => {
      // Calculate matches for all festivals
      const matches = FESTIVALS.map((festival) =>
        calculateFestivalMatch(festival, quizAnswers)
      )
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 12); // Top 12 matches

      setTopMatches(matches);

      // Generate recommendation cards
      const insights = generateRecommendationInsights(matches, quizAnswers);
      setRecommendations(insights);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizAnswers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-yellow-400"
        >
          <Sparkles size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 pt-12 pb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-yellow-400" size={32} />
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            Your Festival Matches
          </h1>
        </div>
        <p className="text-xl text-gray-300">
          AI-powered recommendations based on your preferences
        </p>
      </motion.div>

      {/* Match Score Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 mb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: 'Perfect Matches',
              value: topMatches.filter((m) => m.matchScore >= 85).length,
              color: 'from-red-500 to-pink-500',
            },
            {
              label: 'Avg Match Score',
              value: `${Math.round(topMatches.reduce((a, b) => a + b.matchScore, 0) / topMatches.length)}%`,
              color: 'from-yellow-500 to-orange-500',
            },
            {
              label: 'Similar Vibes',
              value: quizAnswers.genres[0],
              color: 'from-purple-500 to-pink-500',
            },
            {
              label: 'Festivals Found',
              value: topMatches.length,
              color: 'from-blue-500 to-cyan-500',
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} bg-opacity-10 backdrop-blur-xl border border-white/10 rounded-xl p-6`}
            >
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recommendation Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 mb-20"
      >
        <div className="space-y-12">
          {recommendations.map((card, cardIdx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: cardIdx * 0.1 }}
            >
              {/* Card Header */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-2">
                  {card.icon}
                  <div className="flex-1">
                    <h2 className="text-3xl font-black">{card.title}</h2>
                    <p className="text-gray-400 text-sm">{card.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-300 ml-10">{card.description}</p>
              </div>

              {/* Festival Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {card.festivals.map((festival, festIdx) => (
                  <motion.div
                    key={festival.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: festIdx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className={`bg-gradient-to-br ${card.color} backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-pointer group`}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={festival.image}
                        alt={festival.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Match Score Badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        className="absolute top-3 right-3 bg-gradient-to-br from-yellow-400 to-pink-400 text-black rounded-full w-16 h-16 flex items-center justify-center font-black text-xl shadow-lg"
                      >
                        {festival.matchScore}%
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{festival.name}</h3>

                      {/* Location & Dates */}
                      <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                        <MapPin size={16} />
                        <span>{festival.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                        <Calendar size={16} />
                        <span>{festival.dates}</span>
                      </div>

                      {/* Genres */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {festival.genres.slice(0, 2).map((genre) => (
                          <span
                            key={genre}
                            className="px-2 py-1 bg-white/10 rounded-full text-xs font-semibold"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>

                      {/* Match Reasons */}
                      <div className="space-y-2 mb-4">
                        {festival.reasons.map((reason, idx) => (
                          <p
                            key={idx}
                            className="text-sm text-yellow-300 flex items-start gap-2"
                          >
                            <span className="text-lg leading-none">✓</span>
                            {reason}
                          </p>
                        ))}
                      </div>

                      {/* CTA */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2 bg-gradient-to-r from-yellow-400 to-pink-400 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-pink-500 transition-all"
                      >
                        View Tickets
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Algorithm Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={28} />
            How We Match You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Genre Fit', value: '25%' },
              { label: 'Budget Alignment', value: '20%' },
              { label: 'Vibe & Energy', value: '20%' },
              { label: 'Duration & Type', value: '15%' },
              { label: 'Experience Level', value: '10%' },
              { label: 'Accessibility & Trends', value: '10%' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between"
              >
                <span className="text-gray-300">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: item.value }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-pink-400"
                    />
                  </div>
                  <span className="text-yellow-400 font-bold w-10 text-right">
                    {item.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
