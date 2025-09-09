'use client';
import { useState, useEffect } from 'react';
import { useAnalyticsTracker } from '@/lib/analytics-tracker';

const WEB3FORMS_ACCESS_KEY = '00cc72fb-5e1a-4b24-b293-38bbdb1a9f33';

export default function SimpleNewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [mounted, setMounted] = useState(false);
  const { trackSubscribeStart, trackSubscribeSuccess } = useAnalyticsTracker();

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
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
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
        // Track subscription success
        trackSubscribeSuccess('blog');
        setTimeout(() => setState('idle'), 3000);
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  };

  if (!mounted) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-8 my-12">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">📧</span>
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
          <button
            type="submit"
            disabled={state === 'loading'}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {state === 'loading' ? 'Joining...' : 
             state === 'success' ? '🎉 Welcome to the family!' : 
             'Get My Festival Updates'}
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
