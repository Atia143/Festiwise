'use client';

import { Suspense } from "react";
import { ABTestProvider, ABTestDashboard } from "@/lib/ab-testing";

interface TestABTestLayoutProps {
  children: React.ReactNode;
}

export default function TestABTestLayout({ children }: TestABTestLayoutProps) {
  return (
    <ABTestProvider>
      <div className="min-h-screen">
        <h1>Testing AB Test Components</h1>
        <main>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
        
        {/* Test ABTestDashboard */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4">
            <ABTestDashboard />
          </div>
        )}
      </div>
    </ABTestProvider>
  );
}
