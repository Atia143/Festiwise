'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'premium' | 'new'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  pulse?: boolean
  glow?: boolean
}

const variants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  premium: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg',
  new: 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-transparent shadow-lg'
}

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className,
  pulse = false,
  glow = false 
}: BadgeProps) {
  return (
    <motion.span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-all duration-200',
        variants[variant],
        sizes[size],
        {
          'animate-pulse': pulse,
          'shadow-lg shadow-purple-500/25': glow && variant === 'premium',
          'shadow-lg shadow-blue-500/25': glow && variant === 'new',
        },
        className
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 0.3, 
        ease: 'easeOut',
        type: 'spring',
        stiffness: 200
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {glow && (variant === 'premium' || variant === 'new') && (
        <motion.span
          className="absolute inset-0 rounded-full bg-current opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.span>
  )
}
