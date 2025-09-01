'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

// Advanced Performance & Engagement Optimization

// 1. Smart Caching & Data Management
class FestivalDataManager {
  private cache: Map<string, any> = new Map();
  private lastUpdated: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
  private prefetchQueue: Set<string> = new Set();

  // Intelligent caching with TTL
  async getData(key: string, fetcher: () => Promise<any>): Promise<any> {
    const cached = this.cache.get(key);
    const lastUpdate = this.lastUpdated.get(key) || 0;
    const now = Date.now();

    // Return cached data if still valid
    if (cached && (now - lastUpdate) < this.CACHE_DURATION) {
      return cached;
    }

    // Fetch fresh data
    try {
      const data = await fetcher();
      this.cache.set(key, data);
      this.lastUpdated.set(key, now);
      return data;
    } catch (error) {
      // Return stale data if available during error
      if (cached) {
        console.warn('Using stale data due to fetch error:', error);
        return cached;
      }
      throw error;
    }
  }

  // Predictive prefetching
  prefetch(keys: string[], fetchers: (() => Promise<any>)[]): void {
    keys.forEach((key, index) => {
      if (!this.prefetchQueue.has(key) && !this.cache.has(key)) {
        this.prefetchQueue.add(key);
        
        // Stagger prefetch requests
        setTimeout(() => {
          this.getData(key, fetchers[index])
            .then(() => this.prefetchQueue.delete(key))
            .catch(() => this.prefetchQueue.delete(key));
        }, index * 100);
      }
    });
  }

  // Memory management
  cleanup(): void {
    const now = Date.now();
    for (const [key, timestamp] of this.lastUpdated.entries()) {
      if (now - timestamp > this.CACHE_DURATION * 2) {
        this.cache.delete(key);
        this.lastUpdated.delete(key);
      }
    }
  }
}

// 2. User Engagement Analytics
interface UserEngagementEvent {
  type: 'view' | 'click' | 'save' | 'share' | 'quiz_start' | 'quiz_complete' | 'search' | 'time_spent';
  data: any;
  timestamp: number;
  sessionId: string;
}

class UserEngagementTracker {
  private events: UserEngagementEvent[] = [];
  private sessionId: string = '';
  private startTime: number = Date.now();
  private heatmapData: Map<string, number> = new Map();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private setupEventListeners(): void {
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      maxScroll = Math.max(maxScroll, scrollPercent);
      this.updateHeatmap('scroll_depth', scrollPercent);
    });

    // Track time on page
    setInterval(() => {
      this.trackEvent('time_spent', {
        duration: Date.now() - this.startTime,
        scroll_depth: maxScroll
      });
    }, 30000); // Every 30 seconds
  }

  trackEvent(type: UserEngagementEvent['type'], data: any): void {
    this.events.push({
      type,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });

    // Send to analytics (would be actual service in production)
    this.sendToAnalytics({ type, data, timestamp: Date.now() });
  }

  private updateHeatmap(element: string, value: number): void {
    this.heatmapData.set(element, value);
  }

  private sendToAnalytics(event: Partial<UserEngagementEvent>): void {
    // In production, this would send to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
  }

  getEngagementScore(): number {
    const timeSpent = Date.now() - this.startTime;
    const eventCount = this.events.length;
    const uniqueEventTypes = new Set(this.events.map(e => e.type)).size;
    
    // Simple engagement scoring algorithm
    const timeScore = Math.min(timeSpent / (1000 * 60 * 5), 1) * 40; // 5 minutes = max time score
    const activityScore = Math.min(eventCount / 20, 1) * 40; // 20 events = max activity score
    const diversityScore = Math.min(uniqueEventTypes / 6, 1) * 20; // 6 event types = max diversity

    return Math.round(timeScore + activityScore + diversityScore);
  }

  getRecommendations(): string[] {
    const score = this.getEngagementScore();
    const recommendations = [];

    if (score < 30) {
      recommendations.push('Try our quick festival quiz for personalized recommendations!');
      recommendations.push('Browse popular festivals to get started');
    } else if (score < 60) {
      recommendations.push('Save your favorite festivals to build your wishlist');
      recommendations.push('Share festivals with friends to get their opinions');
    } else {
      recommendations.push('You\'re highly engaged! Consider upgrading for premium features');
      recommendations.push('Help us improve by leaving feedback');
    }

    return recommendations;
  }
}

