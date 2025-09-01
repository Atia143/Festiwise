'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
}

const pageTransition = {
  type: 'tween' as const,
  ease: 'anticipate' as const,
  duration: 0.4
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Smooth scroll to element
export function smoothScrollTo(elementId: string, offset: number = 0) {
  const element = document.getElementById(elementId)
  if (element) {
    const targetPosition = element.offsetTop - offset
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
  }
}

// Page scroll progress indicator
export function ScrollProgress() {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 origin-left z-[10001]"
      style={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: false, amount: 0 }}
      transition={{ duration: 0.2 }}
    />
  )
}

// Floating action button
interface FloatingActionButtonProps {
  onClick: () => void
  icon: ReactNode
  label: string
  position?: 'bottom-right' | 'bottom-left'
  variant?: 'primary' | 'secondary'
}

export function FloatingActionButton({
  onClick,
  icon,
  label,
  position = 'bottom-right',
  variant = 'primary'
}: FloatingActionButtonProps) {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25',
    secondary: 'bg-white text-gray-800 shadow-lg border border-gray-200'
  }

  return (
    <motion.button
      onClick={onClick}
      className={`
        fixed ${positionClasses[position]} z-[9998] 
        w-14 h-14 rounded-full flex items-center justify-center
        ${variantClasses[variant]}
        transition-all duration-200 hover:scale-110 hover:shadow-xl
        focus:outline-none focus:ring-4 focus:ring-purple-500/20
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      title={label}
    >
      {icon}
    </motion.button>
  )
}

// Back to top button
export function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <FloatingActionButton
      onClick={scrollToTop}
      icon={
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      }
      label="Back to top"
    />
  )
}
