'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ClipboardList, Sparkles, Ticket } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Answer 5 quick questions',
    desc: 'Tell us your music taste, budget, travel style, and vibe. Takes under 2 minutes — no account needed.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Get your personalised matches',
    desc: 'Our algorithm scores 100+ festivals against your profile and ranks them by how well they fit you.',
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    iconColor: 'text-pink-600',
  },
  {
    number: '03',
    icon: Ticket,
    title: 'Plan and book with confidence',
    desc: 'Compare festivals side-by-side, save your bucket list, set ticket alerts, and get straight to the booking page.',
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconColor: 'text-amber-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5 mb-4">
            How it works
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            From &ldquo;I don&rsquo;t know&rdquo; to &ldquo;I&rsquo;m booked&rdquo;<br className="hidden md:block" />
            in under 5 minutes
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            No endless scrolling. No generic top-10 lists. Just the festivals that actually match you.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`relative rounded-3xl p-7 border ${step.bg} ${step.border}`}
            >
              {/* Connector line (desktop only) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-3 w-6 h-0.5 bg-gray-200 z-10" />
              )}

              {/* Step number */}
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br ${step.color} text-white font-extrabold text-sm mb-5 shadow-md`}>
                {step.number}
              </div>

              {/* Icon */}
              <div className="mb-4">
                <step.icon className={`w-7 h-7 ${step.iconColor}`} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-500/30 hover:opacity-95 transition-all duration-200 text-base"
          >
            <Sparkles className="w-5 h-5" />
            Start the Quiz — Free, 2 min
          </Link>
          <p className="mt-3 text-sm text-gray-400">No account. No credit card. Just your perfect festival.</p>
        </motion.div>

      </div>
    </section>
  );
}
