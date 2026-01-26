'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Heart, History, Settings } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  experienceLevel: 'first-time' | 'experienced' | 'veteran';
  homeLocation: string;
  createdAt: string;
  quizzesTaken: number;
  festivalsSaved: number;
}

interface SavedFestival {
  id: string;
  name: string;
  matchScore: number;
  image: string;
  addedAt: string;
}

const DEFAULT_USER: UserProfile = {
  id: 'user123',
  email: 'user@example.com',
  name: 'Festival Lover',
  avatar: '🎪',
  experienceLevel: 'experienced',
  homeLocation: 'New York, USA',
  createdAt: '2025-01-01',
  quizzesTaken: 3,
  festivalsSaved: 12,
};

const SAMPLE_SAVED_FESTIVALS: SavedFestival[] = [
  { id: 'tomorrowland', name: 'Tomorrowland', matchScore: 96, image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', addedAt: '2025-01-15' },
  { id: 'glastonbury', name: 'Glastonbury', matchScore: 88, image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', addedAt: '2025-01-14' },
  { id: 'burning-man', name: 'Burning Man', matchScore: 81, image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', addedAt: '2025-01-12' },
];

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [savedFestivals, setSavedFestivals] = useState<SavedFestival[]>(SAMPLE_SAVED_FESTIVALS);
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'history' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              FestiWise
            </h1>
          </Link>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div className="pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* User Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 flex items-center justify-center text-5xl shadow-2xl cursor-pointer"
                >
                  {user.avatar}
                </motion.div>

                {/* User Info */}
                <div>
                  <h2 className="text-4xl font-black mb-2">{user.name}</h2>
                  <p className="text-gray-400 mb-4">{user.email}</p>
                  <div className="flex gap-6">
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">{user.quizzesTaken}</div>
                      <div className="text-sm text-gray-400">Quizzes Taken</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-400">{user.festivalsSaved}</div>
                      <div className="text-sm text-gray-400">Saved Festivals</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-400">
                        {Math.floor((Math.random() * 30) + 20)}
                      </div>
                      <div className="text-sm text-gray-400">Friends</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
              >
                <Settings size={18} />
                {isEditing ? 'Done' : 'Edit Profile'}
              </motion.button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
            {(['overview', 'saved', 'history', 'settings'] as const).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.05 }}
                className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-yellow-400 to-pink-400 text-black'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Experience Level', value: user.experienceLevel.toUpperCase(), icon: '🎭' },
                  { label: 'Home Location', value: user.homeLocation, icon: '📍' },
                  { label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString(), icon: '📅' },
                  { label: 'Favorite Genre', value: 'Electronic', icon: '🎵' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </div>
                      <div className="text-4xl">{stat.icon}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Your Festival Journey</h3>
                <div className="space-y-4">
                  {[
                    { label: '🎪 Festivals Discovered', value: '47' },
                    { label: '✈️ International Festivals', value: '12' },
                    { label: '💰 Average Budget', value: '$250' },
                    { label: '👥 Festival Buddies', value: '5' },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0"
                    >
                      <span className="text-gray-300">{item.label}</span>
                      <span className="font-bold text-lg text-gradient">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SAVED TAB */}
          {activeTab === 'saved' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold">Saved Festivals ({savedFestivals.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedFestivals.map((festival, idx) => (
                  <motion.div
                    key={festival.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group cursor-pointer rounded-2xl overflow-hidden"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={festival.image}
                        alt={festival.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div>
                          <h4 className="font-bold text-lg text-white">{festival.name}</h4>
                          <p className="text-sm text-gray-300">{new Date(festival.addedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-green-500 rounded-full px-3 py-1 font-bold text-white">
                          {festival.matchScore}%
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold">Quiz History</h3>
              <div className="space-y-4">
                {[
                  { date: '2025-01-20', festivals: ['Tomorrowland', 'Ultra Miami', 'CRSSD'], genres: ['EDM', 'House', 'Techno'] },
                  { date: '2025-01-10', festivals: ['Glastonbury', 'Primavera Sound', 'Latitude'], genres: ['Rock', 'Indie', 'Alternative'] },
                  { date: '2024-12-28', festivals: ['Burning Man', 'Coachella', 'Outside Lands'], genres: ['Electronic', 'Pop', 'Indie'] },
                ].map((quiz, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-gray-400 mb-2">{new Date(quiz.date).toLocaleDateString()}</div>
                        <div className="flex gap-3 flex-wrap mb-3">
                          {quiz.genres.map((g, i) => (
                            <span key={i} className="text-xs px-3 py-1 bg-purple-500/20 rounded-full text-purple-200">{g}</span>
                          ))}
                        </div>
                        <div className="text-gray-300">Matched to: {quiz.festivals.join(', ')}</div>
                      </div>
                      <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-bold transition-all">
                        View Results
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold">Settings & Preferences</h3>
              
              {/* Preference Controls */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-6">
                {[
                  { label: 'Festival Recommendations', sublabel: 'Get notified about festivals matching your taste', enabled: true },
                  { label: 'Lineup Updates', sublabel: 'Know when lineups are announced', enabled: true },
                  { label: 'Price Alerts', sublabel: 'Get notified of ticket sales and discounts', enabled: false },
                  { label: 'Weekly Newsletter', sublabel: 'Festival tips, trends, and insider info', enabled: true },
                  { label: 'Email Marketing', sublabel: 'Special offers and promotions', enabled: false },
                ].map((pref, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start justify-between py-4 border-b border-white/10 last:border-b-0"
                  >
                    <div>
                      <div className="font-bold text-white">{pref.label}</div>
                      <div className="text-sm text-gray-400">{pref.sublabel}</div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all ${pref.enabled ? 'bg-green-500' : 'bg-gray-600'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white transition-all m-0.5 ${pref.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Account Actions */}
              <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8">
                <h4 className="text-lg font-bold mb-4 text-red-300">Danger Zone</h4>
                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all">
                  Delete Account
                </button>
                <p className="text-sm text-gray-400 mt-2">Once deleted, your account cannot be recovered.</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
