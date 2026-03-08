'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CURRENCIES, Currency, detectCurrency } from '@/lib/currencies';

interface CurrencyContextType {
  currency: Currency;
  setCurrencyCode: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: CURRENCIES.USD,
  setCurrencyCode: () => {},
});

const STORAGE_KEY = 'festiwise_currency';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(CURRENCIES.USD);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const code = saved ?? detectCurrency();
    setCurrency(CURRENCIES[code] ?? CURRENCIES.USD);
  }, []);

  function setCurrencyCode(code: string) {
    const c = CURRENCIES[code];
    if (!c) return;
    setCurrency(c);
    localStorage.setItem(STORAGE_KEY, code);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
