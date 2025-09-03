'use client';

import { useEffect, useState } from 'react';

// 🚀 Enterprise Smart Caching System
// Zero-cost but enterprise-level caching like Vercel Edge

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  tags: string[];
}

interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  averageAccessTime: number;
}

class SmartCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxSize: number = 50 * 1024 * 1024; // 50MB
  private currentSize: number = 0;
  private stats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    accessTimes: [] as number[]
  };

  constructor() {
    this.loadFromStorage();
    this.startCleanupInterval();
  }

  // Set data with smart expiration
  set(key: string, data: any, options: {
    ttl?: number; // time to live in ms
    tags?: string[];
    priority?: 'low' | 'normal' | 'high';
  } = {}): void {
    const now = Date.now();
    const ttl = options.ttl || (1000 * 60 * 60); // 1 hour default
    const size = this.calculateSize(data);

    // Check if we need to make space
    this.ensureSpace(size);

    const entry: CacheEntry = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
      accessCount: 0,
      lastAccessed: now,
      size,
      tags: options.tags || []
    };

    this.cache.set(key, entry);
    this.currentSize += size;
    this.persistToStorage();
  }

  // Get data with analytics
  get(key: string): any {
    const startTime = performance.now();
    this.stats.totalRequests++;

    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.recordAccessTime(startTime);
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.currentSize -= entry.size;
      this.stats.misses++;
      this.recordAccessTime(startTime);
      return null;
    }

    // Update access stats
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;
    this.recordAccessTime(startTime);

    return entry.data;
  }

  // Smart prefetch based on user behavior
  prefetch(keys: string[], priority: 'low' | 'normal' | 'high' = 'normal'): void {
    keys.forEach(key => {
      if (!this.cache.has(key)) {
        // Simulate fetching data (would be actual API calls)
        this.schedulePreload(key, priority);
      }
    });
  }

  // Invalidate by tags
  invalidateByTag(tag: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (entry.tags.includes(tag)) {
        keysToDelete.push(key);
        this.currentSize -= entry.size;
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
    this.persistToStorage();
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
        this.currentSize -= entry.size;
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // LRU eviction when cache is full
  private ensureSpace(requiredSize: number): void {
    if (this.currentSize + requiredSize <= this.maxSize) return;

    // Sort by last accessed (LRU)
    const entries = Array.from(this.cache.entries()).sort(
      ([, a], [, b]) => a.lastAccessed - b.lastAccessed
    );

    let freedSpace = 0;
    for (const [key, entry] of entries) {
      this.cache.delete(key);
      this.currentSize -= entry.size;
      freedSpace += entry.size;

      if (freedSpace >= requiredSize) break;
    }
  }

  private calculateSize(data: any): number {
    return JSON.stringify(data).length * 2; // Rough estimate
  }

  private recordAccessTime(startTime: number): void {
    const accessTime = performance.now() - startTime;
    this.stats.accessTimes.push(accessTime);
    
    // Keep only last 100 measurements
    if (this.stats.accessTimes.length > 100) {
      this.stats.accessTimes.shift();
    }
  }

  private schedulePreload(key: string, priority: 'low' | 'normal' | 'high'): void {
    const delay = priority === 'high' ? 0 : priority === 'normal' ? 100 : 500;
    
    setTimeout(() => {
      // This would typically fetch from API
      // For now, we'll simulate with localStorage or placeholder data
      const placeholderData = { preloaded: true, key, timestamp: Date.now() };
      this.set(key, placeholderData, { ttl: 30 * 60 * 1000 }); // 30 min
    }, delay);
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanup();
      this.persistToStorage();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('festiwise_cache');
      if (stored) {
        const { entries, stats } = JSON.parse(stored);
        this.cache = new Map(entries);
        this.stats = { ...this.stats, ...stats };
        
        // Recalculate current size
        this.currentSize = 0;
        this.cache.forEach(entry => {
          this.currentSize += entry.size;
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from storage');
    }
  }

  private persistToStorage(): void {
    try {
      const data = {
        entries: Array.from(this.cache.entries()),
        stats: this.stats,
        timestamp: Date.now()
      };
      localStorage.setItem('festiwise_cache', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to persist cache to storage');
    }
  }

  getStats(): CacheStats {
    const hitRate = this.stats.totalRequests > 0 
      ? (this.stats.hits / this.stats.totalRequests) * 100 
      : 0;
    
    const averageAccessTime = this.stats.accessTimes.length > 0
      ? this.stats.accessTimes.reduce((sum, time) => sum + time, 0) / this.stats.accessTimes.length
      : 0;

    return {
      totalEntries: this.cache.size,
      totalSize: this.currentSize,
      hitRate: Math.round(hitRate * 100) / 100,
      missRate: Math.round((100 - hitRate) * 100) / 100,
      averageAccessTime: Math.round(averageAccessTime * 100) / 100
    };
  }

  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    this.stats = { hits: 0, misses: 0, totalRequests: 0, accessTimes: [] };
    localStorage.removeItem('festiwise_cache');
  }
}

// Smart Prefetching Engine
class SmartPrefetcher {
  private userBehavior: Map<string, number> = new Map();
  private prefetchQueue: string[] = [];
  private isActive: boolean = true;

  constructor(private cache: SmartCache) {
    this.initializeBehaviorTracking();
  }

  private initializeBehaviorTracking(): void {
    // Track user navigation patterns
    this.trackPageViews();
    this.trackUserInteractions();
    this.trackScrollBehavior();
  }

  private trackPageViews(): void {
    let currentPath = window.location.pathname;
    
    // Record initial page
    this.recordBehavior(currentPath);

    // Track navigation
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        const newPath = window.location.pathname;
        this.recordBehavior(newPath);
        this.predictNextPages(newPath);
        currentPath = newPath;
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private trackUserInteractions(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
          this.recordBehavior(url.pathname);
          this.prefetchUrl(url.pathname, 'high');
        }
      }
    });

    // Track hover on links (intent to navigate)
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
          this.prefetchUrl(url.pathname, 'normal');
        }
      }
    });
  }

  private trackScrollBehavior(): void {
    let scrollTimeout: NodeJS.Timeout;
    
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // User stopped scrolling - predict what they might click
        this.predictFromCurrentView();
      }, 150);
    });
  }

  private recordBehavior(path: string): void {
    const count = this.userBehavior.get(path) || 0;
    this.userBehavior.set(path, count + 1);
  }

  private predictNextPages(currentPath: string): void {
    // Predict based on common patterns
    const predictions: string[] = [];

    if (currentPath === '/') {
      predictions.push('/festivals', '/quiz', '/blog');
    } else if (currentPath === '/quiz') {
      predictions.push('/festivals', 'quiz');
    } else if (currentPath.startsWith('/festival/')) {
      predictions.push('/festivals', '/quiz');
    } else if (currentPath === '/festivals') {
      // Prefetch popular festival pages
      predictions.push('/festival/tomorrowland', '/festival/coachella');
    }

    predictions.forEach(path => {
      this.prefetchUrl(path, 'low');
    });
  }

  private predictFromCurrentView(): void {
    // Find visible links and prefetch likely destinations
    const visibleLinks = this.getVisibleLinks();
    
    visibleLinks.slice(0, 3).forEach(link => {
      this.prefetchUrl(link, 'normal');
    });
  }

  private getVisibleLinks(): string[] {
    const links = document.querySelectorAll('a[href]');
    const visible: string[] = [];

    links.forEach(link => {
      const rect = link.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.top <= window.innerHeight;
      
      if (isVisible && link instanceof HTMLAnchorElement) {
        const url = new URL(link.href);
        if (url.origin === window.location.origin) {
          visible.push(url.pathname);
        }
      }
    });

    return visible;
  }

  private prefetchUrl(path: string, priority: 'low' | 'normal' | 'high'): void {
    if (this.cache.get(path)) return; // Already cached
    if (this.prefetchQueue.includes(path)) return; // Already queued

    this.prefetchQueue.push(path);
    this.cache.prefetch([path], priority);

    // Track prefetch analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'prefetch', {
        path,
        priority,
        event_category: 'performance'
      });
    }
  }

  pause(): void {
    this.isActive = false;
  }

  resume(): void {
    this.isActive = true;
  }
}

