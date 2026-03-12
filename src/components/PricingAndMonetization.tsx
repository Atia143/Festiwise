'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Check, Zap, Building2, ChevronDown } from 'lucide-react';

// ── Tier definitions ───────────────────────────────────────────────────────────

const FREE_FEATURES = [
  'Festival matching quiz - unlimited runs',
  'Browse & filter 100+ curated festivals',
  'Smart Match % badges from your quiz results',
  'Compare up to 3 festivals side-by-side',
  'Save festivals to your Bucket List',
  'Ticket alert email for any festival',
  'Festival DNA share card',
  'Curated collections & expert picks',
  'No account required',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Early ticket alerts - 48h before public',
  'Unlimited festival compare (no 3-cap)',
  'Multi-festival trip planner',
  'Budget tracker across multiple festivals',
  'Calendar export (.ics) for all saved festivals',
  'Downloadable PDF festival dossier',
  'Priority email support',
  'New festival alerts matched to your profile',
];

const BUSINESS_FEATURES = [
  'Featured listing badge on your festival page',
  'Priority placement in relevant search results',
  'Inclusion in curated collections (editorially reviewed)',
  'Featured spot in quiz results for matching users',
  'Monthly performance report (views, clicks, alerts)',
  'Dedicated account manager',
  'Custom UTM tracking on all ticket links',
  'Early access to new product features',
];

const FAQ = [
  {
    q: 'Is the quiz and browsing always free?',
    a: 'Yes. The core quiz, festival browsing, saving, comparing, and sharing are free and will remain free. Pro adds power-user features for serious festival planners.',
  },
  {
    q: 'Do featured festivals appear higher in quiz results?',
    a: 'Featured status gives priority visibility in search results and collections, but quiz match scores are calculated purely from your answers. We will always label any featured content clearly.',
  },
  {
    q: 'How do ticket affiliate links work?',
    a: 'Some ticket links on FestiWise include affiliate tracking. If you purchase a ticket after clicking, we may earn a small commission at no extra cost to you. This helps keep the platform free.',
  },
  {
    q: 'How do I join the Pro waitlist?',
    a: 'Click "Join Pro Waitlist" and enter your email. We will reach out personally once we open the beta - early waitlist members get a discounted launch price.',
  },
  {
    q: 'Can I apply for a Business listing before you launch Pro?',
    a: 'Yes. Visit the "For Festival Organizers" page or click "Apply for Featured Listing" below. We are onboarding our first batch of featured festivals now.',
  },
];

// ── Waitlist form ──────────────────────────────────────────────────────────────

function WaitlistForm({ tier }: { tier: 'pro' | 'business' }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const label = tier === 'pro' ? 'Pro' : 'Business';
  const subject = tier === 'pro'
    ? 'FestiWise Pro - Early Access Waitlist'
    : 'FestiWise Business - Featured Listing Interest';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          from_name: name || 'Waitlist signup',
          email,
          subject,
          message: `${label} waitlist signup.\n\nName: ${name}\nEmail: ${email}\nTier: ${label}\nTimestamp: ${new Date().toISOString()}`,
          botcheck: '',
          _subject: tier === 'pro'
            ? `You're on the FestiWise Pro waitlist`
            : `We received your FestiWise Business inquiry`,
          _autoresponse: tier === 'pro'
            ? `Thanks for joining the FestiWise Pro waitlist! We're onboarding our first 100 members now. We'll reach out shortly with early access details and a special launch price. - The FestiWise Team`
            : `Thanks for your interest in a FestiWise Business listing! Our team will reach out within 48 hours to discuss your festival and how we can maximise your visibility. -The FestiWise Team`,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
      if (data.success) { setEmail(''); setName(''); }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-2xl px-5 py-4">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-green-300 text-sm">You&apos;re on the list!</p>
          <p className="text-green-400/70 text-xs">We&apos;ll be in touch within 48 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={tier === 'business' ? 'Festival name or your name' : 'Your name (optional)'}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
      />
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-base focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all min-h-[44px] touch-manipulation ${
            tier === 'pro'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 hover:opacity-90'
          } disabled:opacity-40`}
        >
          {status === 'loading' ? '…' : tier === 'pro' ? 'Join Waitlist' : 'Apply Now'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-xs">Something went wrong - please try again.</p>
      )}
    </form>
  );
}

// ── FAQ accordion ──────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-white font-medium text-sm touch-manipulation"
      >
        {q}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0 ml-3" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-white/50 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PricingAndMonetization() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-white/60 text-xs font-semibold uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3 text-yellow-400" />
            Plans &amp; Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
            The festival platform<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">built for obsessives.</span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Free for festival-goers. Powerful upgrades for power users. Direct access to a growing community of festival enthusiasts for organizers.
          </p>
        </motion.div>

        {/* Tier cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">

          {/* ── Free ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-7 flex flex-col"
          >
            <div className="mb-6">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Free</p>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-white/40 text-sm">/ forever</span>
              </div>
              <p className="text-white/50 text-sm">Everything you need to discover your perfect festival.</p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-8">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/quiz"
              className="block text-center py-3 rounded-xl border border-white/20 text-white/70 font-semibold text-sm hover:bg-white/5 transition-colors touch-manipulation"
            >
              Start the Quiz
            </Link>
          </motion.div>

          {/* ── Pro ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-gradient-to-b from-purple-900/70 to-pink-900/50 border-2 border-purple-500/50 rounded-3xl p-7 flex flex-col shadow-2xl shadow-purple-500/20"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                Most Popular
              </span>
            </div>
            <div className="mb-6">
              <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Pro</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-white">$9</span>
                <span className="text-white/40 text-sm">/ month</span>
              </div>
              <p className="text-white/40 text-xs mb-3">or $79/year - save 27%</p>
              <p className="text-white/60 text-sm">For serious festival planners who go to 2+ events a year.</p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-6">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <p className="text-xs text-center text-purple-300/70 font-medium">
                Pro is in development -join the waitlist for early access &amp; a launch discount.
              </p>
              <WaitlistForm tier="pro" />
            </div>
          </motion.div>

          {/* ── Business ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-yellow-500/30 rounded-3xl p-7 flex flex-col"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-yellow-400" />
                <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Business</p>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-white">Custom</span>
              </div>
              <p className="text-white/40 text-xs mb-3">Pricing based on your festival's size and goals</p>
              <p className="text-white/50 text-sm">For festival organizers who want direct access to their ideal audience.</p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-6">
              {BUSINESS_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                  <Check className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <Link
                href="/for-festivals#contact"
                className="block text-center py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold text-sm hover:opacity-90 transition-opacity touch-manipulation"
              >
                Get a Custom Quote →
              </Link>
              <p className="text-center text-white/30 text-xs">Free to inquire · Reply within 24h</p>
            </div>
          </motion.div>
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-6 mb-20 text-center"
        >
          {[
            { n: '100+', label: 'Curated festivals' },
            { n: '8', label: 'Editorial collections' },
            { n: '88', label: 'Genre × region pages' },
          ].map(({ n, label }) => (
            <div key={label} className="bg-white/3 border border-white/5 rounded-2xl py-6">
              <p className="text-3xl font-black text-white mb-1">{n}</p>
              <p className="text-white/40 text-xs">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Affiliate disclosure */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-16 text-center"
        >
          <p className="text-white/40 text-xs leading-relaxed max-w-2xl mx-auto">
            Some ticket links on FestiWise include affiliate tracking codes. If you purchase a ticket after clicking, we may earn a small commission at no extra cost to you. Quiz match scores are calculated solely from your answers - no festival can pay to rank higher in your personal results.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Common questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
