'use client';

import { Suspense } from "react";
import Navigation from "@/components/Navigation";
import ErrorBoundary from "@/components/ErrorBoundary";

interface TestNavigationLayoutProps {
  children: React.ReactNode;
}

export default function TestNavigationLayout({ children }: TestNavigationLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <h1>Testing Navigation</h1>
        <Navigation />
        <main>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  );
}
