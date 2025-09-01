'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SharePrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  
  // Show the prompt after 60 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only show if they haven't shared already (could use localStorage to persist this)
      if (!localStorage.getItem('hasShared')) {
        setIsVisible(true);
      }
    }, 60000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const shareContent = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'FestiWise - Find Your Perfect Music Festival',
          text: 'I just found this amazing app that helps you discover music festivals perfectly matched to your preferences!',
          url: window.location.href,
        });
        
        // Mark as shared
        setHasShared(true);
        localStorage.setItem('hasShared', 'true');
        setIsVisible(false);
      } else {
        // Fallback for browsers without share API
        navigator.clipboard.writeText(window.location.href);
        setHasShared(true);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:max-w-md bg-white rounded-lg shadow-xl p-5 z-50 border border-purple-100"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-purple-900">Share with friends</h3>
              <p className="text-gray-600 mt-1">
                Know someone looking for their next festival experience? Share FestiWise with them!
              </p>
              
              <div className="mt-4 flex space-x-3">
                <button 
                  onClick={shareContent}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium"
                >
                  Share Now
                </button>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium"
                >
                  Maybe Later
                </button>
              </div>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
