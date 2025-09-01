'use client';

import { Suspense } from "react";

interface SimpleClientLayoutProps {
  children: React.ReactNode;
}

export default function SimpleClientLayout({ children }: SimpleClientLayoutProps) {
  return (
    <div className="min-h-screen">
      <h1>Simple Client Layout</h1>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
