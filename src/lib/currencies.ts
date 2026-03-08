export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // rate vs USD
}

export const CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$',  name: 'US Dollar',       rate: 1 },
  EUR: { code: 'EUR', symbol: '€',  name: 'Euro',            rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£',  name: 'British Pound',   rate: 0.78 },
  ILS: { code: 'ILS', symbol: '₪',  name: 'Israeli Shekel',  rate: 3.70 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar',  rate: 1.36 },
  JPY: { code: 'JPY', symbol: '¥',  name: 'Japanese Yen',    rate: 149 },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real',   rate: 4.95 },
  MXN: { code: 'MXN', symbol: '$',  name: 'Mexican Peso',    rate: 17.2 },
};

// Map browser locale prefixes → default currency code
const LOCALE_MAP: Record<string, string> = {
  'he':    'ILS',
  'de':    'EUR',
  'fr':    'EUR',
  'es-MX': 'MXN',
  'pt-BR': 'BRL',
  'ja':    'JPY',
  'en-GB': 'GBP',
  'en-AU': 'AUD',
  'en-CA': 'CAD',
  'en-IL': 'ILS',
};

export function detectCurrency(): string {
  if (typeof navigator === 'undefined') return 'USD';
  const lang = navigator.language ?? 'en-US';
  // Try exact match first, then prefix
  if (LOCALE_MAP[lang]) return LOCALE_MAP[lang];
  const prefix = lang.split('-')[0];
  return LOCALE_MAP[prefix] ?? 'USD';
}

export function convertPrice(usd: number, currency: Currency): string {
  const amount = Math.round(usd * currency.rate);
  if (currency.code === 'JPY') return `${currency.symbol}${amount.toLocaleString()}`;
  return `${currency.symbol}${amount.toLocaleString()}`;
}

export function formatRange(minUsd: number, maxUsd: number, currency: Currency): string {
  return `${convertPrice(minUsd, currency)} – ${convertPrice(maxUsd, currency)}`;
}
