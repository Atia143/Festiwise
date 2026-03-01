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
  autoHide,
}: ConversionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide && autoHide > 0) {
      const timer = setTimeout(() => setIsVisible(false), autoHide * 1000);
      return () => clearTimeout(timer);
    }
  }, [autoHide]);

  const bannerConfigs = {
    quiz: {
      gradient: 'from-purple-700 via-purple-600 to-pink-600',
      title: 'Find your perfect festival in 2 minutes',
      subtitle: '100+ events matched to your taste, budget, and vibe.',
      cta: 'Take the Free Quiz',
      href: '/quiz',
      benefits: ['Personalized results', 'No account required', 'Discover hidden gems'],
    },
    newsletter: {
      gradient: 'from-purple-700 via-pink-600 to-rose-600',
      title: 'Never miss a festival you\'d love',
      subtitle: 'Early-bird alerts and curated picks — free, every week.',
      cta: 'Get Free Updates',
      href: '/#newsletter',
      benefits: ['Early-bird ticket alerts', 'Weekly curated picks', 'Unsubscribe anytime'],
    },
    guide: {
      gradient: 'from-indigo-700 via-purple-600 to-purple-700',
      title: 'How to choose the right festival',
      subtitle: 'A practical guide covering budget, lineup, and timing.',
      cta: 'Read the Guide',
      href: '/what-festival-should-i-go-to',
      benefits: ['Budget planning', 'Lineup research', 'Packing & safety tips'],
    },
    tickets: {
      gradient: 'from-emerald-700 via-teal-600 to-cyan-700',
      title: 'Browse tickets for 100+ festivals',
      subtitle: 'Direct official links — no markup, no middleman.',
      cta: 'Browse Festivals',
      href: '/festivals',
      benefits: ['Official sources only', 'No extra fees', 'Full price transparency'],
    },
  };

  const config = bannerConfigs[variant];
  const positionClasses = {
    top: 'fixed top-0 left-0 right-0 z-[99] shadow-2xl',
    bottom: 'fixed bottom-0 left-0 right-0 z-[99] shadow-2xl',
    inline: 'relative',
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0, y: position === 'top' ? -60 : position === 'bottom' ? 60 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position === 'top' ? -60 : position === 'bottom' ? 60 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        aria-live="polite"
        className={`${positionClasses[position]} bg-gradient-to-r ${config.gradient} text-white overflow-hidden ${position === 'inline' ? 'rounded-2xl my-4 mx-auto' : ''}`}
        style={{ maxWidth: position === 'inline' ? '900px' : undefined }}
      >
        <div className="px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            {/* Text */}
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-base sm:text-lg leading-snug">{config.title}</p>
              <p className="text-white/80 text-sm mt-0.5 hidden sm:block">{config.subtitle}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
                {config.benefits.map((benefit, idx) => (
                  <span key={idx} className="flex items-center gap-1 text-xs text-white/80">
                    <span className="text-white/60">·</span>{benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                href={config.href}
                className="bg-white text-gray-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  if (typeof window !== 'undefined' && (window as any).gtag) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (window as any).gtag('event', 'conversion_banner_click', {
                      banner_variant: variant,
                      banner_position: position,
                    });
                  }
                }}
              >
                {config.cta}
              </Link>

              {showClose && (
                <button
                  onClick={() => setIsVisible(false)}
                  className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 rounded-full transition-all"
                  aria-label="Close banner"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
