'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { dictionary } from '@/lib/dictionary';

export default function EnhancedNewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const t = dictionary.en.newsletter;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: name || 'Anonymous',
          subject: '🎪 Newsletter Subscription - FestiWise',
          message: `New newsletter subscription:\n\nEmail: ${email}\nName: ${name || 'Not provided'}\nSource: Homepage Newsletter Form\nTimestamp: ${new Date().toLocaleString()}`,
          from_name: 'FestiWise Newsletter',
          to_name: 'FestiWise Team'
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage(t.successMessage);
        setEmail('');
        setName('');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (_err) {
      setStatus('error');
      setMessage(t.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-purple-600 to-indigo-600">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <div className="flex -space-x-1">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
              <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
              <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-white/90 text-sm font-medium">25,000+ festival hunters</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-white/90 mb-6">
            {t.subtitle}
          </p>

          {/* Value Propositions */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-green-300">✓</span>
              <span className="text-white/90">Early-bird ticket alerts</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-green-300">✓</span>
              <span className="text-white/90">Exclusive lineup reveals</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-green-300">✓</span>
              <span className="text-white/90">Zero spam promise</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white transition-all"
                  aria-describedby={status !== 'idle' ? 'newsletter-status' : undefined}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="newsletter-name" className="sr-only">
                  Name (optional)
                </label>
                <input
                  id="newsletter-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white transition-all"
                />
              </div>
            </div>
            
            <motion.button
              type="submit"
              disabled={isSubmitting || !email}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className="w-full sm:w-auto px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-base"
              aria-label={isSubmitting ? 'Submitting newsletter signup' : 'Sign up for newsletter'}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing you up...
                </span>
              ) : (
                t.submitButton
              )}
            </motion.button>

            {/* Status message with aria-live */}
            <div
              id="newsletter-status"
              aria-live="polite"
              aria-atomic="true"
              className="min-h-[1.5rem]"
            >
              {status === 'success' && (
                <p className="text-green-200 text-sm">{message}</p>
              )}
              {status === 'error' && (
                <p className="text-red-200 text-sm">{message}</p>
              )}
            </div>

            <p className="text-sm text-white/70">
              {t.privacy.split('Privacy Policy')[0]}
              <Link href="/privacy" className="underline hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
