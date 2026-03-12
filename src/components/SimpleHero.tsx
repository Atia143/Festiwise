'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
// Optional: comment out analytics/stats lines if you don't use them
import { statsManager } from '@/lib/realTimeStats';
import { analytics } from '@/lib/analytics';

// Simple translation; swap for your i18n solution as needed
function useSimpleLanguage(): { t: (key: string) => string } {
  const translations: Record<string, string> = {
    'hero.title': 'Stop Scrolling. Start Celebrating.',
    'hero.subtitle': "Tired of spending hours researching festivals, only to pick the wrong one? We'll match you with festivals that fit your music taste, budget, and vibe—in 2 minutes. No account required. 100% free.",
    'hero.cta': 'Find My Festival Now',
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

const FESTIVAL_NAMES = [
  'Tomorrowland', 'Coachella', 'Glastonbury', 'Burning Man', 'Ultra Music Festival',
  'Lollapalooza', 'Primavera Sound', 'Roskilde', 'Sziget', 'Bonnaroo',
  'Rock Werchter', 'Exit Festival', 'Download Festival', 'Reading & Leeds', 'Mysteryland',
];

export default function UltimateHero() {
  const { t } = useSimpleLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [emailCapture, setEmailCapture] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success'>('idle');
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
    } catch (_e) {
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCapture || emailStatus === 'loading') return;
    setEmailStatus('loading');
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailCapture,
          subject: 'Festival Picks Request — FestiWise',
          message: 'User signed up for festival picks from hero section',
          from_name: 'FestiWise Hero',
        }),
      });
      setEmailStatus('success');
      setEmailCapture('');
    } catch {
      setEmailStatus('idle');
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800 overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/80 to-pink-800/90" />

        {/* Parallax floating circles — mouse-only, hidden on mobile to save battery */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl hidden md:block"
          animate={{
            x: mousePosition.x * 0.1,
            y: mousePosition.y * 0.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-pink-400/20 rounded-full blur-xl hidden md:block"
          animate={{
            x: mousePosition.x * -0.1,
            y: mousePosition.y * -0.1,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 10 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-24 h-24 bg-blue-400/20 rounded-full blur-xl hidden md:block"
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

          {/* Main Heading - Emotional, benefit-focused */}
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight max-w-3xl mx-auto"
          >
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
              {t('hero.title')}
            </span>
          </motion.h1>

          {/* Description - Problem + Solution */}
          <motion.p
            variants={fadeIn}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeIn}
            className="flex flex-col items-center justify-center gap-4 px-4 mb-8"
          >
            <Link
              href="/quiz"
              className="group relative w-full sm:max-w-sm px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-yellow-300/50 focus:ring-offset-2 tap-highlight-none touch-manipulation"
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
            </Link>
            <div id="quiz-description" className="sr-only">
              Take our personalized quiz to find music festivals that match your taste, budget, and location preferences
            </div>
            
            {/* Micro-trust below CTA */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-white/80 text-sm">
              <span>✓ Takes 2 minutes</span>
              <span>✓ 100% free</span>
              <span>✓ Your data is private</span>
            </div>
          </motion.div>

          {/* Stats social proof */}
          <motion.div
            variants={fadeIn}
            className="mt-12 max-w-xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 md:p-6">
              <div className="grid grid-cols-3 divide-x divide-white/10 text-center">
                <div className="px-3">
                  <div className="text-2xl font-black text-yellow-300">100+</div>
                  <div className="text-white/60 text-xs mt-0.5">Festivals curated</div>
                </div>
                <div className="px-3">
                  <div className="text-2xl font-black text-yellow-300">50+</div>
                  <div className="text-white/60 text-xs mt-0.5">Countries covered</div>
                </div>
                <div className="px-3">
                  <div className="text-2xl font-black text-yellow-300">2 min</div>
                  <div className="text-white/60 text-xs mt-0.5">To your matches</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Email capture + social proof marquee */}
          <motion.div
            variants={fadeIn}
            className="mt-10 max-w-xl mx-auto space-y-5"
          >
            {/* Email capture */}
            {emailStatus === 'success' ? (
              <div className="flex items-center justify-center gap-2 py-3 text-green-300 font-semibold text-sm">
                <span>✓</span>
                <span>Festival picks sent — check your inbox!</span>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm pointer-events-none">✉</span>
                  <input
                    type="email"
                    value={emailCapture}
                    onChange={e => setEmailCapture(e.target.value)}
                    placeholder="Get your top festival picks by email"
                    className="w-full pl-9 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 text-base focus:outline-none focus:border-yellow-400/60 focus:bg-white/15 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={emailStatus === 'loading'}
                  className="px-5 py-3 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-white font-semibold text-sm whitespace-nowrap transition-all disabled:opacity-50 touch-manipulation tap-highlight-none"
                >
                  {emailStatus === 'loading' ? '...' : 'Send me picks →'}
                </button>
              </form>
            )}

            {/* Social proof marquee */}
            <div>
              <p className="text-center text-white/30 text-xs mb-2">Fans of these festivals love FestiWise</p>
              <div className="overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-purple-900/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-pink-900/80 to-transparent z-10 pointer-events-none" />
                <motion.div
                  className="flex gap-6 text-white/35 text-xs font-medium"
                  animate={{ x: ['0%', '-50%'] }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                >
                  {[...FESTIVAL_NAMES, ...FESTIVAL_NAMES].map((name, i) => (
                    <span key={i} className="whitespace-nowrap flex items-center gap-2">
                      <span className="w-1 h-1 bg-white/25 rounded-full flex-shrink-0" />
                      {name}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}