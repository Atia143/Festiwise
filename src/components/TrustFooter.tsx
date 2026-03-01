'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

function IconXTwitter() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
    </svg>
  );
}

const socialLinks = [
  { href: 'https://twitter.com/getfestiwise', label: 'X (Twitter)', icon: <IconXTwitter /> },
  { href: 'https://instagram.com/getfestiwise', label: 'Instagram', icon: <IconInstagram /> },
  { href: 'https://tiktok.com/@getfestiwise', label: 'TikTok', icon: <IconTikTok /> },
];

const exploreLinks = [
  { href: '/quiz', label: 'Festival Quiz' },
  { href: '/festivals', label: 'Browse Festivals' },
  { href: '/discover', label: 'Discover' },
  { href: '/my-recommendations', label: 'My Picks' },
  { href: '/faq', label: 'FAQ' },
];

const guideLinks = [
  { href: '/best-music-festivals-2025', label: 'Best Festivals 2025' },
  { href: '/festival-packing-list-2025', label: 'Packing List' },
  { href: '/when-to-buy-festival-tickets-2025', label: 'When to Buy Tickets' },
  { href: '/music-festival-safety-tips-2025', label: 'Safety Tips' },
  { href: '/cheap-music-festivals-europe-2025', label: 'Budget Festivals' },
];

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms' },
];

export default function TrustFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* ── Pre-footer CTA ────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 px-6 py-20 text-center relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
          <div className="w-[600px] h-[300px] rounded-full bg-purple-600/10 blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4">
              Free — No sign-up required
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
              Find your perfect festival.
            </h2>
            <p className="text-lg text-white/50 mb-10">
              100+ curated events worldwide. Your match in under 2 minutes.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 transition-all duration-300 text-base"
            >
              Take the Quiz
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Main footer ───────────────────────────────────────────── */}
      <div className="bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">

            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-4 group">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="font-bold text-base tracking-tight">FestiWise</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-[200px]">
                Intelligent festival matching for music lovers worldwide.
              </p>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/12 text-gray-500 hover:text-white transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Explore */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-5">Explore</h4>
              <ul className="space-y-3">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guides */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-5">Guides</h4>
              <ul className="space-y-3">
                {guideLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-5">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">
              &copy; {currentYear} FestiWise. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <span className="text-xs text-gray-600">Free forever</span>
              <span className="text-xs text-gray-600">100+ festivals</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
