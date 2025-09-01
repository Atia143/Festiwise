'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { FAQItem } from '@/types/faq';
import styles from './FAQSection.module.css';

interface FAQItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItemComponent({ item, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-medium text-gray-900">
          {item.question}
        </span>
        <span className="ml-2 text-gray-400">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4">
              <p className="text-gray-600">{item.answer}</p>
              {item.relatedGuides && item.relatedGuides.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.relatedGuides.map((guide, index) => {
                    // Check if it's an external link
                    const isExternal = guide.url.startsWith('http');
                    return (
                      <Link
                        key={index}
                        href={guide.url}
                        className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors"
                        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                      >
                        {guide.title} →
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FAQSectionProps {
  items: FAQItem[];
  category?: string;
  showTitle?: boolean;
}

export default function FAQSection({ items, category, showTitle = true }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No FAQ items available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {category ? `${category} FAQ` : 'Frequently Asked Questions'}
          </h2>
        </div>
      )}
      <div className="space-y-2">
        {items.map(item => (
          <FAQItemComponent
            key={item.id}
            item={item}
            isOpen={openItems.includes(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
