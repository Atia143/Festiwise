'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  interactive?: boolean
  gradient?: boolean
  glow?: boolean
  onClick?: () => void
}

export function Card({ 
  children, 
  className, 
  hover = false, 
  interactive = false,
  gradient = false,
  glow = false,
  onClick 
}: CardProps) {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm',
        {
          'cursor-pointer transition-all duration-300': interactive || onClick,
          'bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20': gradient,
          'shadow-lg shadow-purple-500/10': glow,
          'hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-300/60 hover:scale-[1.02]': hover,
          'hover:bg-white/90': interactive || onClick,
        },
        className
      )}
      whileHover={hover ? { 
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' }
      } : undefined}
      whileTap={interactive || onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-blue-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 pb-6', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-xl font-bold text-gray-900 mb-2', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-gray-600 leading-relaxed', className)}>
      {children}
    </p>
  )
}
