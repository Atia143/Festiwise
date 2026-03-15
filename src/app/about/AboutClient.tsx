'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, ChevronRight } from 'lucide-react';

const TABS = [
  { id: 'story',   label: 'Story'       },
  { id: 'how',     label: 'How It Works'},
  { id: 'values',  label: 'Values'      },
  { id: 'team',    label: 'Team'        },
  { id: 'roadmap', label: 'Roadmap'     },
];

const STATS = [
  { value: '100+',  label: 'Curated Festivals' },
  { value: '24',    label: 'Countries Covered'  },
  { value: '5',     label: 'Quiz Questions'      },
  { value: '376+',  label: 'Pages Indexed'       },
];

const MILESTONES = [
  { year: '2024', done: true,  text: 'FestiWise founded after a frustrating festival search while travelling' },
  { year: '2025', done: true,  text: 'Quiz scoring algorithm built — ranks 100+ festivals against your answers in under a second' },
  { year: '2025', done: true,  text: 'Festival database reaches 100+ curated entries across 24 countries' },
  { year: '2026', done: true,  text: 'Search, city pages, comparison pages, best-of lists, international (ES/DE/FR) — 376+ static pages indexed' },
  { year: 'Next', done: false, text: 'Native iOS and Android app — quiz, saved festivals, and ticket alerts in your pocket' },
  { year: 'Next', done: false, text: 'More festivals, more regions, partner integrations with ticket platforms' },
];

const VALUES = [
  { title: 'Quiz-first rankings',     body: 'Festival rankings are determined entirely by your quiz answers. No festival can pay to appear higher in your results.' },
  { title: 'No account required',     body: 'Take the quiz, browse festivals, save favourites — all without creating an account. Quiz answers are processed locally and never stored on our servers.' },
  { title: 'Honest about revenue',    body: 'Some ticket links may earn a small referral fee at no extra cost to you. A Pro tier is available for power users. The core quiz and database are free.' },
  { title: 'No fake data',            body: 'Festival information is sourced from official festival websites and publicly available records. We do not fabricate ratings, attendance figures, or reviews.' },
  { title: 'No display ads',          body: 'FestiWise does not run display ads or sell ad placements. Every recommendation is based purely on your quiz answers.' },
  { title: 'No spam',                 body: 'If you sign up for the newsletter or ticket alerts, you receive only what you asked for. Unsubscribe at any time with one click.' },
];

const TRUST = [
  'Quiz answers processed locally — not stored on our servers',
  'No personal data sold or shared with third parties',
  'Some ticket links may earn a small referral fee at no cost to you',
  'Festival rankings are never influenced by payments',
  'No display ads, no sponsored content, no paid placements',
];

