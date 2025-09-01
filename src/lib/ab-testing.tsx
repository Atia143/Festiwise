'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface ABTestVariant {
  id: string;
  name: string;
  weight: number;
  config: Record<string, any>;
}

interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: ABTestVariant[];
  isActive: boolean;
  startDate: string;
  endDate?: string;
  targetAudience?: string[];
  conversionGoal: string;
}

interface ABTestResult {
  testId: string;
  variantId: string;
  userId: string;
  timestamp: number;
  converted: boolean;
  conversionValue?: number;
}

class WorldClassABTesting {
  private tests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, string> = new Map();
  private results: ABTestResult[] = [];
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.loadFromStorage();
    this.initializeTests();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    // Load user assignments
    const storedAssignments = localStorage.getItem('ff_ab_assignments');
    if (storedAssignments) {
      this.userAssignments = new Map(JSON.parse(storedAssignments));
    }

    // Load results
    const storedResults = localStorage.getItem('ff_ab_results');
    if (storedResults) {
      this.results = JSON.parse(storedResults);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;

    localStorage.setItem('ff_ab_assignments', JSON.stringify([...this.userAssignments]));
    localStorage.setItem('ff_ab_results', JSON.stringify(this.results));
  }

  private initializeTests() {
    // Define A/B tests
    const tests: ABTest[] = [
      {
        id: 'hero_cta_test',
        name: 'Hero CTA Button Test',
        description: 'Test different CTA button texts in hero section',
        variants: [
          {
            id: 'control',
            name: 'Control - "Take Quiz"',
            weight: 50,
            config: {
              buttonText: 'Take Quiz',
              buttonColor: 'bg-white text-purple-900'
            }
          },
          {
            id: 'variant_a',
            name: 'Variant A - "Find My Festival"',
            weight: 50,
            config: {
              buttonText: 'Find My Festival',
              buttonColor: 'bg-yellow-400 text-black'
            }
          }
        ],
        isActive: true,
        startDate: '2025-09-01',
        conversionGoal: 'quiz_start'
      },
      {
        id: 'conversion_banner_test',
        name: 'Conversion Banner Position Test',
        description: 'Test banner positioning for maximum conversions',
        variants: [
          {
            id: 'control',
            name: 'Control - Top Banner',
            weight: 33,
            config: {
              position: 'top',
              variant: 'quiz'
            }
          },
          {
            id: 'variant_a',
            name: 'Variant A - Bottom Banner',
            weight: 33,
            config: {
              position: 'bottom',
              variant: 'newsletter'
            }
          },
          {
            id: 'variant_b',
            name: 'Variant B - No Banner',
            weight: 34,
            config: {
              showBanner: false
            }
          }
        ],
        isActive: true,
        startDate: '2025-09-01',
        conversionGoal: 'banner_click'
      },
      {
        id: 'quiz_flow_test',
        name: 'Quiz Flow Optimization',
        description: 'Test different quiz flows for completion rate',
        variants: [
          {
            id: 'control',
            name: 'Control - Standard Flow',
            weight: 50,
            config: {
              questionsPerStep: 1,
              showProgress: true,
              animationType: 'slide'
            }
          },
          {
            id: 'variant_a',
            name: 'Variant A - Multi-Question Steps',
            weight: 50,
            config: {
              questionsPerStep: 3,
              showProgress: false,
              animationType: 'fade'
            }
          }
        ],
        isActive: true,
        startDate: '2025-09-01',
        conversionGoal: 'quiz_completion'
      },
      {
        id: 'results_page_test',
        name: 'Results Page Layout Test',
        description: 'Test different layouts for festival results',
        variants: [
          {
            id: 'control',
            name: 'Control - Grid Layout',
            weight: 50,
            config: {
              layout: 'grid',
              cardsPerRow: 3,
              showFilters: true
            }
          },
          {
            id: 'variant_a',
            name: 'Variant A - List Layout',
            weight: 50,
            config: {
              layout: 'list',
              cardsPerRow: 1,
              showFilters: false
            }
          }
        ],
        isActive: true,
        startDate: '2025-09-01',
        conversionGoal: 'festival_click'
      }
    ];

    tests.forEach(test => {
      this.tests.set(test.id, test);
    });
  }

  public getVariant(testId: string): ABTestVariant | null {
    const test = this.tests.get(testId);
    if (!test || !test.isActive) return null;

    // Check if user already has assignment
    const existingAssignment = this.userAssignments.get(testId);
    if (existingAssignment) {
      return test.variants.find(v => v.id === existingAssignment) || null;
    }

    // Assign user to variant based on weights
    const variant = this.assignUserToVariant(test);
    if (variant) {
      this.userAssignments.set(testId, variant.id);
      this.saveToStorage();

      // Track assignment
      this.trackAssignment(testId, variant.id);
    }

    return variant;
  }

  private assignUserToVariant(test: ABTest): ABTestVariant | null {
    // Use userId hash for consistent assignment
    const hash = this.hashUserId(this.userId + test.id);
    const random = hash % 100;

    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (random < cumulativeWeight) {
        return variant;
      }
    }

