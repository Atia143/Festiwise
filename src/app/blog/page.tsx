'use client';

/**
 * SETUP INSTRUCTIONS FOR WEB3FORMS:
 * 
 * 1. Go to https://web3forms.com
 * 2. Sign up for a free account
 * 3. Create a new form and get your access key
 * 4. Replace 'YOUR_WEB3FORMS_ACCESS_KEY' below with your actual access key
 * 5. All form submissions will be sent to your email (configured in Web3Forms dashboard)
 * 
 * Features:
 * - No backend needed
 * - Free tier: 250 submissions/month
 * - Submissions sent directly to your email
 * - No admin dashboard needed
 * - Spam protection included
 */

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import SimpleNewsletterForm from '@/components/Newsletter/SimpleNewsletterForm';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
    verified: boolean;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
    };
  };
  tags: string[];
  featured: boolean;
  views?: number;
  likes?: number;
  image?: string;
  festivalYear?: string;
  festivalLocation?: string;
}

interface ContributorApplication {
  email: string;
  festivalName: string;
  festivalYear: string;
  festivalLocation: string;
  experienceType: string;
  message: string;
}

// Our Featured Authors - Only 2 high-quality articles
const featuredPosts: BlogPost[] = [
  {
    slug: 'ozora-festival-2025-transformational-journey',
    title: 'Ozora Festival 2025: A Life-Changing Journey Into Consciousness',
    excerpt: 'My first-time experience at Hungary\'s most transformative psytrance festival. From the moment I stepped onto the sacred grounds to the profound connections made under the infinite sky - this is the story of how Ozora changed my perspective on festivals, music, and life itself.',
    date: '2025-08-30',
    readTime: '18 min read',
    category: 'Transformational',
    author: {
      name: 'Yuval Atia',
      avatar: '🧠',
      bio: 'tba',
      verified: true,
      socialLinks: {
        instagram: '@yuvalatia',
        twitter: '@yuval_atia'
      }
    },
    tags: ['Ozora', 'Psytrance', 'Hungary', 'Transformational', 'Consciousness', 'First-Timer'],
    featured: true,
    views: 3247,
    likes: 189,
    image: '/api/placeholder/1200/600',
    festivalYear: '2025',
    festivalLocation: 'Ozora, Hungary'
  },
  {
    slug: 'budget-festival-masterclass-100-festivals-under-budget',
    title: 'The $50-a-Day Festival Masterclass: How I Attended 100+ Festivals Without Going Broke',
    excerpt: 'After 8 years and 100+ festivals across 25 countries, I\'ve cracked the code on festival economics. From sleeping in hostels to finding free meals, here\'s my complete playbook for experiencing world-class festivals on an impossible budget.',
    date: '2025-08-28',
    readTime: '22 min read',
    category: 'Budget & Planning',
    author: {
      name: 'Budget Ben',
      avatar: '🎒',
      bio: 'Backpacker extraordinaire. 100+ festivals, 25 countries, $10k total budget over 8 years.',
      verified: true,
      socialLinks: {
        instagram: '@budgetben_festivals',
        twitter: '@budget_ben_fests'
      }
    },
    tags: ['Budget', 'Money-Saving', 'Backpacking', 'Planning', 'Travel-Hacks', 'Europe'],
    featured: true,
    views: 5893,
    likes: 341,
    image: '/api/placeholder/1200/600',
    festivalYear: '2017-2025',
    festivalLocation: 'Europe & Beyond'
  }
];

const categories = [
  'All',
  'Transformational',
  'Budget & Planning',
  'Electronic',
  'Photography',
  'Sustainability',
  'Fashion'
];

const popularTags = [
  'Budget', 'First-Timer', 'Europe', 'Electronic', 'Photography', 'Sustainability', 'Planning'
];

type SortOption = 'newest' | 'oldest' | 'popular' | 'trending';

