'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';


export default function OzoraFestivalArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black text-white pb-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-400 py-20 px-4 text-center overflow-hidden mb-0">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"
        >
          Ozora Festival: A Journey Into Psychedelic Paradise
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="max-w-2xl mx-auto text-xl md:text-2xl text-white/90 mb-8"
        >
          The ultimate guide to one of the world’s most magical psychedelic gatherings. Coming September 15, 2025!
        </motion.p>
        <div className="flex items-center justify-center text-gray-200 text-sm gap-2 mb-2">
          <span>August 30, 2025</span>
          <span className="mx-2">•</span>
          <span>15 min read</span>
        </div>
        <Link href="/blog" className="inline-block mt-4 px-6 py-2 rounded-full bg-white/20 text-purple-100 font-semibold hover:bg-white/40 transition">
          ← Back to Blog
        </Link>
      </section>

      {/* Article Card */}
      <section className="max-w-3xl mx-auto px-4 -mt-16">
        <motion.article
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/90 rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-300 p-8 mt-0"
        >
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-100 rounded-full mb-4">
              Coming Soon
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">What to Expect in This Article</h2>
            <p className="text-gray-700 text-lg mb-6">
              This comprehensive guide to Ozora Festival is coming soon! Check back on September 15, 2025.
            </p>
          </div>
          <ul className="list-disc pl-6 space-y-3 text-gray-800 text-base mb-8">
            <li>The history and philosophy behind Ozora Festival</li>
            <li>Essential planning guide and tips</li>
            <li>Understanding the unique stages and areas</li>
            <li>Art installations and workshops</li>
            <li>Accommodation options and camping guidelines</li>
            <li>Food, amenities, and practical information</li>
            <li>Transportation and arrival details</li>
            <li>Festival culture and community guidelines</li>
            <li>Weather considerations and packing list</li>
            <li>Must-see performances and activities</li>
          </ul>
          <div className="mt-8 p-6 bg-gradient-to-br from-purple-100/80 to-pink-100/80 rounded-2xl border border-purple-400/30 text-center">
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Subscribe for Updates</h3>
            <p className="text-gray-700 mb-4">
              Want to be notified when this article goes live? Sign up for our newsletter and be the first to read it!
            </p>
            <Link
              href="#"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Subscribe Now
            </Link>
          </div>
        </motion.article>
      </section>
    </div>
  );
}
