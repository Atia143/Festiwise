'use client';

import { useState } from 'react';
import { useNewsletterAnalytics } from '@/hooks/useNewsletterAnalytics';

// Server-side key lives in env; client posts to /api/submit

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
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          subject: `🎪 Newsletter Signup - ${placement}`,
          from_name: 'FestiWise',
          name: name || 'Festival Lover',
          email: email,
          message: `New newsletter subscription from ${placement} placement`,
          signup_source: placement,
          _template: 'table',
          _cc: email,
          _subject: 'Welcome to FestiWise! 🎵 Your Festival Journey Starts Here',
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