// 3. Smart Performance Monitoring
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.setupPerformanceObserver();
    this.trackCoreWebVitals();
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry.duration);
        }
      });
      
      this.observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }

  private trackCoreWebVitals(): void {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('FCP', entry.startTime);
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          this.recordMetric('CLS', clsValue);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);

    // Keep only last 100 measurements
    const values = this.metrics.get(name)!;
    if (values.length > 100) {
      values.shift();
    }
  }

  getMetricStats(name: string): { avg: number; min: number; max: number; latest: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: values[values.length - 1]
    };
  }

  getPerformanceScore(): number {
    const fcp = this.getMetricStats('FCP');
    const lcp = this.getMetricStats('LCP');
    const cls = this.getMetricStats('CLS');

    let score = 100;

    // FCP scoring (good < 1.8s, needs improvement < 3s, poor >= 3s)
    if (fcp) {
      if (fcp.latest > 3000) score -= 30;
      else if (fcp.latest > 1800) score -= 15;
    }

    // LCP scoring (good < 2.5s, needs improvement < 4s, poor >= 4s)
    if (lcp) {
      if (lcp.latest > 4000) score -= 40;
      else if (lcp.latest > 2500) score -= 20;
    }

    // CLS scoring (good < 0.1, needs improvement < 0.25, poor >= 0.25)
    if (cls) {
      if (cls.latest > 0.25) score -= 30;
      else if (cls.latest > 0.1) score -= 15;
    }

    return Math.max(0, score);
  }
}

// 4. Advanced User Experience Optimizer
interface UXOptimization {
  type: 'prefetch' | 'lazy-load' | 'cache' | 'prioritize';
  target: string;
  impact: 'low' | 'medium' | 'high';
  implementation: () => void;
}

class UXOptimizer {
  private optimizations: UXOptimization[] = [];
  private appliedOptimizations: Set<string> = new Set();
  private userBehavior: Map<string, number> = new Map();

  constructor() {
    this.initializeOptimizations();
    this.startBehaviorTracking();
  }

  private initializeOptimizations(): void {
    this.optimizations = [
      {
        type: 'prefetch',
        target: 'festival-details',
        impact: 'high',
        implementation: () => this.prefetchPopularContent()
      },
      {
        type: 'lazy-load',
        target: 'festival-images',
        impact: 'medium',
        implementation: () => this.optimizeImageLoading()
      },
      {
        type: 'cache',
        target: 'search-results',
        impact: 'high',
        implementation: () => this.cacheSearchResults()
      },
      {
        type: 'prioritize',
        target: 'critical-css',
        impact: 'high',
        implementation: () => this.prioritizeCriticalResources()
      }
    ];
  }

  private startBehaviorTracking(): void {
    // Track user interactions to optimize accordingly
    document.addEventListener('click', (e) => {
      const target = (e.target as Element).closest('[data-festival-id]');
      if (target) {
        const festivalId = target.getAttribute('data-festival-id');
        if (festivalId) {
          this.trackBehavior('festival-click', festivalId);
        }
      }
    });

    // Track hover events for prefetching
    document.addEventListener('mouseenter', (e) => {
      const target = (e.target as Element).closest('[data-prefetch]');
      if (target) {
        const prefetchTarget = target.getAttribute('data-prefetch');
        if (prefetchTarget) {
          this.trackBehavior('hover-prefetch', prefetchTarget);
        }
      }
    }, true);
  }

  private trackBehavior(action: string, target: string): void {
    const key = `${action}:${target}`;
    this.userBehavior.set(key, (this.userBehavior.get(key) || 0) + 1);
    
    // Apply optimizations based on behavior
    this.applyDynamicOptimizations();
  }

