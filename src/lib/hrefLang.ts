import { locales, defaultLocale } from '@/i18n.config';

export interface HrefLangAlternate {
  href: string;
  hrefLang: string;
}

export function generateHrefLangAlternates(pathname: string): HrefLangAlternate[] {
  // Remove locale prefix if present
  const pathWithoutLocale = pathname.replace(/^\/(en|es|de|fr)(\/|$)/, '/$1');
  const cleanPath = pathWithoutLocale.replace(/^\/en(\/|$)/, '/');

  const alternates: HrefLangAlternate[] = [];

  // Add all language variants
  for (const locale of locales) {
    const href =
      locale === defaultLocale
        ? `https://getfestiwise.com${cleanPath}`
        : `https://getfestiwise.com/${locale}${cleanPath}`;

    alternates.push({
      href,
      hrefLang: locale,
    });
  }

  // Add x-default
  alternates.push({
    href: `https://getfestiwise.com${cleanPath}`,
    hrefLang: 'x-default',
  });

  return alternates;
}

export function generateHrefLangMetadata(pathname: string) {
  const alternates = generateHrefLangAlternates(pathname);

  return {
    alternates: {
      languages: Object.fromEntries(
        alternates.map((alt) => [alt.hrefLang, alt.href])
      ),
    },
  };
}

/**
 * Generate hreflang link elements for head
 */
export function getHrefLangLinks(pathname: string): Array<{ rel: string; hrefLang?: string; href: string }> {
  const alternates = generateHrefLangAlternates(pathname);

  return alternates.map((alt) => ({
    rel: 'alternate',
    hrefLang: alt.hrefLang === 'x-default' ? undefined : alt.hrefLang,
    href: alt.href,
  }));
}
