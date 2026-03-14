'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          subject: 'FestiWise Newsletter Sign-up',
          from_name: 'FestiWise',
          name: 'Festival Lover',
          email,
          message: `New newsletter subscription: ${email}`,
          _template: 'table',
          _cc: email,
          _subject: "You're in — FestiWise picks incoming",
          _autoresponse: `You're on the list.\n\nExpect 2 emails a month:\n- Lineup drops and ticket alerts before they sell out\n- Hidden gem festivals worth your time\n- Practical planning guides\n\nMeanwhile, find your perfect festival now:\nhttps://getfestiwise.com/quiz\n\n— The FestiWise Team`,
          botcheck: '',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 12000);
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Check your connection and try again.');
    }
  }

  return (
    <section className="bg-gray-950 py-20 px-4">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Festival Intel
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Festivals worth your inbox.
          </h2>
          <p className="text-gray-400 text-base mb-10 leading-relaxed">
            Two emails a month. Lineup drops, ticket alerts, and hidden gems you probably haven&apos;t heard of.
          </p>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 px-6 bg-white/5 border border-white/10 rounded-2xl"
              >
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-lg">You&apos;re in.</p>
                <p className="text-gray-400 text-sm mt-1">
                  Check your inbox for a welcome message.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={status === 'loading'}
                    aria-label="Email address"
                    className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading' || !email}
                    className="px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all whitespace-nowrap shadow-lg"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2 justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Joining...
                      </span>
                    ) : (
                      'Get the picks'
                    )}
                  </button>
                </div>

                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm"
                  >
                    {errorMsg}
                  </motion.p>
                )}

                <p className="text-gray-600 text-xs">
                  No spam. Unsubscribe any time.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
