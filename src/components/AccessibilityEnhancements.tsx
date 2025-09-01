'use client';

import { useEffect, useState } from 'react';

// Skip link for keyboard navigation
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
    >
      Skip to main content
    </a>
  );
}

// Enhanced motion preferences
export function MotionPreferences() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleMotionPreference() {
      if (mediaQuery.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
        document.documentElement.style.setProperty('--transition-duration', '0.1s');
      } else {
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        document.documentElement.style.setProperty('--transition-duration', '0.3s');
      }
    }
    
    handleMotionPreference();
    mediaQuery.addEventListener('change', handleMotionPreference);
    
    return () => mediaQuery.removeEventListener('change', handleMotionPreference);
  }, []);
  
  return null;
}

// Live region for announcements
export function LiveRegion() {
  const [announcement, setAnnouncement] = useState('');
  
  useEffect(() => {
    // Listen for custom accessibility announcements
    function handleAnnouncement(event: CustomEvent) {
      setAnnouncement(event.detail.message);
      setTimeout(() => setAnnouncement(''), 100);
    }
    
    window.addEventListener('accessibility-announce', handleAnnouncement as EventListener);
    return () => window.removeEventListener('accessibility-announce', handleAnnouncement as EventListener);
  }, []);
  
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {announcement}
    </div>
  );
}

// Keyboard navigation helper
export function announceToScreenReader(message: string) {
  const event = new CustomEvent('accessibility-announce', {
    detail: { message }
  });
  window.dispatchEvent(event);
}

// Focus trap utility
export function useFocusTrap(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;
    
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        // Close modal/dialog logic
        const closeButton = document.querySelector('[data-close-modal]') as HTMLElement;
        closeButton?.click();
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);
}

// High contrast mode detection
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    function handleContrastChange() {
      setIsHighContrast(mediaQuery.matches);
      
      if (mediaQuery.matches) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    }
    
    handleContrastChange();
    mediaQuery.addEventListener('change', handleContrastChange);
    
    return () => mediaQuery.removeEventListener('change', handleContrastChange);
  }, []);
  
  return isHighContrast;
}
