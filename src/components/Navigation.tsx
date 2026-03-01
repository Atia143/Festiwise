'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Nav items config
const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/quiz', label: 'Quiz', icon: '🎯' },
  { href: '/festivals', label: 'Marketplace(Soon)', icon: '🎪' },
  { href: '/discover', label: 'Discover', icon: '🗺️' },
  { href: '/faq', label: 'FAQ', icon: '❓' },
];

// Logo component (could expand with SVG, etc.)
function Logo({ scrolled }: { scrolled: boolean }) {
  return (
    <Link href="/" className="flex items-center space-x-2 group">
      <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-xl">F</span>
      </div>
      <span className={`font-extrabold text-2xl transition-all duration-300 bg-clip-text ${
        scrolled
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-transparent'
          : 'text-gray-900'
      }`}>
        FestiWise
      </span>
    </Link>
  );
}

export default function Navigation({ locales = ['en'] }: { locales?: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile nav open
  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; }
  }, [isOpen, mounted]);

  // ESC to close mobile nav
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Close mobile nav when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname && pathname.startsWith(href)) return true;
    return false;
  };

  // Banner always at top
  const Banner = () => (
    <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white text-center py-2 text-xs font-medium">
      🎉 World-Class Festival Discovery • Free Forever
    </div>
  );

  // Language selector (optional - can extract)
  const LangSelector = () => (
    <select
      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:border-gray-300"
      aria-label="Language"
      onChange={e => {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'language_changed', { language: e.target.value });
        }
      }}
      defaultValue="en"
    >
      <option value="en">🇺🇸 EN</option>
      <option value="es">🇪🇸 ES</option>
      <option value="fr">🇫🇷 FR</option>
      <option value="de">🇩🇪 DE</option>
    </select>
  );

  // CTA Button
  const CTAButton = ({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Link
        href="/quiz"
        onClick={onClick}
      className={`relative px-8 py-3 ${mobile ? 'w-full block text-center text-base md:text-lg' : ''} bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group`}
      >
        <motion.span
          className="text-xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🚀
        </motion.span>
        <span>{mobile ? 'Find My Festival (2 min)' : 'Take Quiz'}</span>
      </Link>
    </motion.div>
  );

  // Desktop nav
  const DesktopNav = () => (
    <nav className="hidden lg:flex items-center" aria-label="Main navigation">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-500 ${
        scrolled
          ? 'bg-gray-50/80 backdrop-blur-xl border border-gray-200/50 shadow-lg'
          : 'bg-white/10 backdrop-blur-xl border border-white/20'
      }`}>
        {NAV_ITEMS.map((item, _i) => (
          <Link
            key={item.href}
            href={item.href}
            className={`relative px-4 py-3 rounded-xl font-medium text-sm group transition-all duration-300 overflow-hidden ${
              isActive(item.href)
                ? scrolled
                  ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                  : 'text-gray-900 bg-white shadow-lg'
                : scrolled
                ? 'text-gray-700 hover:text-gray-900 hover:bg-white/80'
                : 'text-white/90 hover:text-white hover:bg-white/20'
            }`}
          >
            <span className="flex items-center space-x-2">
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </span>
            {isActive(item.href) && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                layoutId="activeNavBackground"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );

  // Mobile nav
  const MobileNav = () => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={mobileNavRef}
          className="fixed inset-0 z-[99999] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          {/* Panel */}
          <motion.div
            className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-gray-200/50 shadow-2xl"
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            exit={{ y: -40 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="relative px-6 py-8 space-y-3">
              {/* Items */}
              <div className="space-y-2">
                {NAV_ITEMS.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 px-6 py-3 rounded-xl font-medium group relative overflow-hidden transition-all duration-300 text-sm ${
                      isActive(item.href)
                        ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/80 border border-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-base">{item.label}</span>
                  </Link>
                ))}
              </div>
              {/* CTA */}
              <div className="pt-4 border-t border-gray-200/50">
                <CTAButton mobile onClick={() => setIsOpen(false)} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.header
      className={`fixed left-0 right-0 z-[9999] transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-white/30'
          : 'bg-white/90 backdrop-blur-md border-b border-gray/20 shadow-xl'
      }`}
      style={{ top: 'var(--banner-height, 0px)' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      role="banner"
      suppressHydrationWarning
    >
      <Banner />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Logo scrolled={scrolled && mounted} />
          {mounted && <DesktopNav />}
          {mounted && (
            <div className="hidden lg:flex items-center gap-4">
              {locales && locales.length > 1 && <LangSelector />}
              <CTAButton />
            </div>
          )}
          {/* Mobile menu toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(v => !v)}
              aria-label="Toggle mobile menu"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              className={`p-3 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 overflow-hidden ${
                scrolled
                  ? 'text-gray-600 hover:text-gray-900 bg-gray-50/80 hover:bg-gray-100 border border-gray-200/50'
                  : 'text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/20'
              }`}
            >
              {/* Hamburger */}
              <div className="w-6 h-6 relative">
                <motion.span
                  className={`absolute block h-0.5 w-6 rounded-full transition-all duration-300 ${
                    scrolled ? 'bg-gray-600' : 'bg-white'
                  }`}
                  animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  style={{ top: '6px' }}
                />
                <motion.span
                  className={`absolute block h-0.5 w-6 rounded-full transition-all duration-300 ${
                    scrolled ? 'bg-gray-600' : 'bg-white'
                  }`}
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  style={{ top: '12px' }}
                />
                <motion.span
                  className={`absolute block h-0.5 w-6 rounded-full transition-all duration-300 ${
                    scrolled ? 'bg-gray-600' : 'bg-white'
                  }`}
                  animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  style={{ top: '18px' }}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>
      {mounted && <MobileNav />}
    </motion.header>
  );
}