  private applyDynamicOptimizations(): void {
    // Find the most interacted-with elements and optimize them
    const sortedBehaviors = Array.from(this.userBehavior.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    for (const [behavior, count] of sortedBehaviors) {
      if (count >= 3) { // Threshold for optimization
        const [action, target] = behavior.split(':');
        if (action === 'festival-click' && !this.appliedOptimizations.has(`prefetch:${target}`)) {
          this.prefetchFestivalDetails(target);
          this.appliedOptimizations.add(`prefetch:${target}`);
        }
      }
    }
  }

  private prefetchPopularContent(): void {
    // Prefetch most popular festivals based on analytics
    const popularFestivals = ['tomorrowland', 'coachella', 'burning-man'];
    popularFestivals.forEach(festival => {
      this.prefetchFestivalDetails(festival);
    });
  }

  private prefetchFestivalDetails(festivalId: string): void {
    // Create invisible link for browser prefetching
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `/festival/${festivalId}`;
    document.head.appendChild(link);
  }

  private optimizeImageLoading(): void {
    // Implement intersection observer for lazy loading
    const images = document.querySelectorAll('img[data-lazy]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('data-lazy');
            if (src) {
              img.src = src;
              img.removeAttribute('data-lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  private cacheSearchResults(): void {
    // Implement service worker caching for search results
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'CACHE_SEARCH_RESULTS',
          pattern: '/api/search/*'
        });
      });
    }
  }

  private prioritizeCriticalResources(): void {
    // Add resource hints for critical resources
    const criticalResources = [
      { rel: 'preload', href: '/fonts/main.woff2', as: 'font', type: 'font/woff2' },
      { rel: 'preload', href: '/css/critical.css', as: 'style' },
      { rel: 'dns-prefetch', href: 'https://api.festiwise.com' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      Object.assign(link, resource);
      document.head.appendChild(link);
    });
  }

  getOptimizationReport(): any {
    return {
      applied_optimizations: Array.from(this.appliedOptimizations),
      user_behavior_insights: Object.fromEntries(this.userBehavior),
      recommendations: this.generateRecommendations()
    };
  }

  private generateRecommendations(): string[] {
    const recommendations = [];
    
    if (this.userBehavior.size > 50) {
      recommendations.push('High user engagement detected - consider implementing advanced prefetching');
    }
    
    if (this.appliedOptimizations.size < 3) {
      recommendations.push('More optimizations can be applied based on user behavior');
    }

    return recommendations;
  }
}

// 5. Smart Personalization Engine
class PersonalizationEngine {
  private userProfile: Map<string, any> = new Map();
  private preferences: Map<string, number> = new Map(); // weighted preferences
  private behaviorHistory: Array<{ action: string; data: any; timestamp: number }> = [];

  constructor() {
    this.loadUserProfile();
    this.startLearning();
  }

  private loadUserProfile(): void {
    // Load from localStorage or API
    const stored = localStorage.getItem('user_profile');
    if (stored) {
      try {
        const profile = JSON.parse(stored);
        Object.entries(profile).forEach(([key, value]) => {
          this.userProfile.set(key, value);
        });
      } catch (e) {
        console.warn('Failed to load user profile:', e);
      }
    }
  }

  private saveUserProfile(): void {
    const profile = Object.fromEntries(this.userProfile);
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }

  updatePreference(category: string, value: number, weight: number = 1): void {
    const currentScore = this.preferences.get(category) || 0;
    const newScore = (currentScore + (value * weight)) / 2; // Average with weight
    this.preferences.set(category, newScore);
    this.saveUserProfile();
  }

  trackBehavior(action: string, data: any): void {
    this.behaviorHistory.push({
      action,
      data,
      timestamp: Date.now()
    });

    // Keep only last 1000 events
    if (this.behaviorHistory.length > 1000) {
      this.behaviorHistory.shift();
    }

    // Learn from behavior
    this.learnFromBehavior(action, data);
  }

