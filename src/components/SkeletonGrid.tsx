'use client';

import { motion } from 'framer-motion';

interface SkeletonGridProps {
  count?: number;
  columns?: number;
}

export default function SkeletonGrid({ count = 6, columns = 3 }: SkeletonGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700"
        >
          {/* Image skeleton */}
          <div className="w-full h-64 bg-gray-300 dark:bg-gray-600" />
          
          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            {/* Title skeleton */}
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
            
            {/* Description skeleton - 2 lines */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
            </div>
            
            {/* Meta skeleton */}
            <div className="flex gap-4 pt-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
