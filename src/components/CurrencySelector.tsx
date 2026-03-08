'use client';

import { CURRENCIES } from '@/lib/currencies';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function CurrencySelector() {
  const { currency, setCurrencyCode } = useCurrency();

  return (
    <div className="relative">
      <select
        value={currency.code}
        onChange={(e) => setCurrencyCode(e.target.value)}
        aria-label="Select currency"
        className="appearance-none bg-white/10 hover:bg-white/20 text-white text-xs font-semibold pl-3 pr-7 py-1.5 rounded-lg border border-white/20 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        {Object.values(CURRENCIES).map((c) => (
          <option key={c.code} value={c.code} className="bg-gray-900 text-white">
            {c.code} ({c.symbol})
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/60 text-[10px]">▾</span>
    </div>
  );
}
