'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import { formatRange, convertPrice } from '@/lib/currencies';

interface RangeProps {
  minUsd: number;
  maxUsd: number;
  className?: string;
}

export function LocalPriceRange({ minUsd, maxUsd, className }: RangeProps) {
  const { currency } = useCurrency();
  return <span className={className}>{formatRange(minUsd, maxUsd, currency)}</span>;
}

interface SingleProps {
  usd: number;
  suffix?: string;
  className?: string;
}

export function LocalPrice({ usd, suffix = '', className }: SingleProps) {
  const { currency } = useCurrency();
  return <span className={className}>{convertPrice(usd, currency)}{suffix}</span>;
}
