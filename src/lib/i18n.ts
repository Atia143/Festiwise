import { headers } from 'next/headers';

export const locales = ['en', 'es', 'de', 'fr', 'nl'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'en';

export const localeNames = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch', 
  fr: 'Français',
  nl: 'Nederlands'
} as const;

export const localeRegions = {
  en: ['US', 'GB', 'AU', 'CA'],
  es: ['ES', 'MX', 'AR'],
  de: ['DE', 'AT', 'CH'],
  fr: ['FR', 'CA', 'BE'],
  nl: ['NL', 'BE']
} as const;

export async function getLocaleFromHeaders(): Promise<Locale> {
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    
    if (!acceptLanguage) return defaultLocale;
    
    // Parse Accept-Language header
    const languages = acceptLanguage
      .split(',')
      .map((lang: string) => {
        const [code, quality] = lang.trim().split(';q=');
        return {
          code: code.toLowerCase().split('-')[0],
          quality: quality ? parseFloat(quality) : 1.0
        };
      })
      .sort((a: any, b: any) => b.quality - a.quality);
    
    // Find first supported language
    for (const lang of languages) {
      if (locales.includes(lang.code as Locale)) {
        return lang.code as Locale;
      }
    }
    
    return defaultLocale;
  } catch {
    return defaultLocale;
  }
}

export function generateHrefLangTags(pathname: string) {
  return locales.map(locale => ({
    hrefLang: locale,
    href: `https://getfestiwise.com${locale === defaultLocale ? '' : `/${locale}`}${pathname}`
  }));
}

export function getLocalizedUrl(pathname: string, locale: Locale): string {
  const baseUrl = 'https://getfestiwise.com';
  return `${baseUrl}${locale === defaultLocale ? '' : `/${locale}`}${pathname}`;
}

export function formatCurrency(amount: number, locale: Locale): string {
  const currencyMap = {
    en: { currency: 'USD', symbol: '$' },
    es: { currency: 'EUR', symbol: '€' },
    de: { currency: 'EUR', symbol: '€' },
    fr: { currency: 'EUR', symbol: '€' },
    nl: { currency: 'EUR', symbol: '€' }
  };
  
  const config = currencyMap[locale];
  
  try {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : `${locale}-${locale.toUpperCase()}`, {
      style: 'currency',
      currency: config.currency,
    }).format(amount);
  } catch {
    return `${config.symbol}${amount}`;
  }
}

export function formatDate(date: Date, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : `${locale}-${locale.toUpperCase()}`, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}