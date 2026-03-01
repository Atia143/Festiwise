'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useToast } from '@/components/Toast/ToastProvider';

const STORAGE_KEY = 'festiwise_favorites';

function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setFavorites(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage errors
  }
}

interface Props {
  festivalId: string;
  festivalName: string;
}

export default function SaveFavoriteButton({ festivalId, festivalName }: Props) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [burst, setBurst] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    setMounted(true);
    setSaved(getFavorites().includes(festivalId));
  }, [festivalId]);

  function toggle() {
    const current = getFavorites();
    if (current.includes(festivalId)) {
      const next = current.filter((id) => id !== festivalId);
      setFavorites(next);
      setSaved(false);
    } else {
      const next = [...current, festivalId];
      setFavorites(next);
      setSaved(true);
      setBurst(true);
      setTimeout(() => setBurst(false), 700);
      addToast(`Saved! ${festivalName} is in your favourites.`, 'success', 3000);
    }
  }

  if (!mounted) return null;

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.92 }}
      aria-label={saved ? `Remove ${festivalName} from favourites` : `Save ${festivalName} to favourites`}
      aria-pressed={saved}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
        saved
          ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
          : 'bg-white/20 text-white hover:bg-white/30'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={saved ? 'saved' : 'unsaved'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={burst ? { scale: [1, 1.5, 0.9, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={burst ? { duration: 0.4, ease: 'easeOut' } : { duration: 0.2 }}
          className="flex items-center"
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        </motion.span>
      </AnimatePresence>
      {saved ? 'Saved' : 'Save'}
    </motion.button>
  );
}