  private learnFromBehavior(action: string, data: any): void {
    switch (action) {
      case 'festival_view':
        // Increase preference for viewed festival's genres
        data.genres?.forEach((genre: string) => {
          this.updatePreference(`genre:${genre}`, 0.1, 1);
        });
        
        // Learn location preferences
        if (data.country) {
          this.updatePreference(`location:${data.country}`, 0.05, 0.5);
        }
        break;

      case 'festival_save':
        // Strong signal - increase preferences significantly
        data.genres?.forEach((genre: string) => {
          this.updatePreference(`genre:${genre}`, 0.5, 2);
        });
        
        if (data.priceRange) {
          this.updatePreference(`budget:${data.priceRange}`, 0.3, 1.5);
        }
        break;

      case 'search_query':
        // Learn from search terms
        const terms = data.query?.toLowerCase().split(' ') || [];
        terms.forEach((term: string) => {
          if (term.length > 2) {
            this.updatePreference(`search:${term}`, 0.1, 0.5);
          }
        });
        break;
    }
  }

  private startLearning(): void {
    // Periodic learning and profile updates
    setInterval(() => {
      this.analyzeRecentBehavior();
      this.saveUserProfile();
    }, 60000); // Every minute
  }

  private analyzeRecentBehavior(): void {
    const recentBehavior = this.behaviorHistory.filter(
      event => Date.now() - event.timestamp < 1000 * 60 * 15 // Last 15 minutes
    );

    // Identify patterns
    const patterns = this.identifyPatterns(recentBehavior);
    
    // Update preferences based on patterns
    patterns.forEach(pattern => {
      this.updatePreference(`pattern:${pattern.type}`, pattern.strength, 1);
    });
  }

  private identifyPatterns(behavior: Array<{ action: string; data: any; timestamp: number }>): Array<{ type: string; strength: number }> {
    const patterns = [];
    
    // Example: user browsing mostly electronic festivals
    const genreCounts: Map<string, number> = new Map();
    behavior.forEach(event => {
      if (event.action === 'festival_view' && event.data.genres) {
        event.data.genres.forEach((genre: string) => {
          genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
        });
      }
    });

    // Find dominant genre
    const sortedGenres = Array.from(genreCounts.entries()).sort(([, a], [, b]) => b - a);
    if (sortedGenres.length > 0 && sortedGenres[0][1] >= 3) {
      patterns.push({
        type: `focused_on_${sortedGenres[0][0]}`,
        strength: Math.min(sortedGenres[0][1] / behavior.length, 1)
      });
    }

    return patterns;
  }

  getPersonalizedRecommendations(festivals: any[]): any[] {
    // Score festivals based on user preferences
    const scoredFestivals = festivals.map(festival => {
      let score = 0;

      // Genre preferences
      festival.genres?.forEach((genre: string) => {
        const preference = this.preferences.get(`genre:${genre}`) || 0;
        score += preference * 0.4;
      });

      // Location preferences
      if (festival.country) {
        const locationPref = this.preferences.get(`location:${festival.country}`) || 0;
        score += locationPref * 0.2;
      }

      // Budget preferences
      if (festival.priceRange) {
        const budgetPref = this.preferences.get(`budget:${festival.priceRange}`) || 0;
        score += budgetPref * 0.3;
      }

      // Boost based on patterns
      this.preferences.forEach((value, key) => {
        if (key.startsWith('pattern:') && this.festivalMatchesPattern(festival, key.slice(8))) {
          score += value * 0.1;
        }
      });

      return {
        ...festival,
        personalization_score: Math.min(Math.max(score, 0), 1),
        reasons: this.generateRecommendationReasons(festival, score)
      };
    });

    // Sort by personalization score
    return scoredFestivals.sort((a, b) => b.personalization_score - a.personalization_score);
  }

