'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Check, ChevronRight, Mail } from 'lucide-react';
import SimpleNewsletterForm from '@/components/Newsletter/SimpleNewsletterForm';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story');

  const milestones = [
    { year: '2024', event: 'FestiWise founded after a frustrating festival search experience while travelling' },
    { year: '2025', event: 'Quiz scoring algorithm developed — ranks 100+ festivals against your answers in under a second' },
    { year: '2025', event: 'Festival database grows to 100+ curated entries across 50+ countries' },
    { year: 'Next', event: 'Native iOS and Android app — quiz, saved festivals, and ticket alerts in your pocket' },
    { year: 'Next', event: 'More festivals, more regions, more languages' },
  ];

  const values = [
    {
      title: 'No affiliations',
      description: 'FestiWise has no affiliation with any festival, promoter, or ticket seller. Rankings are determined entirely by your quiz answers — no festival can pay to appear higher.',
    },
    {
      title: 'No accounts required',
      description: 'Take the quiz, browse festivals, save favourites — all without creating an account. Your quiz answers are processed locally and never stored on our servers.',
    },
    {
      title: 'No paid tiers',
      description: 'The quiz, festival database, and all features are free. There are no plans to introduce a paid tier.',
    },
    {
      title: 'No fake data',
      description: 'Festival information is sourced from official festival websites and publicly available information. We do not fabricate ratings, reviews, or attendance figures.',
    },
    {
      title: 'No ads',
      description: 'FestiWise does not run ads. Ticket links on festival pages point directly to official sources — we earn no commission.',
    },
    {
      title: 'No spam',
      description: 'If you sign up for the newsletter or ticket alerts, you will only receive what you asked for. Unsubscribe at any time with one click.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
              About FestiWise
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A free tool that helps you find festivals that actually fit you — based on your vibe, budget, and travel style, not what&apos;s trending on social media.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-12 bg-white rounded-2xl p-2 shadow-lg max-w-2xl mx-auto">
            {[
              { id: 'story', label: 'Story' },
              { id: 'how', label: 'How It Works' },
              { id: 'values', label: 'Values' },
              { id: 'team', label: 'Team' },
              { id: 'roadmap', label: 'Roadmap' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >

            {/* Story */}
            {activeTab === 'story' && (
              <div className="space-y-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-gray-900">Why FestiWise exists</h2>
                    <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                      <p>
                        There are thousands of music festivals worldwide. Finding the right one means
                        digging through overwhelming Google results, social media hype, and friends&apos;
                        recommendations that don&apos;t account for your budget, music taste, or travel constraints.
                      </p>
                      <p>
                        FestiWise was built in 2024 to solve that problem. Answer 8 questions about
                        what you&apos;re looking for — we score 100+ curated festivals against your answers
                        and show you the ones that genuinely fit.
                      </p>
                      <p className="text-purple-700 font-medium">
                        No account required. No ads. No affiliations. Completely free.
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 rounded-3xl p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center">
                        <div className="text-4xl font-bold text-purple-600">100+</div>
                        <div className="text-sm text-gray-600 font-medium">Curated Festivals</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center">
                        <div className="text-4xl font-bold text-pink-600">50+</div>
                        <div className="text-sm text-gray-600 font-medium">Countries</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center">
                        <div className="text-4xl font-bold text-blue-600">8</div>
                        <div className="text-sm text-gray-600 font-medium">Quiz Questions</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center">
                        <div className="text-4xl font-bold text-indigo-600">Free</div>
                        <div className="text-sm text-gray-600 font-medium">Forever</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* How It Works */}
            {activeTab === 'how' && (
              <div className="space-y-10">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">How the matching works</h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    FestiWise uses a scoring algorithm — not AI — to rank festivals. Here&apos;s exactly what happens when you take the quiz.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      step: '1',
                      title: 'Answer 8 questions',
                      description: 'You tell us your preferred music genres, travel budget, trip length, group type, vibe, and a few other factors.',
                    },
                    {
                      step: '2',
                      title: 'Every festival gets a score',
                      description: 'Each of the 100+ festivals in our database is scored against your answers. Festivals that match more of your criteria score higher.',
                    },
                    {
                      step: '3',
                      title: 'You see your ranked results',
                      description: 'Results are sorted by match score. You can save favourites, share your results, or sign up for ticket alerts.',
                    },
                  ].map((item) => (
                    <div key={item.step} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-lg mb-6">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                  <p className="text-purple-800 text-sm leading-relaxed">
                    <strong>On data quality:</strong> Festival information (genres, cost range, location, dates, vibe) is sourced from official festival websites and publicly available information. We do not use user reviews or ratings — those don&apos;t exist on FestiWise.
                  </p>
                </div>
              </div>
            )}

            {/* Values */}
            {activeTab === 'values' && (
              <div className="space-y-10">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">What we stand for</h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    These are not aspirational statements — they describe how FestiWise operates today.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {values.map((value) => (
                    <div key={value.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <Check size={13} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">{value.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team */}
            {activeTab === 'team' && (
              <div className="space-y-10">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">The team</h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    FestiWise is a solo project, built and maintained by one person.
                  </p>
                </div>

                <div className="max-w-xl mx-auto">
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div className="flex items-start gap-6">
                      <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-4 text-white text-xl font-black min-w-[72px] h-[72px] flex items-center justify-center">
                        YA
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">Yuval Atia</h3>
                        <p className="text-purple-600 font-medium mb-3">Founder</p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          Festival enthusiast who built FestiWise to solve his own problem of finding the right festival to attend.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {['Festival Curation', 'Product', 'Music'].map((s) => (
                            <span key={s} className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">{s}</span>
                          ))}
                        </div>
                        <a
                          href="mailto:yuval.atia@icloud.com"
                          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium text-sm"
                        >
                          <Mail size={14} />
                          yuval.atia@icloud.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-8 text-center max-w-xl mx-auto">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Want to contribute?</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    If you attend a festival that&apos;s not in our database, have insider tips to share, or spot something that&apos;s wrong or outdated — reach out. Festival knowledge from real attendees makes the database better for everyone.
                  </p>
                  <a
                    href="mailto:pixelplus.contact@gmail.com"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium text-sm"
                  >
                    <Mail size={14} />
                    pixelplus.contact@gmail.com
                  </a>
                </div>
              </div>
            )}

            {/* Roadmap */}
            {activeTab === 'roadmap' && (
              <div className="space-y-10">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Journey & roadmap</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    What&apos;s been built, and what&apos;s coming next.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
                  <div className="space-y-10">
                    {milestones.map((milestone, index) => (
                      <motion.div
                        key={`${milestone.year}-${index}`}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15, duration: 0.5 }}
                        className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`w-[45%] ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                            <div className={`text-xl font-bold mb-2 ${
                              milestone.year === 'Next' ? 'text-blue-600' : 'text-purple-600'
                            }`}>
                              {milestone.year}
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{milestone.event}</p>
                          </div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-4 border-purple-500 rounded-full shadow" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Quiz CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-20 bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Find your festival <span className="text-purple-600">in 2 minutes</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Answer 8 questions and we rank every festival in our database by how well it fits you. No account required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Take the Quiz — Free
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/festivals"
                  className="px-8 py-4 border-2 border-purple-600 text-purple-600 font-bold rounded-2xl hover:bg-purple-50 transition-all duration-300"
                >
                  Browse 100+ Festivals
                </Link>
              </div>
              <div className="max-w-md mx-auto">
                <p className="text-sm text-gray-500 mb-4">Get new festival picks delivered to your inbox</p>
                <SimpleNewsletterForm />
              </div>
            </div>
          </motion.div>

          {/* Contact & Trust */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-12 grid md:grid-cols-2 gap-8"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Mail size={20} className="text-purple-600" />
                Contact
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Press &amp; Business</h4>
                  <a href="mailto:yuval.atia@icloud.com" className="text-purple-600 text-sm hover:underline">yuval.atia@icloud.com</a>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800">General &amp; Support</h4>
                  <a href="mailto:pixelplus.contact@gmail.com" className="text-blue-600 text-sm hover:underline">pixelplus.contact@gmail.com</a>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-6">Typical response time: 1–3 days</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Trust &amp; Privacy</h3>
              <div className="space-y-3">
                {[
                  'Quiz answers processed locally — not stored on our servers',
                  'No personal data sold or shared with third parties',
                  'No affiliation with any festival, promoter, or ticket seller',
                  'Ticket links point to official festival sources only',
                  'No ads, no paid placements, no sponsored rankings',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check size={11} className="text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
