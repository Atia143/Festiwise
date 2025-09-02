'use client';

import { useState } from 'react';
import { useNewsletterAnalytics } from '@/hooks/useNewsletterAnalytics';

const WEB3FORMS_ACCESS_KEY = '00cc72fb-5e1a-4b24-b293-38bbdb1a9f33';

interface NewsletterSignupHookProps {
  placement: 'hero' | 'footer' | 'popup' | 'quiz-results' | 'other';
}

/**
 * Custom hook to handle newsletter submissions with analytics tracking
 */
export default function useNewsletterSignup({ placement }: NewsletterSignupHookProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { submissionState, handleNewsletterSubmit, resetSubmissionState } = useNewsletterAnalytics();
  
  const submitNewsletterForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    const result = await handleNewsletterSubmit(email, placement, async (email: string) => {
      // Call the actual API
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `🎪 Newsletter Signup - ${placement}`,
          from_name: 'FestiWise',
          name: name || 'Festival Lover',
          email: email,
          message: `New newsletter subscription from ${placement} placement`,
          signup_source: placement,
          _template: 'table',
          _cc: email,
          _subject: 'Welcome to FestiWise! 🎵 Your Festival Journey Starts Here',
          _autoresponse: `Welcome to the FestiWise family, ${name || 'Festival Lover'}! 🎉

You've just unlocked access to:
🎪 Exclusive early-bird festival discounts
🎵 Personalized festival recommendations
🚀 Insider tips from festival veterans
📅 New festival announcements before anyone else
🎁 Monthly curated festival guides

Your next unforgettable experience is just one email away!

Rock on,
The FestiWise Team`,
          botcheck: '',
        })
      });
      
      const data = await res.json();
      return { success: !!data.success };
    });
    
    if (result) {
      setEmail('');
      setName('');
    }
  };
  
  return {
    email,
    setEmail,
    name,
    setName,
    submissionState,
    submitNewsletterForm,
    resetSubmissionState
  };
}