export default function AboutClient() {
  const [activeTab, setActiveTab] = useState('story');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-pink-600 text-white py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">About FestiWise</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            A free tool that matches you to festivals that genuinely fit — based on your vibe, budget, and travel style, not what&apos;s trending on social media.
          </p>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Tab nav */}
        <div className="flex flex-wrap justify-center gap-1 mb-10 bg-gray-50 rounded-2xl p-2 max-w-2xl mx-auto border border-gray-100">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-700 hover:bg-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >

          {/* ── Story ─────────────────────────────────────────────────── */}
          {activeTab === 'story' && (
            <div className="space-y-10">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-5">
                  <h2 className="text-3xl font-black text-gray-900">Why FestiWise exists</h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      There are thousands of music festivals worldwide. Finding the right one means digging through overwhelming Google results, social media hype, and friends&apos; recommendations that don&apos;t account for your budget, music taste, or travel constraints.
                    </p>
                    <p>
                      FestiWise was built in 2024 to solve that. Answer 5 questions — we score 100+ curated festivals against your answers and show you the ones that genuinely fit.
                    </p>
                    <p className="text-purple-700 font-semibold">
                      No account. No ads. Rankings are never for sale.
                    </p>
                  </div>
                  <Link
                    href="/quiz"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-md"
                  >
                    Try the quiz — 2 min
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  {STATS.map(s => (
                    <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                      <div className="text-3xl font-black text-purple-600 mb-1">{s.value}</div>
                      <div className="text-sm text-gray-500 font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── How It Works ──────────────────────────────────────────── */}
          {activeTab === 'how' && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-black text-gray-900 mb-3">How the matching works</h2>
                <p className="text-gray-600">
                  FestiWise uses a scoring algorithm — not AI — to rank festivals. Here&apos;s exactly what happens when you take the quiz.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { step: '1', title: 'Answer 5 questions', body: 'You tell us your preferred music genres, budget, vibe, region, and timing.' },
                  { step: '2', title: 'Every festival is scored', body: 'Each of the 100+ festivals is scored against your answers. Closer match = higher score.' },
                  { step: '3', title: 'See your ranked results', body: 'Results sorted by match score. Save favourites, compare festivals, or set ticket alerts.' },
                ].map(item => (
                  <div key={item.step} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-black mb-5">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 text-sm text-purple-800 leading-relaxed">
                <strong>On data quality:</strong> Festival information (genres, cost range, location, dates, vibe) is sourced from official festival websites and publicly available records. Ratings and reviews come from FestiWise users and are stored locally in your browser.
              </div>
            </div>
          )}

          {/* ── Values ────────────────────────────────────────────────── */}
          {activeTab === 'values' && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-black text-gray-900 mb-3">What we stand for</h2>
                <p className="text-gray-500">These are not aspirational statements — they describe how FestiWise operates today.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {VALUES.map(v => (
                  <div key={v.title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex gap-4">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm">{v.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{v.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Team ──────────────────────────────────────────────────── */}
          {activeTab === 'team' && (
            <div className="space-y-8 max-w-xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900 mb-3">The team</h2>
                <p className="text-gray-500">FestiWise is a solo project, built and maintained by one person.</p>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                    YA
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Yuval Atia</h3>
                    <p className="text-purple-600 text-sm font-medium mb-3">Founder</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Festival enthusiast who built FestiWise to solve his own problem of finding the right festival to attend.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Festival Curation', 'Product', 'Music'].map(s => (
                        <span key={s} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                <h3 className="font-bold text-gray-900 mb-2">Want to contribute?</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  If you attend a festival not in our database, have insider tips, or spot something outdated — reach out. Festival knowledge from real attendees makes the database better for everyone.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-xl text-sm hover:bg-purple-700 transition-all"
                >
                  Contact us
                </Link>
              </div>
            </div>
          )}

          {/* ── Roadmap ───────────────────────────────────────────────── */}
          {activeTab === 'roadmap' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900 mb-3">Journey &amp; roadmap</h2>
                <p className="text-gray-500 max-w-xl mx-auto">What&apos;s been built, and what&apos;s coming next.</p>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                {MILESTONES.map((m, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        m.done ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300'
                      }`}>
                        {m.done ? <Check className="w-4 h-4" /> : '→'}
                      </div>
                      {i < MILESTONES.length - 1 && <div className="w-0.5 flex-1 bg-gray-100 mt-1" />}
                    </div>
                    <div className={`pb-6 ${i === MILESTONES.length - 1 ? 'pb-0' : ''}`}>
                      <span className={`text-xs font-bold uppercase tracking-widest ${m.done ? 'text-purple-600' : 'text-gray-400'}`}>
                        {m.year}
                      </span>
                      <p className={`text-sm mt-0.5 leading-relaxed ${m.done ? 'text-gray-700' : 'text-gray-400'}`}>{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Bottom trust + CTA */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {/* Trust */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Trust &amp; Privacy</h3>
            <ul className="space-y-2.5">
              {TRUST.map(t => (
                <li key={t} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quiz CTA */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white flex flex-col justify-center">
            <h3 className="text-2xl font-black mb-2">Ready to find your festival?</h3>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              5 questions. Personalised results from 100+ festivals. No account needed.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-all shadow-md self-start"
            >
              Take the quiz — Free
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
