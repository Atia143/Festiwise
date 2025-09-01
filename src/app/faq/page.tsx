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
  const faqData = useMemo(() => dedupeFAQs(rawFaqData), [rawFaqData]);

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
      {/* ... (rest of your page is unchanged; paste your original JSX here) ... */}
      {/* Replace all uses of faqData with the deduped faqData from above */}
      {/* All logic for filtering, popularFAQs, and rendering is now deduplicated */}
      {/* If you want the full file with all your sections, just continue as in your source code, but the FAQ items will no longer duplicate */}
    </div>
  );
}