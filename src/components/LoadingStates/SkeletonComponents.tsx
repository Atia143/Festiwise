'use client';

import { motion } from 'framer-motion';

// World-Class Skeleton Loading Components

export function FestivalCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-150 rounded w-1/2"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>

        {/* Genre tags skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-14"></div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-150 rounded w-20"></div>
            <div className="h-4 bg-gray-150 rounded w-16"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-150 rounded w-16"></div>
            <div className="h-4 bg-gray-150 rounded w-24"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
}

export function QuizOptionSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200">
      <div className="animate-pulse text-center">
        <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-5 bg-gray-200 rounded-lg w-3/4 mx-auto mb-3"></div>
        <div className="h-4 bg-gray-150 rounded w-full mb-2"></div>
        <div className="h-3 bg-gray-150 rounded w-2/3 mx-auto"></div>
      </div>
    </div>
  );
}

export function ProgressBarSkeleton() {
  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 p-4">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded-full w-full"></div>
      </div>
    </div>
  );
}

export function FestivalGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <FestivalCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function QuizStepSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <ProgressBarSkeleton />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-150 rounded w-2/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-150 rounded w-1/2 mx-auto"></div>
            </div>
          </div>

          {/* Options grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <QuizOptionSkeleton />
              </motion.div>
            ))}
          </div>

          {/* Navigation skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Premium shimmer effect
export function ShimmerEffect({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
    </div>
  );
}

// Add shimmer animation to global CSS
export const shimmerKeyframes = `
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;
