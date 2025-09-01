'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const sections = [
  {
    title: 'Get Started',
    description: 'Find your perfect festival match',
    links: [
      { href: '/quiz', label: 'Take the Quiz', description: 'Personalized festival recommendations' },
      { href: '/festivals', label: 'Browse All Festivals', description: 'Explore our full database' },
    ]
  },
  {
    title: 'Learn & Explore',
    description: 'Guides, tips, and insights',
    links: [
      { href: '/blog', label: 'Festival Guides', description: 'Expert tips and festival reviews' },
      { href: '/faq', label: 'FAQ', description: 'Common questions answered' },
    ]
  },
  {
    title: 'Browse by Region',
    description: 'Discover festivals worldwide',
    links: [
      { href: '/best/europe/all', label: 'Europe', description: 'European music festivals' },
      { href: '/best/north-america/all', label: 'North America', description: 'USA & Canada festivals' },
      { href: '/best/asia/all', label: 'Asia', description: 'Asian music festivals' },
      { href: '/best/australia/all', label: 'Australia', description: 'Australian festivals' },
    ]
  },
  {
    title: 'About FestiWise',
    description: 'Learn more about us',
    links: [
      { href: '/about', label: 'Our Story', description: 'Mission and values' },
      { href: '/privacy', label: 'Privacy Policy', description: 'How we protect your data' },
      { href: '/terms', label: 'Terms of Service', description: 'Usage terms and conditions' },
    ]
  }
];

export default function SiteMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Explore FestiWise
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your complete guide to discovering amazing music festivals worldwide. 
              Find what you're looking for or explore something new.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Link
              href="/quiz"
              className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Take the Quiz</h3>
                  <p className="text-white/90">Get personalized festival recommendations in 2 minutes</p>
                </div>
                <div className="text-4xl group-hover:scale-110 transition-transform">🎯</div>
              </div>
            </Link>
            
            <Link
              href="/festivals"
              className="group bg-white border-2 border-purple-200 text-gray-900 p-8 rounded-2xl hover:shadow-2xl hover:border-purple-300 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Browse Festivals</h3>
                  <p className="text-gray-600">Explore 200+ festivals across 40+ countries</p>
                </div>
                <div className="text-4xl group-hover:scale-110 transition-transform">🌍</div>
              </div>
            </Link>
          </div>

          {/* Sections */}
          <div className="grid lg:grid-cols-2 gap-8">
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
                <p className="text-gray-600 mb-6">{section.description}</p>
                
                <div className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05), duration: 0.4 }}
                    >
                      <Link
                        href={link.href}
                        className="group block p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                              {link.label}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                          </div>
                          <div className="text-gray-400 group-hover:text-purple-600 transition-colors">
                            →
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Featured Stats */}
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-8">FestiWise by the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '200+', label: 'Festivals' },
                { value: '40+', label: 'Countries' },
                { value: '25+', label: 'Music Genres' },
                { value: '1000+', label: 'Happy Users' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + (index * 0.1), duration: 0.4 }}
                  className="bg-white/10 rounded-xl p-6 backdrop-blur-sm"
                >
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-6">Get the latest festival news and recommendations delivered to your inbox.</p>
            <Link
              href="/#newsletter"
              className="inline-block px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors duration-200"
            >
              Subscribe to Newsletter
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
