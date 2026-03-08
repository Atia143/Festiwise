'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Sparkles } from 'lucide-react';

interface MatchNotification {
  id: string;
  city: string;
  country: string;
  festival: string;
}

const MATCHES: Omit<MatchNotification, 'id'>[] = [
  { city: 'London', country: 'UK', festival: 'Tomorrowland' },
  { city: 'New York', country: 'US', festival: 'Coachella' },
  { city: 'Berlin', country: 'DE', festival: 'Melt Festival' },
  { city: 'Amsterdam', country: 'NL', festival: 'ADE' },
  { city: 'Barcelona', country: 'ES', festival: 'Sonar' },
  { city: 'Tokyo', country: 'JP', festival: 'Ultra Japan' },
  { city: 'Sydney', country: 'AU', festival: 'Splendour in the Grass' },
  { city: 'Toronto', country: 'CA', festival: 'VELD Music Festival' },
  { city: 'Paris', country: 'FR', festival: 'Lollapalooza Paris' },
  { city: 'São Paulo', country: 'BR', festival: 'Rock in Rio' },
  { city: 'Stockholm', country: 'SE', festival: 'Way Out West' },
  { city: 'Melbourne', country: 'AU', festival: 'Laneway Festival' },
  { city: 'Chicago', country: 'US', festival: 'Lollapalooza' },
  { city: 'Mumbai', country: 'IN', festival: 'NH7 Weekender' },
  { city: 'Seoul', country: 'KR', festival: 'Pentaport Rock' },
  { city: 'Copenhagen', country: 'DK', festival: 'Roskilde Festival' },
  { city: 'Mexico City', country: 'MX', festival: 'Corona Capital' },
  { city: 'Lisbon', country: 'PT', festival: 'NOS Alive' },
  { city: 'Warsaw', country: 'PL', festival: 'Open\'er Festival' },
  { city: 'Milan', country: 'IT', festival: 'Primavera Sound Milan' },
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function LiveMatchToast() {
  const [visible, setVisible] = useState<MatchNotification | null>(null);

  const show = useCallback(() => {
    const pick = MATCHES[Math.floor(Math.random() * MATCHES.length)];
    const notif: MatchNotification = { ...pick, id: Date.now().toString() };
    setVisible(notif);
    setTimeout(() => setVisible(null), 4500);
  }, []);

  useEffect(() => {
    // First appearance: 12-20s after page load
    const initial = setTimeout(() => {
      show();
    }, randomBetween(12000, 20000));

    // Recurring: every 45-90s
    let interval: ReturnType<typeof setTimeout>;
    function schedule() {
      interval = setTimeout(() => {
        show();
        schedule();
      }, randomBetween(45000, 90000));
    }

    const afterFirst = setTimeout(() => schedule(), 22000);

    return () => {
      clearTimeout(initial);
      clearTimeout(afterFirst);
      clearTimeout(interval);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={visible.id}
          initial={{ opacity: 0, x: 60, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-20 right-4 z-[9998] max-w-[260px] pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white/95 backdrop-blur-md border border-purple-100 rounded-2xl shadow-xl px-4 py-3 flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 leading-tight">
                Someone from {visible.city} just matched!
              </p>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                {visible.festival}
              </p>
              <div className="mt-1.5 w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 4.5, ease: 'linear' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
