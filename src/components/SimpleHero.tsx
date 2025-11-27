'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
// Optional: comment out analytics/stats lines if you don't use them
import { statsManager } from '@/lib/realTimeStats';
import { analytics } from '@/lib/analytics';
import SocialProof from './SocialProof';

// Simple translation; swap for your i18n solution as needed
function useSimpleLanguage(): { t: (key: string) => string } {
  const translations: Record<string, string> = {
    'hero.title': 'Find My Perfect Festival',
    'hero.subtitle': 'Discover festivals matched to your taste, budget and vibe — fast, private, and free.',
    'hero.cta': 'Find My Perfect Festival',
  };

  function t(key: string) {
    return translations[key] || key;
  }

  return { t };
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function UltimateHero() {
  const { t } = useSimpleLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    festivals: '100+ festivals',
    users: 'users',
    countries: '50 countries',
    currentUsers: '25 users online',
    recommendations: '100 matches made',
    lastUpdated: 'September 1, 2025'
  });

  useEffect(() => {
    // Optional analytics
    analytics?.initialize?.('G-BDQF8TX7MF');
    analytics?.trackPageView?.('/', 'Festival Finder Homepage');
    setStats(statsManager?.getFormattedStats?.() || stats);

    const statsInterval = setInterval(() => {
      setStats(statsManager?.getFormattedStats?.() || stats);
    }, 30000);

    // Respect user preference for reduced motion
    let prefersReduced = false;
    try {
      prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      prefersReduced = false;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReduced) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    if (!prefersReduced) window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(statsInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 overflow-hidden px-4 sm:px-6 lg:px-8 py-16">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/80 to-pink-800/90" />

        {/* Parallax floating circles */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl hidden md:block"
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-pink-400/20 rounded-full blur-xl"
          animate={{
            x: mousePosition.x * -0.1,
            y: mousePosition.y * -0.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"
          animate={{
            x: mousePosition.x * 0.15,
            y: mousePosition.y * 0.15,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
        />

        {/* Optional: Particle overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {/* Social Proof */}
          <motion.div
            variants={fadeIn}
            className="mb-6 pt-20"
          >
            <SocialProof 
              ratingValue={4.9}
              ratingCount={parseInt(stats.users.replace(/[^\d]/g, ''))}
              ratingAsOf="December 2024"
            />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6"
          >
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-pink-100">
              {t('hero.title').split(' ').slice(0, 2).join(' ')}
            </span>
            <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
              {t('hero.title').split(' ').slice(2).join(' ')}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={fadeIn}
            className="mb-8 flex flex-wrap justify-center items-center gap-4 md:gap-8 text-white/80 text-sm"
          >
            <div className="text-center min-w-[60px]">
              <div className="text-base md:text-xl lg:text-2xl font-bold text-yellow-300">{stats.festivals}</div>
              <div className="text-xs md:text-sm">Festivals</div>
            </div>
            <div className="text-center min-w-[60px]">
              <div className="text-base md:text-xl lg:text-2xl font-bold text-yellow-300">2 min</div>
              <div className="text-xs md:text-sm">Quick Quiz</div>
            </div>
            <div className="text-center min-w-[60px]">
              <div className="text-base md:text-xl lg:text-2xl font-bold text-yellow-300">100%</div>
              <div className="text-xs md:text-sm">Free</div>
            </div>
            <div className="text-center min-w-[60px]">
              <div className="text-base md:text-xl lg:text-2xl font-bold text-green-300">{stats.countries}</div>
              <div className="text-xs md:text-sm">Countries</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <Link
              href="/quiz"
              className="group relative w-full sm:max-w-sm px-6 md:px-8 py-3 md:py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black font-bold text-base md:text-lg lg:text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-yellow-300/50 focus:ring-offset-2 transform hover:rotate-1"
              aria-describedby="quiz-description"
            >
              <motion.span
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
              <span className="relative z-10 flex items-center justify-center">
                {t('hero.cta')}
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 6, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  →
                </motion.span>
              </span>
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                2 MIN
              </div>
            </Link>
            <div id="quiz-description" className="sr-only">
              Take our personalized quiz to find music festivals that match your taste, budget, and location preferences
            </div>
            
            <div className="flex gap-3 text-sm md:text-base">
              <Link
                href="/festivals"
                className="px-4 py-2 md:px-6 md:py-3 rounded-xl border border-white/60 text-white font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-105"
              >
                Browse Festivals
              </Link>
              <Link
                href="/blog"
                className="px-4 py-2 md:px-6 md:py-3 rounded-xl border border-white/60 text-white font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-105"
              >
                Guides
              </Link>
              <Link
                href="/faq"
                className="px-4 py-2 md:px-6 md:py-3 rounded-xl border border-white/60 text-white font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-105"
              >
                FAQ
              </Link>
            </div>
          </motion.div>

          {/* Trust Badge - Added disclaimer in a strategic way */}
          <motion.div
            variants={fadeIn}
            className="mt-6 mb-8"
          >
            <div className="flex flex-wrap justify-center items-center">
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mx-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-xs sm:text-sm text-white/90 font-medium">
                  We're not affiliated with festivals and do not sell tickets. We link directly to official pages.
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            variants={fadeIn}
            className="mt-6 max-w-xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    M
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm md:text-base">Marcus K.</div>
                    <div className="text-white/60 text-xs">Berlin • Verified</div>
                  </div>
                </div>
                <div className="flex text-yellow-400 text-sm">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <p className="text-white/90 text-sm md:text-base leading-relaxed">
                "Best festival recommendation ever! We started out just playing around, but the app predicted our festival plans perfectly."
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                <span className="bg-purple-500/20 px-2 py-1 rounded">Ultra Miami</span>
                <span>• 1 week ago</span>
              </div>
            </div>
          </motion.div>
          
          {/* Community Trust Section */}
          <motion.div
            variants={fadeIn}
            className="mt-12 max-w-3xl mx-auto"
          >
          </motion.div>
        </motion.div>
      </div>

      {/* Current date timestamp - subtle reinforcement of freshness */}
      <div className="absolute bottom-2 left-4 text-white/30 text-xs">
        Last updated: November 27, 2025
      </div>
    </section>
  );
}