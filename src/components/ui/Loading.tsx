'use client'

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'premium' | 'dots' | 'pulse'
  className?: string
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6', 
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className 
}: LoadingSpinnerProps) {
  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1 items-center', className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'rounded-full bg-current',
              size === 'sm' ? 'w-1 h-1' : 
              size === 'md' ? 'w-2 h-2' :
              size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
            )}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={cn(
          'rounded-full bg-gradient-to-r from-purple-500 to-pink-500',
          sizes[size],
          className
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    )
  }

  return (
    <motion.div
      className={cn(
        'border-2 border-current border-t-transparent rounded-full',
        sizes[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  variant?: 'overlay' | 'inline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  loadingText = 'Loading...',
  variant = 'overlay',
  size = 'lg'
}: LoadingOverlayProps) {
  if (variant === 'inline') {
    if (!isLoading) return <>{children}</>
    
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size={size} variant="premium" />
          {loadingText && (
            <p className="text-sm text-gray-600 animate-pulse">{loadingText}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {children}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size={size} variant="premium" />
            {loadingText && (
              <motion.p
                className="text-sm text-gray-700 font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {loadingText}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
