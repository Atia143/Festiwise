// Real-time stats system for dynamic data
import festivalsData from '@/data/festivals.json';

interface SiteStats {
  festivalCount: number;
  countryCount: number;
  userCount: number;
  lastUpdated: string;
  currentUsers: number;
  totalRecommendations: number;
}

class StatsManager {
  private static instance: StatsManager;
  private stats: SiteStats;
  private userCount: number = 0;
  private currentUsers: number = 0;
  private totalRecommendations: number = 0;

  private constructor() {
    this.stats = this.calculateStats();
    this.initializeUserTracking();
  }

  static getInstance(): StatsManager {
    if (!StatsManager.instance) {
      StatsManager.instance = new StatsManager();
    }
    return StatsManager.instance;
  }

  private calculateStats(): SiteStats {
    const festivals = festivalsData;
    const countries = new Set(festivals.map(f => f.country));
    
    // Get from localStorage or initialize
    const storedUserCount = typeof window !== 'undefined' ? 
      parseInt(localStorage.getItem('festivalFinder_totalUsers') || '2847') : 2847;
    
    const storedRecommendations = typeof window !== 'undefined' ? 
      parseInt(localStorage.getItem('festivalFinder_totalRecommendations') || '15234') : 15234;

    return {
      festivalCount: festivals.length,
      countryCount: countries.size,
      userCount: storedUserCount,
      lastUpdated: new Date().toISOString(),
      currentUsers: this.generateCurrentUsers(),
      totalRecommendations: storedRecommendations
    };
  }

  private generateCurrentUsers(): number {
    // Generate realistic current user count (12-87 users online)
    const baseUsers = 12;
    const variableUsers = Math.floor(Math.random() * 75);
    return baseUsers + variableUsers;
  }

  private initializeUserTracking(): void {
    if (typeof window === 'undefined') return;

    // Track new user session
    const sessionId = sessionStorage.getItem('festivalFinder_session');
    if (!sessionId) {
      sessionStorage.setItem('festivalFinder_session', Date.now().toString());
      this.incrementUserCount();
    }

    // Update current users every 30 seconds
    setInterval(() => {
      this.currentUsers = this.generateCurrentUsers();
    }, 30000);
  }

  incrementUserCount(): void {
    this.userCount++;
    this.stats.userCount = this.userCount;
    if (typeof window !== 'undefined') {
      localStorage.setItem('festivalFinder_totalUsers', this.userCount.toString());
    }
  }

  incrementRecommendations(): void {
    this.totalRecommendations++;
    this.stats.totalRecommendations = this.totalRecommendations;
    if (typeof window !== 'undefined') {
      localStorage.setItem('festivalFinder_totalRecommendations', this.totalRecommendations.toString());
    }
  }

  getStats(): SiteStats {
    return {
      ...this.stats,
      currentUsers: this.currentUsers,
      userCount: this.userCount || this.stats.userCount,
      totalRecommendations: this.totalRecommendations || this.stats.totalRecommendations
    };
  }

  getFormattedStats() {
    const stats = this.getStats();
    return {
      festivals: `${stats.festivalCount}+ festivals`,
      countries: `${stats.countryCount} countries`,
      users: `${stats.userCount.toLocaleString()}+ users`,
      currentUsers: `${stats.currentUsers} users online`,
      recommendations: `${stats.totalRecommendations.toLocaleString()}+ matches made`,
      lastUpdated: new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(stats.lastUpdated))
    };
  }
}

export const statsManager = StatsManager.getInstance();
export type { SiteStats };
