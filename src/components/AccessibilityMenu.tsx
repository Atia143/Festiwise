'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Settings = {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  dyslexiaFont: boolean;
};

const ITEMS: { key: keyof Settings; label: string; description: string }[] = [
  { key: 'highContrast', label: 'High Contrast', description: 'Enhances color contrast for better visibility' },
  { key: 'largeText', label: 'Larger Text', description: 'Increases text size throughout the app' },
  { key: 'reducedMotion', label: 'Reduced Motion', description: 'Minimizes animations and movement' },
  { key: 'dyslexiaFont', label: 'Dyslexia-Friendly Font', description: "Changes to a font that's easier to read" },
];

const DEFAULT_SETTINGS: Settings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  dyslexiaFont: false,
};

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('a11ySettings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (_e) {
        // ignore malformed data
      }
    }
  }, []);

  useEffect(() => {
    const { highContrast, largeText, reducedMotion, dyslexiaFont } = settings;
    document.documentElement.classList.toggle('high-contrast-mode', highContrast);
    document.documentElement.classList.toggle('large-text-mode', largeText);
    document.documentElement.classList.toggle('reduced-motion-mode', reducedMotion);
    document.documentElement.classList.toggle('dyslexia-font-mode', dyslexiaFont);
    localStorage.setItem('a11ySettings', JSON.stringify(settings));
  }, [settings]);

  const toggle = (key: keyof Settings) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-50 bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 tap-highlight-none touch-manipulation"
        aria-label="Accessibility options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-title"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden z-10"
              role="document"
            >
              <div className="px-6 py-4 bg-blue-600 text-white">
                <h2 id="a11y-title" className="text-xl font-semibold">Accessibility Settings</h2>
              </div>

              <div className="p-5 space-y-3">
                {ITEMS.map(({ key, label, description }) => {
                  const active = settings[key];
                  return (
                    <button
                      key={key}
                      onClick={() => toggle(key)}
                      aria-pressed={active}
                      className={`flex items-center justify-between w-full p-4 rounded-xl text-left transition-colors duration-200 tap-highlight-none touch-manipulation ${
                        active
                          ? 'bg-blue-50 border border-blue-300'
                          : 'bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
                      </div>
                      {/* Toggle pill — static classes, no dynamic interpolation */}
                      <div
                        className={`relative ml-4 flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-200 ${
                          active ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                            active ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="px-5 py-4 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl min-h-[44px] font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 tap-highlight-none touch-manipulation transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
