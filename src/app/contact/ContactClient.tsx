'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const TOPICS = [
  { value: 'general',             label: 'General question' },
  { value: 'festival-suggestion', label: 'Suggest a festival' },
  { value: 'bug-report',          label: 'Bug report' },
  { value: 'feature-request',     label: 'Feature idea' },
  { value: 'partnership',         label: 'Partnership / business' },
  { value: 'press',               label: 'Press & media' },
  { value: 'other',               label: 'Something else' },
];

const WHAT_NEXT = [
  {
    step: '1',
    title: 'We read it',
    desc: 'Every message lands in our inbox personally — no support bots.',
  },
  {
    step: '2',
    title: 'We reply',
    desc: 'Usually within 2–3 business days. Check spam if you don\'t hear back.',
  },
  {
    step: '3',
    title: 'We act on it',
    desc: 'Bug reports and feature ideas go directly into our roadmap.',
  },
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const canSubmit = form.name && form.email && form.topic && form.message.length >= 10;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          from_name: form.name,
          email: form.email,
          subject: `[FestiWise Contact] ${form.topic} — from ${form.name}`,
          message: form.message,
          _template: 'box',
          _cc: form.email,
          _subject: "Got your message — FestiWise",
          _autoresponse: `Hi ${form.name},\n\nThanks for reaching out. We've received your message and will get back to you within 2–3 business days.\n\nYour topic: ${form.topic}\n\nWhile you wait, explore festivals at https://getfestiwise.com\n\n— The FestiWise Team`,
          botcheck: '',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setForm({ name: '', email: '', topic: '', message: '' });
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-gradient-to-br from-purple-50 to-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-purple-600 text-xs font-semibold uppercase tracking-widest mb-3">Contact</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Say something.
            </h1>
            <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
              Found a bug, have a festival to suggest, or just want to say hi — we read every message.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Form — 3 cols */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 px-8 bg-purple-50 rounded-3xl border border-purple-100"
                >
                  <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Message sent.</h2>
                  <p className="text-gray-500 text-base max-w-sm mx-auto leading-relaxed">
                    We&apos;ll get back to you within 2–3 business days. Check your inbox for a confirmation.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-sm text-purple-600 font-medium hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="c-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Name
                      </label>
                      <input
                        id="c-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 text-gray-900 placeholder-gray-400 text-base transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="c-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                      </label>
                      <input
                        id="c-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={update('email')}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 text-gray-900 placeholder-gray-400 text-base transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="c-topic" className="block text-sm font-medium text-gray-700 mb-1.5">
                      What&apos;s this about?
                    </label>
                    <select
                      id="c-topic"
                      required
                      value={form.topic}
                      onChange={update('topic')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 text-gray-900 bg-white text-base transition-all"
                    >
                      <option value="">Select a topic</option>
                      {TOPICS.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="c-message" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="c-message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Tell us anything..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 text-gray-900 placeholder-gray-400 text-base resize-y transition-all"
                    />
                  </div>

                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-600 text-sm"
                    >
                      {errorMsg}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit || status === 'loading'}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base transition-all hover:from-purple-700 hover:to-pink-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-100"
                  >
                    {status === 'loading' ? 'Sending...' : 'Send message'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar — 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2 space-y-10"
          >
            {/* What happens next */}
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-6">What happens next</h3>
              <ol className="space-y-6">
                {WHAT_NEXT.map(item => (
                  <li key={item.step} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Good to know */}
            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-base font-bold text-gray-900 mb-4">Good to know</h3>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>
                  Festival suggestions take a few weeks to review — we verify all details before publishing.
                </p>
                <p>
                  For partnerships or press, mention it in the topic dropdown so we can prioritise your message.
                </p>
                <p>
                  Common questions are answered in our{' '}
                  <a href="/faq" className="text-purple-600 hover:underline font-medium">
                    FAQ
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* FAQ CTA */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Need a quick answer?</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Check our FAQ for instant answers about festivals, recommendations, and how FestiWise works.
              </p>
              <a
                href="/faq"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700"
              >
                Visit FAQ
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
