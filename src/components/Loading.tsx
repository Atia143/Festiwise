'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  className?: string;
}

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
}

interface LoadingStateProps {
  isLoading: boolean;
  error?: string | null;
  retry?: () => void;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  minLoadingTime?: number;
}

// Loading Spinner Component
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-purple-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <svg
          className="animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-sm text-gray-600"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Skeleton Component
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  animate = true
}) => {
  const baseClasses = 'bg-gray-200 rounded';
  const animationClasses = animate ? 'animate-pulse' : '';

  return (
    <div
      className={`${baseClasses} ${animationClasses} ${className}`}
      style={{ width, height }}
    />
  );
};

// Card Skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
    <Skeleton height="200px" className="mb-4" />
    <Skeleton height="1.5rem" className="mb-2" />
    <Skeleton height="1rem" width="80%" className="mb-4" />
    <div className="flex justify-between">
      <Skeleton height="1rem" width="60px" />
      <Skeleton height="1rem" width="80px" />
    </div>
  </div>
);

// Festival Card Skeleton
export const FestivalCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 shadow-lg">
    <Skeleton height="160px" className="mb-4 rounded-xl" />
    <div className="space-y-3">
      <Skeleton height="1.5rem" width="85%" />
      <Skeleton height="1rem" width="70%" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton height="1rem" width="50px" />
        <Skeleton height="2rem" width="80px" className="rounded-full" />
      </div>
    </div>
  </div>
);

// Quiz Step Skeleton
export const QuizStepSkeleton: React.FC = () => (
  <div className="max-w-2xl mx-auto p-6">
    <div className="mb-8">
      <Skeleton height="0.5rem" className="mb-4" />
      <Skeleton height="2rem" width="90%" className="mb-2" />
      <Skeleton height="1.25rem" width="70%" />
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 border rounded-lg">
          <Skeleton height="1.25rem" width="80%" />
        </div>
      ))}
    </div>
  </div>
);

// Page Loading Component
export const PageLoading: React.FC<{ message?: string }> = ({ 
  message = "Loading amazing festivals..." 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <LoadingSpinner size="xl" />
      </motion.div>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-bold text-gray-900 mb-2"
      >
        {message}
      </motion.h2>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-gray-600"
      >
        Please wait while we prepare your experience
      </motion.p>
    </div>
  </div>
);

// Loading State Handler
export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  error,
  retry,
  children,
  skeleton,
  minLoadingTime = 0
}) => {
  const [showLoading, setShowLoading] = React.useState(isLoading);

  React.useEffect(() => {
    if (isLoading && minLoadingTime > 0) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, minLoadingTime);
      return () => clearTimeout(timer);
    }
    setShowLoading(isLoading);
  }, [isLoading, minLoadingTime]);

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
        <p className="text-red-600 mb-4">{error}</p>
        {retry && (
          <button
            onClick={retry}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (showLoading) {
    return skeleton || <LoadingSpinner />;
  }

  return <>{children}</>;
};

// Button Loading State
export const ButtonLoading: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ isLoading, children, className = '', onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`relative ${className} ${isLoading ? 'cursor-not-allowed' : ''}`}
  >
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="sm" color="white" />
      </div>
    )}
    <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
      {children}
    </span>
  </button>
);

export default LoadingSpinner;
