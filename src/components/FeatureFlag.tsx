'use client';

import { ReactNode } from 'react';

// Simple feature flag component that conditionally renders its children
interface FeatureFlagProps {
  name: string;
  defaultOff?: boolean;
  children: ReactNode;
}

export default function FeatureFlag({ name, defaultOff = false, children }: FeatureFlagProps) {
  // Read feature flags from localStorage (if available)
  const isEnabled = () => {
    if (typeof window === 'undefined') {
      return !defaultOff; // Default to on during SSR unless explicitly defaultOff
    }
    
    try {
      const flags = JSON.parse(localStorage.getItem('featureFlags') || '{}');
      // If the flag exists in localStorage, use that value, otherwise use !defaultOff
      return flags[name] !== undefined ? flags[name] : !defaultOff;
    } catch (e) {
      console.error('Error parsing feature flags:', e);
      return !defaultOff;
    }
  };

  return isEnabled() ? <>{children}</> : null;
}
