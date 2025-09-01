'use client';

import React, { useEffect, useState } from 'react';

interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-100 percentage
  component?: React.ComponentType<any>;
  config?: Record<string, any>;
}

interface ABTest {
  id: string;
  name: string;
  variants: ABTestVariant[];
  isActive: boolean;
  targetPages?: string[];
  startDate?: Date;
  endDate?: Date;
}

interface ABTestConfig {
  tests: ABTest[];
}

class ABTestManager {
  private static instance: ABTestManager;
  private userVariants: Map<string, string> = new Map();
  private activeTests: ABTest[] = [];

  static getInstance(): ABTestManager {
    if (!ABTestManager.instance) {
      ABTestManager.instance = new ABTestManager();
    }
    return ABTestManager.instance;
  }

  // Initialize A/B tests
  initialize(config: ABTestConfig) {
    this.activeTests = config.tests.filter(test => 
      test.isActive && 
      (!test.startDate || test.startDate <= new Date()) &&
      (!test.endDate || test.endDate >= new Date())
    );

    // Load existing user assignments from localStorage
    const savedVariants = localStorage.getItem('ab_test_variants');
    if (savedVariants) {
      try {
        const parsed = JSON.parse(savedVariants);
        Object.entries(parsed).forEach(([testId, variantId]) => {
          this.userVariants.set(testId, variantId as string);
        });
      } catch (e) {
        console.warn('Failed to parse saved A/B test variants');
      }
    }

    // Assign variants for new tests
    this.activeTests.forEach(test => {
      if (!this.userVariants.has(test.id)) {
        const variantId = this.assignVariant(test);
        this.userVariants.set(test.id, variantId);
      }
    });

    // Save assignments
    this.saveVariants();
  }

  // Assign user to a variant based on weights
  private assignVariant(test: ABTest): string {
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const variant of test.variants) {
      cumulative += variant.weight;
      if (random <= cumulative) {
        return variant.id;
      }
    }

    // Fallback to first variant
    return test.variants[0]?.id || 'control';
  }

  // Get variant for a specific test
  getVariant(testId: string): string | null {
    return this.userVariants.get(testId) || null;
  }

  // Get variant config for a test
  getVariantConfig(testId: string): any {
    const variantId = this.getVariant(testId);
    if (!variantId) return null;

    const test = this.activeTests.find(t => t.id === testId);
    if (!test) return null;

    const variant = test.variants.find(v => v.id === variantId);
    return variant?.config || null;
  }

  // Check if user is in a specific variant
  isInVariant(testId: string, variantId: string): boolean {
    return this.getVariant(testId) === variantId;
  }

  // Track conversion for A/B test
  trackConversion(testId: string, conversionType: string, value: number = 1) {
    const variantId = this.getVariant(testId);
    if (!variantId) return;

    // Send to analytics (using gtag directly to avoid type issues)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ab_test_conversion', {
        test_id: testId,
        variant_id: variantId,
        conversion_type: conversionType,
        conversion_value: value,
        event_category: 'AB Testing'
      });
    }

    // Log for debugging
    console.log(`A/B Test Conversion: ${testId} | ${variantId} | ${conversionType} | ${value}`);
  }

  // Save variant assignments to localStorage
  private saveVariants() {
    const variants = Object.fromEntries(this.userVariants);
    localStorage.setItem('ab_test_variants', JSON.stringify(variants));
  }

  // Get all active test assignments
  getAllVariants(): Record<string, string> {
    return Object.fromEntries(this.userVariants);
  }
}

// Hook for using A/B tests in components
export function useABTest(testId: string) {
  const [variant, setVariant] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const manager = ABTestManager.getInstance();
    const variantId = manager.getVariant(testId);
    const variantConfig = manager.getVariantConfig(testId);
    
    setVariant(variantId);
    setConfig(variantConfig);
  }, [testId]);

  const trackConversion = (conversionType: string, value: number = 1) => {
    const manager = ABTestManager.getInstance();
    manager.trackConversion(testId, conversionType, value);
  };

  return {
    variant,
    config,
    trackConversion,
    isInVariant: (variantId: string) => variant === variantId
  };
}

// Component for conditional rendering based on A/B test
interface ABTestComponentProps {
  testId: string;
  variants: Record<string, React.ComponentType<any>>;
  fallback?: React.ComponentType<any>;
  props?: any;
}

export function ABTestComponent({ testId, variants, fallback, props = {} }: ABTestComponentProps) {
  const { variant } = useABTest(testId);
  
  if (!variant) {
    const FallbackComponent = fallback;
    return FallbackComponent ? React.createElement(FallbackComponent, props) : null;
  }

  const Component = variants[variant] || fallback;
  return Component ? React.createElement(Component, props) : null;
}

// Default A/B test configuration
export const defaultABTestConfig: ABTestConfig = {
  tests: [
    {
      id: 'hero_cta',
      name: 'Hero CTA Button Test',
      isActive: true,
      targetPages: ['/'],
      variants: [
        {
          id: 'control',
          name: 'Original Button',
          weight: 50,
          config: {
            text: 'Find My Perfect Festival',
            color: 'gradient',
            size: 'large'
          }
        },
        {
          id: 'urgent',
          name: 'Urgency Button',
          weight: 50,
          config: {
            text: 'Find My Festival Now (2 min)',
            color: 'red',
            size: 'large'
          }
        }
      ]
    },
    {
      id: 'newsletter_popup_timing',
      name: 'Newsletter Popup Timing',
      isActive: true,
      variants: [
        {
          id: 'immediate',
          name: 'Show Immediately',
          weight: 33,
          config: { delay: 0 }
        },
        {
          id: 'delayed',
          name: 'Show After 10s',
          weight: 33,
          config: { delay: 10000 }
        },
        {
          id: 'exit_intent',
          name: 'Exit Intent Only',
          weight: 34,
          config: { delay: null, exitIntent: true }
        }
      ]
    },
    {
      id: 'quiz_intro',
      name: 'Quiz Introduction Copy',
      isActive: true,
      targetPages: ['/quiz'],
      variants: [
        {
          id: 'control',
          name: 'Original Copy',
          weight: 50,
          config: {
            title: 'Find Your Perfect Festival',
            subtitle: 'Answer a few questions to get personalized recommendations'
          }
        },
        {
          id: 'benefit_focused',
          name: 'Benefit-Focused Copy',
          weight: 50,
          config: {
            title: 'Discover Festivals You\'ll Actually Love',
            subtitle: 'Skip the research - get matched with festivals that fit your vibe in 2 minutes'
          }
        }
      ]
    }
  ]
};

// Initialize A/B testing
export const abTestManager = ABTestManager.getInstance();

export default ABTestManager;
