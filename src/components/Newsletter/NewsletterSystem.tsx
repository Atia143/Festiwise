'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import useNewsletterTriggers from '@/components/Newsletter/useNewsletterTriggers';
import NewsletterBanner from '@/components/Newsletter/NewsletterBanner';

// Dynamically import components that depend on window
const DynamicNewsletterBanner = dynamic(
  () => import('@/components/Newsletter/NewsletterBanner'),
  { ssr: false }
);

export default function NewsletterSystem() {
  const [mounted, setMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const { 
    NewsletterPopup, 
    isPopupOpen, 
    trigger,
    closePopup 
  } = useNewsletterTriggers({
    exitIntentEnabled: true,
    timeBasedEnabled: true,
    scrollBasedEnabled: true,
    timeDelay: 45, // Show after 45 seconds
    scrollPercentage: 60 // Show after 60% scroll
  });

  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // Google Analytics integration
  useEffect(() => {
    if (mounted && typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'newsletter_popup_viewed', {
        trigger_type: trigger,
        event_category: 'engagement'
      });
    }
  }, [isPopupOpen, trigger, mounted]);

  // Don't render on server
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Top banner - only show on certain pages */}
      {!currentPath.includes('/quiz') && 
       !currentPath.includes('/blog') && (
        <DynamicNewsletterBanner variant="top-bar" />
      )}
      
      {/* Popup with smart triggers */}
      <NewsletterPopup />
      
      {/* Sticky bottom banner - show after user has been browsing */}
      {currentPath === '/festivals' && (
        <DynamicNewsletterBanner 
          variant="sticky-bottom" 
          context="festival-browsing"
        />
      )}
    </>
  );
}
