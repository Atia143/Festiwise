'use client';

import Link from "next/link";
import { useState, useMemo } from 'react';
import { faqData as rawFaqData } from "@/data/faq";
import type { FAQItem } from '@/types/faq';
import { Search, ChevronDown } from 'lucide-react';

function dedupeFAQs(faqs: FAQItem[]) {
  const seen = new Set();
  return faqs.filter(faq => {
    if (seen.has(faq.id)) return false;
    seen.add(faq.id);
    return true;
  });
}

function AccordionItem({ faq }: { faq: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
        aria-expanded={open}
      >
        <span className="font-medium text-gray-900">{faq.question}</span>
        <ChevronDown
          className={`shrink-0 w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-gray-600">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqClient() {
  const faqData = useMemo(() => dedupeFAQs(rawFaqData), []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(faqData.map(faq => faq.category)))],
    [faqData]
  );

  const popularFAQs = useMemo(
    () => faqData.filter(faq => faq.tags.includes('quick')).slice(0, 4),
    [faqData]
  );

  const isFiltering = searchTerm.trim() !== '' || selectedCategory !== 'All';

  const filteredFAQs = useMemo(() => {
    const popularIds = new Set(popularFAQs.map(faq => faq.id));
    return faqData.filter(faq => {
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term);
      const notPopular = isFiltering ? true : !popularIds.has(faq.id);
      return matchesCategory && matchesSearch && notPopular;
    });
  }, [faqData, selectedCategory, searchTerm, isFiltering, popularFAQs]);

  const allQuestionsLabel = searchTerm
    ? `Results for "${searchTerm}"`
    : selectedCategory !== 'All'
    ? `${selectedCategory} Questions`
    : 'All Questions';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 -mt-20 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Questions
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about festivals, planning, and making the most of your experience.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a question..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all bg-white"
            />
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-100 border-purple-500 text-purple-800'
                    : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Popular Questions */}
          {!isFiltering && popularFAQs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Questions</h2>
              <div className="space-y-3">
                {popularFAQs.map(faq => (
                  <AccordionItem key={faq.id} faq={faq} />
                ))}
              </div>
            </div>
          )}

          {/* All / Filtered Questions */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{allQuestionsLabel}</h2>
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-medium">No questions found.</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm ? 'Try a different search term or browse by category.' : 'No questions available in this category yet.'}
                </p>
              </div>
            ) : (
              filteredFAQs.map(faq => (
                <AccordionItem key={faq.id} faq={faq} />
              ))
            )}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Can't find what you're looking for?</h2>
            <p className="text-gray-600 mb-6">
              We're always adding new answers. Reach out to us directly and we'll help you find what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-purple-300 hover:bg-purple-50 text-purple-700 font-medium transition-colors"
              >
                Take the Quiz
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
