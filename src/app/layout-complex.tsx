import "./globals.css";
import type { Metadata } from "next";
import Navigation from "@/components/Navigation";

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
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://getfestiwise.com',
    languages: {
      'en-US': 'https://getfestiwise.com',
      'x-default': 'https://getfestiwise.com',
    },
  },
  category: 'entertainment',
  manifest: '/manifest.json',
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
        {/* Simple Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BDQF8TX7MF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BDQF8TX7MF');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-20">
          {children}
        </main>
        
        {/* Client-side only page loader - prevents hydration mismatch */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Create loader only on client-side to prevent hydration mismatch
              (function() {
                if (typeof window !== 'undefined') {
                  // Create loader element
                  const loader = document.createElement('div');
                  loader.className = 'fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 flex items-center justify-center z-50 transition-opacity duration-300';
                  loader.innerHTML = \`
                    <div class="text-center">
                      <div class="text-4xl mb-2 animate-bounce">🎪</div>
                      <div class="text-white text-sm font-medium">FestiWise</div>
                    </div>
                  \`;
                  document.body.appendChild(loader);
                  
                  // Remove loader after page loads
                  const removeLoader = () => {
                    loader.style.opacity = '0';
                    setTimeout(() => {
                      if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                      }
                    }, 300);
                  };
                  
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                      setTimeout(removeLoader, 800);
                    });
                  } else {
                    setTimeout(removeLoader, 800);
                  }
                }
              })();
            `,
          }}
        />
        
        {/* Premium Enterprise Features */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance Badge - with proper error handling
              if (typeof window !== 'undefined' && document.readyState === 'complete') {
                try {
                  import('@/components/Performance/EnterpriseMonitor').then(module => {
                    if (document.body) {
                      const badge = document.createElement('div');
                      badge.id = 'performance-badge';
                      document.body.appendChild(badge);
                    }
                  }).catch(e => console.warn('EnterpriseMonitor not available:', e));
                } catch (e) {
                  console.warn('Performance monitoring disabled:', e);
                }
              }
            `,
          }}
        />
        
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
                    
                    // User engagement tracking - with error handling
                    ['click', 'keydown', 'touchstart'].forEach(eventType => {
                      document.addEventListener(eventType, () => {
                        try {
                          interactions++;
                          if (interactions % 10 === 0 && window.gtag) {
                            gtag('event', 'user_engagement', {
                              interactions: interactions,
                              scroll_depth: scrollDepth,
                              page: window.location?.pathname || '/'
                            });
                          }
                        } catch (e) {
                          console.warn('Engagement tracking error:', e);
                        }
                      });
                    });
                    
                    // Scroll depth tracking - with null checks
                    window.addEventListener('scroll', () => {
                      try {
                        const docHeight = document.documentElement?.scrollHeight || document.body?.scrollHeight || 1;
                        const winHeight = window.innerHeight || 1;
                        const scrollY = window.scrollY || 0;
                        
                        if (docHeight > winHeight) {
                          const scrollPercent = Math.round((scrollY / (docHeight - winHeight)) * 100);
                          if (scrollPercent > scrollDepth && scrollPercent <= 100) {
                            scrollDepth = scrollPercent;
                            if ([25, 50, 75, 90].includes(scrollPercent) && window.gtag) {
                              gtag('event', 'scroll_depth', {
                                depth: scrollPercent,
                                page: window.location?.pathname || '/'
                              });
                            }
                          }
                        }
                      } catch (e) {
                        console.warn('Scroll tracking error:', e);
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
                // Language selector
                const langSelector = document.createElement('div');
                langSelector.innerHTML = \`
                  <div style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
                    <select onchange="handleLanguageChange(this.value)" style="padding: 8px; border-radius: 6px; border: 1px solid #ccc;">
                      <option value="en">🇺🇸 English</option>
                      <option value="es">🇪🇸 Español</option>
                      <option value="fr">🇫🇷 Français</option>
                      <option value="de">🇩🇪 Deutsch</option>
                    </select>
                  </div>
                \`;
                document.body.appendChild(langSelector);
                
                // Social sharing
                const shareWidget = document.createElement('div');
                shareWidget.innerHTML = \`
                  <div id="share-widget" style="position: fixed; bottom: 20px; right: 20px; background: white; padding: 16px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 1000; display: none;">
                    <div style="font-weight: bold; margin-bottom: 12px;">🚀 Share FestiWise!</div>
                    <div style="display: flex; gap: 8px;">
                      <button onclick="shareOn('twitter')" style="background: #1da1f2; color: white; padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer;">🐦 Twitter</button>
                      <button onclick="shareOn('facebook')" style="background: #4267B2; color: white; padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer;">📘 Facebook</button>
                      <button onclick="copyLink()" style="background: #666; color: white; padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer;">🔗 Copy</button>
                    </div>
                  </div>
                \`;
                document.body.appendChild(shareWidget);
                
                // Show share widget after scroll
                let scrollTimeout;
                window.addEventListener('scroll', function() {
                  clearTimeout(scrollTimeout);
                  scrollTimeout = setTimeout(() => {
                    if (window.scrollY > 500) {
                      document.getElementById('share-widget').style.display = 'block';
                      if (window.gtag) {
                        gtag('event', 'share_widget_shown');
                      }
                    }
                  }, 100);
                });
                
                // Global functions
                window.handleLanguageChange = function(lang) {
                  localStorage.setItem('language', lang);
                  if (window.gtag) {
                    gtag('event', 'language_changed', { language: lang });
                  }
                };
                
                window.shareOn = function(platform) {
                  const text = 'Found my perfect festival on FestiWise! 🎪';
                  const url = window.location.href;
                  let shareUrl = '';
                  
                  if (platform === 'twitter') {
                    shareUrl = \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(text)}&url=\${encodeURIComponent(url)}\`;
                  } else if (platform === 'facebook') {
                    shareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}\`;
                  }
                  
                  if (shareUrl) {
                    window.open(shareUrl, 'share', 'width=600,height=400');
                    if (window.gtag) {
                      gtag('event', 'share_click', { platform: platform });
                    }
                  }
                };
                
                window.copyLink = function() {
                  navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('✅ Link copied!');
                    if (window.gtag) {
                      gtag('event', 'link_copied');
                    }
                  });
                };
                
                // User tracking
                let startTime = Date.now();
                window.addEventListener('beforeunload', function() {
                  const timeSpent = (Date.now() - startTime) / 1000;
                  if (window.gtag) {
                    gtag('event', 'session_duration', { duration: Math.round(timeSpent) });
                  }
                });
                
                // A/B testing
                const variant = Math.random() > 0.5 ? 'A' : 'B';
                localStorage.setItem('ab_variant', variant);
                if (window.gtag) {
                  gtag('event', 'ab_test_assigned', { variant: variant });
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
