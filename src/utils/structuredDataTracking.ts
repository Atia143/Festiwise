/**
 * Utility for sending search engine analytics events
 * This helps track how different structured data implementations affect search engine performance
 */

/**
 * Type for tracking a rich snippet impression
 */
export type RichSnippetType = 'FAQ' | 'Breadcrumb' | 'Event' | 'Product' | 'Article' | 'HowTo';

/**
 * Track when a user arrives via a rich snippet in search results
 */
export function trackRichSnippetImpressions(snippetType: RichSnippetType, pageType: string) {
  // Only track if user has given analytics consent
  const hasConsent = localStorage?.getItem('cookieConsent') 
    ? JSON.parse(localStorage.getItem('cookieConsent') || '{}')?.analytics
    : false;
  
  if (hasConsent && typeof window !== 'undefined' && (window as any).gtag) {
    // Check if the user arrived from a search engine
    const referrer = document.referrer;
    const searchEngines = [
      'google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com', 
      'baidu.com', 'yandex.ru', 'ecosia.org'
    ];
    
    const isFromSearchEngine = searchEngines.some(se => referrer.includes(se));
    
    if (isFromSearchEngine) {
      // Send event to Google Analytics
      const gtag = (window as any).gtag;
      if (typeof gtag === 'function') {
        gtag('event', 'rich_snippet_visit', {
          snippet_type: snippetType,
          page_type: pageType,
          search_engine: referrer
        });
      }
    }
  }
}

/**
 * Add structured data monitoring script to detect if rich snippets are shown in search
 * This uses the GSC API if available
 */
export function monitorStructuredData() {
  // This is a placeholder for future implementation
  // Would require Search Console API integration
  console.log('Structured data monitoring not yet implemented');
}
