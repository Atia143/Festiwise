'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

interface GoogleTagManagerProps {
  gtmId: string;
}

/**
 * Optimized Google Tag Manager implementation with performance-first loading
 * Only loads GTM when user interacts with the page to reduce bundle size
 */
export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  const pathname = usePathname();

  // Check if we're in debug mode (via URL parameter)
  const isDebugMode = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).get('gtm_debug') === 'x';
  
  // Construct the GTM URL with debug parameter if needed
  const gtmUrl = `https://www.googletagmanager.com/gtm.js?id=${gtmId}${isDebugMode ? '&gtm_debug=x&gtm_auth=&gtm_preview=env-1' : ''}`;
  
  // Optimized GTM script that delays loading until user interaction
  const gtmScript = `
    (function(w,d,s,l,i){
      // Initialize dataLayer immediately for early events
      w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      
      // Delay GTM loading until user interaction for better performance
      const loadGTM = function() {
        if (w.gtmLoaded) return;
        w.gtmLoaded = true;
        
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;j.src='${gtmUrl}';
        f.parentNode.insertBefore(j,f);
      };
      
      // Load GTM on first user interaction or after 3 seconds
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      const loadGTMOnInteraction = function() {
        loadGTM();
        events.forEach(function(event) {
          d.removeEventListener(event, loadGTMOnInteraction);
        });
      };
      
      events.forEach(function(event) {
        d.addEventListener(event, loadGTMOnInteraction, { passive: true });
      });
      
      // Fallback: load after 3 seconds anyway
      setTimeout(loadGTM, 3000);
      
    })(window,document,'script','dataLayer','${gtmId}');
  `;
  
  // The GTM noscript iframe for users with JavaScript disabled
  const gtmIframe = `
    <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  `;

  return (
    <>
      {/* GTM Script - goes in the head */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: gtmScript }}
      />
      
      {/* GTM noscript iframe - goes in the body */}
      <noscript dangerouslySetInnerHTML={{ __html: gtmIframe }} />
      
      {/* Push page view event to dataLayer when pathname changes */}
      <Script id="gtm-page-view" strategy="afterInteractive">
        {`
          if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
              event: 'pageview',
              page: {
                path: '${pathname}',
                title: document.title
              }
            });
          }
        `}
      </Script>
    </>
  );
}
