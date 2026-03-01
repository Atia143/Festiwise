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
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Auto-hide
  useEffect(() => {
    if (autoHide && autoHide > 0) {
      const timer = setTimeout(() => setIsVisible(false), autoHide * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoHide]);

  // Countdown (24h urgency)
  useEffect(() => {
    const endTime = Date.now() + (24 * 60 * 60 * 1000);
    const update = () => setTimeLeft(Math.max(0, endTime - Date.now()));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  function formatTime(ms: number) {
    const h = Math.floor(ms / (3600 * 1000));
    const m = Math.floor((ms % (3600 * 1000)) / (60 * 1000));
    const s = Math.floor((ms % (60 * 1000)) / 1000);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  const bannerConfigs = {
    quiz: {
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      icon: '🎯',
      title: 'Find Your Perfect Festival in 2 Minutes',
      subtitle: 'Join festival enthusiasts who found their dream events',
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
  const positionClasses = {
    top: 'fixed top-0 left-0 right-0 z-[99] shadow-2xl',
    bottom: 'fixed bottom-0 left-0 right-0 z-[99] shadow-2xl',
    inline: 'relative'
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: position === 'top' ? -80 : position === 'bottom' ? 80 : 0, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: position === 'top' ? -80 : position === 'bottom' ? 80 : 0, scale: 0.98 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        aria-live="polite"
        className={`${positionClasses[position]} bg-gradient-to-r ${config.gradient} text-white overflow-hidden rounded-xl ${position === 'inline' ? 'my-4' : ''} mx-auto`}
        style={{ maxWidth: '900px', margin: position === 'inline' ? '1.5rem auto' : '0 auto' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.09'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}/>
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-4 py-7 sm:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-8">
            {/* Icon */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
              className="text-4xl md:text-5xl mb-2 md:mb-0"
              aria-hidden="true"
            >
              {config.icon}
            </motion.div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-1">{config.title}</h3>
              <p className="text-base sm:text-lg text-white/90 mb-2">{config.subtitle}</p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
                {config.benefits.map((benefit, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 text-sm text-white/90 bg-white/10 rounded px-2 py-1">
                    <span className="text-white">✓</span>{benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Side: CTA, Urgency, Timer */}
            <div className="flex flex-col items-center gap-3 mt-4 md:mt-0 min-w-[220px]">
              {/* Countdown */}
              {timeLeft !== null && (
                <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-center shadow text-white/90 font-mono text-base font-semibold tracking-wide border border-white/10 mb-1">
                  <span className="block text-xs sm:text-sm opacity-80">Offer ends in</span>
                  <span className="text-lg sm:text-xl font-bold">{formatTime(timeLeft)}</span>
                </div>
              )}
              {/* Urgency */}
              <div className="text-xs sm:text-sm text-white/90 font-semibold mb-1">{config.urgency}</div>
              {/* CTA */}
              <Link
                href={config.href}
                className="group relative bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl min-w-[190px] text-center border border-white/30"
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (window as any).gtag('event', 'conversion_banner_click', {
                      banner_variant: variant,
                      banner_position: position,
                      cta_text: config.cta
                    });
                  }
                }}
                tabIndex={0}
                aria-label={config.cta}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {config.cta}
                  <motion.span
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-xl mt-0.5"
                  >→</motion.span>
                </span>
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-0 group-hover:opacity-10 transition-opacity rounded-full pointer-events-none"/>
              </Link>
              {/* Social Proof */}
              <div className="text-xs text-white/70 text-center mt-1">⭐ Trusted by festival enthusiasts</div>
            </div>

            {/* Close Button */}
            {showClose && (
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 z-20"
                aria-label="Close banner"
                tabIndex={0}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        {/* Animated Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
        />
      </motion.section>
    </AnimatePresence>
  );
}