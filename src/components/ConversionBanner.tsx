'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversionBannerProps {
  variant?: 'quiz' | 'newsletter' | 'guide' | 'tickets';
  position?: 'top' | 'bottom' | 'inline';
  showClose?: boolean;
  autoHide?: number; // seconds
}

export default function ConversionBanner({ 
  variant = 'quiz', 
  position = 'inline',
  showClose = true,
  autoHide 
}: ConversionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [_animationDelay, _setAnimationDelay] = useState(0);
  const [countdown, setCountdown] = useState(15);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && autoHide > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHide * 1000);

      return () => clearTimeout(timer);
    }
  }, [autoHide]);

  // Limited time countdown for urgency
  useEffect(() => {
    const endTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
    
    const updateCountdown = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      setTimeLeft(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const bannerConfigs = {
    quiz: {
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      icon: '🎯',
      title: 'Find Your Perfect Festival in 2 Minutes',
      subtitle: 'Join 50,000+ festival-goers who found their dream events',
      cta: 'Take Free Quiz',
      href: '/quiz',
      benefits: ['Personalized recommendations', 'Save time & money', 'Discover hidden gems'],
      urgency: 'Limited time: Free personalized festival guide'
    },
    newsletter: {
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      icon: '📧',
      title: 'Never Miss Epic Festivals Again',
      subtitle: 'Get exclusive early-bird tickets & insider festival tips',
      cta: 'Get Free Updates',
      href: '/newsletter',
      benefits: ['Early-bird ticket alerts', 'Exclusive discounts', 'VIP festival tips'],
      urgency: 'This week only: Free festival packing checklist'
    },
    guide: {
      gradient: 'from-blue-500 via-purple-500 to-indigo-600',
      icon: '📋',
      title: 'The Ultimate Festival Selection Guide',
      subtitle: 'Proven strategies used by festival experts worldwide',
      cta: 'Get Free Guide',
      href: '/what-festival-should-i-go-to',
      benefits: ['Expert selection criteria', 'Budget optimization tips', 'Safety guidelines'],
      urgency: 'Download now: Complete festival planning toolkit'
    },
    tickets: {
      gradient: 'from-green-500 via-emerald-500 to-teal-600',
      icon: '🎫',
      title: 'Secure Your Festival Tickets Today',
      subtitle: 'Official tickets with buyer protection guarantee',
      cta: 'Find Tickets',
      href: '/festivals',
      benefits: ['100% authentic tickets', 'Instant confirmation', 'Full refund protection'],
      urgency: 'Flash sale: Up to 30% off select festivals'
    }
  };

  const config = bannerConfigs[variant];

  if (!isVisible) return null;

  const positionClasses = {
    top: 'fixed top-0 left-0 right-0 z-50 shadow-lg',
    bottom: 'fixed bottom-0 left-0 right-0 z-50 shadow-lg',
    inline: 'relative'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: position === 'top' ? -100 : position === 'bottom' ? 100 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position === 'top' ? -100 : position === 'bottom' ? 100 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`${positionClasses[position]} bg-gradient-to-r ${config.gradient} text-white overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              
              {/* Main Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                  <motion.span 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="text-3xl"
                  >
                    {config.icon}
                  </motion.span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                      {config.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 mt-1">
                      {config.subtitle}
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="hidden sm:flex flex-wrap justify-center lg:justify-start gap-4 mt-3">
                  {config.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-sm text-white/90">
                      <span className="text-white">✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency & CTA Section */}
              <div className="flex flex-col items-center gap-4">
                {/* Countdown Timer */}
                {timeLeft !== null && (
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                    <div className="text-xs text-white/80 mb-1">Offer expires in:</div>
                    <div className="font-mono text-lg font-bold">
                      {formatTime(timeLeft)}
                    </div>
                  </div>
                )}

                {/* Urgency Message */}
                <div className="text-center">
                  <div className="text-sm text-white/90 mb-3">
                    {config.urgency}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={config.href}
                  className="group relative bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden min-w-[200px] text-center"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.gtag) {
                      window.gtag('event', 'conversion_banner_click', {
                        banner_variant: variant,
                        banner_position: position,
                        cta_text: config.cta
                      });
                    }
                  }}
                >
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <span>{config.cta}</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-xl"
                    >
                      →
                    </motion.span>
                  </div>
                </Link>

                {/* Social Proof */}
                <div className="text-xs text-white/70 text-center">
                  ⭐ Trusted by 50,000+ festival enthusiasts
                </div>
              </div>

              {/* Close Button */}
              {showClose && (
                <button
                  onClick={() => setIsVisible(false)}
                  className="absolute top-2 right-2 lg:relative lg:top-0 lg:right-0 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                  aria-label="Close banner"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Animated Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
        />
      </motion.div>
    </AnimatePresence>
  );
}
