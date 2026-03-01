export const locales = ['en', 'es', 'de', 'fr'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
};

export const defaultLocale = 'en' as const;

export async function getMessages(locale: Locale) {
  return (await import(`./messages/${locale}.json`)).default;
}
