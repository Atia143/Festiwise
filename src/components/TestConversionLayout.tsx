'use client';

import { Suspense } from "react";
import ConversionBanner from "@/components/ConversionBanner";

interface TestConversionLayoutProps {
  children: React.ReactNode;
}

export default function TestConversionLayout({ children }: TestConversionLayoutProps) {
  return (
    <div className="min-h-screen">
      <h1>Testing ConversionBanner</h1>
      <ConversionBanner 
        variant="quiz" 
        position="top" 
        showClose={true}
        autoHide={30}
      />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
