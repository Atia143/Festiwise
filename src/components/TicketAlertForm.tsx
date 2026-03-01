'use client';

import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useToast } from '@/components/Toast/ToastProvider';

interface Props {
  festivalName: string;
  festivalId: string;
}

export default function TicketAlertForm({ festivalName, festivalId }: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState('loading');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email,
          subject: `Ticket Alert Request — ${festivalName}`,
          from_name: 'FestiWise Alerts',
          message: `${email} wants to be alerted when ${festivalName} tickets go on sale.\n\nFestival ID: ${festivalId}\nTimestamp: ${new Date().toISOString()}`,
          _cc: email,
          _subject: `You're on the alert list for ${festivalName}`,
          _autoresponse: `You're on the list! We'll notify you the moment ${festivalName} tickets go on sale.`,
          botcheck: '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setState('success');
        setEmail('');
        addToast(`Alert set! We'll email you when ${festivalName} tickets drop.`, 'success', 5000);
      } else {
        setState('idle');
        addToast('Something went wrong. Please try again.', 'error');
      }
    } catch {
      setState('idle');
      addToast('Something went wrong. Please try again.', 'error');
    }
  };

  if (state === 'success') {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-green-900 text-sm">You&apos;re on the list!</p>
          <p className="text-green-700 text-xs mt-0.5">We&apos;ll email you the moment {festivalName} tickets drop.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        aria-label="Email address for ticket alerts"
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none text-sm transition-all"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm whitespace-nowrap"
      >
        <Bell className="w-4 h-4" />
        {state === 'loading' ? 'Setting alert...' : 'Alert Me'}
      </button>
    </form>
  );
}