const experienceTypes = [
  'First-Time Experience',
  'Budget Travel Tips',
  'Photography Guide',
  'Sustainability Focus',
  'Music Discovery',
  'Cultural Immersion',
  'Solo Travel',
  'Group Adventure',
  'Local Insider Tips',
  'Safety & Preparation'
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showContributorForm, setShowContributorForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [contributorForm, setContributorForm] = useState<ContributorApplication>({
    email: '',
    festivalName: '',
    festivalYear: '',
    festivalLocation: '',
    experienceType: '',
    message: ''
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Load liked posts from localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('blog-likes');
    if (savedLikes) {
      setLikedPosts(JSON.parse(savedLikes));
    }
  }, []);

  // Toggle like functionality
  const toggleLike = (slug: string) => {
    const newLikes = likedPosts.includes(slug)
      ? likedPosts.filter(id => id !== slug)
      : [...likedPosts, slug];
    
    setLikedPosts(newLikes);
    localStorage.setItem('blog-likes', JSON.stringify(newLikes));
  };

  // Combine all posts for filtering
  const allPosts = featuredPosts;
  const allTags = ['All', ...Array.from(new Set(featuredPosts.flatMap(post => post.tags)))];

  const filteredPosts = useMemo(() => {
    if (isLoading) {
      return [];
    }

    let filtered = [...allPosts];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag !== 'All') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'trending':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allPosts, searchTerm, selectedCategory, selectedTag, sortBy, isLoading]);

  const handleContributorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Web3Forms submission
      const formData = new FormData();
      
      // Add Web3Forms access key (you'll need to get this from https://web3forms.com)
      formData.append('access_key', '00cc72fb-5e1a-4b24-b293-38bbdb1a9f33'); // Your actual Web3Forms access key
      
      // Add form fields
      formData.append('email', contributorForm.email);
      formData.append('festival_name', contributorForm.festivalName);
      formData.append('festival_year', contributorForm.festivalYear);
      formData.append('festival_location', contributorForm.festivalLocation);
      formData.append('experience_type', contributorForm.experienceType);
      formData.append('message', contributorForm.message);
      
      // Add custom fields for better organization
      formData.append('subject', `Festival Blog Contributor Application - ${contributorForm.festivalName}`);
      formData.append('from_name', contributorForm.email);
      formData.append('form_type', 'Blog Contributor Application');
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          setContributorForm({
            email: '',
            festivalName: '',
            festivalYear: '',
            festivalLocation: '',
            experienceType: '',
            message: ''
          });
          setShowContributorForm(false);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeContributorModal = () => {
    setShowContributorForm(false);
    setSubmitError('');
    setSubmitSuccess(false);
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-3xl">📖</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Loading Stories</h2>
          <p className="text-lg text-gray-600">Curating the best festival experiences for you...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 -mt-20 pt-20">
      {/* World-Class Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-800">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/80 to-pink-800/90" />
          
          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="relative px-4 sm:px-6 py-20 sm:py-32">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Premium Badge */}
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl">✍️</span>
                <span className="text-white font-semibold text-sm md:text-base">Real Stories</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </motion.div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
                Festival <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">Stories</span>
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
                Real experiences from festival veterans. 
                <span className="text-yellow-300 font-semibold"> Authentic insights</span>, 
                <span className="text-pink-300 font-semibold"> practical tips</span>, and 
                <span className="text-purple-300 font-semibold"> transformational journeys</span>.
              </p>

              {/* Enhanced Search Bar */}
              <motion.div
                className="max-w-2xl mx-auto relative mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔍
                  </motion.div>
                  <input
                    type="text"
                    placeholder="Search stories, festivals, or authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-6 text-xl rounded-3xl border-2 border-white/20 focus:border-white/60 focus:ring-4 focus:ring-white/20 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                  />
                  {searchTerm && (
                    <motion.button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xl"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      ✕
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                className="flex flex-wrap justify-center gap-8 text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300">{featuredPosts.length}</div>
                  <div className="text-sm">Featured Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300">2</div>
                  <div className="text-sm">Expert Authors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300">∞</div>
                  <div className="text-sm">More Coming</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Views</option>
                <option value="trending">Most Likes</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Featured Posts */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Featured <span className="text-purple-600">Stories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              In-depth experiences from our verified authors who've been there, done that.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {featuredPosts.slice(0, 2).map((post: BlogPost, index: number) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="group"
              >
                <Card className="h-full overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm group-hover:scale-[1.02]">
                  {/* Premium Image Placeholder */}
                  <div className="relative h-80 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" />
                    
                    {/* Verified Author Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2">
                        <span className="text-lg">{post.author.avatar}</span>
                        <span className="text-white font-semibold text-sm">Verified Author</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      </div>
                    </div>

                    {/* Like Button */}
                    <motion.button
                      onClick={() => toggleLike(post.slug)}
                      className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group/like"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.span
                        className={`text-xl ${likedPosts.includes(post.slug) ? 'text-red-400' : 'text-white'}`}
                        animate={{
                          scale: likedPosts.includes(post.slug) ? [1, 1.3, 1] : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {likedPosts.includes(post.slug) ? '❤️' : '🤍'}
                      </motion.span>
                    </motion.button>

                    {/* Read Time */}
                    <div className="absolute bottom-6 left-6">
                      <span className="text-white/90 text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                        {post.readTime}
                      </span>
                    </div>

                    {/* Views & Likes */}
                    <div className="absolute bottom-6 right-6 flex items-center gap-4 text-white/90 text-sm">
                      <div className="flex items-center gap-1">
                        <span>👁️</span>
                        <span>{post.views?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>❤️</span>
                        <span>{post.likes}</span>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="p-8">
                    {/* Category Badge */}
                    <div className="mb-4">
                      <Badge 
                        variant="premium" 
                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                      >
                        {post.category}
                      </Badge>
                    </div>

                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-4 line-clamp-2">
                      {post.title}
                    </CardTitle>

                    <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {post.author.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-gray-900">{post.author.name}</div>
                            {post.author.verified && (
                              <span className="text-blue-500 text-sm">✓</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{post.author.bio}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.slice(0, 4).map((tag: string) => (
                        <motion.button
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className="text-xs px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-lg font-medium hover:from-blue-100 hover:to-purple-100 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          #{tag}
                        </motion.button>
                      ))}
                    </div>

                    {/* Festival Details */}
                    {post.festivalYear && post.festivalLocation && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-gray-500">Festival:</span>
                            <div className="font-semibold text-gray-900">{post.festivalLocation}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Year:</span>
                            <div className="font-semibold text-gray-900">{post.festivalYear}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Read Button */}
                    <Link href={`/blog/${post.slug}`}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="primary" 
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-4 text-lg font-semibold"
                        >
                          Read Full Story →
                        </Button>
                      </motion.div>
                    </Link>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Strategic Newsletter CTA - Expert Content Engagement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-3 rounded-full mb-6 font-bold">
                <span>🏆</span>
                <span>Reading Expert Content</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Want More Insider Festival Intelligence?
              </h3>
              <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
                You're clearly serious about festivals! Join our exclusive circle of 3,247 festival experts 
                who get <strong>weekly insider reports</strong>, <strong>secret venue access</strong>, and <strong>backstage opportunities</strong>.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  <div className="text-3xl mb-3">📰</div>
                  <h4 className="font-bold mb-2">Weekly Insider Reports</h4>
                  <p className="text-sm text-white/80">Behind-the-scenes intel from festival organizers, artists, and industry insiders</p>
                </div>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  <div className="text-3xl mb-3">🎭</div>
                  <h4 className="font-bold mb-2">Backstage Access Opportunities</h4>
                  <p className="text-sm text-white/80">Exclusive meet & greets, VIP experiences, and press passes for major festivals</p>
                </div>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  <div className="text-3xl mb-3">🗝️</div>
                  <h4 className="font-bold mb-2">Secret Venue Previews</h4>
                  <p className="text-sm text-white/80">Tour upcoming festival locations months before tickets go on sale</p>
                </div>
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  <div className="text-3xl mb-3">💎</div>
                  <h4 className="font-bold mb-2">Industry-Only Discounts</h4>
                  <p className="text-sm text-white/80">Special pricing reserved for music industry professionals and serious enthusiasts</p>
                </div>
              </div>
              
              <div className="max-w-md mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6">
                <p className="text-white mb-4 font-medium text-lg">Join the Festival Expert Circle</p>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email for insider access"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/30"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                  >
                    🎪 Get Insider Festival Access
                  </button>
                </form>
                <div className="text-left mt-4 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <span className="text-green-400">✓</span> 3,247 festival experts already joined
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <span className="text-green-400">✓</span> Exclusive content not available anywhere else
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <span className="text-green-400">✓</span> Cancel anytime with one click
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Become a Contributor Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20"
        >
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
            <div className="relative p-8 md:p-12">
              {/* Background Effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl" />
              </div>

              <div className="relative text-center text-white">
                <motion.div
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full mb-8"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-2xl">✨</span>
                  <span className="font-semibold">Share Your Story</span>
                </motion.div>

                <h2 className="text-4xl md:text-5xl font-black mb-6">
                  Become a <span className="text-yellow-300">Contributor</span>
                </h2>
                
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Did you have an incredible festival experience? We want to hear about it! 
                  Share your story and inspire thousands of festival-goers worldwide.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">📝</div>
                    <h3 className="text-xl font-bold mb-3">Share Your Experience</h3>
                    <p className="text-white/80">Write about festivals you've attended and what made them special</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🌟</div>
                    <h3 className="text-xl font-bold mb-3">Get Featured</h3>
                    <p className="text-white/80">Best stories get featured on our homepage and social media</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="text-3xl mb-4">🤝</div>
                    <h3 className="text-xl font-bold mb-3">Build Community</h3>
                    <p className="text-white/80">Connect with fellow festival lovers and grow your network</p>
                  </div>
                </div>

                <motion.button
                  onClick={() => setShowContributorForm(true)}
                  className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply to Write →
                </motion.button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results Stats */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-8"
          >
            <p className="text-lg text-gray-600">
              {filteredPosts.length === featuredPosts.length ? (
                <>Showing all <span className="font-bold text-purple-600">{filteredPosts.length}</span> featured stories</>
              ) : (
                <>Found <span className="font-bold text-purple-600">{filteredPosts.length}</span> stories matching your search</>
              )}
            </p>
          </motion.div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && !isLoading && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-8xl mb-8"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🔍
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">No stories found</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Try adjusting your search or explore our featured stories.
            </p>
            <motion.button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedTag('All');
              }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}
      </section>

      {/* Newsletter CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <SimpleNewsletterForm />
      </div>

      {/* Contributor Application Modal */}
      <AnimatePresence>
        {showContributorForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeContributorModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900">Apply to Write</h2>
                  <motion.button
                    onClick={closeContributorModal}
                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                </div>

                <form onSubmit={handleContributorSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contributorForm.email}
                      onChange={(e) => setContributorForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Festival Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contributorForm.festivalName}
                      onChange={(e) => setContributorForm(prev => ({ ...prev, festivalName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      placeholder="e.g. Ozora Festival"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Year *
                      </label>
                      <input
                        type="text"
                        required
                        value={contributorForm.festivalYear}
                        onChange={(e) => setContributorForm(prev => ({ ...prev, festivalYear: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                        placeholder="2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={contributorForm.festivalLocation}
                        onChange={(e) => setContributorForm(prev => ({ ...prev, festivalLocation: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                        placeholder="Hungary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Experience Type *
                    </label>
                    <select
                      required
                      value={contributorForm.experienceType}
                      onChange={(e) => setContributorForm(prev => ({ ...prev, experienceType: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                    >
                      <option value="">Select experience type...</option>
                      {experienceTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tell us about your experience *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={contributorForm.message}
                      onChange={(e) => setContributorForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                      placeholder="Describe what made this festival special, any unique insights you gained, budget tips, or transformational moments you'd like to share..."
                    />
                  </div>

                  {/* Status Messages */}
                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 border border-green-200 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <h4 className="font-bold text-green-900">Application Submitted!</h4>
                          <p className="text-sm text-green-700">Thank you for your application! We'll review it and get back to you within 48 hours.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">❌</span>
                        <div>
                          <h4 className="font-bold text-red-900">Submission Failed</h4>
                          <p className="text-sm text-red-700">{submitError}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="font-bold text-purple-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• We'll review your application within 48 hours</li>
                      <li>• If approved, we'll send you writing guidelines</li>
                      <li>• You'll have 2 weeks to submit your story</li>
                      <li>• Featured stories get promoted across our platform</li>
                    </ul>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                      isSubmitting || submitSuccess
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:from-purple-700 hover:to-pink-700'
                    }`}
                    whileHover={!isSubmitting && !submitSuccess ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting && !submitSuccess ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Submitting...</span>
                      </div>
                    ) : submitSuccess ? (
                      <div className="flex items-center justify-center gap-3">
                        <span>✅</span>
                        <span>Submitted Successfully!</span>
                      </div>
                    ) : (
                      'Submit Application'
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
