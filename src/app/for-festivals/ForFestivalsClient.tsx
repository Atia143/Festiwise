'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BarChart3,
  Star,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Mail,
  Building2,
  Zap,
  Globe,
} from 'lucide-react';

// ── Contact form ────────────────────────────────────────────────────────────

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [festival, setFestival] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: name,
          email,
          subject: `Festival Partnership Inquiry - ${festival}`,
          message: message || '(No additional message)',
          festival_name: festival,
          _autoresponse: `Hi ${name},\n\nThanks for reaching out about listing ${festival} on FestiWise!\n\nWe've received your inquiry and our partnerships team will get back to you within 24 hours with availability and next steps.\n\nIn the meantime, you can learn more about our audience at https://getfestiwise.com/for-festivals\n\nBest,\nThe FestiWise Team`,
          botcheck: '',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError('Something went wrong. Please try emailing us directly at hello@getfestiwise.com');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Message received!</h3>
        <p className="text-gray-600">
          We&apos;ll get back to you within 24 hours with everything you need to get started.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Alex Smith"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work email</label>
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="alex@yourfestival.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Festival name</label>
        <input
          required
          value={festival}
          onChange={e => setFestival(e.target.value)}
          placeholder="Sunburst Music Festival"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tell us about your festival{' '}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Location, size, dates, goals..."
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-60 text-base flex items-center justify-center gap-2"
      >
        {loading ? 'Sending...' : (
          <>
            <span>Get Partnership Details</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-gray-400">
        No commitment. We&apos;ll send availability, pricing, and examples within 24h.
      </p>
    </form>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Star,
    title: 'Featured Placement',
    desc: 'Your festival appears at the top of relevant search results and the "For You" feed for matched users.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: "See impressions, clicks, wishlist saves, and quiz match rates. Know exactly who's considering your event.",
  },
  {
    icon: Users,
    title: 'Qualified Lead Capture',
    desc: 'When fans sign up for ticket alerts for your festival, you get their contact info directly.',
  },
  {
    icon: TrendingUp,
    title: 'Priority Quiz Matching',
    desc: 'Our algorithm scores and surfaces your festival to users whose taste profile matches yours.',
  },
  {
    icon: Globe,
    title: 'SEO Landing Page',
    desc: 'A dedicated, SEO-optimized festival page with your full lineup, location, and booking links.',
  },
  {
    icon: Zap,
    title: 'Urgency Badges',
    desc: '"Selling Fast" and "Early Bird Ending" badges surfaced to users near your sales deadlines.',
  },
];

const STATS = [
  { value: '50K+', label: 'Monthly active users' },
  { value: '100+', label: 'Festivals in database' },
  { value: '2 min', label: 'Average quiz completion' },
  { value: '87%', label: 'Users take action after quiz' },
];

const PLANS = [
  {
    name: 'Standard Listing',
    price: 'Free',
    period: '',
    desc: 'Basic presence in our festival database.',
    features: [
      'Festival detail page',
      'Quiz matching',
      'User reviews',
    ],
    cta: null,
    highlight: false,
  },
  {
    name: 'Business Partnership',
    price: 'Custom',
    period: '',
    priceSub: 'Tailored to your festival\'s size and goals',
    desc: 'Full commercial partnership with analytics and lead capture.',
    features: [
      'Featured placement in search & feeds',
      'Real-time analytics dashboard',
      'Qualified lead capture',
      'Priority quiz matching',
      'Custom urgency badges',
      'Dedicated account manager',
      'Monthly performance report',
    ],
    cta: 'Get a Custom Quote',
    highlight: true,
  },
];

const FAQS = [
  {
    q: 'How is FestiWise different from social ads?',
    a: "Unlike Facebook or Instagram ads, every user on FestiWise is actively searching for festivals. There's no wasted spend on people who don't care about live music. Our audience is self-selected, high-intent, and ready to buy.",
  },
  {
    q: 'How does quiz matching work for featured festivals?',
    a: 'Our algorithm already matches users to festivals based on genre, budget, location, and vibes. Business partners receive priority placement - your festival surfaces higher in results for users whose profile matches yours.',
  },
  {
    q: 'What is the minimum commitment?',
    a: 'Month-to-month. No annual contract required. We prefer earning your business every month by delivering results.',
  },
  {
    q: 'Can we track ROI?',
    a: "Yes. Your analytics dashboard shows click-throughs, wishlist adds, ticket alert signups, and estimated revenue influenced. We'll also provide UTM-tagged links for your booking page so you can track conversions in your own analytics.",
  },
];

// ── Main component ──────────────────────────────────────────────────────────

export default function ForFestivalsClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <Building2 className="w-4 h-4" />
              For Festival Organizers
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Reach fans who are{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                already looking
              </span>{' '}
              for you
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              FestiWise users take a personality quiz to find their perfect festival. Every visitor
              is high-intent. Get featured, capture leads, and fill your lineup with the right
              crowd.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity text-lg"
              >
                <Mail className="w-5 h-5" />
                Apply for Partnership
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors text-lg"
              >
                View Pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-50 border-b border-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {s.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Everything you need to fill seats
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Our Business partnership puts your festival in front of the right audience at every
              stage of their decision journey.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing comparison */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Choose your level of partnership</h2>
            <p className="text-gray-500">Every festival is different. Business pricing is tailored to your event's size, reach, and goals.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={`rounded-3xl p-8 border-2 ${
                  plan.highlight
                    ? 'border-purple-500 bg-white shadow-xl shadow-purple-100'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.highlight && (
                  <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    RECOMMENDED
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-500">{plan.period}</span>}
                </div>
                {'priceSub' in plan && plan.priceSub && (
                  <p className="text-xs text-gray-400 mb-2">{plan.priceSub}</p>
                )}
                <p className="text-sm text-gray-500 mb-6">{plan.desc}</p>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                {plan.cta ? (
                  <a
                    href="#contact"
                    className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href="/festivals"
                    className="block w-full text-center border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    View the database
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">From inquiry to live in under 48 hours.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Apply', desc: "Fill out the form below. We'll review your festival and confirm availability within 24 hours." },
              { step: '02', title: 'Onboard', desc: 'We set up your featured listing, analytics tracking, and priority quiz matching. Live in 24h.' },
              { step: '03', title: 'Grow', desc: 'Watch impressions, saves, and ticket alert signups roll in. Monthly report included.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-extrabold text-purple-600">{step.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Apply for a partnership
            </h2>
            <p className="text-gray-500">
              Tell us about your festival and we&apos;ll send availability, examples, and next
              steps - no commitment required.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">
            Common questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 font-semibold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-gray-400 ml-4 flex-shrink-0">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-4">Ready to fill your festival?</h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">
          Join the waitlist today. We&apos;re onboarding new partners every week.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-8 py-4 rounded-2xl hover:bg-purple-50 transition-colors text-lg"
        >
          <Mail className="w-5 h-5" />
          Apply Now - Free to Inquire
        </a>
      </section>
    </div>
  );
}
