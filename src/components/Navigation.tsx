'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    // Set initial scroll state
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/quiz', label: 'Quiz', icon: '🎯' },
    { href: '/festivals', label: 'Festivals', icon: '🎪' },
    { href: '/blog', label: 'Blog', icon: '📝' },
    { href: '/faq', label: 'FAQ', icon: '❓' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <motion.header
      className={`fixed left-0 right-0 z-[9999] transition-all duration-500 ${
        mounted && scrolled
          ? 'bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-white/30'
          : 'bg-white/90 backdrop-blur-md border-b border-gray/20 shadow-xl'
      }`}
      style={{ 
        top: 'var(--banner-height, 0px)',
        transition: 'top 0.3s ease-in-out'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      role="banner"
    >
      {/* Ambient glow effect */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        scrolled 
          ? 'bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 opacity-100' 
          : 'bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-100'
      } pointer-events-none`} />
      
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group relative">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Logo background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              {/* Logo icon */}
              <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <motion.span 
                  className="text-white font-bold text-xl"
                  initial={{ rotateY: 0 }}
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                >
                  F
                </motion.span>
              </div>
              
              {/* Sparkle effects */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            </motion.div>
            
            <div className="relative">
              <motion.span 
                className={`font-bold text-2xl transition-all duration-300 ${
                  scrolled 
                    ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent' 
                    : 'text-white drop-shadow-lg'
                } group-hover:scale-105`}
                whileHover={{ y: -2 }}
              >
                FestiWise
              </motion.span>
              
              {/* Animated underline */}
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center" aria-label="Main navigation">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-2xl transition-all duration-500 ${
              scrolled 
                ? 'bg-gray-50/80 backdrop-blur-xl border border-gray-200/50 shadow-lg' 
                : 'bg-white/10 backdrop-blur-xl border border-white/20'
            }`}>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm group overflow-hidden ${
                      isActive(item.href)
                        ? scrolled
                          ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                          : 'text-gray-900 bg-white shadow-lg'
                        : scrolled
                        ? 'text-gray-700 hover:text-gray-900 hover:bg-white/80'
                        : 'text-white/80 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {/* Background shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                    
                    <div className="relative flex items-center space-x-2">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    
                    {/* Active indicator */}
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
                </motion.div>
              ))}
            </div>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language selector inline */}
            <select 
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'language_changed', { language: e.target.value });
                }
              }}
            >
              <option value="en">🇺🇸 EN</option>
              <option value="es">🇪🇸 ES</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="de">🇩🇪 DE</option>
            </select>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              
              <Link
                href="/quiz"
                className="relative px-8 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 overflow-hidden group"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 pointer-events-none"
                  initial={false}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative flex items-center space-x-2">
                  <motion.span
                    className="text-xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    🚀
                  </motion.span>
                  <span>Take Quiz</span>
                </div>
                
                {/* Sparkle animation */}
                <motion.div
                  className="absolute top-1 right-2 w-2 h-2 bg-yellow-300 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={`relative p-3 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 overflow-hidden ${
                scrolled
                  ? 'text-gray-600 hover:text-gray-900 bg-gray-50/80 hover:bg-gray-100 focus:ring-purple-500/50 border border-gray-200/50'
                  : 'text-white hover:text-white bg-white/10 hover:bg-white/20 focus:ring-white/50 border border-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
            >
              {/* Animated hamburger */}
              <motion.div className="w-6 h-6 relative">
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
              </motion.div>
              
              {/* Background shimmer on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-gray-200/50 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50" />
              
              <div className="relative px-6 py-8 space-y-6">
                {/* Navigation items */}
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1, 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 font-medium group relative overflow-hidden ${
                          isActive(item.href)
                            ? 'text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-white/80 border border-gray-100'
                        }`}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.8 }}
                        />
                        
                        <div className="relative flex items-center space-x-4">
                          <motion.span 
                            className="text-2xl"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {item.icon}
                          </motion.span>
                          <span className="text-lg">{item.label}</span>
                        </div>
                        
                        {/* Active indicator */}
                        {isActive(item.href) && (
                          <motion.div
                            className="absolute right-4 w-2 h-2 bg-white rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: navItems.length * 0.1 + 0.2, duration: 0.4 }}
                  className="pt-6 border-t border-gray-200/50"
                >
                  <Link
                    href="/quiz"
                    onClick={() => setIsOpen(false)}
                    className="relative block w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white text-center font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 pointer-events-none"
                      initial={false}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative flex items-center justify-center space-x-3">
                      <motion.span
                        className="text-2xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        🚀
                      </motion.span>
                      <span>Take Quiz Now</span>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navigation;
