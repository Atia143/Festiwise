'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Prefs = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
};

function applyConsent(p: Prefs) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: p.analytics ? 'granted' : 'denied',
      ad_storage: p.marketing ? 'granted' : 'denied',
      personalization_storage: p.preferences ? 'granted' : 'denied',
      functionality_storage: p.preferences ? 'granted' : 'denied',
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && (window as any).va && !p.analytics) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).va('disable');
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const t = setTimeout(() => {
      const stored = localStorage.getItem('cookieConsent');
      if (!stored) {
        setVisible(true);
      } else {
        try {
          const p = JSON.parse(stored) as Prefs;
          setPrefs(p);
          applyConsent(p);
        } catch {
          setVisible(true);
        }
      }
    }, 900);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function save(p: Prefs) {
    localStorage.setItem('cookieConsent', JSON.stringify(p));
    applyConsent(p);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[90] bg-gray-950/98 border-t border-white/10 shadow-2xl backdrop-blur-xl"
          role="dialog"
          aria-label="Cookie preferences"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            {/* Main row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="text-sm text-gray-400 flex-1">
                We use cookies to improve your experience and personalise content.{' '}
                <a href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                  Privacy Policy
                </a>
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setExpanded(e => !e)}
                  className="px-4 py-2 text-sm text-gray-300 border border-white/20 rounded-lg hover:border-white/40 hover:text-white transition-colors"
                >
                  {expanded ? 'Hide' : 'Manage'}
                </button>
                <button
                  onClick={() =>
                    save({ necessary: true, analytics: true, marketing: true, preferences: true })
                  }
                  className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>

            {/* Expandable preferences */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-3 border-t border-white/10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                      {(
                        [
                          { key: 'analytics', label: 'Analytics', desc: 'Usage data to improve the site' },
                          { key: 'marketing', label: 'Marketing', desc: 'Personalised ads & recommendations' },
                          { key: 'preferences', label: 'Preferences', desc: 'Remember your choices' },
                        ] as const
                      ).map(({ key, label, desc }) => (
                        <label
                          key={key}
                          className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={prefs[key]}
                            onChange={e => setPrefs(p => ({ ...p, [key]: e.target.checked }))}
                            className="mt-0.5 accent-purple-500 cursor-pointer"
                          />
                          <div>
                            <p className="text-sm font-medium text-white">{label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pb-1">
                      <button
                        onClick={() => save(prefs)}
                        className="px-5 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Save Preferences
                      </button>
                      <button
                        onClick={() =>
                          save({
                            necessary: true,
                            analytics: false,
                            marketing: false,
                            preferences: false,
                          })
                        }
                        className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        Reject all
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
