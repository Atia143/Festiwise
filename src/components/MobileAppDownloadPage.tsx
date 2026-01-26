'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Apple, Download, Star, Users, Zap } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

export default function MobileAppPage() {
  const [selectedTab, setSelectedTab] = useState<'ios' | 'android'>('ios');

  const FEATURES: Feature[] = [
    {
      icon: <Zap size={32} className="text-yellow-400" />,
      title: 'Lightning Fast',
      description: 'Browse 500+ festivals in milliseconds with offline support',
      badge: 'Native',
    },
    {
      icon: <Users size={32} className="text-pink-400" />,
      title: 'Find Your Crew',
      description: 'Match with friends, form groups, and explore together',
    },
    {
      icon: <Star size={32} className="text-purple-400" />,
      title: 'Smart Notifications',
      description: 'Get alerts for lineups, price drops, and friend arrivals',
    },
    {
      icon: <Smartphone size={32} className="text-blue-400" />,
      title: 'Festival Toolkit',
      description: 'Budgeting, packing lists, maps, and safety features',
    },
    {
      icon: <Download size={32} className="text-green-400" />,
      title: 'Offline Mode',
      description: 'Works without internet — essential for festivals',
    },
    {
      icon: <Zap size={32} className="text-red-400" />,
      title: 'Instant Sharing',
      description: 'Share your matches, save tickets, and invite friends',
    },
  ];

  const SCREENSHOTS = [
    {
      title: 'Smart Quiz',
      description: 'Discover your perfect festivals in 2 minutes',
      image: 'https://images.unsplash.com/photo-1512941691920-25bda36dc643?w=300&h=600&fit=crop',
    },
    {
      title: 'Festival Matches',
      description: 'See why each festival matches your vibe',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=600&fit=crop',
    },
    {
      title: 'Your Crew',
      description: 'Find friends going to the same festivals',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=600&fit=crop',
    },
    {
      title: 'Festival Hub',
      description: 'Everything you need for your festival journey',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=600&fit=crop',
    },
  ];

  const REVIEWS = [
    {
      name: 'Sarah M.',
      role: 'Festival Enthusiast',
      rating: 5,
      text: 'This app is a game-changer! Found 3 festivals I never would have discovered.',
      avatar: '👩‍🎤',
    },
    {
      name: 'James T.',
      role: 'EDM Fan',
      rating: 5,
      text: 'The offline mode saved me at Burning Man. So helpful!',
      avatar: '🎧',
    },
    {
      name: 'Emma L.',
      role: 'First-Time Festivalgoer',
      rating: 5,
      text: 'I was overwhelmed by choices. This app made it so easy!',
      avatar: '🎵',
    },
    {
      name: 'Marcus D.',
      role: 'Group Organizer',
      rating: 5,
      text: 'Finding festivals my whole friend group loves is now seamless.',
      avatar: '👨‍🎤',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 left-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 pt-20 pb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <motion.div
                animate={{ y: [-20, 20, -20] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative"
              >
                {/* Phone Frame */}
                <div className="relative w-80 h-[640px] bg-black rounded-3xl border-8 border-gray-900 shadow-2xl overflow-hidden">
                  {/* Screen */}
                  <div className="absolute inset-1 bg-gradient-to-b from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-center"
                    >
                      <Smartphone size={80} className="mx-auto mb-4" />
                      <p className="text-xl font-bold">FestiWise</p>
                      <p className="text-sm text-white/80">Find Your Festival</p>
                    </motion.div>
                  </div>

                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl z-10" />
                </div>

                {/* Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 -z-10" />
              </motion.div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Festival Discovery Meets Native Speed
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                The FestiWise app is designed for festival-goers. Discover matches offline, find friends going to the same festivals, and never miss a lineup announcement.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-black border-2 border-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all"
                >
                  <Apple size={24} />
                  Download on iOS
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-400 text-black rounded-xl font-bold flex items-center justify-center gap-3 hover:from-yellow-500 hover:to-pink-500 transition-all"
                >
                  <Download size={24} />
                  Get on Google Play
                </motion.button>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-8 pt-8 border-t border-white/10">
                {[
                  { label: 'Downloads', value: '50K+' },
                  { label: 'Rating', value: '4.8★' },
                  { label: 'Active Users', value: '35K+' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 py-20"
        >
          <h2 className="text-5xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            Everything You Need in Your Pocket
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                {feature.badge && (
                  <span className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-bold rounded-full">
                    {feature.badge}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Screenshots Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 py-20"
        >
          <h2 className="text-5xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            Explore the App
          </h2>

          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-800/50 border border-white/10 rounded-full p-2">
              {['ios', 'android'].map((os) => (
                <button
                  key={os}
                  onClick={() => setSelectedTab(os as 'ios' | 'android')}
                  className={`px-8 py-3 rounded-full font-bold transition-all ${
                    selectedTab === os
                      ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {os === 'ios' ? '🍎 iOS' : '🤖 Android'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {SCREENSHOTS.map((screenshot, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/10">
                  <img
                    src={screenshot.image}
                    alt={screenshot.title}
                    className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <h4 className="text-lg font-bold">{screenshot.title}</h4>
                      <p className="text-gray-300 text-sm">
                        {screenshot.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 py-20"
        >
          <h2 className="text-5xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            Loved by Festival Fans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{review.avatar}</span>
                  <div>
                    <p className="font-bold">{review.name}</p>
                    <p className="text-gray-400 text-sm">{review.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {Array(review.rating)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">
                        ★
                      </span>
                    ))}
                </div>
                <p className="text-gray-300 text-sm">{review.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 py-20"
        >
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <h3 className="text-4xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Ready to Download?
            </h3>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of festival-goers using FestiWise to discover their next adventure. Available on iOS and Android.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-black border-2 border-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all"
              >
                <Apple size={24} />
                Download on iOS
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-400 text-black rounded-xl font-bold flex items-center justify-center gap-3 hover:from-yellow-500 hover:to-pink-500 transition-all"
              >
                <Download size={24} />
                Get on Google Play
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
