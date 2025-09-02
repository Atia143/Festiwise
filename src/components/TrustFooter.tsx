'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Trust-Building Footer for International Markets
 * Optimized for conversion and credibility
 */
export default function TrustFooter() {
  const currentYear = new Date().getFullYear();

  const trustSignals = [
    { icon: '🔒', text: 'SSL Encrypted', detail: 'Your data is secure' },
    { icon: '🌍', text: '100% Free', detail: 'No hidden costs' },
    { icon: '⚡', text: 'Instant Results', detail: '2-minute quiz' },
    { icon: '🎯', text: '100+ Festivals', detail: 'Curated worldwide' }
  ];

  const legalLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' }
  ];

  const quickLinks = [
    { href: '/quiz', label: 'Festival Quiz', popular: true },
    { href: '/festivals', label: 'Browse Festivals' },
    { href: '/blog', label: 'Festival Guide' },
    { href: '/faq', label: 'Help Center' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
      {/* Trust Signals Section */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustSignals.map((signal, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-2xl mb-2">{signal.icon}</div>
                <div className="font-semibold text-sm">{signal.text}</div>
                <div className="text-xs text-white/70">{signal.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="font-bold text-xl">FestiWise</span>
            </Link>
            <p className="text-white/80 mb-6 max-w-md">
              Discover your perfect music festival from 100+ world-class events. 
              Our intelligent matching algorithm finds festivals that match your 
              taste, budget, and travel preferences.
            </p>
            
            {/* Social Proof */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <span className="text-white/80 text-sm">4.9/5 from 10,000+ users</span>
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold mb-2">🎉 Never Miss Epic Festivals</h4>
              <p className="text-sm text-white/80 mb-3">
                Get exclusive early-bird alerts & secret lineup reveals
              </p>
              <Link
                href="/#newsletter"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
              >
                <span>Join 25,000+ Festival Hunters</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center text-white/80 hover:text-white transition-colors group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.label}
                    </span>
                    {link.popular && (
                      <span className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs px-2 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links & Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support & Legal</h4>
            <ul className="space-y-3 mb-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="bg-white/5 rounded-lg p-3">
              <h5 className="font-medium mb-2">Need Help?</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-white/70 mb-4 md:mb-0">
            © {currentYear} FestiWise. All rights reserved. Made with ❤️  for festival lovers worldwide.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-white/70">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>All systems operational</span>
            </span>
            <span>🌍 Available globally</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
