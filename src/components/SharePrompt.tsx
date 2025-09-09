'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Add custom animation class
import './sharePrompt.css';

// Social share URLs
const socialLinks = [
  {
    name: 'WhatsApp',
    icon: (
      <svg className="w-6 h-6" fill="#25D366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.028-.967-.271-.099-.469-.149-.668.15-.198.297-.767.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.61-.915-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.009-.571-.009-.198 0-.521.074-.793.372-.271.298-1.04 1.016-1.04 2.479 0 1.462 1.066 2.875 1.215 3.074.149.198 2.095 3.202 5.077 4.377.709.273 1.262.436 1.693.559.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.415.248-.695.248-1.291.174-1.415-.074-.123-.272-.198-.57-.347z"/></svg>
    ),
    url: (text: string, url: string) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
  },
  {
    name: 'Twitter',
    icon: (
      <svg className="w-6 h-6" fill="#1DA1F2" viewBox="0 0 24 24"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.724-.951.555-2.005.959-3.127 1.184-.896-.957-2.175-1.555-3.594-1.555-2.717 0-4.92 2.206-4.92 4.917 0 .39.045.765.126 1.124-4.087-.205-7.713-2.164-10.141-5.144-.424.729-.666 1.577-.666 2.476 0 1.708.87 3.216 2.188 4.099-.807-.026-1.566-.248-2.229-.616v.062c0 2.385 1.697 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.316 0-.624-.03-.924-.086.631 1.953 2.445 3.377 4.6 3.418-1.68 1.317-3.808 2.101-6.102 2.101-.396 0-.787-.023-1.175-.069 2.179 1.394 4.768 2.209 7.557 2.209 9.054 0 14.001-7.496 14.001-13.986 0-.21-.006-.423-.016-.634.962-.689 1.797-1.56 2.457-2.548l-.047-.02z"/></svg>
    ),
    url: (text: string, url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  },
  {
    name: 'Facebook',
    icon: (
      <svg className="w-6 h-6" fill="#1877F3" viewBox="0 0 24 24"><path d="M22.676 0H1.326C.593 0 0 .586 0 1.312v21.376C0 23.414.593 24 1.326 24H12.82v-9.294H9.692V11.21h3.128V8.414c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.765v2.314h3.587l-.467 3.496h-3.12V24h6.116C23.407 24 24 23.414 24 22.688V1.312C24 .586 23.407 0 22.676 0"/></svg>
    ),
    url: (_: string, url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    name: 'Telegram',
    icon: (
      <svg className="w-6 h-6" fill="#0088cc" viewBox="0 0 24 24"><path d="M12 2C6.476 2 2 6.476 2 12c0 5.524 4.476 10 10 10s10-4.476 10-10c0-5.524-4.476-10-10-10zm4.516 7.516l-1.262 5.278c-.186.782-.668.972-1.352.605l-1.914-1.412-0.924.889c-.102.101-.197.197-.404.197l.144-2.032 3.7-3.34c.163-.144-.035-.225-.254-.081l-4.585 2.887-1.97-.615c-.429-.133-.438-.429.09-.564l7.72-2.164c.429-.133.805.102.668.564z"/></svg>
    ),
    url: (text: string, url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  }
];

const shareText = "Discover your perfect music festival with FestiWise — personalized recommendations in seconds! 🎵✨";

export default function SharePrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<Element | null>(null);

  // Show share options after exactly 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000); // 30 seconds
    
    return () => clearTimeout(timer);
  }, []);

  // Force visibility in development mode for testing
  useEffect(() => {
    // This is for testing only - it will make the share prompt appear after a short delay
    if (process.env.NODE_ENV === 'development') {
      const devTimer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // 3 seconds in development mode
      
      return () => clearTimeout(devTimer);
    }
  }, []);
  
  // Track conversions
  const trackShareConversion = (method: string) => {
    // Implement analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share_click', {
        method: method,
        page_section: 'blog'
      });
    }
    console.log(`Share conversion: ${method}`);
  };

  // Focus trap for accessibility
  useEffect(() => {
    if (isVisible) {
      lastFocused.current = document.activeElement;
      if (popupRef.current) {
        popupRef.current.focus();
      }
    } else if (lastFocused.current) {
      (lastFocused.current as HTMLElement).focus();
    }
  }, [isVisible]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  // Native share
  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'FestiWise - Find Your Perfect Music Festival',
          text: shareText,
          url: window.location.href,
        });
        trackShareConversion('native');
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // Social share
  const handleSocialShare = (url: string, platform: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    trackShareConversion(platform);
    setIsVisible(false);
  };

  // Copy link
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    trackShareConversion('copy');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-50 max-w-[250px] animate-pulse-subtle"
          ref={popupRef}
          role="dialog"
          aria-labelledby="share-prompt-title"
          tabIndex={-1}
        >
          <motion.div
            className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-xl p-5 border border-purple-200 flex flex-col space-y-3 focus:outline-none relative backdrop-blur-sm"
            style={{ boxShadow: "0 10px 25px -5px rgba(124, 58, 237, 0.2), 0 8px 10px -6px rgba(124, 58, 237, 0.1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute -top-2 -right-2 bg-white rounded-full shadow-md p-1.5 text-gray-400 hover:text-gray-700 border border-gray-100 hover:border-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <div className="flex flex-col items-center mb-1">
              <h3 id="share-prompt-title" className="font-bold text-lg text-center bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent">Share FestiWise! ✨</h3>
              <div className="mt-2 mb-1 bg-gradient-to-r from-purple-600 to-pink-500 p-0.5 rounded-full w-full">
                <div className="bg-white bg-opacity-90 rounded-full px-3 py-1.5 text-center">
                  <span className="text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">DON'T MISS</span>
                </div>
              </div>
            </div>
            
            {typeof navigator.share === "function" && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-3 px-4 mb-3 rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 hover:from-purple-700 hover:via-fuchsia-600 hover:to-pink-600 text-white font-medium flex justify-center items-center gap-2 shadow-lg transform transition-all duration-200 hover:scale-102 active:scale-98 hover:shadow-pink-200"
                  aria-label="Share using your device"
                  title="Share using your device"
                  style={{ textShadow: "0 1px 1px rgba(0,0,0,0.1)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Now
                </button>
              )}
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                {socialLinks.slice(0, 3).map((s) => (
                  <button
                    key={s.name}
                    onClick={() => handleSocialShare(s.url(shareText, window.location.href), s.name)}
                    className="flex flex-col items-center justify-center py-2.5 bg-white hover:bg-gray-50 rounded-xl text-gray-700 border border-gray-100 transition-all duration-200 hover:border-purple-200 hover:shadow-md hover:-translate-y-0.5"
                    aria-label={`Share on ${s.name}`}
                    title={`Share on ${s.name}`}
                  >
                    {s.icon}
                    <span className="text-2xs font-medium mt-1.5 text-gray-600">{s.name}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleCopy}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-gray-50 to-purple-50 hover:from-purple-50 hover:to-pink-50 text-purple-700 rounded-xl font-medium flex justify-center items-center gap-2 transition-all duration-200 border border-purple-100 hover:border-purple-200 hover:shadow-sm hover:-translate-y-0.5"
                aria-label="Copy link"
                title="Copy link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Link
              </button>
            
            {copySuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ type: "spring", damping: 25 }}
                className="absolute -top-12 left-0 right-0 mx-auto w-max bg-white text-purple-700 px-3.5 py-2 rounded-full shadow-lg text-xs font-medium border border-purple-100"
              >
                ✓ Copied to clipboard
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
