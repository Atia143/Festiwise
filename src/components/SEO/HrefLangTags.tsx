import { Metadata } from 'next';
import { locales, defaultLocale, localeRegions } from '@/lib/i18n';

interface HrefLangTagsProps {
  pathname: string;
  currentLocale?: string;
}

export function generateHrefLangMetadata(pathname: string, _currentLocale: string = defaultLocale): Metadata {
  const languages: Record<string, string> = {};
  
  // Add hreflang for each supported locale
  locales.forEach(locale => {
    const url = `https://getfestiwise.com${locale === defaultLocale ? '' : `/${locale}`}${pathname}`;
    languages[locale] = url;
    
    // Add regional variants
    const regions = localeRegions[locale];
    if (regions) {
      regions.forEach(region => {
        const hreflang = `${locale}-${region}`;
        languages[hreflang] = url;
      });
    }
  });
  
  // Add x-default
  languages['x-default'] = `https://getfestiwise.com${pathname}`;

  return {
    alternates: {
      languages
    }
  };
}

export default function HrefLangTags({ pathname, currentLocale: _currentLocale = defaultLocale }: HrefLangTagsProps) {
  const hrefLangTags = [];
  
  // Generate hreflang tags for each locale
  for (const locale of locales) {
    const url = `https://getfestiwise.com${locale === defaultLocale ? '' : `/${locale}`}${pathname}`;
    
    hrefLangTags.push(
      <link
        key={locale}
        rel="alternate"
        hrefLang={locale}
        href={url}
      />
    );
    
    // Add regional variants
    const regions = localeRegions[locale];
    if (regions) {
      regions.forEach(region => {
        const hreflang = `${locale}-${region.toLowerCase()}`;
        hrefLangTags.push(
          <link
            key={hreflang}
            rel="alternate"
            hrefLang={hreflang}
            href={url}
          />
        );
      });
    }
  }
  
  // Add x-default
  hrefLangTags.push(
    <link
      key="x-default"
      rel="alternate"
      hrefLang="x-default"
      href={`https://getfestiwise.com${pathname}`}
    />
  );

  return (
    <>
      {hrefLangTags}
    </>
  );
}