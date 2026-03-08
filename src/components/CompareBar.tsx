'use client';

import { useCompare } from '@/contexts/CompareContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, BarChart3 } from 'lucide-react';

export default function CompareBar() {
  const { selected, remove, clear } = useCompare();

  return (
    <AnimatePresence>
      {selected.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl pb-safe"
        >
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>

            {/* Selected chips */}
            <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {selected.map(f => (
                <div
                  key={f.id}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-sm"
                >
                  <span className="font-medium text-purple-800 max-w-[100px] truncate">{f.name}</span>
                  <button
                    onClick={() => remove(f.id)}
                    className="text-purple-400 hover:text-purple-700 transition-colors"
                    aria-label={`Remove ${f.name} from comparison`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {selected.length < 3 && (
                <span className="flex-shrink-0 text-xs text-gray-400 pl-1">
                  Add {3 - selected.length} more to compare
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={clear}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-2 py-1"
              >
                Clear
              </button>
              <Link
                href={`/compare?ids=${selected.map(f => f.id).join(',')}`}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                Compare {selected.length > 1 ? `(${selected.length})` : ''}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
