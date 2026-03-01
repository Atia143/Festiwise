'use client';

import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// 🎨 Premium Micro-Interactions System
// Used by companies like Apple, Stripe, and Linear

// 1. Magnetic Button - Premium hover effect
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export function MagneticButton({ children, className = '', onClick, strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}

// 2. Premium Loading States with Personality
interface PremiumLoaderProps {
  type?: 'festivals' | 'search' | 'data' | 'magic';
  message?: string;
}

export function PremiumLoader({ type = 'festivals', message }: PremiumLoaderProps) {
  const [currentEmoji, setCurrentEmoji] = useState(0);
  
  const emojiSets = {
    festivals: ['🎪', '🎭', '🎵', '🎸', '🎤', '🎼', '🎹', '🥁'],
    search: ['🔍', '🌟', '✨', '💫', '⭐', '🌙', '☀️', '🌈'],
    data: ['📊', '⚡', '🚀', '💎', '🔮', '🎯', '🎨', '🎡'],
    magic: ['✨', '🪄', '🎆', '🎇', '🌟', '💫', '⭐', '🌠']
  };

  const messages = {
    festivals: [
      'Finding your perfect festival vibes...',
      'Analyzing 100+ world-class events...',
      'Matching your music DNA...',
      'Discovering hidden gems...',
      'Calculating perfect moments...'
    ],
    search: [
      'Searching through festival magic...',
      'Finding your tribe...',
      'Exploring possibilities...',
      'Uncovering adventures...'
    ],
    data: [
      'Processing festival intelligence...',
      'Optimizing recommendations...',
      'Crafting your experience...',
      'Building connections...'
    ],
    magic: [
      'Creating festival magic...',
      'Weaving musical dreams...',
      'Crafting unforgettable moments...',
      'Summoning the perfect experience...'
    ]
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji(prev => (prev + 1) % emojiSets[type].length);
    }, 400);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        className="text-6xl mb-4"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {emojiSets[type][currentEmoji]}
      </motion.div>
      
      <motion.div
        className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          animate={{ x: [-100, 100] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <motion.p
        className="text-gray-600 text-center max-w-md"
        key={message || messages[type][0]}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        {message || messages[type][0]}
      </motion.p>
    </div>
  );
}

// 3. Premium Card Hover Effects
interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function PremiumCard({ children, className = '', glowColor = 'purple' }: PremiumCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05, z: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r from-${glowColor}-500/20 to-pink-500/20 rounded-lg blur-xl`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  );
}

// 4. Premium Search Input with Live Feedback
interface PremiumSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  suggestions?: string[];
}

export function PremiumSearch({ placeholder = 'Search...', onSearch, suggestions = [] }: PremiumSearchProps) {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
      if (query.length > 2) {
        onSearch(query);
      }
    }, 300);

    if (query.length > 0) {
      setIsTyping(true);
    }

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <motion.input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 pr-4 rounded-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white shadow-lg"
          whileFocus={{ scale: 1.02 }}
        />
        
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <motion.div
            animate={isTyping ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            🔍
          </motion.div>
        </div>

        {isTyping && (
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && query.length > 0 && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
          >
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors duration-200"
                onClick={() => {
                  setQuery(suggestion);
                  setShowSuggestions(false);
                }}
              >
                <span className="text-gray-800">{suggestion}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 5. Premium Progress Indicator
interface PremiumProgressProps {
  steps: string[];
  currentStep: number;
  completedSteps?: number[];
}

export function PremiumProgress({ steps, currentStep, completedSteps = [] }: PremiumProgressProps) {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                completedSteps.includes(index)
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
              whileHover={{ scale: 1.1 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {completedSteps.includes(index) ? '✓' : index + 1}
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                className={`w-16 h-1 mx-2 rounded-full transition-all duration-500 ${
                  completedSteps.includes(index) || index < currentStep
                    ? 'bg-purple-500'
                    : 'bg-gray-200'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              />
            )}
          </div>
        ))}
      </div>
      
      <motion.p
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-gray-600 text-sm"
      >
        {steps[currentStep]}
      </motion.p>
    </div>
  );
}

// 6. Premium Notification System
interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return { notifications, addNotification, removeNotification };
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      case 'warning': return 'bg-yellow-500 text-white';
      case 'info': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`${getNotificationStyle(notification.type)} px-6 py-4 rounded-lg shadow-lg max-w-sm backdrop-blur-md bg-opacity-90`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-xl">{getNotificationIcon(notification.type)}</span>
              <div className="flex-1">
                <h4 className="font-semibold">{notification.title}</h4>
                <p className="text-sm opacity-90">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
