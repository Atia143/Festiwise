'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Sparkles } from 'lucide-react';

interface NewsletterBannerProps {
  variant: 'top-bar' | 'inline' | 'sticky-bottom' | 'festival-card';
  context?: string;
  onSubscribe?: () => void;
}

const WEB3FORMS_ACCESS_KEY = '00cc72fb-5e1a-4b24-b293-38bbdb1a9f33';

export default function NewsletterBanner({ variant, context = '', onSubscribe }: NewsletterBannerProps) {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [state, setState] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [mounted, setMounted] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if banner was recently dismissed
  useEffect(() => {
    if (!mounted) return;
    
    if (variant === 'top-bar' || variant === 'sticky-bottom') {
      const lastDismissed = localStorage.getItem(`newsletter-dismissed-${variant}`);
      if (lastDismissed) {
        const hoursSinceDismissed = (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60);
        if (hoursSinceDismissed < 24) {
          setIsVisible(false);
        }
      }
    }
  }, [variant, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setState('loading');
    
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          access_key: '00cc72fb-5e1a-4b24-b293-38bbdb1a9f33',
          subject: `🎪 Newsletter Signup - ${variant} banner`,
          from_name: 'FestiWise',
          email: email,
          message: `Newsletter subscription from ${variant} banner${context ? ` (${context})` : ''}`,
          signup_source: `banner-${variant}`,
          _template: 'table',
          _cc: email,
          _subject: 'Welcome to FestiWise! 🎵',
          _autoresponse: 'Welcome to FestiWise! Get ready for amazing festival recommendations!',
          botcheck: '',
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setState('success');
        setEmail('');
        onSubscribe?.();
        
        // Track conversion
        if (mounted && typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'newsletter_signup', {
            method: variant,
            context: context,
            event_category: 'engagement'
          });
        }
        
        // Auto-hide after success
        setTimeout(() => {
          setState('idle');
          if (variant === 'top-bar') setIsVisible(false);
        }, 3000);
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem(`newsletter-dismissed-${variant}`, Date.now().toString());
    }
  };

  // Don't render on server or if not visible
  if (!mounted || !isVisible) return null;

  // Top Bar Variant
  if (variant === 'top-bar') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 relative z-40"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">🎪 Join 50,000+ festival lovers!</span>
              <span className="hidden sm:inline text-purple-100">Get exclusive early-bird deals & personalized recommendations</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-1 text-sm rounded-lg text-gray-900 w-48 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="bg-white text-purple-600 px-4 py-1 text-sm font-medium rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
                >
                  {state === 'loading' ? '...' : state === 'success' ? '✓' : 'Join'}
                </button>
              </form>
              
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Inline Content Variant
  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-8 my-12"
      >
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Never Miss a Beat! 🎵
          </h3>
          <p className="text-gray-600 mb-6">
            Get personalized festival recommendations and exclusive early-bird deals delivered to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all outline-none"
              required
            />
            <motion.button
              type="submit"
              disabled={state === 'loading'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {state === 'loading' ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Joining...
                </div>
              ) : state === 'success' ? (
                '🎉 Welcome to the family!'
              ) : (
                <>
                  Get My Festival Updates
                  <ArrowRight className="inline ml-2" size={16} />
                </>
              )}
            </motion.button>
          </form>
          
          {state === 'error' && (
            <p className="text-red-500 text-sm mt-3">
              Something went wrong. Please try again!
            </p>
          )}
          
          <p className="text-xs text-gray-500 mt-4">
            No spam ever. Unsubscribe anytime with one click.
          </p>
        </div>
      </motion.div>
    );
  }

  // Sticky Bottom Variant
  if (variant === 'sticky-bottom') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-purple-200 shadow-2xl"
        >
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">🎪 Love discovering festivals?</p>
                  <p className="text-sm text-gray-600">Join our newsletter for exclusive deals and recommendations!</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all outline-none w-64"
                    required
                  />
                  <button
                    type="submit"
                    disabled={state === 'loading'}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    {state === 'loading' ? '...' : state === 'success' ? '✓ Joined!' : 'Join Free'}
                  </button>
                </form>
                
                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Festival Card Variant (small inline)
  if (variant === 'festival-card') {
    return (
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">📧 Get notified about similar festivals!</p>
            <p className="text-xs text-gray-600">Join 50,000+ festival lovers</p>
          </div>
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none w-32"
              required
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="bg-purple-600 text-white px-3 py-1 text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {state === 'loading' ? '...' : state === 'success' ? '✓' : 'Join'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
