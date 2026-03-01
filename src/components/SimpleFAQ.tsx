'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_ITEMS = [
  {
    q: 'How does the FestiWise quiz work?',
    a: 'Answer 8 quick questions about your music taste, travel style, and budget. Our algorithm scores every festival in our database across 50+ factors and surfaces your top matches — ranked by how well they fit you specifically.',
  },
  {
    q: 'Is FestiWise free?',
    a: 'Completely free, forever. No account required, no credit card, no premium tier. We have no affiliation with any festival or ticket seller — our recommendations are based entirely on your quiz answers.',
  },
  {
    q: 'How many festivals are in the database?',
    a: 'Over 100 hand-curated events across 30+ countries — from stadium-scale headliners like Coachella and Tomorrowland to boutique gems most people have never heard of. We review and update the database regularly.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. Take the quiz, get your results, save favourites to your device — all without signing up. Your saved festivals are stored locally in your browser.',
  },
  {
    q: 'Can I save my favourite festivals?',
    a: 'Yes. Hit the heart icon on any festival detail page to save it. Your favourites are stored in your browser and persist across sessions on the same device.',
  },
  {
    q: 'Which countries and regions do you cover?',
    a: 'We cover festivals across Europe, North America, South America, Asia, Africa, and Australia. Use the Discover page to filter by region, month, genre, or budget.',
  },
  {
    q: 'What if the quiz results don\'t feel right?',
    a: 'Retake it — your answers are never saved server-side. You can also browse directly by genre or region on the Festivals page, or use the Discover filters to find events that match specific criteria.',
  },
  {
    q: 'How do I get ticket alerts for a festival?',
    a: 'On any festival detail page, submit your email in the Ticket Alerts form. We\'ll notify you when ticket sales open or when there are price drops.',
  },
];

export default function SimpleFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-white">
      {/* FAQ JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.map(item => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }),
        }}
      />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold uppercase tracking-widest rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Frequently asked questions
          </h2>
          <p className="text-gray-500">
            Can&apos;t find what you&apos;re looking for?{' '}
            <Link href="/contact" className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2">
              Contact us
            </Link>
          </p>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`transition-colors duration-200 ${isOpen ? 'bg-purple-50/40' : 'bg-white hover:bg-gray-50/60'}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                  aria-expanded={isOpen}
                >
                  <span className={`font-semibold text-sm md:text-base leading-snug transition-colors duration-200 ${isOpen ? 'text-purple-700' : 'text-gray-900'}`}>
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors duration-200 ${
                      isOpen ? 'border-purple-500 text-purple-500' : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm md:text-base text-gray-600 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm mb-4">Ready to find your festival?</p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg text-sm"
          >
            Take the 2-minute Quiz
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
