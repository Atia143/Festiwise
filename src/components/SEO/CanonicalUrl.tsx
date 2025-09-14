import { type Metadata } from 'next';

/**
 * Helper function that generates canonical URL metadata for Next.js pages
 */
export function generateCanonicalUrl(path: string, basePath: string = 'https://getfestiwise.com'): Metadata {
  // Clean the pathname to handle trailing slashes consistently
  // Remove trailing slashes except for the root path
  const cleanedPathname = path === '/' 
    ? '' 
    : path.endsWith('/') 
      ? path.slice(0, -1) 
      : path;
  
  // Convert all to lowercase for consistency
  const normalizedPath = cleanedPathname.toLowerCase();
  
  // Build the full canonical URL
  const canonicalUrl = `${basePath}${normalizedPath}`;

  return {
    alternates: {
      canonical: canonicalUrl
    }
  };
}
