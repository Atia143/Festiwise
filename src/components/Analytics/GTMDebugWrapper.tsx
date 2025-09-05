'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the GTM Debug Helper (only in development)
const GTMDebugHelper = dynamic(
  () => process.env.NODE_ENV === 'development' 
    ? import('./GTMDebugHelper')
    : Promise.resolve(() => null),
  { ssr: false }
);

/**
 * Client-side wrapper for GTM debugging
 * This component is needed to use next/dynamic with ssr:false in Next.js
 */
export default function GTMDebugWrapper() {
  useEffect(() => {
    // Only load in development
    if (process.env.NODE_ENV !== 'development') return;
    
    console.log('GTM Debug Helper loaded');
  }, []);

  // Only render the debug helper in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return <GTMDebugHelper />;
}