    return test.variants[0]; // Fallback to first variant
  }

  private hashUserId(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  public trackConversion(testId: string, conversionValue?: number) {
    const variant = this.getVariant(testId);
    if (!variant) return;

    const result: ABTestResult = {
      testId,
      variantId: variant.id,
      userId: this.userId,
      timestamp: Date.now(),
      converted: true,
      conversionValue
    };

    this.results.push(result);
    this.saveToStorage();

    // Track in analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ab_test_conversion', {
        event_category: 'AB_Test',
        event_label: `${testId}_${variant.id}`,
        value: conversionValue || 1,
        custom_parameters: {
          test_id: testId,
          variant_id: variant.id,
          variant_name: variant.name,
          conversion_value: conversionValue
        }
      });
    }
  }

  private trackAssignment(testId: string, variantId: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ab_test_assignment', {
        event_category: 'AB_Test',
        event_label: `${testId}_${variantId}`,
        custom_parameters: {
          test_id: testId,
          variant_id: variantId,
          user_id: this.userId
        }
      });
    }
  }

  public getTestResults(testId: string) {
    const test = this.tests.get(testId);
    if (!test) return null;

    const testResults = this.results.filter(r => r.testId === testId);
    const variantStats = new Map<string, {
      assignments: number;
      conversions: number;
      conversionRate: number;
      totalValue: number;
    }>();

    // Initialize stats for all variants
    test.variants.forEach(variant => {
      variantStats.set(variant.id, {
        assignments: 0,
        conversions: 0,
        conversionRate: 0,
        totalValue: 0
      });
    });

    // Count assignments
    [...this.userAssignments.entries()]
      .filter(([key]) => key === testId)
      .forEach(([, variantId]) => {
        const stats = variantStats.get(variantId);
        if (stats) {
          stats.assignments++;
        }
      });

    // Count conversions
    testResults.forEach(result => {
      const stats = variantStats.get(result.variantId);
      if (stats) {
        if (result.converted) {
          stats.conversions++;
          stats.totalValue += result.conversionValue || 0;
        }
      }
    });

    // Calculate conversion rates
    variantStats.forEach(stats => {
      if (stats.assignments > 0) {
        stats.conversionRate = stats.conversions / stats.assignments;
      }
    });

    return {
      test,
      variantStats: Object.fromEntries(variantStats),
      totalAssignments: [...variantStats.values()].reduce((sum, stats) => sum + stats.assignments, 0),
      totalConversions: [...variantStats.values()].reduce((sum, stats) => sum + stats.conversions, 0)
    };
  }

  public getAllActiveTests() {
    return [...this.tests.values()].filter(test => test.isActive);
  }

  public getUserAssignments() {
    return Object.fromEntries(this.userAssignments);
  }
}

// React Hook for A/B Testing
export function useABTesting() {
  const [abTesting, setABTesting] = useState<WorldClassABTesting | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('ff_user_id') || 'anonymous';
      const abTestingInstance = new WorldClassABTesting(userId);
      setABTesting(abTestingInstance);
    }
  }, []);

  const getVariant = useCallback((testId: string) => {
    return abTesting?.getVariant(testId) || null;
  }, [abTesting]);

  const trackConversion = useCallback((testId: string, conversionValue?: number) => {
    abTesting?.trackConversion(testId, conversionValue);
  }, [abTesting]);

  const getTestResults = useCallback((testId: string) => {
    return abTesting?.getTestResults(testId) || null;
  }, [abTesting]);

  return {
    getVariant,
    trackConversion,
    getTestResults,
    isReady: !!abTesting
  };
}

// Component for A/B Testing
export function ABTestProvider({ children }: { children: React.ReactNode }) {
  const { isReady } = useABTesting();

  if (!isReady) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }

  return <>{children}</>;
}

// A/B Test Results Dashboard (for development)
export function ABTestDashboard() {
  const { getTestResults } = useABTesting();
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const tests = ['hero_cta_test', 'conversion_banner_test', 'quiz_flow_test', 'results_page_test'];
      const results = tests.map(testId => getTestResults(testId)).filter(Boolean);
      setTestResults(results);
    }
  }, [getTestResults]);

  if (process.env.NODE_ENV !== 'development' || testResults.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border rounded-lg shadow-lg p-4 max-w-md max-h-96 overflow-y-auto z-50">
      <h3 className="font-bold text-lg mb-3">A/B Test Results</h3>
      {testResults.map((result, index) => (
        <div key={index} className="mb-4 p-3 bg-gray-50 rounded">
          <h4 className="font-semibold text-sm">{result.test.name}</h4>
          <div className="text-xs space-y-1 mt-2">
            {Object.entries(result.variantStats).map(([variantId, stats]: [string, any]) => (
              <div key={variantId} className="flex justify-between">
                <span>{variantId}:</span>
                <span>{Math.round(stats.conversionRate * 100)}% ({stats.conversions}/{stats.assignments})</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default WorldClassABTesting;