  private festivalMatchesPattern(festival: any, pattern: string): boolean {
    // Simple pattern matching - can be expanded
    if (pattern.includes('focused_on_')) {
      const genre = pattern.replace('focused_on_', '');
      return festival.genres?.includes(genre) || false;
    }
    return false;
  }

  private generateRecommendationReasons(festival: any, score: number): string[] {
    const reasons = [];
    
    if (score > 0.7) {
      reasons.push('Perfectly matches your preferences');
    } else if (score > 0.5) {
      reasons.push('Good match based on your activity');
    } else if (score > 0.3) {
      reasons.push('You might like this based on similar choices');
    }

    // Add specific reasons
    festival.genres?.forEach((genre: string) => {
      const pref = this.preferences.get(`genre:${genre}`) || 0;
      if (pref > 0.3) {
        reasons.push(`You love ${genre} music`);
      }
    });

    return reasons.slice(0, 3); // Limit to 3 reasons
  }

  getInsights(): any {
    return {
      top_preferences: Array.from(this.preferences.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
      behavior_summary: {
        total_actions: this.behaviorHistory.length,
        recent_activity: this.behaviorHistory.filter(
          event => Date.now() - event.timestamp < 1000 * 60 * 60 * 24
        ).length,
        top_actions: this.getTopActions()
      },
      profile_completeness: this.userProfile.size * 10 // Rough estimate
    };
  }

  private getTopActions(): Array<{ action: string; count: number }> {
    const actionCounts: Map<string, number> = new Map();
    this.behaviorHistory.forEach(event => {
      actionCounts.set(event.action, (actionCounts.get(event.action) || 0) + 1);
    });

    return Array.from(actionCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }));
  }
}

// Export all optimization tools
export {
  FestivalDataManager,
  UserEngagementTracker,
  PerformanceMonitor,
  UXOptimizer,
  PersonalizationEngine
};

// Global optimization manager
export class FestiWiseOptimizer {
  private dataManager: FestivalDataManager;
  private engagementTracker: UserEngagementTracker;
  private performanceMonitor: PerformanceMonitor;
  private uxOptimizer: UXOptimizer;
  private personalizationEngine: PersonalizationEngine;

  constructor() {
    this.dataManager = new FestivalDataManager();
    this.engagementTracker = new UserEngagementTracker();
    this.performanceMonitor = new PerformanceMonitor();
    this.uxOptimizer = new UXOptimizer();
    this.personalizationEngine = new PersonalizationEngine();

    this.startOptimizationLoop();
  }

  private startOptimizationLoop(): void {
    // Run optimizations every 30 seconds
    setInterval(() => {
      this.runOptimizations();
    }, 30000);

    // Cleanup every 5 minutes
    setInterval(() => {
      this.dataManager.cleanup();
    }, 300000);
  }

  private runOptimizations(): void {
    const performanceScore = this.performanceMonitor.getPerformanceScore();
    const engagementScore = this.engagementTracker.getEngagementScore();

    // Apply optimizations based on scores
    if (performanceScore < 70) {
      console.log('🚀 Applying performance optimizations...');
      // Apply more aggressive optimizations
    }

    if (engagementScore > 80) {
      console.log('🎯 High engagement detected - applying advanced features...');
      // Enable premium features for highly engaged users
    }
  }

  getOverallScore(): number {
    const performance = this.performanceMonitor.getPerformanceScore();
    const engagement = this.engagementTracker.getEngagementScore();
    
    return Math.round((performance + engagement) / 2);
  }

  getDashboard(): any {
    return {
      performance: this.performanceMonitor.getPerformanceScore(),
      engagement: this.engagementTracker.getEngagementScore(),
      optimization_report: this.uxOptimizer.getOptimizationReport(),
      personalization_insights: this.personalizationEngine.getInsights(),
      overall_score: this.getOverallScore(),
      recommendations: [
        ...this.engagementTracker.getRecommendations(),
        ...this.uxOptimizer.getOptimizationReport().recommendations
      ]
    };
  }
}

export default FestiWiseOptimizer;
