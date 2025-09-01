// Global type definitions for Festival Finder
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

// Core Types
export interface Festival {
  id: string;
  name: string;
  description: string;
  genres: string[];
  location: {
    country: string;
    city: string;
    venue?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  dates: {
    start: string;
    end: string;
  };
  ticketPrice?: {
    min: number;
    max: number;
    currency: string;
  };
  images?: {
    poster?: string;
    gallery?: string[];
  };
  capacity?: number;
  ageRestriction?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface UserProfile {
  preferences: {
    genres: string[];
    budget?: {
      min: number;
      max: number;
    };
    travelDistance?: number;
    crowdSize?: 'intimate' | 'medium' | 'large' | 'massive';
    duration?: number;
  };
  demographics?: {
    age?: number;
    location?: string;
    experience?: 'beginner' | 'intermediate' | 'expert';
  };
}

export interface QuizAnswer {
  id: string;
  question: string;
  answer: string | number | boolean | string[];
  type: 'multiple-choice' | 'scale' | 'text' | 'boolean';
  weight?: number;
}

export interface QuizState {
  currentStep: number;
  totalSteps: number;
  answers: Record<string, QuizAnswer>;
  isComplete: boolean;
  results?: Festival[];
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, string | number | boolean>;
}

export interface ConversionBannerProps {
  variant?: 'quiz' | 'newsletter' | 'guide' | 'tickets';
  position?: 'top' | 'bottom' | 'inline';
  showClose?: boolean;
  autoHide?: number;
}

export interface FilterOptions {
  genres?: string[];
  countries?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  crowdSize?: string[];
}

export interface MatchResult {
  festival: Festival;
  score: number;
  reasoning: string;
  matchedCriteria: string[];
  recommendations?: string[];
}

export interface NewsletterSubscription {
  email: string;
  preferences?: {
    genres?: string[];
    regions?: string[];
    frequency?: 'weekly' | 'monthly';
  };
  source?: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, unknown>;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  progress?: number;
}

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime?: number;
  errorCount: number;
}

// Component Props Types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
}

export interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export {};
