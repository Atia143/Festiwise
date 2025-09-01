// utils/prefetch.ts - Intent-Based Route Prefetching
'use client';

type PrefetchTrigger = 'hover' | 'touch' | 'intersection' | 'idle';

interface PrefetchConfig {
  enableOnSlowConnection: boolean;
  enableDataSaver: boolean;
  hoverDelay: number;
  intersectionThreshold: number;
  idleDelay: number;
}

class RoutePrefetcher {
  private prefetchedRoutes = new Set<string>();
  private prefetchQueue: Array<{ href: string; priority: number }> = [];
  private isProcessingQueue = false;
  private hoverTimeouts = new Map<string, NodeJS.Timeout>();
  
  private config: PrefetchConfig = {
    enableOnSlowConnection: false,
    enableDataSaver: false,
    hoverDelay: 150,
    intersectionThreshold: 0.1,
    idleDelay: 2000,
  };

  // High-priority routes for immediate prefetch
  private highPriorityRoutes = new Set([
    '/festivals',
    '/quiz',
    '/best/europe',
    '/best/usa',
  ]);

  // Critical CTAs that should be prefetched on hover
  private criticalCTAs = new Set([
    '/quiz',
    '/what-festival-should-i-go-to',
    '/festivals',
  ]);

  init(): void {
    if (typeof window === 'undefined') return;

    // Check connection and data saver preferences
    if (!this.shouldEnablePrefetch()) {
      console.log('🚫 Prefetch disabled due to connection/data saver settings');
      return;
    }

    this.setupHoverPrefetch();
    this.setupTouchPrefetch();
    this.setupIntersectionPrefetch();
    this.setupIdlePrefetch();
    
    console.log('🚀 Route prefetching enabled');
  }

  private shouldEnablePrefetch(): boolean {
    // Check for slow connection
    const connection = (navigator as any).connection;
    if (connection) {
      const isSlowConnection = connection.effectiveType === '2g' || 
                             connection.effectiveType === 'slow-2g' ||
                             connection.saveData;
      
      if (isSlowConnection && !this.config.enableOnSlowConnection) {
        return false;
      }

      if (connection.saveData && !this.config.enableDataSaver) {
        return false;
      }
    }

    return true;
  }

  private setupHoverPrefetch(): void {
    document.addEventListener('mouseover', (e) => {
      const link = this.findLinkElement(e.target as Element);
      if (!link) return;

      const href = this.getLinkHref(link);
      if (!href || !this.shouldPrefetchRoute(href)) return;

      // Clear any existing timeout for this href
      const existingTimeout = this.hoverTimeouts.get(href);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set new timeout
      const timeout = setTimeout(() => {
        this.prefetchRoute(href, 'hover');
        this.hoverTimeouts.delete(href);
      }, this.config.hoverDelay);

      this.hoverTimeouts.set(href, timeout);
    });

    // Cancel prefetch on mouse leave
    document.addEventListener('mouseout', (e) => {
      const link = this.findLinkElement(e.target as Element);
      if (!link) return;

      const href = this.getLinkHref(link);
      if (!href) return;

      const timeout = this.hoverTimeouts.get(href);
      if (timeout) {
        clearTimeout(timeout);
        this.hoverTimeouts.delete(href);
      }
    });
  }

  private setupTouchPrefetch(): void {
    document.addEventListener('touchstart', (e) => {
      const link = this.findLinkElement(e.target as Element);
      if (!link) return;

      const href = this.getLinkHref(link);
      if (!href || !this.shouldPrefetchRoute(href)) return;

      // Immediate prefetch on touch (mobile users are likely to navigate)
      this.prefetchRoute(href, 'touch');
    }, { passive: true });
  }

