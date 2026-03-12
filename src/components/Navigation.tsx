'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Music2, Compass, BookOpen, Building2, Zap,
} from 'lucide-react';
import CurrencySelector from '@/components/CurrencySelector';
import FestivalSearch from '@/components/FestivalSearch';

// Primary user-facing nav (desktop pill + mobile grid)
const NAV_ITEMS = [
  { href: '/quiz',        label: 'Quiz',        icon: Sparkles },
  { href: '/festivals',   label: 'Festivals',   icon: Music2   },
  { href: '/discover',    label: 'Discover',    icon: Compass  },
  { href: '/collections', label: 'Collections', icon: BookOpen },
  { href: '/pricing',     label: 'Pricing',     icon: Zap      },
];

// Secondary B2B link — shown in mobile menu + desktop right rail
const B2B_LINK = { href: '/for-festivals', label: 'For Organizers', icon: Building2 };

// ── Sub-components ─────────────────────────────────────────────────────────────

function Logo({ transparent }: { transparent: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
      <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-110">
        <span className="text-white font-black text-lg leading-none select-none">F</span>
      </div>
      <span className={`font-extrabold text-xl tracking-tight transition-colors duration-300 ${
        transparent ? 'text-white' : 'text-gray-900'
      }`}>
        Festi<span className={transparent ? 'text-yellow-300' : 'text-purple-600'}>Wise</span>
      </span>
    </Link>
  );
}

function CTAButton({ mobile = false, onClick }: { mobile?: boolean; onClick?: () => void }) {
  return (
    <Link
      href="/quiz"
      onClick={onClick}
      className={`flex items-center gap-2 font-bold rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black shadow-lg hover:shadow-yellow-500/30 transition-all duration-200 active:scale-95 tap-highlight-none touch-manipulation ${
        mobile
          ? 'w-full justify-center py-4 text-base rounded-2xl'
          : 'px-5 py-2.5 text-sm whitespace-nowrap'
      }`}
    >
      <Sparkles className={mobile ? 'w-5 h-5' : 'w-4 h-4'} />
      <span>{mobile ? 'Find My Festival — Free, 2 min' : 'Find My Festival'}</span>
    </Link>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function Navigation() {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const pathname   = usePathname() ?? '';
  const mobileRef  = useRef<HTMLDivElement>(null);

  // Hero-aware: transparent only on homepage when at the top
  const isTransparent = pathname === '/' && !scrolled && mounted;

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [isOpen]);

  const isActive = (href: string) =>
    href !== '/' ? pathname.startsWith(href) : pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-2xl shadow-sm border-b border-gray-100/80'
      }`}
      role="banner"
    >
      {/* ── Announcement banner ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white text-center py-2 text-xs font-semibold tracking-wide">
        <Link href="/pricing" className="hover:underline underline-offset-2 decoration-white/60">
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-3 h-3" />
            Pro is here: early ticket alerts, unlimited compare &amp; more &rarr;
          </span>
        </Link>
      </div>

      {/* ── Desktop nav ─────────────────────────────────────────────────────── */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16 gap-4">

          {/* Logo */}
          <Logo transparent={isTransparent} />

          {/* Nav pills — hidden below lg */}
          {mounted && (
            <nav
              className="hidden lg:flex items-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all duration-300"
              style={{
                background: isTransparent ? 'rgba(255,255,255,0.10)' : 'rgba(243,244,246,0.9)',
                border: isTransparent ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(229,231,235,0.8)',
                backdropFilter: 'blur(12px)',
              }}
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                        : isTransparent
                        ? 'text-white/85 hover:text-white hover:bg-white/15'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right actions */}
          {mounted && (
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <div className="w-44 xl:w-56">
                <FestivalSearch />
              </div>
              <CurrencySelector />
              <Link
                href={B2B_LINK.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  isActive(B2B_LINK.href)
                    ? 'text-purple-700 bg-purple-50 border-purple-200'
                    : isTransparent
                    ? 'text-white/70 border-white/20 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 border-gray-200 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>For Organizers</span>
              </Link>
              <CTAButton />
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className={`lg:hidden p-2.5 rounded-xl transition-all duration-200 touch-manipulation tap-highlight-none border ${
              isTransparent
                ? 'text-white bg-white/10 border-white/20 hover:bg-white/20'
                : 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="w-5 h-5 flex flex-col justify-between py-0.5">
              <motion.span
                className={`block h-0.5 w-5 rounded-full origin-center ${isTransparent ? 'bg-white' : 'bg-gray-700'}`}
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className={`block h-0.5 w-5 rounded-full ${isTransparent ? 'bg-white' : 'bg-gray-700'}`}
                animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0 : 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className={`block h-0.5 w-5 rounded-full origin-center ${isTransparent ? 'bg-white' : 'bg-gray-700'}`}
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile panel ────────────────────────────────────────────────────── */}
      {mounted && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-[99999] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />

              {/* Sheet slides from top */}
              <motion.div
                ref={mobileRef}
                className="absolute top-0 left-0 right-0 bg-white shadow-2xl rounded-b-3xl overflow-hidden"
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              >
                {/* Mini banner */}
                <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white text-center py-2 text-xs font-semibold">
                  Pro is here: early ticket alerts &amp; more &rarr;
                </div>

                <div className="px-4 pt-4 pb-6 space-y-4">
                  {/* Search */}
                  <FestivalSearch onClose={() => setIsOpen(false)} />

                  {/* Nav grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[...NAV_ITEMS, B2B_LINK].map(({ href, label, icon: Icon }) => {
                      const active = isActive(href);
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl text-xs font-bold transition-all duration-200 tap-highlight-none ${
                            active
                              ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-gray-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-center leading-tight">{label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Main CTA */}
                  <CTAButton mobile onClick={() => setIsOpen(false)} />

                  {/* Currency */}
                  <div className="flex justify-center pt-1">
                    <div className="bg-gray-900 rounded-xl px-4 py-2.5">
                      <CurrencySelector />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </header>
  );
}
