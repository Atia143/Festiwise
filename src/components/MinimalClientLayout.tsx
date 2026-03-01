'use client';

import { Suspense, useEffect } from "react";
import Navigation from "@/components/Navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ABTestProvider, ABTestDashboard } from "@/lib/ab-testing";
import ConversionBanner from "@/components/ConversionBanner";
import { usePerformanceMonitoring } from "@/components/PerformanceMonitor";

interface MinimalClientLayoutProps {
  children: React.ReactNode;
}

// Premium Loading Component
const PremiumLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
        <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-blue-600 animate-pulse mx-auto"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading FestiWise...</p>
      <p className="text-sm text-gray-400">Preparing your festival journey</p>
    </div>
  </div>
);

export default function MinimalClientLayout({ children }: MinimalClientLayoutProps) {
  // Initialize performance monitoring
  const { getMetrics: _getMetrics } = usePerformanceMonitoring();
  
  useEffect(() => {
    // Premium performance tracking
    console.log('🚀 FestiWise Premium App Initialized');
    
    // Track app load time
    const loadTime = performance.now();
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'app_load', {
        event_category: 'performance',
        event_label: 'client_layout',
        value: Math.round(loadTime)
      });
    }
  }, []);
  
  return (
    <ErrorBoundary>
      <ABTestProvider>
        <div className="min-h-screen">
          {/* Navigation */}
          <Navigation />
          
          {/* Premium Conversion Banner */}
          <ConversionBanner 
            variant="quiz" 
            position="top" 
            showClose={true}
            autoHide={30}
          />
          
          {/* Main Content */}
          <main className="pt-20 min-h-screen">
            <Suspense fallback={<PremiumLoader />}>
              {children}
            </Suspense>
          </main>
          
          {/* Premium Development Tools */}
          {process.env.NODE_ENV === 'development' && (
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
              <ABTestDashboard />
              <div className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold">
                🚀 WORLD-CLASS MODE
              </div>
            </div>
          )}
          
          {/* Premium Features Inject Point */}
          <div id="premium-inject" className="hidden"></div>
        </div>
      </ABTestProvider>
    </ErrorBoundary>
  );
}
