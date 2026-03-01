'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, ExternalLink } from 'lucide-react';

const INCLUDED = [
  'Festival matching quiz — unlimited runs',
  'Browse and filter 100+ curated festivals',
  'Save favourites to your device',
  'Share your quiz results with friends',
  'Ticket alert sign-ups for any festival',
  'Festival detail pages with insider tips',
  'No account required',
  'No ads',
];

const FAQ = [
  {
    q: 'How is FestiWise free?',
    a: 'FestiWise is a free tool with no current revenue model. We have no affiliation with any festival or ticket seller and do not earn commission on bookings. The quiz and festival database are completely free to use.',
  },
  {
    q: 'Will it always be free?',
    a: 'Yes. The quiz, browsing, saving, and sharing will always be free. We have no plans to introduce paid tiers.',
  },
  {
    q: 'Do you accept paid placements?',
    a: 'No. Festivals cannot pay to appear higher in your results. Rankings are determined solely by the quiz algorithm.',
  },
  {
    q: 'Do you sell my data?',
    a: 'Never. Your quiz answers are processed locally and not stored on our servers. We don\'t sell or share personal data.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-20 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
            Free. Forever.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            FestiWise is 100% free to use — no plans, no subscriptions, no hidden fees. Everything below is included for every visitor.
          </p>
        </motion.div>

        {/* What's included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-12"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Everything included, no catch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INCLUDED.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <Check size={12} className="text-green-400" />
                </div>
                <span className="text-gray-200 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/quiz">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-400 text-black rounded-xl font-bold hover:from-yellow-500 hover:to-pink-500 transition-all shadow-lg"
              >
                Start the Free Quiz
              </motion.span>
            </Link>
          </div>
        </motion.div>

        {/* Independence statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ExternalLink size={18} className="text-purple-400" />
            Independent and unaffiliated
          </h2>
          <p className="text-gray-300 leading-relaxed">
            FestiWise has no affiliation with any festival, promoter, or ticket seller. Ticket links on festival pages point directly to official sources. We do not earn commission on ticket sales. Quiz rankings are determined entirely by your answers — no festival can pay to appear in your results.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Common questions</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
