'use client';
import { useState, useEffect } from 'react';
import { useAnalyticsTracker } from '@/lib/analytics-tracker';
import { useToast } from '@/components/Toast/ToastProvider';
import ConfettiBurst from '@/components/ui/ConfettiBurst';

// Server-side key is kept in env; client posts to /api/submit

export default function SimpleNewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { trackSubscribeStart, trackSubscribeSuccess } = useAnalyticsTracker();
  const { addToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !mounted) return;
    
    // Track subscription start
    trackSubscribeStart('blog');
    
    setState('loading');
    
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          subject: '🎪 New Newsletter Subscription',
          from_name: 'FestiWise',
          email: email,
          message: 'New newsletter subscription',
          _template: 'table',
          _cc: email,
          _subject: 'Welcome to FestiWise! 🎵',
          _autoresponse: 'Thanks for subscribing to FestiWise! We\'ll keep you updated with the best festival recommendations.',
          botcheck: '',
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setState('success');
        setEmail('');
        trackSubscribeSuccess('blog');
        addToast('Welcome to the Insider Club! Check your inbox.', 'success', 4000);
        // Trigger confetti burst
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1200);
        setTimeout(() => setState('idle'), 10000);
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 sm:p-10 my-8 sm:my-12">
      <div className="text-center max-w-md mx-auto relative">
        {/* Confetti burst anchored to the submit button area */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative w-0 h-0">
            <ConfettiBurst show={showConfetti} radius={120} />
          </div>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">📧</span>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Festival picks in your inbox.
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Get personalized festival recommendations and new additions to our database — straight to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all outline-none text-base"
            required
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={state === 'loading'}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 active:scale-95 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state === 'loading' ? 'Joining the club...' :
             state === 'success' ? 'Welcome to the Insider Club!' :
             'Join the Insider Club'}
          </button>
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
    </div>
  );
}
