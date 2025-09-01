'use client';
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the popup to avoid SSR issues
const NewsletterPopup = dynamic(
  () => import('./NewsletterPopup'),
  { ssr: false }
);

interface UseNewsletterTriggersProps {
  exitIntentEnabled?: boolean;
  timeBasedEnabled?: boolean;
  scrollBasedEnabled?: boolean;
  timeDelay?: number; // seconds
  scrollPercentage?: number; // 0-100
}

export default function useNewsletterTriggers({
  exitIntentEnabled = true,
  timeBasedEnabled = true,
  scrollBasedEnabled = true,
  timeDelay = 30,
  scrollPercentage = 70
}: UseNewsletterTriggersProps = {}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [trigger, setTrigger] = useState<'exit-intent' | 'time-based' | 'scroll-based' | 'manual'>('manual');
  const [hasShown, setHasShown] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user has already subscribed or dismissed recently
  const shouldShow = useCallback(() => {
    if (!mounted || hasShown) return false;
    
    if (typeof window === 'undefined') return false;
    
    const lastShown = localStorage.getItem('newsletter-last-shown');
    const hasSubscribed = localStorage.getItem('newsletter-subscribed');
    
    if (hasSubscribed) return false;
    
    if (lastShown) {
      const daysSinceShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
      if (daysSinceShown < 7) return false; // Don't show again for 7 days
    }
    
    return true;
  }, [hasShown, mounted]);

  // Exit intent detection
  useEffect(() => {
    if (!mounted || !exitIntentEnabled || !shouldShow() || typeof window === 'undefined') return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setTrigger('exit-intent');
        setIsPopupOpen(true);
        setHasShown(true);
        localStorage.setItem('newsletter-last-shown', Date.now().toString());
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [mounted, exitIntentEnabled, shouldShow]);

  // Time-based trigger
  useEffect(() => {
    if (!mounted || !timeBasedEnabled || !shouldShow()) return;

    const timer = setTimeout(() => {
      if (!hasShown) {
        setTrigger('time-based');
        setIsPopupOpen(true);
        setHasShown(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('newsletter-last-shown', Date.now().toString());
        }
      }
    }, timeDelay * 1000);

    return () => clearTimeout(timer);
  }, [mounted, timeBasedEnabled, timeDelay, shouldShow, hasShown]);

  // Scroll-based trigger
  useEffect(() => {
    if (!mounted || !scrollBasedEnabled || !shouldShow() || typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrolled >= scrollPercentage && !hasShown) {
        setTrigger('scroll-based');
        setIsPopupOpen(true);
        setHasShown(true);
        localStorage.setItem('newsletter-last-shown', Date.now().toString());
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted, scrollBasedEnabled, scrollPercentage, shouldShow, hasShown]);

  const closePopup = () => {
    setIsPopupOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('newsletter-last-shown', Date.now().toString());
    }
  };

  const openManually = () => {
    setTrigger('manual');
    setIsPopupOpen(true);
  };

  return {
    isPopupOpen,
    trigger,
    closePopup,
    openManually,
    NewsletterPopup: () => mounted ? (
      <NewsletterPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        trigger={trigger}
      />
    ) : null
  };
}
