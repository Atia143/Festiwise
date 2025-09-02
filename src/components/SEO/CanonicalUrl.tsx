import { type Metadata } from 'next';

/**
 * Helper function that generates canonical URL metadata for Next.js pages
 */
export function generateCanonicalUrl(path: string, basePath: string = 'https://getfestiwise.com'): Metadata {
  // Clean the pathname to handle trailing slashes consistently
  const cleanedPathname = path === '/' ? '' : path;
  
  // Build the full canonical URL
  const canonicalUrl = `${basePath}${cleanedPathname}`;

  return {
    alternates: {
      canonical: canonicalUrl
    }
  };
}
