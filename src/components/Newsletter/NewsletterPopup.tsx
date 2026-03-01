'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Gift, Sparkles } from 'lucide-react';

interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'exit-intent' | 'time-based' | 'scroll-based' | 'manual';
}

// Web3Forms key moved to server; client posts to /api/submit

export default function NewsletterPopup({ isOpen, onClose, trigger }: NewsletterPopupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [step, setStep] = useState(1);

  // Different messaging based on trigger
  const getHeadline = () => {
    switch (trigger) {
      case 'exit-intent':
        return "Before you go — get festival picks in your inbox";
      case 'scroll-based':
        return "Get our best festival picks delivered to you";
      case 'time-based':
        return "Ready for your next festival?";
      default:
        return "Stay updated on the best festivals";
    }
  };

  const getSubheadline = () => {
    switch (trigger) {
      case 'exit-intent':
        return "Get personalized festival recommendations and new festival discoveries sent to your inbox.";
      case 'scroll-based':
        return "Get personalized festival recommendations based on your music taste and travel style.";
      case 'time-based':
        return "Discover 100+ curated festivals worldwide and get picks matched to your vibe.";
      default:
        return "Discover the world's best festivals with personalized recommendations.";
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    
    setState('loading');
    
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          subject: `🎪 New Newsletter Signup - ${trigger} trigger`,
          from_name: 'FestiWise',
          name: name || 'Festival Lover',
          email: email,
          message: `New newsletter subscription via ${trigger} popup`,
          signup_source: `popup-${trigger}`,
          _template: 'table',
          _cc: email,
          _subject: 'Welcome to FestiWise! Your Festival Journey Starts Now 🎵',
          _autoresponse: `Welcome to FestiWise${name ? `, ${name}` : ''}!

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
        setStep(2);
        // Track conversion
        if (typeof window !== 'undefined' && 'gtag' in window) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).gtag('event', 'newsletter_signup', {
            method: trigger,
            event_category: 'engagement',
            event_label: 'popup_conversion'
          });
        }
        // Auto close after 3 seconds
        setTimeout(() => {
          onClose();
          setStep(1);
          setState('idle');
          setEmail('');
          setName('');
        }, 3000);
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {step === 1 ? (
              <div className="relative">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 opacity-10" />
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <Mail className="w-8 h-8 text-white" />
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1 -right-1"
                      >
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Headline */}
                  <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
                    {getHeadline()}
                  </h2>

                  {/* Subheadline */}
                  <p className="text-gray-600 text-center mb-6 leading-relaxed">
                    {getSubheadline()}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3 mb-6">
                    {[
                      "🎯 Personalized festival recommendations",
                      "🎪 New festivals added to our database",
                      "📅 Festival planning tips and guides",
                      "🔍 100+ curated festivals worldwide"
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <span className="mr-2">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Form */}
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all outline-none"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={state === 'loading'}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {state === 'loading' ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Joining...
                        </div>
                      ) : (
                        <>
                          <Gift className="inline mr-2" size={16} />
                          Get My Festival Updates
                        </>
                      )}
                    </motion.button>
                  </form>

                  {state === 'error' && (
                    <p className="text-red-500 text-sm text-center mt-3">
                      Something went wrong. Please try again!
                    </p>
                  )}

                  <p className="text-xs text-gray-500 text-center mt-4">
                    No spam ever. Unsubscribe anytime with one click.
                  </p>
                </div>
              </div>
            ) : (
              /* Success Step */
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <motion.div
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Welcome to the family! 🎉
                </h3>
                <p className="text-gray-600 mb-6">
                  Check your email for your first festival recommendations.
                </p>
                <div className="text-4xl mb-4">🎪🎵🎸</div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
