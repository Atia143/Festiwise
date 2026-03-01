'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Smartphone, Globe, Wifi, Share2, BookmarkPlus, Bell } from 'lucide-react';

const FEATURES = [
  {
    icon: <Globe size={28} className="text-purple-400" />,
    title: 'Works in Any Browser',
    description: 'Open getfestiwise.com on any iOS or Android device — no download required.',
  },
  {
    icon: <BookmarkPlus size={28} className="text-pink-400" />,
    title: 'Add to Home Screen',
    description: 'Tap "Add to Home Screen" in your browser menu for an app-like experience.',
  },
  {
    icon: <Wifi size={28} className="text-yellow-400" />,
    title: '100+ Festivals',
    description: 'Browse, filter, and save festivals from your phone just as easily as on desktop.',
  },
  {
    icon: <Share2 size={28} className="text-green-400" />,
    title: 'Share Your Results',
    description: 'Share your quiz matches with friends directly from your mobile browser.',
  },
  {
    icon: <Bell size={28} className="text-blue-400" />,
    title: 'Ticket Alerts',
    description: 'Sign up for ticket alerts on any festival detail page — no app needed.',
  },
  {
    icon: <Smartphone size={28} className="text-orange-400" />,
    title: 'Native App — Coming Soon',
    description: 'We\'re working on dedicated iOS and Android apps. Stay tuned.',
  },
];

const STEPS = [
  { step: '1', text: 'Open getfestiwise.com in Safari or Chrome on your phone' },
  { step: '2', text: 'Tap the share icon (Safari) or the three-dot menu (Chrome)' },
  { step: '3', text: 'Select "Add to Home Screen" — done' },
];

export default function MobileAppPage() {
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium text-white/80 mb-6">
            <Smartphone size={14} />
            <span>Use FestiWise on Mobile</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
            FestiWise on Your Phone
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
            FestiWise is a web app — it works on every device right now, directly in your browser. No download needed. A native mobile app is in the works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-400 text-black rounded-xl font-bold hover:from-yellow-500 hover:to-pink-500 transition-all shadow-lg"
              >
                Take the Quiz — Free
              </motion.span>
            </Link>
            <Link href="/festivals">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                Browse Festivals
              </motion.span>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-black text-center mb-10 text-white">
            Everything you need, right in your browser
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Add to Home Screen Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-white/10 rounded-3xl p-10 text-center"
        >
          <h2 className="text-3xl font-black mb-3 text-white">
            Add to Home Screen
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Get an app-like experience on iOS or Android in 3 steps — no App Store required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {STEPS.map(({ step, text }) => (
              <div key={step} className="flex-1 bg-white/8 border border-white/10 rounded-2xl p-5 text-left">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center text-black font-black text-sm mb-3">
                  {step}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            Works on iOS Safari and Android Chrome. The experience is identical to a native app.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
