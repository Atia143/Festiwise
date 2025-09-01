'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import Link from 'next/link';
import { FAQItem } from '@/types/faq';
import { useFAQ } from './useFAQ';

interface SimpleFAQProps {
  items: FAQItem[];
}

export default function SimpleFAQ({ items }: SimpleFAQProps) {
  const {
    filteredItems,
    expanded,
    toggleItem,
    wasHelpful,
    markHelpful
  } = useFAQ(items, {
    showSearch: false,
    showCategories: false,
    showQuickAnswers: false
  });

  return (
    <div className="space-y-4">
      {filteredItems.map((faq, index) => (
        <motion.div
          key={faq.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="border rounded-lg bg-white shadow-sm overflow-hidden"
        >
          <button
            onClick={() => toggleItem(faq.id)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <span className="font-medium text-gray-900">{faq.question}</span>
            <motion.span
              animate={{ rotate: expanded === faq.id ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              <FiChevronDown />
            </motion.span>
          </button>

          <AnimatePresence>
            {expanded === faq.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-6 pb-4"
              >
                <p className="text-gray-600">{faq.answer}</p>

                {faq.relatedGuides && faq.relatedGuides.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Related guides:</p>
                    <ul className="mt-2 space-y-1">
                      {faq.relatedGuides.map((guide, i) => (
                        <li key={i}>
                          <Link
                            href={guide.url}
                            className="text-purple-600 hover:text-purple-700 text-sm"
                          >
                            {guide.title} →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="text-gray-500">Was this helpful?</span>
                  <button
                    onClick={() => markHelpful(faq.id, true)}
                    className={`px-3 py-1 rounded-full border transition-colors ${
                      wasHelpful[faq.id] === true
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => markHelpful(faq.id, false)}
                    className={`px-3 py-1 rounded-full border transition-colors ${
                      wasHelpful[faq.id] === false
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    No
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
