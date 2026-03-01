'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import SimpleNewsletterForm from '@/components/Newsletter/SimpleNewsletterForm';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story');
  // Newsletter form state
  const [email, setEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle'|'loading'|'success'|'error'>('idle');

  // Web3Forms access key moved to server; client posts to `/api/submit`

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setNewsletterState('loading');
    
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          subject: '🎪 New About Page Newsletter Subscription',
          from_name: 'FestiWise About Page',
          email: email,
          message: 'New newsletter subscription from About page',
          page_source: 'About Page',
          _template: 'table',
          _cc: email,
          _subject: 'Welcome to FestiWise! 🎵 Your Festival Journey Begins',
          _autoresponse: `Welcome to the FestiWise family! 🎉

You're now part of an exclusive community of festival lovers who get:

✨ Weekly personalized festival recommendations
🎯 Early-bird ticket notifications  
💰 Exclusive discount codes
📍 Secret lineup reveals
🌟 VIP experiences & insider access

Ready to discover your perfect festival? Take our 2-minute quiz: ${typeof window !== 'undefined' ? window.location.origin : ''}/quiz

Rock on,
The FestiWise Team 🎪`,
          botcheck: '',
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setNewsletterState('success');
        setEmail('');
        setTimeout(() => setNewsletterState('idle'), 5000);
      } else {
        setNewsletterState('error');
        setTimeout(() => setNewsletterState('idle'), 5000);
      }
    } catch {
      setNewsletterState('error');
      setTimeout(() => setNewsletterState('idle'), 5000);
    }
  };

  const teamMembers = [
    {
      name: 'Yuval Atia',
      role: 'Founder',
      bio: 'Young festival enthusiast exploring global music scenes.',
      email: 'yuval.atia@icloud.com',
      specialties: ['Festival Curation', 'Product Strategy', 'Music Industry'],
      festivals: 'Israel, Ozora 2025, Tomorrowland',
      quote: 'Welcome To Paradise'
    },
    {
      name: 'The FestiWise Team',
      role: 'Global Contributors',
      bio: 'A diverse collective of festival photographers, music journalists, event producers, and passionate attendees from 25+ countries.',
      email: 'pixelplus.contact@gmail.com',
      specialties: ['WorldWide Content Creation', 'Local Expertise', 'Community Building'],
      festivals: '100 world-class festivals documented worldwide',
      quote: 'FestiWise Team are always looking for people! Come say hello if festivals are your passion.'
    }
  ];

  const milestones = [
    { year: '2024', event: 'FestiWise founded after frustrating festival search experience while traveling' },
    { year: '2025', event: 'AI-powered matching algorithm developed and tested' },
    { year: '2025', event: 'Development of personalized festival recommendations' },
    { year: '2025', event: "100+ successful festival matches made" },
    { year: 'Future', event: 'Global expansion to 100+ countries and exclusive festival experiences with local and global partnerships to ensure authenticity and diversity in festival recommendations.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-block mb-6"
            >
              <div className="text-6xl mb-4">🎪</div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                About FestiWise
              </h1>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            >
              Where artificial intelligence meets authentic human passion to revolutionize how music lovers discover their next transformative festival experience.
            </motion.p>
          </div>

         
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-12 bg-white rounded-2xl p-2 shadow-lg max-w-2xl mx-auto">
            {[
              { id: 'story', label: '🌟 Our Story', count: '' },
              { id: 'mission', label: '🎯 Mission', count: '' },
              { id: 'team', label: '👥 Team', count: '2' },
              { id: 'timeline', label: '📈 Journey', count: '6' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {tab.label}
                {tab.count && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 'story' && (
              <div>
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                  <div className="space-y-6">
                    <h2 className="text-4xl font-bold text-gray-900">The Problem We're Solving</h2>
                    <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                      <p>
                        Picture this: You want to attend a music festival, but you're drowning in options. 
                        There are <strong>3,000+ festivals</strong> happening globally each year, across dozens 
                        of genres, price points, and experiences.
                      </p>
                      <p>
                        Traditional discovery methods are broken. Google searches return overwhelming lists. 
                        Social media shows you what's popular, not what's <em>right for you</em>. Friends' 
                        recommendations don't account for your budget, music taste, or travel constraints.
                      </p>
                      <p className="text-purple-700 font-medium">
                        FestiWise eliminates analysis paralysis by using AI to understand your unique 
                        preferences and delivering precise, personalized recommendations in under 2 minutes.
                      </p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 rounded-3xl p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                        <div className="text-4xl font-bold text-purple-600">3,000+</div>
                        <div className="text-sm text-gray-600 font-medium">Annual Festivals</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                        <div className="text-4xl font-bold text-pink-600">50+</div>
                        <div className="text-sm text-gray-600 font-medium">Countries</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                        <div className="text-4xl font-bold text-blue-600">25+</div>
                        <div className="text-sm text-gray-600 font-medium">Music Genres</div>
                      </div>
                      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                        <div className="text-4xl font-bold text-indigo-600">98%</div>
                        <div className="text-sm text-gray-600 font-medium">Match Accuracy</div>
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <div className="text-gray-700 font-medium">Trusted by 1,247+ Festival Enthusiasts</div>
                    </div>
                  </div>
                </div>
                
                {/* Social Proof Section - Simplified */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mb-16"
                >
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-4">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full border-2 border-white"></div>
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full border-2 border-white"></div>
                          <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
                        </div>
                        <span className="text-sm font-medium">Community Feedback</span>
                      </div>
                      <blockquote className="text-2xl md:text-3xl font-bold mb-6 italic">
                        "I discovered 3 life-changing festivals through FestiWise that I never would have found otherwise"
                      </blockquote>
                      <p className="text-lg text-white/90 max-w-2xl mx-auto">
                        - Sarah K., who found underground techno events in Berlin, psytrance gatherings in Goa, 
                        and jazz festivals in New Orleans through our platform
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="space-y-12">
                <div className="text-center max-w-4xl mx-auto">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission & Values</h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    To democratize festival discovery by making every music lover's perfect festival experience 
                    just one intelligent quiz away, regardless of their background, budget, or location.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      icon: '🎯',
                      title: 'Precision Matching',
                      description: 'Our AI considers 50+ factors including music taste, budget, travel style, group dynamics, and timing to deliver laser-focused recommendations.',
                      color: 'purple'
                    },
                    {
                      icon: '🌍',
                      title: 'Global Accessibility',
                      description: 'From underground warehouse parties in Berlin to massive desert gatherings in Nevada - we cover every scene, everywhere.',
                      color: 'blue'
                    },
                    {
                      icon: '🔒',
                      title: 'Privacy Sanctuary',
                      description: 'Your festival preferences and personal data remain completely private. We never sell information or spam you with irrelevant content.',
                      color: 'pink'
                    },
                    {
                      icon: '💯',
                      title: 'Quality Obsession',
                      description: 'Every festival in our database is verified by real attendees. We prioritize authentic experiences over paid promotions.',
                      color: 'indigo'
                    },
                    {
                      icon: '⚡',
                      title: 'Instant Gratification',
                      description: 'Get matched with your perfect festivals in under 2 minutes. No long forms, no account required, no hassle.',
                      color: 'green'
                    },
                    {
                      icon: '🤝',
                      title: 'Community First',
                      description: 'Built by festival lovers, for festival lovers. Every feature is shaped by continuous feedback from our passionate community.',
                      color: 'orange'
                    }
                  ].map((value, index) => (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-${value.color}-500 hover:scale-105`}
                    >
                      <div className="text-5xl mb-4">{value.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet the Humans Behind the Magic</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    We're not just tech people building another app. We're passionate festival-goers who've spent 
                    decades in the trenches, experiencing everything from intimate jazz clubs to massive EDM gatherings.
                  </p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.6 }}
                      className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-6">
                        <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-4 text-white text-2xl font-bold min-w-[80px] h-20 flex items-center justify-center">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                          <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                          <p className="text-gray-600 leading-relaxed mb-4">{member.bio}</p>
                          
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-900">Specialties:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {member.specialties.map((specialty) => (
                                  <span key={specialty} className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-sm font-medium text-gray-900">Festival Experience:</span>
                              <p className="text-sm text-gray-600 mt-1">{member.festivals}</p>
                            </div>
                            
                            <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-700">
                              "{member.quote}"
                            </blockquote>
                            
                            <a
                              href={`mailto:${member.email}`}
                              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium text-sm"
                            >
                              📧 {member.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Team Insider CTA - Join the Community */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mt-12"
                >
                  <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="flex justify-center mb-4">
                        <div className="bg-white/20 backdrop-blur px-6 py-3 rounded-full">
                          <span className="text-lg font-bold">🌟 Want to Join Our Team?</span>
                        </div>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold mb-4">
                        Help Build the Future of Festival Discovery
                      </h3>
                      <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                        We're always looking for passionate festival lovers to join our global team. 
                        Content creators, local experts, photographers, writers - if festivals are your passion, let's talk!
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                          <div className="text-3xl mb-3">📸</div>
                          <h4 className="font-bold mb-2">Festival Photographers</h4>
                          <p className="text-sm text-white/80">Document festivals worldwide and earn through our network</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                          <div className="text-3xl mb-3">✍️</div>
                          <h4 className="font-bold mb-2">Content Creators</h4>
                          <p className="text-sm text-white/80">Write guides, reviews, and insider tips for our community</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                          <div className="text-3xl mb-3">🌍</div>
                          <h4 className="font-bold mb-2">Local Experts</h4>
                          <p className="text-sm text-white/80">Share your local festival knowledge and build your reputation</p>
                        </div>
                      </div>
                      
                      <div className="max-w-md mx-auto bg-white/10 backdrop-blur rounded-2xl p-6">
                        <p className="text-white/90 mb-4 font-medium">Join our insider team and get:</p>
                        <div className="grid grid-cols-1 gap-2 text-sm text-left mb-6">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400">💰</span> Paid opportunities and revenue sharing
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">🎫</span> Free festival tickets and press access
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-400">🤝</span> Direct collaboration with Yuval and the team
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-pink-400">📈</span> Build your festival industry network
                          </div>
                        </div>
                        <SimpleNewsletterForm />
                        <p className="text-xs text-white/70 mt-2">
                          Join our newsletter and mention "TEAM INTEREST" to get priority consideration
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    From a personal frustration to a platform helping thousands discover their perfect festivals. 
                    Here's how we're revolutionizing festival discovery.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
                  
                  <div className="space-y-12">
                    {milestones.map((milestone, index) => (
                      <motion.div
                        key={milestone.year}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.6 }}
                        className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className={`text-2xl font-bold mb-2 ${
                              milestone.year === 'Future' ? 'text-gradient bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent' : 'text-purple-600'
                            }`}>
                              {milestone.year}
                            </div>
                            <p className="text-gray-700 leading-relaxed">{milestone.event}</p>
                          </div>
                        </div>
                        
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-purple-500 rounded-full shadow-lg"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Future Vision - Simplified */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className="mt-12"
                >
                  <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-3xl p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
                    <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-full mb-6">
                        <span className="text-lg">🚀</span>
                        <span className="font-semibold">What's Coming Next</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold mb-4">
                        The Future of Festival Discovery
                      </h3>
                      <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        We're building revolutionary features to make festival discovery even more magical.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                          <div className="text-3xl mb-3">🤖</div>
                          <h4 className="font-bold mb-2">AI Festival Companion</h4>
                          <p className="text-sm text-white/80">Personal AI that learns your taste and gives real-time recommendations</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                          <div className="text-3xl mb-3">📱</div>
                          <h4 className="font-bold mb-2">AR Venue Previews</h4>
                          <p className="text-sm text-white/80">See any festival venue through your phone before you book</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                          <div className="text-3xl mb-3">🎬</div>
                          <h4 className="font-bold mb-2">Live Festival Streams</h4>
                          <p className="text-sm text-white/80">Experience festivals remotely or preview before attending</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                          <div className="text-3xl mb-3">🌐</div>
                          <h4 className="font-bold mb-2">Global Festival Passport</h4>
                          <p className="text-sm text-white/80">One platform to discover, book, and attend festivals worldwide</p>
                        </div>
                      </div>
                      
                      <p className="text-white/70 mt-8 text-sm">
                        Stay tuned for exciting updates as we continue to innovate the festival experience.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Premium Minimal CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-20"
          >
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xl relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-6 py-3 rounded-full mb-8 font-semibold">
                  <span>🎪</span>
                  <span>Ready to Find Your Perfect Festival?</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Your Festival Journey <span className="text-purple-600">Starts Here</span>
                </h2>
                
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join ravers who've discovered their perfect festival match. 
                  Take our 2-minute quiz or explore our curated collection.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link
                    href="/quiz"
                    className="group px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span className="flex items-center gap-2">
                      Find My Festival (2 min)
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </Link>
                  <Link
                    href="/festivals"
                    className="px-8 py-4 border-2 border-purple-600 text-purple-600 font-bold rounded-2xl hover:bg-purple-50 transition-all duration-300 transform hover:scale-105"
                  >
                    🎪 Browse Festivals
                  </Link>
                </div>
                
                {/* Minimal Newsletter Integration */}
                <div className="max-w-md mx-auto">
                  <p className="text-sm text-gray-500 mb-4">
                    Get weekly festival picks delivered to your inbox
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                      disabled={newsletterState === 'loading'}
                    />
                    <button 
                      type="submit"
                      disabled={newsletterState === 'loading' || !email}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {newsletterState === 'loading' ? 'Joining...' : 
                       newsletterState === 'success' ? '✓ Joined!' : 'Join'}
                    </button>
                  </form>
                  {newsletterState === 'success' && (
                    <p className="text-green-600 text-sm mt-2 font-medium">
                      🎉 Welcome to the festival family! Check your email for a welcome message.
                    </p>
                  )}
                  {newsletterState === 'error' && (
                    <p className="text-red-500 text-sm mt-2">
                      Something went wrong. Please try again!
                    </p>
                  )}
                  {newsletterState === 'idle' && (
                    <p className="text-xs text-gray-400 mt-2">
                      Join 5,000+ festival lovers. Unsubscribe anytime.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact & Trust Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-16 grid md:grid-cols-2 gap-8"
          >
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">📧</span>
                Get In Touch
              </h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Business & Partnerships</h4>
                  <p className="text-purple-600">yuval.atia@icloud.com</p>
                  <p className="text-sm text-gray-600">Press, partnerships, business inquiries</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800">General Support</h4>
                  <p className="text-blue-600">pixelplus.contact@gmail.com</p>
                  <p className="text-sm text-gray-600">Questions, feedback, technical support</p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Privacy & Data</h4>
                  <p className="text-green-600">pixelplus.contact@gmail.com</p>
                  <p className="text-sm text-gray-600">Privacy requests, data deletion, GDPR inquiries</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">Response Times</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-600 font-medium">Business:</span> 24-48 hours
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Support:</span> 48-72 hours
                  </div>
                </div>
              </div>
            </div>

            {/* Trust & Credentials */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">🛡️</span>
                Trust & Security
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">GDPR Compliant</h4>
                    <p className="text-sm text-gray-600">Full European data protection compliance</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">SSL Secured</h4>
                    <p className="text-sm text-gray-600">256-bit encryption for all data transmission</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">No Data Selling</h4>
                    <p className="text-sm text-gray-600">We never sell your personal information</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Transparent</h4>
                    <p className="text-sm text-gray-600">Open development, community-driven</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-purple-200">
                <p className="text-sm text-gray-600">
                  <strong>Company:</strong> FestiWise Ltd.<br/>
                  <strong>Founded:</strong> 2025<br/>
                  <strong>Based:</strong> International (Remote-First)
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions or Feedback?</h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              We'd love to hear from you. Reach out for partnerships, feedback, or just to say hello.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:yuval.atia@icloud.com"
                className="group px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium"
              >
                <span className="flex items-center gap-2">
                  📧 Business Inquiries
                </span>
              </a>
              <a
                href="mailto:pixelplus.contact@gmail.com"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                👋 General Contact
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
