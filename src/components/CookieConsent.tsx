'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  });
  
  // Check if user has already made cookie choices
  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setIsVisible(true);
    } else {
      // If they've consented before, load those preferences
      try {
        setCookiePreferences(JSON.parse(hasConsent));
      } catch (e) {
        console.error("Error parsing cookie consent", e);
      }
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
    
    // Apply analytics and other tracking based on consent
    applyConsentPreferences(allAccepted);
  };
  
  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(cookiePreferences));
    setIsVisible(false);
    
    // Apply analytics and other tracking based on consent
    applyConsentPreferences(cookiePreferences);
  };
  
  const applyConsentPreferences = (preferences: typeof cookiePreferences) => {
    // Example: Apply Google Analytics based on analytics preference
    if (preferences.analytics && window.gtag) {
      // Enable analytics
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    } else if (window.gtag) {
      // Disable analytics
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    
    // Other consent-based functionality could be applied here
  };
  
  const handleTogglePreference = (key: keyof typeof cookiePreferences) => {
    if (key === 'necessary') return; // Can't toggle necessary cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200 p-4"
        >
          <div className="max-w-6xl mx-auto">
            <div className="md:flex items-start justify-between">
              <div className="md:pr-8 mb-4 md:mb-0">
                <h2 className="text-lg font-bold mb-2">Cookie Consent</h2>
                <p className="text-sm text-gray-600">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies. You can manage your preferences
                  or learn more in our <a href="/privacy" className="text-purple-600 underline">Privacy Policy</a>.
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <div className="space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row">
                  <button
                    onClick={handleAcceptAll}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleAcceptSelected}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                  >
                    Accept Selected
                  </button>
                </div>
              </div>
            </div>
            
            {/* Cookie preferences toggles */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="necessary-cookies"
                  checked={cookiePreferences.necessary}
                  disabled
                  className="mr-2"
                />
                <label htmlFor="necessary-cookies" className="text-sm">
                  <span className="font-medium">Necessary Cookies</span> - Essential for the website to function properly (always enabled)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="analytics-cookies"
                  checked={cookiePreferences.analytics}
                  onChange={() => handleTogglePreference('analytics')}
                  className="mr-2"
                />
                <label htmlFor="analytics-cookies" className="text-sm">
                  <span className="font-medium">Analytics Cookies</span> - Help us understand how you use our website
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketing-cookies"
                  checked={cookiePreferences.marketing}
                  onChange={() => handleTogglePreference('marketing')}
                  className="mr-2"
                />
                <label htmlFor="marketing-cookies" className="text-sm">
                  <span className="font-medium">Marketing Cookies</span> - Used to personalize ads and content based on your interests
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="preferences-cookies"
                  checked={cookiePreferences.preferences}
                  onChange={() => handleTogglePreference('preferences')}
                  className="mr-2"
                />
                <label htmlFor="preferences-cookies" className="text-sm">
                  <span className="font-medium">Preference Cookies</span> - Allow the website to remember choices you make
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
