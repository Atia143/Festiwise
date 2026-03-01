'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Server will provide the access key; client posts to /api/submit

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    
    setState('loading');
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          subject: '🎪 New FestiWise Newsletter Subscription',
          from_name: 'FestiWise',
          name: name || 'Festival Lover',
          email: email,
          message: `New newsletter subscription from ${name || 'a festival enthusiast'}`,
          _template: 'box',
          _cc: email,
          to_name: 'FestiWise Team',
          _captcha: false,
          _next: window.location.href,
          _subject: 'Welcome to FestiWise! 🎵 Your Festival Journey Starts Here',
          _autoresponse: `Welcome to FestiWise!

You'll now get:

🎯 Personalized festival recommendations
🎪 New festivals added to our database
📅 Festival tips and planning guides

Take our 2-minute quiz to find your perfect festival match: https://getfestiwise.com/quiz

The FestiWise Team`,
          botcheck: '',
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setState('success');
        setEmail('');
        setName('');
        setTimeout(() => setState('idle'), 12000);
      } else {
        setState('error');
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (_error) {
      setState('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  }

  return (
    <section className="relative py-24 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-800/30 to-indigo-900/40" />
        
        {/* Floating Particles */}
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 bg-yellow-400/20 rounded-full blur-xl"
          animate={{
            y: [-20, 20],
            x: [-10, 10],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-pink-400/20 rounded-full blur-xl"
          animate={{
            y: [20, -20],
            x: [10, -10],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"
          animate={{
            y: [10, -30],
            x: [-5, 15],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Icon Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-pink-400/30 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <div className="relative w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-3xl"
              >
                📧
              </motion.div>
            </div>
            
            {/* Sparkle Effects */}
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
            <motion.div
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1.5
              }}
            />
          </div>
        </motion.div>

        {/* Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
            Join Festival Insiders!
          </h2>
          <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mb-6">
            Get exclusive festival recommendations, early-bird alerts, and insider tips delivered to your inbox
          </p>
          
          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm text-white/80">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-yellow-400">🎯</span>
              <span>Personalized Picks</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-green-400">💰</span>
              <span>Exclusive Discounts</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-pink-400">🚀</span>
              <span>Early Access</span>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto space-y-4"
        >
          {/* Name Input */}
          <div className="relative">
            <label htmlFor="newsletter-name" className="sr-only">
              Your name (optional)
            </label>
            <input
              id="newsletter-name"
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={state === 'loading' || state === 'success'}
              className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-lg disabled:opacity-50"
              aria-describedby="newsletter-name-description"
            />
            <div id="newsletter-name-description" className="sr-only">
              Optional field for your name to personalize emails
            </div>
          </div>

          {/* Email Input */}
          <div className="relative">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address (required)
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={state === 'loading' || state === 'success'}
              className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-lg disabled:opacity-50"
              aria-describedby="newsletter-email-description"
              aria-invalid={state === 'error'}
            />
            <div id="newsletter-email-description" className="sr-only">
              Your email address to receive festival recommendations and updates
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={state === 'loading' || state === 'success'}
            className="w-full px-8 py-4 rounded-2xl bg-white text-purple-600 font-bold text-lg hover:bg-purple-50 disabled:opacity-70 transition-all duration-300 group flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            whileHover={{ scale: state !== 'loading' && state !== 'success' ? 1.02 : 1 }}
            whileTap={{ scale: state !== 'loading' && state !== 'success' ? 0.98 : 1 }}
          >
            <AnimatePresence mode="wait">
              {state === 'loading' ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full"
                  />
                  <span>Subscribing...</span>
                </motion.div>
              ) : state === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-2"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <span>Welcome aboard!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <span>🎵 Get Exclusive Festival Access</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Privacy & Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white/70 text-sm space-y-2"
          >
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-green-400">✓</span>
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-400">🔒</span>
                <span>Your data is safe</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-purple-400">📧</span>
                <span>Unsubscribe anytime</span>
              </div>
            </div>
            <p className="text-xs">
              Join festival lovers who trust FestiWise for the best music experiences
            </p>
          </motion.div>

          {/* Error Display */}
          {state === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm"
            >
              <p className="text-red-100 text-sm">{errorMessage}</p>
              <button
                type="button"
                onClick={() => setState('idle')}
                className="mt-2 text-red-200 hover:text-white underline text-xs"
              >
                Try again
              </button>
            </motion.div>
          )}

          {/* Success Message Details */}
          {state === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 backdrop-blur-sm"
            >
              <p className="text-green-100 text-sm mb-2">
                🎉 You're all set! Check your email for a welcome message with exclusive content.
              </p>
              <p className="text-green-200 text-xs">
                Don't see it? Check your spam folder and add us to your contacts.
              </p>
            </motion.div>
          )}
        </motion.form>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-white/60 text-xs"
        >
          <div className="flex items-center gap-2">
          </div>
        </motion.div>
      </div>
    </section>
  );
}
