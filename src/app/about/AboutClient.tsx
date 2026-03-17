'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ChevronRight, ArrowRight } from 'lucide-react';

const STATS = [
  { value: '100+', label: 'Curated Festivals' },
  { value: '24',   label: 'Countries Covered'  },
  { value: '5',    label: 'Quiz Questions'      },
  { value: '376+', label: 'Pages Indexed'       },
];

const STEPS = [
  {
    n: '01',
    title: 'Answer 5 questions',
    body: 'Tell us your music genres, budget, vibe, region, and timing. No account needed.',
  },
  {
    n: '02',
    title: 'Every festival is scored',
    body: 'Each of 100+ festivals is scored against your answers in under a second. Closer match = higher score.',
  },
  {
    n: '03',
    title: 'See your ranked results',
    body: 'Results sorted by match score. Save favourites, compare festivals, or set ticket alerts.',
  },
];

const VALUES = [
  { title: 'Quiz-first rankings',     body: 'Festival rankings are determined entirely by your quiz answers. No festival can pay to appear higher in your results.' },
  { title: 'No account required',     body: 'Take the quiz, browse festivals, save favourites — all without creating an account. Your quiz answers are never stored on our servers.' },
  { title: 'Honest about revenue',    body: 'Some ticket links may earn a small referral fee at no extra cost to you. A Pro tier is available for power users. The core quiz and database are free.' },
  { title: 'No fake data',            body: 'Festival information is sourced from official festival websites and public records. We do not fabricate ratings, attendance figures, or reviews.' },
  { title: 'No display ads',          body: 'FestiWise does not run display ads or sell ad placements. Every recommendation is based purely on your quiz answers.' },
  { title: 'No spam',                 body: 'If you sign up for the newsletter or ticket alerts, you receive only what you asked for. Unsubscribe anytime with one click.' },
];

const MILESTONES = [
  { year: '2024', done: true,  text: 'FestiWise founded — built to solve the frustrating problem of choosing the right festival while travelling.' },
  { year: '2025', done: true,  text: 'Quiz scoring algorithm built — ranks 100+ festivals against your answers in under a second.' },
  { year: '2025', done: true,  text: 'Festival database reaches 100+ curated entries across 24 countries.' },
  { year: '2026', done: true,  text: 'Search, city pages, comparison pages, best-of lists, international (ES/DE/FR) — 376+ static pages indexed.' },
  { year: 'Next', done: false, text: 'Native iOS and Android app — quiz, saved festivals, and ticket alerts in your pocket.' },
  { year: 'Next', done: false, text: 'More festivals, more regions, and deeper partner integrations with ticket platforms.' },
];

const TRUST = [
  'Quiz answers processed locally — not stored on our servers',
  'No personal data sold or shared with third parties',
  'Some ticket links may earn a small referral fee at no cost to you',
  'Festival rankings are never influenced by payments',
  'No display ads, no sponsored content, no paid placements',
];

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-16 sm:py-20 border-b border-gray-100 last:border-0">
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-purple-600 text-xs font-bold uppercase tracking-widest mb-3">{children}</p>
  );
}

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <div className="bg-gray-950 text-white px-4 py-20 sm:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-4">About FestiWise</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            Built to solve one{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              specific problem.
            </span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Finding the right music festival is overwhelming. Too many options, too much hype, no personalisation.
            FestiWise matches you to the festivals that genuinely fit — based on your answers, not what&apos;s trending.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl text-sm"
          >
            Try the quiz — free, 2 min
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
          {STATS.map(s => (
            <div key={s.label} className="px-8 py-8 text-center">
              <div className="text-3xl font-black text-gray-900 mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">

        {/* Why */}
        <Section id="story">
          <SectionLabel>The story</SectionLabel>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">
                Why FestiWise exists
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  There are thousands of music festivals worldwide. Finding the right one means digging through
                  overwhelming Google results, social media hype, and friends&apos; recommendations that don&apos;t
                  account for your budget, music taste, or travel constraints.
                </p>
                <p>
                  FestiWise was built in 2024 to solve that. Answer 5 questions — we score 100+ curated festivals
                  against your answers and show you the ones that genuinely fit.
                </p>
                <p className="font-semibold text-gray-800">
                  No account. No ads. Rankings are never for sale.
                </p>
              </div>
            </div>

            {/* Founder card */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-7">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  YA
                </div>
                <div>
                  <p className="font-bold text-gray-900">Yuval Atia</p>
                  <p className="text-purple-600 text-sm">Founder</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">
                Festival enthusiast who built FestiWise to solve his own problem of finding the right festival to attend.
                Designed, built, and maintained as a solo project.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Festival Curation', 'Product', 'Music'].map(s => (
                  <span key={s} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* How it works */}
        <Section id="how-it-works">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Not AI. A scoring algorithm.
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl leading-relaxed">
            Here&apos;s exactly what happens when you take the quiz.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {STEPS.map(s => (
              <div key={s.n} className="relative">
                <div className="text-5xl font-black text-gray-100 mb-2 leading-none">{s.n}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl px-5 py-4 text-sm text-purple-800 leading-relaxed">
            <strong>On data quality:</strong> Festival information (genres, cost, location, dates, vibe) is sourced from
            official festival websites and publicly available records. Ratings and reviews come from FestiWise users
            and are stored locally in your browser.
          </div>
        </Section>

        {/* Values */}
        <Section id="values">
          <SectionLabel>Values</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">What we stand for</h2>
          <p className="text-gray-500 mb-10">
            These are not aspirational statements — they describe how FestiWise operates today.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {VALUES.map(v => (
              <div key={v.title} className="flex gap-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Roadmap */}
        <Section id="roadmap">
          <SectionLabel>Roadmap</SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Journey &amp; what&apos;s next</h2>
          <p className="text-gray-500 mb-10">What&apos;s been built, and what&apos;s coming.</p>
          <div className="max-w-xl space-y-0">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    m.done
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border-2 border-dashed border-gray-300 text-gray-400'
                  }`}>
                    {m.done ? <Check className="w-4 h-4" /> : <ChevronRight className="w-3 h-3" />}
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div className={`w-0.5 h-10 mt-1 ${m.done ? 'bg-purple-200' : 'bg-gray-100'}`} />
                  )}
                </div>
                <div className="pb-10">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${m.done ? 'text-purple-600' : 'text-gray-400'}`}>
                    {m.year}
                  </span>
                  <p className={`text-sm mt-0.5 leading-relaxed ${m.done ? 'text-gray-700' : 'text-gray-400'}`}>
                    {m.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Trust + CTA */}
        <Section id="trust">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-7">
              <h3 className="font-bold text-gray-900 mb-5">Trust &amp; Privacy</h3>
              <ul className="space-y-3">
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

            <div className="bg-gray-950 rounded-3xl p-8 text-white flex flex-col justify-between">
              <div>
                <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-3">Ready?</p>
                <h3 className="text-2xl font-black mb-3 leading-tight">Find your festival in 2 minutes.</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-7">
                  5 questions. Personalised results from 100+ festivals. No account needed.
                </p>
              </div>
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:opacity-90 transition-all self-start text-sm"
              >
                Take the quiz — Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Contribute box */}
          <div className="mt-6 border border-gray-100 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-2">Want to contribute?</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto leading-relaxed">
              If you attend a festival not in our database, have insider tips, or spot something outdated — reach out.
              Festival knowledge from real attendees makes the database better for everyone.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:border-purple-300 hover:text-purple-700 transition-all"
            >
              Contact us
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Section>

      </div>
    </div>
  );
}
