'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface SEOCheckResult {
  name: string;
  status: 'passed' | 'warning' | 'failed';
  message: string;
}

/**
 * A utility component for checking the SEO status of the current page.
 * This is for development purposes only and should not be included in production.
 */
export default function SEOAnalyzer() {
  const pathname = usePathname();
  const [results, setResults] = useState<SEOCheckResult[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const checkSEO = async () => {
      const checks: SEOCheckResult[] = [];

      // Check title
      const title = document.title;
      if (!title) {
        checks.push({
          name: 'Page Title',
          status: 'failed',
          message: 'Missing page title'
        });
      } else if (title.length < 10) {
        checks.push({
          name: 'Page Title',
          status: 'warning',
          message: 'Title is too short (less than 10 characters)'
        });
      } else if (title.length > 60) {
        checks.push({
          name: 'Page Title',
          status: 'warning',
          message: 'Title is too long (more than 60 characters)'
        });
      } else {
        checks.push({
          name: 'Page Title',
          status: 'passed',
          message: `Title: "${title}" (${title.length} characters)`
        });
      }

      // Check meta description
      const description = document.querySelector('meta[name="description"]');
      if (!description) {
        checks.push({
          name: 'Meta Description',
          status: 'failed',
          message: 'Missing meta description'
        });
      } else {
        const descContent = description.getAttribute('content') || '';
        if (descContent.length < 50) {
          checks.push({
            name: 'Meta Description',
            status: 'warning',
            message: 'Description is too short (less than 50 characters)'
          });
        } else if (descContent.length > 160) {
          checks.push({
            name: 'Meta Description',
            status: 'warning',
            message: 'Description is too long (more than 160 characters)'
          });
        } else {
          checks.push({
            name: 'Meta Description',
            status: 'passed',
            message: `Description found (${descContent.length} characters)`
          });
        }
      }

      // Check canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        checks.push({
          name: 'Canonical URL',
          status: 'warning',
          message: 'Missing canonical URL tag'
        });
      } else {
        checks.push({
          name: 'Canonical URL',
          status: 'passed',
          message: `Canonical URL: ${canonical.getAttribute('href')}`
        });
      }

      // Check heading structure
      const h1s = document.querySelectorAll('h1');
      if (h1s.length === 0) {
        checks.push({
          name: 'H1 Heading',
          status: 'failed',
          message: 'No H1 heading found'
        });
      } else if (h1s.length > 1) {
        checks.push({
          name: 'H1 Heading',
          status: 'warning',
          message: `Multiple H1 headings found (${h1s.length})`
        });
      } else {
        checks.push({
          name: 'H1 Heading',
          status: 'passed',
          message: `H1: "${h1s[0].textContent}"`
        });
      }

      // Check image alt tags
      const images = document.querySelectorAll('img');
      const imagesWithoutAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
      if (imagesWithoutAlt.length > 0) {
        checks.push({
          name: 'Image Alt Tags',
          status: 'warning',
          message: `${imagesWithoutAlt.length} images missing alt tags`
        });
      } else if (images.length > 0) {
        checks.push({
          name: 'Image Alt Tags',
          status: 'passed',
          message: `All ${images.length} images have alt tags`
        });
      }

      // Check structured data
      const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
      if (structuredData.length === 0) {
        checks.push({
          name: 'Structured Data',
          status: 'warning',
          message: 'No structured data found'
        });
      } else {
        checks.push({
          name: 'Structured Data',
          status: 'passed',
          message: `${structuredData.length} structured data blocks found`
        });
      }

      setResults(checks);
    };

    // Run checks after page has fully loaded
    if (document.readyState === 'complete') {
      checkSEO();
    } else {
      window.addEventListener('load', checkSEO);
      return () => window.removeEventListener('load', checkSEO);
    }
  }, [pathname]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-2 rounded-md shadow-md"
      >
        SEO Check
      </button>
      
      {isVisible && (
        <div className="bg-white p-4 rounded-md shadow-lg mt-2 max-w-md max-h-96 overflow-y-auto">
          <h3 className="font-bold mb-2">SEO Analysis for {pathname}</h3>
          <ul className="space-y-2">
            {results.map((result, index) => (
              <li key={index} className="border-b pb-2">
                <div className="flex items-center">
                  <span 
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      result.status === 'passed' ? 'bg-green-500' : 
                      result.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                  <strong>{result.name}:</strong>
                </div>
                <p className="text-sm text-gray-700 ml-5">{result.message}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-gray-500">
            This tool is for development purposes only.
          </div>
        </div>
      )}
    </div>
  );
}
