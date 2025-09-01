'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Smart User Experience Enhancer
 * Adapts the interface based on user behavior and preferences
 */
export default function SmartUXEnhancer() {
  const [userBehavior, setUserBehavior] = useState({
    isSlowConnection: false,
    prefersReducedMotion: false,
    isReturningUser: false,
    sessionDuration: 0,
    scrollDepth: 0,
    clickPatterns: [] as string[]
  });

  const [showHelpHint, setShowHelpHint] = useState(false);
  const [showProgressSaver, setShowProgressSaver] = useState(false);

  useEffect(() => {
    // 1. Connection quality detection
    const detectConnectionQuality = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
        setUserBehavior(prev => ({ ...prev, isSlowConnection }));

        if (isSlowConnection) {
          // Enable data saver mode
          document.documentElement.classList.add('data-saver-mode');
          
          // Reduce image quality
          const images = document.querySelectorAll('img[data-src]');
          images.forEach(img => {
            const imgElement = img as HTMLImageElement;
            if (imgElement.dataset.srcLow) {
              imgElement.src = imgElement.dataset.srcLow;
            }
          });
        }
      }
    };

    // 2. Accessibility preferences detection
    const detectAccessibilityPrefs = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setUserBehavior(prev => ({ ...prev, prefersReducedMotion }));

      if (prefersReducedMotion) {
        document.documentElement.classList.add('reduce-motion');
        // Disable complex animations
        const motionElements = document.querySelectorAll('[data-motion]');
        motionElements.forEach(el => {
          el.setAttribute('data-motion-disabled', 'true');
        });
      }
    };

    // 3. Returning user detection
    const detectReturningUser = () => {
      const hasVisited = localStorage.getItem('hasVisited');
      const isReturningUser = Boolean(hasVisited);
      setUserBehavior(prev => ({ ...prev, isReturningUser }));

      if (!hasVisited) {
        localStorage.setItem('hasVisited', 'true');
        localStorage.setItem('firstVisit', Date.now().toString());
      }
    };

    // 4. Session duration tracking
    const startTime = Date.now();
    const trackSessionDuration = () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      setUserBehavior(prev => ({ ...prev, sessionDuration: duration }));

      // Show help hint for confused users (long session, low activity)
      if (duration > 60 && userBehavior.scrollDepth < 25) {
        setShowHelpHint(true);
      }

      // Show progress saver for engaged users
      if (duration > 120 && window.location.pathname.includes('/quiz')) {
        setShowProgressSaver(true);
      }
    };

    // 5. Scroll behavior analysis
    const trackScrollBehavior = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      setUserBehavior(prev => ({ 
        ...prev, 
        scrollDepth: Math.max(prev.scrollDepth, scrollPercent) 
      }));

      // Trigger engagement features based on scroll depth
      if (scrollPercent > 75) {
        // User is highly engaged - show related content
        document.dispatchEvent(new CustomEvent('highEngagement'));
      }
    };

    // 6. Click pattern analysis
    const trackClickPatterns = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickType = target.tagName.toLowerCase();
      
      setUserBehavior(prev => ({
        ...prev,
        clickPatterns: [...prev.clickPatterns.slice(-10), clickType] // Keep last 10 clicks
      }));

      // Detect confused user behavior (many clicks without progress)
      const recentClicks = userBehavior.clickPatterns.slice(-5);
      const uniqueElements = new Set(recentClicks);
      
      if (recentClicks.length >= 5 && uniqueElements.size <= 2) {
        // User seems confused - show help
        setShowHelpHint(true);
      }
    };

    // 7. Adaptive interface adjustments
    const applyAdaptiveUI = () => {
      // Larger touch targets for mobile
      if (window.innerWidth < 768) {
        document.documentElement.classList.add('mobile-enhanced');
      }

      // High contrast mode detection
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.documentElement.classList.add('high-contrast');
      }

      // Dark mode preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        const darkModeToggle = document.querySelector('[data-dark-mode-toggle]');
        if (darkModeToggle) {
          document.documentElement.classList.add('dark');
        }
      }
    };

    // 8. Language detection and hints
    const detectLanguagePreference = () => {
      const userLanguage = navigator.language || (navigator as any).userLanguage;
      const supportedLanguages = ['en', 'es', 'fr', 'de', 'pt'];
      const primaryLanguage = userLanguage.split('-')[0];

      if (!supportedLanguages.includes(primaryLanguage) || primaryLanguage !== 'en') {
        // Show language hint for non-English users
        setTimeout(() => {
          const languageHint = document.createElement('div');
          languageHint.className = 'fixed top-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg z-50 text-sm max-w-xs';
          languageHint.innerHTML = `
            <div class="flex items-center space-x-2">
              <span>🌍</span>
              <span>We're working on ${primaryLanguage} support!</span>
              <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white/80 hover:text-white">×</button>
            </div>
          `;
          document.body.appendChild(languageHint);

          // Auto-hide after 5 seconds
          setTimeout(() => {
            if (languageHint.parentElement) {
              languageHint.remove();
            }
          }, 5000);
        }, 2000);
      }
    };

    // Initialize all features
    detectConnectionQuality();
    detectAccessibilityPrefs();
    detectReturningUser();
    applyAdaptiveUI();
    detectLanguagePreference();

    // Set up event listeners
    const sessionInterval = setInterval(trackSessionDuration, 10000);
    window.addEventListener('scroll', trackScrollBehavior, { passive: true });
    document.addEventListener('click', trackClickPatterns);

    // Cleanup
    return () => {
      clearInterval(sessionInterval);
      window.removeEventListener('scroll', trackScrollBehavior);
      document.removeEventListener('click', trackClickPatterns);
    };
  }, [userBehavior.scrollDepth, userBehavior.clickPatterns]);

  return (
    <>
      {/* Help Hint for Confused Users */}
      <AnimatePresence>
        {showHelpHint && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 bg-purple-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-semibold mb-1">Need help finding festivals?</h4>
                <p className="text-sm text-purple-100 mb-3">
                  Try our 2-minute quiz for personalized recommendations!
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.location.href = '/quiz'}
                    className="bg-white text-purple-600 px-3 py-1 rounded text-sm font-medium hover:bg-purple-50"
                  >
                    Take Quiz
                  </button>
                  <button
                    onClick={() => setShowHelpHint(false)}
                    className="text-purple-200 hover:text-white text-sm"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Saver for Quiz */}
      <AnimatePresence>
        {showProgressSaver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 left-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💾</span>
              <div>
                <h4 className="font-semibold mb-1">Progress Saved!</h4>
                <p className="text-sm text-green-100 mb-2">
                  Your quiz answers are automatically saved. You can continue anytime!
                </p>
                <button
                  onClick={() => setShowProgressSaver(false)}
                  className="text-green-200 hover:text-white text-sm"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Saver Mode Indicator */}
      {userBehavior.isSlowConnection && (
        <div className="fixed bottom-4 right-4 bg-orange-600 text-white px-3 py-2 rounded-lg text-sm z-40">
          📱 Data Saver Mode Active
        </div>
      )}
    </>
  );
}
