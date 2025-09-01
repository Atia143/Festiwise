'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'

export interface ToastProps {
  id: string
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: (id: string) => void
}

const toastVariants = {
  success: {
    icon: '✅',
    bgColor: 'bg-green-50 border-green-200',
    textColor: 'text-green-800',
    accentColor: 'bg-green-500'
  },
  error: {
    icon: '❌',
    bgColor: 'bg-red-50 border-red-200',
    textColor: 'text-red-800',
    accentColor: 'bg-red-500'
  },
  warning: {
    icon: '⚠️',
    bgColor: 'bg-yellow-50 border-yellow-200',
    textColor: 'text-yellow-800',
    accentColor: 'bg-yellow-500'
  },
  info: {
    icon: 'ℹ️',
    bgColor: 'bg-blue-50 border-blue-200',
    textColor: 'text-blue-800',
    accentColor: 'bg-blue-500'
  }
}

export function Toast({ 
  id, 
  title, 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const variant = toastVariants[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, id, onClose])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }}
      className={cn(
        'relative overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm min-w-80 max-w-96',
        variant.bgColor
      )}
    >
      {/* Progress bar */}
      <motion.div
        className={cn('absolute top-0 left-0 h-1', variant.accentColor)}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
      />
      
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <span className="text-xl flex-shrink-0">{variant.icon}</span>
          
          <div className="flex-1 min-w-0">
            {title && (
              <p className={cn('font-semibold text-sm mb-1', variant.textColor)}>
                {title}
              </p>
            )}
            <p className={cn('text-sm leading-relaxed', variant.textColor)}>
              {message}
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose?.(id), 300)
            }}
            className={cn(
              'flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors',
              variant.textColor
            )}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: ToastProps[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[10000] space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (message: string, title?: string) => 
    addToast({ message, title, type: 'success' })
  
  const error = (message: string, title?: string) => 
    addToast({ message, title, type: 'error' })
  
  const warning = (message: string, title?: string) => 
    addToast({ message, title, type: 'warning' })
  
  const info = (message: string, title?: string) => 
    addToast({ message, title, type: 'info' })

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
