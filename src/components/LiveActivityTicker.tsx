'use client';

import FeatureFlag from './FeatureFlag';

/**
 * Live activity notification ticker that shows recent activity
 * Wrapped in a feature flag so it can be easily disabled
 */
export function LiveActivityTicker() {
  return (
    <FeatureFlag name="live_activity" defaultOff>
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-700">
            Someone just found their perfect festival!
          </span>
        </div>
      </div>
    </FeatureFlag>
  );
}