// React Hook for Smart Caching
export function useSmartCache() {
  const [cache] = useState(() => new SmartCache());
  const [prefetcher] = useState(() => new SmartPrefetcher(cache));
  const [stats, setStats] = useState<CacheStats>(cache.getStats());

  useEffect(() => {
    const updateStats = () => setStats(cache.getStats());
    const interval = setInterval(updateStats, 5000);
    
    return () => clearInterval(interval);
  }, [cache]);

  const getCached = (key: string) => cache.get(key);
  const setCached = (key: string, data: any, options?: any) => cache.set(key, data, options);
  const invalidate = (tag: string) => cache.invalidateByTag(tag);
  const clear = () => cache.clear();

  return {
    getCached,
    setCached,
    invalidate,
    clear,
    stats,
    prefetcher
  };
}

// Cache Performance Monitor
export function CacheMonitor() {
  const { stats } = useSmartCache();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getHitRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed top-20 left-4 bg-white p-3 rounded-lg shadow-lg text-xs z-50 border max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <span>⚡</span>
        <span className="font-semibold">Smart Cache</span>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Hit Rate:</span>
          <span className={`font-semibold ${getHitRateColor(stats.hitRate)}`}>
            {stats.hitRate}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Entries:</span>
          <span>{stats.totalEntries}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Size:</span>
          <span>{(stats.totalSize / 1024 / 1024).toFixed(1)}MB</span>
        </div>
        
        <div className="flex justify-between">
          <span>Avg Access:</span>
          <span>{stats.averageAccessTime.toFixed(1)}ms</span>
        </div>
      </div>
    </div>
  );
}

export { SmartCache, SmartPrefetcher };
