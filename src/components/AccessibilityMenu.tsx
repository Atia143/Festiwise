'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    dyslexiaFont: false,
  });

  // Apply accessibility settings when they change
  useEffect(() => {
    // High contrast mode
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }

    // Large text
    if (settings.largeText) {
      document.documentElement.classList.add('large-text-mode');
    } else {
      document.documentElement.classList.remove('large-text-mode');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion-mode');
    } else {
      document.documentElement.classList.remove('reduced-motion-mode');
    }

    // Dyslexia-friendly font
    if (settings.dyslexiaFont) {
      document.documentElement.classList.add('dyslexia-font-mode');
    } else {
      document.documentElement.classList.remove('dyslexia-font-mode');
    }

    // Save preferences
    localStorage.setItem('a11ySettings', JSON.stringify(settings));
  }, [settings]);

  // Load saved preferences on initial mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('a11ySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  return (
    <>
      {/* Accessibility button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-50 bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        aria-label="Accessibility options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1" />
        </svg>
      </button>

      {/* Accessibility menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-title"
          >
            <div className="flex items-center justify-center min-h-screen px-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black"
                onClick={() => setIsOpen(false)}
              />

              {/* Panel */}
              <motion.div
                className="bg-white rounded-lg max-w-md w-full mx-auto z-10 shadow-xl overflow-hidden"
                role="document"
              >
                <div className="px-6 py-4 bg-blue-600 text-white">
                  <h2 id="a11y-title" className="text-xl font-medium">Accessibility Settings</h2>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <button
                      onClick={() => toggleSetting('highContrast')}
                      className={`flex items-center justify-between w-full p-4 rounded-lg ${
                        settings.highContrast ? 'bg-blue-100 border-blue-500 border' : 'bg-gray-100'
                      }`}
                      aria-pressed={settings.highContrast}
                    >
                      <div className="text-left">
                        <h3 className="font-medium">High Contrast</h3>
                        <p className="text-sm text-gray-600">Enhances color contrast for better visibility</p>
                      </div>
                      <span className={`w-10 h-6 bg-${settings.highContrast ? 'blue-600' : 'gray-300'} rounded-full flex items-center transition-all duration-300`}>
                        <span className={`w-4 h-4 bg-white rounded-full shadow transform ${settings.highContrast ? 'translate-x-5' : 'translate-x-1'} transition-all duration-300`}></span>
                      </span>
                    </button>

                    <button
                      onClick={() => toggleSetting('largeText')}
                      className={`flex items-center justify-between w-full p-4 rounded-lg ${
                        settings.largeText ? 'bg-blue-100 border-blue-500 border' : 'bg-gray-100'
                      }`}
                      aria-pressed={settings.largeText}
                    >
                      <div className="text-left">
                        <h3 className="font-medium">Larger Text</h3>
                        <p className="text-sm text-gray-600">Increases text size throughout the app</p>
                      </div>
                      <span className={`w-10 h-6 bg-${settings.largeText ? 'blue-600' : 'gray-300'} rounded-full flex items-center transition-all duration-300`}>
                        <span className={`w-4 h-4 bg-white rounded-full shadow transform ${settings.largeText ? 'translate-x-5' : 'translate-x-1'} transition-all duration-300`}></span>
                      </span>
                    </button>

                    <button
                      onClick={() => toggleSetting('reducedMotion')}
                      className={`flex items-center justify-between w-full p-4 rounded-lg ${
                        settings.reducedMotion ? 'bg-blue-100 border-blue-500 border' : 'bg-gray-100'
                      }`}
                      aria-pressed={settings.reducedMotion}
                    >
                      <div className="text-left">
                        <h3 className="font-medium">Reduced Motion</h3>
                        <p className="text-sm text-gray-600">Minimizes animations and movement</p>
                      </div>
                      <span className={`w-10 h-6 bg-${settings.reducedMotion ? 'blue-600' : 'gray-300'} rounded-full flex items-center transition-all duration-300`}>
                        <span className={`w-4 h-4 bg-white rounded-full shadow transform ${settings.reducedMotion ? 'translate-x-5' : 'translate-x-1'} transition-all duration-300`}></span>
                      </span>
                    </button>

                    <button
                      onClick={() => toggleSetting('dyslexiaFont')}
                      className={`flex items-center justify-between w-full p-4 rounded-lg ${
                        settings.dyslexiaFont ? 'bg-blue-100 border-blue-500 border' : 'bg-gray-100'
                      }`}
                      aria-pressed={settings.dyslexiaFont}
                    >
                      <div className="text-left">
                        <h3 className="font-medium">Dyslexia-Friendly Font</h3>
                        <p className="text-sm text-gray-600">Changes to a font that's easier to read</p>
                      </div>
                      <span className={`w-10 h-6 bg-${settings.dyslexiaFont ? 'blue-600' : 'gray-300'} rounded-full flex items-center transition-all duration-300`}>
                        <span className={`w-4 h-4 bg-white rounded-full shadow transform ${settings.dyslexiaFont ? 'translate-x-5' : 'translate-x-1'} transition-all duration-300`}></span>
                      </span>
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
