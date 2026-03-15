'use client';

import { useState } from 'react';

export default function SimpleNewsletterForm() {
  const [email, setEmail]   = useState('');
  const [state, setState]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === 'loading') return;
    setState('loading');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          subject:      'New newsletter subscription — FestiWise',
          from_name:    'FestiWise Newsletter',
          email,
          message:      'New newsletter subscription',
          botcheck:     '',
          _cc:          email,
          _subject:     'You\'re on the list — FestiWise',
          _autoresponse: `Hey! You're in.\n\nExpect two emails a month: early lineup drops, ticket alert windows, and hidden-gem festivals you won't find on Google.\n\nMeanwhile, take the quiz: https://getfestiwise.com/quiz\n\n— Yuval, FestiWise`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setState('success');
        setEmail('');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="bg-gray-950 rounded-2xl px-6 py-8 text-center">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-white font-bold">You&apos;re in.</p>
        <p className="text-gray-400 text-sm mt-1">Two emails a month. No spam ever.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 rounded-2xl px-6 py-8">
      <p className="text-white font-bold text-base mb-1">Get festival intel in your inbox.</p>
      <p className="text-gray-400 text-sm mb-5">Two emails a month. Lineup drops, ticket alerts, and hidden gems.</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-label="Email address"
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
        >
          {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>

      {state === 'error' && (
        <p className="text-red-400 text-xs mt-2">Something went wrong. Please try again.</p>
      )}

      <p className="text-gray-600 text-xs mt-3">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
