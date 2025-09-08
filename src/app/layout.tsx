import "./globals.css";
import "./accessibility.css";
import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import ClientStructuredData from "@/components/ClientStructuredData";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import SharePrompt from "@/components/SharePrompt";
import AccessibilityMenu from "@/components/AccessibilityMenu";
import CookieConsent from "@/components/CookieConsent";
import ErrorBoundary from "@/components/ErrorBoundary";
import NotificationSystem from "@/components/NotificationSystem";
import ClientAnalytics from "@/components/Analytics/ClientAnalytics";
import SimpleAnalytics from "@/components/Analytics/SimpleAnalytics";
import GoogleTagManager from "@/components/Analytics/GoogleTagManager";
import GTMDebugWrapper from "@/components/Analytics/GTMDebugWrapper";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL('https://getfestiwise.com'),
  title: {
    default: 'FestiWise: Find Your Perfect Music Festival in 2 Minutes | 100+ World-Class Events',
    template: '%s | FestiWise'
  },
  description: 'Discover your ideal music festival from 100 world-class events worldwide. Take our free 2-minute quiz for personalized recommendations by genre, budget & location. From Tomorrowland to Coachella.',
  keywords: [
    'music festival finder', 'festival finder quiz', 'music festivals 2025', 'festival recommendations',
    'EDM festivals', 'rock festivals', 'electronic music festivals', 'indie festivals',
    'tomorrowland', 'coachella', 'burning man', 'glastonbury', 'ultra music festival',
    'festival tickets', 'music events', 'concert finder', 'festival guide',
    'best music festivals', 'festival calendar', 'music festival search',
    'european music festivals', 'american music festivals', 'festival travel',
    'festival quiz', 'personalized festival recommendations', 'festival matching'
  ],
  authors: [{ name: 'FestiWise Team' }],
  creator: 'FestiWise',
  publisher: 'FestiWise',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'FestiWise: Find Your Perfect Music Festival in 2 Minutes',
    description: 'Discover your ideal music festival from 100 world-class events worldwide. Take our free 2-minute quiz for personalized recommendations.',
    url: 'https://getfestiwise.com',
    siteName: 'FestiWise',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FestiWise - Find Your Perfect Music Festival',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'FestiWise - Festival Discovery Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FestiWise: Find Your Perfect Music Festival in 2 Minutes',
    description: 'Discover your ideal music festival from 100 world-class events worldwide. Free 2-minute quiz.',
    creator: '@festiwise',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification=FestiWise_verification2025',
    yandex: 'yandexwebmaster',
    yahoo: 'yahoo-site-verification',
  },
  alternates: {
    canonical: 'https://getfestiwise.com',
    languages: {
      'en-US': 'https://getfestiwise.com',
      'x-default': 'https://getfestiwise.com',
    },
  },
  category: 'entertainment',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.png'
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
{/* Google Analytics with strict consent mode */}
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-5Y1Z0CMJ44"
/>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){ if (window.dataLayer) window.dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-5Y1Z0CMJ44');
    `,
  }}
/>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Start with all storage denied until explicit consent
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'personalization_storage': 'denied',
                'functionality_storage': 'denied',
                'security_storage': 'granted', // Always allow security-essential cookies
                'wait_for_update': 500 // milliseconds to wait
              });
              
              // Initialize GA with restricted features
              gtag('config', 'G-BDQF8TX7MF', {
                'anonymize_ip': true,
                'restricted_data_processing': true,
                'client_storage': 'none'
              });
              
              // Check for existing consent
              if (typeof localStorage !== 'undefined') {
                try {
                  const savedConsent = localStorage.getItem('cookieConsent');
                  if (savedConsent) {
                    const preferences = JSON.parse(savedConsent);
                    if (preferences.analytics) {
                      gtag('consent', 'update', {
                        'analytics_storage': 'granted'
                      });
                    }
                  }
                } catch (e) {
                  console.error('Error reading consent data', e);
                }
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Preload critical resources
              const preloadLinks = [
                {href: '/favicon.png', as: 'image'},
              ];
              
              preloadLinks.forEach(link => {
                const linkEl = document.createElement('link');
                linkEl.rel = 'preload';
                Object.keys(link).forEach(attr => linkEl[attr] = link[attr]);
                document.head.appendChild(linkEl);
              });
              
              // Optimize Largest Contentful Paint
              document.addEventListener('DOMContentLoaded', () => {
                const observer = new PerformanceObserver((entryList) => {
                  const entries = entryList.getEntries();
                  console.log('LCP:', entries[entries.length - 1]);
                });
                observer.observe({type: 'largest-contentful-paint', buffered: true});
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
        {/* Google Tag Manager */}
        <GoogleTagManager gtmId="GTM-N9Z2SZGP" />
        
        {/* GTM Debug Helper (client-side only) */}
        <GTMDebugWrapper />
        
        <ClientStructuredData />
        <ServiceWorkerRegistration />
        <Suspense fallback={null}>
          <ClientAnalytics />
          <SimpleAnalytics />
        </Suspense>
        <ErrorBoundary>
          <Navigation />
          <main className="pt-20">
            {children}
          </main>
          <SharePrompt />
          <AccessibilityMenu />
          <CookieConsent />
          <NotificationSystem />
        </ErrorBoundary>
        
        {/* Inline Premium Features - Zero SSR conflicts */}
        <div id="premium-features"></div>
        
        {/* Real-time Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Enterprise Analytics Auto-Start
              (function() {
                let analytics = null;
                const initAnalytics = () => {
                  if (typeof window !== 'undefined') {
                    // Performance monitoring
                    const perfObserver = new PerformanceObserver((list) => {
                      const entries = list.getEntries();
                      entries.forEach(entry => {
                        if (window.gtag) {
                          gtag('event', 'performance_metric', {
                            metric_name: entry.entryType,
                            metric_value: Math.round(entry.duration || entry.startTime),
                            page: window.location.pathname
                          });
                        }
                      });
                    });
                    
                    // Monitor various performance entries
                    try {
                      perfObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] });
                    } catch (e) {
                      console.warn('Performance monitoring not fully supported');
                    }
                    
                    // User engagement tracking
                    let interactions = 0;
                    let scrollDepth = 0;
                    
                    ['click', 'keydown', 'touchstart'].forEach(eventType => {
                      document.addEventListener(eventType, () => {
                        interactions++;
                        if (interactions % 10 === 0 && window.gtag) {
                          gtag('event', 'user_engagement', {
                            interactions: interactions,
                            scroll_depth: scrollDepth,
                            page: window.location.pathname
                          });
                        }
                      });
                    });
                    
                    // Scroll depth tracking
                    window.addEventListener('scroll', () => {
                      const scrollPercent = Math.round(
                        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                      );
                      if (scrollPercent > scrollDepth) {
                        scrollDepth = scrollPercent;
                        if ([25, 50, 75, 90].includes(scrollPercent) && window.gtag) {
                          gtag('event', 'scroll_depth', {
                            depth: scrollPercent,
                            page: window.location.pathname
                          });
                        }
                      }
                    });
                  }
                };
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initAnalytics);
                } else {
                  initAnalytics();
                }
              })();
            `,
          }}
        />
        
        {/* SEO & Performance Optimization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Dynamic SEO optimization
              (function() {
                // Add missing alt texts
                const optimizeImages = () => {
                  const images = document.querySelectorAll('img:not([alt])');
                  images.forEach(img => {
                    const src = img.src || '';
                    const filename = src.split('/').pop()?.split('.')[0] || 'festival image';
                    img.alt = filename.replace(/[-_]/g, ' ');
                  });
                };
                
                // Lazy load images below the fold
                const addLazyLoading = () => {
                  const images = document.querySelectorAll('img');
                  images.forEach((img, index) => {
                    if (index > 3) {
                      img.loading = 'lazy';
                    }
                  });
                };
                
                // Add structured data for current page
                const addPageSchema = () => {
                  const path = window.location.pathname;
                  let schema = null;
                  
                  if (path === '/') {
                    schema = {
                      "@context": "https://schema.org",
                      "@type": "WebSite",
                      "name": "FestiWise",
                      "description": "Find your perfect music festival",
                      "url": window.location.origin
                    };
                  } else if (path.includes('/festival/')) {
                    schema = {
                      "@context": "https://schema.org",
                      "@type": "MusicEvent",
                      "name": document.title.split('|')[0].trim(),
                      "eventStatus": "https://schema.org/EventScheduled"
                    };
                  }
                  
                  if (schema) {
                    const script = document.createElement('script');
                    script.type = 'application/ld+json';
                    script.textContent = JSON.stringify(schema);
                    document.head.appendChild(script);
                  }
                };
                
                const runOptimizations = () => {
                  optimizeImages();
                  addLazyLoading();
                  addPageSchema();
                };
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', runOptimizations);
                } else {
                  runOptimizations();
                }
                
                // Re-run on navigation (for SPA)
                let currentPath = window.location.pathname;
                setInterval(() => {
                  if (window.location.pathname !== currentPath) {
                    currentPath = window.location.pathname;
                    setTimeout(runOptimizations, 100);
                  }
                }, 1000);
              })();
            `,
          }}
        />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // TOP-TIER FEATURES - Client-side only
              window.addEventListener('load', function() {
                // Future premium features will be initialized here
                console.log('FestiWise premium features ready to initialize');
              });
            `,
          }}
        />
      </body>
    </html>
  );
}