  private setupIntersectionPrefetch(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            const href = this.getLinkHref(link);
            
            if (href && this.shouldPrefetchRoute(href)) {
              // High-priority links get immediate prefetch
              if (this.highPriorityRoutes.has(href)) {
                this.prefetchRoute(href, 'intersection');
              } else {
                // Lower priority links go to queue
                this.queuePrefetch(href, 0.5);
              }
            }
          }
        });
      },
      {
        threshold: this.config.intersectionThreshold,
        rootMargin: '50px'
      }
    );

    // Observe high-priority links
    const observeLinks = () => {
      const links = document.querySelectorAll('a[href^="/"]');
      links.forEach((link) => {
        const href = this.getLinkHref(link as HTMLAnchorElement);
        if (href && this.highPriorityRoutes.has(href)) {
          observer.observe(link);
        }
      });
    };

    // Initial observation
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeLinks);
    } else {
      observeLinks();
    }

    // Re-observe on dynamic content changes
    const mutationObserver = new MutationObserver(() => {
      observeLinks();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private setupIdlePrefetch(): void {
    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        this.processIdlePrefetch();
      }, this.config.idleDelay);
    };

    // Reset timer on user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(
      (event) => {
        document.addEventListener(event, resetIdleTimer, { passive: true });
      }
    );

    // Start initial timer
    resetIdleTimer();
  }

  private processIdlePrefetch(): void {
    if (this.isProcessingQueue) return;

    this.isProcessingQueue = true;

    // Process queue in priority order
    this.prefetchQueue
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3) // Limit to 3 routes per idle session
      .forEach(({ href }) => {
        if (!this.prefetchedRoutes.has(href)) {
          this.prefetchRoute(href, 'idle');
        }
      });

    // Clear processed items
    this.prefetchQueue = this.prefetchQueue.slice(3);
    this.isProcessingQueue = false;
  }

  private queuePrefetch(href: string, priority: number): void {
    if (this.prefetchedRoutes.has(href)) return;

    // Remove existing entry for this href
    this.prefetchQueue = this.prefetchQueue.filter(item => item.href !== href);
    
    // Add to queue
    this.prefetchQueue.push({ href, priority });
  }

  private prefetchRoute(href: string, trigger: PrefetchTrigger): void {
    if (this.prefetchedRoutes.has(href)) return;

    try {
      // Create prefetch link element
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      link.crossOrigin = 'anonymous';

      // Add to head
      document.head.appendChild(link);

      // Mark as prefetched
      this.prefetchedRoutes.add(href);

      console.log(`🔗 Prefetched ${href} (trigger: ${trigger})`);

      // Clean up link after a delay
      setTimeout(() => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }, 10000);

    } catch (error) {
      console.error('Failed to prefetch route:', href, error);
    }
  }

  private findLinkElement(element: Element): HTMLAnchorElement | null {
    // Traverse up to find link element
    let current: Element | null = element;
    while (current && current !== document.body) {
      if (current.tagName === 'A') {
        return current as HTMLAnchorElement;
      }
      current = current.parentElement;
    }
    return null;
  }

  private getLinkHref(link: HTMLAnchorElement): string | null {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('/')) return null;
    
    // Remove hash and query parameters for prefetch
    const url = new URL(href, window.location.origin);
    return url.pathname;
  }

  private shouldPrefetchRoute(href: string): boolean {
    // Don't prefetch if already prefetched
    if (this.prefetchedRoutes.has(href)) return false;

    // Don't prefetch current page
    if (href === window.location.pathname) return false;

    // Don't prefetch external links
    if (!href.startsWith('/')) return false;

    // Don't prefetch API routes
    if (href.startsWith('/api/')) return false;

    // Don't prefetch file downloads
    if (/\.(pdf|zip|doc|docx)$/i.test(href)) return false;

    return true;
  }

  // Public methods
  prefetchCriticalRoutes(): void {
    this.highPriorityRoutes.forEach((route) => {
      this.prefetchRoute(route, 'idle');
    });
  }

  clearPrefetchCache(): void {
    this.prefetchedRoutes.clear();
    this.prefetchQueue = [];
  }

  getPrefetchStats(): { prefetched: number; queued: number } {
    return {
      prefetched: this.prefetchedRoutes.size,
      queued: this.prefetchQueue.length
    };
  }
}

// Singleton instance
const routePrefetcher = new RoutePrefetcher();

export default routePrefetcher;
