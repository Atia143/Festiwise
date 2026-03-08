'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Festival } from '@/types/festival';

const MAX_COMPARE = 3;

interface CompareContextType {
  selected: Festival[];
  add: (f: Festival) => void;
  remove: (id: string) => void;
  toggle: (f: Festival) => void;
  isSelected: (id: string) => boolean;
  isFull: boolean;
  clear: () => void;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Festival[]>([]);

  const add = useCallback((f: Festival) => {
    setSelected(prev => {
      if (prev.length >= MAX_COMPARE || prev.some(x => x.id === f.id)) return prev;
      return [...prev, f];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSelected(prev => prev.filter(f => f.id !== id));
  }, []);

  const toggle = useCallback((f: Festival) => {
    setSelected(prev => {
      if (prev.some(x => x.id === f.id)) return prev.filter(x => x.id !== f.id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, f];
    });
  }, []);

  const isSelected = useCallback((id: string) => selected.some(f => f.id === id), [selected]);

  const clear = useCallback(() => setSelected([]), []);

  return (
    <CompareContext.Provider value={{ selected, add, remove, toggle, isSelected, isFull: selected.length >= MAX_COMPARE, clear }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
