'use client';

import { useState, useEffect } from 'react';

/**
 * GTM Debug Helper
 * This component provides a UI for enabling GTM debug mode
 * and launching the Tag Assistant tool.
 */
export default function GTMDebugHelper() {
  const [isDebugMode, setIsDebugMode] = useState(false);
  
  useEffect(() => {
    // Check if debug mode is already enabled via URL
    const isDebug = new URLSearchParams(window.location.search).get('gtm_debug') === 'x';
    setIsDebugMode(isDebug);
  }, []);

  const enableDebugMode = () => {
    // Add gtm_debug=x parameter to URL
    const url = new URL(window.location.href);
    url.searchParams.set('gtm_debug', 'x');
    window.location.href = url.toString();
  };

  const openTagAssistant = () => {
    // Open Google Tag Assistant in a new window
    window.open('https://tagassistant.google.com/', '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="text-lg font-bold mb-2">GTM Debug Tool</h3>
        
        <div className="mb-4 text-sm">
          <p className="mb-2">Container: <span className="font-mono font-bold">GTM-N9Z2SZGP</span></p>
          <p>
            Debug Mode: 
            <span className={isDebugMode ? "ml-1 text-green-600 font-bold" : "ml-1 text-red-600"}>
              {isDebugMode ? "Enabled ✓" : "Disabled ✗"}
            </span>
          </p>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={enableDebugMode}
            disabled={isDebugMode}
            className={`w-full py-2 px-4 rounded text-white text-sm font-medium ${isDebugMode ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isDebugMode ? 'Debug Mode Active' : '1. Enable Debug Mode'}
          </button>
          
          <button
            onClick={openTagAssistant}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium"
          >
            2. Open Tag Assistant
          </button>
        </div>
        
        <div className="mt-4 text-xs text-gray-600 bg-gray-100 p-2 rounded">
          <p className="font-medium mb-1">Instructions:</p>
          <ol className="list-decimal list-inside">
            <li>Click "Enable Debug Mode"</li>
            <li>Click "Open Tag Assistant"</li>
            <li>In Tag Assistant, enter your site URL</li>
            <li>Connect to the debugger</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
