'use client';

import Link from "next/link";
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { faqData as rawFaqData } from "@/data/faq";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { FAQItem } from '@/types/faq';

// Utility to deduplicate by FAQ id
function dedupeFAQs(faqs: FAQItem[]) {
  const seen = new Set();
  return faqs.filter(faq => {
    if (seen.has(faq.id)) return false;
    seen.add(faq.id);
    return true;
  });
}

export default function FAQPage() {
  // Deduplicate FAQ data by id
  const faqData = useMemo(() => dedupeFAQs(rawFaqData), []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [helpfulClicks, setHelpfulClicks] = useState<string[]>([]);
  const [showQuickHelp, setShowQuickHelp] = useState(false);

  // Get unique categories
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(faqData.map(faq => faq.category)))],
    [faqData]
  );

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Load helpful clicks from localStorage
  useEffect(() => {
    const savedHelpful = localStorage.getItem('faq-helpful');
    if (savedHelpful) {
      setHelpfulClicks(JSON.parse(savedHelpful));
    }
  }, []);

  // Popular FAQs: those tagged with "quick", deduplicated by id
  const popularFAQs = useMemo(() => {
    const quickFaqs = faqData.filter(faq => faq.tags.includes('quick'));
    return dedupeFAQs(quickFaqs).slice(0, 4);
  }, [faqData]);

  // Filtered FAQs: excludes popularFAQs if showing all
  const filteredFAQs = useMemo(() => {
    if (isLoading) return [];
    let filtered = faqData.filter(faq => {
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      const matchesSearch =
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    // Remove any FAQ that is in the "Popular" section to avoid duplication
    if (!searchTerm && selectedCategory === 'All') {
      const popularIds = new Set(popularFAQs.map(faq => faq.id));
      filtered = filtered.filter(faq => !popularIds.has(faq.id));
    }

    return filtered.sort((a, b) => {
      // Prioritize items with more helpful clicks
      const aHelpful = helpfulClicks.filter(id => id === a.id).length;
      const bHelpful = helpfulClicks.filter(id => id === b.id).length;
      return bHelpful - aHelpful;
    });
  }, [faqData, selectedCategory, searchTerm, isLoading, helpfulClicks, popularFAQs]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const markHelpful = (id: string) => {
    if (helpfulClicks.includes(id)) return;
    const newHelpful = [...helpfulClicks, id];
    setHelpfulClicks(newHelpful);
    localStorage.setItem('faq-helpful', JSON.stringify(newHelpful));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center -mt-20 pt-20">
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
            <span className="text-3xl">❓</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Loading Answers</h2>
          <p className="text-lg text-gray-600">Preparing the most helpful information for you...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 -mt-20 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Questions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about festivals, planning, and making the most of your experience.
            </p>
          </motion.div>
          
          {/* Search bar */}
          <motion.div 
            className="max-w-2xl mx-auto mb-10 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.div>

          {/* Category filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-100 border-purple-500 text-purple-800'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Quick Help */}
          {selectedCategory === 'All' && !searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Popular Questions</h2>
                <button 
                  onClick={() => setShowQuickHelp(!showQuickHelp)}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  {showQuickHelp ? 'Hide' : 'Show All'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularFAQs.slice(0, showQuickHelp ? 4 : 2).map((faq) => (
                  <div 
                    key={faq.id}
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{faq.answer}</p>
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="mt-3 text-sm font-medium text-purple-600 hover:text-purple-800"
                    >
                      {openItems.includes(faq.id) ? 'Read Less' : 'Read More'}
                    </button>
                    
                    <AnimatePresence>
                      {openItems.includes(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2"
                        >
                          <p className="text-gray-600 text-sm">{faq.answer}</p>
                          <button
                            onClick={() => markHelpful(faq.id)}
                            className={`mt-3 text-xs flex items-center ${
                              helpfulClicks.includes(faq.id)
                                ? 'text-green-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                            disabled={helpfulClicks.includes(faq.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            {helpfulClicks.includes(faq.id) ? 'Marked as helpful' : 'Mark as helpful'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Main FAQ list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6">
              {searchTerm ? `Search Results for "${searchTerm}"` : 
                selectedCategory !== 'All' ? `${selectedCategory} Questions` : 'All Questions'}
            </h2>

            {filteredFAQs.length === 0 ? (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No questions found</h3>
                <p className="text-gray-600">
                  {searchTerm ? "Try a different search term or browse by category." : "No questions available in this category yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                  <div 
                    key={faq.id}
                    className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <span className="text-gray-400 text-xl">
                        {openItems.includes(faq.id) ? '−' : '+'}
                      </span>
                    </button>
                    
                    <AnimatePresence>
                      {openItems.includes(faq.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-6 pb-5">
                            <p className="text-gray-600 mb-3">{faq.answer}</p>
                            
                            {faq.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {faq.tags.map((tag) => (
                                  <Badge key={tag} className="bg-gray-100 text-gray-600">{tag}</Badge>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center mt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markHelpful(faq.id);
                                }}
                                className={`text-xs flex items-center ${
                                  helpfulClicks.includes(faq.id)
                                    ? 'text-green-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                                disabled={helpfulClicks.includes(faq.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                {helpfulClicks.includes(faq.id) ? 'Helpful' : 'Mark as helpful'}
                              </button>
                              
                              <span className="text-xs text-gray-400">
                                Last updated: {new Date(faq.lastUpdated).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 text-center"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-0">
              <CardContent className="p-8">
                <CardTitle className="text-2xl font-bold mb-4">
                  Can't find what you're looking for?
                </CardTitle>
                <p className="text-gray-600 mb-6">
                  We're always adding new answers. Reach out to us directly and we'll help you find what you need.
                </p>
                <Link href="/contact" passHref>
                  <Button className="bg-purple-600 hover:bg-purple-700">Contact Us</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}