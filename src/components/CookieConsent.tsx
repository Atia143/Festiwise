'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  // Check for stored preferences and show banner whenever no consent exists
  useEffect(() => {
    // Only run client-side
    if (typeof window !== 'undefined') {
      // Always set state with a slight delay to avoid hydration mismatch
      const timer = setTimeout(() => {
        const hasConsent = localStorage.getItem('cookieConsent');
        if (!hasConsent) {
          // No consent stored, show the banner
          setIsVisible(true);
        } else {
          // Try to parse stored preferences
          try {
            const preferences = JSON.parse(hasConsent);
            setCookiePreferences(preferences);
            
            // Apply stored preferences immediately
            applyConsentPreferences(preferences);
          } catch (e) {
            console.error('Invalid consent data, showing banner', e);
            setIsVisible(true);
          }
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setIsVisible(false);
    applyConsentPreferences(allAccepted);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(cookiePreferences));
    setIsVisible(false);
    applyConsentPreferences(cookiePreferences);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setCookiePreferences(onlyNecessary);
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    setIsVisible(false);
    applyConsentPreferences(onlyNecessary);
  };

  const applyConsentPreferences = (preferences: typeof cookiePreferences) => {
    // Apply Google Analytics consent
    if (typeof window !== 'undefined' && window.gtag) {
      // Update consent state for all tracking types
      window.gtag('consent', 'update', {
        'analytics_storage': preferences.analytics ? 'granted' : 'denied',
        'ad_storage': preferences.marketing ? 'granted' : 'denied',
        'personalization_storage': preferences.preferences ? 'granted' : 'denied',
        'functionality_storage': preferences.preferences ? 'granted' : 'denied'
      });
      
      // Send consent status as an event for tracking purposes
      window.gtag('event', 'consent_update', {
        'analytics_consent': preferences.analytics,
        'marketing_consent': preferences.marketing,
        'preferences_consent': preferences.preferences
      });
    }
    
    // Apply Vercel Analytics consent if available
    if (typeof window !== 'undefined' && (window as any).va) {
      if (!preferences.analytics) {
        (window as any).va('disable');
      }
    }
    
    // Apply PostHog consent if available
    if (typeof window !== 'undefined' && (window as any).posthog) {
      if (!preferences.analytics) {
        (window as any).posthog.opt_out_capturing();
      } else {
        (window as any).posthog.opt_in_capturing();
      }
    }
  };

  const handleTogglePreference = (key: keyof typeof cookiePreferences) => {
    if (key === 'necessary') return;
    setCookiePreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Styles for mobile+desktop bottom floating card
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[98] pointer-events-none"
          />
          {/* Consent Card */}
          <motion.div
            initial={{ opacity: 0, y: 64 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 64 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className={`
              fixed left-1/2 -translate-x-1/2
              bottom-4 sm:bottom-8 z-[99]
              max-w-lg w-[96vw] sm:w-full
              rounded-2xl shadow-2xl bg-white border border-gray-200
              p-5 sm:p-7
              flex flex-col gap-3
            `}
            role="dialog"
            aria-modal="true"
            aria-label="Cookie consent dialog"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-100 text-purple-700 font-bold rounded-full w-9 h-9 flex items-center justify-center text-lg">🍪</span>
              <h2 className="font-bold text-lg sm:text-xl">We Value Your Privacy</h2>
            </div>
            <p className="text-sm text-gray-700">
              We use cookies to enhance your experience, analyze site usage, and show personalized content. 
              Manage your preferences below. Read more in our{' '}
              <a href="/privacy" className="text-purple-600 underline hover:text-purple-800">Privacy Policy</a>.
            </p>

            {/* Collapsible for cookie types */}
            <button
              className="text-xs font-semibold underline text-purple-700 hover:text-purple-900 transition w-fit"
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded(e => !e)}
            >
              {expanded ? 'Hide details' : 'Cookie Preferences'}
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96 mt-2' : 'max-h-0'}`}>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center">
                  <input
                    type="checkbox"
                    id="necessary-cookies"
                    checked
                    disabled
                    className="accent-purple-600 mr-2"
                  />
                  <label htmlFor="necessary-cookies" className="text-sm">
                    <span className="font-medium">Necessary Cookies</span> — Always enabled. Essential for site function.
                  </label>
                </li>
                <li className="flex items-center">
                  <input
                    type="checkbox"
                    id="analytics-cookies"
                    checked={cookiePreferences.analytics}
                    onChange={() => handleTogglePreference('analytics')}
                    className="accent-purple-600 mr-2"
                  />
                  <label htmlFor="analytics-cookies" className="text-sm">
                    <span className="font-medium">Analytics Cookies</span> — Help us improve the site by collecting usage data.
                  </label>
                </li>
                <li className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketing-cookies"
                    checked={cookiePreferences.marketing}
                    onChange={() => handleTogglePreference('marketing')}
                    className="accent-purple-600 mr-2"
                  />
                  <label htmlFor="marketing-cookies" className="text-sm">
                    <span className="font-medium">Marketing Cookies</span> — Personalize ads and recommendations.
                  </label>
                </li>
                <li className="flex items-center">
                  <input
                    type="checkbox"
                    id="preferences-cookies"
                    checked={cookiePreferences.preferences}
                    onChange={() => handleTogglePreference('preferences')}
                    className="accent-purple-600 mr-2"
                  />
                  <label htmlFor="preferences-cookies" className="text-sm">
                    <span className="font-medium">Preference Cookies</span> — Remember your choices and settings.
                  </label>
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
              <button
                onClick={handleAcceptAll}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition"
              >
                Accept All
              </button>
              <button
                onClick={handleAcceptSelected}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-5 rounded-lg transition"
              >
                Save Preferences
              </button>
              <button
                onClick={handleRejectAll}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 py-2 px-5 rounded-lg transition"
              >
                Reject Non-Essential
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}